// ==UserScript==
// @name         GC - Food Club
// @namespace    https://greasyfork.org/en/users/798613
// @version      1
// @description  Automatically enters your maximum bet based on account age
// @author       Mandi (mandanarchi), zehra (soupfaerie)
// @match        https://www.grundos.cafe/games/foodclub/bet*
// @icon         https://www.google.com/s2/favicons?domain=grundos.cafe
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/449064/GC%20-%20Food%20Club.user.js
// @updateURL https://update.greasyfork.org/scripts/449064/GC%20-%20Food%20Club.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // toggles fc bets
    let your_bet_amount = $('p:contains("You can only") b').first().text();

    if (your_bet_amount > 0) { $('[name=bet_amount]').val(your_bet_amount); }

        //########## IGNORE BELOW ##########//

  if (item.length == 0) {
        btn.prop('disabled', true);
    }

    $(document).on('change', '[name=wish]', function() {
        let value = $(this).val();
        //console.log(allowed_items.length, $.inArray(value, allowed_items), value);
        if (value.length > 0) {
            if (allowed_items.length > 0 && $.inArray(value, allowed_items) !== -1) {
                btn.prop('disabled', false);
            } else if (allowed_items.length == 0){
                btn.prop('disabled', false);
            } else {
                btn.prop('disabled', true);
            }
        } else {
            btn.prop('disabled', true);
        }
    });
})();