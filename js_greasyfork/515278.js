// ==UserScript==
// @name         Open Elements in Background Tab
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  將選定的元素在背景分頁或新分頁開啟
// @author       You
// @match        https://tixcraft.com/ticket/area/*
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515278/Open%20Elements%20in%20Background%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/515278/Open%20Elements%20in%20Background%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 從頁面腳本中提取 areaUrlList
    function extractAreaUrlList() {
        const scripts = document.getElementsByTagName('script');
        let urlList = {};

        for (const script of scripts) {
            if (script.textContent.includes('var areaUrlList =')) {
                try {
                    const match = script.textContent.match(/var areaUrlList = (\{[^;]+\});/);
                    if (match && match[1]) {
                        urlList = JSON.parse(match[1]);
                        console.log('Successfully extracted areaUrlList:', urlList);
                    }
                } catch (e) {
                    console.error('Error parsing areaUrlList:', e);
                }
            }
        }
        return urlList;
    }

    // 開啟所有連結
    function openAllUrls(urlList) {
        const urls = Object.values(urlList);
        console.log(`Opening ${urls.length} tabs...`);

        // 為了避免被瀏覽器阻擋，添加小延遲
        urls.forEach((url, index) => {
            setTimeout(() => {
                GM_openInTab(url, { active: false });

                // 在最後一個 URL 開啟後輸出完成訊息
                if (index === urls.length - 1) {
                    console.log('All tabs have been opened!');
                }
            }, index * 100); // 每個標籤頁延遲 100ms
        });
    }

    function init() {
        const urlList = extractAreaUrlList();

        // 檢查是否有區域可以開啟
        if (Object.keys(urlList).length > 0) {
            console.log('Found areas, opening tabs...');
            // 自動開啟所有連結
            openAllUrls(urlList);
        } else {
            console.log('No areas found to open');
        }
    }

    // 等待一小段時間確保頁面完全載入
    setTimeout(() => {
        if (document.readyState === 'complete') {
            init();
        } else {
            window.addEventListener('load', init);
        }
    }, 100); // 等待 500ms 再執行
})();