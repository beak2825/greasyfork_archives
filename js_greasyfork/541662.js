// ==UserScript==
// @name         Drawaria AutoTranslate Chat
// @version      2.0.2
// @description  (I PRIVATED THIS SCRIPT REQUESTED BY PANTHER) Automatically translates all chat messages and player names on Drawaria.online to English. Always active. Now shows detected language in tooltip.
// @namespace    drawaria.auto.translate.all.names
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/541662/Drawaria%20AutoTranslate%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/541662/Drawaria%20AutoTranslate%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper to create DOM elements (simplified from original script)
    const domMake = {
        Tree: function(type, attrs, childrenArrayOrVarArgs) {
            const el = document.createElement(type);
            let children;
            if (Array.isArray(childrenArrayOrVarArgs)) {
                children = childrenArrayOrVarArgs;
            } else {
                children = [];
                for (let i = 2; i < arguments.length; i++) {
                    children.push(arguments[i]);
                }
            }

            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (typeof child === "string") {
                    el.appendChild(document.createTextNode(child));
                } else {
                    if (child) {
                        el.appendChild(child);
                    }
                }
            }
            for (const attr in attrs) {
                if (attr === "className") {
                    el[attr] = attrs[attr];
                } else {
                    el.setAttribute(attr, attrs[attr]);
                }
            }
            return el;
        }
    };

    // Helper to observe DOM changes
    const observeDOM = (function() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        return function(nodeToObserve, callback) {
            if (!nodeToObserve || nodeToObserve.nodeType !== 1) return;

            if (MutationObserver) {
                var mutationObserver = new MutationObserver(callback);
                mutationObserver.observe(nodeToObserve, { childList: true, subtree: false });
                return mutationObserver;
            } else if (window.addEventListener) {
                nodeToObserve.addEventListener("DOMNodeInserted", callback, false);
                nodeToObserve.addEventListener("DOMNodeRemoved", callback, false);
            }
        };
    })();

    // Helper for making XHR GET requests and parsing JSON
    function xhrGetJson(url, callback) {
        const req = new XMLHttpRequest();
        req.onload = (e) => {
            const response = req.response;
            if (!callback) return;
            try {
                callback(JSON.parse(response));
            } catch (error) {
                console.error("AutoTranslate: Error parsing JSON response", error);
            }
        };
        req.onerror = (e) => {
            console.error("AutoTranslate: XHR error", e);
        };
        req.open("GET", url);
        req.send();
    }

    class AutoTranslate {
        constructor() {
            this.init();
        }

        init() {
            // Log to console
            console.log("AutoTranslate (All Messages & Names): enabled");

            // Add a system message to the chatbox
            this.addSystemMessage("AutoTranslate (All Messages & Names): enabled (with language info)");

            const chatboxMessages = document.querySelector("#chatbox_messages");

            if (chatboxMessages) {
                observeDOM(chatboxMessages, (mutations) => {
                    mutations.forEach((record) => {
                        record.addedNodes.forEach((node) => {
                            // Process all chat messages and names, but exclude system messages
                            if (node.nodeType === 1 && !node.classList.contains("systemchatmessage5")) {

                                // --- Translate Message Text ---
                                const messageElement = node.querySelector(".playerchatmessage-text");
                                if (messageElement) {
                                    const textToTranslate = messageElement.textContent;
                                    // Use 'auto' for source language to let Google Translate detect it
                                    this.translate(textToTranslate, "auto", "en", (translation, detectedLang) => {
                                        this.applyTranslationAsTooltip(translation, detectedLang, messageElement);
                                    });
                                }

                                // --- Translate Player Name ---
                                const nameElement = node.querySelector(".playerchatmessage-name");
                                if (nameElement) {
                                    const nameToTranslate = nameElement.textContent;
                                    // Use 'auto' for source language to let Google Translate detect it
                                    this.translate(nameToTranslate, "auto", "en", (translation, detectedLang) => {
                                        this.applyTranslationAsTooltip(translation, detectedLang, nameElement);
                                    });
                                }

                                // --- Translate Player selfName ---
                                const selfnameElement = node.querySelector(".playerchatmessage-selfname");
                                if (selfnameElement) {
                                    const nameToTranslate = selfnameElement.textContent;
                                    // Use 'auto' for source language to let Google Translate detect it
                                    this.translate(nameToTranslate, "auto", "en", (translation, detectedLang) => {
                                        this.applyTranslationAsTooltip(translation, detectedLang, selfnameElement);
                                    });
                                }
                            }
                        });
                    });
                });
            } else {
                console.warn("AutoTranslate (All Messages & Names): Chatbox messages container (#chatbox_messages) not found. Auto-translation may not work.");
            }
        }

        translate(textToTranslate, fromLang = "auto", toLang = "en", callback) {
            const url =
                "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
                fromLang +
                "&tl=" +
                toLang +
                "&dt=t&q=" +
                encodeURI(textToTranslate);

            xhrGetJson(url, (data) => {
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    const translatedText = data[0][0][0];
                    const detectedSourceLanguage = data[2] || 'unknown'; // data[2] contains the detected source language
                    callback(translatedText, detectedSourceLanguage);
                } else {
                    console.warn("AutoTranslate: Could not get translation for:", textToTranslate, data);
                    // Call callback with original text and unknown language if translation fails
                    callback(textToTranslate, 'unknown');
                }
            });
        }

        // Modified to include detected language in the tooltip
        applyTranslationAsTooltip(translatedText, detectedLangCode, targetNode) {
            // Get the full language name from the code, if possible
            const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(detectedLangCode);
            let tooltipText = translatedText;

            // Only append language info if it's not 'en' (since we're translating to English)
            // and if a meaningful language name was detected.
            if (detectedLangCode !== 'en' && detectedLangCode !== 'auto' && langName && langName !== detectedLangCode) {
                tooltipText += ` (${langName})`;
            }

            targetNode.title = tooltipText;
        }

        addSystemMessage(message) {
            const loggingContainer = document.getElementById("chatbox_messages");
            if (loggingContainer) {
                const chatmessage = domMake.Tree(
                    "div",
                    { class: `chatmessage systemchatmessage5`, "data-ts": Date.now(), style: `color: #17a2b8;` }, // Info color
                    [message]
                );
                loggingContainer.appendChild(chatmessage);
                loggingContainer.scrollTop = loggingContainer.scrollHeight; // Scroll to bottom
            }
        }
    }

    // Initialize the auto-translator
    // Small delay to ensure DOM is ready, though document-end should handle most cases.
    setTimeout(() => {
        new AutoTranslate();
    }, 500);

})();