// ==UserScript==
// @name         HC Free Coin Faucet Rotator 2
// @namespace    Earn Free Coin
// @version      14.0
// @description  Earn free Coin
// @author       lotocamion
// @match        //https://bigbtc.win/*
// @match        //https://crypto-faucets.xyz/*
// @match        http://doge.techearthnow.com/*
// @match        http://trx.techearthnow.com/*
// @match        http://bnb.techearthnow.com/*
// @match        http://ltc.techearthnow.com/*
// @match        https://faucet.today/*
// @connect      ltc.techearthnow.com
// @connect      faucet.today
// @connect      doge.techearthnow.com
// @connect      trx.techearthnow.com
// @connect      bnb.techearthnow.com
// @connect      crypto-faucets.xyz
// @connect      bigbtc.win
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/442299/HC%20Free%20Coin%20Faucet%20Rotator%202.user.js
// @updateURL https://update.greasyfork.org/scripts/442299/HC%20Free%20Coin%20Faucet%20Rotator%202.meta.js
// ==/UserScript==


unsafeWindow.open = function(){};

(function() {
    'use strict';




     //EDIT YOUR ADDRESS BELOW//

     var btc ="3ByNUkC85NS4ftbKgHa7WYGnE67CTRCkJY"//EXAMPLE
     var dgb="DGkAWy5tjNqPFKN47dKFtE9c48f88SnwWU";//EXAMPLE
     var tron = "TYP6EUykVRbPLL6xMiprURJ5aZMF213L3T"//EXAMPLE
     var doge = "DJRVVPrCrYJn8WdZ67sbiJJ3AwG9tm4PrL"//EXAMPLE
     var bnb = "0x8d09b04147d5c4fb5184cbbe96349998ff32bc4b"//EXAMPLE
     var dash = "XnD7JrNoSFYp3BMSFMgf4JqMBuC4NR12qV"//EXAMPLE

     var autoWithdraw = true;//SET TO true; autowithdraw and set false; manual withdraw//FOR "bigbtc.win" //


     var websiteData = [


         {url : "https://bigbtc.win/?id=45510466", address: btc, regex: "bigbtc1"},
         {url : "https://crypto-faucets.xyz/dgb/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "dgb", address: dgb},
         {url : "http://doge.techearthnow.com/?r=DJRVVPrCrYJn8WdZ67sbiJJ3AwG9tm4PrL", address: doge},
         {url : "http://trx.techearthnow.com/?r=TYP6EUykVRbPLL6xMiprURJ5aZMF213L3T", address: tron},
         {url : "http://bnb.techearthnow.com/?r=0x8d09b04147d5c4fb5184cbbe96349998ff32bc4b", address: bnb},
         {url : "https://faucet.today/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", address: doge},
         {url : "http://ltc.techearthnow.com/?r=XnD7JrNoSFYp3BMSFMgf4JqMBuC4NR12qV", address: dash},


    ];



    var websiteMap = [{website : ["crypto-faucets.xyz",],
                       inputTextSelector:[ "#wpbf_address",],
                       captchaButtonSubmitSelector: "#wpbf-claim-form",
                       allMessageSelectors: [".alert.alert-success",".alert.alert-danger",".alert.alert-info", "h1"],
                       messagesToCheckBeforeMovingToNextUrl: ["Recharg", "You have to wait","was sent","sufficient","successfully","wrong","system","network", "Sorry"],
                       formSubmit: true},

                      {website : ["bigbtc.win"], inputTextSelector: "#login > input",
                       inputTextSelectorButton: "#login > input.button",
                       captchaButtonSubmitSelector: "input.button",
                       allMessageSelectors: [".alert.alert-success","#content  p",".alert.alert-error"],
                       withdrawMinAmount: 250, balanceSelector: "#account > b",
                       withdrawPageUrl: "withdraw", withdrawEnabled: autoWithdraw,
                       messagesToCheckBeforeMovingToNextUrl: ["You won","You can claim again","Not enough funds","Your payment of"]},


                      {website : ["ltc.techearthnow.com","doge.techearthnow.com","trx.techearthnow.com","bnb.techearthnow.com","faucet.today"],
                       inputTextSelector: [".form-control"],
                       captchaButtonSubmitSelector: [".claim-button[value='Get reward!']",".claim-button[value='1']",".claim-button[value='Get Reward!']"],
                       allMessageSelectors: [".swal-modal",".col-12.alert.bg-danger.py-5.text-center",".swal-text",".swal-icon--success__line.swal-icon--success__line--long",".alert.alert-success",".alert.alert-danger",".alert.alert-secondary",".alert.alert-primary",".alert.alert-info","You have to wait","h1"],
                       messagesToCheckBeforeMovingToNextUrl: ["IP Address","You were locked","was sent to you","You have to wait","sufficient","does not have","alert alert-primary","alert alert-secondary","You've reached the daily claim limit of this faucet","Please come back in 24 hours","successfully","wrong","system","network", "Sorry"]},



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
                    },8000);
                    }
                    }
                    },8000);
                    },8000);



})();