// ==UserScript==
// @name            zerofaucet.com
// @namespace       http://tampermonkey.net/
// @version         1.0
// @description     Earn unlimited and free Zero Coin
// @author          White
// @license         MIT
// @match           https://zerofaucet.com/*
// @match           https://1ink.cc/*
// @match           https://donaldco.in/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/472741/zerofaucetcom.user.js
// @updateURL https://update.greasyfork.org/scripts/472741/zerofaucetcom.meta.js
// ==/UserScript==


(function() {
    'use strict';

if (window.location.href === 'https://zerofaucet.com/') {

    const targetURL = 'https://zerofaucet.com/?ref=t1bEwwMRFJmkGy7a1VV61Zzaso4sGtguoyV';

    window.location.href = targetURL;
}

   document.querySelector("body > center > form > input.submit")
    Object.assign(document.getElementsByTagName('body')[0].style, { backgroundImage: 'none' });

         var zer= "zero wallet"
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

        if (document.querySelector("body > p:nth-child(3)")) {
            window.open("https://zerofaucet.com","_self");
            document.querySelector("body > center > a > img").click();
    }
}, 60000 );
    setInterval(function() {

        if (document.getElementsByClassName("shadow1")[0]) {
            window.open("https://zerofaucet.com/index.php?refresh=658","_self");
    }
}, 10000 );
    setInterval(function() {

        if (document.querySelector("body > center > font > table > tbody > tr > td:nth-child(3) > center > table:nth-child(1) > tbody > tr > td > a > font")) {
            document.querySelector("body > center > font > table > tbody > tr > td:nth-child(3) > center > table:nth-child(1) > tbody > tr > td > a > font").click();
        }


        if (document.querySelector("body > center > table > tbody > tr > td > center > div1 > img")) {
            document.querySelector("body > center > a > img").click();

        }
    }, 3000);
    setInterval(function() {
        if (document.querySelector("body > center > form > input.submit")) {
            document.querySelector("body > center > form > input.submit").click();
        }

        if (document.getElementById('button1')) {
            document.getElementById('button1').click();
        }

        if (document.getElementsByClassName('skipbutton')[0]) {
            document.getElementsByClassName('skipbutton')[0].click();
        }
    }, 3000);
         setInterval(function() {

        if (document.querySelector("#form_id > input.submit2")) {
            document.querySelector("#form_id > input.submit2").click();
    }
}, 6000 );
})();