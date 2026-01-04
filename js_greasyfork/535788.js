// ==UserScript==
// @name         Threads 爬貼文助手 V1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  多關鍵字搜尋 Threads 並擷取貼文內容
// @author       ChatGPT
// @match        *://www.threads.net/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=threads.net
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535788/Threads%20%E7%88%AC%E8%B2%BC%E6%96%87%E5%8A%A9%E6%89%8B%20V10.user.js
// @updateURL https://update.greasyfork.org/scripts/535788/Threads%20%E7%88%AC%E8%B2%BC%E6%96%87%E5%8A%A9%E6%89%8B%20V10.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keywords = ['妝前乳', '氣墊', '粉底液']; // ←←←← 修改你要搜尋的關鍵字
    const scrollTimes = 5;  // 每個關鍵字捲動幾次
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let results = [];

    async function scrollAndExtract(keyword) {
        console.log(`🔍 搜尋中：「${keyword}」`);

        // 導向搜尋頁
        location.href = `https://www.threads.net/search?q=${encodeURIComponent(keyword)}`;
        await delay(5000); // 等待載入

        for (let i = 0; i < scrollTimes; i++) {
            window.scrollTo(0, document.body.scrollHeight);
            await delay(3000 + Math.random() * 2000); // 模擬瀏覽
        }

        // 擷取貼文
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
        for (const kw of keywords) {
            await scrollAndExtract(kw);
            await delay(3000); // 切換關鍵字間的緩衝
        }

        // 顯示最終結果
        console.log('🎉 Threads 爬蟲完成，共擷取：', results.length, '篇貼文');
        console.log(JSON.stringify(results, null, 2));
        alert(`Threads 爬完了，共抓 ${results.length} 篇，請打開 console 查看結果`);
    }

    // 自動啟動
    if (location.href.includes('/search?q=')) {
        start();
    } else {
        location.href = `https://www.threads.net/search?q=${encodeURIComponent(keywords[0])}`;
    }
})();
