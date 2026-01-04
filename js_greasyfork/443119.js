// ==UserScript==
// @name         Bilibili时间线后台开启标签.
// @namespace    http://xuche.im/
// @version      0.2
// @description  Bilibili uses custom javascript to focus on the opened tabs, this script allows you to open tabs in the background. 这个脚本使在时间线上点击视频卡片时不再自动跳转到新打开的视频页面，而在后台打开新标签页，不会打断浏览时间线页面。
// @author       Xu Shidao
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-body
// @license      GPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/443119/Bilibili%E6%97%B6%E9%97%B4%E7%BA%BF%E5%90%8E%E5%8F%B0%E5%BC%80%E5%90%AF%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/443119/Bilibili%E6%97%B6%E9%97%B4%E7%BA%BF%E5%90%8E%E5%8F%B0%E5%BC%80%E5%90%AF%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 2 of the License, or (at your option) any later version.

(function() {
    'use strict';
    let body = document.querySelector('body');
    let config = { childList: true, subtree: true };
    let callback = function(mutationsList, app_observer) {
        let tl = document.querySelector('div.bili-dyn-list__items');
        if (tl==null){
            return;
        }
        app_observer.disconnect();
        let config = { childList: true };
        let callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                for (let node of mutation.addedNodes){
                    let card_list=node.querySelectorAll('a.bili-dyn-card-video, a.bili-dyn-card-article');
                    for (let card of card_list) {
                        card.addEventListener('click',function(t){
                            //         t.preventDefault();
                            t.stopPropagation();
                            t.stopImmediatePropagation();
                        });
                    }
                }
            }
        };
        let observer = new MutationObserver(callback);
        observer.observe(tl, config);
    };
    let observer = new MutationObserver(callback);
    observer.observe(body, config);
})();