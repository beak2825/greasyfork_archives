// ==UserScript==
// @name         哔哩哔哩自动点赞
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   哔哩哔哩自动点赞, bilibili 自动点赞, B站自动点赞, b站自动点赞。支持视频、番剧。
// @author       aoguai
// @copyright    2023, aoguai (https://github.com/aoguai)
// @license      MIT
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/BV*
// @match         *://www.bilibili.com/list/*
// @match         *://www.bilibili.com/bangumi/play/ep*
// @match         *://www.bilibili.com/bangumi/play/ss*
// @match         *://www.bilibili.com/cheese/play/ep*
// @match         *://www.bilibili.com/cheese/play/ss*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/476503/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/476503/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function () {
    const likeButtonSelectors = ["div.video-like", "#like_info"];

    // 设置默认值
    let timeThreshold = GM_getValue('timeThreshold', 30000);

    // 添加设置菜单
    GM_registerMenuCommand("设置点赞时间阈值", function() {
        const inputTime = prompt('请输入点赞时间阈值（单位：毫秒）:', timeThreshold);
        if (inputTime !== null) {
            timeThreshold = parseInt(inputTime);
            GM_setValue('timeThreshold', timeThreshold);
        }
    });

    function triggerMouseEvent(node, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    }

    function observeAndLike(likeButton) {
        if (likeButton) {
            const observer = new MutationObserver(() => {
                console.log('Liked successfully.');
                observer.disconnect();
            });
            triggerMouseEvent(likeButton, "mouseover");
            triggerMouseEvent(likeButton, "mousedown");
            triggerMouseEvent(likeButton, "mouseup");
            triggerMouseEvent(likeButton, "click");
        }
    }

    function findAndObserveLikeButton() {
        for (const selector of likeButtonSelectors) {
            const likeButton = document.querySelector(selector);
            if (likeButton) {
                observeAndLike(likeButton);
                break;
            }
        }
    }

    setTimeout(findAndObserveLikeButton, timeThreshold);
})();