// ==UserScript==
// @name         番茄小说榜单加载更
// @namespace    http://tampermonkey.net/
// @version      1.6
// @license      MIT License
// @description  【SPA兼容版】在番茄小说榜单页(fanqienovel.com/rank/*)添加一个悬浮按钮，可一键“加载更多”或开启“无限滚动”。脚本会自动适应页面内导航，无需刷新。
// @author       Your Name (based on user request)
// @match        https://fanqienovel.com/rank/*
// @icon         https://lf-cdn-tos.bytescm.com/obj/static/web.novel.web/prod/static/img/favicon.1d332.ico
// @connect      fanqienovel.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/539279/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E6%A6%9C%E5%8D%95%E5%8A%A0%E8%BD%BD%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/539279/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E6%A6%9C%E5%8D%95%E5%8A%A0%E8%BD%BD%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局状态和配置 ---
    let state = {};
    let config = {};

    function resetState() {
        state = {
            isLoading: false,
            currentOffset: 30, // 页面初始加载了30条，每次重置都恢复
            hasMore: true,
            params: { gender: '1', rankMold: '1', categoryId: '1140' }
        };
        // 配置信息从存储中读取，不重置用户的选择
        config = {
            loadCount: GM_getValue('fq_load_count', 30),
            isInfiniteScroll: GM_getValue('fq_infinite_scroll', false)
        };
    }

    // --- 主要功能函数 (无变化，折叠以节省空间) ---
    function parseUrlParams() { try { const pathParts = window.location.pathname.split('/'); const paramsStr = pathParts[pathParts.length - 1]; const [gender, rankMold, categoryId] = paramsStr.split('_'); if (gender && rankMold && categoryId) { state.params.gender = gender; state.params.rankMold = rankMold; state.params.categoryId = categoryId; return true; } } catch (e) { console.error('番茄脚本: 解析URL参数失败', e); } return false; }
    function formatReadCount(countStr) { const count = parseInt(countStr, 10); if (isNaN(count)) return '0'; if (count >= 10000) { return (count / 10000).toFixed(1) + '万'; } return count.toString(); }
    function createBookElement(book, index) { const item = document.createElement('div'); item.className = 'rank-book-item'; const statusMap = { '1': '连载中', '2': '已完结' }; const creationStatus = statusMap[book.creationStatus] || '连载中'; const readCount = formatReadCount(book.read_count); const lastChapterUpdate = book.lastChapterTitle ? `<div class="serial-divider  byte-divider byte-divider-vertical"></div><span class="book-item-footer-last"><a class="chapter" href="/reader/${book.lastChapterItemId}">最近更新：${book.lastChapterTitle}</a></span>` : ''; let rankDiffHTML = ''; const diff = parseInt(book.rankPosDiff, 10); if (diff > 0) { rankDiffHTML = `<p><span class="up"></span>${diff}</p>`; } else if (diff < 0) { rankDiffHTML = `<p><span class="down"></span>${Math.abs(diff)}</p>`; } else { rankDiffHTML = '<p>-</p>'; } item.innerHTML = `<div class="book-item-index"><h1>${index}</h1>${rankDiffHTML}</div><div class="muye-book-cover book-item-cover is-book has-hover"><div class="book-cover" style="border-radius: 5px;"><img class="book-cover-img loaded" src="${book.thumbUri}" alt="${book.bookName}"><div class="book-effect book-animate-effect"></div></div></div><div class="book-item-text"><div class="title"><a href="/page/${book.bookId}" class="font-DNMrHsV173Pd4pgy">${book.bookName}</a></div><div class="author"><a href="/author-page/${book.uid}" target="_blank"><span class="font-DNMrHsV173Pd4pgy">${book.author}</span></a></div><div class="desc abstract font-DNMrHsV173Pd4pgy">${book.abstract}</div><div class="book-item-footer"><span class="book-item-footer-status">${creationStatus}</span><div class="serial-divider  byte-divider byte-divider-vertical"></div><span class="book-item-count">在读：${readCount}</span>${lastChapterUpdate}</div></div>`; return item; }
    function renderBookList(bookList) { const listContainer = document.querySelector('.muye-rank-book-list'); if (!listContainer) return; const fragment = document.createDocumentFragment(); bookList.forEach((book, i) => { const rankIndex = state.currentOffset + i + 1; const bookElement = createBookElement(book, rankIndex); fragment.appendChild(bookElement); }); listContainer.appendChild(fragment); state.currentOffset += bookList.length; }
    function fetchMoreBooks() { if (state.isLoading || !state.hasMore) return; state.isLoading = true; updateUIButton('loading'); const { gender, rankMold, categoryId } = state.params; const apiUrl = `https://fanqienovel.com/api/rank/category/list?app_id=1967&rank_list_type=3&offset=${state.currentOffset}&limit=${config.loadCount}&category_id=${categoryId}&rank_version=&gender=${gender}&rankMold=${rankMold}`; GM_xmlhttpRequest({ method: 'GET', url: apiUrl, headers: { "Accept": "application/json, text/plain, */*" }, onload: function(response) { try { const res = JSON.parse(response.responseText); if (res.code === 0 && res.data && res.data.book_list && res.data.book_list.length > 0) { renderBookList(res.data.book_list); if (res.data.book_list.length < config.loadCount || res.data.has_more === false) { state.hasMore = false; updateUIButton('nomore'); } else { updateUIButton('more'); } } else { state.hasMore = false; updateUIButton('nomore'); } } catch (e) { updateUIButton('error'); } finally { state.isLoading = false; } }, onerror: function(error) { state.isLoading = false; updateUIButton('error'); } }); }


    // --- UI 相关函数 ---
    function updateUIButton(status) { const btn = document.getElementById('fq-load-more-btn'); if (!btn) return; if (config.isInfiniteScroll && status !== 'loading') { btn.textContent = '无限滚动中'; btn.disabled = true; return; } switch (status) { case 'loading': btn.textContent = '加载中...'; btn.disabled = true; break; case 'nomore': btn.textContent = '已无更多'; btn.disabled = true; break; case 'error': btn.textContent = '加载失败,请重试'; btn.disabled = false; break; case 'more': default: btn.textContent = '加载更多'; btn.disabled = false; break; } }
    function createUI() { const panelHTML = `<div id="fq-container"><div id="fq-panel"><button id="fq-load-more-btn">加载更多</button><div id="fq-panel-toggle">⚙️</div></div><div id="fq-panel-menu" class="hidden"><div class="fq-panel-row"><label for="fq-load-count">每次加载:</label><input type="number" id="fq-load-count" value="${config.loadCount}" min="10" max="200" step="10"><button id="fq-set-count-btn">设置</button></div><div class="fq-panel-row"><label for="fq-infinite-scroll">无限滚动:</label><input type="checkbox" id="fq-infinite-scroll" ${config.isInfiniteScroll ? 'checked' : ''}></div></div></div>`; document.body.insertAdjacentHTML('beforeend', panelHTML); GM_addStyle(`#fq-container { position: fixed; top: 180px; right: 20px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; } #fq-panel { display: flex; align-items: stretch; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; overflow: hidden; } #fq-load-more-btn { padding: 0 20px; height: 40px; border: none; background-color: #ff5722; color: white; cursor: pointer; font-size: 14px; transition: background-color 0.2s; } #fq-load-more-btn:hover:not(:disabled) { background-color: #e64a19; } #fq-load-more-btn:disabled { background-color: #ccc; color: #666; cursor: not-allowed; } #fq-panel-toggle { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; user-select: none; background: #f5f5f5; border-left: 1px solid #ddd; } #fq-panel-toggle:hover { background: #e0e0e0; } #fq-panel-menu { position: absolute; bottom: 100%; right: 0; margin-bottom: 10px; width: 230px; padding: 10px; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #eee; } #fq-panel-menu.hidden { display: none; } .fq-panel-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; } .fq-panel-row:last-child { margin-bottom: 0; } .fq-panel-row label { font-size: 14px; color: #333; } #fq-load-count { width: 60px; text-align: center; border: 1px solid #ccc; border-radius: 4px; padding: 4px; } #fq-set-count-btn { padding: 4px 8px; font-size: 12px; background: #eee; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; } #fq-infinite-scroll { transform: scale(1.2); cursor: pointer; }`); document.getElementById('fq-load-more-btn').addEventListener('click', fetchMoreBooks); document.getElementById('fq-panel-toggle').addEventListener('click', () => { document.getElementById('fq-panel-menu').classList.toggle('hidden'); }); document.getElementById('fq-set-count-btn').addEventListener('click', () => { const countInput = document.getElementById('fq-load-count'); const newCount = parseInt(countInput.value, 10); if (!isNaN(newCount) && newCount > 0) { config.loadCount = newCount; GM_setValue('fq_load_count', newCount); alert(`设置成功！下次将加载 ${newCount} 条。`); } else { alert('请输入有效的数字！'); countInput.value = config.loadCount; } }); const infiniteScrollCheckbox = document.getElementById('fq-infinite-scroll'); infiniteScrollCheckbox.addEventListener('change', () => { config.isInfiniteScroll = infiniteScrollCheckbox.checked; GM_setValue('fq_infinite_scroll', config.isInfiniteScroll); updateUIButton('more'); if (config.isInfiniteScroll) { handleScroll(); } }); updateUIButton('more'); }
    function handleScroll() { if (!config.isInfiniteScroll || state.isLoading || !state.hasMore) return; if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 500) { fetchMoreBooks(); } }

    // --- 【核心】脚本主逻辑：监听并响应页面变化 ---
    let currentPath = '';

    function init() {
        // 1. 重置所有状态，为新页面做准备
        resetState();
        // 2. 解析新页面的URL参数
        if (!parseUrlParams()) return;
        // 3. 创建UI
        createUI();
        // 4. 添加滚动监听
        window.addEventListener('scroll', handleScroll);
    }

    const observer = new MutationObserver(() => {
        // 检查URL是否变化
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;

            // 清理旧的UI和事件监听器
            const oldUI = document.getElementById('fq-container');
            if (oldUI) {
                oldUI.remove();
            }
            window.removeEventListener('scroll', handleScroll);

            // 延迟一点时间等待页面内容渲染，然后重新初始化
            setTimeout(init, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();