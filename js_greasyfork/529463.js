// ==UserScript==
// @name         CustomJAvdb
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自定义JAvdb网站的内容
// @author       你自己
// @match        https://javdb.com/*
// @grant        none
// @run-at       document-end
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/529463/CustomJAvdb.user.js
// @updateURL https://update.greasyfork.org/scripts/529463/CustomJAvdb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceHomePage() {
        const newHtml = `
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Search Page</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                }
                .search-container {
                    display: flex;
                    gap: 10px;
                }
                input[type="text"] {
                    padding: 8px;
                    font-size: 16px;
                    width: 300px;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                }
                button {
                    padding: 8px 16px;
                    font-size: 16px;
                    cursor: pointer;
                    background-color: deepskyblue;
                    border: 1px solid deepskyblue;
                    color: white;
                    border-radius: 10px;
                }
            </style>
        </head>
        <body>
            <div class="search-container">
                <input type="text" id="search-box" placeholder="Search...车牌" onkeypress="handleKeyPress(event)">
                <button onclick="search()">Search</button>
            </div>

            <script>
                function search() {
                    const query = document.getElementById('search-box').value;
                    if (query) {
                        const url = \`\${window.location.origin}\${window.location.pathname}search?q=\${encodeURIComponent(query)}&f=all\`;
                        window.open(url, '_blank');
                    }
                }

                function handleKeyPress(event) {
                    if (event.key === 'Enter') {
                        search();
                    }
                }
            </script>
        </body>
        </html>
        `;

        // 直接替换当前页面的HTML
        document.open();
        document.write(newHtml);
        document.close();
    }

    function customizeVideoPage() {
        const deleteElementXPaths = [
            '//*[@id="search-bar-container"]',
            '/html/body/nav[2]',
            '//*[@id="magnets"]/article/div/div[1]',
            '/html/body/section/div/div[3]/div[2]',
            '/html/body/section/div/div[3]/div[3]',
            '/html/body/section/div/div[3]/div[3]',
            '/html/body/nav[1]',
        ];

        deleteElementXPaths.forEach(function(xpath) {
            const tmpElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (tmpElement) {
                tmpElement.parentNode.removeChild(tmpElement);
            }
        });

        // 修改页面标题
        const title = document.querySelector('title');
        if (title) {
            title.innerHTML = 'CustomSearch';
        }

        // 删除页面图标
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.parentNode.removeChild(favicon);
        }
    }

    function customizeSearchPage() {

        //删除一些无用的element
        const deleteElementXPaths = [
            '/html/body/nav[1]',
            '//*[@id="search-bar-container"]',
            '/html/body/nav[1]',
            '/html/body/section/div/div[3]',
            '/html/body/nav[1]',
            '//*[@id="footer"]',
        ];

        deleteElementXPaths.forEach(function(xpath) {
            const tmpElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (tmpElement) {
                tmpElement.parentNode.removeChild(tmpElement);
            }
        });

        // 修改页面标题
        const title = document.querySelector('title');
        if (title) {
            title.innerHTML = 'CustomSearch';
        }

        // 删除页面图标
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.parentNode.removeChild(favicon);
        }

        // 设置电影列表样式
        //movie list xpath=/html/body/section/div/div[6]
        //const movieList=document.evaluate('/html/body/section/div/div[6]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const movieList = document.querySelector('.movie-list');
        if (movieList) {
            movieList.style.display = 'block';
            movieList.style.columnGap = '0';
            movieList.style.rowGap = '1rem';
            movieList.style.paddingBottom = '.5rem';

            const items = movieList.querySelectorAll('.item');
            items.forEach(item => {
                const a = item.querySelector('a');
                //找到a元素下class为videotitle的div标签

                var videi_titleElement=a.querySelector('.video-title')

                //idElement是videi_titleElement下的strong标签
                var idElement=videi_titleElement.querySelector('strong')

                var videoTitle=videi_titleElement.textContent;
                var videoId=idElement.textContent;
                a.setAttribute('target', '_blank');
                const itemName = `${videoTitle}`;
                while (a.firstChild) {
                    a.removeChild(a.firstChild);
                }
                a.appendChild(document.createTextNode(itemName));
                item.style.width = '100%';
                item.style.height = 'auto';
                item.style.padding = '1rem';
                item.style.border = '1px solid #ccc';
                item.style.borderRadius = '.5rem';
                item.style.display = 'flex';
                item.style.flexDirection = 'column';
            });
        } else {
            console.warn('未找到 movie-list 容器');
        }
    }

    const currentUrl = window.location.pathname;

    switch (true) {
        case currentUrl === '/':
            replaceHomePage();
            break;
        case currentUrl.startsWith('/v/'):
            customizeVideoPage();
            break;
        case currentUrl.startsWith('/search'):
            customizeSearchPage();
            break;
        default:
            break;
    }
})();