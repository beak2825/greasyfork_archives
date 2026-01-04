// ==UserScript==
// @name         微信读书鼠标滚轮翻页
// @namespace    http://tampermonkey.net/
// @version      2025-02-04
// @description  try to roll out tencent!
// @author       Xiuperion
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525877/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/525877/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 防抖控制
    let isScrolling = false;
    // 定义按钮选择器（根据 class 组合）
    const prevBtnSelector = '.renderTarget_pager_button'; // 假设这是"上一页"
    const nextBtnSelector = '.renderTarget_pager_button.renderTarget_pager_button_right'; // 组合类名选择器

    // 核心翻页逻辑
    function handleWheel(event) {
        event.preventDefault();

        if (!isScrolling) {
            isScrolling = true;
            setTimeout(() => isScrolling = false, 100); // 100ms 防抖

            // 动态查找最新按钮（应对SPA动态渲染）
            const prevBtn = document.querySelector(prevBtnSelector);
            const nextBtn = document.querySelector(nextBtnSelector);

            if (event.deltaY > 0 && nextBtn) {
                nextBtn.click();
                console.log('下一页触发');
            } else if (event.deltaY < 0 && prevBtn) {
                prevBtn.click();
                console.log('上一页触发');
            }
        }
    }

    // 智能元素检测
    function checkAndBind() {
        const prevExist = !!document.querySelector(prevBtnSelector);
        const nextExist = !!document.querySelector(nextBtnSelector);

        if (prevExist && nextExist) {
            window.addEventListener('wheel', handleWheel, { passive: false });
            console.log('翻页控件已绑定');
        } else {
            console.warn('未检测到翻页按钮，3秒后重试...');
            setTimeout(checkAndBind, 3000); // 循环检测直到成功
        }
    }

    // 启动监听
    checkAndBind();

    // 保活机制：监听DOM变化重新绑定
    new MutationObserver(() => {
        window.removeEventListener('wheel', handleWheel);
        checkAndBind();
    }).observe(document.body, { subtree: true, childList: true });
})();
