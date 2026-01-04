// ==UserScript==
// @name         Google SEO API索引提交插件
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  向 Google Indexing API 提交当前页面网址进行索引
// @license      GPL License
// @author       Benson
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/8.0.20/jsrsasign-all-min.js
// @downloadURL https://update.greasyfork.org/scripts/528045/Google%20SEO%20API%E7%B4%A2%E5%BC%95%E6%8F%90%E4%BA%A4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/528045/Google%20SEO%20API%E7%B4%A2%E5%BC%95%E6%8F%90%E4%BA%A4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* eslint-env es8, browser */
/* global GM_getValue, GM_setValue, GM_xmlhttpRequest, GM_registerMenuCommand, KJUR */

(function() {
    'use strict';
    
    // 检查是否在 iframe 中
    if (window !== window.top) {
        return;
    }
    
    // 配置
    let SERVICE_ACCOUNT = GM_getValue('SERVICE_ACCOUNT', null);
    const ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
    const DISCOVERY_DOC = 'https://indexing.googleapis.com/$discovery/rest?version=v3';
    const SCOPE = 'https://www.googleapis.com/auth/indexing';
    let accessTokenCache = null;
    let accessTokenExpiry = 0;
    let isSubmitting = false;
    
    // 创建配置面板
    function createConfigPanel() {
        const configPanel = document.createElement('div');
        configPanel.id = 'googleApiKeyConfig';
        configPanel.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
        `;
        
        configPanel.innerHTML = `
            <h3 style="margin-top: 0;">配置 Google Indexing API</h3>
            <div style="margin-bottom: 15px;">
                <p style="margin-bottom: 10px; color: #666;">请输入您的服务账号凭据 JSON：</p>
                <textarea id="serviceAccountInput" 
                    style="width: 100%; height: 200px; padding: 8px; margin-bottom: 10px; box-sizing: border-box; font-family: monospace;" 
                    placeholder="请粘贴您的服务账号凭据 JSON 文件内容">${SERVICE_ACCOUNT ? JSON.stringify(SERVICE_ACCOUNT, null, 2) : ''}</textarea>
                <div style="color: #666; font-size: 12px; margin-bottom: 10px;">
                    <p>示例格式：</p>
                    <pre style="background: #f5f5f5; padding: 8px; border-radius: 4px;">
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "your-service-account@project.iam.gserviceaccount.com",
  ...
}</pre>
                </div>
                <button id="saveConfig" style="
                    padding: 8px 15px;
                    background: #4285f4;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                ">保存</button>
                <button id="clearConfig" style="
                    padding: 8px 15px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                ">清除配置</button>
                <button id="closeConfig" style="
                    padding: 8px 15px;
                    background: #666;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">关闭</button>
            </div>
        `;
        
        // 添加调试模式开关
        const debugModeDiv = document.createElement('div');
        debugModeDiv.style.marginTop = '10px';
        debugModeDiv.innerHTML = `
            <label>
                <input type="checkbox" id="debugMode" ${localStorage.getItem('DEBUG_MODE') === 'true' ? 'checked' : ''}>
                调试模式（在控制台显示详细信息）
            </label>
        `;
        configPanel.querySelector('div').appendChild(debugModeDiv);
        
        document.body.appendChild(configPanel);
        
        // 添加事件监听
        document.getElementById('saveConfig').addEventListener('click', () => {
            try {
                const jsonStr = document.getElementById('serviceAccountInput').value.trim();
                if (!jsonStr) {
                    throw new Error('请输入服务账号凭据');
                }
                
                const config = JSON.parse(jsonStr);
                if (!config.private_key || !config.client_email) {
                    throw new Error('无效的服务账号凭据，请确保包含 private_key 和 client_email');
                }
                
                SERVICE_ACCOUNT = config;
                GM_setValue('SERVICE_ACCOUNT', config);
                accessTokenCache = null; // 清除访问令牌缓存
                accessTokenExpiry = 0;
                
                alert('服务账号凭据已保存！');
                configPanel.style.display = 'none';
            } catch (error) {
                alert('保存失败：' + error.message);
            }
        });
        
        // 添加清除配置按钮事件
        document.getElementById('clearConfig').addEventListener('click', () => {
            if (confirm('确定要清除服务账号凭据吗？')) {
                SERVICE_ACCOUNT = null;
                GM_setValue('SERVICE_ACCOUNT', null);
                accessTokenCache = null;
                accessTokenExpiry = 0;
                document.getElementById('serviceAccountInput').value = '';
                alert('服务账号凭据已清除！');
            }
        });
        
        document.getElementById('closeConfig').addEventListener('click', () => {
            configPanel.style.display = 'none';
        });
        
        // 添加调试模式切换事件
        document.getElementById('debugMode').addEventListener('change', function(e) {
            localStorage.setItem('DEBUG_MODE', e.target.checked);
        });
        
        return configPanel;
    }
    
    // 显示配置面板
    function showConfigPanel() {
        const configPanel = document.getElementById('googleApiKeyConfig') || createConfigPanel();
        configPanel.style.display = 'block';
    }
    
    // 初始化 Google API 客户端
    async function initClient() {
        if (!SERVICE_ACCOUNT) {
            console.log('服务账号未配置');
            return;
        }
        
        try {
            await gapi.client.init({
                apiKey: SERVICE_ACCOUNT.private_key,
                discoveryDocs: [DISCOVERY_DOC],
                clientId: SERVICE_ACCOUNT.client_id,
                scope: SCOPE
            });
            console.log('Google API 客户端初始化成功');
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }
    
    // 获取访问令牌
    async function getAccessToken() {
        if (!SERVICE_ACCOUNT) {
            throw new Error('未配置服务账号');
        }
        
        // 检查缓存的令牌是否还有效
        const now = Math.floor(Date.now() / 1000);
        if (accessTokenCache && now < accessTokenExpiry - 300) { // 提前5分钟刷新
            return accessTokenCache;
        }
        
        try {
            const expiry = now + 3600;
            
            // 准备 JWT 头部和载荷
            const header = {
                alg: 'RS256',
                typ: 'JWT'
            };
            
            const payload = {
                iss: SERVICE_ACCOUNT.client_email,
                scope: SCOPE,
                aud: 'https://oauth2.googleapis.com/token',
                exp: expiry,
                iat: now
            };
            
            // 使用 jsrsasign 创建 JWT
            const sHeader = JSON.stringify(header);
            const sPayload = JSON.stringify(payload);
            const privateKey = SERVICE_ACCOUNT.private_key.replace(/\\n/g, '\n');
            
            // 使用 KJUR.jws.JWS 签名
            const jwt = KJUR.jws.JWS.sign(null, sHeader, sPayload, privateKey);
            
            // 获取访问令牌
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://oauth2.googleapis.com/token',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            if (data.access_token) {
                accessTokenCache = data.access_token;
                accessTokenExpiry = now + (data.expires_in || 3600);
                return accessTokenCache;
            } else {
                throw new Error(`获取访问令牌失败: ${response.responseText}`);
            }
        } catch (error) {
            accessTokenCache = null;
            accessTokenExpiry = 0;
            throw new Error(`生成访问令牌失败: ${error.message}`);
        }
    }
    
    // 验证服务账号配置
    function validateServiceAccount() {
        if (!SERVICE_ACCOUNT) {
            return false;
        }
        
        try {
            if (!SERVICE_ACCOUNT.private_key || !SERVICE_ACCOUNT.client_email) {
                SERVICE_ACCOUNT = null;
                GM_setValue('SERVICE_ACCOUNT', null);
                return false;
            }
            return true;
        } catch (error) {
            console.error('验证服务账号配置失败:', error);
            return false;
        }
    }
    
    // 提交 URL 到 Google 索引
    async function submitToGoogleIndex() {
        if (!validateServiceAccount()) {
            alert('请先配置服务账号！');
            const configPanel = document.getElementById('googleApiKeyConfig') || createConfigPanel();
            configPanel.style.display = 'block';
            return;
        }
        
        if (isSubmitting) {
            console.log('正在提交中，请等待...');
            return;
        }
        
        // 获取当前页面的真实 URL
        const currentUrl = window.top.location.href;
        
        // 检查 URL 是否有效
        try {
            const url = new URL(currentUrl);
            if (!url.protocol.startsWith('http')) {
                alert('只能提交 HTTP/HTTPS 协议的 URL');
                return;
            }
        } catch (e) {
            alert('无效的 URL');
            return;
        }
        
        isSubmitting = true;
        
        try {
            // 先获取访问令牌
            const accessToken = await getAccessToken();
            
            // 使用访问令牌调用 Indexing API
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: ENDPOINT,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    data: JSON.stringify({
                        url: currentUrl,
                        type: 'URL_UPDATED'
                    }),
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            
            // 只在开发模式下打印结果
            if (localStorage.getItem('DEBUG_MODE') === 'true') {
                console.log('提交结果:', data);
            }
            
            if (data.error) {
                // 如果是权限错误，清除令牌缓存
                if (data.error.status === 'PERMISSION_DENIED') {
                    accessTokenCache = null;
                    accessTokenExpiry = 0;
                    alert(`提交失败：您没有权限提交此 URL。\n请确保您的服务账号已在 Google Search Console 中验证了该网站的所有权。\n当前页面：${currentUrl}`);
                } else {
                    alert(`提交失败：${data.error.message}\n当前页面：${currentUrl}`);
                }
                return;
            }
            
            if (data.urlNotificationMetadata) {
                const metadata = data.urlNotificationMetadata;
                const successMessage = [
                    'URL 已成功提交到 Google 索引！',
                    `当前页面：${currentUrl}`,
                    '',
                    '提交详情：',
                    `- 提交时间：${new Date().toLocaleString()}`,
                    `- 提交类型：URL_UPDATED`,
                    `- 响应状态：成功`,
                    '',
                    '后续步骤：',
                    '1. 您可以在 Google Search Console 中查看索引状态',
                    '2. Google 可能需要一些时间来处理您的请求',
                    '3. 建议使用 Google Search Console 的"检查网址"功能验证索引状态'
                ].join('\n');
                
                alert(successMessage);
                
                // 在控制台显示更多技术细节
                if (localStorage.getItem('DEBUG_MODE') === 'true') {
                    console.log('提交详情:', {
                        url: currentUrl,
                        timestamp: new Date().toISOString(),
                        type: 'URL_UPDATED',
                        response: data
                    });
                }
            } else {
                alert([
                    '提交状态未知',
                    `当前页面：${currentUrl}`,
                    '',
                    '建议操作：',
                    '1. 开启调试模式查看详细信息',
                    '2. 检查 Google Search Console 验证索引状态',
                    '3. 如果问题持续，请稍后重试'
                ].join('\n'));
            }
        } catch (error) {
            console.error('提交失败:', error);
            alert('提交失败：' + error.message);
        } finally {
            isSubmitting = false;
        }
    }
    
    // 创建批量提交面板
    function createBatchPanel() {
        const batchPanel = document.createElement('div');
        batchPanel.id = 'googleIndexingBatch';
        batchPanel.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
        `;
        
        batchPanel.innerHTML = `
            <h3 style="margin-top: 0;">批量提交 URL</h3>
            <div style="margin-bottom: 15px;">
                <p style="margin-bottom: 10px; color: #666;">请输入要提交的 URL（每行一个）：</p>
                <textarea id="batchUrlInput" 
                    style="width: 100%; height: 150px; padding: 8px; margin-bottom: 10px; box-sizing: border-box; font-family: monospace;" 
                    placeholder="https://example.com/page1&#10;https://example.com/page2"></textarea>
                <div style="margin-bottom: 10px;">
                    <label>
                        <input type="checkbox" id="randomDelay" checked>
                        随机延迟（1-8秒）
                    </label>
                </div>
                <button id="startBatch" style="
                    padding: 8px 15px;
                    background: #4285f4;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                ">开始提交</button>
                <button id="copyFailed" style="
                    padding: 8px 15px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                    display: none;
                ">复制失败的 URL</button>
                <button id="closeBatch" style="
                    padding: 8px 15px;
                    background: #666;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">关闭</button>
            </div>
            <div id="batchProgress" style="
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #eee;
                padding: 10px;
                display: none;
            ">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">URL</th>
                            <th style="text-align: center; padding: 8px; border-bottom: 2px solid #ddd;">状态</th>
                            <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">结果</th>
                        </tr>
                    </thead>
                    <tbody id="batchProgressList"></tbody>
                </table>
            </div>
        `;
        
        document.body.appendChild(batchPanel);
        
        // 批量提交处理
        let isProcessing = false;
        let urlList = [];
        
        // 更新进度列表
        function updateProgress(url, status, result = '') {
            const progressList = document.getElementById('batchProgressList');
            const existingRow = progressList.querySelector(`[data-url="${url}"]`);
            
            const statusColors = {
                '待提交': '#666',
                '提交中': '#007bff',
                '已提交': '#28a745',
                '提交失败': '#dc3545'
            };
            
            if (existingRow) {
                existingRow.children[1].innerHTML = `<span style="color: ${statusColors[status]}">${status}</span>`;
                existingRow.children[2].textContent = result;
            } else {
                const row = document.createElement('tr');
                row.setAttribute('data-url', url);
                row.innerHTML = `
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${url}</td>
                    <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">
                        <span style="color: ${statusColors[status]}">${status}</span>
                    </td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${result}</td>
                `;
                progressList.appendChild(row);
            }
        }
        
        // 提交单个 URL
        async function submitUrl(url) {
            try {
                if (!validateServiceAccount()) {
                    updateProgress(url, '提交失败', '请先配置服务账号');
                    return false;
                }

                updateProgress(url, '提交中');
                const accessToken = await getAccessToken();
                
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: ENDPOINT,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        data: JSON.stringify({
                            url: url,
                            type: 'URL_UPDATED'
                        }),
                        onload: resolve,
                        onerror: reject
                    });
                });

                const data = JSON.parse(response.responseText);
                
                if (data.error) {
                    // 如果是权限错误，清除令牌缓存
                    if (data.error.status === 'PERMISSION_DENIED') {
                        accessTokenCache = null;
                        accessTokenExpiry = 0;
                        updateProgress(url, '提交失败', '没有权限提交此 URL，请确保服务账号已验证网站所有权');
                    } else {
                        updateProgress(url, '提交失败', data.error.message);
                    }
                    return false;
                }
                
                if (data.urlNotificationMetadata) {
                    updateProgress(url, '已提交', '成功');
                    return true;
                }
                
                updateProgress(url, '提交失败', '未知错误');
                return false;
            } catch (error) {
                console.error('提交失败:', error);
                updateProgress(url, '提交失败', error.message);
                return false;
            }
        }
        
        // 修改 setTimeout 的使用方式
        function delay(ms) {
            return new Promise(resolve => {
                setTimeout(resolve, ms);
            });
        }
        
        // 开始批量提交
        async function startBatchSubmit() {
            if (!validateServiceAccount()) {
                alert('请先配置服务账号！');
                const configPanel = document.getElementById('googleApiKeyConfig') || createConfigPanel();
                configPanel.style.display = 'block';
                return;
            }

            if (isProcessing) return;
            
            const urls = document.getElementById('batchUrlInput').value
                .split('\n')
                .map(url => url.trim())
                .filter(url => {
                    try {
                        const urlObj = new URL(url);
                        return urlObj.protocol.startsWith('http');
                    } catch (e) {
                        return false;
                    }
                });
                
            if (urls.length === 0) {
                alert('请输入有效的 URL（必须以 http:// 或 https:// 开头）');
                return;
            }
            
            isProcessing = true;
            document.getElementById('startBatch').disabled = true;
            document.getElementById('batchProgress').style.display = 'block';
            document.getElementById('copyFailed').style.display = 'none';
            
            // 初始化进度列表
            document.getElementById('batchProgressList').innerHTML = '';
            urls.forEach(url => updateProgress(url, '待提交'));
            
            const useRandomDelay = document.getElementById('randomDelay').checked;
            let successCount = 0;
            let failureCount = 0;
            
            for (const url of urls) {
                if (useRandomDelay) {
                    // 使用 delay 函数替代直接使用 setTimeout
                    await delay(Math.random() * 7000 + 1000);
                }
                const success = await submitUrl(url);
                if (success) {
                    successCount++;
                } else {
                    failureCount++;
                }
            }
            
            isProcessing = false;
            document.getElementById('startBatch').disabled = false;
            document.getElementById('copyFailed').style.display = 'block';
            
            // 显示提交统计
            alert(`批量提交完成！\n成功：${successCount} 个\n失败：${failureCount} 个\n\n如有失败的 URL，可以点击"复制失败的 URL"按钮重新提交。`);
        }
        
        // 复制失败的 URL
        function copyFailedUrls() {
            const failedUrls = Array.from(document.getElementById('batchProgressList').querySelectorAll('tr'))
                .filter(row => row.querySelector('td:nth-child(2)').textContent.includes('失败'))
                .map(row => row.querySelector('td:first-child').textContent)
                .join('\n');
                
            if (failedUrls) {
                navigator.clipboard.writeText(failedUrls);
                alert('已复制失败的 URL 到剪贴板');
            } else {
                alert('没有失败的 URL');
            }
        }
        
        // 添加事件监听
        document.getElementById('startBatch').addEventListener('click', startBatchSubmit);
        document.getElementById('copyFailed').addEventListener('click', copyFailedUrls);
        document.getElementById('closeBatch').addEventListener('click', () => {
            if (!isProcessing || confirm('正在提交中，确定要关闭吗？')) {
                batchPanel.style.display = 'none';
            }
        });
        
        return batchPanel;
    }
    
    // 显示批量提交面板
    function showBatchPanel() {
        const batchPanel = document.getElementById('googleIndexingBatch') || createBatchPanel();
        batchPanel.style.display = 'block';
    }
    
    // 注册菜单命令
    GM_registerMenuCommand('配置 Google Indexing API', showConfigPanel);
    GM_registerMenuCommand('提交到 Google 索引', submitToGoogleIndex);
    GM_registerMenuCommand('批量提交 URL', showBatchPanel);
})();