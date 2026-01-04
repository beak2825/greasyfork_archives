// ==UserScript==
// @name         直播间默认静音
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  默认静音
// @author       mscststs
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      ISC
// @run-at       document-head
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449369/%E7%9B%B4%E6%92%AD%E9%97%B4%E9%BB%98%E8%AE%A4%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/449369/%E7%9B%B4%E6%92%AD%E9%97%B4%E9%BB%98%E8%AE%A4%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let flag = true;
    Object.keys(window.localStorage).filter(v=>v.startsWith("web-player-ui-config")).map(key=>{
        const config = JSON.parse(window.localStorage[key]);
        if(config.volume && !config.volume.disabled){
            config.volume.disabled = true;
        }
        window.localStorage[key] = JSON.stringify(config);
    });
})();