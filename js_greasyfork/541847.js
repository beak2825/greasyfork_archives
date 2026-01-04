// ==UserScript==
// @name         NodeSeek AI 内容总结
// @name:en      NodeSeek AI Content Summarizer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用自定义AI API总结NodeSeek帖子的内容，并提供设置面板。
// @description:en Use a custom AI API to summarize the content of NodeSeek posts, with a settings panel.
// @author       Gemini
// @match        https://www.nodeseek.com/post-*
// @match        https://www.deepflood.com/post-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nodeseek.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541847/NodeSeek%20AI%20%E5%86%85%E5%AE%B9%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/541847/NodeSeek%20AI%20%E5%86%85%E5%AE%B9%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式定义 ---
    // 使用 GM_addStyle 添加 CSS 样式，避免污染页面
    GM_addStyle(`
        /* 控制面板容器 */
        .ns-ai-container {
            margin: 15px 0;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        /* 按钮通用样式 */
        .ns-ai-btn {
            padding: 8px 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
            color: #333;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
            transition: all 0.2s ease;
        }

        .ns-ai-btn:hover {
            background-color: #f0f0f0;
            border-color: #bbb;
        }

        .ns-ai-btn-primary {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
        }

        .ns-ai-btn-primary:hover {
            background-color: #0056b3;
            border-color: #0056b3;
        }

        /* 总结内容显示区域 */
        #ns-ai-summary-output {
            margin-top: 15px;
            padding: 15px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            background-color: #fff;
            white-space: pre-wrap; /* 保持换行 */
            line-height: 1.6;
            color: #333;
        }

        /* 加载动画 */
        .ns-ai-loader {
            border: 4px solid #f3f3f3;
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* 设置弹窗样式 */
        .ns-ai-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
        }

        .ns-ai-modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            width: 90%;
            max-width: 500px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .ns-ai-modal-content h2 {
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }

        .ns-ai-modal-content label {
            display: block;
            margin-top: 15px;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .ns-ai-modal-content input {
            width: calc(100% - 20px);
            padding: 8px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .ns-ai-modal-buttons {
            margin-top: 20px;
            text-align: right;
        }
    `);

    // --- HTML 结构 ---
    // 创建UI元素并插入到页面中
    function createUI() {
        // *** 修改点: 将目标元素从 .post-header 改为 .post-title ***
        const postTitle = document.querySelector('.post-title');
        if (!postTitle) {
            console.error('[NodeSeek AI] 无法找到帖子标题元素 .post-title。');
            return;
        }

        // 创建主容器
        const container = document.createElement('div');
        container.className = 'ns-ai-container';

        // 创建按钮
        const summarizeBtn = document.createElement('button');
        summarizeBtn.textContent = '一键总结';
        summarizeBtn.id = 'ns-ai-summarize-btn';
        summarizeBtn.className = 'ns-ai-btn ns-ai-btn-primary';

        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '设置';
        settingsBtn.id = 'ns-ai-settings-btn';
        settingsBtn.className = 'ns-ai-btn';

        // 创建总结输出区域
        const summaryOutput = document.createElement('div');
        summaryOutput.id = 'ns-ai-summary-output';
        summaryOutput.style.display = 'none'; // 默认隐藏

        // 组装UI
        container.appendChild(summarizeBtn);
        container.appendChild(settingsBtn);
        container.appendChild(summaryOutput);

        // *** 修改点: 插入到 .post-title 元素的后面 ***
        postTitle.parentNode.insertBefore(container, postTitle.nextSibling);

        // 创建设置弹窗
        createSettingsModal();

        // 绑定事件
        summarizeBtn.addEventListener('click', handleSummarize);
        settingsBtn.addEventListener('click', openSettingsModal);
    }

    // 创建设置弹窗的HTML
    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'ns-ai-settings-modal';
        modal.className = 'ns-ai-modal';
        modal.innerHTML = `
            <div class="ns-ai-modal-content">
                <h2>AI API 设置</h2>
                <p>请填入兼容 OpenAI 格式的 API 信息。</p>
                <label for="ns-ai-api-url">API 地址 (URL):</label>
                <input type="text" id="ns-ai-api-url" placeholder="例如: https://api.openai.com/v1/chat/completions">

                <label for="ns-ai-api-key">密钥 (API Key):</label>
                <input type="password" id="ns-ai-api-key" placeholder="请输入您的 API Key">

                <label for="ns-ai-api-model">模型 (Model):</label>
                <input type="text" id="ns-ai-api-model" placeholder="例如: gpt-3.5-turbo">

                <div class="ns-ai-modal-buttons">
                    <button id="ns-ai-save-settings" class="ns-ai-btn ns-ai-btn-primary">保存</button>
                    <button id="ns-ai-cancel-settings" class="ns-ai-btn">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 绑定弹窗内部事件
        document.getElementById('ns-ai-save-settings').addEventListener('click', saveSettings);
        document.getElementById('ns-ai-cancel-settings').addEventListener('click', closeSettingsModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSettingsModal();
            }
        });
    }

    // --- 功能函数 ---

    // 处理总结按钮点击事件
    function handleSummarize() {
        const outputDiv = document.getElementById('ns-ai-summary-output');
        const summarizeBtn = document.getElementById('ns-ai-summarize-btn');
        outputDiv.style.display = 'block';
        outputDiv.innerHTML = '正在分析内容，请稍候... <div class="ns-ai-loader"></div>';
        summarizeBtn.disabled = true;

        // 1. 获取配置
        const apiUrl = GM_getValue('apiUrl');
        const apiKey = GM_getValue('apiKey');
        const model = GM_getValue('apiModel');

        if (!apiUrl || !apiKey || !model) {
            outputDiv.innerHTML = '⚠️ 配置不完整，请点击“设置”按钮填写 API 信息。';
            summarizeBtn.disabled = false;
            return;
        }

        // 2. 提取帖子内容
        const postContentElement = document.querySelector('article.post-content');
        if (!postContentElement) {
            outputDiv.innerHTML = '❌ 错误：无法找到帖子内容元素 `article.post-content`。';
            summarizeBtn.disabled = false;
            return;
        }
        // 使用 innerText 获取纯文本，去除HTML标签
        const postText = postContentElement.innerText.trim();

        if (postText.length < 50) { // 内容太短，不进行总结
             outputDiv.innerHTML = 'ℹ️ 内容过短，无需总结。';
             summarizeBtn.disabled = false;
             return;
        }

        // 3. 调用AI API
        callAiApi(apiUrl, apiKey, model, postText);
    }

    // 调用AI进行总结
    function callAiApi(url, key, model, text) {
        const outputDiv = document.getElementById('ns-ai-summary-output');
        const summarizeBtn = document.getElementById('ns-ai-summarize-btn');

        const prompt = `你是一个内容总结助手。请你用中文、精炼、客观、分点的形式总结以下帖子的核心内容，不要添加任何自己的评论或补充信息。帖子内容如下：\n\n---\n\n${text}`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            data: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5, // 较低的温度使输出更具确定性
            }),
            timeout: 60000, // 60秒超时
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const summary = data.choices[0]?.message?.content;
                    if (summary) {
                        outputDiv.innerHTML = `<strong>🤖 AI 总结：</strong><br>${summary}`;
                    } else {
                        console.error('API 响应解析失败:', data);
                        outputDiv.innerText = `❌ API 响应格式不正确，请检查浏览器控制台获取详细信息。`;
                    }
                } catch (e) {
                    console.error('解析API响应时出错:', e);
                    outputDiv.innerText = `❌ 解析API响应失败，可能是网络问题或API返回了非JSON格式的数据。`;
                } finally {
                    summarizeBtn.disabled = false;
                }
            },
            onerror: function(error) {
                console.error('GM_xmlhttpRequest error:', error);
                outputDiv.innerText = '❌ 请求API失败，请检查网络连接、API地址是否正确，或查看浏览器控制台。';
                summarizeBtn.disabled = false;
            },
            ontimeout: function() {
                outputDiv.innerText = '❌ 请求超时，请检查网络或API服务是否可用。';
                summarizeBtn.disabled = false;
            }
        });
    }

    // 打开设置弹窗
    function openSettingsModal() {
        // 加载已保存的配置
        document.getElementById('ns-ai-api-url').value = GM_getValue('apiUrl', '');
        document.getElementById('ns-ai-api-key').value = GM_getValue('apiKey', '');
        document.getElementById('ns-ai-api-model').value = GM_getValue('apiModel', 'gpt-3.5-turbo');
        // 显示弹窗
        document.getElementById('ns-ai-settings-modal').style.display = 'flex';
    }

    // 关闭设置弹窗
    function closeSettingsModal() {
        document.getElementById('ns-ai-settings-modal').style.display = 'none';
    }

    // 保存设置
    function saveSettings() {
        const apiUrl = document.getElementById('ns-ai-api-url').value.trim();
        const apiKey = document.getElementById('ns-ai-api-key').value.trim();
        const apiModel = document.getElementById('ns-ai-api-model').value.trim();

        if (!apiUrl || !apiKey || !apiModel) {
            alert('API 地址、密钥和模型不能为空！');
            return;
        }

        GM_setValue('apiUrl', apiUrl);
        GM_setValue('apiKey', apiKey);
        GM_setValue('apiModel', apiModel);

        alert('设置已保存！');
        closeSettingsModal();
    }

    // --- 脚本启动 ---
    // 等待页面加载完成后执行
    window.addEventListener('load', createUI, false);

})();
