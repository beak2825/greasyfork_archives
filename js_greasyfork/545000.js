// ==UserScript==
// @name         魔兽世界新闻/商城区域切换
// @namespace    https://greasyfork.org/zh-CN/users/1502715
// @version      2.3
// @description  通过油猴菜单快速切换魔兽世界新闻和战网商城商品区域/语言版本、提取新闻封面
// @author       电视卫士
// @license      MIT
// @match        https://wow.blizzard.cn/news/*
// @match        https://worldofwarcraft.blizzard.com/*/news/*
// @match        https://shop.battlenet.com.cn/*/product/*
// @match        https://*.shop.battle.net/*/product/*
// @match        https://news.blizzard.com/*/article/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/545000/%E9%AD%94%E5%85%BD%E4%B8%96%E7%95%8C%E6%96%B0%E9%97%BB%E5%95%86%E5%9F%8E%E5%8C%BA%E5%9F%9F%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/545000/%E9%AD%94%E5%85%BD%E4%B8%96%E7%95%8C%E6%96%B0%E9%97%BB%E5%95%86%E5%9F%8E%E5%8C%BA%E5%9F%9F%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====== 基础函数 ======

    // 提取新闻文章 ID
    function getNewsArticleId() {
        const path = window.location.pathname;
        const match = path.match(/(?:\/news\/|\/article\/)(\d+)/);
        return match ? match[1] : null;
    }

    // 提取商城产品路径（包括产品名和查询参数）
    function getProductPath() {
        const path = window.location.pathname;
        const query = window.location.search;
        const match = path.match(/\/product\/(.+)/);
        return match ? `${match[1]}${query}` : null;
    }

    // ====== 新增：提取新闻封面并在新标签页打开 ======
    function extractNewsCover() {
        let url = null;

        if (window.location.hostname.includes("wow.blizzard.cn")) {
            // 国服新闻
            const div = document.evaluate(
                '/html/body/header/div/div',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            if (div && div.style.backgroundImage) {
                const match = div.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                url = match ? match[1] : null;
            }
        } else if (
            window.location.hostname.includes("worldofwarcraft.blizzard.com") ||
            window.location.hostname.includes("news.blizzard.com")
        ) {
            // 国际服新闻
            const div = document.evaluate(
                '/html/body/div[1]/div/main/article/header/div/div[1]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            if (div && div.style.backgroundImage) {
                const match = div.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                url = match ? match[1] : null;

                // 若为 // 开头，则补 https:
                if (url && url.startsWith("//")) {
                    url = "https:" + url;
                }
            }
        }

        if (url) {
            console.log("新闻封面图片 URL：", url);
            window.open(url, "_blank");
        } else {
            alert("未能找到封面图片，请确认当前是新闻详情页。");
        }
    }

    // ====== 区域配置 ======
    const newsRegions = [
        { name: '简体中文', url: 'https://wow.blizzard.cn/news/', code: 'cn' },
        { name: 'English', url: 'https://worldofwarcraft.blizzard.com/en-us/news/', code: 'en-us' },
        { name: '繁體中文', url: 'https://worldofwarcraft.blizzard.com/zh-tw/news/', code: 'zh-tw' },
        { name: '한국어', url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/', code: 'ko-kr' }
    ];

    const shopRegions = [
        { name: '中国', url: 'https://shop.battlenet.com.cn/zh-cn/product/', code: 'com.cn' },
        { name: '中國台灣', url: 'https://tw.shop.battle.net/zh-tw/product/', code: 'tw' },
        { name: 'Americas', url: 'https://us.shop.battle.net/en-us/product/', code: 'us' },
        { name: 'Europe', url: 'https://eu.shop.battle.net/en-us/product/', code: 'eu' }
    ];

    // ====== 主逻辑 ======
    const isNewsPage = window.location.href.includes('news') || window.location.href.includes('article');
    const idOrPath = isNewsPage ? getNewsArticleId() : getProductPath();
    if (!idOrPath) return;

    const regions = isNewsPage ? newsRegions : shopRegions;

    regions.forEach(region => {
        GM_registerMenuCommand(`切换到 ${region.name}`, () => {
            window.location.href = `${region.url}${idOrPath}${isNewsPage ? '/' : ''}`;
        });
    });

    // 仅在新闻页显示“提取封面”功能
    if (isNewsPage) {
        GM_registerMenuCommand("获取新闻封面图片", extractNewsCover);
    }

})();
