// ==UserScript==
// @name         NewsFan.jp 自動翻頁和點擊
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自動滾動頁面，點擊"続きを読む"、"スタンプページへ"、"スタンプ/ポイント確認"、"戻る"按鈕，並在特定首頁點擊第一個文章連結。
// @author       lchanc3
// @homepage     https://github.com/lchanc3/userscript
// @supportURL   https://github.com/lchanc3/userscript/issues    
// @match        *://*.trepy.jp/*
// @match        *://*.life-n.jp/*
// @match        *://*.point-news.jp/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/526895/NewsFanjp%20%E8%87%AA%E5%8B%95%E7%BF%BB%E9%A0%81%E5%92%8C%E9%BB%9E%E6%93%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/526895/NewsFanjp%20%E8%87%AA%E5%8B%95%E7%BF%BB%E9%A0%81%E5%92%8C%E9%BB%9E%E6%93%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const SCROLL_INTERVAL = 200;
    const BUTTON_CHECK_INTERVAL = 300;
    const MAX_SCROLL_ATTEMPTS = 10;
    const STAMP_PAGE_BUTTON_CHECK_INTERVAL = 500; // Page 2 按鈕檢查頻率
    const END_PAGE_BUTTON_CHECK_INTERVAL = 500;
    const HOMEPAGE_LINK_CHECK_INTERVAL = 1000; // 首頁連結檢查頻率
    const HOMEPAGE_CHECK_TIMEOUT = 15000; // 首頁連結檢查超時 (15秒)

    // 目標首頁域名列表
    const TARGET_HOMEPAGE_HOSTS = [
        'www.trepy.jp',
        'www.life-n.jp',
        'point-news.jp'
    ];
    const TARGET_HOMEPAGE_PATH = '/sp/';

    // --- 輔助函數 ---
    function log(message, ...args) {
        console.log(`[AutoScript v0.8] ${message}`, ...args);
    }

    // --- 頁面 1: 滾動頁面邏輯 (article/?article_id=...) ---
    function handleScrollingPage() {
        log("正在處理滾動頁面 (article)...");
        let lastHeight = 0;
        let scrollAttempts = 0;
        let scrollLoop = null;
        let clickLoop = null;

        function stopScrollLoop() {
            if (scrollLoop) {
                clearInterval(scrollLoop);
                scrollLoop = null;
                log("滾動檢查已停止。");
            }
        }

        function stopClickLoop() {
            if (clickLoop) {
                clearInterval(clickLoop);
                clickLoop = null;
                log("按鈕/連結檢查已停止 (滾動頁面)。");
            }
        }

        function autoScroll() {
             if (scrollLoop) return; // 防止重複創建
             log("啟動滾動檢查...");
             scrollLoop = setInterval(() => {
                let currentHeight = Math.max( document.body.scrollHeight, document.documentElement.scrollHeight,
                                           document.body.offsetHeight, document.documentElement.offsetHeight,
                                           document.body.clientHeight, document.documentElement.clientHeight );
                window.scrollTo(0, currentHeight);

                if (currentHeight === lastHeight) {
                    scrollAttempts++;
                    if (scrollAttempts >= MAX_SCROLL_ATTEMPTS) {
                        log("已達滾動底部或無法再滾動 (嘗試次數: " + scrollAttempts + ")。");
                        stopScrollLoop();
                         if (!clickLoop) { // 如果按鈕檢查也停了，重啟以查找 stampLink
                             findAndClickButtons();
                         }
                    }
                } else {
                    // log("滾動中...", currentHeight);
                    scrollAttempts = 0;
                }
                lastHeight = currentHeight;
            }, SCROLL_INTERVAL);
        }

        function findAndClickButtons() {
            if (clickLoop) return; // 防止重複創建
            log("啟動按鈕/連結檢查 (滾動頁面)...");

            clickLoop = setInterval(() => {
                // 1. 檢查 "続きを読む" 按鈕
                let readMoreButton = document.querySelector('[class^="btnNext"]');
                if (readMoreButton && readMoreButton.offsetParent !== null) {
                    log("發現按鈕「続きを読む」，正在點擊...", readMoreButton.className);
                    readMoreButton.click();
                    scrollAttempts = 0; // 重置滾動嘗試
                    if (scrollLoop === null) { // 如果滾動已停止，重新啟動
                        log("重新啟動滾動檢查 (因點擊続きを読む)。");
                        autoScroll();
                    }
                    // 不需要停止 clickLoop，因為可能還有多個 "続きを読む"
                    return;
                }

                // 2. 檢查 "スタンプページへ" 連結
                // 只有在滾動確實停止後才尋找此連結
                if (scrollLoop === null) {
                    let stampLink = document.querySelector('.button_stamp a');
                    if (stampLink && stampLink.offsetParent !== null) {
                         log("滾動結束，找到「スタンプページへ」連結，準備跳轉...", stampLink.href);
                         stopClickLoop(); // 找到目標，停止此頁所有檢查
                         log("停止計時器，執行頁面跳轉至 Stamp 頁。");
                         window.location.href = stampLink.href;
                         return;
                    }
                }

                // 如果滾動停止了，但 "続きを読む" 和 "スタンプページへ" 都沒找到 (或 "スタンプページへ" 時機未到)
                if (scrollLoop === null && !readMoreButton) { // stampLink 的檢查已包含在 scrollLoop === null 條件內
                     log("滾動結束且未找到目標按鈕/連結「続きを読む」或「スタンプページへ」，停止按鈕檢查。");
                     stopClickLoop();
                }

            }, BUTTON_CHECK_INTERVAL);
        }

        autoScroll();
        findAndClickButtons();
    }

    // --- 頁面 2: Stamp/Point Action 頁面邏輯 (article/page/?article_id=...) ---
    function handleStampPage() {
        log("正在處理 Stamp/Point Action 頁面 (article/page)...");
        let checkPageButtonLoop = null;

        function findAndClickPageButton() {
            checkPageButtonLoop = setInterval(() => {
                // **優先檢查** 新的 Point 按鈕 (btn_point.png)
                const pointImage = document.querySelector('.btn_area img[src*="btn_point.png"]');
                const pointButtonLink = pointImage ? pointImage.closest('a') : null;

                if (pointButtonLink && pointButtonLink.offsetParent !== null) {
                    log("發現 Point 按鈕/連結 (btn_point.png)，準備點擊...", pointButtonLink.href);
                    clearInterval(checkPageButtonLoop);
                    log("停止計時器，執行點擊 (Point)。");
                    pointButtonLink.click();
                    return;
                }

                // 如果沒找到 Point 按鈕，再檢查原始的 Stamp 按鈕 (btn_stamp.png)
                const stampImage = document.querySelector('.btn_area img[src*="btn_stamp.png"]');
                const stampButtonLink = stampImage ? stampImage.closest('a') : null;

                if (stampButtonLink && stampButtonLink.offsetParent !== null) {
                    log("發現 Stamp 確認按鈕/連結 (btn_stamp.png)，準備點擊...", stampButtonLink.href);
                    clearInterval(checkPageButtonLoop);
                    log("停止計時器，執行點擊 (Stamp)。");
                    stampButtonLink.click();
                    return;
                }
                // log("未找到 Point 或 Stamp 按鈕，繼續檢查...");
            }, STAMP_PAGE_BUTTON_CHECK_INTERVAL);

            setTimeout(() => {
                if (checkPageButtonLoop) {
                    clearInterval(checkPageButtonLoop);
                    log("Stamp/Point 頁面按鈕檢查超時，已停止。");
                }
            }, 30000); // 30 秒
        }
        findAndClickPageButton();
    }

    // --- 頁面 3: 結束頁面邏輯 (article/page-end/?article_id=...) ---
    function handleEndPage() {
        log("正在處理結束頁面 (article/page-end)...");
        let checkEndButtonLoop = null;

        function findAndClickEndButton() {
            checkEndButtonLoop = setInterval(() => {
                const endButtonImage = document.querySelector('.btn_com img[src*="btn_return.png"]');
                const endButtonLink = endButtonImage ? endButtonImage.closest('a') : null;

                if (endButtonLink && endButtonLink.offsetParent !== null) {
                    log("發現結束頁面按鈕/連結 (btn_return.png)，準備點擊...", endButtonLink.href);
                    clearInterval(checkEndButtonLoop);
                    log("停止計時器，執行點擊。");
                    endButtonLink.click();
                } else {
                    // log("未找到結束頁面按鈕，繼續檢查...");
                }
            }, END_PAGE_BUTTON_CHECK_INTERVAL);

            setTimeout(() => {
                if (checkEndButtonLoop) {
                    clearInterval(checkEndButtonLoop);
                    log("結束頁面按鈕檢查超時，已停止。");
                }
            }, 30000);
        }
        findAndClickEndButton();
    }

    // --- 新功能: 首頁邏輯 (特定網站的 /sp/ 路徑) ---
    function handleHomepage() {
        log("正在處理首頁 (特定網站 /sp/)...");
        let checkHomepageLinkLoop = null;
        let homepageCheckTimeoutTimer = null;

        function findAndClickFirstArticle() {
            // 更新後的選擇器：
            // 選擇 div 元素且 class 為 "pon_article_inner"，然後選擇其直接子元素 a，
            // 且 a 標籤的 href 包含 "/sp/article/?article_id="
            const firstArticleLink = document.querySelector('div.pon_article_inner > a[href*="/sp/article/?article_id="]');

            if (firstArticleLink && firstArticleLink.offsetParent !== null) {
                log("在首頁找到第一個文章連結，準備點擊:", firstArticleLink.href);
                if (checkHomepageLinkLoop) clearInterval(checkHomepageLinkLoop);
                if (homepageCheckTimeoutTimer) clearTimeout(homepageCheckTimeoutTimer);
                log("停止計時器，執行點擊首頁文章連結。");
                firstArticleLink.click();
            } else {
                log("首頁未找到可見的文章連結 (div.pon_article_inner > a)，繼續檢查...");
            }
        }

        // 使用 setInterval 進行檢查，因為元素可能延遲載入
        checkHomepageLinkLoop = setInterval(findAndClickFirstArticle, HOMEPAGE_LINK_CHECK_INTERVAL);

        // 設定超時，如果在一定時間内未找到連結，則停止檢查
        homepageCheckTimeoutTimer = setTimeout(() => {
            if (checkHomepageLinkLoop) {
                clearInterval(checkHomepageLinkLoop);
                log("首頁文章連結檢查超時，已停止。");
            }
        }, HOMEPAGE_CHECK_TIMEOUT);

        // 立即執行一次檢查，避免等待第一個 interval
        findAndClickFirstArticle();
    }


    // --- 主邏輯：根據當前 URL 決定執行哪個函數 ---
    const currentHref = window.location.href;
    const currentHostname = window.location.hostname;
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    log("腳本啟動。當前 URL:", currentHref);

    // 判斷頁面類型
    if (TARGET_HOMEPAGE_HOSTS.includes(currentHostname) && currentPath === TARGET_HOMEPAGE_PATH) {
        handleHomepage(); // 首頁處理
    }
    else if (currentPath.includes('/sp/article/') && currentSearch.startsWith('?article_id=')) {
        if (currentPath.includes('/page-end/')) {
            handleEndPage(); // Page 3
        } else if (currentPath.includes('/page/')) {
            handleStampPage(); // Page 2 (處理 Stamp 或 Point)
        } else if (currentPath === '/sp/article/') { // 確保是 /sp/article/ 而不是 /sp/article/page/
            handleScrollingPage(); // Page 1
        } else {
            log("當前頁面路徑包含 /sp/article/ 但不完全匹配已知規則，不執行操作。路徑:", currentPath);
        }
    }
    else {
        log("當前頁面不符合任何已定義的處理規則。");
    }

})();
