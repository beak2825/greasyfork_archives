// ==UserScript==
// @name         B站字幕快捷键切换 (Bilibili Subtitle Toggle with Shortcut)
// @namespace    http://tampermonkey.net/
// @version      2025-10-22
// @description  通过 'C' 键切换 Bilibili 视频字幕的开启和关闭状态，兼容 B站最新版页面。
// @author       bushnerd
// @license MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529782/B%E7%AB%99%E5%AD%97%E5%B9%95%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%88%87%E6%8D%A2%20%28Bilibili%20Subtitle%20Toggle%20with%20Shortcut%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529782/B%E7%AB%99%E5%AD%97%E5%B9%95%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%88%87%E6%8D%A2%20%28Bilibili%20Subtitle%20Toggle%20with%20Shortcut%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* 找字幕按钮：兼容 2025-06 新版 + 旧版 + 番剧页 */
    function querySubtitleBtn() {
        return document.querySelector(
            [
                '.bpx-player-ctrl-subtitle>button',// 新版 bpx
                '.bpx-player-ctrl-btn[aria-label*="字幕"]',
                '.bpx-player-ctrl-btn[aria-label*="CC"]',
                '.squirtle-subtitle-wrap>button',// 番剧播放器
                '.bpui-btn[title*="字幕"]',// 旧版
            ].join(',')
        );
    }

    /* 真正"切换字幕"：先展开菜单，然后根据状态选择开启或关闭 */
    function clickSubtitle() {
        const menuBtn = document.querySelector('.bpx-player-ctrl-subtitle');
        if (!menuBtn) {
            console.warn('[B站字幕快捷键切换] 未找到字幕菜单按钮');
            return;
        }

        const panel = document.querySelector('.bpx-player-ctrl-subtitle-box');
        // 如果菜单还没展开，先点一次
        if (!panel || panel.style.display === 'none') {
            menuBtn.click();
            console.log('[B站字幕快捷键切换] 展开字幕菜单');
        }

        // 等 150 ms 让菜单渲染完
        setTimeout(() => {
            const activeLangItem = document.querySelector('.bpx-player-ctrl-subtitle-language-item.bpx-state-active');
            const closeButton = document.querySelector('.bpx-player-ctrl-subtitle-close-switch[data-action="close"]');
            const chineseLangItem = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]');
            const firstLangItem = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan]');

            if (activeLangItem && closeButton) {
                // 如果有激活的字幕且找到关闭按钮，则点击关闭
                closeButton.click();
                console.log('[B站字幕快捷键切换] 字幕已关闭');
            } else if (!activeLangItem) {
                // 如果没有激活的字幕，尝试打开
                if (chineseLangItem) {
                    chineseLangItem.click();
                    console.log('[B站字幕快捷键切换] 已选择中文字幕，字幕已开启');
                } else if (firstLangItem) {
                    firstLangItem.click();
                    console.log('[B站字幕快捷键切换] 已选择第一个可用语言，字幕已开启');
                } else {
                    console.warn('[B站字幕快捷键切换] 未找到可开启的字幕语言选项');
                }
            } else {
                console.warn('[B站字幕快捷键切换] 无法判断字幕状态或执行操作');
            }
        }, 150);
    }

    // 快捷键：按 C 切换字幕
    document.addEventListener('keydown', e => {
        const inInput = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
        if (!inInput && (e.key === 'c' || e.key === 'C') && !e.repeat) {
            clickSubtitle();
        }
    });

    console.log("Bilibili Subtitle Toggle with Shortcut script has been loaded.");
})();
