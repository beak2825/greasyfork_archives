// ==UserScript==
// @name         【自用备份，提取处理后加入屏蔽黑名单】尚香书院 绿文标题提取器
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  从 sxsy19.com 的 NTR 和绿帽板块提取绿文标题，支持页数范围选择、自动保存和窗口自由缩放
// @author       南竹 & Grok
// @match        https://sxsy19.com/forum.php?mod=forumdisplay&fid=7&filter=typeid&typeid=1*
// @match        https://sxsy19.com/forum.php?mod=forumdisplay&fid=7&filter=typeid&typeid=4*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/533016/%E3%80%90%E8%87%AA%E7%94%A8%E5%A4%87%E4%BB%BD%EF%BC%8C%E6%8F%90%E5%8F%96%E5%A4%84%E7%90%86%E5%90%8E%E5%8A%A0%E5%85%A5%E5%B1%8F%E8%94%BD%E9%BB%91%E5%90%8D%E5%8D%95%E3%80%91%E5%B0%9A%E9%A6%99%E4%B9%A6%E9%99%A2%20%E7%BB%BF%E6%96%87%E6%A0%87%E9%A2%98%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533016/%E3%80%90%E8%87%AA%E7%94%A8%E5%A4%87%E4%BB%BD%EF%BC%8C%E6%8F%90%E5%8F%96%E5%A4%84%E7%90%86%E5%90%8E%E5%8A%A0%E5%85%A5%E5%B1%8F%E8%94%BD%E9%BB%91%E5%90%8D%E5%8D%95%E3%80%91%E5%B0%9A%E9%A6%99%E4%B9%A6%E9%99%A2%20%E7%BB%BF%E6%96%87%E6%A0%87%E9%A2%98%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取标题函数
    function extractTitle(text) {
        const bookMatch = text.match(/《(.+?)》/);
        if (bookMatch && bookMatch[1] && bookMatch[1].length > 2) {
            return bookMatch[1];
        }
        return text.trim().substring(0, 20);
    }

    // 获取当前页标题
    function getTitlesFromPage(doc) {
        const titleElements = doc.querySelectorAll('a.s.xst');
        let titles = [];
        titleElements.forEach(element => {
            const rawTitle = element.textContent.trim();
            const extractedTitle = extractTitle(rawTitle);
            if (extractedTitle) {
                titles.push(extractedTitle);
            }
        });
        return [...new Set(titles)]; // 去重
    }

    // 保存标题到文件
    function saveTitlesToFile(titles, typeid, pageInfo) {
        const now = new Date();
        const timestamp = now.getFullYear().toString() +
                         String(now.getMonth() + 1).padStart(2, '0') +
                         String(now.getDate()).padStart(2, '0') + '_' +
                         String(now.getHours()).padStart(2, '0') +
                         String(now.getMinutes()).padStart(2, '0') +
                         String(now.getSeconds()).padStart(2, '0');
        const filename = `绿文标题提取_${timestamp}_typeid${typeid}_${pageInfo}.txt`;
        const content = titles.join('\n');
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

    // 显示标题窗口
    function showTitles(titles, status) {
        let outputDiv = document.getElementById('title-extractor-output');
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.id = 'title-extractor-output';
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
                <div id="minimized-box" style="text-align: center; line-height: 38px; cursor: pointer;">提取书名中</div>
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
                <pre>${titles.join('\n')}</pre>
            `;
        }

        // 绑定事件
        const minimizeButton = document.getElementById('minimize');
        if (minimizeButton) {
            minimizeButton.onclick = () => {
                windowState.minimized = true;
                showTitles(titles, status);
            };
        }
        const minimizedBox = document.getElementById('minimized-box');
        if (minimizedBox) {
            minimizedBox.onclick = () => {
                windowState.minimized = false;
                showTitles(titles, status);
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
        const urlParams = new URLSearchParams(window.location.search);
        const typeid = urlParams.get('typeid') || 'unknown';
        const baseUrl = `https://sxsy19.com/forum.php?mod=forumdisplay&fid=7&filter=typeid&typeid=${typeid}&page=`;
        let allTitles = [];

        for (let page = startPage; page <= endPage; page++) {
            const url = baseUrl + page;
            try {
                const response = await fetchPage(url);
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');
                const pageTitles = getTitlesFromPage(doc);
                allTitles = allTitles.concat(pageTitles);
                allTitles = [...new Set(allTitles)]; // 去重
                showTitles(allTitles, `提取中... (page ${page}/${endPage})`);
            } catch (error) {
                console.error(`提取第 ${page} 页失败:`, error);
            }
        }

        // 提取完成
        saveTitlesToFile(allTitles, typeid, `pages${startPage}-${endPage}`);
        showTitles(allTitles, `提取完成 (页 ${startPage}-${endPage})`);
    }

    // 启动脚本
    const maxPage = getMaxPage(document);
    showPageSelector(maxPage, extractMultiPages);
})();