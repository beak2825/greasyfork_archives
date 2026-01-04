// ==UserScript==
// @name         WeixinRead Auto Scroll
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  [拟人版] 5-7秒随机间隔 + 分段滚动 + 到底部回顶刷新
// @author       Riki
// @match        https://weread.qq.com/web/reader/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545527/WeixinRead%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/545527/WeixinRead%20Auto%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置参数 ---
    let scrollIndex = 0;
    const scroll_times = 180;         // 把页面高度分成 180 份
    const max_keepalive_time = 5 * 60 * 1000; // 5分钟强制刷新
    
    // [修改] 时间间隔配置 (毫秒)
    const TIME_CONFIG = {
        min: 5000, // 最快 5秒
        max: 7000  // 最慢 7秒
    };

    let lastRefreshTime = Date.now();
    let timerId = null;

    // --- 2. 防检测补丁 ---
    try {
        Object.defineProperty(document, 'hidden', { value: false, writable: true });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
        window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
    } catch(e) {}

    // --- 3. 启动逻辑 ---
    console.log(`[AutoScroll] V5.3 拟人启动：间隔 ${TIME_CONFIG.min}-${TIME_CONFIG.max}ms`);
    listeners_block();
    
    // 延迟 2 秒启动，给人一点准备时间
    setTimeout(auto_scroll_loop, 2000);

    // --- 4. 核心循环 (递归调用实现随机间隔) ---
    function auto_scroll_loop() {
        // A. 执行滚动逻辑
        scroll_page();

        // B. 检查是否需要保活刷新
        if (Date.now() - lastRefreshTime >= max_keepalive_time) {
            console.log('⏰ 超时保活刷新');
            safe_refresh();
            return; // 刷新后停止后续计时
        }

        // C. 计算下一次的随机时间
        const randomDelay = Math.floor(Math.random() * (TIME_CONFIG.max - TIME_CONFIG.min + 1) + TIME_CONFIG.min);
        // console.log(`下次滚动等待: ${randomDelay}ms`);

        // D. 安排下一次执行
        timerId = setTimeout(auto_scroll_loop, randomDelay);
    }

    function scroll_page() {
        // 如果还没滚够 180 次
        if (scrollIndex < scroll_times) {
            scrollIndex++;
            
            const scrollHeight = document.documentElement.scrollHeight;
            
            // 计算垂直位置 (只算Y轴，X轴强制为0，防止斜着跑)
            const y_height = Math.floor(scrollHeight / scroll_times * scrollIndex);
            
            // 随机微调 (模拟手滑)
            const y_random = Math.round(Math.random() * 50); 

            // 执行滚动
            window.scrollTo(0, y_height); 
            window.scrollBy(0, y_random); 
            
            console.log(`滚动进度: ${scrollIndex}/${scroll_times}`);
        } else {
            // 滚完了 180 次，执行刷新逻辑
            console.log('✅ 已完成一轮阅读，准备刷新');
            safe_refresh();
        }
    }

    function safe_refresh() {
        clearTimeout(timerId); // 清除计时器防止冲突
        scrollIndex = 0;
        lastRefreshTime = Date.now();
        
        // 回到顶部
        window.scrollTo(0, 0);
        
        // 随机延迟刷新 (0.5秒 - 2秒之间)
        setTimeout(() => {
            window.location.reload();
        }, 500 + Math.random() * 1500);
    }

    function listeners_block() {
        const eventsToBlock = ["visibilitychange", "mouseleave", "blur", "focus", "pointerleave"];
        eventsToBlock.forEach(evt => {
            window.addEventListener(evt, e => e.stopPropagation(), true);
            document.addEventListener(evt, e => e.stopPropagation(), true);
        });
    }
})();