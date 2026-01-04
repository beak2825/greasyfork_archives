// ==UserScript==
// @name         Stock Highlight
// @match        https://www.neopets.com/stockmarket.phtml?type=portfolio
// @description  Pink if over 30% (can change)
// @author       Jay
// @license MIT
 
// @version 0.0.1.20250807045910
// @namespace https://greasyfork.org/users/1502385
// @downloadURL https://update.greasyfork.org/scripts/544893/Stock%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/544893/Stock%20Highlight.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    window.addEventListener('load', function() {
        document.querySelectorAll('font[color="green"] > b > nobr')
            .forEach(nobrElement => {
                const percentage = parseFloat(nobrElement.textContent.trim().replace('%', ''));
                if (percentage > 30) nobrElement.style.color = 'pink';
            });
    });
})();