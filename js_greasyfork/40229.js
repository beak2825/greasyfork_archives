// ==UserScript==
// @name         TextNow NoAd
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  try to delete the advertisement of Outlook!
// @author       Hwang
// @grant        none
// @match        *://www.textnow.com/*
// @downloadURL https://update.greasyfork.org/scripts/40229/TextNow%20NoAd.user.js
// @updateURL https://update.greasyfork.org/scripts/40229/TextNow%20NoAd.meta.js
// ==/UserScript==

function getElementByXPath(path) {
    return document.evaluate(path, document, null,
    XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function deleteElement(element) {
    element.parentNode.removeChild(element);
}

var timeout_0 = 0;
var interval_0 = setInterval(function() {
    timeout_0 ++;
    var obj_ad_0 = getElementByXPath('//*[@id="bannerContainer"]');
    if(obj_ad_0) {
        deleteElement(obj_ad_0);
        clearInterval(interval_0);
        //alert("Interval_0 Finish!");
    }
    if(timeout_0>100) {
        clearInterval(interval_0);
        //alert("Interval_0 Timeout!");
    }
}, 100);

var timeout_1 = 0;
var interval_1 = setInterval(function() {
    timeout_1 ++;
    var obj_ad_1 = getElementByXPath('//*[@id="div-gpt-ad-1452562522785-0"]');
    if(obj_ad_1) {
        deleteElement(obj_ad_1);
        clearInterval(interval_1);
        //alert("Interval_1 Finish!");
    }
    if(timeout_1>100) {
        clearInterval(interval_1);
        //alert("Interval_1 Timeout!");
    }
}, 100);

var timeout_2 = 0;
var interval_2 = setInterval(function() {
    timeout_2 ++;
    var obj_ad_2 = getElementByXPath('//*[@id="appContainer"]/div/div[3]');
    if(obj_ad_2) {
        deleteElement(obj_ad_2);
        clearInterval(interval_2);
        //alert("Interval_2 Finish!");
    }
    if(timeout_2>100) {
        clearInterval(interval_2);
        //alert("Interval_2 Timeout!");
    }
}, 100);

var timeout_3 = 0;
var interval_3 = setInterval(function() {
    timeout_3 ++;
    var obj_ad_3 = getElementByXPath('//*[@id="div-gpt-ad-1416329481953-1"]');
    if(obj_ad_3) {
        deleteElement(obj_ad_3);
        clearInterval(interval_3);
        //alert("Interval_3 Finish!");
    }
    if(timeout_3>100) {
        clearInterval(interval_3);
        //alert("Interval_3 Timeout!");
    }
}, 100);
