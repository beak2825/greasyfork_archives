// ==UserScript==
// @name         YouTube 新标签页&内容屏蔽
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  新标签页打开视频、屏蔽首页Shorts、屏蔽首页精选（可在油猴菜单设置开关）
// @author       YourName
// @match        *://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/525655/YouTube%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/525655/YouTube%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    const defaultSettings = {
        newTab: true,
        blockShorts: true,
        blockExplore: true
    };

    // 读取设置
    function getSetting(key) {
        if (typeof GM_getValue === 'function') {
            const val = GM_getValue(key);
            return typeof val === 'undefined' ? defaultSettings[key] : val;
        } else {
            // 兼容无GM_函数环境
            const val = localStorage.getItem('yt_' + key);
            return val === null ? defaultSettings[key] : val === 'true';
        }
    }
    function setSetting(key, value) {
        if (typeof GM_setValue === 'function') {
            GM_setValue(key, value);
        } else {
            localStorage.setItem('yt_' + key, value);
        }
    }

    // 功能开关
    let newTab = getSetting('newTab');
    let blockShorts = getSetting('blockShorts');
    let blockExplore = getSetting('blockExplore');

    // 菜单注册
    function updateMenu() {
        if (typeof GM_registerMenuCommand !== 'function') return;
        GM_registerMenuCommand(`新标签页打开视频：${newTab ? '✅' : '❌'}`, () => {
            newTab = !newTab;
            setSetting('newTab', newTab);
            location.reload();
        });
        GM_registerMenuCommand(`屏蔽首页Shorts：${blockShorts ? '✅' : '❌'}`, () => {
            blockShorts = !blockShorts;
            setSetting('blockShorts', blockShorts);
            location.reload();
        });
        GM_registerMenuCommand(`屏蔽首页精选：${blockExplore ? '✅' : '❌'}`, () => {
            blockExplore = !blockExplore;
            setSetting('blockExplore', blockExplore);
            location.reload();
        });
    }
    updateMenu();

    // 1. 新标签页打开视频
    if (newTab) {
        document.addEventListener('click', function(e) {
            if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            const anchor = e.target.closest('a');
            if (!anchor) return;
            try {
                const url = new URL(anchor.href, window.location.origin);
                if (url.pathname === '/watch' && url.searchParams.has('v')) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(anchor.href, '_blank');
                }
            } catch (err) {}
        }, true);
    }

    // 2/3. 屏蔽首页Shorts和精选
    function removeHomeContent() {
        if (window.location.pathname !== '/') return;
        const shelves = document.querySelectorAll('ytd-rich-shelf-renderer, ytd-reel-shelf-renderer');
        shelves.forEach(shelf => {
            const titleEl = shelf.querySelector('h2');
            const title = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
            // 屏蔽Shorts
            if (blockShorts && (title.includes('shorts') || shelf.querySelector("a[href^='/shorts']"))) {
                shelf.remove();
                return;
            }
            // 屏蔽精选
            if (blockExplore && (title.includes('精选') || title.includes('explore'))) {
                shelf.remove();
                return;
            }
        });
    }
    if (blockShorts || blockExplore) {
        removeHomeContent();
        // 监听DOM变化，动态移除
        const observer = new MutationObserver(removeHomeContent);
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();
