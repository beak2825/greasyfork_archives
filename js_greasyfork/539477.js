// ==UserScript==
// @name         知乎 AI 总结助手 (多模型/缓存/自定义)
// @namespace    http://tampermonkey.net/
// @version      10.3.1
// @description  [v1.0 正式版] 强大的知乎回答总结工具。功能：1. 在知乎回答、信息流、问题列表页为回答添加“AI总结”按钮。2. 支持多种大语言模型（通义千问、DeepSeek、OpenAI）。3. 支持用户自定义API Key、模型名称、总结Prompt。4. 内置最近5次总结缓存，节约Token消耗。5. 总结前确认，交互友好，结果以精美的Markdown格式展示。
// @author       xima
// @match        https://www.zhihu.com/
// @match        https://www.zhihu.com/question/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      dashscope.aliyuncs.com
// @connect      api.deepseek.com
// @connect      api.openai.com
// @downloadURL https://update.greasyfork.org/scripts/539477/%E7%9F%A5%E4%B9%8E%20AI%20%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B%20%28%E5%A4%9A%E6%A8%A1%E5%9E%8B%E7%BC%93%E5%AD%98%E8%87%AA%E5%AE%9A%E4%B9%89%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539477/%E7%9F%A5%E4%B9%8E%20AI%20%E6%80%BB%E7%BB%93%E5%8A%A9%E6%89%8B%20%28%E5%A4%9A%E6%A8%A1%E5%9E%8B%E7%BC%93%E5%AD%98%E8%87%AA%E5%AE%9A%E4%B9%89%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- --- --- 1. 全局常量与配置 --- --- ---
    const PROVIDERS = {
        'qwen': { name: '通义千问 (阿里云)', apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', defaultModel: 'qwen-plus' },
        'deepseek': { name: 'DeepSeek', apiUrl: 'https://api.deepseek.com/chat/completions', defaultModel: 'deepseek-chat' },
        'openai': { name: 'OpenAI', apiUrl: 'https://api.openai.com/v1/chat/completions', defaultModel: 'gpt-3.5-turbo' }
    };
    const SELECTORS = { answerItem: '.ContentItem.AnswerItem', answerContent: '.RichContent-inner', actionBar: '.ContentItem-actions', collapsedClass: 'is-collapsed' };
    const DEFAULT_PROMPT_TEMPLATE = `你是一位专业的文本分析助手，你的任务是清晰、有条理地总结一篇知乎回答。

**阅读背景**:
- 我正在阅读的问题是：“\${question}”

**任务要求**:
请严格按照以下两个步骤，对提供的“回答原文”进行总结，并以Markdown格式返回：

**第一部分：核心观点总结**
请用2-3句话，凝练地概括这篇回答最核心的论点、主旨或结论。让我能立刻抓住作者最想表达的意图。

**第二部分：内容结构梳理**
请按照回答原文的叙述顺序，逐一、分点介绍每个段落或部分的主要内容。确保条理清晰，让我能了解文章的论证过程和结构。

---
回答原文如下：
\${answer}`;
    const CACHE_KEY = 'summaryCache';
    const CACHE_MAX_SIZE = 5;
    const SETTINGS_KEY = 'aiSummarySettings';

    // --- --- --- 2. 样式定义 --- --- ---
    GM_addStyle(`
        .summary-button { margin-left: 8px; background-color: #e8f3ff; color: #007bff; border: 1px solid #cce0ff; padding: 0 12px; font-size: 14px; height: 32px; line-height: 32px; border-radius: 5px; cursor: pointer; transition: all 0.3s ease; } .summary-button:hover { background-color: #d1e7ff; } .summary-button:disabled { cursor: not-allowed; opacity: 0.6; } .gm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9998; display: flex; justify-content: center; align-items: center; } .gm-modal-box { position: relative; background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 90%; max-width: 700px; z-index: 9999; } .gm-modal-box h2 { margin-top: 0; margin-bottom: 20px; font-size: 18px; text-align: center; color: #333; } .gm-modal-close-btn { position: absolute; top: 15px; right: 20px; font-size: 28px; color: #aaa; cursor: pointer; border: none; background: none; line-height: 1; } .gm-modal-footer { text-align: right; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; } .gm-modal-footer .gm-modal-button { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; } .gm-modal-footer .primary { background-color: #007bff; color: white; } .gm-modal-footer .secondary { background-color: #f0f0f0; } .summary-confirmation-dialog { padding: 10px; } .summary-confirmation-dialog .details-grid { display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; align-items: center; background-color: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; margin-bottom: 16px; } .summary-confirmation-dialog .detail-label { font-weight: 600; color: #586069; text-align: right; } .summary-confirmation-dialog .detail-value { font-size: 14px; color: #24292e; } .summary-confirmation-dialog .detail-value.count { font-weight: 700; color: #0366d6; } .summary-confirmation-dialog .confirmation-question { max-height: 60px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; } .summary-confirmation-dialog .cache-hit-message { text-align: center; font-size: 15px; color: #28a745; font-weight: 500; margin: 0; } #settings-modal .gm-modal-field { margin-bottom: 15px; } #settings-modal .gm-modal-field label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #555; } #settings-modal .gm-modal-field select, #settings-modal .gm-modal-field input, #settings-modal .gm-modal-field textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; } #settings-modal .gm-modal-field textarea { min-height: 120px; resize: vertical; font-family: inherit; } #settings-modal .gm-modal-field .prompt-desc { font-size: 12px; color: #888; margin-top: 5px; } #summary-modal .gm-modal-box { min-height: 200px; display: flex; flex-direction: column; } #summary-content { flex-grow: 1; font-size: 15px; line-height: 1.7; color: #333; max-height: 75vh; overflow-y: auto; padding-right: 15px; } #summary-content.loading, #summary-content.confirm { display: block; text-align: center; padding: 40px 10px; font-size: 16px; } #summary-content.error { color: #d93025; font-weight: bold; white-space: pre-wrap; padding: 10px; } #summary-content h1, #summary-content h2, #summary-content h3 { border-bottom: 1px solid #eaecef; padding-bottom: .3em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; } #summary-content h1 { font-size: 2em; } #summary-content h2 { font-size: 1.5em; } #summary-content h3 { font-size: 1.25em; } #summary-content ul, #summary-content ol { padding-left: 2em; margin-top: 0; margin-bottom: 16px; } #summary-content li { margin-bottom: 0.5em; } #summary-content p { margin-top: 0; margin-bottom: 16px; } #summary-content code { background-color: rgba(27,31,35,.05); padding: .2em .4em; margin: 0; font-size: 85%; border-radius: 3px; font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace; } #summary-content pre { word-wrap: normal; padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: #f6f8fa; border-radius: 3px; } #summary-content pre code { padding: 0; background: none; } #summary-content blockquote { border-left: 0.25em solid #dfe2e5; padding: 0 1em; color: #6a737d; margin-left: 0; margin-right: 0; } #summary-content hr { height: .25em; padding: 0; margin: 24px 0; background-color: #e1e4e8; border: 0; } #summary-content a { color: #0366d6; text-decoration: none; } #summary-content a:hover { text-decoration: underline; } .hidden { display: none !important; }
    `);

    // --- --- --- 3. 核心功能函数定义 --- --- ---

    function getSettings() { const defaultSettings = { selectedProvider: 'qwen', apiKeys: {}, modelNames: {}, customPrompt: '' }; const savedSettings = JSON.parse(GM_getValue(SETTINGS_KEY, '{}')); return { ...defaultSettings, ...savedSettings }; }
    function saveSettings(settings) { GM_setValue(SETTINGS_KEY, JSON.stringify(settings)); }
    function migrateOldSettings() { const oldApiKey = GM_getValue('apiKey'); if (oldApiKey) { const oldProvider = GM_getValue('selectedProvider', 'qwen'); const oldPrompt = GM_getValue('customPrompt', ''); const newSettings = { selectedProvider: oldProvider, apiKeys: { [oldProvider]: oldApiKey }, modelNames: {}, customPrompt: oldPrompt }; saveSettings(newSettings); GM_setValue('apiKey', ''); GM_setValue('selectedProvider', ''); GM_setValue('customPrompt', ''); console.log('[AI-Summarizer] Old settings migrated to new format.'); } }
    function getCache() { return JSON.parse(GM_getValue(CACHE_KEY, '[]')); }
    function setCache(cache) { GM_setValue(CACHE_KEY, JSON.stringify(cache)); }
    function findInCache(answerId) { return getCache().find(item => item.id === answerId) || null; }
    function addToCache(newItem) { let cache = getCache(); const index = cache.findIndex(item => item.id === newItem.id); if (index > -1) cache.splice(index, 1); cache.unshift(newItem); if (cache.length > CACHE_MAX_SIZE) cache.pop(); setCache(cache); }
    function createModals() { const settingsModalHtml = `<div id="settings-modal" class="gm-modal-overlay hidden"><div class="gm-modal-box"><button class="gm-modal-close-btn">&times;</button><h2>配置AI总结助手</h2><div class="gm-modal-field"><label for="provider-select">选择服务商:</label><select id="provider-select"></select></div><div class="gm-modal-field"><label for="api-key-input">API Key:</label><input type="password" id="api-key-input" placeholder="请粘贴所选服务商的API Key"></div><div class="gm-modal-field"><label for="model-name-input">模型名称 (Model Name):</label><input type="text" id="model-name-input" placeholder="例如: qwen-plus"></div><div class="gm-modal-field"><label for="custom-prompt-textarea">自定义提示词 (选填):</label><textarea id="custom-prompt-textarea"></textarea><p class="prompt-desc">提示：模板中必须包含 <strong>\${question}</strong> 和 <strong>\${answer}</strong> 这两个占位符。</p></div><div class="gm-modal-footer"><button id="modal-cancel-btn" class="gm-modal-button secondary">取消</button><button id="modal-save-btn" class="gm-modal-button primary">保存</button></div></div></div>`; const summaryModalHtml = `<div id="summary-modal" class="gm-modal-overlay hidden"><div class="gm-modal-box"><button class="gm-modal-close-btn">&times;</button><h2>AI 总结</h2><div id="summary-content"></div><div id="summary-footer" class="gm-modal-footer"></div></div></div>`; document.body.insertAdjacentHTML('beforeend', settingsModalHtml + summaryModalHtml); const providerSelect = document.getElementById('provider-select'); for (const providerId in PROVIDERS) { const option = document.createElement('option'); option.value = providerId; option.textContent = PROVIDERS[providerId].name; providerSelect.appendChild(option); } providerSelect.addEventListener('change', updateSettingsForm); const settingsModal = document.getElementById('settings-modal'); settingsModal.querySelector('#modal-save-btn').addEventListener('click', handleSaveSettings); settingsModal.querySelector('#modal-cancel-btn').addEventListener('click', () => settingsModal.classList.add('hidden')); settingsModal.querySelector('.gm-modal-close-btn').addEventListener('click', () => settingsModal.classList.add('hidden')); const summaryModal = document.getElementById('summary-modal'); summaryModal.querySelector('.gm-modal-close-btn').addEventListener('click', () => summaryModal.classList.add('hidden')); [settingsModal, summaryModal].forEach(modal => { modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); }); }); }
    function updateSettingsForm() { const settings = getSettings(); const selectedProviderId = document.getElementById('provider-select').value; const providerInfo = PROVIDERS[selectedProviderId]; document.getElementById('api-key-input').value = settings.apiKeys[selectedProviderId] || ''; document.getElementById('model-name-input').value = settings.modelNames[selectedProviderId] || providerInfo.defaultModel; }
    function showSettingsModal() { const settings = getSettings(); document.getElementById('provider-select').value = settings.selectedProvider; document.getElementById('custom-prompt-textarea').value = settings.customPrompt || DEFAULT_PROMPT_TEMPLATE; updateSettingsForm(); document.getElementById('settings-modal').classList.remove('hidden'); }
    function handleSaveSettings() { const settings = getSettings(); const selectedProviderId = document.getElementById('provider-select').value; settings.selectedProvider = selectedProviderId; settings.apiKeys[selectedProviderId] = document.getElementById('api-key-input').value.trim(); settings.modelNames[selectedProviderId] = document.getElementById('model-name-input').value.trim(); settings.customPrompt = document.getElementById('custom-prompt-textarea').value.trim(); if (!settings.apiKeys[selectedProviderId]) { alert('当前服务商的 API Key 不能为空！'); return; } saveSettings(settings); document.getElementById('settings-modal').classList.add('hidden'); alert('配置已保存！'); }

    // **最终修复版渲染函数**
    function renderSummary(markdownText) {
        const summaryContent = document.getElementById('summary-content');
        if (typeof marked === 'undefined') {
            summaryContent.className = 'error';
            summaryContent.innerText = "Markdown渲染库(marked.js)加载失败。";
            return;
        }
        try {
            // **核心修复1**: 在解析前，强制重置marked的配置，抵御页面环境污染
            marked.setOptions(marked.getDefaults());

            let processedText = markdownText.trim();

            // **核心修复2**: 用更可靠的方式移除包裹代码块
            const codeBlockRegex = /^```(?:markdown)?\s*\n([\s\S]+?)\s*\n```$/;
            const match = processedText.match(codeBlockRegex);
            if (match && match[1]) {
                processedText = match[1];
            }

            summaryContent.className = '';
            summaryContent.innerHTML = marked.parse(processedText);
        } catch(e) {
            summaryContent.className = 'error';
            summaryContent.innerText = '渲染Markdown时发生未知错误，详情请查看控制台。';
            console.error('[AI-Summarizer] Render Error:', e);
        }
    }

    function executeApiCall(answerId, questionText, payload, button) { const settings = getSettings(); const providerId = settings.selectedProvider; const provider = PROVIDERS[providerId]; const apiKey = settings.apiKeys[providerId]; GM_xmlhttpRequest({ method: 'POST', url: provider.apiUrl, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, data: JSON.stringify(payload), onload: function(response) { try { const result = JSON.parse(response.responseText); const summaryText = result.choices[0].message.content; renderSummary(summaryText); addToCache({ id: answerId, question: questionText, summary: summaryText, timestamp: Date.now() }); } catch (e) { document.getElementById('summary-content').className = 'error'; document.getElementById('summary-content').innerHTML = `<strong>解析API返回结果失败</strong><br><br>错误: ${e.message}<br><br><strong>原始返回:</strong><pre>${response.responseText}</pre>`; } finally { if(button) button.disabled = false; } }, onerror: function(error) { document.getElementById('summary-content').className = 'error'; document.getElementById('summary-content').innerHTML = `<strong>API请求失败</strong><br><br><strong>错误详情:</strong><pre>${JSON.stringify(error)}</pre>`; if(button) button.disabled = false; } }); }
    function triggerApiSummary(answerId, questionText, answerText, mainButton) { const summaryContent = document.getElementById('summary-content'); const summaryFooter = document.getElementById('summary-footer'); const settings = getSettings(); const providerId = settings.selectedProvider; const provider = PROVIDERS[providerId]; summaryContent.className = 'loading'; summaryContent.innerHTML = `正在通过 [<strong>${provider.name}</strong>] 结合问题上下文进行总结...`; summaryFooter.innerHTML = ''; mainButton.disabled = true; const modelName = settings.modelNames[providerId] || provider.defaultModel; const promptTemplate = settings.customPrompt || DEFAULT_PROMPT_TEMPLATE; const finalPrompt = promptTemplate.replace(/\$\{question\}/g, questionText || '无问题标题').replace(/\$\{answer\}/g, answerText); const requestPayload = { model: modelName, messages: [{ role: "user", content: finalPrompt }] }; executeApiCall(answerId, questionText, requestPayload, mainButton); }
    function handleSummarizeClick(event) { const mainButton = event.target; const answerItem = mainButton.closest(SELECTORS.answerItem); if (!answerItem) return; const contentElement = answerItem.querySelector(SELECTORS.answerContent); if (!contentElement) return; let questionText = '', answerId = ''; try { const zopDataString = answerItem.getAttribute('data-zop'); if (zopDataString) { const zopData = JSON.parse(zopDataString); questionText = zopData.title; answerId = zopData.itemId; } } catch (e) { console.error('AI Summarizer: Failed to parse data-zop.', e); } if (!answerId) { alert("无法获取回答的唯一ID，无法使用总结功能。"); return; } const settings = getSettings(); const providerId = settings.selectedProvider; const apiKey = settings.apiKeys[providerId]; if (!providerId || !apiKey) { alert('请先配置当前服务商的API Key！'); showSettingsModal(); return; } const summaryModal = document.getElementById('summary-modal'); const summaryContent = document.getElementById('summary-content'); const summaryFooter = document.getElementById('summary-footer'); const charCount = contentElement.innerText.length; const answerText = contentElement.innerText; const cachedItem = findInCache(answerId); const confirmationHtml = `<div class="summary-confirmation-dialog"><div class="details-grid"><span class="detail-label">回答字数:</span><span class="detail-value count">${charCount} 字</span><span class="detail-label">相关问题:</span><span class="detail-value confirmation-question" title="${questionText || ''}">${questionText || '无法获取问题标题'}</span></div>${cachedItem ? '<p class="cache-hit-message">✔ 已找到上次的总结记录。</p>' : ''}</div>`; summaryContent.innerHTML = confirmationHtml; if (cachedItem) { summaryFooter.innerHTML = `<button id="summary-cancel-btn" class="gm-modal-button secondary">取消</button><button id="regenerate-btn" class="gm-modal-button secondary">重新生成</button><button id="show-cache-btn" class="gm-modal-button primary">查看上次总结</button>`; const showCacheBtn = document.getElementById('show-cache-btn'); const regenerateBtn = document.getElementById('regenerate-btn'); const cancelBtn = document.getElementById('summary-cancel-btn'); showCacheBtn.onclick = () => { renderSummary(cachedItem.summary); summaryFooter.innerHTML = ''; }; regenerateBtn.onclick = () => triggerApiSummary(answerId, questionText, answerText, mainButton); cancelBtn.onclick = () => summaryModal.classList.add('hidden'); } else { summaryFooter.innerHTML = `<button id="summary-cancel-btn" class="gm-modal-button secondary">取消</button><button id="summary-confirm-btn" class="gm-modal-button primary">确认总结</button>`; const confirmBtn = document.getElementById('summary-confirm-btn'); const cancelBtn = document.getElementById('summary-cancel-btn'); confirmBtn.onclick = () => triggerApiSummary(answerId, questionText, answerText, mainButton); cancelBtn.onclick = () => summaryModal.classList.add('hidden'); } summaryModal.classList.remove('hidden'); }

    // --- --- --- 4. 页面专属逻辑 --- --- ---
    function initSingleAnswerPage() { const addBtn = (answerItem) => { if (!answerItem) return; const actionBar = answerItem.querySelector(SELECTORS.actionBar); if (!actionBar || actionBar.querySelector('.summary-button')) return; const button = document.createElement('button'); button.textContent = '✨ AI 总结'; button.className = 'summary-button'; button.addEventListener('click', handleSummarizeClick); actionBar.appendChild(button); }; const interval = setInterval(() => { const answerItem = document.querySelector(SELECTORS.answerItem); if (answerItem) { clearInterval(interval); addBtn(answerItem); } }, 500); setTimeout(() => clearInterval(interval), 10000); }
    function initDynamicPageHandler() { let debounceTimer; const scanAndProcess = () => { document.querySelectorAll(SELECTORS.answerItem).forEach(updateDynamicItemButton); }; const debouncedScan = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(scanAndProcess, 250); }; const observer = new MutationObserver(debouncedScan); observer.observe(document.body, { childList: true, subtree: true }); window.addEventListener('load', debouncedScan); debouncedScan(); }
    function updateDynamicItemButton(answerItem) { const richContent = answerItem.querySelector('.RichContent'); const actionBar = answerItem.querySelector(SELECTORS.actionBar); if (!richContent || !actionBar) return; const isCollapsed = richContent.classList.contains(SELECTORS.collapsedClass); const hasButton = actionBar.querySelector('.summary-button'); if (!isCollapsed && !hasButton) { const button = document.createElement('button'); button.textContent = '✨ AI 总结'; button.className = 'summary-button'; button.addEventListener('click', handleSummarizeClick); actionBar.appendChild(button); } else if (isCollapsed && hasButton) { hasButton.remove(); } }

    // --- --- --- 5. 脚本初始化执行 --- --- ---
    createModals();
    migrateOldSettings();
    GM_registerMenuCommand('⚙️ 配置AI总结 (V10.3)', showSettingsModal);

    const path = window.location.pathname;
    if (path.includes('/answer/')) {
        initSingleAnswerPage();
    } else if (path === '/' || path.startsWith('/question/')) {
        initDynamicPageHandler();
    }
})();