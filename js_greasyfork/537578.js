// ==UserScript==
// @name         RedCast
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  UI
// @author       Laïn
// @match        *://*.dreadcast.net/Main
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537578/RedCast.user.js
// @updateURL https://update.greasyfork.org/scripts/537578/RedCast.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hexToRgbObj(hex) {
        let r = 0, g = 0, b = 0;
        let format = '';
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
            format = 'hex3';
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
            format = 'hex6';
        } else {
            return null;
        }
        if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
        return { r, g, b, a: 1, format };
    }

    function rgbStringToRgbObj(rgbStr) {
        const match = rgbStr.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+)\s*)?\)/i);
        if (match) {
            const r = parseInt(match[1], 10);
            const g = parseInt(match[2], 10);
            const b = parseInt(match[3], 10);
            const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
            if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
            return {
                r, g, b, a,
                format: rgbStr.toLowerCase().startsWith('rgba') ? 'rgba' : 'rgb'
            };
        }
        return null;
    }

    function componentToHex(c) {
        const hex = Math.round(c).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    function formatRgbToTargetFormat(r, g, b, a, targetFormat) {
        r = Math.max(0, Math.min(255, Math.round(r)));
        g = Math.max(0, Math.min(255, Math.round(g)));
        b = Math.max(0, Math.min(255, Math.round(b)));
        a = Math.max(0, Math.min(1, a));

        if (targetFormat === 'rgb') {
            return `rgb(${r}, ${g}, ${b})`;
        } else if (targetFormat === 'rgba') {
            const alphaStr = (a === 1 || a === 0) ? a.toString() : a.toFixed(2).replace(/\.?0+$/, '');
            return `rgba(${r}, ${g}, ${b}, ${alphaStr})`;
        } else {
            return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
        }
    }

    function isReddish(r, g, b) {
        const minRedComponent = 60;
        if (r < minRedComponent) return false;
        if (r <= g || r <= b) return false;
        const maxOfGB = Math.max(g, b);
        if (r < maxOfGB * 1.2 && r - maxOfGB < 30) {
             return false;
        }
        return true;
    }

    function darkenReddishColorInString(colorString, darkenFactor = 0.7) {
        let colorData;
        let originalFormat = '';

        if (colorString.startsWith('#')) {
            colorData = hexToRgbObj(colorString);
            if (!colorData) return colorString;
            originalFormat = colorData.format;
        } else if (colorString.toLowerCase().startsWith('rgb')) {
            colorData = rgbStringToRgbObj(colorString);
            if (!colorData) return colorString;
            originalFormat = colorData.format;
        } else {
            return colorString;
        }

        if (isReddish(colorData.r, colorData.g, colorData.b)) {
            const r_new = colorData.r * darkenFactor;
            const g_new = colorData.g * darkenFactor;
            const b_new = colorData.b * darkenFactor;

            let outputFormat = originalFormat;
            if (originalFormat === 'hex3') {
                outputFormat = 'hex6';
            }
            return formatRgbToTargetFormat(r_new, g_new, b_new, colorData.a, outputFormat);
        }
        return colorString;
    }

    const config = {
        imgSrcReplacements: [
            {
                original: "https://www.dreadcast.net/images/fr/design/fond_interface_3_bot.png",
                new: "https://i.imgur.com/c4HfDLH.png"
            },
            {
                original: "https://www.dreadcast.net/images/fr/design/icones/icon_stats.png",
                new: "https://i.imgur.com/beOFRXE.png"
            },
            {
                original: "https://www.dreadcast.net/images/fr/design/fond_interface_icons.png",
                new: "https://i.imgur.com/o1uje5M.png"
            },
            {
                original: "https://www.dreadcast.net/images/fr/design/fond_quete.png",
                new: "https://i.imgur.com/aiGYkuV.png"
            }
        ],
        cssBackgroundReplacements: [
            {
                originalUrlSignature: "images/fr/design/fond_interface_1.png",
                newImageUrl: "https://i.imgur.com/3g0t1S7.png"
            },
            {
                originalUrlSignature: "images/fr/design/fond_interface_3_chat.png",
                newImageUrl: "https://i.imgur.com/b115WVT.png"
            },
            {
                originalUrlSignature: "images/fr/design/fond_interface_3_top.png",
                newImageUrl: "https://i.imgur.com/MiRTcHd.png"
            },
            {
                originalUrlSignature: "images/fr/design/fond_interface_3_bot.png",
                newImageUrl: "https://i.imgur.com/SPcNYgP.png"
            },
            {
                originalUrlSignature: "images/fr/design/travail.png",
                newImageUrl: "https://i.imgur.com/SPcNYgP.png"
            },
            {
                originalUrlSignature: "images/fr/design/icones/icon_stats.png",
                newImageUrl: "https://i.imgur.com/beOFRXE.png"
            },
            {
                originalUrlSignature: "images/fr/design/fond_interface_icons.png",
                newImageUrl: "https://i.imgur.com/o1uje5M.png"
            },
            {
                originalUrlSignature: "images/fr/design/fond_quete.png",
                newImageUrl: "https://i.imgur.com/aiGYkuV.png"
            },
            {
                originalUrlSignature: "images/fr/design/boutons/boutons.png",
                newImageUrl: "https://i.imgur.com/51x5a1f.png"
            }
        ],
        customCssRules: [
            {
                selector: ".grid_head_travail_logement .btn.link.infoAide",
                cssText: "background: #2d2d2d !important; color: #a41b1b !important;"
            },
            {
                selector: "#chat_preview .chatContent, #zone_chat .zone_infos",
                cssText: "color: #d75757 !important;"
            },
            {
                selector: 'span[style*="color:#58DCF9;"] em',
                cssText: "color: #f95858 !important;"
            },
            {
                selector: "#zone_carnet .btnTxt, #zone_carnet .infoAide, #zone_messagerie .btnTxt",
                cssText: "background: #202020 !important; color: #a84747 !important;"
            },
            {
                selector: "#statsInventaire",
                cssText: "background-color: #000000 !important;"
            },
            {
                selector: "#zone_fiche #txt_faim, #zone_fiche #txt_soif",
                cssText: "color: #ea5959 !important;"
            },
            {
                selector: "#zone_fiche #txt_credits",
                cssText: "color: #ff3434 !important;"
            },
            {
                selector: "#chatForm .text_chat",
                cssText: "color: #f5d6d6 !important;"
            },
            {
                selector: ".white",
                cssText: "color: #ffede9 !important;"
            },
            {
                selector: ".btnTxt",
                cssText: "font-weight: 700 !important; text-align: center !important; margin: 6px 0 !important; cursor: pointer !important; background: #2d2c2c !important; border: 1px solid #ac1717 !important; color: #9d3636 !important; padding: 2px 4px !important; box-shadow: 0 0 4px 1px #ac1717 !important; -moz-box-shadow: 0 0 4px 1px #ac1717 !important; -webkit-box-shadow: 0 0 4px 1px #ac1717 !important;"
            },
            {
                selector: "#zone_carnet .infoAide",
                cssText: "color: #983030 !important; border: 1px solid #a60f0f !important; box-shadow: 0 0 5px #b45252 !important;"
            },
            {
                selector: "#zone_fiche .barre_border .fa-caret-right",
                cssText: "color: #db0000 !important; background: #121313 !important;"
            },
            {
                selector: ".case_objet",
                cssText: "border: .04rem solid #b10e0e !important; box-shadow: 0 0 2px 0 #ac0e0e, 0 0 10px 0 #ae1515, 2px 2px 5px -1px #9b0f0f, inset 0 0 3px #ffffff, inset 0 0 5px 0 #b90b0b !important;"
            },
            {
                selector: "#ciseauxInventaire, #poubelleInventaire, #statsInventaire, #stockInventaire",
                cssText: "color: #b91e1e !important; border: 1px solid #9d1111 !important;"
            },
            {
                selector: "#ciseauxInventaire, #poubelleInventaire",
                cssText: "border: 1px solid rgba(255, 0, 0, 0.5) !important;"
            },
            {
                selector: "#zone_fiche .barre_inv",
                cssText: "background: #859d9d !important; border: 1px solid #000000 !important;"
            },
            {
                selector: "#zone_fiche .barre_etat",
                cssText: "background: #d73b3b !important; box-shadow: inset 0 0 2px #484141 !important;"
            },
            {
                selector: "#zone_chat .connectes span:not(.couleur5)",
                cssText: "color: #f95858 !important;"
            },
            {
                selector: "#zone_chat #onglets_chat li.selected",
                cssText: "color: #b13939 !important; background: #2d2d2d !important;"
            },
            {
                selector: "#zone_carnet, #zone_messagerie",
                cssText: "color: #993232 !important;"
            },
            {
                selector: "#zone_fiche #txt_credits em",
                cssText: "font-style: normal !important; color: #993232 !important; z-index: 1 !important; text-align: center !important;"
            },
            {
                selector: ".couleur5",
                cssText: "color: #993232 !important;"
            },
            {
                selector: "#zone_quete",
                cssText: "color: #ec3f3f !important;"
            },
            {
                selector: "#action_list li.selected, #adresse_action_list li.selected, #adresse_folder_list li.selected, #contact_action_list li.selected, #contact_folder_list li.selected, #folder_list li.selected",
                cssText: "background: #974444 !important; color: #000 !important;"
            },
            {
                selector: "#zone_chat .connectes",
                cssText: "color: #cc4141 !important; border-bottom: 1px solid #c84949 !important; margin: 3px 10px 5px !important; overflow: hidden !important; padding-bottom: 5px !important; max-height: 3rem !important;"
            },
            {
                selector: "#zone_chat",
                cssText: "color: #a44646 !important;"
            },
            {
                selector: "#zone_chat #onglets_chat",
                cssText: "width: 87% !important; font-size: inherit !important; overflow: hidden !important; margin: 0 auto !important; border-bottom: 1px solid #bf3939 !important; display: inline-block !important; vertical-align: middle !important;"
            },
            {
                selector: "#chatForm .text_validator",
                cssText: "background: #c84949 !important; color: #6b1010 !important; width: 10% !important; height: 100% !important; position: absolute !important; top: 0 !important; right: 0 !important; border: 1px solid #a43e3e !important; border-width: 0 0 0 1px !important; display: grid !important;"
            },
            {
                selector: "#zone_chat_bg",
                cssText: "width: 100% !important; height: 99% !important; background-size: cover !important; box-shadow: 0 0 15px -5px inset #fca2a2 !important; display: grid !important; grid-template-rows: 32px 86% auto !important; padding: 10px 10px 0 10px !important; box-sizing: border-box !important;"
            },
            {
                selector: "#chatForm .text_mode",
                cssText: "border-left: 1px solid #a02a2a !important; color: #b54141 !important; width: 9% !important; margin-top: 1px !important;"
            },
            {
                selector: "#zone_fiche #action_actuelle",
                cssText: "text-transform: none !important; font-size: 1rem !important; color: #b75050 !important; cursor: default !important; width: 100% !important; padding: 0 0 0 8% !important; box-sizing: border-box !important;"
            },
            {
                selector: "#zone_fiche #txt_pseudo",
                cssText: "grid-area: pseudo !important; color: #c22525 !important; overflow: hidden !important; font-size: min(1rem,14px) !important;"
            },
            {
                selector: "#zone_fiche #txt_niveau",
                cssText: "grid-area: niveau !important; font-size: min(1.4rem,16px) !important; color: #bf3b3b !important;"
            },
            {
                selector: "#zone_fiche #statistiques ul > li",
                cssText: "width: 12% !important; float: left !important; color: #ff5353 !important; text-align: center !important; cursor: default !important; height: 100% !important; position: initial !important; transition: all .2s ease-in-out !important;"
            },
            {
                selector: "#zone_logement, #zone_travail",
                cssText: "color: #d72f2f !important;"
            },
            {
                selector: "#zone_travail p",
                cssText: "color: #ff8585 !important; line-height: 1.2rem !important; clear: both !important; padding: 6px 0 !important;"
            },
            {
                selector: "#ciseauxInventaire.hover, #ciseauxInventaire.selected, #ciseauxInventaire:hover, #poubelleInventaire.hover, #poubelleInventaire.selected, #poubelleInventaire:hover, #statsInventaire.hover, #statsInventaire.selected, #statsInventaire:hover, #stockInventaire.hover, #stockInventaire.selected, #stockInventaire:hover",
                cssText: "color: #fff !important; background: #5c1818 !important; background-position: 0% 0% !important;"
            },
            {
                selector: "#liste_habitations",
                cssText: "display: block !important; padding: 0 4px !important; border: 1px solid #c64d4d !important; cursor: pointer !important; margin: -4px 0 8px 0 !important; z-index: 1 !important;"
            },
            {
                selector: "#chatForm",
                cssText: "position: relative !important; bottom: 5px !important; left: 5% !important; width: 90% !important; padding-left: 5px !important; border: 1px solid #d94e4e !important; height: fit-content !important;"
            },
            {
                selector: "#lieu_actuel .titre1",
                cssText: "font-size: 1rem !important; color: #a42424 !important; text-transform: uppercase !important;"
            },
            {
                selector: ".fakeToolTip",
                cssText: "cursor: default !important; color: #b57f7f !important; font-weight: 400 !important; line-height: 14px !important; font-size: 1rem !important;"
            }
        ],
        customBackgroundLayers: [
            {
                id: "custom-background-layer-main",
                imageUrl: "https://i.imgur.com/Wi208n5.jpeg",
                zIndex: 16
            }
        ]
    };

    const colorRegex = /#([0-9a-fA-F]{3}){1,2}\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d\.]+)?\)/gi;
    config.customCssRules = config.customCssRules.map(rule => {
        const newCssText = rule.cssText.replace(colorRegex, (match) => {
            return darkenReddishColorInString(match, 0.7);
        });
        return { ...rule, cssText: newCssText };
    });


    function applyCustomCssRules() {
        if (!config.customCssRules || config.customCssRules.length === 0) {
            return;
        }
        let cssToInject = "";
        config.customCssRules.forEach(rule => {
            cssToInject += `${rule.selector} { ${rule.cssText} }\n`;
        });

        const head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
            const styleElementId = 'tampermonkey-custom-styles-dreadcast';
            let styleElement = document.getElementById(styleElementId);
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.type = 'text/css';
                styleElement.id = styleElementId;
                head.appendChild(styleElement);
            }
            styleElement.textContent = cssToInject;
        }
    }

    function applyCustomBackgroundLayers() {
        if (!config.customBackgroundLayers || config.customBackgroundLayers.length === 0) {
            return;
        }
        if (!document.body) {
            return;
        }

        config.customBackgroundLayers.forEach(layer => {
            let bgDiv = document.getElementById(layer.id);
            if (!bgDiv) {
                bgDiv = document.createElement('div');
                bgDiv.id = layer.id;
                if (document.body.firstChild) {
                    document.body.insertBefore(bgDiv, document.body.firstChild);
                } else {
                    document.body.appendChild(bgDiv);
                }
            }

            Object.assign(bgDiv.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundImage: `url('${layer.imageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                zIndex: layer.zIndex.toString(),
                pointerEvents: 'none'
            });
        });
    }

    function replaceImgSrc(imgElement) {
        for (const replacement of config.imgSrcReplacements) {
            if (imgElement.src === replacement.original) {
                const marker = "dcImgReplaced";
                if (imgElement.src !== replacement.new && !imgElement.dataset[marker]) {
                    imgElement.src = replacement.new;
                    imgElement.dataset[marker] = "true";
                }
                break;
            }
        }
    }

    function replaceCssBackground(element) {
        if (!element || typeof element.style === 'undefined' || !element.isConnected) return;

        const computedStyle = window.getComputedStyle(element);
        if (!computedStyle) return;
        const currentBackgroundImage = computedStyle.backgroundImage;

        if (currentBackgroundImage && currentBackgroundImage !== 'none') {
            for (const replacement of config.cssBackgroundReplacements) {
                if (currentBackgroundImage.includes(replacement.originalUrlSignature)) {
                    const uniqueMarker = `dcCssReplacedImg${replacement.newImageUrl.replace(/[^a-zA-Z0-9]/g, "")}`;

                    if (element.dataset[uniqueMarker] === "true" && element.style.backgroundImage.includes(replacement.newImageUrl)) {
                        continue;
                    }

                    element.style.setProperty('background-image', `url("${replacement.newImageUrl}")`, 'important');

                    Object.keys(element.dataset).forEach(key => {
                        if (key.startsWith('dcCssReplacedImg')) {
                            delete element.dataset[key];
                        }
                    });
                    element.dataset[uniqueMarker] = "true";
                    break;
                }
            }
        }
    }
    function processSingleElement(element) {
        if (element.nodeType !== Node.ELEMENT_NODE) return;

        if (element.tagName === 'IMG') {
            replaceImgSrc(element);
        }
        replaceCssBackground(element);
    }

    function scanBranchForElements(targetNode) {
        if (targetNode.nodeType !== Node.ELEMENT_NODE) return;
        processSingleElement(targetNode);
        const children = targetNode.querySelectorAll('*');
        children.forEach(child => processSingleElement(child));
    }


    function runAllModifications() {
        applyCustomCssRules();
        applyCustomBackgroundLayers();
        scanBranchForElements(document.documentElement);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            runAllModifications();
        });
    } else {
        runAllModifications();
    }

    const observer = new MutationObserver((mutationsList) => {
        let cssNeedsReapply = false;
        let backgroundLayerNeedsRecheck = false;

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        scanBranchForElements(node);
                    }
                });
                cssNeedsReapply = true;
                if (mutation.target === document.body) {
                    backgroundLayerNeedsRecheck = true;
                }
            } else if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
                 if (mutation.attributeName === 'style' || mutation.attributeName === 'class' || mutation.attributeName === 'src') {
                     Object.keys(mutation.target.dataset).forEach(key => {
                        if (key.startsWith('dcCssReplacedImg') || key === 'dcImgReplaced') {
                            delete mutation.target.dataset[key];
                        }
                    });
                }
                processSingleElement(mutation.target);
                 if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
                    cssNeedsReapply = true;
                }
            }
        }
        if(cssNeedsReapply) {
            applyCustomCssRules();
        }
        if (backgroundLayerNeedsRecheck) {
            applyCustomBackgroundLayers();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'src']
    });

})();