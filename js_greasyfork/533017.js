// ==UserScript==
// @name         【自用备份】尚香书苑-收藏列表提取器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从 sxsy19.com 的收藏列表提取帖子标题，支持页数范围选择、自动保存和窗口自由缩放
// @author       南竹 & Grok
// @match        https://sxsy19.com/home.php?mod=space&uid=159421&do=favorite&type=all&page=*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533017/%E3%80%90%E8%87%AA%E7%94%A8%E5%A4%87%E4%BB%BD%E3%80%91%E5%B0%9A%E9%A6%99%E4%B9%A6%E8%8B%91-%E6%94%B6%E8%97%8F%E5%88%97%E8%A1%A8%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533017/%E3%80%90%E8%87%AA%E7%94%A8%E5%A4%87%E4%BB%BD%E3%80%91%E5%B0%9A%E9%A6%99%E4%B9%A6%E8%8B%91-%E6%94%B6%E8%97%8F%E5%88%97%E8%A1%A8%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取标题函数
    function extractTitle(text) {
        const trimmed = text.trim();
        return trimmed.length > 0 ? trimmed : '无标题';
    }

    // 获取当前页收藏标题
    function getFavoritesFromPage(doc) {
        const favoriteElements = doc.querySelectorAll('#favorite_ul li a[href*="forum.php?mod=viewthread"]');
        let favorites = [];
        favoriteElements.forEach(element => {
            const rawTitle = element.textContent.trim();
            const extractedTitle = extractTitle(rawTitle);
            if (extractedTitle) {
                favorites.push(extractedTitle);
            }
        });
        return [...new Set(favorites)]; // 去重
    }

    // 保存收藏到文件
    function saveFavoritesToFile(favorites, pageInfo) {
        const now = new Date();
        const timestamp = now.getFullYear().toString() +
                         String(now.getMonth() + 1).padStart(2, '0') +
                         String(now.getDate()).padStart(2, '0') + '_' +
                         String(now.getHours()).padStart(2, '0') +
                         String(now.getMinutes()).padStart(2, '0') +
                         String(now.getSeconds()).padStart(2, '0');
        const filename = `收藏列表提取_${timestamp}_${pageInfo}.txt`;
        const content = favorites.join('\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // 获取最大页数
    function getMaxPage(doc) {
        const pageLinks = doc.querySelectorAll('a[href*="page="]');
        let maxPage = 1;
        pageLinks.forEach(link => {
            const match = link.href.match(/page=(\d+)/);
            if (match && parseInt(match[1]) > maxPage) {
                maxPage = parseInt(match[1]);
            }
        });
        return maxPage;
    }

    // 使用 fetch 请求页面
    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    resolve(response.responseText);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 窗口状态管理
    let windowState = { minimized: false };
    let windowWidth = 300; // 默认宽度
    let windowHeight = 400; // 默认高度

    // 显示收藏窗口
    function showFavorites(favorites, status) {
        let outputDiv = document.getElementById('favorite-extractor-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.id = 'favorite-extractor-output';
            outputDiv.style.position = 'fixed';
            outputDiv.style.top = '10px';
            outputDiv.style.left = '10px';
            outputDiv.style.background = '#fff';
            outputDiv.style.padding = '10px';
            outputDiv.style.border = '1px solid #000';
            outputDiv.style.zIndex = '9999';
            outputDiv.style.width = `${windowWidth}px`;
            outputDiv.style.height = `${windowHeight}px`;
            outputDiv.style.resize = 'both'; // 启用自由缩放
            outputDiv.style.overflow = 'auto';
            document.body.appendChild(outputDiv);

            // 添加缩放监听器
            outputDiv.addEventListener('resize', () => {
                windowWidth = outputDiv.offsetWidth;
                windowHeight = outputDiv.offsetHeight;
            });
        }

        if (windowState.minimized) {
            outputDiv.style.width = '75px'; // 2cm ≈ 75px
            outputDiv.style.height = '38px'; // 1cm ≈ 38px
            outputDiv.style.overflow = 'hidden';
            outputDiv.style.resize = 'none'; // 最小化时禁用缩放
            outputDiv.innerHTML = `
                <div id="minimized-box" style="text-align: center; line-height: 38px; cursor: pointer;">提取收藏中</div>
            `;
        } else {
            outputDiv.style.width = `${windowWidth}px`;
            outputDiv.style.height = `${windowHeight}px`;
            outputDiv.style.resize = 'both'; // 恢复缩放
            outputDiv.style.overflow = 'auto';
            outputDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between;">
                    <h3>${status}</h3>
                    <button id="minimize">最小化</button>
                </div>
                <pre>${favorites.join('\n')}</pre>
            `;
        }

        // 绑定事件
        const minimizeButton = document.getElementById('minimize');
        if (minimizeButton) {
            minimizeButton.onclick = () => {
                windowState.minimized = true;
                showFavorites(favorites, status);
            };
        }
        const minimizedBox = document.getElementById('minimized-box');
        if (minimizedBox) {
            minimizedBox.onclick = () => {
                windowState.minimized = false;
                showFavorites(favorites, status);
            };
        }
    }

    // 显示页数选择界面
    function showPageSelector(maxPage, callback) {
        const selectorDiv = document.createElement('div');
        selectorDiv.style.position = 'fixed';
        selectorDiv.style.top = '50%';
        selectorDiv.style.left = '50%';
        selectorDiv.style.transform = 'translate(-50%, -50%)';
        selectorDiv.style.background = '#fff';
        selectorDiv.style.padding = '20px';
        selectorDiv.style.border = '1px solid #000';
        selectorDiv.style.zIndex = '10000';
        selectorDiv.innerHTML = `
            <h3>选择提取页数范围</h3>
            <p>最大页数: ${maxPage}</p>
            <label>起始页: <input type="number" id="start-page" min="1" max="${maxPage}" value="1"></label><br>
            <label>结束页: <input type="number" id="end-page" min="1" max="${maxPage}" value="${maxPage}"></label><br>
            <button id="start-extract">开始提取</button>
        `;
        document.body.appendChild(selectorDiv);

        document.getElementById('start-extract').onclick = () => {
            const startPage = parseInt(document.getElementById('start-page').value);
            const endPage = parseInt(document.getElementById('end-page').value);
            if (startPage > endPage || startPage < 1 || endPage > maxPage) {
                alert('页数范围无效，请重新输入！');
                return;
            }
            document.body.removeChild(selectorDiv);
            callback(startPage, endPage);
        };
    }

    // 多页提取主逻辑
    async function extractMultiPages(startPage, endPage) {
        const baseUrl = `https://sxsy19.com/home.php?mod=space&uid=159421&do=favorite&type=all&page=`;
        let allFavorites = [];

        for (let page = startPage; page <= endPage; page++) {
            const url = baseUrl + page;
            try {
                const response = await fetchPage(url);
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');
                const pageFavorites = getFavoritesFromPage(doc);
                allFavorites = allFavorites.concat(pageFavorites);
                allFavorites = [...new Set(allFavorites)]; // 去重
                showFavorites(allFavorites, `提取中... (page ${page}/${endPage})`);
            } catch (error) {
                console.error(`提取第 ${page} 页失败:`, error);
            }
        }

        // 提取完成
        saveFavoritesToFile(allFavorites, `pages${startPage}-${endPage}`);
        showFavorites(allFavorites, `提取完成 (页 ${startPage}-${endPage})`);
    }

    // 启动脚本
    const maxPage = getMaxPage(document);
    showPageSelector(maxPage, extractMultiPages);
})();