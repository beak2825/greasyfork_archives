// ==UserScript==
// @name      Clks Zhenya PC
// @namespace    http://tampermonkey.net/
// @version      2024-03-04
// @description  renda extra
// @author       groland
// @match        https://mdn.lol/*
// @match        https://homeculina.com/*
// @match        https://kenzo-flowertag.com/*
// @match        https://ineedskin.com/*
// @match        https://lawyex.co/*
// @match        https://auntmanny.com/*
// @match        https://clks.pro/*
// @match        https://awgrow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rseducationinfo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491581/Clks%20Zhenya%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/491581/Clks%20Zhenya%20PC.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function isCaptchaChecked() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;
    }

setInterval(function(){

if (isCaptchaChecked()) {

    document.querySelector("button").click();

}
     }, 3000);


     setTimeout (function () {
function simulateClick(x, y) {
    var clickEvent= document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(
    'click', true, true, window, 0,
    0, 0, x, y, false, false,
    false, false, 0, null
    );
    document.elementFromPoint(x, y).dispatchEvent(clickEvent);
}
simulateClick(504,1636);
        simulateClick(520,1545);
        simulateClick(520,1368);
         simulateClick(450,1298);
         simulateClick(517,1638);
         simulateClick(517,1517);
         simulateClick(450,1291);
         simulateClick(532,1545);
         simulateClick(518,1752);
}, 17000);

setTimeout (function() {
if (window.location.href.includes("https://clks.pro/")){
      window.history.go(-7);}
}, 1000);



    var height = 0; var attempt = 0; var intS = 0; function scrollToEndPage() { console.log("height:" + height + " scrollHeight:" + document.body.scrollHeight + " att:" + attempt ); if (height < document.body.scrollHeight) { height = document.body.scrollHeight; window.scrollTo(0, height); attempt++; } else { clearInterval(intS); } } intS = setInterval(scrollToEndPage,5000);



})();