// ==UserScript==
// @name         Unblur Text for studeersnel.nl
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unblur text
// @author       cvolt
// @license      GPL3
// @match        https://www.studeersnel.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482307/Unblur%20Text%20for%20studeersnelnl.user.js
// @updateURL https://update.greasyfork.org/scripts/482307/Unblur%20Text%20for%20studeersnelnl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove an element by XPath
    function removeElementByXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const element = result.singleNodeValue;
        if (element) {
            element.style.display = 'none';
        }
    }

    // Function to remove elements by a dynamic pattern
    function removeElementsByDynamicPattern() {
        const dynamicXPath = `//*[starts-with(@id, 'pf')]/div[2]`;
        const elements = document.evaluate(dynamicXPath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < elements.snapshotLength; i++) {
            let element = elements.snapshotItem(i);
            if (element) {
                element.style.display = 'none';
            }
        }
    }

    // Function to inject custom style for unblurring text and enabling text selection
    function injectStyle() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .page-content { filter: none !important; }
            * { user-select: text !important; }
        `;
        document.head.appendChild(style);
    }

    // Function to run all actions after the page is fully loaded
    window.onload = function() {
        injectStyle();
        removeElementsByDynamicPattern();
        removeElementByXPath('//*[@id="document-wrapper"]/div[1]/div');

        // Observe for future DOM changes
        observer.observe(document.body, { childList: true, subtree: true });

        // Additional delayed execution if needed
        delayedExecution();
    };
})();