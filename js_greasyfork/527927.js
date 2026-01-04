// ==UserScript==
// @name         Makerworld "Copy Code" Highlighter
// @namespace    http://tampermonkey.net/
// @version      2025-02-24
// @description  This script highlights a gift card by changing its background to light green when you click the "Copy Code" button, helping you easily track which codes you've already copied.
// @author       AU3D
// @match        https://makerworld.com/*/points?type=RedeemHistory
// @icon         https://www.google.com/s2/favicons?sz=64&domain=makerworld.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527927/Makerworld%20%22Copy%20Code%22%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/527927/Makerworld%20%22Copy%20Code%22%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('mw-css-q2z5h0')) {
            var nextElement = event.target.nextElementSibling;
            if (nextElement && nextElement.classList.contains('MuiBox-root') && nextElement.classList.contains('mw-css-0')) {
                var row = event.target.closest('.mw-css-12lckp3');
                if (row) {
                    row.style.backgroundColor = '#eefdec';
                }
            }
        }
    });
})();