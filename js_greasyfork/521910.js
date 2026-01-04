// ==UserScript==
// @name         少数派 AI 助手
// @name:en      SSPAI AI Assistant
// @namespace    https://github.com/Jandaes/sspai-ai-assistant
// @version      0.1.1
// @description  为少数派文章添加 AI 辅助功能，支持一键总结文章内容和评论
// @description:en  Add AI assistant features to SSPAI articles, support one-click summary of article content and comments
// @author       janda
// @homepage     https://github.com/Jandaes/sspai-ai-assistant
// @supportURL   https://github.com/Jandaes/sspai-ai-assistant/issues
// @match        https://sspai.com/post/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @icon         https://cdn-static.sspai.com/favicon/sspai.ico
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521910/%E5%B0%91%E6%95%B0%E6%B4%BE%20AI%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521910/%E5%B0%91%E6%95%B0%E6%B4%BE%20AI%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式注入
    const styles = `
        .article-summary-panel {
            display: none;
            position: fixed;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 500px;
            max-height: 80vh;
            border: 1px solid #eee;
            border-radius: 8px;
            z-index: 9999;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow-y: auto;
        }

        .settings-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: #1a1a1a;
            color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 10000;
        }

        .modal-backdrop {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }

        .settings-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            padding: 0 20px;
        }

        .settings-group label {
            flex: 0 0 100px;
            margin-bottom: 0;
            font-weight: bold;
            text-align: right;
            padding-right: 15px;
            color: #fff;
        }

        .settings-group .input-wrapper {
            flex: 1;
        }

        .settings-group input, 
        .settings-group textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #333;
            border-radius: 4px;
            background: #2d2d2d;
            color: #fff;
        }

        .settings-group textarea {
            height: 100px;
            resize: vertical;
        }

        .modal-title {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #333;
            color: #fff;
        }

        .modal-footer {
            margin-top: 20px;
            text-align: right;
            padding: 0 20px;
        }

        .modal-footer button {
            padding: 8px 16px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .save-btn {
            background: #D7000F;
            color: white;
        }

        .cancel-btn {
            background: #333;
            color: #fff;
        }
    `;

    GM_addStyle(styles);

    // 初始化函数
    function init() {
        createSideButtons();
        createSummaryPanel();
    }

    // 创建侧边栏按钮
    function createSideButtons() {
        const waitForSideBar = setInterval(() => {
            const sideBar = document.querySelector('div.article-body > div.article-side.sideTop');
            if (!sideBar) return;

            clearInterval(waitForSideBar);

            // 创建总结按钮
            const summaryWrapper = document.createElement('div');
            summaryWrapper.setAttribute('data-v-30f3dc0c', '');
            summaryWrapper.className = 'item-wrapper';
            summaryWrapper.title = '总结';
            summaryWrapper.style.cursor = 'pointer';
            summaryWrapper.innerHTML = `✨`;
            summaryWrapper.addEventListener('click', handleSummary);

            // 创建设置按钮
            const settingsWrapper = document.createElement('div');
            settingsWrapper.setAttribute('data-v-30f3dc0c', '');
            settingsWrapper.className = 'item-wrapper';                
            settingsWrapper.title = '设置';
            settingsWrapper.style.cursor = 'pointer';
            settingsWrapper.innerHTML = `⚙️`;
            settingsWrapper.addEventListener('click', handleSettings);

            sideBar.appendChild(summaryWrapper);
            sideBar.appendChild(settingsWrapper);
        }, 500);

        setTimeout(() => clearInterval(waitForSideBar), 10000);
    }

    // 创建总结面板
    function createSummaryPanel() {
        const panel = document.createElement('div');
        panel.className = 'article-summary-panel';
        panel.innerHTML = `
            <h3>AI 总结</h3>
            <div class="summary-content" style="white-space: pre-wrap;"></div>
        `;
        document.body.appendChild(panel);
    }

    // 获取文章内容
    function getArticleContent() {        
        const articleBody = document.querySelector('div.content.wangEditor-txt.minHeight');
        if (!articleBody) return '';
        
        // 获取纯文本并清理空格和换行
        return Array.from(articleBody.childNodes)
            .filter(node => !['pre', 'code', 'script', 'style'].includes(node.nodeName.toLowerCase()))
            .map(node => node.textContent)
            .join('')  // 不添加换行符
            .replace(/\s+/g, '')  // 移除所有空白字符
            .trim();
    }

    // 处理总结按钮点击
    async function handleSummary() {
        const panel = document.querySelector('.article-summary-panel');
        const content = panel?.querySelector('.summary-content');
        if (!panel || !content) return;

        panel.style.display = 'block';
        content.textContent = '正在获取内容并生成总结...';

        try {
            const articleContent = getArticleContent();
            if (!articleContent) throw new Error('无法获取文章内容');

            const comments = await fetchComments();
            const summary = await callLLMApi(
                `文章内容：${articleContent}\n\n评论内容：${comments.join('\n')}`
            );
            
            // 原样输出 AI 返回的内容，不做任何处理
            content.textContent = summary;
        } catch (error) {
            content.textContent = `生成总结时出错: ${error.message}`;
        }
    }

    // 获取评论数据
    async function fetchComments() {
        const articleId = window.location.pathname.match(/^\/post\/(\d+)$/)?.[1];
        if (!articleId) return [];

        let allComments = [];
        let offset = 0;
        const limit = 20;

        try {
            while (true) {
                const response = await fetch(
                    `https://sspai.com/api/v1/comment/user/article/hot/page/get?limit=${limit}&offset=${offset}&article_id=${articleId}`
                );
                const data = await response.json();
                
                if (data.error !== 0 || !data.data?.length) break;
                
                allComments = allComments.concat(data.data);
                if (offset + limit >= (data.total || 0)) break;
                offset += limit;
            }

            // 清理评论内容
            return allComments.reduce((acc, item) => {
                // 添加主评论
                acc.push(item.comment.replace(/\s+/g, '').trim());
                // 添加回复评论
                item.reply?.forEach(reply => {
                    acc.push(reply.comment.replace(/\s+/g, '').trim());
                });
                return acc;
            }, []);
        } catch (error) {
            console.error('获取评论失败：', error);
            return [];
        }
    }

    // 调用 AI API
    async function callLLMApi(content) {
        const settings = {
            apiUrl: GM_getValue('apiUrl', ''),
            apiKey: GM_getValue('apiKey', ''),
            modelName: GM_getValue('modelName', 'gpt-3.5-turbo'),
            systemPrompt: GM_getValue('systemPrompt', '你只需要精炼总结文章内容和评论、不需要加入你的任何观点。分别输出文章内容和用户评论')
        };

        if (!settings.apiUrl || !settings.apiKey) {
            return '请先在设置中配置 API 地址和 API Key';
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: settings.apiUrl,
                headers: {
                    'Authorization': `Bearer ${settings.apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    messages: [
                        { role: 'system', content: settings.systemPrompt },
                        { role: 'user', content: content }
                    ],
                    model: settings.modelName,
                    stream: false
                }),
                onload: response => {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.choices?.[0]?.message?.content) {
                                resolve(data.choices[0].message.content);
                            } else {
                                reject(new Error('API 响应格式不正确'));
                            }
                        } else {
                            reject(new Error(`API 请求失败: ${response.status}`));
                        }
                    } catch (error) {
                        reject(new Error(`解析响应失败: ${error.message}`));
                    }
                },
                onerror: error => reject(new Error(error.error || '网络请求失败')),
                ontimeout: () => reject(new Error('请求超时')),
                timeout: 30000
            });
        });
    }

    // 处理设置
    function handleSettings() {
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <h3 class="modal-title">AI 助手设置</h3>
            <div class="settings-group">
                <label>API 地址</label>
                <div class="input-wrapper">
                    <input type="text" id="api-url" placeholder="请输入 API 地址">
                </div>
            </div>
            <div class="settings-group">
                <label>API Key</label>
                <div class="input-wrapper">
                    <input type="password" id="api-key" placeholder="请输入 API Key">
                </div>
            </div>
            <div class="settings-group">
                <label>模型名称</label>
                <div class="input-wrapper">
                    <input type="text" id="model-name" placeholder="例如：gpt-3.5-turbo">
                </div>
            </div>
            <div class="settings-group">
                <label>系统提示词</label>
                <div class="input-wrapper">
                    <textarea id="system-prompt" placeholder="请输入系统提示词"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn">取消</button>
                <button class="save-btn">保存</button>
            </div>
        `;
        
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        
        document.body.appendChild(modal);
        document.body.appendChild(backdrop);

        // 填充已保存的设置
        document.getElementById('api-url').value = GM_getValue('apiUrl', '');
        document.getElementById('api-key').value = GM_getValue('apiKey', '');
        document.getElementById('model-name').value = GM_getValue('modelName', 'gpt-3.5-turbo');
        document.getElementById('system-prompt').value = GM_getValue('systemPrompt', '你只需要精炼总结文章内容和评论、不需要加入你的任何观点。分别输出文章内容和用户评论');

        // 显示模态框
        modal.style.display = backdrop.style.display = 'block';

        // 保存设置
        modal.querySelector('.save-btn').addEventListener('click', () => {
            const newSettings = {
                apiUrl: document.getElementById('api-url').value.trim(),
                apiKey: document.getElementById('api-key').value.trim(),
                modelName: document.getElementById('model-name').value.trim(),
                systemPrompt: document.getElementById('system-prompt').value.trim()
            };

            Object.entries(newSettings).forEach(([key, value]) => {
                if (value) GM_setValue(key, value);
            });

            modal.remove();
            backdrop.remove();
        });

        // 取消按钮
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
        });

        // 点击背景关闭
        backdrop.addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
        });
    }

    // 页面加载完成后初始化
    window.addEventListener('load', init);
})(); 