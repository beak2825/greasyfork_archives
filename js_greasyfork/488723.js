// ==UserScript==
// @name         文案网文章收集
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  保存为 csv 文件
// @author       dly023
// @match        https://www.wenanwang.com/*/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488723/%E6%96%87%E6%A1%88%E7%BD%91%E6%96%87%E7%AB%A0%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/488723/%E6%96%87%E6%A1%88%E7%BD%91%E6%96%87%E7%AB%A0%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const floatButton = document.createElement('button');
    floatButton.textContent = '抓取内容';
    floatButton.style.position = 'fixed';
    floatButton.style.bottom = '10px';
    floatButton.style.right = '10px';
    floatButton.style.zIndex = '10000';
    floatButton.style.padding = '8px 15px';
    floatButton.style.fontSize = '14px';
    floatButton.style.backgroundColor = '#555555';
    floatButton.style.color = 'white';
    floatButton.style.border = '1px solid #333';
    floatButton.style.borderRadius = '5px';
    floatButton.style.cursor = 'pointer';
    floatButton.style.boxShadow = '2px 2px 3px rgba(0,0,0,0.2)';
    document.body.appendChild(floatButton);

    const data = [];
    let pageIndex = 1;
    const linksSet = new Set();
    const webpageTitle = document.title.replace(/[<>:"/\\|?*]+/g, '-');

    // Remove 'index.html' and any content after that
    let baseURL = window.location.href.split('/').slice(0, -1).join('/') + '/'; // Ensure we have the base directory
    let urlToFetch = baseURL;

    function grabHomePageContent() {
        grabContent(baseURL + 'index.html', true);
    }

    function grabContent(href, isHomePage) {
        if (!isHomePage && linksSet.has(href)) {
            return;
        }
        linksSet.add(href);

        fetch(href)
            .then(response => response.text())
            .then(contentHtml => {
                const contentDoc = new DOMParser().parseFromString(contentHtml, 'text/html');
                const title = contentDoc.querySelector('#ML > div.newsview > h1')?.textContent.trim() || '';
                const contentParagraphs = contentDoc.querySelectorAll('#ML > div.newsview > div.content p');
                let content = '';
                contentParagraphs.forEach(paragraph => {
                    content += paragraph.textContent.trim() + ' ';
                });
                data.push({ title, content });

                if (isHomePage) {
                    grabLinks();
                }
            })
            .catch(console.error);
    }

    function grabLinks() {
        if (pageIndex === 1) {
            urlToFetch = baseURL + 'index.html'; // For the first page
        } else {
            urlToFetch = baseURL + `index_${pageIndex}.html`;
        }

        fetch(urlToFetch)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No more pages to fetch.');
                }
                return response.text();
            })
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('.newslist a');
                links.forEach(link => {
                    grabContent(link.href);
                });
                pageIndex++;
                grabLinks();
            })
            .catch(error => {
                if (error.message !== 'No more pages to fetch.') {
                    console.error('Done with error: ', error);
                }
                downloadCSV();
            });
    }

function downloadCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,Title,Content';

    // 过滤掉空数据
    const nonEmptyData = data.filter(item => item.title || item.content);

    nonEmptyData.forEach((item, index) => {
        // 在每行数据前面添加换行，避免额外换行
        let row = `\n"${item.title.replace(/"/g, '""')}","${item.content.replace(/"/g, '""')}"`;
        csvContent += row;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${webpageTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

    floatButton.addEventListener('click', grabHomePageContent);
})();