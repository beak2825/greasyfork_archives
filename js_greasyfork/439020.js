// ==UserScript==
// @name            Free and unlimited Zero Coin(no captcha) script (freezeroco.in)
// @namespace       http://tampermonkey.net/
// @version         1.4
// @description     Earn unlimited and free ZeroChain on freezeroco.in using this script.
// @author          JEGMASTER
// @license         MIT
// @match           https://freezeroco.in/
// @match           https://freezeroco.in/*
// @match           https://1ink.cc/*
// @match           https://donaldco.in/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/439020/Free%20and%20unlimited%20Zero%20Coin%28no%20captcha%29%20script%20%28freezerocoin%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439020/Free%20and%20unlimited%20Zero%20Coin%28no%20captcha%29%20script%20%28freezerocoin%29.meta.js
// ==/UserScript==

/*
|=======================================================================================================================================================|                                                                                                                                              |
|This script requires a ZeroChain wallet, you can create one by following this link: https://zerochain.info/wallet.  Finally, after editing your        |
|wallet address, in the zer variable, go to this page: https://freezeroco.in/?ref=t1KpBhCbeiQjWhDUfuAoGLNBgv7ReMCCSZM and let the script log in for you.|
|=======================================================================================================================================================|
*/

(function() {
    'use strict';
         //Automatic Login.
         var zer= "t1PWnpfMWjjBzxzmUt28NQqE4Nm8ykHJwWN"/////EXAMPLE/////
         var address = false;
    setInterval(function() {
         if (document.querySelector("body > center > form > input[type=text]:nth-child(10)")) {
         	document.getElementsByName("bitcoinwallet")[0].value = zer;
         	address = true;
             if ((address == true)) {
                 document.querySelector("body > center > form > input.submit").click();
             }
         }}, 1000);
    setInterval(function() {
        //resolve error 404
        if (document.querySelector("body > p:nth-child(3)")) {
            window.open("https://freezeroco.in/","_self");
            document.querySelector("body > center > a > img").click();
    }
}, 60000 );

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

    setInterval(function() {

         if (document.querySelector("#form_id > input.submit2").value=="I'm Not Bot") {
              document.querySelector("#form_id > input.submit2").click();
             }
      }, 3000);


})();