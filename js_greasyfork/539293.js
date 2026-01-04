// ==UserScript==
// @name         超星学习通+自定义AI答题脚本 (SiliconFlow完美融合版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  V1.2: 新增“答案模式”选择器，包括专为简答/论述题优化的“拓展论述”模式，解决答案过短问题！集成更强大的UEditor粘贴解锁方案，解决部分作业无法粘贴的问题。感谢用户反馈！
// @author       Weinan (Modified by Gemini)
// @license      GPL-3.0-or-later
// @match        *://*.chaoxing.com/exam-ans/mooc2/exam/preview*
// @match        *://*.chaoxing.com/mooc2/work/dowork*
// @match        *://*.chaoxing.com/mycourse/studentstudy*
// @match        *://*.chaoxing.com/mooc-ans/mooc2/work/dowork*
// @icon         https://i.miji.bid/2025/06/13/cdf1843af3a8dab9804bd8a53e11f092.png
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.siliconflow.cn
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539293/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%2B%E8%87%AA%E5%AE%9A%E4%B9%89AI%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%20%28SiliconFlow%E5%AE%8C%E7%BE%8E%E8%9E%8D%E5%90%88%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539293/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%2B%E8%87%AA%E5%AE%9A%E4%B9%89AI%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%20%28SiliconFlow%E5%AE%8C%E7%BE%8E%E8%9E%8D%E5%90%88%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS样式 (适配新控件) ---
    GM_addStyle(`
        #ai-helper-window {
            position: fixed; top: 20px; left: 20px; width: 520px; height: 550px; /* 增加高度 */
            background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            z-index: 99999; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            resize: both; min-width: 320px; min-height: 350px; display: flex; flex-direction: column;
        }
        #ai-helper-window .header {
            background-color: #2d3748; color: white; padding: 8px 12px; font-size: 14px; font-weight: 600;
            cursor: move; display: flex; justify-content: space-between; align-items: center;
        }
        #ai-helper-window .header #ai-helper-hide-btn { background: transparent; color: white; font-size: 24px; font-weight: bold; border: none; padding: 0 8px; cursor: pointer; line-height: 1; }
        #ai-helper-window .header #ai-helper-hide-btn:hover { color: #cbd5e1; }
        #ai-helper-window .content-wrapper { padding: 12px; display: flex; flex-direction: column; overflow: hidden; flex-grow: 1; }
        #ai-helper-window .question-section, #ai-helper-window .answer-section {
            border: 1px solid #e2e8f0; padding: 12px; border-radius: 4px; margin-bottom: 8px;
            overflow-y: auto; word-break: break-word;
        }
        #ai-helper-window .answer-section { flex: 1; }
        #ai-helper-window .controls-area { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
        #ai-helper-window .button-row, .api-key-row, .model-select-row, .settings-row { display: flex; gap: 8px; align-items: center; }
        #ai-helper-window button {
            padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; border: none;
            background: #e2e8f0; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center;
        }
        #ai-helper-window button:hover:not(:disabled) { background: #cbd5e1; }
        #ai-helper-window button:disabled { cursor: not-allowed; background-color: #f1f5f9; color: #94a3b8; }
        #ai-helper-window button#ai-helper-refresh-btn { background: #3b82f6; color: white; flex-grow: 1; }
        #ai-helper-window button#ai-helper-refresh-btn:hover:not(:disabled) { background: #2563eb; }
        #ai-helper-window button#ai-helper-get-all-btn { background: #8b5cf6; color: white; flex-grow: 1; }
        #ai-helper-window button#ai-helper-get-all-btn:hover:not(:disabled) { background: #7c3aed; }
        #ai-helper-window button#ai-helper-copy-btn { background: #10b981; color: white; }
        #ai-helper-window button#ai-helper-copy-btn:hover { background: #059669; }
        #ai-helper-window .api-key-row input, #ai-helper-model-select, #ai-helper-answer-mode-select { flex: 1; padding: 6px 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e2e8f0; }
        #ai-helper-window .api-key-row button { white-space: nowrap; }
        #ai-helper-window button svg { margin-right: 4px; }
        #ai-helper-window .features-section { display: flex; align-items: center; gap: 15px; padding: 8px 4px; font-size: 12px; }
        .features-section .feature-toggle { display: flex; align-items: center; gap: 4px; }
        .features-section .feature-toggle input { margin-right: 4px; }
        #ai-helper-window .status-info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 4px 0px; border-top: 1px solid #e2e8f0; margin-top: 5px; font-size: 12px; color: #64748b; }
        #ai-helper-floating-button { position: fixed; top: 20px; left: -48px; width: 55px; height: 50px; background-color: #2d3748; color: white; border-radius: 0 25px 25px 0; text-align: right; padding-right: 12px; line-height: 50px; cursor: pointer; transition: all 0.3s ease; z-index: 99998; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        #ai-helper-floating-button:hover { left: 0; }
		.label { color: #64748b; font-size: 12px; margin-bottom: 4px; }
    `);

    // --- HTML结构 (更新为“答案模式”选择器) ---
    const windowHTML = `
        <div id="ai-helper-window">
            <div class="header">
                <span>AI答题 (Alt+Z 快速隐藏)</span>
                <button id="ai-helper-hide-btn" title="关闭">×</button>
            </div>
            <div class="content-wrapper">
                <div class="question-section">
                    <div class="label">当前题目 (双击可编辑)：</div>
                    <div id="ai-helper-question">正在获取题目...</div>
                </div>
                <div class="answer-section">
                    <div class="label">AI答案：</div>
                    <div id="ai-helper-answer"></div>
                </div>
                <div class="controls-area">
                    <div class="button-row">
                        <button id="ai-helper-prev-btn" title="上一题"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6" /></svg></button>
                        <button id="ai-helper-next-btn" title="下一题"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6" /></svg></button>
                        <button id="ai-helper-refresh-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-9-9 9 9 0 019 9z" /><path d="M9 12l2 2 4-4" /></svg>获取答案</button>
                        <button id="ai-helper-get-all-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>一键获取全部</button>
                        <button id="ai-helper-copy-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>复制答案</button>
                    </div>
                    <div class="settings-row">
                        <select id="ai-helper-model-select" title="选择AI模型"></select>
                        <select id="ai-helper-answer-mode-select" title="选择答案生成模式">
                            <option value="simple">简洁答案 (选择/填空)</option>
                            <option value="detailed">详细解析 (选择题带过程)</option>
                            <option value="essay">拓展论述 (简答/论述)</option>
                        </select>
                    </div>
                    <div class="api-key-row">
                        <input type="password" id="ai-helper-api-key-input" placeholder="请输入SiliconFlow API Key">
                        <button id="ai-helper-save-api-key-btn">保存API Key</button>
                    </div>
                    <div class="features-section">
                        <span>其他功能:</span>
                        <label class="feature-toggle"><input type="checkbox" id="ai-helper-paste-toggle">允许粘贴</label>
                        <label class="feature-toggle"><input type="checkbox" id="ai-helper-copy-toggle">光标处复制</label>
                        <label class="feature-toggle"><input type="checkbox" id="ai-helper-watermark-toggle">移除水印</label>
                    </div>
                    <div class="status-info-row">
                        <div class="status" id="ai-helper-status-text">请先配置API Key</div>
                        <div class="info">by: Weinan & Gemini</div>
                    </div>
                </div>
            </div>
        </div>
        <div id="ai-helper-floating-button" style="display: none;">显示</div>
    `;
    document.body.insertAdjacentHTML('beforeend', windowHTML);

    // --- 脚本逻辑 ---
    const getElem = (id) => document.getElementById(id);

    // --- 常量与状态变量 ---
    const SILICONFLOW_API_ENDPOINT = "https://api.siliconflow.cn/v1/chat/completions";
    const MODELS = [
        { id: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B", name: "DeepSeek R1 (推荐)" },
        { id: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B", name: "DeepSeek R1 Distill 7B" },
        { id: "alibaba/Qwen2-7B-Instruct", name: "Qwen2 7B" },
        { id: "01-ai/Yi-1.5-9B-Chat", name: "Yi 1.5 9B" },
        { id: "meta-llama/Meta-Llama-3.1-8B-Instruct", name: "Llama 3.1 8B" },
        { id: "google/gemma-2-9b-it", name: "Gemma 2 9B" },
        { id: "Qwen/Qwen3-8B", name: "Qwen3 8B (New)" },
        { id: "THUDM/glm-4-9b-chat", name: "GLM-4 9B Chat" },
        { id: "THUDM/GLM-Z1-9B-0414", name: "GLM-Z1 9B" },
    ];
    let answerCache = {};
    let currentIndex = 0;
    let timu = ["正在获取题目..."];
    let questionsFetched = false;
    let isFetchingAll = false;

    // --- UI元素引用 ---
    const myWindow = getElem('ai-helper-window');
    const floatingButton = getElem('ai-helper-floating-button');
    const questionEl = getElem('ai-helper-question');
    const answerEl = getElem('ai-helper-answer');
    const apiKeyInput = getElem('ai-helper-api-key-input');
    const statusText = getElem('ai-helper-status-text');
    const modelSelect = getElem('ai-helper-model-select');
    const answerModeSelect = getElem('ai-helper-answer-mode-select');
    const refreshBtn = getElem('ai-helper-refresh-btn');
    const getAllBtn = getElem('ai-helper-get-all-btn');

    // --- 窗口拖动与显隐 ---
    let isDragging = false, initialX, initialY, xOffset = 0, yOffset = 0;
    myWindow.querySelector('.header').addEventListener('mousedown', (e) => {
        if (e.target.tagName !== 'BUTTON') { isDragging = true; initialX = e.clientX - xOffset; initialY = e.clientY - yOffset; }
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) { e.preventDefault(); xOffset = e.clientX - initialX; yOffset = e.clientY - initialY; myWindow.style.transform = `translate(${xOffset}px, ${yOffset}px)`; }
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
    const toggleWindow = () => {
        const isHidden = myWindow.style.display === 'none';
        myWindow.style.display = isHidden ? 'flex' : 'none';
        floatingButton.style.display = isHidden ? 'none' : 'block';
    };
    getElem('ai-helper-hide-btn').addEventListener('click', toggleWindow);
    floatingButton.addEventListener('click', toggleWindow);
    document.addEventListener('keydown', e => { if (e.altKey && e.key.toLowerCase() === 'z') toggleWindow(); });

    // --- 核心API请求函数 (重构以支持不同答案模式) ---
    async function callSiliconFlowAPI(question, modelId) {
        return new Promise((resolve, reject) => {
            const apiKey = GM_getValue('siliconflow_api_key');
            if (!apiKey) {
                return reject(new Error('错误：请先输入并保存API Key。'));
            }

            const answerMode = answerModeSelect.value;
            let systemPrompt = "";
            let maxTokens = 1024;

            switch(answerMode) {
                case 'essay':
                    systemPrompt = "你是一位专业的学术助手。针对用户提出的简答题或论述题，请提供一个全面、结构清晰、内容详实的回答。请确保回答逻辑连贯，覆盖问题的所有关键点，并以清晰的段落形式呈现。请根据问题的要求进行充分的展开论述，而不仅仅是简单的概括。";
                    maxTokens = 2048;
                    break;
                case 'detailed':
                    systemPrompt = "你是一个详尽的答题助手。请根据用户的问题，提供详细的、带有解析过程的答案。如果是选择题，请先给出正确选项，然后换行详细解释为什么选这个选项，以及为什么其他选项是错误的。";
                    maxTokens = 1024;
                    break;
                case 'simple':
                default:
                    systemPrompt = "你是一个答题助手，请根据用户提供的问题，直接、简洁地给出最可能的答案。如果是选择题，请直接给出选项字母（例如：A）。如果是填空题，请给出填空的内容。如果是判断题，请给出“对”或“错”。不要解释，不要有多余的文字。";
                    maxTokens = 256;
                    break;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: SILICONFLOW_API_ENDPOINT,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                data: JSON.stringify({
                    "model": modelId,
                    "messages": [{ "role": "system", "content": systemPrompt }, { "role": "user", "content": question }],
                    "max_tokens": maxTokens,
                }),
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const result = JSON.parse(response.responseText);
                            const answer = result.choices[0]?.message?.content?.trim();
                            if (answer) {
                                resolve(answer);
                            } else {
                                reject(new Error("API返回内容为空。"));
                            }
                        } catch (e) {
                            reject(new Error(`解析API响应失败: ${e.message}`));
                        }
                    } else {
                        try {
                             const errorData = JSON.parse(response.responseText);
                             reject(new Error(`(状态码: ${response.status}): ${errorData.error?.message || response.statusText}`));
                        } catch (e) {
                             reject(new Error(`(状态码: ${response.status}): ${response.statusText}`));
                        }
                    }
                },
                onerror: (err) => reject(new Error('网络错误，无法连接到API服务器。')),
                ontimeout: () => reject(new Error('请求超时。'))
            });
        });
    }

    // --- 功能实现 ---

    async function fetchAnswerForCurrent() {
        if (!questionsFetched) { answerEl.textContent = "请等待题目加载完成。"; return; }
        const currentQuestion = timu[currentIndex];
        answerEl.textContent = "AI思考中，请稍候...";
        statusText.textContent = `正在请求 ${modelSelect.options[modelSelect.selectedIndex].text}...`;
        refreshBtn.disabled = true;

        try {
            const answer = await callSiliconFlowAPI(currentQuestion, modelSelect.value);
            answerCache[currentIndex] = answer;
            answerEl.textContent = answer;
            statusText.textContent = "答案获取成功！";
        } catch (error) {
            answerEl.innerHTML = `<span style="color: red;">${error.message}</span>`;
            statusText.textContent = "获取失败";
        } finally {
            refreshBtn.disabled = false;
        }
    }

    async function fetchAllAnswers() {
        if (isFetchingAll) return;
        isFetchingAll = true;
        getAllBtn.disabled = true;
        refreshBtn.disabled = true;

        const total = timu.length;
        for (let i = 0; i < total; i++) {
            statusText.textContent = `正在获取第 ${i + 1} / ${total} 题...`;
            if (answerCache[i]) {
                if (i === currentIndex) updateDisplay(currentIndex);
                continue;
            }

            try {
                const answer = await callSiliconFlowAPI(timu[i], modelSelect.value);
                answerCache[i] = answer;
                if (i === currentIndex) {
                    answerEl.textContent = answer;
                }
            } catch (error) {
                answerCache[i] = `获取失败: ${error.message}`;
                if (i === currentIndex) {
                    answerEl.innerHTML = `<span style="color: red;">${answerCache[i]}</span>`;
                }
                console.error(`获取第 ${i + 1} 题答案失败:`, error);
            }
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        isFetchingAll = false;
        getAllBtn.disabled = false;
        refreshBtn.disabled = false;
        statusText.textContent = `全部 ${total} 题答案已获取完毕！`;
        updateDisplay(currentIndex);
    }


    // --- 题目内容获取与显示 ---
    function updateDisplay(index) {
        questionEl.textContent = timu[index];
        answerEl.textContent = answerCache[index] || '点击 "获取答案" 或 "一键获取全部"';
        statusText.textContent = `当前: ${index + 1} / ${timu.length}`;
    }
    function navigateQuestion(direction) {
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < timu.length) { currentIndex = newIndex; updateDisplay(currentIndex); }
    }
    questionEl.addEventListener("dblclick", () => {
        const editableDiv = document.createElement('div');
        editableDiv.setAttribute('contenteditable', 'true');
        editableDiv.textContent = questionEl.textContent;
        editableDiv.style.cssText = 'background: #fff; padding: 4px; border: 1px solid #3b82f6; border-radius: 4px; min-height: 50px;';
        questionEl.replaceWith(editableDiv); editableDiv.focus();
        const saveEdit = () => { timu[currentIndex] = editableDiv.textContent.trim(); questionEl.textContent = timu[currentIndex]; editableDiv.replaceWith(questionEl); };
        editableDiv.addEventListener('blur', saveEdit);
        editableDiv.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); } });
    });


    // --- 页面题目抓取逻辑 ---
    function getQuestionsFromPage() {
        console.log("AI助手: 开始查找题目...");
        let attempts = 0;
        const intervalId = setInterval(() => {
            if (questionsFetched || attempts++ > 10) { clearInterval(intervalId); if (!questionsFetched) console.log("AI助手: 查找超时，未找到题目。"); return; }
            let doc = document, elements = null;
            const selectors = ['.questionLi', '.TiMu', '.padBom50'];
            const findInDoc = (d) => { for (const s of selectors) { const els = d.querySelectorAll(s); if (els.length > 0) return els; } return null; };
            try {
                elements = findInDoc(doc);
                const iframe = doc.getElementById('iframe');
                if (!elements && iframe) {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    elements = findInDoc(iframeDoc);
                    const secondIframe = iframeDoc.querySelector('iframe');
                    if (!elements && secondIframe) { elements = findInDoc(secondIframe.contentDocument || secondIframe.contentWindow.document); }
                }
            } catch (e) { /* ignore */ }
            if (elements && elements.length > 0) {
                const fetchedTexts = Array.from(elements).map(el => {
                    let text = el.innerText.trim();
                    if (!text) return null;
                    text = text.replace(/(\s*\r?\n\s*)+/g, ' ').replace(/\s+/g, ' ');
                    text = text.replace(/^[A-Z]\s?[、.]\s?/, ''); // 移除题号
                    return text.trim();
                }).filter(Boolean);

                if (fetchedTexts.length > 0) {
                    console.log(`AI助手: 成功获取 ${fetchedTexts.length} 道题目。`);
                    questionsFetched = true; timu = fetchedTexts; currentIndex = 0; answerCache = {};
                    updateDisplay(currentIndex); clearInterval(intervalId);
                }
            }
        }, 500);
    }

    // --- 初始化与事件绑定 ---
    function initialize() {
        // API Key
        const savedKey = GM_getValue('siliconflow_api_key');
        if(savedKey) {
            apiKeyInput.value = savedKey;
            statusText.textContent = "准备就绪";
        }
        getElem('ai-helper-save-api-key-btn').addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            if (key) { GM_setValue('siliconflow_api_key', key); statusText.textContent = "API Key 已保存！"; apiKeyInput.type = 'password'; }
        });
        apiKeyInput.addEventListener('click', () => { apiKeyInput.type = 'text'; });


        // 按钮事件
        getElem('ai-helper-prev-btn').addEventListener('click', () => navigateQuestion(-1));
        getElem('ai-helper-next-btn').addEventListener('click', () => navigateQuestion(1));
        refreshBtn.addEventListener('click', fetchAnswerForCurrent);
        getAllBtn.addEventListener('click', fetchAllAnswers);
        getElem('ai-helper-copy-btn').addEventListener('click', () => { navigator.clipboard.writeText(answerEl.innerText).then(() => { statusText.textContent = "答案已复制！"; }); });

        // 模型选择器初始化
        const savedModel = GM_getValue('selected_model', MODELS[0].id);
        MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });
        modelSelect.value = savedModel;
        modelSelect.addEventListener('change', (e) => {
            GM_setValue('selected_model', e.target.value);
            statusText.textContent = "模型已切换并保存。";
        });

        // 答案模式选择器初始化
        const savedAnswerMode = GM_getValue('answer_mode', 'simple');
        answerModeSelect.value = savedAnswerMode;
        answerModeSelect.addEventListener('change', (e) => {
            GM_setValue('answer_mode', e.target.value);
            statusText.textContent = "答案模式已切换。";
        });

        // 其他功能开关
        const features = {
            paste: {
                el: getElem('ai-helper-paste-toggle'),
                def: true,
                cb: (v) => {
                    if (v) {
                        // 使用setTimeout确保UEditor已经完全加载
                        setTimeout(enableAdvancedPaste, 1500);
                    }
                }
            },
            copy: { el: getElem('ai-helper-copy-toggle'), def: true, cb: (v) => v ? enableCopyFeature() : disableCopyFeature() },
            watermark: { el: getElem('ai-helper-watermark-toggle'), def: true, cb: (v) => v ? removeWatermarks() : restoreWatermarks() }
        };
        for (const key in features) {
            const feature = features[key];
            const savedValue = GM_getValue(`feature_${key}`, feature.def);
            feature.el.checked = savedValue;
            if (feature.cb) feature.cb(savedValue);
            feature.el.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                GM_setValue(`feature_${key}`, isChecked);
                if (feature.cb) feature.cb(isChecked);
            });
        }

        // 启动题目抓取
        getQuestionsFromPage();
    }

    // --- 附加功能 (复制、水印、粘贴等) ---
    /**
     * 【新】使用用户提供的方法解锁UEditor的粘贴功能
     * 这种方法更具体，直接操作编辑器实例，效果更好
     */
    function enableAdvancedPaste() {
        try {
            // 检查页面是否加载了jQuery和UEditor
            // `unsafeWindow`用于从沙箱中访问页面级别的变量
            const $ = unsafeWindow.jQuery;
            const UE = unsafeWindow.UE;
            const editorPaste = unsafeWindow.editorPaste;

            if (typeof $ === 'function' && typeof UE !== 'undefined' && UE.instants) {
                console.log("AI助手: 检测到UEditor，执行高级粘贴解锁...");

                // 移除选择限制
                $("body").removeAttr("onselectstart");
                $("html").css("user-select", "unset");

                // 遍历所有UEditor实例并移除粘贴限制
                Object.entries(UE.instants).forEach(item => {
                    const editor = item[1]; // item[1]是编辑器实例
                    if (editor) {
                        editor.options.disablePasteImage = false; // 允许粘贴图片
                        // 移除'beforepaste'事件的监听器，这里的`editorPaste`是学习通页面定义的一个函数
                        editor.removeListener('beforepaste', editorPaste);
                    }
                });

                console.log("AI助手: UEditor粘贴限制已成功移除。");
                statusText.textContent = "粘贴功能已解锁。";
            } else {
                console.log("AI助手: 未检测到UEditor，跳过高级粘贴解锁。");
            }
        } catch (e) {
            console.error("AI助手: 解锁粘贴时发生错误。这可能是因为页面结构已更改或`editorPaste`函数不存在。错误信息:", e);
            statusText.textContent = "粘贴解锁失败(见控制台)。";
        }
    }

    let copyFeatureEnabled = false;
    let mouseMoveListener = null, keydownListener = null;
    function enableCopyFeature() {
        if (copyFeatureEnabled) return;
        let mouseX = 0, mouseY = 0;
        mouseMoveListener = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
        keydownListener = (e) => {
            if (e.ctrlKey && e.key === 'c') { let el = document.elementFromPoint(mouseX, mouseY); if (el) navigator.clipboard.writeText(el.innerText); }
        };
        document.addEventListener('mousemove', mouseMoveListener); document.addEventListener('keydown', keydownListener);
        copyFeatureEnabled = true;
    }
    function disableCopyFeature() {
        if (!copyFeatureEnabled) return;
        if (mouseMoveListener) document.removeEventListener('mousemove', mouseMoveListener);
        if (keydownListener) document.removeEventListener('keydown', keydownListener);
        copyFeatureEnabled = false;
    }
    function removeWatermarks() { document.querySelectorAll('.mask_div, .yd_j_water_mark').forEach(w => w.style.display = 'none'); }
    function restoreWatermarks() { document.querySelectorAll('.mask_div, .yd_j_water_mark').forEach(w => w.style.display = ''); }


    // --- 脚本启动 ---
    window.addEventListener('load', initialize);
})();