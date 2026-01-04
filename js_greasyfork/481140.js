// ==UserScript==
// @name         b站详情页优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  移除右侧直播引流，移除右侧轮播，增加小窗播放大小
// @author       You
// @match        https://www.bilibili.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481140/b%E7%AB%99%E8%AF%A6%E6%83%85%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481140/b%E7%AB%99%E8%AF%A6%E6%83%85%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var isRemove = false
    var loopNum = 0
    function docRemove () {
        var doc = document.querySelector('.pop-live-small-mode')
        if (doc) {
            doc.remove()
            document.querySelector('#right-bottom-banner').remove()
            isRemove = true
        }
        loopNum++
        setTimeout(function () {
            if (!isRemove || loopNum < 10) {
                docRemove()
            }
        }, 1000)
    }
    docRemove()

    // 修改小窗播放css
    GM_addStyle('.bpx-player-container[data-revision="1"][data-screen=mini],.bpx-state-paused[data-revision="2"][data-screen=mini]{width: 400px; height: 253px}')
})();