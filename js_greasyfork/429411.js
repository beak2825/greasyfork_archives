// ==UserScript==
// @name         ofertas.comprastaonline.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get coins every 5mins
// @author       KayDee
// @match        https://ofertas.comprastaonline.com/*
// @icon         https://www.google.com/s2/favicons?domain=comprastaonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429411/ofertascomprastaonlinecom.user.js
// @updateURL https://update.greasyfork.org/scripts/429411/ofertascomprastaonlinecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var btc="YOUR_BTC";
    var doge ="YOUR_DOGE";
    var eth="YOUR_ETH";

    var urlData = [
        {url : "https://ofertas.comprastaonline.com/eth/?r=0x27F2769559716A9726F2313A656D865C0FF9cC12", coin: "eth", address: eth},
        {url : "https://ofertas.comprastaonline.com/doge/?r=DAdQWaFFVcM3xKb8XS1655PjoA3Lqr5d17", coin: "doge", address: doge},
    ]
    // Get address for current URL
    var count = 0;
    var address = "";
    var nextUrl = "";
    var timeWaiting = 0;
    for (let value of Object.values(urlData)) {

        count = count + 1;
        if(window.location.href.includes("/" + value.coin + "/")){
            address = value.address;
            
            console.log(value);
            console.log(count);
            console.log("CLAIM -> address="+address);
            break;
        }
    }

    if(count == urlData.length){

            nextUrl = urlData[0].url;

    }else{
        nextUrl = urlData[count].url;
    }


    console.log("CLAIM -> currentUrl = "+window.location.href);
    console.log("CLAIM -> nextUrl = "+nextUrl);



    function waitForCaptcha() {
        if ((window.grecaptcha) && (window.grecaptcha.getResponse().length > 0)) {
            console.log("Login Captcha completed");
            var claimSelector='input[name="claim_coins"]';
            document.querySelector(claimSelector).click();
        }
        else {
            if (timeWaiting/1000 > 2 * 60) {
                setTimeout(function(){window.location.href = nextUrl;},1*60*1000);
                return;
            }
            console.log("Waiting for Captcha");
            timeWaiting += 10000;
            setTimeout(waitForCaptcha, random(2000, 3000));

        }


    };

    function random(min,max){
        return min + (max - min) * Math.random();
    }

    function checkTimer () {
        console.log("Entering checkTimer()");
        var timerSelector= 'form > div.timer';
        if ((document.querySelector(timerSelector))&&(document.querySelector(timerSelector).innerText!="00:00"))
        {
            console.log("Timer enabled, go to nextURL");
            setTimeout(function(){window.location.href = nextUrl;},30*1000);
        }

        else
        {
            console.log("Timer disabled, wait for captcha");


            setTimeout(function(){
                waitForCaptcha()
            },2000)

        }


    }
setTimeout(checkTimer,3000);
    //Default Setting: After 180 seconds go to next Url
    setTimeout(function(){
        console.log("CLAIM -> Worst case, move to next URL");
        window.location.href = nextUrl;
    },180000);



})();