// ==UserScript==
// @name         酒馆ComfyUI插图脚本
// @namespace    http://tampermonkey.net/
// @version      8
// @license GPL
// @description  用于酒馆SillyTavern的ai插图脚本，替换特定字符为图片，并使用特定字符内生成的prompt通过ComfyUI API生图。需要打开浏览器扩展开发者模式。
// @author       soulostar
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/535811/%E9%85%92%E9%A6%86ComfyUI%E6%8F%92%E5%9B%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/535811/%E9%85%92%E9%A6%86ComfyUI%E6%8F%92%E5%9B%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置常量 ---
    const BUTTON_ID = 'comfyui-launcher-button';
    const PANEL_ID = 'comfyui-panel';
    const POLLING_TIMEOUT_MS = 60000; // 轮询超时时间 (60秒)
    const POLLING_INTERVAL_MS = 2000; // 轮询间隔 (2秒)
    const STORAGE_KEY_IMAGES = 'comfyui_generated_images';


    // --- 注入自定义CSS样式 ---
    GM_addStyle(`
        /* 控制面板主容器样式 */
        #${PANEL_ID} {
            display: none; /* 默认隐藏 */
            position: fixed; /* 浮动窗口 */
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* 默认居中显示 */
            width: 90vw; /* 移动设备上宽度 */
            max-width: 500px; /* 桌面设备上最大宽度 */
            z-index: 9999; /* 确保在顶层 */
            color: var(--SmartThemeBodyColor, #dcdcd2);
            background-color: var(--SmartThemeBlurTintColor, rgba(23, 23, 23, 0.9));
            border: 1px solid var(--SmartThemeBorderColor, rgba(0, 0, 0, 0.5));
            border-radius: 8px;
            box-shadow: 0 4px 15px var(--SmartThemeShadowColor, rgba(0, 0, 0, 0.5));
            padding: 15px;
            box-sizing: border-box;
            backdrop-filter: blur(var(--blurStrength, 10px));
            flex-direction: column;
        }

        /* 面板标题栏 */
        #${PANEL_ID} .panel-control-bar {
            cursor: move; /* 拖动光标 */
            padding-bottom: 10px;
            margin-bottom: 15px;
            border-bottom: 1px solid var(--SmartThemeBorderColor, rgba(0, 0, 0, 0.5));
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }

        #${PANEL_ID} .panel-control-bar b { font-size: 1.2em; margin-left: 10px; }
        #${PANEL_ID} .floating_panel_close { cursor: pointer; font-size: 1.5em; }
        #${PANEL_ID} .floating_panel_close:hover { opacity: 0.7; }
        #${PANEL_ID} .comfyui-panel-content { overflow-y: auto; flex-grow: 1; padding-right: 5px; }

        /* 输入框和文本域样式 */
        #${PANEL_ID} input[type="text"],
        #${PANEL_ID} textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid var(--SmartThemeBorderColor, #555);
            background-color: rgba(0,0,0,0.2);
            color: var(--SmartThemeBodyColor, #dcdcd2);
            margin-bottom: 10px;
        }

        #${PANEL_ID} textarea { min-height: 150px; resize: vertical; }
        #${PANEL_ID} .workflow-info { font-size: 0.9em; color: #aaa; margin-top: -5px; margin-bottom: 10px;}

        /* 通用按钮样式 (用于测试连接和聊天内生成按钮) */
        .comfy-button {
            padding: 8px 12px;
            border: 1px solid black;
            border-radius: 4px;
            cursor: pointer;
            background: linear-gradient(135deg, #171717);
            color: white;
            font-weight: 600;
            transition: opacity 0.3s, background 0.3s;
            flex-shrink: 0;
            font-size: 14px;
        }
        .comfy-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .comfy-button:hover:not(:disabled) { opacity: 0.85; }

        /* 按钮状态样式 */
        .comfy-button.testing { background: #555; }
        .comfy-button.success { background: linear-gradient(135deg, #28a745 0%, #218838 100%); }
        .comfy-button.error   { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); }

        /* 特殊布局样式 */
        #comfyui-test-conn { position: relative; top: -5px; }
        .comfy-url-container { display: flex; gap: 10px; align-items: center; }
        .comfy-url-container input { flex-grow: 1; margin-bottom: 0; }
        #${PANEL_ID} label { display: block; margin-bottom: 5px; font-weight: bold; }
        #options > .options-content > a#${BUTTON_ID} { display: flex; align-items: center; gap: 10px; }

        /* 标记输入框容器样式 */
        #${PANEL_ID} .comfy-tags-container {
            display: flex;
            gap: 10px;
            align-items: flex-end;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        #${PANEL_ID} .comfy-tags-container div { flex-grow: 1; }

        /* 聊天内按钮组容器 */
        .comfy-button-group {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            margin: 5px 4px;
        }

        /* 生成的图片容器样式 */
        .comfy-image-container {
            margin-top: 10px;
            max-width: 100%;
        }
        .comfy-image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            border: 1px solid var(--SmartThemeBorderColor, #555);
        }

        /* 移动端适配 */
        @media (max-width: 1000px) {
            #${PANEL_ID} {
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                max-height: calc(100vh - 40px);
                width: 95vw;
            }
        }
    `);

    function createComfyUIPanel() {
        if (document.getElementById(PANEL_ID)) return;
        const panelHTML = `
            <div id="${PANEL_ID}">
                <div class="panel-control-bar">
                    <i class="fa-fw fa-solid fa-grip drag-grabber"></i>
                    <b>ComfyUI 生图设置</b>
                    <i class="fa-fw fa-solid fa-circle-xmark floating_panel_close"></i>
                </div>
                <div class="comfyui-panel-content">
                    <label for="comfyui-url">ComfyUI URL</label>
                    <div class="comfy-url-container">
                        <input id="comfyui-url" type="text" placeholder="例如: http://127.0.0.1:8188">
                        <button id="comfyui-test-conn" class="comfy-button">测试连接</button>
                    </div>
                    <div class="comfy-tags-container">
                        <div>
                            <label for="comfyui-start-tag">开始标记</label>
                            <input id="comfyui-start-tag" type="text">
                        </div>
                        <div>
                            <label for="comfyui-end-tag">结束标记</label>
                            <input id="comfyui-end-tag" type="text">
                        </div>
                    </div>
                    <label for="comfyui-workflow">工作流 (JSON格式)</label>
                    <p class="workflow-info">请在您的工作流JSON中包含 <b>%prompt%</b> (必需) 和 <b>%seed%</b> (可选) 占位符。</p>
                    <textarea id="comfyui-workflow" placeholder="在此处粘贴您的ComfyUI工作流JSON..."></textarea>
                    <button id="comfyui-clear-cache" class="comfy-button error" style="margin-top: 15px; width: 100%;">删除所有图片缓存</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        initPanelLogic();
    }

    function initPanelLogic() {
        const panel = document.getElementById(PANEL_ID);
        const closeButton = panel.querySelector('.floating_panel_close');
        const testButton = document.getElementById('comfyui-test-conn');
        const clearCacheButton = document.getElementById('comfyui-clear-cache');
        const urlInput = document.getElementById('comfyui-url');
        const workflowInput = document.getElementById('comfyui-workflow');
        const startTagInput = document.getElementById('comfyui-start-tag');
        const endTagInput = document.getElementById('comfyui-end-tag');

        closeButton.addEventListener('click', () => { panel.style.display = 'none'; });

        if (typeof $ !== 'undefined' && typeof $.fn.draggable !== 'undefined') {
            $(`#${PANEL_ID}`).draggable({ handle: ".panel-control-bar", containment: "window" });
        }

        testButton.addEventListener('click', () => {
            let url = urlInput.value.trim();
            if (!url) {
                if (typeof toastr !== 'undefined') toastr.warning('请输入ComfyUI的URL。');
                return;
            }

            if (!url.startsWith('http://') && !url.startsWith('https://')) { url = 'http://' + url; }
            if (url.endsWith('/')) { url = url.slice(0, -1); }
            urlInput.value = url;

            const testUrl = url + '/system_stats';
            if (typeof toastr !== 'undefined') toastr.info('正在尝试连接 ComfyUI...');

            testButton.classList.remove('success', 'error');
            testButton.classList.add('testing');
            testButton.disabled = true;

            GM_xmlhttpRequest({
                method: "GET",
                url: testUrl,
                timeout: 5000,
                onload: (res) => {
                    testButton.disabled = false;
                    testButton.classList.remove('testing');
                    if (res.status === 200) {
                        testButton.classList.add('success');
                        if (typeof toastr !== 'undefined') toastr.success('连接成功！ComfyUI服务可用。');
                    } else {
                        testButton.classList.add('error');
                        if (typeof toastr !== 'undefined') toastr.error(`连接失败！服务器响应状态: ${res.status}`);
                    }
                },
                onerror: () => {
                    testButton.disabled = false;
                    testButton.classList.remove('testing');
                    testButton.classList.add('error');
                    if (typeof toastr !== 'undefined') toastr.error('连接错误！请检查URL、网络或CORS设置。');
                },
                ontimeout: () => {
                    testButton.disabled = false;
                    testButton.classList.remove('testing');
                    testButton.classList.add('error');
                    if (typeof toastr !== 'undefined') toastr.error('连接超时！ComfyUI服务可能没有响应。');
                }
            });
        });

        clearCacheButton.addEventListener('click', () => {
            if (confirm('您确定要删除所有已生成的图片缓存吗？\n此操作不可撤销，但不会删除您本地ComfyUI输出文件夹中的文件。')) {
                GM_setValue(STORAGE_KEY_IMAGES, {});
                if (typeof toastr !== 'undefined') toastr.success('所有图片缓存已成功删除！请刷新页面以更新显示。');
            }
        });

        loadSettings(urlInput, workflowInput, startTagInput, endTagInput);

        [urlInput, workflowInput, startTagInput, endTagInput].forEach(input => {
            input.addEventListener('input', () => {
                if(input === urlInput) testButton.classList.remove('success', 'error', 'testing');
                saveSettings(urlInput, workflowInput, startTagInput, endTagInput);
            });
        });
    }

    async function loadSettings(urlInput, workflowInput, startTagInput, endTagInput) {
        urlInput.value = await GM_getValue('comfyui_url', 'http://127.0.0.1:8188');
        workflowInput.value = await GM_getValue('comfyui_workflow', '');
        startTagInput.value = await GM_getValue('comfyui_start_tag', 'image###');
        endTagInput.value = await GM_getValue('comfyui_end_tag', '###');
    }

    async function saveSettings(urlInput, workflowInput, startTagInput, endTagInput) {
        await GM_setValue('comfyui_url', urlInput.value);
        await GM_setValue('comfyui_workflow', workflowInput.value);
        await GM_setValue('comfyui_start_tag', startTagInput.value);
        await GM_setValue('comfyui_end_tag', endTagInput.value);
    }

    function addMainButton() {
        if (document.getElementById(BUTTON_ID)) return;
        const optionsMenuContent = document.querySelector('#options .options-content');
        if (optionsMenuContent) {
             const continueButton = optionsMenuContent.querySelector('#option_continue');
             if (continueButton) {
                const comfyButton = document.createElement('a');
                comfyButton.id = BUTTON_ID;
                comfyButton.className = 'interactable';
                comfyButton.innerHTML = `<i class="fa-lg fa-solid fa-image"></i><span>ComfyUI生图</span>`;
                comfyButton.style.cursor = 'pointer';

                comfyButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    const panel = document.getElementById(PANEL_ID);
                    if (panel) { panel.style.display = 'flex'; }
                    document.getElementById('options').style.display = 'none';
                });
                continueButton.parentNode.insertBefore(comfyButton, continueButton.nextSibling);
             }
        }
    }


    // --- 聊天消息处理与图片生成 ---

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return 'comfy-id-' + Math.abs(hash).toString(36);
    }

    async function saveImageRecord(generationId, imageUrl) {
        const records = await GM_getValue(STORAGE_KEY_IMAGES, {});
        records[generationId] = imageUrl;
        await GM_setValue(STORAGE_KEY_IMAGES, records);
    }

    async function deleteImageRecord(generationId) {
        const records = await GM_getValue(STORAGE_KEY_IMAGES, {});
        delete records[generationId];
        await GM_setValue(STORAGE_KEY_IMAGES, records);
    }

    async function processMessageForComfyButton(messageNode) {
        const mesText = messageNode.querySelector('.mes_text');
        if (!mesText) return;

        const startTag = await GM_getValue('comfyui_start_tag', 'image###');
        const endTag = await GM_getValue('comfyui_end_tag', '###');
        if (!startTag || !endTag) return;

        const escapedStartTag = escapeRegex(startTag);
        const escapedEndTag = escapeRegex(endTag);
        const regex = new RegExp(escapedStartTag + '([\\s\\S]*?)' + escapedEndTag, 'g');
        const currentHtml = mesText.innerHTML;

        if (regex.test(currentHtml) && !mesText.querySelector('.comfy-button-group')) {
            mesText.innerHTML = currentHtml.replace(regex, (match, prompt) => {
                const cleanPrompt = prompt.trim();
                const encodedPrompt = cleanPrompt.replace(/"/g, '"');
                const generationId = simpleHash(cleanPrompt);
                return `<span class="comfy-button-group" data-generation-id="${generationId}">
                            <button class="comfy-button comfy-chat-generate-button" data-prompt="${encodedPrompt}">开始生成</button>
                        </span>`;
            });
        }

        const savedImages = await GM_getValue(STORAGE_KEY_IMAGES, {});
        const buttonGroups = mesText.querySelectorAll('.comfy-button-group');

        buttonGroups.forEach(group => {
            if (group.dataset.listenerAttached) return;

            const generationId = group.dataset.generationId;
            const generateButton = group.querySelector('.comfy-chat-generate-button');

            if (savedImages[generationId]) {
                displayImage(group, savedImages[generationId]);
                setupGeneratedState(generateButton, generationId);
            } else {
                generateButton.addEventListener('click', onGenerateButtonClick);
            }
            group.dataset.listenerAttached = 'true';
        });
    }

    function setupGeneratedState(generateButton, generationId) {
        generateButton.textContent = '重新生成';
        generateButton.disabled = false;
        generateButton.classList.remove('testing', 'success', 'error');

        // 确保重新生成事件已绑定
        if (!generateButton.dataset.regenerateListener) {
            generateButton.addEventListener('click', onGenerateButtonClick);
            generateButton.dataset.regenerateListener = 'true';
        }

        const group = generateButton.closest('.comfy-button-group');
        let deleteButton = group.querySelector('.comfy-delete-button');

        if (!deleteButton) {
            deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.className = 'comfy-button error comfy-delete-button';
            deleteButton.addEventListener('click', async () => {
                await deleteImageRecord(generationId);

                // 移除图片和删除按钮
                const imageContainer = group.nextElementSibling;
                if (imageContainer && imageContainer.classList.contains('comfy-image-container')) {
                    imageContainer.remove();
                }
                deleteButton.remove();

                // 恢复生成按钮初始状态
                generateButton.textContent = '开始生成';
                generateButton.disabled = false;
                generateButton.classList.remove('testing', 'success', 'error');
            });
            generateButton.insertAdjacentElement('afterend', deleteButton);
        }
    }


    async function onGenerateButtonClick(event) {
        const button = event.target.closest('.comfy-chat-generate-button');
        const group = button.closest('.comfy-button-group');
        const prompt = button.dataset.prompt;
        const generationId = group.dataset.generationId;

        button.textContent = '生成中...';
        button.disabled = true;
        button.classList.remove('success', 'error');
        button.classList.add('testing');

        // 移除旧的删除按钮和图片（如果是重新生成）
        const deleteButton = group.querySelector('.comfy-delete-button');
        if (deleteButton) deleteButton.style.display = 'none'; // 暂时隐藏
        const oldImageContainer = group.nextElementSibling;
        if (oldImageContainer && oldImageContainer.classList.contains('comfy-image-container')) {
            oldImageContainer.remove();
        }

        try {
            const url = (await GM_getValue('comfyui_url', '')).trim();
            let workflowString = await GM_getValue('comfyui_workflow', '');

            if (!url || !workflowString) throw new Error('ComfyUI URL 或工作流未配置。');
            if (!workflowString.includes('%prompt%')) throw new Error('工作流中未找到必需的 %prompt% 占位符。');

            const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            workflowString = workflowString.replace(/%prompt%/g, JSON.stringify(prompt).slice(1, -1));
            workflowString = workflowString.replace(/%seed%/g, seed);

            const workflow = JSON.parse(workflowString);

            const promptResponse = await sendPromptRequest(url, workflow);
            const promptId = promptResponse.prompt_id;
            if (!promptId) throw new Error('ComfyUI 未返回有效的 Prompt ID。');

            const finalHistory = await pollForResult(url, promptId);
            const imageUrl = findImageUrlInHistory(finalHistory, promptId, url);
            if (!imageUrl) throw new Error('在ComfyUI返回结果中未找到图片。');

            displayImage(group, imageUrl);
            await saveImageRecord(generationId, imageUrl); // 保存或覆盖记录

            button.textContent = '生成成功';
            button.classList.remove('testing');
            button.classList.add('success');

            setTimeout(() => {
                setupGeneratedState(button, generationId); // 设置为“重新生成”状态
                if (deleteButton) deleteButton.style.display = 'inline-flex'; // 恢复删除按钮
            }, 2000);

        } catch (e) {
            if (typeof toastr !== 'undefined') toastr.error(e.message);
            console.error('ComfyUI生图脚本错误:', e);
            button.textContent = '生成失败';
            button.classList.remove('testing');
            button.classList.add('error');

            setTimeout(() => {
                // 恢复到之前的状态（“重新生成”或“开始生成”）
                const wasRegenerating = !!group.querySelector('.comfy-delete-button');
                if (wasRegenerating) {
                    setupGeneratedState(button, generationId);
                    if (deleteButton) deleteButton.style.display = 'inline-flex';
                } else {
                     button.textContent = '开始生成';
                     button.disabled = false;
                     button.classList.remove('error');
                }
            }, 3000);
        }
    }

    function sendPromptRequest(url, workflow) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${url}/prompt`,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ prompt: workflow }),
                timeout: 10000,
                onload: (res) => {
                    if (res.status === 200) {
                        if (typeof toastr !== 'undefined') toastr.info('请求已发送至ComfyUI，排队中...');
                        resolve(JSON.parse(res.responseText));
                    } else {
                        reject(new Error(`ComfyUI API 错误 (Prompt): ${res.statusText || res.status}`));
                    }
                },
                onerror: () => reject(new Error('无法连接到 ComfyUI API。')),
                ontimeout: () => reject(new Error('连接 ComfyUI API 超时。')),
            });
        });
    }

    function pollForResult(url, promptId) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const poller = setInterval(() => {
                if (Date.now() - startTime > POLLING_TIMEOUT_MS) {
                    clearInterval(poller);
                    reject(new Error('轮询ComfyUI结果超时。'));
                    return;
                }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${url}/history/${promptId}`,
                    onload: (res) => {
                        if (res.status === 200) {
                            const history = JSON.parse(res.responseText);
                            if (history[promptId]) {
                                clearInterval(poller);
                                resolve(history);
                            }
                        } else {
                            clearInterval(poller);
                            reject(new Error(`轮询ComfyUI结果时出错: ${res.statusText || res.status}`));
                        }
                    },
                    onerror: () => {
                        clearInterval(poller);
                        reject(new Error('轮询ComfyUI结果时网络错误。'));
                    }
                });
            }, POLLING_INTERVAL_MS);
        });
    }

    function findImageUrlInHistory(history, promptId, baseUrl) {
        const outputs = history[promptId]?.outputs;
        if (!outputs) return null;

        for (const nodeId in outputs) {
            if (outputs.hasOwnProperty(nodeId) && outputs[nodeId].images) {
                const image = outputs[nodeId].images[0];
                if (image) {
                    const params = new URLSearchParams({
                        filename: image.filename,
                        subfolder: image.subfolder,
                        type: image.type
                    });
                    return `${baseUrl}/view?${params.toString()}`;
                }
            }
        }
        return null;
    }

    function displayImage(anchorElement, imageUrl) {
        // anchorElement现在是 .comfy-button-group
        let container = anchorElement.nextElementSibling;
        if (!container || !container.classList.contains('comfy-image-container')) {
            container = document.createElement('div');
            container.className = 'comfy-image-container';
            const img = document.createElement('img');
            img.alt = 'Generated by ComfyUI';
            container.appendChild(img);
            anchorElement.insertAdjacentElement('afterend', container);
        }
        container.querySelector('img').src = imageUrl;
    }


    // --- 主执行逻辑 ---
    createComfyUIPanel();

    const chatObserver = new MutationObserver((mutations) => {
        const nodesToProcess = new Set();
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('.mes')) nodesToProcess.add(node);
                    node.querySelectorAll('.mes').forEach(mes => nodesToProcess.add(mes));
                }
            });
            if (mutation.target.closest) {
                const mesNode = mutation.target.closest('.mes');
                if (mesNode) nodesToProcess.add(mesNode);
            }
        }
        nodesToProcess.forEach(processMessageForComfyButton);
    });

    function observeChat() {
        const chatElement = document.getElementById('chat');
        if (chatElement) {
            chatElement.querySelectorAll('.mes').forEach(processMessageForComfyButton);
            chatObserver.observe(chatElement, { childList: true, subtree: true, characterData: true });
        } else {
            setTimeout(observeChat, 500);
        }
    }

    const optionsObserver = new MutationObserver(() => {
        const optionsMenu = document.getElementById('options');
        if (optionsMenu && optionsMenu.style.display !== 'none') {
            addMainButton();
        }
    });

    window.addEventListener('load', () => {
        observeChat();
        const body = document.querySelector('body');
        if (body) {
            optionsObserver.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
        }
    });

})();