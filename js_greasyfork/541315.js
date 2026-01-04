// ==UserScript==
// @name         Augment API Token Tool
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  获取Augment API的访问令牌
// @author       backgroundPower
// @license      MIT
// @match        https://*.augmentcode.com/*
// @match        https://augmentcode.com/*
// @match        https://*.cursor.com/*
// @match        https://cursor.com/*
// @match        https://*.windsurf.com/*
// @match        https://windsurf.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/541315/Augment%20API%20Token%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/541315/Augment%20API%20Token%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clientID = "v";

    // 工具函数
    function base64URLEncode(buffer) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
    }

    async function sha256Hash(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return hashBuffer;
    }

    async function createOAuthState() {
        // 生成随机字节
        const codeVerifierArray = new Uint8Array(32);
        window.crypto.getRandomValues(codeVerifierArray);
        const codeVerifier = base64URLEncode(codeVerifierArray.buffer);

        // 创建 code challenge
        const codeChallenge = base64URLEncode(await sha256Hash(codeVerifier));

        // 生成随机 state
        const stateArray = new Uint8Array(8);
        window.crypto.getRandomValues(stateArray);
        const state = base64URLEncode(stateArray.buffer);

        const oauthState = {
            codeVerifier,
            codeChallenge,
            state,
            creationTime: Date.now()
        };

        // 存储状态以供后续使用
        GM_setValue('oauthState', JSON.stringify(oauthState));

        return oauthState;
    }

    function generateAuthorizeURL(oauthState) {
        const params = new URLSearchParams({
            response_type: "code",
            code_challenge: oauthState.codeChallenge,
            client_id: clientID,
            state: oauthState.state,
            prompt: "login",
        });

        return `https://auth.augmentcode.com/authorize?${params.toString()}`;
    }

    // 解析授权码函数
    function parseCode(code) {
        try {
            const parsed = JSON.parse(code);
            if (!parsed.code || !parsed.tenant_url) {
                throw new Error("缺少必要的code或tenant_url字段");
            }
            return {
                code: parsed.code,
                state: parsed.state,
                tenant_url: parsed.tenant_url
            };
        } catch (e) {
            throw new Error("JSON解析失败: " + e.message);
        }
    }

    async function getAccessToken(tenant_url, codeVerifier, code) {
        // 确保tenant_url以/结尾
        if (!tenant_url.endsWith('/')) {
            tenant_url = tenant_url + '/';
        }

        console.log("正在请求token...");
        console.log("URL:", `${tenant_url}token`);
        console.log("codeVerifier:", codeVerifier);
        console.log("code:", code);

        const data = {
            grant_type: "authorization_code",
            client_id: clientID,
            code_verifier: codeVerifier,
            redirect_uri: "",
            code: code,
        };

        console.log("请求数据:", JSON.stringify(data));

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${tenant_url}token`,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    try {
                        console.log("API响应状态:", response.status);
                        console.log("API响应头:", response.responseHeaders);
                        console.log("API响应内容:", response.responseText);

                        const json = JSON.parse(response.responseText);
                        console.log("解析后的响应:", json);

                        if (json.access_token) {
                            resolve(json.access_token);
                        } else {
                            reject(`No access token found in response. Full response: ${JSON.stringify(json)}`);
                        }
                    } catch (e) {
                        reject(`Error parsing response: ${e}. Raw response: ${response.responseText}`);
                    }
                },
                onerror: function(error) {
                    console.error("请求错误:", error);
                    reject(`Request error: ${error}`);
                }
            });
        });
    }

    // 启动认证流程
    async function startAuthFlow() {
        const oauthState = await createOAuthState();
        const url = generateAuthorizeURL(oauthState);
        window.location.href = url;
    }

    // 处理授权回调
    function handleAuthCallback() {
        // 检查URL中是否有code参数
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (code && state) {
            const storedState = GM_getValue('oauthState');
            if (!storedState) {
                showMessage('认证状态丢失，请重试');
                return;
            }

            const oauthState = JSON.parse(storedState);
            if (state !== oauthState.state) {
                showMessage('状态验证失败，可能存在安全风险');
                return;
            }

            // 提取tenant_url
            const tenant_url = window.location.origin + '/';

            // 构建结果对象
            const result = {
                code: code,
                state: state,
                tenant_url: tenant_url
            };

            // 显示结果
            showMessage(`
                <h3>认证成功!</h3>
                <p>代码：${code}</p>
                <button id="getToken">获取令牌</button>
            `);

            document.getElementById('getToken').addEventListener('click', async () => {
                try {
                    const token = await getAccessToken(tenant_url, oauthState.codeVerifier, code);
                    GM_setValue('access_token', token);

                    // 创建持久性浮窗
                    createCredentialsFloater(tenant_url, token);
                } catch (error) {
                    showMessage(`获取令牌失败: ${error}`);
                }
            });
        }
    }

    function sendChatMessage(tenant_url, token) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `${tenant_url}chat-stream`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            data: JSON.stringify({
                chat_history: [
                    {
                        response_text: "你好! 我是 Augment，很高兴为你提供帮助。",
                        request_message: "你好，我是用户"
                    }
                ],
                message: "我叫什么名字",
                mode: "CHAT"
            }),
            onload: function(response) {
                showMessage(`<h3>聊天响应:</h3><pre>${response.responseText}</pre>`);
            },
            onerror: function(error) {
                showMessage(`发送聊天请求失败: ${error}`);
            }
        });
    }

    // 显示消息的UI函数
    function showMessage(message, autoHide = false) {
        try {
            let messageDiv = document.getElementById('augment-api-message');
            if (!messageDiv) {
                messageDiv = document.createElement('div');
                messageDiv.id = 'augment-api-message';
                messageDiv.style.cssText = `
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    background: white;
                    border: 1px solid #ccc;
                    padding: 20px;
                    z-index: 10000;
                    max-width: 400px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.2);
                    border-radius: 5px;
                    font-family: Arial, sans-serif;
                    animation: fadeIn 0.3s;
                `;

                // 添加关闭按钮
                const closeBtn = document.createElement('div');
                closeBtn.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    cursor: pointer;
                    font-size: 18px;
                    color: #999;
                `;
                closeBtn.innerHTML = '×';
                closeBtn.onclick = () => {
                    messageDiv.style.display = 'none';
                };

                messageDiv.appendChild(closeBtn);
                document.body.appendChild(messageDiv);

                // 添加样式
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    #augment-api-message button:hover {
                        opacity: 0.9;
                    }
                `;
                document.head.appendChild(style);
            }

            // 内容容器，避免覆盖关闭按钮
            let contentDiv = messageDiv.querySelector('.message-content');
            if (!contentDiv) {
                contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                messageDiv.appendChild(contentDiv);
            }

            contentDiv.innerHTML = message;
            messageDiv.style.display = 'block';

            // 如果设置了自动隐藏
            if (autoHide) {
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 8000);
            }
        } catch (e) {
            console.error('显示消息时出错:', e);
            alert('Augment API Tool: ' + message.replace(/<[^>]*>/g, ' '));
        }
    }

    // 显示JSON处理界面
    function showJsonProcessingUI() {
        showMessage(`
            <h3>处理授权 JSON</h3>
            <p>请在下方粘贴授权码 JSON：</p>
            <textarea id="authCodeInput" style="width:100%;height:100px;margin:10px 0;padding:8px;border:1px solid #ccc;border-radius:4px;"></textarea>
            <button id="processAuthCode" style="background:#4285f4;color:white;padding:10px;border:none;border-radius:4px;cursor:pointer;width:100%;">处理授权码</button>
        `);

        document.getElementById('processAuthCode')?.addEventListener('click', processAuthCode);
    }

    // 处理授权码
    function processAuthCode() {
        const authCodeInput = document.getElementById('authCodeInput');
        const clipText = authCodeInput ? authCodeInput.value : "";

        if (!clipText) {
            alert('请先输入授权码');
            return;
        }

        // 将输入的代码发送到处理函数
        const storedState = GM_getValue('oauthState');
        if (!storedState) {
            showMessage('认证状态丢失，请重新开始流程');
            return;
        }

        console.log("开始处理授权码...");
        console.log("授权码原文:", clipText);

        const oauthState = JSON.parse(storedState);
        console.log("存储的OAuth状态:", oauthState);

        try {
            const parsedCode = parseCode(clipText);
            console.log("解析后的授权码数据:", parsedCode);

            if (parsedCode && parsedCode.code) {
                // 显示处理中的消息
                showMessage(`<h3>正在处理...</h3><p>请稍候</p><pre style="font-size:12px;max-height:200px;overflow:auto;background:#f5f5f5;padding:5px;margin-top:10px;">正在向 ${parsedCode.tenant_url} 请求访问令牌...</pre>`);

                getAccessToken(parsedCode.tenant_url, oauthState.codeVerifier, parsedCode.code)
                                    .then(token => {
                    console.log("成功获取令牌:", token);
                    GM_setValue('access_token', token);

                    // 创建持久性浮窗
                    createCredentialsFloater(parsedCode.tenant_url, token);
                })
                .catch(err => {
                    console.error("获取令牌失败:", err);

                    // 尝试使用code作为token的后备方案
                    const tryUseCodeAsToken = confirm("获取令牌失败。可能是因为授权码无法转换为访问令牌。\n\n您想要尝试直接使用授权码(code)作为令牌吗？");

                    if (tryUseCodeAsToken) {
                        console.log("使用code作为token:", parsedCode.code);
                        createCredentialsFloater(parsedCode.tenant_url, parsedCode.code);
                    } else {
                        showMessage(`获取令牌失败: ${err}`);
                    }
                });
            } else {
                showMessage(`授权码格式不正确，请确保包含code和tenant_url信息`);
            }
        } catch (e) {
            showMessage(`解析授权码失败: ${e.message}，请确保输入的是完整的JSON格式授权码`);
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand("获取Augment API令牌", startAuthFlow);
    GM_registerMenuCommand("处理授权JSON", showJsonProcessingUI);

    // 确保DOM完全加载后执行
    function init() {
        // 检查是否在授权回调页面
        const currentUrl = window.location.href;
        if (currentUrl.includes('code=') && currentUrl.includes('state=')) {
            handleAuthCallback();
            return;
        }

        // 检查是否在授权码复制页面
        const supportedDomains = ['augmentcode.com', 'cursor.com', 'windsurf.com'];
        const isOnSupportedDomain = supportedDomains.some(domain => currentUrl.includes(domain));

        if (isOnSupportedDomain && document.title.includes('Augment')) {
            // 尝试找到并自动点击复制按钮
            setTimeout(() => {
                const copyButtons = Array.from(document.querySelectorAll('button')).filter(button =>
                    button.textContent && button.textContent.toLowerCase().includes('copy')
                );

                if (copyButtons.length > 0) {
                    console.log('找到复制按钮，自动点击...');
                    copyButtons[0].click();
                }
            }, 1000);
        }

        // 检查是否在支持的域名下显示界面元素
        const isSupportedDomain = supportedDomains.some(domain =>
            window.location.hostname.includes(domain)
        );

        if (isSupportedDomain) {
            // 创建固定的悬浮菜单按钮
            ensureFloatingMenuExists();
        } else {
            console.log('Augment API Token Tool 已加载 - 仅在支持的域名显示界面');
        }
    }

    // 确保浮动菜单存在的函数
    function ensureFloatingMenuExists() {
        // 检查菜单是否已存在且可见
        const existingBtn = document.getElementById('augment-api-menu-btn');
        const existingMenu = document.getElementById('augment-api-menu');

        // 检查按钮和菜单是否都存在且在DOM中
        const btnExists = existingBtn && document.body.contains(existingBtn);
        const menuExists = existingMenu && document.body.contains(existingMenu);

        if (!btnExists || !menuExists) {
            console.log('重新创建浮动菜单...');
            // 清理可能存在的残留元素
            if (existingBtn) existingBtn.remove();
            if (existingMenu) existingMenu.remove();
            createFloatingMenu();
        } else {
            // 确保菜单可见性正确
            if (existingBtn.style.display === 'none') {
                existingBtn.style.display = 'flex';
            }
        }
    }

    // 创建浮动菜单
    function createFloatingMenu() {
        // 等待body元素可用
        if (!document.body) {
            setTimeout(createFloatingMenu, 100);
            return;
        }

        // 清理可能存在的旧元素
        const oldBtn = document.getElementById('augment-api-menu-btn');
        const oldMenu = document.getElementById('augment-api-menu');
        if (oldBtn) oldBtn.remove();
        if (oldMenu) oldMenu.remove();

        // 创建菜单按钮
        const menuBtn = document.createElement('div');
        menuBtn.id = 'augment-api-menu-btn';
        menuBtn.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: #4285f4 !important;
            color: white !important;
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 20px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
            z-index: 999999 !important;
            font-family: Arial, sans-serif !important;
        `;
        menuBtn.textContent = "A";
        menuBtn.title = "Augment API 工具";

        // 创建菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.id = 'augment-api-menu';
        menuContainer.style.cssText = `
            position: fixed !important;
            bottom: 80px !important;
            right: 20px !important;
            background: white !important;
            border-radius: 5px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
            z-index: 999998 !important;
            display: none !important;
            overflow: hidden !important;
            font-family: Arial, sans-serif !important;
        `;

        // 添加菜单项
        const menuItems = [
            {
                text: "1. 登录获取授权 JSON",
                action: startAuthFlow
            },
            {
                text: "2. 处理 JSON 信息",
                action: showJsonProcessingUI
            }
        ];

        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                padding: 12px 20px;
                cursor: pointer;
                white-space: nowrap;
                border-bottom: 1px solid #eee;
                color: #000;
            `;
            menuItem.textContent = item.text;
            menuItem.onmouseover = () => menuItem.style.backgroundColor = '#f5f5f5';
            menuItem.onmouseout = () => menuItem.style.backgroundColor = 'white';
            menuItem.onclick = () => {
                menuContainer.style.display = 'none';
                item.action();
            };
            menuContainer.appendChild(menuItem);
        });

        // 点击按钮显示/隐藏菜单
        menuBtn.onclick = () => {
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block';
            } else {
                menuContainer.style.display = 'none';
            }
        };

        // 点击其他地方隐藏菜单
        document.addEventListener('click', (e) => {
            if (e.target !== menuBtn && !menuContainer.contains(e.target) && menuContainer.style.display === 'block') {
                menuContainer.style.display = 'none';
            }
        });

        // 安全地添加到页面
        try {
            document.body.appendChild(menuBtn);
            document.body.appendChild(menuContainer);

            // 验证元素是否成功添加
            setTimeout(() => {
                const verifyBtn = document.getElementById('augment-api-menu-btn');
                const verifyMenu = document.getElementById('augment-api-menu');
                if (!verifyBtn || !verifyMenu) {
                    console.warn('菜单元素添加失败，尝试重新添加...');
                    setTimeout(createFloatingMenu, 1000);
                } else {
                    console.log('Augment API Token Tool 浮动菜单已成功创建');
                }
            }, 100);

        } catch (error) {
            console.error('添加菜单元素时出错:', error);
            setTimeout(createFloatingMenu, 1000);
        }
    }

    // 多重初始化机制
    function initializeScript() {
        console.log('Augment API Token Tool 初始化...');

        // 立即执行一次初始化
        init();

        // 监听路由变化（适用于单页应用）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                console.log('检测到路由变化:', url);
                setTimeout(() => {
                    init();
                }, 500); // 延迟500ms确保页面内容加载完成
            }
        }).observe(document, { subtree: true, childList: true });

        // 定期检查菜单是否存在（防止被页面更新移除）
        setInterval(() => {
            const isAugmentDomain = window.location.hostname.includes('augmentcode.com');
            if (isAugmentDomain) {
                ensureFloatingMenuExists();
            }
        }, 3000); // 每3秒检查一次

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    const isAugmentDomain = window.location.hostname.includes('augmentcode.com');
                    if (isAugmentDomain) {
                        ensureFloatingMenuExists();
                    }
                }, 1000);
            }
        });
    }

    // 确保DOM加载完成后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    // 额外的延迟初始化（适用于复杂的SPA）
    setTimeout(initializeScript, 2000);

    // 监听窗口加载完成事件
    window.addEventListener('load', () => {
        setTimeout(() => {
            const isAugmentDomain = window.location.hostname.includes('augmentcode.com');
            if (isAugmentDomain) {
                ensureFloatingMenuExists();
            }
        }, 1000);
    });

    // 监听焦点事件（当用户切换回标签页时）
    window.addEventListener('focus', () => {
        setTimeout(() => {
            const isAugmentDomain = window.location.hostname.includes('augmentcode.com');
            if (isAugmentDomain) {
                ensureFloatingMenuExists();
            }
        }, 500);
    });

    // 创建固定浮窗显示凭证信息
    function createCredentialsFloater(tenant_url, token) {
        // 删除已有的浮窗（如果存在）
        const existingFloater = document.getElementById('augment-api-floater');
        if (existingFloater) {
            existingFloater.remove();
        }

        // 创建新浮窗
        const floater = document.createElement('div');
        floater.id = 'augment-api-floater';
        floater.style.cssText = `
            position: fixed;
            right: 20px;
            top: 20%;
            width: 350px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            padding: 15px;
        `;

        // 添加标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Augment API 凭证';
        title.style.margin = '0';

        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            cursor: pointer;
            font-size: 20px;
            color: #999;
        `;
        closeBtn.onclick = () => floater.style.display = 'none';

        header.appendChild(title);
        header.appendChild(closeBtn);
        floater.appendChild(header);

        // 内容区域
        const content = document.createElement('div');

        // tenant_url 部分
        const tenantUrlDiv = document.createElement('div');
        tenantUrlDiv.style.marginBottom = '15px';

        const tenantUrlLabel = document.createElement('div');
        tenantUrlLabel.innerHTML = '<strong>tenant_url:</strong>';
        tenantUrlLabel.style.marginBottom = '5px';

        const tenantUrlValue = document.createElement('div');
        tenantUrlValue.textContent = tenant_url;
        tenantUrlValue.style.cssText = `
            padding: 8px;
            background: #f5f5f5;
            border-radius: 4px;
            word-break: break-all;
            font-family: monospace;
            margin-bottom: 5px;
        `;

        const copyTenantUrlBtn = document.createElement('button');
        copyTenantUrlBtn.textContent = '复制 tenant_url';
        copyTenantUrlBtn.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        copyTenantUrlBtn.onclick = () => {
            GM_setClipboard(tenant_url);
            copyTenantUrlBtn.textContent = '✓ 已复制';
            setTimeout(() => {
                copyTenantUrlBtn.textContent = '复制 tenant_url';
            }, 1500);
        };

        tenantUrlDiv.appendChild(tenantUrlLabel);
        tenantUrlDiv.appendChild(tenantUrlValue);
        tenantUrlDiv.appendChild(copyTenantUrlBtn);

        // token 部分
        const tokenDiv = document.createElement('div');

        const tokenLabel = document.createElement('div');
        tokenLabel.innerHTML = '<strong>token:</strong>';
        tokenLabel.style.marginBottom = '5px';

        const tokenValue = document.createElement('div');
        tokenValue.textContent = token;
        tokenValue.style.cssText = `
            padding: 8px;
            background: #f5f5f5;
            border-radius: 4px;
            word-break: break-all;
            font-family: monospace;
            margin-bottom: 5px;
            max-height: 100px;
            overflow-y: auto;
            font-size: 12px;
        `;

        const copyTokenBtn = document.createElement('button');
        copyTokenBtn.textContent = '复制 token';
        copyTokenBtn.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        copyTokenBtn.onclick = () => {
            GM_setClipboard(token);
            copyTokenBtn.textContent = '✓ 已复制';
            setTimeout(() => {
                copyTokenBtn.textContent = '复制 token';
            }, 1500);
        };

        tokenDiv.appendChild(tokenLabel);
        tokenDiv.appendChild(tokenValue);
        tokenDiv.appendChild(copyTokenBtn);

        content.appendChild(tenantUrlDiv);
        content.appendChild(tokenDiv);
        floater.appendChild(content);

        // 添加到页面
        document.body.appendChild(floater);

        // 使浮窗可拖动
        makeElementDraggable(floater, header);

        return floater;
    }

    // 使元素可拖动的函数
    function makeElementDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        if (handle) {
            // 如果指定了拖动把手，则把手触发拖动事件
            handle.style.cursor = 'move';
            handle.onmousedown = dragMouseDown;
        } else {
            // 否则，整个元素触发拖动事件
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            if (!e) e = window.event;
            e.preventDefault();
            // 获取鼠标初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 鼠标移动时调用elementDrag
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            if (!e) e = window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 停止拖动
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();