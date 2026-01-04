// ==UserScript==
// @name         Douban Movie Quick Search Links
// @namespace    https://github.com/fixicelo/userscripts
// @version      1.0.0
// @description  Add quick search links for IMDb, YouTube, Netflix, Google, bilibili, Rotten Tomatoes on Douban movie pages. | 在豆瓣电影页面添加 IMDb、YouTube、Netflix、Google、bilibili、烂番茄的快捷搜索链接。 | 在豆瓣電影頁面添加 IMDb、YouTube、Netflix、Google、bilibili、爛番茄的快捷搜尋連結。
// @author       fixicelo
// @match        *://movie.douban.com/subject/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542375/Douban%20Movie%20Quick%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/542375/Douban%20Movie%20Quick%20Search%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const info = document.getElementById('info');
    const titleElement = document.querySelector('h1 > span');

    if (!info || !titleElement) return;

    // Extract title and year
    const title = titleElement.textContent.trim();
    const yearMatch = document.querySelector('span.year');
    const year = yearMatch ? yearMatch.textContent.replace(/[()]/g, '').trim() : '';
    const searchQuery = encodeURIComponent([title, year].filter(Boolean).join(' '));

    // Find IMDb ID if present
    const imdbMatch = info.textContent.match(/tt\d{7,8}/);
    const imdbId = imdbMatch ? imdbMatch[0] : null;

    // Link definitions
    const links = [
        imdbId
            ? { name: 'IMDb', url: `https://www.imdb.com/title/${imdbId}` }
            : { name: 'IMDb', url: `https://www.imdb.com/find?q=${searchQuery}` },
        { name: 'Google', url: `https://www.google.com/search?q=${searchQuery}` },
        { name: 'YouTube', url: `https://www.youtube.com/results?search_query=${searchQuery}` },
        { name: 'Netflix', url: `https://www.netflix.com/search?q=${searchQuery}` },
        { name: 'bilibili', url: `https://search.bilibili.com/all?keyword=${searchQuery}` },
        { name: 'Rotten Tomatoes', url: `https://www.rottentomatoes.com/search?search=${searchQuery}` }
    ];

    // Build UI
    const container = document.createElement('div');
    container.id = 'search-links';

    const label = document.createElement('span');
    label.className = 'pl';
    label.textContent = '搜索: ';

    const linksSpan = document.createElement('span');
    linksSpan.className = 'attrs';

    links.forEach((link, idx) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.name;
        linksSpan.appendChild(a);
        if (idx < links.length - 1) {
            linksSpan.appendChild(document.createTextNode(' / '));
        }
    });

    container.appendChild(label);
    container.appendChild(linksSpan);

    info.appendChild(container);
})();