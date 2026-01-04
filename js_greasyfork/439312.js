// ==UserScript==
        // @name        stock n-1(b to a)
        // @description a1||a2||...||an=const
        // @include     https://freebitco.in/*
        // @require https://greasyfork.org/scripts/439311-betodds-1-b-to-a/code/betodds-1%20(b%20to%20a).js?version=1013622
        // @version 1.0.3
        // @license MIT
        // @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439312/stock%20n-1%28b%20to%20a%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439312/stock%20n-1%28b%20to%20a%29.meta.js
        // ==/UserScript==
     
    var contribution_rate=prompt("укажите a стека", "2");
    var initial_rate=prompt("укажите b стека", "4950");
    $('#double_your_btc_payout_multiplier').val((initial_rate).toString()+".00");
    $('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
       if ($(event.currentTarget).is(':contains("lose")')) {
         odds(contribution_rate,initial_rate);
       }
     });
    $('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
       if ($(event.currentTarget).is(':contains("win")')) {
         $('#double_your_btc_payout_multiplier').val((initial_rate).toString()+".00");
       }
     });


