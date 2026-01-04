// ==UserScript==
// @name         Subber click giveway
// @autor        Hader Araujo
// @namespace    http://tampermonkey.net/
// @description  code: Subber click giveway
// @include      https://www.subber.xyz/*
// @license      MIT
// @version      0.03
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/459859/Subber%20click%20giveway.user.js
// @updateURL https://update.greasyfork.org/scripts/459859/Subber%20click%20giveway.meta.js
// ==/UserScript==
 
var globalDelay = 0
const oneSecond = 1000
 
function executeWithSleepBegin(delay, func) {
    globalDelay += delay
 
    setTimeout(() => {        
        func.call()
    }, globalDelay);
    
};
 
(function () {
    'use strict';
 
    console.log("inicio");
 
 
    executeWithSleepBegin(oneSecond * 10, () => {
        document.querySelector("div[class='css-wihuds'] > div > button").click()
    })
 
 
})();