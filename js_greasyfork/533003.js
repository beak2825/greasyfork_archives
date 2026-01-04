// ==UserScript==
// @name         canary-batch-apply
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  带Tag校验的批量发布工具，支持自动高度和完整进度跟踪
// @match        https://canary.zhumanggroup.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @connect      canary-api.zhumanggroup.net
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/533003/canary-batch-apply.user.js
// @updateURL https://update.greasyfork.org/scripts/533003/canary-batch-apply.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在正确的页面
    if (!window.location.href.includes('/#/app')) return;

    // 等待内容容器加载
    const waitForContainer = setInterval(function() {
        const container = $('.content-container').first();
        if (container.length) {
            clearInterval(waitForContainer);
            initBatchForm(container);
        }
    }, 500);

    function initBatchForm(container) {
        // 添加CSS样式
        const css = `
            #batchReleaseForm {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-family: Arial, sans-serif;
                width: 100%;
                box-sizing: border-box;
            }
            .form-title {
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 16px;
            }
            .form-row {
                display: flex;
                gap: 15px;
                align-items: flex-start;
                width: 100%;
            }
            .form-group {
                flex: 1;
                min-width: 0;
            }
            #batchInput-container {
                flex: 3;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                font-size: 12px;
            }
            .form-control {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 13px;
                min-height: 80px;
                resize: vertical;
            }
            .env-radio-group {
                flex: 1;
                background: white;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ddd;
            }
            .env-radio {
                display: block;
                margin: 5px 0;
            }
            .btn-submit {
                padding: 8px 15px;
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                align-self: flex-end;
            }
            .example {
                color: #888;
                font-size: 11px;
                margin-top: 3px;
            }
            #progress {
                margin-top: 15px;
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #eee;
                padding: 10px;
                background: #f9f9f9;
                font-size: 13px;
            }
            .progress-item {
                margin-bottom: 5px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #eee;
            }
            .success {
                color: #52c41a;
            }
            .error {
                color: #f5222d;
            }
            .warning {
                color: #faad14;
            }
            .version-tip {
        margin-top: 15px;
        padding: 10px;
        background: #fffbe6;
        border: 1px solid #ffe58f;
        border-radius: 4px;
        font-size: 12px;
    }
    .version-tip ul {
        margin: 5px 0 0 20px;
        padding: 0;
    }
        `;
        $('head').append(`<style>${css}</style>`);

        // 创建表单HTML
        const formHtml = `
            <div id="batchReleaseForm">
                <h3 class="form-title">Canary批量发布工具</h3>
                <div class="form-row">
                    <div id="batchInput-container" class="form-group">
                        <label for="batchInput">发版内容（每行一个应用）</label>
                        <textarea id="batchInput" class="form-control" placeholder="格式：应用名称,发布Tag,回滚Tag,发布说明">soudian-bss,prod-bss-20220222-v1.0.1,prod-bss-20220120-v1.0.0,测试发布</textarea>
                        <div class="example">示例：soudian-php-backend-v2,prod-bk2-20250410-v1.2.2,prod-bk2-20250410-v1.2.2,修复订单问题</div>
                    </div>
                    <div class="env-radio-group">
                        <label>发布环境</label>
                        <label class="env-radio"><input type="radio" name="envType" value="pe" checked> PE环境</label>
                        <label class="env-radio"><input type="radio" name="envType" value="prod"> 生产环境</label>
                        <label class="env-radio"><input type="radio" name="envType" value="both"> 全部环境</label>
                    </div>
                    <button id="submitBatch" class="btn-submit">批量提交</button>
                </div>
                <div class="version-tip">
            <strong>版本规范要求：</strong>
            <ul>
                <li>发布Tag版本号必须 ≥ 回滚Tag版本号</li>
                <li>标准版本格式：v1.2.3 或 2023.12.01</li>
            </ul>
        </div>
                <div id="progress"></div>
            </div>
        `;
        container.prepend(formHtml);

        // 辅助函数：添加进度信息
        function addProgress(html) {
            $('#progress').append(`<div class="progress-item">${html}</div>`);
            $('#progress').scrollTop($('#progress')[0].scrollHeight);
        }

        // 辅助函数：检查是否全部完成
        function checkComplete(total, success, fail) {
            if (success + fail === total) {
                const summary = `处理完成: 成功 ${success} 个, 失败 ${fail} 个`;
                addProgress(`<strong>${summary}</strong>`);
                GM_notification({
                    title: "批量发布完成",
                    text: summary,
                    timeout: 5000
                });
            }
        }

        // 辅助函数：获取Cookie
        function getCookies() {
            return document.cookie.split(';').reduce((cookies, cookie) => {
                const [name, value] = cookie.split('=').map(c => c.trim());
                cookies[name] = value;
                return cookies;
            }, {});
        }

        // 辅助函数：创建请求头
        function createHeaders() {
            const cookies = getCookies();
            return {
                "Content-Type": "application/json",
                "Cookie": Object.entries(cookies).map(([name, value]) => `${name}=${value}`).join('; ')
            };
        }

        // 辅助函数：获取当前用户
        function getCurrentUser() {
            const userElement = $('.user-name, .username').first();
            if (userElement.length) return userElement.text().trim();
            const cookies = getCookies();
            return cookies.username || cookies.user || 'batch-user';
        }

        // 辅助函数：获取环境名称
        function getEnvName(envType) {
            return {
                'pe': 'PE环境',
                'prod': '生产环境',
                'both': '全部环境'
            }[envType] || '未知环境';
        }



/**
 * 完整且正确的版本比较函数（支持日期和语义化版本）
 * @param {string} v1 - 版本字符串1
 * @param {string} v2 - 版本字符串2
 * @returns {number} 1(v1>v2), 0(v1=v2), -1(v1<v2)
 */
function compareVersions(v1, v2) {
    // 安全处理输入
    if (typeof v1 !== 'string' || typeof v2 !== 'string') {
        throw new Error('版本参数必须是字符串');
    }

    // 提取版本组件
    const extractComponents = (str) => {
        const components = [];

        // 提取日期部分（8位连续数字）
        const dateMatch = str.match(/(^|[^\d])(\d{8})([^\d]|$)/);
        if (dateMatch) {
            components.push({
                type: 'date',
                value: dateMatch[2] // YYYYMMDD
            });
        }

        // 提取语义化版本（v1.2.3或1.2.3格式）
        const semverMatch = str.match(/(v?\d+(?:[.-]\d+)*)/i);
        if (semverMatch) {
            components.push({
                type: 'semver',
                value: semverMatch[0].replace(/^v/, '') // 移除v前缀
            });
        }

        return components.length ? components : null;
    };

    // 比较两个日期字符串（YYYYMMDD格式）
    const compareDates = (dateStr1, dateStr2) => {
        const d1 = new Date(
            dateStr1.substr(0, 4), // 年
            dateStr1.substr(4, 2) - 1, // 月（0-based）
            dateStr1.substr(6, 2) // 日
        );
        const d2 = new Date(
            dateStr2.substr(0, 4),
            dateStr2.substr(4, 2) - 1,
            dateStr2.substr(6, 2)
        );
        return d1 > d2 ? 1 : (d1 < d2 ? -1 : 0);
    };

    // 比较语义化版本
    const compareSemver = (ver1, ver2) => {
        const parts1 = ver1.split(/[.-]/);
        const parts2 = ver2.split(/[.-]/);

        const maxLength = Math.max(parts1.length, parts2.length);
        for (let i = 0; i < maxLength; i++) {
            const num1 = parseInt(parts1[i] || 0, 10);
            const num2 = parseInt(parts2[i] || 0, 10);

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        return 0;
    };

    // 主比较逻辑
    try {
        const comp1 = extractComponents(v1) || [{ type: 'raw', value: v1 }];
        const comp2 = extractComponents(v2) || [{ type: 'raw', value: v2 }];

        // 优先比较日期
        const date1 = comp1.find(c => c.type === 'date');
        const date2 = comp2.find(c => c.type === 'date');
        if (date1 && date2) {
            const dateCompare = compareDates(date1.value, date2.value);
            if (dateCompare !== 0) return dateCompare;
        }

        // 其次比较语义化版本
        const semver1 = comp1.find(c => c.type === 'semver');
        const semver2 = comp2.find(c => c.type === 'semver');
        if (semver1 && semver2) {
            const semverCompare = compareSemver(semver1.value, semver2.value);
            if (semverCompare !== 0) return semverCompare;
        }

        // 最后回退到字符串比较
        return v1.localeCompare(v2);

    } catch (e) {
        console.error('版本比较出错:', e);
        return v1.localeCompare(v2); // 出错时回退到字符串比较
    }
}

        // 主提交函数
        $('#submitBatch').click(async function() {
            const inputText = $('#batchInput').val().trim();
            const envType = $('input[name="envType"]:checked').val();

            if (!inputText) {
                alert('请输入发布内容');
                return;
            }

            // 解析输入
            const lines = inputText.split('\n').filter(line => line.trim() !== '');
            const apps = [];
            const errorLines = [];

            lines.forEach((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length >= 4) {
                    apps.push({
                        appName: parts[0],
                        publishTag: parts[1],
                        rollbackTag: parts[2] || parts[1],
                        note: parts.slice(3).join(','),
                        lineNumber: index + 1
                    });
                } else {
                    errorLines.push(index + 1);
                }
            });

            if (errorLines.length > 0) {
                alert(`以下行格式错误（需要4个逗号分隔字段）：\n${errorLines.join(', ')}`);
                return;
            }

            if (apps.length === 0) {
                alert('没有有效的发布内容');
                return;
            }

            if (!confirm(`确认提交 ${apps.length} 个应用到${getEnvName(envType)}吗？`)) {
                return;
            }

            $('#progress').html('');
            addProgress(`开始处理 ${apps.length} 个应用...`);

            let successCount = 0;
            let failCount = 0;

            // 获取应用Tag列表
            async function getAppTags(appId,appname) {
                try {
                    const response = await new Promise((resolve) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://canary-api.zhumanggroup.net/image_version/",
                            headers: createHeaders(),
                            data: JSON.stringify({images_source:"aliyun",repository_name:appname,chart_name:appname,project_id:appId}),
                            onload: resolve
                        });
                    });

                    const data = JSON.parse(response.responseText);
                    return data.status === 0 && data.data.tag_list ;
                } catch {
                    return null;
                }
            }

            // 处理每个应用
            for (const app of apps) {
                addProgress(`[行${app.lineNumber}] 处理 ${app.appName}...`);

                 // 新增：版本号比较校验
                const versionComparison = compareVersions(app.publishTag, app.rollbackTag);
                console.log(versionComparison)
                if (versionComparison === -1) {
                    addProgress(`<span class="error">[行${app.lineNumber}] 发布Tag[${app.publishTag}] 版本低于回滚Tag[${app.rollbackTag}]</span>`);
                    failCount++;
                    continue;
                }


                try {
                    // 1. 获取应用ID
                    const appId = await new Promise((resolve) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://canary-api.zhumanggroup.net/app_list/",
                            headers: createHeaders(),
                            data: JSON.stringify({
                                current_page: 1,
                                line: 10,
                                query_content: app.appName,
                                field_content: "",
                                mult_query_fields: {
                                    app_name: "", app_alias: "", app_belong: "",
                                    app_status: "", app_gray_scale: "", remarks: ""
                                }
                            }),
                            onload: function(response) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    resolve(data.status === 0 && data.res_list?.[0]?.id || null);
                                } catch {
                                    resolve(null);
                                }
                            }
                        });
                    });

                    if (!appId) {
                        addProgress(`<span class="error">[行${app.lineNumber}] 应用不存在</span>`);
                        failCount++;
                        continue;
                    }

                    // 2. 校验Tag
                    const tags = await getAppTags(appId,app.appName);
                    if (!tags) {
                        addProgress(`<span class="warning">[行${app.lineNumber}] 无法获取Tag列表</span>`);
                        failCount++;
                        continue;
                    }

                    const invalidTags = [];
                    if (!tags.includes(app.publishTag)) {
                        invalidTags.push(`发布Tag:${app.publishTag}`);
                    }
                    if (!tags.includes(app.rollbackTag)) {
                        invalidTags.push(`回滚Tag:${app.rollbackTag}`);
                    }

                    if (invalidTags.length > 0) {
                        addProgress(`<span class="error">[行${app.lineNumber}] 无效Tag: ${invalidTags.join(', ')}</span>`);
                        failCount++;
                        continue;
                    }

                    // 3. 获取环境列表
                    const envs = await new Promise((resolve) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://canary-api.zhumanggroup.net/release_name_list/",
                            headers: createHeaders(),
                            data: JSON.stringify({ app_id: appId }),
                            onload: function(response) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data.status === 0 && data.data) {
                                        const filtered = data.data.filter(env => {
                                            if (envType === 'pe') return env.includes('-pe-');
                                            if (envType === 'prod') return env.includes('-prod');
                                            return true;
                                        });
                                        resolve(filtered.length > 0 ? filtered : null);
                                    } else {
                                        resolve(null);
                                    }
                                } catch {
                                    resolve(null);
                                }
                            }
                        });
                    });

                    if (!envs) {
                        addProgress(`<span class="error">[行${app.lineNumber}] 无匹配环境</span>`);
                        failCount++;
                        continue;
                    }

                    // 4. 提交发布
                    const applyRes = await new Promise((resolve) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://canary-api.zhumanggroup.net/app_apply/",
                            headers: createHeaders(),
                            data: JSON.stringify({
                                app_name: app.appName,
                                app_alias: app.appName,
                                app_belong: app.appName.split('-')[0] || "default",
                                app_apply_user: getCurrentUser(),
                                app_pub_env: getEnvName(envType),
                                app_pub_ver: "",
                                app_image_version: app.publishTag,
                                app_rollback_tag: app.rollbackTag,
                                app_pub_helm: envs,
                                app_pub_txt: app.note || "批量发布",
                                app_email: "0",
                                app_local_path: "/home/gitsource",
                                task_id: `batch-${Date.now()}-${app.lineNumber}`,
                                is_critical: 0
                            }),
                            onload: function(response) {
                                try {
                                    resolve(JSON.parse(response.responseText));
                                } catch {
                                    resolve(false);
                                }
                            }
                        });
                    });

                    if (applyRes.status===0) {
                        addProgress(`<span class="success">[行${app.lineNumber}] 发布成功 (${envs.length}环境)</span>`);
                        successCount++;
                    } else {
                        addProgress(`<span class="error">[行${app.lineNumber}] 发布失败, 原因:${applyRes.msg}</span>`);
                        failCount++;
                    }
                } catch (e) {
                    addProgress(`<span class="error">[行${app.lineNumber}] 处理错误: ${e.message}</span>`);
                    failCount++;
                }

                checkComplete(apps.length, successCount, failCount);
            }
        });
    }
})();