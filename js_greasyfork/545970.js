// ==UserScript==
// @name         Bangumi Staff作品速览
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 Bangumi 条目页面，鼠标悬停在 Staff 名字上时显示其参与作品信息。作品按评分人数排序，动态展示数量。适合看新番的时候快速认知各个staff。
// @author       You
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        GM_xmlhttpRequest
// @connect      api.bgm.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545970/Bangumi%20Staff%E4%BD%9C%E5%93%81%E9%80%9F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545970/Bangumi%20Staff%E4%BD%9C%E5%93%81%E9%80%9F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const TOOLTIP_WIDTH = 480;
    const MAX_WORKS_TO_SHOW = 50;
    const MIN_WORKS_TO_SHOW = 5;
    const REQUEST_DELAY_MIN = 200;
    const REQUEST_DELAY_MAX = 500;
    const CACHE_EXPIRY = 30 * 60 * 1000; // 30分钟
    const IMAGE_SIZE = 'grid';

    // --- 工具函数 ---
    function formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const parts = dateStr.split('-');
        if (parts.length > 0 && parts[0]) {
            return parts[0];
        }
        return 'N/A';
    }

    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // --- 缓存 ---
    const cache = {
        data: {},
        set(key, value) {
            this.data[key] = {
                value: value,
                timestamp: Date.now()
            };
        },
        get(key) {
            const item = this.data[key];
            if (item && (Date.now() - item.timestamp) < CACHE_EXPIRY) {
                return item.value;
            }
            delete this.data[key];
            return null;
        }
    };

    // --- 核心逻辑 ---
    let tooltip = null;
    let currentFetchRequest = null;
    let hideTimeout = null;

    function createTooltip() {
        if (tooltip) return;

        tooltip = document.createElement('div');
        tooltip.id = 'bangumi-staff-tooltip-v1';
        tooltip.style.cssText = `
            position: fixed;
            z-index: 9999;
            width: ${TOOLTIP_WIDTH}px;
            max-height: 600px;
            overflow-y: auto;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #333;
            line-height: 1.6;
            display: none;
            left: -1000px;
            top: -1000px;
        `;
        document.body.appendChild(tooltip);

        tooltip.addEventListener('mouseenter', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        tooltip.addEventListener('mouseleave', (e) => {
            if (!e.relatedTarget || !e.relatedTarget.closest('a[href*="/person/"]')) {
                scheduleHideTooltip();
            }
        });

        const style = document.createElement('style');
        style.textContent = `
            #bangumi-staff-tooltip-v1 .tooltip-header {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
                gap: 10px;
            }
            #bangumi-staff-tooltip-v1 .tooltip-name {
                font-size: 20px;
                font-weight: 700;
                color: #0066cc;
                flex: 1;
                min-width: 0;
            }
            #bangumi-staff-tooltip-v1 .tooltip-name-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #bangumi-staff-tooltip-v1 .tooltip-stats {
                font-size: 13px;
                color: #666;
                white-space: nowrap;
            }
            #bangumi-staff-tooltip-v1 .tooltip-bio {
                font-size: 14px;
                color: #555;
                margin-bottom: 16px;
                line-height: 1.5;
            }
            #bangumi-staff-tooltip-v1 .tooltip-works-list {
                max-height: 400px;
                overflow-y: auto;
                padding-right: 8px;
                list-style: none;
                padding: 0;
                margin: 0 0 10px 0;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-item {
                display: flex;
                margin-bottom: 16px;
                padding: 12px;
                border-radius: 8px;
                background: white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-cover-container {
                width: 60px;
                height: 80px;
                flex-shrink: 0;
                border-radius: 4px;
                overflow: hidden;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-cover {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-content {
                flex: 1;
                margin-left: 16px;
                min-width: 0;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-title-row {
                display: flex;
                align-items: center;
                margin-bottom: 6px;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-title {
                font-weight: 700;
                color: #222;
                text-decoration: none;
                font-size: 15px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
                min-width: 0;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-title:hover {
                color: #0056b3;
                text-decoration: underline;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-meta {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 6px;
                font-size: 13px;
                color: #666;
                gap: 8px;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-year,
            #bangumi-staff-tooltip-v1 .tooltip-work-rating-count {
                background: #f0f0f0;
                padding: 2px 6px;
                border-radius: 4px;
                flex-shrink: 0;
            }
            #bangumi-staff-tooltip-v1 .tooltip-work-role {
                font-size: 13px;
                color: #555;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #bangumi-staff-tooltip-v1 .loading {
                text-align: center;
                padding: 30px 20px;
                color: #666;
            }
            #bangumi-staff-tooltip-v1 .loading::before {
                content: "";
                display: block;
                width: 40px;
                height: 40px;
                margin: 0 auto 15px;
                border: 3px solid rgba(0,119,204,0.2);
                border-top: 3px solid #0077cc;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            #bangumi-staff-tooltip-v1 .error {
                color: #e53935;
                padding: 15px;
                text-align: center;
                background: #fff2f2;
                border-radius: 8px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            #bangumi-staff-tooltip-v1 .tooltip-works-list::-webkit-scrollbar {
                width: 6px;
            }
            #bangumi-staff-tooltip-v1 .tooltip-works-list::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            #bangumi-staff-tooltip-v1 .tooltip-works-list::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 10px;
            }
            #bangumi-staff-tooltip-v1 .tooltip-works-list::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
        `;
        document.head.appendChild(style);
    }

    function updateTooltipPosition(x, y) {
        if (!tooltip) return;
        const rect = tooltip.getBoundingClientRect();
        let finalX = x;
        let finalY = y + 10;

        if (finalX + rect.width > window.innerWidth) {
            finalX = window.innerWidth - rect.width - 10;
        }
        if (finalY + rect.height > window.innerHeight) {
            finalY = y - rect.height - 10;
        }

        tooltip.style.left = `${finalX}px`;
        tooltip.style.top = `${finalY}px`;
    }

    function showTooltip(htmlContent, x, y) {
        if (!tooltip) createTooltip();

        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        tooltip.innerHTML = htmlContent;
        tooltip.style.display = 'block';
        updateTooltipPosition(x, y);
    }

    function scheduleHideTooltip() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
        hideTimeout = setTimeout(() => {
            hideTooltip();
        }, 300); // 300ms 延迟隐藏
    }

    function hideTooltip() {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
        if (currentFetchRequest) {
            currentFetchRequest.abort();
            currentFetchRequest = null;
        }
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    }

    function sortWorksByRatingCount(works) {
        if (!Array.isArray(works)) return works;
        return [...works].sort((a, b) => {
            // 安全地获取评分人数，默认为0
            const countA = (a.rating && typeof a.rating.total === 'number') ? a.rating.total : 0;
            const countB = (b.rating && typeof b.rating.total === 'number') ? b.rating.total : 0;
            return countB - countA; // 降序
        });
    }

    function determineWorksToShowCount(totalWorks) {
        if (totalWorks <= MIN_WORKS_TO_SHOW) {
            return totalWorks; // 如果总数很少，全部显示
        }
        // 动态计算：取总数的30%，但不超过最大值和总数
        return Math.min(Math.max(MIN_WORKS_TO_SHOW, Math.floor(totalWorks * 0.3)), MAX_WORKS_TO_SHOW, totalWorks);
    }

    function fetchPersonInfo(personId, personName, mouseX, mouseY) {
        const cachedData = cache.get(`person_${personId}`);
        if (cachedData) {
            displayPersonInfo(cachedData, personName, mouseX, mouseY);
            return;
        }

        showTooltip('<div class="loading">加载中...</div>', mouseX, mouseY);

        // 添加一个随机延迟以减轻服务器压力
        const delay = Math.random() * (REQUEST_DELAY_MAX - REQUEST_DELAY_MIN) + REQUEST_DELAY_MIN;
        setTimeout(() => {
            // 再次检查 tooltip 是否仍然需要显示
            if (!tooltip || tooltip.style.display === 'none') {
                return;
            }

            // 获取人物基本信息
            currentFetchRequest = GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.bgm.tv/v0/persons/${personId}`,
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "BangumiStaffInfoTooltip/1.0"
                },
                onload: function(response) {
                    try {
                        const personData = JSON.parse(response.responseText);

                        // 获取人物参与的作品列表
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://api.bgm.tv/v0/persons/${personId}/subjects?limit=${Math.min(100, MAX_WORKS_TO_SHOW + 10)}`, // 稍微多取一点用于排序
                            headers: {
                                "Accept": "application/json",
                                "User-Agent": "BangumiStaffInfoTooltip/1.0"
                            },
                            onload: function(response) {
                                try {
                                    const worksData = JSON.parse(response.responseText);
                                    const combinedData = {
                                        person: personData,
                                        works: worksData
                                    };
                                    cache.set(`person_${personId}`, combinedData);
                                    displayPersonInfo(combinedData, personName, mouseX, mouseY);
                                } catch (e) {
                                    console.error("Error parsing works data:", e, response.responseText);
                                    showTooltip('<div class="error">解析作品数据时出错</div>', mouseX, mouseY);
                                }
                            },
                            onerror: function(error) {
                                console.error("Works request failed:", error);
                                showTooltip('<div class="error">获取作品信息失败</div>', mouseX, mouseY);
                            }
                        });
                    } catch (e) {
                        console.error("Error parsing person data:", e, response.responseText);
                        showTooltip('<div class="error">解析人物数据时出错</div>', mouseX, mouseY);
                    }
                },
                onerror: function(error) {
                    console.error("Person request failed:", error);
                    showTooltip('<div class="error">获取人物信息失败</div>', mouseX, mouseY);
                }
            });
        }, delay);
    }

    function displayPersonInfo(data, personName, mouseX, mouseY) {
        if (!data || !data.person || !data.works) {
            showTooltip('<div class="error">数据不完整</div>', mouseX, mouseY);
            return;
        }

        const person = data.person;
        let works = data.works;

        if (!Array.isArray(works)) {
            works = [];
        }

        const sortedWorks = sortWorksByRatingCount(works);
        const totalWorks = works.length;
        const worksToShowCount = determineWorksToShowCount(totalWorks);
        const worksToShow = sortedWorks.slice(0, worksToShowCount);

        // --- 构建 Tooltip 内容 ---
        const nameToShow = person.name_cn || person.name || personName;
        const bio = person.summary ? `<div class="tooltip-bio">${person.summary.substring(0, 200)}${person.summary.length > 200 ? '...' : ''}</div>` : '';

        let worksHtml = '';
        if (worksToShow.length > 0) {
            worksToShow.forEach(work => {
                const title = work.name_cn || work.name || '未知标题';
                const year = formatDate(work.date);
                const role = work.staff || '未知';
                let coverUrl = '';
                if (work.images && work.images[IMAGE_SIZE]) {
                     coverUrl = work.images[IMAGE_SIZE];
                } else if (work.image) {
                     coverUrl = work.image;
                }
                const subjectUrl = `https://bgm.tv/subject/${work.id}`;

                // 获取评分人数用于显示
                let ratingCountText = '';
                if (work.rating && typeof work.rating.total === 'number') {
                    ratingCountText = `<span class="tooltip-work-rating-count">${work.rating.total}人评分</span>`;
                }

                worksHtml += `
                    <li class="tooltip-work-item">
                        <div class="tooltip-work-cover-container">
                            ${coverUrl ?
                              `<img src="${coverUrl}" alt="${title} 封面" class="tooltip-work-cover" loading="lazy">` :
                              ''}
                        </div>
                        <div class="tooltip-work-content">
                            <div class="tooltip-work-title-row">
                                <a href="${subjectUrl}" target="_blank" class="tooltip-work-title">${title}</a>
                            </div>
                            <div class="tooltip-work-meta">
                                ${year !== 'N/A' ? `<span class="tooltip-work-year">${year}</span>` : ''}
                                ${ratingCountText}
                            </div>
                            <div class="tooltip-work-role">${role}</div>
                        </div>
                    </li>
                `;
            });
        } else {
            worksHtml = '<li>暂无作品信息</li>';
        }

        const htmlContent = `
            <div class="tooltip-header">
                <div class="tooltip-name tooltip-name-text">${nameToShow}</div>
                <span class="tooltip-stats">(共 ${totalWorks} 部作品)</span>
            </div>
            ${bio}
            <ul class="tooltip-works-list">
                ${worksHtml}
            </ul>
        `;

        showTooltip(htmlContent, mouseX, mouseY);
    }

    function init() {
        createTooltip();

        document.addEventListener('mouseover', debounce(function(e) {
            const link = e.target.closest('a[href*="/person/"]');
            if (link) {
                // 如果鼠标移入 tooltip 区域，取消可能的隐藏定时器
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }

                const href = link.getAttribute('href');
                const match = href.match(/\/person\/(\d+)/);
                if (match) {
                    const personId = match[1];
                    // 使用链接文本作为备用名称
                    const personName = link.textContent.trim() || '未知';
                    const rect = link.getBoundingClientRect();
                    // 计算鼠标相对于视口的位置
                    const x = rect.left + window.scrollX;
                    const y = rect.top + window.scrollY;
                    fetchPersonInfo(personId, personName, x, y);
                }
            }
        }, 200)); // 200ms 防抖

        // 处理鼠标移出链接的情况
        document.addEventListener('mouseout', function(e) {
            const link = e.target.closest('a[href*="/person/"]');
            // 如果鼠标是从链接移出，并且没有进入 tooltip (或下一个链接)，则计划隐藏
            if (link && (!tooltip || !tooltip.contains(e.relatedTarget))) {
                scheduleHideTooltip();
            }
        });
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();



