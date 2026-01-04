// ==UserScript==
// @name         HC Free Coin Faucet Rotator 1
// @namespace    Claim Free Coin
// @version      1.1
// @description  Claim Free Coin
// @author       lotocamion
// @match        https://faucet.bitgames.io/*
// @match        https://www.bitgames.io/*
// @match        https://cryptowin.io/*
// @match        https://www.cryptowin.io/*
// @match        https://btcadspace.com*
// @match        https://btcadspace.com/*
// @match        https://autofaucet.dutchycorp.space/*
// @match        https://get-bitcoin.net/*
// @match        https://dogebits.net/*
// @match        https://www.coinlean.com/*
// @match        http://captchafaucet.unaux.com/*
// @match        https://faupig-bit.online/*
// @match        https://free-crypto-litecoin.cf/*
// @connect      free-crypto-litecoin.cf
// @connect      faupig-bit.online
// @connect      captchafaucet.unaux.com
// @connect      get-bitcoin.net
// @connect      dogebits.net
// @connect      autofaucet.dutchycorp.space
// @connect      faucet.bitgames.io
// @connect      www.bitgames.io
// @connect      btcadspace.com
// @connect      cryptowin.io
// @connect      www.coinlean.com
// @grant        GM_xmlhttpRequest


// @downloadURL https://update.greasyfork.org/scripts/444040/HC%20Free%20Coin%20Faucet%20Rotator%201.user.js
// @updateURL https://update.greasyfork.org/scripts/444040/HC%20Free%20Coin%20Faucet%20Rotator%201.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var clicked = false;



    var websiteData = [


        {url : "https://cryptowin.io/faucet", regex: "faucet"},
        {url : "https://cryptowin.io/surf", regex: "surf"},
        {url : "https://www.bitgames.io/offerwalls/faucet/", regex: "faucet"},
        {url : "https://www.bitgames.io/offerwalls/"},
        {url : "https://get-bitcoin.net/faucet.html"},
        {url : "https://dogebits.net/faucet.html"},
        {url : "https://btcadspace.com/faucet"},
        {url : "https://faupig-bit.online/page/dashboard"},
        {url : "http://captchafaucet.unaux.com/page/dashboard"},
        {url : "https://free-crypto-litecoin.cf/page/dashboard"},
        {url : "https://autofaucet.dutchycorp.space/coin_roll.php", regex: "coin_roll.php"},
        {url : "https://autofaucet.dutchycorp.space/roll.php", regex: "roll.php"},
        {url : "https://www.coinlean.com/freecoin/BTC/", regex: "BTC"},
        {url : "https://www.coinlean.com/freecoin/DOGE/", regex: "DOGE"},
        {url : "https://www.coinlean.com/freecoin/DASH/", regex: "DASH"},
        {url : "https://www.coinlean.com/freecoin/TRX/", regex: "TRX"},
        {url : "https://www.coinlean.com/freecoin/LTC/", regex: "LTC"},
        {url : "https://www.coinlean.com/freecoin/BCH/", regex: "BCH"},
        {url : "https://www.coinlean.com/freecoin/BNB/", regex: "BNB"},
        {url : "https://www.coinlean.com/freecoin/ETH/", regex: "ETH"},


        ];


         var websiteMap = [

         {website : ["captchafaucet.unaux.com","free-crypto-litecoin.cf","faupig-bit.online"],
         captchaButtonSubmitSelector: ["[name='claim']","[name='login']"],
         allMessageSelectors: [".alert.alert-info",".alert.alert-danger",".result"],
         timeoutMessageSelectors: ["#time_remaining"],
         messagesToCheckBeforeMovingToNextUrl: ["We've failed to process your claim","You have to wait","has been sent","Your faucet claim of"],
         additionalFunctions: btcadspace,},


         {website: "coinlean.com",
         captchaButtonSubmitSelector: "a.btn_1.gradient",
         allMessageSelectors: ['.layui-layer-content > div', "#clocker .text-center",".layui-layer-move"],
         messagesToCheckBeforeMovingToNextUrl: ["successfully", "claimed","was sent to your","insufficient","claim again", "You have to wait","You have reached"]},


        {website: "btcadspace.com",
         defaultButtonSelectors: ["a.btn.btn-block.btn-primary.btn-lg"],
         captchaButtonSubmitSelector: "button.btn.btn-block.btn-success.btn-lg",
         allMessageSelectors: ["span.text-center",".alert.alert-success",".alert.alert-danger","script",".text-center"],
         messagesToCheckBeforeMovingToNextUrl: ["claim again in","you won","You reached the maximum"],
         additionalFunctions: btcadspace,
         timeoutbeforeMovingToNextUrl: 90000},

        {website: ["bitgames.io"],
         additionalFunctions: bitgames,
         allMessageSelectors: ["title","hcaptcha-msg",".mine-popover","div.title","span.text-center",".alert.alert-success",".alert.alert-danger","script",".text-center"],
         messagesToCheckBeforeMovingToNextUrl: ["You can mine in:","You can mine in","Thank you","claim again in","you won","You reached the maximum"],
         timeoutbeforeMovingToNextUrl: 210000},


         {website : "cryptowin.io",
         defaultButtonSelectors: [".btn.btn-block.btn-click.btn-lg"],
         captchaButtonSubmitSelector: ".btn.btn-block.btn-success.btn-lg, #tryCaptcha",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger","script",".text-center"],
         messagesToCheckBeforeMovingToNextUrl: ["claim again in","you won","You reached the maximum"],
         additionalFunctions: cryptowin},


        {website: "autofaucet.dutchycorp.space",
         defaultButtonSelectors: ["a.btn-small.waves-effect.waves-red"],
         captchaButtonSubmitSelector: "#claim",
         allMessageSelectors: ['#timer'],
         additionalFunctions: dutchycorp,
         messagesToCheckBeforeMovingToNextUrl: ["You won", "successfully", "claimed","was sent to your","insufficient","claim again", "You have to wait","Minutes"],
         timeoutbeforeMovingToNextUrl: 180000},


        {website : ["get-bitcoin.net","dogebits.net"],
         defaultButtonSelectors: ["#claimFaucet > a"],
         toggleCaptchaSelector:[".modal-dialog .form-control"],
         toggleCaptchaSelectorIndex: 1,
         captchaButtonSubmitSelector: ".btn-rounded.btn-sm.w-30.mb-0",
         allMessageSelectors: [".alert.alert-success",".alert.alert-danger", "#main-container h1"],
         messagesToCheckBeforeMovingToNextUrl: ["can claim again","you won", "Sucuri Website Firewall"],
         additionalFunctions: getBitcoinDoge},

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

                            }
                            }



            function btcadspace(){
            if(window.location.href.includes("faucet")){
            var anchors = document.getElementsByTagName("a");
            for (var i = 0; i < anchors.length; i++) {
                anchors[i].onclick = function() {return false;};
            }
            }
            }



        function cryptowin(){

        var oldfunction = unsafeWindow.open;
        var windowName = "";

        function newFunction(params1, params2) {

            console.log(params1 + params2);
            if (!params2 || params2 == "_blank") {
                windowName = "CryptoWinPopUp";
            } else {
                windowName = params2;
            }

            return oldfunction(params1, windowName);
        };

        unsafeWindow.open = newFunction;

        unsafeWindow.onbeforeunload = function() {
            unsafeWindow.open('', windowName).close();
        };

        if(document.querySelector("#dropdownList")){
            document.querySelector("#dropdownList").click();
        }
        if(document.querySelector("#claim div.modal-body > div.ad_box center li > a") &&
           document.querySelector("#claim div.modal-body > div.ad_box center li > a").innerText == "hCAPTCHA"){
            document.querySelector("#claim div.modal-body > div.ad_box center li > a").click()
        }

        if(window.location.href.includes("surf")){

            if(document.querySelector("#visitedlink[class=''] [class='ptcbtn faa-parent animated-hover']")){
                document.querySelector("#visitedlink[class=''] [class='ptcbtn faa-parent animated-hover']").click();
            }else if(document.querySelector("#visitedlink") && !document.querySelector("#visitedlink[class=''] [class='ptcbtn faa-parent animated-hover']")){
                goToNextUrl();
            }else{

            }

            if(document.querySelector(".refbtn.start-btn")){
                document.querySelector(".refbtn.start-btn").click();
            }

            var interval =setInterval(function(){
                if(document.querySelector("#timer") && document.querySelector("#timer").innerText.includes("Oops")){
                    goToNextUrl();
                    clearInterval(interval);
                }
            },5000)

            }
            }

            function dutchycorp(){
            if(window.location.href.includes("ptc/wall.php")){
            setTimeout(function(){
                goToNextUrl();
            },60000)
            }
            }

            setInterval(function(){
            if(messageSelectorsPresent()){
            goToNextUrl();
            }
            },7000);


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


/*
////////////////////////////////////////////////////////////////

// ==UserScript==
// @name         Autologin faupig-bit
// @namespace    Autologin
// @version      0.1
// @description  Autologin only
// @author       lotocamion
// @match        https://faupig-bit.online/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //ENTER YOUR USER NAME AND PASSWORD BELOW//
    var address = false;
    var usernamefaupig = "YOUR_USER_NAME";////EXAMPLE////
    var passwordfaupig = "YOUR_PASSWORD";////EXAMPLE////



    if (document.querySelector("#holder > div > form > div:nth-child(1) > input")) {
    document.querySelector("#holder > div > form > div:nth-child(1) > input").value = usernamefaupig;
    address = true;
    }
    if (document.querySelector("#holder > div > form > div:nth-child(2) > input")) {
    document.querySelector("#holder > div > form > div:nth-child(2) > input").value = passwordfaupig;
    address = true;
    }
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ==UserScript==
// @name         Autologin litecoin.cf
// @namespace    Autologin
// @version      0.1
// @description  Autologin only
// @author       lotocamion
// @match        https://free-crypto-litecoin.cf/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

 //ENTER YOUR USER NAME AND PASSWORD BELOW//
    var address = false;
    var usernamelitecoincf = "YOUR_USER_NAME";////EXAMPLE////
    var passwordlitecoincf = "YOUR_PASSWORD";////EXAMPLE////



    if (document.querySelector("#holder > div > form > div:nth-child(1) > input")) {
    document.querySelector("#holder > div > form > div:nth-child(1) > input").value = usernamelitecoincf;
    address = true;
    }
    if (document.querySelector("#holder > div > form > div:nth-child(2) > input")) {
    document.querySelector("#holder > div > form > div:nth-child(2) > input").value = passwordlitecoincf;
    address = true;
    }
})();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ==UserScript==
// @name         Autologin captchafaucet.unaux
// @namespace    Autologin
// @version      0.1
// @description  Autologin only
// @author       lotocamion
// @match        http://captchafaucet.unaux.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

 //ENTER YOUR USER NAME AND PASSWORD BELOW//
    var address = false;
    var usernamecaptchafaucetunaux = "YOUR_USER_NAME";////EXAMPLE////
    var passwordcaptchafaucetunaux = "YOUR_PASSWORD";////EXAMPLE////



    if (document.querySelector("#holder > div > form > div:nth-child(1) > input")) {
    document.querySelector("#holder > div > form > div:nth-child(1) > input").value = usernamecaptchafaucetunaux;
    address = true;
    }
    if (document.querySelector("#holder > div > form > div:nth-child(2) > input")) {
    document.querySelector("#holder > div > form > div:nth-child(2) > input").value = passwordcaptchafaucetunaux;
    address = true;
    }
})();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ==UserScript==
// @name         AUTOLOGIN [cryptowin.io]
// @namespace    Autologin Only
// @version      0.1
// @description  Autologin Only
// @author       lotocamion
// @match        https://cryptowin.io/account
// @match        https://cryptowin.io/
// @match        https://cryptowin.io/login
// @icon         https://www.google.com/s2/favicons?domain=cryptowin.io
// @grant        none
// ==/UserScript==

    (function() {
    'use strict';

    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "YOUR_USER_NAME";////EXAMPLE////
    var password = "YOUR_PASSWORD";////EXAMPLE////
    var clicked = false;
    var address = false;
    if(document.querySelector("body > div.main-page-wrapper > div.html-top-content > div.theme-top-section > header > div > div > div") && (window.location.href.includes("https://cryptowin.io/"))) {
    window.location.replace("https://cryptowin.io/login");
    }
    if(document.querySelector("body > div.container > div.page-header.header5 > h3") && (window.location.href.includes("https://cryptowin.io/account"))) {
    window.location.replace("https://cryptowin.io/faucet");
    }
    setInterval(function() {
    if (document.querySelector("#username")) {
    document.querySelector("#username").value = username;
    address = true;
    }
    if (document.querySelector("#password")) {
    document.querySelector("#password").value = password;
    address = true;
    }
    }, 1000);
    setInterval(function() {
    document.querySelector("#button").click();
    clicked = true;
    }, 7000);
    })();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

// ==UserScript==
// @name         AUTOLOGIN [btcadspace.com]
// @namespace    Autologin Only
// @version      0.1
// @description  Autologin Only
// @author       lotocamion
// @match        https://btcadspace.com/login
// @match        https://btcadspace.com
// @match        https://btcadspace.com/account
// @icon         https://www.google.com/s2/favicons?domain=btcadspace.com
// @grant        none
// ==/UserScript==

    (function() {
    'use strict';
    ////EDIT YOUR USER NAME AND PASSWORD BELOW////
    var username = "YOUR_USER_NAME";////EXAMPLE////
    var password = "YOUR_PASSWORD";////EXAMPLE////
    var clicked = false;
    var address = false;
    if(document.querySelector("body > div.wrapper > section.sliderHome > div > div > div > h2") && (window.location.href.includes("https://btcadspace.com/"))) {
    window.location.replace("https://btcadspace.com/login");
    }
    if(document.querySelector("body > div.wrapper > nav > div > div.navbar-header > a") && (window.location.href.includes("https://btcadspace.com/account"))) {
    window.location.replace("https://btcadspace.com/faucet");
    }
     setInterval(function() {
    if (document.querySelector("#username")) {
    document.querySelector("#username").value = username;
    address = true;
    }
    if (document.querySelector("#password")) {
    document.querySelector("#password").value = password;
    address = true;
    }
    }, 1000);
    setInterval(function() {
    if (document.querySelector(".h-captcha")) {
    if (document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0){
    document.querySelector("#button").click();
    clicked = true;
    }
    }},7000);
    setInterval(function() {
    document.querySelector("#button").click();
    clicked = true;
    },45000);
})();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
*/