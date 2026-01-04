// ==UserScript==
// @name         虎扑黑名单
// @namespace    http://tampermonkey.net/
// @version      2.123
// @description  拉黑特定用户建立用户名黑名单；拉黑特定图片建立URL黑名单
// @author       AI
// @match        https://bbs.hupu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/529583/%E8%99%8E%E6%89%91%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529583/%E8%99%8E%E6%89%91%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从本地存储初始化屏蔽用户和图片列表并过滤无效数据
    let blockedUsers = GM_getValue('blockedUsers', []).filter(u => u && typeof u === 'string') || [];
    let savedImages = GM_getValue('savedImages', []).filter(i => i && typeof i === 'string') || [];
    let currentImg = null; // 存储当前右键点击的图片对象

    // 创建用户屏蔽菜单
    const userMenu = document.createElement('div');
    userMenu.style.cssText = `
        position: fixed; /* 固定定位相对视口 */
        background: #fff; /* 白色背景 */
        border: 1px solid #ccc; /* 灰色边框 */
        padding: 5px; /* 内边距 */
        cursor: pointer; /* 鼠标悬停显示指针 */
        z-index: 10000; /* 高 z-index 确保上层显示 */
        display: none; /* 默认隐藏 */
    `;
    document.body.appendChild(userMenu); // 追加用户菜单到页面

    // 创建图片屏蔽菜单
    const imageMenu = document.createElement('div');
    imageMenu.id = 'hupu-img-helper-menu'; // 设置唯一 ID 便于识别
    imageMenu.style.cssText = `
        position: fixed; /* 固定定位 */
        background: #ffffff; /* 白色背景 */
        border: 1px solid #09f; /* 蓝色边框 */
        border-radius: 4px; /* 圆角边框 */
        padding: 8px 12px; /* 内边距 */
        box-shadow: 0 2px 8px rgba(0,0,0,0.15); /* 阴影效果 */
        z-index: 9999999; /* 极高 z-index 确保最上层 */
        display: none; /* 默认隐藏 */
        font-family: system-ui; /* 系统字体 */
        color: #333; /* 深灰色文字 */
        min-width: 160px; /* 最小宽度 */
        opacity: 1; /* 完全不透明 */
        visibility: visible; /* 确保可见 */
        transition: background 0.2s; /* 背景渐变效果 */
    `;
    imageMenu.innerHTML = `
        <div class="menu-item" style="padding: 6px; cursor: pointer;">
            🖼️ 隐藏该图片
        </div>
    `; // 设置图片屏蔽菜单内容
    document.body.appendChild(imageMenu); // 追加图片菜单到页面

    // 为图片菜单添加鼠标悬停效果
    imageMenu.addEventListener('mouseover', () => {
        imageMenu.style.background = '#f0f8ff'; // 悬停时背景变浅蓝色
    });
    imageMenu.addEventListener('mouseout', () => {
        imageMenu.style.background = '#ffffff'; // 鼠标离开恢复白色背景
    });

    // 将屏蔽用户列表保存到本地存储
    function saveBlockedUsers() {
        GM_setValue('blockedUsers', blockedUsers);
    }

    // 将屏蔽图片列表保存到本地存储
    function saveBlockedImages() {
        GM_setValue('savedImages', savedImages);
    }

    // 将用户添加到屏蔽列表开头并根据上下文更新页面
    function blockUser(username, isQuoteContext) {
        if (username && !blockedUsers.includes(username)) { // 验证用户名有效且未屏蔽
            blockedUsers.unshift(username); // 添加到屏蔽列表开头
            saveBlockedUsers(); // 保存更新
            hidePosts(isQuoteContext); // 根据上下文隐藏帖子或引用
        }
    }

    // 隐藏屏蔽用户的帖子或引用，isQuoteContext控制引用场景
    function hidePosts(isQuoteContext = false) {
        // 查找帖子或回复中的用户链接，排除引用中的链接
        const posts = Array.from(document.querySelectorAll('a[href^="https://my.hupu.com/"]'))
            .filter(a => /^https:\/\/my\.hupu\.com\/\w+$/.test(a.href) && !a.closest('div > div > span'));

        // 非引用场景时隐藏帖子和回复
        if (!isQuoteContext) {
            posts.forEach(post => {
                const username = post.textContent.trim(); // 获取用户名
                if (blockedUsers.includes(username)) { // 检查是否在屏蔽列表
                    // 查找帖子或回复的父容器
                    const postLi = post.closest('li.bbs-sl-web-post-body'); // 帖子标题
                    const postDiv = post.closest('div[class^=post-content_bbs-post-content]'); // 帖子内容
                    const replyDiv = post.closest('.post-reply-list-wrapper'); // 回复容器
                    // 隐藏匹配的容器
                    if (postLi) postLi.style.display = 'none';
                    if (postDiv) postDiv.style.display = 'none';
                    if (replyDiv) replyDiv.style.display = 'none';
                }
            });
        }

        // 隐藏屏蔽用户的引用
        const quoteContainers = document.querySelectorAll('div > div > span > a[href^="https://my.hupu.com/"]');
        quoteContainers.forEach(quote => {
            const username = quote.textContent.trim(); // 获取引用用户名
            if (blockedUsers.includes(username)) { // 检查是否在屏蔽列表
                // 查找引用或回复的父容器
                const quoteText = quote.closest('div[class*="quote-text"]');
                const replyThread = quote.closest('div[class*="thread-comp-container"]')?.querySelector('div[class*="reply-thread"]');
                const toggleThread = quote.closest('div[class*="thread-comp-container"]')?.querySelector('div[class*="toggle-thread"]');
                // 隐藏匹配的元素
                if (quoteText) quoteText.style.display = 'none';
                if (replyThread) replyThread.style.display = 'none';
                if (toggleThread) toggleThread.style.display = 'none';
            }
        });
    }

    // 隐藏屏蔽的图片
    function hideImages() {
        savedImages.forEach(src => { // 遍历屏蔽图片列表
            // 查找匹配图片元素
            document.querySelectorAll(`img[src^="${src}"]`).forEach(img => {
                // 获取图片父容器
                const container = img.closest('[class*="thread-img-container"]') || img.parentElement;
                if (container) container.style.display = 'none'; // 隐藏容器
            });
        });
    }

    // 为图片元素绑定右键事件监听
    function setupImageListeners() {
        // 选择未绑定监听的图片
        document.querySelectorAll('img.thread-img:not([data-block-listener])').forEach(img => {
            img.addEventListener('contextmenu', handleImageContextMenu, { capture: true }); // 绑定右键事件
            img.setAttribute('data-block-listener', 'true'); // 标记已绑定
        });
    }

    // 处理图片右键菜单显示
    function handleImageContextMenu(e) {
        let target = e.target; // 获取触发元素
        // 向上查找图片元素
        while (target && target.nodeName !== 'IMG') {
            target = target.parentElement;
        }

        if (target && target.classList.contains('thread-img')) { // 确认目标图片
            e.preventDefault(); // 阻止默认右键菜单
            e.stopPropagation(); // 阻止事件冒泡

            // 存储当前图片及其容器
            currentImg = {
                element: target,
                container: target.closest('[class*="thread-img-container"]') || target.parentElement
            };

            // 计算菜单尺寸
            const menuWidth = imageMenu.offsetWidth || 160;
            const menuHeight = imageMenu.offsetHeight || 44;
            const viewportWidth = window.innerWidth; // 视口宽度
            const viewportHeight = window.innerHeight; // 视口高度

            // 获取鼠标点击位置
            let adjustedLeft = e.clientX;
            let adjustedTop = e.clientY;

            // 确保菜单不超出视口
            if (adjustedLeft + menuWidth > viewportWidth) {
                adjustedLeft = viewportWidth - menuWidth - 5; // 保留 5px 边距
            }
            if (adjustedTop + menuHeight > viewportHeight) {
                adjustedTop = viewportHeight - menuHeight - 5;
            }

            // 防止菜单超出左侧或顶部
            adjustedLeft = Math.max(5, adjustedLeft);
            adjustedTop = Math.max(5, adjustedTop);

            // 设置图片菜单位置并显示
            imageMenu.style.left = `${adjustedLeft}px`;
            imageMenu.style.top = `${adjustedTop}px`;
            imageMenu.style.display = 'block';
        } else {
            imageMenu.style.display = 'none'; // 隐藏图片菜单
        }
    }

    // 处理用户右键菜单显示
    document.addEventListener('contextmenu', (event) => {
        // 查找最近的用户链接
        const target = event.target.closest('a[href^="https://my.hupu.com/"]');
        if (target) {
            event.preventDefault(); // 阻止默认右键菜单
            const username = target.textContent.trim(); // 获取用户名
            if (!username) return; // 用户名为空则退出

            // 判断是否为引用中的用户名
            const isQuoteContext = !!target.closest('div > div > span');

            // 设置用户菜单内容
            userMenu.textContent = `屏蔽 ${username}`;

            // 计算菜单尺寸
            const menuWidth = userMenu.offsetWidth || 100;
            const menuHeight = userMenu.offsetHeight || 30;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // 获取鼠标点击位置
            let adjustedLeft = event.clientX;
            let adjustedTop = event.clientY;

            // 确保菜单不超出视口
            if (adjustedLeft + menuWidth > viewportWidth) {
                adjustedLeft = viewportWidth - menuWidth - 5;
            }
            if (adjustedTop + menuHeight > viewportHeight) {
                adjustedTop = viewportHeight - menuHeight - 5;
            }

            // 防止菜单超出左侧或顶部
            adjustedLeft = Math.max(5, adjustedLeft);
            adjustedTop = Math.max(5, adjustedTop);

            // 设置用户菜单位置并显示
            userMenu.style.left = `${adjustedLeft}px`;
            userMenu.style.top = `${adjustedTop}px`;
            userMenu.style.display = 'block';

            // 绑定点击事件以屏蔽用户
            userMenu.onclick = () => {
                blockUser(username, isQuoteContext);
                userMenu.style.display = 'none'; // 隐藏用户菜单
            };
        } else {
            userMenu.style.display = 'none'; // 隐藏用户菜单
        }
    });

    // 隐藏所有浮动菜单
    function hideMenus() {
        userMenu.style.display = 'none';
        imageMenu.style.display = 'none';
    }

    // 监听页面点击以隐藏菜单
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !imageMenu.contains(e.target)) {
            hideMenus(); // 隐藏所有菜单
        }
    });

    // 监听页面滚动以隐藏菜单
    document.addEventListener('wheel', hideMenus, { passive: true });

    // 处理图片屏蔽菜单点击事件
    imageMenu.querySelector('.menu-item').addEventListener('click', () => {
        if (!currentImg) return; // 无当前图片则退出

        const src = currentImg.element.src; // 获取图片 URL
        const cleanSrc = src.replace(/(?:\?|&)x-oss-process=.*$/, ''); // 移除 URL 参数

        if (cleanSrc && !savedImages.includes(cleanSrc)) { // 验证图片未屏蔽
            savedImages.unshift(cleanSrc); // 添加到屏蔽列表开头
            saveBlockedImages(); // 保存更新
            hideImages(); // 隐藏匹配图片
        }

        // 隐藏图片或其容器
        if (currentImg.container) {
            currentImg.container.style.display = 'none';
        } else {
            currentImg.element.style.display = 'none';
        }

        hideMenus(); // 隐藏所有菜单
        currentImg = null; // 清空当前图片
    });

    // 去抖动处理 DOM 变化
    let mutationTimeout;
    function debounceMutations(callback) {
        clearTimeout(mutationTimeout); // 清除之前定时器
        mutationTimeout = setTimeout(callback, 50); // 50ms 后执行回调
    }

    // 初始化 MutationObserver 监听 DOM 变化
    function setupObservers() {
        const observer = new MutationObserver(() => {
            debounceMutations(() => {
                hidePosts(); // 隐藏屏蔽用户帖子
                hideImages(); // 隐藏屏蔽图片
                setupImageListeners(); // 重新绑定图片监听
            });
        });

        // 监听页面及其子节点变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 添加全局隐藏样式
    const style = document.createElement('style');
    style.textContent = `
        .hidden-post {
            display: none !important; /* 强制隐藏帖子 */
        }
    `;
    document.head.appendChild(style); // 追加样式到页面

    // 初始化脚本逻辑
    function initialize() {
        if (document.readyState === 'loading') { // 页面加载中
            document.addEventListener('DOMContentLoaded', () => {
                hidePosts(); // 隐藏屏蔽帖子
                hideImages(); // 隐藏屏蔽图片
                setupImageListeners(); // 绑定图片监听
                setupObservers(); // 初始化 DOM 监听
            });
        } else { // 页面已加载
            hidePosts();
            hideImages();
            setupImageListeners();
            setupObservers();
        }
    }

    // 启动脚本
    initialize();
})();