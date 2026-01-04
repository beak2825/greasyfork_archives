// ==UserScript==
// @name         豆瓣片单已上映电影筛选器（从第一页开始处理所有页）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  从第一页开始自动筛选并遍历豆瓣片单中已经上映的所有电影，包括多个页面
// @author       flimer
// @match        https://www.douban.com/doulist/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493057/%E8%B1%86%E7%93%A3%E7%89%87%E5%8D%95%E5%B7%B2%E4%B8%8A%E6%98%A0%E7%94%B5%E5%BD%B1%E7%AD%9B%E9%80%89%E5%99%A8%EF%BC%88%E4%BB%8E%E7%AC%AC%E4%B8%80%E9%A1%B5%E5%BC%80%E5%A7%8B%E5%A4%84%E7%90%86%E6%89%80%E6%9C%89%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/493057/%E8%B1%86%E7%93%A3%E7%89%87%E5%8D%95%E5%B7%B2%E4%B8%8A%E6%98%A0%E7%94%B5%E5%BD%B1%E7%AD%9B%E9%80%89%E5%99%A8%EF%BC%88%E4%BB%8E%E7%AC%AC%E4%B8%80%E9%A1%B5%E5%BC%80%E5%A7%8B%E5%A4%84%E7%90%86%E6%89%80%E6%9C%89%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isFirstPage = !window.location.search.includes('start=') || window.location.search.includes('start=0');
    if (!isFirstPage) return;

    const resultsContainer = document.createElement('div');
    resultsContainer.style.position = 'fixed';
    resultsContainer.style.bottom = '10px';
    resultsContainer.style.right = '10px';
    resultsContainer.style.width = '300px';
    resultsContainer.style.height = '400px';
    resultsContainer.style.overflowY = 'scroll';
    resultsContainer.style.background = 'white';
    resultsContainer.style.border = '1px solid black';
    resultsContainer.style.padding = '5px';
    document.body.appendChild(resultsContainer);

    const currentYear = new Date().getFullYear();
    let nextPageUrl = window.location.href;

    const processEntries = (htmlText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const movieEntries = doc.querySelectorAll('.doulist-item');
        movieEntries.forEach(entry => {
            const titleElement = entry.querySelector('.title a');
            const title = titleElement ? titleElement.innerText.trim() : '未知标题';

            const abstractElement = entry.querySelector('.abstract');
            const abstractText = abstractElement ? abstractElement.innerText : '';
            const releaseYearMatch = abstractText.match(/年份: (\d{4})/);
            const releaseYear = releaseYearMatch ? parseInt(releaseYearMatch[1]) : null;

            const ratingDiv = entry.querySelector('.rating');
            const ratingText = ratingDiv ? ratingDiv.textContent.trim() : '状态未知';

            if (releaseYear && releaseYear <= currentYear) {
                const statusText = `(${releaseYear}) - ${ratingText}`;
                if (!ratingText.includes('尚未上映') && !ratingText.includes('尚未播出')) {
                    const resultElement = document.createElement('div');
                    resultElement.textContent = `${title} ${statusText}`;
                    resultsContainer.appendChild(resultElement);
                }
            }
        });

        const nextPageLink = doc.querySelector('.next a');
        if (nextPageLink) {
            nextPageUrl = nextPageLink.href;
            loadNextPage();
        } else {
            const resultElement = document.createElement('div');
            resultElement.textContent = '已处理所有页面';
            resultsContainer.appendChild(resultElement);
        }
    };

    const loadNextPage = () => {
        GM_xmlhttpRequest({
            method: "GET",
            url: nextPageUrl,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    processEntries(response.responseText);
                } else {
                    const resultElement = document.createElement('div');
                    resultElement.textContent = '页面加载错误';
                    resultsContainer.appendChild(resultElement);
                }
            }
        });
    };

    loadNextPage();
})();
