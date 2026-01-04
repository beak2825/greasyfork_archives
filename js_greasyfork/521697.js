// ==UserScript==
// @name         在B站直播间的弹幕后面添加一个时间戳（悬停显示）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在每一条弹幕上添加一个不可见的时间戳，当鼠标滑过这个弹幕的时候显示这个弹幕是什么时候发的
// @author       与歌一生
// @match        *://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521697/%E5%9C%A8B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E5%BC%B9%E5%B9%95%E5%90%8E%E9%9D%A2%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%97%B6%E9%97%B4%E6%88%B3%EF%BC%88%E6%82%AC%E5%81%9C%E6%98%BE%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521697/%E5%9C%A8B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E5%BC%B9%E5%B9%95%E5%90%8E%E9%9D%A2%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E6%97%B6%E9%97%B4%E6%88%B3%EF%BC%88%E6%82%AC%E5%81%9C%E6%98%BE%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const chatItemsContainer = document.getElementById('chat-items');
    const processedDanmakus = new Set();

    function addHiddenTimestampToDanmaku(danmaku) {
        if (processedDanmakus.has(danmaku)) return;

        const timestampStr = danmaku.getAttribute('data-ts');
        let timestamp = parseInt(timestampStr, 10);

        if (isNaN(timestamp) || timestamp <= 0) {
            timestamp = Math.floor(Date.now() / 1000);
        }

        timestamp *= 1000;
        const date = new Date(timestamp);

        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        const fullDateString = date.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

        const timeSpan = document.createElement("span");
        timeSpan.textContent = ` [${timeString}]`;
        timeSpan.style.color = "gray";
        timeSpan.setAttribute('data-timestamp-span', 'true');
        timeSpan.title = fullDateString;
        timeSpan.style.display = 'none';

        const danmakuTextElement = danmaku.querySelector('.danmaku-item-right');
        if (danmakuTextElement) {
            danmakuTextElement.parentNode.insertBefore(timeSpan, danmakuTextElement.nextSibling);
            danmaku.setAttribute('data-timestamp-added', 'true');
            processedDanmakus.add(danmaku);

            danmaku.addEventListener('mouseenter', () => {
                timeSpan.style.display = 'inline';
            });
            danmaku.addEventListener('mouseleave', () => {
                timeSpan.style.display = 'none';
            });
        }
    }

    if (chatItemsContainer) {
        chatItemsContainer.querySelectorAll('.danmaku-item').forEach(addHiddenTimestampToDanmaku);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('danmaku-item') && !node.hasAttribute('data-timestamp-added')) {
                        addHiddenTimestampToDanmaku(node);
                    }
                });
            });
        });

        const config = { childList: true, subtree: true };
        observer.observe(chatItemsContainer, config);
    }
})();