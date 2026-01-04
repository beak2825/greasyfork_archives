// ==UserScript==
// @name         Free Bitcoin via faucetbtcclaim.com autologin
// @namespace    Claim free Bitcoin
// @version      1.6
// @description  Claim free Bitcoin
// @author       vikiweb
// @match        https://faucetbtcclaim.com/*
// @icon         https://www.google.com/s2/favicons?domain=faucetbtcclaim.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457088/Free%20Bitcoin%20via%20faucetbtcclaimcom%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/457088/Free%20Bitcoin%20via%20faucetbtcclaimcom%20autologin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "email";
    var password = "password";

    function isCaptchaChecked() {
        //return grecaptcha && grecaptcha.getResponse().length !== 0;
        return document.querySelector("iframe[src*='https://challenges.cloudflare.com'] + input").value != '';
    }

    if(document.querySelector("body .container .banner-text") && (window.location.href.includes("https://faucetbtcclaim.com/"))) {
        window.location.replace("https://faucetbtcclaim.com/login");
    }

    if(window.location.href.includes("https://faucetbtcclaim.com/login")) {

        setInterval(function() {
            if (document.querySelector("input[name='username']")) {
                document.querySelector("input[name='username']").value = username;
            }
            if (document.querySelector("input[name='password']")) {
                document.querySelector("input[name='password']").value = password;
            }

            if (isCaptchaChecked()) {
                document.querySelector("button.btn.btn-lg[type='submit']").click();
            }
        },6000);
    }

    if(window.location.href.includes("https://faucetbtcclaim.com/account")) {
        window.location.replace("https://faucetbtcclaim.com/faucet");
    }

    if(window.location.href.includes("https://faucetbtcclaim.com/faucet")) {

        let fauceClick = false;

        setTimeout(function() {
            if (document.getElementsByClassName("btn btn-primary btn-lg")[0] && fauceClick === false) {
                document.getElementsByClassName("btn btn-primary btn-lg")[0].click();
                fauceClick = true;
            }
        }, 3000);

        setInterval(function() {
            if(document.querySelector('#refreshbtn')){
                if(!document.querySelector('#refreshbtn').classList.contains('d-none')){
                    document.querySelector("#refreshbtn").click();
                }
            }
            if (isCaptchaChecked()) {
                document.querySelector("button.btn[name='claim']").click();
            }
        }, 3000);

        setTimeout(function() {
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }, 2*60000);
    }

    if(window.location.href.includes("https://faucetbtcclaim.com/surf")) {
        var surflink = document.querySelectorAll(".container .row .col-lg-4 a:not(.visited-link)");

        if(surflink.length >= 1){
            surflink[0].click()
        }

        setTimeout(function(){
            var surfNext = document.querySelectorAll(".container .row .start-btn")
            if(surfNext.length >= 1){
                surfNext[0].click();
            }
        }, 2000);

        var oldfunction = unsafeWindow.open;
        var windowName = "";

        function newFunction(params1, params2) {

            console.log(params1 + params2);
            if (!params2 || params2 == "_blank") {
                windowName = "popUpWindow";
            } else {
                windowName = params2;
            }

            console.log("WindowName is::" + windowName);

            return oldfunction(params1, windowName);
        }

        unsafeWindow.open = newFunction;

        unsafeWindow.onbeforeunload = function() {
            unsafeWindow.open('', windowName).close();
        };

        if( document.querySelector("#timer") ){
            setInterval(function () {
                if (document.querySelector("#timer").innerText.includes("Great!")){
                    console.log('yes')
                    unsafeWindow.open('', windowName).close();
                }else if (document.querySelector("#timer").innerText.includes("Oops!")){
                    console.log('no')
                    unsafeWindow.open('', windowName).close();
                    location.reload();
                }
            }, 1500);
        }
    }
})();