// ==UserScript==
// @name         Free Bitcoin via cryptoclicks.net autologin with PTC support
// @namespace    Claim free Bitcoin
// @version      1.2
// @description  Claim free Bitcoin
// @author       vikiweb
// @match        https://cryptoclicks.net/
// @match        https://cryptoclicks.net/*
// @icon         https://www.google.com/s2/favicons?domain=cryptoclicks.net
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458083/Free%20Bitcoin%20via%20cryptoclicksnet%20autologin%20with%20PTC%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/458083/Free%20Bitcoin%20via%20cryptoclicksnet%20autologin%20with%20PTC%20support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "username/email";////EXAMPLE////
    var password = "password";////EXAMPLE////
    
    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    if(document.querySelector("body div h1") && document.querySelector("body div h1").innerText.includes('Advertise with us') && (window.location.href.includes("https://cryptoclicks.net/"))) {
        window.location.replace("https://cryptoclicks.net/login");
    }


    if(window.location.href.includes("https://cryptoclicks.net/login")){

        setInterval(function() {
            if (document.querySelector("#username")) {
                document.querySelector("#username").value = username;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }
        }, 1000);


        setInterval(function() {

            if (isCaptchaChecked()) {
                if (document.querySelector(".btn.btn-lg.btn-primary[type=submit]")) {
                    document.querySelector(".btn.btn-lg.btn-primary[type=submit]").click();
                }
            }
        }, 6000);
    }


    if(window.location.href.includes("https://cryptoclicks.net/account")) {
        window.location.replace("https://cryptoclicks.net/faucet");
    }

    if(window.location.href.includes("https://cryptoclicks.net/faucet")){

        if (document.querySelector(".btn-primary.btn-lg.aos-init")) {
            document.querySelector(".btn-primary.btn-lg.aos-init").click();
        }

        setInterval(function() {

            if (isCaptchaChecked()) {
                document.querySelector("button[type='submit']").click();
            }
        }, 3000);


        setInterval(function() {
            window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        }, 2*60000);
    }

    if(window.location.href.includes("https://cryptoclicks.net/surf")){
        var surflink = document.querySelectorAll(".container .row .col-md-8 .viewads-ad:not(.visited-link) .viewads-row-title a");

        if(surflink.length >= 1){
            surflink[0].style.backgroundColor = "red";
            surflink[0].click()
            console.log('1')
        }

        setTimeout(function(){
            var surfNext = document.querySelectorAll(".container-fluid .row .start-btn")
            if(surfNext.length >= 1){
                surfNext[0].click();
            }
        }, 3000);

        setInterval(function() {

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