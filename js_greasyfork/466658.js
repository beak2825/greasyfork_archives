// ==UserScript==
// @name         [Neopets] Food Club Bets Counter (Useless Utility Script)
// @namespace    https://greasyfork.org/en/scripts/466658/
// @version      0.1
// @description  Got tired of trying to figure out if I actually made 10 bets. Turns the total betting row to green if there are 10 bets. The power of laziness.
// @author       Piotr Kardovsky
// @match        https://www.neopets.com/pirates/foodclub.phtml?type=current_bets
// @match        https://neopets.com/pirates/foodclub.phtml?type=current_bets
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466658/%5BNeopets%5D%20Food%20Club%20Bets%20Counter%20%28Useless%20Utility%20Script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466658/%5BNeopets%5D%20Food%20Club%20Bets%20Counter%20%28Useless%20Utility%20Script%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tb = document.querySelector('.content table');
    if (tb.rows.length == 13) {
        tb.rows[12].style.backgroundColor = 'MediumSeaGreen';
    }

})();