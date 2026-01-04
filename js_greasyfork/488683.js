// ==UserScript==
// @name         DartCounter OnlyCam
// @author       mrdarts180
// @namespace    http://dartcounter.net/
// @version      1.2
// @license      MIT
// @description  Filter games in online lobby by Cam Only matches.
// @match        http*://dartcounter.net/*
// @icon         https://dartcounter.net/favicon-32x32.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/js/all.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/488683/DartCounter%20OnlyCam.user.js
// @updateURL https://update.greasyfork.org/scripts/488683/DartCounter%20OnlyCam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        get showCamOnly() {
            return GM_getValue("ShowCamOnly", 1);
        },

        set showCamOnly(value) {
            GM_setValue("ShowCamOnly", value);
        }
    };

    function setNodeVisible(node, visible) {
        if (visible) {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }
    }

    var observer = new MutationObserver(function(mutations) {

        function isCamNode(node) {
            let icon = node.getElementsByTagName("mat-icon")[0];
            if (icon) {
                let iconName = icon.getAttribute("data-mat-icon-name");
                if (iconName && iconName.toLowerCase() == "videocam-outline") {
                    return true;
                }
            }
            return false;
        }

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeName.toLowerCase() == "app-global-lobby-online-game") {
                    let mainHeader = node.getElementsByClassName("main-header")[0];
                    if (mainHeader) {
                        const svg = document.createElement('svg');
                        Object.assign(svg, {
                            className: "fa-2xs fa-regular fa-eye",
                        });

                        const icon = document.createElement('mat-icon');
                        Object.assign(icon, {
                            className: "mat-icon notranslate header-button-icon mat-icon-no-color",
                            role: "img",
                        });
                        if (!config.showCamOnly) {
                            icon.setAttribute("disabled", "disabled");
                        }
                        icon.append(svg);

                        var button = document.createElement("button");

                        button.addEventListener('click', function onClick(event) {
                            if (!config.showCamOnly) {
                                icon.removeAttribute("disabled");
                                config.showCamOnly = 1;
                            } else {
                                icon.setAttribute("disabled", "disabled");
                                config.showCamOnly = 0;
                            }

                            let nodes = document.getElementsByTagName("app-joinable-online-game");
                            for (const node of nodes) {
                                setNodeVisible(node, !config.showCamOnly || isCamNode(node));
                            }
                        });

                        button.append(icon);
                        mainHeader.lastElementChild.prepend(button);
                    }
                }

                if (node.nodeName.toLowerCase() == "app-joinable-online-game") {
                    setNodeVisible(node, !config.showCamOnly || isCamNode(node));
                }
            }
        }
    });
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

})();