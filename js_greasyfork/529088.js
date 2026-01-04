// ==UserScript==
// @name         SCYS Content Modifier
// @namespace    http://scys.com/
// @version      2.6
// @description  修改API响应状态码和Token处理
// @author       You
// @match        *://*.scys.com/*
// @grant        GM_xmlhttpRequest
// @connect      scys.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529088/SCYS%20Content%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/529088/SCYS%20Content%20Modifier.meta.js
// ==/UserScript==
// @license MIT

(function() {
    'use strict';

    const TARGET_APIS = [
        '/shengcai-web/client/fxb/listFxbSecondLabel',
        '/shengcai-web/client/fxb/listFxbZbUser',
        '/shengcai-web/client/fxb/listExhSecondLabel'
    ];

    const TOKEN_KEY = '__user_token.v3';

    function debug(msg) {
        console.log('[SCYS Debug]:', msg);
    }

    // 保持登录状态
    function maintainLogin() {
        const fakeToken = {
            token: 'fake_token_' + Date.now(),
            expires: Date.now() + 86400000
        };

        try {
            localStorage.setItem(TOKEN_KEY, JSON.stringify(fakeToken));
        } catch (e) {
            debug('保存token失败: ' + e.message);
        }

        // 定期检查token
        setInterval(() => {
            if (!localStorage.getItem(TOKEN_KEY)) {
                localStorage.setItem(TOKEN_KEY, JSON.stringify(fakeToken));
                debug('恢复token');
            }
        }, 1000);
    }

    // 拦截Promise.reject
    const originalReject = Promise.reject;
    Promise.reject = function(reason) {
        if (reason && reason.status === 401) {
            debug('拦截401 Promise.reject');
            return Promise.resolve({
                data: {
                    status: 200,
                    success: true,
                    message: "操作成功",
                    data: {}
                }
            });
        }
        return originalReject.call(this, reason);
    };

    // 拦截axios实例
    function interceptAxios() {
        const checkAndIntercept = () => {
            if (window._d) {
                debug('找到axios实例');

                // 拦截请求配置
                if (window._d.interceptors && window._d.interceptors.request) {
                    window._d.interceptors.request.use(
                        config => {
                            debug('拦截请求配置');
                            if (config.url && TARGET_APIS.some(api => config.url.includes(api))) {
                                config.validateStatus = function() {
                                    return true;
                                };
                            }
                            return config;
                        },
                        error => {
                            return Promise.reject(error);
                        }
                    );
                }

                // 拦截响应
                if (window._d.interceptors && window._d.interceptors.response) {
                    window._d.interceptors.response.use(
                        response => {
                            if (response.config && TARGET_APIS.some(api => response.config.url.includes(api))) {
                                debug('修改响应数据');
                                return {
                                    data: {
                                        status: 200,
                                        success: true,
                                        message: "操作成功",
                                        data: {}
                                    }
                                };
                            }
                            return response;
                        },
                        error => {
                            if (error.response && error.response.status === 401) {
                                debug('拦截401响应');
                                return Promise.resolve({
                                    data: {
                                        status: 200,
                                        success: true,
                                        message: "操作成功",
                                        data: {}
                                    }
                                });
                            }
                            return Promise.reject(error);
                        }
                    );
                }
            } else {
                setTimeout(checkAndIntercept, 100);
            }
        };

        checkAndIntercept();
    }

    // 拦截跳转
    function interceptRedirects() {
        // 拦截 setTimeout
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(fn, delay) {
            if (typeof fn === 'string') {
                if (fn.includes('location') || fn.includes('/login') || fn.includes('/clean')) {
                    debug('阻止setTimeout中的跳转代码');
                    return;
                }
            } else if (typeof fn === 'function') {
                const wrappedFn = function() {
                    try {
                        fn.apply(this, arguments);
                    } catch (e) {
                        if (e.toString().includes('location')) {
                            debug('阻止setTimeout中的跳转');
                        } else {
                            throw e;
                        }
                    }
                };
                return originalSetTimeout.call(this, wrappedFn, delay);
            }
            return originalSetTimeout.apply(this, arguments);
        };

        // 拦截 history API
        const originalPushState = history.pushState;
        history.pushState = function() {
            if (arguments[2] && (arguments[2].includes('/login') || arguments[2].includes('/clean'))) {
                debug('阻止pushState跳转到: ' + arguments[2]);
                return;
            }
            return originalPushState.apply(this, arguments);
        };
    }

    // 初始化
    function init() {
        try {
            maintainLogin();
            interceptAxios();
            interceptRedirects();
            debug('脚本初始化完成');
        } catch (e) {
            debug('初始化失败: ' + e.message);
        }
    }

    // 确保最早执行
    init();

    // 监听页面加载完成
    window.addEventListener('load', () => {
        debug('页面加载完成，重新检查拦截');
        init();
    });
})();