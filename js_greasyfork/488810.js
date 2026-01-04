// ==UserScript==
// @name         移除B站直播马赛克
// @namespace    https://github.com/SihenZhang
// @license      MIT
// @version      1.0.0
// @description  移除B站直播播放器对聊天区和游戏击杀信息的马赛克（基于 MutationObserver）
// @author       SihenZhang
// @match        *://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488810/%E7%A7%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488810/%E7%A7%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function (mutationsList, observer) {
        for (var i = 0; i < mutationsList.length; i++) {
            var mutation = mutationsList[i];
            if (mutation.type === 'childList') {
                var element = document.getElementById('web-player-module-area-mask-panel');
                if (element) {
                    element.parentNode.removeChild(element);
                    console.log('[移除B站直播马赛克] 马赛克已被移除');
                }
            }
        }
    });
    var livePlayer = document.getElementById('live-player');
    observer.observe(livePlayer !== null && livePlayer !== void 0 ? livePlayer : document.body, {
        childList: true,
        subtree: true
    });
})();