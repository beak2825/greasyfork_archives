// ==UserScript==
// @name         阿里云百炼模型到期时间提取器
// @name:en      Bailian Model Expiry Extractor
// @name:zh      阿里云百炼模型到期时间提取器
// @namespace    https://greasyfork.org/zh-CN/scripts/543956-%E9%98%BF%E9%87%8C%E4%BA%91%E7%99%BE%E7%82%BC%E6%A8%A1%E5%9E%8B%E5%88%B0%E6%9C%9F%E6%97%B6%E9%97%B4%E6%8F%90%E5%8F%96%E5%99%A8
// @version      1.5.3
// @author       will
// @description  精准提取模型名称、Code、免费额度（支持百分比/无额度）、倒计时、到期时间，一键复制 Code。
// @description:en Accurately extract model name, code, quota (%, 0, or N/M), countdown, expiry, and copy code.
// @license      MIT
// @homepage     https://github.com/jwq2011/TamperMonkey-Scripts
// @supportURL   https://github.com/jwq2011/TamperMonkey-Scripts/issues
// @match        https://bailian.console.aliyun.com/console*
// @grant        GM_setClipboard
// @run-at       document-start
// @compatible   tampermonkey
// @compatible   violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/543956/Bailian%20Model%20Expiry%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/543956/Bailian%20Model%20Expiry%20Extractor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;
    const LOG_PREFIX = '[Bailian Expiry+]';

    function log(...args) {
        if (DEBUG) console.log(LOG_PREFIX, ...args);
    }

    let extractedData = [];

    // 用户可自定义显示哪些列（默认只显示原始5个）
    const userSettings = {
        showModelType: false,     // 模型类型
        showContextLength: false, // 上下文长度
        showPrice: false,          // 价格
        showProtocol: false,      // 模型协议
        showLimit: false,         // 限流
        showDescription: false,    // 描述
        showVendor: false,        // 供应商（子页面无）
        showUpdateTime: false,     // 更新时间（子页面无）
    };

    (function loadUserSettings() {
        try {
            const saved = localStorage.getItem('bailian_user_settings');
            if (saved) {
                Object.assign(userSettings, JSON.parse(saved));
            }
        } catch (e) {
            console.error('[Bailian Settings] 加载用户设置失败:', e);
        }
    })();

    // 等待页面完全加载
    function waitForPageReady() {
        return new Promise((resolve) => {
            // 如果页面已经加载完成，直接返回
            if (document.readyState === 'complete') {
                resolve();
                return;
            }

            // 等待页面加载完成
            const checkInterval = setInterval(() => {
                if (document.readyState === 'complete') {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50); // 更快的检查频率

            // 超时处理
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 2000);
        });
    }

    // 等待表格出现 - 优化版本
    function waitForTable(maxWaitTime = 3000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            function check() {
                const table = document.querySelector('.efm_ant-table');
                if (table) {
                    log('✅ 表格已加载');
                    resolve({ success: true, table });
                    return;
                }

                if (Date.now() - startTime > maxWaitTime) {
                    log('⚠️ 等待表格超时');
                    resolve({ success: false, table: null });
                    return;
                }

                // 更小的检查间隔
                setTimeout(check, 50);
            }

            check();
        });
    }

    // 等待特定元素出现 - 优化版本
    function waitForElement(selector, maxWaitTime = 2000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > maxWaitTime) {
                    resolve(null);
                    return;
                }

                setTimeout(check, 50);
            }

            check();
        });
    }

    // 等待并检测列表视图按钮
    async function waitForListViewButton() {
        // 等待一段时间让页面完全渲染
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 查找所有可能的列表视图按钮
        const listViewIcons = document.querySelectorAll('.bl-icon-list-line');
        log(`找到 ${listViewIcons.length} 个列表视图图标`);

        for (let i = 0; i < listViewIcons.length; i++) {
            const icon = listViewIcons[i];
            const button = icon.closest('button');

            // 检查按钮是否可见且可点击
            if (button && button.offsetWidth > 0 && button.offsetHeight > 0) {
                log(`按钮 ${i+1} 可见，正在检查是否已经是列表视图...`);
                // 检查是否有active类
                if (button.classList.contains('active__VRFfX')) {
                    log(`✅ 按钮 ${i+1} 已经是激活状态`);
                    return { success: true, button: null, alreadyActive: true }; // 已经是列表视图
                } else {
                    log(`✅ 找到可点击的列表视图按钮 ${i+1}`);
                    return { success: true, button, alreadyActive: false };
                }
            } else {
                log(`按钮 ${i+1} 不可见或无效`);
            }
        }

        log('⚠️ 未找到可点击的列表视图按钮');
        return { success: false, button: null, alreadyActive: false };
    }

    function createFloatingButton() {
        const btnId = 'bailian-extractor-btn';
        if (document.getElementById(btnId)) return;

        const button = document.createElement('button');
        button.id = btnId;
        Object.assign(button.style, {
            position: 'fixed', top: '80px', right: '20px', zIndex: '2147483647',
            backgroundColor: '#ff6a00', color: 'white', border: 'none',
            padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            opacity: 0.95, fontFamily: 'Arial, sans-serif'
        });
        button.textContent = '📊 提取模型信息';

        // 自动切换到列表视图（精准判断）- 优化版本
        async function switchToListView() {
            log('🔍 正在尝试切换到列表视图...');

            // 快速检查当前视图状态
            const currentViewIcon = document.querySelector('.bl-icon-list-line.active__VRFfX');
            if (currentViewIcon) {
                log('✅ 当前已是列表视图');
                return false;
            }

            // 使用更高效的等待方式
            await new Promise(resolve => setTimeout(resolve, 100));

            // 查找所有列表视图图标
            const listViewIcons = document.querySelectorAll('.bl-icon-list-line');
            log(`找到 ${listViewIcons.length} 个列表视图图标`);

            if (listViewIcons.length === 0) {
                log('⚠️ 未找到列表视图图标');
                return false;
            }

            // 遍历所有图标，找到可见的并尝试点击
            for (let i = 0; i < listViewIcons.length; i++) {
                const icon = listViewIcons[i];

                // 更快的可见性检测
                const rect = icon.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    log(`找到可见的列表视图图标 ${i+1}`);

                    // 检查是否已经是激活状态
                    if (!icon.classList.contains('active__VRFfX')) {
                        try {
                            log('正在点击列表视图图标...');
                            icon.click();
                            log('✅ 已点击切换到列表视图');
                            // 极短等待时间
                            await new Promise(resolve => setTimeout(resolve, 150));
                            return true;
                        } catch (error) {
                            log(`点击图标 ${i+1} 失败:`, error);
                        }
                    } else {
                        log(`图标 ${i+1} 已经激活`);
                        return false;
                    }
                } else {
                    log(`图标 ${i+1} 不可见`);
                }
            }

            log('⚠️ 未找到可点击的列表视图图标');
            return false;
        }

        // 修改按钮点击事件处理函数
        button.addEventListener('click', async () => {
            button.disabled = true;
            button.textContent = '🔍 提取中...';

            try {
                // 等待页面加载 - 更快的等待
                await waitForPageReady();

                // 等待表格出现 - 更快的超时
                const tableResult = await waitForTable(2000);

                // 自动切换视图
                let needWait = false;
                if (await switchToListView()) {
                    needWait = true;
                }

                // 自动展开折叠区域
                if (await autoExpandFoldedRows()) {
                    needWait = true;
                }

                // 等待 DOM 更新
                if (needWait) {
                    await new Promise(resolve => setTimeout(resolve, 150)); // 极短等待
                }

                const data = extractAllModels();
                if (data.length === 0) {
                    alert('❌ 未找到任何模型信息，请确认已打开【模型广场】页面并完全加载。');
                } else {
                    extractedData = data;
                    showResultsModal();
                }
            } catch (error) {
                console.error('执行过程中发生错误:', error);
                alert('❌ 执行过程中发生错误，请刷新页面后重试。');
            } finally {
                button.disabled = false;
                button.textContent = '📊 提取模型信息';
            }
        });

        document.body.appendChild(button);

        createSettingsPanel(); // 添加设置按钮

        log('✅ 按钮已创建');
    }

    // 自动展开折叠区域 - 优化版本
    async function autoExpandFoldedRows() {
        log('🔍 正在尝试展开折叠区域...');

        // 极短等待时间
        await new Promise(resolve => setTimeout(resolve, 100));

        let clicked = false;
        let expandedCount = 0;

        // 方法1: 查找所有展开/收起按钮
        const expandButtons = [...document.querySelectorAll('button.efm_ant-table-row-expand-icon')];
        log(`找到 ${expandButtons.length} 个展开/收起按钮`);

        for (const btn of expandButtons) {
            // 更快的可见性检测
            const rect = btn.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                // 检查是否为折叠状态
                const isCollapsed = btn.classList.contains('efm_ant-table-row-expand-icon-collapsed');
                const isExpanded = btn.classList.contains('efm_ant-table-row-expand-icon-expanded');

                if (isCollapsed) {
                    try {
                        btn.click();
                        log('✅ 点击展开按钮');
                        expandedCount++;
                        clicked = true;
                        // 极短等待
                        await new Promise(resolve => setTimeout(resolve, 50));
                    } catch (error) {
                        log('点击展开按钮失败:', error);
                    }
                } else if (isExpanded) {
                    log('✅ 按钮已是展开状态');
                }
            }
        }

        if (expandedCount > 0) {
            log(`✅ 成功展开 ${expandedCount} 个折叠项`);
        } else {
            log('⚠️ 未找到可展开的折叠项');
        }

        return clicked;
    }

    // 提取模型信息
    function extractAllModels() {
        log('🔍 开始提取模型数据...');

        // 等待表格出现
        const maxWaitTime = 5000;
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            const table = document.querySelector('.efm_ant-table');
            if (table) {
                log('✅ 表格已加载');
                break;
            }
            // 短暂等待
            const dummy = new Promise(resolve => setTimeout(resolve, 100));
            dummy.then(() => {});
        }

        // 查找行元素
        const rowSelectors = [
            'tr[data-row-key]',
            '.ant-table-row',
            'tr[role="row"]',
            '.efm_ant-table-row'
        ];

        let rows = [];
        for (const sel of rowSelectors) {
            rows = [...document.querySelectorAll(sel)];
            if (rows.length > 0) {
                log(`✅ 找到 ${rows.length} 行数据`);
                break;
            }
        }

        if (rows.length === 0) {
            log('❌ 未找到任何行');
            return [];
        }

        const results = [];

        // 判断是否是子页面（详情页）
        const isSubPage = /\/model-market\/detail\//.test(location.hash);

        for (const row of rows) {
            // --- 模型名称 ---
            let name = '未知模型';
            if (isSubPage) {
                const nameEl = row.querySelector('.name__QVnRn') || row.querySelector('td:first-child');
                name = (nameEl?.textContent || '未知模型').trim();
            } else {
                const nameContainer = row.querySelector('.model-name__xEkXf');
                const nameEl = nameContainer?.querySelector('span');
                name = (nameEl?.textContent || '未知模型').trim();
            }

            // --- Code 提取 ---
            let code = '';
            if (isSubPage) {
                const spans = row.querySelectorAll('span');
                for (const span of spans) {
                    const text = span.textContent.trim();
                    if (/^qwen[-\w]*\d/.test(text)) {
                        code = text.toLowerCase();
                        break;
                    }
                }
            } else {
                const codeCell = row.querySelector('td:nth-child(2)');
                const codeText = codeCell?.textContent.trim().split(/\s+/)[0] || '';
                if (/^qwen[-\w]*\d/.test(codeText)) {
                    code = codeText.toLowerCase();
                }
            }
            code = code || '—';

            // --- 免费额度 + 百分比 ---
            let freeQuota = '—';
            let quotaText = '0';
            let percentText = '0%';

            const quotaSpan = row.querySelector('.value__V7Z7e');
            if (quotaSpan) {
                const text = quotaSpan.textContent.trim();
                const match = text.match(/(\d[\d,]*)\s*\/\s*(\d[\d,]+)/);
                if (match) {
                    const used = parseInt(match[1].replace(/,/g, ''));
                    const total = parseInt(match[2].replace(/,/g, ''));
                    quotaText = `${used.toLocaleString()}/${total.toLocaleString()}`;
                }
            }

            const percentSpan = row.querySelector('.efm_ant-progress-text');
            if (percentSpan) {
                const pct = percentSpan.textContent.trim();
                if (/^\d+(\.\d+)?%$/.test(pct)) {
                    percentText = pct;
                }
            }

            if (quotaText !== '0') {
                freeQuota = `${quotaText} · ${percentText}`;
            } else if (/^\d+(\.\d+)?%$/.test(percentText)) {
                freeQuota = percentText;
            } else {
                freeQuota = /无免费额度/.test(row.textContent) ? '0 · 0%' : '—';
            }

            // --- 到期时间 ---
            const expiryMatch = row.textContent.match(/到期时间.?(\d{4}-\d{2}-\d{2})/);
            if (!expiryMatch) continue;

            const expiry = expiryMatch[1];
            const expiryDate = new Date(expiry);
            const today = new Date().setHours(0, 0, 0, 0);
            const daysLeft = Math.ceil((expiryDate - today) / 86400000);
            if (daysLeft < 0) continue;

            // --- 可选字段提取 ---
            const modelType = userSettings.showModelType ? (row.querySelector('td:nth-child(3)')?.textContent || '—') : undefined;
            const contextLength = userSettings.showContextLength ? (row.querySelector('td:nth-child(4)')?.textContent || '—') : undefined;
            const price = userSettings.showPrice ? (row.querySelector('td:nth-child(5)')?.textContent || '—') : undefined;
            const protocol = userSettings.showProtocol ? (row.querySelector('td:nth-child(6)')?.textContent || '—') : undefined;
            const limit = userSettings.showLimit ? (row.querySelector('td:nth-child(9)')?.textContent || '—') : undefined;
            const description = userSettings.showDescription ? (row.querySelector('td:nth-child(10)')?.textContent || '—') : undefined;
            const vendor = (userSettings.showVendor && !isSubPage) ? (row.querySelector('td:nth-child(11)')?.textContent || '—') : undefined;
            const updateTime = (userSettings.showUpdateTime && !isSubPage) ? (row.querySelector('td:nth-child(12)')?.textContent || '—') : undefined;

            results.push({
                name, code, freeQuota, daysLeft, expiry,
                ...(userSettings.showModelType && { modelType }),
                ...(userSettings.showContextLength && { contextLength }),
                ...(userSettings.showPrice && { price }),
                ...(userSettings.showProtocol && { protocol }),
                ...(userSettings.showLimit && { limit }),
                ...(userSettings.showDescription && { description }),
                ...(userSettings.showVendor && { vendor }),
                ...(userSettings.showUpdateTime && { updateTime })
            });

            log('✅ 提取:', name, code, freeQuota, `剩余 ${daysLeft} 天`, expiry);
        }

        return results.sort((a, b) => a.daysLeft - b.daysLeft);
    }

    // 显示结果弹窗
    function showResultsModal() {
        const modalId = 'bailian-extractor-modal';
        if (document.getElementById(modalId)) document.body.removeChild(document.getElementById(modalId));

        const modal = document.createElement('div');
        modal.id = modalId;
        Object.assign(modal.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '2147483647', fontFamily: 'Arial, sans-serif'
        });

        const content = document.createElement('div');
        Object.assign(content.style, {
            backgroundColor: 'white', width: '95%', maxWidth: '1200px', maxHeight: '85vh',
            overflow: 'auto', borderRadius: '10px', padding: '20px', position: 'relative'
        });

        const title = document.createElement('h3');
        title.textContent = `✅ 提取结果（${extractedData.length} 个模型）`;
        content.appendChild(title);

        if (extractedData.length === 0) {
            content.appendChild(document.createTextNode('未找到有效模型信息。'));
        } else {
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.innerHTML = `
                <thead>
                    <tr style="background:#f5f5f5;">
                        <th style="text-align:left;padding:10px;border:1px solid #ddd;">模型名称</th>
                        <th style="text-align:left;padding:10px;border:1px solid #ddd;">Code(点击自动复制)</th>
                        <th style="text-align:left;padding:10px;border:1px solid #ddd;">免费额度</th>
                        <th style="text-align:left;padding:10px;border:1px solid #ddd;">倒计时显示</th>
                        <th style="text-align:left;padding:10px;border:1px solid #ddd;">到期时间</th>
                        ${userSettings.showModelType ? '<th style="text-align:left;padding:10px;border:1px solid #ddd;">模型类型</th>' : ''}
                        ${userSettings.showContextLength ? '<th style="text-align:left;padding:10px;border:1px solid #ddd;">上下文长度</th>' : ''}
                        ${userSettings.showPrice ? '<th style="text-align:left;padding:10px;border:1px solid #ddd;">价格</th>' : ''}
                        ${userSettings.showProtocol ? '<th style="text-align:left;padding:10px;border:1px solid #ddd;">模型协议</th>' : ''}
                        ${userSettings.showLimit ? '<th style="text-align:left;padding:10px;border:1px solid #ddd;">限流</th>' : ''}
                        ${userSettings.showDescription ? '<th style="text-align:left;padding:10px;border:1px solid #ddd;">描述</th>' : ''}
                        ${userSettings.showVendor ? '<th style="text-align:left;padding:10px;border:1px solid #ddd;">供应商</th>' : ''}
                        ${userSettings.showUpdateTime ? '<th style="text-align:left;padding:10px;border:1px solid #ddd;">更新时间</th>' : ''}
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = table.querySelector('tbody');
            extractedData.forEach(item => {
                const tr = document.createElement('tr');
                appendCell(tr, item.name);
                appendCodeCell(tr, item.code);
                appendCell(tr, item.freeQuota);
                appendCountdownCell(tr, item.daysLeft);
                appendCell(tr, item.expiry, { color: '#d9534f', fontWeight: 'bold' });
                if (userSettings.showModelType) appendCell(tr, item.modelType || '—');
                if (userSettings.showContextLength) appendCell(tr, item.contextLength || '—');
                if (userSettings.showPrice) appendCell(tr, item.price || '—');
                if (userSettings.showProtocol) appendCell(tr, item.protocol || '—');
                if (userSettings.showLimit) appendCell(tr, item.limit || '—');
                if (userSettings.showDescription) appendCell(tr, item.description || '—');
                if (userSettings.showVendor) appendCell(tr, item.vendor || '—');
                if (userSettings.showUpdateTime) appendCell(tr, item.updateTime || '—');
                tbody.appendChild(tr);
            });

            content.appendChild(table);

            const csvBtn = document.createElement('button');
            csvBtn.textContent = '📋 复制为 CSV';
            csvBtn.style.marginTop = '15px';
            csvBtn.style.padding = '10px';
            csvBtn.style.backgroundColor = '#007cba';
            csvBtn.style.color = 'white';
            csvBtn.style.border = 'none';
            csvBtn.style.borderRadius = '4px';
            csvBtn.style.cursor = 'pointer';
            csvBtn.onclick = () => {
                const headers = [
                    '模型名称', 'Code', '免费额度', '倒计时显示', '到期时间',
                    ...(userSettings.showModelType ? ['模型类型'] : []),
                    ...(userSettings.showContextLength ? ['上下文长度'] : []),
                    ...(userSettings.showPrice ? ['价格'] : []),
                    ...(userSettings.showProtocol ? ['模型协议'] : []),
                    ...(userSettings.showLimit ? ['限流'] : []),
                    ...(userSettings.showDescription ? ['描述'] : []),
                    ...(userSettings.showVendor ? ['供应商'] : []),
                    ...(userSettings.showUpdateTime ? ['更新时间'] : [])
                ];

                const rows = extractedData.map(d => [
                    d.name,
                    d.code,
                    d.freeQuota,
                    `剩余 ${d.daysLeft} 天`,
                    d.expiry,
                    ...(userSettings.showModelType ? [d.modelType || '—'] : []),
                    ...(userSettings.showContextLength ? [d.contextLength || '—'] : []),
                    ...(userSettings.showPrice ? [d.price || '—'] : []),
                    ...(userSettings.showProtocol ? [d.protocol || '—'] : []),
                    ...(userSettings.showLimit ? [d.limit || '—'] : []),
                    ...(userSettings.showDescription ? [d.description || '—'] : []),
                    ...(userSettings.showVendor ? [d.vendor || '—'] : []),
                    ...(userSettings.showUpdateTime ? [d.updateTime || '—'] : [])
                ].map(s => `"${String(s).replace(/"/g, '""')}"`).join(','));

                const csv = [headers.join(','), ...rows].join('\n');
                navigator.clipboard.writeText(csv).then(() => {
                    csvBtn.textContent = '✅ 已复制！';
                    setTimeout(() => csvBtn.textContent = '📋 复制为 CSV', 2000);
                });
            };
            content.appendChild(csvBtn);
        }

        const close = document.createElement('span');
        close.textContent = '×';
        close.style.position = 'absolute'; close.style.top = '10px'; close.style.right = '16px';
        close.style.fontSize = '24px'; close.style.cursor = 'pointer';
        close.onclick = () => document.body.removeChild(modal);
        content.appendChild(close);

        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    // 工具函数：创建表格单元格
    function appendCell(tr, text, style = {}) {
        const td = document.createElement('td');
        td.style.padding = '10px';
        td.style.border = '1px solid #ddd';
        Object.assign(td.style, style);
        td.textContent = text;
        tr.appendChild(td);
    }

    function appendCodeCell(tr, code) {
        const td = document.createElement('td');
        td.style.padding = '10px';
        td.style.border = '1px solid #ddd';
        td.style.cursor = 'pointer';
        td.style.color = '#007cba';
        td.style.fontWeight = 'bold';
        td.title = '点击复制 Code';
        td.textContent = code;
        td.onclick = () => {
            GM_setClipboard(code);
            td.textContent = '✅ 已复制！';
            setTimeout(() => td.textContent = code, 1500);
        };
        tr.appendChild(td);
    }

    function appendCountdownCell(tr, daysLeft) {
        const td = document.createElement('td');
        td.style.padding = '10px';
        td.style.border = '1px solid #ddd';
        td.style.fontWeight = 'bold';
        td.style.color = daysLeft < 30 ? '#d9534f' :
                        daysLeft < 90 ? '#f0ad4e' : '#5cb85c';
        td.textContent = `剩余 ${daysLeft} 天`;
        tr.appendChild(td);
    }

    // 创建设置按钮和弹窗
    function createSettingsPanel() {
        const settingsBtnId = 'bailian-settings-btn';
        if (document.getElementById(settingsBtnId)) return;

        // 设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.id = settingsBtnId;
        Object.assign(settingsBtn.style, {
            position: 'fixed', top: '140px', right: '20px', zIndex: '2147483646',
            backgroundColor: '#4CAF50', color: 'white', border: 'none',
            padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            opacity: 0.95, fontFamily: 'Arial, sans-serif'
        });
        settingsBtn.textContent = '⚙️ 设置';
        settingsBtn.title = '点击打开设置面板';

        settingsBtn.addEventListener('click', () => {
            showSettingsModal();
        });

        document.body.appendChild(settingsBtn);
        log('✅ 设置按钮已创建');
    }

    // 显示设置弹窗
    function showSettingsModal() {
        const modalId = 'bailian-settings-modal';
        if (document.getElementById(modalId)) document.body.removeChild(document.getElementById(modalId));

        const modal = document.createElement('div');
        modal.id = modalId;
        Object.assign(modal.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '2147483647', fontFamily: 'Arial, sans-serif'
        });

        const content = document.createElement('div');
        Object.assign(content.style, {
            backgroundColor: 'white', width: '90%', maxWidth: '500px', padding: '20px',
            borderRadius: '10px', position: 'relative'
        });

        const title = document.createElement('h3');
        title.textContent = '🔧 设置面板';
        content.appendChild(title);

        const form = document.createElement('div');
        form.style.marginTop = '15px';

        const fields = [
            { key: 'showModelType', label: '显示模型类型' },
            { key: 'showContextLength', label: '显示上下文长度' },
            { key: 'showPrice', label: '显示价格' },
            { key: 'showProtocol', label: '显示模型协议' },
            { key: 'showLimit', label: '显示限流' },
            { key: 'showDescription', label: '显示描述' },
            { key: 'showVendor', label: '显示供应商（仅主页面）' },
            { key: 'showUpdateTime', label: '显示更新时间（仅主页面）' }
        ];

        fields.forEach(field => {
            const div = document.createElement('div');
            div.style.marginBottom = '12px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `setting-${field.key}`;
            checkbox.checked = userSettings[field.key];
            checkbox.onchange = () => {
                userSettings[field.key] = checkbox.checked;
                localStorage.setItem('bailian_user_settings', JSON.stringify(userSettings));
            };

            const label = document.createElement('label');
            label.htmlFor = `setting-${field.key}`;
            label.textContent = field.label;
            label.style.marginLeft = '8px';

            div.appendChild(checkbox);
            div.appendChild(label);
            form.appendChild(div);
        });

        content.appendChild(form);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✅ 保存并关闭';
        saveBtn.style.marginTop = '20px';
        saveBtn.style.padding = '10px 16px';
        saveBtn.style.backgroundColor = '#007cba';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '4px';
        saveBtn.style.cursor = 'pointer';
        saveBtn.onclick = () => {
            document.body.removeChild(modal);
            alert('✅ 设置已保存，下次提取时生效。');
        };
        content.appendChild(saveBtn);

        const close = document.createElement('span');
        close.textContent = '×';
        close.style.position = 'absolute'; close.style.top = '10px'; close.style.right = '16px';
        close.style.fontSize = '24px'; close.style.cursor = 'pointer';
        close.onclick = () => document.body.removeChild(modal);
        content.appendChild(close);

        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    // 初始化函数优化
    function init() {
        console.log(LOG_PREFIX, '脚本已注入，版本:', GM_info.script.version);

        // 等待DOM准备就绪后创建按钮
        if (document.readyState === 'loading') {
            // 使用更快速的DOM加载检测
            const checkInterval = setInterval(() => {
                if (document.readyState === 'interactive' || document.readyState === 'complete') {
                    clearInterval(checkInterval);
                    setTimeout(createFloatingButton, 50); // 极短等待
                }
            }, 30);

            // 超时处理
            setTimeout(() => {
                clearInterval(checkInterval);
                setTimeout(createFloatingButton, 50);
            }, 1000);
        } else {
            setTimeout(createFloatingButton, 50);
        }
    }

    init();
})();
