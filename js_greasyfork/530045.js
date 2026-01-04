// ==UserScript==
// @name         豆瓣评论清理助手
// @name:en      Douban Comment Cleaner
// @namespace    https://greasyfork.org/users/YOUR_USERNAME
// @version      1.0.0
// @description  帮助清理豆瓣小组帖子中的评论，支持批量删除自己发布的评论
// @description:en  Help clean up comments in Douban group posts, support batch deletion of your own comments
// @author       YOUR_NAME
// @match        https://www.douban.com/group/topic/*
// @match        http://www.douban.com/group/topic/*
// @include      https://www.douban.com/group/topic/*
// @include      http://www.douban.com/group/topic/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://img3.doubanio.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/530045/%E8%B1%86%E7%93%A3%E8%AF%84%E8%AE%BA%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530045/%E8%B1%86%E7%93%A3%E8%AF%84%E8%AE%BA%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加调试信息
    console.log('豆瓣评论清理助手已加载');
    
    // 检查页面URL
    console.log('当前页面URL:', window.location.href);
    
    // 检查是否匹配规则
    console.log('是否匹配规则:', /\/group\/topic\//.test(window.location.href));

    // ... 其余代码保持不变 ...

    // 修改初始化函数，添加重试机制
    function init() {
        console.log('开始初始化...');
        
        function tryCreatePanel() {
            if (document.readyState === 'complete') {
                console.log('页面加载完成，创建控制面板');
                setTimeout(() => {
                    createControlPanel();
                    console.log('控制面板创建完成');
                }, 1000); // 延迟1秒创建面板
            } else {
                console.log('页面未完全加载，等待中...');
                setTimeout(tryCreatePanel, 500);
            }
        }

        tryCreatePanel();
    }

    // 确保脚本在页面加载完成后运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();