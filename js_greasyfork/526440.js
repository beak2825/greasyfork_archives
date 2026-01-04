// ==UserScript==
// @name         Wikipedia AI Summary (维基百科AI总结)
// @namespace    http://yhgzs-111.github.io/
// @version      1.0 
// @description  维基百科 AI 摘要脚本，兼容适配OpenAI API格式的所有LLM。
// @author       Deepseek, ChatGPT and NNNH 
// @match        https://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526440/Wikipedia%20AI%20Summary%20%28%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91AI%E6%80%BB%E7%BB%93%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526440/Wikipedia%20AI%20Summary%20%28%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91AI%E6%80%BB%E7%BB%93%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        apiKey: '',
        apiURL: '',
        systemPrompt: '请用中文总结以下内容，保持关键信息的完整性：',
        model: ''
    };

    // 初始化配置
    let config = {
        apiKey: GM_getValue('apiKey', defaultConfig.apiKey),
        apiURL: GM_getValue('apiURL', defaultConfig.apiURL),
        systemPrompt: GM_getValue('systemPrompt', defaultConfig.systemPrompt),
        model: GM_getValue('model', defaultConfig.model)
    };

    // 注册设置菜单
    GM_registerMenuCommand("AI Summary Settings", showSettings);

    // 创建浮动按钮
    let floatingBtn = null;
    document.addEventListener('mouseup', handleTextSelection);

    function handleTextSelection(e) {
        const selection = window.getSelection().toString().trim();
        if (!selection) {
            if (floatingBtn) {
                floatingBtn.remove();
                floatingBtn = null;
            }
            return;
        }

        if (!floatingBtn) {
            createFloatingButton(e);
        } else {
            positionButton(e);
        }
    }

    function createFloatingButton(e) {
        floatingBtn = document.createElement('button');
        floatingBtn.textContent = 'AI Summary';
        Object.assign(floatingBtn.style, {
            position: 'absolute',
            zIndex: 9999,
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        positionButton(e);
        floatingBtn.addEventListener('click', handleSummary);
        document.body.appendChild(floatingBtn);
    }

    function positionButton(e) {
        // 直接使用 e.pageX 与 e.pageY（包含滚动偏移），无需额外添加滚动量
        floatingBtn.style.left = `${e.pageX + 15}px`;
        floatingBtn.style.top = `${e.pageY - 50}px`;
    }

    async function handleSummary() {
        const selection = window.getSelection().toString().trim();
        if (!selection) return;

        floatingBtn.textContent = '处理中...';
        try {
            const summary = await getAISummary(selection);
            showSummaryPopup(summary);
        } catch (error) {
            alert(`错误: ${error.message}`);
        } finally {
            if (floatingBtn) {
                floatingBtn.remove();
                floatingBtn = null;
            }
        }
    }

    // 修改后的 getAISummary 函数，兼容 /v1/chat/completions 和 /v1/completions 两种接口格式
    async function getAISummary(text) {
        return new Promise((resolve, reject) => {
            // 判断是否为 chat 接口（URL 中包含 "chat/completions"）
            const isChatEndpoint = config.apiURL.includes("chat/completions");
            // 判断模型是否为 OpenAI 官方支持的LLM模型
            const isChatModel = ["gpt-3.5-turbo", "gpt-4", "gpt-4o"].includes(config.model);
            let payload;
            if (isChatEndpoint && isChatModel) {
                // 使用对话接口格式
                payload = {
                    model: config.model,
                    messages: [
                        { role: "system", content: config.systemPrompt },
                        { role: "user", content: text }
                    ],
                    temperature: 0.7
                };
            } else {
                // 使用传统 completions 接口格式：将 systemPrompt 与用户输入拼接成 prompt
                payload = {
                    model: config.model,
                    prompt: config.systemPrompt + "\n" + text,
                    temperature: 0.7,
                    max_tokens: 150 // 可根据需要调整
                };
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: config.apiURL,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.apiKey}`
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status === 200) {
                            let summary;
                            if (isChatEndpoint && isChatModel) {
                                summary = data.choices[0].message.content;
                            } else {
                                summary = data.choices[0].text;
                            }
                            resolve(summary);
                        } else {
                            reject(new Error(data.error?.message || 'Unknown error'));
                        }
                    } catch(e) {
                        reject(new Error("Response parse error: " + e.message));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function showSummaryPopup(content) {
        const popup = document.createElement('div');
        Object.assign(popup.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            zIndex: 10000
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
        });
        closeBtn.onclick = () => popup.remove();

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = content.replace(/\n/g, '<br>');

        popup.appendChild(closeBtn);
        popup.appendChild(contentDiv);
        document.body.appendChild(popup);
    }

    function showSettings() {
        const settings = `
            <div style="padding:20px;font-family:sans-serif">
                <h2>AI Summary Settings</h2>
                <form id="settingsForm">
                    <label>API Key:<br>
                        <input type="password" id="apiKey" value="${config.apiKey}" style="width:300px"></label><br><br>
                    <label>API URL:<br>
                        <input type="text" id="apiURL" value="${config.apiURL}" style="width:300px"></label><br><br>
                    <label>System Prompt:<br>
                        <textarea id="systemPrompt" rows="4" style="width:300px">${config.systemPrompt}</textarea></label><br><br>
                    <label>Model (手动输入):<br>
                        <input type="text" id="model" value="${config.model}" style="width:300px"></label><br><br>
                    <button type="submit">Save</button>
                </form>
            </div>
        `;

        const win = window.open('', 'AI Summary Settings', 'width=400,height=500');
        win.document.write(settings);
        win.document.getElementById('settingsForm').onsubmit = function(e) {
            e.preventDefault();
            config = {
                apiKey: win.document.getElementById('apiKey').value,
                apiURL: win.document.getElementById('apiURL').value,
                systemPrompt: win.document.getElementById('systemPrompt').value,
                model: win.document.getElementById('model').value
            };
            GM_setValue('apiKey', config.apiKey);
            GM_setValue('apiURL', config.apiURL);
            GM_setValue('systemPrompt', config.systemPrompt);
            GM_setValue('model', config.model);
            win.close();
        };
    }
})();
