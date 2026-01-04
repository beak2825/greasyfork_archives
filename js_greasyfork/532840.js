// ==UserScript==
// @name         Linux.do 添加关注 Feed 链接
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在 linux.do 导航栏添加一个指向当前用户关注动态 RSS Feed 的链接
// @author       leeorz
// @match        https://linux.do/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532840/Linuxdo%20%E6%B7%BB%E5%8A%A0%E5%85%B3%E6%B3%A8%20Feed%20%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/532840/Linuxdo%20%E6%B7%BB%E5%8A%A0%E5%85%B3%E6%B3%A8%20Feed%20%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const LINK_TEXT = '关注 Feed'; // 导航项显示的文本
    const LINK_TITLE_TEMPLATE = '查看您关注用户的帖子 RSS Feed ({username})'; // 鼠标悬停提示文本模板
    const CUSTOM_LI_CLASS = 'nav-item_follow-feed'; // 添加到新 <li> 的自定义 CSS 类名，用于识别
    const CUSTOM_LI_ID = 'nav-item-follow-feed';    // 添加到新 <li> 的 ID (可选)

    // --- 主要功能函数 ---
    function addFollowFeedLink() {
        // 1. 获取用户名 (使用确认有效的方法: Container Lookup)
        let username = null;
        try {
            // 检查必要的对象路径是否存在
            if (window.Discourse?.application?.__container__?.lookup) {
                 const currentUser = window.Discourse.application.__container__.lookup('service:current-user');
                 if (currentUser && currentUser.username) {
                    username = currentUser.username;
                    console.log('Tampermonkey: 通过 Container Lookup 找到用户名:', username);
                 } else {
                    console.log('Tampermonkey: 从 service:current-user 获取的对象无效或缺少 username。');
                    // 调试信息
                    console.log('Tampermonkey: service:current-user 对象:', currentUser);
                    if (!currentUser) {
                        console.info("Tampermonkey: 这可能意味着用户未登录或服务初始化失败。");
                    }
                 }
            } else {
                 console.log('Tampermonkey: 无法访问 Discourse container 或其 lookup 方法。');
            }
        } catch (error) {
            console.error('Tampermonkey: 获取用户名时发生错误:', error);
        }

        // 如果未能获取用户名，则退出
        if (!username) {
            console.log('Tampermonkey: 未能获取用户名，无法添加链接。');
            return;
        }

        // 2. 查找导航栏元素
        const navBar = document.getElementById('navigation-bar');
        if (!navBar) {
            console.log('Tampermonkey: 未找到导航栏 (#navigation-bar)。');
            return; // 如果导航栏不存在，则退出
        }

        // 3. 检查我们的链接是否已经存在 (防止重复添加)
        if (navBar.querySelector('.' + CUSTOM_LI_CLASS)) {
             // console.log('Tampermonkey: "关注 Feed" 链接已存在。'); // 可以取消注释这行进行调试
             return; // 如果已经存在，则不再添加
        }

        // 4. 构建 Feed 的 URL
        const feedUrl = `https://linux.do/u/${username}/follow/feed`;

        // 5. 创建新的列表项 (<li>)
        const listItem = document.createElement('li');
        // 模仿其他 li 的类名，并添加自定义类
        listItem.className = `follow-feed ember-view ${CUSTOM_LI_CLASS}`;
        listItem.title = LINK_TITLE_TEMPLATE.replace('{username}', username);
        listItem.id = CUSTOM_LI_ID;

        // 6. 创建链接 (<a>)
        const link = document.createElement('a');
        link.href = feedUrl;
        link.textContent = LINK_TEXT;

        // 7. 将链接 (<a>) 添加到列表项 (<li>) 中
        listItem.appendChild(link);

        // 8. 将列表项 (<li>) 添加到导航栏 (<ul>) 的末尾
        navBar.appendChild(listItem);

        console.log(`Tampermonkey: 成功添加 "${LINK_TEXT}" 链接到导航栏。`);
    }

    // --- 执行逻辑 ---
    // 稍微延迟执行，确保 Discourse 核心初始化完成
    function initialRun() {
        // 增加一点延迟，确保 container 和 service 都已准备好
        setTimeout(addFollowFeedLink, 1000); // 延迟 1 秒尝试首次添加
    }

    // 首次执行
    initialRun();

    // 使用 MutationObserver 监视 DOM 变化，处理 SPA 导航
    const observer = new MutationObserver((mutationsList, observer) => {
        const navBar = document.getElementById('navigation-bar');
         if (navBar && !navBar.querySelector('.' + CUSTOM_LI_CLASS)) {
            // console.log('Tampermonkey: 检测到导航变化或元素加载，尝试(重新)添加链接。');
            // 检测到变化后也稍微延迟一下
            setTimeout(addFollowFeedLink, 300);
         }
    });

    // 观察 body 及其子树的子节点变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
