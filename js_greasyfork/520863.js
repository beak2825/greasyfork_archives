// ==UserScript==
// @name         Block GIFs and Images with UI 屏蔽网站gif图片
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Manually block GIFs and images via a popup UI (save and refresh behavior) 隐藏gif、图片
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/520863/Block%20GIFs%20and%20Images%20with%20UI%20%E5%B1%8F%E8%94%BD%E7%BD%91%E7%AB%99gif%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/520863/Block%20GIFs%20and%20Images%20with%20UI%20%E5%B1%8F%E8%94%BD%E7%BD%91%E7%AB%99gif%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
(function() {
    'use strict';

        // 注册菜单命令
    GM_registerMenuCommand('粘贴屏蔽图链接', function() {
        showTextBoxPopup();
    });

    // 显示一个文本框弹出框，用户可以粘贴链接
    function showTextBoxPopup() {
        // 创建弹出框
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'white';
        popup.style.border = '2px solid #007bff';
        popup.style.borderRadius = '10px';
        popup.style.zIndex = '9999';
        popup.style.maxWidth = '400px';
        popup.style.minWidth = '300px';

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '粘贴屏蔽图链接';
        title.style.textAlign = 'center';
        popup.appendChild(title);

        // 创建输入框
        const inputField = document.createElement('textarea');
        inputField.placeholder = '请粘贴屏蔽图链接';
        inputField.style.width = '100%';
        inputField.style.height = '100px';
        inputField.style.padding = '10px';
        inputField.style.fontSize = '14px';
        inputField.style.marginBottom = '10px';
        inputField.style.border = '1px solid #ccc';
        inputField.style.borderRadius = '5px';

        // 创建确认按钮
        const submitButton = document.createElement('button');
        submitButton.textContent = '确认';
        submitButton.style.width = '100%';
        submitButton.style.padding = '10px';
        submitButton.style.backgroundColor = '#007bff';
        submitButton.style.color = 'white';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '5px';
        submitButton.style.cursor = 'pointer';

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.backgroundColor = '#ccc';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        // 确认按钮点击事件
        submitButton.addEventListener('click', function() {
            const blockedImages = GM_getValue('blockedImages', []);
            const link = inputField.value.trim();
            const newLinks = inputField.value.split('\n').map(link => link.trim()).filter(link => link !== '');
            const allLinks = [...blockedImages, ...newLinks]; // 将新链接添加到已保存的列表
            GM_setValue('blockedImages', allLinks);  // 保存所有链接
            location.reload();  // 刷新页面
        });

        // 关闭按钮点击事件
        closeButton.addEventListener('click', function() {
            popup.remove();
        });

        // 将元素添加到弹出框中
        popup.appendChild(inputField);
        popup.appendChild(submitButton);
        popup.appendChild(closeButton);

        // 将弹出框添加到页面中
        document.body.appendChild(popup);
    }

    // 获取并屏蔽图片
    function blockImages() {
        const blockedImages = GM_getValue('blockedImages', []);
        if (blockedImages.length === 0) return;
        doBlockMages(blockedImages);

        // 使用 MutationObserver 动态监听添加到 DOM 中的图片
        const observer = new MutationObserver(() => {
            doBlockMages(blockedImages);
        });

        // 配置 MutationObserver，监听整个页面 body 元素中的子元素变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function doBlockMages(blockedImages) {
        const images = document.getElementsByTagName('img');
        for (let img of images) {
            const imgSrc = img.src;
            // 对每个屏蔽的图片链接进行匹配，隐藏匹配的图片
            for (let blockedImage of blockedImages) {
                if (imgSrc.includes(blockedImage)) {
                    img.style.display = 'none';  // 隐藏图片
                }
            }
        }
    }

    // 每次页面加载时，重新应用屏蔽图片规则
    window.addEventListener('load', blockImages);

})();
