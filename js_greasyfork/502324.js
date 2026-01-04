// ==UserScript==
// @name         蜜雪冰城
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  浏览器访问 https://mxsa-h5.mxbc.net/#/flash-sale-words?needToken=2&marketingId=1816854086004391938 来自Linux Do @PedroZ https://linux.do/t/topic/165279
// @match        https://mxsa-h5.mxbc.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502324/%E8%9C%9C%E9%9B%AA%E5%86%B0%E5%9F%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/502324/%E8%9C%9C%E9%9B%AA%E5%86%B0%E5%9F%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ENABLED_KEY = 'scriptEnabled';
    const TOKENS_KEY = 'accessTokens';
    const MAX_ROUNDS_KEY = 'maxRounds';
    const RESPONSE_LOG_KEY = 'responseLog';
    const ROUND_INTERVAL_KEY = 'roundInterval';
    const TOKEN_INTERVAL = 200; // token之间的间隔时间
    const ROUND_INTERVAL = 1500; // 每轮操作的总时间
    const DEFAULT_MAX_ROUNDS = 40; // 默认最大轮数

    let timer;
    let currentRound = 0;

    function createFloatingPanel() {
        const style = document.createElement('style');
        style.textContent = `
            body.van-toast--unclickable #scriptControlPanel {
                pointer-events: auto !important;
            }
            .van-toast--unclickable #scriptControlPanel * {
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'scriptControlPanel';
        panel.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            left: 10px !important;
            z-index: 2147483647 !important;
            background: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border-radius: 10px !important;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
            font-family: Arial, sans-serif !important;
            pointer-events: auto !important;
            touch-action: auto !important;
            user-select: auto !important;
            transition: all 0.3s ease !important;
            width: 300px !important;
        `;

        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 10px 15px !important;
            border-bottom: 1px solid #ccc !important;
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 10px 10px 0 0 !important;
        `;

        const title = document.createElement('span');
        title.textContent = '控制面板';
        title.style.cssText = `
            font-weight: bold !important;
            flex-grow: 1 !important;
        `;

        const collapseButton = document.createElement('button');
        collapseButton.textContent = '▲';
        collapseButton.style.cssText = `
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            font-size: 16px !important;
            padding: 0 5px !important;
        `;

        titleBar.appendChild(title);
        titleBar.appendChild(collapseButton);

        const content = document.createElement('div');
        content.id = 'scriptControlPanelContent';
        content.style.cssText = `
            padding: 15px !important;
            max-height: calc(80vh - 40px) !important;
            overflow-y: auto !important;
        `;

        content.appendChild(createToggleButton());
        content.appendChild(createTokenManagement());
        content.appendChild(createStatusDisplay());
        content.appendChild(createResponseLog());

        panel.appendChild(titleBar);
        panel.appendChild(content);

        let isCollapsed = false;
        collapseButton.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                content.style.display = 'none';
                collapseButton.textContent = '▼';
                panel.style.height = 'auto';
            } else {
                content.style.display = '';
                collapseButton.textContent = '▲';
                panel.style.height = '';
            }
        });

        document.body.appendChild(panel);
        return panel;
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;
        handle.ontouchstart = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.type === 'touchstart') {
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
            document.onmouseup = closeDragElement;
            document.ontouchend = closeDragElement;
            document.onmousemove = elementDrag;
            document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.type === 'touchmove') {
                pos1 = pos3 - e.touches[0].clientX;
                pos2 = pos4 - e.touches[0].clientY;
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.ontouchend = null;
            document.onmousemove = null;
            document.ontouchmove = null;
        }
    }

    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'scriptToggleButton';
        button.style.cssText = `
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 10px;
            width: 100%;
        `;
        button.textContent = '停止运行';
        button.addEventListener('click', toggleScript);
        return button;
    }

    function createTokenManagement() {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        `;

        const input = document.createElement('input');
        input.id = 'accessTokenInput';
        input.type = 'text';
        input.placeholder = '输入 accessToken';
        input.style.cssText = `
            margin-bottom: 5px;
            padding: 5px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 3px;
        `;
        input.addEventListener('mousedown', (e) => e.stopPropagation());
        input.addEventListener('touchstart', (e) => e.stopPropagation());

        const addButton = document.createElement('button');
        addButton.textContent = '添加 Token';
        addButton.style.cssText = `
            padding: 5px 10px;
            background-color: #008CBA;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-bottom: 10px;
        `;

        const tokenList = document.createElement('div');
        tokenList.id = 'tokenList';
        tokenList.style.cssText = `
            max-height: 100px;
            overflow-y: auto;
            margin-bottom: 10px;
        `;

        const maxRoundsInput = document.createElement('input');
        maxRoundsInput.id = 'maxRoundsInput';
        maxRoundsInput.type = 'number';
        maxRoundsInput.min = '1';
        maxRoundsInput.value = localStorage.getItem(MAX_ROUNDS_KEY) || DEFAULT_MAX_ROUNDS.toString();
        maxRoundsInput.placeholder = '最大轮数';
        maxRoundsInput.style.cssText = `
            margin-bottom: 5px;
            padding: 5px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 3px;
        `;

        maxRoundsInput.addEventListener('mousedown', (e) => e.stopPropagation());
        maxRoundsInput.addEventListener('touchstart', (e) => e.stopPropagation());


        const setMaxRoundsButton = document.createElement('button');
        setMaxRoundsButton.textContent = '设置最大轮数';
        setMaxRoundsButton.style.cssText = `
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-bottom: 10px;
        `;

        const roundIntervalInput = document.createElement('input');
        roundIntervalInput.id = 'roundIntervalInput';
        roundIntervalInput.type = 'number';
        roundIntervalInput.min = '100';
        roundIntervalInput.value = localStorage.getItem(ROUND_INTERVAL_KEY) || ROUND_INTERVAL.toString();
        roundIntervalInput.placeholder = '轮次间隔时间(ms)';
        roundIntervalInput.style.cssText = `
            margin-bottom: 5px;
            padding: 5px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 3px;
        `;
        roundIntervalInput.addEventListener('mousedown', (e) => e.stopPropagation());
        roundIntervalInput.addEventListener('touchstart', (e) => e.stopPropagation());
        const setRoundIntervalButton = document.createElement('button');
        setRoundIntervalButton.textContent = '设置间隔时间';
        setRoundIntervalButton.style.cssText = `
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-bottom: 10px;
        `;

        container.appendChild(input);
        container.appendChild(addButton);
        container.appendChild(tokenList);
        container.appendChild(maxRoundsInput);
        container.appendChild(setMaxRoundsButton);
        container.appendChild(roundIntervalInput);
        container.appendChild(setRoundIntervalButton);

        // 添加事件监听器
        addButton.addEventListener('click', () => {
            const token = input.value.trim();
            if (token) {
                addToken(token);
                input.value = '';
                updateTokenList();
            } else {
                alert('请输入有效的 accessToken');
            }
        });

        maxRoundsInput.addEventListener('blur', function() {
            this.value = validateNumberInput(this, 1);
        });

        setMaxRoundsButton.addEventListener('click', () => {
            const maxRounds = validateNumberInput(maxRoundsInput, 1);
            if (maxRounds !== '') {
                localStorage.setItem(MAX_ROUNDS_KEY, maxRounds);
                alert(`最大轮数已设置为 ${maxRounds}`);
            } else {
                alert('请输入有效的最大轮数');
            }
        });

        roundIntervalInput.addEventListener('blur', function() {
            this.value = validateNumberInput(this, 100);
        });

        setRoundIntervalButton.addEventListener('click', () => {
            const interval = validateNumberInput(roundIntervalInput, 100);
            if (interval !== '') {
                localStorage.setItem(ROUND_INTERVAL_KEY, interval);
                alert(`轮次间隔时间已设置为 ${interval}ms`);
            } else {
                alert('请输入有效的间隔时间');
            }
        });

        return container;
    }

    function createStatusDisplay() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'scriptStatusDisplay';
        statusDiv.style.cssText = `
            background-color: rgba(0, 0, 0, 0.1);
            color: black;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
        `;
        return statusDiv;
    }

    function createResponseLog() {
        const logContainer = document.createElement('div');
        logContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-top: 10px;
        `;

        const logTitle = document.createElement('div');
        logTitle.textContent = '请求日志';
        logTitle.style.cssText = `
            font-weight: bold;
            margin-bottom: 5px;
        `;

        const logDiv = document.createElement('div');
        logDiv.id = 'responseLogDisplay';
        logDiv.style.cssText = `
            background-color: rgba(0, 0, 0, 0.1);
            color: black;
            padding: 10px;
            border-radius: 5px;
            height: 200px;
            overflow-y: auto;
            font-size: 12px;
        `;

        logContainer.appendChild(logTitle);
        logContainer.appendChild(logDiv);

        return logContainer;
    }

    function validateNumberInput(input, minValue) {
        if (input.value === '') return '';
        const value = parseInt(input.value);
        if (isNaN(value) || value < minValue) {
            return minValue.toString();
        }
        return value.toString();
    }

    function addToken(token) {
        let tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '[]');
        if (!tokens.some(t => t.token === token)) {
            if (tokens.length < 5) {
                tokens.push({ token: token, enabled: true });
                localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
                updateStatus(`Token 添加成功: ...${token.slice(-5)}`);
            } else {
                alert('最多只能添加5个Token');
            }
        } else {
            alert('该Token已存在');
        }
    }

    function toggleToken(index) {
        let tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '[]');
        if (tokens[index]) {
            tokens[index].enabled = !tokens[index].enabled;
            localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
        }
    }
    
    function removeToken(index) {
        let tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '[]');
        tokens.splice(index, 1);
        localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
        updateTokenList();
    }

    function updateTokenList() {
        const tokenList = document.getElementById('tokenList');
        let tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '[]');
        
        // 确保所有的 token 都是对象格式
        tokens = tokens.map(token => {
            if (typeof token === 'string') {
                return { token: token, enabled: true };
            }
            return token;
        });
    
        // 保存转换后的格式
        localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    
        if (tokenList) {
            tokenList.innerHTML = '';
            tokens.forEach((tokenObj, index) => {
                const tokenElement = document.createElement('div');
                tokenElement.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                `;
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = tokenObj.enabled !== false;  // 默认为 true
                checkbox.addEventListener('change', () => toggleToken(index));
    
                const tokenText = document.createElement('span');
                if (tokenObj.token) {
                    tokenText.textContent = '...' + tokenObj.token.slice(-15);
                } else {
                    tokenText.textContent = 'Invalid Token';
                    console.error('Invalid token object:', tokenObj);
                }
                
                const removeButton = document.createElement('button');
                removeButton.textContent = '删除';
                removeButton.style.cssText = `
                    padding: 2px 5px;
                    background-color: #f44336;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                `;
                removeButton.addEventListener('click', () => removeToken(index));
                
                tokenElement.appendChild(checkbox);
                tokenElement.appendChild(tokenText);
                tokenElement.appendChild(removeButton);
                tokenList.appendChild(tokenElement);
            });
        }
    }


    function updateStatus(message) {
        const statusDiv = document.getElementById('scriptStatusDisplay');
        if (statusDiv) {
            statusDiv.innerHTML = message;
        }
    }

    function updateResponseLog(message) {
        const logDiv = document.getElementById('responseLogDisplay');
        if (logDiv) {
            const logEntry = document.createElement('div');
            logEntry.innerHTML = message;
            logDiv.insertBefore(logEntry, logDiv.firstChild);

            // 保存到localStorage
            let logs = JSON.parse(localStorage.getItem(RESPONSE_LOG_KEY) || '[]');
            logs.unshift(message);
            if (logs.length > 100) logs = logs.slice(0, 100); // 限制日志数量
            localStorage.setItem(RESPONSE_LOG_KEY, JSON.stringify(logs));

            // 滚动到顶部
            logDiv.scrollTop = 0;
        }
    }

    function loadResponseLog() {
        const logDiv = document.getElementById('responseLogDisplay');
        if (logDiv) {
            const logs = JSON.parse(localStorage.getItem(RESPONSE_LOG_KEY) || '[]');
            logDiv.innerHTML = logs.join('<br>');
        }
    }

    function clearResponseLog() {
        localStorage.removeItem(RESPONSE_LOG_KEY);
        const logDiv = document.getElementById('responseLogDisplay');
        if (logDiv) {
            logDiv.innerHTML = '';
        }
    }

    function toggleScript() {
        const isEnabled = localStorage.getItem(SCRIPT_ENABLED_KEY) === 'true';
        const newState = !isEnabled;
        localStorage.setItem(SCRIPT_ENABLED_KEY, newState.toString());

        const button = document.getElementById('scriptToggleButton');
        if (newState) {
            button.textContent = '停止运行';
            button.style.backgroundColor = '#4CAF50';
            clearResponseLog();
            startScript();
        } else {
            button.textContent = '启动运行';
            button.style.backgroundColor = '#f44336';
            stopScript();
        }
    }

    function startScript() {
        currentRound = 0;
        waitForNextHour();
    }

    function stopScript() {
        clearTimeout(timer);
        updateStatus('已停止运行');
    }

    function disableToken(index) {
        let tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '[]');
        if (tokens[index]) {
            tokens[index].enabled = false;
            localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
            updateTokenList(); // 更新 UI
        }
    }

    async function performActionsForAllTokens() {
        if (localStorage.getItem(SCRIPT_ENABLED_KEY) !== 'true') {
            updateStatus('已停止运行');
            return;
        }

        const now = new Date();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();

        // 如果不是在前两分钟内执行，则可能是由于刷新页面导致的，需要重新等待
        if (currentMinutes >= 2 || (currentMinutes === 1 && currentSeconds >= 60)) {
            waitForNextHour();
            return;
        }

        const maxRounds = parseInt(localStorage.getItem(MAX_ROUNDS_KEY)) ?? DEFAULT_MAX_ROUNDS;
        currentRound++;

        if (currentRound > maxRounds) {
            updateStatus(`已达到最大轮数 ${maxRounds}，等待下一个小时重新开始`);
            waitForNextHour();
            return;
        }


        const tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '[]');
        const startTime = Date.now();
    
        for (let i = 0; i < Math.min(tokens.length, 5); i++) {
            if (tokens[i] && tokens[i].enabled && tokens[i].token) {
                const response = await performActions(tokens[i].token, i + 1);
                if (localStorage.getItem(SCRIPT_ENABLED_KEY) !== 'true') {
                    // 脚本已停止，退出循环
                    return;
                }
                if (response && response.includes("您今日【茉莉奶绿免单券】已达领取上限")) {
                    disableToken(i);
                    updateStatus(`Token ${i + 1} 已达到领取上限，已自动禁用`);
                }
                if (i < Math.min(tokens.length, 5) - 1) {
                    await new Promise(resolve => setTimeout(resolve, TOKEN_INTERVAL));
                }
            }
        }

        const roundInterval = parseInt(localStorage.getItem(ROUND_INTERVAL_KEY) ?? '') || ROUND_INTERVAL;
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, roundInterval - elapsedTime);

        updateStatus(`本轮执行完成（${currentRound}/${maxRounds}），等待${remainingTime}ms后开始下一轮`);
        await new Promise(resolve => setTimeout(resolve, remainingTime));

        performActionsForAllTokens(); // 开始下一轮
    }

    function stopScriptDueToSecurity() {
        localStorage.setItem(SCRIPT_ENABLED_KEY, 'false');
        clearTimeout(timer);
        updateStatus('已停止运行：检测到安全威胁');
        
        const button = document.getElementById('scriptToggleButton');
        if (button) {
            button.textContent = '启动运行';
            button.style.backgroundColor = '#f44336';
        }
    
        alert('IP已被风控，请更换IP。手机可切换飞行模式，宽带可重新拨号进行尝试');
    }

    async function performActions(token, index) {
        window.sessionStorage.setItem("accessToken", token);

        // 获取口令
        let secretElement = document.querySelector('.secret-tip');
        if (!secretElement) {
            updateStatus(`Token ${index}: 未找到口令元素，跳过...`);
            return;
        }
        let secret = secretElement?.textContent?.split('：')[1] || '';

        // 填入输入框
        let input = document.querySelector('input[placeholder="请输入口令"]');
        if (!input) {
            updateStatus(`Token ${index}: 未找到输入框，跳过...`);
            return;
        }
        input.value = secret;

        // 触发输入事件
        let event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);


        // 点击提交按钮
        let button = document.querySelector('button.sure-btn');
        if (!button) {
            updateStatus(`Token ${index}: 未找到提交按钮，跳过...`);
            return null;
        }
        button.click();
    
        // 等待响应
        return new Promise(resolve => {
            const checkResponse = setInterval(() => {
                const responseLog = localStorage.getItem(RESPONSE_LOG_KEY);
                if (responseLog) {
                    const logs = JSON.parse(responseLog);
                    if (logs.length > 0) {
                        clearInterval(checkResponse);
                        const latestResponse = logs[0];
                        if (latestResponse.includes("安全威胁")) {
                            stopScriptDueToSecurity();
                        }
                        resolve(latestResponse);
                    }
                }
            }, 100);
        });
    }

    function refreshAndExecute() {
        location.reload();
    }

    function waitForNextHour() {
        if (localStorage.getItem(SCRIPT_ENABLED_KEY) !== 'true') {
            updateStatus('已停止运行');
            return;
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();

        // 计算下一次执行时间
        let nextExecutionTime;
        if (currentHour >= 20 || currentHour < 11) {
            // 如果当前时间在20:00之后或11:00之前，设置下一次执行时间为次日11:00
            nextExecutionTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (currentHour >= 20 ? 1 : 0), 11, 0, 0, 0);
        } else {
            // 否则，设置为下一个整点
            nextExecutionTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour + 1, 0, 0, 0);
        }

        // 检查是否在每小时的前两分钟内，且不在20:00-11:00之间
        if ((currentMinutes < 2 || (currentMinutes === 0 && currentSeconds < 60)) && (currentHour >= 11 && currentHour < 20)) {
            // 立即执行
            updateStatus('在0-1分钟内，立即开始执行');
            currentRound = 0;
            performActionsForAllTokens();
            return;
        }

        const delay = nextExecutionTime.getTime() - now.getTime();

        function updateCountdown() {
            if (localStorage.getItem(SCRIPT_ENABLED_KEY) !== 'true') {
                updateStatus('已停止运行');
                return;
            }

            const remainingTime = Math.max(0, Math.floor((nextExecutionTime.getTime() - new Date().getTime()) / 1000));
            const tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '[]');
            const maxRounds = localStorage.getItem(MAX_ROUNDS_KEY) || DEFAULT_MAX_ROUNDS;
            const roundInterval = localStorage.getItem(ROUND_INTERVAL_KEY) || ROUND_INTERVAL;

            updateStatus(`下次执行时间: ${nextExecutionTime.toLocaleString()}<br>
                          剩余秒数: ${remainingTime}<br>
                          Token 数量: ${tokens.length}<br>
                          最大轮数: ${maxRounds}<br>
                          轮次间隔: ${roundInterval}ms`);

            if (remainingTime > 0) {
                requestAnimationFrame(updateCountdown);
            } else {
                // 到达执行时间，开始执行操作
                performActionsForAllTokens().catch(error => {
                    console.error('执行操作时发生错误:', error);
                    updateStatus('执行操作时发生错误，请检查控制台');
                });
            }
        }

        updateCountdown();
    }

    function interceptXHR() {
        const XHR = XMLHttpRequest.prototype;
        const open = XHR.open;
        const send = XHR.send;
    
        XHR.open = function(method, url) {
            this._url = url;
            return open.apply(this, arguments);
        };
    
        XHR.send = function() {
            this.addEventListener('load', function() {
                if (this._url.includes('/api/v1/h5/marketing/secretword/confirm')) {
                    const response = this.responseText;
                    const timestamp = new Date().toLocaleString();
                    const logEntry = `[${timestamp}] Response: ${response}`;
                    updateResponseLog(logEntry);
                    
                    // 更新 localStorage
                    let logs = JSON.parse(localStorage.getItem(RESPONSE_LOG_KEY) || '[]');
                    logs.unshift(logEntry);
                    if (logs.length > 100) logs = logs.slice(0, 100);
                    localStorage.setItem(RESPONSE_LOG_KEY, JSON.stringify(logs));
    
                    // 检查安全威胁
                    if (response.includes("安全威胁")) {
                        stopScriptDueToSecurity();
                    }
                }
            });
            return send.apply(this, arguments);
        };
    }

    function ensurePanelInteractivity() {
        const panel = document.getElementById('scriptControlPanel');
        if (panel) {
            if (document.body.classList.contains('van-toast--unclickable')) {
                panel.style.pointerEvents = 'auto';
                Array.from(panel.getElementsByTagName('*')).forEach(element => {
                    element.style.pointerEvents = 'auto';
                });
            } else {
                panel.style.pointerEvents = '';
                Array.from(panel.getElementsByTagName('*')).forEach(element => {
                    element.style.pointerEvents = '';
                });
            }
        }
        requestAnimationFrame(ensurePanelInteractivity);
    }
    // 脚本开始执行
    function initScript() {
        interceptXHR();
        const panel = createFloatingPanel();
        document.body.appendChild(panel);
        loadResponseLog();
        updateTokenList();

        if (localStorage.getItem(SCRIPT_ENABLED_KEY) !== 'true') {
            localStorage.setItem(SCRIPT_ENABLED_KEY, 'true');
        }

        waitForNextHour();
        ensurePanelInteractivity();
    }

    // 确保DOM加载完成后再初始化脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();