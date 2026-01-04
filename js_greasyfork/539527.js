// ==UserScript==
// @name         Thailand Y Content Awards Auto Voter (with Pause)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  密码错误时自动删除账号，支持暂停/继续、覆盖/添加账号。新增智能等待Cloudflare验证及双重超时监控，防止卡死。
// @author       ols
// @license      CC-BY-NC-ND-4.0
// @match        https://www.thailandycontentawards.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539527/Thailand%20Y%20Content%20Awards%20Auto%20Voter%20%28with%20Pause%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539527/Thailand%20Y%20Content%20Awards%20Auto%20Voter%20%28with%20Pause%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // ===== 配置区 =====
    const CONFIG = {
        GLOBAL_VOTE_COUNT_KEY: 'thailandycontentawardsVoteCount',
        ACCOUNT_COOLDOWN_KEY: 'thailandycontentawardsAccountCooldown',
        IMPORTED_ACCOUNTS_KEY: 'thailandycontentawardsAccountMap',
        SCRIPT_STATE_KEY: 'thailandycontentawardsScriptState',
        PROGRESS_TIMESTAMP_KEY: 'thailandycontentawardsProgressTimestamp', // [新增 v3.1] 
        baseDelay: 3000,
        randomDelayRange: 4500,
        voteTarget: "TCB07",
        actionPageTimeout: 4000,
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
        ACCOUNT_MAP: {},
        MAX_LOGIN_ATTEMPTS: 1,
        WAIT_AFTER_ALL_LIMITED: 180000,
        COOLDOWN_PERIOD: 3600000,
        GLOBAL_TIMEOUT: 10000, // 全局单页超时时间 (10秒)
        CATASTROPHIC_TIMEOUT: 180000 // [新增 v3.1] 全局灾难性超时 (3分钟)
    };
 
    let ACCOUNT_LIST = [];
    let currentVoteCount;
    let accountIndex = GM_getValue('accountIndex', 0);
    let scriptState = GM_getValue(CONFIG.SCRIPT_STATE_KEY, 'stopped');
    let globalStuckTimer = null; // 全局卡顿计时器
 
    // ===== 菜单命令和账号导入 =====
    GM_registerMenuCommand("📥 导入账号 (覆盖)", importAccountsOverwrite);
    GM_registerMenuCommand("➕ 导入账号 (添加)", importAccountsAdditive);
    GM_registerMenuCommand("⏯️ 暂停/继续投票", () => {
        const controlButton = document.getElementById('bp-control-button');
        if (controlButton) controlButton.click();
    });
    GM_registerMenuCommand("❌ 清空所有已存账号", clearAccounts);
 
    function importAccountsAdditive() {
        importAccounts(false);
    }
 
    function importAccountsOverwrite() {
        if (confirm('此操作将覆盖所有已存在的账号，您确定吗？')) {
            importAccounts(true);
        }
    }
 
    function importAccounts(isOverwrite) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.txt';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
 
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split(/\r?\n/);
                const newMap = {};
                let successfullyParsedLines = 0;
 
                for (const line of lines) {
                    if (line.trim() === '') continue;
                    const parts = line.split(/,|\t/);
                    if (parts.length >= 2) {
                        const email = parts[0].trim().replace(/^"|"$/g, '');
                        const password = parts[1].trim().replace(/^"|"$/g, '');
                        if (email && password) {
                            newMap[email] = password;
                            successfullyParsedLines++;
                        }
                    }
                }
 
                if (successfullyParsedLines > 0) {
                    let finalMap = newMap;
                    if (!isOverwrite) {
                        const currentMap = GM_getValue(CONFIG.IMPORTED_ACCOUNTS_KEY, {});
                        finalMap = Object.assign(currentMap, newMap);
                    }
 
                    GM_setValue(CONFIG.IMPORTED_ACCOUNTS_KEY, finalMap);
                    CONFIG.ACCOUNT_MAP = finalMap;
                    ACCOUNT_LIST = Object.keys(CONFIG.ACCOUNT_MAP);
 
                    if (isOverwrite) {
                        accountIndex = 0;
                        GM_setValue('accountIndex', 0);
                    }
 
                    const statusText = document.getElementById('bp-status-text');
                    if(statusText) statusText.textContent = `已加载 ${ACCOUNT_LIST.length} 个账号`;
 
                    const message = isOverwrite ?
                        `成功导入 ${successfullyParsedLines} 个账号。` :
                        `成功添加/更新 ${successfullyParsedLines} 个账号。\n当前总账号数: ${ACCOUNT_LIST.length}`;
                    alert(message);
 
                } else {
                    alert('导入失败！请检查文件格式。\n\n文件应为 .txt 或 .csv，每行内容格式为：\n账号,密码');
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }
 
 
    function clearAccounts() {
        if (confirm('您确定要清空所有已保存在脚本中的账号吗？\n此操作不可撤销！')) {
            GM_setValue(CONFIG.IMPORTED_ACCOUNTS_KEY, {});
            GM_setValue('accountIndex', 0);
            GM_setValue(CONFIG.SCRIPT_STATE_KEY, 'stopped');
            GM_setValue(CONFIG.PROGRESS_TIMESTAMP_KEY, 0); // 清除进度时间戳
            CONFIG.ACCOUNT_MAP = {};
            ACCOUNT_LIST = [];
            accountIndex = 0;
            const statusText = document.getElementById('bp-status-text');
            if(statusText) statusText.textContent = `已加载 0 个账号`;
            updateControlButtonUI();
            alert('所有已保存的账号已被清空。');
        }
    }
 
    function deleteAccount(accountEmail) {
        if (!accountEmail) return;
        const currentAccounts = GM_getValue(CONFIG.IMPORTED_ACCOUNTS_KEY, {});
        delete currentAccounts[accountEmail];
        GM_setValue(CONFIG.IMPORTED_ACCOUNTS_KEY, currentAccounts);
        console.log(`账号 ${accountEmail} 已被从存储中删除。`);
    }
 
    // ===== UI 和状态更新函数 =====
    function initializeUI() {
        const style = document.createElement('style');
        style.textContent = `
            #bp-combined-display { position: fixed; right: 20px; bottom: 20px; color: white; padding: 10px 12px; border-radius: 6px; font-family: simhei, sans-serif; z-index: 9999; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.3s ease; background: #9370DB; font-size: 16px; max-width: 240px; min-width: 180px; text-align: left; display: flex; flex-direction: column; gap: 6px; }
            #bp-status-text { font-weight: bold; line-height: 1.4; word-wrap: break-word; }
            #bp-vote-count { font-size: 17px; font-weight: bold; padding-top: 5px; border-top: 1px dashed rgba(255,255,255,0.3); }
            #bp-control-button { color: white; border: none; padding: 8px 12px; text-align: center; font-size: 14px; margin-top: 8px; cursor: pointer; border-radius: 4px; width: 100%; font-family: inherit; transition: background-color 0.2s; }
            #bp-control-button:hover { filter: brightness(1.1); }
            .status-success { background: #4CAF50 !important; } .status-failure { background: #F44336 !important; } .status-neutral { background: #2196F3 !important; } .status-warning { background: #FF9800 !important; } .status-cooldown { background: #FF5722 !important; }
        `;
        document.head.appendChild(style);
 
        const combinedDisplay = document.createElement('div');
        combinedDisplay.id = 'bp-combined-display';
        const statusText = document.createElement('div');
        statusText.id = 'bp-status-text';
        statusText.textContent = `已加载 ${ACCOUNT_LIST.length} 个账号`;
 
        const voteCount = document.createElement('div');
        voteCount.id = 'bp-vote-count';
        currentVoteCount = GM_getValue(CONFIG.GLOBAL_VOTE_COUNT_KEY, 0);
        voteCount.textContent = `总票数: ${currentVoteCount}票`;
 
        const controlButton = document.createElement('button');
        controlButton.id = 'bp-control-button';
        controlButton.addEventListener('click', () => {
            const previousState = GM_getValue(CONFIG.SCRIPT_STATE_KEY, 'stopped');
            scriptState = (previousState === 'running') ? 'paused' : 'running';
 
            if (scriptState === 'paused') {
                updateStatus("脚本已暂停", 'warning');
            }
            
            // [新增 v3.1] 当从非运行状态切换到运行时，设置进度时间戳
            if (scriptState === 'running' && previousState !== 'running') {
                GM_setValue(CONFIG.PROGRESS_TIMESTAMP_KEY, Date.now());
            }
 
            GM_setValue(CONFIG.SCRIPT_STATE_KEY, scriptState);
            updateControlButtonUI();
 
            if (scriptState === 'running') {
                startAutomation();
            }
        });
 
        combinedDisplay.appendChild(statusText);
        combinedDisplay.appendChild(voteCount);
        combinedDisplay.appendChild(controlButton);
        document.body.appendChild(combinedDisplay);
 
        updateControlButtonUI();
    }
 
    function updateControlButtonUI() {
        const controlButton = document.getElementById('bp-control-button');
        if (!controlButton) return;
        scriptState = GM_getValue(CONFIG.SCRIPT_STATE_KEY, 'stopped');
 
        switch (scriptState) {
            case 'running':
                controlButton.textContent = '⏸️ 暂停投票';
                controlButton.style.backgroundColor = '#FF9800';
                break;
            case 'paused':
                controlButton.textContent = '▶️ 继续投票';
                controlButton.style.backgroundColor = '#4CAF50';
                break;
            case 'stopped':
            default:
                controlButton.textContent = '▶️ 开始投票';
                controlButton.style.backgroundColor = '#4CAF50';
                break;
        }
    }
 
    function updateStatus(message, statusType = 'neutral') {
        const statusText = document.getElementById('bp-status-text');
        const displayBox = document.getElementById('bp-combined-display');
        if (!statusText || !displayBox) return;
 
        statusText.textContent = message;
        displayBox.className = 'status-neutral';
        displayBox.id = 'bp-combined-display';
        switch (statusType) {
            case true: displayBox.classList.add('status-success'); break;
            case false: displayBox.classList.add('status-failure'); break;
            case 'cooldown': displayBox.classList.add('status-cooldown'); break;
            case 'warning': displayBox.classList.add('status-warning'); break;
            default: displayBox.classList.add('status-neutral'); break;
        }
        displayBox.style.transform = 'scale(1.05)';
        setTimeout(() => displayBox.style.transform = 'scale(1)', 150);
    }
 
    // ===== 工具函数 =====
    function getCurrentAccount() {
        if (ACCOUNT_LIST.length === 0) return null;
        return ACCOUNT_LIST[accountIndex];
    }
 
    function getCurrentPassword() {
        const account = getCurrentAccount();
        return account ? CONFIG.ACCOUNT_MAP[account] : null;
    }
 
    function moveToNextAccount() {
        if (ACCOUNT_LIST.length === 0) return;
        accountIndex = (accountIndex + 1) % ACCOUNT_LIST.length;
        GM_setValue('accountIndex', accountIndex);
    }
 
    function isAccountInCooldown(account) {
        const cooldownMap = GM_getValue(CONFIG.ACCOUNT_COOLDOWN_KEY, {});
        const lastVoteTime = cooldownMap[account] || 0;
        return (Date.now() - lastVoteTime) < CONFIG.COOLDOWN_PERIOD;
    }
 
    function getNextAvailableAccount() {
        const cooldownMap = GM_getValue(CONFIG.ACCOUNT_COOLDOWN_KEY, {});
        const currentTime = Date.now();
        let attempts = 0;
        while (attempts < ACCOUNT_LIST.length) {
            moveToNextAccount();
            const account = getCurrentAccount();
            if (!cooldownMap[account] || (currentTime - cooldownMap[account]) >= CONFIG.COOLDOWN_PERIOD) {
                return account;
            }
            attempts++;
        }
        return null;
    }
 
    function updateAccountCooldown(account) {
        const cooldownMap = GM_getValue(CONFIG.ACCOUNT_COOLDOWN_KEY, {});
        cooldownMap[account] = Date.now();
        GM_setValue(CONFIG.ACCOUNT_COOLDOWN_KEY, cooldownMap);
    }
 
    function randomDelay(base = CONFIG.baseDelay, range = CONFIG.randomDelayRange) {
        return new Promise(resolve => setTimeout(resolve, base + Math.floor(Math.random() * range)));
    }
 
    function waitForElement(selector, timeout = 4000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) { observer.disconnect(); resolve(el); }
            });
            const timer = setTimeout(() => { observer.disconnect(); reject(new Error(`Element ${selector} not found within ${timeout}ms`)); }, timeout);
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
 
    function setupVoteCounterListener() {
        GM_addValueChangeListener(CONFIG.GLOBAL_VOTE_COUNT_KEY, (name, oldValue, newValue, remote) => {
            if (newValue !== undefined) {
                const counterEl = document.getElementById('bp-vote-count');
                if(counterEl) counterEl.textContent = `总票数: ${newValue}票`;
                if (remote) updateStatus(`其他标签页投票成功 (+1票)`, true);
            }
        });
    }
 
    // ===== 核心操作函数 =====
    async function loginAccount() {
        try {
            const email = getCurrentAccount();
            if (!email) {
                 updateStatus("没有可用的账号，请先导入", false);
                 GM_setValue(CONFIG.SCRIPT_STATE_KEY, 'stopped');
                 updateControlButtonUI();
                 return;
            }
            if (isAccountInCooldown(email)) {
                const remaining = Math.ceil((CONFIG.COOLDOWN_PERIOD - (Date.now() - (GM_getValue(CONFIG.ACCOUNT_COOLDOWN_KEY, {})[email] || 0))) / 60000);
                updateStatus(`账号冷却中: ${email}\n剩余: ${remaining}分钟`, 'cooldown');
                const nextAccount = getNextAvailableAccount();
                if (nextAccount) {
                    updateStatus(`切换到账号: ${nextAccount}`);
                    location.href = 'https://www.thailandycontentawards.com/login.php';
                } else {
                    updateStatus(`所有账号都在冷却中\n等待3分钟后重试`, 'warning');
                    setTimeout(() => location.reload(), CONFIG.WAIT_AFTER_ALL_LIMITED);
                }
                return;
            }
            updateStatus(`登录账号: ${email}`);
            await waitForElement('input[name="username"]');
            document.querySelector('input[name="username"]').value = email;
            document.querySelector('input[name="userpassword"]').value = getCurrentPassword();
            await randomDelay();
            document.querySelector('button[type="submit"]').click();
        } catch (error) {
            updateStatus(`登录时发生未知错误: ${error.message}`, false);
            moveToNextAccount();
            setTimeout(() => location.href = 'https://www.thailandycontentawards.com/login.php', 2000);
        }
    }
 
    async function verifyAndNavigate() {
        try {
            updateStatus("验证登录状态...");
            await waitForElement('a[href="vote.php"]');
            updateStatus("导航到投票页面...");
            document.querySelector('a[href="vote.php"]').click();
        } catch (error) {
            updateStatus(`导航错误: ${error.message}`, false);
            moveToNextAccount();
            location.href = 'https://www.thailandycontentawards.com/login.php';
        }
    }
 
    async function selectVoteCategory() {
        try {
            updateStatus("选择投票类别...");
            randomDelay(2000,1500);
            const categoryItems = await waitForElement('.plan ul a', 5000).then(() => document.querySelectorAll('.plan ul a'));
            for (const item of categoryItems) {
                if (item.textContent.includes('คู่จิ้นแห่งปี')) {
                    updateStatus("找到目标投票类别");
                    randomDelay(2000,1500);
                    item.click();
                    return;
                }
            }
            throw new Error("未找到目标投票类别");
        } catch (error) {
            updateStatus(`选择类别错误: ${error.message}`, false);
            moveToNextAccount();
            location.href = 'https://www.thailandycontentawards.com/login.php';
        }
    }
 
    async function castVote() {
        try {
            updateStatus(`寻找投票目标: ${CONFIG.voteTarget}...`);

            let voteItems =document.querySelectorAll('.plan');

            if (!voteItems || voteItems.length === 0) {
                updateStatus("错误: 未找到任何投票项目", false);
                moveToNextAccount();
                location.href = 'https://www.thailandycontentawards.com/vote.php';
                return;
            }

            let targetItem = null;
            for (const item of voteItems) {
                const itemTitle = item.querySelector('span');
                if (itemTitle && itemTitle.textContent === CONFIG.voteTarget) {
                    targetItem = item;
                    break;
                }
            }

            if (!targetItem) {
                updateStatus(`警告: 未找到投票目标 ${CONFIG.voteTarget}`, false);
                moveToNextAccount();
                location.href = 'https://www.thailandycontentawards.com/login.php';
                return;
            }

            updateStatus(`找到投票目标: ${CONFIG.voteTarget}`);

            let voteButton;
            voteButton = targetItem.querySelector('.btn.btn-vote-free');

            if (!voteButton) {
                updateStatus("错误: 目标项目没有投票按钮", false);
                moveToNextAccount();
                location.href = 'https://www.thailandycontentawards.com/vote.php';
                return;
            }

            let maxAttempts = 20;

            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                updateStatus(`尝试投票 (${attempt}/${maxAttempts})...`);
                await randomDelay(2000, 1500);
                voteButton.click();

                // 增加等待时间确保弹窗出现
                await randomDelay(1000, 500);

                try {
                    // 检查确认弹窗
                    await waitForElement('#confirm-vote', 2500);
                    const confirmButton = document.querySelector('#showConfirmVote button.btn-warning');
                    if (confirmButton) {
                        updateStatus("确认投票...");
                        confirmButton.click();
                    }
                } catch (e) {
                    // 静默处理，继续尝试
                }
            }
        } catch (error) {
            updateStatus(`投票错误: ${error.message}`, false);
            moveToNextAccount();
            location.href = 'https://www.thailandycontentawards.com/login.php';
        }
    }
 
    // ===== 主控制函数 =====
    async function startAutomation() {
        // [新增 v3.1] 检查长期无进展的灾难性超时
        const lastProgressTimestamp = GM_getValue(CONFIG.PROGRESS_TIMESTAMP_KEY, 0);
        if (scriptState === 'running' && lastProgressTimestamp > 0 && (Date.now() - lastProgressTimestamp > CONFIG.CATASTROPHIC_TIMEOUT)) {
            updateStatus("脚本已超3分钟无进展，强制重置...", 'warning');
            GM_setValue(CONFIG.PROGRESS_TIMESTAMP_KEY, Date.now()); // 重置时间戳以防循环
            location.href = 'https://www.thailandycontentawards.com/profile.php';
            return;
        }
 
        clearTimeout(globalStuckTimer);
        globalStuckTimer = setTimeout(() => {
            updateStatus("页面卡顿超10秒，强制导航...", 'warning');
            location.href = 'https://www.thailandycontentawards.com/profile.php';
        }, CONFIG.GLOBAL_TIMEOUT);
 
        if (GM_getValue(CONFIG.SCRIPT_STATE_KEY, 'stopped') !== 'running') {
            clearTimeout(globalStuckTimer);
            return;
        }
 
        if (ACCOUNT_LIST.length === 0) {
            updateStatus("没有可用的账号，请先导入。", 'warning');
            GM_setValue(CONFIG.SCRIPT_STATE_KEY, 'stopped');
            updateControlButtonUI();
            clearTimeout(globalStuckTimer);
            return;
        }
 
        updateStatus("开始自动化流程...");
        if (CONFIG.isMobile) updateStatus(`移动设备${CONFIG.isIOS ? ' (iOS)' : ''}优化模式已启用`);
 
        const pageText = document.body ? document.body.textContent : '';
        const url = location.href;
 
        if (pageText.includes('Verifying you are human') || pageText.includes('Checking your browser')) {
            updateStatus("正在进行安全验证，请稍候...", 'warning');
            document.getElementById('checkbox').checked = true;
            await randomDelay(5000, 3000);
            clearTimeout(globalStuckTimer);
            return;
        }
 
        if (url.includes('login.php?error=')) {
            const accountToDelete = getCurrentAccount();
            if (accountToDelete) {
                updateStatus(`账号 ${accountToDelete} 密码错误，已自动删除。`, false);
                deleteAccount(accountToDelete);
                CONFIG.ACCOUNT_MAP = GM_getValue(CONFIG.IMPORTED_ACCOUNTS_KEY, {});
                ACCOUNT_LIST = Object.keys(CONFIG.ACCOUNT_MAP);
                if (accountIndex >= ACCOUNT_LIST.length) {
                    accountIndex = 0;
                    GM_setValue('accountIndex', 0);
                }
                try {
                    const usernameInput = await waitForElement('input[name="username"]', 1000);
                    const passwordInput = document.querySelector('input[name="userpassword"]');
                    usernameInput.value = '';
                    if (passwordInput) passwordInput.value = '';
                } catch (e) { console.log("未能找到登录输入框进行清空。"); }
            }
            updateStatus("准备尝试下一个账号...", 'neutral');
            await randomDelay(2500, 1000);
            location.href = 'https://www.thailandycontentawards.com/login.php';
        }
        else if (url.includes('login.php')) {
            await randomDelay(500, 200);
            await loginAccount();
        }
        else if (url.includes('profile.php') || pageText.includes('ข้อมูลส่วนตัว / Profile')) {
            await randomDelay(500, 200);
            await verifyAndNavigate();
        }
        else if (url.includes('vote.php')) {
            await randomDelay(500, 200);
            await selectVoteCategory();
        }
        else if (url.includes('votechoice.php')) {
            await randomDelay(500, 200);
            await castVote();
        }
        else if (pageText.includes('Vote Successfully!')) setTimeout(() => location.href = 'https://www.thailandycontentawards.com/votechoice.php?tpid=2', 1000);
        else if (pageText.includes('Vote Limitation 1 vote per hour only')) {
            GM_setValue(CONFIG.PROGRESS_TIMESTAMP_KEY, Date.now()); // [新增 v3.1] 投票成功是一个关键进展，更新时间戳
            const account = getCurrentAccount();
            updateStatus("投票成功! 记录冷却时间", true);
            updateAccountCooldown(account);
            GM_setValue(CONFIG.GLOBAL_VOTE_COUNT_KEY, GM_getValue(CONFIG.GLOBAL_VOTE_COUNT_KEY, 0) + 1);
            const nextAccount = getNextAvailableAccount();
            if (nextAccount) {
                updateStatus(`切换到账号: ${nextAccount}`);
                setTimeout(() => location.href = 'https://www.thailandycontentawards.com/login.php', 2000);
            } else {
                updateStatus(`所有账号都在冷却中\n等待3分钟后重试`, 'warning');
                setTimeout(() => location.reload(), CONFIG.WAIT_AFTER_ALL_LIMITED);
            }
        }
        else if (pageText.includes('Something Went Wrong')) {
            updateStatus("投票失败", false);
            moveToNextAccount();
            setTimeout(() => location.href = 'https://www.thailandycontentawards.com/login.php', 2000);
        }
        else if (url === 'https://www.thailandycontentawards.com/') {
            document.querySelector('a[href="login.php"]')?.click();
        }
        else {
            updateStatus("未知页面，跳转至登录页", 'warning');
            setTimeout(() => location.href = 'https://www.thailandycontentawards.com/login.php', 2000);
        }
    }
 
    // ===== 启动入口 =====
    function init() {
        const imported = GM_getValue(CONFIG.IMPORTED_ACCOUNTS_KEY, null);
        if (imported && typeof imported === 'object') {
            CONFIG.ACCOUNT_MAP = imported;
        }
        ACCOUNT_LIST = Object.keys(CONFIG.ACCOUNT_MAP);
 
        initializeUI();
        setupVoteCounterListener();
 
        if(GM_getValue('autoStartNextPage', false)) {
            GM_setValue('autoStartNextPage', false);
            if (GM_getValue(CONFIG.SCRIPT_STATE_KEY, 'stopped') === 'running') {
                setTimeout(startAutomation, 500);
            }
        } else if (GM_getValue(CONFIG.SCRIPT_STATE_KEY, 'stopped') === 'running') {
            setTimeout(startAutomation, 500);
        }
    }
 
    window.addEventListener('beforeunload', () => {
        clearTimeout(globalStuckTimer);
        if (GM_getValue(CONFIG.SCRIPT_STATE_KEY, 'stopped') === 'running') {
            GM_setValue('autoStartNextPage', true);
        } else {
            GM_setValue('autoStartNextPage', false);
        }
    });
 
    init();
 
})();