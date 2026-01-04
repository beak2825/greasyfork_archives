// ==UserScript==
// @name         Bilibili HEVC Unlock
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  unlock hevc
// @author       Kun Yu
// @match        *://*.bilibili.com/*
// @match        *://*.bilivideo.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472911/Bilibili%20HEVC%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/472911/Bilibili%20HEVC%20Unlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Activating Unlock!')
    try{
    Object.defineProperty(navigator, 'userAgent', {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/605.1.15"
    });
    }catch(e){
        console.log(e)
    }
})();