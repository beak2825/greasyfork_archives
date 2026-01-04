// ==UserScript==
// @name         移除Bilibili直播强制模糊/图标/公告
// @namespace    http://tampermonkey.net/
// @author       TianmuTNT
// @license      GPLv3
// @version      1.2-Beta
// @description  移除了Bilibili直播中的强制模糊/图标/公告
// @match        https://live.bilibili.com/*
// @grant        none
// @iconURL      https://www.bilibili.com/favicon.ico
// @icon64URL    https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/503583/%E7%A7%BB%E9%99%A4Bilibili%E7%9B%B4%E6%92%AD%E5%BC%BA%E5%88%B6%E6%A8%A1%E7%B3%8A%E5%9B%BE%E6%A0%87%E5%85%AC%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503583/%E7%A7%BB%E9%99%A4Bilibili%E7%9B%B4%E6%92%AD%E5%BC%BA%E5%88%B6%E6%A8%A1%E7%B3%8A%E5%9B%BE%E6%A0%87%E5%85%AC%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        childList: true,
        subtree: true
    };

    new MutationObserver(() => {
        const mask = document.querySelector('.web-player-module-area-mask');
        const icon = document.querySelector('.web-player-icon-roomStatus');
        const ann = document.querySelector('.announcement-wrapper.clearfix.no-select')
        
        if (mask) {
            mask.remove();
            console.log('移除了直播中的强制模糊蒙版');
        }
        
        if (icon) {
            icon.remove();
            console.log('移除了直播中的图标');
        }
        
        if (ann) {
            ann.remove()
            console.log('移除了烦人的公告')
        }
    }).observe(document.body, config);
})();