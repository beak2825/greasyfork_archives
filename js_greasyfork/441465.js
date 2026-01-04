// ==UserScript==
// @name            freebitcoin from tiggercoin.com
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     tiggercoin free autoroll faucet
// @author          elmer76
// @match           https://tiggercoin.com/*
// @match           https://cetobeto.com/*
// @match           https://btcfox.info/*
// @match           https://hash512.com/*
// @match           https://farmbtc.info/*
// @match           https://cetobeto.com/*
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/441465/freebitcoin%20from%20tiggercoincom.user.js
// @updateURL https://update.greasyfork.org/scripts/441465/freebitcoin%20from%20tiggercoincom.meta.js
// ==/UserScript==
/*
==================================================================================================================================================                                                                                                                                              |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                     TY and enjoy                                               |
|         Please use my referal link      https://tiggercoin.com/?ref=32wojjAHVAC3rz6sZzLqGNBKJq2MJAaKj4                                         |
==================================================================================================================================================
*/

(function() {
    'use strict';



    setInterval(function() {
        // Click on claim buttons.
        if (document.getElementById('button1')) {
            document.getElementById('button1').click();
        }
        // Click on 1link skip button.
        if (document.getElementsByClassName('skipbutton')[0]) {
            document.getElementsByClassName('skipbutton')[0].click();
        }
    }, 1000);

})();