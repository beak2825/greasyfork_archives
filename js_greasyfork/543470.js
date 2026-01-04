// ==UserScript==
// @name         闲鱼状态导出
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 .goofish.com 页面左下角添加一个悬浮按钮，点击后将 cookies 和 localStorage 指定项导出为 xianyu_state.json 文件。
// @author       SkyAerope
// @match        *://*.goofish.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543470/%E9%97%B2%E9%B1%BC%E7%8A%B6%E6%80%81%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/543470/%E9%97%B2%E9%B1%BC%E7%8A%B6%E6%80%81%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 创建并设置下载按钮的样式 ---
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '导出闲鱼状态';
    downloadBtn.id = 'export-state-btn'; // 给按钮一个ID，方便用 GM_addStyle 添加样式

    // 使用 GM_addStyle 来添加 CSS 样式，这是油猴脚本推荐的方式
    GM_addStyle(`
        #export-state-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            background-color: #ff8a00; /* 闲鱼橙色 */
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease;
        }
        #export-state-btn:hover {
            background-color: #e67e00; /* 鼠标悬停时颜色变深 */
        }
    `);

    // 将按钮添加到页面中
    document.body.appendChild(downloadBtn);

    // --- 2. 定义点击按钮后执行的下载函数 ---
    const downloadState = () => {
        console.log('开始导出闲鱼状态...');

        // 定义要从 localStorage 中获取的键
        const lsKey = '_lib_auto_login_havana_storage_arms_api_key_';
        const lsValue = localStorage.getItem(lsKey);

        // 解析当前页面的所有 cookies
        const cookies = document.cookie.split('; ')
          .filter(cookie => cookie.trim() !== '')
          .map(cookie => {
            const [name, ...rest] = cookie.split('=');
            const value = rest.join('=');
            return {
                name: decodeURIComponent(name),
                value: decodeURIComponent(value),
                domain: '.goofish.com',
                path: '/'
            };
          });

        // 构建最终输出的 JSON 对象
        const output = {
          cookies,
          origins: [
            {
              origin: "https://www.goofish.com",
              localStorage: [{ name: lsKey, value: lsValue || '' }]
            }
          ]
        };

        // 创建并下载 JSON 文件
        const blob = new Blob([JSON.stringify(output, null, 2)], {type: 'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'xianyu_state.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // 释放内存
        URL.revokeObjectURL(a.href);

        console.log('xianyu_state.json 文件已成功导出并触发下载。');
    };

    // --- 3. 为按钮绑定点击事件 ---
    downloadBtn.addEventListener('click', downloadState);

})();