// ==UserScript==
// @name        提取 DOM 下的链接并下载为 JSON
// @version     1.1
// @description 爬取某个class被标记fff的 DOM 元素下面的所有链接的内容，并下载为 JSON 文件。
// @namespace    http://your-namespace.com
// @author       cjm
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489139/%E6%8F%90%E5%8F%96%20DOM%20%E4%B8%8B%E7%9A%84%E9%93%BE%E6%8E%A5%E5%B9%B6%E4%B8%8B%E8%BD%BD%E4%B8%BA%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/489139/%E6%8F%90%E5%8F%96%20DOM%20%E4%B8%8B%E7%9A%84%E9%93%BE%E6%8E%A5%E5%B9%B6%E4%B8%8B%E8%BD%BD%E4%B8%BA%20JSON.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to scrape links from selected elements
    function scrapeLinks() {
        // Get the selected elements
        const selectedElements = [...document.querySelectorAll('.fff')];

        // 提取所有链接
        const allLinks = selectedElements
        .flatMap(element => [...element.querySelectorAll('a')])
        .map(link => link.href);

        // 过滤出哈希部分
        const filteredLinks = allLinks.map(link => {
            const hashIndex = link.indexOf('#');
            return hashIndex === -1 ? link : link.substring(0, hashIndex);
        });

        // 去除重复项
        const uniqueLinks = [...new Set(filteredLinks)];

        // 输出结果
        console.log(uniqueLinks);

        // Get the content of each link
        Promise.all(uniqueLinks.map(getLinkContent))
            .then(contentArray => {
            const parsedContentArray = contentArray.map(({link,content})=>{
                const html = content;
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                let originText = doc.body.textContent;

                originText = originText.replace(/^\s+$/gm, '\n')

                // 替换多个连续的换行符为一个换行符
                originText = originText.replace(/\n+/g, '\n');

                // 替换多个连续的制表符为一个制表符
                originText = originText.replace(/\t+/g, '\t');

                return {link,text:originText}
            });

            // Combine the content into a JSON object
            const jsonContent = {
                links: parsedContentArray
            };

            console.log(jsonContent);

            // Convert the JSON object to a string
            const jsonString = JSON.stringify(jsonContent, null, '\t');


            // Download the JSON file
            downloadFile(jsonString, window.location.host+ '.json');
        });
    }

    // Function to get the content of a link using GM_xmlhttpRequest
    function getLinkContent(link) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: link,
                onload: (response) => {
                    if (response.status === 200) {
                        const content = response.responseText;
                        resolve({ link, content });
                    } else {
                        resolve({ link, content: null });
                    }
                }
            });
        });
    }


    // Add a custom menu command to start link scraping
    GM_registerMenuCommand('要爬的元素加入class为fff后,点击开始爬取链接', scrapeLinks);


    // Function to download a file
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
})();