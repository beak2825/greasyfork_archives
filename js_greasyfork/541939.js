// ==UserScript==
// @name         Yande.re 手动加近期热门图
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  点击按钮加载指定时间范围内按分数排序的热门图，支持分级和翻页加载，性能更优，结果更准。
// @author       银蓝色 & Gemini
// @match        https://yande.re/post*
// @grant        GM_xmlhttpRequest
// @connect      yande.re
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541939/Yandere%20%E6%89%8B%E5%8A%A8%E5%8A%A0%E8%BF%91%E6%9C%9F%E7%83%AD%E9%97%A8%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/541939/Yandere%20%E6%89%8B%E5%8A%A8%E5%8A%A0%E8%BF%91%E6%9C%9F%E7%83%AD%E9%97%A8%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==== 配置 ====
    const DAYS_BACK = 500;     // 搜索范围：最近 N 天
    const DEFAULT_TAGS = "";   // 可附加固定标签，如 genshin_impact。多个标签用空格隔开。
    const POSTS_PER_PAGE = 50; // 每次加载的图片数量（Yande.re API 上限为 100）
    // ==============

    let selectedRating = "safe"; // 默认分级
    let currentPage = 1;         // 当前加载的页码
    let isLoading = false;       // 请求状态锁，防止重复点击

    // --- 1. 创建初始操作界面 ---
    const uiBox = document.createElement("div");
    uiBox.style = "position:fixed; top:20px; right:20px; z-index:9999; background:#fff; padding:10px; border:1px solid #ccc; box-shadow: 0 2px 5px rgba(0,0,0,0.2);";

    const ratingSelect = document.createElement("select");
    ratingSelect.style = "padding: 5px; border: 1px solid #ccc;";
    ratingSelect.innerHTML = `
        <option value="safe">🟢 Safe</option>
        <option value="questionable">🟡 Questionable</option>
        <option value="explicit">🔴 Explicit</option>
        <option value="all">⚪️ All</option>
    `;
    ratingSelect.addEventListener("change", () => selectedRating = ratingSelect.value);

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "📥 加载热门图";
    loadBtn.style = "margin-left:10px; padding: 5px 10px; cursor: pointer;";
    loadBtn.addEventListener("click", startLoading);

    uiBox.appendChild(ratingSelect);
    uiBox.appendChild(loadBtn);
    document.body.appendChild(uiBox);

    // --- 2. 初始化加载流程 ---
    let container, resultsContainer, loadMoreBtn;

    function startLoading() {
        // 移除初始按钮，创建结果容器
        uiBox.remove();
        initUI();
        // 首次加载第一页数据
        fetchAndRenderPage();
    }

    // --- 3. 创建结果显示区域 ---
    function initUI() {
        container = document.createElement('div');
        container.style = "margin:20px; padding:10px; background:#f5f5f5; border:1px solid #ddd;";
        const ratingText = selectedRating === 'all' ? 'ALL' : selectedRating.toUpperCase();
        container.innerHTML = `<h2>🔥 最近 ${DAYS_BACK} 天热门图片 (${ratingText})</h2>`;

        resultsContainer = document.createElement('div');
        resultsContainer.style = "display: flex; flex-wrap: wrap; justify-content: center;";
        container.appendChild(resultsContainer);

        loadMoreBtn = document.createElement('button');
        loadMoreBtn.textContent = '⏬ 加载更多...';
        loadMoreBtn.style = "display:block; width:80%; max-width:400px; margin: 20px auto; padding:12px 20px; font-size:16px; cursor: pointer; border: 1px solid #ccc;";
        loadMoreBtn.onclick = fetchAndRenderPage; // 点击加载下一页

        container.appendChild(loadMoreBtn);

        // 将结果容器插入到页面合适位置
        const insertTarget = document.querySelector("#post-list-posts") || document.body;
        insertTarget.prepend(container);
    }

    // --- 4. 核心：获取并渲染单页数据 ---
    function fetchAndRenderPage() {
        if (isLoading) return;
        isLoading = true;
        loadMoreBtn.textContent = '正在加载中...';
        loadMoreBtn.disabled = true;

        const sinceDate = new Date(new Date().getTime() - DAYS_BACK * 86400000);
        const sinceStr = sinceDate.toISOString().split("T")[0];

        // 构造查询标签
        let tags = `date:>${sinceStr} order:score`; // [修正] 核心改动：在查询中加入 order:score
        if (selectedRating !== "all") {
            tags += ` rating:${selectedRating}`;
        }
        if (DEFAULT_TAGS) {
            tags += ` ${DEFAULT_TAGS}`;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://yande.re/post.json?tags=${encodeURIComponent(tags)}&page=${currentPage}&limit=${POSTS_PER_PAGE}`,
            onload: function (response) {
                const posts = JSON.parse(response.responseText);

                if (posts.length > 0) {
                    renderPosts(posts);
                    currentPage++; // 准备加载下一页
                    loadMoreBtn.textContent = '⏬ 加载更多...';
                    loadMoreBtn.disabled = false;
                } else {
                    loadMoreBtn.textContent = '✅ 已加载全部图片';
                    loadMoreBtn.disabled = true;
                }
                isLoading = false;
            },
            onerror: function(error) {
                console.error("Yande.re Script Error:", error);
                loadMoreBtn.textContent = '❌ 加载失败，请检查控制台';
                loadMoreBtn.disabled = false; // 允许重试
                isLoading = false;
            }
        });
    }

    // --- 5. 渲染图片到页面 ---
    function renderPosts(posts) {
        const fragment = document.createDocumentFragment();
        posts.forEach(post => {
            const div = document.createElement('div');
            div.style = "display:inline-block; margin:8px; text-align:center; width:180px; vertical-align: top; background: #fff; padding: 5px; border: 1px solid #ddd;";
            div.innerHTML = `
                <a href="/post/show/${post.id}" target="_blank" title="Tags: ${post.tags}">
                    <img src="${post.preview_url}" style="max-width:170px; height: 170px; object-fit: cover; border:1px solid #ccc;">
                </a>
                <div style="font-size:12px; margin-top:5px;">⭐ ${post.score}</div>
            `;
            fragment.appendChild(div);
        });
        resultsContainer.appendChild(fragment);
    }

})();