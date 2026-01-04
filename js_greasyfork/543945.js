// ==UserScript==
// @name        微信读书宽屏优化与滚动隐藏顶栏
// @match       https://weread.qq.com/web/reader/*
// @grant       none
// @version     0.1
// @author      bingo8670
// @description 优化微信读书网页版宽屏显示效果，并在向下滚动时自动隐藏顶部栏和控制栏，向上滚动时显示。
// @namespace https://greasyfork.org/users/1398309
// @downloadURL https://update.greasyfork.org/scripts/543945/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96%E4%B8%8E%E6%BB%9A%E5%8A%A8%E9%9A%90%E8%97%8F%E9%A1%B6%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/543945/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96%E4%B8%8E%E6%BB%9A%E5%8A%A8%E9%9A%90%E8%97%8F%E9%A1%B6%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 功能 1: 宽屏优化 ---

    // 尝试应用宽屏样式的函数
    function tryApplyWideScreen() {
        const content = document.querySelector('.app_content');
        const topbar = document.querySelector('.readerTopBar');
        if (content) {
            // 将内容区域的最大宽度调整为您希望的宽度
            content.style.maxWidth = '1100px';
        }
        if (topbar) {
            // 确保顶栏正常显示
            topbar.style.display = 'flex';
        }
    }

    // 初始延迟执行，确保页面基本元素加载
    setTimeout(tryApplyWideScreen, 1000);

    // 使用 MutationObserver 监听 DOM 变化，以应对页面内容的动态加载
    // 这确保了即使在切换章节或重新加载UI时，样式也能被正确应用
    const observer = new MutationObserver(tryApplyWideScreen);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    // --- 功能 2: 滚动时自动隐藏/显示顶栏和侧边栏 ---

    // 注入CSS以实现平滑的过渡效果
    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }
    }

    addGlobalStyle(`
        /* 为顶栏和侧边控制栏添加过渡动画 */
        .readerTopBar, .readerControls {
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out !important;
        }
        /* 定义隐藏状态的样式 */
        .weread-auto-hidden {
            opacity: 0 !important;
            visibility: hidden !important;
        }
    `);

    let lastScrollTop = 0;

    // 监听整个窗口的滚动事件
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const topBar = document.querySelector('.readerTopBar');
        const controls = document.querySelector('.readerControls');

        // 如果元素尚未加载，则不执行任何操作
        if (!topBar || !controls) {
            return;
        }

        // 向下滚动超过一定距离时隐藏
        // scrollTop > lastScrollTop 是判断向下滚动
        // scrollTop > 100 是为了避免在页面顶部微小滚动时就隐藏顶栏
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            topBar.classList.add('weread-auto-hidden');
            controls.classList.add('weread-auto-hidden');
        }
        // 向上滚动时显示
        else if (scrollTop < lastScrollTop) {
            topBar.classList.remove('weread-auto-hidden');
            controls.classList.remove('weread-auto-hidden');
        }

        // 更新最后滚动位置
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

})();
