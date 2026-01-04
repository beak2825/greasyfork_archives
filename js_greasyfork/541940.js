// ==UserScript==
// @name         Yande.re 手动加载热门图 (日期选择版)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  点击按钮加载指定日期范围内按分数排序的热门图，支持分级、自定义日期范围和翻页加载。
// @author       银蓝色 & Gemini
// @match        https://yande.re/post*
// @grant        GM_xmlhttpRequest
// @connect      yande.re
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541940/Yandere%20%E6%89%8B%E5%8A%A8%E5%8A%A0%E8%BD%BD%E7%83%AD%E9%97%A8%E5%9B%BE%20%28%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541940/Yandere%20%E6%89%8B%E5%8A%A8%E5%8A%A0%E8%BD%BD%E7%83%AD%E9%97%A8%E5%9B%BE%20%28%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'usestric'

    // ==== 配置 ====
    const DEFAULT_DAYS_RANGE = 30; // 默认选择的日期范围（天数）
    const DEFAULT_TAGS = "";       // 可附加固定标签，如 genshin_impact。多个标签用空格隔开。
    const POSTS_PER_PAGE = 50;     // 每次加载的图片数量（Yande.re API 上限为 100）
    // ==============

    let selectedRating = "safe"; // 默认分级
    let currentPage = 1;
    let isLoading = false;

    // --- [新增] 日期处理辅助函数 ---
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    const today = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(today.getDate() - DEFAULT_DAYS_RANGE);

    // --- 1. 创建全新的操作界面 (包含日期选择) ---
    const uiBox = document.createElement("div");
    uiBox.style = "position:fixed; top:10px; right:10px; z-index:9999; background:#fff; padding:12px; border:1px solid #ccc; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 10px;";

    // 日期选择区域
    const dateContainer = document.createElement('div');
    dateContainer.style = "display: flex; align-items: center; gap: 5px;";
    dateContainer.innerHTML = `
        <label for="start-date-picker" style="font-size: 12px;">从:</label>
        <input type="date" id="start-date-picker" style="padding: 4px; border: 1px solid #ccc;">
        <label for="end-date-picker" style="font-size: 12px; margin-left: 8px;">到:</label>
        <input type="date" id="end-date-picker" style="padding: 4px; border: 1px solid #ccc;">
    `;

    // 操作区域
    const actionContainer = document.createElement('div');
    actionContainer.style = "display: flex; align-items: center; gap: 8px;";
    const ratingSelect = document.createElement("select");
    ratingSelect.style = "padding: 5px; border: 1px solid #ccc; flex-grow: 1;";
    ratingSelect.innerHTML = `
        <option value="safe">🟢 Safe</option>
        <option value="questionable">🟡 Questionable</option>
        <option value="explicit">🔴 Explicit</option>
        <option value="all">⚪️ All</option>
    `;
    ratingSelect.addEventListener("change", () => selectedRating = ratingSelect.value);

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "📥 加载热门图";
    loadBtn.style = "padding: 5px 12px; cursor: pointer; background: #3498db; color: white; border: none; border-radius: 3px;";
    loadBtn.addEventListener("click", startLoading);

    actionContainer.appendChild(ratingSelect);
    actionContainer.appendChild(loadBtn);

    uiBox.appendChild(dateContainer);
    uiBox.appendChild(actionContainer);
    document.body.appendChild(uiBox);

    // [新增] 获取日期输入框并设置默认值
    const startDateInput = document.getElementById('start-date-picker');
    const endDateInput = document.getElementById('end-date-picker');
    startDateInput.value = formatDate(defaultStartDate);
    endDateInput.value = formatDate(today);


    // --- 2. 初始化加载流程 ---
    let container, resultsContainer, loadMoreBtn;
    let selectedStartDate, selectedEndDate;

    function startLoading() {
        // [改动] 保存用户选择的日期
        selectedStartDate = startDateInput.value;
        selectedEndDate = endDateInput.value;
        if (!selectedStartDate || !selectedEndDate) {
            alert("请选择一个完整的日期范围！");
            return;
        }

        uiBox.remove();
        initUI();
        fetchAndRenderPage();
    }

    // --- 3. 创建结果显示区域 ---
    function initUI() {
        container = document.createElement('div');
        container.style = "margin:20px; padding:10px; background:#f5f5f5; border:1px solid #ddd;";

        // [改动] 标题现在显示选择的日期范围
        const ratingText = selectedRating === 'all' ? 'ALL' : selectedRating.toUpperCase();
        container.innerHTML = `<h2>🔥 热门图片 (${ratingText}) | <small>${selectedStartDate} ~ ${selectedEndDate}</small></h2>`;

        resultsContainer = document.createElement('div');
        resultsContainer.style = "display: flex; flex-wrap: wrap; justify-content: center;";
        container.appendChild(resultsContainer);

        loadMoreBtn = document.createElement('button');
        loadMoreBtn.textContent = '⏬ 加载更多...';
        loadMoreBtn.style = "display:block; width:80%; max-width:400px; margin: 20px auto; padding:12px 20px; font-size:16px; cursor: pointer; border: 1px solid #ccc;";
        loadMoreBtn.onclick = fetchAndRenderPage;

        container.appendChild(loadMoreBtn);
        const insertTarget = document.querySelector("#post-list-posts") || document.body;
        insertTarget.prepend(container);
    }

    // --- 4. 核心：获取并渲染单页数据 ---
    function fetchAndRenderPage() {
        if (isLoading) return;
        isLoading = true;
        loadMoreBtn.textContent = '正在加载中...';
        loadMoreBtn.disabled = true;

        // [改动] 使用选择的日期范围构造查询
        // Yande.re 支持 `date:YYYY-MM-DD..YYYY-MM-DD` 语法
        let tags = `date:${selectedStartDate}..${selectedEndDate} order:score`;
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
                try {
                    const posts = JSON.parse(response.responseText);
                    if (posts.length > 0) {
                        renderPosts(posts);
                        currentPage++;
                        loadMoreBtn.textContent = '⏬ 加载更多...';
                        loadMoreBtn.disabled = false;
                    } else {
                        loadMoreBtn.textContent = '✅ 已加载范围内全部图片';
                        loadMoreBtn.disabled = true;
                    }
                } catch (e) {
                     loadMoreBtn.textContent = '❌ 解析返回数据失败';
                     console.error("JSON Parse Error:", e, "Response Text:", response.responseText);
                } finally {
                    isLoading = false;
                }
            },
            onerror: function(error) {
                console.error("Yande.re Script Error:", error);
                loadMoreBtn.textContent = '❌ 加载失败，请检查控制台';
                loadMoreBtn.disabled = false;
                isLoading = false;
            }
        });
    }

    // --- 5. 渲染图片到页面 (与之前版本相同) ---
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