// ==UserScript==
// @name         知乎显示IP属地
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在知乎回答中显示作者IP属地
// @author       You
// @match        https://www.zhihu.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523084/%E7%9F%A5%E4%B9%8E%E6%98%BE%E7%A4%BAIP%E5%B1%9E%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/523084/%E7%9F%A5%E4%B9%8E%E6%98%BE%E7%A4%BAIP%E5%B1%9E%E5%9C%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .ip-location {
            font-size: 14px;
            color: #8590a6;
            margin-top: 8px;
            display: block;
            line-height: 1.5;
            clear: both;
        }
    `;
    document.head.appendChild(style);

    // 获取作者主页链接并添加IP属地信息
    function addIPLocation() {
        const authorLinks = document.querySelectorAll('.UserLink-link');

        authorLinks.forEach(link => {
            if(link.dataset.processed) return;
            link.dataset.processed = true;

            const authorUrl = link.href;
            // 修改为查找发布时间元素
            const contentItem = link.closest('.ContentItem');
            if(!contentItem) return;

            const timeDiv = contentItem.querySelector('.ContentItem-time');
            if(!timeDiv) return;
            if(timeDiv.querySelector('.ip-location')) return;

            // 创建IP属地显示元素
            const ipDiv = document.createElement('div');
            ipDiv.className = 'ip-location';
            // 将IP信息插入到时间元素后面
            timeDiv.appendChild(ipDiv);

            GM_xmlhttpRequest({
                method: 'GET',
                url: authorUrl,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const ipElement = doc.querySelector('.css-1xfvezd');
                    if(ipElement) {
                        const ipMatch = ipElement.textContent.match(/IP 属地[^}]+/);
                        if(ipMatch) {
                            ipDiv.textContent = ipMatch[0];
                        }
                    }
                }
            });
        });
    }

    // 监听页面变化
    const observer = new MutationObserver(addIPLocation);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    addIPLocation();
})();