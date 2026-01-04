// ==UserScript==
// @name         豆瓣显示TMDB链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在豆瓣电影页面显示对应的TMDB链接，并添加复制按钮
// @author       yum
// @match        https://movie.douban.com/subject/*
// @grant        none
// @icon         https://www.hddolby.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493749/%E8%B1%86%E7%93%A3%E6%98%BE%E7%A4%BATMDB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/493749/%E8%B1%86%E7%93%A3%E6%98%BE%E7%A4%BATMDB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = 'xxxxxx'; // 替换为你的TMDB API密钥

    // 获取电影名称
    const movieName = document.querySelector('span[property="v:itemreviewed"]').textContent.trim();

    // 创建TMDB链接和复制按钮
    function createTMDBLinkAndButton(tmdbData) {
        const infoDiv = document.querySelector('div#info');

        // 创建TMDB链接元素
        const tmdbLinkElement = document.createElement('span');
        tmdbLinkElement.classList.add('pl');
        tmdbLinkElement.innerHTML = `TMDB: <a href="${tmdbData.url}" target="_blank">${tmdbData.title}</a> `;
        infoDiv.appendChild(tmdbLinkElement);

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.id = 'copyButton';
        copyButton.textContent = '复制链接';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(tmdbData.url)
                .catch(err => console.error('复制链接失败：', err));
        });
        infoDiv.appendChild(copyButton);
    }

    // 获取TMDB数据
    function getTMDBData(movieName) {
        const tmdbSearchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=zh-CN&query=${encodeURIComponent(movieName)}`;

        fetch(tmdbSearchUrl)
            .then(response => response.json())
            .then(data => {
                const tmdbResult = data.results[0];
                if (tmdbResult) {
                    let mediaType, tmdbId, tmdbTitle;
                    if (tmdbResult.media_type === 'movie') {
                        mediaType = 'movie';
                        tmdbId = tmdbResult.id;
                        tmdbTitle = tmdbResult.title;
                    } else if (tmdbResult.media_type === 'tv') {
                        mediaType = 'tv';
                        tmdbId = tmdbResult.id;
                        tmdbTitle = tmdbResult.name;
                    }

                    const tmdbData = {
                        url: `https://www.themoviedb.org/${mediaType}/${tmdbId}`,
                        title: tmdbTitle
                    };

                    createTMDBLinkAndButton(tmdbData);
                }
            })
            .catch(error => console.error('Error fetching TMDB data:', error));
    }

    // 初始化
    getTMDBData(movieName);
})();
