// ==UserScript==
// @name            Free and unlimited (NO Captcha) Zero Coin script (zerofaucet.com)
// @namespace       http://tampermonkey.net/
// @version         1.9
// @description     Earn unlimited and free Zero Coin on zerofaucet.com using this script.(Part of this code I took from Maksyme, I added login. get bonuses, and go through the level upgrade page. part of the credits goes to him.https://greasyfork.org/en/scripts?locale_override=1&q=zero+faucet)
// @author          JEGMASTER
// @license         MIT
// @match           https://zerofaucet.com
// @match           https://zerofaucet.com/*
// @match           https://1ink.cc/*
// @match           https://donaldco.in/*
// @match           https://zerocoin.online/*
// @match           https://69faucet.online/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/439060/Free%20and%20unlimited%20%28NO%20Captcha%29%20Zero%20Coin%20script%20%28zerofaucetcom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439060/Free%20and%20unlimited%20%28NO%20Captcha%29%20Zero%20Coin%20script%20%28zerofaucetcom%29.meta.js
// ==/UserScript==

/*
==================================================================================================================================================                                                                                                                                              |
| This script requires a ZeroChain wallet, you can create one by following this link: https://zerochain.info/.                                   |
| Finally go on this page: https://zerofaucet.com/?ref=t1avshB344ztnX8id9B7pKtGYA8EyztDN8o and login with your wallet address.                   |
==================================================================================================================================================
*/

(function() {
    'use strict';

    // Remove animated background from website - optional.   document.querySelector("body > center > form > input.submit")
    //Object.assign(document.getElementsByTagName('body')[0].style, { backgroundImage: 'none' });
    //login
         var zer= "t1avshB344ztnX8id9B7pKtGYA8EyztDN8o"/////EXAMPLE/////
         var address = false;
         setInterval(function() {
         if (document.querySelector("body > center > font > form > input[type=text]:nth-child(8)")) {
         	document.getElementsByName("loginwallet")[0].value = zer;
         	address = true;
             if ((address == true)) {
                 document.querySelector("body > center > font > form > input.submit").click();
             }
         }}, 1000);
    setInterval(function() {
        //resolve error 404
        if (document.querySelector("body > p:nth-child(3)")) {
            window.open("https://zerofaucet.com","_self");
            document.querySelector("body > center > a > img").click();
    }
}, 60000 );
    setInterval(function() {
        //sai da pagina de bonus.
        if (document.getElementsByClassName("shadow1")[0]) {
            window.open("https://zerofaucet.com/index.php?refresh=658","_self");
    }
}, 10000 );
    setInterval(function() {
    //Collect bonus
        if (document.querySelector("body > center > font > table > tbody > tr > td:nth-child(3) > center > table:nth-child(1) > tbody > tr > td > a > font")) {
            document.querySelector("body > center > font > table > tbody > tr > td:nth-child(3) > center > table:nth-child(1) > tbody > tr > td > a > font").click();
        }
        /*
        //sai da pagina de bonusdocument.
        if (document.querySelector("body > center > table > tbody > tr > td > center > div1 > img")) {
            document.querySelector("body > center > a > img").click();

        }*/
    }, 3000);
    setInterval(function() {
        if (document.querySelector("body > center > form > input.submit")) {
            document.querySelector("body > center > form > input.submit").click();
        }
        // Click on claim buttons.
        if (document.getElementById('button1')) {
            document.getElementById('button1').click();
        }
        // Click on 1link skip button.
        if (document.getElementsByClassName('skipbutton')[0]) {
            document.getElementsByClassName('skipbutton')[0].click();
        }
    }, 3000);
         setInterval(function() {
        //sai da pagina de bonus.
        if (document.querySelector("#form_id > input.submit2")) {
            document.querySelector("#form_id > input.submit2").click();
    }
}, 6000 );

})();