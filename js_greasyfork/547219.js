// ==UserScript==
// @name           豆瓣电影多平台一键直达 + 烂番茄+IMDb评分
// @description    右侧显示多平台搜索 + 烂番茄+IMDb评分（从豆瓣提取IMDb ID精准抓取），支持自主添加平台
// @author         bai
// @version        2.6
// @icon           https://movie.douban.com/favicon.ico
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include        https://movie.douban.com/subject/*
// @run-at         document-end
// @license        Apache-2.0
// @namespace      https://greasyfork.org/users/967749
// @downloadURL https://update.greasyfork.org/scripts/547219/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%A4%9A%E5%B9%B3%E5%8F%B0%E4%B8%80%E9%94%AE%E7%9B%B4%E8%BE%BE%20%2B%20%E7%83%82%E7%95%AA%E8%8C%84%2BIMDb%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/547219/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%A4%9A%E5%B9%B3%E5%8F%B0%E4%B8%80%E9%94%AE%E7%9B%B4%E8%BE%BE%20%2B%20%E7%83%82%E7%95%AA%E8%8C%84%2BIMDb%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

$(function () {
    try {
        // 1. 注入页面样式
        GM_addStyle(`
            #douban_movie_multi_platform {
                margin: 10px 0;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                border: 1px solid #eee;
            }
            #douban_movie_multi_platform h3 {
                font-size: 16px;
                color: #333;
                border-bottom: 1px solid #e9ecef;
                padding-bottom: 6px;
                font-weight: bold;
                margin: 0 0 8px;
            }
            .movie_platforms {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .movie_platform {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px;
                border-radius: 4px;
                background: white;
                transition: background 0.2s;
                border: 1px solid #f0f0f0;
            }
            .movie_platform:hover {
                background: #f1f8fe;
            }
            .platform_icon {
                font-size: 18px;
                min-width: 22px;
                text-align: center;
            }
            .platform_name {
                font-size: 14px;
                color: #555;
                flex-shrink: 0;
                width: 60px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 500;
            }
            .platform_link {
                font-size: 14px;
                padding: 4px 8px;
                border: 1px solid #00a1d6;
                background: #fff;
                color: #00a1d6;
                border-radius: 4px;
                text-decoration: none;
                transition: all 0.2s;
            }
            .platform_link:hover {
                background: #00a1d6;
                color: white;
            }
            /* 烂番茄评分样式 */
            .rotten_rating {
                margin-left: auto;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
            }
            .rotten_fresh {
                background-color: #4CAF50;
                color: white;
            }
            .rotten_rotten {
                background-color: #F44336;
                color: white;
            }
            /* IMDb评分样式 */
            .imdb_rating {
                margin-left: auto;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                background-color: #F5C518;
                color: #000;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .imdb_rating .rating_count {
                font-size: 10px;
                color: #333;
                font-weight: normal;
            }
            /* 通用加载和错误样式 */
            .rating_loading {
                color: #666;
                font-size: 12px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .rating_loading::before {
                content: "";
                width: 8px;
                height: 8px;
                border: 2px solid #ccc;
                border-top-color: #666;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            .rating_error {
                color: #e53935;
                font-size: 12px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `);

        // 2. 提取电影核心信息
        function getMovieInfo() {
            // 提取标题和年份
            let title = $('h1').first().text().replace(/\s*\(\d{4}\)\s*$/, '').trim();
            const yearMatch = $('h1').first().text().match(/\((\d{4})\)/);
            const year = yearMatch? yearMatch[1] : '';
            if (!title) title = $('#wrapper > h1 > span').text().replace(/\s*\(\d{4}\)\s*$/, '').trim();

            // 提取导演/主演（用于搜索）
            let director = $('#info span:contains("导演")').nextAll('a').first().text().trim() || '';
            let actor = $('#info span:contains("主演")').nextAll('a').first().text().trim() || '';
            const keyword = [title, year, director || actor].filter(Boolean).join(' ');

            // 从豆瓣页面提取IMDb ID
            const imdbId = getImdbIdFromDouban();

            console.log('[电影信息] 提取结果：', { title, year, keyword, imdbId });
            return { title, year, keyword, imdbId };
        }

        // 3. 从豆瓣页面提取IMDb ID
        function getImdbIdFromDouban() {
            const imdbSpan = Array.from(document.querySelectorAll('#info span.pl'))
               .find(span => span.textContent.includes('IMDb:'));
            return imdbSpan? imdbSpan.nextSibling?.textContent?.trim() : null;
        }

        const movieInfo = getMovieInfo();
        if (!movieInfo.title) {
            console.error('无法提取电影标题，脚本终止');
            return;
        }

        // 4. 平台配置区
        const platforms = [
            {
                name: '烂番茄',
                icon: '🍅',
                url: `https://www.rottentomatoes.com/search?search=${encodeURIComponent(`${movieInfo.title} ${movieInfo.year}`)}`,
                hasRating: true,
                ratingType: 'rotten'
            },
            {
                name: 'IMDb',
                icon: '⭐',
                url: movieInfo.imdbId? `https://www.imdb.com/title/${movieInfo.imdbId}/` : `https://www.imdb.com/find?q=${encodeURIComponent(`${movieInfo.title} ${movieInfo.year}`)}`,
                hasRating: true,
                ratingType: 'imdb'
            },
            { name: 'B站', icon: '📺', url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(movieInfo.keyword)}`, hasRating: false },
            { name: '抖音', icon: '♪', url: `https://www.douyin.com/search/${encodeURIComponent(movieInfo.keyword)}`, hasRating: false },
            { name: 'GAZE', icon: '📽️', url: `https://gaze.run/filter?search=${encodeURIComponent(movieInfo.keyword)}`, hasRating: false },
            { name: '努努', icon: '🎥', url: `https://nnyy.in/so?q=${encodeURIComponent(movieInfo.keyword)}`, hasRating: false },
            { name: 'Youtube', icon: '▶', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(movieInfo.keyword)}`, hasRating: false }
        ];

        // 5. 生成模块HTML
        function createPlatformModule() {
            let html = `
                <div id="douban_movie_multi_platform">
                    <h3>电影资源直达</h3>
                    <div class="movie_platforms">
            `;
            platforms.forEach((plat, index) => {
                const ratingPlaceholder = plat.hasRating
                   ? `<span class="rating_loading">获取${plat.name}评分中...</span>`
                    : '';

                html += `
                    <div class="movie_platform" id="platform_${index}">
                        <div class="platform_icon">${plat.icon}</div>
                        <div class="platform_name">${plat.name}</div>
                        <a href="${plat.url}" target="_blank" class="platform_link">去搜索</a>
                        ${ratingPlaceholder}
                    </div>
                `;
            });
            html += `</div></div>`;
            return html;
        }

        // 6. 插入右侧侧边栏（增加容错处理）
        const moduleHtml = createPlatformModule();
        const aside = $('.aside');
        if (aside.length) {
            const watchArea = aside.find('h2:contains("在哪儿看这部电影")').closest('div');
            if (watchArea.length) {
                watchArea.before(moduleHtml);
            } else {
                aside.prepend(moduleHtml);
            }
        } else if ($('#content').length) {
            $('#content').prepend(moduleHtml);
        } else {
            // 终极容错：直接添加到body
            $('body').append(`<div style="position:fixed;top:20px;right:20px;z-index:9999;width:300px;">${moduleHtml}</div>`);
        }

        // 7. 字符串相似度算法
        function stringSimilarity(str1, str2) {
            const len1 = str1.length, len2 = str2.length;
            const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

            for (let i = 0; i <= len1; i++) matrix[i][0] = i;
            for (let j = 0; j <= len2; j++) matrix[0][j] = j;

            for (let i = 1; i <= len1; i++) {
                for (let j = 1; j <= len2; j++) {
                    const cost = str1[i-1].toLowerCase() === str2[j-1].toLowerCase()? 0 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i-1][j] + 1,
                        matrix[i][j-1] + 1,
                        matrix[i-1][j-1] + cost
                    );
                }
            }

            return 1 - matrix[len1][len2] / Math.max(len1, len2);
        }

        // 8. 抓取烂番茄评分
        function getRottenTomatoesRating(title, year) {
            const searchTerm = encodeURIComponent(`${title} ${year}`);
            const rtSearchUrl = `https://www.rottentomatoes.com/search?search=${searchTerm}`;

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: rtSearchUrl,
                    timeout: 15000,
                    onload: (response) => {
                        if (response.status!== 200) {
                            resolve({ rating: null, error: '请求失败', url: null });
                            return;
                        }

                        try {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = response.responseText;
                            const movieItems = tempDiv.querySelectorAll('search-page-media-row[data-qa="data-row"]');
                            let bestMatch = { rating: null, score: 0, url: null };

                            movieItems.forEach(item => {
                                const itemTitle = item.querySelector('h2')?.textContent || '';
                                const itemYear = item.getAttribute('releaseyear') || '';
                                const tomatometerScore = item.getAttribute('tomatometerscore') || '';
                                const itemUrl = item.querySelector('a[data-qa="info-name"]')?.getAttribute('href') || '';

                                let score = stringSimilarity(title, itemTitle);
                                if (year && itemYear === year) score += 0.3;

                                if (tomatometerScore && score > bestMatch.score) {
                                    bestMatch = {
                                        rating: `${tomatometerScore}%`,
                                        score: score,
                                        url: itemUrl? (itemUrl.startsWith('http')? itemUrl : `https://www.rottentomatoes.com${itemUrl}`) : null
                                    };
                                }
                            });

                            resolve(bestMatch.rating
                               ? { rating: bestMatch.rating, error: null, url: bestMatch.url }
                                : { rating: null, error: '未找到匹配电影', url: null });
                        } catch (e) {
                            console.error('烂番茄解析错误:', e);
                            resolve({ rating: null, error: '解析失败', url: null });
                        }
                    },
                    onerror: (error) => {
                        resolve({ rating: null, error: `请求错误: ${error.message}`, url: null });
                    },
                    ontimeout: () => {
                        resolve({ rating: null, error: '请求超时', url: null });
                    }
                });
            });
        }

        // 9. 抓取IMDb评分
        function getImdbRating() {
            if (movieInfo.imdbId) {
                const imdbUrl = `https://www.imdb.com/title/${movieInfo.imdbId}/`;
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: imdbUrl,
                        timeout: 15000,
                        onload: (response) => {
                            if (response.status!== 200) {
                                resolve({ rating: null, count: null, error: '请求失败', url: imdbUrl });
                                return;
                            }

                            try {
                                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                                const ratingContainer = doc.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"]');

                                if (!ratingContainer) {
                                    resolve({ rating: null, count: null, error: '未找到评分', url: imdbUrl });
                                    return;
                                }

                                const score = ratingContainer.querySelector('span:first-child')?.textContent?.trim() || null;
                                const count = ratingContainer.parentElement?.querySelector('div[class*="dwhNqC"]')?.textContent?.trim() || null;

                                resolve({
                                    rating: score? `${score}/10` : null,
                                    count: count || null,
                                    error: null,
                                    url: imdbUrl
                                });
                            } catch (e) {
                                console.error('IMDb解析错误:', e);
                                resolve({ rating: null, count: null, error: '解析失败', url: imdbUrl });
                            }
                        },
                        onerror: (error) => {
                            resolve({ rating: null, count: null, error: `请求错误: ${error.message}`, url: imdbUrl });
                        },
                        ontimeout: () => {
                            resolve({ rating: null, count: null, error: '请求超时', url: imdbUrl });
                        }
                    });
                });
            }

            // 降级逻辑
            const searchTerm = encodeURIComponent(`${movieInfo.title} ${movieInfo.year}`);
            const imdbSearchUrl = `https://www.imdb.com/find?q=${searchTerm}`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: imdbSearchUrl,
                    timeout: 15000,
                    onload: (response) => {
                        if (response.status!== 200) {
                            resolve({ rating: null, count: null, error: '请求失败', url: null });
                            return;
                        }

                        try {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = response.responseText;
                            const movieItems = tempDiv.querySelectorAll('li.ipc-metadata-list-summary-item');
                            let bestMatch = { rating: null, count: null, score: 0, url: null };

                            movieItems.forEach(item => {
                                const itemTitle = item.querySelector('.ipc-metadata-list-summary-item__t')?.textContent || '';
                                const itemYear = item.querySelector('.ipc-metadata-list-summary-item__li')?.textContent?.match(/\d{4}/)?.[0] || '';
                                const ratingElem = item.querySelector('.ipc-rating-star--base')?.textContent || null;
                                const itemUrl = item.querySelector('a.ipc-metadata-list-summary-item__t')?.getAttribute('href') || '';

                                let score = stringSimilarity(movieInfo.title, itemTitle);
                                if (movieInfo.year && itemYear === movieInfo.year) score += 0.3;

                                if (ratingElem && score > bestMatch.score) {
                                    bestMatch = {
                                        rating: `${ratingElem.trim()}/10`,
                                        count: null,
                                        score: score,
                                        url: itemUrl? (itemUrl.startsWith('http')? itemUrl : `https://www.imdb.com${itemUrl}`) : null
                                    };
                                }
                            });

                            resolve(bestMatch.rating
                               ? { rating: bestMatch.rating, count: bestMatch.count, error: null, url: bestMatch.url }
                                : { rating: null, count: null, error: '未找到匹配电影', url: null });
                        } catch (e) {
                            console.error('IMDb搜索解析错误:', e);
                            resolve({ rating: null, count: null, error: '解析失败', url: null });
                        }
                    },
                    onerror: (error) => {
                        resolve({ rating: null, count: null, error: `请求错误: ${error.message}`, url: null });
                    },
                    ontimeout: () => {
                        resolve({ rating: null, count: null, error: '请求超时', url: null });
                    }
                });
            });
        }

        // 10. 处理评分显示（修复链接问题）
        function updateRatingDisplay(platformIndex, ratingInfo, ratingType) {
            const $platform = $(`#platform_${platformIndex}`);
            const $loading = $platform.find('.rating_loading');
            if (!$loading.length) return;

            // 确保URL格式正确
            let targetUrl = ratingInfo.url || '#';
            if (targetUrl &&!targetUrl.startsWith('http')) {
                targetUrl = 'https://www.' + targetUrl.replace(/^\/+/, '');
            }

            if (ratingInfo.rating && targetUrl) {
                if (ratingType === 'rotten') {
                    const isFresh = parseInt(ratingInfo.rating) >= 70;
                    $loading.replaceWith(`
                        <a href="${targetUrl}" target="_blank" class="rotten_rating ${isFresh? 'rotten_fresh' : 'rotten_rotten'}">
                            新鲜度 ${ratingInfo.rating}
                        </a>
                    `);
                } else if (ratingType === 'imdb') {
                    const countHtml = ratingInfo.count? `<span class="rating_count">(${ratingInfo.count})</span>` : '';
                    $loading.replaceWith(`
                        <a href="${targetUrl}" target="_blank" class="imdb_rating">
                            ${ratingInfo.rating} ${countHtml}
                        </a>
                    `);
                }
            } else {
                $loading.replaceWith(`
                    <span class="rating_error">${ratingInfo.error || '未找到评分'}</span>
                `);
            }
        }

        // 11. 获取并显示评分
        const ratingPlatforms = platforms.filter(p => p.hasRating);
        ratingPlatforms.forEach(plat => {
            const index = platforms.findIndex(p => p.name === plat.name);
            if (index === -1) return;

            if (plat.ratingType === 'rotten') {
                getRottenTomatoesRating(movieInfo.title, movieInfo.year)
                   .then(ratingInfo => updateRatingDisplay(index, ratingInfo, 'rotten'))
                   .catch(err => console.error('烂番茄评分获取失败:', err));
            } else if (plat.ratingType === 'imdb') {
                getImdbRating()
                   .then(ratingInfo => updateRatingDisplay(index, ratingInfo, 'imdb'))
                   .catch(err => console.error('IMDb评分获取失败:', err));
            }
        });
    } catch (e) {
        console.error('脚本执行错误:', e);
        // 显示错误提示
        $('body').append(`
            <div style="position:fixed;top:20px;left:20px;z-index:9999;background:red;color:white;padding:10px;">
                电影多平台脚本出错: ${e.message}
            </div>
        `);
    }
});
