// ==UserScript==
// @name         随机密码生成器
// @namespace    ErisGreyrat
// @version      2024-04-10
// @description  点击页面左下角按钮输入位数生成随机密码到剪贴板
// @author       Eris Greyrat
// @match        *://*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492126/%E9%9A%8F%E6%9C%BA%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/492126/%E9%9A%8F%E6%9C%BA%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function createButton() {
        var button = document.createElement('button');
        button.textContent = '生成密码';
        button.style.position = 'fixed';
        button.style.bottom = '100px'; // 调整按钮位置到左下角
        button.style.left = '20px'; // 调整按钮位置到左下角
        button.style.zIndex = '9999';
        button.style.padding = '3px 8px'; // 调整按钮大小
        button.style.backgroundColor = '#007bff'; // 设置蓝色背景色
        button.style.color = '#fff'; // 设置文本颜色为白色
        button.style.border = 'none'; // 去除边框
        button.style.borderRadius = '10px'; // 设置圆角
        button.style.cursor = 'pointer'; // 鼠标指针样式为手型
        button.addEventListener('click', function() {
            var length = prompt('请输入密码位数', '32'); // 弹出输入框，让用户自定义密码位数，默认为32
            if (length && !isNaN(length) && length > 0) {
                var password = generatePassword(parseInt(length));
                copyToClipboard(password);
                showMessage('密码已生成并复制到剪贴板');
            } else {
                alert('请输入有效的数字作为密码位数');
            }
        });
        document.body.appendChild(button);
    }

    // 生成随机密码
    function generatePassword(length) {
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        var password = "";
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(function() {
                console.log('密码已复制到剪贴板:', text);
            })
            .catch(function(err) {
                console.error('复制到剪贴板时出错:', err);
            });
    }

    // 显示消息
    function showMessage(message) {
        var msgBox = document.createElement('div');
        msgBox.textContent = message;
        msgBox.style.position = 'fixed';
        msgBox.style.top = '10%';
        msgBox.style.left = '50%';
        msgBox.style.transform = 'translate(-50%, -50%)';
        msgBox.style.backgroundColor = '#DB7093';
        msgBox.style.color = '#fff';
        msgBox.style.padding = '15px';
        msgBox.style.borderRadius = '5px';
        msgBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)'; // 添加阴影
        msgBox.style.zIndex = '9999';
        document.body.appendChild(msgBox);

        var progress = document.createElement('div');
        progress.style.height = '2px';
        progress.style.backgroundColor = '#ddd';
        progress.style.borderRadius = '1px';
        msgBox.appendChild(progress);

        var width = 0;
        var id = setInterval(frame, 20);

        function frame() {
            if (width >= 100) {
                clearInterval(id);
                msgBox.parentNode.removeChild(msgBox);
            } else {
                width++;
                progress.style.width = width + '%';
            }
        }
    }

    // 创建按钮
    createButton();
})();
