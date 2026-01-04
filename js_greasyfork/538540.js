// ==UserScript==
// @name         HDHive 添加豆瓣和 IMDb 评分
// @namespace    http://hdhive.demojameson.com/
// @version      2.7
// @description  HDHive 添加豆瓣、IMDb 评分和 SubHD 链接，总是使用 TMDB ID 获取 IMDb ID
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
// @downloadURL https://update.greasyfork.org/scripts/538540/HDHive%20%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E5%92%8C%20IMDb%20%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/538540/HDHive%20%E6%B7%BB%E5%8A%A0%E8%B1%86%E7%93%A3%E5%92%8C%20IMDb%20%E8%AF%84%E5%88%86.meta.js
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

    function saveToCache(imdbId, doubanData, imdbRating) {
        const cacheData = {
            imdbId,
            doubanLink: doubanData?.alt?.replace('/movie/', '/subject/'),
            doubanRating: doubanData?.rating?.average || 'N/A',
            imdbRating,
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

    async function displayRatings(imdbId, doubanLink, doubanRating, imdbRating) {
        const titleEl = await waitForElement('h1');
        titleEl.querySelectorAll('.hdhive-rating').forEach(el => el.remove());

        const dlink = document.createElement('a');
        dlink.className = 'hdhive-rating';
        dlink.href = doubanLink || '#';
        dlink.textContent = `豆瓣: ${doubanRating}`;
        dlink.style.marginLeft = '10px';
        dlink.style.color = '#60CC88';
        dlink.target = '_blank';

        const ilink = document.createElement('a');
        ilink.className = 'hdhive-rating';
        ilink.href = `https://www.imdb.com/title/${imdbId}/`;
        ilink.textContent = `IMDb: ${imdbRating}`;
        ilink.style.marginLeft = '10px';
        ilink.style.color = '#CCAA11';
        ilink.target = '_blank';

        const doubanId = getDoubanId(doubanLink);
        if (doubanId) {
            const slink = document.createElement('a');
            slink.className = 'hdhive-rating';
            slink.href = `https://subhd.tv/d/${doubanId}`;
            slink.textContent = 'SubHD';
            slink.style.marginLeft = '10px';
            slink.style.color = '#1E90FF';
            slink.target = '_blank';
            titleEl.append(dlink, ilink, slink);
        } else {
            titleEl.append(dlink, ilink);
        }
    }

    function getIds() {
        let tmdbId = null;
        for (const script of document.scripts) {
            const txt = script.textContent;
            if (txt.includes('__next_f.push')) {
                const tm = txt.match(/"tmdb_id\\":(\d+)/);
                if (tm) tmdbId = tm[1];
            }
        }
        return { tmdbId };
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

    function fetchImdbRating(imdbId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.imdb.com/title/${imdbId}/`,
                onload: res => {
                    if (res.status === 200) {
                        try {
                            const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                            const scoreEl = doc.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"] span');
                            resolve(scoreEl?.textContent.trim() || 'N/A');
                        } catch {
                            resolve('N/A');
                        }
                    } else resolve('N/A');
                },
                onerror: () => resolve('N/A')
            });
        });
    }

    async function searchDouban(imdbId) {
        const doubanApi = `https://api.douban.com/v2/movie/imdb/${imdbId}`;
        const imdbRating = await fetchImdbRating(imdbId);
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
                saveToCache(imdbId, data, imdbRating);
                displayRatings(
                    imdbId,
                    data?.alt?.replace('/movie/', '/subject/') || null,
                    data?.rating?.average || 'N/A',
                    imdbRating
                );
            },
            onerror: () => {
                saveToCache(imdbId, null, imdbRating);
                displayRatings(imdbId, null, 'N/A', imdbRating);
            }
        });
    }

    async function waitForScript() {
        const cached = loadFromCache();
        if (cached) {
            displayRatings(cached.imdbId, cached.doubanLink, cached.doubanRating, cached.imdbRating);
            searchDouban(cached.imdbId);
            return;
        }

        await waitForElement('script');
        const { tmdbId } = getIds();
        if (tmdbId) {
            const type = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';
            const imdbId = await fetchImdbIdFromTmdb(tmdbId, type);
            if (imdbId) {
                searchDouban(imdbId);
            } else {
                console.warn('无法通过 TMDB 获取 IMDb ID');
            }
        } else {
            console.warn('脚本加载完毕，但未检测到 TMDB ID');
        }
    }

    if (document.readyState !== 'loading') {
        waitForScript();
    } else {
        document.addEventListener('DOMContentLoaded', waitForScript);
    }
})();