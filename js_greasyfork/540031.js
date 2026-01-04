// ==UserScript==
// @name         AI中转站价格分析工具 (v4.2)
// @namespace    http://tampermonkey.net/
// @version      4.2.3
// @description  AI中转站价格分析工具
// @author       37012 & Gemini
// @license      GPL-3.0
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540031/AI%E4%B8%AD%E8%BD%AC%E7%AB%99%E4%BB%B7%E6%A0%BC%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7%20%28v42%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540031/AI%E4%B8%AD%E8%BD%AC%E7%AB%99%E4%BB%B7%E6%A0%BC%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7%20%28v42%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // === 1. 全局配置与状态 ===
    const OFFICIAL_DATA_SOURCE = "https://basellm.github.io/llm-metadata/api/all.json";
    const STORAGE_KEY_DATA = "ai_pricing_v4_data";
    const STORAGE_KEY_RULES = "ai_pricing_v4_rules";
    const SYSTEM_BASE_PRICE_PER_1M = 2.0; // 系统基准 $2/1M tokens

    // 默认匹配规则配置
    const DEFAULT_MATCHING_RULES = [
        { id: "exact", name: "完全匹配", enabled: true, desc: "名称完全一致 (gpt-4 = gpt-4)" },
        { id: "suffix", name: "后缀匹配", enabled: false, desc: "忽略厂商前缀 (openai/gpt-4 = gpt-4)" },
        { id: "ignore_version", name: "忽略版本号", enabled: false, desc: "忽略日期后缀 (gpt-4-0613 = gpt-4)" },
        { id: "fuzzy", name: "智能模糊", enabled: false, desc: "基于相似度自动匹配 (最后的兜底)" }
    ];

    let state = {
        isModalOpen: false,
        capturedProxyData: null,
        officialData: null,
        analysisResults: [],
        matchingRules: loadMatchingRules(),
        sortConfig: {
            primary: 'group_name',
            secondary: 'real_cost',
            direction: 'asc'
        },
        floatBtn: null // 存储按钮引用
    };

    // === 2. CSS 样式 ===
    const styles = `
        /* 基础按钮 (保持不变，因为使用了特定类名) */
        .ai-pricing-float-btn {
            position: fixed; bottom: 20px; right: 20px; padding: 12px 24px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8); border: none; border-radius: 50px;
            color: white; font-size: 14px; font-weight: 600; cursor: pointer;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4); z-index: 10000;
            transition: all 0.3s ease; display: none;
            align-items: center; gap: 8px;
        }
        .ai-pricing-float-btn.visible { display: flex; animation: fadeIn 0.3s ease; }
        .ai-pricing-float-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* 模态框容器 */
        .ai-pricing-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.7); z-index: 10001; display: none;
            align-items: center; justify-content: center; backdrop-filter: blur(4px);
        }
        .ai-pricing-modal-content {
            background: #f8fafc; border-radius: 12px; width: 95%; max-width: 1600px; height: 95%;
            display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* 头部 */
        .ai-pricing-modal .header-bar {
            padding: 16px 24px; background: white; border-bottom: 1px solid #e2e8f0;
            display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
        }
        .ai-pricing-modal .header-title { margin: 0; color: #0f172a; font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .ai-pricing-modal .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b; }
        .ai-pricing-modal .close-btn:hover { color: #ef4444; }

        /* 内容区布局 */
        .ai-pricing-modal .main-body { flex: 1; display: flex; gap: 16px; padding: 16px; overflow: hidden; }
        .ai-pricing-modal .sidebar { width: 320px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; flex-shrink: 0; padding-right: 4px;}
        .ai-pricing-modal .content-area {
            flex: 1; display: flex; flex-direction: column; background: white;
            border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; min-width: 0;
        }

        /* 卡片样式 */
        .ai-pricing-modal .panel-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .ai-pricing-modal .panel-title { font-size: 0.9rem; font-weight: 700; color: #334155; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 4px; }

        /* 表单元素 - 关键修改：增加 .ai-pricing-modal 前缀 */
        .ai-pricing-modal .input-row { display: flex; flex-direction: column; gap: 4px; }
        .ai-pricing-modal .input-row label { font-size: 12px; color: #64748b; font-weight: 600; }

        .ai-pricing-modal .input-row input,
        .ai-pricing-modal .input-row textarea {
            padding: 8px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 13px;
            outline: none;
            width: 100%;
            box-sizing: border-box;
        }
        .ai-pricing-modal .input-row input:focus { border-color: #3b82f6; }
        .ai-pricing-modal textarea { height: 80px; resize: vertical; font-family: monospace; }

        /* 规则开关 */
        .ai-pricing-modal .rule-item { display: flex; align-items: center; gap: 8px; padding: 6px; border: 1px solid #f1f5f9; border-radius: 6px; font-size: 12px; }
        .ai-pricing-modal .rule-item:hover { background: #f8fafc; }
        .ai-pricing-modal .rule-desc { color: #94a3b8; font-size: 11px; margin-left: auto; }

        /* 按钮 */
        .ai-pricing-modal .btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.2s; }
        .ai-pricing-modal .btn-primary { background: #3b82f6; color: white; width: 100%; }
        .ai-pricing-modal .btn-primary:hover { background: #2563eb; }

        /* 排序工具栏 */
        .ai-pricing-modal .sort-toolbar { padding: 12px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; gap: 15px; align-items: center; flex-wrap: wrap; font-size: 13px; }
        .ai-pricing-modal .sort-group { display: flex; align-items: center; gap: 8px; }
        .ai-pricing-modal .radio-label { display: flex; align-items: center; gap: 4px; cursor: pointer; user-select: none; }

        /* 表格 - 关键修改：增加 .ai-pricing-modal 前缀，只影响插件内的表格 */
        .ai-pricing-modal .table-container { flex: 1; overflow: auto; position: relative; }
        .ai-pricing-modal table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }
        .ai-pricing-modal thead { position: sticky; top: 0; z-index: 10; background: #f1f5f9; }
        .ai-pricing-modal th { padding: 10px 12px; color: #475569; font-weight: 600; border-bottom: 2px solid #cbd5e1; white-space: nowrap; }
        .ai-pricing-modal td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #334155; }
        .ai-pricing-modal tr:hover td { background: #f8fafc; }

        /* 分组标题行 */
        .ai-pricing-modal .group-header { background: #e2e8f0; font-weight: 700; color: #1e293b; }
        .ai-pricing-modal .group-header td { padding: 8px 16px; border-top: 1px solid #cbd5e1; }

        /* 结果样式 */
        .ai-pricing-modal .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 500; display: inline-block; }
        .ai-pricing-modal .badge-blue { background: #dbeafe; color: #1e40af; }
        .ai-pricing-modal .badge-gray { background: #f1f5f9; color: #64748b; }
        .ai-pricing-modal .price-details { font-size: 11px; color: #64748b; line-height: 1.4; }

        .ai-pricing-modal .val-excellent { color: #16a34a; font-weight: 700; background:#dcfce7; padding:2px 6px; border-radius:4px; }
        .ai-pricing-modal .val-good { color: #15803d; }
        .ai-pricing-modal .val-fair { color: #ca8a04; }
        .ai-pricing-modal .val-bad { color: #dc2626; font-weight: 700; }

        /* 筛选器 */
        .ai-pricing-modal .filter-actions { display:flex; gap:10px; font-size:11px; margin-bottom:5px; justify-content: flex-end;}
        .ai-pricing-modal .filter-link { cursor:pointer; color:#3b82f6; }
        .ai-pricing-modal .filter-chips { display: flex; flex-wrap: wrap; gap: 6px; max-height: 150px; overflow-y: auto; margin-top: 8px; }
        .ai-pricing-modal .chip { padding: 2px 8px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 11px; cursor: pointer; background: white; }
        .ai-pricing-modal .chip.active { background: #eff6ff; border-color: #3b82f6; color: #2563eb; }
        .ai-pricing-modal .chip:hover { border-color: #94a3b8; }
    `;


    // === 3. 核心逻辑：数据处理与匹配 ===
    function loadMatchingRules() {
        const stored = GM_getValue(STORAGE_KEY_RULES);
        return stored ? JSON.parse(stored) : DEFAULT_MATCHING_RULES;
    }

    function loadOfficialData() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: OFFICIAL_DATA_SOURCE,
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            const json = JSON.parse(res.responseText);
                            const flatData = parseBasellmData(json);
                            GM_setValue(STORAGE_KEY_DATA, JSON.stringify(flatData));
                            state.officialData = flatData;
                            resolve(flatData);
                        } catch (e) { reject(e); }
                    } else reject(res.statusText);
                },
                onerror: reject
            });
        });
    }

    function parseBasellmData(json) {
        const list = [];
        for (const providerKey of Object.keys(json)) {
            const providerData = json[providerKey];
            const providerName = providerData.id || providerKey;
            if (providerData.models) {
                for (const modelKey of Object.keys(providerData.models)) {
                    const m = providerData.models[modelKey];
                    if (m.cost) {
                        list.push({
                            name: modelKey,
                            provider: providerName,
                            input: m.cost.input || 0,
                            output: m.cost.output || 0
                        });
                    }
                }
            }
        }
        return list;
    }

    function matchModel(proxyName, officialList, rules) {
        const pName = proxyName.toLowerCase();

        for (const rule of rules) {
            if (!rule.enabled) continue;

            let matches = [];

            // 1. 完全匹配 (Exact) - 改为 filter 查找所有
            if (rule.id === 'exact') {
                matches = officialList.filter(o => o.name.toLowerCase() === pName);
            }
            // 2. 后缀匹配 (Suffix) - 改为 filter 查找所有
            else if (rule.id === 'suffix') {
                const cleanP = cleanModelName(pName);
                matches = officialList.filter(o => {
                    const cleanO = cleanModelName(o.name.toLowerCase());
                    return cleanP === cleanO ||
                           pName.endsWith(o.name.toLowerCase()) ||
                           o.name.toLowerCase().endsWith(cleanP);
                });
            }
            // 3. 忽略版本号 (Ignore Version) - 改为 filter 查找所有
            else if (rule.id === 'ignore_version') {
                const baseP = removeVersion(pName);
                matches = officialList.filter(o => removeVersion(o.name.toLowerCase()) === baseP);
            }
            // 4. 智能模糊 (Fuzzy) - 模糊匹配通常只保留得分最高的一个，避免产生大量垃圾数据
            else if (rule.id === 'fuzzy') {
                let best = null, maxScore = 0;
                officialList.forEach(o => {
                    const oName = o.name.toLowerCase();
                    if (pName.includes(oName) || oName.includes(pName)) {
                        const score = Math.min(pName.length, oName.length) / Math.max(pName.length, oName.length);
                        if (score > 0.6 && score > maxScore) {
                            maxScore = score;
                            best = o;
                        }
                    }
                });
                if (best) matches = [best]; // 模糊匹配我们只取最相似的一个
            }

            // 如果当前规则找到了匹配项（一个或多个），直接返回这些匹配项，不再执行后续低优先级规则
            if (matches.length > 0) {
                return matches.map(m => ({ match: m, rule: rule.name }));
            }
        }
        return []; // 返回空数组
    }


    function cleanModelName(name) {
        const prefixes = ["openai/", "anthropic/", "google/", "meta/", "deepseek/", "qwen/", "azure/"];
        for (const p of prefixes) if (name.startsWith(p)) return name.substring(p.length);
        return name;
    }

    function removeVersion(name) {
        return name.replace(/-\d{8}|-v?\d+(\.\d+)*|-\d{4}-\d{2}-\d{2}/g, "");
    }

    // === 4. 分析与计算逻辑 ===
    function runAnalysis() {
        try {
            const rawJson = document.getElementById('proxyDataJson').value;
            if (!rawJson) return alert("请先获取或粘贴API数据");
            if (!state.officialData) return alert("正在加载官方数据，请稍候...");

            const proxyRate = parseFloat(document.getElementById('proxyExchangeRate').value) || 1;
            const realRate = parseFloat(document.getElementById('realExchangeRate').value) || 7.3;

            const proxyDataRaw = JSON.parse(rawJson);
            const proxyData = normalizeProxyData(proxyDataRaw);

            state.analysisResults = [];

            proxyData.data.forEach(pItem => {
                // 获取所有匹配结果（数组）
                const matchResults = matchModel(pItem.model_name, state.officialData, state.matchingRules);

                // 遍历每一个匹配结果
                matchResults.forEach(result => {
                    const { match: oItem, rule } = result;
                    const groups = pItem.enable_groups || ["Default"];

                    groups.forEach(group => {
                        const groupRatio = proxyData.group_ratio[group] || 1;

                        const oInputRMB = oItem.input * realRate;
                        const oOutputRMB = oItem.output * realRate;

                        const pInputPriceUSD = pItem.model_ratio * groupRatio * SYSTEM_BASE_PRICE_PER_1M;
                        const pOutputPriceUSD = pInputPriceUSD * (pItem.completion_ratio || 1);

                        const pInputRMB = pInputPriceUSD * proxyRate;
                        const pOutputRMB = pOutputPriceUSD * proxyRate;

                        let realCostFor1USD = 0;
                        // 防止除以0
                        if (oInputRMB > 0) {
                            realCostFor1USD = (pInputRMB / oInputRMB) * realRate;
                        } else if (oOutputRMB > 0) {
                            realCostFor1USD = (pOutputRMB / oOutputRMB) * realRate;
                        } else {
                            // 如果官方价格也是0（例如免费模型），则设为0或特殊处理
                             realCostFor1USD = 0;
                        }

                        // 如果官方价格是0，避免 realCost 计算出 Infinity
                        if(oItem.input === 0 && oItem.output === 0) realCostFor1USD = 0;


                        let diffPercent = 0;
                        if (realRate > 0) {
                             diffPercent = ((realCostFor1USD - realRate) / realRate) * 100;
                        }

                        let category = "fair";
                        // 稍微调整评价逻辑，防止除零导致的异常
                        if (realCostFor1USD === 0 && (pInputRMB > 0 || pOutputRMB > 0)) category = "bad"; // 官方免费，中转收费
                        else if (realCostFor1USD < realRate * 0.6) category = "excellent";
                        else if (realCostFor1USD < realRate * 0.98) category = "good";
                        else if (realCostFor1USD > realRate * 1.5) category = "bad";

                        state.analysisResults.push({
                            model_name: pItem.model_name,
                            official_name: oItem.name,
                            official_provider: oItem.provider, // 这里现在会正确区分 openai, azure, agentrouter 等
                            match_rule: rule,
                            group_name: group,
                            p_input_rmb: pInputRMB,
                            p_output_rmb: pOutputRMB,
                            o_input_rmb: oInputRMB,
                            o_output_rmb: oOutputRMB,
                            real_cost: realCostFor1USD,
                            diff_percent: diffPercent,
                            category: category
                        });
                    });
                });
            });

            renderAllFilters();
            applySortingAndRender();

        } catch (e) {
            console.error(e);
            alert("分析出错: " + e.message);
        }
    }


    // === 5. 排序与渲染逻辑===
    function applySortingAndRender() {
        const { primary, secondary, direction } = state.sortConfig;
        const container = document.getElementById('resultsBody');
        container.innerHTML = "";

        const activeProviderChips = Array.from(document.querySelectorAll('#providerFilters .chip.active')).map(c => c.dataset.val);
        const activeGroupChips = Array.from(document.querySelectorAll('#groupFilters .chip.active')).map(c => c.dataset.val);

        let filtered = state.analysisResults.filter(r => {
            const providerMatch = activeProviderChips.length === 0 || activeProviderChips.includes(r.official_provider);
            const groupMatch = activeGroupChips.length === 0 || activeGroupChips.includes(r.group_name);
            return providerMatch && groupMatch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#94a3b8;">无匹配数据，请检查筛选条件</td></tr>`;
            document.getElementById('resultCount').innerText = "0";
            return;
        }

        const sortFn = (a, b, key) => {
            let valA = a[key], valB = b[key];
            if (typeof valA === 'string') return valA.localeCompare(valB);
            return valA - valB;
        };

        filtered.sort((a, b) => {
            if (primary !== 'none') {
                const res = sortFn(a, b, primary);
                if (res !== 0) return res;
            }
            const res = sortFn(a, b, secondary);
            return direction === 'asc' ? res : -res;
        });

        let lastGroupVal = null;

        filtered.forEach(row => {
            if (primary !== 'none') {
                const groupVal = row[primary];
                if (groupVal !== lastGroupVal) {
                    lastGroupVal = groupVal;
                    const headerRow = document.createElement('tr');
                    headerRow.className = 'group-header';
                    headerRow.innerHTML = `<td colspan="8">📂 ${primary === 'group_name' ? '分组' : '供应商'}: ${groupVal}</td>`;
                    container.appendChild(headerRow);
                }
            }

            const tr = document.createElement('tr');
            const diffClass = row.diff_percent > 0 ? 'color:#dc2626' : 'color:#16a34a';
            const diffSign = row.diff_percent > 0 ? '+' : '';
            const ratingMap = { excellent: "神价", good: "折扣", fair: "公道", bad: "溢价" };
            const ratingClass = `val-${row.category}`;

            tr.innerHTML = `
                <td>
                    <div style="font-weight:600;">${row.model_name}</div>
                    <div style="font-size:10px; color:#94a3b8;">匹配: ${row.official_name} (${row.match_rule})</div>
                </td>
                <td><span class="badge badge-blue">${row.official_provider}</span></td>
                <td><span class="badge badge-gray">${row.group_name}</span></td>
                <td class="price-details">
                    <div>入: ¥${row.p_input_rmb.toFixed(4)}</div>
                    <div>出: ¥${row.p_output_rmb.toFixed(4)}</div>
                </td>
                <td class="price-details">
                    <div>入: ¥${row.o_input_rmb.toFixed(4)}</div>
                    <div>出: ¥${row.o_output_rmb.toFixed(4)}</div>
                </td>
                <td style="font-weight:bold; font-size:13px;">¥${row.real_cost.toFixed(2)}</td>
                <td style="font-weight:bold; ${diffClass}">${diffSign}${row.diff_percent.toFixed(0)}%</td>
                <td><span class="${ratingClass}">${ratingMap[row.category]}</span></td>
            `;
            container.appendChild(tr);
        });

        document.getElementById('resultCount').innerText = `${filtered.length} 个`;
    }

    function renderAllFilters() {
        renderFilterSection('providerFilters', 'official_provider');
        renderFilterSection('groupFilters', 'group_name');
    }

    function renderFilterSection(containerId, dataKey) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        const items = Array.from(new Set(state.analysisResults.map(r => r[dataKey]))).sort();

        items.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'chip active';
            chip.textContent = item;
            chip.dataset.val = item;
            chip.onclick = () => {
                chip.classList.toggle('active');
                applySortingAndRender();
            };
            container.appendChild(chip);
        });
    }

    function toggleFilterAll(containerId, isActive) {
        const chips = document.querySelectorAll(`#${containerId} .chip`);
        chips.forEach(c => isActive ? c.classList.add('active') : c.classList.remove('active'));
        applySortingAndRender();
    }

    // === 6. UI 构建与显示控制（修复部分） ===
    function initUI() {
        addStyle(styles);

        const btn = document.createElement('button');
        btn.className = 'ai-pricing-float-btn'; // 默认样式包含 display: none
        btn.innerHTML = `<span>📊</span> 价格分析`;
        btn.onclick = openModal;
        document.body.appendChild(btn);
        state.floatBtn = btn;

        // 启动URL检测和数据捕获
        setupUrlChangeListener();
        checkVisibility(); // 初始检查
    }

    // 检查是否应该显示按钮
    function checkVisibility() {
        if (!state.floatBtn) return;

        const url = window.location.href;
        const isPricingPage = url.includes('/pricing') || url.includes('/models') || url.includes('/rate');
        const hasCapturedData = !!state.capturedProxyData;

        // 规则：如果是定价页面，或者已经捕获到了数据，就显示按钮
        if (isPricingPage || hasCapturedData) {
            state.floatBtn.classList.add('visible');
        } else {
            state.floatBtn.classList.remove('visible');
        }
    }

    function setupUrlChangeListener() {
        // 监听 History API 变化 (SPA应用)
        const originalPush = history.pushState;
        const originalReplace = history.replaceState;

        history.pushState = function (...args) {
            originalPush.apply(this, args);
            setTimeout(checkVisibility, 100);
        };

        history.replaceState = function (...args) {
            originalReplace.apply(this, args);
            setTimeout(checkVisibility, 100);
        };

        window.addEventListener("popstate", () => setTimeout(checkVisibility, 100));

        // 定时器兜底 (处理某些特殊路由变化)
        setInterval(checkVisibility, 2000);
    }

    function openModal() {
        if (state.isModalOpen) return;
        state.isModalOpen = true;

        let modal = document.querySelector('.ai-pricing-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'ai-pricing-modal';
            modal.innerHTML = `
                <div class="ai-pricing-modal-content">
                    <div class="header-bar">
                        <h2 class="header-title">🤖 AI中转站价格分析 <span class="badge badge-blue" style="font-size:12px; margin-left:10px;">v4.2</span></h2>
                        <button class="close-btn">&times;</button>
                    </div>

                    <div class="main-body">
                        <!-- 左侧设置栏 -->
                        <div class="sidebar">
                            <div class="panel-card">
                                <div class="panel-title">📥 数据源</div>
                                <div class="input-row">
                                    <label>汇率参数 (充值汇率 / 真实汇率)</label>
                                    <div style="display:flex; gap:5px;">
                                        <input type="number" id="proxyExchangeRate" value="1" step="0.1" placeholder="充值">
                                        <input type="number" id="realExchangeRate" value="7.30" step="0.01" placeholder="市场">
                                    </div>
                                </div>
                                <div class="input-row">
                                    <label>定价数据 (JSON)</label>
                                    <textarea id="proxyDataJson" placeholder="自动捕获中... 或粘贴JSON"></textarea>
                                </div>
                                <button id="analyzeBtn" class="btn btn-primary">🚀 开始计算</button>
                            </div>

                            <div class="panel-card">
                                <div class="panel-title">🗂️ 分组筛选</div>
                                <div class="filter-actions">
                                    <a class="filter-link" id="groupAll">全选</a>
                                    <a class="filter-link" id="groupNone">清空</a>
                                </div>
                                <div id="groupFilters" class="filter-chips"></div>
                            </div>

                            <div class="panel-card">
                                <div class="panel-title">🏭 供应商筛选</div>
                                <div class="filter-actions">
                                    <a class="filter-link" id="providerAll">全选</a>
                                    <a class="filter-link" id="providerNone">清空</a>
                                </div>
                                <div id="providerFilters" class="filter-chips"></div>
                            </div>

                            <div class="panel-card">
                                <div class="panel-title">🧩 匹配规则</div>
                                <div id="rulesContainer" style="display:flex; flex-direction:column; gap:5px;"></div>
                            </div>
                        </div>

                        <!-- 右侧结果区 -->
                        <div class="content-area">
                            <div class="sort-toolbar">
                                <div class="sort-group">
                                    <strong>分组:</strong>
                                    <label class="radio-label"><input type="radio" name="groupBy" value="group_name" checked> 分组名</label>
                                    <label class="radio-label"><input type="radio" name="groupBy" value="official_provider"> 供应商</label>
                                    <label class="radio-label"><input type="radio" name="groupBy" value="none"> 不分组</label>
                                </div>
                                <div style="width:1px; height:20px; background:#e2e8f0; margin:0 10px;"></div>
                                <div class="sort-group">
                                    <strong>排序:</strong>
                                    <select id="sortBySelect" style="padding:4px; border-radius:4px; border:1px solid #cbd5e1;">
                                        <option value="real_cost">实际汇率成本 (低->高)</option>
                                        <option value="diff_percent">溢价率</option>
                                        <option value="model_name">模型名称</option>
                                    </select>
                                </div>
                                <div style="margin-left:auto; font-size:12px; color:#64748b;">
                                    共找到 <strong id="resultCount" style="color:#333;">0</strong> 个结果
                                </div>
                            </div>

                            <div class="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th width="20%">中转模型</th>
                                            <th width="10%">官方源</th>
                                            <th width="10%">分组</th>
                                            <th width="15%">中转价格 (¥)</th>
                                            <th width="15%">官方价格 (¥)</th>
                                            <th width="10%">真实汇率</th>
                                            <th width="8%">溢价</th>
                                            <th width="8%">评价</th>
                                        </tr>
                                    </thead>
                                    <tbody id="resultsBody">
                                        <tr><td colspan="8" style="text-align:center; padding:30px; color:#94a3b8;">请点击左侧“开始计算”</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('.close-btn').onclick = () => { state.isModalOpen = false; modal.style.display = 'none'; };
            document.getElementById('analyzeBtn').onclick = runAnalysis;

            renderRulesConfig();

            document.querySelectorAll('input[name="groupBy"]').forEach(el => {
                el.onchange = (e) => { state.sortConfig.primary = e.target.value; applySortingAndRender(); };
            });
            document.getElementById('sortBySelect').onchange = (e) => {
                state.sortConfig.secondary = e.target.value;
                state.sortConfig.direction = 'asc';
                applySortingAndRender();
            };

            document.getElementById('groupAll').onclick = () => toggleFilterAll('groupFilters', true);
            document.getElementById('groupNone').onclick = () => toggleFilterAll('groupFilters', false);
            document.getElementById('providerAll').onclick = () => toggleFilterAll('providerFilters', true);
            document.getElementById('providerNone').onclick = () => toggleFilterAll('providerFilters', false);
        }

        modal.style.display = 'flex';

        if (state.capturedProxyData) {
            document.getElementById('proxyDataJson').value = JSON.stringify(state.capturedProxyData, null, 2);
        } else {
            fetchProxyData();
        }

        if (!state.officialData) loadOfficialData();
    }

    function renderRulesConfig() {
        const container = document.getElementById('rulesContainer');
        container.innerHTML = "";
        state.matchingRules.forEach((rule, idx) => {
            const div = document.createElement('div');
            div.className = 'rule-item';
            div.innerHTML = `
                <input type="checkbox" ${rule.enabled ? 'checked' : ''}>
                <span>${rule.name}</span>
                <span class="rule-desc">${rule.desc}</span>
            `;
            div.querySelector('input').onchange = (e) => {
                state.matchingRules[idx].enabled = e.target.checked;
                GM_setValue(STORAGE_KEY_RULES, JSON.stringify(state.matchingRules));
            };
            container.appendChild(div);
        });
    }

    // === 7. 辅助函数 ===
    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

// === 策略模式重构：数据标准化处理 ===

    /**
     * 策略基类 (接口定义)
     */
    class ParsingStrategy {
        canParse(raw) { return false; }
        parse(raw) { return { data: [], group_ratio: {} }; }

        // 辅助：安全转浮点数
        _toFloat(val, def = 1) {
            const f = parseFloat(val);
            return isNaN(f) ? def : f;
        }
    }

    /**
     * 策略 A: NewAPI/OneAPI 标准格式
     * 特征: data.ModelRatio (对象) + data.GroupRatio (对象)
     */
    class StandardNewApiStrategy extends ParsingStrategy {
        canParse(raw) {
            return raw.data && raw.data.ModelRatio && raw.data.GroupRatio;
        }

        parse(raw) {
            console.log("AI Pricing: 使用 [StandardNewApi] 策略解析");
            const list = [];
            const groupRatios = raw.data.GroupRatio;
            const allGroups = Object.keys(groupRatios);
            const modelRatios = raw.data.ModelRatio || {};
            const completionRatios = raw.data.CompletionRatio || {};

            for (const [mName, ratio] of Object.entries(modelRatios)) {
                list.push({
                    model_name: mName,
                    model_ratio: this._toFloat(ratio),
                    completion_ratio: this._toFloat(completionRatios[mName], 1),
                    enable_groups: allGroups // 假设全分组可见
                });
            }
            return { data: list, group_ratio: groupRatios };
        }
    }

    /**
     * 策略 B: 旧版嵌套格式
     * 特征: data.model_group (对象)
     */
    class LegacyStrategy extends ParsingStrategy {
        canParse(raw) {
            return raw.data && raw.data.model_group;
        }

        parse(raw) {
            console.log("AI Pricing: 使用 [Legacy] 策略解析");
            const list = [];
            const groups = raw.data.model_group;
            const completions = raw.data.model_completion_ratio || {};
            const modelMap = {};

            // 1. 遍历分组建立映射
            for (const [gName, gData] of Object.entries(groups)) {
                const prices = gData.ModelPrice || {};
                for (const [mName, mPrice] of Object.entries(prices)) {
                    if (!modelMap[mName]) {
                        modelMap[mName] = { ratio: mPrice.price, groups: [] };
                    }
                    modelMap[mName].groups.push(gName);
                }
            }

            // 2. 转换为列表
            for (const [mName, info] of Object.entries(modelMap)) {
                list.push({
                    model_name: mName,
                    model_ratio: this._toFloat(info.ratio),
                    completion_ratio: this._toFloat(completions[mName], 1),
                    enable_groups: info.groups
                });
            }

            // 3. 提取分组倍率
            const groupRatios = {};
            for (const [g, d] of Object.entries(groups)) {
                groupRatios[g] = this._toFloat(d.GroupRatio);
            }

            return { data: list, group_ratio: groupRatios };
        }
    }

    /**
     * 策略 C: 复杂嵌套/新版格式 (Go-Chat/BerryAPI 等变种)
     * 特征: data.model_info (数组) + data.group_info (对象)
     * 逻辑: 支持同一模型在不同分组有不同基础倍率，解析时进行"展开"处理
     */
    class AdvancedNestedStrategy extends ParsingStrategy {
        canParse(raw) {
            return raw.data && Array.isArray(raw.data.model_info) && raw.data.group_info;
        }

        parse(raw) {
            console.log("AI Pricing: 使用 [AdvancedNested] 策略解析");
            const list = [];
            const rawGroups = raw.data.group_info;
            const rawModels = raw.data.model_info;

            // 1. 提取分组倍率
            const groupRatios = {};
            for (const [gName, gData] of Object.entries(rawGroups)) {
                groupRatios[gName] = this._toFloat(gData.GroupRatio);
            }

            // 2. 遍历模型并展开
            rawModels.forEach(item => {
                if (!item.model_name) return;

                // 获取该模型定义了价格的所有分组
                // 优先看 enable_groups，如果没有，则看 price_info 的 key
                let targetGroups = item.enable_groups;
                const priceMap = item.price_info || {};

                if (!targetGroups || targetGroups.length === 0) {
                    targetGroups = Object.keys(priceMap);
                }

                if (!targetGroups || targetGroups.length === 0) return;

                // 核心逻辑：为了适配 runAnalysis，如果一个模型属于多个分组，
                // 且我们在 JSON 里能获取到它在每个分组的具体 price_info，
                // 我们就为每个分组生成一条独立的记录。
                // 这样做的好处是：即使不同分组的 model_ratio 不同，计算也是准确的。

                targetGroups.forEach(groupName => {
                    // 尝试获取该分组下的特定配置
                    const groupPriceConfig = priceMap[groupName]?.default;

                    // 如果该分组有特定配置，使用特定值；否则使用一个默认逻辑(或者跳过)
                    // 这里为了稳健，如果找不到具体配置，我们尝试找任意一个存在的配置作为 fallback，或者跳过
                    // 在新版 JSON 中，通常 price_info 包含了所有 enable_groups 的 key

                    let ratio = 0;
                    let completionRatio = 1;

                    if (groupPriceConfig) {
                        ratio = this._toFloat(groupPriceConfig.model_ratio, 0);
                        const cr = parseFloat(groupPriceConfig.model_completion_ratio);
                        completionRatio = isNaN(cr) ? 1 : cr;
                    } else {
                        // 如果没有特定配置，尝试找第一个可用的作为基准 (兼容性兜底)
                        const firstKey = Object.keys(priceMap)[0];
                        if (firstKey && priceMap[firstKey].default) {
                            const fallback = priceMap[firstKey].default;
                            ratio = this._toFloat(fallback.model_ratio, 0);
                            const cr = parseFloat(fallback.model_completion_ratio);
                            completionRatio = isNaN(cr) ? 1 : cr;
                        }
                    }

                    list.push({
                        model_name: item.model_name,
                        model_ratio: ratio,
                        completion_ratio: completionRatio,
                        enable_groups: [groupName] // 关键：每条记录只对应一个分组，确保计算精确
                    });
                });
            });

            return { data: list, group_ratio: groupRatios };
        }
    }

    /**
     * 上下文环境：标准化入口函数
     */
    function normalizeProxyData(raw) {
        // 注册所有策略
        const strategies = [
            new StandardNewApiStrategy(),
            new LegacyStrategy(),
            new AdvancedNestedStrategy()
        ];

        // 迭代寻找匹配策略
        for (const strategy of strategies) {
            if (strategy.canParse(raw)) {
                try {
                    return strategy.parse(raw);
                } catch (e) {
                    console.error("策略解析失败:", e);
                    break; // 这里的 break 会导致返回原始 raw，或者你可以选择继续尝试下一个
                }
            }
        }

        // 兜底：未识别格式，原样返回，由外部逻辑处理(可能报错)
        console.warn("AI Pricing: 未知的数据格式，无法解析");
        return raw;
    }

    function setupInterception() {
        // 拦截 fetch
        const origFetch = window.fetch;
        window.fetch = function(...args) {
            if (args[0] && args[0].toString().includes('/api/pricing')) {
                return origFetch.apply(this, args).then(res => {
                    res.clone().json().then(data => {
                        state.capturedProxyData = data;
                        checkVisibility(); // 捕获到数据后，强制显示按钮
                        console.log("AI Pricing: 成功捕获 pricing 数据");
                    }).catch(()=>{});
                    return res;
                });
            }
            return origFetch.apply(this, args);
        };

        // 拦截 XHR
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return origOpen.apply(this, arguments);
        };
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            if (this._url && this._url.includes('/api/pricing')) {
                this.addEventListener('load', function() {
                    try {
                        state.capturedProxyData = JSON.parse(this.responseText);
                        checkVisibility(); // 捕获到数据后，强制显示按钮
                        console.log("AI Pricing: 成功通过 XHR 捕获 pricing 数据");
                    } catch(e) {}
                });
            }
            return origSend.apply(this, arguments);
        };
    }

    function fetchProxyData() {
        GM_xmlhttpRequest({
            method: "GET", url: "/api/pricing",
            onload: (res) => {
                if (res.status === 200) {
                    try {
                        state.capturedProxyData = JSON.parse(res.responseText);
                        checkVisibility(); // 主动获取成功后显示
                        const el = document.getElementById('proxyDataJson');
                        if(el) el.value = JSON.stringify(state.capturedProxyData, null, 2);
                    } catch(e){}
                }
            }
        });
    }

    // === 启动 ===
    setupInterception();
    initUI();
    loadOfficialData().then(() => console.log("AI Pricing: 官方数据预加载完成"));

})();


