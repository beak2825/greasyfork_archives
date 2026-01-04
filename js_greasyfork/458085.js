// ==UserScript==
// @name         Free Bitcoin via cointivert.com autologin with PTC support
// @namespace    Claim free Bitcoin
// @version      1.2
// @description  Claim free Bitcoin
// @author       vikiweb
// @match        https://cointivert.com/
// @match        https://cointivert.com/*
// @icon         https://www.google.com/s2/favicons?domain=cointivert.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458085/Free%20Bitcoin%20via%20cointivertcom%20autologin%20with%20PTC%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/458085/Free%20Bitcoin%20via%20cointivertcom%20autologin%20with%20PTC%20support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "username/email";////EXAMPLE////
    var password = "password";////EXAMPLE////

    if(document.querySelector("body main .slider") && (window.location.href.includes("https://cointivert.com/"))) {
        window.location.replace("https://cointivert.com/login");
    }


    if(window.location.href.includes("https://cointivert.com/login")){

        setInterval(function() {
            if (document.querySelector("#username")) {
                document.querySelector("#username").value = username;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }
        }, 1000);


        setInterval(function() {
            if (document.querySelector(".btn-lg")) {
                document.querySelector(".btn-lg").click();
            }
        }, 6000);
    }


    if(window.location.href.includes("https://cointivert.com/account")) {
        window.location.replace("https://cointivert.com/faucet");
    }

    if(window.location.href.includes("https://cointivert.com/faucet")){

        if (document.querySelector(".btn-primary.btn-lg")) {
            document.querySelector(".btn-primary.btn-lg").click();
        }

        setInterval(function() {
            function isCaptchaChecked() {
                return grecaptcha && grecaptcha.getResponse().length !== 0;
            }

            if (isCaptchaChecked()) {
                document.querySelector("button[type='submit']").click();
            }
        }, 3000);


        setInterval(function() {
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }, 2*60000);
    }

    if(window.location.href.includes("https://cointivert.com/surf")){
        var surflink = document.querySelectorAll(".card:not(.visited-link)");

        if(surflink.length >= 1){
            //surflink[0].style.backgroundColor = "red";
            surflink[0].click()
            console.log('1')
        }

        setTimeout(function(){
            var surfNext = document.querySelectorAll(".card-body #box .start-btn")
            if(surfNext.length >= 1){
                surfNext[0].click();
            }
        }, 3000);

        setInterval(function() {

            function isCaptchaChecked() {
                return grecaptcha && grecaptcha.getResponse().length !== 0;
            }

            if (isCaptchaChecked()) {
                document.getElementById("tryCaptcha").click();
            }
        }, 5000);

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
        };

        unsafeWindow.open = newFunction;

        unsafeWindow.onbeforeunload = function() {
            unsafeWindow.open('', windowName).close();
        };

        if( document.querySelector("#timer") ){
            setInterval(function () {
                if (document.querySelector("#timer").innerText.includes("Great")){
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