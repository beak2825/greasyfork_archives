// ==UserScript==
// @name         Instagram GraphQL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to copy the contents of <pre> on the Instagram GraphQL page
// @match        https://www.instagram.com/graphql/query/*
// @grant        GM_setClipboard
// @run-at       document-end
// @author       Aligator
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542753/Instagram%20GraphQL.user.js
// @updateURL https://update.greasyfork.org/scripts/542753/Instagram%20GraphQL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the <pre> element to appear in the DOM
    function waitForPreAndInsertButton() {
        const pre = document.querySelector('pre');
        if (!pre) {
            setTimeout(waitForPreAndInsertButton, 300); // try again after 300ms
            return;
        }

        // Create the button
        const button = document.createElement('button');
        button.textContent = '📋 Copy Content';
        button.style.margin = '15px';
        button.style.fontSize = '20px';
        button.style.cursor = 'pointer';

        // Copy function
        button.addEventListener('click', () => {
            const text = pre.innerText;
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text);
            } else {
                // fallback for browsers without GM_setClipboard
                navigator.clipboard.writeText(text).then(() => {
                    alert('Copied to clipboard!');
                }).catch(err => {
                    alert('Failed to copy: ' + err);
                });
            }
        });

        // Insert the button before <pre>
        pre.parentNode.insertBefore(button, pre);
    }

    waitForPreAndInsertButton();
})();