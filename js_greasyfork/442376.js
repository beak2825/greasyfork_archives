// ==UserScript==
// @name            Get zerocoin free autoroller instant withdraw!
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Earn Zerocoin with instant withdraws.
// @author          Elmer76
// @license         MIT
// @match           https://zerofaucet.com
// @match           https://zerofaucet.com/*
// @match           https://1ink.cc/*
// @match           https://donaldco.in/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/442376/Get%20zerocoin%20free%20autoroller%20instant%20withdraw%21.user.js
// @updateURL https://update.greasyfork.org/scripts/442376/Get%20zerocoin%20free%20autoroller%20instant%20withdraw%21.meta.js
// ==/UserScript==

/*
==================================================================================================================================================                                                                                                                                              |
| This script requires a ZeroChain wallet, you can create one by following this link: https://zerochain.info/.                                   |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                     TY and enjoy                                               |
|         Please use my referal link      https://zerofaucet.com/?ref=t1QudZ639fkZGiPQnEhp3zg9zTPa2WHXMVe                                        |
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