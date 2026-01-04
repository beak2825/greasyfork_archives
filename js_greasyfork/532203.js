// ==UserScript==
// @name         自动化助手
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  增加成功点击声音提示（可在设置中配置URL和开关），"修改元素"改为"设置"。
// @author       GLIM
// @match        *://*/*
// @icon         https://github.com/AEXFS/GLIM/raw/main/assets/06.png
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/532203/%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532203/%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 & 状态变量 ---
    let config = {
        containerXPath: GM_getValue('customContainerXPath') || "//div[2]/div/div[1]/div[3]",
        linkXPathRelativeToContainer: GM_getValue('customLinkXPathRel') || ".//a[contains(@class, 'css-5uoabp')]",
        buttonXPathInsideLink: GM_getValue('customButtonXPathRel') || ".//div//div[2]//div[contains(@class, 'css-k008qs')]",
        initialWaitDelay: 2000,
        clickDelay: 500,
        feedbackDuration: 500,
        // 新增音频配置
        successSoundUrl: GM_getValue('customSuccessSoundUrl') || '', // 默认无声音 URL
        isSoundEnabled: GM_getValue('customSoundEnabled', true) // 默认开启声音 (如果URL有效)
    };

    let isRunning = false;
    let scannedTokens = new Set();
    let clickQueue = [];
    let clickIntervalId = null;
    let observer = null;
    let initialWaitOver = false;
    let logData = [];
    let successAudio = null; // 用于缓存 Audio 对象

    // --- UI 元素 ---
    // 修改：addElementBtn -> settingsBtn
    let panel, startBtn, stopBtn, logBtn, detectBtn, settingsBtn;
    let logPanel, logTableBody, logCloseBtn, logExportBtn;
    // 修改：增加 soundUrlInput, soundEnableRadio, soundDisableRadio
    let settingsPanel, containerInput, linkRelInput, buttonRelInput, soundUrlInput, soundEnableRadio, soundDisableRadio, saveBtn, cancelSettingsBtn;

    // --- Helper 函数 (不变) ---
    function getElementByXPath(xpath, contextNode = document) { try { return document.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; } catch (e) { console.error(`Error evaluating XPath: ${xpath}`, e); addLog('Error', `XPath错误: ${xpath}`, '', e.message); return null; } }
    function getAllElementsByXPath(xpath, contextNode = document) { const result = []; try { const iterator = document.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null); let node = iterator.iterateNext(); while (node) { result.push(node); node = iterator.iterateNext(); } } catch (e) { console.error(`Error evaluating XPath (All): ${xpath}`, e); addLog('Error', `XPath错误 (All): ${xpath}`, '', e.message); } return result; }
    function extractTokenFromHref(href) { if (!href) return null; const match = href.match(/\/sol\/token\/([a-zA-Z0-9]+)/); return match ? match[1] : null; }
    function addLog(type, message, token = '', elementXPath = '') { const now = new Date(); const year = now.getFullYear(); const month = (now.getMonth() + 1).toString().padStart(2, '0'); const day = now.getDate().toString().padStart(2, '0'); const hours = now.getHours().toString().padStart(2, '0'); const minutes = now.getMinutes().toString().padStart(2, '0'); const seconds = now.getSeconds().toString().padStart(2, '0'); const milliseconds = now.getMilliseconds().toString().padStart(3, '0'); const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`; logData.push({ timestamp, type, message, token, elementXPath }); if (logData.length > 500) logData.shift(); if (logPanel && logPanel.style.display !== 'none') renderLogTable(); }
    function highlightElement(element, color, duration, useOutline = false) { if (!element || typeof element.style === 'undefined') return; const originalStyleProperty = useOutline ? 'outline' : 'border'; const originalStyleValue = element.style[originalStyleProperty]; const highlightStyle = `3px solid ${color}`; if (useOutline) { element.style.outline = highlightStyle; element.style.outlineOffset = '2px'; } else { element.style.border = highlightStyle; } element.style.transition = `${originalStyleProperty} 0.1s ease-in-out`; setTimeout(() => { if (element && typeof element.style !== 'undefined') { if (useOutline) { element.style.outline = originalStyleValue || ''; element.style.outlineOffset = ''; if (!originalStyleValue) element.style.removeProperty('outline'); } else { element.style.border = originalStyleValue || ''; if (!originalStyleValue) element.style.removeProperty('border'); } element.style.removeProperty('transition'); } }, duration); }

    // --- 新增：播放成功声音 ---
    function playSuccessSound() {
        if (!config.isSoundEnabled || !config.successSoundUrl) {
            return; // 如果声音关闭或URL为空，则不播放
        }

        try {
            // 尝试重用 Audio 对象，如果 URL 没变的话
            if (!successAudio || successAudio.src !== config.successSoundUrl) {
                console.log('Creating new Audio object for:', config.successSoundUrl);
                successAudio = new Audio(config.successSoundUrl);
                successAudio.onerror = () => {
                    console.error('Error loading success sound:', config.successSoundUrl);
                    addLog('Error', '加载成功提示音失败', '', config.successSoundUrl);
                    // 可以选择禁用声音或清空URL
                    // config.isSoundEnabled = false;
                    // config.successSoundUrl = '';
                    successAudio = null; // 重置以便下次尝试重新创建
                };
                successAudio.oncanplaythrough = () => {
                    console.log('Success sound loaded successfully.');
                    // 只有加载成功后才播放
                    successAudio.play().catch(e => {
                        console.error('Error playing success sound:', e);
                        addLog('Error', '播放成功提示音失败', '', e.message);
                    });
                };
                // 开始加载音频 (设置 src 会自动开始加载)
            } else if (successAudio.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
                // 如果音频已加载或部分加载，直接播放
                successAudio.currentTime = 0; // 从头开始播放
                successAudio.play().catch(e => {
                    console.error('Error playing cached success sound:', e);
                    addLog('Error', '播放缓存提示音失败', '', e.message);
                });
            } else {
                // 音频对象存在但仍在加载中，等待 oncanplaythrough 事件触发播放
                console.log('Success sound is still loading...');
            }

        } catch (error) {
            console.error('Error creating or playing audio:', error);
            addLog('Error', '创建或播放音频时出错', '', error.message);
        }
    }


    // --- 核心功能 ---
    function scanForNewLinks() { /* ...代码不变... */ if (!isRunning) return; console.log('Scanning for container with XPath:', config.containerXPath); const containerElement = getElementByXPath(config.containerXPath); if (!containerElement) { if (!initialWaitOver) { console.warn("Initial Scan: Container element not found with XPath:", config.containerXPath); addLog('Warning', '初始扫描：未找到容器元素', '', config.containerXPath); } return; } console.log('Scanning for links inside container with relative XPath:', config.linkXPathRelativeToContainer); const linkElements = getAllElementsByXPath(config.linkXPathRelativeToContainer, containerElement); let foundNewForQueue = 0; linkElements.forEach(linkElement => { const href = linkElement.getAttribute('href'); const token = extractTokenFromHref(href); if (token && !scannedTokens.has(token)) { scannedTokens.add(token); console.log(`New token recorded: ${token}`); addLog('Scan', '记录新链接Token', token, config.linkXPathRelativeToContainer); if (initialWaitOver) { const buttonElement = getElementByXPath(config.buttonXPathInsideLink, linkElement); if (buttonElement) { foundNewForQueue++; console.log(`Button found for new token ${token} (after wait), adding to queue:`, buttonElement); clickQueue.push({ button: buttonElement, token: token, linkElement: linkElement }); addLog('Queue', '新按钮加入点击队列', token, config.buttonXPathInsideLink); } else { console.warn(`Button not found for new token ${token} (after wait) using relative XPath: ${config.buttonXPathInsideLink}`, linkElement); addLog('Warning', '(等待后)新链接未找到按钮', token, config.buttonXPathInsideLink); } } } else if (token && scannedTokens.has(token)) { /* Seen */ } else if (!token && href) { console.warn('Could not extract token from href:', href, 'for element:', linkElement); addLog('Warning', '无法从href提取token', '', config.linkXPathRelativeToContainer + ` (href: ${href})`); } }); if (!initialWaitOver) { console.log(`Initial baseline scan complete. Recorded ${scannedTokens.size} unique tokens.`); addLog('Info', `初始基线扫描完成，记录 ${scannedTokens.size} 个 Token`); } else { console.log(`Scan complete inside container. Found ${linkElements.length} links, added ${foundNewForQueue} new buttons to queue.`); addLog('Info', `容器内扫描结束，发现 ${linkElements.length} 个链接, ${foundNewForQueue} 个新按钮入队`); } }

    // Process Click Queue (修改点：成功后调用 playSuccessSound)
    function processClickQueue() {
        if (!isRunning || clickQueue.length === 0) { clickIntervalId = null; console.log("Click queue processed or script stopped."); addLog('Info', '点击队列处理完成或停止'); return; }
        const item = clickQueue.shift(); const { button, token, linkElement } = item; console.log(`Processing click for token: ${token}`); addLog('Click', '准备点击按钮', token, config.buttonXPathInsideLink); highlightElement(button, 'orange', config.feedbackDuration);
        try {
            button.click();
            addLog('Click Action', '执行点击操作', token);
            // 成功反馈
            setTimeout(() => {
                highlightElement(button, 'lime', config.feedbackDuration);
                addLog('Success', '按钮点击成功（模拟）', token);
                // --- 调用播放声音 ---
                playSuccessSound();
                // --- 结束调用 ---
            }, config.feedbackDuration);
        } catch (clickError) {
            console.error(`Error clicking button for token ${token}:`, clickError);
            addLog('Error', '按钮点击时出错', token, clickError.message);
        }
        // 调度下一次点击 (不变)
        if (isRunning && clickQueue.length > 0) { if (clickIntervalId) clearTimeout(clickIntervalId); clickIntervalId = setTimeout(processClickQueue, config.clickDelay); console.log(`Scheduled next click process in ${config.clickDelay}ms`); }
        else { clickIntervalId = null; console.log("Last item processed or script stopped, clearing click interval."); if(isRunning && clickQueue.length === 0) addLog('Info', '当前点击队列已处理完毕'); }
    }


    // --- 启动与停止 (不变) ---
    function startProcess() { if (isRunning) return; isRunning = true; initialWaitOver = false; startBtn.disabled = true; stopBtn.disabled = false; addLog('Info', '脚本启动'); console.log('Script Started'); scannedTokens.clear(); clickQueue = []; if (clickIntervalId) { clearTimeout(clickIntervalId); clickIntervalId = null; } addLog('Info', '执行初始基线扫描 (记录现有元素)...'); scanForNewLinks(); addLog('Info', `等待 ${config.initialWaitDelay / 1000} 秒后开始监听并处理新出现的元素...`); setTimeout(() => { if (!isRunning) return; initialWaitOver = true; addLog('Info', '等待结束，启动 DOM 监听器，开始处理新元素...'); console.log('Initial wait finished. Starting MutationObserver. Ready to process new items.'); const observerConfig = { childList: true, subtree: true }; observer = new MutationObserver(handleDOMChanges); try { const containerToObserve = getElementByXPath(config.containerXPath); if (containerToObserve) { observer.observe(containerToObserve, observerConfig); addLog('Info', `DOM监听器已启动 (监听指定容器)`); console.log(`MutationObserver started on specific container:`, containerToObserve); } else { observer.observe(document.body, observerConfig); addLog('Warning', `无法找到指定容器 (${config.containerXPath})，DOM监听器将监听整个页面`); console.warn(`Could not find specified container (${config.containerXPath}). MutationObserver watching document body instead.`); } } catch (e) { console.error("Failed to start MutationObserver:", e); addLog('Error', '无法启动DOM监听器', '', e.message); stopProcess(); return; } }, config.initialWaitDelay); }
    function handleDOMChanges(mutationsList, obs) { if (!isRunning || !initialWaitOver) return; let addedNodes = false; for(const mutation of mutationsList) { if (mutation.type === 'childList' && mutation.addedNodes.length > 0) { for (const addedNode of mutation.addedNodes) { if (addedNode.nodeType === Node.ELEMENT_NODE && !addedNode.id?.startsWith('scanner-')) { addedNodes = true; break; } } } if (addedNodes) break; } if (addedNodes) { console.log("DOM change detected (node added), rescanning for *new* items..."); addLog('Info', '检测到DOM变化，扫描新元素...'); scanForNewLinks(); if (clickQueue.length > 0 && !clickIntervalId) { addLog('Info', '扫描到新按钮且点击空闲，开始处理点击...'); console.log('New buttons found and click process is idle. Starting clicks.'); processClickQueue(); } else if (clickQueue.length > 0 && clickIntervalId) { console.log('New buttons added to queue while click process is active.'); addLog('Info', '扫描到新按钮，已加入活动点击队列'); } } }
    function stopProcess() { if (!isRunning) return; isRunning = false; initialWaitOver = false; startBtn.disabled = false; stopBtn.disabled = true; if (clickIntervalId) { clearTimeout(clickIntervalId); clickIntervalId = null; addLog('Info', '点击定时器已清除'); } if (observer) { observer.disconnect(); observer = null; console.log("MutationObserver stopped."); addLog('Info', 'DOM监听器已停止'); } clickQueue = []; addLog('Info', '脚本停止'); console.log('Script Stopped'); }

    // --- 检测功能 (不变) ---
    function detectElements() { const currentContainerXPath = config.containerXPath; const currentLinkXPathRel = config.linkXPathRelativeToContainer; const currentButtonXPathRel = config.buttonXPathInsideLink; addLog('Detect', '开始检测当前配置的元素 (容器 -> 链接 -> 按钮)...'); console.log('Detecting elements using current configuration...'); alert(`将尝试高亮显示【当前配置】的三个XPath对应的元素：\n1. 容器 (蓝色轮廓): ${currentContainerXPath}\n2. 容器内链接 (红色边框): ${currentLinkXPathRel}\n3. 首个链接内按钮 (深红边框): ${currentButtonXPathRel}`); let foundContainer = false; let foundLinksCount = 0; let foundButtonsInFirstLink = false; try { const containerElement = getElementByXPath(currentContainerXPath); if (containerElement) { foundContainer = true; addLog('Detect', '检测到容器元素', '', currentContainerXPath); console.log('Container element found:', containerElement); highlightElement(containerElement, 'blue', 2000, true); const linkElements = getAllElementsByXPath(currentLinkXPathRel, containerElement); foundLinksCount = linkElements.length; addLog('Detect', `在容器内检测到 ${foundLinksCount} 个链接元素`, '', currentLinkXPathRel); console.log(`Detected ${foundLinksCount} link elements inside container using relative XPath: ${currentLinkXPathRel}`); if (foundLinksCount === 0) console.warn("No link elements found inside the container with current relative XPath."); linkElements.forEach((el, index) => { highlightElement(el, 'red', 2000); console.log(`Highlighting link element ${index + 1} inside container:`, el); if (index === 0) { try { const buttonElements = getAllElementsByXPath(currentButtonXPathRel, el); if (buttonElements.length > 0) { foundButtonsInFirstLink = true; addLog('Detect', `在首个链接内检测到 ${buttonElements.length} 个按钮元素`, '', currentButtonXPathRel); console.log(`Found ${buttonElements.length} button elements inside the first link using relative XPath: ${currentButtonXPathRel}`, buttonElements); buttonElements.forEach(btn => { highlightElement(btn, 'darkred', 2000); console.log(`Highlighting button element inside first link:`, btn); }); } else { addLog('Detect', '在首个链接内未检测到按钮元素', '', currentButtonXPathRel); console.warn("No button elements found inside the first link with current relative XPath."); } } catch (buttonError) { console.error("Error detecting button elements inside the first link:", buttonError); addLog('Error', '检测按钮时出错', '', buttonError.message); } } }); } else { addLog('Warning', '未检测到容器元素', '', currentContainerXPath); console.warn("Container element not found with XPath:", currentContainerXPath); } } catch (containerError) { console.error("Error detecting container element:", containerError); addLog('Error', '检测容器时出错', '', containerError.message); alert(`检测容器 XPath (${currentContainerXPath}) 时出错: ${containerError.message}\n请检查控制台获取详细信息。`); return; } setTimeout(() => { let message = `检测完成 (基于当前配置)。\n`; if (foundContainer) { message += `✅ 容器找到。\n   内含 ${foundLinksCount} 个链接。\n`; if (foundLinksCount > 0) { message += `   首个链接内 ${foundButtonsInFirstLink ? '✅ 找到按钮。' : '❌ 未找到按钮。'}\n`; } } else { message += `❌ 容器未找到。\n`; } message += `(高亮应已消失)`; alert(message); console.log("Detection complete using current configuration."); }, 2100); }

    // --- UI 创建与管理 ---
    // Create Panel (修改点：按钮文字)
    function createPanel() {
        panel = document.createElement('div'); panel.id = 'auto-scanner-panel';
        // 修改初始位置为右下角
        panel.style.position = 'fixed';panel.style.bottom = '20px';panel.style.right = '20px';panel.style.zIndex = '99999'; // 确保在最上层
        panel.innerHTML = `
            <div id="scanner-panel-header" style="cursor: move; background-color: #333; color: white; padding: 5px; text-align: center; border-bottom: 1px solid #555;">自动化助手</div>
            <div style="padding: 10px;">
                <button id="scanner-start" style="margin: 5px;">启动</button>
                <button id="scanner-stop" style="margin: 5px;" disabled>停止</button>
                <button id="scanner-log" style="margin: 5px;">日志</button>
                <button id="scanner-detect" style="margin: 5px;">检测</button>
                <button id="scanner-settings" style="margin: 5px;">设置</button> <!-- 修改文字 -->
            </div>
        `;
        document.body.appendChild(panel);
        startBtn = document.getElementById('scanner-start'); stopBtn = document.getElementById('scanner-stop'); logBtn = document.getElementById('scanner-log'); detectBtn = document.getElementById('scanner-detect');
        settingsBtn = document.getElementById('scanner-settings'); // 获取新按钮引用
        startBtn.onclick = startProcess; stopBtn.onclick = stopProcess; logBtn.onclick = toggleLogPanel; detectBtn.onclick = detectElements;
        settingsBtn.onclick = showSettingsPanel; // 绑定打开设置面板函数

        // 拖动功能 (不变)
        const header = document.getElementById('scanner-panel-header'); let isDragging = false; let offsetX, offsetY; header.addEventListener('mousedown', (e) => { isDragging = true; offsetX = e.clientX - panel.getBoundingClientRect().left; offsetY = e.clientY - panel.getBoundingClientRect().top; panel.style.userSelect = 'none'; header.style.cursor = 'grabbing'; }); document.addEventListener('mousemove', (e) => { if (!isDragging) return;const newRight = document.documentElement.clientWidth - e.clientX - offsetX; const newBottom = document.documentElement.clientHeight - e.clientY - offsetY; panel.style.right = `${newRight}px`;panel.style.bottom = `${newBottom}px`; }); document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; panel.style.userSelect = ''; header.style.cursor = 'move'; } });
    }
    function createLogPanel() { /* ...代码不变, 已包含导出按钮... */ if (logPanel) return; logPanel = document.createElement('div'); logPanel.id = 'scanner-log-panel'; logPanel.style.display = 'none'; logPanel.innerHTML = `<div id="scanner-log-header" style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px;"><span style="font-weight: bold;">运行日志</span><div><button id="scanner-log-export" style="cursor: pointer; padding: 2px 5px; margin-right: 10px;">导出日志 (JSON)</button><button id="scanner-log-close" style="cursor: pointer; padding: 2px 5px;">关闭</button></div></div><div style="max-height: 300px; overflow-y: auto; padding: 5px;"><table id="scanner-log-table" style="width: 100%; border-collapse: collapse;"><thead><tr><th>时间</th><th>类型</th><th>消息</th><th>Token</th></tr></thead><tbody id="scanner-log-table-body"></tbody></table></div>`; document.body.appendChild(logPanel); logTableBody = document.getElementById('scanner-log-table-body'); logCloseBtn = document.getElementById('scanner-log-close'); logExportBtn = document.getElementById('scanner-log-export'); logCloseBtn.onclick = toggleLogPanel; logExportBtn.onclick = exportLog; }
    function renderLogTable() { /* ...代码不变, 样式由CSS控制... */ if (!logTableBody) return; logTableBody.innerHTML = ''; const logsToDisplay = logData; logsToDisplay.forEach(entry => { const row = logTableBody.insertRow(); row.innerHTML = `<td title="${entry.timestamp}">${entry.timestamp}</td><td>${entry.type}</td><td title="${entry.elementXPath || ''}">${entry.message}</td><td style="word-break: break-all;">${entry.token || '-'}</td>`; }); if (logTableBody.parentNode) logTableBody.parentNode.scrollTop = logTableBody.parentNode.scrollHeight; }
    function toggleLogPanel() { /* ...代码不变... */ if (!logPanel) createLogPanel();
                               const isHidden = logPanel.style.display === 'none';
                               logPanel.style.display = isHidden ? 'block' : 'none';
                               if (isHidden && panel) {
                                   const panelRect = panel.getBoundingClientRect();
                                   panel.style.left = 'auto'; // 显式清除左侧定位
                                   panel.style.top = 'auto'; // 显式清除顶部定位
                                   panel.style.right = '20px'; // 初始显示在右下角
                                   panel.style.bottom = '20px';
                                   panel.style.zIndex = '99999';
                                   // 修复：日志面板显示在主面板右侧
                                   logPanel.style.position = 'fixed';
                                   logPanel.style.right = `${window.innerWidth - panelRect.right - 10}px`; // 主面板右侧 + 10px 间距
                                   logPanel.style.bottom = '20px';
                               }
                              }
    // --- 新增：导出日志功能 ---
    function exportLog() {
        try {
            const logDataStr = JSON.stringify(logData, null, 2);
            const blob = new Blob([logDataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `auto-scanner-logs_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            addLog('Info', '日志已导出为JSON文件');
        } catch (e) {
            console.error('Error exporting logs:', e);
            addLog('Error', '导出日志时出错', '', e.message);
            alert('导出日志时出错: ' + e.message);
        }
    }
    // Create Settings Panel (原 createAddElementPanel, 修改点：添加音频设置)
    function createSettingsPanel() {
        if (settingsPanel) return;
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'scanner-settings-panel'; // 重命名 ID
        settingsPanel.style.display = 'none';
        settingsPanel.innerHTML = `
             <div id="settings-panel-header" style="cursor: default; background-color: #333; color: white; padding: 5px; text-align: center; border-bottom: 1px solid #555;">设置</div>
             <div style="padding: 15px;">
                 <h4>元素 XPath 配置</h4>
                 <div style="margin-bottom: 10px;">
                     <label for="scanner-container-xpath">容器 XPath:</label>
                     <input type="text" id="scanner-container-xpath" title="包含动态链接的稳定父元素">
                 </div>
                 <div style="margin-bottom: 10px;">
                     <label for="scanner-link-rel-xpath">链接 XPath (相对容器):</label>
                     <input type="text" id="scanner-link-rel-xpath" title="例如：.//a[contains(@class,'some-class')]">
                     <small>使用 './/' 开头表示相对路径</small>
                 </div>
                 <div style="margin-bottom: 15px;"> <!-- Add margin bottom -->
                     <label for="scanner-button-rel-xpath">按钮 XPath (相对链接):</label>
                     <input type="text" id="scanner-button-rel-xpath" title="例如：.//div[contains(@class,'click-button')]">
                     <small>使用 './/' 开头表示相对路径</small>
                 </div>

                 <hr style="border-color: #555; margin: 15px 0;"> <!-- Separator -->

                 <h4>声音提示</h4>
                 <div style="margin-bottom: 10px;">
                      <label for="scanner-sound-url">成功提示音 URL (ACC/MP3等):</label>
                      <input type="text" id="scanner-sound-url" placeholder="粘贴音频文件链接..." title="留空则不播放声音">
                 </div>
                 <div>
                      <label>提示音开关:</label>
                      <input type="radio" id="scanner-sound-enable" name="sound_switch" value="enable" style="margin-left: 10px;">
                      <label for="scanner-sound-enable" style="margin-right: 15px;">开启</label>
                      <input type="radio" id="scanner-sound-disable" name="sound_switch" value="disable">
                      <label for="scanner-sound-disable">关闭</label>
                 </div>

                 <hr style="border-color: #555; margin: 15px 0;">

                 <div>
                     <button id="scanner-save-settings" style="margin-right: 10px;">保存设置</button> <!-- 修改按钮文字和ID -->
                     <button id="scanner-cancel-settings">取消</button> <!-- 修改按钮ID -->
                 </div>
             </div>
         `;
        document.body.appendChild(settingsPanel);

        // 获取所有输入框和按钮的引用
        containerInput = document.getElementById('scanner-container-xpath');
        linkRelInput = document.getElementById('scanner-link-rel-xpath');
        buttonRelInput = document.getElementById('scanner-button-rel-xpath');
        soundUrlInput = document.getElementById('scanner-sound-url'); // 新增
        soundEnableRadio = document.getElementById('scanner-sound-enable'); // 新增
        soundDisableRadio = document.getElementById('scanner-sound-disable'); // 新增
        saveBtn = document.getElementById('scanner-save-settings'); // 修改ID
        cancelSettingsBtn = document.getElementById('scanner-cancel-settings'); // 修改ID

        saveBtn.onclick = saveSettings; // 绑定新函数名
        cancelSettingsBtn.onclick = hideSettingsPanel; // 绑定新函数名
    }

    // Show Settings Panel (原 showAddElementPanel, 修改点：加载所有设置)
    function showSettingsPanel() {
        if (!settingsPanel) createSettingsPanel();
        // 加载 XPath
        containerInput.value = config.containerXPath;
        linkRelInput.value = config.linkXPathRelativeToContainer;
        buttonRelInput.value = config.buttonXPathInsideLink;
        // 加载音频设置
        soundUrlInput.value = config.successSoundUrl;
        if (config.isSoundEnabled) {
            soundEnableRadio.checked = true;
        } else {
            soundDisableRadio.checked = true;
        }

        settingsPanel.style.display = 'block';
        const panelRect = panel.getBoundingClientRect();
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.bottom = '20px'; // 固定在底部
        settingsPanel.style.right = `${panel.offsetWidth + 30}px`; // 在主面板左侧
    }

    // Hide Settings Panel (原 hideAddElementPanel)
    function hideSettingsPanel() {
        if (settingsPanel) settingsPanel.style.display = 'none';
    }

    // Save Settings (原 saveCustomXPaths, 修改点：保存所有设置)
    function saveSettings() {
        // 读取 XPath
        const newContainerXPath = containerInput.value.trim();
        const newLinkRelXPath = linkRelInput.value.trim();
        const newButtonRelXPath = buttonRelInput.value.trim();
        // 读取音频设置
        const newSoundUrl = soundUrlInput.value.trim();
        const newSoundEnabled = soundEnableRadio.checked; // true if 'Enable' is checked

        // 验证 XPath (至少不能为空)
        if (!newContainerXPath || !newLinkRelXPath || !newButtonRelXPath) {
            alert('所有三个 XPath 不能为空！'); return;
        }
        // 验证 XPath 语法 (简单)
        try {
            document.evaluate(newContainerXPath, document, null, XPathResult.ANY_TYPE, null);
            const tempDiv = document.createElement('div');
            document.evaluate(newLinkRelXPath, tempDiv, null, XPathResult.ANY_TYPE, null);
            document.evaluate(newButtonRelXPath, tempDiv, null, XPathResult.ANY_TYPE, null);
        } catch(e) { alert(`XPath 格式似乎无效: ${e.message}\n请检查所有 XPath 语法。`); return; }

        // 更新内存中的 config 对象
        config.containerXPath = newContainerXPath;
        config.linkXPathRelativeToContainer = newLinkRelXPath;
        config.buttonXPathInsideLink = newButtonRelXPath;
        config.successSoundUrl = newSoundUrl;
        config.isSoundEnabled = newSoundEnabled;
        console.log('Configuration object updated in memory:', config);

        // 持久化保存
        GM_setValue('customContainerXPath', newContainerXPath);
        GM_setValue('customLinkXPathRel', newLinkRelXPath);
        GM_setValue('customButtonXPathRel', newButtonRelXPath);
        GM_setValue('customSuccessSoundUrl', newSoundUrl);
        GM_setValue('customSoundEnabled', newSoundEnabled);
        addLog('Config', 'XPath 和音频设置已更新并保存');

        // 如果保存时 URL 变了，清除缓存的 Audio 对象
        if (successAudio && successAudio.src !== newSoundUrl) {
            successAudio = null;
            console.log('Sound URL changed, cleared cached Audio object.');
        }


        alert('设置已保存！将在下次启动或检测时生效（声音设置即时生效）。');
        hideSettingsPanel();

        if (isRunning) {
            addLog('Info', '脚本正在运行，建议停止并重新启动以确保 XPath 设置完全生效');
            alert('脚本当前正在运行。\n为了确保新的 XPath 设置完全生效（特别是对于 DOM 监听范围），建议先【停止】脚本，然后再【启动】。');
        }
    }


    // --- 样式 (修改点：增加 settings panel 样式, 调整 radio 样式) ---
    function addStyles() {
        GM_addStyle(`
            /* --- 主面板样式 (不变) --- */
            #auto-scanner-panel { resize: none; /* 禁用调整大小 */ position: fixed !important; bottom: 20px;  right: 20px; background-color: #444; border: 1px solid #666; border-radius: 5px; z-index: 99999;  color: white; box-shadow: 3px 3px 8px rgba(0,0,0,0.5); font-family: sans-serif;  font-size: 14px; min-width: 250px; }            #auto-scanner-panel button { padding: 5px 10px; cursor: pointer; border: 1px solid #ccc; border-radius: 3px; background-color: #555; color: white; margin: 5px 3px; }
            #auto-scanner-panel button:disabled { cursor: not-allowed; opacity: 0.5; background-color: #777; }
            #auto-scanner-panel button:hover:not(:disabled) { background-color: #666; }

            /* --- 设置面板样式 (原 #scanner-add-element-panel) --- */
            #scanner-settings-panel { /* 修改 ID */
                background-color: #444; border: 1px solid #666; border-radius: 5px; z-index: 9998; color: white; box-shadow: 3px 3px 8px rgba(0,0,0,0.5); font-family: sans-serif; font-size: 14px; width: 400px; /* 可能需要加宽 */
            }
            #settings-panel-header { /* 修改 ID */
                 cursor: default; background-color: #333; color: white; padding: 5px; text-align: center; border-bottom: 1px solid #555;
            }
             #scanner-settings-panel h4 { /* Settings section titles */
                 margin-top: 0;
                 margin-bottom: 8px;
                 color: #eee;
                 border-bottom: 1px solid #555;
                 padding-bottom: 3px;
             }
            #scanner-settings-panel label { /* Labels for inputs */
                display: block; /* Make labels take full width */
                margin-bottom: 3px;
                color: white; font-size: 0.9em;
            }
             #scanner-settings-panel label[for^="scanner-sound-"] { /* Labels for radio buttons */
                 display: inline-block; /* Keep radios side-by-side with labels */
                 margin-bottom: 0;
                 margin-right: 5px; /* Space before radio */
                 vertical-align: middle;
             }
            #scanner-settings-panel small { color: #ccc; font-size: 0.8em; }
            #scanner-settings-panel input[type="text"] {
                 width: 95%; padding: 5px; margin-top: 2px; background-color: #555; color: white; border: 1px solid #777; border-radius: 3px; display: block; /* Ensure full width */ margin-bottom: 5px; /* Space below input */
            }
            #scanner-settings-panel input[type="radio"] {
                 vertical-align: middle;
                 margin-right: 3px; /* Space after radio */
            }
            #scanner-settings-panel button { padding: 5px 10px; cursor: pointer; border: 1px solid #ccc; border-radius: 3px; background-color: #555; color: white; margin-top: 10px; /* Increase top margin for save/cancel */ }
            #scanner-settings-panel button:hover { background-color: #666; }

            /* --- 日志面板样式 (不变) --- */
            #scanner-log-panel { max-width: 600px;width: calc(100vw - 40px); /* 适配小屏幕 */ background-color: #444; border: 1px solid #666; border-radius: 5px; z-index: 9997; box-shadow: 2px 2px 5px rgba(0,0,0,0.3); color: white; font-size: 12px; display: flex; flex-direction: column; }
            #scanner-log-header { background-color: #333; border-bottom: 1px solid #555; color: white; }
            #scanner-log-panel button { background-color: #555; color: white; border: 1px solid #ccc; border-radius: 3px; padding: 2px 5px; }
            #scanner-log-panel button:hover { background-color: #666; }
            #scanner-log-table { border-collapse: collapse; width: 100%; }
            #scanner-log-table th { background-color: #555; border: 1px solid #777; padding: 4px; text-align: left; font-weight: bold; color: white; }
            #scanner-log-table td { border: 1px solid #666; padding: 4px; font-size: 0.8em; color: #ddd; vertical-align: top; }
            #scanner-log-table tbody tr:nth-child(odd) { background-color: #4f4f4f; }
            #scanner-log-table tbody tr:nth-child(even) { background-color: #444; }
            #scanner-log-table tr td:nth-child(2):contains('Error'), #scanner-log-table tr td:nth-child(2):contains('Warning') { background-color: #603030 !important; color: #ffdddd !important; }
            #scanner-log-table tr td:nth-child(2):contains('Success') { background-color: #306030 !important; color: #ddffdd !important; }
            #scanner-log-table tr td:nth-child(2):contains('Info'), /* ... other types ... */ { color: #ddeeff !important; }
            #scanner-log-panel div[style*="overflow-y: auto"]::-webkit-scrollbar { max-height: 50vh; width: 8px; } #scanner-log-panel div[style*="overflow-y: auto"]::-webkit-scrollbar-track { background: #333; } #scanner-log-panel div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb { background-color: #666; border-radius: 4px; border: 2px solid #333; }
        `);
    }

    // --- 初始化 (不变) ---
    function init() { console.log('Initializing Auto Scanner Script v1.9...'); addStyles(); createPanel(); addLog('Info', '脚本界面已加载');
                     // 添加窗口大小变化时的位置调整
                     window.addEventListener('resize', function() {
                         if (panel) {
                             panel.style.right = '20px';
                             panel.style.bottom = '20px';
                         }
                     });
                    }

    // --- 等待页面加载完成 (不变) ---
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

})();