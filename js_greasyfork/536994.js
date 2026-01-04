// ==UserScript==
// @name         豆瓣榜单助手·Douban-Ranker
// @namespace    https://github.com/eddiehe99/douban-ranker
// @homepageURL  https://douban-ranker.eddiehe.top
// @supportURL   https://github.com/eddiehe99/douban-ranker/issues
// @license      MIT
// @version      0.4.3
// @description  在豆瓣电影、播客、音乐页面展示作品在不同榜单中的排名
// @author       Eddie He
// @contributor  CRonaldoWei
// @icon         https://img3.doubanio.com/favicon.ico
// @match        https://movie.douban.com/subject/*
// @match        https://www.douban.com/podcast/*
// @match        https://music.douban.com/subject/*
// @include      https://movie.douban.com/*
// @include      https://music.douban.com/*
// @include      https://book.douban.com/*
// @include      https://www.douban.com/podcast/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/536994/%E8%B1%86%E7%93%A3%E6%A6%9C%E5%8D%95%E5%8A%A9%E6%89%8B%C2%B7Douban-Ranker.user.js
// @updateURL https://update.greasyfork.org/scripts/536994/%E8%B1%86%E7%93%A3%E6%A6%9C%E5%8D%95%E5%8A%A9%E6%89%8B%C2%B7Douban-Ranker.meta.js
// ==/UserScript==

(() => {
    'use strict';

    console.log("脚本: 豆瓣榜单助手·Douban-Ranker--开始执行--GitHub: https://github.com/eddiehe99/douban-ranker");

    // 配置常量
    const CONFIG = {
        movieRankUrl: "https://rank4douban.eddiehe.top/data.json",
        podcastRankUrl: "https://xyzrank.eddiehe.top/full.json",
        musicRankUrl: "https://hma.eddiehe.top/data.json",
        top250Class: "top250",
        top250CssUrl: "https://img1.doubanio.com/cuphead/movie-static/charts/top250.24c18.css",
        toggleButtonId: "rank_toggle",
        rankLabelClass: "rank-label rank-label-other",
        rankLabelCssUrl: "https://img1.doubanio.com/cuphead/movie-static/subject/rank_label.dda40.css"
    };

    // 缓存样式是否已加载
    let isTop250StyleInjected = false;
    let isRankLabelStyleInjected = false;

    /**
     * 注入外部 Top 250 CSS 样式表
     */
    function injectTop250Stylesheet() {
        if (isTop250StyleInjected) return;
        const existingLink = document.querySelector(`link[href*="${CONFIG.top250CssUrl}"]`);
        if (!existingLink) {
            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = CONFIG.top250CssUrl;
            document.head.appendChild(styleLink);
        }
        isTop250StyleInjected = true;
    }

    /**
     * 注入外部 Rank Label CSS 样式表
     */
    function injectRankLabelStylesheet() {
        if (isRankLabelStyleInjected) return;
        const existingLink = document.querySelector(`link[href*="${CONFIG.rankLabelCssUrl}"]`);
        if (!existingLink) {
            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = CONFIG.rankLabelCssUrl;
            document.head.appendChild(styleLink);
        }
        isRankLabelStyleInjected = true;
    }

    /**
     * 创建排名组件
     * @param {Object} options
     * @param {string} options.prefix 前缀（如"TOP"）
     * @param {number} options.position 排名位置
     * @param {string} options.title 榜单标题
     * @param {string} options.shortTitle 简短标题
     * @param {string} options.href 榜单链接
     * @returns {string} HTML字符串
     */
    function createTop250RankItem({ prefix = 'No.', position, title, shortTitle, href }) {
        return [
            `<div class="${CONFIG.top250Class}" style="display: inline-block;">`,
            `<span class="top250-no">${prefix}${position}</span>`,
            `<span class="top250-link">`,
            `<a href="${href}" title="${title}" target="_blank">${shortTitle}</a>`,
            `</span>`,
            `</div> `,
        ].join('');
    }

    /**
     * 移除指定链接的 loading 占位元素
     */
    function removeProcessingItem(href) {
        const items = document.querySelectorAll(`.${CONFIG.top250Class} a[href="${href}"]`);
        items.forEach(item => {
            const parent = item.closest(`.${CONFIG.top250Class}`);
            if (parent) parent.remove();
        });
    }

    /**
 * 创建排名组件
 * @param {Object} options
 * @param {string} options.prefix 前缀（如"TOP"）
 * @param {number} options.position 排名位置
 * @param {string} options.title 榜单标题
 * @param {string} options.shortTitle 简短标题
 * @param {string} options.href 榜单链接
 * @returns {string} HTML字符串
 */
    function createRankLabelRankItem({ prefix = 'No.', position, title, shortTitle, href }) {
        return [
            `<div class="rank-label rank-label-other" style="display: inline-block;">`,
            `<span class="rank-label-no">`,
            `<span>${prefix}${position}</span>`,
            `</span>`,
            `<span class="rank-label-link">`,
            `<a href="${href}" title="${title}" target="_blank">${shortTitle}</a>`,
            `</span>`,
            `</div> `,
        ].join('');
    }

    /**
     * 初始化展示逻辑
     * @param {HTMLElement} container 插入位置
     * @param {Array<string>} items 排名组件数组
     */
    function renderRankListWithToggle(container, items) {
        // 将 HTML 字符串转换为真实的 DOM 节点
        const fragment = document.createDocumentFragment();
        items.forEach(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            tempDiv.style.display = "inline-block";
            fragment.appendChild(tempDiv.firstElementChild); // 取出真正的 div 元素
            const space = document.createTextNode(' ');
            fragment.appendChild(space);
        });

        // 在 container 之前插入 fragment
        container.parentNode.insertBefore(fragment, container);

        // 折叠逻辑
        const allItems = document.querySelectorAll(`.${CONFIG.top250Class}, .${CONFIG.rankLabelClass}`);
        allItems.forEach(item => { item.style.display = "inline-block" });

        if (allItems.length > 4) {
            // 创建折叠按钮
            const toggleBtn = document.createElement('div');
            toggleBtn.id = CONFIG.toggleButtonId;
            toggleBtn.innerHTML = '<a href="javascript:void(0)">展示剩余 →</a>';
            toggleBtn.setAttribute('data-toggle', 'show');
            toggleBtn.style.display = 'inline-block';

            // 在 container 之前插入 toggleBtn
            container.parentNode.insertBefore(toggleBtn, container);

            Array.from(allItems).slice(4).forEach(item => { item.style.display = 'none' });

            // 点击按钮切换显示/隐藏
            toggleBtn.addEventListener('click', function () {
                const toggleState = this.getAttribute('data-toggle');
                if (toggleState === 'show') {
                    Array.from(allItems).slice(4).forEach(item => { item.style.display = "inline-block" });
                    this.setAttribute('data-toggle', 'hide');
                    this.innerHTML = '<a href="javascript:void(0)">隐藏剩余 ←</a>';
                } else {
                    Array.from(allItems).slice(4).forEach(item => { item.style.display = "none" });
                    this.setAttribute('data-toggle', 'show');
                    this.innerHTML = '<a href="javascript:void(0)">展示剩余 →</a>';
                }
            });
        }
    }

    /**
     * 处理电影页面
     */
    function handleMoviePage() {
        const matchResult = window.location.href.match(/^https:\/\/movie\.douban\.com\/subject\/(\d+)\/?$/);
        if (!matchResult) return;

        const doubanId = matchResult[1];
        const header = document.querySelector("#content > h1");
        if (!header) return;

        const processingStatusItem = createTop250RankItem({
            position: '...',
            title: 'rank4douban',
            shortTitle: '处理中',
            href: 'https://rank4douban.eddiehe.top/'
        });

        injectTop250Stylesheet();
        renderRankListWithToggle(header, [processingStatusItem]);

        GM_xmlhttpRequest({
            method: 'GET',
            url: CONFIG.movieRankUrl,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const lists = Object.values(data);
                    const rankItems = lists
                        .filter(list => list.list[doubanId])
                        .map(list => ({
                            prefix: list.prefix || 'No.',
                            position: list.list[doubanId],
                            title: list.title,
                            shortTitle: list.short_title,
                            href: list.href
                        }))
                        .map(createTop250RankItem);

                    // remove processing status item
                    removeProcessingItem("https://rank4douban.eddiehe.top/");

                    if (rankItems.length > 0) {
                        renderRankListWithToggle(header, rankItems);
                    }
                } catch (e) {
                    console.error("【豆瓣榜单助手·Douban-Ranker】电影榜单数据处理失败:", e);
                    alert("豆瓣榜单助手·Douban-Ranker：电影榜单数据处理时发生错误，请稍后再试！");
                }
            },
            onerror: function (error) {
                console.error("【豆瓣榜单助手·Douban-Ranker】电影榜单网络请求失败:", error);
                alert("豆瓣榜单助手 · Douban-Ranker：电影榜单网络请求时发生错误，请检查您的网络连接后重试！");
            }
        });
    }

    /**
     * 处理播客页面
     */
    function handlePodcastPage() {
        const header = document.querySelector("#content > h1");
        if (!header) return;

        const podcastName = header.innerText.trim();

        const processingStatusItem = createTop250RankItem({
            position: '...',
            title: '中文播客榜',
            shortTitle: '处理中',
            href: 'https://xyzrank.eddiehe.top/'
        });

        injectTop250Stylesheet();
        renderRankListWithToggle(header, [processingStatusItem]);

        GM_xmlhttpRequest({
            method: 'GET',
            url: CONFIG.podcastRankUrl,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const podcast = data.data?.podcasts?.find(p => p.name === podcastName);

                    // remove processing status item
                    removeProcessingItem("https://xyzrank.eddiehe.top/");

                    if (podcast && podcast.rank) {
                        const item = createTop250RankItem({
                            position: podcast.rank,
                            title: '中文播客榜',
                            shortTitle: '中文播客榜',
                            href: podcast.links[0]?.url || '#'
                        });
                        renderRankListWithToggle(header, [item]);
                    }
                } catch (e) {
                    console.error("【豆瓣榜单助手·Douban-Ranker】播客榜单数据处理失败:", e);
                    alert("豆瓣榜单助手·Douban-Ranker：播客榜单数据处理时发生错误，请稍后再试！");
                }
            },
            onerror: function (error) {
                console.error("【豆瓣榜单助手·Douban-Ranker】播客榜单网络请求失败:", error);
                alert("豆瓣榜单助手·Douban-Ranker：播客榜单网络请求时发生错误，请检查您的网络连接后重试！");
            }
        });
    }


    /**
     * 处理音乐页面
     */
    function handleMusicPage() {
        const header = document.querySelector("h1");
        if (!header) return;

        const albumName = header.textContent.trim();

        const processingStatusItem = createTop250RankItem({
            position: '...',
            title: 'HOPICO MUSIC AWARD',
            shortTitle: '处理中',
            href: 'https://hma.eddiehe.top/'
        });

        injectTop250Stylesheet();
        injectRankLabelStylesheet();
        renderRankListWithToggle(header, [processingStatusItem]);

        GM_xmlhttpRequest({
            method: 'GET',
            url: CONFIG.musicRankUrl,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const rankItems = [];

                    // 遍历所有届次 (HOPICO MUSIC AWARDS)
                    Object.entries(data).forEach(([awardName, awardData]) => {
                        if (!awardName.includes('HOPICO MUSIC AWARDS')) return;

                        const categories = awardData.categories || {};

                        // 检查所有奖项类别
                        Object.entries(categories).forEach(([categoryKey, category]) => {
                            const matchingAlbums = category.albums.filter(album =>
                                album.name == albumName
                            );

                            matchingAlbums.forEach(album => {
                                rankItems.push(createRankLabelRankItem({
                                    prefix: '# ',
                                    position: album.award,
                                    title: category.title,
                                    shortTitle: category.short_title,
                                    href: awardData.href,
                                }));
                            });
                        });
                    });

                    // remove processing status item
                    removeProcessingItem("https://hma.eddiehe.top/");

                    if (rankItems.length > 0) {
                        renderRankListWithToggle(header, rankItems);
                    }
                } catch (e) {
                    console.error("【豆瓣榜单助手·Douban-Ranker】音乐榜单数据处理失败:", e);
                    alert("豆瓣榜单助手·Douban-Ranker：音乐榜单数据处理时发生错误，请稍后再试！");
                }
            },
            onerror: function (error) {
                console.error("【豆瓣榜单助手·Douban-Ranker】音乐榜单网络请求失败:", error);
                alert("豆瓣榜单助手·Douban-Ranker：音乐榜单网络请求时发生错误，请检查您的网络连接后重试！");
            }
        });
    }

    // 页面适配入口
    switch (location.host) {
        case 'movie.douban.com':
            handleMoviePage();
            break;
        case 'www.douban.com':
            if (location.pathname.startsWith('/podcast')) handlePodcastPage();
            break;
        case 'music.douban.com':
            handleMusicPage();
            break;
    }
})();