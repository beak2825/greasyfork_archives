// ==UserScript==
// @name         TMDB 观看高清视频
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 TMDB 网站上添加播放按钮，进行播放
// @author       You
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545770/TMDB%20%E8%A7%82%E7%9C%8B%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/545770/TMDB%20%E8%A7%82%E7%9C%8B%E9%AB%98%E6%B8%85%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 页面类型枚举
    const PageType = {
        MOVIE: 'movie',
        TV_SHOW: 'tv_show',
        TV_SEASON: 'tv_season',
        TV_EPISODE: 'tv_episode'
    };
    // 检测当前页面类型
    function detectPageType() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        if (pathParts[0] === 'movie') {
            return PageType.MOVIE;
        } else if (pathParts[0] === 'tv') {
            if (pathParts.length === 2) {
                return PageType.TV_SHOW;
            } else if (pathParts[2] === 'season' && pathParts.length === 4) {
                return PageType.TV_SEASON;
            } else if (pathParts[2] === 'season' && pathParts[4] === 'episode' && pathParts.length === 6) {
                return PageType.TV_EPISODE;
            }
        }
        return null;
    }
    // 从URL中提取ID
    function extractIds() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        const pageType = detectPageType();
        switch (pageType) {
            case PageType.MOVIE:
                return {
                    tmdbId: pathParts[1]
                };
            case PageType.TV_SHOW:
                return {
                    tmdbId: pathParts[1]
                };
            case PageType.TV_SEASON:
                return {
                    tmdbId: pathParts[1],
                    season: pathParts[3]
                };
            case PageType.TV_EPISODE:
                return {
                    tmdbId: pathParts[1],
                    season: pathParts[3],
                    episode: pathParts[5]
                };
            default:
                return null;
        }
    }
    // 创建播放按钮
    function createPlayButton(ids, episodeNumber = null) {
        const button = document.createElement('button');
        button.className = 'play-button';
        button.textContent = '▶ 播放';
        button.style.cssText = `
            background-color: #01b4e4;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-left: 10px;
            transition: background-color 0.3s;
        `;
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = '#0099cc';
        });
        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = '#01b4e4';
        });
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const pageType = detectPageType();
            let vidlinkUrl = '';
            switch (pageType) {
                case PageType.MOVIE:
                    vidlinkUrl = `https://111movies.com/movie/${ids.tmdbId}`;
                    break;
                case PageType.TV_SHOW:
                    vidlinkUrl = `https://111movies.com/tv/${ids.tmdbId}/1/1`;
                    break;
                case PageType.TV_SEASON:
                     if (episodeNumber) {
                        vidlinkUrl = `https://111movies.com/tv/${ids.tmdbId}/${ids.season}/${episodeNumber}`;
                    } else {
                        // 季页面主按钮，默认播放第一集
                        vidlinkUrl = `https://111movies.com/tv/${ids.tmdbId}/${ids.season}/1`;
                    }
                    break;
                case PageType.TV_EPISODE:
                    vidlinkUrl = `https://111movies.com/tv/${ids.tmdbId}/${ids.season}/${ids.episode}`;
                    break;
            }
            if (vidlinkUrl) {
                window.open(vidlinkUrl, '_blank');
            }
        });
        return button;
    }
    // 添加播放按钮到页面
    function addPlayButton() {
         // 移除旧按钮，防止重复添加
        document.querySelectorAll('.play-button, .episode-play-button').forEach(btn => btn.remove());

        const pageType = detectPageType();
        const ids = extractIds();
        if (!pageType || !ids) {
            return;
        }

        // 根据不同的页面类型，找到合适的位置添加按钮
        switch (pageType) {
            case PageType.MOVIE: {
                const movieTitle = document.querySelector('.title h2');
                if (movieTitle) {
                    const button = createPlayButton(ids);
                    movieTitle.parentElement.appendChild(button);
                }
                break;
            }
            case PageType.TV_SHOW: {
                const tvTitle = document.querySelector('.title h2');
                if (tvTitle) {
                    const button = createPlayButton(ids);
                    tvTitle.parentElement.appendChild(button);
                }
                break;
            }
            case PageType.TV_SEASON: {
                // 在季标题旁边添加一个“播放全季”的按钮（默认播放第一集）
                const seasonTitle = document.querySelector('#main_column h2');
                if (seasonTitle) {
                    const button = createPlayButton(ids);
                    seasonTitle.appendChild(button);
                }
                // 在季页面的每一集旁边添加播放按钮
                const episodeCards = document.querySelectorAll('div.card');
                episodeCards.forEach(card => {
                    const episodeLink = card.querySelector('a[data-episode-number]');
                    const episodeTitleElement = card.querySelector('.episode_title h3');

                    if (episodeLink && episodeTitleElement) {
                        const episodeNumber = episodeLink.getAttribute('data-episode-number');
                        const episodeButton = createPlayButton(ids, episodeNumber);
                        // 调整按钮样式以适应列表
                        episodeButton.className = 'episode-play-button';
                        episodeButton.style.padding = '5px 10px';
                        episodeButton.style.fontSize = '14px';

                        episodeTitleElement.appendChild(episodeButton);
                    }
                });
                break;
            }
            case PageType.TV_EPISODE: {
                const episodeTitle = document.querySelector('.title h2');
                if (episodeTitle) {
                     const button = createPlayButton(ids);
                    episodeTitle.parentElement.appendChild(button);
                }
                break;
            }
        }
    }
    // 等待页面加载完成
    window.addEventListener('load', function() {
        setTimeout(addPlayButton, 1500); // 增加延迟以确保动态内容加载
    });
    // 监听页面变化（SPA导航）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(addPlayButton, 1500); // 增加延迟以确保动态内容加载
        }
    }).observe(document.body, { subtree: true, childList: true });
})();