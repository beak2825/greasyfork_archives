// ==UserScript==
// @name         Twitter Home
// @autor        Hader Araujo
// @namespace    http://tampermonkey.net/
// @description  code: Twitter Home
// @include      https://twitter.com/home?toClose
// @license      MIT
// @version      0.01
// @grant        GM_openInTab
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/459874/Twitter%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/459874/Twitter%20Home.meta.js
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
 
    executeWithSleepBegin(oneSecond * 5, () => {
        window.close();
    })

})();