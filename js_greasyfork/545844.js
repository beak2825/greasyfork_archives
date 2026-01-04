// ==UserScript==
// @name         OpenRouter 模型筛选器
// @namespace    openrouter-model-filter
// @version      2025.0.2
// @description  OpenRouter 模型信息筛选和获取工具
// @author       delph1s
// @license      MIT
// @icon         https://openrouter.ai/favicon.ico
// @match        https://openrouter.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545844/OpenRouter%20%E6%A8%A1%E5%9E%8B%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545844/OpenRouter%20%E6%A8%A1%E5%9E%8B%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isExpanded = false;
    let extractedModels = [];

    // 创建样式
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 主容器 */
            #or-filter-container {
                position: fixed !important;
                bottom: 14px !important;
                right: 14px !important;
                z-index: 99999 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
            }

            /* 浮动按钮 */
            #or-filter-container .or-toggle-btn {
                width: 28px !important;
                height: 28px !important;
                border-radius: 14px !important;
                background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1)) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05) !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                color: #333 !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            #or-filter-container .or-toggle-btn:hover {
                transform: scale(1.2) !important;
                box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1) !important;
            }

            /* 主面板 */
            #or-filter-container .or-panel {
                position: absolute !important;
                bottom: 0 !important;
                right: 0 !important;
                width: 380px !important;
                max-height: 85vh !important;
                background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1)) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border-radius: 14px !important;
                border: 1px solid rgba(255,255,255,0.3) !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.05) !important;
                padding: 24px !important;
                transform: scale(0.8) translateX(380px) !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                overflow-y: auto !important;
                margin: 0 !important;
            }

            #or-filter-container .or-panel.expanded {
                transform: scale(1) translateX(0) !important;
                opacity: 1 !important;
                visibility: visible !important;
            }

            /* 标题 */
            #or-filter-container .or-title {
                font-size: 20px !important;
                font-weight: 700 !important;
                color: #1d1d1f !important;
                margin: 0 0 14px 0 !important;
                padding: 0 !important;
                text-align: center !important;
                background: linear-gradient(135deg, #FF6B35, #F7931E) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                line-height: 1.2 !important;
                border: none !important;
            }

            /* 关闭按钮 */
            #or-filter-container .or-close-btn {
                position: absolute !important;
                top: 14px !important;
                right: 14px !important;
                width: 24px !important;
                height: 24px !important;
                border-radius: 14px !important;
                background: rgba(142, 142, 147, 0) !important;
                color: #8e8e93 !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 14px !important;
                transition: all 0.3s ease !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
            }

            #or-filter-container .or-close-btn:hover {
                background: rgba(142, 142, 147, 0.2) !important;
                color: #1d1d1f !important;
            }

            /* 表单组 */
            #or-filter-container .or-form-group {
                line-height: 0 !important;
                margin: 0 0 14px 0 !important;
                padding: 0 !important;
            }

            #or-filter-container .or-label {
                display: block !important;
                font-size: 16px !important;
                font-weight: 600 !important;
                color: #1d1d1f !important;
                margin: 0 0 7px 0 !important;
                padding: 0 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                line-height: 1.2 !important;
                border: none !important;
                background: none !important;
            }

            /* 输入框和选择框 */
            #or-filter-container .or-input,
            #or-filter-container .or-select {
                width: 100% !important;
                padding: 8px 12px !important;
                background: rgba(142, 142, 147, 0) !important;
                border: 1px solid rgba(255, 107, 53, 0.5) !important;
                border-radius: 7px !important;
                font-size: 14px !important;
                color: #1d1d1f !important;
                transition: all 0.2s ease !important;
                outline: none !important;
                margin: 0 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                box-sizing: border-box !important;
            }

            #or-filter-container .or-input:focus,
            #or-filter-container .or-select:focus {
                background: rgba(255, 255, 255, 0) !important;
                border-color: rgba(255, 107, 53, 1) !important;
            }

            #or-filter-container .or-input::placeholder {
                color: #8e8e93 !important;
            }

            /* 按钮 */
            #or-filter-container .or-btn {
                width: 100% !important;
                border-radius: 7px !important;
                font-size: 14px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                margin: 0 0 14px 0 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                outline: none !important;
                padding: 8px 12px !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                box-sizing: border-box !important;
                border: none !important;
            }

            #or-filter-container .or-btn-primary {
                background: linear-gradient(135deg, #FF6B35BC, #F7931EBC) !important;
                color: white !important;
            }

            #or-filter-container .or-btn-primary:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3) !important;
            }

            #or-filter-container .or-btn-success {
                background: linear-gradient(135deg, #34C759BC, #30D158BC) !important;
                color: white !important;
            }

            #or-filter-container .or-btn-success:hover:not(:disabled) {
                transform: translateY(-1px) !important;
                box-shadow: 0 8px 25px rgba(52, 199, 89, 0.3) !important;
            }

            #or-filter-container .or-btn:disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
                transform: none !important;
            }

            /* 统计信息 */
            #or-filter-container .or-stats {
                text-align: center !important;
                font-size: 12px !important;
                color: #8e8e93 !important;
                margin: 0 0 14px 0 !important;
                padding: 8px 12px !important;
                background: rgba(142, 142, 147, 0.08) !important;
                border-radius: 7px !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                font-weight: 400 !important;
                border: none !important;
                line-height: 1.3 !important;
            }

            /* 结果区域 */
            #or-filter-container .or-result-area {
                max-height: 200px !important;
                overflow-y: auto !important;
                border-radius: 12px !important;
                background: rgba(142, 142, 147, 0) !important;
                border: 1px solid rgba(142, 142, 147, 0.1) !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            #or-filter-container .or-textarea {
                width: 100% !important;
                height: 200px !important;
                padding: 16px !important;
                border: none !important;
                background: transparent !important;
                color: #1d1d1f !important;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
                font-size: 12px !important;
                line-height: 1.5 !important;
                resize: none !important;
                outline: none !important;
                margin: 0 !important;
                box-sizing: border-box !important;
            }

            #or-filter-container .or-textarea::placeholder {
                color: #8e8e93 !important;
            }

            /* 滚动条样式 */
            #or-filter-container .or-result-area::-webkit-scrollbar,
            #or-filter-container .or-panel::-webkit-scrollbar {
                width: 6px !important;
            }

            #or-filter-container .or-result-area::-webkit-scrollbar-track,
            #or-filter-container .or-panel::-webkit-scrollbar-track {
                background: rgba(142, 142, 147, 0.1) !important;
                border-radius: 3px !important;
            }

            #or-filter-container .or-result-area::-webkit-scrollbar-thumb,
            #or-filter-container .or-panel::-webkit-scrollbar-thumb {
                background: rgba(142, 142, 147, 0.3) !important;
                border-radius: 3px !important;
            }

            #or-filter-container .or-result-area::-webkit-scrollbar-thumb:hover,
            #or-filter-container .or-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(142, 142, 147, 0.5) !important;
            }

            /* 动画 */
            @keyframes or-bounce-in {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }

            #or-filter-container .or-toggle-btn.or-animate {
                animation: or-bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建界面
    function createFilterUI() {
        const container = document.createElement('div');
        container.id = 'or-filter-container';

        container.innerHTML = `
            <div class="or-toggle-btn or-animate" id="or-toggle">🔍</div>
            <div class="or-panel" id="or-panel">
                <div class="or-close-btn" id="or-close">×</div>
                <div class="or-title">OpenRouter模型筛选器</div>

                <div class="or-form-group">
                    <label class="or-label">关键词筛选</label>
                    <input type="text" id="or-keywords" class="or-input" placeholder="输入关键词，用逗号分隔，如：gpt,claude">
                </div>

                <div class="or-form-group">
                    <label class="or-label">最大价格 ($)</label>
                    <input type="number" id="or-max-price" class="or-input" placeholder="输入最大价格，0为免费" min="0" step="0.001" value="">
                </div>

                <div class="or-form-group">
                    <label class="or-label">模型厂商</label>
                    <select id="or-provider" class="or-select">
                        <option value="all">所有厂商</option>
                    </select>
                </div>

                <div class="or-form-group">
                    <label class="or-label">上下文长度</label>
                    <select id="or-context" class="or-select">
                        <option value="all">所有长度</option>
                        <option value="32000">≥32K</option>
                        <option value="64000">≥64K</option>
                        <option value="128000">≥128K</option>
                        <option value="200000">≥200K</option>
                    </select>
                </div>

                <div class="or-form-group">
                    <label class="or-label">输出格式</label>
                    <select id="or-output-format" class="or-select">
                        <option value="model_id">模型ID</option>
                        <option value="model_name">模型名称</option>
                        <option value="comma">逗号分隔</option>
                        <option value="newline">换行分隔</option>
                        <option value="detailed">详细信息</option>
                    </select>
                </div>

                <button id="or-refresh-btn" class="or-btn or-btn-primary">刷新数据</button>

                <button id="or-copy-btn" class="or-btn or-btn-success" disabled>复制结果</button>

                <div class="or-stats">
                    <div>找到的模型数量: <span id="or-model-count">0</span></div>
                    <div>总计模型: <span id="or-total-count">0</span></div>
                </div>

                <div class="or-result-area">
                    <textarea id="or-result-output" class="or-textarea" placeholder="筛选结果将显示在这里..." readonly></textarea>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 绑定事件
        document.getElementById('or-toggle').addEventListener('click', togglePanel);
        document.getElementById('or-close').addEventListener('click', togglePanel);
        document.getElementById('or-refresh-btn').addEventListener('click', fetchModelData);
        document.getElementById('or-copy-btn').addEventListener('click', copyResults);

        // 实时筛选 - 价格变化时重新获取数据
        ['or-keywords', 'or-provider', 'or-context', 'or-output-format'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', filterModels);
                if (element.type === 'text') {
                    element.addEventListener('input', filterModels);
                }
            }
        });

        // 价格输入变化时重新获取数据
        document.getElementById('or-max-price').addEventListener('change', fetchModelData);
        document.getElementById('or-max-price').addEventListener('input', debounce(fetchModelData, 1000));

        // 初始加载数据
        fetchModelData();
    }

    // 切换面板
    function togglePanel() {
        const panel = document.getElementById('or-panel');
        isExpanded = !isExpanded;

        if (isExpanded) {
            panel.classList.add('expanded');
        } else {
            panel.classList.remove('expanded');
        }
    }

    // 获取模型数据
    async function fetchModelData() {
        console.log('开始获取OpenRouter模型数据...');

        const refreshBtn = document.getElementById('or-refresh-btn');
        refreshBtn.disabled = true;
        refreshBtn.textContent = '获取中...';

        try {
            // 根据用户输入的最大价格动态构建API URL
            const maxPriceInput = document.getElementById('or-max-price').value;
            let apiUrl = "https://openrouter.ai/api/frontend/models/find";

            // 如果用户输入了最大价格，添加到API参数中
            if (maxPriceInput !== '') {
                apiUrl += `?max_price=${maxPriceInput}`;
            }

            const response = await fetch(apiUrl, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                },
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });

            const data = await response.json();

            if (data && data.data && data.data.models) {
                extractedModels = data.data.models
                    .filter(model => model.endpoint && model.endpoint.model_variant_slug) // 过滤掉endpoint为null的模型
                    .map(model => {
                        // 按照你原始代码的逻辑，使用 model_variant_slug
                        const modelId = model.endpoint.model_variant_slug;

                        return {
                            id: modelId,
                            name: model.name || modelId,
                            provider: model.endpoint.provider_name || model.endpoint.provider_display_name || 'Unknown',
                            pricing: {
                                prompt: parseFloat(model.endpoint.pricing?.prompt || 0),
                                completion: parseFloat(model.endpoint.pricing?.completion || 0),
                                image: parseFloat(model.endpoint.pricing?.image || 0),
                                request: parseFloat(model.endpoint.pricing?.request || 0)
                            },
                            context_length: parseInt(model.endpoint.context_length || 0),
                            description: model.description || '',
                            input_modalities: model.input_modalities || ['text'],
                            output_modalities: model.output_modalities || ['text'],
                            is_free: model.endpoint.is_free || false,
                            raw: model
                        };
                    });

                console.log(`成功获取 ${extractedModels.length} 个模型`);

                // 更新厂商选择器
                updateProviderSelect();

                // 执行筛选
                filterModels();

                document.getElementById('or-total-count').textContent = extractedModels.length;
            } else {
                throw new Error('API返回数据格式异常');
            }

        } catch (error) {
            console.error('获取模型数据失败:', error);
            document.getElementById('or-result-output').value = `获取数据失败: ${error.message}`;
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.textContent = '刷新数据';
        }
    }

    // 更新厂商选择器
    function updateProviderSelect() {
        const providerSelect = document.getElementById('or-provider');
        const providers = [...new Set(extractedModels.map(model => model.provider))].sort();

        // 保留当前选择的值
        const currentValue = providerSelect.value;

        // 清空选项（保留"所有厂商"）
        providerSelect.innerHTML = '<option value="all">所有厂商</option>';

        // 添加厂商选项
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider;
            option.textContent = provider;
            providerSelect.appendChild(option);
        });

        // 恢复选择的值（如果还存在）
        if (currentValue && [...providerSelect.options].some(opt => opt.value === currentValue)) {
            providerSelect.value = currentValue;
        }
    }

    // 检查模型是否匹配关键词
    function matchesKeywords(model, keywords) {
        if (!keywords.trim()) return true;

        const keywordList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
        const searchText = `${model.name} ${model.id} ${model.description}`.toLowerCase();

        return keywordList.some(keyword => searchText.includes(keyword));
    }

    // 获取模型最大价格
    function getModelMaxPrice(model) {
        // 首先检查是否明确标记为免费
        if (model.is_free) {
            return 0;
        }

        // 获取所有非零价格
        const prices = Object.values(model.pricing).filter(price => !isNaN(price) && price > 0);

        // 如果没有任何价格大于0，认为是免费的
        if (prices.length === 0) {
            return 0;
        }

        // 返回最高价格
        return Math.max(...prices);
    }

    // 筛选模型
    function filterModels() {
        if (extractedModels.length === 0) {
            document.getElementById('or-result-output').value = '没有模型数据，请点击"刷新数据"获取';
            document.getElementById('or-model-count').textContent = '0';
            return;
        }

        const keywords = document.getElementById('or-keywords').value;
        const maxPriceInput = document.getElementById('or-max-price').value;
        const maxPrice = maxPriceInput === '' ? Infinity : parseFloat(maxPriceInput);
        const provider = document.getElementById('or-provider').value;
        const contextLength = parseInt(document.getElementById('or-context').value) || 0;
        const outputFormat = document.getElementById('or-output-format').value;

        console.log('筛选参数:', { keywords, maxPrice, provider, contextLength, outputFormat });

        const filteredModels = extractedModels.filter(model => {
            // 关键词筛选
            if (!matchesKeywords(model, keywords)) {
                return false;
            }

            // 厂商筛选
            if (provider !== 'all' && model.provider !== provider) {
                return false;
            }

            // 上下文长度筛选
            if (contextLength > 0 && model.context_length < contextLength) {
                return false;
            }

            // 注意：价格筛选已经在API层面完成，这里不需要再筛选价格

            return true;
        });

        console.log(`筛选后模型数量: ${filteredModels.length}`);

        // 按名称排序
        filteredModels.sort((a, b) => a.name.localeCompare(b.name));

        // 生成输出
        let output = '';
        switch (outputFormat) {
            case 'model_name':
                output = filteredModels.map(model => model.name).join('\n');
                break;
            case 'model_id':
                output = filteredModels.map(model => model.id).join('\n');
                break;
            case 'comma':
                output = filteredModels.map(model => model.id).join(', ');
                break;
            case 'newline':
                output = filteredModels.map(model => model.id).join('\n');
                break;
            case 'detailed':
                output = filteredModels.map(model => {
                    const maxPrice = getModelMaxPrice(model);
                    const priceText = maxPrice === 0 ? '免费' : `${maxPrice.toFixed(6)}`;
                    const contextText = model.context_length > 0 ? `${model.context_length.toLocaleString()}` : '未知';
                    const modalityText = model.input_modalities ? model.input_modalities.join('+') : 'text';
                    return `${model.name} | ${model.provider} | ${priceText} | ${contextText} tokens | ${modalityText} | ${model.id}`;
                }).join('\n');
                break;
            default:
                output = filteredModels.map(model => model.id).join('\n');
        }

        document.getElementById('or-result-output').value = output;
        document.getElementById('or-model-count').textContent = filteredModels.length;
        document.getElementById('or-copy-btn').disabled = filteredModels.length === 0;
    }

    // 复制结果
    function copyResults() {
        const textarea = document.getElementById('or-result-output');
        textarea.select();
        textarea.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');

            const btn = document.getElementById('or-copy-btn');
            const originalText = btn.textContent;
            btn.textContent = '已复制!';
            btn.style.background = 'linear-gradient(135deg, #FF9500, #FF6482)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = 'linear-gradient(135deg, #34C759, #30D158)';
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动选择文本复制');
        }
    }

    // 初始化
    function init() {
        createStyles();
        createFilterUI();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();