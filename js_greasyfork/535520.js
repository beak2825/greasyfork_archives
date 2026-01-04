// ==UserScript==
// @name         lc自用-出去走走步数助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  lc自用-为步数网站添加预设按钮
// @author       Your name
// @match        http://8.140.250.130/bushu/
// @grant        GM_addStyle
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535520/lc%E8%87%AA%E7%94%A8-%E5%87%BA%E5%8E%BB%E8%B5%B0%E8%B5%B0%E6%AD%A5%E6%95%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535520/lc%E8%87%AA%E7%94%A8-%E5%87%BA%E5%8E%BB%E8%B5%B0%E8%B5%B0%E6%AD%A5%E6%95%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成随机数的函数
    function getRandomNumber(base, range) {
        const min = base - range;
        const max = base + range;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 检查是否为移动设备
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 添加自定义样式
    GM_addStyle(`
        .custom-btn-container {
            margin-top: 10px;
            text-align: center;
            display: flex;
            justify-content: center;
            gap: ${isMobile() ? '5px' : '10px'};
            flex-wrap: wrap;
            width: 100%;
        }
        .custom-btn {
            background-color: #0094D9;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            flex: 1;
            max-width: ${isMobile() ? '45%' : '120px'};
        }
        .custom-btn.mobile {
            padding: 6px 10px;
            font-size: 12px;
            min-width: 60px;
            margin: 2px;
        }
        .custom-btn.desktop {
            padding: 8px 15px;
            font-size: 14px;
            min-width: 80px;
        }
    `);

    // 修改页面内容的函数
    function modifyPage() {
        // 修改"账号"文字
        const labels = document.querySelectorAll('.layui-form-label');
        labels.forEach(label => {
            if (label.textContent === '账号') {
                label.textContent = '账aaa号';
            }
        });

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'custom-btn-container';

        // 预设值数组
        const presetValues = [
            { name: '八千', value: 8000 },
            { name: '一万三', value: 13000 },
            { name: '一万八', value: 18000 },
            { name: '两万一', value: 21000 }
        ];

        // 创建按钮
        presetValues.forEach(preset => {
            const button = document.createElement('button');
            button.textContent = preset.name;
            button.className = `custom-btn ${isMobile() ? 'mobile' : 'desktop'}`;

            // 添加点击事件
            button.addEventListener('click', function() {
                const input = document.querySelector('#steps');
                if (input) {
                    const randomValue = getRandomNumber(preset.value, 500);
                    input.value = randomValue;
                    
                    // 延迟500毫秒后自动点击提交按钮
                    setTimeout(() => {
                        const submitButton = document.querySelector('.subButton');
                        if (submitButton) {
                            submitButton.click();
                        }
                    }, 500);
                }
            });

            buttonContainer.appendChild(button);
        });

        // 找到提交按钮并插入按钮容器
        const submitButton = document.querySelector('.subButton');
        if (submitButton) {
            submitButton.parentNode.insertBefore(buttonContainer, submitButton.nextSibling);
        }
    }

    // 确保页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyPage);
    } else {
        modifyPage();
    }
})(); 