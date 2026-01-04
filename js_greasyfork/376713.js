// ==UserScript==
// @name         斗鱼视频默认Html5
// @namespace    coreredhat
// @version      0.1
// @description  斗鱼录播视频默认用H5
// @author       space
// @match        https://v.douyu.com/*
// @grant        unsafeWindow
// @note         改自《自动切换斗鱼 H5 beta 播放器》，只改了一下引用的地址
// @note         原作者地址：https://greasyfork.org/zh-CN/scripts/39742-自动切换斗鱼-h5-beta-播放器
// @downloadURL https://update.greasyfork.org/scripts/376713/%E6%96%97%E9%B1%BC%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4Html5.user.js
// @updateURL https://update.greasyfork.org/scripts/376713/%E6%96%97%E9%B1%BC%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4Html5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id = setInterval(() => {
        if (unsafeWindow.__player !== undefined) {
            console.log('完成！');
            unsafeWindow.__player.switchPlayer(true);
            clearInterval(id);
        }
    }, 100);
    })();