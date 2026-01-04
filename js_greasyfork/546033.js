// ==UserScript==
// @name         Linux.do 自动滚动到底部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 linux.do 帖子页面右下角添加一个“翻至末尾”按钮，点击后自动滚动，直到全部帖子内容加载完成时停止。
// @author       castor
// @match        https://linux.do/t/topic/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546033/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546033/Linuxdo%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const scrollToBottomButton = document.createElement('button');
    scrollToBottomButton.textContent = '翻至末尾';
    Object.assign(scrollToBottomButton.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    });
    document.body.appendChild(scrollToBottomButton);

    let scrollInterval = null;

    // 停止滚动的函数
    function stopScrolling(finalScroll = false) {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }

        // 如果需要，执行最后一次滚动
        if (finalScroll) {
            console.log('全部帖子已加载，执行最后一次滚动。');
            window.scrollTo(0, document.body.scrollHeight);
        }

        scrollToBottomButton.textContent = '已到底部';
        scrollToBottomButton.style.backgroundColor = '#28a745';

        setTimeout(() => {
            scrollToBottomButton.textContent = '翻至末尾';
            scrollToBottomButton.style.backgroundColor = '#007bff';
        }, 3000);
    }

    // 主要的检查和滚动函数
    function checkAndScroll() {
        // 1. 获取当前页面上帖子的数量
        const currentPostCount = document.querySelectorAll('.topic-body').length;

        // 2. 获取并解析总帖子数量
        const timelineElement = document.querySelector('.timeline-replies');
        if (!timelineElement) {
            // 如果总数元素还没出现，继续滚动
            window.scrollTo(0, document.body.scrollHeight);
            return;
        }

        const timelineText = timelineElement.textContent.trim();
        let totalPostCount = 0;

        if (timelineText.includes('/')) {
            const parts = timelineText.split('/');
            totalPostCount = parseInt(parts[1].trim(), 10);
        }

        // 如果解析失败或总数为0，则先不处理，继续滚动
        if (isNaN(totalPostCount) || totalPostCount === 0) {
            window.scrollTo(0, document.body.scrollHeight);
            return;
        }

        console.log(`当前帖子: ${currentPostCount}, 总帖子: ${totalPostCount}`);

        // 3. 比较数量，决定是停止还是继续
        if (currentPostCount >= totalPostCount) {
            console.log('帖子数量已满足，停止滚动。');
            stopScrolling(true); // 传入true，执行最后一次滚动
        } else {
            // 数量还不够，继续滚动
            window.scrollTo(0, document.body.scrollHeight);
        }
    }


    // 按钮的点击事件处理
    scrollToBottomButton.addEventListener('click', () => {
        if (scrollInterval) {
            // 手动停止
            stopScrolling(false); // 手动停止时不需要最后滚动
        } else {
            // 开始
            scrollToBottomButton.textContent = '滚动中...';
            scrollToBottomButton.style.backgroundColor = '#dc3545';
            scrollInterval = setInterval(checkAndScroll, 1000); // 每秒检查并滚动一次
        }
    });

})();