// ==UserScript==
// @name         Wallos日期格式优化+切换按钮
// @namespace    http://tampermonkey.net/
// @version      3.2
// @license MIT
// @description  修改日期格式并添加右上角切换按钮（Jul 15 ↔ 7-15）
// @author       You
// @match        http://192.168.2.66:8282/*
// @exclude      http://192.168.2.66:3003/*
// @exclude      http://192.168.2.66:5000/*
// @exclude      http://192.168.2.66:3210/*
// @exclude      http://192.168.2.66:8080/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541016/Wallos%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E4%BC%98%E5%8C%96%2B%E5%88%87%E6%8D%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/541016/Wallos%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E4%BC%98%E5%8C%96%2B%E5%88%87%E6%8D%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加切换按钮的样式（右上角位置）
    GM_addStyle(`
        #dateFormatToggle {
            position: fixed;
            top: 20px;        /* 修改为右上角 */
            right: 20px;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 14px;
            transition: all 0.3s;
        }
        #dateFormatToggle:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
    `);

    // 月份缩写到数字的映射
    const monthMap = {
        'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4',
        'May': '5', 'Jun': '6', 'Jul': '7', 'Aug': '8',
        'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };

    // 全局状态管理
    let isOriginalFormat = false;
    const dateElements = new Map();

    // 创建切换按钮（右上角位置）
    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'dateFormatToggle';
        updateButtonText(toggleBtn); // 初始设置按钮文字
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', function() {
            isOriginalFormat = !isOriginalFormat;
            updateButtonText(toggleBtn); // 更新按钮文字
            updateAllDates();
        });
    }

    // 更新按钮文字（根据当前状态）
    function updateButtonText(button) {
        button.textContent = isOriginalFormat ? '切换为新格式' : '切换为原始格式';
    }

    // 转换日期格式的核心函数
    function convertDateFormat(dateStr) {
        const normalized = dateStr.trim();
        if (/^[A-Za-z]{3} \d{1,2}$/.test(normalized)) {
            const [month, day] = normalized.split(' ');
            return `${monthMap[month]}-${parseInt(day)}`;
        }
        else if (/^[A-Za-z]{3} \d{4}$/.test(normalized)) {
            const [month, year] = normalized.split(' ');
            return `${year}-${monthMap[month]}`;
        }
        return dateStr;
    }

    // 更新单个日期元素
    function updateDateElement(el) {
        if (!dateElements.has(el)) {
            const originalText = el.textContent;
            const convertedText = convertDateFormat(originalText);
            dateElements.set(el, { originalText, convertedText });
        }

        const { originalText, convertedText } = dateElements.get(el);
        el.textContent = isOriginalFormat ? originalText : convertedText;
    }

    // 更新所有日期元素
    function updateAllDates() {
        document.querySelectorAll('.subscription > .subscription-main > .next').forEach(el => {
            if (el.children.length === 0) {
                updateDateElement(el);
            }
        });
    }

    // 初始化函数
    function init() {
        createToggleButton();
        updateAllDates();

        // 监听动态内容变化
        new MutationObserver(updateAllDates).observe(
            document.querySelector('.subscription-container'),
            { childList: true, subtree: true }
        );
    }

    // 确保在DOM完全加载后执行
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();