// ==UserScript==
// @name         SiliconFlow 模型筛选器
// @namespace    siliconflow-model-filter
// @version      2025.0.1
// @description  在 SiliconFlow 价格页面添加筛选功能
// @author       delph1s
// @license      MIT
// @icon         https://siliconflow.cn/logo-footer.svg
// @match        https://siliconflow.cn/pricing*
// @match        https://siliconflow.cn/pricing
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545801/SiliconFlow%20%E6%A8%A1%E5%9E%8B%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545801/SiliconFlow%20%E6%A8%A1%E5%9E%8B%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
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
            #sf-filter-container {
                position: fixed !important;
                bottom: 14px !important;
                right: 14px !important;
                z-index: 99999 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
            }

            /* 浮动按钮 */
            #sf-filter-container .sf-toggle-btn {
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

            #sf-filter-container .sf-toggle-btn:hover {
                transform: scale(1.2) !important;
                box-shadow: 0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1) !important;
            }

            /* 主面板 */
            #sf-filter-container .sf-panel {
                position: absolute !important;
                bottom: 0 !important;
                right: 0 !important;
                width: 360px !important;
                max-height: 80vh !important;
                background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1)) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border-radius: 14px !important;
                border: 1px solid rgba(255,255,255,0.3) !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.05) !important;
                padding: 24px !important;
                transform: scale(0.8) translateX(360px) !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                overflow: hidden !important;
                margin: 0 !important;
            }

            #sf-filter-container .sf-panel.expanded {
                // animation: sf-panel-bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                transform: scale(1) translateX(0) !important;
                opacity: 1 !important;
                visibility: visible !important;
            }

            @keyframes sf-panel-bounce-in {
                0% {
                    transform: scale(0.3) translateX(300px) !important;
                    opacity: 0 !important;
                    visibility: visible !important;
                }
                25% {
                    transform: scale(0.7) translateX(150px) !important;
                    opacity: 0.7 !important;
                }
                50% {
                    transform: scale(1.1) translateX(-20px) !important;
                    opacity: 0.9 !important;
                }
                65% {
                    transform: scale(0.9) translateX(10px) !important;
                    opacity: 1 !important;
                }
                80% {
                    transform: scale(1.05) translateX(-5px) !important;
                }
                100% {
                    transform: scale(1) translateX(0) !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                }
            }

            /* 标题 */
            #sf-filter-container .sf-title {
                font-size: 24px !important;
                font-weight: 700 !important;
                color: #1d1d1f !important;
                margin: 0 0 14px 0 !important;
                padding: 0 !important;
                text-align: center !important;
                background: linear-gradient(135deg, #007AFF, #5856D6) !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                background-clip: text !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                line-height: 1.2 !important;
                border: none !important;
            }

            /* 关闭按钮 */
            #sf-filter-container .sf-close-btn {
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

            #sf-filter-container .sf-close-btn:hover {
                background: rgba(142, 142, 147, 0.2) !important;
                color: #1d1d1f !important;
            }

            /* 表单组 */
            #sf-filter-container .sf-form-group {
                line-height: 0 !important;
                margin: 0 0 14px 0 !important;
                padding: 0 !important;
            }

            #sf-filter-container .sf-label {
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
            #sf-filter-container .sf-input,
            #sf-filter-container .sf-select {
                width: 100% !important;
                padding: 8px 12px !important;
                background: rgba(142, 142, 147, 0) !important;
                border: 1px solid rgba(0, 122, 255, 0.5) !important;
                border-radius: 7px !important;
                font-size: 14px !important;
                color: #1d1d1f !important;
                transition: all 0.2s ease !important;
                outline: none !important;
                margin: 0 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                box-sizing: border-box !important;
            }

            #sf-filter-container .sf-input:focus,
            #sf-filter-container .sf-select:focus {
                background: rgba(255, 255, 255, 0) !important;
                border-color: rgba(0, 122, 255, 1) !important;
                // box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1) !important;
            }

            #sf-filter-container .sf-input::placeholder {
                color: #8e8e93 !important;
            }

            /* 按钮 */
            #sf-filter-container .sf-btn {
                width: 100% !important;
                // height: 36px !important;
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

            #sf-filter-container .sf-btn-primary {
                background: linear-gradient(135deg, #007AFFBC, #5856D6BC) !important;
                color: white !important;
            }

            #sf-filter-container .sf-btn-primary:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3) !important;
            }

            #sf-filter-container .sf-btn-success {
                background: linear-gradient(135deg, #34C759BC, #30D158BC) !important;
                color: white !important;
            }

            #sf-filter-container .sf-btn-success:hover:not(:disabled) {
                transform: translateY(-1px) !important;
                box-shadow: 0 8px 25px rgba(52, 199, 89, 0.3) !important;
            }

            #sf-filter-container .sf-btn:disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
                transform: none !important;
            }

            /* 统计信息 */
            #sf-filter-container .sf-stats {
                text-align: center !important;
                font-size: 14px !important;
                color: #8e8e93 !important;
                margin: 0 0 14px 0 !important;
                padding: 8px 12px !important;
                background: rgba(142, 142, 147, 0.08) !important;
                border-radius: 7px !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
                font-weight: 400 !important;
                border: none !important;
            }

            /* 结果区域 */
            #sf-filter-container .sf-result-area {
                max-height: 200px !important;
                overflow-y: auto !important;
                border-radius: 12px !important;
                background: rgba(142, 142, 147, 0) !important;
                border: 1px solid rgba(142, 142, 147, 0.1) !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            #sf-filter-container .sf-textarea {
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

            #sf-filter-container .sf-textarea::placeholder {
                color: #8e8e93 !important;
            }

            /* 滚动条样式 */
            #sf-filter-container .sf-result-area::-webkit-scrollbar,
            #sf-filter-container .sf-panel::-webkit-scrollbar {
                width: 6px !important;
            }

            #sf-filter-container .sf-result-area::-webkit-scrollbar-track,
            #sf-filter-container .sf-panel::-webkit-scrollbar-track {
                background: rgba(142, 142, 147, 0.1) !important;
                border-radius: 3px !important;
            }

            #sf-filter-container .sf-result-area::-webkit-scrollbar-thumb,
            #sf-filter-container .sf-panel::-webkit-scrollbar-thumb {
                background: rgba(142, 142, 147, 0.3) !important;
                border-radius: 3px !important;
            }

            #sf-filter-container .sf-result-area::-webkit-scrollbar-thumb:hover,
            #sf-filter-container .sf-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(142, 142, 147, 0.5) !important;
            }

            /* 动画 */
            @keyframes sf-bounce-in {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }

            #sf-filter-container .sf-toggle-btn.sf-animate {
                animation: sf-bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建界面
    function createFilterUI() {
        const container = document.createElement('div');
        container.id = 'sf-filter-container';

        container.innerHTML = `
            <div class="sf-toggle-btn sf-animate" id="sf-toggle">⚡</div>
            <div class="sf-panel" id="sf-panel">
                <div class="sf-close-btn" id="sf-close">×</div>
                <div class="sf-title">硅基流动模型筛选器</div>

                <div class="sf-form-group">
                    <label class="sf-label">关键词筛选</label>
                    <input type="text" id="sf-keywords" class="sf-input" placeholder="输入关键词，用逗号分隔，如：gpt,claude">
                </div>

                <div class="sf-form-group">
                    <label class="sf-label">免费模型</label>
                    <select id="sf-free-filter" class="sf-select">
                        <option value="all">所有模型</option>
                        <option value="free-only">仅免费模型</option>
                        <option value="paid-only">仅付费模型</option>
                    </select>
                </div>

                <div class="sf-form-group">
                    <label class="sf-label">模型类型</label>
                    <select id="sf-model-type" class="sf-select">
                        <option value="all">所有类型</option>
                        <option value="text">文本模型</option>
                        <option value="image">图像模型</option>
                        <option value="audio">音频模型</option>
                        <option value="video">视频模型</option>
                        <option value="embedding">嵌入模型</option>
                    </select>
                </div>

                <div class="sf-form-group">
                    <label class="sf-label">输出格式</label>
                    <select id="sf-output-format" class="sf-select">
                        <option value="comma">逗号分隔</option>
                        <option value="newline">换行分隔</option>
                        <option value="detailed">详细信息</option>
                    </select>
                </div>

                <button id="sf-filter-btn" class="sf-btn sf-btn-primary">筛选模型</button>

                <button id="sf-copy-btn" class="sf-btn sf-btn-success" disabled>复制结果</button>

                <div class="sf-stats">
                    找到的模型数量: <span id="sf-model-count">0</span>
                </div>

                <div class="sf-result-area">
                    <textarea id="sf-result-output" class="sf-textarea" placeholder="筛选结果将显示在这里..." readonly></textarea>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 绑定事件
        document.getElementById('sf-toggle').addEventListener('click', togglePanel);
        document.getElementById('sf-close').addEventListener('click', togglePanel);
        document.getElementById('sf-filter-btn').addEventListener('click', filterModels);
        document.getElementById('sf-copy-btn').addEventListener('click', copyResults);

        // 实时筛选
        ['sf-keywords', 'sf-free-filter', 'sf-model-type', 'sf-output-format'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', filterModels);
                if (element.type === 'text') {
                    element.addEventListener('input', filterModels);
                }
            }
        });

        // 首次提取数据
        extractModelData();
    }

    // 切换面板
    function togglePanel() {
        const panel = document.getElementById('sf-panel');
        isExpanded = !isExpanded;

        if (isExpanded) {
            panel.classList.add('expanded');
        } else {
            panel.classList.remove('expanded');
        }
    }

    // 改进的数据提取函数，专门针对Next.js格式
    function extractModelData() {
        console.log('开始提取模型数据...');
        extractedModels = [];
        try {
            // 查找包含模型数据的script标签
            const scripts = document.querySelectorAll('script');
            let modelsData = null;

            for (let script of scripts) {
                const content = script.textContent;
                if (content && content.includes('self.__next_f.push') && content.includes('chats')) {
                    // 提取JSON数据
                    const match = content.match(/self\.__next_f\.push\(\[.*?\]\)/);
                    if (match) {
                        try {
                            // 解析推送的数据
                            const pushData = match[0].replace('self.__next_f.push(', '').slice(0, -1);
                            const parsed = JSON.parse(pushData);

                            // 查找包含模型数据的部分
                            if (parsed.length > 1 && typeof parsed[1] === 'string') {
                                const jsonStr = parsed[1].replace(/^\d+:\[/, '[').replace(/\]$/, ']');
                                const dataArray = JSON.parse(jsonStr);

                                // 查找数据对象
                                if (!!dataArray[1] && !!dataArray[1][3] && !!dataArray[1][3].data) {
                                    modelsData = dataArray[1][3].data;
                                    parseModelData(modelsData);
                                } else {
                                    console.warn('未找到数据');
                                }
                            }
                        } catch (e) {
                            console.warn('解析Next.js数据时出错:', e);
                        }
                    }
                }
            }

            console.log(`最终提取到 ${extractedModels.length} 个模型`);

        } catch (error) {
            console.error('提取模型数据时出错:', error);
        }
    }

    // 解析模型数据
    function parseModelData(data) {
        const categories = [
            { key: 'chats', type: 'text' },
            { key: 'images', type: 'image' },
            { key: 'audios', type: 'audio' },
            { key: 'videos', type: 'video' },
            { key: 'embeddings', type: 'embedding' }
        ];

        categories.forEach(({ key, type }) => {
            if (data[key] && Array.isArray(data[key])) {
                console.log(`处理 ${key} 类别，找到 ${data[key].length} 个模型`);
                data[key].forEach(model => {
                    extractedModels.push({
                        ...model,
                        category: type
                    });
                });
            }
        });
    }

    // 在数据中查找模型
    function findModelsInData(data) {
        if (Array.isArray(data)) {
            data.forEach(item => findModelsInData(item));
        } else if (data && typeof data === 'object') {
            if (data.chats || data.images || data.audios || data.videos || data.embeddings) {
                parseModelData(data);
            } else {
                Object.values(data).forEach(value => {
                    if (typeof value === 'object') {
                        findModelsInData(value);
                    }
                });
            }
        }
    }

    // 判断模型是否免费
    function isModelFree(model) {
        const pricing = model.pricing || [];

        // 检查所有价格是否为0
        const allPricesZero = pricing.every(p => parseFloat(p.price) === 0);

        // 检查通用价格字段
        const generalPrice = parseFloat(model.price) || 0;
        const inputPrice = parseFloat(model.inputPrice) || 0;

        return allPricesZero && generalPrice === 0 && inputPrice === 0;
    }

    // 检查模型名称是否包含关键词
    function matchesKeywords(modelName, keywords) {
        if (!keywords.trim()) return true;

        const keywordList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
        const modelNameLower = modelName.toLowerCase();

        return keywordList.some(keyword => modelNameLower.includes(keyword));
    }

    // 筛选模型
    function filterModels() {
        console.log('开始筛选模型...');

        if (extractedModels.length === 0) {
            console.log('没有模型数据，重新提取...');
            extractModelData();
            if (extractedModels.length === 0) {
                console.warn('仍然没有找到模型数据');
                document.getElementById('sf-result-output').value = '没有找到模型数据，请刷新页面重试';
                return;
            }
        }

        const keywords = document.getElementById('sf-keywords').value;
        const freeFilter = document.getElementById('sf-free-filter').value;
        const modelType = document.getElementById('sf-model-type').value;
        const outputFormat = document.getElementById('sf-output-format').value;

        console.log('筛选参数:', { keywords, freeFilter, modelType, outputFormat });
        console.log('可用模型数量:', extractedModels.length);

        const filteredModels = extractedModels.filter(model => {
            // 类型筛选
            if (modelType !== 'all' && model.category !== modelType) {
                return false;
            }

            // 关键词筛选
            if (!matchesKeywords(model.modelName, keywords)) {
                return false;
            }

            // 免费模型筛选
            const isFree = isModelFree(model);
            if (freeFilter === 'free-only' && !isFree) {
                return false;
            }
            if (freeFilter === 'paid-only' && isFree) {
                return false;
            }

            return true;
        });

        console.log('筛选后模型数量:', filteredModels.length);

        // 按模型名称排序
        filteredModels.sort((a, b) => a.modelName.localeCompare(b.modelName));

        // 生成输出
        let output = '';
        if (outputFormat === 'detailed') {
            output = filteredModels.map(model => {
                const isFree = isModelFree(model);
                const freeStatus = isFree ? '免费' : '付费';
                return `${model.modelName} | ${freeStatus} | ${model.category}`;
            }).join('\n');
        } else {
            const modelNames = filteredModels.map(model => model.modelName);
            output = outputFormat === 'comma' ? modelNames.join(', ') : modelNames.join('\n');
        }

        document.getElementById('sf-result-output').value = output;
        document.getElementById('sf-model-count').textContent = filteredModels.length;
        document.getElementById('sf-copy-btn').disabled = filteredModels.length === 0;
    }

    // 复制结果
    function copyResults() {
        const textarea = document.getElementById('sf-result-output');
        textarea.select();
        textarea.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');

            const btn = document.getElementById('sf-copy-btn');
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

        // 延迟提取数据，确保页面完全加载
        setTimeout(() => {
            extractModelData();
            filterModels();
        }, 3000);

        // 定期重试提取数据
        const retryInterval = setInterval(() => {
            if (extractedModels.length === 0) {
                console.log('重试提取数据...');
                extractModelData();
            } else {
                clearInterval(retryInterval);
            }
        }, 5000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();