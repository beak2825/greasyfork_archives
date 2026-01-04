// ==UserScript==
// @name         FAUCET 1 2023
// @namespace    AUTOROTATORFAUCET
// @version      1.0
// @description  Script to claim faucets
// @author       Saputra
// @match        https://claimbits.net/*
// @match        https://earnbitmoon.club/*
// @match        https://earnbitmoon.club*
// @match        https://macrobits.io*
// @match        https://macrobits.io/*
// @match        https://qashbits.com*
// @match        https://claimfreebits.xyz/*
// @connect      claimbits.net
// @connect      earnbitmoon.club
// @connect      macrobits.io
// @connect      qashbits.com
// @connect      claimfreebits.xyz
// @grant        GM_xmlhttpRequest
// @license      MIT

// ==/UserScript==
(function() {
    'use strict';

    const valdelay = 5 ; // Change the number from 5 to 10 or 20 if you have issues like Your action marked Suspicious,Don't try to bypass ,Don't use Speedster, etc
    const valbwall = 5 ; // if you have any other problem apart from bitswall , please leave your feedback
    const RexBp = new RegExp(/^\?([^&]+)/);
    const bp = query => document.querySelector(query);
    const elementExists = query => bp(query) !== null;
    const domainCheck = domains => new RegExp(domains).test(location.host);
    function click(query) {bp(query).click();}
    function submit(query) {bp(query).submit();}
    function clickIfElementExists(query, timeInSec = 1, funcName = 'setTimeout') {if (elementExists(query)) {window[funcName](function() {click(query);}, timeInSec * 1000);}}
    function Captchasub(query, act = 'submit', timeInSec = 0.5) {if (elementExists(query)) {var timer = setInterval(function() {if (window.grecaptcha && !!window.grecaptcha.getResponse?.()) {bp(query)[act](); clearInterval(timer);}}, timeInSec * 1000);}}
    function Captchaklik(query, act = 'click', timeInSec = 1) {if (elementExists(query)) {var timer = setInterval(function() {if (window.grecaptcha && !!window.grecaptcha.getResponse?.()) {bp(query)[act](); clearInterval(timer);}}, timeInSec * 1000);}}
 

    //Block All Pop ups
    unsafeWindow.open = function(){};
 
    //List of the faucet websites
    //Comment the lines of url if you don't use them
    var websiteData = [
 
        {url : "https://claimbits.net/faucet.html"},
        {url : "https://earnbitmoon.club/"},
        {url : "https://macrobits.io/claims.html"},
        {url : "https://qashbits.com/"},
        {url : "https://claimfreebits.xyz/"},
    ];
 
    //Message selectors are for success or failure to move on to the next website
    //Add only domain name in website as mentioned below. Follow the same pattern.
    //Use arrays wherever it is required
    var websiteMap = [
 
       {website : ["claimbits.net","earnbitmoon.club"],
         defaultButtonSelectors: ["#claimFaucet > button"],
         toggleCaptchaSelector:["#toggleCaptcha"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: "#rollFaucet > button",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 140000},

        {website : ["macrobits.io"],
         defaultButtonSelectors: ["#claimFaucet > button"],
         toggleCaptchaSelector:[".form-control.form-control-sm.custom-select.mb-1"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: "#captchaModal div.modal-body > div button",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 140000},

        {website : ["claimfreebits.xyz"],
         toggleCaptchaSelector:[".form-control.form-control-sm.custom-select.mb-1"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: ".btn.btn-danger.btn-md.w-100.mt-2",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won"],
         timeoutbeforeMovingToNextUrl: 140000},

        {website : "qashbits.com",
         defaultButtonSelectors: [".btn.btn-danger.btn-md.w-100.mt-2"],
         captchaButtonSubmitSelector: ".btn.btn-danger.btn-md.w-100.mt-2",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger","script",".text-center"],
         messagesToCheckBeforeMovingToNextUrl: ["claim again in","you won","You reached the maximum"],
         additionalFunctions: qashbit,
         timeoutbeforeMovingToNextUrl: 140000},

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


    //Default Setting: After 180 seconds go to next Url
    var delayBeforeMovingToNextUrl = 180000;
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
 
 
    function qashbit(){
        if(document.querySelector("#dropdownList")){
            document.querySelector("#dropdownList").click();
        }
        if(document.querySelector("#claim div.modal-body > div.ad_box center li > a") &&
           document.querySelector("#claim div.modal-body > div.ad_box center li > a").innerText == "reCAPTCHA"){
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
 
        // Captcha Mode
    // ============================================
    let captchaMode = ['#_mform', '#userForm', '#link-view', '#frmprotect', '#ShortLinkId', '#captcha', '#submit-form', '#lview > form', '#file-captcha', '#btget > form', 'div#login form', 'F1', '#short-captcha-form', '#wpsafelink-landing', '.col-12 > form:nth-child(1)', '.col-md-4 > form:nth-child(1)', '.col-md-6 > form:nth-child(4)', '.contenido > form:nth-child(2)', '#main > div:nth-child(4) > form:nth-child(1)', 'div.col-md-12:nth-child(3) > form:nth-child(1)', '.content > div:nth-child(4) > form:nth-child(1)', '#showMe > center:nth-child(4) > form:nth-child(1)', '.sect > div:nth-child(1) > center:nth-child(7) > form:nth-child(1)', '#showMe > center:nth-child(1) > center:nth-child(4) > form:nth-child(1)', '#adb-not-enabled > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > form:nth-child(1)', 'button#continue.btn.btn-primary.btn-captcha', '.m-2.btn-captcha.btn-outline-primary.btn', '#yuidea-btn-before.yu-btn.yu-blue', '#yuidea-btn-after.yu-blue.yu-btn', '#fauform'];
    for (let i = 0; i < captchaMode.length; i++) {Captchasub(captchaMode[i]);}
    let klikMode = ['button#continue.btn.btn-primary.btn-captcha', '.m-2.btn-captcha.btn-outline-primary.btn', '#yuidea-btn-before.yu-btn.yu-blue', '#yuidea-btn-after.yu-blue.yu-btn', '#submitBtn'];
    for (let i = 0; i < klikMode.length; i++) {Captchaklik(klikMode[i]);}
 
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