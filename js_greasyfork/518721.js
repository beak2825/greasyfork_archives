// ==UserScript==
// @name         E-Hentai Tag Cloud Generator
// @name:en      E-Hentai Tag Cloud Generator
// @name:ja      E-Hentai タグクラウドジェネレーター
// @name:zh-CN   E-Hentai 生成标签云
// @namespace    https://github.com/CheerChen
// @version      3.1
// @description  Analyzes all manga tags in favorites and generates a tag cloud (only works in extend mode)
// @description:en Analyzes all manga tags in favorites and generates a tag cloud (only works in extend mode)
// @description:ja お気に入り内の全ページの漫画タグを分析してタグクラウドを生成します（extendモードでのみ有効）
// @description:zh-CN 分析收藏夹内所有页面的漫画标签，生成标签云（注意，只在extend模式下有效）
// @author       cheerchen37
// @license      MIT
// @match        https://e-hentai.org/favorites.php*
// @icon         https://www.google.com/s2/favicons?domain=e-hentai.org
// @grant        GM_xmlhttpRequest
// @connect      e-hentai.org
// @homepage     https://github.com/CheerChen/userscripts
// @supportURL   https://github.com/CheerChen/userscripts/issues
// @require      https://cdn.jsdelivr.net/npm/wordcloud@1.2.2/src/wordcloud2.min.js
// @downloadURL https://update.greasyfork.org/scripts/518721/E-Hentai%20Tag%20Cloud%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/518721/E-Hentai%20Tag%20Cloud%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 标签类别
    const TAG_CATEGORIES = ['language', 'parody', 'female', 'male', 'mixed', 'group', 'artist', 'cosplayer', 'character', 'reclass', 'other'];
    
    // 黑暗模式状态
    let isDarkMode = true;

    // 创建UI
    function createUI() {
        const toggleButton = document.createElement('div');
        toggleButton.id = 'toggleChartButton';
        toggleButton.innerHTML = '📊';
        toggleButton.style.cssText = `
            position: fixed;
            right: 20px;
            top: 20px;
            width: 40px;
            height: 40px;
            background-color: #4a4a4a;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            transition: transform 0.3s ease;
        `;

        const container = document.createElement('div');
        container.id = 'chartContainer';
        container.style.cssText = `
            position: fixed;
            right: 20px;
            top: 70px;
            width: 70vw;
            max-width: 900px;
            height: 70vh;
            max-height: 600px;
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
            transition: opacity 0.3s ease;
            overflow: hidden;
        `;

        const tabsContainer = document.createElement('div');
        tabsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            height: 100%;
        `;

        const tabButtons = document.createElement('div');
        tabButtons.style.cssText = `
            display: flex;
            gap: 10px;
            padding: 10px;
            border-bottom: 1px solid #333;
            flex-wrap: wrap; /* 允许换行 */
            align-items: center;
        `;

        // 添加黑暗模式切换按钮
        const darkModeToggle = document.createElement('button');
        darkModeToggle.id = 'darkModeToggle';
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.title = 'Toggle Dark Mode';
        darkModeToggle.style.cssText = `
            padding: 8px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            background-color: #333;
            color: #fff;
            font-size: 16px;
            width: 36px;
            height: 36px;
            margin-left: auto;
            transition: all 0.3s ease;
        `;
        darkModeToggle.onclick = toggleDarkMode;

        const chartArea = document.createElement('div');
        chartArea.style.cssText = `
            flex: 1;
            position: relative;
            overflow: hidden;
        `;

        TAG_CATEGORIES.forEach((category, index) => {
            const button = document.createElement('button');
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            button.dataset.category = category;
            button.style.cssText = `
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                background-color: #333;
                color: #fff;
                transition: all 0.3s ease;
            `;
            button.onclick = () => switchTab(category);
            tabButtons.appendChild(button);
        });

        // 添加黑暗模式切换按钮到按钮容器
        tabButtons.appendChild(darkModeToggle);

        const canvas = document.createElement('div');
        canvas.id = 'tagsChart';
        canvas.style.cssText = `
            width: 100%;
            height: 100%;
            background-color: #2a2a2a;
            border-radius: 5px;
        `;

        chartArea.appendChild(canvas);
        tabsContainer.appendChild(tabButtons);
        tabsContainer.appendChild(chartArea);
        container.appendChild(tabsContainer);

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #fff;
            z-index: 1;
        `;

        container.appendChild(closeButton);
        document.body.appendChild(toggleButton);
        document.body.appendChild(container);

        toggleButton.onclick = () => {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
            if (container.style.display === 'block') {
                if (!window.tagData) {
                    // 首次打开，需要加载数据
                    init();
                } else {
                    // 已有缓存数据，直接显示
                    const firstValidCategory = TAG_CATEGORIES.find(category =>
                        window.tagData[category] && window.tagData[category].size > 0);
                    if (firstValidCategory) {
                        switchTab(firstValidCategory);
                    }
                }
            }
        };

        closeButton.onclick = () => {
            container.style.display = 'none';
        };

        container.onclick = (e) => e.stopPropagation();

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && e.target !== toggleButton) {
                container.style.display = 'none';
            }
        });

        return canvas;
    }

    // 切换黑暗模式
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        const container = document.getElementById('chartContainer');
        const canvas = document.getElementById('tagsChart');
        const tabButtons = document.querySelectorAll('#chartContainer button[data-category]');
        const darkModeToggle = document.getElementById('darkModeToggle');
        const closeButton = container.querySelector('button:not([data-category]):not(#darkModeToggle)');
        const tabsContainer = container.querySelector('div:first-child > div:first-child');

        if (isDarkMode) {
            // 切换到黑暗模式
            container.style.backgroundColor = '#1a1a1a';
            container.style.color = '#ffffff';
            container.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
            canvas.style.backgroundColor = '#2a2a2a';
            closeButton.style.color = '#fff';
            tabsContainer.style.borderBottomColor = '#333';
            darkModeToggle.innerHTML = '🌙';
            darkModeToggle.style.backgroundColor = '#333';
            darkModeToggle.style.color = '#fff';
            
            tabButtons.forEach(button => {
                if (button.style.backgroundColor === 'rgb(74, 74, 74)') {
                    // 选中状态
                    button.style.backgroundColor = '#4a4a4a';
                    button.style.color = '#fff';
                } else {
                    // 未选中状态
                    button.style.backgroundColor = '#333';
                    button.style.color = '#fff';
                }
            });
        } else {
            // 切换到亮色模式
            container.style.backgroundColor = '#ffffff';
            container.style.color = '#000000';
            container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
            canvas.style.backgroundColor = '#f9f9f9';
            closeButton.style.color = '#666';
            tabsContainer.style.borderBottomColor = '#eee';
            darkModeToggle.innerHTML = '☀️';
            darkModeToggle.style.backgroundColor = '#eee';
            darkModeToggle.style.color = '#000';
            
            tabButtons.forEach(button => {
                if (button.style.backgroundColor === 'rgb(74, 74, 74)') {
                    // 选中状态
                    button.style.backgroundColor = '#4a4a4a';
                    button.style.color = '#fff';
                } else {
                    // 未选中状态
                    button.style.backgroundColor = '#eee';
                    button.style.color = '#000';
                }
            });
        }

        // 如果有标签云数据，重新渲染以适应新的背景色
        if (window.tagData && window.currentCategory) {
            createWordCloud(window.tagData, window.currentCategory);
        }
    }

    // 解析页面中的标签
    function parseTagsFromHtml(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tagCategories = {};

        TAG_CATEGORIES.forEach(category => {
            tagCategories[category] = new Map();
        });

        const tables = doc.querySelectorAll('tr td.tc');
        tables.forEach(categoryCell => {
            const category = categoryCell.textContent.replace(':', '');
            if (TAG_CATEGORIES.includes(category)) {
                const tagElements = categoryCell.parentElement.querySelectorAll('.gt, .gtl');
                tagElements.forEach(tag => {
                    const tagTitle = tag.getAttribute('title');
                    if (tagTitle) {
                        const tagName = tagTitle.split(':')[1];
                        if (tagName) {
                            const count = tagCategories[category].get(tagName) || 0;
                            tagCategories[category].set(tagName, count + 1);
                        }
                    }
                });
            }
        });

        return tagCategories;
    }

    // 合并标签数据
    function mergeCategoryTags(tags1, tags2) {
        const merged = {};
        TAG_CATEGORIES.forEach(category => {
            merged[category] = new Map(tags1[category] || []);
            if (tags2[category]) {
                for (const [tag, count] of tags2[category]) {
                    const currentCount = merged[category].get(tag) || 0;
                    merged[category].set(tag, currentCount + count);
                }
            }
        });
        return merged;
    }

    // 获取页面数据
    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`Failed to fetch page: ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    // 收集所有标签
    async function collectTags() {
        let allTags = {};
        const chartArea = document.querySelector('#chartContainer div:nth-child(2)');
        const loadingSpinner = createLoadingSpinner();
        chartArea.appendChild(loadingSpinner);

        try {
            let currentPageHtml = document.documentElement.outerHTML;
            let pageCount = 1;

            while (true) {
                updateLoadingProgress(pageCount);

                // 从当前页面的HTML中解析标签
                const pageTags = parseTagsFromHtml(currentPageHtml);
                allTags = mergeCategoryTags(allTags, pageTags);

                // 从当前HTML中查找下一页的链接
                const parser = new DOMParser();
                const doc = parser.parseFromString(currentPageHtml, 'text/html');
                const nextLink = doc.querySelector('#dnext');

                if (nextLink && nextLink.href) {
                    // 如果存在下一页，则获取其内容
                    currentPageHtml = await fetchPage(nextLink.href);
                    pageCount++;
                } else {
                    // 没有更多页面，跳出循环
                    break;
                }
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
            const spinner = document.getElementById('loadingSpinner');
            if(spinner) spinner.querySelector('p').textContent = `Error: ${error.message}`;
        } finally {
            // 延迟移除加载动画，以防用户看不到错误信息
            setTimeout(() => loadingSpinner.remove(), 2000);
        }

        return allTags;
    }

    // 创建标签云
    function createWordCloud(tagsData, category) {
        const container = document.getElementById('tagsChart');
        const categoryTags = tagsData[category];

        // 清空容器
        container.innerHTML = '';

        if (!categoryTags || categoryTags.size === 0) {
            const noDataColor = isDarkMode ? '#999' : '#666';
            container.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: ${noDataColor}; font-size: 18px;">No ${category} tags found</div>`;
            return;
        }

        // 将Map转换为数组，排序并截取前50个
        const sortedTags = Array.from(categoryTags)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50);

        // 准备词云数据
        const wordList = sortedTags.map(([tag, count]) => {
            // 根据标签出现次数计算字体大小
            const maxCount = sortedTags[0][1];
            const minCount = sortedTags[sortedTags.length - 1][1];
            const weight = ((count - minCount) / (maxCount - minCount)) * 40 + 12; // 字体大小在12-52之间
            return [tag, weight];
        });

        // 创建词云容器
        const cloudContainer = document.createElement('div');
        cloudContainer.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
        `;
        container.appendChild(cloudContainer);

        // 生成标签云
        WordCloud(cloudContainer, {
            list: wordList,
            gridSize: 8,
            weightFactor: 1,
            fontFamily: 'Arial, sans-serif',
            color: function() {
                // 生成随机颜色
                const colors = [
                    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
                    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            },
            backgroundColor: 'transparent',
            rotateRatio: 0.3,
            rotationSteps: 2,
            minSize: 12,
            drawOutOfBound: false,
            shrinkToFit: true,
            hover: function(item) {
                if (item) {
                    // 显示标签信息
                    const tooltip = document.getElementById('wordcloud-tooltip') || createTooltip();
                    const tagName = item[0];
                    const tagCount = sortedTags.find(([tag]) => tag === tagName)?.[1] || 0;
                    tooltip.innerHTML = `${tagName}: ${tagCount} times`;
                    tooltip.style.display = 'block';
                } else {
                    const tooltip = document.getElementById('wordcloud-tooltip');
                    if (tooltip) tooltip.style.display = 'none';
                }
            },
            click: function(item) {
                if (item) {
                    // 点击标签时的操作，例如搜索该标签
                    const tagName = item[0];
                    console.log(`Clicked on tag: ${tagName}`);
                    // 可以在这里添加搜索功能
                }
            }
        });
    }

    // 创建提示框
    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'wordcloud-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            pointer-events: none;
            z-index: 10001;
            display: none;
        `;
        document.body.appendChild(tooltip);

        // 跟随鼠标移动
        document.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.pageX + 10) + 'px';
            tooltip.style.top = (e.pageY - 30) + 'px';
        });

        return tooltip;
    }


    // 切换标签页
    function switchTab(category) {
        window.currentCategory = category; // 保存当前类别
        const buttons = document.querySelectorAll('#chartContainer button[data-category]');
        buttons.forEach(button => {
            const isSelected = button.dataset.category === category;
            if (isSelected) {
                button.style.backgroundColor = '#4a4a4a';
                button.style.color = '#fff';
            } else {
                button.style.backgroundColor = isDarkMode ? '#333' : '#eee';
                button.style.color = isDarkMode ? '#fff' : '#000';
            }
        });

        if (window.tagData) {
            createWordCloud(window.tagData, category);
        }
    }

    // 创建加载动画
    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        `;
        spinner.innerHTML = `
            <div style="
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            "></div>
            <p style="margin-top: 10px;">Initializing...</p>
        `;

        if (!document.getElementById('spinnerStyle')) {
            const style = document.createElement('style');
            style.id = 'spinnerStyle';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        return spinner;
    }

    // 更新加载进度
    function updateLoadingProgress(loadedPages) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.querySelector('p').textContent = `Loading data from page ${loadedPages}...`;
        }
    }

    // 初始化
    async function init() {
        if (!window.tagData) {
            window.tagData = await collectTags();

            const hasData = TAG_CATEGORIES.some(category =>
                window.tagData[category] && window.tagData[category].size > 0);

            if (hasData) {
                const firstValidCategory = TAG_CATEGORIES.find(category =>
                    window.tagData[category] && window.tagData[category].size > 0);
                switchTab(firstValidCategory || TAG_CATEGORIES[0]);
            } else {
                console.log('No tag data found. Make sure you are in "Extended" favorites view.');
                const chartArea = document.querySelector('#chartContainer div:nth-child(2)');
                chartArea.innerHTML = `<p style="text-align:center; margin-top: 20px;">No tag data found. Please ensure you are in "Extended" favorites view.</p>`;
            }
        }
    }

    createUI();
})();
