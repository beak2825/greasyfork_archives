// ==UserScript==
// @name         答题助手｜超星学习通｜学起plus｜💯自动答题｜▶️一键操作｜🏆超全题库（每日更新、自动收录）
// @namespace    http://tampermonkey.net/
// @version      0.3.6.6
// @description  已完美兼容、学习通、学起plus  完美应付测试，全自动答题；后续需要完善其他平台请进群进行反馈
// @author       艾凌科技工作室
// @match        *://exam.chinaedu.net/*
// @match        *://mooc1-2.chaoxing.com/exam-ans/mooc2/exam/*
// @match        *://mooc1.chaoxing.com/mooc-ans/mooc2/work/*
// @match        *://mooc1-api.chaoxing.com/exam-ans/mooc2/exam*
// @match        *://mooc1.chaoxing.com/mycourse/studentstudy*
// @match        https://mooc1.chaoxing.com/mooc-ans/knowledge/*
// @match        https://mooc2-ans.chaoxing.com/*
// @require      https://greasyfork.org/scripts/445293/code/TyprMd5.js
// @match        https://mooc1.chaoxing.com/*
// @license      This script is protected. You may not copy, modify, or redistribute it without explicit permission.
// @match        https://mooc2-ans.chaoxing.com/*
// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/544080/%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E5%AD%A6%E8%B5%B7plus%EF%BD%9C%F0%9F%92%AF%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E2%96%B6%EF%B8%8F%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%F0%9F%8F%86%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%88%E6%AF%8F%E6%97%A5%E6%9B%B4%E6%96%B0%E3%80%81%E8%87%AA%E5%8A%A8%E6%94%B6%E5%BD%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544080/%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E5%AD%A6%E8%B5%B7plus%EF%BD%9C%F0%9F%92%AF%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%E2%96%B6%EF%B8%8F%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%F0%9F%8F%86%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%88%E6%AF%8F%E6%97%A5%E6%9B%B4%E6%96%B0%E3%80%81%E8%87%AA%E5%8A%A8%E6%94%B6%E5%BD%95%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // iframe内部的postMessage处理（用于跨域通信）
    if (window !== window.top) {
        // 当前在iframe中，监听来自父页面的消息
        window.addEventListener('message', function(event) {
            if (event.data && event.data.source === 'chapter_list_handler') {
                if (event.data.type === 'FIND_PENDING_TASKS') {
                    // 查找待完成任务点
                    const chapterElements = document.querySelectorAll('.chapter_item, [onclick*="toOld"], .catalog_title');
                    let hasElements = false;

                    for (const element of chapterElements) {
                        const pendingTask = element.querySelector('.catalog_jindu .bntHoverTips') ||
                                          element.querySelector('.bntHoverTips') ||
                                          element.querySelector('[class*="catalog_points"]');

                        if (pendingTask && pendingTask.textContent.includes('待完成任务点')) {
                            hasElements = true;
                            break;
                        }
                    }

                    // 响应父页面
                    const response = {
                        type: 'PENDING_TASKS_FOUND',
                        hasElements: hasElements,
                        elementsCount: chapterElements.length
                    };
                    event.source.postMessage(response, '*');

                } else if (event.data.type === 'CLICK_FIRST_PENDING_TASK') {
                    // 点击第一个待完成任务点
                    const chapterElements = document.querySelectorAll('.chapter_item, [onclick*="toOld"], .catalog_title');

                    for (const element of chapterElements) {
                        const pendingTask = element.querySelector('.catalog_jindu .bntHoverTips') ||
                                          element.querySelector('.bntHoverTips') ||
                                          element.querySelector('[class*="catalog_points"]');

                        if (pendingTask && pendingTask.textContent.includes('待完成任务点')) {
                            const clickableElement = element.querySelector('[onclick]') ||
                                                   element.closest('[onclick]') ||
                                                   element;

                            setTimeout(() => {
                                clickableElement.click();
                                console.log('✅ [iframe] 已点击待完成任务点章节');
                            }, 500);
                            break;
                        }
                    }
                }
            }
        });
    }

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const blockedEvents = ['visibilitychange', 'blur', 'focusout', 'mouseleave', 'beforeunload', 'pagehide'];

    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (blockedEvents.includes(type)) {
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };


    try {
        Object.defineProperty(document, 'hidden', {
            get: () => false,
            configurable: true
        });

        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: true
        });


        Object.defineProperty(document, 'webkitHidden', {
            get: () => false,
            configurable: true
        });
        Object.defineProperty(document, 'mozHidden', {
            get: () => false,
            configurable: true
        });
        Object.defineProperty(document, 'msHidden', {
            get: () => false,
            configurable: true
        });

        Object.defineProperty(document, 'webkitVisibilityState', {
            get: () => 'visible',
            configurable: true
        });
        Object.defineProperty(document, 'mozVisibilityState', {
            get: () => 'visible',
            configurable: true
        });
        Object.defineProperty(document, 'msVisibilityState', {
            get: () => 'visible',
            configurable: true
        });
    } catch (e) {

    }


    document.hasFocus = () => true;

    // 完全按照正确版本添加removeEventListener拦截
    const oldRemove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function(...args) {
        if (args.length !== 0) {
            const eventType = args[0];
            if (blockedEvents.includes(eventType)) {
                console.log(`[${new Date().toLocaleTimeString()}] [防切屏] 阻止移除 ${eventType} 监听器`);
                return; // 不允许移除
            }
        }
        return oldRemove.call(this, ...args);
    };

    // 添加正确版本的全局变量
    const processedIframes = new WeakSet();

    function injectHooksToDocument(doc, context = 'main') {
        if (!doc || doc._hooksInjected) return;

        try {

            const docWindow = doc.defaultView || doc.parentWindow;
            if (docWindow && docWindow.EventTarget) {
                const originalAdd = docWindow.EventTarget.prototype.addEventListener;
                docWindow.EventTarget.prototype.addEventListener = function(type, listener, options) {
                    if (blockedEvents.includes(type)) {
                        return;
                    }
                    return originalAdd.call(this, type, listener, options);
                };
            }


            Object.defineProperty(doc, 'hidden', {
                get: () => false,
                configurable: true
            });
            Object.defineProperty(doc, 'visibilityState', {
                get: () => 'visible',
                configurable: true
            });


            doc.hasFocus = () => true;

            doc._hooksInjected = true;

        } catch (e) {

        }
    }







    // 添加正确版本的processIframes函数
    function processIframes(doc = document, context = 'main', depth = 0) {
        if (depth > 5) return;

        try {
            const iframes = doc.querySelectorAll('iframe');
            iframes.forEach((iframe, index) => {
                if (processedIframes.has(iframe)) return;

                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (!iframeDoc) return;

                    const iframeContext = `${context}-iframe-${index}`;

                    // 注入防切屏钩子到iframe
                    injectHooksToDocument(iframeDoc, iframeContext);

                    // 递归处理嵌套iframe
                    processIframes(iframeDoc, iframeContext, depth + 1);

                    processedIframes.add(iframe);

                } catch (e) {
                    // 跨域限制，忽略
                }
            });
        } catch (e) {
            console.warn(`[${new Date().toLocaleTimeString()}] [iframe检测] iframe处理失败:`, e);
        }
    }

    const clearWindowHandlers = () => {
        if (window.onblur !== null) {
            window.onblur = null;

        }
        if (window.onfocus !== null) {
            window.onfocus = null;

        }
        if (window.onbeforeunload !== null) {
            window.onbeforeunload = null;

        }
    };

    setInterval(clearWindowHandlers, 5000); // 窗口处理器清理间隔调整为5秒
    clearWindowHandlers();

    const pageWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    const pageDocument = pageWindow.document;

    pageWindow._paq = [];

    const originalCreateElement = pageDocument.createElement;
    pageDocument.createElement = function (tagName) {
        if (tagName.toLowerCase() === 'script') {
            const script = originalCreateElement.call(pageDocument, tagName);
            const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;

            Object.defineProperty(script, 'src', {
                set: function (value) {
                    if (value.includes('piwik.js')) {
                        return;
                    }
                    originalSrcSetter.call(this, value);
                },
                configurable: true
            });

            return script;
        }
        return originalCreateElement.call(pageDocument, tagName);
    };


    pageDocument.onkeydown = null;
    pageDocument.addEventListener('keydown', function (e) {

        if (e.keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
            (e.shiftKey && e.keyCode === 121)) {
            e.stopImmediatePropagation();
            return;
        }
    }, true);


    pageWindow.oncontextmenu = null;
    pageWindow.addEventListener('contextmenu', function (e) {
        e.stopImmediatePropagation();
    }, true);


    pageWindow.alert = function (message) {
        if (message && message.includes("请勿打开控制台")) {
            return;
        }
    };

    pageWindow.close = function () {

    };

    Object.defineProperty(pageWindow, 'console', {
        value: pageWindow.console,
        writable: false,
        configurable: false
    });
    const SERVER_CONFIG = {
        apiUrl: 'https://www.toptk.xyz/api',
        answerApiUrl: 'https://www.toptk.xyz/api',
        timeout: 30000
    };

    const GLOBAL_STATE = {
        isAnswering: false,
        isChapterTesting: false,
        lastAnswerTime: 0
    };

    const SITES = {
        XUEQI: {
            name: '学起',
            host: 'exam.chinaedu.net',
            getQuestions: getXueqiQuestions,
            selectAnswer: selectXueqiAnswer,
        },
        CHAOXING: {
            name: '超星学习通',
            host: 'mooc1.chaoxing.com',
            getQuestions: getChaoxingQuestions,
            selectAnswer: selectChaoxingAnswer,
        },

    };
    let currentSite = null;

    function detectSite() {
        const currentHost = window.location.hostname;
        const currentUrl = window.location.href;

        // 检测已知站点
        for (const key in SITES) {
            if (currentHost.includes(SITES[key].host)) {
                currentSite = SITES[key];
                logMessage(`[站点检测] 已识别: ${currentSite.name}`, 'success');
                return currentSite;
            }
        }


        if (currentHost.includes('chaoxing') ||
            currentUrl.includes('chaoxing') ||
            document.querySelector('.questionLi') ||
            document.querySelector('.mark_name') ||
            document.querySelector('[typename]') ||
            document.querySelector('.workTextWrap') ||
            document.title.includes('超星') ||
            document.title.includes('学习通') ||
            currentUrl.includes('work') ||
            currentUrl.includes('exam')) {

            currentSite = SITES.CHAOXING;


            let pageType = '未知';
            if (currentUrl.includes('/exam-ans/mooc2/exam/')) {
                pageType = '考试';
                currentSite.pageType = 'exam';

            } else if (currentUrl.includes('/mooc-ans/mooc2/work/')) {
                pageType = '作业';
                currentSite.pageType = 'homework';

            } else if (currentUrl.includes('/mooc-ans/work/doHomeWorkNew/')) {
                pageType = '章节测验';
                currentSite.pageType = 'chapter_test';

            } else if (currentUrl.includes('/mooc-ans/api/work/')) {
                pageType = '章节测验';
                currentSite.pageType = 'chapter_test';

            } else if (currentUrl.includes('/ananas/modules/work/')) {
                pageType = '章节测验';
                currentSite.pageType = 'chapter_test';

            } else {

                const isHomeworkPage = document.querySelector('.questionLi[typename]') !== null;
                pageType = isHomeworkPage ? '作业' : '考试';
                currentSite.pageType = isHomeworkPage ? 'homework' : 'exam';

            }

            logMessage(`[站点检测] 通过特征识别: ${currentSite.name} - ${pageType}页面`, 'success');
            return currentSite;
        }


        if (currentHost.includes('chinaedu') ||
            currentUrl.includes('exam') ||
            document.querySelector('.questionItem') ||
            document.querySelector('.queStemC') ||
            document.title.includes('学起') ||
            document.title.includes('考试')) {

            currentSite = SITES.XUEQI;
            logMessage(`[站点检测] 通过特征识别: ${currentSite.name}`, 'success');
            return currentSite;
        }


        const hasQuestionElements = document.querySelector('[class*="question"], [id*="question"], .exam, .test, .quiz');
        if (hasQuestionElements) {
            currentSite = SITES.CHAOXING;
            logMessage(`[站点检测] 通用题目页面，使用: ${currentSite.name}`, 'warning');
            return currentSite;
        }

        currentSite = SITES.XUEQI;
        logMessage(`[站点检测] 未识别当前站点, 使用默认解析器: ${currentSite.name}`, 'warning');
        return currentSite;
    }

    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            const {
                method = 'GET',
                headers = {},
                body = null,
                timeout = SERVER_CONFIG.timeout
            } = options;

            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: headers,
                data: body,
                timeout: timeout,
                onload: function (response) {
                    const result = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        json: () => {
                            try {
                                return Promise.resolve(JSON.parse(response.responseText));
                            } catch (error) {
                                return Promise.reject(new Error(`Invalid JSON response: ${error.message}`));
                            }
                        },
                        text: () => Promise.resolve(response.responseText)
                    };
                    resolve(result);
                },
                onerror: function (error) {
                    reject(new Error(`Request failed: ${error.error || 'Network error'}`));
                },
                ontimeout: function () {
                    reject(new Error('Request timeout'));
                }
            });
        });
    }

    const TokenManager = {
        TOKEN_KEY: 'user_token',

        _requestCache: new Map(),
        _lastRequestTime: 0,
        _minRequestInterval: 500,

        async _throttleRequest(key, requestFn, cacheTime = 30000) {
            const now = Date.now();


            if (this._requestCache.has(key)) {
                const cached = this._requestCache.get(key);
                if (now - cached.timestamp < cacheTime) {
                    return cached.result;
                }
            }

            let actualInterval = this._minRequestInterval;
            if (key.includes('validate') || key.includes('verify')) {
                actualInterval = 200;
            } else if (key.includes('check') || key.includes('status')) {
                actualInterval = 100;
            }


            const timeSinceLastRequest = now - this._lastRequestTime;
            if (timeSinceLastRequest < actualInterval) {
                const waitTime = actualInterval - timeSinceLastRequest;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }

            this._lastRequestTime = Date.now();

            try {
                const result = await requestFn();
                this._requestCache.set(key, {
                    result: result,
                    timestamp: Date.now()
                });
                return result;
            } catch (error) {
                if (!error.message.includes('429') && !error.message.includes('网络')) {
                    this._requestCache.delete(key);
                }
                throw error;
            }
        },


        getToken() {
            return localStorage.getItem(this.TOKEN_KEY);
        },


        setToken(token) {
            localStorage.setItem(this.TOKEN_KEY, token);
        },


        clearToken() {
            localStorage.removeItem(this.TOKEN_KEY);

            this._requestCache.clear();
        },


        async checkVisitorStatus() {
            const cacheKey = 'check_visitor_status';

            return await this._throttleRequest(cacheKey, async () => {
                const response = await gmFetch(`${SERVER_CONFIG.apiUrl}/user/check-visitor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: SERVER_CONFIG.timeout
                });

                if (!response.ok) {
                    throw new Error(`检测访问者状态失败: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();

                if (result.success) {

                    if (result.data.isNewUser && result.data.userToken) {
                        this.setToken(result.data.userToken);


                        return {
                            success: true,
                            hasToken: true,
                            token: result.data.userToken,
                            userInfo: result.data.userInfo,
                            message: result.data.message
                        };
                    }


                    if (!result.data.isNewUser && result.data.userToken) {
                        this.setToken(result.data.userToken);

                        return {
                            success: true,
                            hasToken: true,
                            token: result.data.userToken,
                            userInfo: result.data.userInfo,
                            message: result.data.message
                        };
                    }
                }
                if (result.data && result.data.needsToken) {

                    return {
                        success: false,
                        needsToken: true,
                        message: result.data.message || '请输入您的用户Token'
                    };
                }

                throw new Error(result.message || '检测访问者状态失败');
            }, 120000);
        },


        async verifyUserToken(userToken) {
            const cacheKey = `verify_${userToken.substring(0, 16)}`;

            return await this._throttleRequest(cacheKey, async () => {
                const response = await gmFetch(`${SERVER_CONFIG.apiUrl}/user/verify-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userToken: userToken
                    }),
                    timeout: SERVER_CONFIG.timeout
                });

                if (!response.ok) {
                    let errorMessage = `Token验证失败: ${response.status} ${response.statusText}`;

                    try {
                        const result = await response.json();
                        errorMessage = result.message || errorMessage;
                    } catch (parseError) {

                        try {
                            const errorText = await response.text();
                            errorMessage = errorText || errorMessage;
                        } catch (textError) {

                        }
                    }


                    throw new Error(errorMessage);
                }

                const result = await response.json();


                if (!result.success) {
                    const errorMessage = result.message || 'Token验证失败';

                    throw new Error(errorMessage);
                }

                this.setToken(result.data.userToken);

                return {
                    success: true,
                    token: result.data.userToken,
                    userInfo: result.data.userInfo,
                    message: result.data.message
                };
            }, 300000);
        },


        async promptUserToken() {
            try {
                const userToken = prompt(
                    '🔐 请输入您的用户Token\n\n' +
                    '如果您是首次使用，系统会在首次访问时自动为您创建Token。\n' +
                    '如果您已有Token，请输入完整的64位Token字符串：'
                );

                if (!userToken) {
                    throw new Error('用户取消输入Token');
                }

                if (userToken.length !== 64) {
                    throw new Error('Token格式不正确，应为64位字符串');
                }

                return await this.verifyUserToken(userToken);
            } catch (error) {

                throw error;
            }
        },


        async _validateToken(token) {
            const cacheKey = `validate_${token.substring(0, 16)}`;

            return await this._throttleRequest(cacheKey, async () => {

                const response = await gmFetch(`${SERVER_CONFIG.apiUrl}/user/info`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Token': token
                    },
                    timeout: SERVER_CONFIG.timeout
                });

                if (!response.ok) {

                    return false;
                }

                const result = await response.json();

                return result.success;
            }, 60000);
        },

        async getValidToken() {
            let token = this.getToken();


            if (token) {

                const isValid = await this._validateToken(token);
                if (isValid) {

                    return token;
                }

                this.clearToken();
            }
            try {
                const result = await this.initialize();
                if (result.success && result.hasToken) {
                    return this.getToken();
                }
            } catch (error) {

            }
            throw new Error('Token获取失败，请刷新页面重试');
        },

        async getUserInfo() {
            try {
                const token = await this.getValidToken();

                const response = await gmFetch(`${SERVER_CONFIG.apiUrl}/user/info`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Token': token
                    },
                    timeout: SERVER_CONFIG.timeout
                });

                if (!response.ok) {
                    throw new Error(`获取用户信息失败: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || '获取用户信息失败');
                }

                return result.userInfo;

            } catch (error) {

                throw error;
            }
        },

        async initialize() {
            try {
                const storedToken = this.getToken();

                if (storedToken) {
                    const isValid = await this._validateToken(storedToken);
                    if (isValid) {

                        return {
                            success: true,
                            hasToken: true,
                            token: storedToken,
                            message: '欢迎回来！Token已自动加载。'
                        };
                    } else {
                        this.clearToken();
                    }
                }


                return await this.showTokenSelectionDialog();

            } catch (error) {

                return {
                    success: false,
                    error: error.message,
                    message: '初始化失败，请刷新页面重试'
                };
            }
        },

        async showTokenSelectionDialog() {
            return new Promise((resolve) => {

                const dialogHTML = `
                    <div id="token-dialog" style="
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
                        font-family: Arial, sans-serif;
                    ">
                        <div style="
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                            max-width: 500px;
                            width: 90%;
                            text-align: center;
                        ">
                            <h3 style="margin: 0 0 20px 0; color: #333;">🎯 TK星球答题系统</h3>
                            <p style="color: #666; margin: 0 0 25px 0; line-height: 1.5;">
                                请选择您的Token获取方式：
                            </p>
                            
                            <div style="margin: 20px 0;">
                                <button id="create-new-token" style="
                                    background: #007bff;
                                    color: white;
                                    border: none;
                                    padding: 12px 30px;
                                    margin: 0 10px;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 16px;
                                    transition: background 0.3s;
                                " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
                                    🆕 生成新Token
                                </button>
                                
                                <button id="input-existing-token" style="
                                    background: #28a745;
                                    color: white;
                                    border: none;
                                    padding: 12px 30px;
                                    margin: 0 10px;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 16px;
                                    transition: background 0.3s;
                                " onmouseover="this.style.background='#1e7e34'" onmouseout="this.style.background='#28a745'">
                                    📝 填写已有Token
                                </button>
                            </div>
                            
                            <div id="token-input-area" style="display: none; margin-top: 20px;">
                                <input type="text" id="token-input" placeholder="请输入您的Token" style="
                                    width: 100%;
                                    padding: 12px;
                                    border: 2px solid #ddd;
                                    border-radius: 5px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                    margin-bottom: 15px;
                                " />
                                
                                <button id="verify-token" style="
                                    background: #17a2b8;
                                    color: white;
                                    border: none;
                                    padding: 10px 25px;
                                    margin: 0 10px;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 14px;
                                " onmouseover="this.style.background='#117a8b'" onmouseout="this.style.background='#17a2b8'">
                                    验证Token
                                </button>
                                
                                <button id="cancel-input" style="
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    padding: 10px 25px;
                                    margin: 0 10px;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-size: 14px;
                                " onmouseover="this.style.background='#545b62'" onmouseout="this.style.background='#6c757d'">
                                    取消
                                </button>
                            </div>
                            
                            <div id="dialog-message" style="
                                margin-top: 15px;
                                padding: 10px;
                                border-radius: 5px;
                                display: none;
                            "></div>
                        </div>
                    </div>
                `;


                document.body.insertAdjacentHTML('beforeend', dialogHTML);

                const dialog = document.getElementById('token-dialog');
                const createBtn = document.getElementById('create-new-token');
                const inputBtn = document.getElementById('input-existing-token');
                const inputArea = document.getElementById('token-input-area');
                const tokenInput = document.getElementById('token-input');
                const verifyBtn = document.getElementById('verify-token');
                const cancelBtn = document.getElementById('cancel-input');
                const messageDiv = document.getElementById('dialog-message');


                const showMessage = (message, type = 'info') => {
                    messageDiv.style.display = 'block';
                    messageDiv.textContent = message;

                    if (type === 'error') {
                        messageDiv.style.background = '#f8d7da';
                        messageDiv.style.color = '#721c24';
                        messageDiv.style.border = '1px solid #f5c6cb';
                    } else if (type === 'success') {
                        messageDiv.style.background = '#d4edda';
                        messageDiv.style.color = '#155724';
                        messageDiv.style.border = '1px solid #c3e6cb';
                    } else {
                        messageDiv.style.background = '#d1ecf1';
                        messageDiv.style.color = '#0c5460';
                        messageDiv.style.border = '1px solid #bee5eb';
                    }
                };


                const closeDialog = () => {
                    dialog.remove();
                };


                createBtn.addEventListener('click', async () => {
                    try {
                        createBtn.disabled = true;
                        createBtn.textContent = '生成中...';
                        showMessage('正在生成新Token...', 'info');

                        const result = await this.checkVisitorStatus();

                        if (result.success && result.hasToken) {

                            showMessage(`Token生成成功！`, 'success');


                            const tokenDisplay = document.createElement('div');
                            tokenDisplay.style.cssText = `
                                background: #f8f9fa;
                                border: 2px solid #28a745;
                                border-radius: 5px;
                                padding: 10px;
                                margin: 10px 0;
                                font-family: monospace;
                                font-size: 12px;
                                word-break: break-all;
                                cursor: pointer;
                                text-align: center;
                            `;
                            tokenDisplay.textContent = result.token;
                            tokenDisplay.title = '点击复制Token';


                            tokenDisplay.addEventListener('click', async () => {
                                try {
                                    await navigator.clipboard.writeText(result.token);
                                    showMessage('Token已复制到剪贴板！', 'success');
                                } catch (err) {

                                    const textArea = document.createElement('textarea');
                                    textArea.value = result.token;
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textArea);
                                    showMessage('Token已复制到剪贴板！', 'success');
                                }
                            });


                            const rechargeNotice = document.createElement('div');
                            rechargeNotice.style.cssText = `
                                background: #fff3cd;
                                border: 1px solid #ffeaa7;
                                border-radius: 5px;
                                padding: 10px;
                                margin: 10px 0;
                                font-size: 14px;
                                color: #856404;
                                text-align: center;
                            `;
                            rechargeNotice.innerHTML = `
                                ⚠️ <strong>重要提示</strong><br/>
                                新用户默认1000次查询机会，请充值后使用答题功能。<br/>
                                请妥善保存您的Token，它是您的唯一凭证！
                            `;


                            messageDiv.parentNode.insertBefore(tokenDisplay, messageDiv.nextSibling);
                            messageDiv.parentNode.insertBefore(rechargeNotice, tokenDisplay.nextSibling);


                            createBtn.textContent = '开始答题';
                            createBtn.onclick = () => {
                                closeDialog();
                                resolve({
                                    success: true,
                                    hasToken: true,
                                    token: result.token,
                                    message: '新Token已生成，您可以开始答题了！'
                                });
                            };
                        } else {
                            throw new Error(result.message || 'Token生成失败');
                        }
                    } catch (error) {

                        showMessage('生成Token失败: ' + error.message, 'error');
                        createBtn.disabled = false;
                        createBtn.textContent = '🆕 生成新Token';
                    }
                });


                inputBtn.addEventListener('click', () => {
                    inputArea.style.display = 'block';
                    tokenInput.focus();
                });


                verifyBtn.addEventListener('click', async () => {
                    const token = tokenInput.value.trim();
                    if (!token) {
                        showMessage('请输入Token', 'error');
                        return;
                    }

                    try {
                        verifyBtn.disabled = true;
                        verifyBtn.textContent = '验证中...';
                        showMessage('正在验证Token...', 'info');

                        const result = await this.verifyUserToken(token);

                        if (result.success) {
                            showMessage('Token验证成功！', 'success');
                            setTimeout(() => {
                                closeDialog();
                                resolve({
                                    success: true,
                                    hasToken: true,
                                    token: result.token,
                                    message: 'Token验证成功，您可以开始答题了！'
                                });
                            }, 1500);
                        } else {
                            throw new Error(result.message || 'Token验证失败');
                        }
                    } catch (error) {

                        showMessage('Token验证失败: ' + error.message, 'error');
                        verifyBtn.disabled = false;
                        verifyBtn.textContent = '验证Token';
                    }
                });


                cancelBtn.addEventListener('click', () => {
                    inputArea.style.display = 'none';
                    tokenInput.value = '';
                    messageDiv.style.display = 'none';
                });


                tokenInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        verifyBtn.click();
                    }
                });
            });
        }
    };

    function handleSubmitConfirmDialog() {
        const documents = [
            document,
            window.parent?.document,
            window.top?.document
        ].filter(doc => doc);

        let confirmDialog = null;
        let foundInDocument = null;

        for (const doc of documents) {
            try {
                confirmDialog = doc.querySelector('.popBottom');
                if (confirmDialog) {
                    foundInDocument = doc;

                    break;
                }
            } catch (error) {

            }
        }

        if (!confirmDialog) {
            return false;
        }


        const targetDoc = foundInDocument || document;


        const popContent = targetDoc.querySelector('#popcontent');
        if (!popContent || !popContent.textContent.includes('确认提交')) {
            return false;
        }


        const submitBtn = targetDoc.querySelector('#popok');
        if (!submitBtn) {
            return false;
        }


        try {
            submitBtn.click();
            console.log('✅ [提交确认] 已点击提交按钮');


            GLOBAL_STATE.lastAnswerTime = Date.now();
            GLOBAL_STATE.isAnswering = false;
            GLOBAL_STATE.isChapterTesting = false;

            console.log('📝 [提交确认] 章节测验已完成，状态已重置');




            return true;
        } catch (error) {
            console.warn('❌ [提交确认] 点击提交按钮失败:', error);
            return false;
        }
    }

    function monitorSubmitDialog() {
        let checkCount = 0;
        const maxChecks = 10;

        const checkInterval = setInterval(() => {
            checkCount++;


            const dialogHandled = handleSubmitConfirmDialog();


            if (dialogHandled || checkCount >= maxChecks) {
                clearInterval(checkInterval);
            }
        }, 1000);

    }


    function getXueqiQuestions() {
        try {
            const questions = [];


            const examTypeElement = document.querySelector('.test-part .f18.c_2d4.fb');
            const examType = examTypeElement ? examTypeElement.textContent.trim() : '未知题型';


            const examInfoElement = document.querySelector('.test-part .c_dan');

            const questionElements = document.querySelectorAll('.questionItem');

            questionElements.forEach((questionEl, index) => {
                const questionData = {
                    type: examType,
                    questionType: '',
                    number: index + 1,
                    stem: '',
                    options: [],
                    score: ''
                };


                if (questionEl.classList.contains('singItem') || questionEl.querySelector('.singItem')) {
                    questionData.questionType = '单选题';
                } else if (questionEl.classList.contains('judge') || questionEl.querySelector('.judge')) {
                    questionData.questionType = '判断题';
                } else if (questionEl.classList.contains('Mutli') || questionEl.querySelector('.Mutli')) {
                    questionData.questionType = '多选题';
                } else {
                    questionData.questionType = '未知题型';
                }


                const stemElement = questionEl.querySelector('.queStemC');
                if (stemElement) {

                    const numberEl = stemElement.querySelector('.din.fb.mr10');
                    if (numberEl) {
                        questionData.number = numberEl.textContent.trim();
                    }


                    const contentEls = stemElement.querySelectorAll('.din');
                    if (contentEls.length > 1) {

                        const contentEl = contentEls[1];
                        if (contentEl) {

                            const tableSpan = contentEl.querySelector('table span');
                            if (tableSpan) {
                                questionData.stem = tableSpan.textContent.trim();
                            }

                            else {
                                const pEl = contentEl.querySelector('p');
                                if (pEl) {
                                    questionData.stem = pEl.textContent.trim();
                                } else {

                                    const textContent = contentEl.textContent.trim();

                                    questionData.stem = textContent.replace(/\s+/g, ' ').trim();
                                }
                            }
                        }
                    }


                    if (!questionData.stem) {

                        const allText = stemElement.textContent.trim();

                        const cleanText = allText.replace(/^\d+\.\s*/, '').replace(/（\d+分）$/, '').trim();
                        if (cleanText) {
                            questionData.stem = cleanText;
                        }
                    }


                    const scoreEl = stemElement.querySelector('.f13.c_dan var');
                    if (scoreEl) {
                        questionData.score = scoreEl.textContent.trim() + '分';
                    }
                }


                if (questionData.questionType === '判断题') {

                    const judgeButtons = questionEl.querySelectorAll('.JudgeBtn input');
                    judgeButtons.forEach((btn, idx) => {
                        const value = btn.value.trim();
                        questionData.options.push({
                            label: idx === 0 ? 'T' : 'F',
                            content: value,
                            element: btn
                        });
                    });
                } else if (questionData.questionType === '多选题') {

                    const optionElements = questionEl.querySelectorAll('dd.clearfix');
                    optionElements.forEach(optionEl => {
                        const optionLabel = optionEl.querySelector('.duplexCheck');
                        const optionContent = optionEl.querySelector('div');

                        if (optionLabel && optionContent) {
                            questionData.options.push({
                                label: optionLabel.textContent.trim(),
                                content: optionContent.textContent.trim(),
                                element: optionEl
                            });
                        }
                    });
                } else {

                    const optionElements = questionEl.querySelectorAll('dd.clearfix');
                    optionElements.forEach(optionEl => {
                        const optionLabel = optionEl.querySelector('.singleCheck');
                        const optionContent = optionEl.querySelector('div');

                        if (optionLabel && optionContent) {
                            questionData.options.push({
                                label: optionLabel.textContent.trim(),
                                content: optionContent.textContent.trim(),
                                element: optionEl
                            });
                        }
                    });
                }


                questions.push(questionData);
            });

            return questions;
        } catch (error) {
            return [];
        }
    }


    function getChaoxingQuestions() {
        try {
            logMessage('🔍 [超星] 开始解析题目...', 'info');
            const questions = [];
            const currentUrl = window.location.href;


            let pageType = '未知';
            let isExamPage = false;
            let isHomeworkPage = false;
            let isChapterTestPage = false;

            if (currentUrl.includes('/exam-ans/mooc2/exam/')) {
                pageType = '考试';
                isExamPage = true;

            } else if (currentUrl.includes('/mooc-ans/mooc2/work/')) {
                pageType = '作业';
                isHomeworkPage = true;

            } else if (currentUrl.includes('/mooc-ans/work/doHomeWorkNew/') ||
                currentUrl.includes('/mooc-ans/api/work/') ||
                currentUrl.includes('/ananas/modules/work/')) {
                pageType = '章节测验';
                isChapterTestPage = true;

            } else {

                const hasTypenameAttr = document.querySelector('.questionLi[typename]') !== null;
                if (hasTypenameAttr) {
                    pageType = '作业';
                    isHomeworkPage = true;

                } else {
                    pageType = '考试';
                    isExamPage = true;

                }
            }


            const questionElements = document.querySelectorAll('.questionLi');

            if (questionElements.length === 0) {
                logMessage('⚠️ [超星] 未找到题目元素 (.questionLi)，请确认页面结构。', 'warning');
                return [];
            }

            logMessage(`[超星] 发现 ${questionElements.length} 个题目容器 (${pageType}页面)。`, 'info');

            questionElements.forEach((questionEl, index) => {
                try {
                    const questionData = {
                        type: '超星学习通',
                        questionType: '未知题型',
                        number: index + 1,
                        stem: '',
                        options: [],
                        score: '',
                        questionId: ''
                    };


                    let questionId = questionEl.getAttribute('data') ||
                        questionEl.id?.replace('sigleQuestionDiv_', '') || '';


                    if (!questionId) {
                        const optionWithQid = questionEl.querySelector('[qid]');
                        if (optionWithQid) {
                            questionId = optionWithQid.getAttribute('qid');

                        }
                    }

                    questionData.questionId = questionId;


                    if (isHomeworkPage) {

                        const typeNameAttr = questionEl.getAttribute('typename');
                        if (typeNameAttr) {
                            questionData.questionType = typeNameAttr;
                            console.log(`[作业页面] 从typename属性获取题型: ${typeNameAttr}`);
                        }
                    } else if (isExamPage) {

                        const markNameEl = questionEl.querySelector('h3.mark_name');
                        if (markNameEl) {
                            const typeScoreSpan = markNameEl.querySelector('span.colorShallow');
                            if (typeScoreSpan) {
                                const typeScoreText = typeScoreSpan.textContent.trim();

                                const match = typeScoreText.match(/\(([^,)]+)(?:,\s*([^)]+))?\)/);
                                if (match) {
                                    questionData.questionType = match[1].trim();
                                    if (match[2]) {
                                        questionData.score = match[2].trim();
                                    }
                                    console.log(`[考试页面] 从span.colorShallow获取题型: ${questionData.questionType}`);
                                }
                            }
                        }
                    }


                    const markNameEl = questionEl.querySelector('h3.mark_name');
                    if (markNameEl) {

                        const titleText = markNameEl.childNodes[0]?.textContent?.trim() || '';
                        const numberMatch = titleText.match(/^(\d+)\./);
                        if (numberMatch) {
                            questionData.number = numberMatch[1];
                        }


                        let stemText = '';

                        if (isExamPage) {

                            const stemDiv = markNameEl.querySelector('div[style*="overflow:hidden"]');
                            if (stemDiv) {
                                stemText = stemDiv.textContent.trim();

                            } else {

                                const fullText = markNameEl.textContent.trim();
                                stemText = fullText.replace(/^\d+\.\s*/, '');
                                const typePattern = /^\s*\((单选题|多选题|判断题|填空题)(?:,\s*[^)]+)?\)\s*/;
                                stemText = stemText.replace(typePattern, '').trim();

                            }
                        } else if (isHomeworkPage) {

                            const fullText = markNameEl.textContent.trim();

                            stemText = fullText.replace(/^\d+\.\s*/, '');

                            const typePattern = /^\s*\((单选题|多选题|判断题|填空题)(?:,\s*[^)]+)?\)\s*/;
                            stemText = stemText.replace(typePattern, '').trim();

                        }

                        questionData.stem = stemText;


                        if (!questionData.questionType || questionData.questionType === '未知题型') {

                            if (questionData.stem && (
                                questionData.stem.includes('____') ||
                                questionData.stem.includes('（）') ||
                                questionData.stem.includes('()') ||
                                questionData.stem.includes('_____') ||
                                questionData.stem.includes('填空') ||
                                questionData.stem.includes('空白')
                            )) {
                                questionData.questionType = '填空题';

                            } else {

                                questionData.questionType = '单选题';

                            }
                        }
                    }



                    const answerContainer = questionEl.querySelector('.stem_answer');
                    const hasInputElements = questionEl.querySelectorAll('input[type="text"], textarea').length > 0;


                    const hasBlankItems = questionEl.querySelectorAll('.blankItemDiv').length > 0;
                    const hasUEditor = questionEl.querySelectorAll('textarea[name*="answerEditor"]').length > 0;
                    const hasTiankongSize = questionEl.querySelector('input[name*="tiankongsize"]');


                    const typeElement = questionEl.querySelector('.colorShallow');
                    const typeText = typeElement ? typeElement.textContent : '';
                    const isBlankQuestionByType = typeText.includes('填空题') || typeText.includes('【填空题】');

                    if ((hasInputElements || hasBlankItems || hasUEditor || hasTiankongSize || isBlankQuestionByType) &&
                        questionData.questionType !== '填空题') {
                        questionData.questionType = '填空题';
                    }

                    if (questionData.questionType !== '填空题') {
                        if (answerContainer) {
                            const optionElements = answerContainer.querySelectorAll('.clearfix.answerBg');

                            optionElements.forEach(optionEl => {

                                const labelSpan = optionEl.querySelector('.num_option, .num_option_dx');

                                const contentDiv = optionEl.querySelector('.answer_p');

                                if (labelSpan && contentDiv) {
                                    let label = labelSpan.textContent.trim();
                                    let content = '';


                                    const pElement = contentDiv.querySelector('p');
                                    if (pElement) {
                                        content = pElement.textContent.trim();

                                        if (questionData.questionType === '判断题') {
                                            if (content === '对') {
                                                label = 'T';
                                                content = '正确';
                                            } else if (content === '错') {
                                                label = 'F';
                                                content = '错误';
                                            }
                                        }
                                    } else {
                                        content = contentDiv.textContent.trim();
                                    }

                                    questionData.options.push({
                                        label: label,
                                        content: content,
                                        element: optionEl,
                                        dataValue: labelSpan.getAttribute('data') || label,
                                        qid: labelSpan.getAttribute('qid') || questionData.questionId,
                                        isMultipleChoice: questionData.questionType === '多选题'
                                    });
                                }
                            });
                        }
                    } else {


                        const stemAnswerEl = questionEl.querySelector('.stem_answer');
                        if (stemAnswerEl) {

                            const answerContainers = stemAnswerEl.querySelectorAll('.Answer');

                            answerContainers.forEach((answerContainer, index) => {

                                const textareaEl = answerContainer.querySelector('textarea[name*="answerEditor"]');
                                const iframe = answerContainer.querySelector('iframe');
                                const ueditorContainer = answerContainer.querySelector('.edui-editor');

                                if (textareaEl) {
                                    const editorId = textareaEl.id || textareaEl.name;


                                    let ueditorInstanceName = null;
                                    if (iframe && iframe.src) {
                                        const match = iframe.src.match(/ueditorInstant(\d+)/);
                                        if (match) {
                                            ueditorInstanceName = `ueditorInstant${match[1]}`;
                                        }
                                    }


                                    let iframeBody = null;
                                    try {
                                        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
                                            iframeBody = iframe.contentDocument.body;
                                        }
                                    } catch (e) {

                                    }

                                    questionData.options.push({
                                        label: `填空${index + 1}`,
                                        content: '',
                                        element: textareaEl,
                                        dataValue: '',
                                        isFillInBlank: true,
                                        inputType: 'ueditor',
                                        editorId: editorId,
                                        ueditorContainer: ueditorContainer,
                                        iframe: iframe,
                                        iframeBody: iframeBody,
                                        ueditorInstanceName: ueditorInstanceName,
                                        answerContainer: answerContainer
                                    });
                                } else {

                                    const inputEl = answerContainer.querySelector('input[type="text"], textarea');
                                    if (inputEl) {
                                        questionData.options.push({
                                            label: `填空${index + 1}`,
                                            content: '',
                                            element: inputEl,
                                            dataValue: '',
                                            isFillInBlank: true,
                                            inputType: 'normal',
                                            answerContainer: answerContainer
                                        });
                                    }
                                }
                            });


                            if (answerContainers.length === 0) {
                                const inputElements = stemAnswerEl.querySelectorAll('input[type="text"], textarea');
                                inputElements.forEach((inputEl, index) => {
                                    questionData.options.push({
                                        label: `填空${index + 1}`,
                                        content: '',
                                        element: inputEl,
                                        dataValue: '',
                                        isFillInBlank: true,
                                        inputType: 'normal'
                                    });
                                });
                            }
                        }


                        if (questionData.options.length === 0) {
                            questionData.options.push({
                                label: '填空1',
                                content: '',
                                element: null,
                                dataValue: '',
                                isFillInBlank: true,
                                isVirtual: true
                            });
                        }
                    }


                    if (questionData.stem && (questionData.options.length > 0 || questionData.questionType === '填空题')) {
                        questions.push(questionData);
                    } else {
                        logMessage(`⚠️ [超星] 第 ${index + 1} 题数据不完整，跳过`, 'warning');
                    }

                } catch (e) {
                    logMessage(`❌ [超星] 解析第 ${index + 1} 题时出错: ${e.message}`, 'error');
                }
            });

            if (questions.length > 0) {
                logMessage(`✅ [超星] 成功解析 ${questions.length} 道题目`, 'success');


                const typeCount = {};
                questions.forEach(q => {
                    typeCount[q.questionType] = (typeCount[q.questionType] || 0) + 1;
                });

                const typeStats = Object.entries(typeCount)
                    .map(([type, count]) => `${type}:${count}`)
                    .join(' ');
                logMessage(`📊 [超星] 题型分布: ${typeStats}`, 'info');
            } else {
                logMessage('❌ [超星] 未能解析到任何题目', 'error');
            }

            return questions;

        } catch (error) {
            logMessage(`❌ [超星] 题目解析失败: ${error.message}`, 'error');
            return [];
        }
    }


    function getExamQuestions() {
        try {

            if (!currentSite) {
                detectSite();
            }


            const selectors = [
                '.questionLi',
                '.questionItem',
                '.question-item',
                '.exam-question',
                '[class*="question"]'
            ];

            let foundElements = [];
            let usedSelector = '';

            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    foundElements = elements;
                    usedSelector = selector;
                    break;
                }
            }

            if (foundElements.length === 0) {
                return [];
            }

            console.log(`✅ [调试] 使用选择器 "${usedSelector}" 找到 ${foundElements.length} 个题目元素`);


            if (currentSite && typeof currentSite.getQuestions === 'function') {
                console.log('🔍 [调试] 调用站点专用解析函数:', currentSite.name);
                const questions = currentSite.getQuestions();
                console.log('🔍 [调试] 解析结果:', questions.length, '道题目');
                return questions;
            } else {
                console.warn('⚠️ [调试] 站点解析函数不存在，尝试通用解析');
                return tryGenericParsing(foundElements, usedSelector);
            }

        } catch (error) {
            console.error('❌ [调试] 获取题目时出错:', error);
            return [];
        }
    }


    function tryGenericParsing(elements, selector) {
        const questions = [];

        elements.forEach((el, index) => {
            try {
                const questionData = {
                    type: '通用解析',
                    questionType: '未知题型',
                    number: index + 1,
                    stem: '',
                    options: [],
                    score: ''
                };


                const textContent = el.textContent.trim();
                if (textContent.length > 10) {
                    questionData.stem = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');


                    if (textContent.includes('单选') || textContent.includes('Single')) {
                        questionData.questionType = '单选题';
                    } else if (textContent.includes('多选') || textContent.includes('Multiple')) {
                        questionData.questionType = '多选题';
                    } else if (textContent.includes('判断') || textContent.includes('True') || textContent.includes('False')) {
                        questionData.questionType = '判断题';
                    }

                    questions.push(questionData);
                    console.log(`🔍 [调试] 通用解析题目 ${index + 1}:`, questionData.questionType, questionData.stem.substring(0, 50) + '...');
                }
            } catch (error) {
                console.warn(`⚠️ [调试] 通用解析第 ${index + 1} 题失败:`, error.message);
            }
        });

        console.log(`✅ [调试] 通用解析完成，共 ${questions.length} 道题目`);
        return questions;
    }




    async function callCloudAPI(questionData) {
        try {
            const token = await TokenManager.getValidToken();

            const requestData = {
                question: questionData.stem,
                questionType: questionData.questionType,
                options: questionData.options.map(opt => ({
                    label: opt.label,
                    content: opt.content
                }))
            };


            if (questionData.questionType === '填空题') {
                requestData.options = [];
                requestData.fillInBlank = true;
            }

            const response = await gmFetch(`${SERVER_CONFIG.answerApiUrl}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Token': token
                },
                body: JSON.stringify(requestData),
                timeout: SERVER_CONFIG.timeout
            });


            if (response.status === 429) {
                logMessage('⚠️ 请求过于频繁，等待10秒后继续...', 'warning');

                await new Promise(resolve => {
                    let remaining = 10;
                    const countdownInterval = setInterval(() => {
                        if (remaining <= 0) {
                            clearInterval(countdownInterval);
                            resolve();
                            return;
                        }

                        const statusElement = document.getElementById('question-count');
                        if (statusElement) {
                            statusElement.textContent = `⏳ 限流等待中... ${remaining}s`;
                        }
                        remaining--;
                    }, 1000);
                });

                throw new Error('429_RATE_LIMIT_HANDLED');
            }

            if (!response.ok) {
                if (response.status === 401) {
                    TokenManager.clearToken();
                    throw new Error('Token无效或已过期，请刷新页面重新获取Token');
                }

                let errorText = `API请求失败: ${response.status} ${response.statusText}`;
                try {
                    const errorResponse = await response.json();
                    if (errorResponse.message) {
                        errorText = `API请求失败: ${errorResponse.message}`;
                    }
                } catch (jsonError) {
                    try {
                        const textResponse = await response.text();
                        if (textResponse) {
                            errorText = `API请求失败: ${response.status} ${response.statusText} - ${textResponse.substring(0, 200)}`;
                        }
                    } catch (textError) {

                    }
                }
                throw new Error(errorText);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || '云端分析失败');
            }


            if (result.quota) {
                logMessage(result.quota.message, 'info');

            }


            result.data.cached = result.cached || false;
            result.data.responseTime = result.data.responseTime || 0;

            return result.data;

        } catch (error) {
            console.error('❌ [客户端API] 调用失败:', error.message);


            if (error.message.includes('Token') || error.message.includes('token')) {
                logMessage('❌ Token验证失败，请刷新页面重新获取Token', 'error');
                throw new Error('Token验证失败，请刷新页面重新获取Token');
            }

            throw error;
        }
    }



    async function autoAnswerAllQuestions(delay = 1000) {
        try {

            if (GLOBAL_STATE.isAnswering || GLOBAL_STATE.isChapterTesting) {
                logMessage('⏸️ 已有答题任务在进行中，请稍后再试', 'warning');
                return [];
            }

            GLOBAL_STATE.isAnswering = true;

            const questions = getExamQuestions();

            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                logMessage('❌ 批量答题失败: 未找到题目', 'error');
                return [];
            }

            logMessage(`🚀 开始自动答题，共 ${questions.length} 道题目`, 'info');

            // 更新答题窗口状态
            addTestLog(`开始考试答题，共 ${questions.length} 道题目`, 'info');
            {
                const typeCount = {};
                questions.forEach(q => {
                    const t = q.questionType || '未知题型';
                    typeCount[t] = (typeCount[t] || 0) + 1;
                });
                const typeStats = Object.entries(typeCount).map(([t, c]) => `${t}:${c}`).join(' ');
                if (typeStats) addTestLog(`题型：${typeStats}`, 'info');
            }
            updateTestProgress(0, questions.length);

            const results = [];
            for (let i = 0; i < questions.length; i++) {
                // 更新答题窗口进度
                updateTestProgress(i + 1, questions.length);

                const statusElement = document.getElementById('question-count');
                if (statusElement) {
                    statusElement.textContent = `📝 答题进度: ${i + 1}/${questions.length} (${Math.round((i + 1) / questions.length * 100)}%)`;
                }
                try {
                    const result = await answerSingleQuestion(i);
                    if (result) {
                        results.push(result);
                    } else {
                        logMessage(`❌ 第 ${i + 1} 题答题失败`, 'error');
                    }
                } catch (error) {
                    logMessage(`❌ 第 ${i + 1} 题出错: ${error.message}`, 'error');
                }


                if (i < questions.length - 1) {
                    await new Promise(resolve => {
                        let remaining = Math.ceil(delay / 1000);
                        const countdownInterval = setInterval(() => {
                            if (remaining <= 0) {
                                clearInterval(countdownInterval);
                                resolve();
                                return;
                            }

                            if (statusElement) {
                                statusElement.textContent = `⏳ 等待中... ${remaining}s (第${i + 2}题准备中)`;
                            }

                            remaining--;
                        }, 1000);
                    });
                }
            }

            setTimeout(() => {
                updateQuestionCount();
            }, 1000);

            if (results.length === questions.length) {
                logMessage(`🎉 自动答题完成！全部成功 (${results.length}/${questions.length})`, 'success');
            } else {
                logMessage(`⚠️ 自动答题完成，成功: ${results.length}/${questions.length}`, 'warning');
            }

            return results;
        } catch (error) {
            logMessage(`❌ 批量答题失败: ${error.message}`, 'error');
            return [];
        } finally {

            GLOBAL_STATE.isAnswering = false;
            GLOBAL_STATE.lastAnswerTime = Date.now();
        }
    }


    async function fillAnswers(questions, answers) {
        if (!questions || questions.length === 0) {
            logMessage('❌ 没有题目需要填写答案', 'error');
            return { success: false, message: '没有题目需要填写答案' };
        }

        if (!answers || answers.length === 0) {
            logMessage('❌ 没有获取到答案', 'error');
            return { success: false, message: '没有获取到答案' };
        }

        let successCount = 0;
        const results = [];

        for (let i = 0; i < Math.min(questions.length, answers.length); i++) {
            const question = questions[i];
            const answer = answers[i];

            try {

                logQuestionAnswer(question.stem, answer.answer, question.questionType);

                const result = await fillSingleAnswer(question, answer);
                results.push(result);

                if (result.success) {
                    successCount++;
                    logMessage(`✅ 第${i + 1}题填写成功`, 'success');
                } else {
                    logMessage(`❌ 第${i + 1}题填写失败: ${result.message}`, 'error');
                }


                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                logMessage(`❌ 第${i + 1}题处理异常: ${error.message}`, 'error');
                results.push({ success: false, message: error.message });
            }
        }

        const message = `答题完成：成功 ${successCount}/${questions.length} 题`;
        logMessage(message, successCount > 0 ? 'success' : 'error');

        return {
            success: successCount > 0,
            message: message,
            successCount: successCount,
            totalCount: questions.length,
            results: results
        };
    }


    function selectXueqiAnswer(questionIndex, answer) {
        try {
            const questionElements = document.querySelectorAll('.questionItem');

            if (questionIndex >= questionElements.length) {
                console.log('题目索引超出范围');
                return false;
            }

            const questionEl = questionElements[questionIndex];


            if (questionEl.classList.contains('judge') || questionEl.querySelector('.judge')) {

                const judgeButtons = questionEl.querySelectorAll('.JudgeBtn input');

                for (let btn of judgeButtons) {
                    const btnValue = btn.value.trim();

                    if ((answer === 'T' && btnValue === '正确') ||
                        (answer === 'F' && btnValue === '错误')) {


                        btn.click();


                        const judgeBtn = btn.parentElement;
                        judgeBtn.style.backgroundColor = '#e8f5e8';
                        setTimeout(() => {
                            judgeBtn.style.backgroundColor = '';
                        }, 1000);

                        return true;
                    }
                }
            } else if (questionEl.classList.contains('Mutli') || questionEl.querySelector('.Mutli')) {

                const options = questionEl.querySelectorAll('dd.clearfix');


                if (!answer || typeof answer !== 'string' || answer.length === 0) {
                    console.error('多选题答案无效:', answer);
                    return false;
                }

                let answersToSelect;
                try {

                    answersToSelect = [...answer];
                } catch (err) {
                    console.error('多选题答案转换失败:', err);
                    return false;
                }

                let successCount = 0;

                for (let option of options) {
                    const optionLabel = option.querySelector('.duplexCheck');
                    if (optionLabel) {
                        const labelText = optionLabel.textContent.trim();

                        if (answersToSelect && answersToSelect.includes(labelText)) {

                            option.click();


                            option.style.backgroundColor = '#e8f5e8';
                            setTimeout(() => {
                                option.style.backgroundColor = '';
                            }, 1000);

                            successCount++;
                        }
                    }
                }

                return answersToSelect && successCount === answersToSelect.length;
            } else {

                const options = questionEl.querySelectorAll('dd.clearfix');

                for (let option of options) {
                    const optionLabel = option.querySelector('.singleCheck');
                    if (optionLabel && optionLabel.textContent.trim() === answer) {

                        option.click();


                        option.style.backgroundColor = '#e8f5e8';
                        setTimeout(() => {
                            option.style.backgroundColor = '';
                        }, 1000);

                        return true;
                    }
                }
            }

            return false;
        } catch (error) {
            console.error('选择答案失败:', error);
            return false;
        }
    }


    function selectChaoxingAnswer(questionIndex, answer) {
        try {
            logMessage(`🎯 [超星] 选择第 ${questionIndex + 1} 题答案: ${answer}`, 'info');
            const questions = getExamQuestions();
            const questionData = questions[questionIndex];

            if (!questionData) {
                logMessage(`❌ [超星] 第 ${questionIndex + 1} 题数据未找到`, 'error');
                return false;
            }


            if (questionData.questionType === '填空题') {
                return selectFillInBlankAnswer(questionData, answer);
            }


            let answersToSelect = [];
            if (questionData.questionType === '判断题') {

                if (answer === 'T' || answer === 'true' || answer === '对') {
                    answersToSelect = ['T'];
                } else if (answer === 'F' || answer === 'false' || answer === '错') {
                    answersToSelect = ['F'];
                } else {

                    const option = questionData.options.find(opt => opt.label === answer);
                    if (option && option.dataValue) {
                        answersToSelect = [option.dataValue === 'true' ? 'T' : 'F'];
                    } else {
                        answersToSelect = [answer];
                    }
                }
            } else {

                answersToSelect = [...answer.toUpperCase()];
            }

            let successCount = 0;
            const questionId = questionData.questionId;


            if (questionData.questionType === '多选题') {
                return new Promise(async (resolve) => {
                    for (let i = 0; i < answersToSelect.length; i++) {
                        const ans = answersToSelect[i];


                        const targetOption = questionData.options.find(opt => opt.label === ans);

                        if (targetOption && targetOption.element) {

                            const isSelected = targetOption.element.classList.contains('hasBeenTo') ||
                                targetOption.element.classList.contains('selected') ||
                                targetOption.element.querySelector('.num_option, .num_option_dx')?.classList.contains('hasBeenTo');

                            if (isSelected) {

                                successCount++;
                                continue;
                            }


                            try {

                                const isHomeworkPage = document.querySelector('.questionLi[typename]') !== null;
                                if (isHomeworkPage) {

                                    if (typeof pageWindow.addMultipleChoice === 'function') {
                                        pageWindow.addMultipleChoice(targetOption.element);

                                    } else {
                                        targetOption.element.click();
                                        logMessage(`✅ [超星] 通过click()选择选项 ${ans}`, 'success');
                                    }
                                } else {

                                    const optionQid = targetOption.qid || questionId;
                                    let success = false;



                                    if (typeof pageWindow.saveMultiSelect === 'function' && optionQid) {
                                        try {
                                            pageWindow.saveMultiSelect(targetOption.element, optionQid);

                                            success = true;
                                        } catch (e) {
                                            console.log(`[超星] saveMultiSelect失败:`, e.message);
                                        }
                                    }


                                    if (!success && typeof pageWindow.addMultipleChoice === 'function') {
                                        try {
                                            pageWindow.addMultipleChoice(targetOption.element);

                                            success = true;
                                        } catch (e) {
                                            console.log(`[超星] addMultipleChoice失败:`, e.message);
                                        }
                                    }


                                    if (!success) {
                                        try {
                                            targetOption.element.click();
                                            logMessage(`✅ [超星] 通过click()选择选项 ${ans}`, 'success');
                                            success = true;
                                        } catch (e) {
                                            console.log(`[超星] click失败:`, e.message);
                                        }
                                    }

                                    if (!success) {
                                        logMessage(`❌ [超星] 所有方法都失败，无法选择多选题选项 ${ans}`, 'error');
                                    }
                                }


                                targetOption.element.style.backgroundColor = '#e8f5e8';
                                targetOption.element.style.border = '2px solid #4ade80';

                                setTimeout(() => {
                                    targetOption.element.style.backgroundColor = '';
                                    targetOption.element.style.border = '';
                                }, 2000);

                                successCount++;


                                if (i < answersToSelect.length - 1) {
                                    await new Promise(resolve => setTimeout(resolve, 300));
                                }

                            } catch (clickError) {

                            }
                        } else {

                        }
                    }


                    const success = successCount > 0;
                    if (success) {

                    } else {

                    }
                    resolve(success);
                });
            } else {

                answersToSelect.forEach(ans => {

                    let targetOption = null;

                    if (questionData.questionType === '判断题') {

                        targetOption = questionData.options.find(opt =>
                            opt.label === ans ||
                            (ans === 'T' && (opt.dataValue === 'true' || opt.content === '正确' || opt.content === '对')) ||
                            (ans === 'F' && (opt.dataValue === 'false' || opt.content === '错误' || opt.content === '错'))
                        );
                    } else {

                        targetOption = questionData.options.find(opt => opt.label === ans);
                    }

                    if (targetOption && targetOption.element) {

                        const isSelected = targetOption.element.classList.contains('hasBeenTo') ||
                            targetOption.element.classList.contains('selected') ||
                            targetOption.element.querySelector('.num_option, .num_option_dx')?.classList.contains('hasBeenTo');

                        if (isSelected) {

                            successCount++;
                            return;
                        }


                        try {

                            const isHomeworkPage = document.querySelector('.questionLi[typename]') !== null;


                            if (isHomeworkPage) {

                                if (typeof pageWindow.addChoice === 'function') {
                                    pageWindow.addChoice(targetOption.element);
                                    logMessage(`✅ [超星] 通过addChoice()选择选项 ${ans}`, 'success');
                                } else {
                                    targetOption.element.click();
                                    logMessage(`✅ [超星] 通过click()选择选项 ${ans}`, 'success');
                                }
                            } else {

                                const optionQid = targetOption.qid || questionId;
                                if (typeof pageWindow.saveSingleSelect === 'function' && optionQid) {
                                    pageWindow.saveSingleSelect(targetOption.element, optionQid);
                                    logMessage(`✅ [超星] 通过saveSingleSelect()选择选项 ${ans}`, 'success');
                                } else {

                                    targetOption.element.click();
                                    logMessage(`✅ [超星] 通过click()选择选项 ${ans}`, 'success');
                                }
                            }


                            targetOption.element.style.backgroundColor = '#e8f5e8';
                            targetOption.element.style.border = '2px solid #4ade80';

                            setTimeout(() => {
                                targetOption.element.style.backgroundColor = '';
                                targetOption.element.style.border = '';
                            }, 2000);

                            successCount++;

                        } catch (clickError) {
                            logMessage(`❌ [超星] 点击选项 ${ans} 失败: ${clickError.message}`, 'error');
                            console.error('[超星] 点击错误详情:', clickError);
                        }
                    } else {
                        logMessage(`⚠️ [超星] 未找到答案选项 '${ans}'`, 'warning');
                        console.log('[超星] 可用选项:', questionData.options.map(opt => `${opt.label}(${opt.content})`));
                    }
                });
            }


            const success = successCount > 0;
            if (success) {
                logMessage(`✅ [超星] 第 ${questionIndex + 1} 题答案选择完成 (${successCount}/${answersToSelect.length})`, 'success');
            } else {
                logMessage(`❌ [超星] 第 ${questionIndex + 1} 题答案选择失败`, 'error');
            }

            return success;

        } catch (error) {
            logMessage(`❌ [超星] 选择答案时出错: ${error.message}`, 'error');
            console.error('[超星] 答案选择错误:', error);
            return false;
        }
    }


    function selectFillInBlankAnswer(questionData, answer) {
        try {
            logMessage(`📝 [填空题] 填入答案: ${answer}`, 'info');


            const fillInBlankOptions = questionData.options.filter(opt => opt.isFillInBlank);

            if (fillInBlankOptions.length === 0) {
                logMessage(`❌ [填空题] 未找到输入框`, 'error');
                return false;
            }

            let successCount = 0;


            let answers = [];
            if (answer.includes('|')) {
                answers = answer.split('|').map(a => a.trim());
                logMessage(`📝 [填空题] 使用|分隔，解析出${answers.length}个答案: ${answers.join(', ')}`, 'info');
            } else if (answer.includes('，')) {
                answers = answer.split('，').map(a => a.trim());
                logMessage(`📝 [填空题] 使用，分隔，解析出${answers.length}个答案: ${answers.join(', ')}`, 'info');
            } else if (answer.includes(',')) {
                answers = answer.split(',').map(a => a.trim());
                logMessage(`📝 [填空题] 使用,分隔，解析出${answers.length}个答案: ${answers.join(', ')}`, 'info');
            } else {
                answers = [answer.trim()];
                logMessage(`📝 [填空题] 单个答案: ${answers[0]}`, 'info');
            }

            fillInBlankOptions.forEach((option, index) => {

                if (index >= answers.length) {
                    logMessage(`⚠️ [填空题] 填空${index + 1}没有对应答案，跳过`, 'warning');
                    return;
                }
                const answerText = answers[index];
                logMessage(`📝 [填空题] 准备填入填空${index + 1}: "${answerText}"`, 'info');

                if (option.element) {
                    try {
                        if (option.inputType === 'ueditor') {

                            const editorId = option.editorId;
                            logMessage(`🔍 [填空题] UEditor ID: ${editorId}`, 'info');

                            let ueditorSuccess = false;


                            if (option.iframeBody) {
                                try {
                                    option.iframeBody.innerHTML = `<p>${answerText}<br></p>`;


                                    const inputEvent = new Event('input', { bubbles: true });
                                    option.iframeBody.dispatchEvent(inputEvent);

                                    logMessage(`✅ [填空题] 直接操作iframeBody填空${index + 1}已填入: ${answerText}`, 'success');
                                    ueditorSuccess = true;
                                    successCount++;
                                } catch (error) {
                                    logMessage(`⚠️ [填空题] 直接操作iframeBody失败: ${error.message}`, 'warning');
                                }
                            }


                            if (typeof window.UE !== 'undefined') {
                                let editor = null;


                                if (window.UE.getEditor) {
                                    editor = window.UE.getEditor(editorId);
                                }


                                if (!editor && window.UE.instants && option.ueditorInstanceName) {
                                    editor = window.UE.instants[option.ueditorInstanceName];
                                }

                                logMessage(`🔍 [填空题] UEditor实例状态: ${editor ? '找到' : '未找到'} (ID: ${editorId})`, 'info');

                                if (editor && editor.setContent) {
                                    editor.setContent(answerText);
                                    logMessage(`✅ [填空题] UEditor setContent填空${index + 1}已填入: ${answerText}`, 'success');
                                    ueditorSuccess = true;
                                    successCount++;
                                } else if (editor && editor.execCommand) {

                                    editor.execCommand('inserthtml', answerText);
                                    logMessage(`✅ [填空题] UEditor execCommand填空${index + 1}已填入: ${answerText}`, 'success');
                                    ueditorSuccess = true;
                                    successCount++;
                                } else if (editor && editor.body) {

                                    editor.body.innerHTML = `<p>${answerText}<br></p>`;
                                    logMessage(`✅ [填空题] UEditor body操作填空${index + 1}已填入: ${answerText}`, 'success');
                                    ueditorSuccess = true;
                                    successCount++;
                                } else {
                                    logMessage(`⚠️ [填空题] UEditor实例方法不可用，尝试其他方法`, 'warning');
                                }
                            } else {
                                logMessage(`⚠️ [填空题] UE对象不存在，尝试其他方法`, 'warning');
                            }


                            if (!ueditorSuccess && option.iframe) {
                                try {
                                    const iframe = option.iframe;
                                    logMessage(`🔍 [填空题] 重新尝试获取iframe body: ${iframe.id}`, 'info');


                                    const tryGetIframeBody = (attempts = 0) => {
                                        try {
                                            if (iframe.contentDocument && iframe.contentDocument.body) {
                                                const iframeBody = iframe.contentDocument.body;


                                                if (iframeBody.contentEditable === 'true' || iframeBody.classList.contains('view')) {
                                                    iframeBody.innerHTML = `<p>${answerText}<br></p>`;


                                                    const events = ['input', 'change', 'keyup', 'blur'];
                                                    events.forEach(eventType => {
                                                        try {
                                                            const event = new iframe.contentWindow.Event(eventType, { bubbles: true });
                                                            iframeBody.dispatchEvent(event);
                                                        } catch (e) {

                                                        }
                                                    });

                                                    logMessage(`✅ [填空题] iframe重新获取填空${index + 1}已填入: ${answerText}`, 'success');
                                                    ueditorSuccess = true;
                                                    successCount++;
                                                    return true;
                                                } else {
                                                    logMessage(`⚠️ [填空题] iframe body不可编辑`, 'warning');
                                                }
                                            }
                                        } catch (e) {
                                            logMessage(`⚠️ [填空题] iframe访问失败 (尝试${attempts + 1}): ${e.message}`, 'warning');
                                        }


                                        if (attempts < 2) {
                                            setTimeout(() => tryGetIframeBody(attempts + 1), 200);
                                        }
                                        return false;
                                    };

                                    tryGetIframeBody();

                                } catch (error) {
                                    logMessage(`⚠️ [填空题] iframe重新获取失败: ${error.message}`, 'warning');
                                }
                            }


                            if (!ueditorSuccess && option.iframe) {
                                try {
                                    const iframe = option.iframe;
                                    if (iframe.contentDocument && iframe.contentWindow) {
                                        const iframeDoc = iframe.contentDocument;
                                        const iframeBody = iframeDoc.body;

                                        if (iframeBody) {

                                            iframeBody.innerHTML = '';


                                            const p = iframeDoc.createElement('p');
                                            p.textContent = answerText;
                                            p.appendChild(iframeDoc.createElement('br'));
                                            iframeBody.appendChild(p);


                                            const inputEvent = new Event('input', { bubbles: true });
                                            iframeBody.dispatchEvent(inputEvent);

                                            logMessage(`✅ [填空题] 模拟操作填空${index + 1}已填入: ${answerText}`, 'success');
                                            ueditorSuccess = true;
                                            successCount++;
                                        }
                                    }
                                } catch (error) {
                                    logMessage(`⚠️ [填空题] 模拟操作失败: ${error.message}`, 'warning');
                                }
                            }


                            if (!ueditorSuccess && option.iframe) {
                                try {
                                    const iframe = option.iframe;
                                    logMessage(`🔍 [填空题] 使用保存的iframe引用: ${iframe.id}`, 'info');

                                    const setIframeContent = () => {
                                        try {
                                            if (iframe.contentDocument && iframe.contentDocument.body) {
                                                const body = iframe.contentDocument.body;
                                                body.innerHTML = `<p>${answerText}<br></p>`;


                                                if (iframe.contentWindow) {
                                                    const inputEvent = new iframe.contentWindow.Event('input', { bubbles: true });
                                                    body.dispatchEvent(inputEvent);
                                                }

                                                logMessage(`✅ [填空题] 使用iframe引用填空${index + 1}已填入: ${answerText}`, 'success');
                                                ueditorSuccess = true;
                                                successCount++;
                                                return true;
                                            }
                                        } catch (e) {
                                            logMessage(`⚠️ [填空题] iframe内容设置失败: ${e.message}`, 'warning');
                                        }
                                        return false;
                                    };


                                    if (!setIframeContent()) {
                                        setTimeout(setIframeContent, 200);
                                    }

                                } catch (error) {
                                    logMessage(`⚠️ [填空题] iframe引用操作失败: ${error.message}`, 'warning');
                                }
                            }
                        } else {

                            const element = option.element;


                            logMessage(`🔍 [填空题] 元素类型: ${element.tagName}, name: ${element.name}, id: ${element.id}`, 'info');


                            element.value = answerText;


                            if (element.value === answerText) {
                                logMessage(`✅ [填空题] 值设置成功: ${element.value}`, 'info');
                            } else {
                                logMessage(`❌ [填空题] 值设置失败，期望: ${answerText}, 实际: ${element.value}`, 'error');
                            }


                            const events = ['input', 'change', 'blur', 'keyup'];
                            events.forEach(eventType => {
                                const event = new Event(eventType, { bubbles: true, cancelable: true });
                                element.dispatchEvent(event);
                            });


                            element.focus();
                            setTimeout(() => {
                                element.blur();
                            }, 100);

                            logMessage(`✅ [填空题] 普通填空${index + 1}已填入: ${answerText}`, 'success');
                            successCount++;
                        }


                        if (option.element.style) {
                            option.element.style.backgroundColor = '#e8f5e8';
                            option.element.style.border = '2px solid #4ade80';

                            setTimeout(() => {
                                option.element.style.backgroundColor = '';
                                option.element.style.border = '';
                            }, 2000);
                        }


                        setTimeout(() => {
                            const currentValue = option.element.value;
                            if (currentValue === answerText) {
                                logMessage(`✅ [填空题] 验证成功，填空${index + 1}当前值: ${currentValue}`, 'success');
                            } else {
                                logMessage(`❌ [填空题] 验证失败，填空${index + 1}期望: ${answerText}, 实际: ${currentValue}`, 'error');
                                logMessage(`💡 [填空题] 请手动检查并填入答案: ${answerText}`, 'warning');
                            }
                        }, 1000);

                    } catch (error) {
                        logMessage(`❌ [填空题] 填空${index + 1}填入失败: ${error.message}`, 'error');
                        console.error(`[填空题] 详细错误:`, error);
                    }
                } else if (option.isVirtual) {

                    logMessage(`📝 [填空题] 虚拟填空${index + 1}答案: ${answerText}`, 'info');
                    logMessage(`💡 [填空题] 请手动将答案"${answerText}"填入对应位置`, 'warning');
                    successCount++;
                } else {
                    logMessage(`❌ [填空题] 填空${index + 1}没有找到输入框`, 'error');
                }
            });

            const success = successCount > 0;
            if (success) {
                logMessage(`✅ [填空题] 答案填入完成 (${successCount}/${fillInBlankOptions.length})`, 'success');
            } else {
                logMessage(`❌ [填空题] 答案填入失败`, 'error');
            }

            return success;

        } catch (error) {
            logMessage(`❌ [填空题] 填入答案时出错: ${error.message}`, 'error');
            return false;
        }
    }


    async function selectAnswer(questionIndex, answer) {
        if (!currentSite) detectSite();
        if (currentSite && typeof currentSite.selectAnswer === 'function') {
            const result = currentSite.selectAnswer(questionIndex, answer);

            if (result && typeof result.then === 'function') {
                return await result;
            }
            return result;
        }

        return false;
    }




    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    function logMessage(message, type = 'info') {
        const logArea = document.getElementById('log-display');
        if (!logArea) return;

        const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        const colors = {
            'info': '#6c757d',
            'success': '#28a745',
            'warning': '#ffc107',
            'error': '#dc3545',
            'question': '#007bff',
            'answer': '#17a2b8'
        };

        const logEntry = document.createElement('div');
        logEntry.style.cssText = `
            margin-bottom: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            background: white;
            border-left: 3px solid ${colors[type] || colors.info};
            font-size: 12px;
            line-height: 1.4;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        `;

        const timeSpan = document.createElement('span');
        timeSpan.style.cssText = `
            color: #6c757d;
            font-weight: 500;
            margin-right: 8px;
        `;
        timeSpan.textContent = `[${timestamp}]`;

        const messageSpan = document.createElement('span');
        messageSpan.style.color = colors[type] || colors.info;
        messageSpan.textContent = message;

        logEntry.appendChild(timeSpan);
        logEntry.appendChild(messageSpan);
        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;


        if (logArea.children.length > 50) {
            logArea.removeChild(logArea.firstChild);
        }
    }


    function logQuestionAnswer(question, answer, questionType = '') {
        const logArea = document.getElementById('log-display');
        if (!logArea) return;

        const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });

        const logEntry = document.createElement('div');
        logEntry.style.cssText = `
            margin-bottom: 12px;
            padding: 12px;
            border-radius: 8px;
            background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
            border: 1px solid #e3f2fd;
            font-size: 12px;
            line-height: 1.5;
        `;

        const timeSpan = document.createElement('div');
        timeSpan.style.cssText = `
            color: #666;
            font-weight: 500;
            margin-bottom: 6px;
            font-size: 11px;
        `;
        timeSpan.textContent = `[${timestamp}] ${questionType}`;

        const questionDiv = document.createElement('div');
        questionDiv.style.cssText = `
            color: #333;
            margin-bottom: 6px;
            font-weight: 500;
        `;
        questionDiv.textContent = question.length > 80 ? question.substring(0, 80) + '...' : question;

        const answerDiv = document.createElement('div');
        answerDiv.style.cssText = `
            color: #28a745;
            font-weight: 600;
            padding: 4px 8px;
            background: rgba(40, 167, 69, 0.1);
            border-radius: 4px;
            display: inline-block;
        `;
        answerDiv.textContent = `答案：${answer}`;

        logEntry.appendChild(timeSpan);
        logEntry.appendChild(questionDiv);
        logEntry.appendChild(answerDiv);
        logArea.appendChild(logEntry);
        logArea.scrollTop = logArea.scrollHeight;


        if (logArea.children.length > 50) {
            logArea.removeChild(logArea.firstChild);
        }
    }




    async function answerSingleQuestion(questionIndex) {
        try {
            const questions = getExamQuestions();

            if (!questions || questionIndex >= questions.length) {
                logMessage(`❌ 第 ${questionIndex + 1} 题: 题目不存在`, 'error');
                return null;
            }

            const questionData = questions[questionIndex];
            logMessage(`📝 正在答第 ${questionIndex + 1} 题: ${questionData.questionType}`, 'info');

            // 更新答题窗口
            updateCurrentQuestion(questionData.stem, questionData.questionType);
            addTestLog(`正在处理第 ${questionIndex + 1} 题`, 'info');


            const apiResponse = await callCloudAPI(questionData);

            if (!apiResponse || !apiResponse.answer) {
                logMessage(`❌ 第 ${questionIndex + 1} 题: 未获取到答案`, 'error');
                return null;
            }

            const answer = apiResponse.answer.trim();
            logMessage(`💡 第 ${questionIndex + 1} 题答案: ${answer}`, 'success');

            // 更新答题窗口
            updateCurrentAnswer(answer);
            addTestLog(`获取到答案: ${answer}`, 'success');

            const selectSuccess = await selectAnswer(questionIndex, answer);

            if (selectSuccess) {
                logMessage(`✅ 第 ${questionIndex + 1} 题答题成功，选择答案${answer}`, 'success');
                addTestLog(`第 ${questionIndex + 1} 题答题成功，选择答案${answer}`, 'success');
                return {
                    questionIndex: questionIndex + 1,
                    answer: answer,
                    success: true
                };
            } else {
                logMessage(`❌ 第 ${questionIndex + 1} 题: 答案选择失败`, 'error');
                return null;
            }

        } catch (error) {
            logMessage(`❌ 第 ${questionIndex + 1} 题答题异常: ${error.message}`, 'error');
            return null;
        }
    }


    async function autoStartAnswering() {
        try {

            await new Promise(resolve => setTimeout(resolve, 1500));

            const currentUrl = window.location.href;
            logMessage(`🔍 当前页面URL: ${currentUrl}`, 'info');


            if (currentUrl.includes('exam-ans/exam/test/reVersionTestStartNew')) {

                logMessage('📄 检测到考试开始页面，查找整卷预览按钮...', 'info');

                // 显示考试答题窗口
                showExamWindow();
                addTestLog('检测到考试开始页面', 'info');

                const previewButton = document.querySelector('.sub-button a.completeBtn');
                if (previewButton && previewButton.textContent.includes('整卷预览')) {
                    logMessage('📄 找到整卷预览按钮，将自动点击...', 'info');
                    setTimeout(() => {
                        if (typeof pageWindow.topreview === 'function') {
                            logMessage('⚡️ 直接调用页面函数 topreview()。', 'info');
                            pageWindow.topreview();
                        } else {
                            logMessage('⚠️ 页面函数 topreview 不存在，回退到模拟点击。', 'warning');
                            previewButton.click();
                        }
                    }, 1500);
                    return;
                } else {
                    logMessage('❌ 未找到整卷预览按钮', 'warning');
                }
            }
            else if (currentUrl.includes('exam-ans/mooc2/exam/preview')) {

                logMessage('📝 检测到答题预览页面，开始自动答题...', 'info');

                // 显示考试答题窗口
                showExamWindow();
                addTestLog('检测到考试预览页面，开始答题', 'info');


                const questions = getExamQuestions();
                if (questions && questions.length > 0) {
                    logMessage(`发现 ${questions.length} 道题目，开始自动答题`, 'success');
                    const results = await autoAnswerAllQuestions(2000);

                    if (results.length > 0) {
                        logMessage(`自动答题完成，成功 ${results.length} 题`, 'success');
                    } else {
                        logMessage('自动答题未成功，请检查页面', 'warning');
                    }
                } else {
                    logMessage('未发现题目，可能页面还在加载中', 'info');
                }
            }
            else {

                logMessage('🔍 其他页面，使用通用检测逻辑...', 'info');


                if (currentSite && currentSite.name === '超星学习通') {
                    const previewButton = document.querySelector('.sub-button a.completeBtn');
                    if (previewButton && previewButton.textContent.includes('整卷预览')) {
                        logMessage('📄 检测到单题模式，将自动点击"整卷预览"...', 'info');
                        setTimeout(() => {
                            if (typeof pageWindow.topreview === 'function') {
                                logMessage('⚡️ 直接调用页面函数 topreview()。', 'info');
                                pageWindow.topreview();
                            } else {
                                logMessage('⚠️ 页面函数 topreview 不存在，回退到模拟点击。', 'warning');
                                previewButton.click();
                            }
                        }, 1500);
                        return;
                    }
                }


                const questions = getExamQuestions();
                if (questions && questions.length > 0) {
                    logMessage(`发现 ${questions.length} 道题目，开始自动答题`, 'success');
                    const results = await autoAnswerAllQuestions(2000);

                    if (results.length > 0) {
                        logMessage(`自动答题完成，成功 ${results.length} 题`, 'success');
                    } else {
                        logMessage('自动答题未成功，请检查页面', 'warning');
                    }
                } else {
                    logMessage('未发现题目，可能不是答题页面', 'info');
                }
            }
        } catch (error) {
            logMessage(`自动答题启动失败: ${error.message}`, 'error');
        }
    }


    async function initializeApp() {
        try {


            // createControlWindow(); // 已删除悬浮窗调用


            window.addEventListener('unhandledrejection', event => {
                if (event.reason && event.reason.message && event.reason.message.includes('429')) {
                    logMessage('⚠️ 请求过于频繁，请稍后重试', 'warning');
                }
            });


            detectSite();


            const tokenResult = await TokenManager.initialize();

            if (!tokenResult.hasToken) {
                logMessage('❌ Token未设置，请先配置Token', 'error');
                // 继续尝试自动启动逻辑（用户可在后续弹窗中完成Token）
            }


            // 检测到答题页面，启动答题功能
            if (currentSite) {
                logMessage('📝 答题页面检测成功，自动答题功能已启动', 'success');
                logMessage('📝 章节测验自动答题功能已启用', 'info');
                logMessage('📝 作业自动答题功能已启用', 'info');
                logMessage('📝 考试自动答题功能已启用', 'info');
                // 不再提前返回，继续执行自动启动逻辑
            }

            logMessage('✅ 云端AI答题助手启动完成', 'success');


            await autoStartAnswering();

        } catch (error) {
            logMessage(`❌ 初始化失败: ${error.message}`, 'error');
        }
    }


    if (pageWindow.AI_ASSISTANT_INITIALIZED) {
        return;
    }
    pageWindow.AI_ASSISTANT_INITIALIZED = true;

    if (pageDocument.readyState === 'loading') {
        pageDocument.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeApp, 800);
        });
    } else {
        setTimeout(initializeApp, 800);
    }


    function updateTaskStatus() {
        // 简化的任务状态更新，只显示答题相关状态
        let currentTask = '空闲';
        if (GLOBAL_STATE.isAnswering) {
            currentTask = '答题中';
        } else if (GLOBAL_STATE.isChapterTesting) {
            currentTask = '章节测试';
        }

        // 如果页面上有任务状态显示元素，更新它们
        const currentTaskEl = document.getElementById('currentTask');
        if (currentTaskEl) {
            currentTaskEl.textContent = currentTask;
        }
    }

    // 创建答题状态窗口（支持章节测试和考试）
    function createAnswerWindow(windowType = 'chapter') {
        const windowId = 'answerWindow';
        if (document.getElementById(windowId)) {
            return; // 窗口已存在
        }

        // 根据窗口类型设置标题
        const windowTitle = windowType === 'exam' ? '📝 考试答题助手' : '📝 章节测试答题助手';

        const windowDiv = document.createElement('div');
        windowDiv.id = windowId;
        windowDiv.innerHTML = `
            <div class="test-window-header">
                <span id="windowTitle">${windowTitle}</span>
                <button class="test-window-close">×</button>
            </div>
            <div class="test-window-content">
                <div class="announcement-info">
                    <div class="announcement-title">📢 公告</div>
                    <div class="announcement-content">
                        有问题及时反馈群号：
                        <span class="group-number">923349555</span>
                        <div id="scriptAnnouncement" style="margin-top:8px;color:#1f2937;"></div>
                    </div>
                </div>
                <div class="token-info">
                    <span id="tokenCount">Token: 加载中...</span>
                </div>
                <div class="progress-info">
                    <span id="progressInfo">准备中...</span>
                </div>
                <div class="current-question">
                    <div class="question-title">当前题目：</div>
                    <div id="currentQuestionText">等待开始...</div>
                </div>
                <div class="current-answer">
                    <div class="answer-title">选择答案：</div>
                    <div id="currentAnswerText">-</div>
                </div>
                <div class="test-log">
                    <div class="log-title">答题日志：</div>
                    <div id="testLogContent"></div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #answerWindow {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                max-height: 550px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 12px;
                overflow: hidden;
            }

            .test-window-header {
                background: #f5f5f5;
                padding: 10px 15px;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                cursor: move;
            }

            .test-window-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 3px;
            }

            .test-window-close:hover {
                background: #e0e0e0;
            }

            .test-window-content {
                padding: 15px;
                max-height: 470px;
                overflow-y: auto;
            }

            .announcement-info {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 8px 10px;
                border-radius: 4px;
                margin-bottom: 10px;
                font-size: 11px;
            }

            .announcement-title {
                font-weight: bold;
                color: #856404;
                margin-bottom: 4px;
            }

            .announcement-content {
                color: #856404;
                line-height: 1.4;
            }

            .group-number {
                font-weight: bold;
                color: #d63384;
                cursor: pointer;
                text-decoration: underline;
            }

            .group-number:hover {
                color: #b02a5b;
            }

            .token-info {
                background: #e8f4fd;
                padding: 8px 10px;
                border-radius: 4px;
                margin-bottom: 10px;
                font-weight: bold;
                color: #0066cc;
            }

            .progress-info {
                background: #f0f8ff;
                padding: 8px 10px;
                border-radius: 4px;
                margin-bottom: 10px;
                font-weight: bold;
                color: #333;
            }

            .current-question, .current-answer {
                margin-bottom: 12px;
                padding: 8px;
                border: 1px solid #eee;
                border-radius: 4px;
                background: #fafafa;
            }

            .question-title, .answer-title, .log-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
            }

            #currentQuestionText {
                color: #555;
                line-height: 1.4;
                max-height: 60px;
                overflow-y: auto;
            }

            #currentAnswerText {
                color: #007bff;
                font-weight: bold;
            }

            .test-log {
                margin-top: 10px;
                border-top: 1px solid #eee;
                padding-top: 10px;
            }

            #testLogContent {
                max-height: 120px;
                overflow-y: auto;
                font-size: 11px;
                line-height: 1.3;
                color: #666;
                background: #f9f9f9;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #eee;
            }

            .log-entry {
                margin-bottom: 3px;
                padding: 2px 0;
            }

            .log-success {
                color: #28a745;
            }

            .log-error {
                color: #dc3545;
            }

            .log-info {
                color: #17a2b8;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(windowDiv);

        // 绑定事件
        bindAnswerWindowEvents();

        // 更新Token信息
        updateTokenDisplay();

        // 拉取脚本公告
        try {
            fetch('/portal/api/announcements?type=script', { credentials: 'include' })
                .then(r => r.json())
                .then(d => {
                    if (d && d.success && d.data && d.data.content) {
                        const el = document.getElementById('scriptAnnouncement');
                        if (el) el.innerHTML = d.data.content.replace(/\n/g, '<br>');
                    }
                })
                .catch(() => {});
        } catch (e) {}
     }

    // 绑定答题窗口事件
    function bindAnswerWindowEvents() {
        const testWindow = document.getElementById('answerWindow');
        const closeBtn = testWindow.querySelector('.test-window-close');
        const header = testWindow.querySelector('.test-window-header');

        // 关闭按钮
        closeBtn.addEventListener('click', () => {
            testWindow.style.display = 'none';
        });

        // 拖拽功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = testWindow.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;

            const maxX = window.innerWidth - testWindow.offsetWidth;
            const maxY = window.innerHeight - testWindow.offsetHeight;

            testWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            testWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
            testWindow.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
            }
        });

        // 群号点击复制功能
        const groupNumber = testWindow.querySelector('.group-number');
        if (groupNumber) {
            groupNumber.addEventListener('click', () => {
                const groupNum = '923349555';
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(groupNum).then(() => {
                        const originalText = groupNumber.textContent;
                        groupNumber.textContent = '已复制!';
                        setTimeout(() => {
                            groupNumber.textContent = originalText;
                        }, 2000);
                    }).catch(() => {
                        alert(`请手动复制群号: ${groupNum}`);
                    });
                } else {
                    // 降级方案
                    const textArea = document.createElement('textarea');
                    textArea.value = groupNum;
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        const originalText = groupNumber.textContent;
                        groupNumber.textContent = '已复制!';
                        setTimeout(() => {
                            groupNumber.textContent = originalText;
                        }, 2000);
                    } catch (err) {
                        alert(`请手动复制群号: ${groupNum}`);
                    }
                    document.body.removeChild(textArea);
                }
            });
        }
    }

    // 更新Token显示
    async function updateTokenDisplay() {
        try {
            console.log('[Token显示] 开始获取用户信息...');
            const userInfo = await TokenManager.getUserInfo();
            console.log('[Token显示] 获取到用户信息:', userInfo);

            const tokenElement = document.getElementById('tokenCount');

            if (tokenElement && userInfo) {
                // 使用remainingCount或remaining_queries字段
                const remainingQueries = userInfo.remainingCount || userInfo.remaining_queries || 0;
                tokenElement.textContent = `Token: ${remainingQueries} 次`;
                console.log(`[Token显示] 剩余查询次数: ${remainingQueries}`);
            } else {
                if (tokenElement) {
                    tokenElement.textContent = 'Token: 无法获取用户信息';
                }
                console.warn('[Token显示] 用户信息获取失败, userInfo:', userInfo);
            }
        } catch (error) {
            console.error('[Token显示] 获取失败:', error);
            const tokenElement = document.getElementById('tokenCount');
            if (tokenElement) {
                if (error.message.includes('Token未设置')) {
                    tokenElement.textContent = 'Token: 未设置';
                } else if (error.message.includes('Token无效')) {
                    tokenElement.textContent = 'Token: 无效或过期';
                } else {
                    tokenElement.textContent = `Token: 获取失败 (${error.message})`;
                }
            }
        }
    }

    // 更新答题进度
    function updateTestProgress(current, total) {
        const progressElement = document.getElementById('progressInfo');
        if (progressElement) {
            progressElement.textContent = `进度: ${current}/${total} (${Math.round(current/total*100)}%)`;
        }
    }

    // 更新当前题目
    function updateCurrentQuestion(questionText, questionType) {
        const questionElement = document.getElementById('currentQuestionText');
        if (questionElement) {
            const displayText = questionText.length > 100 ?
                questionText.substring(0, 100) + '...' : questionText;
            questionElement.textContent = `[${questionType}] ${displayText}`;
        }
    }

    // 更新当前答案
    function updateCurrentAnswer(answer) {
        const answerElement = document.getElementById('currentAnswerText');
        if (answerElement) {
            answerElement.textContent = answer || '-';
        }
    }

    // 添加日志条目
    function addTestLog(message, type = 'info') {
        const logContent = document.getElementById('testLogContent');
        if (logContent) {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${type}`;
            logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;

            logContent.appendChild(logEntry);
            logContent.scrollTop = logContent.scrollHeight;

            // 限制日志条目数量
            const entries = logContent.querySelectorAll('.log-entry');
            if (entries.length > 20) {
                entries[0].remove();
            }
        }
    }

    // 显示答题窗口（通用）
    function showAnswerWindow(windowType = 'chapter') {
        createAnswerWindow(windowType);
        const testWindow = document.getElementById('answerWindow');
        if (testWindow) {
            testWindow.style.display = 'block';
            const windowTitle = windowType === 'exam' ? '考试答题窗口已启动' : '章节测试窗口已启动';
            addTestLog(windowTitle, 'info');
        }
    }

    // 显示章节测试窗口（兼容旧函数名）
    function showChapterTestWindow() {
        showAnswerWindow('chapter');
    }

    // 显示考试窗口
    function showExamWindow() {
        showAnswerWindow('exam');
    }

    // 更新窗口标题
    function updateWindowTitle(windowType) {
        const titleElement = document.getElementById('windowTitle');
        if (titleElement) {
            const title = windowType === 'exam' ? '📝 考试答题助手' : '📝 章节测试答题助手';
            titleElement.textContent = title;
        }
    }

    function base64ToUint8Array(base64) {
        var data = window.atob(base64);
        var buffer = new Uint8Array(data.length);
        for (var i = 0; i < data.length; ++i) {
            buffer[i] = data.charCodeAt(i);
        }
        return buffer;
    }
    function chaoxingFontDecrypt(doc = document) {

        var $tip = Array.from(doc.querySelectorAll('style')).find(style =>
            (style.textContent || style.innerHTML || '').includes('font-cxsecret')
        );
        if (!$tip) return false;


        var fontText = $tip.textContent || $tip.innerHTML;
        var fontMatch = fontText.match(/base64,([\w\W]+?)'/);
        if (!fontMatch || !fontMatch[1]) return false;

        var font = Typr.parse(base64ToUint8Array(fontMatch[1]))[0];


        var table = JSON.parse(GM_getResourceText('Table'));
        var match = {};

        for (var i = 19968; i < 40870; i++) {
            var glyph = Typr.U.codeToGlyph(font, i);
            if (!glyph) continue;

            var path = Typr.U.glyphToPath(font, glyph);
            var pathMD5 = md5(JSON.stringify(path)).slice(24);

            if (table[pathMD5]) {
                match[i] = table[pathMD5];
            }
        }


        var elements = doc.querySelectorAll('.font-cxsecret');
        elements.forEach(function (element) {
            var html = element.innerHTML;

            for (var key in match) {
                if (match[key]) {
                    var keyChar = String.fromCharCode(key);
                    var valueChar = String.fromCharCode(match[key]);
                    var regex = new RegExp(keyChar, 'g');
                    html = html.replace(regex, valueChar);
                }
            }

            element.innerHTML = html;
            element.classList.remove('font-cxsecret');
        });

        return elements.length > 0;
    }


    window.restartMainInterval = function () {
        if (window.mainIntervalId) {
            clearInterval(window.mainIntervalId);
        }
    };


    window.restorePage = function () {

        let restoredCount = 0;


        const decryptedElements = document.querySelectorAll('[data-decrypted="true"]');
        decryptedElements.forEach(element => {

            element.classList.add('font-cxsecret');
            element.removeAttribute('data-decrypted');
            restoredCount++;
        });


        const originalDecryptedElements = document.querySelectorAll('[data-decrypted-original="true"]');
        originalDecryptedElements.forEach(element => {
            element.classList.add('font-cxsecret');
            element.removeAttribute('data-decrypted-original');
            element.style.background = '';
            element.style.borderColor = '';
            restoredCount++;
        });


        const inlineDecryptedElements = document.querySelectorAll('[data-decrypted-inline="true"]');
        inlineDecryptedElements.forEach(element => {
            element.removeAttribute('data-decrypted-inline');
            restoredCount++;
        });
        return {
            restoredCount: restoredCount,
            success: restoredCount > 0
        };
    };


    window.applyChaoxingFontDecryptOriginal = function () {

        try {

            const allStyles = document.querySelectorAll('style');
            let $tip = null;

            for (const style of allStyles) {
                const content = style.textContent || style.innerHTML || '';
                if (content.includes('font-cxsecret')) {
                    $tip = style;
                    break;
                }
            }

            if (!$tip) {
                console.log('ℹ️ [原版解密] 未找到font-cxsecret样式');
                return false;
            }

            console.log('✅ [原版解密] 找到font-cxsecret样式');


            const fontSecretElements = document.querySelectorAll('.font-cxsecret');
            if (fontSecretElements.length === 0) {
                console.log('ℹ️ [原版解密] 未找到.font-cxsecret元素');
                return false;
            }

            console.log(`✅ [原版解密] 找到 ${fontSecretElements.length} 个加密元素`);



            let processedCount = 0;

            fontSecretElements.forEach((element, index) => {
                try {
                    const originalText = element.textContent || '';


                    element.classList.remove('font-cxsecret');
                    element.setAttribute('data-decrypted-original', 'true');

                    const newText = element.textContent || '';

                    console.log(`  元素 ${index + 1}: "${originalText.substring(0, 30)}..." → "${newText.substring(0, 30)}..."`);
                    processedCount++;

                } catch (error) {
                    console.log(`⚠️ [原版解密] 处理元素 ${index + 1} 失败:`, error.message);
                }
            });

            return processedCount > 0;

        } catch (error) {
            console.log('❌ [原版解密] 执行失败:', error.message);
            return false;
        }
    };


    window.decodePageTexts = async function () {
        console.log('🔄 [批量解码] 开始解码页面中的所有乱码文本...');

        try {

            const mapping = await buildAIDecodingMapping();

            if (Object.keys(mapping).length === 0) {
                console.log('⚠️ 未获取到有效的字符映射表');
                return false;
            }


            const elements = document.querySelectorAll('.fontLabel, .after, .CeYan *');
            let decodedCount = 0;

            for (const element of elements) {
                const originalText = element.textContent || '';
                if (originalText && /[\u5600-\u56FF]/.test(originalText)) {
                    let decodedText = originalText;


                    for (const [garbled, decoded] of Object.entries(mapping)) {
                        decodedText = decodedText.replace(new RegExp(garbled, 'g'), decoded);
                    }

                    if (decodedText !== originalText) {



                        decodedCount++;
                    }
                }
            }

            console.log(`✅ 批量解码完成，共处理 ${decodedCount} 个文本`);
            return true;

        } catch (error) {
            console.log(`❌ 批量解码失败: ${error.message}`);
            return false;
        }
    };


    async function handleChapterTest(testFrames) {
        for (const frame of testFrames) {
            if (!frame.accessible || !frame.doc) {
                console.log('❌ [章节测验] iframe不可访问，跳过');
                continue;
            }

            const doc = frame.doc;
            const iframeWindow = frame.iframe ? frame.iframe.contentWindow : window;


            const completedStatus = doc.querySelector('.testTit_status_complete');
            if (completedStatus && completedStatus.textContent.includes('已完成')) {
                console.log('✅ [章节测验] 检测到已完成状态，跳过答题');
                return true;
            }


            const completedDiv = doc.querySelector('.fr.testTit_status.testTit_status_complete');
            if (completedDiv && completedDiv.textContent.includes('已完成')) {
                console.log('✅ [章节测验] 检测到已完成状态（方式2），跳过答题');
                return true;
            }


            chaoxingFontDecrypt(doc);


            const questions = doc.querySelectorAll('.singleQuesId');
            console.log(`📄 共 ${questions.length} 道题目`);


            if (questions.length === 0) {
                continue;
            }


            GLOBAL_STATE.isChapterTesting = true;
            GLOBAL_STATE.isAnswering = true;
            console.log('🚀 [章节测验] 开始答题流程');

            // 显示答题窗口
            showChapterTestWindow();
            addTestLog(`开始处理章节测验，共 ${questions.length} 道题目`, 'info');
            updateTestProgress(0, questions.length);


            for (let i = 0; i < questions.length; i++) {
                const qEl = questions[i];
                const typeText = qEl.querySelector('.newZy_TItle')?.innerText || '未知类型';
                let content = qEl.querySelector('.fontLabel')?.innerText?.trim() || '';


                content = content.replace(/【[^】]*题】/g, '').trim();
                console.log(`📝 [${i + 1}/${questions.length}] ${typeText}`);

                // 更新答题窗口
                updateTestProgress(i + 1, questions.length);
                updateCurrentQuestion(content, typeText);
                addTestLog(`正在处理第 ${i + 1} 题`, 'info');


                const options = qEl.querySelectorAll('li');

                const optionsData = [];


                const cleanQuestionType = typeText.replace(/【|】/g, '');

                options.forEach(opt => {
                    let spanElement = null;
                    let label = '';


                    if (cleanQuestionType.includes('多选题')) {
                        spanElement = opt.querySelector('span.num_option_dx');
                    } else {
                        spanElement = opt.querySelector('span.num_option');
                    }

                    label = spanElement?.innerText || '';
                    const aElement = opt.querySelector('a.after');
                    const text = aElement?.innerText || '';
                    const dataValue = spanElement?.getAttribute('data') || '';

                    if (label && text) {
                        optionsData.push({
                            label: label,
                            content: text,
                            value: dataValue,
                            element: opt,
                            questionType: cleanQuestionType
                        });
                    }
                });


                try {
                    const cleanQuestionType = typeText.replace(/【|】/g, '');
                    const questionData = {
                        stem: content,
                        questionType: cleanQuestionType,
                        options: optionsData
                    };

                    const apiResponse = await callCloudAPI(questionData);

                    if (apiResponse && apiResponse.answer) {
                        const answer = apiResponse.answer.trim();
                        console.log(`  ✅ 答案: ${answer}`);

                        // 更新答题窗口
                        updateCurrentAnswer(answer);
                        addTestLog(`获取到答案: ${answer}`, 'success');

                        console.log(`🎯 [答题] 选择答案: ${answer}`);

                        if (cleanQuestionType.includes('填空题')) {

                            console.log(`📝 [填空题] 开始处理填空题`);


                            const blankItems = qEl.querySelectorAll('.blankItemDiv');



                            console.log(`📝 [填空题] 找到 ${blankItems.length} 个填空项`);


                            let answerParts = [];
                            if (typeof answer === 'string') {

                                if (answer.includes('|')) {
                                    answerParts = answer.split('|');
                                } else if (answer.includes('；')) {
                                    answerParts = answer.split('；');
                                } else if (answer.includes(';')) {
                                    answerParts = answer.split(';');
                                } else if (answer.includes('，')) {
                                    answerParts = answer.split('，');
                                } else if (answer.includes(',')) {
                                    answerParts = answer.split(',');
                                } else {
                                    answerParts = [answer];
                                }
                            } else {
                                answerParts = [answer];
                            }

                            console.log(`📝 [填空题] 答案分割结果:`, answerParts);


                            blankItems.forEach((blankItem, blankIndex) => {
                                if (blankIndex < answerParts.length) {
                                    const answerText = answerParts[blankIndex].trim();
                                    console.log(`📝 [填空题] 第${blankIndex + 1}空填入: ${answerText}`);
                                    addTestLog(`填空题第${blankIndex + 1}空填入: ${answerText}`, 'success');


                                    const editorTextarea = blankItem.querySelector('textarea[name*="answerEditor"]');

                                    if (editorTextarea) {
                                        const editorId = editorTextarea.id;

                                        try {
                                            let fillSuccess = false;


                                            if (iframeWindow && iframeWindow.UE && iframeWindow.UE.getEditor) {
                                                try {
                                                    const editor = iframeWindow.UE.getEditor(editorId);
                                                    if (editor && editor.setContent) {
                                                        editor.setContent(answerText);
                                                        fillSuccess = true;
                                                    }
                                                } catch (ueError) {

                                                }
                                            }


                                            if (!fillSuccess) {
                                                editorTextarea.value = answerText;


                                                const events = ['input', 'change', 'blur', 'keyup'];
                                                events.forEach(eventType => {
                                                    try {

                                                        const event = new (iframeWindow || window).Event(eventType, { bubbles: true });
                                                        editorTextarea.dispatchEvent(event);
                                                    } catch (eventError) {

                                                        const event = doc.createEvent('Event');
                                                        event.initEvent(eventType, true, true);
                                                        editorTextarea.dispatchEvent(event);
                                                    }
                                                });

                                                fillSuccess = true;
                                            }


                                            if (!fillSuccess) {
                                                const inpDiv = blankItem.querySelector('.InpDIV');
                                                if (inpDiv) {
                                                    inpDiv.innerHTML = answerText;
                                                    inpDiv.textContent = answerText;
                                                    fillSuccess = true;
                                                }
                                            }

                                        } catch (error) {

                                        }
                                    }
                                }
                            });

                        } else if (cleanQuestionType.includes('判断题')) {
                            for (const opt of options) {
                                const text = opt.querySelector('a')?.innerText || '';
                                if ((answer === 'T' && (text === '对' || text === '正确' || text === '是')) ||
                                    (answer === 'F' && (text === '错' || text === '错误' || text === '否'))) {
                                    opt.click();
                                    console.log(`    🎯 已选择: ${text}`);
                                    addTestLog(`判断题已选择: ${text}`, 'success');
                                    break;
                                }
                            }
                        } else if (cleanQuestionType.includes('多选题')) {

                            for (const opt of options) {
                                const spanElement = opt.querySelector('span.num_option_dx');
                                const label = spanElement?.innerText || '';

                                if (answer.includes(label)) {

                                    if (typeof iframeWindow.addMultipleChoice === 'function') {
                                        try {
                                            iframeWindow.addMultipleChoice(opt);
                                            console.log(`    🎯 已选择多选项: ${label}`);
                                            addTestLog(`多选题已选择: ${label}`, 'success');
                                        } catch (error) {
                                            opt.click();
                                            console.log(`    🎯 已选择多选项: ${label} (备用)`);
                                            addTestLog(`多选题已选择: ${label} (备用方式)`, 'success');
                                        }
                                    } else {
                                        opt.click();
                                        console.log(`    🎯 已选择多选项: ${label}`);
                                        addTestLog(`多选题已选择: ${label}`, 'success');
                                    }
                                }
                            }
                        } else {

                            for (const opt of options) {
                                const spanElement = opt.querySelector('span.num_option');
                                const label = spanElement?.innerText || '';

                                if (answer.includes(label)) {
                                    opt.click();
                                    console.log(`    🎯 已选择: ${label}`);
                                    addTestLog(`单选题已选择: ${label}`, 'success');
                                    break;
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log(`  ❌ 答题异常: ${error.message}`);
                    addTestLog(`答题异常: ${error.message}`, 'error');
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            console.log('✅ [章节测验] 答题完成，准备提交');
            addTestLog('所有题目答题完成，准备提交测验', 'success');
            updateCurrentQuestion('答题完成', '准备提交');
            updateCurrentAnswer('等待提交...');
            GLOBAL_STATE.isAnswering = false;


            setTimeout(() => {
                if (iframeWindow.btnBlueSubmit) {
                    iframeWindow.btnBlueSubmit();
                    console.log('✅ [自动提交] 测验提交成功');
                    addTestLog('测验已自动提交', 'success');
                    updateCurrentAnswer('已提交');


                    setTimeout(() => {
                        monitorSubmitDialog();
                    }, 500);
                }
            }, 2000);


            return true;
        }

        return false;
    }


    // 检测是否为章节测验页面
    function isChapterTestPage() {
        const url = window.location.href;
        // 章节测验页面特征
        return url.includes('/mooc-ans/work/doHomeWorkNew/') ||
               url.includes('/mooc-ans/api/work/') ||
               url.includes('/ananas/modules/work/') ||
               // 也检查页面DOM特征
               document.querySelector('.singleQuesId') ||
               document.querySelector('.CeYan h3') ||
               document.querySelector('.questionLi') ||
               document.querySelector('.newZy_TItle');
    }

    // 答题系统启动
    console.log(`📝 [答题系统] 超星学习通答题助手已启动`);

    if (isChapterTestPage()) {
        console.log(`📝 [系统启动] 检测到章节测验页面，启动答题系统`);

        // 立即显示答题窗口
        showChapterTestWindow();
        addTestLog('检测到章节测验页面，答题助手已启动', 'info');

        setTimeout(async () => {
            console.log(`📝 [章节测验] 页面加载完成，开始处理测验`);

            // 查找章节测验iframe
            const testFrames = [];
            const iframes = document.querySelectorAll('iframe');

            for (const iframe of iframes) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc) {
                        // 检查是否是章节测验iframe
                        if (iframeDoc.querySelector('.singleQuesId') ||
                            iframeDoc.querySelector('.CeYan h3') ||
                            iframeDoc.querySelector('.questionLi')) {
                            testFrames.push({
                                iframe: iframe,
                                doc: iframeDoc,
                                accessible: true,
                                type: 'CHAPTER_TEST'
                            });
                        }
                    }
                } catch (e) {
                    // 跨域iframe，跳过
                }
            }

            // 如果没有找到iframe，检查当前页面是否直接包含测验
            if (testFrames.length === 0) {
                if (document.querySelector('.singleQuesId') ||
                    document.querySelector('.CeYan h3') ||
                    document.querySelector('.questionLi')) {
                    testFrames.push({
                        iframe: null,
                        doc: document,
                        accessible: true,
                        type: 'CHAPTER_TEST'
                    });
                }
            }

            if (testFrames.length > 0) {
                console.log(`📝 [章节测验] 找到 ${testFrames.length} 个测验框架，开始处理`);
                addTestLog(`找到 ${testFrames.length} 个测验框架，开始处理`, 'info');
                await handleChapterTest(testFrames);
            } else {
                console.log(`❌ [章节测验] 未找到测验内容`);
                addTestLog('未找到测验内容，请检查页面', 'error');
                updateCurrentQuestion('未找到测验内容', '检查页面');
            }
        }, 2000);
    } else {
        console.log(`❓ [系统启动] 未识别的页面类型`);
        console.log(`🔍 [调试信息] 当前URL: ${window.location.href}`);
        console.log(`🔍 [调试信息] 页面标题: ${document.title}`);
    }

    console.log('✅ 系统优化 答题助手已启动，专注于章节测验、作业和考试功能');

    // 添加全局函数，方便手动调用
    window.showChapterTestWindow = showChapterTestWindow;
    window.showExamWindow = showExamWindow;
    window.showAnswerWindow = showAnswerWindow;
    window.addTestLog = addTestLog;
    window.updateTestProgress = updateTestProgress;
    window.updateCurrentQuestion = updateCurrentQuestion;
    window.updateCurrentAnswer = updateCurrentAnswer;
    window.updateWindowTitle = updateWindowTitle;
})();

