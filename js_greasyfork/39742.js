// ==UserScript==
// @name         自动切换斗鱼 H5 beta 播放器
// @namespace    http://imspace.cn/
// @version      0.1
// @description  省去右键切换的过程
// @author       space
// @match        https://www.douyu.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/39742/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%96%97%E9%B1%BC%20H5%20beta%20%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/39742/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%96%97%E9%B1%BC%20H5%20beta%20%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id = setInterval(() => {
        if (unsafeWindow.__player !== undefined) {
            console.log('切换官方H5播放器成功');
            unsafeWindow.__player.switchPlayer(true);
            clearInterval(id);
        }
    }, 100);
    setTimeout(() => {
        clearInterval(id);
        console.error('自动切换到斗鱼官方H5播放器失败 原因: 超时(10秒)');
    }, 10 * 1000);
})();