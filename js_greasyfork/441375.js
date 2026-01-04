// ==UserScript==
// @name         Adbtc.top collector and claim satoshi(BTC)
// @namespace    collector and claim satoshi(BTC)
// @description  Collect and earn satoshi( btc ) via Adbtc.top , best site to earn 
// @version      1.33
// @author       Tomekmahrooq
// @match        https://adbtc.top/*
// @connect      adbtc.top
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/441375/Adbtctop%20collector%20and%20claim%20satoshi%28BTC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441375/Adbtctop%20collector%20and%20claim%20satoshi%28BTC%29.meta.js
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

   var websiteData = [
        
        {url : "https://adbtc.top/index/earn", login: "", password: ""},
     
        
    ];

    var websiteMap = [
        //first site (start)
       
      
        //2
        {
            website: "adbtc.top",
            defaultButtonSelectors: [".btn.btn-primary.btn-large"],
            loginSelectors: ["input[type=text]", "input[type=password]", "input[type=submit]"],
            captchaButtonSubmitSelector: [".btn.btn-default", "input[type=submit]"],
            allMessageSelectors: ["p.flow-text", "#pre > p"],
            additionalFunctions: adbtcTop,
            messagesToCheckBeforeMovingToNextUrl: ["You have watched", "Links in surfing are over"]
        },
                      
         
      
     
     



        ];

    String.prototype.includesOneOf = function(arrayOfStrings) {

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
            timeout: 6000,
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
                await delay(4000);
            }
            window.location.href = websiteDataValues.nextUrl;
        }
    }


    //Default Setting: After 180 seconds go to next Url
    var delayBeforeMovingToNextUrl = 180000;
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
        }, 7000);
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


    function adbtcTop() {

        // For adbtc, special use case
        if (document.querySelector(".collection-item.hoverable") && document.querySelector(".collection-item.hoverable").innerText.includes("Sign in")) {
            document.querySelector(".collection-item.hoverable").click();
        }

        
        for(let j=0; j<document.querySelectorAll(".dropdown-content.select-dropdown").length; j++){
            for(let i=0; i<document.querySelectorAll(".dropdown-content.select-dropdown")[j].getElementsByTagName("li").length; i++){
                if( document.querySelectorAll(".dropdown-content.select-dropdown")[j].getElementsByTagName("li")[i].innerText.includes("hCaptcha") &&
                   !(document.querySelectorAll(".dropdown-content.select-dropdown")[j].getElementsByTagName("li")[i].getAttribute("class") &&
                     document.querySelectorAll(".dropdown-content.select-dropdown")[j].getElementsByTagName("li")[i].getAttribute("class").includes("selected"))){
                    document.querySelectorAll(".dropdown-content.select-dropdown")[j].getElementsByTagName("li")[i].click();
                    break;
                }
            }
        }

        if (document.querySelector("div.col.s4> a") && !document.querySelector("div.col.s4> a").className.includes("hide")) {
            document.querySelector("div.col.s4> a").click();
        }

        if (window.location.href == "https://adbtc.top/index/" || window.location.href == "https://adbtc.top/index") {
            window.location.href = "https://adbtc.top/index/earn";
        }

        if (window.location.href == "https://adbtc.top/index/earn" || window.location.href == "https://adbtc.top/index/earn/") {
            window.location.href = document.querySelectorAll(".collection.menu.colmen.nomarg > a")[0].href;
        }

        //Use case for adbtc
        if (window.location.href.includes("adbtc.top/surf/browse")) {
            websiteDataValues.overrideNextUrl = document.querySelectorAll(".collection.menu.colmen.nomarg > a")[1].href;
        }

        setInterval(function() {
            //Skip the Ad if the Ad closes on it's own for adbtc due to Adblocker or the script itself
            if (document.querySelector("#nenado") && !document.querySelector("#nenado").className.includes("hide") &&
                document.querySelector("#nenado").innerText.includes("You closed page")) {
                document.querySelector("#nenado > a").click();
            }
        }, 10000);

    }
    
    



    var stopSolvingCaptcha = false;

    function checkLoginSelectors() {

        if (websiteDataValues.loginSelectors) {
      
            let count = 0;
            for (let i = 0; i < websiteDataValues.loginSelectors.length; i++) {
                if (document.querySelector(websiteDataValues.loginSelectors[i])) {
                    count++;
                }

            }

            if (count == websiteDataValues.loginSelectors.length) {

                if (login.length > 0 && password.length > 0) {
                   
                    document.querySelector(websiteDataValues.loginSelectors[0]).value = login;

                    
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

         if (!movingToNextUrl && messageSelectorsPresent()) {
            goToNextUrl();
        }


        if (!movingToNextUrl && websiteDataValues.defaultButtonSelectors) {
            for (var i = 0; i < websiteDataValues.defaultButtonSelectors.length; i++) {
                if (document.querySelector(websiteDataValues.defaultButtonSelectors[i])) {
                    document.querySelector(websiteDataValues.defaultButtonSelectors[i]).click();
                    break;
                }
            }
        }

        //Input the address and click the login button
        if (!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)) {
            document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
            setTimeout(function() {
                if (websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)) {
                    document.querySelector(websiteDataValues.inputTextSelectorButton).click();
                }

            }, 7000);
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
                        }, 9000);
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
                        }, 9000);
                    }
                }
            }

        }, 9000);


    }, 9000);


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