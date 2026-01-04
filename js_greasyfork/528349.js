// ==UserScript==
// @name         淘宝宝贝ID复制助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       yuensui
// @description  淘宝商品页左上角ID显示窗，点击后复制
// @match        *://item.taobao.com/item.htm*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528349/%E6%B7%98%E5%AE%9D%E5%AE%9D%E8%B4%9DID%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528349/%E6%B7%98%E5%AE%9D%E5%AE%9D%E8%B4%9DID%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    GM_addStyle(`
        .taobao-id-box {
            position: fixed;
            left: 20px;
            top: 20px;
            background: linear-gradient(135deg, #FF6A00 0%, #FF8C00 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            z-index: 99999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .copy-feedback {
            animation: fadeScale 0.8s ease-out;
            position: fixed;
            left: 20px;
            top: 68px;
            background: rgba(255,255,255,0.95);
            color: #2ecc71;
            padding: 8px 16px;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-size: 13px;
            border: 1px solid #2ecc7133;
        }

        @keyframes fadeScale {
            0% { opacity:0; transform: translateY(10px); }
            30% { opacity:1; transform: translateY(0); }
            100% { opacity:0; transform: translateY(-10px); }
        }
    `);

    // 创建主信息窗
    function createInfoBox(id) {
        const box = document.createElement('div');
        box.className  = 'taobao-id-box';
        box.innerHTML  = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19M7,7H17V9H7V7M7,11H17V13H7V11M7,15H14V17H7V15Z"/>
            </svg>
            <span style="font-weight:500;">${
              id}</span>
        `;

        // 点击事件
        box.addEventListener('click',  () => {
            GM_setClipboard(id);
            showFeedbackAnimation(box);
            triggerBoxFeedback(box);
        });

        return box;
    }

    // 触发信息窗反馈
    function triggerBoxFeedback(element) {
        element.style.transform  = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform  = 'scale(1)';
            element.style.background  = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            setTimeout(() => {
                element.style.background  = 'linear-gradient(135deg, #FF6A00 0%, #FF8C00 100%)';
            }, 800);
        }, 100);
    }

    // 显示浮动提示
    function showFeedbackAnimation() {
        const tip = document.createElement('div');
        tip.className  = 'copy-feedback';
        tip.textContent  = '✓ 已复制到剪贴板';
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(),  1000);
    }

    // 主逻辑
    function main() {
        const itemId = new URLSearchParams(location.search).get('id');
        if (!itemId || document.querySelector('.taobao-id-box'))  return;

        document.body.appendChild(createInfoBox(itemId));
    }

    // 监听页面变化
    new MutationObserver(main).observe(document, {
        childList: true,
        subtree: true
    });
    main();
})();