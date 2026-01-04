// ==UserScript==
// @name         固态免流全自动取消助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动取消任务并生成统计报告
// @license MIT
// @match        https://springsunday.net/myfls.php?id=*&page=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_log
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @connect      self
// @downloadURL https://update.greasyfork.org/scripts/530179/%E5%9B%BA%E6%80%81%E5%85%8D%E6%B5%81%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530179/%E5%9B%BA%E6%80%81%E5%85%8D%E6%B5%81%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局配置
    const CONFIG = {
        DEBUG: false,           // 调试模式
        REQUEST_DELAY: 800,     // 请求间隔(ms)
        MAX_RETRIES: 3,         // 最大重试次数
        FADE_OPACITY: 0.4,      // 完成后的透明度
        Z_INDEX: 2147483647     // 控制面板层级
    };

    // 样式定制
    GM_addStyle(`
        #autoCancelPanel {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            min-width: 220px;
            padding: 15px;
            background: #fff !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: ${CONFIG.Z_INDEX} !important;
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        #autoCancelBtn {
            padding: 8px 20px;
            width: 100%;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        #autoCancelBtn:disabled {
            background: #90CAF9;
            cursor: not-allowed;
        }
        .progress-container {
            margin: 12px 0;
        }
        .progress-bar {
            height: 6px;
            background: #eee;
            border-radius: 3px;
            overflow: hidden;
        }
        .progress-fill {
            width: 0%;
            height: 100%;
            background: #4CAF50;
            transition: width 0.3s ease;
        }
        .stats-info {
            margin-top: 10px;
            font-size: 13px;
            color: #666;
            line-height: 1.4;
        }
        .stats-info strong {
            color: #333;
        }
    `);

    // 主控制器
    class AutoCancelController {
        constructor() {
            this.totalCount = 0;
            this.processed = 0;
            this.successCount = 0;
            this.errorCount = 0;
            this.totalSizeGB = 0;
            this.originalConfirm = null;
        }

        // 初始化面板
        initControlPanel() {
            if (document.getElementById('autoCancelPanel')) return;

            const panelHTML = `
                <button id="autoCancelBtn">🚀 开始自动处理</button>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                <div class="stats-info">
                    <div>总任务: <strong id="totalTasks">0</strong></div>
                    <div>进度: <strong id="progressPercent">0%</strong></div>
                    <div>成功: <strong id="successCount">0</strong></div>
                    <div>失败: <strong id="errorCount">0</strong></div>
                    <div>总量: <strong id="totalSize">0 GB</strong></div>
                </div>
            `;

            const panel = document.createElement('div');
            panel.id = 'autoCancelPanel';
            panel.innerHTML = panelHTML;
            document.documentElement.appendChild(panel);

            // 事件绑定
            document.getElementById('autoCancelBtn').addEventListener('click', () => this.startProcessing());
        }

        // 覆盖取消函数
        overrideCancelFunction() {
            window.cancel_fl = async (element, tid) => {
                try {
                    const result = await this.sendCancelRequest(tid);
                    if (result) {
                        $(element).closest('tr').css('opacity', CONFIG.FADE_OPACITY);
                    }
                    return result;
                } catch (error) {
                    CONFIG.DEBUG && console.error('取消操作失败:', error);
                    return false;
                }
            };
        }

        // 发送取消请求
        async sendCancelRequest(tid) {
            for (let retry = 0; retry <= CONFIG.MAX_RETRIES; retry++) {
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "myfls.php?action=cancel",
                            data: `tid=${encodeURIComponent(tid)}`,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                "X-Requested-With": "XMLHttpRequest"
                            },
                            timeout: 10000,
                            onload: (res) => res.status === 200 ? resolve(res) : reject(res),
                            onerror: reject,
                            ontimeout: () => reject(new Error('请求超时'))
                        });
                    });

                    if (response.status === 200) {
                        return true;
                    }
                } catch (error) {
                    if (retry === CONFIG.MAX_RETRIES) throw error;
                    await new Promise(r => setTimeout(r, 1000 * (retry + 1)));
                }
            }
            return false;
        }

        // 单位转换
        convertToGB(sizeStr) {
            const units = { B: 1e-9, KB: 1e-6, MB: 1e-3, GB: 1 };
            const match = sizeStr.match(/(\d+\.?\d*)\s*?(B|KB|MB|GB)/i);
            return match ? parseFloat(match[1]) * units[match[2].toUpperCase()] : 0;
        }

        // 更新界面状态
        updateProgress() {
            const percent = ((this.processed / this.totalCount) * 100).toFixed(1);
            document.querySelector('.progress-fill').style.width = `${percent}%`;
            document.getElementById('progressPercent').textContent = `${percent}%`;
            document.getElementById('successCount').textContent = this.successCount;
            document.getElementById('errorCount').textContent = this.errorCount;
            document.getElementById('totalSize').textContent = `${this.totalSizeGB.toFixed(2)} GB`;
        }

        // 主处理流程
        async startProcessing() {
            const btn = document.getElementById('autoCancelBtn');
            btn.disabled = true;

            try {
                const rows = Array.from(document.querySelectorAll('tr.align-center'));
                this.totalCount = rows.length;
                document.getElementById('totalTasks').textContent = this.totalCount;

                // 备份原始确认函数
                this.originalConfirm = window.confirm;
                window.confirm = () => true;

                for (const [index, row] of rows.entries()) {
                    const btnElement = row.querySelector('button[onclick^="cancel_fl"]');
                    const sizeElement = row.querySelector('.rowfollow.align-right');

                    if (!btnElement || !sizeElement) {
                        this.errorCount++;
                        continue;
                    }

                    // 提取TID
                    const tidMatch = btnElement.onclick?.toString().match(/\d+/);
                    if (!tidMatch) {
                        this.errorCount++;
                        continue;
                    }

                    try {
                        // 执行取消操作
                        const success = await window.cancel_fl(btnElement, tidMatch[0]);

                        if (success) {
                            this.successCount++;
                            this.totalSizeGB += this.convertToGB(sizeElement.textContent.trim());
                        } else {
                            this.errorCount++;
                        }
                    } catch (error) {
                        this.errorCount++;
                        CONFIG.DEBUG && console.error(`第 ${index + 1} 项处理失败:`, error);
                    }

                    this.processed = index + 1;
                    this.updateProgress();

                    // 随机延迟防止封禁
                    await new Promise(r => setTimeout(r, CONFIG.REQUEST_DELAY * (0.8 + Math.random() * 0.4)));
                }

                GM_notification({
                    title: '✅ 处理完成',
                    text: `成功: ${this.successCount} 项 | 总量: ${this.totalSizeGB.toFixed(2)}GB`,
                    timeout: 5000
                });
            } finally {
                btn.disabled = false;
                window.confirm = this.originalConfirm;
            }
        }
    }

    // 初始化执行
    (function init() {
        const controller = new AutoCancelController();

        const setup = () => {
            controller.initControlPanel();
            controller.overrideCancelFunction();
            window.__autoCancelController = controller; // 暴露到全局用于调试
        };

        if (document.readyState === 'complete') {
            setup();
        } else {
            window.addEventListener('load', setup);
            const observer = new MutationObserver((mutations) => {
                if (document.body) {
                    setup();
                    observer.disconnect();
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        }
    })();

})();