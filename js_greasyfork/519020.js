// ==UserScript==
// @name         Copy Jina.ai Page Source / 复制 Jina.ai 网页源代码
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Add context menu to copy page source from Jina.ai for the current page / 为当前页面添加右键菜单以复制 Jina.ai 的网页源代码
// @author       Your Name / 您的名字
// @match        *://*/*

// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand

// @license      GPL-3.0 License

// @downloadURL https://update.greasyfork.org/scripts/519020/Copy%20Jinaai%20Page%20Source%20%20%E5%A4%8D%E5%88%B6%20Jinaai%20%E7%BD%91%E9%A1%B5%E6%BA%90%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/519020/Copy%20Jinaai%20Page%20Source%20%20%E5%A4%8D%E5%88%B6%20Jinaai%20%E7%BD%91%E9%A1%B5%E6%BA%90%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册右键菜单命令
    console.log(`注册:'复制 Jina.ai 网页源代码'`);

    GM_registerMenuCommand('复制 Jina.ai 网页源代码', async function() {
        const currentUrl = window.location.href;

        const jinaUrl = `https://r.jina.ai/${encodeURIComponent(currentUrl)}`;

        // 提示用户正在复制
        displayNotification('正在复制 Jina.ai 网页源代码，请稍候...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: jinaUrl,
            onload: function(response) {
                if (response.status === 200) {
                    // 复制源代码到剪贴板
                    GM_setClipboard(response.responseText);
                    displayNotification('已复制 Jina.ai 网页源代码！');
                } else {
                    displayNotification(`无法获取源代码，状态码: ${response.status}`);
                }
            },
            onerror: function() {
                displayNotification('请求失败，请稍后再试。');
            }
        });
    });

    function displayNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#333';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.zIndex = 9999;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
})();