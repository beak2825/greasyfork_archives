// ==UserScript==
// @name            Four ZeroCoin Faucets All In One Script! Instant Withdraw Please Use My Links.
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Earn Free Zerocoin With Instant Withdraws.
// @author          Elmer76
// @license         MIT
// @match           https://camelbtc.com/*
// @match           https://rimakoko.com/*
// @match           https://tiggercoin.com/*
// @match           https://zerocoin.top/*
// @match           https://zerofaucet.com/*
// @match           https://freezeroco.in/*
// @match           https://1ink.cc/*
// @match           https://donaldco.in/*
// @match           https://myzeroland.com/*
// @match           https://rimakoko.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/461563/Four%20ZeroCoin%20Faucets%20All%20In%20One%20Script%21%20Instant%20Withdraw%20Please%20Use%20My%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/461563/Four%20ZeroCoin%20Faucets%20All%20In%20One%20Script%21%20Instant%20Withdraw%20Please%20Use%20My%20Links.meta.js
// ==/UserScript==

/*


==================================================================================================================================================                                                                                                                                              |
| This script requires a ZeroChain wallet, you can create one by following this link: https://zerochain.info/.                                   |
|         donate please  ZeroWallet : t1TCK32FszhNJCxta5XYGLz6xGBrH1WUpcb                     TY and enjoy                                       |
|         Please use my referal link  50% commission     https://zerofaucet.com/?ref=t1TCK32FszhNJCxta5XYGLz6xGBrH1WUpcb                         |
|                                     50% commission     https://freezeroco.in/?ref=t1TCK32FszhNJCxta5XYGLz6xGBrH1WUpcb                          |
|                                     100% commission    https://zerocoin.top/?ref=t1TCK32FszhNJCxta5XYGLz6xGBrH1WUpcb                           |
|                                     50% commission     https://rimakoko.com/?ref=6800                                                          |  
|                                                                                                                                                |
==================================================================================================================================================
*/

(function() {
    'use strict';

    // Remove animated background from website - optional.
    Object.assign(document.getElementsByTagName('body')[0].style, { backgroundImage: 'none' });

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