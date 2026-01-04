// ==UserScript==
// @name         JSON Copy
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  Adds a "Copy" button to pages displaying JSON data, useful for API debugging.
// @author       1208nn
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546916/JSON%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/546916/JSON%20Copy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = window.location.href;

    // 判断是否是目标特殊url
    if (url.startsWith('https://live.radiance.thatgamecompany.com/account/auth/oauth_redirect')) {
        // 尝试获取页面上的JSON内容
        let jsonText = null;
        if (document.body) {
            if (document.body.firstChild && document.body.firstChild.nodeName === 'PRE') {
                jsonText = document.body.firstChild.textContent.trim();
            } else {
                jsonText = document.body.textContent.trim();
            }
        }
        if (jsonText) {
            try {
                const parsed = JSON.parse(jsonText);
                // 1. 如果内容为{"error":"invalid_code"}，弹警告并不激活脚本
                if (parsed.error === 'invalid_code') {
                    alert("错误，确定以重试");
                    // 若state参数以Facebook~开头
                    if (state.startsWith('Facebook~')) {
                        window.location.assign('https://live.radiance.thatgamecompany.com/account/auth/oauth_signin?type=Facebook&token=live.radiance.thatgamecompany.com');
                        return; // 不要显示按钮、停止后续操作
                    }
                    // 若state参数以Google~开头
                    if (state.startsWith('Google~')) {
                        window.location.assign('https://live.radiance.thatgamecompany.com/account/auth/oauth_signin?type=Google&token=live.radiance.thatgamecompany.com');
                        return; // 不显示按钮，结束
                    }
                    return; // 退出，不运行脚本其他逻辑
                }
            } catch (e) {
                // 解析失败，也不影响继续
            }
        }

        // 获取 URL中的参数
        const params = new URLSearchParams(window.location.search);
        const state = params.get('state') || '';

        // 若state参数以Facebook~开头
        if (state.startsWith('Facebook~')) {
            if (jsonText) {
                GM_setClipboard('Facebook' + jsonText, 'text');
            }
            return; // 不要显示按钮、停止后续操作
        }
        // 若state参数以Google~开头
        if (state.startsWith('Google~')) {
            if (jsonText) {
                // 复制内容为：谷歌+json内容（中文）
                GM_setClipboard('谷歌' + jsonText, 'text');
            }
            return; // 不显示按钮，结束
        }
    }

    // 普通逻辑：检测页面是否可能是JSON，显示按钮
    function isLikelyJsonPage() {
        if (document.contentType && document.contentType.includes('application/json')) {
            return true;
        }
        if (document.body && document.body.childNodes.length === 1 && document.body.firstChild.nodeName === 'PRE') {
            const textContent = document.body.firstChild.textContent.trim();
            return (textContent.startsWith('{') && textContent.endsWith('}')) ||
                (textContent.startsWith('[') && textContent.endsWith(']'));
        }
        if (document.body && document.body.children.length === 0) {
            const textContent = document.body.textContent.trim();
            return (textContent.startsWith('{') && textContent.endsWith('}')) ||
                (textContent.startsWith('[') && textContent.endsWith(']'));
        }
        return false;
    }

    function getJsonText() {
        if (document.body) {
            if (document.body.firstChild && document.body.firstChild.nodeName === 'PRE') {
                return document.body.firstChild.textContent;
            }
            return document.body.textContent;
        }
        return null;
    }

    // 如果已弹出错误警告或符合特殊URL条件已处理，则不创建按钮
    if (typeof alert === 'function' &&
        (window.location.href.startsWith('https://live.radiance.thatgamecompany.com/account/auth/oauth_redirect'))) {
        // 已在上面处理
    } else {
        // 常规页面显示按钮
        if (isLikelyJsonPage()) {
            const button = document.createElement('button');
            button.id = 'copyJsonButton';
            button.textContent = 'Copy';
            button.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 99999;
                background-color: #2196F3; /* 蓝色 */
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;

            button.addEventListener('click', () => {
                const jsonText = getJsonText();
                if (jsonText) {
                    try {
                        const parsed = JSON.parse(jsonText);
                        GM_setClipboard(JSON.stringify(parsed, null, 2), 'text');
                        button.textContent = 'Copied!';
                    } catch (e) {
                        console.warn('JSON parse error:', e);
                        GM_setClipboard(jsonText, 'text');
                        button.textContent = 'Copied (raw)';
                    }
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                } else {
                    button.textContent = 'No JSON';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                }
            });

            document.body.appendChild(button);
        }
    }
})();
