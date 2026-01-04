// ==UserScript==
// @name         Feyorra faucet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  claim free feyorra
// @author       vikiweb
// @match        https://malitanyo.website/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=malitanyo.website
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462021/Feyorra%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/462021/Feyorra%20faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let email = "example@example.com"

    setInterval(function() {
        if(document.querySelector("#downloadxxx")){
        if(document.querySelector("#downloadxxx form")){
            if (document.querySelector("#downloadxxx form input[type='email'].sskkaa")) {
                document.querySelector("#downloadxxx form input[type='email'].sskkaa").value = email;
            }

            if (document.querySelector("#downloadxxx form [type='submit']")) {
                document.querySelector("#downloadxxx form [type='submit']").click();
            }
        }
        }else{
            window.location.replace('https://malitanyo.website/faucet.php');
        }
    }, 6000);

})();