// ==UserScript==
// @name         Youtube 影片標題語言偵測顯示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  判斷Youtube影片標題語言（中/日/英）並顯示於右下角(英文權重0.33 日文權重1.2)
// @author       shanlan(ChatGPT o3-mini)
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546305/Youtube%20%E5%BD%B1%E7%89%87%E6%A8%99%E9%A1%8C%E8%AA%9E%E8%A8%80%E5%81%B5%E6%B8%AC%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/546305/Youtube%20%E5%BD%B1%E7%89%87%E6%A8%99%E9%A1%8C%E8%AA%9E%E8%A8%80%E5%81%B5%E6%B8%AC%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判斷字元語言
    function detectCharLang(char) {
        const code = char.charCodeAt(0);
        // 中文（含簡繁體）
        if ((code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF) || (code >= 0x20000 && code <= 0x2A6DF)) {
            return 'zh';
        }
        // 日文平假名
        if (code >= 0x3040 && code <= 0x309F) {
            return 'ja';
        }
        // 日文片假名
        if (code >= 0x30A0 && code <= 0x30FF) {
            return 'ja';
        }
        // 日文全形片假名擴展
        if (code >= 0x31F0 && code <= 0x31FF) {
            return 'ja';
        }
        // 英文
        if ((code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A)) {
            return 'en';
        }
        // 其他
        return 'other';
    }

    // 偵測語言比例
    function detectTitleLang(title) {
        let zh = 0, ja = 0, en = 0, total = 0;
        for (let char of title) {
            const lang = detectCharLang(char);
            if (lang === 'zh') zh++;
            else if (lang === 'ja') ja++;
            else if (lang === 'en') en++;
        }
        // 英文權重0.33 日文權重1.2
        const weightedEn = en * 0.33;
        const weightedja = ja * 1.2;
        total = zh + weightedja + weightedEn;
        if (total === 0) return {zh:0, ja:0, en:0, main:'未知'};
        const zhRate = zh/total, jaRate = weightedja/total, enRate = weightedEn/total;
        let main = '未知';
        if (zhRate >= jaRate && zhRate >= enRate) main = '中文';
        else if (jaRate >= zhRate && jaRate >= enRate) main = '日文';
        else if (enRate >= zhRate && enRate >= jaRate) main = '英文';
        return {
            zh: (zhRate*100).toFixed(1),
            ja: (jaRate*100).toFixed(1),
            en: (enRate*100).toFixed(1),
            main
        };
    }

    // 建立右下角顯示區塊
    function createDisplayBox() {
        let box = document.getElementById('yt-title-lang-detector');
        if (!box) {
            box = document.createElement('div');
            box.id = 'yt-title-lang-detector';
            box.style.position = 'fixed';
            box.style.right = '20px';
            box.style.bottom = '20px';
            box.style.background = 'rgba(0,0,0,0.8)';
            box.style.color = '#fff';
            box.style.padding = '12px 18px';
            box.style.borderRadius = '10px';
            box.style.zIndex = '99999';
            box.style.fontSize = '16px';
            box.style.fontFamily = 'monospace';
            box.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            box.style.pointerEvents = 'none';
            document.body.appendChild(box);
        }
        return box;
    }

    // 取得目前影片標題
    function getCurrentTitle() {
        // 影片頁面
        let titleEl = document.querySelector('h1.title yt-formatted-string');
        if (titleEl) return titleEl.textContent.trim();
        // 首頁或其他地方
        titleEl = document.querySelector('h1.title');
        if (titleEl) return titleEl.textContent.trim();
        // 其他情況
        return '';
    }

    // 主要更新函式
    function updateLangBox() {
        const title = getCurrentTitle();
        if (!title) {
            displayBox.innerHTML = '無法取得標題';
            return;
        }
        const result = detectTitleLang(title);
        displayBox.innerHTML = `
            <b>影片標題語言偵測</b><br>
            主要語言：<span style="color:#ffd700">${result.main}</span><br>
            中文：${result.zh}%<br>
            日文：${result.ja}%<br>
            英文：${result.en}%<br>
        `;
    }

    // 初始化
    const displayBox = createDisplayBox();

    // 監聽網址變化（YouTube SPA）
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(updateLangBox, 1000); // 等待新頁面載入
        }
    }, 500);

    // 監聽標題變化
    let lastTitle = '';
    setInterval(() => {
        const title = getCurrentTitle();
        if (title && title !== lastTitle) {
            lastTitle = title;
            updateLangBox();
        }
    }, 1000);

    // 首次執行
    setTimeout(updateLangBox, 1500);

})();
