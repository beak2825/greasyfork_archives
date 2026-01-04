// ==UserScript==
// @name         漫猫/miobt动漫磁链提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取漫猫动漫的磁链并显示复制框，阻止自动跳转
// @author       你
// @match        http://*.kisssub.org/*
// @match        http://*.comicat.org/*
// @match        http://*.miobt.com/*
// @match        https://*.kisssub.org/*
// @match        https://*.comicat.org/*
// @match        https://*.miobt.com/*
// @include      http://*.kisssub.org/*
// @include      http://*.comicat.org/*
// @include      http://*.miobt.com/*
// @include      https://*.kisssub.org/*
// @include      https://*.comicat.org/*
// @include      https://*.miobt.com/*
// @grant        none
// @license      MIT  
// @downloadURL https://update.greasyfork.org/scripts/545930/%E6%BC%AB%E7%8C%ABmiobt%E5%8A%A8%E6%BC%AB%E7%A3%81%E9%93%BE%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545930/%E6%BC%AB%E7%8C%ABmiobt%E5%8A%A8%E6%BC%AB%E7%A3%81%E9%93%BE%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 根据提供的HTML结构配置的选择器
    const MAGNET_BUTTON_SELECTOR = 'a#magnet'; // 磁链按钮的选择器（id为magnet的a标签）
    const MAGNET_ATTR_NAME = 'href'; // 磁链存储在href属性中

    // 创建复制弹窗
    function createCopyDialog(magnetLink) {
        // 移除已存在的弹窗
        const oldDialog = document.getElementById('magnet-dialog');
        if (oldDialog) oldDialog.remove();

        // 创建弹窗元素
        const dialog = document.createElement('div');
        dialog.id = 'magnet-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;


        const title = document.createElement('h3');
        title.textContent = '磁链已提取';
        title.style.margin = '0 0 15px 0';
        title.style.color = '#333';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = magnetLink;
        input.style.cssText = `
            width: 500px;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        `;
        input.readOnly = true;
        input.onclick = () => input.select(); 


        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'right';


        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制磁链';
        copyBtn.style.cssText = `
            padding: 8px 16px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        `;
        copyBtn.onclick = () => {
            input.select();
            document.execCommand('copy');
            copyBtn.textContent = '已复制!';
            copyBtn.style.background = '#34a853';
            setTimeout(() => {
                dialog.remove();
            }, 1000);
        };


        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            padding: 8px 16px;
            background: #f8f9fa;
            color: #333;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        closeBtn.onclick = () => dialog.remove();


        dialog.appendChild(title);
        dialog.appendChild(input);
        buttonContainer.appendChild(copyBtn);
        buttonContainer.appendChild(closeBtn);
        dialog.appendChild(buttonContainer);
        document.body.appendChild(dialog);
    }


    function setupMagnetListener() {

        document.querySelectorAll(MAGNET_BUTTON_SELECTOR).forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止默认跳转行为
                e.stopPropagation(); // 阻止事件冒泡
                const magnetLink = this.getAttribute(MAGNET_ATTR_NAME);
                if (magnetLink && magnetLink.startsWith('magnet:')) {
                    createCopyDialog(magnetLink);
                }
            }, true);
        });

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        node.querySelectorAll(MAGNET_BUTTON_SELECTOR).forEach(button => {
                            // 避免重复添加事件监听
                            if (!button.dataset.magnetListener) {
                                button.dataset.magnetListener = 'true';
                                button.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const magnetLink = this.getAttribute(MAGNET_ATTR_NAME);
                                    if (magnetLink && magnetLink.startsWith('magnet:')) {
                                        createCopyDialog(magnetLink);
                                    }
                                }, true);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'complete') {
        setupMagnetListener();
    } else {
        window.addEventListener('load', setupMagnetListener);
    }
})();
