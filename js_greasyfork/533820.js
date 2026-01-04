// ==UserScript==
// @name         Bangumi ns fw条目标记
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 Bangumi 上标记ns fw
// @author       age
// @match        *://bgm.tv/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533820/Bangumi%20ns%20fw%E6%9D%A1%E7%9B%AE%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/533820/Bangumi%20ns%20fw%E6%9D%A1%E7%9B%AE%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的所有条目
    const items = document.querySelectorAll('li.item');

    items.forEach(item => {
        // 使用更精确的选择器获取条目标题的链接
        const linkElement = item.querySelector('a.l[href^="/subject/"]');
        if (!linkElement) return;

        const subjectLink = linkElement.getAttribute('href');
        const subjectId = subjectLink.match(/\/subject\/(\d+)/);

        if (subjectId) {
            const subjectUrl = `https://api.bgm.tv/v0/subjects/${subjectId[1]}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: subjectUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        // 判断是否为 "Not Found"
                        if (data.title === 'Not Found') {
                            linkElement.innerHTML += ' →NSFW';
                        } else {
                            linkElement.innerHTML += ' √';
                        }
                    } catch (error) {
                        console.error('JSON解析失败:', error);
                    }
                },
                onerror: function() {
                    console.error(`无法访问 ${subjectUrl}`);
                }
            });
        }
    });
})();
