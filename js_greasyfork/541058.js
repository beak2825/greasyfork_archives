// ==UserScript==
// @name         Smartling AI Translator (OpenRouter) - Fixed
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  使用AI大语言模型翻译Smartling页面，修复翻译显示问题
// @author       LL-Floyd
// @license      MIT
// @match        https://ti.smartling.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      openrouter.ai
// @connect      update.greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/541058/Smartling%20AI%20Translator%20%28OpenRouter%29%20-%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/541058/Smartling%20AI%20Translator%20%28OpenRouter%29%20-%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debugClickCount = 0;
    let debugClickTimer = null;

    // 预设配置
    const DEFAULT_CONFIG = {
        // 预设模型配置 (插件自带)
        provider: {
            name: 'OpenRouter',
            url: 'https://openrouter.ai/api/v1/chat/completions',
            apiKey: '', // API Key 将由用户输入
            model: 'openai/gpt-4.1-mini'
        },
        
        // 为未来高级用户自定义配置预留接口
        customProviders: [],
        
        batchSize: 2, // 减少批量大小，提高成功率
        enableDirectFill: false,
        autoDetectLanguage: true
    };

    // 语言代码映射
    const LANGUAGES = {
        'auto': '自动检测',
        'en': 'English',
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文'
    };

    // 语言检测映射
    const LANGUAGE_PATTERNS = {
        'en': /^[a-zA-Z\s\.,;:!?'"()\-&@#$%0-9]+$/,
        'zh-CN': /[\u4e00-\u9fff]/,
        'zh-TW': /[\u4e00-\u9fff]/,
    };

    let currentSettings = {
        sourceLanguage: 'auto',
        targetLanguage: 'zh-CN',
        selectedProvider: 0
    };

    // 获取页面参数
    function getPageParams() {
        // console.log('🔍 开始获取页面参数...');
        // console.log('当前URL:', window.location.href);
        
        let projectId = null;
        let jobUid = null;
        let workflowStepUid = null;

        try {
            const url = window.location.href;
            const urlObject = new URL(url);

            // 从URL路径中提取项目ID
            const pathPatterns = [
                /\/projects\/([^\/\?]+)/,
                /\/app\/([^\/\?]+)/,
                /\/p\/([^\/\?]+)/,
            ];

            for (const pattern of pathPatterns) {
                const match = url.match(pattern);
                if (match && match[1]) {
                    projectId = match[1];
                    // console.log(`✅ 提取到项目ID:`, projectId);
                    break;
                }
            }

            // 从URL查询参数中提取
            jobUid = urlObject.searchParams.get('translationJobUids');
            workflowStepUid = urlObject.searchParams.get('workflowStepUids');
            
            // 从查询参数中提取目标语言
            const urlTargetLanguage = urlObject.searchParams.get('locale');
            if (urlTargetLanguage) {
                currentSettings.targetLanguage = urlTargetLanguage;
                // console.log('✅ 从URL提取到目标语言:', urlTargetLanguage);
            }

            // console.log('📋 最终提取结果:', { projectId, jobUid, workflowStepUid });
            return { projectId, jobUid, workflowStepUid };

        } catch (error) {
            console.error('❌ 获取页面参数时出错:', error);
            return { projectId, jobUid, workflowStepUid };
        }
    }

    // 简单语言检测
    function detectLanguage(text) {
        if (!DEFAULT_CONFIG.autoDetectLanguage) {
            return currentSettings.sourceLanguage === 'auto' ? 'en' : currentSettings.sourceLanguage;
        }

        const cleanText = text.trim().toLowerCase();
        
        for (const [langCode, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
            if (pattern.test(cleanText)) {
                return langCode;
            }
        }
        
        return 'en';
    }

    // 获取当前使用的提供商配置
    function getCurrentProvider() {
        const allProviders = [DEFAULT_CONFIG.provider, ...DEFAULT_CONFIG.customProviders];
        return allProviders[currentSettings.selectedProvider] || DEFAULT_CONFIG.provider;
    }

    // 获取当前提供商的API Key
    async function getCurrentApiKey() {
        const provider = getCurrentProvider();
        return await GM_getValue(`smartling-mt-translator-apikey-${provider.name}`, '');
    }

    // 保存当前提供商的API Key
    function saveCurrentApiKey(apiKey) {
        const provider = getCurrentProvider();
        GM_setValue(`smartling-mt-translator-apikey-${provider.name}`, apiKey);
    }

    // 使用AI模型翻译
    function translateWithAI(texts, detectedSourceLang = null) {
        return new Promise(async (resolve, reject) => {
            const provider = getCurrentProvider();
            const apiKey = await getCurrentApiKey();
            
            if (!apiKey || apiKey.includes('your-') || apiKey === 'not-needed') {
                reject(new Error(`请在面板中配置 ${provider.name} 的 API Key`));
                return;
            }

            const textsArray = Array.isArray(texts) ? texts : [texts];
            
            // 检测或使用指定的源语言
            const sourceLang = detectedSourceLang || detectLanguage(textsArray[0]);
            const targetLang = currentSettings.targetLanguage;
            
            const sourceLangName = LANGUAGES[sourceLang] || sourceLang;
            const targetLangName = LANGUAGES[targetLang] || targetLang;
            
            // console.log(`🌍 语言检测: ${sourceLang} (${sourceLangName}) -> ${targetLang} (${targetLangName})`);
            // console.log(`📝 要翻译的文本数量: ${textsArray.length}`, textsArray);

            // 改进的翻译提示 - 更清晰的格式要求
            const prompt = `你是一个专业的翻译专家。请将以下文本从 ${sourceLangName} 翻译为 ${targetLangName}。

重要要求：
1. 保持原文的语气和风格，确保翻译准确、自然、流畅。
2. 对于专业术语，使用标准的翻译。
3. 严格按照JSON格式返回。返回一个JSON对象，其中包含一个名为 "translations" 的键，其值为一个字符串数组，每个字符串是对应原文的译文。
4. 翻译结果数组中的元素数量必须与原文行数完全一致。

原文（共${textsArray.length}行）：
${textsArray.map((text, index) => `${index + 1}. ${text}`).join('\n')}

请返回包含 ${textsArray.length} 行翻译结果的JSON对象，格式如下：
{
  "translations": [
    "第一行文本的翻译",
    "第二行文本的翻译",
    ...
  ]
}`;

            const requestBody = {
                model: provider.model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                // temperature: 0.2, // 降低随机性
                // max_tokens: 3000
            };

            // 如果是OpenRouter，添加额外的配置
            if (provider.name === 'OpenRouter') {
                requestBody.top_p = 1;
                requestBody.frequency_penalty = 0;
                requestBody.presence_penalty = 0;
            }

            // console.log('🚀 发送AI翻译请求:', requestBody);

            GM_xmlhttpRequest({
                method: 'POST',
                url: provider.url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    // OpenRouter 特定的头部
                    ...(provider.name === 'OpenRouter' && {
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'Smartling AI Translator'
                    })
                },
                data: JSON.stringify(requestBody),
                onload: function(response) {
                    try {
                        // console.log('🤖 AI API 响应状态:', response.status);
                        
                        if (response.status !== 200) {
                            reject(new Error(`${provider.name} API 错误 (${response.status}): ${response.statusText}`));
                            return;
                        }

                        const data = JSON.parse(response.responseText);
                        // console.log('🤖 AI API 响应数据:', data);
                        
                        if (data.choices && data.choices[0] && data.choices[0].message) {
                            const translatedText = data.choices[0].message.content.trim();
                            // console.log('📝 AI原始翻译结果:', translatedText);
                            
                            // 改进的解析逻辑
                            const translatedContent = JSON.parse(translatedText);
                            let lines = translatedContent.translations || [];
                            
                            // 移除可能的序号
                            lines = lines.map(line => {
                                // 移除各种可能的序号格式：1. 、1、、• 等
                                return line.replace(/^[\d]+[\.\)、]\s*/, '').replace(/^[•\-\*]\s*/, '').trim();
                            });
                            
                            // 确保翻译结果数量与原文一致
                            if (lines.length < textsArray.length) {
                                console.warn(`⚠️ 翻译结果数量不足，期待${textsArray.length}个，得到${lines.length}个`);
                                // 补充缺失的翻译
                                while (lines.length < textsArray.length) {
                                    lines.push(`[翻译缺失] ${textsArray[lines.length]}`);
                                }
                            } else if (lines.length > textsArray.length) {
                                console.warn(`⚠️ 翻译结果过多，期待${textsArray.length}个，得到${lines.length}个`);
                                // 截取多余的翻译
                                lines = lines.slice(0, textsArray.length);
                            }
                            
                            // console.log('✅ 处理后的翻译结果:', lines);
                            resolve(Array.isArray(texts) ? lines : lines[0]);
                        } else {
                            reject(new Error(`${provider.name} API 返回了无效的翻译结果`));
                        }
                    } catch (error) {
                        console.error('❌ 解析AI响应失败:', error);
                        reject(new Error(`解析 ${provider.name} API 响应失败: ${error.message}`));
                    }
                },
                onerror: function(error) {
                    console.error('❌ AI请求失败:', error);
                    reject(new Error(`${provider.name} API 请求失败: ${error.status || '网络错误'}`));
                }
            });
        });
    }

    // 创建翻译面板
    function createTranslationPanel() {
        if (document.getElementById('smartling-ai-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'smartling-ai-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 13px;
            color: #333;
            max-height: 90vh;
            overflow-y: auto;
        `;

        const allProviders = [DEFAULT_CONFIG.provider, ...DEFAULT_CONFIG.customProviders];
        const currentProvider = getCurrentProvider();

        panel.innerHTML = `
            <div style="padding: 10px 12px; border-bottom: 1px solid #ddd; background: #efefef;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 600;">🤖 AI 智能翻译</h3>
                <div style="margin-top: 4px; font-size: 11px; opacity: 0.7;">
                    ${currentProvider.name} - ${currentProvider.model}
                </div>
            </div>
            <div style="padding: 12px;">
                <div id="project-id-container" style="margin-bottom: 10px;"></div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">AI 提供商：</label>
                    <select id="ai-provider" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; background: white;">
                        ${allProviders.map((provider, index) => 
                            `<option value="${index}" ${index === currentSettings.selectedProvider ? 'selected' : ''}>
                                ${provider.name} (${provider.model})
                            </option>`
                        ).join('')}
                    </select>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label for="api-key" style="display: block; margin-bottom: 4px; font-weight: 500;">API Key (<span id="api-key-provider-name">${currentProvider.name}</span>):</label>
                    <input type="password" id="api-key" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px;" placeholder="请在此处输入您的 API Key">
                </div>
                
                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 4px; font-weight: 500;">源语言：</label>
                        <select id="source-language" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; background: white;">
                            ${Object.entries(LANGUAGES).map(([code, name]) => 
                                `<option value="${code}" ${code === 'auto' ? 'selected' : ''}>${name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 4px; font-weight: 500;">目标语言：</label>
                        <select id="target-language" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; background: white;">
                            ${Object.entries(LANGUAGES).filter(([code]) => code !== 'auto').map(([code, name]) => 
                                `<option value="${code}" ${code === currentSettings.targetLanguage ? 'selected' : ''}>${name}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <label style="display: flex; align-items: center; font-size: 12px;" title="启用后，AI翻译结果将直接填入译文框，而不再显示预览和应用按钮。">
                        <input type="checkbox" id="enable-direct-fill" style="margin-right: 6px;" ${DEFAULT_CONFIG.enableDirectFill ? 'checked' : ''}>
                        <span>直接填充译文</span>
                    </label>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <button id="start-translation" style="width: 100%; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                        开始翻译
                    </button>
                    <button id="clear-previews" style="width: 100%; padding: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        清除预览
                    </button>
                    <button id="apply-all-translations" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; grid-column: 1 / -1;" disabled>
                        应用所有
                    </button>
                </div>
                
                <div id="translation-status" style="margin-top: 10px; padding: 6px 8px; background: #e9ecef; border-radius: 4px; font-size: 12px; text-align: center; display: none;">
                    准备就绪
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 显示项目信息
        const { projectId } = getPageParams();
        const projectIdContainer = document.getElementById('project-id-container');
        
        if (projectId) {
            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = `
                margin-bottom: 12px;
                padding: 8px;
                background: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
                font-size: 12px;
                color: #155724;
            `;
            infoDiv.innerHTML = `✅ 项目ID: <strong>${projectId}</strong>`;
            infoDiv.style.cursor = 'pointer';
            infoDiv.addEventListener('click', () => {
                debugClickCount++;
                clearTimeout(debugClickTimer);
                debugClickTimer = setTimeout(() => { debugClickCount = 0; }, 2000);
                if (debugClickCount >= 10) {
                    debugPageParams();
                    debugClickCount = 0;
                    clearTimeout(debugClickTimer);
                }
            });
            projectIdContainer.appendChild(infoDiv);
        }

        // 绑定事件
        document.getElementById('ai-provider').addEventListener('change', async () => {
            updateSettings();
            await updateApiKeyUI();
        });
        document.getElementById('source-language').addEventListener('change', updateSettings);
        document.getElementById('target-language').addEventListener('change', updateSettings);
        document.getElementById('enable-direct-fill').addEventListener('change', updateSettings);
        document.getElementById('start-translation').addEventListener('click', startTranslation);
        document.getElementById('clear-previews').addEventListener('click', clearAllPreviews);
        document.getElementById('apply-all-translations').addEventListener('click', applyAllTranslations);
        
        document.getElementById('api-key').addEventListener('input', (e) => {
            saveCurrentApiKey(e.target.value);
        });
        updateApiKeyUI();
    }

    // 更新API Key输入框的UI
    async function updateApiKeyUI() {
        const provider = getCurrentProvider();
        document.getElementById('api-key-provider-name').textContent = provider.name;
        document.getElementById('api-key').value = await getCurrentApiKey();
    }

    // 更新设置
    function updateSettings() {
        currentSettings.selectedProvider = parseInt(document.getElementById('ai-provider').value);
        currentSettings.sourceLanguage = document.getElementById('source-language').value;
        currentSettings.targetLanguage = document.getElementById('target-language').value;
        DEFAULT_CONFIG.enableDirectFill = document.getElementById('enable-direct-fill').checked;
        
        // console.log('设置已更新:', currentSettings);
        // console.log('当前提供商:', getCurrentProvider());
    }

    // 更新状态显示
    function updateStatus(message, type = 'info') {
        const statusDiv = document.getElementById('translation-status');
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.textContent = message;
            statusDiv.style.background = type === 'error' ? '#fce8e6' : 
                                       type === 'success' ? '#e6f4ea' : '#f8f9fa';
            statusDiv.style.color = type === 'error' ? '#d93025' : 
                                   type === 'success' ? '#137333' : '#666';
        }
    }

    // 获取翻译数据
    async function fetchTranslationData() {
        const { projectId, jobUid, workflowStepUid } = getPageParams();

        if (!projectId) {
            throw new Error('无法获取项目ID');
        }

        const requestBody = {
            maxResults: 1000,
            contentAuthorization: "READ",
            projectId: projectId,
            stringState: "IN_TRANSLATION",
            locale: currentSettings.targetLanguage,
            start: 0
        };

        if (jobUid) requestBody.translationJobUids = [jobUid];
        if (workflowStepUid) requestBody.workflowStepUids = [workflowStepUid];

        // console.log('🚀 发送翻译数据请求:', requestBody);

        const response = await fetch(`https://ti.smartling.com/p/translations-api/v2/projects/${projectId}/translations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API请求失败 (${response.status}): ${response.statusText}`);
        }

        const data = await response.json();
        // console.log('✅ 获取到翻译数据:', data);
        return data;
    }

    // 创建翻译预览元素 - 修复版
    function createTranslationPreview(hashcode, originalText, translatedText, detectedLang = null) {
        // console.log(`🎯 为hashcode ${hashcode} 创建预览:`, { originalText, translatedText });
        
        const existingPreview = document.querySelector(`[data-preview-hash="${hashcode}"]`);
        if (existingPreview) {
            existingPreview.remove();
        }

        const stringElement = document.querySelector(`[data-hash="${hashcode}"]`);
        if (!stringElement) {
            console.error(`❌ 找不到对应的元素，hashcode: ${hashcode}`);
            return false;
        }

        const targetSegment = stringElement.querySelector('[class*="segments__target"]');
        if (!targetSegment) {
            console.error(`❌ 找不到目标段落，hashcode: ${hashcode}`);
            return false;
        }

        // 如果启用直接填充模式，直接填充并返回
        if (DEFAULT_CONFIG.enableDirectFill) {
            return applyTranslation(hashcode, translatedText);
        }

        // 创建预览元素
        const previewDiv = document.createElement('div');
        previewDiv.setAttribute('data-preview-hash', hashcode);
        previewDiv.style.cssText = `
            margin-bottom: 6px;
            padding: 6px 8px;
            background: #f0f8ff;
            border: 1px solid #b3d9ff;
            border-left: 3px solid #007bff;
            border-radius: 4px;
            font-size: 13px;
            animation: slideIn 0.3s ease-out;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        const provider = getCurrentProvider();
        const langInfo = detectedLang ? ` (${LANGUAGES[detectedLang] || detectedLang})` : '';

        previewDiv.innerHTML = `
            <div style="word-wrap: break-word; flex-grow: 1; margin-right: 8px;">${translatedText}</div>
            <div style="white-space: nowrap;">
                <button class="apply-translation" style="padding: 2px 6px; margin-right: 4px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">应用</button>
                <button class="close-preview" style="padding: 2px 6px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">×</button>
            </div>
        `;

        // 添加CSS动画
        if (!document.getElementById('translation-preview-styles')) {
            const style = document.createElement('style');
            style.id = 'translation-preview-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        // 绑定按钮事件
        previewDiv.querySelector('.apply-translation').addEventListener('click', () => {
            applyTranslation(hashcode, translatedText);
            previewDiv.remove();
            updateApplyAllButton();
        });

        previewDiv.querySelector('.close-preview').addEventListener('click', () => {
            previewDiv.remove();
            updateApplyAllButton();
        });

        // 插入到目标元素之前
        targetSegment.parentNode.insertBefore(previewDiv, targetSegment);
        
        // console.log(`✅ 成功创建预览元素，hashcode: ${hashcode}`);
        updateApplyAllButton();
        return true;
    }

    // 应用翻译到页面
    function applyTranslation(hashcode, translatedText) {
        const stringElement = document.querySelector(`[data-hash="${hashcode}"]`);
        if (!stringElement) return false;

        const targetEditor = stringElement.querySelector('[class*="segments__target"] [class*="styles-module__slate-editable"]');
        if (!targetEditor) return false;

        const cleanText = translatedText
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

        const slateHTML = `<span data-slate-node="element" class=""><span data-slate-node="text"><span data-slate-leaf="true"><span data-slate-string="true">${cleanText}</span></span></span></span>`;

        targetEditor.innerHTML = slateHTML;

        // 触发事件
        targetEditor.dispatchEvent(new Event('input', { bubbles: true }));
        targetEditor.dispatchEvent(new Event('change', { bubbles: true }));
        targetEditor.dispatchEvent(new Event('blur', { bubbles: true }));

        // 添加成功反馈
        targetEditor.style.background = '#e8f5e8';
        setTimeout(() => {
            targetEditor.style.background = '';
        }, 2000);

        // console.log(`✅ 翻译已应用: "${cleanText}"`);
        return true;
    }

    //"应用所有译文"按钮状态
    function updateApplyAllButton() {
        const button = document.getElementById('apply-all-translations');
        const previews = document.querySelectorAll('[data-preview-hash]');
        
        if (button) {
            button.disabled = previews.length === 0;
            button.textContent = `📥 应用所有译文 (${previews.length})`;
        }
    }

    // 应用所有翻译
    function applyAllTranslations() {
        const previews = document.querySelectorAll('[data-preview-hash]');
        let count = 0;
        
        previews.forEach(preview => {
            const hashcode = preview.getAttribute('data-preview-hash');
            const translatedTextDiv = preview.querySelector('div');
            const translatedText = translatedTextDiv ? translatedTextDiv.textContent : '';
            
            if (translatedText && applyTranslation(hashcode, translatedText)) {
                count++;
                preview.remove();
            }
        });
        
        updateStatus(`✅ 已应用 ${count} 条翻译`, 'success');
        updateApplyAllButton();
    }

    // 清除所有预览
    function clearAllPreviews() {
        const previews = document.querySelectorAll('[data-preview-hash]');
        previews.forEach(preview => preview.remove());
        updateStatus('已清除所有预览');
        updateApplyAllButton();
    }

    // 调试页面参数
    function debugPageParams() {
        const params = getPageParams();
        const provider = getCurrentProvider();
        
        // 检查页面元素
        const allHashElements = document.querySelectorAll('[data-hash]');
        const targetElements = document.querySelectorAll('.segments__target');
        
        const debugInfo = `
📋 AI 翻译调试信息：

🔗 当前URL: ${window.location.href}

📍 提取到的参数:
- 项目ID: ${params.projectId || '❌ 未找到'}
- 作业ID: ${params.jobUid || '❌ 未找到'}  
- 工作流ID: ${params.workflowStepUid || '❌ 未找到'}

🤖 AI 配置:
- 提供商: ${provider.name}
- 模型: ${provider.model}
- API地址: ${provider.url}
- API Key: ${provider.apiKey ? '已配置' : '❌ 未配置'}

⚙️ 翻译设置:
- 源语言: ${currentSettings.sourceLanguage} (${LANGUAGES[currentSettings.sourceLanguage]})
- 目标语言: ${currentSettings.targetLanguage} (${LANGUAGES[currentSettings.targetLanguage]})
- 语言检测: ${DEFAULT_CONFIG.autoDetectLanguage ? '启用' : '禁用'}
- 直接填充: ${DEFAULT_CONFIG.enableDirectFill ? '启用' : '禁用'}

🎯 页面元素状态:
- 带hash的元素数量: ${allHashElements.length}
- 目标段落数量: ${targetElements.length}
- 翻译预览数量: ${document.querySelectorAll('[data-preview-hash]').length}
- 页面标题: ${document.title}

🔍 页面元素示例:
${Array.from(allHashElements).slice(0, 3).map((el, i) => 
    `${i+1}. hash: ${el.getAttribute('data-hash')?.substring(0, 8)}...`
).join('\n')}
        `;

        alert(debugInfo);
        // console.log('🔍 AI翻译调试信息:', { params, provider, currentSettings, allHashElements, targetElements });
    }

    // 检查更新
    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/541058/Smartling%20AI%20Translator%20(OpenRouter)%20-%20Fixed.meta.js",
            onload: function(response) {
                const latestVersion = /@version\s+([0-9.]+)/.exec(response.responseText)[1];
                const currentVersion = GM_info.script.version;
                if (latestVersion > currentVersion) {
                    if (confirm("Smartling AI Translator 有新版本可用: " + latestVersion + "\n当前版本: " + currentVersion + "\n\n点击\"确定\"前往更新。")) {
                        window.open("https://greasyfork.org/en/scripts/541058-smartling-ai-translator-openrouter-fixed", "_blank");
                    }
                }
            },
            onerror: function(error) {
                console.error('检查更新失败:', error);
            }
        });
    }

    // 主翻译流程 - 修复版
    async function startTranslation() {
        try {
            updateStatus('🔄 获取数据中...');

            const data = await fetchTranslationData();

            if (!data.response || !data.response.data) {
                throw new Error('无效的API响应');
            }

            const items = data.response.data.items || [];
            // 根据用户要求，翻译所有内容，而不仅仅是未翻译的内容
            const itemsToTranslate = items;

            if (itemsToTranslate.length === 0) {
                updateStatus('✅ 没有需要翻译的内容', 'success');
                return;
            }

            // console.log(`📝 找到 ${itemsToTranslate.length} 条需要翻译的内容`);
            updateStatus(`🤖 AI翻译中... (0/${itemsToTranslate.length})`);

            let successCount = 0;
            
            // 使用更小的批量大小，逐个处理以提高成功率
            for (let i = 0; i < itemsToTranslate.length; i += DEFAULT_CONFIG.batchSize) {
                const batch = itemsToTranslate.slice(i, i + DEFAULT_CONFIG.batchSize);
                const texts = batch.map(item => item.sourceText);
                
                // console.log(`🔄 处理批次 ${Math.floor(i/DEFAULT_CONFIG.batchSize) + 1}:`, texts);
                
                try {
                    // 检测第一个文本的语言（用于整批）
                    const detectedLang = currentSettings.sourceLanguage === 'auto' ? 
                        detectLanguage(texts[0]) : currentSettings.sourceLanguage;
                    
                    const translations = await translateWithAI(texts, detectedLang);
                    // console.log(`✅ 批次翻译完成:`, translations);
                    
                    // 确保翻译结果是数组
                    const translationsArray = Array.isArray(translations) ? translations : [translations];
                    
                    // 为每个翻译创建预览
                    for (let j = 0; j < batch.length; j++) {
                        const item = batch[j];
                        const translatedText = translationsArray[j] || `[翻译失败] ${item.sourceText}`;
                        
                        // console.log(`🎯 创建预览 ${i + j + 1}/${itemsToTranslate.length}:`, {
                        //     hashcode: item.hashcode,
                        //     sourceText: item.sourceText,
                        //     translatedText: translatedText
                        // });
                        
                        const success = createTranslationPreview(
                            item.hashcode, 
                            item.sourceText, 
                            translatedText,
                            detectedLang
                        );
                        
                        if (success) {
                            successCount++;
                            // console.log(`✅ AI翻译预览创建成功 (${successCount}/${itemsToTranslate.length}): "${item.sourceText}" -> "${translatedText}"`);
                        } else {
                            console.error(`❌ 预览创建失败: ${item.hashcode}`);
                        }
                        
                        updateStatus(`🤖 AI翻译中... (${i + j + 1}/${itemsToTranslate.length})`);
                    }
                    
                    // 批次间延迟
                    if (i + DEFAULT_CONFIG.batchSize < itemsToTranslate.length) {
                        // console.log('⏳ 等待下一个批次...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    
                } catch (error) {
                    console.error(`❌ 批次 ${Math.floor(i/DEFAULT_CONFIG.batchSize) + 1} AI翻译失败:`, error);
                    updateStatus(`❌ AI翻译失败: ${error.message}`, 'error');
                    // 继续处理下一个批次，而不是完全停止
                    continue;
                }
            }

            const mode = DEFAULT_CONFIG.enableDirectFill ? '直接填充' : '预览';
            updateStatus(`✅ 完成AI翻译${mode} (${successCount}/${itemsToTranslate.length})`, 'success');

            if (successCount > 0) {
                // console.log(`🎉 翻译完成！成功创建 ${successCount} 个预览`);
            }

        } catch (error) {
            console.error('AI翻译失败:', error);
            updateStatus(`❌ AI翻译失败: ${error.message}`, 'error');
        }
    }

    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createTranslationPanel();
                checkForUpdates();
            });
        } else {
            createTranslationPanel();
            checkForUpdates();
        }

        const observer = new MutationObserver(() => {
            if (!document.getElementById('smartling-ai-panel')) {
                createTranslationPanel();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    init();
    // console.log('🤖 Smartling AI Translator (OpenRouter) - Fixed 已加载');
})();
