// ==UserScript==
// @name         家庭组邀请助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add member to Microsoft Family
// @author       dianran
// @license      MIT
// @match        https://account.microsoft.com/family/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/522297/%E5%AE%B6%E5%BA%AD%E7%BB%84%E9%82%80%E8%AF%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522297/%E5%AE%B6%E5%BA%AD%E7%BB%84%E9%82%80%E8%AF%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储 token 的变量
    let requestVerificationToken = '';

    // 拦截 XHR 请求
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function() {
        this._url = arguments[1];
        return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === '__requestverificationtoken') {
            requestVerificationToken = value;
            GM_setValue('requestVerificationToken', value);
            console.log('Token captured:', value);
        }
        return originalXHRSetRequestHeader.apply(this, arguments);
    };

    // 创建主窗口
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 10%;
        left: 0;
        background: white;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 0 5px 5px 0;
        z-index: 9999;
        width: 300px;
        user-select: none;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    `;

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        margin: -15px -15px 15px -15px;
        padding: 10px 15px;
        background: #f5f5f5;
        border-bottom: 1px solid #ddd;
        border-radius: 0 5px 0 0;
        font-weight: bold;
    `;

    // 标题文本
    const titleText = document.createElement('span');
    titleText.textContent = 'Microsoft Family 邀请助手';
    titleBar.appendChild(titleText);

    // 创建内容区
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
        cursor: default;
    `;

    // 邮箱输入区域
    const emailArea = document.createElement('div');
    emailArea.style.marginBottom = '15px';

    const emailLabel = document.createElement('div');
    emailLabel.textContent = '邮箱地址';
    emailLabel.style.marginBottom = '5px';
    emailLabel.style.fontSize = '14px';

    const input = document.createElement('input');
    input.type = 'email';
    input.placeholder = '输入邮箱地址';
    input.style.cssText = `
        display: block;
        margin-bottom: 10px;
        padding: 5px;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 3px;
    `;

    const sendButton = document.createElement('button');
    sendButton.textContent = '发送邀请';
    sendButton.style.cssText = `
        padding: 8px 15px;
        background: #0078d4;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.2s;
        margin-bottom: 15px;
    `;
    sendButton.onmouseover = () => sendButton.style.backgroundColor = '#006cbd';
    sendButton.onmouseout = () => sendButton.style.backgroundColor = '#0078d4';

    // 链接区域
    const linkArea = document.createElement('div');
    linkArea.style.borderTop = '1px solid #eee';
    linkArea.style.paddingTop = '15px';
    linkArea.style.display = 'none';  // 初始隐藏

    const linkLabel = document.createElement('div');
    linkLabel.textContent = '邀请链接';
    linkLabel.style.marginBottom = '5px';
    linkLabel.style.fontSize = '14px';

    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.readOnly = true;
    linkInput.style.cssText = `
        display: block;
        margin-bottom: 10px;
        padding: 5px;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 3px;
        font-size: 12px;
        background: #f9f9f9;
    `;

    const copyButton = document.createElement('button');
    copyButton.textContent = '复制链接';
    copyButton.style.cssText = `
        padding: 8px 15px;
        background: #0078d4;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.2s;
    `;
    copyButton.onmouseover = () => copyButton.style.backgroundColor = '#006cbd';
    copyButton.onmouseout = () => copyButton.style.backgroundColor = '#0078d4';

    // 组装界面
    emailArea.appendChild(emailLabel);
    emailArea.appendChild(input);
    emailArea.appendChild(sendButton);

    linkArea.appendChild(linkLabel);
    linkArea.appendChild(linkInput);
    linkArea.appendChild(copyButton);

    contentArea.appendChild(emailArea);
    contentArea.appendChild(linkArea);

    container.appendChild(titleBar);
    container.appendChild(contentArea);

    // 创建侧边标签
    const minTab = document.createElement('div');
    minTab.style.cssText = `
        position: fixed;
        top: 10%;
        left: 0;
        background: #0078d4;
        color: white;
        padding: 6px;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.3s ease;
        box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        font-size: 14px;
    `;
    minTab.textContent = '邀请助手';

    document.body.appendChild(container);
    document.body.appendChild(minTab);

    // 展开/收起状态管理
    let isMinimized = true;

    function togglePanel() {
        if (isMinimized) {
            // 展开面板
            container.style.transform = 'translateX(0)';
            minTab.style.backgroundColor = '#006cbd';
            minTab.style.left = '300px'; // 面板展开时，标签移到右侧
            minTab.style.borderRadius = '0 8px 8px 0'; // 保持右侧圆角
            minTab.textContent = '收起';
        } else {
            // 收起面板
            container.style.transform = 'translateX(-100%)';
            minTab.style.backgroundColor = '#0078d4';
            minTab.style.left = '0'; // 面板收起时，标签回到左侧
            minTab.style.borderRadius = '0 8px 8px 0'; // 保持右侧圆角
            minTab.textContent = '邀请助手';
        }
        isMinimized = !isMinimized;
    }

    // 点击侧边标签时触发展开/收起
    minTab.addEventListener('click', togglePanel);

    // 复制按钮点击事件
    copyButton.addEventListener('click', () => {
        linkInput.select();
        document.execCommand('copy');
        const originalText = copyButton.textContent;
        copyButton.textContent = '已复制！';
        copyButton.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = '#0078d4';
        }, 1500);
    });

    // 发送按钮点击事件
    sendButton.addEventListener('click', async () => {
        const email = input.value.trim();
        if (!email) {
            alert('请输入有效的邮箱地址');
            return;
        }

        sendButton.disabled = true;
        sendButton.textContent = '发送中...';
        sendButton.style.backgroundColor = '#999';

        try {
            const token = requestVerificationToken || GM_getValue('requestVerificationToken', '');
            console.log('Using token:', token);

            const response = await fetch('https://account.microsoft.com/family/api/pending-member', {
                method: 'POST',
                headers: {
                    'Host': 'account.microsoft.com',
                    'Connection': 'keep-alive',
                    'sec-ch-ua-platform': 'Windows',
                    'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                    'MS-CV': document.querySelector('input[name="MS-CV"]')?.value || '',
                    'sec-ch-ua-mobile': '?0',
                    '__RequestVerificationToken': token,
                    'X-AMC-JsonMode': 'CamelCase',
                    'Correlation-Context': 'v=1,ms.b.tel.market=zh-CN',
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Referer': 'https://account.microsoft.com/family/home',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'zh-CN,zh;q=0.9'
                },
                body: JSON.stringify({
                    inviteId: email,
                    isChild: true,
                    isInline: true,
                    matchAccount: false
                }),
                credentials: 'include'
            });

            const resultText = await response.text();
            console.log('Response:', resultText);

            if (response.ok) {
                try {
                    const resultData = JSON.parse(resultText);
                    if (resultData.redirectUrl) {
                        linkInput.value = resultData.redirectUrl;
                        linkArea.style.display = 'block';
                        // 当有新链接时,如果面板是收起状态则展开
                        if (isMinimized) {
                            togglePanel();
                        }
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                }
                alert('邀请发送成功！');
            } else {
                alert('发送失败: ' + response.statusText + '\n响应内容: ' + resultText);
            }
        } catch (error) {
            console.error('发送出错:', error);
            alert('发送出错: ' + error.message);
        } finally {
            sendButton.disabled = false;
            sendButton.textContent = '发送邀请';
            sendButton.style.backgroundColor = '#0078d4';
        }
    });

    // 初始化面板为收起状态
    container.style.transform = 'translateX(-100%)';

    console.log('脚本已加载');
})();