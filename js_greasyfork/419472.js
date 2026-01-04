// ==UserScript==
// @name         Torn: Exchange Christmas Bucks for Glasses of Beer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Focus on Buy Beer Glass Button so Enter selects
// @author       CoriGray [2564765]
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// ==@require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/419472/Torn%3A%20Exchange%20Christmas%20Bucks%20for%20Glasses%20of%20Beer.user.js
// @updateURL https://update.greasyfork.org/scripts/419472/Torn%3A%20Exchange%20Christmas%20Bucks%20for%20Glasses%20of%20Beer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var BuyTimer = setInterval(
        function() {
            if ($('#shopItem816').next().children('button[class*=buy__]').length == 1) {
                $('#shopItem816').next().children('button[class*=buy__]').focus();
            }
        }, 300
    );

})();