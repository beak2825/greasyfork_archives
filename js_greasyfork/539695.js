// ==UserScript==
// @name         飞书社区 AI 摘要自动展开
// @namespace    http://21zys.com/
// @version      2.0
// @description  通过重试机制智能等待并点击飞书社区的AI摘要“展开”按钮，解决点击失效问题。
// @author       21zys
// @match        https://larkcommunity.feishu.cn/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539695/%E9%A3%9E%E4%B9%A6%E7%A4%BE%E5%8C%BA%20AI%20%E6%91%98%E8%A6%81%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/539695/%E9%A3%9E%E4%B9%A6%E7%A4%BE%E5%8C%BA%20AI%20%E6%91%98%E8%A6%81%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 步骤 1: 添加您指定的 CSS 样式 ---
    const customCSS = `
        .ai-quota-exceed-mask {
            display: none !important;
        }
    `;
    GM_addStyle(customCSS);
    console.log('【飞书脚本 V2】样式已应用。');

    // --- 步骤 2: 自动点击“展开”按钮 (增强版逻辑) ---

    // 使用一个更稳定、更短的选择器
    const expandButtonSelector = '.ai-summary-content-editable-expand-button-wrapper button';
    let clickAttempts = 0;
    const maxClickAttempts = 5; // 最多尝试点击5次

    // 定义点击函数，包含重试逻辑
    const tryClickButton = (button) => {
        if (clickAttempts >= maxClickAttempts) {
            console.log(`【飞书脚本 V2】已尝试点击 ${maxClickAttempts} 次，但按钮依然存在，可能点击无效。停止重试。`);
            return;
        }
        clickAttempts++;
        console.log(`【飞书脚本 V2】正在进行第 ${clickAttempts} 次点击尝试...`);
        button.click();

        // 点击后短暂等待，检查按钮是否还存在于页面上
        setTimeout(() => {
            // 如果按钮仍然存在，说明点击可能没生效，再次尝试
            if (document.querySelector(expandButtonSelector)) {
                console.log('【飞书脚本 V2】点击后按钮依然存在，准备再次尝试。');
                tryClickButton(button);
            } else {
                console.log('【飞书脚本 V2】点击成功！按钮已消失。');
            }
        }, 500); // 每次点击后等待500毫秒检查结果
    };


    // 创建一个观察器，监视页面的变化
    const observer = new MutationObserver((mutationsList, obs) => {
        const expandButton = document.querySelector(expandButtonSelector);

        // 如果找到了目标按钮
        if (expandButton) {
            console.log('【飞书脚本 V2】已找到展开按钮，启动点击程序。', expandButton);
            // 找到后就停止观察，避免重复触发
            obs.disconnect();
            // 调用包含重试逻辑的点击函数
            tryClickButton(expandButton);
        }
    });

    // 配置并启动观察器
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('【飞书脚本 V2】已启动，正在监视页面...');

})();