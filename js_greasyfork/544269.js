// ==UserScript==
// @name         迷笛云图插件
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  迷笛云图团队内部工具集合
// @author       You
// @match        https://yuntu.oceanengine.com/yuntu_brand/ecom*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oceanengine.com
// @grant        none
// @run-at       document-start
// @license      Mozilla Public License  2.0
// @downloadURL https://update.greasyfork.org/scripts/544269/%E8%BF%B7%E7%AC%9B%E4%BA%91%E5%9B%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/544269/%E8%BF%B7%E7%AC%9B%E4%BA%91%E5%9B%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // const BASE_URL = 'http://127.0.0.1:8999';
    const BASE_URL = 'https://api.midi.lizhijian.xyz';

    // 云图项目专用拦截配置
    const YUNTU_INTERCEPT_CONFIGS = [
        {
            pattern: /lf-yuntu\.oceanengine\.com/,
            name: '云图API请求'
        },
        {
            pattern: /lf6-cdn2-tos\.bytegoofy\.com.*yuntu/,
            name: '云图CDN资源'
        },
        {
            pattern: /yuntu_analysis/,
            name: '云图分析模块'
        },
        {
            pattern: /\/api\//,
            name: '通用API请求'
        },
        {
            pattern: /\.js$/,
            name: 'JavaScript文件'
        }
    ];

    // 文本替换配置
    const TEXT_REPLACE_CONFIGS = [
        {
            // https://lf-yuntu.oceanengine.com/obj/yuntu-fe-cdn/yuntu/sub_app/yuntu_analysis/static/js/async/290.5b478207.js
            urlPattern: /yuntu_analysis.*290\.[a-z0-9]+\.js/, // 云图分析模块,更精确的匹配,支持任意hash值
            replacements: [
                {
                    search: /76896e5/g,
                    replace: '76896e8',
                    rule_type: "replace"
                },
                {
                    search: /50976e5/g,
                    replace: '76896e8',
                    rule_type: "replace"
                }, {
                    search: /2592e6/g,
                    replace: '76896e8',
                    rule_type: "replace"
                }, {
                    search: /25056e5/g,
                    replace: '76896e8',
                    rule_type: "replace"
                },
            ],
            name: '云图人群包模块跨日期规则'
        },
        {
            // https://lf-yuntu.oceanengine.com/obj/yuntu-fe-cdn/yuntu/sub_app/product/static/js/async/517.ed5b32cb.js
            urlPattern: /product.*517\.[a-z0-9]+\.js/, // 云图细分市场模块,更精确的匹配
            replacements: [
                // 替换帮助信息,在跨日期情况下不提示
                {
                    search: 'help:\\s*[a-zA-Z]\\s*&&\\s*[a-zA-Z]\\s*\\?\\s*"\\u6700\\u591a\\u652f',
                    replace: 'help: false ? "\\u6700\\u591a\\u652f',
                    rule_type: "regex",
                    flags: "g"
                },
                // 替换状态信息,在跨日期情况下不提示
                {
                    search: 'status:\\s*[a-zA-Z]\\s*&&\\s*[a-zA-Z]\\s*\\?\\s*"',
                    replace: 'status: false ? "',
                    rule_type: "regex",
                    flags: "g"
                },
                // 删除天级别限制
                {
                    search: 'x===Y.tN.Day&&We',
                    replace: 'false',
                    rule_type: "replace"
                },// 删除周级别限制
                {
                    search: 'x===Y.tN.Week&&Fe',
                    replace: 'false',
                    rule_type: "replace"
                },// 删除月级别限制
                {
                    search: 'x===Y.tN.Month&&Ue',
                    replace: 'false',
                    rule_type: "replace"
                },

            ],
            name: '云图细分市场模块跨日期规则'
        }, {
            // https://yuntu.oceanengine.com/product_node/v2/api/segmentedMarket/checkKeywords?aadvid=1648829117571079
            urlPattern: /product_node.*checkKeywords/, // 云图细分市场模块,更精确的匹配
            replacements: [
                // 屏蔽品牌词过滤请求
                {
                    search: '\\{"data":\\{"invalidKeywords":\\[.*?\\]\\},"code":"0","message":"success"\\}',
                    replace: '{"data":{"invalidKeywords":[]},"code":"0","message":"success"}',
                    rule_type: "regex",
                    flags: "g"
                }
            ],
            name: '云图细分市场模块品牌词过滤'
        }, {
            // https://yuntu.oceanengine.com/tag_factory_node/api/graphql/?op=checkKeywords&platform=undefined&aadvid=1648829117571079
            urlPattern: /tag_factory_node.*checkKeywords/, // 云图细分市场模块,更精确的匹配
            replacements: [
                // 屏蔽品牌词过滤请求
                {
                    search: '{"data":{"res":{"invalidKeywords":\\[.*?\\],"__typename":"CheckKeywordsRes"}}}',
                    replace: '{"data":{"res":{"invalidKeywords":[],"__typename":"CheckKeywordsRes"}}}',
                    rule_type: "regex",
                    flags: "g"
                }
            ],
            name: '云图标签工厂模块敏感词过滤'
        }, {
            // https://lf-yuntu.oceanengine.com/obj/yuntu-fe-cdn/yuntu/sub_app/tag_factory/static/js/853.1ef572bd.js
            urlPattern: /tag_factory.*?853\.[a-z0-9]+\.js/, // 云图细分市场模块,更精确的匹配
            replacements: [
                //
                {
                    search: 'isDateDisabled:function(e){var r=e.getTime()-v;if("number"==typeof u&&null!=t&&t.dateStart&&t.dateStart===t.dateEnd){var n=e.getTime()-ro()(t.dateStart).valueOf();if(n>=u*lo||n<=-1*u*lo)return!0}return r<("number"==typeof p?p:-1*l[l.length-1])*lo||r>y*lo}',
                    replace: 'isDateDisabled:function(e){return e.getTime() >= new Date().getTime() - 2*24*60*60*1000}',
                    rule_type: "replace",
                },
            ],
            name: '云图标签工厂跨日期'
        },


        // 可以添加更多替换规则
        // {
        //     urlPattern: /example\.com/,
        //     replacements: [
        //         {
        //             search: /oldText/g,
        //             replace: 'newText'
        //         }
        //     ],
        //     name: '示例替换'
        // }
    ];

    // 检查URL是否需要拦截
    function shouldIntercept(url) {
        for (const config of YUNTU_INTERCEPT_CONFIGS) {
            if (config.pattern.test(url)) {
                return { matched: true, name: config.name };
            }
        }
        return { matched: false };
    }

    // 检查URL是否需要文本替换并直接执行替换
    function checkAndReplaceText(url, text) {
        // 检查用户是否已登录，未登录则不执行文本替换
        if (!AuthModule.isLoggedIn()) {
            // console.log(`🔒 用户未登录，跳过文本替换: ${url}`);
            return { matched: false };
        }

        // console.log(`🔍 检查文本替换URL: ${url}`);
        for (const config of TEXT_REPLACE_CONFIGS) {
            console.log(`📋 尝试匹配规则: ${config.name} | 模式: ${config.urlPattern}`);
            if (config.urlPattern.test(url)) {
                console.log(`✅ 匹配成功: ${config.name}`);
                // 直接执行文本替换
                const modifiedText = performTextReplace(text, config.replacements);
                return {
                    matched: true,
                    config: config,
                    originalText: text,
                    modifiedText: modifiedText,
                    hasChanges: text !== modifiedText
                };
            }
        }
        // console.log(`❌ 未匹配到任何文本替换规则`);
        return { matched: false };
    }

    // 执行文本替换
    function performTextReplace(text, replacements) {
        let result = text;
        for (const replacement of replacements) {
            // 支持正则替换和普通字符串替换
            if (replacement.rule_type === "regex") {
                // 正则替换
                const regex = new RegExp(replacement.search, replacement.flags || 'g');
                result = result.replace(regex, replacement.replace);
            } else {
                // 普通字符串替换
                result = result.replace(replacement.search, replacement.replace);
            }
        }
        return result;
    }

    // 美化的日志输出
    function logRequest(method, url, bodyLength, requestType, configName) {
        const timestamp = new Date().toLocaleTimeString();
        const style = 'background: #2196F3; color: white; padding: 2px 8px; border-radius: 3px;';

        console.groupCollapsed(`%c🌐 [${timestamp}] ${requestType}`, style);
        console.log(`🏷️  分类: ${configName}`);
        console.log(`📋 方法: %c${method}%c`, 'color: #4CAF50; font-weight: bold;', '');
        console.log(`🔗 URL: %c${url}%c`, 'color: #FF9800;', '');
        console.log(`📊 Body长度: %c${bodyLength} 字节%c`, 'color: #9C27B0; font-weight: bold;', '');
        console.groupEnd();
    }

    // HOOK XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._interceptMethod = method;
        this._interceptUrl = url;
        return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        const url = this._interceptUrl;
        const method = this._interceptMethod || 'GET';

        if (url) {
            const interceptResult = shouldIntercept(url);
            if (interceptResult.matched) {
                let bodyLength = 0;

                if (body) {
                    if (typeof body === 'string') {
                        bodyLength = body.length;
                    } else if (body instanceof FormData) {
                        bodyLength = -1; // FormData无法直接计算大小
                    } else if (body instanceof ArrayBuffer) {
                        bodyLength = body.byteLength;
                    } else if (body instanceof Blob) {
                        bodyLength = body.size;
                    } else {
                        try {
                            bodyLength = JSON.stringify(body).length;
                        } catch (e) {
                            bodyLength = -2; // 序列化失败
                        }
                    }
                }

                logRequest(method, url, bodyLength, 'XHR', interceptResult.name);
            }

            // 检查是否需要文本替换 - 预检查，避免设置不必要的回调
            // 只有在用户已登录时才检查文本替换规则  
            let needsTextReplace = false;
            if (AuthModule.isLoggedIn()) {
                for (const config of TEXT_REPLACE_CONFIGS) {
                    if (config.urlPattern.test(url)) {
                        needsTextReplace = true;
                        break;
                    }
                }
            }

            if (needsTextReplace) {
                const originalReadyStateChange = this.onreadystatechange;
                const xhr = this;

                this.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        try {
                            const contentType = xhr.getResponseHeader('Content-Type') || '';
                            console.log(`📄 XHR响应Content-Type: ${contentType}`);
                            if (contentType.includes('text/') || contentType.includes('application/json') || contentType.includes('text/html') || contentType.includes('application/javascript')) {
                                // 获取原始响应文本并执行替换
                                const originalResponseText = xhr.responseText;
                                const replaceResult = checkAndReplaceText(url, originalResponseText);

                                if (replaceResult.matched && replaceResult.hasChanges) {
                                    // 重写responseText属性
                                    Object.defineProperty(xhr, 'responseText', {
                                        writable: false,
                                        value: replaceResult.modifiedText
                                    });

                                    // 如果是JSON响应，也更新response属性
                                    if (contentType.includes('application/json')) {
                                        try {
                                            Object.defineProperty(xhr, 'response', {
                                                writable: false,
                                                value: JSON.parse(replaceResult.modifiedText)
                                            });
                                        } catch (e) {
                                            console.warn('JSON解析失败，保持原始response:', e);
                                        }
                                    }

                                    console.log(`%c🔄 文本替换完成: ${replaceResult.config.name}`, 'background: #FF9800; color: white; padding: 2px 8px; border-radius: 3px;');
                                }
                            }
                        } catch (error) {
                            console.error('文本替换过程中出错:', error);
                        }
                    }

                    if (originalReadyStateChange) {
                        originalReadyStateChange.apply(this, arguments);
                    }
                };
            }
        }

        return originalXHRSend.apply(this, arguments);
    };

    // HOOK fetch API
    const originalFetch = window.fetch;

    window.fetch = function (input, init) {
        let url = '';
        let method = 'GET';
        let bodyLength = 0;

        // 解析请求参数
        if (typeof input === 'string') {
            url = input;
        } else if (input instanceof Request) {
            url = input.url;
            method = input.method;
        } else if (input instanceof URL) {
            url = input.toString();
        }

        if (init) {
            method = init.method || method;
            if (init.body) {
                if (typeof init.body === 'string') {
                    bodyLength = init.body.length;
                } else if (init.body instanceof FormData) {
                    bodyLength = -1; // FormData
                } else if (init.body instanceof ArrayBuffer) {
                    bodyLength = init.body.byteLength;
                } else if (init.body instanceof Blob) {
                    bodyLength = init.body.size;
                } else {
                    try {
                        bodyLength = JSON.stringify(init.body).length;
                    } catch (e) {
                        bodyLength = -2; // 序列化失败
                    }
                }
            }
        }

        const interceptResult = shouldIntercept(url);
        if (interceptResult.matched) {
            logRequest(method.toUpperCase(), url, bodyLength, 'Fetch', interceptResult.name);
        }

        // 检查是否需要文本替换 - 预检查
        // 只有在用户已登录时才检查文本替换规则
        let needsTextReplace = false;
        if (AuthModule.isLoggedIn()) {
            for (const config of TEXT_REPLACE_CONFIGS) {
                if (config.urlPattern.test(url)) {
                    needsTextReplace = true;
                    break;
                }
            }
        }

        if (needsTextReplace) {
            return originalFetch.apply(this, arguments).then(response => {
                const contentType = response.headers.get('Content-Type') || '';
                console.log(`📄 Fetch响应Content-Type: ${contentType}`);

                if (contentType.includes('text/') || contentType.includes('application/json') || contentType.includes('text/html') || contentType.includes('application/javascript')) {
                    return response.text().then(originalText => {
                        const replaceResult = checkAndReplaceText(url, originalText);

                        if (replaceResult.matched && replaceResult.hasChanges) {
                            console.log(`%c🔄 Fetch文本替换完成: ${replaceResult.config.name}`, 'background: #FF9800; color: white; padding: 2px 8px; border-radius: 3px;');

                            // 创建新的Response对象，包含修改后的文本
                            return new Response(replaceResult.modifiedText, {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                        }

                        // 如果没有修改，返回包含原始文本的新Response
                        return new Response(originalText, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    });
                }

                // 非文本类型响应直接返回
                return response;
            });
        }

        return originalFetch.apply(this, arguments);
    };

    // 显示初始化消息（在认证模块初始化后调用）
    function showInitMessage() {
        console.log('%c🚀 云图网络拦截器已启动', 'background: #4CAF50; color: white; padding: 8px; font-size: 14px; border-radius: 4px;');
        console.log('📋 拦截规则:', YUNTU_INTERCEPT_CONFIGS.map(c => c.name).join(', '));

        if (AuthModule.isLoggedIn()) {
            console.log('🔄 文本替换规则 (已启用):', TEXT_REPLACE_CONFIGS.map(c => c.name).join(', '));
        } else {
            console.log('%c🔒 文本替换规则 (未登录，已禁用)', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;');
        }
    }

    // ===== 登录鉴权模块 =====
    const AuthModule = {
        // 配置
        config: {
            tokenKey: 'yuntu_auth_token',
            userInfoKey: 'yuntu_user_info',
            url: 'https://accounts.feishu.cn/open-apis/authen/v1/authorize',
            clientId: 'cli_a3c535b26739d00d',
            scope: 'auth:user.id:read component:user_profile',
            tokenValidateApi: `${BASE_URL}/validate-token`,
        },

        // 检查登录状态
        isLoggedIn() {
            const token = localStorage.getItem(this.config.tokenKey);
            const userInfo = localStorage.getItem(this.config.userInfoKey);
            return !!(token && userInfo);
        },

        // 获取用户信息
        getUserInfo() {
            const userInfo = localStorage.getItem(this.config.userInfoKey);
            return userInfo ? JSON.parse(userInfo) : null;
        },

        // 保存登录状态
        saveAuthData(token, userInfo) {
            localStorage.setItem(this.config.tokenKey, token);
            localStorage.setItem(this.config.userInfoKey, JSON.stringify(userInfo));
            console.log('%c✅ 登录成功', 'background: #4CAF50; color: white; padding: 4px;');
        },

        // 清除登录状态
        logout() {
            localStorage.removeItem(this.config.tokenKey);
            localStorage.removeItem(this.config.userInfoKey);
            console.log('%c🚪 已退出登录', 'background: #FF5722; color: white; padding: 4px;');
            console.log('%c🔄 退出登录，即将刷新页面...', 'background: #2196F3; color: white; padding: 4px; border-radius: 2px;');

            // 退出登录后刷新页面以禁用文本替换规则
            setTimeout(() => {
                location.reload();
            }, 500); // 延迟0.5秒刷新
        },

        // 验证token有效性
        async validateToken() {
            const token = localStorage.getItem(this.config.tokenKey);
            if (!token) return false;

            try {
                const response = await fetch(this.config.tokenValidateApi, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    return result.valid === true;
                } else {
                    console.error('Token验证请求失败:', response.status, response.statusText);
                    return false;
                }
            } catch (error) {
                console.error('Token验证失败:', error);
                return false;
            }
        },

        // 创建登录模态框
        createLoginModal() {
            // 如果模态框已存在，直接显示
            let modal = document.getElementById('yuntu-auth-modal');
            if (modal) {
                modal.style.display = 'flex';
                return;
            }

            // 创建模态框HTML
            const modalHTML = `
                <div id="yuntu-auth-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div style="
                        background: white;
                        border-radius: 12px;
                        padding: 30px;
                        width: 400px;
                        max-width: 90vw;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        position: relative;
                    ">
                        <!-- 关闭按钮 -->
                        <button id="yuntu-auth-close" style="
                            position: absolute;
                            top: 15px;
                            right: 15px;
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: #666;
                            padding: 0;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">×</button>

                        <!-- 标题 -->
                        <h2 style="
                            margin: 0 0 25px 0;
                            text-align: center;
                            color: #333;
                            font-size: 24px;
                        ">授权验证</h2>


                        <!-- OAuth2登录面板 -->
                        <div id="oauth-panel" class="auth-panel" style="display: block;">
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                    授权方式：
                                </label>
                                <select id="oauth-provider" style="
                                    width: 100%;
                                    padding: 12px;
                                    border: 1px solid #ddd;
                                    border-radius: 6px;
                                    font-size: 14px;
                                ">

                                    <option value="feishu">飞书</option>
                                </select>
                            </div>
                            <button id="oauth-login" style="
                                width: 100%;
                                padding: 12px;
                                background: #4CAF50;
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 16px;
                                margin-bottom: 10px;
                            ">验证</button>
                            <div id="oauth-status" style="
                                text-align: center;
                                color: #666;
                                font-size: 14px;
                            "></div>
                        </div>
                    </div>
                </div>
            `;

            // 插入到页面
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // 绑定事件
            this.bindModalEvents();
        },

        // 绑定模态框事件
        bindModalEvents() {
            const modal = document.getElementById('yuntu-auth-modal');
            const closeBtn = document.getElementById('yuntu-auth-close');
            const oauthPanel = document.getElementById('oauth-panel');
            const oauthLoginBtn = document.getElementById('oauth-login');

            // 关闭模态框
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // 点击外部关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });

            // OAuth登录
            oauthLoginBtn.addEventListener('click', () => {
                const provider = document.getElementById('oauth-provider').value;
                this.startOAuth(provider);
            });
        },



        // 开始OAuth登录
        async startOAuth(provider) {
            const status = document.getElementById('oauth-status');
            const btn = document.getElementById('oauth-login');

            try {
                // 构建OAuth URL
                const state = Math.random().toString(36).substr(2, 9);
                const redirectUri = encodeURIComponent(`${BASE_URL}/auth`);
                const oauthUrl = `${this.config.url}?client_id=${this.config.clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(this.config.scope)}&state=${state}&response_type=code`;

                // 保存state用于验证
                sessionStorage.setItem('oauth_state', state);

                // 添加消息监听器（确保在打开窗口前添加）
                const messageHandler = async (event) => {
                    // 在生产环境中应该验证event.origin
                    if (event.data && event.data.type === 'oauth_callback') {
                        const { code, state: returnedState } = event.data;

                        // 验证state
                        const savedState = sessionStorage.getItem('oauth_state');
                        if (returnedState !== savedState) {
                            console.error('State mismatch, possible CSRF attack');
                            status.textContent = '授权验证失败';
                            return;
                        }

                        if (code) {
                            try {
                                status.textContent = '正在获取访问令牌...';

                                // 打印当前源以便调试
                                console.log('Current origin:', window.location.origin);

                                const response = await fetch(`${BASE_URL}/exchange-token`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ code }),
                                    credentials: 'include'
                                });

                                if (!response.ok) {
                                    throw new Error('Token exchange failed');
                                }

                                const tokenData = await response.json();
                                console.log('🔍 完整响应数据:', tokenData);
                                console.log('🔍 响应状态:', response.status, response.statusText);
                                console.log('🔍 响应头:', [...response.headers.entries()]);

                                // 验证响应数据结构
                                if (!tokenData || !tokenData.userInfo) {
                                    console.error('Invalid token data structure:', tokenData);
                                    throw new Error('Invalid response from server');
                                }

                                // 检查必需的用户信息字段
                                const userInfo = tokenData.userInfo;
                                if (!userInfo.id) {
                                    console.error('Missing user ID in response:', userInfo);
                                    throw new Error('Missing user information');
                                }

                                // 存储token和用户信息
                                this.saveAuthData(tokenData.accessToken, {
                                    userId: userInfo.id,
                                    userName: userInfo.name || '未知用户',
                                    userEmail: userInfo.email || '',
                                    userAvatar: userInfo.avatar || '',
                                    userProvider: userInfo.provider || 'feishu',
                                    userDepartment: userInfo.userDepartment || '未知部门'
                                });

                                // 更新UI
                                document.getElementById('yuntu-auth-modal').style.display = 'none';
                                this.showLoginSuccess();

                            } catch (error) {
                                console.error('Error exchanging token:', error);

                                // 根据错误类型显示不同的提示信息
                                let errorMessage = '获取token失败';
                                if (error.message.includes('Invalid response from server')) {
                                    errorMessage = '服务器响应异常，请重试';
                                } else if (error.message.includes('Missing user information')) {
                                    errorMessage = '获取用户信息失败，请重试';
                                } else if (error.message.includes('Token exchange failed')) {
                                    errorMessage = '授权码交换失败，请重新授权';
                                }

                                status.textContent = errorMessage;
                                btn.disabled = false;
                                btn.textContent = '重试授权';
                            }
                        }

                        // 清理
                        window.removeEventListener('message', messageHandler);
                        sessionStorage.removeItem('oauth_state');
                    }
                };

                window.addEventListener('message', messageHandler);

                // 打开OAuth窗口
                const popup = window.open(oauthUrl, 'oauth_popup', 'width=600,height=700,scrollbars=yes,resizable=yes');

                // 保留轮询作为备份机制
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageHandler);
                        if (!document.getElementById('yuntu-auth-modal').style.display === 'none') {
                            status.textContent = '授权取消或失败';
                            btn.disabled = false;
                            btn.textContent = '开始OAuth2授权';
                        }
                    }
                }, 1000);

            } catch (error) {
                console.error('启动OAuth失败:', error);
                status.textContent = '启动OAuth失败';
                btn.disabled = false;
                btn.textContent = '重试授权';
            }
        },

        // 处理OAuth回调
        async handleOAuthCallback(code, provider) {
            const status = document.getElementById('oauth-status');
            const btn = document.getElementById('oauth-login');

            try {
                status.textContent = '正在登录...';
                if (tokenResult.success) {
                    this.saveAuthData(tokenResult.accessToken, tokenResult.userInfo);
                    document.getElementById('yuntu-auth-modal').style.display = 'none';
                    this.showLoginSuccess();
                } else {
                    status.textContent = '登录失败';
                }

            } catch (error) {
                console.error('OAuth回调处理失败:', error);
                status.textContent = '登录失败';
            } finally {
                btn.disabled = false;
                btn.textContent = '验证';
            }
        },


        // 显示登录成功消息
        showLoginSuccess() {
            const userInfo = this.getUserInfo();
            console.log(`%c🎉 欢迎，${userInfo.userName}！`, 'background: #4CAF50; color: white; padding: 8px; font-size: 14px; border-radius: 4px;');
            console.log(`%c🔄 文本替换规则已启用`, 'background: #4CAF50; color: white; padding: 4px; border-radius: 2px;');

            // 更新登录按钮显示
            this.updateLoginButton();

            // 可以添加页面通知
            if (typeof window.createNotification === 'function') {
                window.createNotification({
                    type: 'success',
                    message: `登录成功！欢迎，${userInfo.userName}`,
                    duration: 3000
                });
            }

            // 登录成功后刷新页面以应用文本替换规则
            console.log('%c🔄 登录完成，即将刷新页面...', 'background: #2196F3; color: white; padding: 4px; border-radius: 2px;');
            setTimeout(() => {
                location.reload();
            }, 1000); // 延迟1秒刷新，让用户看到成功提示
        },

        // 显示登录按钮
        createLoginButton() {
            // 如果按钮已存在，不重复创建
            if (document.getElementById('yuntu-login-btn')) return;

            const button = document.createElement('button');
            button.id = 'yuntu-login-btn';
            button.innerHTML = '登录';
            button.style.cssText = `
                position: fixed;
                top: 50px;
                right: 50px;
                z-index: 9999;
                padding: 10px 20px;
                background:rgba(0, 0, 0, 0);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0);
                transition: all 0.3s ease;
            `;

            button.addEventListener('mouseenter', () => {
                if (!this.isLoggedIn()) {
                    button.style.background = '#5073F0';
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (!this.isLoggedIn()) {
                    button.style.background = '#4E71F2';
                    button.style.transform = 'translateY(0)';
                    button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                }
            });

            button.addEventListener('click', () => {
                if (this.isLoggedIn()) {
                    this.showUserMenu();
                } else {
                    this.createLoginModal();
                }
            });

            document.body.appendChild(button);
            this.updateLoginButton();
        },

        // 更新登录按钮状态
        updateLoginButton() {
            const button = document.getElementById('yuntu-login-btn');
            if (!button) return;

            if (this.isLoggedIn()) {
                const userInfo = this.getUserInfo();
                if (userInfo.userAvatar) {
                    button.innerHTML = `<img src="${userInfo.userAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">`;
                    button.style.padding = '0';
                    button.style.background = 'transparent';
                    button.style.border = 'none';
                    button.style.boxShadow = 'none';
                } else {
                    button.innerHTML = `👤 ${userInfo.userName}`;
                    button.style.background = '#4CAF50';
                }
            } else {
                button.innerHTML = '登录';
                button.style.background = '#4E71F2';
                button.style.padding = '10px 20px';
            }
        },

        // 显示用户菜单
        showUserMenu() {
            const userInfo = this.getUserInfo();

            // 创建用户菜单
            let menu = document.getElementById('yuntu-user-menu');
            if (menu) {
                menu.remove();
            }

            menu = document.createElement('div');
            menu.id = 'yuntu-user-menu';
            menu.style.cssText = `
                position: fixed;
                top: 70px;
                right: 20px;
                z-index: 10000;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                min-width: 200px;
                overflow: hidden;
            `;

            menu.innerHTML = `
                <div style="padding: 15px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: bold; margin-bottom: 5px;">${userInfo.userDepartment || ''} - ${userInfo.userName}</div>
                    <div style="color: #666; font-size: 12px;">${userInfo.userEmail}</div>
                </div>
                <div style="padding: 10px 0;">
                    <button id="user-info-btn" style="
                        width: 100%;
                        padding: 10px 15px;
                        border: none;
                        background: none;
                        text-align: left;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                    ">
                        ℹ️ 用户信息
                    </button>
                    <button id="logout-btn" style="
                        width: 100%;
                        padding: 10px 15px;
                        border: none;
                        background: none;
                        text-align: left;
                        cursor: pointer;
                        color: #f44336;
                        display: flex;
                        align-items: center;
                    ">
                        🚪 退出登录
                    </button>
                </div>
            `;

            document.body.appendChild(menu);

            // 绑定事件
            document.getElementById('user-info-btn').addEventListener('click', () => {
                console.log('用户信息:', userInfo);
                alert(`用户信息：\n姓名：${userInfo.userName}\n邮箱：${userInfo.userEmail}\nID：${userInfo.userId}`);
                menu.remove();
            });

            document.getElementById('logout-btn').addEventListener('click', () => {
                this.logout();
                // 注意：logout()会自动刷新页面，所以不需要手动更新按钮状态和移除菜单
            });

            // 点击外部关闭菜单
            setTimeout(() => {
                const clickOutside = (e) => {
                    if (!menu.contains(e.target) && e.target.id !== 'yuntu-login-btn') {
                        menu.remove();
                        document.removeEventListener('click', clickOutside);
                    }
                };
                document.addEventListener('click', clickOutside);
            }, 100);
        },

        // 初始化认证模块
        init() {
            // 创建登录按钮
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.createLoginButton();
                });
            } else {
                this.createLoginButton();
            }

            // 验证现有token
            if (this.isLoggedIn()) {
                console.log('%c🔐 检查现有登录状态...', 'background: #2196F3; color: white; padding: 4px;');
                this.validateToken().then(valid => {
                    if (valid) {
                        console.log('%c✅ Token验证成功，保持登录状态', 'background: #4CAF50; color: white; padding: 4px;');
                    } else {
                        console.log('%c⚠️ Token已失效，请重新登录', 'background: #FF9800; color: white; padding: 4px;');
                        this.logout();
                        this.updateLoginButton();
                    }
                }).catch(error => {
                    console.error('%c❌ Token验证出错:', 'background: #F44336; color: white; padding: 4px;', error);
                    // 网络错误时不强制退出，给用户选择
                    console.log('%c⚠️ 网络连接问题，跳过token验证', 'background: #FF9800; color: white; padding: 4px;');
                });
            }

            console.log('%c🔐 登录鉴权模块已初始化', 'background: #9C27B0; color: white; padding: 4px;');
        }
    };

    // 初始化认证模块
    AuthModule.init();

    // 显示初始化消息
    showInitMessage();

    // 导出控制接口
    window.yuntuInterceptor = {
        // 显示统计信息
        showStats: function () {
            console.log('%c📊 拦截器统计', 'background: #2196F3; color: white; padding: 4px;');
            console.log('当前活动拦截规则数量:', YUNTU_INTERCEPT_CONFIGS.length);
            YUNTU_INTERCEPT_CONFIGS.forEach((config, index) => {
                console.log(`${index + 1}. ${config.name}: ${config.pattern}`);
            });

            console.log('\n当前活动文本替换规则数量:', TEXT_REPLACE_CONFIGS.length);
            TEXT_REPLACE_CONFIGS.forEach((config, index) => {
                console.log(`${index + 1}. ${config.name}: ${config.urlPattern}`);
                config.replacements.forEach((replacement, rIndex) => {
                    const ruleType = replacement.rule_type || 'string';
                    console.log(`   - 替换${rIndex + 1} (${ruleType}): "${replacement.search}" → "${replacement.replace}"`);
                });
            });
        },

        // 显示文本替换规则
        showReplaceRules: function () {
            console.log('%c🔄 文本替换规则详情', 'background: #FF9800; color: white; padding: 4px;');
            TEXT_REPLACE_CONFIGS.forEach((config, index) => {
                console.groupCollapsed(`${index + 1}. ${config.name}`);
                console.log('URL匹配模式:', config.urlPattern);
                console.log('替换规则:');
                config.replacements.forEach((replacement, rIndex) => {
                    console.log(`  ${rIndex + 1}. 查找: ${replacement.search}`);
                    console.log(`     替换为: ${replacement.replace}`);
                    console.log(`     类型: ${replacement.rule_type || 'string'}`);
                    if (replacement.flags) {
                        console.log(`     标志: ${replacement.flags}`);
                    }
                });
                console.groupEnd();
            });
        },

        // 添加新的文本替换规则
        addReplaceRule: function (urlPattern, searchText, replaceText, ruleName, ruleType = 'string', flags = 'g') {
            const newRule = {
                urlPattern: new RegExp(urlPattern),
                replacements: [
                    {
                        search: ruleType === 'regex' ? searchText : new RegExp(searchText, flags),
                        replace: replaceText,
                        rule_type: ruleType,
                        flags: flags
                    }
                ],
                name: ruleName || `自定义规则${TEXT_REPLACE_CONFIGS.length + 1}`
            };

            TEXT_REPLACE_CONFIGS.push(newRule);
            console.log(`%c✅ 已添加新的文本替换规则: ${newRule.name} (类型: ${ruleType})`, 'background: #4CAF50; color: white; padding: 4px;');
        },

        // 临时禁用拦截器
        disable: function () {
            YUNTU_INTERCEPT_CONFIGS.length = 0;
            console.log('%c⏸️ 拦截器已禁用', 'background: #FF5722; color: white; padding: 4px;');
        },

        // 临时禁用文本替换
        disableReplace: function () {
            TEXT_REPLACE_CONFIGS.length = 0;
            console.log('%c⏸️ 文本替换已禁用', 'background: #FF5722; color: white; padding: 4px;');
        },

        // 重新启用拦截器
        enable: function () {
            location.reload();
        },

        // ===== 认证相关接口 =====

        // 检查登录状态
        isLoggedIn: function () {
            return AuthModule.isLoggedIn();
        },

        // 获取用户信息
        getUserInfo: function () {
            return AuthModule.getUserInfo();
        },

        // 显示登录框
        showLogin: function () {
            AuthModule.createLoginModal();
        },

        // 退出登录
        logout: function () {
            AuthModule.logout();
            // 注意：logout()会自动刷新页面，所以不需要手动更新按钮状态
        },

        // 验证token
        validateToken: function () {
            return AuthModule.validateToken();
        },

        // 显示用户菜单
        showUserMenu: function () {
            if (AuthModule.isLoggedIn()) {
                AuthModule.showUserMenu();
            } else {
                console.log('%c⚠️ 用户未登录', 'background: #FF9800; color: white; padding: 4px;');
            }
        },

        // 更新认证配置
        updateAuthConfig: function (newConfig) {
            Object.assign(AuthModule.config, newConfig);
            console.log('%c✅ 认证配置已更新', 'background: #4CAF50; color: white; padding: 4px;');
        },

        // 显示认证状态
        showAuthStatus: function () {
            console.log('%c🔐 认证状态信息', 'background: #9C27B0; color: white; padding: 4px;');
            console.log('登录状态:', AuthModule.isLoggedIn());
            if (AuthModule.isLoggedIn()) {
                const userInfo = AuthModule.getUserInfo();
                console.log('用户信息:', userInfo);
                console.log('Token存储键:', AuthModule.config.tokenKey);
                console.log('用户信息存储键:', AuthModule.config.userInfoKey);
            }
            console.log('认证配置:', AuthModule.config);
        }
    };

})();