// ==UserScript==
// @name         NeoDB 安娜档案搜索
// @name:en      annas archive for NeoDB
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  在 NeoDB 书籍页面添加安娜档案搜索结果
// @description:en  dispaly annas archive search result on NeoDB
// @author       lozhang
// @match        https://neodb.social/book/*
// @grant        GM_xmlhttpRequest
// @connect      zh.annas-archive.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529955/NeoDB%20%E5%AE%89%E5%A8%9C%E6%A1%A3%E6%A1%88%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/529955/NeoDB%20%E5%AE%89%E5%A8%9C%E6%A1%A3%E6%A1%88%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 主函数
    function main() {

        // 检查是否在书籍页面
        if (!window.location.href.match(/https:\/\/neodb\.social\/book\/[a-zA-Z0-9]+/)) {
            console.log('检查是否在书籍页面');
            return;
        }

        // 获取书籍标题
        const bookTitle = getBookTitle();
        if (!bookTitle) {
            console.error('无法获取书籍标题');
            return;
        }

        //console.log('title', bookTitle);

        // 搜索安娜档案
        searchAnnasArchive(bookTitle);
    }

    // 获取书籍标题
    function getBookTitle() {
        // 尝试从页面标题中获取
        const titleElement = document.querySelector('h1.item-title');
        if (titleElement) {
            return titleElement.textContent.trim();
        }

        // 备选方案：从 meta 标签获取
        const metaTitle = document.querySelector('meta[property="og:title"]');
        if (metaTitle) {
            let title = metaTitle.getAttribute('content');
            // 移除可能的前缀，如 "图书 - "
            title = title.replace(/^图书\s*-\s*/, '');
            return title.trim();
        }

        return null;
    }

    // 在安娜档案搜索
    function searchAnnasArchive(bookTitle) {
        const searchUrl = `https://zh.annas-archive.org/search?q=${encodeURIComponent(bookTitle)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: searchUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // 提取搜索结果
                    const results = extractSearchResults(doc);
                    console.log("results", results, doc);

                    // 在页面上显示结果
                    displayResults(results, searchUrl);
                } else {
                    console.error('安娜档案搜索失败:', response.statusText);
                }
            },
            onerror: function(error) {
                console.error('请求安娜档案时出错:', error);
            }
        });
    }

    // 从安娜档案页面提取搜索结果
    function extractSearchResults(doc) {
        const results = [];
        const resultElements = doc.querySelector('#aarecord-list').querySelectorAll('div');

        resultElements.forEach(element => {
            const titleElement = element.querySelector('h3');
            if (!titleElement) return;

            const linkElement = element.querySelector('a[href^="/md5/"]');
            if (!linkElement) return;

            const formatElement = element.querySelector('.text-xs');
            const authorElement = element.querySelector('.italic');

            const result = {
                title: titleElement.textContent.trim(),
                link: 'https://zh.annas-archive.org' + linkElement.getAttribute('href'),
                format: formatElement ? formatElement.textContent.trim() : '未知格式',
                author: authorElement ? authorElement.textContent.trim() : '未知作者'
            };

            results.push(result);
        });

        return results;
    }

    // 在页面上显示结果
    function displayResults(results, searchUrl) {
        // 创建结果容器
        const container = document.createElement('div');
        container.className = 'annas-archive-results';
        container.style.margin = '20px 0';
        container.style.padding = '15px';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '5px';
        container.style.backgroundColor = '#f9f9f9';

        // 添加标题
        const title = document.createElement('h3');
        title.textContent = '安娜档案搜索结果';
        title.style.marginBottom = '15px';
        container.appendChild(title);

        // 添加搜索链接
        const searchLink = document.createElement('a');
        searchLink.href = searchUrl;
        searchLink.textContent = '在安娜档案中查看完整搜索结果';
        searchLink.target = '_blank';
        searchLink.style.display = 'inline-block';
        searchLink.style.marginBottom = '15px';
        container.appendChild(searchLink);

        // 如果没有结果
        if (results.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = '未找到相关结果';
            container.appendChild(noResults);
        } else {
            // 创建结果列表
            const resultsList = document.createElement('ul');
            resultsList.style.listStyleType = 'none';
            resultsList.style.padding = '0';

            results.forEach(result => {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = '10px';
                listItem.style.padding = '10px';
                listItem.style.border = '1px solid #eee';
                listItem.style.borderRadius = '3px';

                const resultTitle = document.createElement('a');
                resultTitle.href = result.link;
                resultTitle.textContent = result.title;
                resultTitle.target = '_blank';
                resultTitle.style.fontWeight = 'bold';
                resultTitle.style.display = 'block';
                listItem.appendChild(resultTitle);

                const resultDetails = document.createElement('div');
                resultDetails.style.fontSize = '0.9em';
                resultDetails.style.color = '#666';
                resultDetails.textContent = `${result.author} | ${result.format}`;
                listItem.appendChild(resultDetails);

                resultsList.appendChild(listItem);
            });

            container.appendChild(resultsList);
        }

        // 将结果添加到页面
        const contentContainer = document.querySelector('#item-primary-action') || document.querySelector('main');
        if (contentContainer) {
            contentContainer.appendChild(container);
        } else {
            // 如果找不到合适的容器，添加到 body
            document.body.appendChild(container);
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', main);
})();