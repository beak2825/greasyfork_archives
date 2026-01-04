// ==UserScript==
// @name         CLKS BYPASS
// @namespace    http://tampermonkey.net/
// @version      1
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
// @match        https://tiktokcounter.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rseducationinfo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491584/CLKS%20BYPASS.user.js
// @updateURL https://update.greasyfork.org/scripts/491584/CLKS%20BYPASS.meta.js
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
simulateClick(1056,622);
        simulateClick(1056,662);
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


   const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
    function SubmitBp(selector, time = 1) {let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; console.log(elem); setTimeout(() => {elem.submit();}, time * 1000);}
    function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}

    function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
setTimeout (function () {


      ReadytoClick('#cbt')
    }, 23000);







})();