// ==UserScript==
// @name         YouTube新标签页打开
// @namespace    your_namespace
// @version      2.1.0
// @description:zh-cn YouTube视频新标签页打开点击油猴图标可以切换首页非首页模式
// @author       YourName
// @match        *://*.youtube.com/*
// @license      无
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @description Open YouTube videos in new tab with intelligent filtering
// @downloadURL https://update.greasyfork.org/scripts/524491/YouTube%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/524491/YouTube%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储（默认全局模式）
    const CONFIG = {
        globalMode: GM_getValue('globalMode', true)
    };

    // 清理旧菜单项
    let currentMenuIds = [];
    const updateMenu = () => {
        currentMenuIds.forEach(id => GM_unregisterMenuCommand(id));
        currentMenuIds = [];

        currentMenuIds.push(GM_registerMenuCommand(
            `${CONFIG.globalMode ? "✅" : "❌"} 全局模式（所有页面生效）`,
            () => setMode(true)
        ));

        currentMenuIds.push(GM_registerMenuCommand(
            `${!CONFIG.globalMode ? "✅" : "❌"} 首页模式（主页+频道页生效）`,
            () => setMode(false)
        ));
    };

    // 模式切换
    const setMode = (global) => {
        CONFIG.globalMode = global;
        GM_setValue('globalMode', global);
        location.reload();
    };

    // 页面类型判断
    const isHomePage = () => window.location.pathname === "/";
    const isChannelPage = () => /^\/(channel\/|user\/|c\/|@)/.test(window.location.pathname);
    const isSearchPage = () => window.location.pathname === "/results"; // 新增搜索页判断

    // 链接类型判断
    const isSpecialLink = (target) => {
        // 用户资料链接检测
        try {
            const url = new URL(target.href);
            if (/^\/(channel\/|user\/|c\/|@)/.test(url.pathname)) {
                return !target.closest('ytd-channel-name, ytd-playlist-panel-video-renderer');
            }
        } catch {}

        // 视频链接检测
        return /(\/watch\?v=|\/shorts\/)/.test(target.href) &&
               !target.closest('ytd-channel-name, ytd-playlist-panel-video-renderer');
    };

    // 主处理逻辑
    const initHandler = () => {
        document.addEventListener('click', (event) => {
            let target = event.target;
            while (target?.parentElement && target.tagName !== 'A') {
                target = target.parentElement;
            }
            if (!target?.href) return;

            // 强制处理用户资料链接
            try {
                const url = new URL(target.href);
                if (/^\/(channel\/|user\/|c\/|@)/.test(url.pathname)) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open(target.href, '_blank');
                    return;
                }
            } catch {}

            // 修改后的判断条件（新增搜索页判断）
            const shouldHandle =
                isSearchPage() ||  // 搜索页强制生效
                CONFIG.globalMode ||  // 全局模式
                (isHomePage() || isChannelPage()) && !CONFIG.globalMode;  // 首页模式

            if (shouldHandle && isSpecialLink(target)) {
                event.preventDefault();
                event.stopPropagation();

                const isShort = target.href.includes('/shorts/');
                window.open(target.href, '_blank');

                if (isShort && window.location.pathname.startsWith('/shorts/')) {
                    window.location.replace("about:blank");
                }
            }
        }, true);
    };

    // 初始化
    updateMenu();
    initHandler();
})();

