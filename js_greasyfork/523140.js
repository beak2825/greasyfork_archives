// ==UserScript==
// @name        無限動漫 漫畫下載插件 v1.0
// @namespace   https://www.facebook.com/airlife917339
// @version     1.0
// @description 無限動漫插件，修正亂碼網址並下載漫畫
// @author      Kevin Chang
// @match       https://www.8comic.com/html/*
// @match       https://articles.onemoreplace.tw/online/*
// @icon        https://www.8comic.com/favicon.ico
// @grant       GM_download
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523140/%E7%84%A1%E9%99%90%E5%8B%95%E6%BC%AB%20%E6%BC%AB%E7%95%AB%E4%B8%8B%E8%BC%89%E6%8F%92%E4%BB%B6%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/523140/%E7%84%A1%E9%99%90%E5%8B%95%E6%BC%AB%20%E6%BC%AB%E7%95%AB%E4%B8%8B%E8%BC%89%E6%8F%92%E4%BB%B6%20v10.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 執行不同邏輯取決於當前網址
    if (window.location.href.startsWith('https://articles.onemoreplace.tw/online/')) {
        handleArticlesOnemoreplace();
    } else if (window.location.href.startsWith('https://www.8comic.com/html/')) {
        handle8Comic();
    }

    // 處理 "articles.onemoreplace.tw" 的邏輯
    function handleArticlesOnemoreplace() {
        const ptElement = document.getElementById('pt');
        if (ptElement) {
            // 將 id="pt" 的 class 加入 'mr-1'
            ptElement.classList.add('mr-1');

            // 新建下載按鈕
            const downloadButton = document.createElement('a');
            downloadButton.className = 'btn btn-sm btn-secondary text-white d-block mr-1';
            downloadButton.textContent = '下載';
            downloadButton.href = '#';

            // 將下載按鈕插入到 ptElement 後面
            ptElement.insertAdjacentElement('afterend', downloadButton);

            // 點擊按鈕時執行下載邏輯
            downloadButton.addEventListener('click', (e) => {
                e.preventDefault();

                const images = document.querySelectorAll('#comics-pics .comics-pic img');
                if (images.length === 0) {
                    alert('未找到圖片，請確認網頁是否載入完成！');
                    return;
                }

                images.forEach((img, index) => {
                    let url = img.src;

                    if (!url && img.getAttribute('s')) {
                        const scrambledUrl = img.getAttribute('s');
                        url = decodeURIComponent(scrambledUrl).replace(/^\/\//, 'https://');
                    }

                    if (!url) {
                        console.warn(`跳過未找到有效 URL 的圖片：`, img);
                        return;
                    }

                    const filename = `image-${index + 1}.jpg`;

                    GM_download({
                        url: url,
                        name: filename,
                        onerror: (err) => console.error(`下載失敗: ${filename}`, err),
                    });
                });

                alert(`${images.length} 張圖片已提交下載！`);
            });
        } else {
            console.error('找不到 id="pt" 的元素！');
        }
    }

    // 處理 "8comic.com" 的邏輯
    function handle8Comic() {
        document.querySelectorAll('a[href="#"]').forEach(link => {
            const onclickCode = link.getAttribute('onclick');
            if (!onclickCode) return;

            const match = onclickCode.match(/cview\('([^']+)',(\d+),(\d+)\)/);
            if (!match) return;

            const [_, u, cid, cr] = match;

            let url = u.replace('.html', '');
            const i = url.split('-')[0];
            const c = url.indexOf('-') > 0 ? url.split('-')[1] : '1';

            if (getCookie("CKVP")) {
                url = `/view/${url.replace("-", ".html?ch=")}`;
            } else {
                url = `https://articles.onemoreplace.tw/online/new-${url.replace("-", ".html?ch=")}`;
            }

            link.setAttribute('href', url);
            link.removeAttribute('onclick');
        });

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }
    }
})();