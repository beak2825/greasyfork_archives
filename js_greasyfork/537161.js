// ==UserScript==
// @name         Dreadcast UI Style Replacer
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Replaces specific UI images, applies custom CSS rules, and adds custom backgrounds on Dreadcast.
// @author       YourNameHere
// @match        *://*.dreadcast.net/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537161/Dreadcast%20UI%20Style%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/537161/Dreadcast%20UI%20Style%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        imgSrcReplacements: [
            {
                original: "https://www.dreadcast.net/images/fr/design/fond_interface_3_bot.png",
                new: "https://i.imgur.com/c4HfDLH.png"
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
                cssText: "border: 1px solid #6d2b2b !important; box-shadow: 0 0 4px 1px #8f5c5c !important; -webkit-box-shadow: 0 0 4px 1px #8f5c5c !important;"
            },
            {
                selector: "#zone_carnet .infoAide",
                cssText: "color: #983030 !important; border: 1px solid #a60f0f !important; box-shadow: 0 0 5px #b45252 !important;"
            },
            {
                selector: "#zone_fiche #barre_experience svg, #zone_fiche #barre_forme svg, #zone_fiche #barre_sante svg",
                cssText: "stroke: #c60000 !important; fill: #aa1313 !important;"
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
            }
        ],
        customBackgroundLayers: [
            {
                id: "custom-background-layer-main",
                imageUrl: "https://i.imgur.com/Wi208n5.jpeg",
                zIndex: 16 // Changed z-index to 16
            }
        ],
        debug: false
    };

    function log(message) {
        if (config.debug) {
            console.log("DreadcastReplacer:", message);
        }
    }

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
                log("Created new custom CSS style element.");
            }
            styleElement.textContent = cssToInject;
            log("Applied/Updated custom CSS rules.");
        } else {
            log("Could not find head element to inject custom CSS.");
        }
    }

    function applyCustomBackgroundLayers() {
        if (!config.customBackgroundLayers || config.customBackgroundLayers.length === 0) {
            return;
        }
        if (!document.body) {
            log("Custom Background: Document body not ready.");
            return;
        }

        config.customBackgroundLayers.forEach(layer => {
            let bgDiv = document.getElementById(layer.id);
            if (!bgDiv) {
                bgDiv = document.createElement('div');
                bgDiv.id = layer.id;
                document.body.appendChild(bgDiv);
                log(`Added custom background layer ${layer.id}.`);
            }

            // Ensure styles are always set or updated
            bgDiv.style.position = 'fixed';
            bgDiv.style.top = '0';
            bgDiv.style.left = '0';
            bgDiv.style.width = '100vw';
            bgDiv.style.height = '100vh';
            bgDiv.style.backgroundImage = `url('${layer.imageUrl}')`;
            bgDiv.style.backgroundSize = 'cover';
            bgDiv.style.backgroundPosition = 'center center';
            bgDiv.style.backgroundRepeat = 'no-repeat';
            bgDiv.style.zIndex = layer.zIndex.toString();
            bgDiv.style.pointerEvents = 'none';
        });
    }

    function replaceImgSrc(imgElement) {
        for (const replacement of config.imgSrcReplacements) {
            if (imgElement.src === replacement.original) {
                const marker = "dcImgReplaced";
                if (imgElement.src !== replacement.new && !imgElement.dataset[marker]) {
                    log(`IMG SRC: Found ${replacement.original}, replacing with ${replacement.new}`);
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

                    log(`CSS BG: Element <${element.tagName.toLowerCase()} id="${element.id || ''}" class="${element.className || ''}"> matches "${replacement.originalUrlSignature}". Current BG: "${currentBackgroundImage}". Applying new BG image: ${replacement.newImageUrl}`);
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

    log("Script started.");

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            log("DOMContentLoaded fired. Running all modifications.");
            runAllModifications();
        });
    } else {
        log("Document already loaded. Running all modifications.");
        runAllModifications();
    }

    const observer = new MutationObserver((mutationsList) => {
        log(`MutationObserver callback triggered. Mutations: ${mutationsList.length}`);
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
                // If body's children are modified, our custom bg might be affected
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
            applyCustomBackgroundLayers(); // Re-check/apply custom background
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'src']
    });

    log("Observer active for dynamic content.");

})();