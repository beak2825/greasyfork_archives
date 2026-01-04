// ==UserScript==
// @name         Alibaba Detect Low Min Order Quantity
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights Alibaba MOQ elements where the minimum order is less than 5. Works even on AJAX page changes.
// @match        *://*.alibaba.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525529/Alibaba%20Detect%20Low%20Min%20Order%20Quantity.user.js
// @updateURL https://update.greasyfork.org/scripts/525529/Alibaba%20Detect%20Low%20Min%20Order%20Quantity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processMOQElements() {
        const moqElements = document.querySelectorAll('[title*="Min. Order:"], div.moq');

        moqElements.forEach(elem => {
            const text = elem.textContent.trim();
            const match = text.match(/Min\. Order:\s*(\d+)/i);

            if (match) {
                const orderNum = parseInt(match[1], 10);
                if (!isNaN(orderNum) && orderNum < 5) {
                    elem.style.backgroundColor = "darkorange";
                    elem.style.color = "white";
                    elem.style.padding = "2px 4px";
                    elem.style.borderRadius = "3px";
                }
            }
        });
    }

    function observePageChanges() {
        const observer = new MutationObserver(processMOQElements);
        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(processMOQElements, 2000);
    }

    function detectPageNavigation() {
        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(history, arguments);
            setTimeout(processMOQElements, 1000);
        };

        const replaceState = history.replaceState;
        history.replaceState = function() {
            replaceState.apply(history, arguments);
            setTimeout(processMOQElements, 1000);
        };

        window.addEventListener('popstate', () => setTimeout(processMOQElements, 1000));
    }

    window.addEventListener('DOMContentLoaded', () => {
        processMOQElements();
        observePageChanges();
        detectPageNavigation();
    });

})();
