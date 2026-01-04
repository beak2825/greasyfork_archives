// ==UserScript==
// @name         Bangumi Staff 作品列表 v1.3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 Bangumi 条目页面，鼠标悬停在 Staff 名字上时显示其参与作品信息。作品按评分人数排序，动态展示数量。适合看新番的时候快速认知各个staff。
// @author       You
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @grant        GM_xmlhttpRequest
// @connect      api.bgm.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545840/Bangumi%20Staff%20%E4%BD%9C%E5%93%81%E5%88%97%E8%A1%A8%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/545840/Bangumi%20Staff%20%E4%BD%9C%E5%93%81%E5%88%97%E8%A1%A8%20v13.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const TOOLTIP_WIDTH = 480;
    const TOOLTIP_HEIGHT = 500; // 预估高度，用于定位
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
    let showTimeout = null; // 用于延迟显示Tooltip
    let currentLink = null; // 记录当前触发 Tooltip 的链接元素
    let currentPersonId = null; // 记录当前请求的ID

    function createTooltip() {
        if (tooltip) return;

        tooltip = document.createElement('div');
        tooltip.id = 'bangumi-staff-tooltip-v1-8';
        // *** 修改1: 将 position 改为 absolute ***
        tooltip.style.cssText = `
            position: absolute;
            z-index: 9999;
            width: ${TOOLTIP_WIDTH}px;
            max-height: 600px;
            overflow: hidden; /* 外层容器隐藏溢出 */
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

        // 鼠标进入 Tooltip 时取消隐藏计划
        tooltip.addEventListener('mouseenter', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        // 鼠标离开 Tooltip 时计划隐藏
        tooltip.addEventListener('mouseleave', (e) => {
            // 检查鼠标是否移向了触发当前 Tooltip 的链接
            const toElement = e.relatedTarget;
            if (currentLink && currentLink.contains(toElement)) {
                // 移向了链接，不隐藏
                return;
            }
            scheduleHideTooltip();
        });

        const style = document.createElement('style');
        style.textContent = `
            #bangumi-staff-tooltip-v1-8 .tooltip-header {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
                gap: 10px;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-name {
                font-size: 20px;
                font-weight: 700;
                color: #0066cc;
                flex: 1;
                min-width: 0;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-name-text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-name-link {
                color: inherit;
                text-decoration: none;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-name-link:hover {
                text-decoration: underline;
                color: #0056b3;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-stats {
                font-size: 13px;
                color: #666;
                white-space: nowrap;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-bio {
                font-size: 14px;
                color: #555;
                margin-bottom: 16px;
                line-height: 1.5;
            }
            /* *** 修改2: 为滚动区域添加类名和初始样式 *** */
            #bangumi-staff-tooltip-v1-8 .tooltip-works-scroll-container {
                max-height: 400px;
                overflow-y: auto; /* 初始允许滚动 */
                padding-right: 8px;
                margin: 0 0 10px 0;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-works-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-work-item {
                display: flex;
                margin-bottom: 16px;
                padding: 12px;
                border-radius: 8px;
                background: white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-work-cover-container {
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
            #bangumi-staff-tooltip-v1-8 .tooltip-work-cover {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-work-content {
                flex: 1;
                margin-left: 16px;
                min-width: 0;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-work-title-row {
                display: flex;
                align-items: center;
                margin-bottom: 6px;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-work-title {
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
            #bangumi-staff-tooltip-v1-8 .tooltip-work-title:hover {
                color: #0056b3;
                text-decoration: underline;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-work-meta {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 6px;
                font-size: 13px;
                color: #666;
                gap: 8px;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-work-year,
            #bangumi-staff-tooltip-v1-8 .tooltip-work-rating-count {
                background: #f0f0f0;
                padding: 2px 6px;
                border-radius: 4px;
                flex-shrink: 0;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-work-role {
                font-size: 13px;
                color: #555;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #bangumi-staff-tooltip-v1-8 .loading {
                text-align: center;
                padding: 30px 20px;
                color: #666;
            }
            #bangumi-staff-tooltip-v1-8 .loading::before {
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
            #bangumi-staff-tooltip-v1-8 .error {
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

            /* 自定义滚动条样式 */
            #bangumi-staff-tooltip-v1-8 .tooltip-works-scroll-container::-webkit-scrollbar {
                width: 6px;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-works-scroll-container::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-works-scroll-container::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 10px;
            }
            #bangumi-staff-tooltip-v1-8 .tooltip-works-scroll-container::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
        `;
        document.head.appendChild(style);
    }

    // *** 修改3: 优化位置计算函数 (v1.0.8) ***
    function updateTooltipPosition(linkRect, mouseX, mouseY) {
        if (!tooltip) return;

        // 获取页面滚动偏移量
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // 获取视口尺寸
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 计算链接相对于文档的位置（加上滚动偏移）
        const linkDocTop = linkRect.top + scrollY;
        const linkDocLeft = linkRect.left + scrollX;
        const linkDocBottom = linkRect.bottom + scrollY;
        const linkDocRight = linkRect.right + scrollX;

        // --- 优化后的定位逻辑 ---
        let finalX, finalY;
        let positionFound = false;

        // 1. 优先尝试放在链接上方
        finalX = linkDocLeft;
        finalY = linkDocTop - TOOLTIP_HEIGHT - 10; // 上方 10px 间距

        // 检查上方空间是否足够且在视口内
        if (finalY >= scrollY) { // 上方不超出页面顶部
            positionFound = true;
        }

        // 2. 如果上方空间不足或超出视口顶部，尝试放在下方
        if (!positionFound) {
            finalY = linkDocBottom + 10; // 下方 10px 间距
            // 检查下方空间是否足够且在视口内
            if (finalY + TOOLTIP_HEIGHT <= scrollY + viewportHeight) { // 下方不超出页面底部
                positionFound = true;
            }
        }

        // 3. 如果上下方都不行，选择离视口边缘更近的一边并进行调整
        if (!positionFound) {
            const spaceAbove = linkDocTop - scrollY;
            const spaceBelow = (scrollY + viewportHeight) - linkDocBottom;

            if (spaceAbove > spaceBelow) {
                // 上方空间相对更大，强制放在上方可见区域
                finalY = Math.max(scrollY + 10, linkDocTop - TOOLTIP_HEIGHT - 10);
            } else {
                // 下方空间相对更大，强制放在下方可见区域
                finalY = Math.min(scrollY + viewportHeight - TOOLTIP_HEIGHT - 10, linkDocBottom + 10);
            }
            positionFound = true; // 此时无论如何都确定了Y位置
        }

        // 4. 处理水平方向，确保不超出左右边界
        if (finalX + TOOLTIP_WIDTH > scrollX + viewportWidth) {
            // 右侧空间不足，尝试左对齐链接右侧边缘
            finalX = linkDocRight - TOOLTIP_WIDTH;
            // 确保不会超出左边界
            finalX = Math.max(scrollX + 10, finalX);
        } else {
            // 确保左侧不会超出边界
            finalX = Math.max(scrollX + 10, finalX);
        }

        // 5. 最终微调 Y 轴，确保不会超出视口极端边界 (可选，增加鲁棒性)
        // 这一步在上面的逻辑中已经基本覆盖，但可以再做一次保险检查
        finalY = Math.max(scrollY + 10, Math.min(finalY, scrollY + viewportHeight - 200)); // 200是保守估计的最小可视高度

        tooltip.style.left = `${finalX}px`;
        tooltip.style.top = `${finalY}px`;
    }


    function showTooltip(htmlContent, linkElement, mouseX, mouseY) {
        if (!tooltip) createTooltip();

        // 清除之前的隐藏计划
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        tooltip.innerHTML = htmlContent;
        tooltip.style.display = 'block';
        const linkRect = linkElement.getBoundingClientRect();
        updateTooltipPosition(linkRect, mouseX, mouseY);

        // *** 修改4: 在显示 Tooltip 后，为滚动区域添加事件监听器 ***
        const scrollContainer = tooltip.querySelector('.tooltip-works-scroll-container');
        if (scrollContainer) {
            // 移除旧的监听器（如果有的话），防止重复绑定
            scrollContainer.removeEventListener('wheel', handleScrollWheel);

            // 添加新的监听器
            scrollContainer.addEventListener('wheel', handleScrollWheel, { passive: false }); // passive: false 允许 preventDefault
        }
    }

    // *** 修改5: 处理滚轮事件的函数 (v1.0.7 修正版) ***
    function handleScrollWheel(event) {
        const container = event.currentTarget; // 这是 .tooltip-works-scroll-container

        // 如果容器内容不足以滚动，则不处理，让事件（默认）冒泡到页面
        if (container.scrollHeight <= container.clientHeight) {
            // 不调用 preventDefault，让事件冒泡
            return;
        }

        // 获取鼠标在容器内的位置
        const rect = container.getBoundingClientRect();
        const isMouseOverContainer = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

        // 只有当鼠标悬停在可滚动容器上时，才处理滚动
        if (isMouseOverContainer) {
             const delta = event.deltaY;
             const scrollTop = container.scrollTop;
             const scrollHeight = container.scrollHeight;
             const clientHeight = container.clientHeight;

             // 检查是否滚动到了顶部或底部的边界
             const isAtTopBoundary = scrollTop === 0 && delta < 0;
             const isAtBottomBoundary = (scrollTop + clientHeight >= scrollHeight) && delta > 0;

             // 如果在边界上，不 preventDefault，让页面滚动
             if (isAtTopBoundary || isAtBottomBoundary) {
                 // 不调用 preventDefault，让事件冒泡
                 return;
             }

             // 否则，在容器内部滚动，并阻止事件冒泡
             event.preventDefault(); // 阻止页面滚动
             container.scrollTop += delta; // 手动滚动容器
        }
        // 如果鼠标不在容器上，事件会自然冒泡到页面，无需额外处理
    }

    function scheduleHideTooltip() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
        hideTimeout = setTimeout(() => {
            hideTooltip();
        }, 300); // 保持 300ms 延迟
    }

    function hideTooltip() {
        // 清除所有计划
        if (showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        // 隐藏 Tooltip
        if (tooltip) {
            tooltip.style.display = 'none';
            // *** 修改6: 隐藏时移除滚动监听器 ***
            const scrollContainer = tooltip.querySelector('.tooltip-works-scroll-container');
            if (scrollContainer) {
                scrollContainer.removeEventListener('wheel', handleScrollWheel);
            }
        }

        // 取消进行中的请求
        if (currentFetchRequest) {
            currentFetchRequest.abort();
            currentFetchRequest = null;
        }

        // 重置状态
        currentLink = null;
        currentPersonId = null;
    }

    function sortWorksByRatingCount(works) {
        if (!Array.isArray(works)) return works;
        return [...works].sort((a, b) => {
            const countA = (a.rating && typeof a.rating.total === 'number') ? a.rating.total : 0;
            const countB = (b.rating && typeof b.rating.total === 'number') ? b.rating.total : 0;
            return countB - countA;
        });
    }

    function determineWorksToShowCount(totalWorks) {
        if (totalWorks <= MIN_WORKS_TO_SHOW) {
            return totalWorks;
        }
        return Math.min(Math.max(MIN_WORKS_TO_SHOW, Math.floor(totalWorks * 0.3)), MAX_WORKS_TO_SHOW, totalWorks);
    }

    function fetchPersonInfo(personId, personName, personUrl, linkElement, mouseX, mouseY) {
        // 如果有正在进行的请求（针对不同ID），先取消它
        if (currentFetchRequest && currentPersonId !== personId) {
            currentFetchRequest.abort();
            currentFetchRequest = null;
        }

        // 如果正在请求的是同一个ID，则不重复请求，但可以更新位置
        if (currentPersonId === personId) {
             if (tooltip && tooltip.style.display !== 'none') {
                 const linkRect = linkElement.getBoundingClientRect();
                 updateTooltipPosition(linkRect, mouseX, mouseY);
             }
            return;
        }

        // 更新当前状态为新ID
        currentPersonId = personId;
        currentLink = linkElement;

        const cachedData = cache.get(`person_${personId}`);
        if (cachedData) {
            displayPersonInfo(cachedData, personName, personUrl, linkElement, mouseX, mouseY);
            return;
        }

        showTooltip('<div class="loading">加载中...</div>', linkElement, mouseX, mouseY);

        const delay = Math.random() * (REQUEST_DELAY_MAX - REQUEST_DELAY_MIN) + REQUEST_DELAY_MIN;
        showTimeout = setTimeout(() => {
            // 再次检查状态，确保请求仍然是针对当前目标
            if (currentPersonId !== personId) return;

            currentFetchRequest = GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.bgm.tv/v0/persons/${personId}`,
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "BangumiStaffInfoTooltip/1.0.8"
                },
                onload: function(response) {
                    // 确保这是当前需要的数据
                    if (currentPersonId !== personId) return;

                    try {
                        const personData = JSON.parse(response.responseText);

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://api.bgm.tv/v0/persons/${personId}/subjects?limit=${Math.min(100, MAX_WORKS_TO_SHOW + 10)}`,
                            headers: {
                                "Accept": "application/json",
                                "User-Agent": "BangumiStaffInfoTooltip/1.0.8"
                            },
                            onload: function(response) {
                                // 确保这是当前需要的数据
                                if (currentPersonId !== personId) return;

                                try {
                                    const worksData = JSON.parse(response.responseText);
                                    const combinedData = {
                                        person: personData,
                                        works: worksData
                                    };
                                    cache.set(`person_${personId}`, combinedData);
                                    displayPersonInfo(combinedData, personName, personUrl, linkElement, mouseX, mouseY);
                                } catch (e) {
                                    console.error("Error parsing works data:", e, response.responseText);
                                    showTooltip('<div class="error">解析作品数据时出错</div>', linkElement, mouseX, mouseY);
                                }
                            },
                            onerror: function(error) {
                                if (currentPersonId !== personId) return;
                                console.error("Works request failed:", error);
                                showTooltip('<div class="error">获取作品信息失败</div>', linkElement, mouseX, mouseY);
                            }
                        });
                    } catch (e) {
                        if (currentPersonId !== personId) return;
                        console.error("Error parsing person data:", e, response.responseText);
                        showTooltip('<div class="error">解析人物数据时出错</div>', linkElement, mouseX, mouseY);
                    }
                },
                onerror: function(error) {
                    if (currentPersonId !== personId) return;
                    console.error("Person request failed:", error);
                    showTooltip('<div class="error">获取人物信息失败</div>', linkElement, mouseX, mouseY);
                }
            });
        }, delay);
    }

    function displayPersonInfo(data, personName, personUrl, linkElement, mouseX, mouseY) {
         // 再次确认是为当前链接显示
         if (currentLink !== linkElement) return;

        if (!data || !data.person || !data.works) {
            showTooltip('<div class="error">数据不完整</div>', linkElement, mouseX, mouseY);
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

        const nameToShow = person.name_cn || person.name || personName;
        const nameLinkHtml = `<a href="${personUrl}" target="_blank" class="tooltip-name-link">${nameToShow}</a>`;
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

        // *** 修改7: 用新的滚动容器包装作品列表 ***
        const htmlContent = `
            <div class="tooltip-header">
                <div class="tooltip-name">${nameLinkHtml}</div>
                <span class="tooltip-stats">(共 ${totalWorks} 部作品)</span>
            </div>
            ${bio}
            <div class="tooltip-works-scroll-container">
                <ul class="tooltip-works-list">
                    ${worksHtml}
                </ul>
            </div>
        `;

        showTooltip(htmlContent, linkElement, mouseX, mouseY);
    }

    function init() {
        createTooltip();

        // 使用防抖处理 mouseover 事件
        document.addEventListener('mouseover', debounce(function(e) {
            const link = e.target.closest('a[href*="/person/"]');
            if (link) {
                const href = link.getAttribute('href');
                const match = href.match(/\/person\/(\d+)/);
                if (match) {
                    const personId = match[1];
                    const personName = link.textContent.trim() || '未知';
                    const personUrl = link.href;

                    // 计算鼠标位置
                    const x = e.clientX;
                    const y = e.clientY;

                    // 如果移入了新的链接，立即取消之前的隐藏和显示计划
                    if (currentLink && currentLink !== link) {
                        if (hideTimeout) {
                            clearTimeout(hideTimeout);
                            hideTimeout = null;
                        }
                        if (showTimeout) {
                            clearTimeout(showTimeout);
                            showTimeout = null;
                        }
                        // 立即隐藏旧的 Tooltip
                        if (tooltip) {
                             tooltip.style.display = 'none';
                             // 移除旧的滚动监听器
                             const oldScrollContainer = tooltip.querySelector('.tooltip-works-scroll-container');
                             if (oldScrollContainer) {
                                 oldScrollContainer.removeEventListener('wheel', handleScrollWheel);
                             }
                        }
                        if (currentFetchRequest) {
                            currentFetchRequest.abort();
                            currentFetchRequest = null;
                        }
                        // 重置旧状态
                        currentLink = null;
                        currentPersonId = null;
                    }

                    // 更新当前链接（即使相同也需要，因为可能是从 Tooltip 移回）
                    currentLink = link;
                    fetchPersonInfo(personId, personName, personUrl, link, x, y);
                }
            }
        }, 100)); // 100ms 防抖

        // 精细化处理 mouseout 事件
        document.addEventListener('mouseout', function(e) {
            const from = e.target;
            const to = e.relatedTarget;

            const fromLink = from.closest('a[href*="/person/"]');
            const toLink = to ? to.closest('a[href*="/person/"]') : null;
            const isTooltipTarget = tooltip && tooltip.contains(to);

            // 情况1: 鼠标从当前 Staff 链接移出
            if (fromLink && fromLink === currentLink) {
                // 并且没有移到 Tooltip 上，也没有移到另一个 Staff 链接上
                if (!isTooltipTarget && toLink !== currentLink) {
                    scheduleHideTooltip();
                }
                // 如果移到了 Tooltip 或另一个链接，则不处理，让对应元素的 mouseenter 来处理
            }

            // 情况2: 鼠标从 Tooltip 移出
            // 这个逻辑已经在 Tooltip 的 mouseleave 事件监听器中处理了
        });

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();



