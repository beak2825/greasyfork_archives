// ==UserScript==
// @name         PTC 2 2023
// @namespace    Multi WEB PTC
// @version      1.0
// @description  Multi PTC Cryptorotator
// @author       Saputra
// @match        https://faucetoshi.com/*
// @match        https://claimcoin.in/*
// @match        https://claimtrx.com/*
// @connect      faucetoshi.com
// @connect      claimcoin.in
// @connect      claimtrx.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue

// ==/UserScript==
(function() {

    'use strict';
    window.alert = function() {};
    window.confirm = function() {};


    //Do not execute if window is a pop up
    if(window.name){
        return;
    }

    var count = 0;
    var clicked = false;


    //Enter your login and password below, if you like to Autologin. Be careful while providing passwords,
    //else you may get your accounts locked
   var websiteData = [
        {url : "https://faucetoshi.com/ptc", login: "", password: ""},
        {url : "https://claimcoin.in/ptc", login: "", password: ""},
        {url : "https://claimtrx.com/ptc", login: "", password: ""},
    ];

    var websiteMap = [{

            website: "faucetoshi.com",
            defaultButtonSelectors: [".card-body .btn.btn-primary.btn-block.waves-effect"],
            loginSelectors: ["input[type=text]", "input[type=password]", "button[type=submit]"],
            captchaButtonSubmitSelector: ".modal-content .btn.btn-success.btn-block",
            allMessageSelectors: [".alert.alert-warning.text-center"],
            messagesToCheckBeforeMovingToNextUrl: ["There are currently no PTC ads available!"],
            additionalFunctions: grandcryptoauto,
            timeoutbeforeMovingToNextUrl: 60000
        },

        {
            website: "claimtrx.com",
            defaultButtonSelectors: [".card-body .btn.btn-primary.btn-block.w-100"],
            loginSelectors: ["input[type=text]", "input[type=password]", "button[type=submit]"],
            captchaButtonSubmitSelector: [".modal-body .btn.btn-success.btn-block"],
            allMessageSelectors: [".alert.alert-warning.text-center"],
            messagesToCheckBeforeMovingToNextUrl: ["There is PTC Ad left"],
            additionalFunctions: ptcfaucet,
            timeoutbeforeMovingToNextUrl: 60000
        },

	{
            website: ["claimcoin.in"],
            defaultButtonSelectors: [".card .btn.btn-success.btn-block"],
            loginSelectors: ["input[type=text]", "input[type=password]", "button[type=submit]"],
            captchaButtonSubmitSelector: [".btn.btn-success.btn-block"],
            allMessageSelectors: [".alert.alert-warning.text-center"],
            messagesToCheckBeforeMovingToNextUrl: ["There is PTC Ad left"],
            additionalFunctions: mad,
            timeoutbeforeMovingToNextUrl: 60000
        },

        {
            website: ["dogeclick.io"],
            timeoutbeforeMovingToNextUrl: 2000
        },

        ];


    //HtmlEvents dispatcher
    function triggerEvent(el, type) {
        try{
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        }catch(exception){
            console.log(exception);
        }
    }

    function toggleCaptcha(selector, index){
        if( document.querySelector(selector)){
            document.querySelector(selector).selectedIndex = index;
            var targetNode = document.querySelector(selector);
            if (targetNode) {
                setTimeout(function() {
                    triggerEvent(targetNode, 'change');
                }, 5000);
            }
        }
    }

    //Check if a string is present in Array
    String.prototype.includesOneOf = function(arrayOfStrings) {

        //If this is not an Array, compare it as a String
        if (!Array.isArray(arrayOfStrings)) {
            return this.toLowerCase().includes(arrayOfStrings.toLowerCase());
        }

        for (var i = 0; i < arrayOfStrings.length; i++) {
            if (this.toLowerCase().includes(arrayOfStrings[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    var websiteDataValues = {};

    //Get selector details from the websiteMap
    for (let value of Object.values(websiteMap)) {
        if (window.location.href.includesOneOf(value.website)) {
            websiteDataValues.inputTextSelector = value.inputTextSelector;
            websiteDataValues.inputTextSelectorButton = value.inputTextSelectorButton;
            websiteDataValues.defaultButtonSelectors = value.defaultButtonSelectors;
            websiteDataValues.claimButtonSelector = value.claimButtonSelector;
            websiteDataValues.captchaButtonSubmitSelector = value.captchaButtonSubmitSelector;
            websiteDataValues.loginSelectors = value.loginSelectors;
            websiteDataValues.loginCaptcha = value.loginCaptcha;
            websiteDataValues.allMessageSelectors = value.allMessageSelectors;
            websiteDataValues.messagesToCheckBeforeMovingToNextUrl = value.messagesToCheckBeforeMovingToNextUrl;
            websiteDataValues.withdrawPageUrl = value.withdrawPageUrl;
            websiteDataValues.withdrawEnabled = value.withdrawEnabled;
            websiteDataValues.balanceSelector = value.balanceSelector;
            websiteDataValues.withdrawMinAmount = value.withdrawMinAmount;
            websiteDataValues.successMessageSelectors = value.successMessageSelectors;
            websiteDataValues.toggleCaptchaSelector = value.toggleCaptchaSelector;
            websiteDataValues.toggleCaptchaSelectorIndex = value.toggleCaptchaSelectorIndex;
            websiteDataValues.additionalFunctions = value.additionalFunctions;
            websiteDataValues.timeoutbeforeMovingToNextUrl = value.timeoutbeforeMovingToNextUrl;
            break;
        }
    }


    var login = "";
    var password = "";

    for (let value of Object.values(websiteData)) {
        count = count + 1;
        if (value.url.includes(window.location.hostname)) {
            websiteDataValues.url = value.url;
            login = value.login;
            password = value.password;
            break;
        }
    }


    //Get the next Url from the website data map
    async function getNextUrl() {

        //Go to the beginning if the end of the array is reached
        if (count >= websiteData.length) {
            websiteDataValues.nextUrl = websiteData[0].url;
        } else {
            websiteDataValues.nextUrl = websiteData[count].url;
        }

        //Use case for overrding next Url
        if (websiteDataValues.overrideNextUrl) {
            websiteDataValues.nextUrl = websiteDataValues.overrideNextUrl;
        }

        //Ping Test to check if a website is up before proceeding to next url
        pingTest(websiteDataValues.nextUrl);
    }

    var isNextUrlReachable = false;
    //Get the next Url from the website
    function pingTest(websiteUrl) {
        console.log(websiteUrl);
        GM_xmlhttpRequest({
            method: "GET",
            url: websiteUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 5000,
            onload: function(response) {
                //Website is reachable
                isNextUrlReachable = true;
            },
            onerror: function(e) {
                count = count + 1;
                getNextUrl();
            },
            ontimeout: function() {
                count = count + 1;
                getNextUrl();
            },
        });

    }


    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    var movingToNextUrl = false;
    async function goToNextUrl() {
        if (!movingToNextUrl) {
            movingToNextUrl = true;
            getNextUrl();
            while (!isNextUrlReachable) {
                await delay(3000);
            }
            window.location.href = websiteDataValues.nextUrl;
        }
    }


    //Default Setting: After 1000 seconds go to next Url
    var delayBeforeMovingToNextUrl = 1000000;
    if (websiteDataValues.timeoutbeforeMovingToNextUrl) {
        delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
    }

    setTimeout(function() {
        goToNextUrl();
    }, delayBeforeMovingToNextUrl);


    //Wait for 5 seconds if it's in dashboard,
    if ((!window.location.href.includes("coinpayu")) && (window.location.href.includes("dashboard") || window.location.href.includes("page/user-admin"))) {
        setTimeout(function() {
            if (websiteDataValues.url) {
                window.location.href = websiteDataValues.url;
            }
        }, 5000);
    }


    //Returns true if message selectors are present
    function messageSelectorsPresent() {
        if (websiteDataValues.allMessageSelectors) {
            for (var j = 0; j < websiteDataValues.allMessageSelectors.length; j++) {
                for (var k = 0; k < document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length; k++) {
                    if (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
                        (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl) ||
                         (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
                          document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function closeRepeatingAds() {

        //Check if previous Ad is Same as Current Ad and Skip the Ad
        if (unsafeWindow.viewurl) {
            if (GM_getValue("adUrl") && GM_getValue("adUrl") == unsafeWindow.viewurl) {
                //Skip the Ad
                document.querySelector(".card > a").click();
                movingToNextUrl = true;
            } else {
                GM_setValue("adUrl", unsafeWindow.viewurl);
            }

        }

    }



    function grandcryptoauto() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://faucetoshi.com/ptc/";
        }

    }

    function ptcfaucet() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://ptcfaucet.xyz/ptc/";
        }

    }

    function metabitz() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://metabitz.net/ptc/";
        }

    }

    function dinntoks() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://dinntoks.com/ptc/";
        }

    }

    function paidsatoshi() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://https://paidsatoshi.com/surfads.php/";
        }

    }

    function adbtc() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://adbtc.io/surf/";
        }

    }

    function trxking() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://trxking.xyz/ptc/";
        }

    }

    function speedcoins() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://auto.speedcoins.xyz/ptc/";
        }

    }

    function mad() {

        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = ["https://madoge.fun/ptc/","https://madtrx.fun/ptc/","https://madfey.fun/ptc/","https://madshiba.fun/ptc/","https://bitsfree.net/ptc/","https://free.shiba.limited/ptc/","https://madltc.fun/ptc/"];
        }

    }


    var stopSolvingCaptcha = false;

    function checkLoginSelectors() {

        if (websiteDataValues.loginSelectors) {
            //Check if all login selectors are present
            let count = 0;
            for (let i = 0; i < websiteDataValues.loginSelectors.length; i++) {
                if (document.querySelector(websiteDataValues.loginSelectors[i])) {
                    count++;
                }

            }

            if (count == websiteDataValues.loginSelectors.length) {

                if (login.length > 0 && password.length > 0) {
                    //Input Login
                    document.querySelector(websiteDataValues.loginSelectors[0]).value = login;

                    //Input Password
                    document.querySelector(websiteDataValues.loginSelectors[1]).value = password;
                } else {
                    stopSolvingCaptcha = true;
                }

            } else {
                stopSolvingCaptcha = true;
            }

        } else {
            stopSolvingCaptcha = true;
        }

    }


    setTimeout(function() {

        checkLoginSelectors();

        if (websiteDataValues.additionalFunctions) {
            websiteDataValues.additionalFunctions();
        }

        //Look for all the default messages or errors before proceeding to next url
        //For other languages difference in the length of the strings can be compared or visibility of the style element
        if (!movingToNextUrl && messageSelectorsPresent()) {
            goToNextUrl();
        }


        //Check for all the default button selectors and click
        //This will only click the first selector found, so mention the selectors with parent element wherever required
        if(!movingToNextUrl && websiteDataValues.defaultButtonSelectors){
            for(var i=0;i<websiteDataValues.defaultButtonSelectors.length ;i++){
                if(document.querySelector(websiteDataValues.defaultButtonSelectors[i])){
                    triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mousedown');
                    triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mouseup');
                    document.querySelector(websiteDataValues.defaultButtonSelectors[i]).click();
                    break;
                }
            }
        }

        if(!movingToNextUrl && websiteDataValues.toggleCaptchaSelector && Number.isInteger(websiteDataValues.toggleCaptchaSelectorIndex)){
            toggleCaptcha(websiteDataValues.toggleCaptchaSelector,websiteDataValues.toggleCaptchaSelectorIndex);
        }

        //Input the address and click the login button
        if (!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)) {
            document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
            setTimeout(function() {
                if (websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)) {
                    document.querySelector(websiteDataValues.inputTextSelectorButton).click();
                }

            }, 5000);
        }

        //Click the form button after solving captcha
        //Works for both recaptcha and hcaptcha
        var clicked = false;
        var captchaInterval = setInterval(function() {
            if (!stopSolvingCaptcha || !window.location.href.includes("login")) {
                try {
                    if (!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {
                        for (let i = 0; i < websiteDataValues.captchaButtonSubmitSelector.length; i++) {
                            if (document.querySelector(websiteDataValues.captchaButtonSubmitSelector[i])) {
                                document.querySelector(websiteDataValues.captchaButtonSubmitSelector[i]).click();
                            }
                        }
                        clicked = true;

                        clearInterval(captchaInterval);
                        setTimeout(function() {
                            if (messageSelectorsPresent()) {
                                goToNextUrl();
                            }
                        }, 5000);
                    }
                } catch (e) {

                }

                for (var hc = 0; hc < document.querySelectorAll("iframe").length; hc++) {
                    if (!clicked && document.querySelectorAll("iframe")[hc] &&
                        document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response") &&
                        document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0) {
                        for (let i = 0; i < websiteDataValues.captchaButtonSubmitSelector.length; i++) {
                            if (document.querySelector(websiteDataValues.captchaButtonSubmitSelector[i])) {
                                document.querySelector(websiteDataValues.captchaButtonSubmitSelector[i]).click();
                            }
                        }
                        clicked = true;
                        clearInterval(captchaInterval);
                        setTimeout(function() {
                            if (messageSelectorsPresent()) {
                                goToNextUrl();
                            }
                        }, 5000);
                    }
                }
            }

        }, 5000);


    }, 5000);


    window.onbeforeunload = function() {
        if (unsafeWindow.myWindow) {
            unsafeWindow.myWindow.close();
        }
        if (unsafeWindow.coinwin) {
            var tmp = unsafeWindow.coinwin;
            unsafeWindow.coinwin = {};
            tmp.close();
        }

    };

})();