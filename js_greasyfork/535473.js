// ==UserScript==
// @name         一键复制市场数据+ESC返回市场首页
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  一键复制市场JSON数据+ESC返回市场首页
// @author       Seyeye
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/535473/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%B8%82%E5%9C%BA%E6%95%B0%E6%8D%AE%2BESC%E8%BF%94%E5%9B%9E%E5%B8%82%E5%9C%BA%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/535473/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%B8%82%E5%9C%BA%E6%95%B0%E6%8D%AE%2BESC%E8%BF%94%E5%9B%9E%E5%B8%82%E5%9C%BA%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动提示样式
    GM_addStyle(`
        .mwi-notification {
            position: fixed;
            top: 60px;
            right: 300px;
            padding: 12px 20px;
            background: #4CAF50;
            color: white;
            border-radius: 4px;
            font-family: Arial;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s, fadeOut 0.3s 2s;
        }
        .mwi-notification.error {
            background: #f44336 !important;
        }

        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `);

    // 查找并点击"查看所有物品"按钮
    function isInputElement(target) {
        // 检测是否为输入框或可编辑元素
        return target.tagName === 'INPUT' ||
               target.tagName === 'TEXTAREA' ||
               target.isContentEditable;
    }

    function FindBackToMarketButton() {
        const buttons = document.querySelectorAll("button.Button_button__1Fe9z");
        for(const button of buttons) {
            if(button.textContent === "查看所有物品") {
                button.click();
                break;
            }
        }
    }

    document.addEventListener("keydown", (ev) => {
        if(ev.code === "Escape" &&
           !ev.altKey &&
           !ev.ctrlKey &&
           !ev.shiftKey &&
           !ev.metaKey) {

            // 当焦点在输入元素时不触发
            if(!isInputElement(ev.target)) {
                ev.preventDefault();
                FindBackToMarketButton();
            }
        }
    });

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent = '获取本地市场数据';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '10px',
        right: '300px',
        zIndex: 9999,
        padding: '10px 20px',
        background: '#ffb8c6',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: 'transform 0.1s'
    });

    // 按钮交互效果保持原有
    btn.addEventListener('mouseover', () => btn.style.transform = 'scale(1.02)');
    btn.addEventListener('mouseout', () => btn.style.transform = 'none');
    btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.98)');

    // 修改后的核心功能
    btn.addEventListener('click', () => {
        try {
            const jsonData = localStorage.getItem("MWITools_marketAPI_json");

            if (!jsonData) {
                showNotification('❌ 未找到市场数据', true);
                return;
            }

            // 添加数据格式验证
            try {
                JSON.parse(jsonData);
            } catch (e) {
                showNotification('❌ 数据格式异常', true);
                return;
            }

            GM_setClipboard(jsonData);
            showNotification('✅ 价格表已复制到剪贴板！');
        } catch (error) {
            console.error('复制失败:', error);
            showNotification('❌ 复制失败，请检查控制台', true);
        }
    });

    // 增强的通知函数
    function showNotification(text, isError = false) {
        const notice = document.createElement('div');
        notice.className = `mwi-notification${isError ? ' error' : ''}`;
        notice.textContent = text;
        document.body.appendChild(notice);

        setTimeout(() => {
            notice.style.animation = 'fadeOut 0.3s';
            setTimeout(() => notice.remove(), 300);
        }, 2000);
    }

    // 确保按钮正确注入
    document.body.appendChild(btn);
})();

