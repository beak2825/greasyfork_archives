// ==UserScript==
// @name         Komica 載入更多貼文
// @namespace    291
// @version      1.1
// @description  無縫瀏覽 Komica 貼文，提供手動和自動載入功能，無需離開頁面。(移除內建功能)
// @match        https://gita.komica1.org/00b/index.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530730/Komica%20%E8%BC%89%E5%85%A5%E6%9B%B4%E5%A4%9A%E8%B2%BC%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/530730/Komica%20%E8%BC%89%E5%85%A5%E6%9B%B4%E5%A4%9A%E8%B2%BC%E6%96%87.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let currentPage = 1;
    const threadsContainerSelector = '#threads';

    // 自訂 log 函數
    function log(message, ...args) {
        console.log(`[Komica 載入更多貼文] ${message}`, ...args);
    }

    // 頁面載入時初始化
    window.addEventListener('load', function() {
        markExistingThreads();
        addLoadButton();
        // setupPoliticsHideFunctionality(); // 暫時移除政治隱藏功能
        createPanel();
        autoLoadPosts();
    });

    // 標記初始貼文
    function markExistingThreads() {
        const existingThreads = document.querySelectorAll('.thread');
        existingThreads.forEach(thread => thread.classList.add('komica-thread-initialized'));
        log(`標記初始貼文完成：共 ${existingThreads.length} 個`);
    }

    // 添加載入按鈕
    function addLoadButton() {
        const loadButton = document.createElement('button');
        loadButton.textContent = '載入更多貼文';
        loadButton.style.marginTop = '10px';
        loadButton.style.marginBottom = '10px';
        loadButton.style.display = 'block';
        loadButton.style.marginLeft = 'auto';
        loadButton.style.marginRight = '10px';
        loadButton.style.padding = '5px 10px';
        document.body.appendChild(loadButton);
        loadButton.addEventListener('click', loadMorePosts);
        log('載入按鈕已添加');
    }

    // 政治隱藏功能 (已註解)
    /*
    function setupPoliticsHideFunctionality() {
        var checkbox = document.getElementById('hidePolitics');
        if (!checkbox) {
            log('未找到政治隱藏選框，跳過此功能初始化');
            return;
        }
        var allPosts, allThreads;

        function updatePostAndThreadLists() {
            allPosts = document.querySelectorAll('div[class^="post"]');
            allThreads = document.querySelectorAll('.thread');
        }

        function hidePoliticalPosts() {
            updatePostAndThreadLists();
            allThreads.forEach(thread => {
                let firstPost = thread.querySelector(".post:first-child");
                if (firstPost && firstPost.querySelector(".category")?.textContent.includes("政治")) {
                    thread.style.display = checkbox.checked ? "none" : "block";
                }
            });
            allPosts.forEach(post => {
                if (post.querySelector('.category')?.textContent.includes('政治')) {
                    post.style.display = checkbox.checked ? 'none' : 'block';
                }
            });
        }

        var storedState = localStorage.getItem('hidePoliticsState');
        if (storedState === 'true') checkbox.checked = true;
        checkbox.addEventListener('change', function() {
            hidePoliticalPosts();
            localStorage.setItem('hidePoliticsState', checkbox.checked);
        });
        hidePoliticalPosts(); // 初始執行一次
        log('政治隱藏功能已初始化');
    }
    */

    // 創建面板
    const createPanel = () => {
        const headerToplink = document.querySelector('#toplink');
        if (!headerToplink || document.querySelector('#preload-select')) return;

        const preloadSelect = document.createElement('select');
        preloadSelect.id = 'preload-select';
        preloadSelect.innerHTML = `
            <option value="0">不預載</option>
            <option value="1">預載1頁</option>
            <option value="2">預載2頁</option>
        `;

        const label = document.createElement('span');
        label.textContent = '預載頁數: ';
        label.appendChild(preloadSelect);

        const refreshBtn = Array.from(headerToplink.querySelectorAll('a')).find(a => a.textContent.includes('重新整理'));
        if (refreshBtn) {
            const textNode = document.createTextNode('] [');
            headerToplink.insertBefore(textNode, refreshBtn.nextSibling);
            headerToplink.insertBefore(label, textNode.nextSibling);
        } else {
            headerToplink.appendChild(label);
        }

        // 載入保存的設置
        const savedPreload = localStorage.getItem('preloadPages');
        if (savedPreload) {
            preloadSelect.value = savedPreload;
        }

        // 監聽選擇變化並保存
        preloadSelect.addEventListener('change', () => {
            localStorage.setItem('preloadPages', preloadSelect.value);
        });
        log('預載面板已創建');
    };

    // 自動載入貼文
    const autoLoadPosts = () => {
        const preloadPages = parseInt(localStorage.getItem('preloadPages') || '0', 10);
        if (preloadPages > 0) {
            log(`開始自動載入 ${preloadPages} 頁貼文`);
            let pagesLoaded = 0;
            const loadInterval = setInterval(() => {
                if (pagesLoaded < preloadPages) {
                    loadMorePosts();
                    pagesLoaded++;
                } else {
                    clearInterval(loadInterval);
                    log(`自動載入完成，共載入 ${pagesLoaded} 頁`);
                }
            }, 1000); // 每秒載入一頁，避免過於頻繁的請求
        }
    };

    // 載入更多貼文
    function loadMorePosts() {
        const url = `https://gita.komica1.org/00b/${currentPage}.htm`;
        log(`開始載入：${url}`);
        const existingThreads = document.querySelectorAll('.komica-thread-initialized');
        existingThreads.forEach(thread => thread.classList.remove('thread'));

        fetch(url, { credentials: 'same-origin' })
        .then(response => response.text())
        .then(htmlText => {
            const { added, duplicates } = appendThreadsFromHTML(htmlText);
            log(`載入完成：新增 ${added} 篇，跳過 ${duplicates} 篇重複`);
            if (added > 0) reloadExternalScript();

            setTimeout(() => {
                existingThreads.forEach(thread => thread.classList.add('thread'));
                const newThreads = document.querySelectorAll('.thread:not(.komica-thread-initialized)');
                newThreads.forEach(thread => thread.classList.add('komica-thread-initialized'));
                // setupPoliticsHideFunctionality(); // 暫時移除政治隱藏功能 (在新貼文載入後也需移除)
                log(`新貼文標記完成：${newThreads.length} 個`);
            }, 2000);

            currentPage++;
        })
        .catch(error => {
            console.error(`[Komica 載入更多貼文] 載入失敗：`, error);
            existingThreads.forEach(thread => thread.classList.add('thread'));
        });
    }

    // 解析並添加新貼文
    function appendThreadsFromHTML(htmlString) {
        let added = 0, duplicates = 0;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const newThreadsContainer = doc.querySelector(threadsContainerSelector);
        const currentThreadsContainer = document.querySelector(threadsContainerSelector);

        if (!newThreadsContainer) {
            log('警告：無法從載入的 HTML 中找到貼文容器。');
            return { added: 0, duplicates: 0 };
        }
        if (!currentThreadsContainer) {
            log('警告：無法在當前頁面找到貼文容器。');
            return { added: 0, duplicates: 0 };
        }


        Array.from(newThreadsContainer.children).forEach(thread => {
            const no = thread.getAttribute('data-no');
            if (!currentThreadsContainer.querySelector(`[data-no="${no}"]`)) {
                thread.classList.add('thread'); // 確保新加入的 thread 元素有 .thread class
                currentThreadsContainer.appendChild(thread.cloneNode(true));
                added++;
            } else {
                duplicates++;
            }
        });

        return { added, duplicates };
    }

    // 重新載入komica內部腳本
    function reloadExternalScript() {
        const script = document.createElement('script');
        script.src = '/common/js/script.js?t=' + Date.now();
        script.onload = () => log('內部腳本重新載入成功');
        document.head.appendChild(script);
    }
})();