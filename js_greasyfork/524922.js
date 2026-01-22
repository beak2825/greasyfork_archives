// ==UserScript==
// @name         Deepseek Chat Monitor
// @version      2.0.1
// @description  The blocked thinking and response will be displayed on the right interface. 右侧界面会显示输出后被屏蔽的思考和回复内容。
// @match        https://chat.deepseek.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/762448
// @downloadURL https://update.greasyfork.org/scripts/524922/Deepseek%20Chat%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/524922/Deepseek%20Chat%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = '2.0.1';
    const logStyle = 'background: #222; color: #bada55; font-size: 12px';
    console.log(`%c[Deepseek Monitor] v${VERSION} 稳定内核版启动...`, logStyle);

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

    // 单行解析逻辑 (从 parseChunk 拆分出来)
    function parseLine(line) {
        if (!line.startsWith('data: ')) return;

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
            // 忽略 JSON 错误，这通常是因为流结束时的空行
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
    // 拦截器 1: Fetch (带缓冲区修复)
    // ==========================================
    const originalFetch = window.fetch;

    window.fetch = async function(input, init) {
        let url = 'unknown';
        try {
            if (typeof input === 'string') url = input;
            else if (input instanceof Request) url = input.url;
            else if (input instanceof URL) url = input.toString();
        } catch(e) {}

        // 放宽匹配规则，适配更多地区/版本
        const isTarget = url && (
            url.includes('/chat/completion') ||
            url.includes('api/v0/chat')
        );

        const response = await originalFetch(input, init);

        if (isTarget) {
            console.log(`%c[DS-Monitor] Fetch 锁定流: ${url}`, 'color: green');
            const clone = response.clone();
            const reader = clone.body.getReader();
            const decoder = new TextDecoder();

            resetStreamState();

            // === 关键修复：引入 buffer 处理分包 ===
            let buffer = '';

            (async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        // 将新收到的数据拼接到缓冲区
                        buffer += decoder.decode(value, { stream: true });

                        // 按换行符切割
                        const lines = buffer.split('\n');

                        // 最后一个元素可能是截断的半行，保留它到下一次循环处理
                        // pop() 会移除并返回最后一个元素
                        buffer = lines.pop();

                        // 处理完整的行
                        for (const line of lines) {
                            if (line.trim()) parseLine(line);
                        }
                    }
                    // 处理剩余的 buffer（如果有）
                    if (buffer.trim()) parseLine(buffer);

                } catch (err) {
                    console.error('[DS-Error] Fetch Stream:', err);
                }
            })();
        }

        return response;
    };

    // ==========================================
    // 拦截器 2: XHR (带缓冲区修复)
    // ==========================================
    const originalXHR = window.XMLHttpRequest;

    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        let lastLength = 0;
        let targetUrl = '';
        let buffer = ''; // XHR 专用的缓冲区

        const originalOpen = xhr.open;
        xhr.open = function(method, url) {
            targetUrl = url;
            return originalOpen.apply(this, arguments);
        };

        xhr.addEventListener('progress', function() {
            const isTarget = targetUrl && (
                targetUrl.includes('/chat/completion') ||
                targetUrl.includes('api/v0/chat')
            );

            if (isTarget) {
                if (lastLength === 0) {
                     resetStreamState();
                }

                // 获取新增的部分
                const newChunk = xhr.responseText.substring(lastLength);
                lastLength = xhr.responseText.length;

                if (newChunk) {
                    buffer += newChunk;
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // 保留未完成的行

                    for (const line of lines) {
                        if (line.trim()) parseLine(line);
                    }
                }
            }
        });

        return xhr;
    };

    // ==========================================
    // UI 界面 (保持布局修复)
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
                position: fixed; top: 20px; right: 20px;
                width: 350px; height: 80vh; max-height: 600px;
                z-index: 99999; font-family: sans-serif; font-size: 14px;
                transition: transform 0.3s ease;
            }
            .wrapper {
                display: flex; flex-direction: column;
                height: 100%; width: 100%;
                background: #f8f9fa; border: 1px solid #e9ecef;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px;
            }
            .header {
                padding: 10px 15px; background: #2c3e50; color: white;
                border-radius: 8px 8px 0 0; display: flex;
                justify-content: space-between; align-items: center; flex-shrink: 0;
            }
            .content-area {
                flex: 1; overflow-y: auto; min-height: 0; padding: 15px;
                display: flex; flex-direction: column; gap: 15px;
            }
            .block {
                background: white; padding: 10px; border-radius: 6px;
                border: 1px solid #dee2e6; white-space: pre-wrap; word-wrap: break-word;
            }
            .think-block { background: #f1f3f5; color: #495057; border-left: 3px solid #ced4da; }
            .response-block { border-left: 3px solid #27ae60; }
            .controls {
                padding: 10px; border-top: 1px solid #dee2e6; display: flex;
                gap: 5px; background: #fff; border-radius: 0 0 8px 8px; flex-shrink: 0;
            }
            button {
                flex: 1; padding: 6px; cursor: pointer; border: 1px solid #ccc;
                background: #eee; border-radius: 4px;
            }
            button:hover { background: #ddd; }
            #toggle-btn {
                position: absolute; left: -40px; top: 10px; width: 30px; height: 30px;
                background: #2c3e50; color: white; border: none; border-radius: 50%;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
            }
        `;

        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
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