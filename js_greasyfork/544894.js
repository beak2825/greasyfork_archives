// ==UserScript==
// @name         Adobe Fonts Downloader
// @description  Add a download button to download the font for free.
// @icon         https://fonts.adobe.com/favicon.ico
// @version      1.0
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://fonts.adobe.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544894/Adobe%20Fonts%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/544894/Adobe%20Fonts%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var TypeRip = {
        handleCurrentPage: function (button) {
            const url = window.location.href;
            if (url.indexOf("fonts.adobe.com/collections") != -1) {
                this.getFontCollection(url, (status, data) => this.handleResult(status, data, button));
            } else {
                this.getFontFamily(url, (status, data) => this.handleResult(status, data, button));
            }
        },

        handleResult: function (status, data, button) {
            if (status === "success") {
                TypeRip.downloadFonts(data.fonts, data.name, button);
            } else {
                console.error("Error: " + data);
                alert("Error downloading fonts: " + data);
                if (button) {
                    const labelSpan = button.querySelector('.spectrum-Button-label, .add-family-label');
                    if (labelSpan) {
                        labelSpan.textContent = 'Download';
                    }
                    button.disabled = false;
                }
            }
        },

        getFontCollection: function (url_, callback_) {
            const pageContent = document.documentElement.outerHTML;

            let fontCollection = {
                name: "",
                designers: [],
                fonts: [],
            };

            let json_start = pageContent.search('{"fontpack":{"all_valid_slugs":');
            if (json_start == -1) {
                callback_("error", "Font collection data not found");
                return;
            }

            let data = pageContent.substring(json_start);
            let json_end = data.search("</script>");
            if (json_end == -1) {
                callback_("error", "Could not parse collection data");
                return;
            }

            let json;
            try {
                json = JSON.parse(data.substring(0, json_end));
            } catch (e) {
                callback_("error", "Failed to parse collection data");
                return;
            }

            fontCollection.name = json.fontpack.name;
            fontCollection.designers.push({
                name: json.fontpack.contributor_credit,
            });

            for (let i = 0; i < json.fontpack.font_variations.length; i++) {
                fontCollection.fonts.push({
                    url:
                        "https://use.typekit.net/pf/tk/" +
                        json.fontpack.font_variations[i].opaque_id +
                        "/" +
                        json.fontpack.font_variations[i].fvd +
                        "/a?unicode=AAAAAQAAAAEAAAAB&features=ALL&v=3&ec_token=3bb2a6e53c9684ffdc9a9bf71d5b2a620e68abb153386c46ebe547292f11a96176a59ec4f0c7aacfef2663c08018dc100eedf850c284fb72392ba910777487b32ba21c08cc8c33d00bda49e7e2cc90baff01835518dde43e2e8d5ebf7b76545fc2687ab10bc2b0911a141f3cf7f04f3cac438a135f",
                    name: json.fontpack.font_variations[i].full_display_name,
                    style: json.fontpack.font_variations[i].variation_name,
                    familyName: json.fontpack.font_variations[i].family.name,
                });
            }

            callback_("success", fontCollection);
        },

        getFontFamily: function (url_, callback_) {
            const pageContent = document.documentElement.outerHTML;

            let fontFamily = {
                name: "",
                designers: [],
                fonts: [],
            };

            let json_start = pageContent.search('{"family":{"slug":"');
            if (json_start == -1) {
                callback_("error", "Font data not found on this page");
                return;
            }

            let data = pageContent.substring(json_start);
            let json_end = data.search("</script>");
            if (json_end == -1) {
                callback_("error", "Could not parse font data");
                return;
            }

            let json;
            try {
                json = JSON.parse(data.substring(0, json_end));
            } catch (e) {
                callback_("error", "Failed to parse font data");
                return;
            }

            fontFamily.name = json.family.name;
            fontFamily.slug = json.family.slug;

            for (let i = 0; i < json.family.designers.length; i++) {
                fontFamily.designers.push({
                    name: json.family.designers[i].name,
                });
            }

            for (let i = 0; i < json.family.fonts.length; i++) {
                fontFamily.fonts.push({
                    url:
                        "https://use.typekit.net/pf/tk/" +
                        json.family.fonts[i].family.web_id +
                        "/" +
                        json.family.fonts[i].font.web.fvd +
                        "/a?unicode=AAAAAQAAAAEAAAAB&features=ALL&v=3&ec_token=3bb2a6e53c9684ffdc9a9bf71d5b2a620e68abb153386c46ebe547292f11a96176a59ec4f0c7aacfef2663c08018dc100eedf850c284fb72392ba910777487b32ba21c08cc8c33d00bda49e7e2cc90baff01835518dde43e2e8d5ebf7b76545fc2687ab10bc2b0911a141f3cf7f04f3cac438a135f",
                    name: json.family.fonts[i].name,
                    style: json.family.fonts[i].variation_name,
                    familyName: fontFamily.name,
                });
            }

            callback_("success", fontFamily);
        },

        downloadFonts: function (fonts_, zipFileName_, button_) {
            if (!fonts_ || fonts_.length === 0) {
                alert("No fonts found to download");
                return;
            }

            const zip = new JSZip();
            let fontProcessCounter = 0;

            console.log(`Starting download of ${fonts_.length} fonts as OTF...`);

            for (let i = 0; i < fonts_.length; i++) {
                this.downloadFont(fonts_[i], (fontBuffer, fontMeta) => {
                    if (fontBuffer) {
                        zip.file(fontMeta.name + ".otf", fontBuffer);
                        fontProcessCounter++;

                        console.log(`Downloaded ${fontProcessCounter}/${fonts_.length}: ${fontMeta.name}`);

                        if (button_) {
                            const labelSpan = button_.querySelector('.spectrum-Button-label, .add-family-label');
                            if (labelSpan) {
                                labelSpan.textContent = `Processing (${fontProcessCounter}/${fonts_.length})`;
                            }
                        }

                        if (fontProcessCounter === fonts_.length) {
                            zip.generateAsync({ type: "blob" }).then(function (content) {
                                saveAs(content, zipFileName_ + ".zip");
                                console.log("All fonts downloaded successfully as OTF!");

                                if (button_) {
                                    const labelSpan = button_.querySelector('.spectrum-Button-label, .add-family-label');
                                    if (labelSpan) {
                                        labelSpan.textContent = 'Download';
                                    }
                                    button_.disabled = false;
                                }
                            });
                        }
                    } else {
                        console.error("Failed to download font:", fontMeta.name);
                        fontProcessCounter++;
                        if (fontProcessCounter === fonts_.length) {
                            if (button_) {
                                const labelSpan = button_.querySelector('.spectrum-Button-label, .add-family-label');
                                if (labelSpan) {
                                    labelSpan.textContent = 'Download';
                                }
                                button_.disabled = false;
                            }
                        }
                    }
                });
            }
        },

        downloadFont: function (font_, callback_) {
            opentype.load(font_.url, (error, fontData) => {
                if (error) {
                    console.error("Error loading font:", font_.name, error);
                    callback_(null, font_);
                    return;
                }

                try {
                    let rebuiltGlyphs = [];

                    for (let i = 0; i < fontData.glyphs.length; i++) {
                        let glyphData = {};
                        let glyphFields = [
                            "name",
                            "unicode",
                            "unicodes",
                            "path",
                            "index",
                            "advanceWidth",
                            "leftSideBearing",
                        ];

                        glyphFields.forEach((field) => {
                            if (fontData.glyphs.glyphs[i][field] != null) {
                                glyphData[field] = fontData.glyphs.glyphs[i][field];
                            }
                        });

                        if (glyphData.advanceWidth == null || isNaN(glyphData.advanceWidth)) {
                            let newAdvanceWidth = Math.floor(fontData.glyphs.glyphs[i].getBoundingBox().x2);
                            if (newAdvanceWidth == 0) {
                                newAdvanceWidth = fontData.glyphs.glyphs[0].getBoundingBox().x2;
                            }
                            glyphData.advanceWidth = newAdvanceWidth;
                        }

                        let rebuiltGlyph = new opentype.Glyph(glyphData);

                        glyphFields.forEach((field) => {
                            if (glyphData[field] != null && glyphData[field] == 0) {
                                rebuiltGlyph[field] = 0;
                            }
                        });

                        rebuiltGlyphs.push(rebuiltGlyph);
                    }

                    let newFontData = {
                        familyName: font_.familyName,
                        styleName: font_.style,
                        glyphs: rebuiltGlyphs,
                    };

                    let optionalFields = [
                        "defaultWidthX",
                        "nominalWidthX",
                        "unitsPerEm",
                        "ascender",
                        "descender",
                    ];
                    optionalFields.forEach((field) => {
                        if (fontData[field] != null) {
                            newFontData[field] = fontData[field];
                        }
                    });

                    let newFont = new opentype.Font(newFontData);

                    if (newFont.outlinesFormat !== 'cff') {
                        newFont.outlinesFormat = 'cff';
                    }

                    callback_(newFont.toArrayBuffer(), font_);
                } catch (repairError) {
                    console.error("Error repairing font:", font_.name, repairError);
                    fetch(font_.url)
                        .then((response) => response.arrayBuffer())
                        .then((buffer) => callback_(buffer, font_))
                        .catch((fetchError) => {
                            console.error("Fallback download failed:", fetchError);
                            callback_(null, font_);
                        });
                }
            });
        },
    };

    function getFullFontUrl(href) {
        if (!href) return '';
        if (href.startsWith('http')) return href;
        return `https://fonts.adobe.com${href}`;
    }

    function createDownloadButton(originalButton) {
        const newButton = originalButton.cloneNode(true);
        originalButton.parentNode.replaceChild(newButton, originalButton);

        const labelSpan = newButton.querySelector('.spectrum-Button-label, .add-family-label');
        if (labelSpan) {
            labelSpan.textContent = 'Download';
        }

        newButton.removeAttribute('ng-click');
        newButton.removeAttribute('ng-show');

        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            newButton.disabled = true;
            const labelSpan = newButton.querySelector('.spectrum-Button-label, .add-family-label');
            if (labelSpan) {
                labelSpan.textContent = 'Processing...';
            }

            let fontUrl = '';
            const cardLink = newButton.closest('.adobe-fonts-family-card')?.querySelector('.adobe-fonts-family-card--link');
            if (cardLink) {
                fontUrl = getFullFontUrl(cardLink.getAttribute('href'));
            } else {
                fontUrl = window.location.href;
            }

            console.log('Starting direct download for:', fontUrl);
            const currentUrl = window.location.href;

            if (fontUrl !== currentUrl) {
                window.location.href = fontUrl;
                return;
            }

            TypeRip.handleCurrentPage(newButton);
        });

        return newButton;
    }

    function modifyButtons() {
        const buttons = document.querySelectorAll([
            '.adobe-fonts-family__top-actions-add-family button',
            'button[ng-click*="useModelSyncFontpack"]',
            '.collection-show__font-pack-actions-bottom button.add-family-button'
        ].join(','));

        buttons.forEach(button => {
            if (button.hasAttribute('data-modified')) return;
            const newButton = createDownloadButton(button);
            newButton.setAttribute('data-modified', 'true');
        });
    }

    function changeTextToDownload(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.shadowRoot) {
                changeTextToDownload(node.shadowRoot);
            }
            node.childNodes.forEach(child => changeTextToDownload(child));
        }
    }

    function init() {
        modifyButtons();
        changeTextToDownload(document.body);
    }

    init();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const currentUrl = location.href;
            if (window.lastUrl !== currentUrl) {
                window.lastUrl = currentUrl;
                init();
                continue;
            }

            const addedNodes = Array.from(mutation.addedNodes);
            const hasNewButton = addedNodes.some(node =>
                node.querySelector && (
                    node.querySelector('.adobe-fonts-family__top-actions-add-family') ||
                    node.querySelector('button[ng-click*="useModelSyncFontpack"]') ||
                    node.querySelector('.collection-show__font-pack-actions-bottom')
                )
            );
            if (hasNewButton) {
                init();
                break;
            }

            addedNodes.forEach(changeTextToDownload);
        }
    });

    window.lastUrl = location.href;
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();