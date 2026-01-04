// ==UserScript==
// @name        YouTube 強制留言顯示由新到舊
// @match       *://*.youtube.com/*
// @version     0.4
// @author      Artin
// @license     MIT
// @description YouTube show hidden comments
// @grant       none
// @namespace https://greasyfork.org/users/814315
// @downloadURL https://update.greasyfork.org/scripts/538907/YouTube%20%E5%BC%B7%E5%88%B6%E7%95%99%E8%A8%80%E9%A1%AF%E7%A4%BA%E7%94%B1%E6%96%B0%E5%88%B0%E8%88%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/538907/YouTube%20%E5%BC%B7%E5%88%B6%E7%95%99%E8%A8%80%E9%A1%AF%E7%A4%BA%E7%94%B1%E6%96%B0%E5%88%B0%E8%88%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;
    let checkCount = 0;
    let retryCount = 0;
    const maxChecks = 4;
    const maxRetries = 2;

    function log(message) {
        console.log(`[YouTube留言排序] ${message}`);
    }

    function switchToNewestComments() {
        if (isProcessing) {
            // log('正在處理中，跳過');
            return;
        }

        isProcessing = true;
        // log('開始檢查留言排序');

        try {
            // 更新的選擇器，根據實際 DOM 結構
            const sortButtonSelectors = [
                '#sort-menu yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
                '#sort-menu yt-sort-filter-sub-menu-renderer yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
                'ytd-comments-header-renderer #sort-menu yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
                '#comments #sort-menu yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
                '#comments yt-sort-filter-sub-menu-renderer yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
                // 保留原有的選擇器作為後備
                '#comments yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
                '#comments ytd-menu-renderer button',
                'ytd-comments-header-renderer yt-dropdown-menu tp-yt-paper-button'
            ];

            let sortButton = null;
            let usedSelector = '';

            for (let selector of sortButtonSelectors) {
                sortButton = document.querySelector(selector);
                if (sortButton) {
                    usedSelector = selector;
                    break;
                }
            }

            if (!sortButton) {
                // log('未找到任何排序按鈕');
                isProcessing = false;
                return;
            }

            // log(`找到排序按鈕 (${usedSelector})，準備點擊`);

            // 檢查按鈕是否可見且可點擊
            const buttonRect = sortButton.getBoundingClientRect();
            const isVisible = buttonRect.width > 0 && buttonRect.height > 0;

            if (!isVisible) {
                // log('排序按鈕不可見，跳過');
                isProcessing = false;
                return;
            }

            // 點擊排序按鈕
            sortButton.click();

            // 等待下拉選單出現
            setTimeout(() => {
                // log('尋找下拉選單項目');

                // 更精確的選單項目選擇器
                const menuItemSelectors = [
                    '#sort-menu yt-dropdown-menu a.yt-simple-endpoint',
                    'yt-dropdown-menu a.yt-simple-endpoint',
                    'tp-yt-paper-listbox a.yt-simple-endpoint'
                ];

                let menuItems = [];
                for (let selector of menuItemSelectors) {
                    menuItems = document.querySelectorAll(selector);
                    if (menuItems.length > 0) {
                        // log(`使用選擇器找到選單項目: ${selector}`);
                        break;
                    }
                }

                // log(`找到 ${menuItems.length} 個選單項目`);

                let foundNewest = false;

                for (let i = 0; i < menuItems.length; i++) {
                    const item = menuItems[i];
                    const itemText = item.textContent || item.innerText || '';

                    // log(`項目 ${i}: "${itemText.trim()}"`);

                    // 檢查是否為"由新到舊"選項
                    if (itemText.includes('由新到舊') || itemText.includes('Newest first') ||
                        itemText.includes('最新') || itemText.includes('新しい順')) {
                        // log('找到"由新到舊"選項');

                        // 檢查是否已經選中
                        const isSelected = item.classList.contains('iron-selected') ||
                                         item.getAttribute('aria-selected') === 'true';

                        if (!isSelected) {
                            // log('切換至"由新到舊"排序');
                            item.click();
                            foundNewest = true;
                        } else {
                            // log('"由新到舊"已經選中');
                            foundNewest = true;
                        }
                        break;
                    }
                }

                if (!foundNewest) {
                    // log('未找到"由新到舊"選項，嘗試點擊第二個選項');
                    // 如果沒找到文字匹配，嘗試點擊第二個選項（通常是由新到舊）
                    if (menuItems.length >= 2) {
                        const secondItem = menuItems[1];
                        const isSelected = secondItem.classList.contains('iron-selected') ||
                                         secondItem.getAttribute('aria-selected') === 'true';

                        if (!isSelected) {
                            // log('點擊第二個選項');
                            secondItem.click();
                        }
                    }
                }

                isProcessing = false;

            }, 500);

        } catch (error) {
            // log(`執行錯誤: ${error.message}`);
            isProcessing = false;
        }
    }

    function debugCommentsSection() {
        const commentsSection = document.querySelector('#comments');
        // log(`留言區域存在: ${!!commentsSection}`);

        if (commentsSection) {
            // 檢查各種可能的排序選單選擇器
            const selectors = [
                '#sort-menu',
                '#sort-menu yt-dropdown-menu',
                '#sort-menu yt-sort-filter-sub-menu-renderer',
                'ytd-comments-header-renderer #sort-menu',
                '#comments yt-sort-filter-sub-menu-renderer',
                '#comments yt-dropdown-menu',
                '#comments ytd-menu-renderer'
            ];

            selectors.forEach(selector => {
                const element = document.querySelector(selector);
                // log(`選擇器 "${selector}": ${!!element}`);
                if (element) {
                    // log(`  - 元素內容: ${element.textContent?.trim().substring(0, 100)}...`);
                    // log(`  - 是否可見: ${element.offsetWidth > 0 && element.offsetHeight > 0}`);
                    // log(`  - 元素類名: ${element.className}`);
                }
            });

            // 檢查排序按鈕
            const sortButtonSelectors = [
                '#sort-menu yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
                '#sort-menu tp-yt-paper-button.dropdown-trigger',
                'tp-yt-paper-button.dropdown-trigger'
            ];

            sortButtonSelectors.forEach(selector => {
                const button = document.querySelector(selector);
                // log(`排序按鈕選擇器 "${selector}": ${!!button}`);
                if (button) {
                    const rect = button.getBoundingClientRect();
                    // log(`  - 按鈕位置: ${rect.width}x${rect.height} at (${rect.left}, ${rect.top})`);
                    // log(`  - 按鈕文字: "${button.textContent?.trim()}"`);
                }
            });

            // 檢查是否有任何包含"排序"或"sort"的元素
            const allElements = commentsSection.querySelectorAll('*');
            const sortElements = Array.from(allElements).filter(el => {
                const text = el.textContent || '';
                return text.includes('排序') || text.includes('sort') || text.includes('Sort') ||
                       text.includes('熱門') || text.includes('最新') || text.includes('由新到舊');
            });

            // log(`找到 ${sortElements.length} 個可能的排序相關元素:`);
            sortElements.slice(0, 5).forEach((el, index) => {
                // log(`  ${index + 1}. ${el.tagName}: "${el.textContent?.trim().substring(0, 50)}..."`);
                // log(`     類名: ${el.className}`);
            });
        }
    }

    function checkSortMenuReady() {
        const commentsSection = document.querySelector('#comments');
        if (!commentsSection) {
            return false;
        }

        // 更新的選擇器列表
        const sortMenuSelectors = [
            '#sort-menu yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
            '#sort-menu yt-sort-filter-sub-menu-renderer yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
            'ytd-comments-header-renderer #sort-menu yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
            '#comments #sort-menu yt-dropdown-menu tp-yt-paper-button.dropdown-trigger',
            '#comments yt-sort-filter-sub-menu-renderer yt-dropdown-menu tp-yt-paper-button.dropdown-trigger'
        ];

        for (let selector of sortMenuSelectors) {
            const sortButton = document.querySelector(selector);
            if (sortButton) {
                const buttonRect = sortButton.getBoundingClientRect();
                const isVisible = buttonRect.width > 0 && buttonRect.height > 0;

                if (isVisible) {
                    // log(`找到可用的排序按鈕 (使用選擇器: ${selector})`);
                    return true;
                }
            }
        }

        return false;
    }

    function waitForSortMenu() {
        if (checkCount >= maxChecks) {
            // log(`達到最大檢查次數 (${maxChecks})，開始詳細偵測`);
            debugCommentsSection();

            // 重試機制
            if (retryCount < maxRetries) {
                retryCount++;
                checkCount = 0;
                // log(`第 ${retryCount} 次重試`);
                setTimeout(waitForSortMenu, 500);
                return;
            } else {
                // log('達到最大重試次數，停止嘗試');
                checkCount = 0;
                retryCount = 0;
                return;
            }
        }

        checkCount++;
        // log(`等待排序選單載入 (${checkCount}/${maxChecks})`);

        if (checkSortMenuReady()) {
            checkCount = 0;
            retryCount = 0;
            setTimeout(switchToNewestComments, 300);
        } else {
            // 每2次檢查就做一次詳細偵測
            if (checkCount % 2 === 0) {
                debugCommentsSection();
            }
            setTimeout(waitForSortMenu, 300);
        }
    }

    function handlePageChange() {
        if (window.location.pathname.includes('/watch')) {
            // log('檢測到影片頁面');
            checkCount = 0;
            retryCount = 0;
            isProcessing = false;
            setTimeout(waitForSortMenu, 500);
        }
    }

    // 監聽URL變化
    let currentUrl = window.location.href;

    function checkUrlChange() {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            // log(`頁面變化: ${currentUrl}`);
            handlePageChange();
        }
    }

    // 使用MutationObserver監聽DOM變化
    const observer = new MutationObserver((mutations) => {
        checkUrlChange();

        // 檢查是否有新的留言區域載入
        const hasCommentsChange = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    return node.id === 'comments' ||
                           node.querySelector && node.querySelector('#comments') ||
                           node.querySelector && node.querySelector('#sort-menu');
                }
                return false;
            });
        });

        if (hasCommentsChange && window.location.pathname.includes('/watch')) {
            // log('偵測到留言區域變化');
            setTimeout(() => {
                if (!isProcessing) {
                    checkCount = 0;
                    waitForSortMenu();
                }
            }, 1000);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 監聽pushstate和popstate事件（YouTube的SPA導航）
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(checkUrlChange, 200);
    };

    window.addEventListener('popstate', checkUrlChange);

    // 初始化
    setTimeout(handlePageChange, 500);

})();