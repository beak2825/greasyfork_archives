// ==UserScript==
// @name         PterClub - IMDB Release info
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 PTerClub 页面自动提取 IMDb 的Release date和前面几个 AKA 别名列表
// @author       zuoans
// @match        https://pterclub.com/details.php?id=*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539013/PterClub%20-%20IMDB%20Release%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/539013/PterClub%20-%20IMDB%20Release%20info.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Step 1: 提取 IMDb ID
    function extractIMDbID() {
        const links = Array.from(document.querySelectorAll('a')).find(a =>
            a.href && a.href.startsWith('https://www.imdb.com/title/tt')
        );

        if (!links) return null;

        const match = links.href.match(/title\/(tt\d+)/);
        if (match && match[1]) {
            return match[1]; // 返回 ttID
        }

        return null;
    }

    // Step 2: 请求对应的 IMDb 页面并提取 AKA 数据
    function fetchAndExtractAllAKATitles(imdbId, callback) {
        const url = `https://www.imdb.com/title/${imdbId}/releaseinfo/?ref_=tt_dt_aka#akas`;

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: function (response) {
                if (response.status !== 200) {
                    console.error("请求失败:", response.status);
                    callback([]);
                    return;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                // Step 3: 提取所有 AKA 条目（基于 DOM 结构）
                const items = doc.querySelectorAll('.ipc-metadata-list__item');
                const akaList = [];

                items.forEach(item => {
                    const label = item.querySelector('.ipc-metadata-list-item__label');
                    const contentItem = item.querySelector('.ipc-metadata-list-item__list-content-item');

                    if (label && contentItem) {
                        const country = label.textContent.trim();
                        const title = contentItem.textContent.trim();

                        if (country && title) {
                            akaList.push({ country, title });
                        }
                    }
                });

                callback(akaList);
            },
            onerror: function (err) {
                console.error("请求 IMDb 页面失败:", err);
                callback([]);
            }
        });
    }

    // Step 4: 展示结果到浮动框（CheckBox）
    function displayAKATitles(akaList) {
        const container = document.createElement('div');
        container.id = 'CheckBox';
        container.style.maxHeight = '80vh';
        container.style.overflowY = 'auto';
        container.style.position = 'fixed';
        container.style.left = '1%';
        container.style.bottom = '70%';
        container.style.zIndex = '90';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.fontFamily = 'Arial, sans-serif';

        container.innerHTML = '<strong>🎬 IMDb 完整别名 (AKA)</strong><ul style="margin-top: 5px; padding-left: 20px;"></ul>';
        const ul = container.querySelector('ul');

        if (akaList.length === 0) {
            ul.innerHTML = '<li>未找到任何 AKA 数据</li>';
        } else {
            akaList.forEach(entry => {
                ul.innerHTML += `<li>• ${entry.country}: <strong>${entry.title}</strong></li>`;
            });
        }

        document.body.appendChild(container);
    }

    // 主函数执行
    (function main() {
        const imdbId = extractIMDbID();
        if (!imdbId) {
            console.warn("未找到 IMDb ID");
            return;
        }

        console.log("正在提取 AKA 名称：", imdbId);
        fetchAndExtractAllAKATitles(imdbId, akaList => {
            console.log("提取到的 AKA 名称数量：", akaList.length);
            displayAKATitles(akaList);
        });
    })();
})();