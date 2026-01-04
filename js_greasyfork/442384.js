// ==UserScript==
// @name            Free coins from Bitgames.io
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     free autoroll faucet
// @author          elmer76
// @license         MIT
// @match           https://faucet.bitgames.io/*
// @match           https://www.bitgames.io/*
// @icon            https://www.google.com/s2/favicons?domain=bitgames.io
// @connect         faucet.bitgames.io
// @connect         www.bitgames.io
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/442384/Free%20coins%20from%20Bitgamesio.user.js
// @updateURL https://update.greasyfork.org/scripts/442384/Free%20coins%20from%20Bitgamesio.meta.js
// ==/UserScript==
/*
==================================================================================================================================================                                                                                                                                              |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                     TY and enjoy                                               |
|         Please use my referal link      https://www.bitgames.io/?affid=12352291                                                                |
==================================================================================================================================================
*/

(function() {
    'use strict';

       var clicked = false;
       var websiteData = [{url : "https://www.bitgames.io/offerwalls/faucet/", regex: "faucet"},{url : "https://www.bitgames.io/offerwalls/"},];
       var websiteMap = [{website: ["bitgames.io"],additionalFunctions: bitgames,allMessageSelectors: ["div.title"],messagesToCheckBeforeMovingToNextUrl: ["You can mine in"],timeoutbeforeMovingToNextUrl: 270000},];

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
       document.querySelector(selector).selectedIndex = index;
       var targetNode = document.querySelector(selector);
       if (targetNode) {
       setTimeout(function() {
       triggerEvent(targetNode, 'change');
       }, 5000);
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
            websiteDataValues.successMessageSelectors = value.successMessageSelectors;
            websiteDataValues.toggleCaptchaSelector = value.toggleCaptchaSelector;
            websiteDataValues.toggleCaptchaSelectorIndex = value.toggleCaptchaSelectorIndex;
            websiteDataValues.timeoutbeforeMovingToNextUrl = value.timeoutbeforeMovingToNextUrl;
            websiteDataValues.additionalFunctions = value.additionalFunctions;
            break;
            }
            }

            var count = 0;
            var addressAssigned = false;
            for (let value of Object.values(websiteData)) {
            count = count + 1;
            if(value.url.includes(window.location.hostname) && window.location.href.includes("/" + value.regex)){
            addressAssigned = true;
            break;
            }
            }

        if(!addressAssigned){
        count = 0;
        for (let value of Object.values(websiteData)) {
            count = count + 1;
            if(value.url.includes(window.location.hostname) && !value.regex){
            addressAssigned = true;
                break;
            }
            }
            }

         async function getNextUrl(){
            if(count >= websiteData.length){
            count = 0;
            websiteDataValues.nextUrl = websiteData[count].url;
            }else{
            websiteDataValues.nextUrl = websiteData[count].url;
            }
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
            timeout: 5000,
            onload: function(response) {

                console.log("reachable");
                isNextUrlReachable = true;
                },
                onerror: function(e) {
                console.log("error");
                count=count+1;
                getNextUrl();
                },
                ontimeout: function() {
                console.log("timeout");
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
                if((window && window.self == top) || (unsafeWindow && unsafeWindow.self == top)){
                console.log("Going to next Url");
                if(!movingToNextUrl){
                movingToNextUrl = true;
                getNextUrl();
                while (!isNextUrlReachable) {
                    await delay(3000);
                }
                console.log("Done");
                window.location.href = websiteDataValues.nextUrl;
                }
                }
                }

    async function goToWithdrawPage() {
           if(!movingToNextUrl){
            movingToNextUrl = true;
            window.location.href = websiteDataValues.withdrawPageUrl;
           }
           }

    var delayBeforeMovingToNextUrl = 120000;
    if(websiteDataValues.timeoutbeforeMovingToNextUrl){
        delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
    }

    setTimeout(function(){
        goToNextUrl();
    },delayBeforeMovingToNextUrl);

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

    function bitgames(){
        var clicked = false;
        var formSubmitted = false;
        var modalFormClicked = false;

        if(document.querySelector(".level-easy.enabled") && document.querySelector(".level-easy.enabled").innerText.includes("HCaptcha")){
            document.querySelector(".level-easy.enabled").click();
            }

        if(document.querySelector("div.--hcaptcha-insticator-center > div > form > center:nth-child(3) > div > div > p")){
            var ranquestion = document.querySelector("div.--hcaptcha-insticator-center > div > form > center:nth-child(3) > div > div > p").innerText;
            ranquestion= ranquestion.replace("What is ","");
            ranquestion= ranquestion.split("+");
            document.querySelector("#humanverify").value = Number(ranquestion[0].trim()) + Number(ranquestion[1].trim())
            }

                setInterval(function(){
                if(!clicked && document.querySelector("button.btn.btn-primary.btn-show")){
                document.querySelector("button.btn.btn-primary.btn-show").click()
                clicked = true;
                }
                if(document.querySelector(".btn-mine") && document.querySelector(".btn-mine").style.display =="inline"){
                document.querySelector(".btn-mine").click();
                }
                if(formSubmitted && !modalFormClicked && document.querySelector("#insticator-modal button.btn.btn-primary.btn-show")){
                document.querySelector("#insticator-modal button.btn.btn-primary.btn-show").click();
                modalFormClicked = true;
                }
                if(document.querySelector("iframe") && document.querySelector("iframe").getAttribute("data-hcaptcha-response") &&
                document.querySelector("iframe").getAttribute("data-hcaptcha-response").length > 0) {
                if(document.querySelector(".btn-solve")){
                document.querySelector(".btn-solve").click();
                }
                if(document.querySelector(".btn.btn-primary.btn-solve-insticator")){
                document.querySelector(".btn.btn-primary.btn-solve-insticator").click();
                }
                if(!formSubmitted && document.querySelector("form.puzzle-form")){
                formSubmitted = true;
                clicked = false;
                document.querySelector(".form.puzzle-form").submit();
                }
                if(document.querySelector("#btn-verify")){
                document.querySelector("#btn-verify").click();
                }
                }
                },5000);
                }
                setTimeout(function(){
                if( websiteDataValues.additionalFunctions){
                websiteDataValues.additionalFunctions();
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

        if(!movingToNextUrl && websiteDataValues.toggleCaptchaSelector && Number.isInteger(websiteDataValues.toggleCaptchaSelectorIndex)){
        toggleCaptcha(websiteDataValues.toggleCaptchaSelector,websiteDataValues.toggleCaptchaSelectorIndex);
        }
        if(!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)){
           document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
            setTimeout(function(){
               if(websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)){
                 document.querySelector(websiteDataValues.inputTextSelectorButton).click();
                }
                },5000);
                }

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
                    document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response") &&
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
                    },5000);



})();