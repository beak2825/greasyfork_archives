// ==UserScript==
// @name        Post tweet
// @autor       Hader Araujo
// @namespace    http://tampermonkey.net/
// @description  code: Post tweet
// @include     https://twitter.com/intent/tweet?text=*
// @license      MIT
// @version     0.01
// @grant       GM_openInTab
// @grant       window.close
// @downloadURL https://update.greasyfork.org/scripts/459721/Post%20tweet.user.js
// @updateURL https://update.greasyfork.org/scripts/459721/Post%20tweet.meta.js
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
        if (document.querySelector('div[aria-labelledby="modal-header"] > div > div > div > div:nth-child(3) > div:nth-child(2) > div > div  > div > div > div > div:nth-child(2) > div:nth-child(3) > div  > div  > div:nth-child(2) > div:nth-child(4) ') ) {
            document.querySelector('div[aria-labelledby="modal-header"] > div > div > div > div:nth-child(3) > div:nth-child(2) > div > div  > div > div > div > div:nth-child(2) > div:nth-child(3) > div  > div  > div:nth-child(2) > div:nth-child(4) ').click()
        }
    })


    executeWithSleepBegin(oneSecond * 4, () => {
        window.close();
    })



})();