// ==UserScript==
// @name         Bilibili Cookie获取
// @namespace    https://github.com/MengNianxiaoyao
// @version      0.2.4
// @description  设置typora的b站图床程序的上传命令
// @author       MengNianxiaoyao
// @match        https://www.bilibili.com/zhibi-image-upload
// @license MIT
// @grant        GM_cookie
// @grant        GM_setClipboard
// @icon data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' color='rgb(1,153,212)' width='1.5em' height='1.5em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M7.172 2.757L10.414 6h3.171l3.243-3.242a1 1 0 1 1 1.415 1.415L16.414 6H18.5A3.5 3.5 0 0 1 22 9.5v8a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 2 17.5v-8A3.5 3.5 0 0 1 5.5 6h2.085L5.757 4.171a1 1 0 0 1 1.415-1.415M18.5 8h-13a1.5 1.5 0 0 0-1.493 1.356L4 9.5v8a1.5 1.5 0 0 0 1.356 1.493L5.5 19h13a1.5 1.5 0 0 0 1.493-1.355L20 17.5v-8A1.5 1.5 0 0 0 18.5 8M8 11a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1'/%3E%3C/svg%3E
// @downloadURL https://update.greasyfork.org/scripts/539296/Bilibili%20Cookie%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539296/Bilibili%20Cookie%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        try {
            creatbutton()
        } catch (error) {
          console.error(error);
        }
    }
    function showTimedAlert(message, duration = 3000) {
        const alertBox = document.createElement('div');
        alertBox.textContent = message;
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        alertBox.style.color = 'white';
        alertBox.style.padding = '10px 20px';
        alertBox.style.borderRadius = '5px';
        alertBox.style.zIndex = '10001';
        alertBox.style.opacity = '0';
        alertBox.style.transition = 'opacity 0.5s ease-in-out';

        document.body.appendChild(alertBox);

        setTimeout(() => {
            alertBox.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            alertBox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(alertBox);
            }, 500); // Wait for fade out transition
        }, duration);
    }

    function creatbutton() {
        const button = document.createElement('button');
        button.textContent = '设置上传命令';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '100px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#00a1d6';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = getBilibiliCookies;
        document.body.appendChild(button);
    }
    function getBilibiliCookies() {
        GM_cookie.list({
            url: 'https://www.bilibili.com/zhibi-image-upload'
        }, function(cookies, error) {
            if (error) {
                console.error('Error getting cookies:', error);
                showTimedAlert('获取Cookie时发生错误：' + error);
                return;
            }

            let sessdata = cookies.find(cookie => cookie.name === 'SESSDATA');
            let bili_jct = cookies.find(cookie => cookie.name === 'bili_jct');
            let cookieString = '';

            if (sessdata && bili_jct) {
                cookieString = `token=${sessdata.value} csrf=${bili_jct.value}`;
            } else {
                showTimedAlert('未找到Bilibili Cookie。');
            }

            let existingInputContainer = document.querySelector('.bilibili-cookie-input-container');
            if (existingInputContainer) {
                existingInputContainer.remove();
                return; // 如果存在则移除并退出，实现再次点击关闭
            }

            const inputContainer = document.createElement('div');
            inputContainer.classList.add('bilibili-cookie-input-container');
            inputContainer.style.position = 'fixed';
            inputContainer.style.top = '50%';
            inputContainer.style.left = '50%';
            inputContainer.style.transform = 'translate(-50%, -50%)';
            inputContainer.style.backgroundColor = 'white';
            inputContainer.style.border = '1px solid #ccc';
            inputContainer.style.padding = '20px';
            inputContainer.style.zIndex = '10000';
            inputContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            inputContainer.style.borderRadius = '8px';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = '';
            input.placeholder = '输入程序路径';
            input.style.width = '300px';
            input.style.padding = '8px';
            input.style.marginRight = '10px';
            input.style.border = '1px solid #ddd';
            input.style.borderRadius = '4px';

            const copyButton = document.createElement('button');
            copyButton.textContent = '复制';
            copyButton.style.padding = '8px 15px';
            copyButton.style.backgroundColor = '#00a1d6';
            copyButton.style.color = 'white';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '4px';
            copyButton.style.cursor = 'pointer';
            copyButton.onclick = function() {
                if (!input.value) {
                    showTimedAlert('路径为空！')
                } else {
                    GM_setClipboard(input.value + ' ' + cookieString);
                    showTimedAlert('内容已复制到剪贴板！');
                    document.body.removeChild(inputContainer);
                }
            };

            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.style.padding = '8px 15px';
            closeButton.style.backgroundColor = '#f44336';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '4px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.marginLeft = '10px';
            closeButton.onclick = function() {
                document.body.removeChild(inputContainer);
            };

            inputContainer.appendChild(input);
            inputContainer.appendChild(copyButton);
            inputContainer.appendChild(closeButton);
            document.body.appendChild(inputContainer);
        });
    }
    setTimeout(init, 500);
})();