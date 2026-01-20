// ==UserScript==
// @name         HDHive添加IMDb和豆瓣评分以及SubHD、TMDB链接
// @namespace    http://hdhive.demojameson.com/
// @version      2.9
// @description  HDHive添加IMDb和豆瓣评分以及SubHD、TMDB链接。
// @author       DemoJameson
// @match        https://hdhive.online/tv/*
// @match        https://hdhive.online/movie/*
// @match        https://hdhive.com/tv/*
// @match        https://hdhive.com/movie/*
// @grant        GM_xmlhttpRequest
// @connect      api.douban.com
// @connect      douban.com
// @connect      www.imdb.com
// @connect      api.themoviedb.org
// @connect      subhd.tv
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538540/HDHive%E6%B7%BB%E5%8A%A0IMDb%E5%92%8C%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%E4%BB%A5%E5%8F%8ASubHD%E3%80%81TMDB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/538540/HDHive%E6%B7%BB%E5%8A%A0IMDb%E5%92%8C%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%E4%BB%A5%E5%8F%8ASubHD%E3%80%81TMDB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TMDB_API_KEY = 'ebb2c093078553178d5d75c6d86d7bde';
    const DOUBAN_API_KEY = '054022eaeae0b00e0fc068c0c0a2102a';
    const CACHE_KEY_PREFIX = 'hdhive_ratings_';
    const CACHE_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 365 天

    function getCacheKey() {
        return CACHE_KEY_PREFIX + window.location.pathname;
    }

    function saveToCache(imdbId, doubanData, imdbRating, imdbVotes, tmdbId, mediaType) {
        const cacheData = {
            imdbId,
            doubanLink: doubanData?.alt?.replace('/movie/', '/subject/'),
            doubanRating: doubanData?.rating?.average || 'N/A',
            doubanVotes: doubanData?.rating?.details?.get('all') || doubanData?.rating?.count || 'N/A', // 尝试取人数
            imdbRating,
            imdbVotes: imdbVotes || 'N/A',
            tmdbId,
            mediaType,
            timestamp: Date.now()
        };
        localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
    }

    function loadFromCache() {
        const cached = localStorage.getItem(getCacheKey());
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < CACHE_EXPIRY) {
                return data;
            } else {
                localStorage.removeItem(getCacheKey());
            }
        }
        return null;
    }

    function getDoubanId(doubanLink) {
        if (!doubanLink) return null;
        const m = doubanLink.match(/\/subject\/(\d+)/);
        return m ? m[1] : null;
    }

    function waitForElement(selector, root = document.body) {
        return new Promise(resolve => {
            const el = root.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver((mutations, obs) => {
                const found = root.querySelector(selector);
                if (found) {
                    obs.disconnect();
                    resolve(found);
                }
            });
            observer.observe(root, { childList: true, subtree: true });
        });
    }

    async function displayRatings(imdbId, doubanLink, doubanRating, doubanVotes, imdbRating, imdbVotes, tmdbId, mediaType) {
        const titleEl = await waitForElement('h1');
        titleEl.querySelectorAll('.hdhive-rating').forEach(el => el.remove());

        // IMDb 显示 + tips
        const ilink = document.createElement('a');
        ilink.className = 'hdhive-rating';
        ilink.href = `https://www.imdb.com/title/${imdbId}/`;
        ilink.textContent = `IMDb: ${imdbRating}`;
        ilink.title = `${imdbVotes === 'N/A' ? '未知' : imdbVotes}人评分`;
        ilink.style.marginLeft = '10px';
        ilink.style.color = '#CCAA11';
        ilink.target = '_blank';

        // 豆瓣 显示 + tips
        const dlink = document.createElement('a');
        dlink.className = 'hdhive-rating';
        dlink.href = doubanLink || '#';
        dlink.textContent = `豆瓣: ${doubanRating}`;
        dlink.title = `${doubanVotes === 'N/A' ? '未知' : doubanVotes}人评分`;
        dlink.style.marginLeft = '10px';
        dlink.style.color = '#60CC88';
        dlink.target = '_blank';

        titleEl.append(ilink, dlink);

        const doubanId = getDoubanId(doubanLink);
        if (doubanId) {
            // SubHD
            const slink = document.createElement('a');
            slink.className = 'hdhive-rating';
            slink.href = `https://subhd.tv/d/${doubanId}`;
            slink.textContent = 'SubHD';
            slink.style.marginLeft = '10px';
            slink.style.color = '#1E90FF';
            slink.target = '_blank';
            titleEl.appendChild(slink);

            // TMDB
            if (tmdbId && mediaType) {
                const tlink = document.createElement('a');
                tlink.className = 'hdhive-rating';
                tlink.href = `https://www.themoviedb.org/${mediaType}/${tmdbId}`;
                tlink.textContent = 'TMDB';
                tlink.style.marginLeft = '10px';
                tlink.style.color = '#01B4E4';
                tlink.target = '_blank';
                titleEl.appendChild(tlink);
            }
        }
    }

    function getIds() {
        let tmdbId = null;
        let mediaType = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';
        for (const script of document.scripts) {
            const txt = script.textContent;
            if (txt.includes('__next_f.push')) {
                const tm = txt.match(/"tmdb_id\\":(\d+)/);
                if (tm) tmdbId = tm[1];
            }
        }
        return { tmdbId, mediaType };
    }

    function fetchImdbIdFromTmdb(tmdbId, type = 'movie') {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`,
                onload: res => {
                    if (res.status === 200) {
                        try {
                            const data = JSON.parse(res.responseText);
                            resolve(data.external_ids?.imdb_id || null);
                        } catch {
                            resolve(null);
                        }
                    } else resolve(null);
                },
                onerror: () => resolve(null)
            });
        });
    }

    function fetchImdbRatingAndVotes(imdbId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.imdb.com/title/${imdbId}/`,
                onload: res => {
                    if (res.status === 200) {
                        try {
                            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                            const scoreEl = doc.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"] span');
                            const ratingText = scoreEl?.textContent.trim() || 'N/A';
                            const votes = scoreEl.parentElement.parentElement.lastElementChild.textContent.trim() || 'N/A';
                            resolve({ rating: ratingText, votes });
                        } catch {
                            resolve({ rating: 'N/A', votes: 'N/A' });
                        }
                    } else {
                        resolve({ rating: 'N/A', votes: 'N/A' });
                    }
                },
                onerror: () => resolve({ rating: 'N/A', votes: 'N/A' })
            });
        });
    }

    async function searchDouban(imdbId, tmdbId, mediaType) {
        const imdbData = await fetchImdbRatingAndVotes(imdbId);
        const doubanApi = `https://api.douban.com/v2/movie/imdb/${imdbId}`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: doubanApi,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: `apikey=${DOUBAN_API_KEY}`,
            onload: res => {
                let data = null;
                if (res.status === 200) {
                    try { data = JSON.parse(res.responseText); } catch {}
                }

                // 尝试取豆瓣评分人数（v2常见字段）
                const doubanVotes = data?.rating?.numRaters || 'N/A';

                saveToCache(
                    imdbId,
                    data,
                    imdbData.rating,
                    imdbData.votes,
                    tmdbId,
                    mediaType
                );

                displayRatings(
                    imdbId,
                    data?.alt?.replace('/movie/', '/subject/') || null,
                    data?.rating?.average || 'N/A',
                    doubanVotes,
                    imdbData.rating,
                    imdbData.votes,
                    tmdbId,
                    mediaType
                );
            },
            onerror: () => {
                saveToCache(imdbId, null, imdbData.rating, imdbData.votes, tmdbId, mediaType);
                displayRatings(imdbId, null, 'N/A', 'N/A', imdbData.rating, imdbData.votes, tmdbId, mediaType);
            }
        });
    }

    async function waitForScript() {
        const cached = loadFromCache();
        if (cached) {
            displayRatings(
                cached.imdbId,
                cached.doubanLink,
                cached.doubanRating,
                cached.doubanVotes,
                cached.imdbRating,
                cached.imdbVotes,
                cached.tmdbId,
                cached.mediaType
            );
            // 后台更新（可选）
            if (cached.imdbId) {
                searchDouban(cached.imdbId, cached.tmdbId, cached.mediaType);
            }
            return;
        }

        await waitForElement('script');
        const { tmdbId, mediaType } = getIds();
        if (tmdbId) {
            const imdbId = await fetchImdbIdFromTmdb(tmdbId, mediaType);
            if (imdbId) {
                searchDouban(imdbId, tmdbId, mediaType);
            } else {
                console.warn('无法通过 TMDB 获取 IMDb ID');
            }
        } else {
            console.warn('未检测到 TMDB ID');
        }
    }

    if (document.readyState !== 'loading') {
        waitForScript();
    } else {
        document.addEventListener('DOMContentLoaded', waitForScript);
    }
})();