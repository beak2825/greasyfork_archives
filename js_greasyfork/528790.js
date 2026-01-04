// ==UserScript==
// @name         The Information | Find Alternative Articles
// @namespace    http://your.namespace
// @version      1.2
// @icon         https://www.google.com/s2/favicons?domain=theinformation.com&sz=64
// @description  Displays a combined list of alternative articles from Google News and Bing News
// @author       UniverseDev
// @license      MIT
// @match        https://www.theinformation.com/articles/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/528790/The%20Information%20%7C%20Find%20Alternative%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/528790/The%20Information%20%7C%20Find%20Alternative%20Articles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageTitle = document.title;
    const articleTitle = pageTitle.split(' | ')[0];
    const googleRssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(articleTitle)}`;
    const bingRssUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(articleTitle)}&format=rss`;

    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 150px;
        right: 10px;
        width: 300px;
        max-height: 80vh;
        overflow-y: auto;
        background: white;
        padding: 15px;
        font-family: Arial, sans-serif;
        z-index: 9999;
    `;
    container.innerHTML = '<h3 style="margin: 0 0 15px 0; color: #000; font-size: 18px; font-weight: bold;">Alternative Articles</h3><p style="margin: 0; color: #666;">Loading...</p>';
    document.body.appendChild(container);

    function parseGoogleItem(item) {
        return {
            title: item.querySelector('title')?.textContent || '',
            url: item.querySelector('link')?.textContent || '',
            source: item.querySelector('source')?.textContent || 'Unknown',
            date: item.querySelector('pubDate')?.textContent || ''
        };
    }

    function parseBingItem(item) {
        const description = item.querySelector('description')?.textContent || '';
        const actualUrlMatch = description.match(/href="([^"]+)"/);
        const actualUrl = actualUrlMatch ? actualUrlMatch[1] : item.querySelector('link')?.textContent || '';
        const publication = item.getElementsByTagName('news:publication')[0];
        const source = publication?.getElementsByTagName('news:name')[0]?.textContent || 'Unknown';
        return {
            title: item.querySelector('title')?.textContent || '',
            url: actualUrl,
            source: source,
            date: item.querySelector('pubDate')?.textContent || ''
        };
    }

    function normalizeUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname + urlObj.pathname;
        } catch (e) {
            return url;
        }
    }

    function fetchRss(url, parseItem) {
        return new Promise(resolve => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const xmlText = response.responseText;
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                        const items = xmlDoc.querySelectorAll('item');
                        const parsedArticles = Array.from(items).map(parseItem);
                        resolve({ articles: parsedArticles, error: null });
                    } else {
                        resolve({ articles: [], error: `Error loading articles from ${url}` });
                    }
                },
                onerror: function(error) {
                    resolve({ articles: [], error: error.message });
                }
            });
        });
    }

    Promise.all([
        fetchRss(googleRssUrl, parseGoogleItem),
        fetchRss(bingRssUrl, parseBingItem)
    ]).then(results => {
        const allArticles = results.flatMap(result => result.articles);
        const errors = results.map(result => result.error).filter(Boolean);

        const filteredArticles = allArticles.filter(article =>
            !article.url.toLowerCase().includes('theinformation.com') &&
            !article.source.toLowerCase().includes('the information')
        );

        const uniqueArticles = Array.from(new Map(filteredArticles.map(article => [normalizeUrl(article.url), article])).values());

        uniqueArticles.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
            return dateB - dateA;
        });

        const topArticles = uniqueArticles.slice(0, 10);

        if (topArticles.length > 0) {
            const articlesHtml = topArticles.map(article => `
                <div style="margin-bottom: 20px;">
                    <a href="${article.url}" target="_blank" style="display: block; color: #000; font-weight: bold; font-size: 16px; text-decoration: none; margin-bottom: 5px;">${article.title}</a>
                    <small style="color: #666; font-size: 12px;">${article.source} - ${article.date ? new Date(article.date).toLocaleDateString() : 'Unknown date'}</small>
                </div>
            `).join('');
            container.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #000; font-size: 18px; font-weight: bold;">Alternative Articles <a href="#" style="float: right; font-size: 14px; color: #666; text-decoration: none;" id="close-alternatives">✕</a></h3>
                ${articlesHtml}
            `;
        } else {
            container.innerHTML = '<h3 style="margin: 0 0 15px 0; color: #000; font-size: 18px; font-weight: bold;">Alternative Articles</h3><p style="margin: 0; color: #666;">No articles found.</p>';
        }

        container.querySelector('#close-alternatives')?.addEventListener('click', (e) => {
            e.preventDefault();
            container.style.display = 'none';
        });

        if (errors.length > 0) {
            const errorHtml = errors.map(error => `<p style="margin: 15px 0 10px 0; color: #666;">${error}</p>`).join('');
            container.insertAdjacentHTML('beforeend', errorHtml);
        }
    });
})();