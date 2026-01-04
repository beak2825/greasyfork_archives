// ==UserScript==
// @name         Bing搜索居中显示
// @namespace    http://tampermonkey.net/
// @version      2024-1-12
// @description  让Bing搜索页面布局居中，并隐藏相关搜索
// @author       Jia Zhenyu
// @match        https://*.bing.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521997/Bing%E6%90%9C%E7%B4%A2%E5%B1%85%E4%B8%AD%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521997/Bing%E6%90%9C%E7%B4%A2%E5%B1%85%E4%B8%AD%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否启用隐藏相关搜索功能
    const hideRelatedSearches = GM_getValue("hideRelatedSearches", true);

    // 应用自定义样式
    GM_addStyle(`
        #b_header {
            width: fit-content;
            margin: auto;
        }
        #b_content {
            display: flex !important;
            justify-content: center !important;
            padding-left: 0%;
            padding-right: 0%;
        }
        #b_dynRail {
            display: none !important; /* 隐藏动态内容栏 */
        }
        aside[aria-label="更多结果"],
        aside[aria-label="Additional Results"] {
            display: ${hideRelatedSearches ? 'none' : 'block'} !important; /* 根据设置隐藏或显示相关搜索 */
        }
    `);

    // 创建 MutationObserver 观察器，监听页面内容变化
    const observer = new MutationObserver(() => {
        const content = document.querySelector('#b_content');
        if (content) {
            observer.disconnect(); // 停止观察
        }
    });

    // 开始观察页面
    observer.observe(document.body, { childList: true, subtree: true });

    // 添加菜单项：启用或禁用隐藏相关搜索
    GM_registerMenuCommand(hideRelatedSearches ? "禁用隐藏相关搜索" : "启用隐藏相关搜索", function() {
        toggleRelatedSearches();
    });

    // 切换相关搜索隐藏状态
    function toggleRelatedSearches() {
        const newState = !GM_getValue("hideRelatedSearches", true);
        GM_setValue("hideRelatedSearches", newState); // 更新状态

        // 刷新页面，以应用新的设置
        location.reload();
    }
})();
