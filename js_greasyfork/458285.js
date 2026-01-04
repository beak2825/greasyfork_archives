// ==UserScript==
// @name         Dutchycorp Script Coin roll + PTC Support
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Free Dutchycorp rolls
// @author       vikiweb
// @match        https://autofaucet.dutchycorp.space/*
// @match        https://autofaucet.dutchycorp.space/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dutchycorp.space
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458285/Dutchycorp%20Script%20Coin%20roll%20%2B%20PTC%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/458285/Dutchycorp%20Script%20Coin%20roll%20%2B%20PTC%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "email";////EXAMPLE////
    var password = "password";////EXAMPLE////
    var dutchRoll = false;

    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

    function visibleCheck(elm) {
        if(!elm.offsetHeight && !elm.offsetWidth) { return false; }
        if(getComputedStyle(elm).visibility === 'hidden') { return false; }
        return true;
    }


    if(document.querySelector("body #features") && (window.location.href.includes("https://autofaucet.dutchycorp.space/"))) {
        window.location.replace("https://autofaucet.dutchycorp.space/login.php");
    }

    if(window.location.href.includes("https://autofaucet.dutchycorp.space/login.php")){

        setInterval(function() {
            if (document.querySelector("input[name='username']")) {
                document.querySelector("input[name='username']").value = username;
            }
            if (document.querySelector("input[name='password']")) {
                document.querySelector("input[name='password']").value = password;
            }
        }, 1000);


        setInterval(function() {

            if (isCaptchaChecked()) {
                if (document.querySelector("button[name='login-btn']")) {
                    document.querySelector("button[name='login-btn']").click();
                }
            }
        }, 6000);

    }

    if(window.location.href.includes("https://autofaucet.dutchycorp.space/roll.php")){


        if(!document.querySelector("#timer")){
            setInterval(function(){

                if (isCaptchaChecked()) {
                    if (document.querySelector(".boost-btn.unlockbutton") && dutchRoll === false) {
                        document.querySelector(".boost-btn.unlockbutton").click();
                        dutchRoll = true;
                    }

                    if(visibleCheck(document.querySelector("#claim_boosted"))){
                        document.querySelector("#claim_boosted").click();
                    }
                }
            }, 5000)
        }else{
            setTimeout(function(){
                window.location.replace("https://autofaucet.dutchycorp.space/coin_roll.php")
            },2000)
        }

    }

    if(window.location.href.includes("https://autofaucet.dutchycorp.space/coin_roll.php")){

        if(!document.querySelector("#timer")){
            setInterval(function(){

                if (isCaptchaChecked()) {
                    if (document.querySelector(".boost-btn.unlockbutton") && dutchRoll === false) {
                        document.querySelector(".boost-btn.unlockbutton").click();
                        dutchRoll = true;
                    }

                    if(visibleCheck(document.querySelector("#claim_boosted"))){
                        document.querySelector("#claim_boosted").click();
                    }
                }
            }, 5000)
        }else{
            setTimeout(function(){
                window.location.replace("https://autofaucet.dutchycorp.space/your_balance.php")
            },2000)
        }
    }
    
    if(window.location.href.includes("https://autofaucet.dutchycorp.space/your_balance.php")){
        setTimeout(function(){
            window.location.replace("https://autofaucet.dutchycorp.space/roll.php")
        },60*10000)
    }

    if(window.location.href.includes("https://autofaucet.dutchycorp.space/ptc/wall.php")){
        var wallLink = document.querySelectorAll(".col.s10.m6.l4 a[name='claim']");

        if(wallLink.length >= 1){
            wallLink[0].style.backgroundColor = "red";

            let match = wallLink[0].onmousedown.toString().match(/'href', '(.+)'/);
            let hrefValue = match[1];

            setTimeout(function(){
                window.location.replace("https://autofaucet.dutchycorp.space" + hrefValue)
            },5000)

        }
    }

    if(window.location.href.includes("https://autofaucet.dutchycorp.space/ptc/view.php")){

        console.log('viewing ptc');

        setInterval(function(){
            if(visibleCheck(document.querySelector("#submit_captcha")) && clickCheck === false){
                document.querySelector("button[type='submit'].g-recaptcha").click();
                clickCheck = true;
            }else{
                console.log('not found')
            }
        }, 10000)
    }

    if(window.location.href === "https://autofaucet.dutchycorp.space/ptc/"){

        console.log('viewing ptc');

        setInterval(function(){
            if(visibleCheck(document.querySelector("#submit_captcha")) && clickCheck === false){
                document.querySelector("button[type='submit'].g-recaptcha").click();
                clickCheck = true;
            }else{
                console.log('not found')
            }
        }, 10000)
    }

})();