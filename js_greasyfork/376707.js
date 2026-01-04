// ==UserScript==
// @name         Munzee Coins
// @version      0.1
// @description  Count the discovered coins
// @author       rabe85
// @match        https://www.munzee.com/m/*/coins/discovered/
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/376707/Munzee%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/376707/Munzee%20Coins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_coins() {

        var cointable = document.getElementsByClassName('table coin-table')[0];
        var coin_discovered_count = 0;
        var coin_type_count = 0;

        var cointypes0 = document.getElementsByTagName('td');
        for(var ct = 0, cointypes; !!(cointypes=cointypes0[ct]); ct++) {
            var cointypes_number = Number(cointypes.innerHTML);
            if(Number.isInteger(cointypes_number)) {
                coin_discovered_count += cointypes_number;
                coin_type_count++;
            }
        }

        var coins_header = document.getElementsByClassName('page-header')[0];
        coins_header.innerHTML = '<h2>Discovered Coins: ' + coin_discovered_count + '&nbsp;&nbsp;&nbsp;<small><i>' + coin_type_count + ' Types</i></small></h2>';

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        munzee_coins();
    } else {
        document.addEventListener("DOMContentLoaded", munzee_coins, false);
    }

})();