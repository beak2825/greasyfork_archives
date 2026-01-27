// ==UserScript==
// @name         魔兽官网多语言切换
// @namespace    https://greasyfork.org/zh-CN/users/1502715
// @version      2.9
// @description  用于快速切换魔兽世界官网和战网商城的其他语言版本，支持一键提取新闻封面
// @author       电视卫士
// @license      MIT
// @match        https://wow.blizzard.cn/*
// @match        https://worldofwarcraft.blizzard.com/*
// @match        https://shop.battlenet.com.cn/*/product/*
// @match        https://*.shop.battle.net/*/product/*
// @match        https://news.blizzard.com/*/article/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/545000/%E9%AD%94%E5%85%BD%E5%AE%98%E7%BD%91%E5%A4%9A%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/545000/%E9%AD%94%E5%85%BD%E5%AE%98%E7%BD%91%E5%A4%9A%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getProductPath() {
        const path = location.pathname;
        const query = location.search;
        const match = path.match(/\/product\/(.+)/);
        return match ? `${match[1]}${query}` : null;
    }

    function getWowRelativePath() {
        let path = location.pathname.replace(/^\/+/, '');
        const host = location.hostname;

        if (host === 'wow.blizzard.cn') {
            if (
                path.startsWith('zh-cn/game/races/') ||
                path.startsWith('zh-cn/game/classes/')
            ) {
                return path.replace(/^zh-cn\//, '');
            }
            if (path.startsWith('status')) {
                return 'STATUS_CN';
            }
            return path;
        }

        const parts = path.split('/');
        if (parts.length <= 1) return null;

        let relative = parts.slice(1).join('/');

        if (relative.startsWith('article/')) {
            relative = relative.replace(/^article\//, 'news/');
            try {
                relative = decodeURIComponent(relative);
            } catch (e) {
                console.log('解码URL路径失败，保持原样');
            }
        }

        if (relative.startsWith('game/status/')) {
            return 'STATUS_GLOBAL';
        }

        return relative;
    }

    function buildWowTargetUrl(region, relativePath) {
        if (region.code === 'cn') {
            if (relativePath === 'STATUS_GLOBAL' || relativePath === 'STATUS_CN') {
                return 'https://wow.blizzard.cn/status/#/';
            }
            if (
                relativePath.startsWith('game/races/') ||
                relativePath.startsWith('game/classes/')
            ) {
                return 'https://wow.blizzard.cn/zh-cn/' + relativePath;
            }
            return 'https://wow.blizzard.cn/' + relativePath;
        }

        if (relativePath === 'STATUS_GLOBAL' || relativePath === 'STATUS_CN') {
            return region.url + 'game/status';
        }

        return region.url + relativePath;
    }

    function extractNewsCover() {
        let url = null;

        if (location.hostname.includes('wow.blizzard.cn')) {
            const div = document.evaluate(
                '/html/body/header/div/div',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            if (div?.style?.backgroundImage) {
                const m = div.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                url = m?.[1] || null;
            }
        } else {
            const div = document.evaluate(
                '/html/body/div[1]/div/main/article/header/div/div[1]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            if (div?.style?.backgroundImage) {
                const m = div.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                url = m?.[1] || null;
                if (url?.startsWith('//')) url = 'https:' + url;
            }
        }

        if (url) {
            window.open(url, '_blank');
        } else {
            alert('未能找到封面图片，请确认当前是新闻详情页。');
        }
    }

    const newsRegions = [
        { name: '简体中文（国服）', url: 'https://wow.blizzard.cn/', code: 'cn' },
        { name: '简体中文（国际服）', url: 'https://worldofwarcraft.blizzard.com/zh-cn/', code: 'zh-cn' },
        { name: '繁體中文', url: 'https://worldofwarcraft.blizzard.com/zh-tw/', code: 'zh-tw' },
        { name: 'English (US)', url: 'https://worldofwarcraft.blizzard.com/en-us/', code: 'en-us' },
        { name: 'Español (Latino)', url: 'https://worldofwarcraft.blizzard.com/es-mx/', code: 'es-mx' },
        { name: 'Português (Brasil)', url: 'https://worldofwarcraft.blizzard.com/pt-br/', code: 'pt-br' },
        { name: 'Deutsch', url: 'https://worldofwarcraft.blizzard.com/de-de/', code: 'de-de' },
        { name: 'English (EU)', url: 'https://worldofwarcraft.blizzard.com/en-gb/', code: 'en-gb' },
        { name: 'Español (EU)', url: 'https://worldofwarcraft.blizzard.com/es-es/', code: 'es-es' },
        { name: 'Français', url: 'https://worldofwarcraft.blizzard.com/fr-fr/', code: 'fr-fr' },
        { name: 'Italiano', url: 'https://worldofwarcraft.blizzard.com/it-it/', code: 'it-it' },
        { name: 'Русский', url: 'https://worldofwarcraft.blizzard.com/ru-ru/', code: 'ru-ru' },
        { name: '한국어', url: 'https://worldofwarcraft.blizzard.com/ko-kr/', code: 'ko-kr' }
    ];

    const shopRegions = [
        { name: '中国', url: 'https://shop.battlenet.com.cn/zh-cn/product/', code: 'com.cn' },
        { name: '中國台灣', url: 'https://tw.shop.battle.net/zh-tw/product/', code: 'tw' },
        { name: 'Americas', url: 'https://us.shop.battle.net/en-us/product/', code: 'us' },
        { name: 'Europe', url: 'https://eu.shop.battle.net/en-us/product/', code: 'eu' }
    ];

    const isShopPage = location.pathname.includes('/product/');
    const isNewsPage =
        location.pathname.includes('/news/') ||
        location.pathname.includes('/article/');

    const idOrPath = isShopPage ? getProductPath() : getWowRelativePath();
    if (!idOrPath) return;

    const regions = isShopPage ? shopRegions : newsRegions;

    regions.forEach(region => {
        GM_registerMenuCommand(`切换到 ${region.name}`, () => {
            if (isShopPage) {
                location.href = region.url + idOrPath;
            } else {
                location.href = buildWowTargetUrl(region, idOrPath);
            }
        });
    });

    if (isNewsPage) {
        GM_registerMenuCommand('获取新闻封面图片', extractNewsCover);
    }
})();