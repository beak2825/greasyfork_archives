// ==UserScript==
// @name         Douban Hover Card
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  鼠标悬停在豆瓣链接上时，显示电影海报、评分、简介及详细信息。优化了防闪烁、关闭不及时以及海报加载失败的问题。
// @author       zuoans
// @match        *://pterclub.com/details.php?id=*
// @exclude      *.douban.com/*
// @grant        GM_xmlhttpRequest
// @connect      movie.douban.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541836/Douban%20Hover%20Card.user.js
// @updateURL https://update.greasyfork.org/scripts/541836/Douban%20Hover%20Card.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ------------------------------
    // 1. 创建或获取悬浮窗 (无变化)
    // ------------------------------
    let tooltipDiv;
    let activeLink = null;
    let cache = {};

    function createTooltip() {
        tooltipDiv = document.createElement("div");
        tooltipDiv.id = "douban-tooltip";
        tooltipDiv.style.position = "absolute";
        tooltipDiv.style.backgroundColor = "#fff";
        tooltipDiv.style.border = "1px solid #ccc";
        tooltipDiv.style.padding = "12px";
        tooltipDiv.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
        tooltipDiv.style.display = "none";
        tooltipDiv.style.zIndex = "9999";
        tooltipDiv.style.maxWidth = "450px";
        tooltipDiv.style.fontSize = "13px";
        tooltipDiv.style.lineHeight = "1.6";
        tooltipDiv.style.borderRadius = "8px";
        tooltipDiv.style.textAlign = "left";
        document.body.appendChild(tooltipDiv);
        return tooltipDiv;
    }

    tooltipDiv = document.getElementById("douban-tooltip") || createTooltip();


    // ------------------------------
    // 2. 监听鼠标事件 (无变化)
    // ------------------------------
    let hideTooltipTimeout;
    const hideDelay = 300;

    const scheduleHide = () => {
        clearTimeout(hideTooltipTimeout);
        hideTooltipTimeout = setTimeout(() => {
            tooltipDiv.style.display = "none";
            activeLink = null;
        }, hideDelay);
    };

    const cancelHide = () => {
        clearTimeout(hideTooltipTimeout);
    };

    document.addEventListener("mouseover", function (e) {
        const target = e.target.closest('a[href*="movie.douban.com/subject/"]');
        if (target) {
            cancelHide();
            if (target !== activeLink) {
                activeLink = target;
                fetchDoubanInfo(target.href, tooltipDiv, target);
            }
        }
    });

    document.addEventListener("mouseout", function (e) {
        const target = e.target.closest('a[href*="movie.douban.com/subject/"]');
        if (target && !tooltipDiv.contains(e.relatedTarget)) {
            scheduleHide();
        }
    });

    tooltipDiv.addEventListener("mouseover", cancelHide);
    tooltipDiv.addEventListener("mouseout", (e) => {
        if (!activeLink || !activeLink.contains(e.relatedTarget)) {
            scheduleHide();
        }
    });

    // ------------------------------
    // 3. 解析所有信息 (无变化)
    // ------------------------------
    function parseAllInfo(doc) {
        const info = {};
        const infoDiv = doc.querySelector("#info");
        if (!infoDiv) return info;

        const keyMap = {
            '导演': 'director', '编剧': 'writer', '主演': 'cast', '类型': 'genre',
            '制片国家/地区': 'country', '语言': 'language', '上映日期': 'releaseDate',
            '片长': 'runtime', '又名': 'aka', 'IMDb': 'imdb'
        };

        const plElements = infoDiv.querySelectorAll("span.pl");
        plElements.forEach(pl => {
            const label = pl.textContent.replace(/[:：\s]/g, '').trim();
            const key = keyMap[label];
            if (key) {
                let currentNode = pl;
                let content = '';
                while (currentNode.nextSibling && currentNode.nextSibling.nodeName.toLowerCase() !== 'br' && (currentNode.nextSibling.nodeName.toLowerCase() !== 'span' || !currentNode.nextSibling.classList.contains('pl'))) {
                    currentNode = currentNode.nextSibling;
                    content += currentNode.textContent.trim() + ' ';
                }
                info[key] = content.replace(/\/$/, '').trim() || '暂无';
            }
        });
        return info;
    }

    // ------------------------------
    // 4. 获取并展示豆瓣信息 (【关键修改】增加图片后备逻辑)
    // ------------------------------
    function fetchDoubanInfo(doubanUrl, tooltip, target) {
        if (cache[doubanUrl]) {
            displayTooltip(cache[doubanUrl], tooltip, target);
            return;
        }

        tooltip.innerHTML = '<div style="text-align: center; padding: 20px;">正在加载...</div>';
        positionTooltip(tooltip, target);
        tooltip.style.display = 'block';

        GM_xmlhttpRequest({
            method: "GET",
            url: doubanUrl,
            onload: function (response) {
                if (response.status !== 200) {
                    tooltip.innerHTML = `<div style="color: red;">请求失败: ${response.status}</div>`;
                    return;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");

                const info = parseAllInfo(doc);
                const title = doc.querySelector('h1 span[property="v:itemreviewed"]')?.textContent.trim() || "未知标题";
                const year = doc.querySelector('h1 .year')?.textContent.replace(/[\(\)]/g, '') || "";
                const rating = doc.querySelector("strong.rating_num")?.textContent.trim() || "暂无评分";

                // 【修改】同时获取原始海报和高清海报地址
                const originalCover = doc.querySelector("#mainpic img")?.src || "";
                const largeCover = originalCover.replace(/img\d+\.doubanio\.com\/view\/photo\/s_ratio_poster/, 'img1.doubanio.com/view/photo/l/public');

                let summary = doc.querySelector("div.related-info span[property='v:summary']")?.textContent.trim().replace(/^\s*/gm, '') || "暂无简介";
                if (summary.length > 250) summary = summary.substring(0, 250) + "...";

                if (info.cast && info.cast.split(' / ').length > 4) {
                    info.cast = info.cast.split(' / ').slice(0, 4).join(' / ') + ' / 更多...';
                }
                if (info.aka && info.aka.split(' / ').length > 4) {
                    info.aka = info.aka.split(' / ').slice(0, 4).join(' / ') + ' / 更多...';
                }

                // 【修改】将两个海报地址都存起来
                const data = { title, year, rating, cover: { large: largeCover, original: originalCover }, summary, info };
                cache[doubanUrl] = data;
                displayTooltip(data, tooltip, target);
            },
            onerror: function (err) {
                console.error("网络请求出错:", err);
                tooltip.innerHTML = `<div style="color: red;">网络请求出错</div>`;
            }
        });
    }

    function displayTooltip(data, tooltip, target) {
        // 【关键修改】在这里实现海报的智能加载和界面布局优化
        tooltip.innerHTML = `
            <div style="display: flex; gap: 15px;">
                <div style="flex-shrink: 0; width: 100px; min-height: 140px;">
                    <img src="${data.cover.large}"
                         alt="封面: ${data.title}"
                         referrerpolicy="no-referrer"
                         style="width: 100px; height: auto; display: block; border-radius: 4px; background-color: #f0f0f0;"
                         onerror="this.onerror=null; this.src='${data.cover.original}';">
                </div>
                <div style="flex-grow: 1; min-width: 0;">
                    <h3 style="margin:0 0 8px 0; font-size: 16px; font-weight: 600;">${data.title} (${data.year})</h3>
                    <p style="margin: 2px 0;"><strong>评分:</strong> ⭐ ${data.rating}</p>
                    <p style="margin: 2px 0; word-wrap: break-word;"><strong>类型:</strong> ${data.info.genre || '暂无'}</p>
                    <p style="margin: 2px 0; word-wrap: break-word;"><strong>主演:</strong> ${data.info.cast || '暂无'}</p>
                </div>
            </div>
            <div style="margin-top: 10px; border-top: 1px solid #eaeaea; padding-top: 10px;">
                <p style="margin: 2px 0;"><strong>导演:</strong> ${data.info.director || '暂无'}</p>
                <p style="margin: 2px 0;"><strong>编剧:</strong> ${data.info.writer || '暂无'}</p>
                <p style="margin: 2px 0;"><strong>国家/地区:</strong> ${data.info.country || '暂无'}</p>
                <p style="margin: 2px 0;"><strong>语言:</strong> ${data.info.language || '暂无'}</p>
                <p style="margin: 2px 0;"><strong>上映日期:</strong> ${data.info.releaseDate || '暂无'}</p>
                <p style="margin: 2px 0;"><strong>片长:</strong> ${data.info.runtime || '暂无'}</p>
                <p style="margin: 2px 0; word-wrap: break-word;"><strong>又名:</strong> ${data.info.aka || '暂无'}</p>
                <p style="margin: 2px 0;"><strong>IMDb:</strong> ${data.info.imdb || '暂无'}</p>
            </div>
            <div style="margin-top: 10px; border-top: 1px solid #eaeaea; padding-top: 8px;">
                <p style="margin: 0; line-height: 1.5;">${data.summary}</p>
            </div>
        `;
        positionTooltip(tooltip, target);
        tooltip.style.display = 'block';
    }

    // ------------------------------
    // 5. 定位悬浮窗 (无变化)
    // ------------------------------
    function positionTooltip(tooltip, target) {
        const rect = target.getBoundingClientRect();
        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        tooltip.style.display = 'block';
        const tooltipRect = tooltip.getBoundingClientRect();

        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 20;
        }
        if (top + tooltipRect.height > (window.innerHeight - 10)) {
            top = rect.top + window.scrollY - tooltipRect.height;
        }

        tooltip.style.left = `${left < 0 ? 10 : left}px`;
        tooltip.style.top = `${top}px`;
    }
})();