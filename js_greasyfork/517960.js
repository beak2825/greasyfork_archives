// ==UserScript==
// @name         BGA帕米尔和平、阿纳克遗迹 中文卡图
// @namespace    https://boardgamearena.com
// @version      1.0.3
// @description  BGA PAX:PAMIR帕米尔和平、阿纳克遗迹中文卡图
// @author       klingeling
// @match        *boardgamearena.com/*paxpamir*
// @match        *boardgamearena.com/*arnak*
// @icon         https://x.boardgamearena.net/data/gamemedia/paxpamir/box/en_75.png
// @resource     customCSS https://raw.githubusercontent.com/klingeling/18xx-i18n-plugin/refs/heads/main/bga.css
// @resource     arnakCSS https://raw.githubusercontent.com/klingeling/18xx-i18n-plugin/refs/heads/main/arnak.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/517960/BGA%E5%B8%95%E7%B1%B3%E5%B0%94%E5%92%8C%E5%B9%B3%E3%80%81%E9%98%BF%E7%BA%B3%E5%85%8B%E9%81%97%E8%BF%B9%20%E4%B8%AD%E6%96%87%E5%8D%A1%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/517960/BGA%E5%B8%95%E7%B1%B3%E5%B0%94%E5%92%8C%E5%B9%B3%E3%80%81%E9%98%BF%E7%BA%B3%E5%85%8B%E9%81%97%E8%BF%B9%20%E4%B8%AD%E6%96%87%E5%8D%A1%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const weburl = window.location.href;

    // 处理阿纳克遗迹的图片替换
    if (/arnak/.test(weburl)) {
        const customUrl = 'https://img.915159.xyz/Arnak/playeraid.png';

        // 方法1：直接覆盖CSS
        GM_addStyle(`
            #playeraid {
                background-image: url("${customUrl}") !important;
            }
        `);

        // 方法2：MutationObserver 确保动态加载也能替换
        const observer = new MutationObserver(function() {
            const playerAid = document.getElementById('playeraid');
            if (playerAid) {
                playerAid.style.backgroundImage = `url("${customUrl}")`;
                observer.disconnect(); // 找到后停止观察
            }
        });

        // 安全监听：从 document.documentElement 开始
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 加载自定义CSS（如果有）
        const arnakCSS = GM_getResourceText("arnakCSS");
        GM_addStyle(arnakCSS);
    }

    // 处理帕米尔和平的CSS
    if (/paxpamir/.test(weburl)) {
        const css = GM_getResourceText("customCSS");
        GM_addStyle(css);
    }
})();