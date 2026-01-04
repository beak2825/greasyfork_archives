// ==UserScript==
// @name         FreeCryptoRotator-2
// @namespace    FreeCryptoRotator-2
// @version      2.2
// @description  Script to claim faucets
// @author       sacko
// @match        https://faucetbeast.com/*
// @match        https://get-bitcoin.net/*
// @match        https://claimbits.net/*
// @match        https://getdoge.io/*
// @match        https://cryptowin.io/*
// @match        https://www.cryptowin.io/*
// @match        https://earnbitmoon.club/*
// @match        https://www.minijobwork.com/*
// @match        https://lunarcrush.com/*
// @match        https://betfury.io/*
// @connect      claimbits.net
// @connect      get-bitcoin.net
// @connect      cryptowin.io
// @connect      getdoge.io
// @connect      faucetbeast.com
// @connect      earnbitmoon.club
// @connect      www.minijobwork.com
// @connect      lunarcrush.com
// @connect      betfury.io
// @grant        GM_xmlhttpRequest


// @downloadURL https://update.greasyfork.org/scripts/440391/FreeCryptoRotator-2.user.js
// @updateURL https://update.greasyfork.org/scripts/440391/FreeCryptoRotator-2.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //List of the faucet websites
    //Comment the lines of url if you don't use them
    var websiteData = [

        {url : "https://getdoge.io/faucet.html"},
        {url : "https://get-bitcoin.net/faucet.html"},
        {url : "https://cryptowin.io/faucet"},
        {url : "https://claimbits.net/faucet.html"},
        {url : "https://faucetbeast.com/faucet/free-ethereum", regex: "free-ethereum"},
        {url : "https://faucetbeast.com/faucet/free-dogecoin", regex: "free-dogecoin"},
        {url : "https://earnbitmoon.club/"},
        {url : "https://www.minijobwork.com/earn_free_usd"},
        {url : "https://betfury.io/boxes/all"},
        {url : "https://lunarcrush.com/"},
    ];

    //Message selectors are for success or failure to move on to the next website
    //Add only domain name in website as mentioned below. Follow the same pattern.
    //Use arrays wherever it is required
    var websiteMap = [

        {website : ["get-bitcoin.net","getdoge.io"],
         defaultButtonSelectors: ["#claimFaucet > a"],
         toggleCaptchaSelector:[".modal-dialog .form-control"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: ".btn-rounded.btn-sm.w-30.mb-0",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger", "#main-container h1"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won", "Sucuri Website Firewall"],
         additionalFunctions: getBitcoinDoge},
         
        {website : ["claimbits.net","earnbitmoon.club"],
         defaultButtonSelectors: ["#claimFaucet > button"],
         toggleCaptchaSelector:["#toggleCaptcha"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: "#rollFaucet > button",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 60000},

        {website : "cryptowin.io",
         defaultButtonSelectors: [".btn.btn-block.btn-click.btn-lg"],
         captchaButtonSubmitSelector: ".btn.btn-block.btn-success.btn-lg",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger","script",".text-center"],
         messagesToCheckBeforeMovingToNextUrl: ["claim again in","you won","You reached the maximum"],
         additionalFunctions: cryptowin},

        {website: "faucetbeast.com",
         defaultButtonSelectors: [".btn-get-started.btn-block.mt-0"],
         captchaButtonSubmitSelector: ".btn-get-started.mt-0",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger",".alert.alert-info"],
         messagesToCheckBeforeMovingToNextUrl: ["was sent to your","insufficient","claim again"]},

        {website: "minex.world",
         defaultButtonSelectors: ["#get-bonus"],
         allMessageSelectors: ["#get-bonus"],
         messagesToCheckBeforeMovingToNextUrl: [":"],
         timeoutbeforeMovingToNextUrl: 20000},


        {website: "minijobwork.com",
         defaultButtonSelectors: [".btn.btn-info.reward"],
         captchaButtonSubmitSelector: ".btn.btn-success.btn-sm",
         allMessageSelectors: [".btn.btn-danger"],
         messagesToCheckBeforeMovingToNextUrl: [],
         additionalFunctions : minijobwork,
         timeoutbeforeMovingToNextUrl: 60000},
         
         {website : ["betfury.io"],
         captchaButtonSubmitSelector: ["button.button.button_md.button_red.fullwidth"],
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger",".alert.alert-info", "body", "#timer"],
         messagesToCheckBeforeMovingToNextUrl: ["There might be Server's Fault", "Next Roll Waiting Time"],
         additionalFunctions : betfury,
         timeoutbeforeMovingToNextUrl: 180000},


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
    var clicked = false;

    //Get selector details from the websiteMap
    for (let value of Object.values(websiteMap)) {
        if(window.location.href.includesOneOf(value.website)){
            websiteDataValues.inputTextSelector= value.inputTextSelector;
            websiteDataValues.inputTextSelectorButton = value.inputTextSelectorButton;
            websiteDataValues.defaultButtonSelectors = value.defaultButtonSelectors;
            websiteDataValues.claimButtonSelector = value.claimButtonSelector;
            websiteDataValues.captchaButtonSubmitSelector = value.captchaButtonSubmitSelector;
            websiteDataValues.loginSelectors = value.loginSelectors;
            websiteDataValues.allMessageSelectors = value.allMessageSelectors;
            websiteDataValues.messagesToCheckBeforeMovingToNextUrl = value.messagesToCheckBeforeMovingToNextUrl;
            websiteDataValues.withdrawPageUrl = value.withdrawPageUrl;
            websiteDataValues.withdrawEnabled = value.withdrawEnabled;
            websiteDataValues.balanceSelector = value.balanceSelector;
            websiteDataValues.withdrawMinAmount = value.withdrawMinAmount;
            websiteDataValues.successMessageSelectors = value.successMessageSelectors;
            websiteDataValues.toggleCaptchaSelector = value.toggleCaptchaSelector;
            websiteDataValues.toggleCaptchaSelectorIndex = value.toggleCaptchaSelectorIndex;
            websiteDataValues.timeoutbeforeMovingToNextUrl = value.timeoutbeforeMovingToNextUrl;
            websiteDataValues.additionalFunctions = value.additionalFunctions;
            break;
        }
    }

    //Identify which coin to input, based on the url input
    //If the URL does not contain the coin, then use the default from the domain name
    var count = 0;
    var addressAssigned = false;
    for (let value of Object.values(websiteData)) {
        count = count + 1;
        if(window.location.href.includes("/" + value.regex)){
            addressAssigned = true;
            break;
        }
    }

    //If URL does not have coin, check the default from the domain name
    if(!addressAssigned){
        count = 0;
        for (let value of Object.values(websiteData)) {
            count = count + 1;
            if(value.url.includes(window.location.hostname)){
                break;
            }
        }
    }


    //Get the next Url from the website data map
    async function getNextUrl(){

        //Go to the beginning if the end of the array is reached
        if(count >= websiteData.length){
            count = 0;
            websiteDataValues.nextUrl = websiteData[count].url;
        }else{
            websiteDataValues.nextUrl = websiteData[count].url;
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
        console.log("Going to next Url");
        if(!movingToNextUrl){
            movingToNextUrl = true;
            getNextUrl();
            while (!isNextUrlReachable) {
                await delay(3000);
            }
            window.location.href = websiteDataValues.nextUrl;
        }
    }

    async function goToWithdrawPage() {
        if(!movingToNextUrl){
            movingToNextUrl = true;
            window.location.href = websiteDataValues.withdrawPageUrl;
        }

    }


    //Default Setting: After 120 seconds go to next Url
    var delayBeforeMovingToNextUrl = 120000;
    if(websiteDataValues.timeoutbeforeMovingToNextUrl){
        delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
    }

    setTimeout(function(){
        goToNextUrl();
    },delayBeforeMovingToNextUrl);


    //Returns true if message selectors are present
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

    //Returns true if message selectors are present
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


    function minijobwork(){
        if( document.querySelector("#count") && document.querySelector("#count").style.display != 'none') {
            websiteDataValues.messagesToCheckBeforeMovingToNextUrl = [":"];
        }

    }
    
    function betfury() {

        var withdrawButtonVisible = false;
        for(let i=0; i<document.querySelectorAll(".free-box__button button").length; i++) {
            if(!document.querySelectorAll(".free-box__button button")[i].disabled){
                withdrawButtonVisible = true;
                document.querySelectorAll(".free-box__button button")[i].click();
                break;
            }
        }
        
        if(!withdrawButtonVisible){
            goToNextUrl();
        }

        var interval = setInterval(function(){
            if(clicked){
                clearInterval(interval);
                setTimeout(function(){
                    window.location.reload();

                },5000)
            }
        },5000);

    }
    
    function getRGBFromData(data){
        var hashMap = new Map();
        var maxRGB;
        var maxCount = 0;
        for(let i=0;i <data.length;i=i+4){
            let rgb = data[i].toString() + "," + data[i+1].toString() + "," + data[i+2].toString();
            if(data[i+3] > 127){
                if(hashMap.has(rgb)){
                    hashMap.set(rgb, hashMap.get(rgb)+1)
                    if(maxCount < hashMap.get(rgb)){
                        maxCount = hashMap.get(rgb);
                        maxRGB = [data[i],data[i+1],data[i+2]];
                    }
                }
                else{
                    hashMap.set(rgb, 1)
                }
            }
        }

        return maxRGB;
    }

    function getBitcoinDoge(){

        try{
            var j =0;
            var leastDifference = 10000;
            if(document.querySelector("div.modal-body img") && document.querySelectorAll("button[class='btn btn-lg']").length > 3){

                let image = document.querySelector("div.modal-body img");
                let c = document.createElement("canvas");
                c.width = image.width;
                c.height = image.height;
                var ctx = c.getContext("2d");
                ctx.drawImage(image, 0, 0);
                var imageData = ctx.getImageData(0, 0, c.width, c.height);
                var data = imageData.data;
                var questionRGB = getRGBFromData(data);

                //compare with the answers
                for(let i=0;i< document.querySelectorAll("button[class='btn btn-lg']").length;i++){
                    let canva = document.createElement("canvas");
                    canva.width = image.width;
                    canva.height = image.height;
                    let canvatx = canva.getContext("2d");
                    canvatx.fillStyle = document.querySelectorAll("button[class='btn btn-lg']")[i].style.backgroundColor;
                    canvatx.fillRect(0, 0,canva.width,canva.height);
                    let imageData = canvatx.getImageData(0, 0,canva.width,canva.height);
                    let rgb = getRGBFromData(imageData.data);

                    if(Math.abs(questionRGB[0]-rgb[0]) + Math.abs(questionRGB[1]-rgb[1]) + Math.abs(questionRGB[2]-rgb[2]) < leastDifference){
                        leastDifference = Math.abs(questionRGB[0]-rgb[0]) + Math.abs(questionRGB[1]-rgb[1]) + Math.abs(questionRGB[2]-rgb[2]);
                        j = i;
                    }

                    if(Math.abs(questionRGB[0]-rgb[0])<= 30 && Math.abs(questionRGB[1]-rgb[1]) <= 30 && Math.abs(questionRGB[2]-rgb[2]) <= 30){
                        break;
                    }
                }

                console.log("Closest Matching Colour");
                console.log(document.querySelectorAll("button[class='btn btn-lg']")[j].style.backgroundColor);
                document.querySelectorAll("button[class='btn btn-lg']")[j].click();

                setTimeout(function(){
                    if(document.querySelector("#NXReportButton")){
                        document.querySelector("#NXReportButton").click();
                    }
                    setTimeout(function(){
                        
                        for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
                            if(document.querySelectorAll("iframe")[hc] &&
                                document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response")){
                                return;
                            }
                        }
                        
                        if(document.querySelector(".btn-rounded.btn-sm.w-30.mb-0")){
                            document.querySelector(".btn-rounded.btn-sm.w-30.mb-0").click();
                        }
                        setTimeout(function(){
                            if(messageSelectorsPresent()){
                                goToNextUrl();
                            }
                        },5000);
                    },5000);
                },5000);
            }


        }catch(e){
            //console.log(e);
        }
    }


    function cryptowin(){
        if(document.querySelector("#dropdownList")){
            document.querySelector("#dropdownList").click();
        }
        if(document.querySelector("#claim div.modal-body > div.ad_box center li > a") &&
           document.querySelector("#claim div.modal-body > div.ad_box center li > a").innerText == "hCAPTCHA"){
            document.querySelector("#claim div.modal-body > div.ad_box center li > a").click()
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

        //Look for all the default messages or errors before proceeding to next url
        //For other languages difference in the length of the strings can be compared or visibility of the style element
        if(!movingToNextUrl && messageSelectorsPresent()){
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
        if(!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)){
            document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
            setTimeout(function(){
                if(websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)){
                    document.querySelector(websiteDataValues.inputTextSelectorButton).click();
                }

            },5000);
        }

        //Click the form button after solving captcha
        //Works for both recaptcha and hcaptcha
        
        var captchaInterval = setInterval(function(){
            try{
                if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0){
                    document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
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
                    document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
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


    },7000);



})();