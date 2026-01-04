// ==UserScript==
// @name         123vr资源下载插件
// @namespace    http://tampermonkey.net/
// @version      0.65
// @description  获取123av.com网站的vr资源种子下载链接，交流群 https://t.me/aivrchat
// @author       nians
// @match        https://123av.com/zh/dm2/vr*
// @grant        GM_xmlhttpRequest
// @license
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531999/123vr%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/531999/123vr%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮样式
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-btn {
                position: absolute;
                top: 5px;
                left: 5px;
                width: 30px;
                height: 30px;
                border: none;
                background: transparent;
                cursor: pointer;
                padding: 0;
                z-index: 1000;
            }
            .search-btn img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .thumb {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }

    // 宽松匹配函数
    function isLooseMatch(title, videoText) {
        // 将title转换为小写并移除常见的分隔符
        const cleanTitle = title.toLowerCase().replace(/[-_]/g, '');
        const cleanVideoText = videoText.toLowerCase().replace(/[-_]/g, '');

        // 将title拆分为字符数组
        const titleChars = cleanTitle.split('');

        // 检查videoText中是否包含title的大部分字符
        let matchCount = 0;
        for (const char of titleChars) {
            if (cleanVideoText.includes(char)) {
                matchCount++;
            }
        }

        // 如果匹配的字符数达到title长度的70%以上，认为是匹配
        return matchCount >= titleChars.length * 0.7;
    }

    // 抓取和处理搜索结果
    function fetchTorrentLink(title, callback) {
        const searchUrl = `https://en.btdig.com/search?order=0&q=${encodeURIComponent(title)}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const results = doc.querySelectorAll('.one_result');

                let magnetLink = null;

                for (const result of results) {
                    const videoDiv = result.querySelector('.fa-file-video-o');
                    if (videoDiv) {
                        const videoText = videoDiv.textContent;
                        // 使用宽松匹配
                        if (isLooseMatch(title, videoText)) {
                            const magnetDiv = result.querySelector('.fa-magnet');
                            if (magnetDiv) {
                                const link = magnetDiv.querySelector('a');
                                if (link) {
                                    magnetLink = link.getAttribute('href');
                                    break;
                                }
                            }
                        }
                    }
                }

                callback(magnetLink || searchUrl);
            },
            onerror: function() {
                callback(searchUrl);
            }
        });
    }

    // 添加搜索按钮的函数
    function addSearchButtons() {
        const container = document.querySelector('div.row.box-item-list.gutter-20');
        if (!container) return;

        const items = container.querySelectorAll('div.col-6.col-sm-4.col-lg-3');

        items.forEach(item => {
            if (item.querySelector('.search-btn')) return;

            const button = document.createElement('button');
            button.className = 'search-btn';

            const img = document.createElement('img');
            img.src = 'https://i.ibb.co/1GRGHvkR/rtdxx.png';
            button.appendChild(img);

            const link = item.querySelector('a');
            const title = link ? link.getAttribute('title') : '';

            button.addEventListener('click', function(e) {
                e.preventDefault();
                if (title) {
                    fetchTorrentLink(title, function(url) {
                        window.open(url, '_blank');
                    });
                }
            });

            const thumb = item.querySelector('.thumb');
            if (thumb) {
                thumb.appendChild(button);
            }
        });
    }

    // 初始化
    function init() {
        createStyles();
        addSearchButtons();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                addSearchButtons();
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener('load', addSearchButtons);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();