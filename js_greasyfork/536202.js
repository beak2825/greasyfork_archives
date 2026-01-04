// ==UserScript==
// @name         NodeSeekSearchHelper
// @license      AGPL-3.0
// @namespace    http://www.nodeseek.com/
// @version      2025-10-08
// @description  Help you search Nodeseek easer.
// @author       xykt
// @match        https://www.nodeseek.com/search?*
// @match        https://nodeseek.com/search?*
// @match        https://www.deepflood.com/search?*
// @match        https://deepflood.com/search?*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/536202/NodeSeekSearchHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/536202/NodeSeekSearchHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getCategoriesFromPage() {
        const trySelectors = [
            '#nsk-left-panel-container li a span',
            '#nsk-right-panel-container li a span'
        ];
        const cats = ['全部显示'];
        for (const sel of trySelectors) {
            const nodes = document.querySelectorAll(sel);
            if (!nodes || nodes.length === 0) continue;
            nodes.forEach(n => {
                const text = (n.textContent || '').trim();
                if (text && !cats.includes(text)) cats.push(text);
            });
            if (cats.length > 1) break;
        }
        return cats;
    }
    function populateCategorySelect(selectEl, cats) {
        selectEl.innerHTML = '';
        cats.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            selectEl.appendChild(option);
        });
    }
    const style = document.createElement('style');
    style.textContent = `
        .category-filter-container {
            position: fixed;
            top: 55px;
            right: 20px;
            z-index: 9999;
            gap: 6px;
            padding: 8px;
            width: 200px;
            display: flex;
            flex-direction: column;
            background: inherit;
            background-color: var(--bg-main-color);
            background-image: none;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 14px;
        }
        .filter-row {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .filter-label {
            white-space: nowrap;
            width: 50px;
        }
        .category-filter {
            padding: 4px;
            border-radius: 3px;
            border: 1px solid #ddd;
            width: 100%;
            font-size: 14px;
        }
        .text-filter {
            padding: 4px;
            border-radius: 3px;
            border: 1px solid #ddd;
            width: 100%;
            font-size: 14px;
            box-sizing: border-box;
        }
        .filter-option {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 2px;
        }
        .blocked-post {
            display: none !important;
        }
        .post-list-item {
            transition: opacity 0.3s;
        }
        .reset-btn {
            padding: 4px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            text-align: center;
            margin-top: 4px;
            font-size: 14px;
            width: 94.8%;
        }
        .reset-btn:hover {
            background: #e0e0e0;
        }
        .award-icon {
            width: 14px;
            height: 14px;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filter-container';
    const STORAGE_KEY = 'POST_FILTER_SETTINGS';

    let currentSettings = GM_getValue(STORAGE_KEY, {
        category: '全部显示',
        recommendedOnly: false,
        authorFilter: '',
        titleFilter: '',
        excludeFilter: ''
    });
    let isFirstLoad = true;
    const lastUrl = GM_getValue('LAST_MATCHED_URL', '');
    const currentUrl = window.location.href;
    if (!currentUrl.startsWith(lastUrl.split('?')[0])) {
        currentSettings = {
            category: '全部显示',
            recommendedOnly: false,
            authorFilter: '',
            titleFilter: '',
            excludeFilter: ''
        };
        isFirstLoad = true;
    }
    GM_setValue('LAST_MATCHED_URL', currentUrl);
    const categoryRow = document.createElement('div');
    categoryRow.className = 'filter-row';
    const categoryLabel = document.createElement('label');
    categoryLabel.className = 'filter-label';
    categoryLabel.textContent = '分类';
    categoryLabel.htmlFor = 'categoryFilter';

    const select = document.createElement('select');
    select.className = 'category-filter';
    select.id = 'categoryFilter';
    let categories = getCategoriesFromPage();
    populateCategorySelect(select, categories);
    select.value = currentSettings.category || '全部显示';
    categoryRow.appendChild(categoryLabel);
    categoryRow.appendChild(select);
    filterContainer.appendChild(categoryRow);
    const titleRow = document.createElement('div');
    titleRow.className = 'filter-row';
    const titleLabel = document.createElement('label');
    titleLabel.className = 'filter-label';
    titleLabel.textContent = '标题';
    titleLabel.htmlFor = 'titleFilter';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'text-filter';
    titleInput.id = 'titleFilter';
    titleInput.placeholder = ' 包含关键字';
    titleInput.value = currentSettings.titleFilter;
    titleRow.appendChild(titleLabel);
    titleRow.appendChild(titleInput);
    filterContainer.appendChild(titleRow);
    const excludeRow = document.createElement('div');
    excludeRow.className = 'filter-row';
    const excludeLabel = document.createElement('label');
    excludeLabel.className = 'filter-label';
    excludeLabel.textContent = '标题';
    excludeLabel.htmlFor = 'excludeFilter';
    const excludeInput = document.createElement('input');
    excludeInput.type = 'text';
    excludeInput.className = 'text-filter';
    excludeInput.id = 'excludeFilter';
    excludeInput.placeholder = ' 排除关键字';
    excludeInput.value = currentSettings.excludeFilter;
    excludeRow.appendChild(excludeLabel);
    excludeRow.appendChild(excludeInput);
    filterContainer.appendChild(excludeRow);
    const authorRow = document.createElement('div');
    authorRow.className = 'filter-row';
    const authorLabel = document.createElement('label');
    authorLabel.className = 'filter-label';
    authorLabel.textContent = '作者';
    authorLabel.htmlFor = 'authorFilter';
    const authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.className = 'text-filter';
    authorInput.id = 'authorFilter';
    authorInput.placeholder = ' ID / 昵称';
    authorInput.value = currentSettings.authorFilter;
    authorRow.appendChild(authorLabel);
    authorRow.appendChild(authorInput);
    filterContainer.appendChild(authorRow);
    const recommendedContainer = document.createElement('div');
    recommendedContainer.className = 'filter-option';
    const recommendedCheckbox = document.createElement('input');
    recommendedCheckbox.type = 'checkbox';
    recommendedCheckbox.id = 'recommendedOnly';
    recommendedCheckbox.checked = currentSettings.recommendedOnly;
    const awardIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    awardIcon.setAttribute('class', 'iconpark-icon award award-icon');
    awardIcon.setAttribute('style', 'width:14px;height:14px');
    const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useElement.setAttribute('href', '#diamonds');
    awardIcon.appendChild(useElement);
    const recommendedLabel = document.createElement('label');
    recommendedLabel.htmlFor = 'recommendedOnly';
    recommendedLabel.appendChild(document.createTextNode('仅显示推荐阅读 '));
    recommendedLabel.appendChild(awardIcon);
    recommendedContainer.appendChild(recommendedCheckbox);
    recommendedContainer.appendChild(recommendedLabel);
    filterContainer.appendChild(recommendedContainer);
    const resetBtn = document.createElement('div');
    resetBtn.className = 'reset-btn';
    resetBtn.textContent = '重置筛选';
    resetBtn.addEventListener('click', function() {
        select.value = '全部显示';
        recommendedCheckbox.checked = false;
        authorInput.value = '';
        titleInput.value = '';
        excludeInput.value = '';
        saveSettings();
        filterPosts();
    });
    filterContainer.appendChild(resetBtn);
    select.addEventListener('change', function() {
        saveSettings();
        filterPosts();
    });
    recommendedCheckbox.addEventListener('change', function() {
        saveSettings();
        filterPosts();
    });
    authorInput.addEventListener('input', function() {
        saveSettings();
        filterPosts();
    });
    titleInput.addEventListener('input', function() {
        saveSettings();
        filterPosts();
    });
    excludeInput.addEventListener('input', function() {
        saveSettings();
        filterPosts();
    });
    document.body.appendChild(filterContainer);
    function saveSettings() {
        currentSettings = {
            category: select.value,
            recommendedOnly: recommendedCheckbox.checked,
            authorFilter: authorInput.value.trim(),
            titleFilter: titleInput.value.trim(),
            excludeFilter: excludeInput.value.trim()
        };
        GM_setValue(STORAGE_KEY, currentSettings);
        GM_setValue('LAST_MATCHED_URL', window.location.href);
    }
    function filterPosts() {
        const selectedCategory = select.value;
        const showRecommendedOnly = recommendedCheckbox.checked;
        const authorFilterText = authorInput.value.trim().toLowerCase();
        const titleFilterText = titleInput.value.trim().toLowerCase();
        const excludeFilterText = excludeInput.value.trim().toLowerCase();
        document.querySelectorAll('li.post-list-item').forEach(post => {
            post.classList.remove('blocked-post');
            const categoryElement = post.querySelector('.post-category');
            const postCategory = categoryElement ? categoryElement.textContent.trim() : '';
            const isRecommended = post.querySelector('a[href="/award"][title="推荐阅读"]') !== null;
            const authorLink = post.querySelector('.info-author a');
            const authorName = authorLink ? authorLink.textContent.trim().toLowerCase() : '';
            const authorImg = post.querySelector('img.avatar-normal');
            const authorAlt = authorImg ? authorImg.alt.toLowerCase() : '';
            const titleElement = post.querySelector('.post-title a');
            const postTitle = titleElement ? titleElement.textContent.trim().toLowerCase() : '';
            const categoryMatch =
                selectedCategory === '全部显示' ||
                selectedCategory === '' ||
                postCategory === selectedCategory;
            const recommendedMatch = !showRecommendedOnly || isRecommended;
            const authorMatch =
                authorFilterText === '' ||
                authorName.includes(authorFilterText) ||
                authorAlt.includes(authorFilterText);
            const titleMatch =
                titleFilterText === '' ||
                postTitle.includes(titleFilterText);
            const excludeMatch =
                excludeFilterText === '' ||
                !postTitle.includes(excludeFilterText);
            if (!categoryMatch || !recommendedMatch || !authorMatch || !titleMatch || !excludeMatch) {
                post.classList.add('blocked-post');
            }
        });
    }
    if (isFirstLoad) {
        setTimeout(filterPosts, 500);
    } else {
        filterPosts();
    }
    const panelObserver = new MutationObserver(() => {
        try {
            const newCats = getCategoriesFromPage();
            if (newCats.length > 1 && JSON.stringify(newCats) !== JSON.stringify(categories)) {
                categories = newCats;
                populateCategorySelect(select, categories);
                if (currentSettings && currentSettings.category && categories.includes(currentSettings.category)) {
                    select.value = currentSettings.category;
                } else {
                    select.value = '全部显示';
                }
            }
        } catch (e) {
            console.warn('panelObserver error', e);
        }
    });
    panelObserver.observe(document.body, { childList: true, subtree: true });
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                filterPosts();
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    window.addEventListener('beforeunload', function() {
        GM_setValue('LAST_MATCHED_URL', window.location.href);
    });
})();
