// ==UserScript==
// @name         Danbooru 热门图展示
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  加载 Danbooru 图片，自定义标签、数量，切换预览图和中图显示，并支持近N天高分图搜索。可导出作者名为文本文件。无法预览的图片将显示占位图供跳转。
// @author       OpenAI
// @match        https://danbooru.donmai.us/*
// @grant        GM_xmlhttpRequest
// @connect      danbooru.donmai.us
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542374/Danbooru%20%E7%83%AD%E9%97%A8%E5%9B%BE%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/542374/Danbooru%20%E7%83%AD%E9%97%A8%E5%9B%BE%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentPage = 1;
    let isLoading = false;
    let customTags = "genshin_impact score:>100";
    let limit = 100;
    let imgSizeMode = "preview";
    let authorList = new Set();

    window.addEventListener('load', () => {
        createMainUI();
        createRecentSearchUI();
    });

    function createMainUI() {
        const panel = document.createElement("div");
        panel.style = `
            position:fixed; top:20px; right:20px; z-index:9999;
            background:white; padding:10px; border:1px solid #ccc;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        const tagInput = document.createElement("input");
        tagInput.value = customTags;
        tagInput.placeholder = "输入 Danbooru 标签";
        tagInput.style = "width:200px; padding:5px; margin-bottom:5px;";

        const limitInput = document.createElement("input");
        limitInput.type = "number";
        limitInput.min = 1;
        limitInput.max = 100;
        limitInput.value = limit;
        limitInput.style = "width:60px; margin-left:10px;";

        const sizeSelect = document.createElement("select");
        sizeSelect.style = "margin-left:10px; padding:5px;";
        sizeSelect.innerHTML = `
            <option value="preview">预览图</option>
            <option value="sample">中图</option>
        `;
        sizeSelect.value = imgSizeMode;
        sizeSelect.onchange = () => {
            imgSizeMode = sizeSelect.value;
        };

        const btn = document.createElement("button");
        btn.textContent = "📥 加载图片";
        btn.style = "display:block; margin-top:10px; padding:5px 10px;";
        btn.onclick = () => {
            customTags = tagInput.value.trim();
            limit = parseInt(limitInput.value) || 100;
            currentPage = 1;
            resultContainer.innerHTML = "";
            authorList.clear();
            fetchImages();
        };

        const exportBtn = document.createElement("button");
        exportBtn.textContent = "📄 导出作者名";
        exportBtn.style = "display:block; margin-top:10px; padding:5px 10px;";
        exportBtn.onclick = exportAuthorNames;

        panel.appendChild(tagInput);
        panel.appendChild(limitInput);
        panel.appendChild(sizeSelect);
        panel.appendChild(btn);
        panel.appendChild(exportBtn);
        document.body.appendChild(panel);
    }

    function createRecentSearchUI() {
        const panel = document.createElement("div");
        panel.style = `
            position:fixed; top:20px; left:20px; z-index:9999;
            background:white; padding:10px; border:1px solid #ccc;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        const recentTagInput = document.createElement("input");
        recentTagInput.placeholder = "标签（如 genshin_impact）";
        recentTagInput.style = "width:200px; padding:5px; margin-bottom:5px;";
        recentTagInput.value = "score:>100";

        const daysInput = document.createElement("input");
        daysInput.type = "number";
        daysInput.min = 1;
        daysInput.value = 500;
        daysInput.title = "近多少天";
        daysInput.style = "width:60px; margin-left:10px;";

        const recentBtn = document.createElement("button");
        recentBtn.textContent = "🔍 搜索近N天高分图";
        recentBtn.style = "display:block; margin-top:10px; padding:5px 10px;";
        recentBtn.onclick = () => {
            const userTags = recentTagInput.value.trim();
            const days = parseInt(daysInput.value) || 500;
            const today = new Date();
            const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
            const formattedDate = pastDate.toISOString().split("T")[0];

            customTags = `${userTags} date:>=${formattedDate} order:score`;
            limit = 100;
            currentPage = 1;
            authorList.clear();
            resultContainer.innerHTML = "";
            fetchImages();
        };

        panel.appendChild(recentTagInput);
        panel.appendChild(daysInput);
        panel.appendChild(recentBtn);
        document.body.appendChild(panel);
    }

    const resultContainer = document.createElement("div");
    resultContainer.style = `
        margin-top:100px; padding:10px;
        display:flex; flex-wrap:wrap; justify-content:center;
    `;
    document.body.appendChild(resultContainer);

    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.textContent = "⏬ 加载更多";
    loadMoreBtn.style = "display:block; margin:20px auto; padding:10px 20px;";
    loadMoreBtn.onclick = fetchImages;
    document.body.appendChild(loadMoreBtn);

    function fetchImages() {
        if (isLoading) return;
        isLoading = true;
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = "加载中...";

        const url = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(customTags)}&limit=${limit}&page=${currentPage}`;

        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: res => {
                const data = JSON.parse(res.responseText);
                if (data.length === 0) {
                    loadMoreBtn.textContent = "✅ 已无更多";
                    isLoading = false;
                    return;
                }

                data.forEach(post => {
                    if (post.tag_string_artist) {
                        post.tag_string_artist.split(" ").forEach(name => authorList.add(name));
                    }

                    let imgUrl = imgSizeMode === "sample" && post.sample_file_url
                        ? post.sample_file_url
                        : post.preview_file_url;

                    if (!imgUrl) {
                        // 使用 SVG 灰色占位图
                        imgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
                                <rect width="100%" height="100%" fill="#ccc"/>
                                <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14" fill="#666">🔒 无预览</text>
                            </svg>
                        `);
                    }

                    const div = document.createElement("div");
                    div.style = "margin:10px; width:180px; text-align:center; background:#fff; border:1px solid #ddd; padding:5px;";
                    div.innerHTML = `
                        <a href="https://danbooru.donmai.us/posts/${post.id}" target="_blank">
                            <img src="${imgUrl}" style="width:160px; height:160px; object-fit:cover; border:1px solid #ccc;">
                        </a>
                        <div style="font-size:12px;">⭐ ${post.score}</div>
                    `;
                    resultContainer.appendChild(div);
                });

                currentPage++;
                isLoading = false;
                loadMoreBtn.disabled = false;
                loadMoreBtn.textContent = "⏬ 加载更多";
            },
            onerror: err => {
                console.error("请求失败:", err);
                loadMoreBtn.textContent = "❌ 加载失败";
                loadMoreBtn.disabled = false;
                isLoading = false;
            }
        });
    }

    function exportAuthorNames() {
        if (authorList.size === 0) {
            alert("还没有加载任何作者数据！");
            return;
        }

        const blob = new Blob([Array.from(authorList).join("\n")], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `danbooru_authors_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
})();
