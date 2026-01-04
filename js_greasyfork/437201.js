// ==UserScript==
// @name         Neopets - Lab Ray - Safety First
// @namespace    https://greasyfork.org/en/users/798613
// @version      0.1
// @description  Hide specific pets from the lab ray page so no accidental zapping!
// @author       Mandi (mandanarchi)
// @match        http://www.neopets.com/lab2.phtml
// @icon         https://www.google.com/s2/favicons?domain=neopetsclassic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437201/Neopets%20-%20Lab%20Ray%20-%20Safety%20First.user.js
// @updateURL https://update.greasyfork.org/scripts/437201/Neopets%20-%20Lab%20Ray%20-%20Safety%20First.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DO_NOT_ZAP = ['petname1', 'petname2'];


    // this deals with Retail
    window.addEventListener('load', function() {
        $('form[action="process_lab2.phtml"] input').each( function() {
            if ($.inArray( $(this).val(), DO_NOT_ZAP) !== -1 ) {
                $(this).parent().remove();
            }
        });
    });
})();