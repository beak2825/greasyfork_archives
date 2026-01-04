// ==UserScript==
// @name         Fix ChatGPT iOS 15
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Change all elements with overflow:hidden to overflow:visible
// @author       fuzepod
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518185/Fix%20ChatGPT%20iOS%2015.user.js
// @updateURL https://update.greasyfork.org/scripts/518185/Fix%20ChatGPT%20iOS%2015.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastModifiedCount = 0;
    let checkCount = 0;

    const modifyOverflow = () => {
        let modifiedCount = 0;
        document.querySelectorAll('html *').forEach(function(node) {
            const style = getComputedStyle(node);
            if (style['overflow'] === 'hidden' && node.style['overflow'] !== 'visible') {
                node.style['overflow'] = 'visible';
                modifiedCount++;
            }
        });

        if (modifiedCount === lastModifiedCount) {
            checkCount++;
        } else {
            checkCount = 0; // Reset the counter if new elements were modified
        }

        lastModifiedCount = modifiedCount;

        if (checkCount >= 5) {
            clearInterval(interval);
        }
    };

    const interval = setInterval(modifyOverflow, 1000);
})();
