// ==UserScript==
// @name         Free Bitcoin via faucetron.com autologin
// @namespace    Claim free Bitcoin
// @version      1.8
// @description  Claim free Bitcoin
// @author       vikiweb
// @match        https://faucetron.com/*
// @match        https://faucetron.com/
// @icon         https://www.google.com/s2/favicons?domain=faucetron.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459725/Free%20Bitcoin%20via%20faucetroncom%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/459725/Free%20Bitcoin%20via%20faucetroncom%20autologin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "username";////EXAMPLE////
    var password = "password";////EXAMPLE////


    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    if(document.querySelector("body section.sliderHome") && (window.location.href.includes("https://faucetron.com/"))) {
        window.location.replace("https://faucetron.com/login");
    }

    if(window.location.href.includes("https://faucetron.com/login")){

        setInterval(function() {
            if (document.querySelector("#username")) {
                document.querySelector("#username").value = username;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }

            if (document.querySelector("button[type='submit']")) {
                document.querySelector("button[type='submit']").click();
            }

        }, 6000);

    }

    if(window.location.href.includes("https://faucetron.com/account")) {
        window.location.replace("https://faucetron.com/faucet");
    }

    if(window.location.href.includes("https://faucetron.com/faucet")){

        let fauceClick = false;

        if (document.querySelector("button[data-bs-target='#claimModal']")  && fauceClick === false) {
            document.querySelector("button[data-bs-target='#claimModal']").click();
            fauceClick = true;
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

    if(window.location.href.includes("https://faucetron.com/surf")){
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