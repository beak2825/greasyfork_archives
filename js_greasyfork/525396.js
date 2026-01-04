// ==UserScript==
// @name         Stock Market Sell Point
// @match        https://www.neopets.com/stockmarket.phtml?type=portfolio
// @version      0.3
// @license      GNU GPLv3
// @description  Changes font to blue if stock price exceeds 250%
// @author       Posterboy
// @namespace    https://youtube.com/@Neo_Posterboy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @downloadURL https://update.greasyfork.org/scripts/525396/Stock%20Market%20Sell%20Point.user.js
// @updateURL https://update.greasyfork.org/scripts/525396/Stock%20Market%20Sell%20Point.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        document.querySelectorAll('font[color="green"] > b > nobr')
            .forEach(nobrElement => {
                const percentage = parseFloat(nobrElement.textContent.trim().replace('%', ''));
                if (percentage > 250) nobrElement.style.color = 'blue';
            });
    });
})();
