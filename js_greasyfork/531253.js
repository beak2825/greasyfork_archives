// ==UserScript==
// @name         sewerpt-low score
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  根据IMDB和豆瓣评分自动审核种子是否应该携带"冷门/低分"标签
// @author       fnyfree/AI Assistant
// @match        https://sewerpt.com/*
// @match        *://*.pt/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531253/sewerpt-low%20score.user.js
// @updateURL https://update.greasyfork.org/scripts/531253/sewerpt-low%20score.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const config = {
        debugMode: false,         // 调试模式开关
        highlightThreshold: 7.0,  // 评分阈值，低于此值应带"冷门/低分"标签
        panelPosition: 'right',   // 悬浮面板位置: 'right'或'left'
        highlightColors: {
            red: '#ffdddd',       // 红色标记（错误状态）
            green: '#ddffdd',     // 绿色标记（正确状态）
            yellow: '#ffffdd'     // 黄色标记（无法判断）
        }
    };

    // 添加样式
    GM_addStyle(`
        /* 种子行高亮样式 */
        tr.torrent-red {
            background-color: ${config.highlightColors.red} !important;
        }
        tr.torrent-green {
            background-color: ${config.highlightColors.green} !important;
        }
        tr.torrent-yellow {
            background-color: ${config.highlightColors.yellow} !important;
        }

        /* 控制面板样式 */
        #rating-checker-panel {
            position: fixed;
            top: 80px;
            ${config.panelPosition === 'right' ? 'right: 20px;' : 'left: 20px;'}
            background-color: rgba(255, 255, 255, 0.95);
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            padding: 10px;
            z-index: 9999;
            width: 250px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        #rating-checker-panel h3 {
            margin: 0 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
            font-size: 16px;
            text-align: center;
        }

        #rating-checker-panel p {
            margin: 5px 0;
        }

        .rating-stat {
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            padding: 3px 0;
        }

        .rating-stat:hover {
            background-color: #f0f0f0;
        }

        .rating-stat.total {
            font-weight: bold;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-bottom: 5px;
        }

        .rating-stat .count {
            font-weight: bold;
        }

        .red-count {
            color: #d9534f;
        }

        .green-count {
            color: #5cb85c;
        }

        .yellow-count {
            color: #f0ad4e;
        }

        #rating-checker-log {
            max-height: 200px;
            overflow-y: auto;
            margin-top: 10px;
            border-top: 1px solid #ddd;
            padding-top: 5px;
            font-size: 12px;
            display: none;
        }

        #rating-checker-log.visible {
            display: block;
        }

        .log-entry {
            margin: 3px 0;
            padding: 2px 5px;
            border-radius: 3px;
        }

        .log-entry.error {
            background-color: ${config.highlightColors.red};
        }

        .log-entry.success {
            background-color: ${config.highlightColors.green};
        }

        .log-entry.warning {
            background-color: ${config.highlightColors.yellow};
        }

        .log-entry.info {
            background-color: #e8f1ff;
        }

        .panel-buttons {
            display: flex;
            justify-content: center;
            gap: 5px;
            margin-top: 8px;
        }

        .panel-button {
            padding: 2px 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background-color: #f5f5f5;
            cursor: pointer;
            font-size: 12px;
        }

        .panel-button:hover {
            background-color: #e0e0e0;
        }

        .panel-button.active {
            background-color: #dff0d8;
            border-color: #5cb85c;
        }
    `);

    // 初始化统计数据
    let stats = {
        total: 0,
        red: 0,
        green: 0,
        yellow: 0,
        redItems: [],
        greenItems: [],
        yellowItems: []
    };

    // 记录日志的函数
    function log(message, type = 'info') {
        if (config.debugMode || type === 'error') {
            console.log(`[种子评分审核] ${message}`);
        }

        const logDiv = document.getElementById('rating-checker-log');
        if (logDiv) {
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.textContent = message;
            logDiv.appendChild(entry);
            logDiv.scrollTop = logDiv.scrollHeight;
        }
    }

    // 解析评分（处理 N/A 等特殊情况）
    function parseRating(text) {
        if (!text || text === 'N/A' || text === '暂无' || text === '0' || text === '0.0') {
            return null;
        }
        const rating = parseFloat(text);
        return isNaN(rating) ? null : rating;
    }

    // 检查是否包含"冷门/低分"标签
    function hasLowRatingTag(torrentRow) {
        const tagElements = torrentRow.querySelectorAll('span[style*="background-color:#fdff09"]');
        for (const tag of tagElements) {
            if (tag.textContent.includes('冷门/低分')) {
                return true;
            }
        }
        return false;
    }

    // 处理种子行
    function processTorrentRow(row, index) {
        try {
            // 查找评分元素
            const ratingCell = row.querySelector('td div[style="display: flex;flex-direction: column"]');
            if (!ratingCell) {
                log(`第 ${index+1} 行: 找不到评分单元格`, 'warning');
                row.classList.add('torrent-yellow');
                stats.yellow++;
                stats.yellowItems.push(row);
                return;
            }

            // 提取IMDB和豆瓣评分
            let imdbRating = null;
            let doubanRating = null;

            const ratingDivs = ratingCell.querySelectorAll('div[style="display: flex;align-content: center;justify-content: space-between;padding: 2px 0"]');
            for (const div of ratingDivs) {
                const img = div.querySelector('img');
                const span = div.querySelector('span');

                if (!img || !span) continue;

                if (img.src.includes('imdb') || img.alt === 'imdb') {
                    imdbRating = parseRating(span.textContent);
                } else if (img.src.includes('douban') || img.alt === 'douban') {
                    doubanRating = parseRating(span.textContent);
                }
            }

            // 检查是否有"冷门/低分"标签
            const hasLowTag = hasLowRatingTag(row);

            // 记录分析结果
            log(`第 ${index+1} 行: IMDB=${imdbRating}, 豆瓣=${doubanRating}, 低分标签=${hasLowTag ? '有' : '无'}`, 'info');

            // 无法获取任何评分数据
            if (imdbRating === null && doubanRating === null) {
                log(`第 ${index+1} 行: 无法获取评分数据`, 'warning');
                row.classList.add('torrent-yellow');
                stats.yellow++;
                stats.yellowItems.push(row);
                return;
            }

            // 修正后的评分判断逻辑
            // 只有当所有非空评分都 >= 阈值时，才认为是高分
            const shouldHaveTag = (imdbRating !== null && imdbRating < config.highlightThreshold) ||
                                 (doubanRating !== null && doubanRating < config.highlightThreshold);

            if (shouldHaveTag && hasLowTag) {
                // 应该有标签且确实有 -> 标绿
                log(`第 ${index+1} 行: 低分且有低分标签（正确）`, 'success');
                row.classList.add('torrent-green');
                stats.green++;
                stats.greenItems.push(row);
            } else if (shouldHaveTag && !hasLowTag) {
                // 应该有标签但没有 -> 标红
                log(`第 ${index+1} 行: 低分但无低分标签（错误）`, 'error');
                row.classList.add('torrent-red');
                stats.red++;
                stats.redItems.push(row);
            } else {
                // 不应该有标签且没有 -> 标绿
                log(`第 ${index+1} 行: 高分且无低分标签（正确）`, 'success');
                row.classList.add('torrent-green');
                stats.green++;
                stats.greenItems.push(row);
            }
        } catch (error) {
            log(`处理第 ${index+1} 行时出错: ${error.message}`, 'error');
            console.error(error);
            row.classList.add('torrent-yellow');
            stats.yellow++;
            stats.yellowItems.push(row);
        }
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'rating-checker-panel';
        panel.innerHTML = `
            <h3>下水道种子冷门/低分评分审核助手</h3>
            <div class="rating-stat total" data-type="total">
                <span>当前页总计种子:</span>
                <span class="count">${stats.total}</span>
            </div>
            <div class="rating-stat" data-type="red">
                <span>需要修正(红):</span>
                <span class="count red-count">${stats.red}</span>
            </div>
            <div class="rating-stat" data-type="green">
                <span>正确标记(绿):</span>
                <span class="count green-count">${stats.green}</span>
            </div>
            <div class="rating-stat" data-type="yellow">
                <span>无法判断(黄):</span>
                <span class="count yellow-count">${stats.yellow}</span>
            </div>
            <span>黄色请自行打开判断</span>
            <span>目前只考虑评分低未有冷门/低分标签，其余情况未作判断</span>
            <div class="panel-buttons">
                <div class="panel-button" id="toggle-debug">调试模式</div>
                <div class="panel-button" id="next-issue">下一个问题</div>
            </div>
            <div id="rating-checker-log"></div>
        `;

        document.body.appendChild(panel);

        // 添加事件监听器
        document.querySelectorAll('.rating-stat').forEach(stat => {
            stat.addEventListener('click', () => {
                const type = stat.getAttribute('data-type');
                navigateToItems(type);
            });
        });

        // 调试模式开关
        const debugButton = document.getElementById('toggle-debug');
        debugButton.addEventListener('click', () => {
            config.debugMode = !config.debugMode;
            debugButton.classList.toggle('active', config.debugMode);
            document.getElementById('rating-checker-log').classList.toggle('visible', config.debugMode);
            log(`调试模式 ${config.debugMode ? '开启' : '关闭'}`);
        });

        // 设置初始状态
        debugButton.classList.toggle('active', config.debugMode);
        document.getElementById('rating-checker-log').classList.toggle('visible', config.debugMode);

        // 下一个问题按钮
        let currentIssueIndex = 0;
        document.getElementById('next-issue').addEventListener('click', () => {
            if (stats.redItems.length > 0) {
                if (currentIssueIndex >= stats.redItems.length) {
                    currentIssueIndex = 0;
                }
                scrollToElement(stats.redItems[currentIssueIndex]);
                currentIssueIndex++;
            } else {
                log('没有发现需要修正的问题', 'info');
            }
        });
    }

    // 更新控制面板统计数据
    function updateControlPanel() {
        const panel = document.getElementById('rating-checker-panel');
        if (!panel) return;

        panel.querySelector('.rating-stat[data-type="total"] .count').textContent = stats.total;
        panel.querySelector('.rating-stat[data-type="red"] .count').textContent = stats.red;
        panel.querySelector('.rating-stat[data-type="green"] .count').textContent = stats.green;
        panel.querySelector('.rating-stat[data-type="yellow"] .count').textContent = stats.yellow;
    }

    // 导航到指定类型的项目
    function navigateToItems(type) {
        let items;
        switch (type) {
            case 'red':
                items = stats.redItems;
                log('显示所有需要修正的种子');
                break;
            case 'green':
                items = stats.greenItems;
                log('显示所有正确标记的种子');
                break;
            case 'yellow':
                items = stats.yellowItems;
                log('显示所有无法判断的种子');
                break;
            case 'total':
            default:
                return; // 总计无需导航
        }

        if (items.length > 0) {
            scrollToElement(items[0]);
        } else {
            log(`没有${type === 'red' ? '需要修正' : type === 'green' ? '正确标记' : '无法判断'}的种子`);
        }
    }

    // 滚动到指定元素
    function scrollToElement(element) {
        if (!element) return;

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // 添加闪烁效果
        const originalBackground = element.style.backgroundColor;
        element.style.transition = 'background-color 0.5s';

        element.style.backgroundColor = '#fff9c4';
        setTimeout(() => {
            element.style.backgroundColor = originalBackground;
            setTimeout(() => {
                element.style.transition = '';
            }, 500);
        }, 1000);
    }

    // 主函数：处理页面上的所有种子行
    function processTorrents() {
        // 重置统计数据
        stats = {
            total: 0,
            red: 0,
            green: 0,
            yellow: 0,
            redItems: [],
            greenItems: [],
            yellowItems: []
        };

        // 查找所有种子行
        const torrentRows = document.querySelectorAll('table.torrents > tbody > tr:not(:first-child)');
        stats.total = torrentRows.length;

        log(`发现 ${stats.total} 个种子条目，开始处理...`);

        // 处理每一个种子行
        torrentRows.forEach((row, index) => {
            processTorrentRow(row, index);
        });

        log(`处理完成: 共 ${stats.total} 个种子，${stats.red} 个需要修正，${stats.green} 个正确标记，${stats.yellow} 个无法判断`);

        // 创建或更新控制面板
        if (!document.getElementById('rating-checker-panel')) {
            createControlPanel();
        } else {
            updateControlPanel();
        }
    }

    // 页面加载完成后执行主函数
    window.addEventListener('load', () => {
        // 检测是否为种子列表页面
        if (document.querySelector('table.torrents')) {
            setTimeout(processTorrents, 1000); // 延迟1秒执行，确保页面完全加载
        }
    });

    // 如果页面已经加载完成，立即执行
    if (document.readyState === 'complete') {
        if (document.querySelector('table.torrents')) {
            setTimeout(processTorrents, 1000);
        }
    }
})();
