// ==UserScript==
// @name         discord 反覆點表情符號by ㄐㄐ人
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  會反覆點表情符號的健種
// @author       ㄐㄐ人
// @match        *://*.discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463718/discord%20%E5%8F%8D%E8%A6%86%E9%BB%9E%E8%A1%A8%E6%83%85%E7%AC%A6%E8%99%9Fby%20%E3%84%90%E3%84%90%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463718/discord%20%E5%8F%8D%E8%A6%86%E9%BB%9E%E8%A1%A8%E6%83%85%E7%AC%A6%E8%99%9Fby%20%E3%84%90%E3%84%90%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoClick() {
        var element = document.querySelector('.reactionInner-YJjOtT[aria-pressed="false"]:not([aria-label*="super react"])');
        if (element) {
            element.click();
            console.log("done");
        }
    }

    function autounClick() {
        var element = document.querySelector('.reactionInner-YJjOtT[aria-pressed="true"]:not([aria-label*="super react"])');
        if (element) {
            element.click();
            console.log("done");
        }
    }

    setInterval(function() {
        try {
            autoClick();
            autounClick();
        } catch (e) {
            console.error('Error:', e);
        }
    }, 1000);
})(); 
