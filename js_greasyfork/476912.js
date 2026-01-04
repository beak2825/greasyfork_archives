// ==UserScript==
// @name         Messenger Official Dark mode
// @namespace    maxhyt.MessengerDarkModeOfficial
// @version      1.2.2
// @license      MIT
// @description  Enable Darkmode by Meta
// @author       Maxhyt
// @match        https://www.messenger.com/*
// @icon         https://icons.duckduckgo.com/ip2/messenger.com.ico
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/476912/Messenger%20Official%20Dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/476912/Messenger%20Official%20Dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .__fb-dark-mode { --header-height: 0px !important; }
    :root { --icon-primary-color: #fff; }`);

    applyDarkMode(document.documentElement);

    const config = { childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    applyDarkMode(node);
                });
            }
        });
    };

    function applyDarkMode(node) {
        if (node instanceof Element) {
            node.classList.replace('__fb-light-mode', '__fb-dark-mode');
            node.classList.replace('x1p6odiv', 'x198g3q0');

            if (node.getAttribute('fill') === 'black') {
                node.removeAttribute('fill');
            }

            if (node.tagName.toLowerCase() === 'svg') {
                if (!node.hasAttribute('fill')) {
                    node.setAttribute('fill', 'currentColor');
                }

                if (node.style.getPropertyValue("--color") === "var(--always-black)") {
                    node.style.setProperty("--color", "var(--primary-icon)");
                }
            }

            if (node.style.getPropertyValue("--chat-incoming-message-bubble-background-color") !== "") {
                node.style.setProperty("--chat-incoming-message-bubble-background-color", "var(--background-deemphasized)");
            }
        }

        node.childNodes.forEach(c => applyDarkMode(c));
    }

    const observer = new MutationObserver(callback);

    observer.observe(document.documentElement, config);

    function onDocumentClassChange(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
                if (mutation.target.classList.contains("__fb-light-mode")) {
                    applyDarkMode(mutation.target);
                }
            }
        });
    }

    const observerDocument = new MutationObserver(onDocumentClassChange);
    observerDocument.observe(document.documentElement, { attributes: true });
})();
