// ==UserScript==
// @name         简洁 Cookie 获取工具222
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license GPL
// @description  简洁方式获取网站 Cookies
// @match        *://*/*
// @grant        GM_cookie
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527822/%E7%AE%80%E6%B4%81%20Cookie%20%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7222.user.js
// @updateURL https://update.greasyfork.org/scripts/527822/%E7%AE%80%E6%B4%81%20Cookie%20%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7222.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #cookie-retrieval-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        }

        #cookie-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 10px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }

        #cookie-textarea {
            width: 100%;
            height: 300px;
            margin-bottom: 10px;
            padding: 10px;
            box-sizing: border-box;
            resize: vertical;
            font-family: monospace;
        }

        .cookie-buttons {
            display: flex;
            justify-content: space-between;
        }

        .cookie-buttons button {
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        #copy-btn {
            background-color: #4CAF50;
            color: white;
        }

        #close-btn {
            background-color: #f44336;
            color: white;
        }
    `);

    // 创建 Cookie 获取按钮
    function createCookieButton() {
        const btn = document.createElement('button');
        btn.id = 'cookie-retrieval-btn';
        btn.textContent = '获取 Cookies';
        btn.onclick = retrieveCookies;
        document.body.appendChild(btn);
    }

    // 创建 Cookie 模态框
    function createCookieModal(cookieContent) {
        // 如果已存在模态框，先移除
        const existingModal = document.getElementById('cookie-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'cookie-modal';
        modal.innerHTML = `
            <textarea id="cookie-textarea" readonly>${cookieContent}</textarea>
            <div class="cookie-buttons">
                <button id="copy-btn">复制 Cookies</button>
                <button id="close-btn">关闭</button>
            </div>
        `;

        document.body.appendChild(modal);

        // 复制按钮事件
        document.getElementById('copy-btn').onclick = () => {
            const textarea = document.getElementById('cookie-textarea');
            textarea.select();

            try {
                // 使用 GM_setClipboard
                GM_setClipboard(textarea.value);
                alert('Cookies 已成功复制！');
            } catch(e) {
                // 兼容性降级方案
                navigator.clipboard.writeText(textarea.value)
                    .then(() => alert('Cookies 已成功复制！'))
                    .catch(err => alert('复制失败：' + err));
            }
        };

        // 关闭按钮事件
        document.getElementById('close-btn').onclick = () => {
            modal.remove();
        };
    }

    // 保存原始的 XMLHttpRequest
    const originalXHR = unsafeWindow.XMLHttpRequest;
    let oldXHR = unsafeWindow.XMLHttpRequest;
    // 创建 XHR 拦截函数
    function fuckXHR() {
        const xhr = new oldXHR();
        const oldOpen = xhr.open;
        const oldSend = xhr.send;
        const oldSetRequestHeader = xhr.setRequestHeader;

        xhr.setRequestHeader = function(name, value) {
          //  console.log("Xheadessssssssssss:", name, value);
            oldSetRequestHeader.apply(this, arguments);
        }


        xhr.open = function(method, url, async, user, password) {
            // 检查是否是目标 URL
            if (url.includes('/i/api/1.1/jot/client_event.json')) {
                console.log("检测到目标请求:", url);
                // 获取当前页面的所有 cookies
                GM_cookie.list({}, function(cookies) {
                    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
                    console.log("请求的 Cookies:", cookieStr);
                    createCookieModal(cookieStr);
                });
            }
            return oldOpen.apply(this, arguments);
        };

        xhr.send = function(data) {
            if (data != null) {

            }

            const oldOnReadyStateChange = xhr.onreadystatechange;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {

                    //  console.log("XHR Response:", xhr.responseText);
                }
                if (oldOnReadyStateChange) {
                    return oldOnReadyStateChange.apply(this, arguments);
                }
            };

                return oldSend.apply(this,arguments)


        };

        return xhr;
    }

    // 获取 Cookies 的主函数
    function retrieveCookies() {
        unsafeWindow.XMLHttpRequest = fuckXHR;
        alert('Cookie 监控已启动，正在等待 client_event.json 请求...');
    }

    // 页面加载完成后初始化
    function init() {
        // 延迟创建按钮，避免与页面脚本冲突
        setTimeout(createCookieButton, 1000);
    }

    // 监听页面加载
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // 在页面卸载时恢复原始 XMLHttpRequest
    window.addEventListener('unload', () => {
        window.XMLHttpRequest = originalXHR;
    });
})();