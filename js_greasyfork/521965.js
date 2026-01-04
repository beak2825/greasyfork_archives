// ==UserScript==
// @name         Bangumi 排行榜增强：隐藏已收藏并按日期区间筛选
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  隐藏已收藏条目，并按日期区间筛选作品。
// @author       KunimiSaya
// @match        https://bgm.tv/*/browser*
// @match        https://bangumi.tv/*/browser*
// @match        https://chii.in/*/browser*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521965/Bangumi%20%E6%8E%92%E8%A1%8C%E6%A6%9C%E5%A2%9E%E5%BC%BA%EF%BC%9A%E9%9A%90%E8%97%8F%E5%B7%B2%E6%94%B6%E8%97%8F%E5%B9%B6%E6%8C%89%E6%97%A5%E6%9C%9F%E5%8C%BA%E9%97%B4%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521965/Bangumi%20%E6%8E%92%E8%A1%8C%E6%A6%9C%E5%A2%9E%E5%BC%BA%EF%BC%9A%E9%9A%90%E8%97%8F%E5%B7%B2%E6%94%B6%E8%97%8F%E5%B9%B6%E6%8C%89%E6%97%A5%E6%9C%9F%E5%8C%BA%E9%97%B4%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isHidingEnabled = true; // 是否隐藏已收藏的标志
    let startDate = null; // 起始日期
    let endDate = null; // 结束日期
    let minEpisodes = null; // 最小话数
    let maxEpisodes = null; // 最大话数
    let isHideNoEpisodes = false; // 是否隐藏没有集数的作品

    // 提取日期的增强版函数
    function extractDate(infoText) {
        const datePatterns = [
            /(\d{4})年(\d{1,2})月/,
            /(\d{4})-(\d{2})-(\d{2})/,
            /(\d{4})-(\d{2})/,
            /(\d{4})/,
        ];

        for (const pattern of datePatterns) {
            const match = infoText.match(pattern);
            if (match) {
                const year = parseInt(match[1], 10);
                const month = match[2] ? parseInt(match[2], 10) : 1;
                return new Date(year, month - 1);
            }
        }
        return null;
    }

    // 提取话数的函数
    function extractEpisodes(infoText) {
        const match = infoText.match(/(\d+)(话|集)/);
        if (match) {
            return parseInt(match[1], 10);
        }
        return null;
    }

    // 根据日期筛选
    function filterByDate(items) {
        items.forEach(item => {
            const info = item.querySelector('.info');
            if (info) {
                const date = extractDate(info.textContent);
                const isOutOfDateRange =
                    (startDate && date < startDate) || (endDate && date > endDate);
                if (isOutOfDateRange) {
                    item.style.display = 'none';
                }
            }
        });
    }

    // 根据话数筛选
    function filterByEpisodes(items) {
        items.forEach(item => {
            const info = item.querySelector('.info');
            if (info) {
                const episodes = extractEpisodes(info.textContent);
                const isOutOfEpisodesRange =
                    (minEpisodes !== null && episodes < minEpisodes) ||
                    (maxEpisodes !== null && episodes > maxEpisodes);
                if (episodes !== null && isOutOfEpisodesRange) {
                    item.style.display = 'none';
                }
            }
        });
    }

    // 根据已收藏状态筛选
    function filterCollectedItems(items) {
        items.forEach(item => {
            const isCollected = item.querySelector('.collectModify');
            if (isHidingEnabled && isCollected) {
                item.style.display = 'none';
            } else if (!isHidingEnabled || !isCollected) {
                item.style.display = '';
            }
        });
    }

    // 根据是否有集数信息筛选
    function filterByNoEpisodes(items) {
        items.forEach(item => {
            const info = item.querySelector('.info');
            if (info) {
                const episodes = extractEpisodes(info.textContent);
                if (isHideNoEpisodes && episodes === null) {
                    item.style.display = 'none';
                }
            }
        });
    }

    // 应用所有筛选器
    function applyFilters() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => (item.style.display = ''));
        filterCollectedItems(items);
        filterByDate(items);
        filterByEpisodes(items);
        filterByNoEpisodes(items);
    }

    // 添加筛选控制按钮
    function addControls() {
        const sideInner = document.querySelector('.sideInner');
        if (!sideInner || document.getElementById('filterControls')) return;

        const controls = document.createElement('div');
        controls.id = 'filterControls';
        controls.style.marginTop = '20px';

        const title = document.createElement('h2');
        title.className = 'subtitle';
        title.textContent = '筛选工具';
        controls.appendChild(title);

        const toggleButton = document.createElement('a');
        toggleButton.className = 'chiiBtn';
        toggleButton.href = 'javascript:void(0);';
        toggleButton.textContent = '显示/隐藏已收藏';
        toggleButton.onclick = () => {
            isHidingEnabled = !isHidingEnabled;
            applyFilters();
        };
        controls.appendChild(toggleButton);

        const dateControls = document.createElement('div');
        dateControls.style.marginTop = '10px';
        dateControls.style.display = 'flex';
        dateControls.style.flexWrap = 'wrap';
        dateControls.style.gap = '5px';

        const startDateInput = document.createElement('input');
        startDateInput.type = 'month';
        startDateInput.placeholder = '起始日期';
        startDateInput.style.width = '120px';

        const endDateInput = document.createElement('input');
        endDateInput.type = 'month';
        endDateInput.placeholder = '结束日期';
        endDateInput.style.width = '120px';

        const filterButton = document.createElement('a');
        filterButton.className = 'chiiBtn';
        filterButton.href = 'javascript:void(0);';
        filterButton.textContent = '按日期区间筛选';
        filterButton.onclick = () => {
            startDate = startDateInput.value ? new Date(startDateInput.value) : null;
            endDate = endDateInput.value ? new Date(endDateInput.value) : null;
            applyFilters();
        };

        dateControls.appendChild(startDateInput);
        dateControls.appendChild(endDateInput);
        dateControls.appendChild(filterButton);

        controls.appendChild(dateControls);

        // 集数筛选控件
        const episodesControls = document.createElement('div');
        episodesControls.style.marginTop = '10px';
        episodesControls.style.display = 'flex';
        episodesControls.style.flexWrap = 'wrap';
        episodesControls.style.gap = '5px';

        const minEpisodesInput = document.createElement('input');
        minEpisodesInput.type = 'number';
        minEpisodesInput.placeholder = '最小话数';
        minEpisodesInput.style.width = '120px';

        const maxEpisodesInput = document.createElement('input');
        maxEpisodesInput.type = 'number';
        maxEpisodesInput.placeholder = '最大话数';
        maxEpisodesInput.style.width = '120px';

        const episodesFilterButton = document.createElement('a');
        episodesFilterButton.className = 'chiiBtn';
        episodesFilterButton.href = 'javascript:void(0);';
        episodesFilterButton.textContent = '按集数区间筛选';
        episodesFilterButton.onclick = () => {
            minEpisodes = minEpisodesInput.value ? parseInt(minEpisodesInput.value, 10) : null;
            maxEpisodes = maxEpisodesInput.value ? parseInt(maxEpisodesInput.value, 10) : null;
            applyFilters();
        };

        episodesControls.appendChild(minEpisodesInput);
        episodesControls.appendChild(maxEpisodesInput);
        episodesControls.appendChild(episodesFilterButton);

        controls.appendChild(episodesControls);

        // 隐藏没有集数的作品按钮
        const hideNoEpisodesButton = document.createElement('a');
        hideNoEpisodesButton.className = 'chiiBtn';
        hideNoEpisodesButton.href = 'javascript:void(0);';
        hideNoEpisodesButton.textContent = '显示/隐藏没有集数的作品';
        hideNoEpisodesButton.onclick = () => {
            isHideNoEpisodes = !isHideNoEpisodes;
            applyFilters();
        };

        controls.appendChild(hideNoEpisodesButton);

        sideInner.appendChild(controls);
    }

    // 监听页面变动
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            applyFilters();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 初始化功能
    function init() {
        addControls();
        applyFilters();
        observePageChanges();
    }

    init();
})();
