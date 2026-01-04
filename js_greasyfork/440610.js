// ==UserScript==
// @name         CryptoSite Redirect To earn
// @namespace    CryptoSite Redirect To earn
// @description  CryptoSite Redirect To earn (auto redirect and earn)
// @version      0.1.6
// @author       Tomek
// @match        https://www.coinpayu.com/*
// @match        https://adbtc.top/*
// @match        https://adbch.top/*
// @match        https://faucetpay.io/*
// @connect      www.coinpayu.com
// @connect      adbtc.top
// @connect      adbch.top
// @connect      faucetpay.io
// @noframes
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/440610/CryptoSite%20Redirect%20To%20earn.user.js
// @updateURL https://update.greasyfork.org/scripts/440610/CryptoSite%20Redirect%20To%20earn.meta.js
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
        {url : "https://www.coinpayu.com/dashboard/ads_surf", login: "", password: ""},
        {url : "https://adbtc.top/index/earn", login: "", password: ""},
        {url : "https://adbch.top/surf/browse", login: "", password: ""},
        {url : "https://faucetpay.io/ptc", login: "", password: ""},
    ];

    var websiteMap = [
        //(start)
        {
            website: "coinpayu.com",
            defaultButtonSelectors: [".btn.btn-primary.btn-large"],
            loginSelectors: ["input[type=email]", "input[type=password]", "body > div:nth-child(1) > div > main > div > button"],
            captchaButtonSubmitSelector: [".btn.btn-default", "input[type=submit]"],
            allMessageSelectors: ["p.flow-text", "#pre > p"],
            additionalFunctions: coinpayu,
            messagesToCheckBeforeMovingToNextUrl: ["You have watched", "Links in surfing are over"],
            timeoutbeforeMovingToNextUrl: 500000
        },
      
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
                      
         
      
        {
            website: "adbch.top",
            defaultButtonSelectors: ["#btstart"],
            loginSelectors: ["#mail", "#password", ".btn-large"],
            captchaButtonSubmitSelector: [".btn.btn-default", ".btn-large"],
            allMessageSelectors: ["h5"],
            additionalFunctions: adbtcTop,
            messagesToCheckBeforeMovingToNextUrl: ["You have looked at all the sites at the moment"]
        },
      {
          //Again ADBTC its important to check again 
            website: "adbtc.top",
            defaultButtonSelectors: [".btn.btn-primary.btn-large"],
            loginSelectors: ["input[type=text]", "input[type=password]", "input[type=submit]"],
            captchaButtonSubmitSelector: [".btn.btn-default", "input[type=submit]"],
            allMessageSelectors: ["p.flow-text", "#pre > p"],
            additionalFunctions: adbtcTop,
            messagesToCheckBeforeMovingToNextUrl: ["You have watched", "Links in surfing are over"]
        },
      

        {
            website: "faucetpay.io",
            defaultButtonSelectors: [".card-body .btn.btn-primary.btn-block"],
            loginSelectors: ["input[type=text]", "input[type=password]", "button[type=submit]"],
            captchaButtonSubmitSelector: [".btn.btn-lg.btn-danger", ".btn.btn-primary.btn-block"],
            allMessageSelectors: [".alert.alert-info"],
            messagesToCheckBeforeMovingToNextUrl: ["There are no ads available"],
            additionalFunctions: faucetpay,
            timeoutbeforeMovingToNextUrl: 380000
        },
 
        ];


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
    
    function faucetpay() {
        
        //Block Pop Ups
        unsafeWindow.open = function(){};

        if(document.querySelector("body").innerText.includes("This ad does not exist or has expired")){
            window.location.href = "https://faucetpay.io/ptc/";
        }

    }
    
    
    function everve() {
        var oldfunction = unsafeWindow.open;
        var windowName = "";

        function newFunction(params1, params2) {

            console.log(params1 + params2);
            if (!params2 || params2 == "_blank") {
                windowName = "EvervepopUpWindow";
            } else {
                windowName = params2;
            }

            return oldfunction(params1, windowName);
        };

        unsafeWindow.open = newFunction;

        unsafeWindow.onbeforeunload = function() {
            unsafeWindow.open('', windowName).close();
        };

        var clicked = false;
        var interval = setInterval(function(){

            if(document.querySelectorAll(".table_row[role=row]").length == 0){
                clearInterval(interval);
                goToNextUrl();
                return;
            }


            if(!clicked){
                for(let i=0; i< document.querySelectorAll(".table_row[role=row]").length;i++){

                    if(document.querySelectorAll(".table_row[role=row]")[i].style.display != "none"){
                        document.querySelectorAll(".table_row[role=row] .btn-group")[i].querySelector("a").click();
                        clicked = true;
                        break;
                    }
                }
            }else{

                if( document.querySelector("#next_button").style.display != "none"){
                    document.querySelector("#next_button > button").click();
                    clicked = false;
                }
            }

        },5000);

    }



    function coinpayu() {


        var oldfunction = unsafeWindow.open;
        var windowName = "";

        function newFunction(params1, params2) {

            console.log(params1 + params2);
            if (!params2 || params2 == "_blank") {
                windowName = "popUpWindow";
            } else {
                windowName = params2;
            }
            if (window.location.href == "https://www.coinpayu.com/dashboard/ads_active") {
                // opts = "height=800,width=800";
            }

            console.log("WindowName is::" + windowName);

            return oldfunction(params1, windowName);
        };

        unsafeWindow.open = newFunction;

        unsafeWindow.onbeforeunload = function() {
            unsafeWindow.open('', windowName).close();
        };




        var viewingAd = false;
        var i = 0;

        setInterval(function() {

            //Check if recaptcha or Hcaptcha is selected

            if (document.querySelector(".form-group.form-code.captcha-type > div span.recaptcha-checked") &&
                (document.querySelector(".form-group.form-code.captcha-type > div span.recaptcha-checked").innerText.includes("Hcaptcha") ||
                 document.querySelector(".form-group.form-code.captcha-type > div span.recaptcha-checked").innerText.includes("GoogleRecaptcha"))) {

            } else {
                //Select either of Hcaptcha or Recaptcha

                for (let i = 0; i < document.querySelectorAll(".form-group.form-code.captcha-type > div span").length; i++) {

                    if (document.querySelectorAll(".form-group.form-code.captcha-type > div span")[i].innerText.includes("Hcaptcha") ||
                        document.querySelectorAll(".form-group.form-code.captcha-type > div span")[i].innerText.includes("GoogleRecaptcha")) {
                        document.querySelectorAll(".form-group.form-code.captcha-type > div span")[i].click();
                        break;
                    }

                }

            }


            let count = document.querySelectorAll("[class='clearfix container-fluid bgwhite'] [title] span").length;

            if (i < count && count > 0 && !viewingAd) {
                viewingAd = true;
                //Click
                document.querySelectorAll("[class='clearfix container-fluid bgwhite'] [title] span")[i].click();
                setTimeout(function() {
                    //Wait for completion
                    var waitForCompletionInterval = setInterval(function() {
                        // ads has already been clicked
                        if (document.querySelector(".alert-div.alert-red") && (document.querySelector(".alert-div.alert-red").innerText.includes("advertisement does not") ||
                                                                               document.querySelector(".alert-div.alert-red").innerText.includes("ads has already been clicked"))) {
                            var tmp = document.querySelector(".alert-div.alert-red").innerHTML;
                            document.querySelector(".alert-div.alert-red").innerHTML = tmp.replaceAll("advertisement does not", "")
                            document.querySelector(".alert-div.alert-red").innerHTML = tmp.replaceAll("ads has already been clicked", "")
                            i = i + 1;
                            unsafeWindow.open('', windowName).close();
                            viewingAd = false;
                            clearInterval(waitForCompletionInterval);
                        }
                        
                        if (document.querySelector("div.warning-ags") &&
                            (document.querySelector("div.warning-ags").innerText.includes("You closed the advertisement too soon") ||
                             document.querySelector("div.warning-ags").innerText.includes("The advertisement is not opened correctly"))){
                            i = i + 1;
                            unsafeWindow.open('', windowName).close();
                            viewingAd = false;
                            clearInterval(waitForCompletionInterval);
                        }

                        if (count != document.querySelectorAll("[class='clearfix container-fluid bgwhite'] [title] span").length) {

                            //Ad viewed
                            //Close the window
                            setTimeout(function() {
                                unsafeWindow.open('', windowName).close();
                                viewingAd = false;
                                clearInterval(waitForCompletionInterval);
                            }, 3000);
                        }
                    }, 5000);
                }, 7000);

            }
            if ((count == 0 || count == i) && !viewingAd) {
                //Go to next page
                i = 0;
                var pageCount = document.querySelectorAll("div.coinpayu-pagination > ul > li").length;
                if (pageCount >= 1 && document.querySelectorAll("div.coinpayu-pagination > ul > li")[pageCount - 1].className == "active") {
                    //Stop or go to next url
                    console.log("Ads End");
                    goToNextUrl();

                } else if (pageCount >= 1) {
                    //go to next page
                    document.querySelectorAll("div.coinpayu-pagination > ul > li")[pageCount - 1].click();
                }

            }

        }, 5000);

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