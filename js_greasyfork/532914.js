// ==UserScript==
// @name         yearing-history-sql-plus
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  记录Yearning平台的SQL查询历史，支持注释过滤、下拉面板和内容折叠
// @author       一木舟
// @match        https://yearning.int.zhumanggroup.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/532914/yearing-history-sql-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/532914/yearing-history-sql-plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        maxRecords: 100,      // 最大记录数
        maxDisplayLength: 100, // 折叠前显示的最大长度
        panelWidth: '450px',  // 面板宽度
        panelMaxHeight: '70vh' // 面板最大高度
    };

    // 等待页面加载完成
    $(document).ready(function() {
        // 初始化存储
        if (!GM_getValue('sqlHistory')) {
            GM_setValue('sqlHistory', []);
        }

        // 创建悬浮按钮和面板
        createFloatingPanel();

        // 监听SQL查询事件
        monitorSqlQueries();
        //快捷搜索
        setupSearchFunctionality();
    });

    // 创建悬浮面板
    function createFloatingPanel() {
        // 添加CSS样式
        const css = `
            #sql-recorder-btn {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: #1890ff;
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transition: all 0.3s;
            }
            #sql-recorder-btn:hover {
                background: #40a9ff;
                transform: translateY(-50%) scale(1.1);
            }
            #sql-recorder-panel {
                position: fixed;
                right: 70px;
                top: 50%;
                transform: translateY(-50%);
                width: ${config.panelWidth};
                max-height: ${config.panelMaxHeight};
                background: white;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                z-index: 9998;
                display: none;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.3s;
            }
            .sql-panel-header {
                padding: 12px;
                background: #1890ff;
                color: white;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            }
            .sql-panel-body {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }
            .sql-record-item {
                padding: 10px;
                border-bottom: 1px solid #eee;
                margin-bottom: 8px;
                border-radius: 4px;
                background: #fafafa;
            }
            .sql-record-time {
                font-size: 12px;
                color: #888;
                margin-bottom: 5px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .sql-record-content {
                font-family: monospace;
                background: #f5f5f5;
                padding: 8px;
                border-radius: 3px;
                margin-bottom: 8px;
                word-break: break-all;
                white-space: pre-wrap;
                max-height: 150px;
                overflow: hidden;
                transition: max-height 0.3s;
            }
            .sql-record-content.expanded {
                max-height: none;
                overflow-y: auto;
            }
            .sql-record-actions {
                display: flex;
                justify-content: flex-end;
                gap: 5px;
            }
            .copy-btn, .toggle-btn, .clear-btn {
                background: #1890ff;
                color: white;
                border: none;
                padding: 3px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            .copy-btn:hover, .toggle-btn:hover, .clear-btn:hover {
                opacity: 0.8;
            }
            .toggle-btn {
                background: #52c41a;
            }
            .clear-btn {
                background: #ff4d4f;
            }
            .sql-panel-footer {
                padding: 8px;
                text-align: center;
                background: #f0f0f0;
                font-size: 12px;
                color: #666;
            }
            .drag-handle {
                cursor: move;
                padding: 0 5px;
            }

    .copy-notification {
        position: fixed;
        bottom: 50%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 10000;
        animation: fadeInOut 2s ease-in-out;
        opacity: 0;
        display: none;
    }

    @keyframes fadeInOut {
        0% { opacity: 0; bottom: 10px; }
        20% { opacity: 1; bottom: 20px; }
        80% { opacity: 1; bottom: 20px; }
        100% { opacity: 0; bottom: 30px; }
    }

    /* 面板容器样式修改 */
    #sql-recorder-panel {
        position: fixed;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
        width: ${config.panelWidth};
        max-height: ${config.panelMaxHeight};
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 9998;
        display: none;
        flex-direction: column;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    #sql-recorder-panel.collapsed {
        max-height: 40px;
        overflow: hidden;
    }

    .sql-panel-header {
        padding: 12px;
        background: #1890ff;
        color: white;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        user-select: none;
    }

    .toggle-arrow {
        margin-left: 8px;
        transition: transform 0.3s;
    }

    #sql-recorder-panel.collapsed .toggle-arrow {
        transform: rotate(-90deg);
    }

.export-btn {
    background: #52c41a;
    color: white;
    border: none;
    padding: 3px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
    margin-right: 0px;
}

.export-btn:hover {
    opacity: 0.8;
}

.export-format {
    margin-left: 0px;
    padding: 2px 5px;
    border-radius: 3px;
    border: 1px solid #d9d9d9;
    font-size: 12px;
}

.sql-panel-search {
    padding: 8px;
    background: #f5f5f5;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
}

#sql-search-input {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    outline: none;
    font-size: 13px;
}

#sql-search-input:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

#clear-search-btn {
    margin-left: 8px;
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 16px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

#clear-search-btn:hover {
    background: #f0f0f0;
    color: #666;
}
.delete-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 3px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
    margin-left: 5px;
}

.delete-btn:hover {
    background: #ff7875;
}
            `;
        $('head').append(`<style>${css}</style>`);

        // 在createFloatingPanel函数中添加提示元素
        const notification = $(`
    <div class="copy-notification" id="copy-notification">SQL已复制到剪贴板</div>
`).appendTo('body');


        // 创建悬浮按钮
        const btn = $(`<button id="sql-recorder-btn" title="SQL查询记录"><i>SQL</i></button>`).appendTo('body');

        // 在createFloatingPanel函数中添加导出按钮
        const panel = $(`
    <div id="sql-recorder-panel" class="collapsed">
        <div class="sql-panel-header">
            <span>SQL查询历史<span class="toggle-arrow">▼</span></span>
            <div>
                <button class="export-btn">导出</button>
                <select id="export-format" class="export-format">
                <option value="json">JSON</option>
                <option value="sql">SQL文件</option>
                <option value="csv">CSV</option>
                <option value="text">纯文本</option>
            </select>
                <button class="clear-btn">清空全部</button>
                <span class="drag-handle">≡</span>
            </div>
        </div>
        <div class="sql-panel-search">
            <input type="text" id="sql-search-input" placeholder="搜索SQL...">
            <button id="clear-search-btn">×</button>
        </div>
        <div class="sql-panel-body" id="sql-records-container"></div>
        <div class="sql-panel-footer">共 <span id="record-count">0</span> 条记录

        </div>
    </div>
`).appendTo('body');

        // 面板交互逻辑
        panel.find('.sql-panel-header').click(function() {
            panel.toggleClass('collapsed');
            if (!panel.hasClass('collapsed')) {
                refreshHistoryList();
            }
        });

        panel.find('.clear-btn, .drag-handle').click(function(e) {
            e.stopPropagation();
        });

        // 主按钮点击逻辑
        btn.click(function() {
            if (panel.css('display') === 'none') {
                panel.css('display', 'flex');
                panel.removeClass('collapsed');
                refreshHistoryList();
            } else {
                panel.addClass('collapsed');
                setTimeout(() => panel.hide(), 300);
            }
        });


        // 添加导出按钮事件
        panel.find('.export-btn').click(function(e) {
            e.stopPropagation();
            const format = panel.find('.export-format').val();
            exportSqlHistory(format);
        });

        // 清空按钮事件
        panel.find('.clear-btn').click(function() {
            if (confirm('确定要清空所有SQL查询记录吗？')) {
                GM_setValue('sqlHistory', []);
                refreshHistoryList();
            }
        });

        // 使面板可拖动
        makeDraggable(panel.find('.drag-handle'), panel);

        // 清空按钮事件
        panel.find('.clear-btn').click(function() {
            if (confirm('确定要清空所有SQL查询记录吗？')) {
                GM_setValue('sqlHistory', []);
                refreshHistoryList();
            }
        });

        // 在创建面板后添加事件监听
        panel.find('.sql-panel-header').click(function() {
            panel.toggleClass('collapsed');

            // 如果从收起状态展开，刷新内容
            if (!panel.hasClass('collapsed')) {
                refreshHistoryList();
            }
        });

// 阻止清空按钮和拖动把手触发收起/展开
        panel.find('.clear-btn, .drag-handle').click(function(e) {
            e.stopPropagation();
        });
    }

    // 使元素可拖动
    function makeDraggable(handle, element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.on('mousedown', function(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            $(document).on('mousemove', moveElement);
            $(document).on('mouseup', stopMove);
        });

        function moveElement(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const top = (element.offset().top - pos2);
            const left = (element.offset().left - pos1);

            element.css({
                top: `${top}px`,
                left: `${left}px`,
                right: 'auto',
                transform: 'none'
            });
        }

        function stopMove() {
            $(document).off('mousemove', moveElement);
            $(document).off('mouseup', stopMove);
        }
    }

    // 添加搜索功能实现
    function setupSearchFunctionality() {
        const searchInput = $('#sql-search-input');
        const clearSearchBtn = $('#clear-search-btn');

        // 实时搜索
        searchInput.on('input', function() {
            filterSqlRecords($(this).val().trim());
        });

        // 清空搜索
        clearSearchBtn.click(function() {
            searchInput.val('');
            filterSqlRecords('');
        });

        // 快捷键聚焦搜索框 (Ctrl+F)
        $(document).on('keydown', function(e) {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                if ($('#sql-recorder-panel').is(':visible')) {
                    searchInput.focus();
                }
            }
        });
    }

// 过滤SQL记录
    function filterSqlRecords(keyword) {
        const history = GM_getValue('sqlHistory', []);
        const container = $('#sql-records-container');

        if (!keyword) {
            refreshHistoryList();
            return;
        }

        const filtered = history.filter(record =>
            record.sql.toLowerCase().includes(keyword.toLowerCase()) ||
            record.time.toLowerCase().includes(keyword.toLowerCase())
        );

        container.empty();


        if (filtered.length === 0) {
            container.append('<div style="padding: 20px; text-align: center; color: #888;">没有找到匹配的SQL记录</div>');
            $('#record-count').text('0/' + history.length);
            return;
        }

        filtered.reverse().forEach((record, index) => {
            const sql = record.sql;
            const isLong = sql.length > config.maxDisplayLength;
            const displaySql = isLong ? sql.substring(0, config.maxDisplayLength) + '...' : sql;

            // 高亮匹配文本
            const highlightedSql = highlightKeyword(displaySql, keyword);
            const highlightedTime = highlightKeyword(record.time, keyword);

            // 在生成每条记录的HTML中添加删除按钮
            const item = $(`
    <div class="sql-record-item" data-id="${index}">
        <div class="sql-record-time">
            <span>.time}</span>
            ${isLong ? '<button class="toggle-btn">展开</button>' : ''}
        </div>
        <div class="sql-record-content" title="${escapeHtml(sql)}">
            ${escapeHtml(displaySql)}
        </div>
        <div class="sql-record-actions">
            <button class="copy-btn" data-sql="${escapeHtml(sql)}">复制</button>
            <button class="delete-btn">删除</button>
        </div>
    </div>
`).appendTo(container);
// 在refreshHistoryList或filterSqlRecords函数中为删除按钮添加事件
            item.find('.delete-btn').click(function() {
                const itemElement = $(this).closest('.sql-record-item');
                const index = history.length - 1 - itemElement.data('id'); // 反转索引

                if (confirm('确定要删除这条SQL记录吗？')) {
                    if (deleteSqlRecord(index)) {
                        itemElement.remove();
                        $('#record-count').text(`${history.length - 1}条记录`);

                    } else {

                    }
                }
            });
            // 添加展开/折叠和复制功能...
        });
        $('#record-count').text(`${filtered.length}/${history.length}`);
    }

// 高亮关键字
    function highlightKeyword(text, keyword) {
        if (!keyword) return escapeHtml(text);

        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        return escapeHtml(text).replace(regex, match =>
            `<span style="background-color: #ffeb3b; color: #000; padding: 0 2px;">${match}</span>`
        );
    }

    // 添加删除记录函数
    function deleteSqlRecord(index) {
        const history = GM_getValue('sqlHistory', []);
        if (index >= 0 && index < history.length) {
            history.splice(index, 1);
            GM_setValue('sqlHistory', history);
            return true;
        }
        return false;
    }

// 导出SQL历史记录
    function exportSqlHistory(format = 'json') {
        const history = GM_getValue('sqlHistory', []);
        if (history.length === 0) {
            showNotification('导出失败', '没有可导出的SQL记录');
            return;
        }

        let content, mimeType, fileName;

        switch (format) {
            case 'json':
                content = JSON.stringify(history, null, 2);
                mimeType = 'application/json';
                fileName = `sql_history_${new Date().toISOString().slice(0, 10)}.json`;
                break;

            case 'sql':
                content = history.map(record =>
                    `-- ${record.time}\n${record.sql};\n`
                ).join('\n');
                mimeType = 'application/sql';
                fileName = `sql_queries_${new Date().toISOString().slice(0, 10)}.sql`;
                break;

            case 'csv':
                content = '时间,SQL语句\n' +
                    history.map(record =>
                        `"${record.time}","${record.sql.replace(/"/g, '""')}"`
                    ).join('\n');
                mimeType = 'text/csv';
                fileName = `sql_history_${new Date().toISOString().slice(0, 10)}.csv`;
                break;

            case 'text':
                content = history.map(record =>
                    `${record.time}:\n${record.sql}\n${'-'.repeat(80)}`
                ).join('\n\n');
                mimeType = 'text/plain';
                fileName = `sql_history_${new Date().toISOString().slice(0, 10)}.txt`;
                break;
        }

        // 创建下载链接
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('导出成功', `已导出${history.length}条SQL记录`);
        }, 100);
    }

    // 刷新历史记录列表
    function refreshHistoryList() {
        const history = GM_getValue('sqlHistory', []);
        const container = $('#sql-records-container');
        container.empty();


        $('#record-count').text(history.length);
        if (history.length === 0) {
            container.append('<div style="padding: 20px; text-align: center; color: #888;">暂无查询记录</div>');
            return;
        }

        // 显示最新的记录在前面
        [...history].reverse().forEach((record, index) => {
            const sql = record.sql;
            const isLong = sql.length > config.maxDisplayLength;
            const displaySql = isLong ? sql.substring(0, config.maxDisplayLength) + '...' : sql;

            // 在生成每条记录的HTML中添加删除按钮
            const item = $(`
    <div class="sql-record-item" data-id="${index}">
        <div class="sql-record-time">
            <span>.time}</span>
            ${isLong ? '<button class="toggle-btn">展开</button>' : ''}
        </div>
        <div class="sql-record-content" title="${escapeHtml(sql)}">
            ${escapeHtml(displaySql)}
        </div>
        <div class="sql-record-actions">
            <button class="copy-btn" data-sql="${escapeHtml(sql)}">复制</button>
            <button class="delete-btn">删除</button>
        </div>
    </div>
`).appendTo(container);

            // 复制按钮事件
            item.find('.copy-btn').click(function() {
                const sql = $(this).data('sql');
                copyToClipboard(sql);
            });

            // 在refreshHistoryList或filterSqlRecords函数中为删除按钮添加事件
            item.find('.delete-btn').click(function() {
                const itemElement = $(this).closest('.sql-record-item');
                const index = history.length - 1 - itemElement.data('id'); // 反转索引

                if (confirm('确定要删除这条SQL记录吗？')) {
                    if (deleteSqlRecord(index)) {
                        itemElement.remove();
                        $('#record-count').text(`${history.length - 1}条记录`);
                        showCopyNotification("删除成功");
                    } else {
                        console.log(111);
                    }
                }
            });

            // 展开/折叠按钮事件
            if (isLong) {
                const content = item.find('.sql-record-content');
                const toggleBtn = item.find('.toggle-btn');

                toggleBtn.click(function() {
                    content.toggleClass('expanded');
                    const isExpanded = content.hasClass('expanded');
                    toggleBtn.text(isExpanded ? '折叠' : '展开');
                    content.html(isExpanded ? escapeHtml(sql) : escapeHtml(displaySql));
                });
            }
        });
    }

    // 监听SQL查询
    function monitorSqlQueries() {
        // 方法1：监听提交按钮点击
        $(document).on('click', '#execute-sql-btn', function() {
            setTimeout(() => {
                // 假设SQL在textarea中，id为sql-editor
                const sql = $('#sql-editor').val();
                if (sql && sql.trim()) {
                    const cleanedSql = removeSqlComments(sql.trim());
                    if (cleanedSql) {
                        addSqlRecord(cleanedSql);
                    }
                }
            }, 500);
        });

        // 方法2：监听AJAX请求
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            if (arguments[1].includes('/api/v2/query/results')) {
                const originalSend = this.send;
                this.send = function(body) {
                    try {
                        const data = JSON.parse(body);
                        if (data.sql) {
                            const cleanedSql = removeSqlComments(data.sql.trim());
                            if (cleanedSql) {
                                addSqlRecord(cleanedSql);
                            }
                        }
                    } catch (e) {}
                    return originalSend.apply(this, arguments);
                };
            }
            return originalOpen.apply(this, arguments);
        };
    }

    // 移除SQL注释
    function removeSqlComments(sql) {
        // 1. 移除所有类型的注释
        sql = sql
            // 移除--单行注释
            .replace(/--.*$/gm, '')
            // 移除#号单行注释（包括行首和行中的）
            .replace(/#.*$/gm, '')
            // 移除/* */多行注释
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // 特别处理以#开头的行
            .replace(/^\s*#.*$/gm, '');

        // 2. 标准化空白字符
        sql = sql
            // 移除前后空白
            .trim()
            // 替换连续空白为单个空格
            .replace(/\s+/g, ' ')
            // 移除SQL末尾的分号(可选)
            .replace(/;$/g, '');

        // 3. 检查是否为空字符串

        return sql || null;
    }

    // 添加SQL记录
    function addSqlRecord(sql) {
        const history = GM_getValue('sqlHistory', []);

        // 避免重复记录完全相同的SQL
        if (history.length > 0 && history[history.length - 1].sql === sql) {
            return;
        }

        history.push({
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            sql: sql
        });

        // 限制记录数量
        if (history.length > config.maxRecords) {
            history.shift();
        }

        GM_setValue('sqlHistory', history);

        // 如果面板可见则刷新
        if ($('#sql-recorder-panel').is(':visible')) {
            refreshHistoryList();
        }
    }

    // 辅助函数：复制到剪贴板
    // 替换原来的copyToClipboard函数
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyNotification();
            }
        } catch (err) {
            console.error('复制失败:', err);
        } finally {
            document.body.removeChild(textarea);
        }
    }

// 新增显示通知函数
    function showCopyNotification(msg) {
        const notification = $('#copy-notification');
        if(msg) {
            notification.text(msg)
        }
        notification.css('display', 'block');
        notification.css('opacity', 0);

        // 触发动画
        setTimeout(() => {
            notification.css('opacity', 1);
        }, 10);

        // 2秒后隐藏
        setTimeout(() => {
            notification.css('opacity', 0);
            setTimeout(() => {
                notification.css('display', 'none');
            }, 300);
        }, 2000);
    }

    // 辅助函数：转义HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, "");
    }
})();