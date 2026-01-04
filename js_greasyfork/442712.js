// ==UserScript==
// @name         Hcaptcha Hourly Instant Free Coin Rotator
// @namespace    Free Coin Hourly
// @version      4.0
// @description  Free Coin Hourly
// @author       lotocamion
// @match        https://dogefaucet.cryptobaggiver.com/*
// @match        https://ethereumfaucet.cryptobaggiver.com/*
// @match        https://bitcoincashfaucet.cryptobaggiver.com/*
// @match        https://digibytefaucet.cryptobaggiver.com/*
// @match        https://litecoinfaucet.cryptobaggiver.com/*
// @match        https://dashfaucet.cryptobaggiver.com/*
// @match        https://fast-bonus.online/*
// @match        fast-bonus.online
// @connect      cryptobaggiver.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/442712/Hcaptcha%20Hourly%20Instant%20Free%20Coin%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/442712/Hcaptcha%20Hourly%20Instant%20Free%20Coin%20Rotator.meta.js
// ==/UserScript==


     unsafeWindow.open = function(){};
    (function() {
    'use strict';

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                 //
    //                                                                                                 //
    //    ENTER YOUR FAUCETPAY ADDRESS BELOW AND SAVE IT IN A NOTEPAD IN CASE THERE IS AN UPDATE       //
    //                                                                                                 //
    //                                                                                                 //
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    var btc ="ENTER_YOUR_FAUCETPAY_BITCOIN_ADDRESS";
    var bnb ="ENTER_YOUR_FAUCETPAY_BINANCE_ADDRESS";
    var bitcoincash ="ENTER_YOUR_FAUCETPAY_BITCOINCASH_ADDRESS";
    var dash ="ENTER_YOUR_FAUCETPAY_DASH_ADDRESS";
    var doge ="ENTER_YOUR_FAUCETPAY_DOGECOIN_ADDRESS";
    var dgb= "ENTER_YOUR_FAUCETPAY_DIGIBYTE_ADDRESS";
    var eth ="ENTER_YOUR_FAUCETPAY_ETHEREUM_ADDRESS";
    var fey ="ENTER_YOUR_FAUCETPAY_FEYORRA_ADDRESS";
    var ltc ="ENTER_YOUR_FAUCETPAY_LITECOIN_ADDRESS";
    var sol ="ENTER_YOUR_FAUCETPAY_SOLANA_ADDRESS";
    var tron ="ENTER_YOUR_FAUCETPAY_TRON_ADDRESS";
    var tether="ENTER_YOUR_FAUCETPAY_TETHER_ADDRESS";
    var zcash ="ENTER_YOUR_FAUCETPAY_ZCASH_ADDRESS";
 

    // Set to true; Autowithdraw
    // Set to false; Manual withdraw
    var autoWithdraw = true;


    bitcoincash = bitcoincash.replaceAll("bitcoincash:","");


    var websiteData = [
        {url : "https://ethereumfaucet.cryptobaggiver.com/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", address: eth},
        {url : "https://dashfaucet.cryptobaggiver.com/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", address: dash},
        {url : "https://dogefaucet.cryptobaggiver.com/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", address: doge},
        {url : "https://bitcoincashfaucet.cryptobaggiver.com/?r=qrxywy4efsz25qech8t995kd67xahyga9qecvmlr24", address: bitcoincash},
        {url : "https://digibytefaucet.cryptobaggiver.com/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", address: dgb},
        {url : "https://litecoinfaucet.cryptobaggiver.com/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", address: ltc},
        {url : "https://fast-bonus.online/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", address: btc},


    ];


    var websiteMap = [

                        {website : ["cryptobaggiver.com"],
                        inputTextSelector: "#wpbf_address",
                        captchaButtonSubmitSelector: "#wpbf-claim-form",
                        allMessageSelectors: [".alert.alert-success",".alert.alert-danger",".alert.alert-info", "h1"],
                        messagesToCheckBeforeMovingToNextUrl: ["Recharg", "You have to wait","was sent","sufficient","successfully","wrong","system","network", "Sorry"],
                        formSubmit: true

                        },
                        {website : ["fast-bonus.online"], inputTextSelector: ".form-control",
                        captchaButtonSubmitSelector: ".claim-button[value='Get reward!']",
                        allMessageSelectors: [".alert.alert-success",".alert.alert-danger",".alert.alert-info"],
                        messagesToCheckBeforeMovingToNextUrl: ["was sent to you","You have to wait","sufficient","does not have"],
                       },
                     ];

            function triggerEvent(el, type) {
            try{
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
            }catch(exception){
            console.log(exception);
           }
           }


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


       for (let value of Object.values(websiteMap)) {
        if(window.location.href.includesOneOf(value.website)){
            websiteDataValues.inputTextSelector= value.inputTextSelector;
            websiteDataValues.inputTextSelectorButton = value.inputTextSelectorButton;
            websiteDataValues.defaultButtonSelectors = value.defaultButtonSelectors;
            websiteDataValues.claimButtonSelector = value.claimButtonSelector;
            websiteDataValues.captchaButtonSubmitSelector = value.captchaButtonSubmitSelector;
            websiteDataValues.allMessageSelectors = value.allMessageSelectors;
            websiteDataValues.messagesToCheckBeforeMovingToNextUrl = value.messagesToCheckBeforeMovingToNextUrl;
            websiteDataValues.withdrawPageUrl = value.withdrawPageUrl;
            websiteDataValues.withdrawEnabled = value.withdrawEnabled;
            websiteDataValues.balanceSelector = value.balanceSelector;
            websiteDataValues.withdrawMinAmount = value.withdrawMinAmount;
            websiteDataValues.successMessageSelectors = value.successMessageSelectors;
            websiteDataValues.additionalFunctions = value.additionalFunctions;
            websiteDataValues.timeoutbeforeMovingToNextUrl = value.timeoutbeforeMovingToNextUrl;
            websiteDataValues.formSubmit = value.formSubmit;
            break;
            }
            }


           var count = 0;
           var addressAssigned = false;
           for (let value of Object.values(websiteData)){
           count = count + 1;
          if(value.url.includes(window.location.hostname) && (window.location.href.includes("/" + value.coin + "/") ||
                                                            window.location.href.includes("/" + value.coin + "-") ||
                                                            window.location.href.endsWith("/" + value.coin))){
            websiteDataValues.address = value.address;
            addressAssigned = true;
            break;
            }
            }


            if(!addressAssigned){
            count = 0;
            for (let value of Object.values(websiteData)) {
            count = count + 1;

            if(value.url.includes(window.location.hostname)){
                if(value.regex){
                    if(GM_getValue("UrlRegex")){
                        if(GM_getValue("UrlRegex") == value.regex){
                            websiteDataValues.address = value.address;
                            break;
                        }
                    }else{
                        GM_setValue("UrlRegex",value.regex);
                        websiteDataValues.address = value.address;
                        break;
                    }

                }else{
                    websiteDataValues.address = value.address;
                    break;
               }
               }
               }
               }



        async function getNextUrl(){

        if(count >= websiteData.length){
            count = 0;
        }

        websiteDataValues.nextUrl = websiteData[count].url;
        websiteDataValues.regex = websiteData[count].regex;


        pingTest(websiteDataValues.nextUrl);
    }

    var isNextUrlReachable = false;

    function pingTest(websiteUrl) {
        console.log(websiteUrl);
        GM_xmlhttpRequest({
            method: "GET",
            url: websiteUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 8000,
            onload: function(response) {

                if(response && response.status == 200){
                    isNextUrlReachable = true;
                }else{
                    count=count+1;
                    getNextUrl();
                }
            },
            onerror: function(e) {
                count=count+1;
                getNextUrl();
            },
            ontimeout: function() {
                count=count+1;
                getNextUrl();
            },
        });

    }


    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    var movingToNextUrl = false;
    async function goToNextUrl() {
        if(!movingToNextUrl){
            movingToNextUrl = true;
            getNextUrl();
            while (!isNextUrlReachable) {
                await delay(3000);
            }

            if( websiteDataValues.regex){
                GM_setValue("UrlRegex", websiteDataValues.regex);
            }
            window.location.href = websiteDataValues.nextUrl;
            movingToNextUrl = true;
        }
    }

    async function goToWithdrawPage() {
        if(!movingToNextUrl){
            movingToNextUrl = true;
            window.location.href = websiteDataValues.withdrawPageUrl;
        }

    }



    var delayBeforeMovingToNextUrl = 180000;
    if(websiteDataValues.timeoutbeforeMovingToNextUrl){
        delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
    }

    setTimeout(function(){
        movingToNextUrl = false;
        goToNextUrl();
    },delayBeforeMovingToNextUrl);



    if (window.location.href.includes("to=FaucetPay") || websiteDataValues.address.length < 5 || websiteDataValues.address.includes("YOUR_")){
        goToNextUrl();
    }


    function messageSelectorsPresent(){
        if(websiteDataValues.allMessageSelectors){
            for(var j=0;j<websiteDataValues.allMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl) ||
                        (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
                         document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)))){
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function checkMessageSelectorsLength(){
        if(websiteDataValues.allMessageSelectors){
            for(var j=0;j<websiteDataValues.allMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.length > 0) ||
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
                        document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.length > 0)){
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function successMessageSelectorsPresent(){
        if(websiteDataValues.successMessageSelectors){
            for(var j=0;j<websiteDataValues.successMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.successMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k] && document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)){
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function freePerfectMoneyCaptcha(){
        if(document.querySelector("#captcha") && document.querySelector("#user_input")){
            document.querySelector("#user_input").value = document.querySelector("#captcha").value ;
        }

    }

    function faucetTop() {


        if(!movingToNextUrl && checkMessageSelectorsLength()){
            goToNextUrl();
        }

        if(websiteDataValues.address == bitcoincash && !bitcoincash.includes("bitcoincash")){
            websiteDataValues.address = "bitcoincash:" + bitcoincash;
        }


        if(document.querySelectorAll(websiteDataValues.inputTextSelectorButton).length >=2 ){
            movingToNextUrl = true;
            return;
        }



        if(document.querySelector(".h-captcha")) {
            movingToNextUrl = true;
            return;
        }

        for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
            if(document.querySelectorAll("iframe")[hc] &&
               document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response")) {

                movingToNextUrl = true;
            }
        }
    }


    function bagikeran(){

        if(!window.location.href.includes("index.php")){
            for(let i=0;i<document.querySelectorAll(".alert.alert-danger").length;i++){
                if(document.querySelectorAll(".alert.alert-danger")[i].innerText.toLowerCase().includes("login not")){
                    window.location.href = "index.php"
                    movingToNextUrl = true;
                    break;
                }
            }
        }
    }


    setTimeout(function(){

        if( websiteDataValues.additionalFunctions){
            websiteDataValues.additionalFunctions();
        }

        if(websiteDataValues.withdrawEnabled){
            if(websiteDataValues.balanceSelector && document.querySelector(websiteDataValues.balanceSelector)){
                var currentBalance = document.querySelector(websiteDataValues.balanceSelector).innerText;
                if(currentBalance > websiteDataValues.withdrawMinAmount && !window.location.href.includes(websiteDataValues.withdrawPageUrl)) {
                    goToWithdrawPage();
                }

            }else{
                if(successMessageSelectorsPresent()){
                    goToWithdrawPage();
                }
            }
        }


        if(!movingToNextUrl && messageSelectorsPresent()){
            goToNextUrl();
        }

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


        if(!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)){
            document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
            setTimeout(function(){
                if(websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)){
                    document.querySelector(websiteDataValues.inputTextSelectorButton).click();
                }

                },5000);
                }


                     var clicked = false;
                     var captchaInterval = setInterval(function(){
                     try{
                    if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0){
                    if(websiteDataValues.formSubmit){
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).submit();
                    }else{
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
                    }
                    clicked = true;

                    clearInterval(captchaInterval);
                    setTimeout(function(){
                        if(messageSelectorsPresent()){
                            goToNextUrl();
                        }
                    },5000);
                }
            }catch(e){

            }

                 for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
                if(! clicked && document.querySelectorAll("iframe")[hc] &&
                   document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response") &&
                   document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0) {
                   if(websiteDataValues.formSubmit){
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).submit();
                    }else{
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
                    }
                    clicked = true;
                    clearInterval(captchaInterval);
                    setTimeout(function(){
                        if(messageSelectorsPresent()){
                            goToNextUrl();
                         }
                         },5000);
                         }
                         }
                         },5000);
                         },5000);



})();