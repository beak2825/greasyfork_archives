// ==UserScript==
// @license MIT
// @name         AGsvPT 批量审种助手（精准识别版 v1.7）
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  针对AGsvPT审核页面的智能批量处理方案
// @author       YourName
// @match        *://*.agsvpt.com/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539851/AGsvPT%20%E6%89%B9%E9%87%8F%E5%AE%A1%E7%A7%8D%E5%8A%A9%E6%89%8B%EF%BC%88%E7%B2%BE%E5%87%86%E8%AF%86%E5%88%AB%E7%89%88%20v17%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539851/AGsvPT%20%E6%89%B9%E9%87%8F%E5%AE%A1%E7%A7%8D%E5%8A%A9%E6%89%8B%EF%BC%88%E7%B2%BE%E5%87%86%E8%AF%86%E5%88%AB%E7%89%88%20v17%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 增强配置系统
    const config = {
        autoCheck: GM_getValue('autoCheck', false),
        batchSize: GM_getValue('batchSize', 5),
        delayTime: GM_getValue('delayTime', 2000),
        skipChecked: GM_getValue('skipChecked', true),
        maxAttempts: 15,
        reviewPagePatterns: [
            /\/modqueue(?:\/|$)/i,
            /\/moderation\.php/i,
            /\/review(?:\/|$)/i,
            /\/pending(?:\/|$)/i,
            /action=(viewqueue|review)/i
        ]
    };

    // 增强状态管理
    const state = {
        isRunning: false,
        currentBatch: 0,
        processed: 0,
        errors: 0,
        torrentQueue: []
    };

    // 样式隔离
    GM_addStyle(`
        #batch-review-controls {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f8f9fa !important;
            border: 1px solid #dee2e6 !important;
            box-shadow: 0 .5rem 1rem rgba(0,0,0,.15) !important;
            min-width: 280px;
            max-width: 320px;
        }
        .batch-progress {
            height: 4px;
            background: #e9ecef;
            margin: 8px 0;
            border-radius: 2px;
            overflow: hidden;
        }
        .batch-progress-bar {
            height: 100%;
            background: #4CAF50;
            transition: width 0.3s ease;
        }
    `);

    // 智能页面识别
    function isModPage() {
        try {
            // URL匹配强化
            const pathCheck = config.reviewPagePatterns.some(p => 
                p.test(location.pathname + location.search)
            );
            
            // DOM特征验证
            const domFeatures = {
                hasReviewTable: $('table.torrents:has(th:contains("Status"))').length > 0,
                hasModButtons: $('a[href*="moderation"], button:contains("Approve")').length > 0,
                queueCount: parseInt($('div.header:contains("Queue") h2').text().match(/\d+/)?.[0]) > 0
            };

            return pathCheck || domFeatures.hasReviewTable || domFeatures.hasModButtons;
        } catch (e) {
            console.error("Page detection error:", e);
            return false;
        }
    }

    // 高级链接收集
    function getTorrentLinks() {
        const linkSelectors = [
            'a[href*="moderation.php?id="]',
            'a[href*="action=review"][href*="id="]',
            '.torrent_row[id^="torrent_"] a[href^="torrents.php?id="]',
            'table.torrents a[href*="id="]:not([href*="download"])'
        ];

        return $(linkSelectors.join(', ')).map(function() {
            const $link = $(this);
            const url = new URL($link.attr('href'), location.origin);
            const id = url.searchParams.get('id');
            
            return id ? {
                id: id,
                url: url.toString(),
                element: this,
                processed: GM_getValue(`processed_${id}`, false)
            } : null;
        }).get().filter(t => t && !t.processed);
    }

    // 增强批处理控制
    function addBatchControls() {
        const controlsHTML = `
        <div id="batch-review-controls">
            <h3>批量审种助手 v1.7
                <span id="batch-indicator"></span>
            </h3>
            <div class="batch-progress">
                <div class="batch-progress-bar" style="width:0%"></div>
            </div>
            <div class="controls">
                <button id="start-batch-review">开始处理</button>
                <button id="stop-batch-review">暂停</button>
            </div>
            <div id="batch-status">
                <div>待处理: <span id="pending-count">0</span></div>
                <div>成功: <span id="success-count">0</span></div>
                <div>失败: <span id="error-count">0</span></div>
            </div>
        </div>`;

        $('#batch-review-controls').remove();
        $('body').append(controlsHTML);

        // 动态更新状态
        const updateUI = () => {
            $('#pending-count').text(state.torrentQueue.length);
            $('#success-count').text(state.processed);
            $('#error-count').text(state.errors);
            $('.batch-progress-bar').css('width', 
                `${(state.processed / (state.processed + state.torrentQueue.length)) * 100}%`
            );
        };

        $('#start-batch-review').click(() => {
            if (!state.isRunning) startBatchReview();
        });
        
        $('#stop-batch-review').click(() => {
            state.isRunning = false;
            updateStatus('处理已暂停');
        });

        updateUI();
    }

    // 批处理核心逻辑
    async function startBatchReview() {
        if (!isModPage()) return showAlert('请导航至审核页面');
        
        state.torrentQueue = getTorrentLinks();
        if (!state.torrentQueue.length) return showAlert('没有待处理的种子');

        state.isRunning = true;
        updateStatus('正在初始化...');

        while (state.isRunning && state.torrentQueue.length) {
            const batch = state.torrentQueue.splice(0, config.batchSize);
            await processBatch(batch);
            await delay(config.delayTime);
        }

        state.isRunning = false;
        updateStatus(state.errors ? '处理完成（有错误）' : '处理完成');
    }

    // 批处理执行细节
    async function processBatch(batch) {
        for (const [index, torrent] of batch.entries()) {
            if (!state.isRunning) break;
            
            try {
                const result = await handleTorrent(torrent);
                if (result.success) {
                    GM_setValue(`processed_${torrent.id}`, true);
                    state.processed++;
                    $(torrent.element).closest('tr').fadeOut();
                } else {
                    state.errors++;
                }
                updateStatus(`处理中 ${state.processed + 1}/${state.torrentQueue.length}`);
            } catch (e) {
                console.error(`处理种子 ${torrent.id} 失败:`, e);
                state.errors++;
            }
            await delay(500);
        }
    }

    // 完整处理逻辑
    async function handleTorrent(torrent) {
        const response = await fetch(torrent.url);
        const html = await response.text();
        const formData = parseReviewForm(html);
        
        if (!formData) return { success: false };
        
        const approvalResponse = await submitApproval(formData);
        return { success: approvalResponse.ok };
    }

    // 辅助函数
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    function parseReviewForm(html) {
        const $doc = $(html);
        const form = $doc.find('form#review_form');
        return form.serializeArray().reduce((acc, { name, value }) => {
            acc[name] = value;
            return acc;
        }, {});
    }

    async function submitApproval(data) {
        return fetch('https://agsvpt.com/moderation.php', {
            method: 'POST',
            body: new URLSearchParams(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    // 初始化逻辑
    function initialize() {
        if (!isModPage()) return;
        
        const observer = new MutationObserver(() => {
            if (!document.querySelector('#batch-review-controls')) {
                addBatchControls();
            }
        });
        
        observer.observe(document.body, { childList: true });
        if (config.autoCheck) setTimeout(startBatchReview, 1500);
    }

    // 安全启动
    window.addEventListener('load', initialize);
})();
