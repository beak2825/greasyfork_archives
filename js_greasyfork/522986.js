// ==UserScript==
// @name         替换所有 iframe 中的 h 标签 - Flowoss
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 Flowoss 页面中替换所有 iframe 中的 h 标签为 p 标签，支持按钮点击、页面点击和每秒自动执行
// @author       你的名字
// @match        *://app.flowoss.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522986/%E6%9B%BF%E6%8D%A2%E6%89%80%E6%9C%89%20iframe%20%E4%B8%AD%E7%9A%84%20h%20%E6%A0%87%E7%AD%BE%20-%20Flowoss.user.js
// @updateURL https://update.greasyfork.org/scripts/522986/%E6%9B%BF%E6%8D%A2%E6%89%80%E6%9C%89%20iframe%20%E4%B8%AD%E7%9A%84%20h%20%E6%A0%87%E7%AD%BE%20-%20Flowoss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '开始';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#ffffff';
    button.style.color = '#ffffff'; // 修改文字颜色为黑色
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 添加按钮到页面
    document.body.appendChild(button);

    // 自定义弹窗函数
    function showCustomAlert(message) {
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.backgroundColor = '#ffffff';
        alertBox.style.color = '#ffffff'; // 修改文字颜色为黑色
        alertBox.style.padding = '10px 20px';
        alertBox.style.borderRadius = '5px';
        alertBox.style.zIndex = '10000';
        alertBox.textContent = message;

        document.body.appendChild(alertBox);

        // 0.3秒后移除弹窗
        setTimeout(() => {
            alertBox.remove();
        }, 300);
    }

    // 替换所有 iframe 中的 h 标签为 p 标签的函数
    function replaceAllHTags() {

         // 批量删除指定的标签
        const elementsToRemove = [
            'div.ActivityBar.flex.flex-col.justify-between',
            'div.SideBar.bg-surface.flex.flex-col',
            'div.typescale-body-small.text-outline.flex.h-6.items-center.justify-between',
            'div.flex.items-center.justify-between'
        ];

        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.remove();
                }
            });
        });

        // 获取所有 iframe
        const iframes = document.querySelectorAll('iframe');
        if (iframes.length > 0) {
            let totalReplaced = 0;

            iframes.forEach(iframe => {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // 获取所有 h1 到 h6 标签
                const hTags = iframeDoc.querySelectorAll('h1, h2, h3, h4, h5, h6');
                hTags.forEach(hTag => {
                    // 创建新的 p 标签
                    const newP = iframeDoc.createElement('p');
                    newP.textContent = hTag.textContent;

                    // 替换 h 标签为 p 标签
                    hTag.replaceWith(newP);
                    totalReplaced++;
                });
            });

            // 如果需要显示替换数量，可以取消注释
            // showCustomAlert(`成功替换了 ${totalReplaced} 个 h 标签！`);
        } else {
            showCustomAlert('未找到 iframe！');
        }
    }

    // 按钮点击事件
    button.addEventListener('click', () => {
        replaceAllHTags();
    });

    // 页面点击事件：点击页面任意位置触发
    document.addEventListener('click', (event) => {
        // 排除按钮本身的点击事件
        if (event.target !== button) {
            replaceAllHTags();
        }
    });

    // 每秒自动执行替换操作
    setInterval(() => {
        replaceAllHTags();
    }, 100); // 1000ms = 1秒
})();