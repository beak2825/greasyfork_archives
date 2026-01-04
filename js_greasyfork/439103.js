

    // ==UserScript==
    // @name        enum
    // @description n+2
    // @include     https://freebitco.in/*
    // @require https://greasyfork.org/scripts/439102-bibln-2/code/bibln+2.js?version=1012397
    // @version 1.0.1.
    // @license MIT
    // @namespace Kaznacheev
// @downloadURL https://update.greasyfork.org/scripts/439103/enum.user.js
// @updateURL https://update.greasyfork.org/scripts/439103/enum.meta.js
    // ==/UserScript==
     
      $('#double_your_btc_stake').val("0.00000002"*1);
     $('#double_your_btc_payout_multiplier').val("3.02");
     
    $('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event) {
       if ($(event.currentTarget).is(':contains("lose")')) {
    l();
     }
     });
     
     
    $('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event) {
       if ($(event.currentTarget).is(':contains("win")')) {
    w();
     }
     });

