// ==UserScript==
// @name         Enable aria-live for bilibili.com Closed Caption
// @namespace https://github.com/abitglow/
// @version      0.1.1
// @description 启用屏幕阅读器自动朗读 bilibili CC 字幕！
// @author       好奇的 01
// @match        https://www.bilibili.com/*
// @match        https://m.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420545/Enable%20aria-live%20for%20bilibilicom%20Closed%20Caption.user.js
// @updateURL https://update.greasyfork.org/scripts/420545/Enable%20aria-live%20for%20bilibilicom%20Closed%20Caption.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setLiveRegions() {
        var el = document.querySelectorAll('.subtitle-wrap, div.bilibili-player-video-danmaku');
        for (var i = 0; i < el.length; i++) {
            el[i].setAttribute('aria-live', 'polite');
        }
return el.length;
    }

    function trySet() {
        if (setLiveRegions() > 0) {
            clearInterval(intervalID);
            console.log('aria-live attribute added successfully.');
        }
        if (time < 1) {
            clearInterval(intervalID);
            console.log('aria-live attribute added unsuccessfully.');
        }
        time--;
    }

    var time = 5;
    var intervalID =setInterval(trySet, 2000);
})();
