// ==UserScript==
// @name            Free Zero Coin Autoroll
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Earn Free Zerocoin With Instant Withdraws.
// @author          Elmer76
// @license         MIT
// @match           https://freezeroco.in/
// @match           https://freezeroco.in/*
// @match           https://1ink.cc/*
// @match           https://donaldco.in/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/442375/Free%20Zero%20Coin%20Autoroll.user.js
// @updateURL https://update.greasyfork.org/scripts/442375/Free%20Zero%20Coin%20Autoroll.meta.js
// ==/UserScript==

/*
==================================================================================================================================================                                                                                                                                              |
| This script requires a ZeroChain wallet, you can create one by following this link: https://zerochain.info/.                                   |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                     TY and enjoy                                               |
|         Please use my referal link      https://freezeroco.in/?ref=t1QudZ639fkZGiPQnEhp3zg9zTPa2WHXMVe                                         |
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