// ==UserScript==
// @name         自动刷新GitHub页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 GitHub 任意非编辑页面首次访问时强制刷新一次，解决某些脚本和扩展不生效的问题
// @author       klcb2010
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535611/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0GitHub%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/535611/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0GitHub%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REFRESH_FLAG = 'gh_auto_full_refresh_done';

    
    const excludeKeywords = ['edit', 'new', 'settings', 'upload', 'releases/new', 'issues/new', 'pull/new'];

    function isExcluded(url = location.href) {
        return excludeKeywords.some(keyword => url.includes(keyword));
    }

    function shouldRefresh() {
        return !sessionStorage.getItem(REFRESH_FLAG) && !isExcluded();
    }

    function forceFullReload() {
        sessionStorage.setItem(REFRESH_FLAG, 'true');
        console.log('[GitHub Auto Refresh] Forcing full reload:', location.href);
        setTimeout(() => {
            try {
                location.reload(true); 
            } catch (e) {
                console.warn('reload(true) failed, fallback to normal reload');
                location.reload();
            }
        }, 1000);
    }

    function resetFlagIfNavigated() {
        sessionStorage.removeItem(REFRESH_FLAG);
        console.log('[GitHub Auto Refresh] URL changed, reset flag');
    }

    function onUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                callback();
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

   
    if (shouldRefresh()) {
        forceFullReload();
    }

   
    onUrlChange(() => {
        resetFlagIfNavigated();
        if (shouldRefresh()) {
            forceFullReload();
        }
    });
})();
