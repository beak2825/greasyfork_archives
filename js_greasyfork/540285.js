// ==UserScript==
// @name         四川省执业药师继续教育
// @namespace    http://tampermonkey.net/
// @version      1.2.13
// @description  【v1.2.13 | 优化】四川职业药师继续教育;更新了部分描述，自该版本起更新了协议
// @author       Coren
// @match        https://www.sclpa.cn/*
// @match        https://zyys.ihehang.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.deepseek.com
// @connect      self
// @license CC BY-NC-SA 4.0
// license: https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans
// @downloadURL https://update.greasyfork.org/scripts/540285/%E5%9B%9B%E5%B7%9D%E7%9C%81%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/540285/%E5%9B%9B%E5%B7%9D%E7%9C%81%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

// Script execution starts here. This log should appear first in console if script loads.
console.log(`[Script Init] Attempting to load Sichuan Licensed Pharmacist Continuing Education script.`);

(function() {
    'use strict';

    // ===================================================================================
    // --- 脚本配置 (Script Configuration) ---
    // ===================================================================================

    // Get user-defined playback speed from storage, default to 16x if not set
    let currentPlaybackRate = GM_getValue('sclpa_playback_rate', 16.0);
    // Get user-defined AI API Key from storage
    let aiApiKey = GM_getValue('sclpa_deepseek_api_key', '请在此处填入您自己的 DeepSeek API Key');

    const CONFIG = {
        // Use user-defined playback speed
        VIDEO_PLAYBACK_RATE: currentPlaybackRate,
        TIME_ACCELERATION_RATE: currentPlaybackRate,
        AI_API_SETTINGS: {
            // IMPORTANT: Get API Key from storage
            API_KEY: aiApiKey,
            DEEPSEEK_API_URL: 'https://api.deepseek.com/chat/completions',
        },
    };

    // --- 脚本全局状态 (Global States) ---
    let isServiceActive = GM_getValue('sclpa_service_active', true);
    let scriptMode = GM_getValue('sclpa_script_mode', 'video');
    let isTimeAccelerated = false;
    let unfinishedTabClicked = false; // Flag to track if "未完成" tab has been clicked in the current page session
    let isPopupBeingHandled = false;
    let isModePanelCreated = false;
    let currentPageHash = '';
    let isChangingChapter = false;
    let isAiAnswerPending = false; // Flag to track if AI answer is currently being awaited
    let currentQuestionBatchText = ''; // Renamed from currentQuestionText to reflect batch processing
    let isSubmittingExam = false; // Flag to indicate if exam submission process is ongoing
    let currentNavContext = GM_getValue('sclpa_nav_context', '');


    // ===================================================================================
    // --- 辅助函数 (Helper Functions) ---
    // ===================================================================================

    /**
     * Find element by selector and text content
     * @param {string} selector - CSS selector.
     * @param {string} text - The text to match.
     * @returns {HTMLElement|null}
     */
    function findElementByText(selector, text) {
        try {
            return Array.from(document.querySelectorAll(selector)).find(el => el.innerText.trim() === text.trim());
        } catch (e) {
            console.error(`[Script Error] findElementByText failed for selector "${selector}" with text "${text}":`, e);
            return null;
        }
    }

    /**
     * Safely click an element
     * @param {HTMLElement} element - The element to click.
     */
    function clickElement(element) {
        if (element && typeof element.click === 'function') {
            console.log('[Script] Clicking element:', element);
            element.click();
        } else {
            console.warn('[Script] Attempted to click a non-existent or unclickable element:', element);
        }
    }

    /**
     * Intelligently determine if "unfinished" tab is active (compatible with professional and public courses)
     * @param {HTMLElement} tabElement - The tab element to check.
     * @returns {boolean}
     */
    function isUnfinishedTabActive(tabElement) {
        if (!tabElement) return false;
        return tabElement.classList.contains('active-radio-tag') || tabElement.classList.contains('radio-tab-tag-ed');
    }

    /**
     * Lightweight function hooking tool, inspired by hooker.js
     * @param {object} object The object containing the method (e.g., window).
     * @param {string} methodName The name of the method to hook (e.g., 'setTimeout').
     * @param {(original: Function) => Function} hooker A function that receives the original function and returns a new function.
     */
    function hook(object, methodName, hooker) {
        const original = object[methodName];
        if (typeof original === 'function') {
            object[methodName] = hooker(original);
            console.log(`[Script] Successfully hooked ${methodName}`);
        } else {
            console.warn(`[Script] Failed to hook ${methodName}: original is not a function.`);
        }
    }


    // ===================================================================================
    // --- UI面板管理 (UI Panel Management) ---
    // ===================================================================================

    /**
     * Create the script control panel (mode switching, navigation, etc.)
     */
    function createModeSwitcherPanel() {
        if (isModePanelCreated) {
            console.log('[Script] Mode switcher panel already created, skipping.');
            return;
        }
        isModePanelCreated = true;
        console.log('[Script] Attempting to create Mode Switcher Panel...');

        try {
            GM_addStyle(`
                #mode-switcher-panel { position: fixed; bottom: 20px; right: 20px; width: 220px; background-color: #fff; border: 1px solid #007bff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); z-index: 10000; overflow: hidden; font-family: 'Microsoft YaHei', sans-serif; }
                #mode-switcher-header { padding: 8px 12px; background-color: #007bff; color: white; cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center; }
                #mode-switcher-toggle-collapse { background: none; border: none; color: white; font-size: 18px; cursor: pointer; }
                #mode-switcher-content { padding: 15px; border-top: 1px solid #007bff; display: flex; flex-direction: column; align-items: center; gap: 10px; max-height: 500px; overflow: hidden; transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out; }
                #mode-switcher-panel.collapsed #mode-switcher-content { max-height: 0; padding-top: 0; padding-bottom: 0; }
                .panel-btn { padding: 8px 16px; font-size: 14px; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s; min-width: 120px; width: 100%; box-sizing: border-box; }
                .service-btn-active { background-color: #28a745; }
                .service-btn-paused { background-color: #dc3545; }
                .nav-btn { padding: 5px 10px; font-size: 12px; color: #007bff; background-color: #fff; border: 1px solid #007bff; border-radius: 5px; cursor: pointer; transition: all 0.3s; width: 100%; }
                .nav-btn:hover { background-color: #007bff; color: #fff; }
                .panel-divider { width: 100%; height: 1px; background-color: #eee; margin: 5px 0; }
                .setting-row { display: flex; flex-direction: column; width: 100%; align-items: center; }
                .setting-row > label { margin-bottom: 5px; font-size: 14px; }
                .speed-slider-container { display: flex; align-items: center; width: 100%; gap: 10px; }
                #speed-slider { flex-grow: 1; }
                #speed-display { font-weight: bold; font-size: 14px; color: #007bff; min-width: 45px; text-align: right; }
                .api-key-input { width: calc(100% - 20px); padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; font-size: 13px; }
                .api-key-action-btn { background-color: #6c757d; margin-top: 5px; }
                .api-key-action-btn:hover { background-color: #5a6268; }
            `);

            const panel = document.createElement('div');
            panel.id = 'mode-switcher-panel';
            panel.innerHTML = `
                <div id="mode-switcher-header">
                    <span>控制面板</span>
                    <button id="mode-switcher-toggle-collapse">－</button>
                </div>
                <div id="mode-switcher-content">
                    <div class="setting-row">
                        <label>点击开启/关闭服务:</label>
                        <button id="service-toggle-btn" class="panel-btn"></button>
                    </div>
                    <div class="panel-divider"></div>
                    <div class="setting-row">
                        <label for="speed-slider">倍速设置:</label>
                        <div class="speed-slider-container">
                             <input type="range" id="speed-slider" min="1" max="16" step="0.5" value="${currentPlaybackRate}">
                             <span id="speed-display">x${currentPlaybackRate}</span>
                        </div>
                    </div>
                    <div class="panel-divider"></div>
                    <div class="setting-row">
                        <label>AI API Key 设置:</label>
                        <button id="api-key-setting-btn" class="panel-btn api-key-action-btn">设置 API Key</button>
                    </div>
                    <div class="panel-divider"></div>
                    <div class="setting-row">
                         <label>快速导航:</label>
                        <div style="display: flex; flex-direction: column; gap: 5px; width: 100%;">
                            <button id="nav-specialized-btn" class="nav-btn">专业课程</button>
                            <button id="nav-public-video-btn" class="nav-btn">公需课-视频</button>
                            <button id="nav-public-article-btn" class="nav-btn">公需课-文章</button>
                            <button id="nav-specialized-exam-btn" class="nav-btn">专业课-考试</button>
                            <button id="nav-public-exam-btn" class="nav-btn">公需课-考试</button>
                        </div>
                    </div>
                </div>
            `;
            // Append to body. If body is not ready, this might fail.
            if (document.body) {
                document.body.appendChild(panel);
                console.log('[Script] Mode Switcher Panel appended to body.');
            } else {
                console.error('[Script Error] document.body is not available when trying to append Mode Switcher Panel.');
                isModePanelCreated = false; // Reset flag if append failed
                return;
            }

            // Ensure elements are retrieved AFTER they are appended to the DOM
            const serviceBtn = document.getElementById('service-toggle-btn');
            const collapseBtn = document.getElementById('mode-switcher-toggle-collapse');
            const navSpecializedBtn = document.getElementById('nav-specialized-btn');
            const navPublicVideoBtn = document.getElementById('nav-public-video-btn');
            const navPublicArticleBtn = document.getElementById('nav-public-article-btn');
            const navSpecializedExamBtn = document.getElementById('nav-specialized-exam-btn');
            const navPublicExamBtn = document.getElementById('nav-public-exam-btn');

            const speedSlider = document.getElementById('speed-slider');
            const speedDisplay = document.getElementById('speed-display');
            const apiKeySettingBtn = document.getElementById('api-key-setting-btn');

            const updateServiceButton = (isActive) => {
                if (serviceBtn) { // Add null check
                    serviceBtn.innerText = isActive ? '服务运行中' : '服务已暂停';
                    serviceBtn.className = 'panel-btn ' + (isActive ? 'service-btn-active' : 'service-btn-paused');
                }
            };
            updateServiceButton(isServiceActive);

            if (serviceBtn) {
                serviceBtn.onclick = () => {
                    isServiceActive = !isServiceActive;
                    GM_setValue('sclpa_service_active', isServiceActive);
                    window.location.reload();
                };
            } else { console.warn('[Script] serviceToggleBtn not found.'); }

            if (speedSlider) {
                speedSlider.addEventListener('input', () => {
                    if (speedDisplay) speedDisplay.textContent = `x${speedSlider.value}`;
                });
                speedSlider.addEventListener('change', () => {
                    const newRate = parseFloat(speedSlider.value);
                    GM_setValue('sclpa_playback_rate', newRate);
                    console.log(`[Script] Playback speed set to: ${newRate}x. Refreshing page to apply...`);
                    window.location.reload();
                });
            } else { console.warn('[Script] speedSlider not found.'); }

            if (collapseBtn) {
                collapseBtn.onclick = () => {
                    if (panel) panel.classList.toggle('collapsed');
                    if (collapseBtn && panel) collapseBtn.innerText = panel.classList.contains('collapsed') ? '＋' : '－';
                };
            } else { console.warn('[Script] collapseBtn not found.'); }


            if (navSpecializedBtn) {
                navSpecializedBtn.onclick = () => {
                    GM_setValue('sclpa_nav_context', 'course');
                    window.location.href = 'https://zyys.ihehang.com/#/specialized';
                };
            } else { console.warn('[Script] navSpecializedBtn not found.'); }

            if (navPublicVideoBtn) {
                navPublicVideoBtn.onclick = () => {
                    GM_setValue('sclpa_public_target', 'video');
                    GM_setValue('sclpa_nav_context', 'course');
                    window.location.href = 'https://zyys.ihehang.com/#/publicDemand';
                };
            } else { console.warn('[Script] navPublicVideoBtn not found.'); }

            if (navPublicArticleBtn) {
                navPublicArticleBtn.onclick = () => {
                    GM_setValue('sclpa_public_target', 'article');
                    GM_setValue('sclpa_nav_context', 'course');
                    window.location.href = 'https://zyys.ihehang.com/#/publicDemand';
                };
            } else { console.warn('[Script] navPublicArticleBtn not found.'); }

            if (navSpecializedExamBtn) {
                navSpecializedExamBtn.onclick = () => {
                    GM_setValue('sclpa_nav_context', 'exam');
                    window.location.href = 'https://zyys.ihehang.com/#/onlineExam';
                };
            } else { console.warn('[Script] navSpecializedExamBtn not found.'); }

            if (navPublicExamBtn) {
                navPublicExamBtn.onclick = () => {
                    GM_setValue('sclpa_nav_context', 'exam');
                    window.location.href = 'https://zyys.ihehang.com/#/openOnlineExam';
                };
            } else { console.warn('[Script] navPublicExamBtn not found.'); }

            if (apiKeySettingBtn) {
                apiKeySettingBtn.onclick = () => {
                    const currentKey = GM_getValue('sclpa_deepseek_api_key', '');
                    const newKey = prompt('请输入您的 DeepSeek AI API Key:', currentKey);
                    if (newKey !== null) {
                        GM_setValue('sclpa_deepseek_api_key', newKey.trim());
                        CONFIG.AI_API_SETTINGS.API_KEY = newKey.trim();
                        alert('API Key 已保存！下次页面加载时生效。');
                    }
                };
            } else { console.warn('[Script] apiKeySettingBtn not found.'); }


            if (panel && document.getElementById('mode-switcher-header')) { // Ensure header exists before making draggable
                 makeDraggable(panel, document.getElementById('mode-switcher-header'));
            } else {
                console.warn('[Script] Could not make panel draggable: panel or header not found after creation.');
            }
            console.log('[Script] Mode Switcher Panel creation attempted and event listeners attached.');

        } catch (e) {
            console.error('[Script Error] Error creating Mode Switcher Panel:', e);
            isModePanelCreated = false;
        }
    }

    /**
     * Create AI helper panel, ensuring it's always new
     */
    function createManualAiHelper() {
        const existingPanel = document.getElementById('ai-helper-panel');
        if (existingPanel) {
            existingPanel.remove();
            console.log('[Script] Removed existing AI helper panel.');
        }
        console.log('[Script] Attempting to create AI Helper Panel...');

        try {
            GM_addStyle(`
                #ai-helper-panel { position: fixed; bottom: 20px; right: 20px; width: 350px; max-width: 90vw; background-color: #f0f8ff; border: 1px solid #b0c4de; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 99999; font-family: 'Microsoft YaHei', sans-serif; display: flex; flex-direction: column; }
                #ai-helper-header { padding: 10px; background-color: #4682b4; color: white; font-weight: bold; cursor: move; border-top-left-radius: 9px; border-top-right-radius: 9px; user-select: none; display: flex; justify-content: space-between; align-items: center; }
                #ai-helper-close-btn { background: none; border: none; color: white; font-size: 20px; cursor: pointer; }
                #ai-helper-content { padding: 15px; display: flex; flex-direction: column; gap: 10px; }
                #ai-helper-textarea { width: 100%; box-sizing: border-box; height: 100px; padding: 8px; border: 1px solid #ccc; border-radius: 5px; resize: vertical; }
                #ai-helper-submit-btn { padding: 10px 15px; background-color: #5cb85c; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
                #ai-helper-result { margin-top: 10px; padding: 10px; background-color: #ffffff; border: 1px solid #eee; border-radius: 5px; min-height: 50px; max-height: 200px; overflow-y: auto; white-space: pre-wrap; word-wrap: break-word; }
                #ai-key-warning { color: #dc3545; font-size: 12px; margin-top: 5px; display: none; }
            `);
            const panel = document.createElement('div');
            panel.id = 'ai-helper-panel';
            panel.innerHTML = `
                <div id="ai-helper-header"><span>AI 问答助手</span><button id="ai-helper-close-btn">&times;</button></div>
                <div id="ai-helper-content">
                    <label for="ai-helper-textarea">在此输入您的问题：</label>
                    <textarea id="ai-helper-textarea" placeholder="案例：复制所有问题以及选项并询问AI，AI将直接回复答案选项..."></textarea>
                    <div id="ai-key-warning">请先在控制面板中设置您的 DeepSeek API Key！</div>
                    <button id="ai-helper-submit-btn">向AI提问</button>
                    <label for="ai-helper-result">AI 回答：</label>
                    <div id="ai-helper-result">请先提问...</div>
                </div>
            `;
            if (document.body) {
                document.body.appendChild(panel);
                console.log('[Script] AI Helper Panel appended to body.');
            } else {
                console.error('[Script Error] document.body is not available when trying to append AI Helper Panel.');
                return;
            }

            // Ensure elements are retrieved AFTER they are appended to the DOM
            const submitBtn = document.getElementById('ai-helper-submit-btn');
            const closeBtn = document.getElementById('ai-helper-close-btn');
            const textarea = document.getElementById('ai-helper-textarea');
            const resultDiv = document.getElementById('ai-helper-result');
            const keyWarning = document.getElementById('ai-key-warning');

            // Check if API Key is set
            if (keyWarning && submitBtn) { // Add null checks
                if (!CONFIG.AI_API_SETTINGS.API_KEY || CONFIG.AI_API_SETTINGS.API_KEY === '请在此处填入您自己的 DeepSeek API Key') {
                    keyWarning.style.display = 'block';
                    submitBtn.disabled = true;
                    submitBtn.innerText = '请先设置 API Key';
                }
            } else { console.warn('[Script] AI helper keyWarning or submitBtn not found after creation.'); }

            if (closeBtn) closeBtn.onclick = () => { if (panel) panel.remove(); };
            if (submitBtn && textarea && resultDiv) { // Add null checks
                submitBtn.onclick = async () => {
                    const question = textarea.value.trim();
                    if (!question) { resultDiv.innerText = '错误：问题不能为空！'; return; }
                    if (!CONFIG.AI_API_SETTINGS.API_KEY || CONFIG.AI_API_SETTINGS.API_KEY === '请在此处填入您自己的 DeepSeek API Key') {
                        resultDiv.innerText = '错误：请先设置您的 DeepSeek API Key！';
                        return;
                    }

                    submitBtn.disabled = true;
                    submitBtn.innerText = 'AI思考中...';
                    resultDiv.innerText = '正在向AI发送请求...';
                    try {
                        resultDiv.innerText = await askAiForAnswer(question);
                    } catch (error) {
                        resultDiv.innerText = `请求失败：${error}`;
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerText = '向AI提问';
                    }
                };
            } else {
                console.warn('[Script] AI helper buttons or text areas not found after creation.');
            }

            if (panel && document.getElementById('ai-helper-header')) { // Ensure header exists before making draggable
                makeDraggable(panel, document.getElementById('ai-helper-header'));
            } else {
                console.warn('[Script] Could not make AI helper panel draggable: panel or header not found after creation.');
            }
            console.log('[Script] AI Helper Panel creation attempted and event listeners attached.');

        } catch (e) {
            console.error('[Script Error] Error creating AI Helper Panel:', e);
        }
    }

    /**
     * Make UI panel draggable
     * @param {HTMLElement} panel - The panel element to be dragged.
     * @param {HTMLElement} header - The header element that acts as the drag handle.
     */
    function makeDraggable(panel, header) {
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
            isDragging = true;
            if (panel.style.bottom || panel.style.right) {
                const rect = panel.getBoundingClientRect();
                panel.style.top = `${rect.top}px`;
                panel.style.left = `${rect.left}px`;
                panel.style.bottom = '';
                panel.style.right = '';
            }
            offsetX = e.clientX - parseFloat(panel.style.left);
            offsetY = e.clientY - parseFloat(panel.style.top);
            header.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            panel.style.left = `${newX}px`;
            panel.style.top = `${newY}px`;
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
                document.body.style.userSelect = '';
            }
        });
    }

    // ===================================================================================
    // --- AI 调用 (AI Invocation) ---
    // ===================================================================================

    /**
     * Send request to DeepSeek AI and get answer
     * @param {string} question - User's question
     * @returns {Promise<string>}
     */
    function askAiForAnswer(question) {
        return new Promise((resolve, reject) => {
            if (!CONFIG.AI_API_SETTINGS.API_KEY || CONFIG.AI_API_SETTINGS.API_KEY === '请在此处填入您自己的 DeepSeek API Key') {
                reject('API Key 未设置或不正确，请在控制面板中设置！');
                return;
            }
            const payload = {
                model: "deepseek-chat",
                messages: [{
                    "role": "system",
                    "content": "你是一个乐于助人的问题回答助手。聚焦于执业药师相关的内容，请根据用户提出的问题，提供准确、清晰的解答。注意回答时仅仅包括答案，不允许其他额外任何解释，输出为一行一道题目的答案，答案只能是题目序号:字母选项，不能包含文字内容。单选输出示例：1.A。多选输出示例：1.ABC。"
                }, {
                    "role": "user",
                    "content": question
                }],
                temperature: 0.2
            };
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.AI_API_SETTINGS.DEEPSEEK_API_URL,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CONFIG.AI_API_SETTINGS.API_KEY}` },
                data: JSON.stringify(payload),
                timeout: 20000,
                onload: (response) => { try { const result = JSON.parse(response.responseText); if (result.choices && result.choices.length > 0) { resolve(result.choices[0].message.content.trim()); } else { reject('AI响应格式不正确。'); } } catch (e) { reject(`解析AI响应失败: ${e.message}`); } },
                onerror: (err) => reject(`请求AI API网络错误: ${err.statusText || '未知错误'}`),
                ontimeout: () => reject('请求AI API超时')
            });
        });
    }


    // ===================================================================================
    // --- 页面逻辑处理 (Page-Specific Logic) ---
    // ===================================================================================

    /**
     * Handle course list page, compatible with video and article
     * @param {string} courseType - '专业课' or '公需课'.
     */
    function handleCourseListPage(courseType) {
        if (!isServiceActive) return;
        console.log(`[Script] handleCourseListPage called for ${courseType}.`);

        // Handle public course tab switching first
        if (courseType === '公需课') {
            const publicTarget = GM_getValue('sclpa_public_target', 'video');
            const targetTabText = publicTarget === 'article' ? '文章资讯' : '视频课程';
            const targetTab = findElementByText('.radioTab > .radio-tab-tag', targetTabText);
            if (targetTab && !targetTab.classList.contains('radio-tab-tag-ed')) {
                console.log(`[Script] Public Course: Target is ${targetTabText}, switching tab...`);
                clickElement(targetTab);
                // After clicking the tab, wait for content to load, then re-run this function
                setTimeout(() => handleCourseListPage(courseType), 1000); // Re-evaluate after tab switch
                return;
            }
        }

        const unfinishedTab = findElementByText('div.radio-tab-tag', '未完成');

        // Step 1: Click "未完成" tab if not already active
        // Removed `!unfinishedTabClicked` to ensure it keeps trying to click until active
        if (unfinishedTab && !isUnfinishedTabActive(unfinishedTab)) {
            console.log('[Script] Course List: Found "未完成" tab and it is not active, clicking it...');
            clickElement(unfinishedTab);
            // Set unfinishedTabClicked to true only after a successful click attempt
            // This flag is reset by mainLoop when hash changes to a list page.
            unfinishedTabClicked = true;
            // After clicking, wait for the page to filter/load the unfinished list
            setTimeout(() => {
                console.log('[Script] Course List: Waiting after clicking "未完成" tab, then re-evaluating...');
                // After delay, re-call handleCourseListPage to re-check the active state and proceed.
                handleCourseListPage(courseType);
            }, 3000); // Increased delay to 3 seconds for tab content to load
            return; // Crucial to prevent immediate fall-through to course finding
        }

        // Step 2: If "未完成" tab is active, proceed to find and click the first unfinished course.
        // This block will only execute if the tab is truly active.
        if (unfinishedTab && isUnfinishedTabActive(unfinishedTab)) {
            setTimeout(() => {
                let targetCourseElement = document.querySelector('.play-card:not(:has(.el-icon-success))');

                if (!targetCourseElement) {
                    // Fallback for article cards if play-card not found (for public courses)
                    const allArticles = document.querySelectorAll('.information-card');
                    for (const article of allArticles) {
                        const statusTag = article.querySelector('.status');
                        if (statusTag && statusTag.innerText.trim() === '未完成') {
                            targetCourseElement = article;
                            break;
                        }
                    }
                }

                if (targetCourseElement) {
                    console.log(`[Script] ${courseType}: Found the first unfinished item, clicking to enter study...`);
                    const clickableElement = targetCourseElement.querySelector('.play-card-box-right-text') || targetCourseElement;
                    clickElement(clickableElement);
                } else {
                    console.log(`[Script] ${courseType}: No unfinished items found on "未完成" page. All courses might be completed or elements not yet loaded.`);
                }
            }, 1500); // Delay before finding the course element
        }
    }

    /**
     * Main handler for learning page
     */
    function handleLearningPage() {
        if (!isServiceActive) return;
        console.log('[Script] handleLearningPage called.');
        if (!isTimeAccelerated) {
            accelerateTime();
            isTimeAccelerated = true;
        }

        const directoryItems = document.querySelectorAll('.catalogue-item');

        if (directoryItems.length > 0) {
            handleMultiChapterCourse(directoryItems);
        } else {
            const video = document.querySelector('video');
            if (video) {
                handleSingleMediaCourse(video);
            } else {
                handleArticleReadingPage();
            }
        }
    }

    /**
     * [FIXED] Handle multi-chapter courses (professional courses)
     * @param {NodeListOf<Element>} directoryItems
     */
    function handleMultiChapterCourse(directoryItems) {
        if (isChangingChapter) return;
        console.log('[Script] handleMultiChapterCourse called.');
        const video = document.querySelector('video');

        // [FIX] Ensure video object exists before proceeding
        if (!video) {
            console.log('[Script] Video element not found, waiting...');
            return;
        }

        // [FIX] Always set playbackRate and muted properties if video exists.
        // This ensures the speed is applied even if the video is currently paused.
        video.playbackRate = CONFIG.VIDEO_PLAYBACK_RATE;
        video.muted = true;

        // If video is playing, we've done our job for this cycle.
        if (!video.paused) {
            return;
        }

        // Logic to find the next unfinished chapter
        let nextChapter = null;
        for (const item of directoryItems) {
            if (!item.querySelector('.el-icon-success')) {
                nextChapter = item;
                break;
            }
        }

        if (nextChapter) {
            const isAlreadySelected = nextChapter.classList.contains('catalogue-item-ed');
            if (isAlreadySelected) { // If it's the correct chapter but paused
                console.log('[Script] Current chapter is correct but video is paused, attempting to play.');
                video.play().catch(e => { console.error('[Script Error] Failed to play video:', e); });
            } else { // If we need to switch to the next chapter
                console.log('[Script] Moving to next chapter:', nextChapter.innerText.trim());
                clickElement(nextChapter);
                isChangingChapter = true;
                setTimeout(() => { isChangingChapter = false; }, 4000); // Give time for chapter to load
            }
        } else {
            // All chapters have the success icon. The main loop will now handle navigation via handleMajorPlayerPage.
            console.log('[Script] All chapters appear to be complete. The main loop will verify and navigate.');
        }
    }


    /**
     * [FIXED] Handle single media courses (public courses)
     * @param {HTMLVideoElement} video
     */
    function handleSingleMediaCourse(video) {
        console.log('[Script] handleSingleMediaCourse called.');
        if (!video.dataset.singleVidControlled) {
            video.addEventListener('ended', safeNavigateAfterCourseCompletion);
            video.dataset.singleVidControlled = 'true';
            console.log('[Script] Added "ended" event listener for single media course.');
        }

        // [FIX] Always set playbackRate and muted properties.
        video.playbackRate = CONFIG.VIDEO_PLAYBACK_RATE;
        video.muted = true;

        if (video.paused) {
            console.log('[Script] Single media video paused, attempting to play.');
            video.play().catch(e => { console.error('[Script Error] Failed to play single media video:', e); });
        }
    }

    /**
     * Handle article reading page
     */
    function handleArticleReadingPage() {
        console.log('[Script] handleArticleReadingPage called.');
        const progressLabel = document.querySelector('.action-btn .label');
        if (progressLabel && (progressLabel.innerText.includes('100') || progressLabel.innerText.includes('待考试'))) {
            console.log('[Script] Article study completed, preparing to return to list.');
            safeNavigateAfterCourseCompletion();
        } else {
            console.log('[Script] Article progress not yet 100% or "待考试".');
        }
    }

    /**
     * Handle exam page (where the actual questions are displayed)
     * Automatically copies question to AI helper and processes the AI answer.
     */
    function handleExamPage() {
        if (!isServiceActive) return; // Only run if service is active
        console.log('[Script] handleExamPage called.');

        currentNavContext = GM_getValue('sclpa_nav_context', ''); // Ensure context is fresh
        if (currentNavContext === 'course') {
            console.log('[Script] Current navigation context is "course". Ignoring exam automation and navigating back to course list.');
            safeNavigateBackToList();
            return;
        }

        if (isSubmittingExam) {
            console.log('[Script] Exam submission in progress, deferring AI processing.');
            return;
        }

        if (!document.getElementById('ai-helper-panel')) {
            createManualAiHelper();
            setTimeout(() => {
                triggerAiQuestionAndProcessAnswer();
            }, 500);
        } else {
            triggerAiQuestionAndProcessAnswer();
        }
    }

    /**
     * Gathers all questions and options from the current exam page,
     * sends them to AI, and waits for the response to select answers.
     */
    async function triggerAiQuestionAndProcessAnswer() {
        const examinationItems = document.querySelectorAll('.examination-body-item');
        const aiHelperTextarea = document.getElementById('ai-helper-textarea');
        const aiHelperSubmitBtn = document.getElementById('ai-helper-submit-btn');
        const aiHelperResultDiv = document.getElementById('ai-helper-result');

        if (examinationItems.length === 0 || !aiHelperTextarea || !aiHelperSubmitBtn || !aiHelperResultDiv) {
            console.log('[Script] No examination items found or AI helper elements missing. Cannot trigger AI.');
            return;
        }

        let fullQuestionBatchContent = '';
        examinationItems.forEach(item => {
            fullQuestionBatchContent += item.innerText.trim() + '\n\n'; // Concatenate all questions
        });

        // Only process if the batch of questions has changed and AI answer is not pending
        if (fullQuestionBatchContent && fullQuestionBatchContent !== currentQuestionBatchText && !isAiAnswerPending) {
            currentQuestionBatchText = fullQuestionBatchContent; // Update current batch text
            aiHelperTextarea.value = fullQuestionBatchContent; // Set textarea value with all questions
            aiHelperResultDiv.innerText = '正在向AI发送请求...';
            console.log('[Script] New batch of exam questions copied to AI helper textarea, triggering AI query...');

            isAiAnswerPending = true;

            clickElement(aiHelperSubmitBtn);

            let attempts = 0;
            const maxAttempts = 300; // Max 300 attempts * 500ms = 60 seconds
            const checkInterval = 500;

            const checkAiResult = setInterval(() => {
                if (aiHelperResultDiv.innerText.trim() && aiHelperResultDiv.innerText.trim() !== '正在向AI发送请求...' && aiHelperResultDiv.innerText.trim() !== '请先提问...') {
                    clearInterval(checkAiResult);
                    isAiAnswerPending = false;
                    console.log('[Script] AI response received:', aiHelperResultDiv.innerText.trim());
                    parseAndSelectAllAnswers(aiHelperResultDiv.innerText.trim()); // Call new function to handle all answers

                    setTimeout(() => {
                        handleNextQuestionOrSubmitExam(); // After all answers are selected, move to next step
                    }, 1000);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkAiResult);
                    isAiAnswerPending = false;
                    console.log('[Script] Timeout waiting for AI response for question batch.');
                    aiHelperResultDiv.innerText = 'AI请求超时，请手动重试。';
                    setTimeout(() => {
                        handleNextQuestionOrSubmitExam();
                    }, 1000);
                }
                attempts++;
            }, checkInterval);

        } else if (isAiAnswerPending) {
            console.log('[Script] AI answer already pending for current question batch, skipping new query.');
        } else if (fullQuestionBatchContent === currentQuestionBatchText) {
            console.log('[Script] Question batch content has not changed, skipping AI query.');
        }
    }


    /**
     * Parses the AI response and automatically selects the corresponding options for all questions on the exam page.
     * @param {string} aiResponse - The raw response string from the AI (e.g., "1.A\n2.BC\n3.D").
     */
    function parseAndSelectAllAnswers(aiResponse) {
        const aiAnswerLines = aiResponse.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const examinationItems = document.querySelectorAll('.examination-body-item');

        const aiAnswersMap = new Map(); // Map to store {questionNumber: answerLetters}
        aiAnswerLines.forEach(line => {
            const parts = line.split('.');
            if (parts.length >= 2) {
                const qNum = parseInt(parts[0]);
                const ansLetters = parts[1].toUpperCase();
                if (!isNaN(qNum) && ansLetters) {
                    aiAnswersMap.set(qNum, ansLetters);
                } else {
                    console.warn(`[Script] Invalid AI response line format or content: ${line}`);
                }
            } else {
                console.warn(`[Script] Invalid AI response line format: ${line}`);
            }
        });

        examinationItems.forEach(item => {
            const questionTitleElement = item.querySelector('.examination-body-title');
            if (questionTitleElement) {
                const match = questionTitleElement.innerText.trim().match(/^(\d+)、/);
                const questionNumber = match ? parseInt(match[1]) : null;

                if (questionNumber !== null && aiAnswersMap.has(questionNumber)) {
                    const answerLetters = aiAnswersMap.get(questionNumber);
                    console.log(`[Script] Processing Q${questionNumber}: Selecting options ${answerLetters}`);

                    for (const letter of answerLetters) {
                        const optionText = `${letter}.`;
                        // Find options specific to this question item
                        const optionElement = Array.from(item.querySelectorAll('.examination-check-item')).find(el =>
                            el.innerText.trim().startsWith(optionText)
                        );

                        if (optionElement) {
                            console.log(`[Script] Selecting option: ${letter} for Q${questionNumber}`);
                            clickElement(optionElement);
                        } else {
                            console.warn(`[Script] Option '${letter}' not found for Q${questionNumber} using text '${optionText}'.`);
                        }
                    }
                } else if (questionNumber === null) {
                    console.warn('[Script] Could not extract question number from item:', item.innerText.trim().substring(0, 50) + '...');
                } else {
                    console.log(`[Script] No AI answer found for Q${questionNumber} in AI response. Skipping.`);
                }
            }
        });
        console.log('[Script] Finished parsing and selecting all answers on current page.');
    }


    /**
     * Handles navigation after answering a question: either to the next question or submits the exam.
     */
    function handleNextQuestionOrSubmitExam() {
        if (!isServiceActive || isSubmittingExam) {
            console.log('[Script] Service inactive or exam submission in progress, deferring next step.');
            return;
        }
        console.log('[Script] handleNextQuestionOrSubmitExam called.');

        // First, try to find the "下一题" button
        const nextQuestionButton = findElementByText('button span', '下一题');

        if (nextQuestionButton) {
            console.log('[Script] Found "下一题" button, clicking it...');
            clickElement(nextQuestionButton.closest('button'));
            // After clicking "下一题", the page should load the next question batch.
            // mainLoop will detect hash change and re-trigger handleExamPage,
            // or if on the same hash but content changed, triggerAiQuestionAndProcessAnswer will detect new questions.
            // Reset question batch text to ensure new questions are processed
            currentQuestionBatchText = '';
        } else {
            // If "下一题" not found, try to find "提交试卷"
            const submitExamButton = findElementByText('button.submit-btn span', '提交试卷');

            if (submitExamButton) {
                console.log('[Script] "下一题" not found. Found "提交试卷" button, clicking it...');
                isSubmittingExam = true;
                clickElement(submitExamButton.closest('button'));

                setTimeout(() => {
                    console.log('[Script] Exam submitted. Navigating back to exam list page...');
                    const hash = window.location.hash.toLowerCase();
                    const returnUrl = hash.includes('openonlineexam')
                        ? 'https://zyys.ihehang.com/#/openOnlineExam'
                        : 'https://zyys.ihehang.com/#/onlineExam';
                    window.location.href = returnUrl;
                    isSubmittingExam = false;
                    currentQuestionBatchText = ''; // Clear for next exam cycle
                }, 3000);
            } else {
                console.log('[Script] Neither "下一题" nor "提交试卷" button found. Check page state or selectors.');
            }
        }
    }


    /**
     * Handle exam list page (e.g., #/onlineExam or #/openOnlineExam)
     * This function will find and click the "待考试" tab if it's not already active,
     * then find and click the "开始考试" button for the first pending exam.
     */
    function handleExamListPage() {
        if (!isServiceActive) return;
        console.log('[Script] handleExamListPage called.');

        const currentHash = window.location.hash.toLowerCase();
        currentNavContext = GM_getValue('sclpa_nav_context', '');

        // If the context is 'course', we should not be automating exams. Navigate back.
        if (currentNavContext === 'course') {
            console.log('[Script] Current navigation context is "course". Ignoring exam automation and navigating back to course list.');
            safeNavigateBackToList();
            return;
        }

        const pendingExamTab = findElementByText('div.radio-tab-tag', '待考试');

        if (pendingExamTab && !isUnfinishedTabActive(pendingExamTab)) {
            console.log('[Script] Found "待考试" tab, clicking it...');
            clickElement(pendingExamTab);
            // After clicking, wait for the content to load, then re-evaluate
            setTimeout(() => {
                handleExamListPage();
            }, 2500);
            return;
        } else if (pendingExamTab && isUnfinishedTabActive(pendingExamTab)) {
            // Check for "暂无数据" if on professional exam page
            if (currentHash.includes('/onlineexam')) {
                const emptyDataText = document.querySelector('.el-table__empty-text');
                if (emptyDataText && emptyDataText.innerText.includes('暂无数据')) {
                    console.log('[Script] Professional Exam List: Detected "暂无数据". Switching to Public Exam List.');
                    window.location.href = 'https://zyys.ihehang.com/#/openOnlineExam';
                    return; // Exit after navigation
                }
            }

            // If not "暂无数据" or on public exam page, attempt to start exam
            console.log('[Script] "待考试" tab is active. Attempting to find "开始考试" button...');
            attemptClickStartExamButton();
        } else {
            console.log('[Script] No "待考试" tab or pending exam found. All exams might be completed.');
            // If all exams are completed, or no pending tab, the script will idle here.
        }
    }

    /**
     * Attempts to find and click the "开始考试" button for the first available exam.
     */
    function attemptClickStartExamButton() {
        const startExamButton = findElementByText('button.el-button--danger span', '开始考试');

        if (startExamButton) {
            console.log('[Script] Found "开始考试" button, clicking it...');
            clickElement(startExamButton.closest('button'));
        } else {
            console.log('[Script] "开始考试" button not found on the page.');
        }
    }


    /**
     * Handle generic popups, including the "前往考试" popup after course completion.
     */
    function handleGenericPopups() {
        if (!isServiceActive || isPopupBeingHandled) return;
        console.log('[Script] handleGenericPopups called.');

        const currentHash = window.location.hash.toLowerCase(); // Get current hash here
        const examCompletionPopupMessage = document.querySelector('.el-message-box__message p');
        const goToExamBtnInPopup = findElementByText('button.el-button--primary span', '前往考试');
        const cancelBtnInPopup = findElementByText('button.el-button--default span', '取消');

        if (examCompletionPopupMessage && examCompletionPopupMessage.innerText.includes('恭喜您已经完成所有课程学习') && goToExamBtnInPopup && cancelBtnInPopup) {
            // If on major player page, the new dedicated handler will manage this popup.
            if (currentHash.includes('/majorplayerpage')) {
                return;
            }

            currentNavContext = GM_getValue('sclpa_nav_context', '');
            // Only handle this popup for course completion context on non-majorPlayerPage
            if (currentNavContext === 'course') {
                console.log('[Script] Detected "恭喜您" completion popup on non-majorPlayerPage. Clicking "取消".');
                isPopupBeingHandled = true;
                clickElement(cancelBtnInPopup.closest('button'));
                setTimeout(() => { isPopupBeingHandled = false; }, 1000); // Reset flag after delay
                return;
            }
        }

        const genericBtn = findElementByText('button span', '确定') || findElementByText('button span', '进入下一节学习');
        if (genericBtn) {
            console.log(`[Script] Detected generic popup button: ${genericBtn.innerText.trim()}. Clicking it.`);
            isPopupBeingHandled = true;
            clickElement(genericBtn.closest('button'));
            setTimeout(() => { isPopupBeingHandled = false; }, 2500);
        }
    }


    // ===================================================================================
    // --- 核心自动化 (Core Automation) ---
    // ===================================================================================

    /**
     * [Time Engine] Global time acceleration, including setTimeout, setInterval, and requestAnimationFrame
     */
    function accelerateTime() {
        if (CONFIG.TIME_ACCELERATION_RATE <= 1) return;
        console.log(`[Script] Time acceleration engine started, rate: ${CONFIG.TIME_ACCELERATION_RATE}x`);

        const rate = CONFIG.TIME_ACCELERATION_RATE;

        try {
            hook(window, 'setTimeout', (original) => (cb, delay, ...args) => original.call(window, cb, delay / rate, ...args));
            hook(window, 'setInterval', (original) => (cb, delay, ...args) => original.call(window, cb, delay / rate, ...args));

            hook(window, 'requestAnimationFrame', (original) => {
                let firstTimestamp = -1;
                return (callback) => {
                    return original.call(window, (timestamp) => {
                        if (firstTimestamp < 0) firstTimestamp = timestamp;
                        const acceleratedTimestamp = firstTimestamp + (timestamp - firstTimestamp) * rate;
                        callback(acceleratedTimestamp);
                    });
                };
            });

            hook(Date, 'now', (original) => {
                const scriptStartTime = original();
                return () => scriptStartTime + (original() - scriptStartTime) * rate;
            });
        } catch (e) {
            console.error('[Script Error] Failed to apply time acceleration hooks:', e);
        }
    }

    /**
     * Initializes video playback fixes including rate anti-rollback and background playback prevention.
     */
    function initializeVideoPlaybackFixes() {
        console.log('[Script] Initializing video playback fixes (rate anti-rollback and background playback).');

        try {
            // 1. Prevent webpage from resetting video playback rate
            hook(Object, 'defineProperty', (original) => function(target, property, descriptor) {
                if (target instanceof HTMLMediaElement && property === 'playbackRate') {
                    console.log('[Script] Detected website attempting to lock video playback rate, intercepted.');
                    return; // Prevent original defineProperty call for playbackRate
                }
                return original.apply(this, arguments);
            });

            // 2. Prevent video pausing when tab is in background by faking visibility state
            Object.defineProperty(document, "hidden", {
                get: function() {
                    return false;
                },
                configurable: true
            });
            Object.defineProperty(document, "visibilityState", {
                get: function() {
                    return "visible";
                },
                configurable: true
            });
            console.log('[Script] Document visibility state faked successfully.');
        } catch (e) {
            console.error('[Script Error] Failed to initialize video playback fixes:', e);
        }
    }


    /**
     * Safely navigate back to the corresponding course list
     * This function is now mostly a fallback, as direct button clicks are preferred.
     */
    function safeNavigateBackToList() {
        const hash = window.location.hash.toLowerCase();
        const returnUrl = hash.includes('public') || hash.includes('openplayer') || hash.includes('imageandtext') || hash.includes('openonlineexam')
            ? 'https://zyys.ihehang.com/#/publicDemand'
            : 'https://zyys.ihehang.com/#/specialized';
        console.log(`[Script] Fallback: Navigating back to list: ${returnUrl}`);
        window.location.href = returnUrl;
    }

    /**
     * Decide next action after a course (including all its chapters) is completed.
     * This function is crucial for determining whether to proceed to exam or continue course swiping.
     */
    function safeNavigateAfterCourseCompletion() {
        const hash = window.location.hash.toLowerCase();
        currentNavContext = GM_getValue('sclpa_nav_context', ''); // Ensure context is fresh
        console.log('[Script] safeNavigateAfterCourseCompletion called. Current hash:', hash, 'Context:', currentNavContext);

        // Check if the current page is a player page (video or article player)
        if (hash.includes('/majorplayerpage') || hash.includes('/articleplayerpage') || hash.includes('/openplayer') || hash.includes('/imageandtext')) {
            // If the navigation context is explicitly set to 'exam' (e.g., user clicked '专业课-考试' from panel)
            if (currentNavContext === 'exam') {
                const goToExamButton = findElementByText('button span', '前往考试');
                if (goToExamButton) {
                    console.log('[Script] Course completed. Context is "exam". Found "前往考试" button, clicking it.');
                    clickElement(goToExamButton.closest('button'));
                    return; // Exit after clicking exam button
                } else {
                    console.log('[Script] Course completed. Context is "exam" but "前往考试" button not found, navigating back to exam list.');
                    // Navigate to appropriate exam list if '前往考试' isn't found
                    const examReturnUrl = hash.includes('openplayer') || hash.includes('imageandtext') ? 'https://zyys.ihehang.com/#/openOnlineExam' : 'https://zyys.ihehang.com/#/onlineExam';
                    window.location.href = examReturnUrl;
                    return;
                }
            } else {
                // For majorPlayerPage, navigation is now handled by the dedicated handler.
                if (hash.includes('/majorplayerpage')) {
                    console.log('[Script] Professional Course completed. Awaiting main loop handler for navigation.');
                } else {
                    // For public courses (or other non-majorPlayerPage players), use general navigation
                    console.log('[Script] Public Course completed. Navigating back to general course list.');
                    safeNavigateBackToList();
                }
                return; // Exit after attempting navigation
            }
        }

        // Fallback for other cases (e.g., if this function is called from a non-player page unexpectedly)
        console.log('[Script] safeNavigateAfterCourseCompletion called from non-player page or unhandled scenario. Navigating back to general course list.');
        safeNavigateBackToList();
    }


    // ===================================================================================
    // --- 主循环与启动器 (Main Loop & Initiator) ---
    // ===================================================================================

    /**
     * [FIXED] Dedicated handler for the professional course player page (/majorPlayerPage).
     * This function's only job is to detect the final completion popup and navigate.
     * @returns {boolean} - Returns true if navigation was initiated, otherwise false.
     */
    function handleMajorPlayerPage() {
        // Priority 1: Check for the "Congratulations" popup. Its presence means the course is finished.
        const completionPopup = document.querySelector('.el-message-box');
        if (completionPopup && completionPopup.innerText.includes('恭喜您已经完成所有课程学习')) {
            console.log('[Script] Completion popup detected. This signifies the course is finished. Navigating to professional courses list.');
            const navButton = document.getElementById('nav-specialized-btn');
            if (navButton) {
                clickElement(navButton);
            } else {
                console.warn('[Script] Could not find "专业课程" button (nav-specialized-btn) for navigation. Falling back to URL change.');
                window.location.href = 'https://zyys.ihehang.com/#/specialized';
            }
            // Return true as we've initiated the final navigation action.
            return true;
        }

        // If no popup is found, it means the course is still in progress. Return false.
        return false;
    }


    /**
     * Page router, determines which handler function to execute based on URL hash
     */
    function router() {
        const hash = window.location.hash.toLowerCase();
        console.log('[Script] Router: Current hash is', hash);
        if (hash.includes('/specialized')) {
            handleCourseListPage('专业课');
        } else if (hash.includes('/publicdemand')) {
            handleCourseListPage('公需课');
        } else if (hash.includes('/examination')) {
            handleExamPage();
        } else if (hash.includes('/majorplayerpage') || hash.includes('/articleplayerpage') || hash.includes('/openplayer') || hash.includes('/imageandtext')) {
             handleLearningPage();
        } else if (hash.includes('/onlineexam') || hash.includes('/openonlineexam')) {
            handleExamListPage();
        } else {
            console.log('[Script] Router: No specific handler for current hash, idling.');
        }
    }

    /**
     * Main script loop, executed every 2 seconds
     */
    function mainLoop() {
        console.log('[Script] Main loop running...');
        const currentHash = window.location.hash; // Get current hash at the start of the loop

        // Detect hash change to reset states
        if (currentHash !== currentPageHash) {
            const oldHash = currentPageHash;
            currentPageHash = currentHash; // Update currentPageHash
            console.log(`[Script] Hash changed from ${oldHash} to ${currentHash}.`);

            // If exiting an examination page, clean up AI panel and related flags
            if (oldHash.includes('/examination') && !currentHash.includes('/examination')) {
                const aiPanel = document.getElementById('ai-helper-panel');
                if (aiPanel) aiPanel.remove();
                currentQuestionBatchText = ''; // Reset batch text on exam page exit
                isAiAnswerPending = false;
                isSubmittingExam = false;
                console.log('[Script] Exited examination page, reset AI related flags.');
            }
        }

        // Always reset unfinishedTabClicked if we are on a course list page or exam list page.
        // This ensures that even if the hash doesn't change (e.g., page reload to same hash),
        // the "未完成" tab logic is re-evaluated.
        if (currentHash.includes('/specialized') || currentHash.includes('/publicdemand') ||
            currentHash.includes('/onlineexam') || currentHash.includes('/openonlineexam')) {
            if (unfinishedTabClicked) { // Only log if it's actually being reset
                console.log('[Script] Resetting unfinishedTabClicked flag for current list page.');
            }
            unfinishedTabClicked = false;
        }

        if (isServiceActive) {
            // High-priority handler for the professional course player page.
            if (currentHash.toLowerCase().includes('/majorplayerpage')) {
                // If the handler initiates navigation, it returns true.
                // We should then skip the rest of the main loop for this cycle.
                if (handleMajorPlayerPage()) {
                    return;
                }
            }
            // Handle other generic popups
            handleGenericPopups();
        }

        // Route to the appropriate page handler
        router();
    }

    /**
     * Start the script
     */
    window.addEventListener('load', () => {
        console.log(`[Script] Sichuan Licensed Pharmacist Continuing Education (v1.3.1) started.`);
        console.log(`[Script] Service status: ${isServiceActive ? 'Running' : 'Paused'} | Current speed: ${currentPlaybackRate}x`);
        currentPageHash = window.location.hash;
        currentNavContext = GM_getValue('sclpa_nav_context', ''); // Load initial navigation context

        try {
            initializeVideoPlaybackFixes();
        } catch (e) {
            console.error('[Script Error] Failed to initialize video playback fixes during load:', e);
        }

        try {
            createModeSwitcherPanel(); // This creates the UI panel
        } catch (e) {
            console.error('[Script Error] Failed to create Mode Switcher Panel during load:', e);
        }

        // Start the main loop
        setInterval(mainLoop, 2000);
        console.log('[Script] Main loop initiated.');
    });

})();
