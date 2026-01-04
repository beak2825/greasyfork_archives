// ==UserScript==
// @name          Playlist PH Pagination Enhanced
// @namespace     https://www.ph.com/
// @version       1.4
// @description   Разбивает плейлист на страницы с поддержкой динамической подгрузки, URL-параметрами и сохранением настроек
// @match         *://*.pornhub.com/playlist/*
// @match         *://*.pornhubpremium.com/playlist/*
// @run-at        document-end
// @grant         GM.getValue
// @grant         GM.setValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/535501/Playlist%20PH%20Pagination%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/535501/Playlist%20PH%20Pagination%20Enhanced.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const DEFAULT_ITEMS_PER_PAGE = 20;
    const MAX_PAGE_BUTTONS = 7;
    const REFRESH_INTERVAL = 1000;
    const SESSION_STORAGE_PREFIX = 'ph_pagination_';

    async function getStoredValue(key, defaultValue) {
        const sessionValue = sessionStorage.getItem(SESSION_STORAGE_PREFIX + key);
        if (sessionValue !== null) {
            return JSON.parse(sessionValue);
        }
        return await GM.getValue(key, defaultValue);
    }

    async function storeValue(key, value) {
        sessionStorage.setItem(SESSION_STORAGE_PREFIX + key, JSON.stringify(value));
        await GM.setValue(key, value);
    }

    let itemsPerPage = await getStoredValue('ph_items_per_page', DEFAULT_ITEMS_PER_PAGE);
    let currentPage = 1;
    let items = [];
    let totalPages = 1;
    let refreshTimer = null;
    let lastItemCount = 0;

    const playlistId = window.location.pathname.split('/').pop();
    const itemsCountKey = 'ph_items_count_' + playlistId;

    function getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return { page: parseInt(urlParams.get('page')) || 1 };
    }

    function updateUrlWithPage(page) {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        history.replaceState({}, '', url);
    }

    const urlParams = getUrlParams();
    if (urlParams.page > 1) {
        currentPage = urlParams.page;
    } else if (playlistId) {
        currentPage = await getStoredValue('ph_current_page_' + playlistId, 1);
    }

    function getContainer() {
        return document.querySelector('.js-playlistWrapper');
    }

    function waitForContainer() {
        if (document.getElementById('ph-pager')) return;
        const container = getContainer();
        if (!container) return setTimeout(waitForContainer, 300);
        setupPagination(container);
    }

    async function refreshItemsList() {
        const container = getContainer();
        if (!container) return;
        const newItems = Array.from(container.querySelectorAll('.pcVideoListItem, .js-playlistWrapper'));
        lastItemCount = newItems.length;
        items = newItems;
        totalPages = Math.ceil(items.length / itemsPerPage);
        if (playlistId) {
            await storeValue(itemsCountKey, items.length);
        }
        createPagination();
        const counter = document.getElementById('ph-counter');
        if (counter) {
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            counter.textContent = `Видео ${start + 1}-${Math.min(end, items.length)} из ${items.length}`;
        }
        applyCurrentPage();
    }

    function setupScrollHandler() {
        window.addEventListener('scroll', function() {
            if (refreshTimer) clearTimeout(refreshTimer);
            refreshTimer = setTimeout(refreshItemsList, REFRESH_INTERVAL);
        });
    }

    async function setupPagination(container) {
        items = Array.from(container.querySelectorAll('.pcVideoListItem, .js-playlistWrapper'));
        const savedItemCount = await getStoredValue(itemsCountKey, 0);
        if (!items.length && savedItemCount > 0) {
            lastItemCount = savedItemCount;
            setTimeout(refreshItemsList, 1000);
        } else {
            if (!items.length) return;
            lastItemCount = items.length;
            if (playlistId) {
                await storeValue(itemsCountKey, items.length);
            }
        }
        totalPages = Math.ceil(lastItemCount / itemsPerPage);

        const controls = document.createElement('div');
        controls.id = 'ph-controls';
        controls.style = 'display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; background: #1b1b1b; border-radius: 5px; position: sticky; top: 0; z-index: 100;';

        const settingsDiv = document.createElement('div');
        settingsDiv.style = 'display: flex; align-items: center;';

        const label = document.createElement('label');
        label.textContent = 'Видео на странице: ';
        label.style = 'margin-right: 10px; color: #fff;';

        const select = document.createElement('select');
        select.style = 'padding: 3px; background: #333; color: #fff; border: 1px solid #555;';
        [10, 20, 30, 50, 100].forEach(num => {
            const option = document.createElement('option');
            option.value = num;
            option.textContent = num;
            option.selected = (num === itemsPerPage);
            select.appendChild(option);
        });

        select.onchange = async function() {
            itemsPerPage = parseInt(this.value);
            await storeValue('ph_items_per_page', itemsPerPage);
            totalPages = Math.ceil(items.length / itemsPerPage);
            createPagination();
            showPage(1);
        };

        settingsDiv.appendChild(label);
        settingsDiv.appendChild(select);

        const counter = document.createElement('div');
        counter.id = 'ph-counter';
        counter.style = 'color: #fff;';
        counter.textContent = `Всего видео: ${items.length}`;

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '⟳ Обновить';
        refreshBtn.style = 'margin-left: 10px; padding: 3px 8px; background: #333; color: #fff; border: 1px solid #555; cursor: pointer;';
        refreshBtn.onclick = refreshItemsList;

        settingsDiv.appendChild(refreshBtn);
        controls.appendChild(settingsDiv);
        controls.appendChild(counter);

        container.parentNode.insertBefore(controls, container);

        const pager = document.createElement('div');
        pager.id = 'ph-pager';
        pager.style = 'text-align: center; margin: 10px 0; padding: 10px;';
        container.parentNode.insertBefore(pager, container);

        const bottomPager = document.createElement('div');
        bottomPager.id = 'ph-pager-bottom';
        bottomPager.style = 'text-align: center; margin: 10px 0; padding: 10px;';
        if (container.nextSibling) {
            container.parentNode.insertBefore(bottomPager, container.nextSibling);
        } else {
            container.parentNode.appendChild(bottomPager);
        }

        createPagination();
        const urlParams = getUrlParams();
        if (urlParams.page > 1 && urlParams.page <= totalPages) {
            showPage(urlParams.page);
        } else {
            showPage(currentPage);
        }
        setupScrollHandler();
    }

    function createPagination() {
        updatePaginationPanel(document.getElementById('ph-pager'));
        updatePaginationPanel(document.getElementById('ph-pager-bottom'));
    }

    function updatePaginationPanel(pager) {
        if (!pager) return;
        pager.innerHTML = '';
        const buttonStyle = 'margin: 0 3px; padding: 5px 10px; background: #ff9000; color: #000; border: none; border-radius: 3px; cursor: pointer; transition: background 0.3s;';
        const disabledStyle = 'background: #444; color: #aaa; cursor: not-allowed;';
        const activeStyle = 'background: #ff5400; font-weight: bold;';
        const btnFirst = document.createElement('button');
        btnFirst.textContent = '«';
        btnFirst.style = buttonStyle;
        btnFirst.onclick = () => showPage(1);
        pager.appendChild(btnFirst);
        const btnPrev = document.createElement('button');
        btnPrev.textContent = '‹';
        btnPrev.style = buttonStyle;
        btnPrev.onclick = () => showPage(currentPage - 1);
        pager.appendChild(btnPrev);
        let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
        let endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);
        if (endPage - startPage + 1 < MAX_PAGE_BUTTONS) {
            startPage = Math.max(1, endPage - MAX_PAGE_BUTTONS + 1);
        }
        if (startPage > 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style = 'margin: 0 10px; color: #fff;';
            pager.appendChild(ellipsis);
        }
        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.style = buttonStyle + (i === currentPage ? activeStyle : '');
            btn.onclick = () => showPage(i);
            pager.appendChild(btn);
        }
        if (endPage < totalPages) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style = 'margin: 0 10px; color: #fff;';
            pager.appendChild(ellipsis);
        }
        const btnNext = document.createElement('button');
        btnNext.textContent = '›';
        btnNext.style = buttonStyle + (currentPage === totalPages ? disabledStyle : '');
        btnNext.onclick = () => showPage(currentPage + 1);
        btnNext.disabled = (currentPage === totalPages);
        pager.appendChild(btnNext);
        const btnLast = document.createElement('button');
        btnLast.textContent = '»';
        btnLast.style = buttonStyle + (currentPage === totalPages ? disabledStyle : '');
        btnLast.onclick = () => showPage(totalPages);
        btnLast.disabled = (currentPage === totalPages);
        pager.appendChild(btnLast);
        const pageInfo = document.createElement('span');
        pageInfo.style = 'margin-left: 15px; color: #fff;';
        pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
        pager.appendChild(pageInfo);
    }

    function showPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        updateUrlWithPage(currentPage);
        if (playlistId) storeValue('ph_current_page_' + playlistId, currentPage);
        applyCurrentPage();
        createPagination();
        const pageJumpInputs = document.querySelectorAll('input[type="number"]');
        pageJumpInputs.forEach(input => {
            input.value = currentPage;
            input.max = totalPages;
        });
        window.scrollTo(0, 0);
    }

    function applyCurrentPage() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        items.forEach((el, idx) => {
            el.style.display = (idx >= start && idx < end) ? '' : 'none';
        });
        const counter = document.getElementById('ph-counter');
        if (counter) {
            counter.textContent = `Видео ${start + 1}-${Math.min(end, items.length)} из ${items.length}`;
        }
    }

    function setupMutationObserver() {
        const container = getContainer();
        if (!container) return;
        const observer = new MutationObserver(() => refreshItemsList());
        observer.observe(container, { childList: true, subtree: true });
    }

    window.addEventListener('popstate', function() {
        const urlParams = getUrlParams();
        if (urlParams.page && urlParams.page !== currentPage && urlParams.page <= totalPages) {
            showPage(urlParams.page);
        }
    });

    function restoreStoredData() {
        if (playlistId) {
            getStoredValue(itemsCountKey, 0).then(savedItemCount => {
                if (savedItemCount > 0) {
                    lastItemCount = savedItemCount;
                    totalPages = Math.ceil(savedItemCount / itemsPerPage);
                    console.log(`[Playlist Pagination] Восстановлены данные: ${savedItemCount} видео, ${totalPages} страниц`);
                }
            });
        }
    }

    window.addEventListener('load', function() {
        restoreStoredData();
        setTimeout(() => {
            waitForContainer();
            setupMutationObserver();
        }, 1000);
    });

    window.addEventListener('beforeunload', function() {
        console.log('[Playlist Pagination] Страница закрывается, данные сессии сохранены');
    });

    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(() => {
                waitForContainer();
                setupMutationObserver();
            }, 1000);
        }
    });
    urlObserver.observe(document, { subtree: true, childList: true });

    setTimeout(() => {
        waitForContainer();
        setupMutationObserver();
    }, 1000);

    const style = document.createElement('style');
    style.textContent = `#ph-controls { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px; background: #1b1b1b; border-radius: 5px; position: sticky; top: 0; z-index: 100; } #ph-pager, #ph-pager-bottom { text-align: center; margin: 10px 0; padding: 10px; } #ph-pager button, #ph-pager-bottom button { margin: 0 3px; padding: 5px 10px; background: #ff9000; color: #000; border: none; border-radius: 3px; cursor: pointer; transition: background 0.3s; } #ph-pager button:hover, #ph-pager-bottom button:hover { background: #ffb244; } #ph-pager button:disabled, #ph-pager-bottom button:disabled { background: #444; color: #aaa; cursor: not-allowed; } #ph-pager button.active, #ph-pager-bottom button.active { background: #ff5400; font-weight: bold; } input[type="number"] { width: 60px; padding: 3px; background: #333; color: #fff; border: 1px solid #555; } input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { opacity: 1; }`;
    document.head.appendChild(style);
})();
