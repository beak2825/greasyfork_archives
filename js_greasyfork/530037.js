// ==UserScript==
// @name 微信公众号HTML手动清理与插入剪贴板内容
// @namespace http://tampermonkey.net/
// @version 0.3
// @description 在微信公众号页面添加按钮，手动清除或插入剪贴板内容到指定路径
// @author Xsir
// @match *://mp.weixin.qq.com/cgi-bin/appmsg*
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/530037/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7HTML%E6%89%8B%E5%8A%A8%E6%B8%85%E7%90%86%E4%B8%8E%E6%8F%92%E5%85%A5%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/530037/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7HTML%E6%89%8B%E5%8A%A8%E6%B8%85%E7%90%86%E4%B8%8E%E6%8F%92%E5%85%A5%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function () {
        // 创建控制面板
        let controlPanel = document.createElement('div');
        controlPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #fff;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
        `;

        // 清除按钮
        let clearButton = document.createElement('button');
        clearButton.textContent = '清除内容';
        clearButton.style.cssText = 'margin-right: 10px; padding: 5px 10px;';
        clearButton.onclick = function () {
            let targetElement = document.querySelector('#ueditor_0 > div > div > div > div');
            if (targetElement) {
                targetElement.innerHTML = '';
                console.log('内容已清除');
            } else {
                console.log('未找到目标元素');
                alert('未找到目标元素 #ueditor_0 > div > div > div > div');
            }
        };

        // 插入按钮（插入剪贴板内容）
        let insertButton = document.createElement('button');
        insertButton.textContent = '插入剪贴板内容';
        insertButton.style.cssText = 'padding: 5px 10px;';
        insertButton.onclick = async function () {
            let targetElement = document.querySelector('#ueditor_0 > div > div > div > div');
            if (targetElement) {
                try {
                    // 读取剪贴板内容
                    const clipboardText = await navigator.clipboard.readText();
                    if (clipboardText) {
                        // 将剪贴板内容插入目标元素
                        targetElement.innerHTML = clipboardText;
                        console.log('剪贴板内容已插入:', clipboardText);
                    } else {
                        console.log('剪贴板为空');
                        alert('剪贴板为空，请先复制内容');
                    }
                } catch (err) {
                    console.error('读取剪贴板失败:', err);
                    alert('读取剪贴板失败，请确保浏览器支持并已授予权限');
                }
            } else {
                console.log('未找到目标元素');
                alert('未找到目标元素 #ueditor_0 > div > div > div > div');
            }
        };

        // 将按钮添加到控制面板
        controlPanel.appendChild(clearButton);
        controlPanel.appendChild(insertButton);

        // 将控制面板添加到页面
        document.body.appendChild(controlPanel);

        console.log('控制面板已添加');
    });

})(); 