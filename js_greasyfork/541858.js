// ==UserScript==
// @name         Chatgpt Pro 
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  多密钥支持、拖动、主题切换、卡通猫背景、最小化/隐藏、真实 Assistants 聊天，使用很方便。
// @author       maken
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541858/Chatgpt%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/541858/Chatgpt%20Pro.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function safeGetValue(key, def = '') {
        if (typeof GM_getValue === 'function') return GM_getValue(key, def);
        try { return localStorage.getItem(key) ?? def; } catch { return def; }
    }
    function safeSetValue(key, val) {
        if (typeof GM_setValue === 'function') return GM_setValue(key, val);
        try { localStorage.setItem(key, val); } catch { }
    }
    const CONFIG = {
        customKey: safeGetValue('gcui_apiKey', ''),
        assistantId: safeGetValue('gcui_assistantId', 'asst_你的ID'),
        theme: safeGetValue('gcui_theme', 'pink'),
        expanded: true,
        posX: Number(safeGetValue('gcui_posX', 100)),
        posY: Number(safeGetValue('gcui_posY', 100))
    };
    const assistantState = { threadId: '' };
    const state = {
        container: null, header: null, body: null, inputArea: null,
        input: null, sendBtn: null, themeBtn: null, keyBtn: null,
        toggleBtn: null, hideBtn: null, statusIcon: null
    };
    function getCurrentApiKey() {
        return CONFIG.customKey || '';
    }
    function savePosition(x, y) {
        safeSetValue('gcui_posX', x);
        safeSetValue('gcui_posY', y);
    }
    function showMessage(sender, text) {
        const msg = document.createElement('div');
        Object.assign(msg.style, {
            marginBottom: '8px', wordBreak: 'break-word',
            backgroundColor: sender === '我' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
            padding: '6px 10px', borderRadius: '6px',
            alignSelf: sender === '我' ? 'flex-end' : 'flex-start',
            maxWidth: '80%'
        });
        msg.innerHTML = `<strong style="color:${sender === '我' ? '#d6006e' : '#333'}">${sender}:</strong> ${text}`;
        state.body.appendChild(msg);
        state.body.scrollTop = state.body.scrollHeight;
    }
    function updateStatusIcon(color, status) {
        state.statusIcon.style.backgroundColor = color;
        state.statusIcon.title = status;
    }
    async function initThread() {
        try {
            const apiKey = getCurrentApiKey();
            if (!apiKey || !CONFIG.assistantId.startsWith('asst_')) {
                GM_notification({ text: 'API Key 或 Assistant ID 无效，请检查设置。', timeout: 3000 });
                updateStatusIcon('red', '无效的 API Key 或 Assistant ID');
                return;
            }
            const headers = {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2'
            };
            // 创建新线程
const threadRes = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers,
    body: JSON.stringify({})
});
const threadData = await threadRes.json();
if (threadRes.ok) {
    assistantState.threadId = threadData.id;
    updateStatusIcon('green', '连接正常');
    console.log('成功创建线程：', assistantState.threadId);
} else {
    throw new Error(threadData.error.message);
}
        } catch (error) {
            console.error('初始化线程失败:', error);
            GM_notification({ text: `初始化线程失败: ${error.message}`, timeout: 3000 });
            updateStatusIcon('red', '初始化线程失败');
        }
    }
    async function sendMessage() {
        const inputText = state.input.value.trim();
        if (!inputText) return;

        const apiKey = getCurrentApiKey();
        if (!apiKey || !CONFIG.assistantId.startsWith('asst_')) {
            GM_notification({ text: '请设置有效的 API Key 和 Assistant ID', timeout: 2000 });
            return;
        }
        showMessage('我', inputText);
        state.input.value = '';
        state.input.focus();
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
        };
        if (!assistantState.threadId) {
            await initThread();
            if (!assistantState.threadId) return;
        }
        try {
            const messageRes = await fetch(`https://api.openai.com/v1/threads/${assistantState.threadId}/messages`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ role: 'user', content: inputText })
            });
            const messageData = await messageRes.json();
            if (messageRes.ok) {
                console.log('成功发送消息: ', messageData);
            } else {
                throw new Error(messageData.error.message);
            }
            const runRes = await fetch(`https://api.openai.com/v1/threads/${assistantState.threadId}/runs`, {
                method: 'POST', headers,
                body: JSON.stringify({ assistant_id: CONFIG.assistantId })
            });
            const runData = await runRes.json();
            const runId = runData.id;

            let status = 'queued';
            while (status !== 'completed' && status !== 'failed') {
                await new Promise(r => setTimeout(r, 1500)); // 等待
                const statusRes = await fetch(`https://api.openai.com/v1/threads/${assistantState.threadId}/runs/${runId}`, { headers });
                const statusData = await statusRes.json();
                status = statusData.status;
            }
            const msgRes = await fetch(`https://api.openai.com/v1/threads/${assistantState.threadId}/messages`, { headers });
            const msgData = await msgRes.json();
            const assistantMsgs = msgData.data.filter(m => m.role === 'assistant');
            const reply = assistantMsgs[0]?.content?.[0]?.text?.value || '⚠️ 无有效回复';
            showMessage('AI', reply);
        } catch (e) {
            console.error('发送消息失败:', e);
            GM_notification({ text: `发送消息失败: ${e.message}`, timeout: 3000 });
            updateStatusIcon('red', '发送消息失败');
        }
    }
    function updateTheme() {
        const t = CONFIG.theme;
        const { container, body, inputArea, sendBtn, themeBtn } = state;
        container.style.backgroundColor = t === 'pink' ? '#ffc0d9' : '#2c2c2c';
        state.header.style.backgroundColor = t === 'pink' ? '#ff66b2' : '#444';
        body.style.color = t === 'pink' ? '#333' : '#ddd';
        if (t === 'pink') {
            body.style.backgroundImage = 'url("https://img.redocn.com/sheji/20240607/keaikatongmaosucaituAItu_13339783.jpg")';
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundPosition = 'bottom right';
            body.style.backgroundSize = '150px';
            body.style.backgroundColor = '#fff0f7';
            themeBtn.textContent = '🌙';
        } else {
            body.style.backgroundImage = 'none';
            body.style.backgroundColor = '#222';
            themeBtn.textContent = '☀️';
        }
        inputArea.style.backgroundColor = t === 'pink' ? '#ffd6e8' : '#333';
        sendBtn.style.backgroundColor = t === 'pink' ? '#ff66b2' : '#666';
    }
    async function buildUI() {
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed', top: CONFIG.posY + 'px', left: CONFIG.posX + 'px',
            width: '360px', height: '500px', borderRadius: '10px', zIndex: 99999,
            boxShadow: '0 0 10px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
        });
        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '8px 10px', fontSize: '16px', fontWeight: 'bold', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', cursor: 'grab'
        });
        const title = document.createElement('span');
        title.textContent = 'GlobalChat Pro';
        header.appendChild(title);
        const controls = document.createElement('div');
        controls.style.display = 'flex'; controls.style.gap = '5px';
        const themeBtn = document.createElement('button');
        themeBtn.textContent = '🌙';
        themeBtn.title = '切换主题';
        themeBtn.style.cssText = 'background:#fff;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;';
        themeBtn.onclick = () => {
            CONFIG.theme = CONFIG.theme === 'pink' ? 'dark' : 'pink';
            safeSetValue('gcui_theme', CONFIG.theme);
            updateTheme();
        };
        controls.appendChild(themeBtn);
        state.themeBtn = themeBtn;
        const keyBtn = document.createElement('button');
        keyBtn.textContent = '🔑';
        keyBtn.title = '设置 API Key 与 Assistant ID';
        keyBtn.style.cssText = themeBtn.style.cssText;
        keyBtn.onclick = () => {
            const key = prompt('请输入 API Key (sk-开头)', CONFIG.customKey);
            const aid = prompt('请输入 Assistant ID (asst_ 开头)', CONFIG.assistantId);
            if (key) safeSetValue('gcui_apiKey', key);
            if (aid) safeSetValue('gcui_assistantId', aid);
            CONFIG.customKey = key;
            CONFIG.assistantId = aid;
            GM_notification({ text: '密钥设置已保存', timeout: 1500 });
        };
        controls.appendChild(keyBtn);
        const statusIcon = document.createElement('div');
        statusIcon.style.width = '12px';
        statusIcon.style.height = '12px';
        statusIcon.style.borderRadius = '50%';
        statusIcon.style.backgroundColor = 'red'; // 初始为红色，表示未连接
        statusIcon.title = '未连接';
        header.appendChild(statusIcon);
        state.statusIcon = statusIcon;
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '🗕';
        toggleBtn.title = '最小化';
        toggleBtn.style.cssText = themeBtn.style.cssText;
        toggleBtn.onclick = () => {
            const show = state.body.style.display !== 'none';
            state.body.style.display = show ? 'none' : 'flex';
            state.inputArea.style.display = show ? 'none' : 'flex';
        };
        controls.appendChild(toggleBtn);
        const hideBtn = document.createElement('button');
        hideBtn.textContent = '👁️';
        hideBtn.title = '隐藏窗口';
        hideBtn.style.cssText = themeBtn.style.cssText;
        hideBtn.onclick = () => {
            state.container.style.display = 'none';
            setTimeout(() => {
                const btn = document.createElement('button');
                btn.textContent = '📢 显示聊天';
                btn.style.cssText = 'position:fixed;bottom:10px;left:10px;z-index:999999;padding:5px 10px;border-radius:6px;background:#ff66b2;color:#fff;border:none;cursor:pointer;';
                document.body.appendChild(btn);
                btn.onclick = () => { state.container.style.display = 'flex'; btn.remove(); };
            }, 100);
        };
        controls.appendChild(hideBtn);
        header.appendChild(controls);
        container.appendChild(header);
        state.header = header;
        const body = document.createElement('div');
        Object.assign(body.style, {
            flex: '1', overflowY: 'auto', padding: '10px',
            fontSize: '14px', display: 'flex', flexDirection: 'column'
        });
        container.appendChild(body);
        state.body = body;
        const inputArea = document.createElement('div');
        Object.assign(inputArea.style, {
            display: 'flex', gap: '5px', alignItems: 'center', padding: '10px',
            borderTop: '1px solid #ccc'
        });
        const input = document.createElement('textarea');
        input.rows = 2;
        input.placeholder = '请输入消息...';
        Object.assign(input.style, {
            flex: '1', resize: 'none', padding: '5px', borderRadius: '5px', border: '1px solid #ccc'
        });
        const sendBtn = document.createElement('button');
        sendBtn.textContent = '发送';
        sendBtn.style.cssText = 'padding:6px 15px;border:none;border-radius:5px;color:#fff;background:#ff66b2;cursor:pointer;';
        inputArea.appendChild(input);
        inputArea.appendChild(sendBtn);
        container.appendChild(inputArea);
        Object.assign(state, { container, input, sendBtn, inputArea });
        sendBtn.onclick = sendMessage;
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendBtn.click(); }
        });
        document.body.appendChild(container);
        updateTheme();
        // 拖动
        let dragging = false, offsetX = 0, offsetY = 0;
        header.addEventListener('mousedown', e => {
            dragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            header.style.cursor = 'grabbing';
        });
        document.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                header.style.cursor = 'grab';
                savePosition(container.offsetLeft, container.offsetTop);
            }
        });
        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            const x = e.clientX - offsetX, y = e.clientY - offsetY;
            container.style.left = Math.max(0, Math.min(x, window.innerWidth - container.offsetWidth)) + 'px';
            container.style.top = Math.max(0, Math.min(y, window.innerHeight - container.offsetHeight)) + 'px';
        });
    }
    buildUI();
})();
