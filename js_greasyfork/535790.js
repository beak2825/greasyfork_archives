// ==UserScript==
// @name         Threads 爬貼文助手 V1.1（支援按鈕觸發＋萬用匹配）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  多關鍵字搜尋 Threads 並擷取貼文內容，加入觸發按鈕與更廣泛網址匹配
// @author       ChatGPT
// @match        *://threads.net/*
// @match        *://www.threads.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=threads.net
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535790/Threads%20%E7%88%AC%E8%B2%BC%E6%96%87%E5%8A%A9%E6%89%8B%20V11%EF%BC%88%E6%94%AF%E6%8F%B4%E6%8C%89%E9%88%95%E8%A7%B8%E7%99%BC%EF%BC%8B%E8%90%AC%E7%94%A8%E5%8C%B9%E9%85%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/535790/Threads%20%E7%88%AC%E8%B2%BC%E6%96%87%E5%8A%A9%E6%89%8B%20V11%EF%BC%88%E6%94%AF%E6%8F%B4%E6%8C%89%E9%88%95%E8%A7%B8%E7%99%BC%EF%BC%8B%E8%90%AC%E7%94%A8%E5%8C%B9%E9%85%8D%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keywords = ['妝前乳', '氣墊', '粉底液']; // ← 可自行修改
    const scrollTimes = 5;
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let results = [];

    // 插入按鈕 UI
    function insertButton() {
        const btn = document.createElement('button');
        btn.innerText = '🚀 開始 Threads 爬蟲';
        btn.style = 'position:fixed;top:10px;right:10px;z-index:9999;padding:8px;background:#00b894;color:#fff;border:none;border-radius:4px;cursor:pointer;';
        btn.onclick = start;
        document.body.appendChild(btn);
    }

    // 單關鍵字操作
    async function scrollAndExtract(keyword) {
        console.log(`🔍 搜尋中：「${keyword}」`);
        location.href = `https://www.threads.net/search?q=${encodeURIComponent(keyword)}`;
        await delay(5000);

        for (let i = 0; i < scrollTimes; i++) {
            window.scrollTo(0, document.body.scrollHeight);
            await delay(3000 + Math.random() * 2000);
        }

        const posts = document.querySelectorAll('article');
        posts.forEach(post => {
            const user = post.querySelector('a[href^="/@"]')?.innerText || '未知帳號';
            const content = post.innerText.trim().replace(/\n+/g, ' ');
            const timeEl = post.querySelector('time');
            const time = timeEl ? timeEl.getAttribute('datetime') : '未知時間';

            results.push({
                keyword,
                user,
                content,
                time
            });
        });
    }

    async function start() {
        results = [];
        for (const kw of keywords) {
            await scrollAndExtract(kw);
            await delay(3000);
        }
        console.log('🎉 Threads 爬蟲完成，共擷取：', results.length, '篇貼文');
        console.log(JSON.stringify(results, null, 2));
        alert(`Threads 爬完了，共抓 ${results.length} 篇，請打開 Console 查看 JSON 結果`);
    }

    // 啟動腳本 UI
    insertButton();
})();
