// ==UserScript==
// @name         PT站点加载更多种子
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在PT站点添加加载更多功能和删除行功能，适用于多个相似结构的PT站点
// @author       Andiedie
// @match        https://pt.agsvpt.cn/torrents.php*
// @match        https://piggo.me/special.php*
// @match        https://piggo.me/search.php*
// @match        https://piggo.me/torrents.php*
// @match        https://ourbits.club/torrents.php*
// @match        https://www.qingwapt.com/torrents.php*
// @match        https://www.agsvpt.com/torrents.php*
// @match        https://audiences.me/torrents.php*
// @match        https://www.ptzone.xyz/torrents.php*
// @match        https://rousi.zip/torrents.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537813/PT%E7%AB%99%E7%82%B9%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/537813/PT%E7%AB%99%E7%82%B9%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 记录已加载的页面和最大已加载页码
    let loadedPages = new Set();
    let maxLoadedPageDisplay = 1; // 从1开始计数的显示页码

    // 主函数
    function init() {
        // 寻找分页元素（使用新函数）
        const paginationElements = findPaginationElements();

        if (paginationElements.length === 0) {
            console.log('未找到分页元素');
            return;
        }

        // 从URL获取当前页码
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('page') || 0);

        // 将当前页面标记为已加载
        loadedPages.add(currentPage);
        maxLoadedPageDisplay = currentPage + 1; // 当前页码(从0开始) + 1 = 显示页码(从1开始)

        // 找到最后一页的页码
        const lastPageNumber = findLastPageNumber(paginationElements[0]);

        // 检查是否在第一页
        if (currentPage === 0) {
            // 添加输入框和按钮到分页元素
            addLoadMoreInterface(paginationElements, lastPageNumber);
        }

        // 添加统计信息到分页元素
        updateStatistics(paginationElements);

        // 为现有的种子行添加删除按钮
        addDeleteButtonsToExistingRows();
    }

    // 函数：查找分页元素
    function findPaginationElements() {
        let elements = [];

        // 策略1: 使用原有的类名选择器(保持向后兼容)
        const nexusPagination = document.querySelectorAll('.nexus-pagination');
        if (nexusPagination.length > 0) {
            return Array.from(nexusPagination);
        }

        // 策略2: 查找包含"上一页"和"下一页"文本的p元素
        const allParagraphs = document.querySelectorAll('p');
        for (const p of allParagraphs) {
            const text = p.textContent.toLowerCase();
            if ((text.includes('上一页') || text.includes('previous')) &&
                (text.includes('下一页') || text.includes('next'))) {
                elements.push(p);
                continue;
            }

            // 策略3: 查找包含页码范围格式的p元素
            if (p.textContent.match(/\d+\s*-\s*\d+/)) {
                // 确认这个元素包含多个页面链接
                const links = p.querySelectorAll('a');
                if (links.length >= 3 && links[0].href.includes('page=')) {
                    elements.push(p);
                    continue;
                }
            }

            // 策略4: 查找带有align="center"属性且包含页面链接的p元素
            if (p.getAttribute('align') === 'center') {
                const links = p.querySelectorAll('a');
                if (links.length >= 3) {
                    let isPageLinks = false;
                    for (const link of links) {
                        if (link.href.includes('page=')) {
                            isPageLinks = true;
                            break;
                        }
                    }
                    if (isPageLinks) {
                        elements.push(p);
                        continue;
                    }
                }
            }
        }

        return elements;
    }

    // 函数：为已存在的种子行添加删除按钮
    function addDeleteButtonsToExistingRows() {
        const torrentTable = document.querySelector('.torrents>tbody');
        if (!torrentTable) return;

        // 获取所有种子行（跳过表头）
        const torrentRows = Array.from(torrentTable.querySelectorAll(':scope>tr')).slice(1);

        // 为每一行添加删除按钮
        torrentRows.forEach(row => {
            addDeleteButtonToRow(row);
        });
    }

    // 函数：为单个种子行添加删除按钮
    function addDeleteButtonToRow(row) {
        // 创建一个新的表格单元格
        const deleteCell = document.createElement('td');
        deleteCell.className = 'row-delete-cell';
        deleteCell.style.textAlign = 'center';

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'x';
        deleteButton.style.padding = '8px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.backgroundColor = '#d0d0d0';
        deleteButton.style.color = 'black';
        deleteButton.style.border = 'none';
        deleteButton.style.borderRadius = '3px';

        // 添加删除功能
        deleteButton.addEventListener('click', function() {
            // 删除行
            row.remove();
            // 更新统计信息
            updateStatistics(findPaginationElements());
        });

        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
    }

    // 函数：寻找最后一页的页码
    function findLastPageNumber(paginationElement) {
        // 寻找分页中的所有链接
        const links = paginationElement.querySelectorAll('a');
        let lastPageNumber = 0;

        // 遍历链接找到最高页码
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const pageMatch = href.match(/[?&]page=(\d+)/);
                if (pageMatch && pageMatch[1]) {
                    const pageNum = parseInt(pageMatch[1]);
                    if (pageNum > lastPageNumber) {
                        lastPageNumber = pageNum;
                    }
                }
            }
        });

        return lastPageNumber;
    }

    // 函数：添加加载更多的界面
    function addLoadMoreInterface(paginationElements, lastPageNumber) {
        paginationElements.forEach(pagination => {
            const container = document.createElement('div');
            container.className = 'load-more-container';
            container.style.margin = '10px 0';
            container.style.textAlign = 'center';

            const label = document.createElement('span');
            label.textContent = '加载到第 ';

            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = lastPageNumber + 1; // +1 因为页面显示从1开始
            input.value = lastPageNumber + 1; // 默认显示到最后一页
            input.style.width = '60px';
            input.style.marginRight = '5px';
            input.style.marginLeft = '5px';

            const postLabel = document.createElement('span');
            postLabel.textContent = ' 页 ';

            const button = document.createElement('button');
            button.textContent = '加载更多';
            button.addEventListener('click', () => {
                // 将用户输入的页码（从1开始）转换为系统页码（从0开始）
                const targetPageDisplay = parseInt(input.value);
                if (targetPageDisplay > 0 && targetPageDisplay <= lastPageNumber + 1) {
                    const targetPage = targetPageDisplay - 1; // 转换为从0开始的索引

                    // 获取当前页码
                    const currentUrl = new URL(window.location.href);
                    const urlParams = new URLSearchParams(currentUrl.search);
                    const currentPage = parseInt(urlParams.get('page') || 0);

                    // 设置最大已加载页码
                    maxLoadedPageDisplay = Math.max(maxLoadedPageDisplay, targetPageDisplay);

                    // 开始递归加载页面
                    button.disabled = true;
                    button.textContent = '加载中...';

                    // 从当前页+1开始加载，直到目标页
                    loadMultiplePages(currentPage + 1, targetPage);
                } else {
                    alert('请输入有效的页码 (1-' + (lastPageNumber + 1) + ')');
                }
            });

            container.appendChild(label);
            container.appendChild(input);
            container.appendChild(postLabel);
            container.appendChild(button);
            pagination.appendChild(container);
        });
    }

    // 函数：递归加载多个页面
    function loadMultiplePages(currentPage, targetPage) {
        // 如果当前页已超过目标页，则停止加载
        if (currentPage > targetPage) {
            document.querySelectorAll('.load-more-container button').forEach(btn => {
                btn.disabled = false;
                btn.textContent = '加载更多';
            });

            // 更新统计信息
            updateStatistics(findPaginationElements());
            return;
        }

        // 如果当前页已经加载过，跳到下一页
        if (loadedPages.has(currentPage)) {
            loadMultiplePages(currentPage + 1, targetPage);
            return;
        }

        // 加载当前页
        const loadingText = `加载中 ${currentPage + 1}/${targetPage + 1}...`;
        document.querySelectorAll('.load-more-container button').forEach(btn => {
            btn.textContent = loadingText;
        });

        loadOnePage(currentPage, () => {
            // 加载完成后，记录并继续加载下一页
            loadedPages.add(currentPage);
            loadMultiplePages(currentPage + 1, targetPage);
        });
    }

    // 函数：加载单个页面的种子
    function loadOnePage(pageNumber, callback) {
        // 创建目标页面的URL
        const currentUrl = new URL(window.location.href);
        const urlParams = new URLSearchParams(currentUrl.search);
        urlParams.set('page', pageNumber);
        currentUrl.search = urlParams.toString();

        // 获取目标页面
        fetch(currentUrl.toString())
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 在获取的页面中找到种子表格
                const fetchedTorrentTable = doc.querySelector('.torrents>tbody');

                if (!fetchedTorrentTable) {
                    console.error('在获取的页面中未找到种子表格');
                    callback();
                    return;
                }

                // 获取种子行（跳过表头）- 使用直接子选择器
                const torrentRows = Array.from(fetchedTorrentTable.querySelectorAll(':scope>tr')).slice(1);

                // 在当前页面找到种子表格
                const currentTorrentTable = document.querySelector('.torrents>tbody');

                if (!currentTorrentTable) {
                    console.error('在当前页面未找到种子表格');
                    callback();
                    return;
                }

                // 将种子行添加到当前表格，并为每一行添加删除按钮
                torrentRows.forEach(row => {
                    const newRow = row.cloneNode(true);
                    addDeleteButtonToRow(newRow);
                    currentTorrentTable.appendChild(newRow);
                });

                // 更新统计信息（只针对计数和总大小，不更新页码显示）
                updateStatistics(findPaginationElements(), false);

                console.log(`已添加 ${torrentRows.length} 个种子，来自第 ${pageNumber + 1} 页`);

                // 执行回调
                callback();
            })
            .catch(error => {
                console.error(`获取第 ${pageNumber + 1} 页种子时出错:`, error);
                // 即使出错也执行回调以继续后续操作
                callback();
            });
    }

    // 函数：从单元格解析大小
    function parseSize(sizeCell) {
        // 获取单元格的文本内容
        const sizeText = sizeCell.textContent.replace(/\s+/g, ' ').trim();

        // 使用更灵活的正则表达式提取数字和单位
        const match = sizeText.match(/([\d.]+)\s*([KMGT]?B)/i);

        if (!match) return 0;

        const value = parseFloat(match[1]);
        const unit = match[2].toUpperCase();

        // 转换为字节
        switch (unit) {
            case 'KB': return value * 1024;
            case 'MB': return value * 1024 * 1024;
            case 'GB': return value * 1024 * 1024 * 1024;
            case 'TB': return value * 1024 * 1024 * 1024 * 1024;
            default: return value; // 假设为字节（B）或未知单位
        }
    }

    // 函数：将字节格式化为适当的单位
    function formatSize(bytes) {
        if (bytes === 0) return '0 B';

        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let index = 0;
        let size = bytes;

        while (size >= 1024 && index < units.length - 1) {
            size /= 1024;
            index++;
        }

        return size.toFixed(2) + ' ' + units[index];
    }

    // 函数：更新统计信息
    function updateStatistics(paginationElements, updatePageNumber = true) {
        // 找到所有种子行（使用直接子选择器）
        const torrentTable = document.querySelector('.torrents>tbody');
        if (!torrentTable) return;

        const torrentRows = torrentTable.querySelectorAll(':scope>tr');

        // 跳过表头行
        const torrentCount = torrentRows.length - 1;

        // 计算总大小
        let totalBytes = 0;

        Array.from(torrentRows).slice(1).forEach(row => {
            if (row.cells.length >= 5) {
                const sizeCell = row.cells[4]; // 第5列（从0开始索引）

                if (sizeCell) {
                    totalBytes += parseSize(sizeCell);
                }
            }
        });

        // 格式化总大小
        const formattedSize = formatSize(totalBytes);

        // 创建或更新统计元素
        paginationElements.forEach(pagination => {
            let statsElement = pagination.querySelector('.torrent-stats');

            if (!statsElement) {
                statsElement = document.createElement('div');
                statsElement.className = 'torrent-stats';
                statsElement.style.margin = '10px 0';
                statsElement.style.fontWeight = 'bold';
                pagination.appendChild(statsElement);
            }

            statsElement.textContent = `当前显示: ${torrentCount} 个种子，总体积: ${formattedSize}，已加载到第 ${maxLoadedPageDisplay} 页`;
        });
    }

    // 初始化脚本
    init();
})();