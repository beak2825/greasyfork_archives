// ==UserScript==
// @name         洛谷专注模式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可自定义按钮样式的洛谷专注模式
// @author       zhangruixiang
// @match        https://www.luogu.com.cn/problem/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535786/%E6%B4%9B%E8%B0%B7%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535786/%E6%B4%9B%E8%B0%B7%E4%B8%93%E6%B3%A8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================== 自定义区域 ======================
    // 在这里修改按钮样式和位置（所有数值均可自由调整）
    const buttonConfig = {
        text: {
            normal:  "专注模式",      // 默认状态文字
            active:  "退出专注"       // 专注模式状态文字
        },
        position: {
            top: "80px",              // 距离顶部距离（支持px/rem/vh等）
            left: "100px",                 // 距离左侧距离（留空则为右侧按钮）
            right: "",            // 距离右侧距离
            bottom: ""                // 距离底部距离
        },
        style: {
            padding: "8px 15px",
            background: "linear-gradient(135deg, #6e8efb, #a777e3)", // 渐变背景色
            color: "white",
            border: "none",
            borderRadius: "50px",      // 圆形按钮可设为50%
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            cursor: "pointer",
            transition: "all 0.3s ease" // 悬停动画效果
        },
        hoverStyle: {                  // 鼠标悬停时的样式变化
            transform: "scale(1.05)",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)"
        }
    };
    // ======================================================

    // 创建样式表
    GM_addStyle(`
        #luogu-focus-btn {
            position: fixed;
            z-index: 9999;
            ${buttonConfig.position.top ? `top: ${buttonConfig.position.top};` : ''}
            ${buttonConfig.position.left ? `left: ${buttonConfig.position.left};` : ''}
            ${buttonConfig.position.right ? `right: ${buttonConfig.position.right};` : ''}
            ${buttonConfig.position.bottom ? `bottom: ${buttonConfig.position.bottom};` : ''}
            padding: ${buttonConfig.style.padding};
            background: ${buttonConfig.style.background};
            color: ${buttonConfig.style.color};
            border: ${buttonConfig.style.border};
            border-radius: ${buttonConfig.style.borderRadius};
            font-size: ${buttonConfig.style.fontSize};
            font-weight: ${buttonConfig.style.fontWeight};
            box-shadow: ${buttonConfig.style.boxShadow};
            cursor: ${buttonConfig.style.cursor};
            transition: ${buttonConfig.style.transition};
        }
        #luogu-focus-btn:hover {
            transform: ${buttonConfig.hoverStyle.transform};
            box-shadow: ${buttonConfig.hoverStyle.boxShadow};
        }
    `);

    // 创建按钮
    const toggleButton = document.createElement('button');
    toggleButton.id = 'luogu-focus-btn';
    toggleButton.textContent = buttonConfig.text.normal;
    document.body.appendChild(toggleButton);

    // 定义需要隐藏的元素选择器
    const elementsToHide = [
        '#header',           // 顶部导航栏
        '.side',             // 侧边栏
        '.footer',           // 页脚
        '.problem-btn-group' // 题目按钮组（可选）
    ];

    let isFocusMode = false;

    // 切换专注模式
    toggleButton.addEventListener('click', () => {
        isFocusMode = !isFocusMode;
        toggleButton.textContent = isFocusMode ? buttonConfig.text.active : buttonConfig.text.normal;

        if (isFocusMode) {
            // 隐藏非题目内容
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
            });
            // 调整题目区域
            const problemContent = document.querySelector('.problem-content');
            if (problemContent) {
                problemContent.style.margin = '0 auto';
                problemContent.style.maxWidth = '1000px'; // 可调整题目区域宽度
            }
        } else {
            // 恢复显示
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = '';
            });
            const problemContent = document.querySelector('.problem-content');
            if (problemContent) {
                problemContent.style.margin = '';
                problemContent.style.maxWidth = '';
            }
        }
    });
})();