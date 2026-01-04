// ==UserScript==
// @name         D3禅道优化
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  D3禅道功能优化
// @match        http://zentao.diansan.com/*
// @grant        GM_xmlhttpRequest
// @connect      zentao.diansan.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526874/D3%E7%A6%85%E9%81%93%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526874/D3%E7%A6%85%E9%81%93%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const BATCH_API = taskIds =>
        `http://zentao.diansan.com/api-getModel-task-getByList-taskIDList=${encodeURIComponent(taskIds.join(','))}.json`;
    const SINGLE_API = taskId =>
        `http://zentao.diansan.com/api-getModel-task-getById-taskID=${taskId},setImgSize=.json`;
    const STORY_BASE_URL = 'http://zentao.diansan.com/story-view-';
    const DETAIL_ICON = '🔍';
    const COLUMN_NAME = 'STORY';
    const CACHE = new Map();

    // 样式定义
    const style = document.createElement('style');
    style.textContent = `
        /* 第二列样式 */
        #projectTaskForm table th:nth-child(2),
        #projectTaskForm table td:nth-child(2) {
            min-width: 100px !important;
            max-width: 320px;
            width: 10%;
            padding: 8px 12px !important;
            text-align: left !important;
            vertical-align: left !important;
        }
        .story-cell {
            position: relative;
            line-height: 1.6;
        }
        .story-link-wrapper {
            display: flex;
            align-items: left;
            gap: 2px;
        }
        .detail-trigger {
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .detail-trigger:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        .detail-content {
            margin-top: 6px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            border: 1px solid #eee;
            font-size: 13px;
            color: #444;
            animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .loading-dots::after {
            content: '...';
            display: inline-block;
            width: 20px;
            animation: dotAnim 1s infinite;
        }
        @keyframes dotAnim {
            33% { content: '.'; }
            66% { content: '..'; }
            100% { content: '...'; }
        }
        .error-text {
            color: #ff4d4f !important;
            font-size: 12px;
        }
        /* 弹窗样式 */
        .story-popup {
            position: fixed;
            background: white;
            border-radius: 8px;
            box-shadow: 0 6px 30px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 400px;
            animation: popupFade 0.3s;
            transform-origin: top left;
        }
        @keyframes popupFade {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .popup-header {
            padding: 12px 16px;
            background: #f8f9fa;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .popup-close {
            cursor: pointer;
            padding: 4px;
            opacity: 0.6;
            transition: opacity 0.2s;
        }
        .popup-close:hover {
            opacity: 1;
        }
        .popup-content {
            padding: 16px;
            max-height: 60vh;
            overflow-y: auto;
        }
        .popup-loading {
            padding: 20px;
            text-align: center;
            color: #666;
        }
        .popup-footer {
            padding: 12px 16px;
            border-top: 1px solid #eee;
            text-align: right;
        }
    `;
    document.head.appendChild(style);

    // 主初始化
    const init = () => {
        const table = document.querySelector('#projectTaskForm table');
        if (!table) return setTimeout(init, 500);

        injectHeader(table);
        fixFooterColspan(table);
        processTasks(table);
    };

    // 处理任务数据
    const processTasks = (table) => {
        const taskIds = collectTaskIds(table);
        if (taskIds.length === 0) return;

        batchRequest(taskIds, table);
    };

    // 批量请求
    const batchRequest = (taskIds, table) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: BATCH_API(taskIds),
            timeout: 10000,
            onload: (res) => {
                try {
                    const data = JSON.parse(JSON.parse(res.response).data);
                    const tasksData = Object.values(data);
                    renderBaseInfo(tasksData, table);
                } catch (e) {
                    showColumnError(table, '数据解析失败');
                }
            },
            onerror: () => showColumnError(table, '网络请求失败')
        });
    };

    // 渲染基础信息
    const renderBaseInfo = (tasksData, table) => {
        const taskMap = new Map(tasksData.map(t => [t.id.toString(), t]));

        table.querySelectorAll('tbody tr').forEach(row => {
            const taskId = getTaskId(row);
            const taskData = taskMap.get(taskId);
            const cell = createStoryCell(row);

            if (!taskData?.story || taskData.story === '0') {
                cell.innerHTML = `<span class="error-text">❌无关联</span>`;
                return;
            }

            cell.innerHTML = `
                <div class="story-link-wrapper">
                    <a href="${STORY_BASE_URL}${taskData.story}"
                       target="_blank"
                       class="story-link">${taskData.story}</a>
                    <span class="detail-trigger" data-task="${taskId}">${DETAIL_ICON}</span>
                </div>
            `;

            cell.querySelector('.detail-trigger').addEventListener('click', handleDetailClick);
        });
    };

    // 处理详情点击
    const handleDetailClick = async (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        const trigger = e.currentTarget;
        if (document.querySelector('.story-popup')) return; // 防止重复打开

        const taskId = trigger.dataset.task;
        const popup = createPopupElement(taskId);
        document.body.appendChild(popup);

        // 定位弹窗
        positionPopup(popup, trigger);

        // 加载数据
        loadPopupContent(popup, taskId);

        // 添加监听前移除旧监听
        const clickHandler = (e) => handleOutsideClick(e, popup);
        document.addEventListener('click', clickHandler);

        // 关闭时移除监听
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            removePopup(popup);
            document.removeEventListener('click', clickHandler);
        });

        // 弹窗内部点击阻止冒泡
        popup.addEventListener('click', (e) => e.stopPropagation());
    };

    // 创建弹窗元素
    const createPopupElement = (taskId) => {
        const popup = document.createElement('div');
        popup.className = 'story-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <div>需求详情</div>
                <div class="popup-close">×</div>
            </div>
            <div class="popup-content">
                <div class="popup-loading">⌛ 加载中...</div>
            </div>
        `;
        return popup;
    };

    // 弹窗定位
    const positionPopup = (popup, trigger) => {
        const rect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = rect.bottom + 8;
        let left = rect.left;

        // 防止右侧溢出
        if (left + 400 > viewportWidth) {
            left = viewportWidth - 420;
        }

        // 防止底部溢出
        if (top + 200 > viewportHeight) {
            top = rect.top - 220;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    };

    // 加载内容
    const loadPopupContent = async (popup, taskId) => {
        const content = popup.querySelector('.popup-content');
        try {
            const title = await fetchStoryTitle(taskId);
            content.innerHTML = `
                <div style="font-size:14px; line-height:1.6;">
                    ${decodeURIComponent(title) || '无标题信息'}
                </div>
            `;
        } catch (error) {
            content.innerHTML = `
                <div style="color:#ff4d4f; font-size:13px;">
                    ⚠️ 加载失败: ${error}
                </div>
            `;
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') removePopup(popup);
        });
    };

    // 关闭处理
    const removePopup = (popup) => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 300);
    };

    const handleOutsideClick = (e, popup) => {
        if (!popup.contains(e.target)) {
            removePopup(popup);
            document.removeEventListener('click', handleOutsideClick);
        }
    };

    // 获取需求标题
    const fetchStoryTitle = (taskId) => {
        return new Promise((resolve, reject) => {
            if (CACHE.has(taskId)) return resolve(CACHE.get(taskId));

            GM_xmlhttpRequest({
                method: 'GET',
                url: SINGLE_API(taskId),
                timeout: 5000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(JSON.parse(res.response).data);
                        const title = data.storyTitle || '';
                        CACHE.set(taskId, title);
                        resolve(title);
                    } catch (e) {
                        reject('数据解析失败');
                    }
                },
                onerror: () => reject('网络异常')
            });
        });
    };

    // DOM操作辅助
    const createStoryCell = (row) => {
        const firstTd = row.querySelector('td:first-child');
        let storyTd = firstTd.nextElementSibling;

        if (!storyTd || !storyTd.classList.contains('story-cell')) {
            storyTd = document.createElement('td');
            storyTd.className = 'story-cell';
            firstTd.insertAdjacentElement('afterend', storyTd);
        }
        return storyTd;
    };

    const createDetailElement = () => {
        const div = document.createElement('div');
        div.className = 'detail-content';
        div.innerHTML = '<div class="loading-dots">加载中</div>';
        return div;
    };

    // 表头处理
    const injectHeader = (table) => {
        const headers = table.querySelectorAll('thead tr th');
        if (headers[1]?.classList.contains('story-header')) return;

        const newHeader = document.createElement('th');
        newHeader.className = 'story-header';
        newHeader.textContent = COLUMN_NAME;
        headers[0].insertAdjacentElement('afterend', newHeader);
    };

    // 页脚修复
    const fixFooterColspan = (table) => {
        const tfoot = table.querySelector('tfoot');
        if (!tfoot) return;

        tfoot.querySelectorAll('td[colspan]').forEach(td => {
            const currentColspan = parseInt(td.getAttribute('colspan'));
            const actualColumns = table.querySelector('thead tr').childElementCount;
            td.setAttribute('colspan', actualColumns);
        });
    };

    // 工具函数
    const collectTaskIds = (table) => {
        return Array.from(table.querySelectorAll('tbody tr td:first-child'))
            .map(td => td.textContent.trim())
            .filter(id => /^\d+$/.test(id));
    };

    const getTaskId = (row) => row.querySelector('td:first-child').textContent.trim();

    const showColumnError = (table, msg) => {
        table.querySelectorAll('.story-cell').forEach(td => {
            td.innerHTML = `<span class="error-text">⚠️ ${msg}</span>`;
        });
    };

    // 启动
    setTimeout(init, 800);
})();
