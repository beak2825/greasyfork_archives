// ==UserScript==
// @name         哔咔download
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  提取 __NUXT_DATA__ 中的直链下载链接，清空页面内容并美观地显示出来，链接边框固定宽度，增加重试机制避免失效。
// @author       ghost331188
// @match        https://game.storyend.net/*
// @match        https://www.vikacg.xyz/external/*
// @license      GNU General Public License v3.0
// @grant        none

// @run-at       document-end  // 等到页面资源完全加载后再执行脚本
// @downloadURL https://update.greasyfork.org/scripts/511421/%E5%93%94%E5%92%94download.user.js
// @updateURL https://update.greasyfork.org/scripts/511421/%E5%93%94%E5%92%94download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找并解析 __NUXT_DATA__ 的函数
    function findAndParseNuxtData(retryCount = 10) {
        const nuxtDataScript = document.querySelector('script#__NUXT_DATA__');
        if (nuxtDataScript) {
            console.log('找到 __NUXT_DATA__ 标签');

            try {
                const nuxtData = JSON.parse(nuxtDataScript.textContent);
                console.log('成功解析 __NUXT_DATA__:', nuxtData);
                return nuxtData;
            } catch (error) {
                console.error('解析 __NUXT_DATA__ 数据时发生错误:', error);
                return null;
            }
        } else {
            console.log('未找到 __NUXT_DATA__ 脚本标签');
            // 如果还没有找到 __NUXT_DATA__，进行重试
            if (retryCount > 0) {
                console.log(`重试剩余次数: ${retryCount}`);
                setTimeout(() => findAndParseNuxtData(retryCount - 1), 1000);  // 每秒重试一次
            }
            return null;
        }
    }

    window.onload = function() {
        console.log('页面完全加载，脚本开始执行');

        // 解析 __NUXT_DATA__ 并提取链接
        const nuxtData = findAndParseNuxtData();

        if (!nuxtData) return;

        const extractLinks = (obj) => {
            let links = [];
            const regex = /https?:\/\/[^\s"]+\.(zip|7z|rar|apk)/g;

            const searchLinks = (data) => {
                if (typeof data === 'string') {
                    const matchedLinks = data.match(regex);
                    if (matchedLinks) {
                        links.push(...matchedLinks);
                    }
                } else if (typeof data === 'object' && data !== null) {
                    Object.values(data).forEach(value => searchLinks(value));
                }
            };

            searchLinks(obj);
            return links;
        };

        const possibleLinks = extractLinks(nuxtData);
        console.log('找到的直链:', possibleLinks);

        // 清空页面的所有内容
        document.body.innerHTML = '';

        // 设置页面的基础样式
        document.body.style.backgroundColor = '#f4f4f4';
        document.body.style.display = 'flex';
        document.body.style.flexDirection = 'column';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';
        document.body.style.fontFamily = 'Arial, sans-serif';
        document.body.style.padding = '20px';

        // 动态获取并设置页面标题
        const pageTitle = document.title || '下载链接';

        // 创建标题
        const title = document.createElement('h1');
        title.innerText = pageTitle;  // 使用网页的标题
        title.style.color = '#333';
        title.style.marginBottom = '20px';
        title.style.fontSize = '24px';
        title.style.textAlign = 'center';
        document.body.appendChild(title);

        // 检查是否找到了下载链接
        if (possibleLinks.length > 0) {
            possibleLinks.forEach(link => {
                const linkElement = document.createElement('a');
                linkElement.href = link;
                linkElement.innerText = link;
                linkElement.style.display = 'block';
                linkElement.style.margin = '10px 0';
                linkElement.style.padding = '10px 0'; // 内边距高度一致
                linkElement.style.width = '80%'; // 链接容器宽度设为 80%
                linkElement.style.maxWidth = '500px'; // 最大宽度500px，防止太宽
                linkElement.style.wordWrap = 'break-word';
                linkElement.style.color = '#007bff';
                linkElement.style.backgroundColor = '#ffffff';
                linkElement.style.borderRadius = '5px';
                linkElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                linkElement.style.textAlign = 'center'; // 文字居中
                linkElement.style.textDecoration = 'none';
                linkElement.style.transition = 'background-color 0.3s ease';

                // 添加 hover 效果
                linkElement.addEventListener('mouseover', () => {
                    linkElement.style.backgroundColor = '#e9f5ff';
                });
                linkElement.addEventListener('mouseout', () => {
                    linkElement.style.backgroundColor = '#ffffff';
                });

                document.body.appendChild(linkElement);
            });
        } else {
            const noLinksMessage = document.createElement('p');
            noLinksMessage.innerText = '未找到任何下载链接。';
            noLinksMessage.style.color = '#666';
            noLinksMessage.style.fontSize = '16px';
            noLinksMessage.style.textAlign = 'center';
            document.body.appendChild(noLinksMessage);
        }

        console.log('页面已更新为下载链接');
    };

})();
