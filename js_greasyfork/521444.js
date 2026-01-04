// ==UserScript==
// @name         硅基流动Token检测器（优化版）
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  检测硅基流动Token有效性的工具，优化以减少冲突
// @author       Your name
// @match        *://linux.do/*
// @grant        GM_xmlhttpRequest
// @connect      api.siliconflow.cn
// @downloadURL https://update.greasyfork.org/scripts/521444/%E7%A1%85%E5%9F%BA%E6%B5%81%E5%8A%A8Token%E6%A3%80%E6%B5%8B%E5%99%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521444/%E7%A1%85%E5%9F%BA%E6%B5%81%E5%8A%A8Token%E6%A3%80%E6%B5%8B%E5%99%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .sf-token-checker-container {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 400px;
            max-height: 80vh;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 999998;
            overflow-y: auto;
            overscroll-behavior: contain;
            touch-action: pan-y;
        }
        .sf-token-checker-container * {
            color: #2c3e50;
            font-size: 14px;
        }
        .sf-token-checker-container h1 {
            font-size: 18px;
            margin: 10px 0 30px 0;
            padding-right: 60px;
        }
        .sf-token-checker-container h2 {
            font-size: 16px;
            margin: 10px 0;
        }
        .sf-floating-button {
            position: fixed;
            width: 50px;
            height: 50px;
            background-color: rgba(52, 152, 219, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white !important;
            cursor: move;
            z-index: 999999;
            touch-action: none;
            user-select: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: left 0.3s ease-out;
        }
        .sf-token-checker-container textarea {
            width: 100%;
            height: 80px;
            margin-bottom: 20px;
            padding: 15px;
            background: #2c3e50 !important;
            border: 1px solid #2c3e50;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
            transition: border-color 0.3s ease;
            color: #ffffff !important;
        }
        .sf-token-checker-container textarea::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
        }
        .sf-token-checker-container button {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: rgba(52, 152, 219, 0.9);
            color: #fff !important;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .sf-results {
            margin-top: 30px;
        }
        .sf-results-content {
            background: rgba(249, 249, 249, 0.8);
            padding: 15px;
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            font-size: 14px;
            max-height: 30vh;
            overflow-y: auto;
        }
        #sf-validResults {
            background: rgba(46, 204, 113, 0.1);
            border-left: 4px solid #2ecc71;
            white-space: pre-wrap;
        }
        #sf-invalidResults {
            background: rgba(231, 76, 60, 0.1);
            border-left: 4px solid #e74c3c;
        }
        .sf-invalid-token {
            background: rgba(255, 236, 236, 0.9);
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .sf-invalid-token-content {
            display: flex;
            flex-direction: column;
        }
        .sf-invalid-token-token {
            font-family: monospace;
            background: rgba(255, 255, 255, 0.9);
            padding: 6px;
            border-radius: 3px;
            margin-bottom: 6px;
            border: 1px solid #ffcccb;
            word-break: break-all;
        }
        .sf-invalid-token-message {
            color: #c0392b;
            font-weight: bold;
        }
        .sf-loader {
            border: 4px solid rgba(243, 243, 243, 0.8);
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: sf-spin 1s linear infinite;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
        }
        @keyframes sf-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .sf-copy-button {
            background-color: rgba(39, 174, 96, 0.9);
            margin-top: 10px;
        }
        .sf-refresh-button {
            position: absolute;
            top: 10px;
            right: 50px;
            width: 30px;
            height: 30px;
            background-color: rgba(52, 152, 219, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s ease;
            z-index: 1000000;
        }
        .sf-refresh-button:hover {
            transform: rotate(180deg);
        }
        .sf-refresh-icon {
            width: 18px;
            height: 18px;
            color: white;
        }
        .sf-close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background-color: rgba(231, 76, 60, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s ease;
            z-index: 1000000;
        }
        .sf-close-button:hover {
            transform: rotate(90deg);
        }
        .sf-close-icon {
            width: 18px;
            height: 18px;
            color: white;
        }
        .sf-total-balance {
            font-weight: bold;
            margin-top: 10px;
            font-size: 16px;
            color: #27ae60;
        }
        .sf-copy-dropdown {
            position: relative;
            display: inline-block;
            width: 100%;
        }
        .sf-copy-dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
            width: 100%;
        }
        .sf-copy-dropdown-content button {
            color: black !important;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            width: 100%;
            text-align: left;
            background-color: #f9f9f9;
        }
        .sf-copy-dropdown-content button:hover {
            background-color: #f1f1f1;
        }
        .sf-copy-dropdown.active .sf-copy-dropdown-content {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // 创建浮动按钮和容器
    const floatingButton = document.createElement('div');
    floatingButton.className = 'sf-floating-button';
    floatingButton.innerHTML = 'Token';
    floatingButton.style.left = '-25px';
    floatingButton.style.top = '100px';
    
    const container = document.createElement('div');
    container.className = 'sf-token-checker-container';
    container.innerHTML = `
        <h1>硅基流动Token有效性检测</h1>
        <div class="sf-refresh-button" id="sf-refreshButton">
            <svg class="sf-refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
        </div>
        <div class="sf-close-button" id="sf-closeButton">
            <svg class="sf-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </div>
        <textarea id="sf-tokens" placeholder="请输入sk token，可用空格、换行或逗号分隔"></textarea>
        <button id="sf-checkButton">检测账号</button>
        <div class="sf-results">
            <h2>有效账号 (包含余额)</h2>
            <div id="sf-validResults" class="sf-results-content"></div>
            <div id="sf-totalBalance" class="sf-total-balance"></div>
            <div class="sf-copy-dropdown">
                <button class="sf-copy-button" id="sf-copyDropdownButton">复制可用账号</button>
                <div class="sf-copy-dropdown-content">
                    <button id="sf-copyTokens">仅复制Token</button>
                    <button id="sf-copyTokensWithBalance">复制Token和余额</button>
                </div>
            </div>
            <h2>无效账号</h2>
            <div id="sf-invalidResults" class="sf-results-content"></div>
        </div>
    `;
    document.body.appendChild(floatingButton);
    document.body.appendChild(container);
    
    // 拖动相关变量和函数
    let isDragging = false;
    let initialX, initialY;
    let currentX = 0;
    let currentY = 0;
    let xOffset = 0;
    let yOffset = 0;
    let hideTimeout;
    let lastPosition = { x: 10, y: 100 };
    
    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
        } else {
            initialX = e.clientX;
            initialY = e.clientY;
        }
        
        const rect = floatingButton.getBoundingClientRect();
        xOffset = rect.left;
        yOffset = rect.top;
        
        if (e.target === floatingButton) {
            isDragging = true;
        }
        clearTimeout(hideTimeout);
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            let clientX, clientY;
            if (e.type === "touchmove") {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            const dx = clientX - initialX;
            const dy = clientY - initialY;
            let newX = xOffset + dx;
            let newY = yOffset + dy;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const buttonWidth = floatingButton.offsetWidth;
            const buttonHeight = floatingButton.offsetHeight;
            newX = Math.max(0, Math.min(windowWidth - buttonWidth, newX));
            newY = Math.max(0, Math.min(windowHeight - buttonHeight, newY));
            floatingButton.style.left = `${newX}px`;
            floatingButton.style.top = `${newY}px`;
            floatingButton.style.transform = 'none';
            currentX = newX;
            currentY = newY;
        }
    }
    
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        lastPosition = { x: currentX, y: currentY };
        hideTimeout = setTimeout(() => {
            const windowWidth = window.innerWidth;
            if (currentX < windowWidth / 2) {
                floatingButton.style.left = '-25px';
            } else {
                floatingButton.style.left = `${windowWidth - 25}px`;
            }
        }, 2000);
    }
    
    // 检测token函数
    async function checkToken(token) {
        try {
            const balanceResponse = await fetch('https://api.siliconflow.cn/v1/user/info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const balanceData = await balanceResponse.json();
            
            if (balanceResponse.ok) {
                const balance = balanceData.data.totalBalance;
                if (balance <= 0) {
                    return { token, isValid: false, message: `余额 ${balance}`, balance };
                }
                
                const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "model": "Qwen/Qwen2.5-72B-Instruct",
                        "messages": [{"role": "user", "content": "hi"}],
                        "max_tokens": 100,
                        "stream": false
                    })
                });
                if (response.ok) {
                    return { token, isValid: true, balance };
                } else {
                    const errorData = await response.json();
                    return { token, isValid: false, message: translateErrorMessage(errorData.message), balance };
                }
            } else {
                return { token, isValid: false, message: '获取余额失败' };
            }
        } catch (error) {
            return { token, isValid: false, message: `请求失败: ${error.message}` };
        }
    }
    
    // 错误信息翻译函数
    function translateErrorMessage(message) {
        const errorMap = {
            'Invalid API key': 'API密钥无效',
            'You exceeded your current quota': '已超出当前配额',
            'Rate limit reached': '达到速率限制',
            'The model is currently overloaded': '模型当前过载',
            'The engine is currently overloaded': '引擎当前过载'
        };
        return errorMap[message] || '未知错误';
    }
    
    // 检测所有token
    async function checkTokens() {
        const tokensTextarea = document.getElementById('sf-tokens');
        const checkButton = document.getElementById('sf-checkButton');
        const validResults = document.getElementById('sf-validResults');
        const invalidResults = document.getElementById('sf-invalidResults');
        const copyButton = document.querySelector('.sf-copy-dropdown');
        const totalBalanceElement = document.getElementById('sf-totalBalance');
        const tokens = tokensTextarea.value.split(/[\s,]+/).filter(token => token.trim() !== '');
        if (tokens.length === 0) {
            alert('请输入至少一个token');
            return;
        }
        checkButton.disabled = true;
        checkButton.innerHTML = '<span class="sf-loader"></span>检测中：0%';
        validResults.textContent = '';
        invalidResults.innerHTML = '';
        copyButton.style.display = 'none';
        totalBalanceElement.textContent = '';
        
        let completed = 0;
        let totalBalance = 0;
        const results = await Promise.all(tokens.map(async (token) => {
            const result = await checkToken(token);
            completed++;
            const progress = Math.floor((completed / tokens.length) * 100);
            checkButton.innerHTML = `<span class="sf-loader"></span>检测中：${progress}%`;
            return result;
        }));
        
        const validTokens = results.filter(r => r.isValid);
        const invalidTokens = results.filter(r => !r.isValid);
        
        // 对有效token按余额从高到低排序
        validTokens.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
        
        validTokens.forEach(r => {
            validResults.textContent += `${r.token} (余额: ${r.balance})\n`;
            totalBalance += parseFloat(r.balance);
        });
        invalidTokens.forEach(result => {
            const div = document.createElement('div');
            div.className = 'sf-invalid-token';
            div.innerHTML = `
                <div class="sf-invalid-token-content">
                    <div class="sf-invalid-token-token">${result.token}</div>
                    <div class="sf-invalid-token-message">${result.message}</div>
                </div>
            `;
            invalidResults.appendChild(div);
        });
        if (validTokens.length > 0) {
            copyButton.style.display = 'block';
            totalBalanceElement.textContent = `总余额: ${totalBalance.toFixed(2)}`;
        }
        checkButton.disabled = false;
        checkButton.textContent = '检测账号';
    }
    
    // 复制功能
    function copyValidTokens(includeBalance = false) {
        const validResults = document.getElementById('sf-validResults');
        const tokens = validResults.textContent.split('\n').filter(line => line.trim() !== '');
        let textToCopy;
        if (includeBalance) {
            textToCopy = tokens.join('\n');
        } else {
            textToCopy = tokens.map(line => line.split(' ')[0]).join('\n');
        }
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('已复制到剪贴板');
        
        // 复制后自动收回下拉菜单
        document.querySelector('.sf-copy-dropdown').classList.remove('active');
    }
    
    // 重置面板功能
    function resetPanel() {
        const tokensTextarea = document.getElementById('sf-tokens');
        const validResults = document.getElementById('sf-validResults');
        const invalidResults = document.getElementById('sf-invalidResults');
        const copyButton = document.querySelector('.sf-copy-dropdown');
        const checkButton = document.getElementById('sf-checkButton');
        const totalBalanceElement = document.getElementById('sf-totalBalance');
        tokensTextarea.value = '';
        validResults.textContent = '';
        invalidResults.innerHTML = '';
        copyButton.style.display = 'none';
        checkButton.disabled = false;
        checkButton.textContent = '检测账号';
        totalBalanceElement.textContent = '';
    }
    
    // 添加事件监听
    floatingButton.addEventListener('click', () => {
        const rect = floatingButton.getBoundingClientRect();
        if (rect.left < 0 || rect.left > window.innerWidth - rect.width) {
            floatingButton.style.left = `${lastPosition.x}px`;
            floatingButton.style.top = `${lastPosition.y}px`;
        }
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });
    floatingButton.addEventListener('touchstart', dragStart, false);
    floatingButton.addEventListener('touchend', dragEnd, false);
    floatingButton.addEventListener('touchmove', drag, false);
    floatingButton.addEventListener('mousedown', dragStart, false);
    floatingButton.addEventListener('mouseup', dragEnd, false);
    floatingButton.addEventListener('mousemove', drag, false);
    document.getElementById('sf-checkButton').addEventListener('click', checkTokens);
    document.getElementById('sf-copyTokens').addEventListener('click', () => copyValidTokens(false));
    document.getElementById('sf-copyTokensWithBalance').addEventListener('click', () => copyValidTokens(true));
    document.getElementById('sf-refreshButton').addEventListener('click', resetPanel);
    document.getElementById('sf-closeButton').addEventListener('click', () => {
        container.style.display = 'none';
    });
    
    // 复制下拉菜单切换
    document.getElementById('sf-copyDropdownButton').addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelector('.sf-copy-dropdown').classList.toggle('active');
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sf-copy-dropdown')) {
            document.querySelector('.sf-copy-dropdown').classList.remove('active');
        }
    });
    
    // 阻止面板内的触摸事件传播到背景
    container.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: false });
    
    // 初始化状态
    container.style.display = 'none';
    floatingButton.style.left = '-25px';
})();