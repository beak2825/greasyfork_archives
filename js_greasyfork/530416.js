// ==UserScript==
// @name         OPS页面AppID占用搜索
// @namespace    http://your-namespace.com/
// @version      4.2
// @description  修改接口与相关内容
// @author       barrylou
// @license      barrylou
// @match        *://ops.xiaoe-tools.com/*
// @icon         https://commonresource-1252524126.cdn.xiaoeknow.com/image/lhyaurs50zil.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530416/OPS%E9%A1%B5%E9%9D%A2AppID%E5%8D%A0%E7%94%A8%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/530416/OPS%E9%A1%B5%E9%9D%A2AppID%E5%8D%A0%E7%94%A8%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 样式配置 ====================
    GM_addStyle(`
        #custom-search-container {
            position: fixed;
            top: 0px;
            right: 10px;
            z-index: 99999;
            width: 280px;
            background: white;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        #custom-search-close {
            position: absolute;
            top: 0px;
            right: 10px;
            background: none;
            border: none;
            font-size: 30px;
            cursor: pointer;
            color: #ff0000;
            padding: 0;
        }

        #custom-search-close:hover {
            color: #cc0000;
        }

        #custom-search-input {
            width: 100%;
            height: 54px;
            padding: 8px;
            margin-bottom: 8px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            box-sizing: border-box;
            resize: vertical;
            font-size: 13px;
            line-height: 1.5;
        }

        #custom-search-button {
            width: 100%;
            padding: 8px;
            background: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        }

        #custom-search-button:hover {
            background: #66b1ff;
        }

        #custom-search-result {
            display: none;
            margin-top: 12px;
            max-height: 60vh;
            overflow-y: auto;
        }

        .result-item {
            padding: 12px;
            margin: 8px 0;
            background: #f8f9fa;
            border-radius: 4px;
            border: 1px solid #ebeef5;
            font-size: 13px;
        }

        .result-item div {
            margin: 4px 0;
        }

        .app-id {
            font-weight: 500;
            color: #303133;
        }

        .plan-link {
            color: #409eff;
            text-decoration: underline;
            word-break: break-all;
        }

        .status-tag {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            margin-bottom: 4px;
        }

        .no-plan {
            background: #e1f3d8;
            color: #67c23a;
        }

        .available {
            background: #e1f3d8;
            color: #67c23a;
        }

        .has-plan {
             background: #fde2e2;
             color: #f56c6c;
        }

        .invalid {
            background: #fde2e2;
            color: #f56c6c;
        }

        .filtered-by-label {
            background: #f4f4f5;
            color: #909399;
        }

        .loading-text {
            color: #909399;
            text-align: center;
            padding: 10px;
        }

        .error-text {
            color: #f56c6c;
            padding: 8px;
            border-radius: 4px;
            background: #fef0f0;
        }

        .err-msg {
            color: #606266;
            font-size: 12px;
            margin-top: 4px;
            word-break: break-all;
        }
    `);

    // ==================== 核心逻辑 ====================
    const AppSearch = {
        init() {
            this.createElements();
            this.bindEvents();
        },

        createElements() {
            this.container = document.createElement('div');
            this.container.id = 'custom-search-container';

            this.closeButton = document.createElement('button');
            this.closeButton.id = 'custom-search-close';
            this.closeButton.textContent = '×';

            this.input = document.createElement('textarea');
            this.input.id = 'custom-search-input';
            this.input.placeholder = '输入AppID（支持多行/逗号分隔）';

            this.button = document.createElement('button');
            this.button.id = 'custom-search-button';
            this.button.textContent = '立即查询';

            this.resultContainer = document.createElement('div');
            this.resultContainer.id = 'custom-search-result';

            this.container.append(this.closeButton, this.input, this.button, this.resultContainer);
            document.body.appendChild(this.container);
        },

        bindEvents() {
            this.button.addEventListener('click', () => this.handleSearch());
            this.input.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSearch();
                }
            });
            this.closeButton.addEventListener('click', () => this.hideContainer());
        },

        hideContainer() {
            this.container.style.display = 'none';
        },

        handleSearch() {
            const rawInput = this.input.value.trim();
            if (!rawInput) return this.showError('请输入至少一个AppID');

            const appIds = this.parseAppIds(rawInput);
            if (appIds.length === 0) return this.showError('未检测到有效AppID');

            this.showLoading(appIds);
            this.queryAppStatus(appIds);
        },

        parseAppIds(input) {
            return input.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        },

        async queryAppStatus(appIds) {
            try {
                const response = await this.post(
                    '/ops/gray_setting/select_appid',
                    {
                        app_ids: appIds.join(','),
                        label_ids: [],
                        filter_label_ids: [],
                        task_id: 71676
                    }
                );

                this.processResponse(response.data, appIds);
            } catch (error) {
                this.showError(`查询失败: ${error.message}`);
            }
        },

        processResponse(data, originalAppIds) {
            const results = originalAppIds.map(appId => ({
                appId,
                status: 'unknown', // 初始状态
                planId: null,
                errMsg: null
            }));

            // 分类处理四种状态
            this.classifyAppIds(data, results);
            this.renderResults(results);
        },

        classifyAppIds(data, results) {
            // 1. 有计划的AppID - 对象数组，包含plan_id和err_msg
            data.filter_list_by_plan?.forEach(item => {
                const target = this.findAppResult(results, item.app_id);
                if (target) {
                    target.status = 'has_plan';
                    target.planId = item.plan_id;
                    target.errMsg = item.err_msg;
                }
            });

            // 2. 非法的AppID - 对象数组，包含err_msg
            data.filter_list_by_invalid?.forEach(item => {
                const target = this.findAppResult(results, item.app_id);
                if (target) {
                    target.status = 'invalid';
                    target.errMsg = item.err_msg;
                }
            });

            // 3. 被标签过滤的AppID - 字符串数组，只有app_id
            data.filter_list_by_label?.forEach(appId => {
                const target = this.findAppResult(results, appId);
                if (target) target.status = 'filtered_by_label';
            });

            // 4. 可用的AppID - 字符串数组，只有app_id
            data.is_use_list?.forEach(appId => {
                const target = this.findAppResult(results, appId);
                if (target) target.status = 'available';
            });

            // 5. 剩余的就是无占用的AppID
            results.forEach(item => {
                if (item.status === 'unknown') {
                    item.status = 'no_plan';
                }
            });
        },

        findAppResult(results, appId) {
            return results.find(r => r.appId && appId && r.appId.toLowerCase() === appId.toLowerCase());
        },

        async post(path, data) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `https://ops.xiaoe-tools.com${path}`,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(data),
                    onload: (res) => {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            reject(new Error('响应解析失败'));
                        }
                    },
                    onerror: (err) => reject(err)
                });
            });
        },

        showLoading(appIds) {
            this.resultContainer.style.display = 'block';
            this.resultContainer.innerHTML = `
                <div class="loading-text">
                    正在查询 ${appIds.length} 个AppID...
                </div>
            `;
        },

        renderResults(results) {
            this.resultContainer.style.display = 'block';
            this.resultContainer.innerHTML = results.map(item => `
                <div class="result-item">
                    <div class="app-id">${item.appId}</div>
                    ${this.getStatusContent(item)}
                </div>
            `).join('') || '<div class="result-item">未找到有效数据</div>';
        },

        getStatusContent(item) {
            switch (item.status) {
                case 'has_plan':
                    return `
                        <div><span class="status-tag has-plan">被占用</span></div>
                        <div>计划：${this.getPlanLink(item)}</div>
                    `;
                case 'available':
                    return '<div><span class="status-tag available">可用</span></div>';
                case 'no_plan':
                    return '<div><span class="status-tag no-plan">无占用</span></div>';
                case 'filtered_by_label':
                    return '<div><span class="status-tag filtered-by-label">被标签过滤</span></div>';
                case 'invalid':
                    return `
                        <div><span class="status-tag invalid">非法AppID</span></div>
                        ${item.errMsg ? `<div class="err-msg">${item.errMsg}</div>` : ''}
                    `;
                default:
                    return '<div class="error-text">未知状态</div>';
            }
        },

        getPlanLink(item) {
            const displayName = item.errMsg || '未知计划';
            return item.planId
                ? `<a class="plan-link"
                     href="https://ops.xiaoe-tools.com/#/xiaoe_bus/workplan/plan_details/${item.planId}"
                     target="_blank">
                        ${displayName}
                   </a>`
                : displayName;
        },

        showError(msg) {
            this.resultContainer.style.display = 'block';
            this.resultContainer.innerHTML = `
                <div class="error-text">
                    ${msg}
                </div>
            `;
        }
    };

    // 初始化
    if (document.body) AppSearch.init();
    else window.addEventListener('DOMContentLoaded', () => AppSearch.init());
})();