// ==UserScript==
// @name         Deepseek Chat Monitor
// @version      2.0.0
// @description  The blocked thinking and response will be displayed on the right interface. 右侧界面会显示输出后被屏蔽的思考和回复内容。
// @match        https://chat.deepseek.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/762448
// @downloadURL https://update.greasyfork.org/scripts/524922/Deepseek%20Chat%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/524922/Deepseek%20Chat%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = '2.0.0';
    const logStyle = 'background: #222; color: #bada55; font-size: 12px';
    console.log(`%c[Deepseek Monitor] v${VERSION} 布局修复版启动...`, logStyle);

    // ==========================================
    // 全局状态与解析逻辑
    // ==========================================

    let streamState = {
        isThinking: false,
        thinkContent: '',
        responseContent: '',
        active: false
    };

    function resetStreamState() {
        streamState = {
            isThinking: false,
            thinkContent: '',
            responseContent: '',
            active: true
        };
        updateContentUI('', '');
        updateUIStatus('准备接收新回复...');
    }

    function parseChunk(chunk) {
        const lines = chunk.split('\n');
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonStr = line.substring(6).trim();
                if (jsonStr === '[DONE]') {
                    updateUIStatus('接收完成');
                    saveToHistory();
                    return;
                }
                try {
                    const data = JSON.parse(jsonStr);
                    processJsonData(data);
                } catch (e) {
                    // 忽略不完整的 JSON
                }
            }
        }
    }

    function processJsonData(data) {
        // A. 状态切换 (THINK vs RESPONSE)
        if (data.v && Array.isArray(data.v)) {
            data.v.forEach(op => {
                if (op.v && Array.isArray(op.v)) {
                    op.v.forEach(frag => {
                        if (frag.type === 'THINK') {
                            streamState.isThinking = true;
                            if (frag.content) appendContent(frag.content);
                        } else if (frag.type === 'RESPONSE') {
                            streamState.isThinking = false;
                            if (frag.content) appendContent(frag.content);
                        }
                    });
                }
            });
        }

        // B. 增量文本
        if (typeof data.v === 'string') {
            appendContent(data.v);
        }

        // C. 特定路径追加
        if (data.p && data.p.endsWith('/content') && typeof data.v === 'string') {
            appendContent(data.v);
        }
    }

    function appendContent(text) {
        if (!text) return;
        if (streamState.isThinking) {
            streamState.thinkContent += text;
        } else {
            streamState.responseContent += text;
        }
        updateContentUI(streamState.thinkContent, streamState.responseContent);
        updateUIStatus('正在接收数据...');
    }

    // ==========================================
    // 拦截器 1: Fetch
    // ==========================================
    const originalFetch = window.fetch;

    window.fetch = async function(input, init) {
        let url = 'unknown';

        try {
            if (typeof input === 'string') url = input;
            else if (input instanceof Request) url = input.url;
            else if (input instanceof URL) url = input.toString();
        } catch(e) {
            console.warn('[DS-Debug] URL解析失败', e);
        }

        // 匹配逻辑
        const isTarget = url && (url.includes('chat/completion') || url.includes('chat/completions') || url.includes('/api/v0/chat'));

        if (isTarget) {
            console.log(`%c[DS-Monitor] Fetch 拦截激活: ${url}`, 'color: green; font-weight: bold');
        }

        const response = await originalFetch(input, init);

        if (isTarget) {
            const clone = response.clone();
            const reader = clone.body.getReader();
            const decoder = new TextDecoder();

            resetStreamState();

            (async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, { stream: true });
                        parseChunk(chunk);
                    }
                } catch (err) {
                    console.error('[DS-Error] Fetch Stream:', err);
                }
            })();
        }

        return response;
    };

    // ==========================================
    // 拦截器 2: XHR (确保兼容性)
    // ==========================================
    const originalXHR = window.XMLHttpRequest;

    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        let lastLength = 0;
        let targetUrl = '';

        const originalOpen = xhr.open;
        xhr.open = function(method, url) {
            targetUrl = url;
            return originalOpen.apply(this, arguments);
        };

        xhr.addEventListener('progress', function() {
            const isTarget = targetUrl && (targetUrl.includes('chat/completion') || targetUrl.includes('chat/completions') || targetUrl.includes('/api/v0/chat'));

            if (isTarget) {
                if (lastLength === 0) {
                     console.log(`%c[DS-Monitor] XHR 拦截激活: ${targetUrl}`, 'color: orange');
                     resetStreamState();
                }
                const newChunk = xhr.responseText.substring(lastLength);
                lastLength = xhr.responseText.length;
                if (newChunk) parseChunk(newChunk);
            }
        });

        return xhr;
    };

    // ==========================================
    // UI 界面 (布局修复版)
    // ==========================================
    const containerId = 'ds-monitor-container';
    function initUI() {
        if (document.getElementById(containerId)) return;
        const container = document.createElement('div');
        container.id = containerId;
        const shadow = container.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            :host {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                height: 80vh;
                max-height: 600px;
                z-index: 99999;
                font-family: sans-serif;
                font-size: 14px;
                transition: transform 0.3s ease;
                /* 注意：背景和边框移到了 .wrapper 以确保布局正确 */
            }
            .wrapper {
                display: flex;
                flex-direction: column;
                height: 100%;          /* 关键：强制占满宿主高度 */
                width: 100%;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-radius: 8px;
            }
            .header {
                padding: 10px 15px;
                background: #2c3e50;
                color: white;
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }
            .content-area {
                flex: 1;               /* 自动占据剩余空间 */
                overflow-y: auto;      /* 仅此处滚动 */
                min-height: 0;         /* 关键：防止 flex 子元素溢出 */
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .block {
                background: white;
                padding: 10px;
                border-radius: 6px;
                border: 1px solid #dee2e6;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .think-block {
                background: #f1f3f5;
                color: #495057;
                border-left: 3px solid #ced4da;
            }
            .response-block {
                border-left: 3px solid #27ae60;
            }
            .controls {
                padding: 10px;
                border-top: 1px solid #dee2e6;
                display: flex;
                gap: 5px;
                background: #fff;
                border-radius: 0 0 8px 8px;
                flex-shrink: 0;        /* 禁止压缩 */
            }
            button {
                flex: 1;
                padding: 6px;
                cursor: pointer;
                border: 1px solid #ccc;
                background: #eee;
                border-radius: 4px;
            }
            button:hover { background: #ddd; }
            #toggle-btn {
                position: absolute;
                left: -40px;
                top: 10px;
                width: 30px;
                height: 30px;
                background: #2c3e50;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;

        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper'; // 添加类名以应用 flex 布局
        wrapper.innerHTML = `
            <button id="toggle-btn">👁️</button>
            <div class="header"><span>DS Monitor v${VERSION}</span><span id="status-text" style="font-size:12px">运行中</span></div>
            <div class="content-area" id="scroll-box">
                <div class="block think-block" id="think-box" style="display:none"><div style="font-size:11px;color:#888;margin-bottom:5px">THINKING</div><div id="think-content"></div></div>
                <div class="block response-block" id="response-box" style="display:none"><div style="font-size:11px;color:#888;margin-bottom:5px">RESPONSE</div><div id="response-content"></div></div>
            </div>
            <div class="controls">
                <button id="btn-copy">复制</button>
                <button id="btn-history">历史</button>
                <button id="btn-clear">清空</button>
            </div>
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        document.body.appendChild(container);
        bindEvents(shadow);
    }

    function updateContentUI(think, response) {
        const shadow = document.getElementById(containerId)?.shadowRoot;
        if (!shadow) return;
        const thinkBox = shadow.getElementById('think-box');
        const respBox = shadow.getElementById('response-box');

        if (think) { thinkBox.style.display = 'block'; shadow.getElementById('think-content').innerText = think; }
        else thinkBox.style.display = 'none';

        if (response) { respBox.style.display = 'block'; shadow.getElementById('response-content').innerText = response; }
        else respBox.style.display = 'none';

        // 自动滚动
        const scroll = shadow.getElementById('scroll-box');
        scroll.scrollTop = scroll.scrollHeight;
    }

    function updateUIStatus(text) {
        const shadow = document.getElementById(containerId)?.shadowRoot;
        if (shadow) shadow.getElementById('status-text').innerText = text;
    }

    function bindEvents(shadow) {
        const container = document.getElementById(containerId);
        shadow.getElementById('toggle-btn').addEventListener('click', () => {
            container.style.transform = container.style.transform === 'translateX(330px)' ? 'translateX(0)' : 'translateX(330px)';
        });
        shadow.getElementById('btn-clear').addEventListener('click', () => {
            updateContentUI('', '');
            streamState.thinkContent = '';
            streamState.responseContent = '';
        });
        shadow.getElementById('btn-copy').addEventListener('click', () => {
             navigator.clipboard.writeText((streamState.thinkContent + '\n\n' + streamState.responseContent).trim()).then(()=>alert('已复制'));
        });
        shadow.getElementById('btn-history').addEventListener('click', () => {
             const h = JSON.parse(localStorage.getItem('ds_monitor_history')||'[]');
             if(h.length && confirm('恢复最近一条历史？')) {
                 streamState.thinkContent = h[h.length-1].think;
                 streamState.responseContent = h[h.length-1].response;
                 updateContentUI(streamState.thinkContent, streamState.responseContent);
             } else { alert('无历史记录'); }
        });
    }

    function saveToHistory() {
        if (!streamState.responseContent && !streamState.thinkContent) return;
        const h = JSON.parse(localStorage.getItem('ds_monitor_history')||'[]');
        h.push({time: Date.now(), think: streamState.thinkContent, response: streamState.responseContent});
        if(h.length>10) h.shift();
        localStorage.setItem('ds_monitor_history', JSON.stringify(h));
    }

    window.addEventListener('load', initUI);
    setTimeout(initUI, 1000);
})();