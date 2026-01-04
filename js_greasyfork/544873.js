// ==UserScript==
// @name         哔哩哔哩自动打开字幕（优化版）
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      2025-08-08
// @description  自动开启B站视频字幕，支持BV/av号和分P切换
// @author       小宇
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/video/av*
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544873/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544873/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentVideoId = '';
    let currentP = '';

    // 检测视频变化（包括分P）
    function checkVideoChange() {
        const pathname = window.location.pathname;
        const query = new URLSearchParams(window.location.search);
        const p = query.get('p') || '1';
        const match = pathname.match(/\/(BV\w+|av\d+)/);
        const videoId = match ? match[1] : '';

        if (videoId !== currentVideoId || p !== currentP) {
            currentVideoId = videoId;
            currentP = p;
            console.log(`[字幕脚本] 视频变化: ${videoId}, P${p}，尝试开启字幕...`);
            setTimeout(openSubtitle, 1000); // 给播放器一点加载时间
        }
    }

    // 开启字幕
    function openSubtitle() {
        // 如果字幕已显示，跳过
        if (document.querySelector("span.bili-subtitle-x-subtitle-panel-text")) {
            console.log('✅ 字幕已开启');
            return;
        }

        const clickSubtitle = () => {
            const btn = document.querySelector(".bpx-player-ctrl-btn[aria-label='字幕'] .bpx-common-svg-icon");
            if (btn) {
                btn.click();
                console.log('✅ 字幕按钮已点击');
                return;
            } 
        };

        // 立即尝试一次
        clickSubtitle();

    }

    // 监听 URL 变化（如分P、跳转）
    let lastHref = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastHref) {
            lastHref = location.href;
            checkVideoChange();
        }
    });
    observer.observe(document, { subtree: true, childList: true });

    // 页面加载后立即检查一次
    window.addEventListener('load', checkVideoChange);

    // 清理
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });

    console.log('🟢 哔哩哔哩自动字幕脚本已注入');
})();