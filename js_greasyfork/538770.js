// ==UserScript==
// @name         天翼云盘批量账号容量获取
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  批量导入天翼云盘账号，自动切换到密码登录，手动登录后自动获取容量，支持刷新保留进度，美观UI与开关功能，提供一键复制账号密码，优化操作流程，移除强制弹窗，并增加错误结果清理与失败账号重试功能。
// @author       ChatGPT
// @match        https://cloud.189.cn/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      cloud.189.cn
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538770/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E8%B4%A6%E5%8F%B7%E5%AE%B9%E9%87%8F%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/538770/%E5%A4%A9%E7%BF%BC%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E8%B4%A6%E5%8F%B7%E5%AE%B9%E9%87%8F%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // UI 样式
    GM_addStyle(`
        /* Panel Toggle Button */
        #tyyp_toggle_btn {
            position: fixed;
            top: 15px;
            left: 15px;
            width: 40px;
            height: 40px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 100000;
            transition: background-color 0.3s ease, transform 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        #tyyp_toggle_btn:hover {
            background-color: #0056b3;
            transform: scale(1.05);
        }
        #tyyp_toggle_btn .icon-open::before { content: '🚀'; }
        #tyyp_toggle_btn .icon-close::before { content: '❌'; }


        /* Main Panel Styles */
        #tyyp_batch_panel {
            position: fixed;
            top: 65px;
            left: 15px;
            width: 450px;
            max-height: calc(100vh - 80px);
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            z-index: 99999;
            padding: 20px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            overflow-y: auto;
            box-sizing: border-box;
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 1;
            transform: translateY(0);
        }
        #tyyp_batch_panel.hidden {
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
        }

        #tyyp_batch_panel h3 {
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 22px;
            color: #333;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
            text-align: center;
            font-weight: 600;
        }
        #tyyp_batch_panel label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #444;
            font-size: 15px;
        }
        #tyyp_batch_panel textarea {
            width: calc(100% - 20px);
            min-height: 120px;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #d0d0d0;
            border-radius: 6px;
            font-size: 14px;
            resize: vertical;
            line-height: 1.5;
            box-sizing: border-box;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        #tyyp_batch_panel button {
            background-color: #28a745;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            margin-right: 12px;
            transition: background-color 0.2s ease, transform 0.1s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        #tyyp_batch_panel button:hover {
            background-color: #218838;
            transform: translateY(-1px);
        }
        #tyyp_batch_panel button:active {
            transform: translateY(0);
        }
        #tyyp_batch_panel button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            box-shadow: none;
        }
        #tyyp_batch_panel #status {
            margin-top: 20px;
            padding: 12px;
            border: 1px solid #cfe2ff;
            border-left: 5px solid #007bff;
            border-radius: 6px;
            background-color: #e7f0ff;
            color: #004085;
            min-height: 35px;
            word-break: break-word;
            font-size: 14px;
            line-height: 1.5;
        }
        #tyyp_batch_panel #status.error {
            border-color: #f5c6cb;
            border-left-color: #dc3545;
            background-color: #f8d7da;
            color: #721c24;
        }
        #tyyp_batch_panel #currentAccountInfo {
            font-weight: 600;
            color: #007bff;
            margin-bottom: 12px;
            font-size: 15px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        #tyyp_batch_panel #currentAccountText {
            flex-shrink: 0;
        }
        #tyyp_batch_panel #copyBtnsContainer {
             display: flex;
             gap: 8px;
             flex-grow: 1;
             flex-wrap: wrap;
             justify-content: flex-end;
        }
        #tyyp_batch_panel .copy-btn {
            padding: 5px 10px;
            font-size: 13px;
            background-color: #6c757d;
            margin-right: 0 !important;
        }
        #tyyp_batch_panel .copy-btn:hover {
            background-color: #5a6268;
        }

        #tyyp_batch_panel .btn-group {
            margin-top: 15px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }
        #tyyp_batch_panel .btn-group button {
            flex-grow: 1;
            min-width: 150px;
            margin-right: 0;
        }
        #tyyp_batch_panel #tyyp_start {
            background-color: #007bff;
        }
        #tyyp_batch_panel #tyyp_start:hover {
            background-color: #0056b3;
        }
        #tyyp_batch_panel #tyyp_btnConfirmLogin {
            background-color: #ffc107;
            color: #333;
        }
        #tyyp_batch_panel #tyyp_btnConfirmLogin:hover {
            background-color: #e0a800;
        }
        #tyyp_batch_panel #tyyp_btnNextAccount {
            background-color: #17a2b8;
        }
        #tyyp_batch_panel #tyyp_btnNextAccount:hover {
            background-color: #138496;
        }
        #tyyp_batch_panel #tyyp_reset {
            background-color: #dc3545;
        }
        #tyyp_batch_panel #tyyp_reset:hover {
            background-color: #c82333;
        }
        #tyyp_batch_panel #tyyp_clearErrors, #tyyp_reprocessFailed {
            background-color: #6f42c1; /* Purple for error management */
            color: white;
        }
        #tyyp_batch_panel #tyyp_clearErrors:hover, #tyyp_reprocessFailed:hover {
            background-color: #5b36a1;
        }
    `);

    let accounts = [];
    let currentIndex = 0;
    let resultData = [];
    let currentAccount = '';
    let currentPassword = '';

    const GM_KEY_RESULTS = 'tyyp_batch_results';
    const GM_KEY_ACCOUNTS = 'tyyp_batch_accounts';
    const GM_KEY_PANEL_HIDDEN = 'tyyp_panel_hidden';

    let panel, inputTextArea, outputTextArea, startButton, btnConfirmLogin, btnNextAccount, btnReset, statusDiv, currentAccountInfoDiv, currentAccountTextSpan, copyBtnsContainer, copyAccountBtn, copyPasswordBtn, toggleButton, btnClearErrors, btnReprocessFailed;

    function createUI() {
        toggleButton = document.createElement('button');
        toggleButton.id = 'tyyp_toggle_btn';
        toggleButton.innerHTML = '<span class="icon-open"></span>';
        document.body.appendChild(toggleButton);

        panel = document.createElement('div');
        panel.id = 'tyyp_batch_panel';
        document.body.appendChild(panel);

        panel.innerHTML = `
            <h3>天翼云盘批量容量获取</h3>
            <label for="tyyp_input">请输入账号数据 (一行一个，格式: 账号----密码):</label>
            <textarea id="tyyp_input" placeholder="例如：&#10;user1@189.cn----pass123&#10;user2----passabc"></textarea>
            <button id="tyyp_start">开始处理</button>
            <hr>
            <div id="currentAccountInfo">
                <span id="currentAccountText"></span>
                <div id="copyBtnsContainer" style="display: none;">
                    <button id="tyyp_copyAccountBtn" class="copy-btn">复制账号</button>
                    <button id="tyyp_copyPasswordBtn" class="copy-btn">复制密码</button>
                </div>
            </div>
            <div class="btn-group">
                <button id="tyyp_btnConfirmLogin" style="display:none;">我已登录，获取容量</button>
                <button id="tyyp_btnNextAccount" style="display:none;">处理下一个账号</button>
                <button id="tyyp_reset">重置</button>
                <button id="tyyp_clearErrors" class="status-btn" style="display:none;">清除错误结果</button>
                <button id="tyyp_reprocessFailed" class="status-btn" style="display:none;">重新处理失败账号</button>
            </div>
            <div id="status">等待输入...</div>
            <hr>
            <label for="tyyp_output">处理结果 (可直接复制):</label>
            <textarea id="tyyp_output" readonly></textarea>
        `;

        inputTextArea = document.getElementById('tyyp_input');
        outputTextArea = document.getElementById('tyyp_output');
        startButton = document.getElementById('tyyp_start');
        btnConfirmLogin = document.getElementById('tyyp_btnConfirmLogin');
        btnNextAccount = document.getElementById('tyyp_btnNextAccount');
        btnReset = document.getElementById('tyyp_reset');
        statusDiv = document.getElementById('status');
        currentAccountInfoDiv = document.getElementById('currentAccountInfo');
        currentAccountTextSpan = document.getElementById('currentAccountText');
        copyBtnsContainer = document.getElementById('copyBtnsContainer');
        copyAccountBtn = document.getElementById('tyyp_copyAccountBtn');
        copyPasswordBtn = document.getElementById('tyyp_copyPasswordBtn');
        btnClearErrors = document.getElementById('tyyp_clearErrors');       // New
        btnReprocessFailed = document.getElementById('tyyp_reprocessFailed'); // New

        startButton.addEventListener('click', startProcessing);
        btnConfirmLogin.addEventListener('click', onConfirmLoginAndFetchCapacity);
        btnNextAccount.addEventListener('click', onProcessNextAccount);
        btnReset.addEventListener('click', resetScript);
        toggleButton.addEventListener('click', togglePanelVisibility);

        copyAccountBtn.addEventListener('click', handleCopyAccount);
        copyPasswordBtn.addEventListener('click', handleCopyPassword);
        btnClearErrors.addEventListener('click', clearErrorResults);       // New
        btnReprocessFailed.addEventListener('click', reprocessFailedAccounts); // New

        const isHidden = GM_getValue(GM_KEY_PANEL_HIDDEN, false);
        if (isHidden) {
            panel.classList.add('hidden');
            toggleButton.innerHTML = '<span class="icon-open"></span>';
        } else {
            panel.classList.remove('hidden');
            toggleButton.innerHTML = '<span class="icon-close"></span>';
        }

        loadSavedData();
    }

    function togglePanelVisibility() {
        const isHidden = panel.classList.toggle('hidden');
        GM_setValue(GM_KEY_PANEL_HIDDEN, isHidden);
        toggleButton.innerHTML = isHidden ? '<span class="icon-open"></span>' : '<span class="icon-close"></span>';
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            statusDiv.textContent = '已复制到剪贴板！';
            statusDiv.classList.remove('error');
            setTimeout(() => {
                // Only clear if it's still the copy message
                if (statusDiv.textContent === '已复制到剪贴板！') {
                     statusDiv.textContent = '';
                }
            }, 2000);
        } catch (err) {
            console.error('复制到剪贴板失败:', err);
            statusDiv.textContent = `复制失败：${err.message || '请手动复制'}`;
            statusDiv.classList.add('error');
        }
    }

    function handleCopyAccount() {
        if (currentAccount) {
            copyToClipboard(currentAccount);
        } else {
            statusDiv.textContent = '没有可复制的账号。';
            statusDiv.classList.add('error');
        }
    }

    function handleCopyPassword() {
        if (currentPassword) {
            copyToClipboard(currentPassword);
        } else {
            statusDiv.textContent = '没有可复制的密码。';
            statusDiv.classList.add('error');
        }
    }

    // Helper to check if there are any error results
    function hasErrorResults() {
        return resultData.some(line => line.includes('获取失败'));
    }

    // New function to clear error results
    function clearErrorResults() {
        if (!hasErrorResults()) {
            statusDiv.textContent = '没有错误结果可清除。';
            statusDiv.classList.add('error');
            return;
        }

        const initialErrorCount = resultData.filter(line => line.includes('获取失败')).length;
        resultData = resultData.filter(line => !line.includes('获取失败'));
        outputTextArea.value = resultData.join('\n');
        saveProgress();
        statusDiv.textContent = `已清除 ${initialErrorCount} 条错误结果。`;
        statusDiv.classList.remove('error');
        // Re-evaluate button visibility after clearing
        updateUIState(getActualUIState(), statusDiv.textContent);
    }

    // New function to reprocess failed accounts
    function reprocessFailedAccounts() {
        const failedAccountsList = resultData.filter(line => line.includes('获取失败'))
                                              .map(line => {
                                                  // Extract original account----password part
                                                  const parts = line.split('----');
                                                  return `${parts[0]}----${parts[1]}`;
                                              });

        if (failedAccountsList.length === 0) {
            statusDiv.textContent = '没有失败账号可重新处理。';
            statusDiv.classList.add('error');
            return;
        }

        if (!confirm(`确定要重新处理这 ${failedAccountsList.length} 个失败账号吗？这将清空当前输入框并开始新的批处理。`)) {
            return;
        }

        // Keep only successful results in resultData
        resultData = resultData.filter(line => !line.includes('获取失败'));

        accounts = failedAccountsList; // Set new batch of accounts
        currentIndex = 0; // Start from the beginning of this new batch
        inputTextArea.value = accounts.join('\n'); // Update input area
        outputTextArea.value = resultData.join('\n'); // Update output area (should only have successful ones now)

        saveProgress(); // Save the new state

        statusDiv.textContent = `已载入 ${failedAccountsList.length} 个失败账号进行重新处理。`;
        statusDiv.classList.remove('error');

        processNextAccount(); // Start processing the failed accounts
    }

    // Determines the current logical state of the UI based on data, for correct button display
    function getActualUIState() {
        if (accounts.length === 0) {
            return 'initial';
        } else if (currentIndex < accounts.length) {
            // Check if we are mid-process (awaiting login or fetching) or just loaded
            // This is a heuristic, as the exact sub-state is managed by updateUIState
            if (btnConfirmLogin.style.display === 'block' && !btnConfirmLogin.disabled) {
                return 'awaiting_login';
            } else if (btnNextAccount.style.display === 'block' && !btnNextAccount.disabled) {
                return 'awaiting_next_account';
            }
            return 'awaiting_login'; // Default to awaiting login if unclear
        } else {
            return 'completed';
        }
    }

    function updateUIState(state, message = '') {
        console.log(`UI State: ${state}, Message: ${message}`);
        copyBtnsContainer.style.display = 'none';

        // Common button state reset
        startButton.disabled = true;
        inputTextArea.disabled = true;
        btnConfirmLogin.style.display = 'none';
        btnNextAccount.style.display = 'none';
        btnConfirmLogin.disabled = false;
        btnNextAccount.disabled = false;
        statusDiv.classList.remove('error');

        // New buttons visibility control
        const errorsExist = hasErrorResults();
        btnClearErrors.style.display = errorsExist ? 'block' : 'none';
        btnReprocessFailed.style.display = errorsExist ? 'block' : 'none';

        switch (state) {
            case 'initial':
                startButton.disabled = false;
                inputTextArea.disabled = false;
                currentAccountTextSpan.textContent = '';
                statusDiv.textContent = '等待输入...';
                currentAccount = '';
                currentPassword = '';
                break;

            case 'awaiting_login':
                btnConfirmLogin.style.display = 'block';
                currentAccountTextSpan.textContent = message.split('（第')[0];
                statusDiv.textContent = message;
                if (currentAccount && currentPassword) {
                    copyBtnsContainer.style.display = 'flex';
                }
                break;

            case 'fetching_capacity':
                btnConfirmLogin.disabled = true;
                statusDiv.textContent = message;
                break;

            case 'awaiting_next_account':
                btnNextAccount.style.display = 'block';
                currentAccountTextSpan.textContent = '';
                currentAccount = '';
                currentPassword = '';
                statusDiv.textContent = message;
                break;

            case 'completed':
                currentAccountTextSpan.textContent = '所有账号处理完毕！';
                statusDiv.textContent = '所有账号容量已获取。';
                break;

            case 'error':
                statusDiv.textContent = message;
                statusDiv.classList.add('error');
                if (message.includes('手动登录') || message.includes('恢复') || message.includes('格式不正确')) {
                    btnConfirmLogin.style.display = 'block'; // Allow user to confirm login if error before fetching
                } else {
                    btnNextAccount.style.display = 'block'; // Allow user to proceed to next or retry
                }
                if (currentAccount && currentPassword) {
                     copyBtnsContainer.style.display = 'flex';
                }
                break;
        }
    }

    function loadSavedData() {
        const savedResultsStr = GM_getValue(GM_KEY_RESULTS, '[]');
        const savedAccountsStr = GM_getValue(GM_KEY_ACCOUNTS, '[]');

        try {
            resultData = JSON.parse(savedResultsStr);
            accounts = JSON.parse(savedAccountsStr);
            inputTextArea.value = accounts.join('\n');
            outputTextArea.value = resultData.join('\n');

            currentIndex = resultData.length;

            if (accounts.length > 0 && currentIndex < accounts.length) {
                const [account, password] = accounts[currentIndex].split('----').map(s => s.trim());
                currentAccount = account;
                currentPassword = password;
                updateUIState('awaiting_login', `当前处理账号: ${account} (密码: ${password})。已从上次进度恢复，已处理 ${currentIndex} / ${accounts.length} 个账号。`);
            } else if (accounts.length > 0 && currentIndex >= accounts.length) {
                updateUIState('completed');
            } else {
                updateUIState('initial');
            }
        } catch (e) {
            console.error("加载保存的数据失败:", e);
            statusDiv.textContent = "加载上次进度失败，将从头开始。";
            statusDiv.classList.add('error');
            resetScript(false);
        }
    }

    function saveProgress() {
        GM_setValue(GM_KEY_RESULTS, JSON.stringify(resultData));
        GM_setValue(GM_KEY_ACCOUNTS, JSON.stringify(accounts));
    }

    function startProcessing() {
        if (accounts.length > 0 && currentIndex < accounts.length) {
            statusDiv.textContent = '当前有未完成的批处理任务，请点击“重置”按钮重新开始，或继续处理。';
            statusDiv.classList.add('error');
            return;
        }

        const input = inputTextArea.value.trim();
        if (!input) {
            updateUIState('error', '请输入账号数据！');
            return;
        }

        accounts = input.split('\n').map(line => line.trim()).filter(line => line);
        if (accounts.length === 0) {
            updateUIState('error', '无效的账号数据格式！');
            return;
        }

        currentIndex = 0;
        resultData = []; // Clear old results for a fresh start
        outputTextArea.value = '';

        saveProgress();

        processNextAccount();
    }

    function onProcessNextAccount() {
        processNextAccount();
    }

    async function onConfirmLoginAndFetchCapacity() {
        updateUIState('fetching_capacity', '正在从页面读取容量信息...');
        btnConfirmLogin.disabled = true;

        const [account, password] = accounts[currentIndex].split('----').map(s => s.trim());

        try {
            const personalCapacity = await getCapacityFromPage('个人');
            const familyCapacity = await getCapacityFromPage('家庭');

            if (!personalCapacity && !familyCapacity) {
                throw new Error('未能在页面上找到个人和家庭容量信息。请确认是否已成功登录并进入主页。');
            }

            const resultLine = `${account}----${password}----${personalCapacity || 'N/A'}----${familyCapacity || 'N/A'}`;
            resultData.push(resultLine);
            outputTextArea.value = resultData.join('\n');
            saveProgress();

            currentIndex++;
            updateUIState('awaiting_next_account', `账号 ${account} 容量获取成功！请手动退出当前登录，然后点击“处理下一个账号”继续。`);

        } catch (error) {
            console.error(`获取 ${account} 容量失败:`, error);
            const resultLine = `${account}----${password}----获取失败----获取失败 (${error.message.substring(0, Math.min(error.message.length, 50))}...)`;
            resultData.push(resultLine);
            outputTextArea.value = resultData.join('\n');
            saveProgress();
            currentIndex++;
            updateUIState('awaiting_next_account', `账号 ${account} 处理失败。请手动退出当前登录，然后点击“处理下一个账号”继续。`);
        } finally {
            // UI state is handled by updateUIState
        }
    }

    function switchToPasswordLogin() {
        console.log('Attempting to switch to password login...');
        setTimeout(function() {
            try {
                const selectors = [
                    '#tab-sms',
                    '#j-jump-psw',
                    '#J_change_type',
                    '#j-accLogin-link',
                    'button:contains("密码登录")',
                    'a:contains("密码登录")',
                    'span:contains("密码登录")',
                    'a[href*="pwdLogin"]',
                    'a[href*="loginType=password"]'
                ];

                let clickedCount = 0;
                for (const selector of selectors) {
                    const elements = $(selector).filter(':visible');
                    if (elements.length > 0) {
                        elements.each(function() {
                            $(this).css('display', 'block').click();
                            console.log(`Clicked element: ${selector}`);
                            clickedCount++;
                        });
                    }
                }

                if (clickedCount === 0) {
                    console.warn('No password login switch elements found or clicked with current selectors.');
                }

            } catch (e) {
                console.error("Error during password login switch attempt:", e);
            }
        }, 500);
    }

    function processNextAccount() {
        if (currentIndex >= accounts.length) {
            updateUIState('completed');
            saveProgress();
            return;
        }

        const [account, password] = accounts[currentIndex].split('----').map(s => s.trim());
        if (!account || !password) {
            const malformedLine = accounts[currentIndex];
            const errorMessage = `错误：第 ${currentIndex + 1} 行数据格式不正确（${malformedLine}），跳过此账号。`;
            const resultLine = `${malformedLine}----格式错误----格式错误`;
            resultData.push(resultLine);
            outputTextArea.value = resultData.join('\n');
            saveProgress();
            currentIndex++;
            updateUIState('error', errorMessage); // Show error, allow next or retry
            setTimeout(processNextAccount, 100); // Process next immediately if current is malformed
            return;
        }

        currentAccount = account;
        currentPassword = password;

        updateUIState('awaiting_login', `请手动登录天翼云盘，账号：${account}，密码：${password} （第 ${currentIndex + 1} / ${accounts.length} 个）`);

        switchToPasswordLogin();
    }

    async function getCapacityFromPage(type) {
        let targetText = type === '个人' ? '个人：' : '家庭：';
        let capacity = null;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const xpathResult = document.evaluate(`//span[contains(text(), '${targetText}')] | //div[contains(text(), '${targetText}')] | //p[contains(text(), '${targetText}')] | //li[contains(text(), '${targetText}')]`, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let node;
        while ((node = xpathResult.iterateNext())) {
            const fullText = node.textContent;
            if (fullText.includes(targetText)) {
                const match = fullText.match(new RegExp(`${targetText}.*?/(.+?)([MGTB])`, 'i'));
                if (match && match[1] && match[2]) {
                     capacity = `${parseFloat(match[1].replace(/\s/g, '')).toFixed(2)}${match[2].toUpperCase()}`;
                     break;
                } else {
                    const simpleMatch = fullText.match(new RegExp(`${targetText}([^/]+?)([MGTB])`, 'i'));
                    if (simpleMatch && simpleMatch[1] && simpleMatch[2]) {
                         capacity = `${parseFloat(simpleMatch[1].replace(/\s/g, '')).toFixed(2)}${simpleMatch[2].toUpperCase()}`;
                         break;
                    }
                }
            }
        }
        return capacity;
    }

    function resetScript(showStatus = true) {
        accounts = [];
        currentIndex = 0;
        resultData = [];
        currentAccount = '';
        currentPassword = '';
        inputTextArea.value = '';
        outputTextArea.value = '';
        GM_setValue(GM_KEY_RESULTS, '[]');
        GM_setValue(GM_KEY_ACCOUNTS, '[]');
        updateUIState('initial');
        if (showStatus) {
            statusDiv.textContent = '脚本已重置，请重新输入账号数据。';
            statusDiv.classList.remove('error');
        }
    }

    window.addEventListener('load', createUI);

})();