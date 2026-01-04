// ==UserScript==
// @name         Claude AI Response Model Modifier
// @namespace    http://tampermonkey.net/
// @version      2.1.4 (Optimized and Cleaned Logs)
// @description  Modifies 'model' field via Tampermonkey menu, with performance improvements.
// @author       Your Name
// @match        https://claude.ai/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537171/Claude%20AI%20Response%20Model%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/537171/Claude%20AI%20Response%20Model%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PREDEFINED_MODELS = [
        'claude-opus-4-20250514-claude-ai-pro', 'claude-3-7-sonnet-20250219', 'claude-opus-4-20250514',
    ];

    const CONFIG_KEY_ENABLE_MOD = 'ClaudeMod_EnableModification_v2';
    const CONFIG_KEY_TARGET_MODEL = 'ClaudeMod_TargetModelString_v2';

    let currentEnableModification;
    let currentTargetModelString;

    function loadConfig() {
        currentEnableModification = GM_getValue(CONFIG_KEY_ENABLE_MOD, true);
        currentTargetModelString = GM_getValue(CONFIG_KEY_TARGET_MODEL, PREDEFINED_MODELS[0]);
    }

    function registerMenuItems() {
        const toggleStatusText = '功能开关: 模型修改 (当前: ' + (currentEnableModification ? '已开启' : '已关闭') + ')';
        let modelDisplayText = currentTargetModelString || "N/A"; // Handle undefined case
        if (modelDisplayText.length > 30) {
            modelDisplayText = modelDisplayText.substring(0, 27) + '...';
        }
        const selectModelText = '选择预定义模型 (当前: ' + modelDisplayText + ')';

        GM_registerMenuCommand(toggleStatusText, toggleEnableModification, 't');
        GM_registerMenuCommand(selectModelText, selectTargetModelFromList, 's');
        GM_registerMenuCommand('设置自定义模型字符串', setCustomTargetModel, 'c');
    }

    function toggleEnableModification() {
        currentEnableModification = !currentEnableModification;
        GM_setValue(CONFIG_KEY_ENABLE_MOD, currentEnableModification);
        alert('模型修改功能现在已 ' + (currentEnableModification ? '开启 (ON)' : '关闭 (OFF)') + '.');
        registerMenuItems();
    }

    function selectTargetModelFromList() {
        let promptMessage = "请选择要使用的模型 (输入序号):\n\n";
        PREDEFINED_MODELS.forEach((model, index) => { promptMessage += (index + 1) + '. ' + model + '\n'; });
        promptMessage += '\n当前已选 (若修改将保存): ' + (currentTargetModelString || "N/A");
        const selection = prompt(promptMessage);
        if (selection === null) return;
        const selectedIndex = parseInt(selection, 10) - 1;
        if (selectedIndex >= 0 && selectedIndex < PREDEFINED_MODELS.length) {
            currentTargetModelString = PREDEFINED_MODELS[selectedIndex];
            GM_setValue(CONFIG_KEY_TARGET_MODEL, currentTargetModelString);
            alert('目标模型已设置为: ' + currentTargetModelString);
            registerMenuItems();
        } else { alert("无效的选择。"); }
    }

    function setCustomTargetModel() {
        const customModel = prompt("请输入自定义的模型字符串:", currentTargetModelString || PREDEFINED_MODELS[0]);
        if (customModel === null) return;
        if (customModel.trim() !== "") {
            currentTargetModelString = customModel.trim();
            GM_setValue(CONFIG_KEY_TARGET_MODEL, currentTargetModelString);
            alert('目标模型已自定义为: ' + currentTargetModelString);
            registerMenuItems();
        } else { alert("自定义模型字符串不能为空。"); }
    }

    let originalFetch;
    let fetchTargetWindow;

    if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.fetch === 'function') {
        fetchTargetWindow = unsafeWindow;
        originalFetch = unsafeWindow.fetch;
    } else if (typeof window.fetch === 'function') {
        fetchTargetWindow = window;
        originalFetch = window.fetch;
    } else {
        console.error('[Claude Mod v2.1.4] CRITICAL ERROR: Fetch function not found!');
    }

    const TARGET_URL_REGEX = /\/api\/organizations\/[^\/]+\/chat_conversations\/[^\/]+\?tree=True&rendering_mode=messages&render_all_tools=true$/;

    if (typeof originalFetch === 'function') {
        fetchTargetWindow.fetch = function(input, init) {
            let urlToTest;
            if (typeof input === 'string') { urlToTest = input; }
            else if (input && typeof input.url === 'string') { urlToTest = input.url; }
            else {
                // console.warn('[Claude Mod v2.1.4] Could not determine URL from fetch input. Passing through.'); // 保留此警告，但设为可选
                return originalFetch.apply(fetchTargetWindow, arguments);
            }

            // --- 性能优化：前置快速检查 ---
            // 仅当功能开启且 URL 初步匹配时，才进行后续的正则匹配
if (!currentEnableModification || !urlToTest.includes('/api/organizations/')) { // <--- 将 startsWith 修改为 includes
    return originalFetch.apply(fetchTargetWindow, arguments);
}

            // --- 对可能的目标 URL 进行正则匹配 ---
            const isMatch = TARGET_URL_REGEX.test(urlToTest);

            if (isMatch) { // 无需再次检查 currentEnableModification，前面已检查
                console.log('[Claude Mod v2.1.4] Intercepted:', urlToTest.substring(0, 120) + (urlToTest.length > 120 ? '...' : ''));
                return originalFetch.apply(fetchTargetWindow, arguments)
                    .then(async (response) => {
                        if (!response.ok) {
                             console.warn('[Claude Mod v2.1.4] Original response not OK for intercepted URL:', response.status, response.statusText, urlToTest);
                             return response;
                        }
                        const responseBodyText = await response.text();
                        let jsonData;
                        try {
                            jsonData = JSON.parse(responseBodyText);
                        } catch (e) {
                            console.error('[Claude Mod v2.1.4] Failed to parse JSON for:', urlToTest.substring(0,120), e);
                            return new Response(responseBodyText, { status: response.status, statusText: response.statusText, headers: response.headers });
                        }

                        console.log('[Claude Mod v2.1.4] Original model:', jsonData.model); // 保留这些关键操作日志
                        jsonData.model = currentTargetModelString;
                        console.log('[Claude Mod v2.1.4] Modified model to:', currentTargetModelString);

                        const modifiedResponseBody = JSON.stringify(jsonData);
                        const modifiedResponse = new Response(modifiedResponseBody, { status: response.status, statusText: response.statusText, headers: response.headers });
                        modifiedResponse.headers.set('Content-Type', 'application/json');
                        return modifiedResponse;
                    })
                    .catch(error => {
                        console.error('[Claude Mod v2.1.4] Error during fetch modification for:', urlToTest.substring(0,120), error);
                        throw error;
                    });
            }
            // 如果 URL 以 /api/organizations/ 开头，但不完全匹配 TARGET_URL_REGEX
            return originalFetch.apply(fetchTargetWindow, arguments);
        };
    }

    function init() {
        loadConfig();
        registerMenuItems();
        let fetchTargetName = "N/A";
        if (fetchTargetWindow === unsafeWindow) fetchTargetName = "unsafeWindow";
        else if (fetchTargetWindow === window) fetchTargetName = "window";

        console.log('[Claude Mod v2.1.4] Script loaded. UI active. Fetch override targeting: ' + fetchTargetName);
        console.log('[Claude Mod v2.1.4] Settings: Mod ' + (currentEnableModification ? 'ON' : 'OFF') + ', Model: ' + (currentTargetModelString || "N/A"));
    }
    init();

})();
// End of script. Ensure NO characters, including spaces or newlines, exist after this line.