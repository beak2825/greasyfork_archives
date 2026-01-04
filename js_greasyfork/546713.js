// ==UserScript==
// @name         半沉浸式网页翻译助手 (Semi-Immersive Helper)
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  只翻译你的生词表【Version Comment】增加详细的控制台日志，便于追踪脚本执行状态；并修复潜在的兼容性问题，运行更稳定。
// @author       Gemini & You
// @license      CC BY-NC-SA 4.0
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.chatanywhere.tech
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/546713/%E5%8D%8A%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%20%28Semi-Immersive%20Helper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546713/%E5%8D%8A%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%20%28Semi-Immersive%20Helper%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 默认配置 (无变化) ---
    const DEFAULTS = {
        words: 'word\nexample\ncontext\nlanguage\nlearning',
        apiProvider: 'openai',
        openai: {
            apiKey: '',
            baseUrl: 'https://api.chatanywhere.tech/v1',
            model: 'gpt-3.5-turbo',
        },
        custom: {
            apiKey: '',
            endpointUrl: '',
            bodyTemplate: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": "__PROMPT__" }],
                "response_format": { "type": "json_object" }
            }, null, 2),
        },
    };

    // --- 全局状态 ---
    let config = {};
    let wordRegex = null;
    let totalMatchesFound = 0;
    const sessionCache = new Map();
    const processedNodes = new WeakSet();

    // --- 工具函数 (无变化) ---
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // --- 配置管理 (无变化) ---
    async function getConfig() {
        const storedConfig = {};
        storedConfig.words = await GM_getValue('words', DEFAULTS.words);
        storedConfig.apiProvider = await GM_getValue('apiProvider', DEFAULTS.apiProvider);
        storedConfig.openai = await GM_getValue('openai', DEFAULTS.openai);
        storedConfig.custom = await GM_getValue('custom', DEFAULTS.custom);
        return storedConfig;
    }
    async function saveConfig(newConfig) {
        await GM_setValue('words', newConfig.words);
        await GM_setValue('apiProvider', newConfig.apiProvider);
        await GM_setValue('openai', newConfig.openai);
        await GM_setValue('custom', newConfig.custom);
        alert('设置已保存！页面将刷新以应用更改。');
        window.location.reload();
    }

    // --- UI ---
    function createSettingsPanel() {
        GM_addStyle(`
        #sih-settings-panel {
            position: fixed; top: 50px; right: -400px; width: 380px; height: calc(100vh - 100px);
            background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex; flex-direction: column; transition: right 0.3s ease-in-out;
        }
        #sih-settings-panel.sih-show { right: 20px; }
        .sih-header { padding: 15px 20px; background-color: #fff; border-bottom: 1px solid #ddd; border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .sih-header h2 { margin: 0; font-size: 18px; color: #333; }
        .sih-close-btn { cursor: pointer; font-size: 24px; color: #888; border: none; background: none; }
        .sih-close-btn:hover { color: #333; }
        .sih-tabs { display: flex; background-color: #fff; border-bottom: 1px solid #ddd; }
        .sih-tab-button { flex: 1; padding: 12px; cursor: pointer; border: none; background-color: transparent; font-size: 16px; color: #666; border-bottom: 3px solid transparent; }
        .sih-tab-button.sih-active { color: #007bff; border-bottom-color: #007bff; }
        .sih-content { padding: 20px; overflow-y: auto; flex-grow: 1; background-color: #fff; }
        .sih-tab-content { display: none; }
        .sih-tab-content.sih-active { display: block; }
        .sih-form-group { margin-bottom: 20px; }
        .sih-form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #555; }
        .sih-form-group input[type="text"], .sih-form-group input[type="password"], .sih-form-group textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
        .sih-form-group textarea { min-height: 150px; resize: vertical; }
        .sih-radio-group label { margin-right: 15px; font-weight: normal; }
        .sih-footer { padding: 15px 20px; border-top: 1px solid #ddd; background-color: #f9f9f9; text-align: right; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
        .sih-save-btn { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        .sih-save-btn:hover { background-color: #0056b3; }
        .sih-highlight { background-color: #FFF3A3 !important; font-weight: bold !important; }
        .sih-explanation { color: #007bff; font-weight: normal; margin-left: 5px; cursor: help; }
    `);
        const panel = document.createElement('div');
        panel.id = 'sih-settings-panel';
        panel.innerHTML = `
        <div class="sih-header"><h2>半沉浸式翻译设置</h2><button class="sih-close-btn">&times;</button></div>
        <div class="sih-tabs"><button class="sih-tab-button sih-active" data-tab="general">通用设置</button><button class="sih-tab-button" data-tab="api">API 配置</button></div>
        <div class="sih-content">
            <div id="sih-tab-general" class="sih-tab-content sih-active"><div class="sih-form-group"><label for="sih-words-list">单词列表 (每行一个)</label><textarea id="sih-words-list"></textarea></div></div>
            <div id="sih-tab-api" class="sih-tab-content">
                <div class="sih-form-group sih-radio-group"><label><input type="radio" name="apiProvider" value="openai" checked> OpenAI 兼容 (代理/中转)</label><label><input type="radio" name="apiProvider" value="custom"> 自定义 API</label></div>
                <div id="sih-openai-config"><div class="sih-form-group"><label for="sih-openai-key">API Key</label><input type="password" id="sih-openai-key"></div><div class="sih-form-group"><label for="sih-openai-baseurl">API Base URL</label><input type="text" id="sih-openai-baseurl"></div><div class="sih-form-group"><label for="sih-openai-model">模型名称 (Model)</label><input type="text" id="sih-openai-model"></div></div>
                <div id="sih-custom-config" style="display: none;"><div class="sih-form-group"><label for="sih-custom-key">API Key</label><input type="password" id="sih-custom-key"></div><div class="sih-form-group"><label for="sih-custom-endpoint">API Endpoint URL</label><input type="text" id="sih-custom-endpoint"></div><div class="sih-form-group"><label for="sih-custom-body">请求体模板 (JSON) - 使用 __PROMPT__ 作为占位符</label><textarea id="sih-custom-body"></textarea></div></div>
            </div>
        </div>
        <div class="sih-footer"><button id="sih-save-btn" class="sih-save-btn">保存并刷新</button></div>
    `;
        document.body.appendChild(panel);
        panel.querySelector('.sih-close-btn').addEventListener('click', () => panel.classList.remove('sih-show'));
        panel.querySelectorAll('.sih-tab-button').forEach(button => { button.addEventListener('click', () => { panel.querySelectorAll('.sih-tab-button').forEach(btn => btn.classList.remove('sih-active')); button.classList.add('sih-active'); panel.querySelectorAll('.sih-tab-content').forEach(content => content.classList.remove('sih-active')); panel.querySelector(`#sih-tab-${button.dataset.tab}`).classList.add('sih-active'); }); });
        panel.querySelectorAll('input[name="apiProvider"]').forEach(radio => { radio.addEventListener('change', (e) => { if (e.target.value === 'openai') { panel.querySelector('#sih-openai-config').style.display = 'block'; panel.querySelector('#sih-custom-config').style.display = 'none'; } else { panel.querySelector('#sih-openai-config').style.display = 'none'; panel.querySelector('#sih-custom-config').style.display = 'block'; } }); });
        panel.querySelector('#sih-save-btn').addEventListener('click', async () => { const newConfig = { words: document.getElementById('sih-words-list').value, apiProvider: document.querySelector('input[name="apiProvider"]:checked').value, openai: { apiKey: document.getElementById('sih-openai-key').value, baseUrl: document.getElementById('sih-openai-baseurl').value, model: document.getElementById('sih-openai-model').value, }, custom: { apiKey: document.getElementById('sih-custom-key').value, endpointUrl: document.getElementById('sih-custom-endpoint').value, bodyTemplate: document.getElementById('sih-custom-body').value, } }; await saveConfig(newConfig); });
        loadConfigIntoPanel();
    }
    async function loadConfigIntoPanel() { const config = await getConfig(); document.getElementById('sih-words-list').value = config.words; const providerRadio = document.querySelector(`input[name="apiProvider"][value="${config.apiProvider}"]`); if (providerRadio) { providerRadio.checked = true; providerRadio.dispatchEvent(new Event('change')); } document.getElementById('sih-openai-key').value = config.openai.apiKey; document.getElementById('sih-openai-baseurl').value = config.openai.baseUrl; document.getElementById('sih-openai-model').value = config.openai.model; document.getElementById('sih-custom-key').value = config.custom.apiKey; document.getElementById('sih-custom-endpoint').value = config.custom.endpointUrl; document.getElementById('sih-custom-body').value = config.custom.bodyTemplate; }
    function toggleSettingsPanel() { const panel = document.getElementById('sih-settings-panel'); if (panel) { panel.classList.toggle('sih-show'); } }

    // --- 核心逻辑 ---
    function detectLanguage() {
        const lang = document.documentElement.lang || document.body.lang || '';
        if (lang.toLowerCase().startsWith('ja')) return 'ja';
        if (lang.toLowerCase().startsWith('zh')) return 'zh';
        if (lang.toLowerCase().startsWith('en')) return 'en';
        const textSample = (document.body.textContent || '').substring(0, 500);
        if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(textSample)) return 'ja';
        if (/[\u4e00-\u9fa5]/.test(textSample)) return 'zh';
        return 'en';
    }

    async function processNode(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE || processedNodes.has(node) ||
            node.closest('script, style, textarea, a, button, [contenteditable], .sih-highlight')) {
            return;
        }
        processedNodes.add(node);

        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
            acceptNode: (textNode) => {
                if (!textNode.nodeValue || textNode.nodeValue.trim().length < 1 ||
                    textNode.parentElement.closest('script, style, textarea, a, button, [contenteditable], .sih-highlight')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const nodesToModify = [];
        let currentNode;
        while (currentNode = walker.nextNode()) {
            wordRegex.lastIndex = 0; // 重置正则索引
            if (wordRegex.test(currentNode.nodeValue)) {
                nodesToModify.push(currentNode);
            }
        }

        if (nodesToModify.length === 0) return;

        console.log(`SIH: Found ${nodesToModify.length} text node(s) with potential matches in`, node);

        for (const textNode of nodesToModify) {
            const textContent = textNode.nodeValue;

            // -- 使用更兼容的 exec 循环代替 matchAll --
            const matches = [];
            let match;
            wordRegex.lastIndex = 0; // 每次执行前都重置
            while ((match = wordRegex.exec(textContent)) !== null) {
                matches.push(match);
            }

            if (matches.length === 0) continue;
            totalMatchesFound += matches.length;

            const wordsToDefine = [...new Set(matches.map(m => m[1].toLowerCase()))];
            const definitions = await fetchExplanationsForBatch(wordsToDefine, textContent);

            const parent = textNode.parentNode;
            if (!parent || processedNodes.has(parent)) continue;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            matches.forEach(m => {
                const [fullMatch, foundWord] = m;
                const offset = m.index;
                if (offset > lastIndex) {
                    fragment.appendChild(document.createTextNode(textContent.substring(lastIndex, offset)));
                }
                const highlightSpan = document.createElement('span');
                highlightSpan.className = 'sih-highlight';
                highlightSpan.textContent = foundWord;
                fragment.appendChild(highlightSpan);
                const explanationSpan = document.createElement('span');
                explanationSpan.className = 'sih-explanation';
                explanationSpan.textContent = ` ${definitions[foundWord.toLowerCase()] || '(解析失败)'}`;
                fragment.appendChild(explanationSpan);
                lastIndex = offset + foundWord.length;
            });

            if (lastIndex < textContent.length) {
                fragment.appendChild(document.createTextNode(textContent.substring(lastIndex)));
            }
            parent.replaceChild(fragment, textNode);
        }
    }

    async function fetchExplanationsForBatch(words, context) {
        if (words.length === 0) return {};
        const cacheKey = `${context}|${words.sort().join(',')}`;
        if (sessionCache.has(cacheKey)) return sessionCache.get(cacheKey);

        const prompt = `You are a dictionary API. Analyze the context. For each word in the list, give its precise Chinese definition based on the context. Respond with a single, valid JSON object where keys are lowercase words and values are strings in "(part-of-speech. definition)" format. Example: {"word": "(n. 单词)"} Context: "${context}" Words: ${JSON.stringify(words)}`;
        try {
            const apiProvider = config.apiProvider;
            const apiConfig = config[apiProvider];
            const responseJson = apiProvider === 'openai' ? await callOpenAI(prompt, apiConfig) : await callCustomAPI(prompt, apiConfig);
            sessionCache.set(cacheKey, responseJson);
            return responseJson;
        } catch (error) {
            console.error('SIH API Batch Error:', error);
            return words.reduce((acc, word) => ({ ...acc, [word.toLowerCase()]: '(请求错误)' }), {});
        }
    }

    // --- API 调用 (无重大变化，折叠) ---
    function callOpenAI(prompt, openaiConfig) { return new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: 'POST', url: `${openaiConfig.baseUrl}/chat/completions`, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiConfig.apiKey}` }, data: JSON.stringify({ model: openaiConfig.model, messages: [{ role: 'user', content: prompt }], temperature: 0.1, response_format: { "type": "json_object" } }), timeout: 20000, onload: function (response) { try { if (response.status >= 200 && response.status < 300) { const data = JSON.parse(response.responseText); const content = data.choices[0].message.content; resolve(JSON.parse(content)); } else { reject(new Error(`HTTP error! status: ${response.status}, response: ${response.responseText}`)); } } catch (e) { reject(new Error(`Failed to parse JSON response: ${e.message}`)); } }, onerror: (e) => reject(new Error('Network error during API call.')), ontimeout: () => reject(new Error('Request timed out.')) }); }); }
    function findAndReplacePlaceholder(obj, placeholder, value) { for (const key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { if (typeof obj[key] === 'string') { obj[key] = obj[key].replace(new RegExp(placeholder, 'g'), value); } else if (typeof obj[key] === 'object' && obj[key] !== null) { findAndReplacePlaceholder(obj[key], placeholder, value); } } } }
    function callCustomAPI(prompt, customConfig) { return new Promise((resolve, reject) => { let bodyObject; try { bodyObject = JSON.parse(customConfig.bodyTemplate); } catch (e) { return reject(new Error("自定义API请求体模板不是有效的JSON格式。")); } findAndReplacePlaceholder(bodyObject, '__PROMPT__', prompt); const body = JSON.stringify(bodyObject); GM_xmlhttpRequest({ method: 'POST', url: customConfig.endpointUrl, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customConfig.apiKey}` }, data: body, timeout: 20000, onload: function (response) { try { if (response.status >= 200 && response.status < 300) { const data = JSON.parse(response.responseText); const result = data.answer || data.result || (data.choices && data.choices[0].message.content) || data.content || data.text; if (result) { resolve(JSON.parse(result)); } else { reject(new Error('Could not find a standard result key in custom API response.')); } } else { reject(new Error(`HTTP error! status: ${response.status}, response: ${response.responseText}`)); } } catch (e) { reject(new Error(`Failed to parse JSON response: ${e.message}`)); } }, onerror: () => reject(new Error('Network error during API call.')), ontimeout: () => reject(new Error('Request timed out.')) }); }); }

    function processVisibleAndObserve() {
        console.log("SIH: Starting observers and initial viewport scan...");
        const contentSelectors = 'p, li, th, td, h1, h2, h3, h4, h5, h6, article, .post, .content, .main, body';

        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    processNode(entry.target);
                    intersectionObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px 0px' });

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(newNode => {
                    if (newNode.nodeType === Node.ELEMENT_NODE) {
                        if (newNode.matches(contentSelectors)) {
                            intersectionObserver.observe(newNode);
                        }
                        newNode.querySelectorAll(contentSelectors).forEach(child => intersectionObserver.observe(child));
                    }
                });
            });
        });

        document.querySelectorAll(contentSelectors).forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                processNode(el);
            }
            intersectionObserver.observe(el);
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        // 在首次扫描后（给予一个短暂的延迟），检查是否找到了任何匹配
        setTimeout(() => {
            if (totalMatchesFound === 0) {
                console.log("SIH: Initial scan complete. No words from your list were found on this page. The script will remain idle until the page content changes.");
            } else {
                console.log(`SIH: Initial scan complete. Found a total of ${totalMatchesFound} matches.`);
            }
        }, 3000);
    }

    async function init() {
        createSettingsPanel();
        GM_registerMenuCommand('设置单词和API', toggleSettingsPanel);
        config = await getConfig();
        const words = config.words.split('\n').filter(w => w.trim() !== '');
        if (words.length === 0) {
            console.log('SIH: Your word list is empty. Exiting.');
            return;
        }
        const lang = detectLanguage();
        console.log(`SIH: Detected language: ${lang}`);
        if (lang === 'ja' || lang === 'zh') {
            const cjkChars = '\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Han}';
            const patterns = words.map(word => `(?<![${cjkChars}])(${escapeRegex(word)})(?![${cjkChars}])`);
            wordRegex = new RegExp(patterns.join('|'), 'gu');
        } else {
            const pattern = `\\b(${words.map(escapeRegex).join('|')})\\b`;
            wordRegex = new RegExp(pattern, 'gi');
        }
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            processVisibleAndObserve();
        } else {
            document.addEventListener('DOMContentLoaded', processVisibleAndObserve);
        }
    }

    init();
})();