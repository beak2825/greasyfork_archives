// ==UserScript==
// @name         Bilibili Cookie Getter
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  获取哔哩哔哩网站的cookie
// @author       Your name
// @match        *://*.bilibili.com/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521038/Bilibili%20Cookie%20Getter.user.js
// @updateURL https://update.greasyfork.org/scripts/521038/Bilibili%20Cookie%20Getter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 重要cookie列表
    const IMPORTANT_COOKIES = [
        'DedeUserID',
        'bili_jct',
        'SESSDATA',
        'bili_ticket',
        'sid'
    ];

    // 新增：指定的cookie
    const SPECIFIED_COOKIE = 'single_unread';

    // 格式化cookie字符串
    function formatCookies(cookieStr) {
        const cookieMap = new Map();
        cookieStr.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            cookieMap.set(key, value);
        });

        // 首先添加��cookie
        let result = '// 重要Cookie：\n';
        IMPORTANT_COOKIES.forEach(key => {
            if (cookieMap.has(key)) {
                result += `${key}=${cookieMap.get(key)};\n`;
                cookieMap.delete(key);
            }
        });

        // 添加其他cookie
        result += '\n// 其他Cookie：\n';
        cookieMap.forEach((value, key) => {
            result += `${key}=${value};\n`;
        });

        return result;
    }

    // 只获取重要cookie
    function getImportantCookies(cookieStr) {
        const cookieMap = new Map();
        cookieStr.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (IMPORTANT_COOKIES.includes(key)) {
                cookieMap.set(key, value);
            }
        });

        return Array.from(cookieMap)
            .map(([key, value]) => `${key}=${value}`)
            .join(';\n');
    }

    // 添加常量定义
    const MAX_RETRIES = 3;
    const MAX_CONCURRENT = 5;
    const COOKIE_DOMAINS = [
        'bilibili.com',
        '.bilibili.com',
        'www.bilibili.com',
        'api.bilibili.com',
        'passport.bilibili.com'
    ];

    // 修改 fetchWithRetry 函数
    async function fetchWithRetry(endpoint, retryCount = 0) {
        try {
            const response = await new Promise((resolve, reject) => {
                const requestOptions = {
                    method: endpoint.method,
                    url: endpoint.url,
                    headers: {
                        'User-Agent': navigator.userAgent,
                        'Cookie': document.cookie,
                        'Referer': 'https://www.bilibili.com',
                        'Origin': 'https://www.bilibili.com',
                        'Accept': 'application/json, text/plain, */*',
                        'Connection': 'keep-alive',
                        'Sec-Fetch-Site': 'same-site',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Dest': 'empty',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                        'Accept-Encoding': 'gzip, deflate, br',
                        // 添加更多请求头
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'X-CSRF-TOKEN': document.cookie.match(/bili_jct=([^;]+)/)?.[1] || '',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    withCredentials: true,
                    timeout: 5000,
                    anonymous: false,
                    onload: resolve,
                    onerror: reject,
                    // 添加更多选项
                    nocache: true,
                    revalidate: true
                };

                // 添加特定的请求头
                if (endpoint.headers) {
                    Object.assign(requestOptions.headers, endpoint.headers);
                }

                GM_xmlhttpRequest(requestOptions);
            });

            return response;
        } catch (error) {
            if (retryCount < MAX_RETRIES) {
                console.log(`重试请求 ${endpoint.url} (${retryCount + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return fetchWithRetry(endpoint, retryCount + 1);
            }
            throw error;
        }
    }

    // 添加新的cookie获取函数
    async function getAllDomainCookies() {
        let allCookies = '';

        // 尝试从所有域名获取cookie
        for (const domain of COOKIE_DOMAINS) {
            try {
                if (typeof GM_cookie !== 'undefined') {
                    const cookies = await new Promise((resolve) => {
                        GM_cookie.list({ domain }, (cookies) => resolve(cookies));
                    });

                    if (cookies && cookies.length > 0) {
                        const domainCookies = cookies
                            .map(cookie => `${cookie.name}=${cookie.value}`)
                            .join('; ');
                        allCookies = allCookies ? `${allCookies}; ${domainCookies}` : domainCookies;
                        console.log(`从域名 ${domain} 获取到 ${cookies.length} 个cookie`);
                    }
                }
            } catch (error) {
                console.log(`获取 ${domain} 的cookie失败:`, error);
            }
        }

        return allCookies;
    }

    // 添加新的函数来处理响应
    function processResponse(response) {
        if (!response || !response.responseHeaders) return '';

        let newCookies = '';

        try {
            // 1. 从响应头获取cookie
            const headers = response.responseHeaders.toLowerCase();
            const allHeaders = headers.split('\n');

            // 处理所有可能的cookie头
            const cookieHeaders = allHeaders.filter(h =>
                h.includes('cookie') ||
                h.includes('set-cookie') ||
                h.includes('x-set-cookie')
            );

            if (cookieHeaders.length > 0) {
                newCookies = cookieHeaders
                    .map(header => {
                        const [_, value] = header.split(':', 2);
                        return value ? value.trim() : '';
                    })
                    .filter(Boolean)
                    .join('; ');
            }

            // 2. 从响应体获取cookie
            try {
                const data = JSON.parse(response.responseText);
                if (data && typeof data === 'object') {
                    const extractCookies = (obj, path = '') => {
                        let extracted = '';
                        for (const [key, value] of Object.entries(obj)) {
                            if (typeof value === 'object' && value !== null) {
                                extracted += extractCookies(value, `${path}${key}.`);
                            } else if (
                                (key.toLowerCase().includes('cookie') ||
                                key.toLowerCase().includes('token')) &&
                                typeof value === 'string'
                            ) {
                                console.log(`在路径 ${path}${key} 找到可能的cookie值`);
                                extracted += value + '; ';
                            }
                        }
                        return extracted;
                    };

                    const bodyCookies = extractCookies(data);
                    if (bodyCookies) {
                        newCookies = newCookies ? `${newCookies}; ${bodyCookies}` : bodyCookies;
                    }
                }
            } catch (e) {
                // 忽略JSON解析错误
            }

            return newCookies;
        } catch (error) {
            console.error('处理响应失败:', error);
            return '';
        }
    }

    // 修改 getExtendedCookies 函数
    async function getExtendedCookies() {
        let allCookies = new Set();

        // 1. 获取当前域名的所有cookie
        document.cookie.split(';').forEach(cookie =>
            allCookies.add(cookie.trim())
        );

        // 2. 尝试从所有域名获取cookie
        const domainCookies = await getAllDomainCookies();
        if (domainCookies) {
            domainCookies.split(';').forEach(cookie =>
                allCookies.add(cookie.trim())
            );
        }

        // 3. 尝试从localStorage获取相关信息
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.toLowerCase().includes('cookie') ||
                    key.toLowerCase().includes('token') ||
                    key.toLowerCase().includes('auth')) {
                    const value = localStorage.getItem(key);
                    if (value && value.includes('=')) {
                        allCookies.add(value.trim());
                    }
                }
            }
        } catch (e) {
            console.log('localStorage访问失败:', e);
        }

        // 4. 处理所有请求
        const allEndpoints = [
            // 基础API
            { url: 'https://api.bilibili.com/x/web-interface/nav', method: 'GET' },
            { url: 'https://api.bilibili.com/x/web-interface/nav/stat', method: 'GET' },
            // 用户相关
            { url: 'https://api.bilibili.com/x/space/myinfo', method: 'GET' },
            { url: 'https://api.bilibili.com/x/space/acc/info', method: 'GET' },
            // 视频相关
            { url: 'https://api.bilibili.com/x/player/v2', method: 'GET' },
            { url: 'https://api.bilibili.com/x/player/wbi/playurl', method: 'GET' },
            // 直播相关
            { url: 'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser', method: 'GET' },
            { url: 'https://live.bilibili.com/p/html/live-web-mng/index', method: 'GET' },
            // 消息相关
            { url: 'https://message.bilibili.com/api/notify/query.notify.count.do', method: 'GET' },
            // 动态相关
            { url: 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new', method: 'GET' },
            // 特殊请求
            {
                url: 'https://www.bilibili.com/correspond/1',
                method: 'GET',
                headers: { 'X-From-Bili': 'main' }
            },
            {
                url: 'https://api.bilibili.com/x/web-show/res/locs',
                method: 'GET',
                headers: { 'X-From-Bili': 'main' }
            },
            // POST请求
            {
                url: 'https://api.bilibili.com/x/web-interface/nav',
                method: 'POST',
                data: {
                    build: 0,
                    mobi_app: 'web',
                    csrf: document.cookie.match(/bili_jct=([^;]+)/)?.[1] || ''
                }
            },
            {
                url: 'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser',
                method: 'POST',
                data: {
                    room_id: 0,
                    platform: 'web'
                }
            },
            // 动态资源
            {
                url: 'https://www.bilibili.com/favicon.ico',
                method: 'GET',
                headers: { 'Accept': 'image/webp,*/*' }
            },
            {
                url: 'https://static.hdslb.com/images/favicon.ico',
                method: 'GET',
                headers: { 'Accept': 'image/webp,*/*' }
            }
        ];

        // 添加动态端点
        try {
            const uid = document.cookie.match(/DedeUserID=(\d+)/)?.[1];
            if (uid) {
                allEndpoints.push(
                    { url: `https://api.bilibili.com/x/space/upstat?mid=${uid}`, method: 'GET' },
                    { url: `https://api.bilibili.com/x/relation/stat?vmid=${uid}`, method: 'GET' }
                );
            }
        } catch (error) {
            console.log('获取UID失败:', error);
        }

        // 5. 并发处理请求
        const results = await Promise.allSettled(
            allEndpoints.map(endpoint =>
                endpoint.method !== 'WS' ?
                    fetchWithRetry(endpoint) :
                    Promise.resolve(null)
            )
        );

        // 6. 处理响应
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                const cookies = processResponse(result.value);
                if (cookies) {
                    cookies.split(';').forEach(cookie =>
                        allCookies.add(cookie.trim())
                    );
                }
            }
        });

        // 7. 返回去重后的有效cookie
        return Array.from(allCookies)
            .filter(cookie => {
                const [key, value] = cookie.split('=');
                return key && value && !key.includes(' ');
            })
            .join('; ');
    }

    // 修改cookie证和清理函数
    function validateAndCleanCookies(cookies) {
        // 已知的有效cookie名称列表
        const knownCookies = new Set([
            // 用户认证相关
            'DedeUserID', 'DedeUserID__ckMd5', 'bili_jct', 'SESSDATA',
            'bili_ticket', 'bili_ticket_expires', 'sid',
            // 设备和浏览器标识
            'buvid3', 'buvid4', 'buvid_fp', 'buvid_fp_plain',
            '_uuid', 'fingerprint', 'b_lsid', 'b_nut',
            // 功能和设置相关
            'CURRENT_FNVAL', 'CURRENT_QUALITY', 'CURRENT_BLACKGAP',
            'CURRENT_QUALITY_CROSS_PAGE', 'browser_resolution',
            'header_theme_version', 'home_feed_column', 'enable_web_push',
            'go-back-dyn', 'is-2022-channel',
            // 直播相关
            'LIVE_BUVID', 'live_buvid',
            // 播放器相关
            'bp_video_offset', 'bp_t_offset', 'PVID',
            // 其他系统相关
            'rpdid', 'hit-dyn-v2', 'innersign',
            'bmg_af_switch', 'bmg_src_def_domain',
            'dy_spec_agreed', 'b_timer'
        ]);

        // 分割并过滤cookie
        const cookieSet = new Set(
            cookies.split(';')
                .map(cookie => cookie.trim())
                .filter(cookie => {
                    // 基本验证
                    if (!cookie.includes('=')) return false;
                    const [key, value] = cookie.split('=');
                    if (!key || !value) return false;

                    // 清理key和value
                    const cleanKey = key.trim();
                    const cleanValue = value.trim();

                    // 验证规则
                    if (cleanKey.includes(' ') || cleanKey.length > 100) return false;
                    if (cleanValue.length > 1000) return false;
                    if (cleanValue.includes('\n') || cleanValue.includes('\r')) return false;

                    // 保留规则
                    return knownCookies.has(cleanKey) ||
                           /^bp_t_offset_\d+$/.test(cleanKey) ||
                           /^b_(lsid|nut|uid|timer)/.test(cleanKey) ||
                           /^bili_/.test(cleanKey) ||
                           /^SESSDATA$/.test(cleanKey) ||
                           /^_uuid$/.test(cleanKey) ||
                           /^buvid[0-9]?$/.test(cleanKey);
                })
                .map(cookie => {
                    const [key, value] = cookie.split('=');
                    // 允许更多的特殊字符
                    const cleanValue = value.replace(/[^\w\d\-_.%=:]/g, '');
                    return `${key.trim()}=${cleanValue}`;
                })
        );

        // 转换回字符串
        const result = Array.from(cookieSet).join('; ');
        console.log('验证后的cookie数量:', cookieSet.size);
        return result;
    }

    // 修改 forceGetCookies 函数
    async function forceGetCookies() {
        let allCookies = new Set();

        // 等待页面加载完成
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
            });
        }

        // 1. 使用多种方法获取原始cookie
        try {
            // 直接获取
            const currentCookie = document.cookie;
            if (currentCookie && typeof currentCookie === 'string') {
                currentCookie.split(';').forEach(cookie =>
                    allCookies.add(cookie.trim())
                );
            }

            // 使用Object.getOwnPropertyDescriptor
            try {
                const cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                  Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
                if (cookieDesc && cookieDesc.get) {
                    const cookieStr = cookieDesc.get.call(document);
                    if (cookieStr && typeof cookieStr === 'string') {
                        cookieStr.split(';').forEach(cookie =>
                            allCookies.add(cookie.trim())
                        );
                    }
                }
            } catch (e) {
                console.log('获取cookie描述符失败:', e);
            }

            // 尝试使用CookieStore API
            if ('cookieStore' in window) {
                try {
                    const cookies = await cookieStore.getAll();
                    cookies.forEach(cookie =>
                        allCookies.add(`${cookie.name}=${cookie.value}`)
                    );
                } catch (e) {
                    console.log('CookieStore API访问失败:', e);
                }
            }

        } catch (e) {
            console.log('获取原始cookie失败:', e);
        }

        // 2. 注入cookie监听器
        try {
            const originalSetCookie = document.__lookupSetter__('cookie');
            document.__defineSetter__('cookie', function(val) {
                allCookies.add(val.trim());
                return originalSetCookie.call(document, val);
            });
        } catch (e) {
            console.log('注入cookie监听器失败:', e);
        }

        // 3. 强制触发cookie设置
        try {
            // 触发页面重新加载cookie
            const tempIframe = document.createElement('iframe');
            tempIframe.style.display = 'none';
            tempIframe.src = 'https://www.bilibili.com/';
            document.body.appendChild(tempIframe);
            setTimeout(() => tempIframe.remove(), 1000);

            // 触发API请求
            fetch('https://api.bilibili.com/x/web-interface/nav', {
                credentials: 'include',
                mode: 'cors'
            }).catch(() => {});
        } catch (e) {
            console.log('触发cookie设置失败:', e);
        }

        // 4. 使用特殊的请求头强制获取
        const specialHeaders = {
            'X-Override-Cookie': document.cookie,
            'X-Original-Cookie': document.cookie,
            'Cookie-Debug': 'true',
            'X-Cookie-Debug': 'true'
        };

        // 5. 发送特殊请求
        const urls = [
            'https://api.bilibili.com/x/web-interface/nav',
            'https://passport.bilibili.com/x/passport-login/web/cookie/info',
            'https://www.bilibili.com/'
        ];

        for (const url of urls) {
            try {
                const response = await fetch(url, {
                    credentials: 'include',
                    mode: 'cors',
                    headers: specialHeaders
                });
                const cookies = response.headers.get('set-cookie');
                if (cookies) {
                    cookies.split(',').forEach(cookie =>
                        allCookies.add(cookie.split(';')[0].trim())
                    );
                }
            } catch (e) {
                console.log(`请求 ${url} 失败:`, e);
            }
        }

        // 6. 等待一段时间以确保所有cookie都被设置
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 7. 最后一次获取当前cookie
        document.cookie.split(';').forEach(cookie =>
            allCookies.add(cookie.trim())
        );

        // 8. 返回验证后的cookie
        return validateAndCleanCookies(Array.from(allCookies).join('; '));
    }

    // 修改 getSpecifiedCookie 函数
    async function getSpecifiedCookie() {
        try {
            const allCookies = new Set();

            // 1. 劫持原生API
            const originalDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
            const originalGetter = originalDescriptor.get;
            const originalSetter = originalDescriptor.set;

            // 2. 注入cookie监听器
            Object.defineProperty(Document.prototype, 'cookie', {
                get: function() {
                    const value = originalGetter.call(this);
                    if (value) allCookies.add(value);
                    return value;
                },
                set: function(value) {
                    if (value) allCookies.add(value);
                    return originalSetter.call(this, value);
                },
                configurable: true
            });

            // 3. 使用GM_cookie获取所有域名的cookie
            const domains = [
                'bilibili.com',
                '.bilibili.com',
                'www.bilibili.com',
                'api.bilibili.com',
                'passport.bilibili.com',
                'live.bilibili.com',
                't.bilibili.com',
                'space.bilibili.com',
                'message.bilibili.com',
                'api.vc.bilibili.com'
            ];

            for (const domain of domains) {
                try {
                    const cookies = await new Promise((resolve) => {
                        GM_cookie.list({ domain }, (cookies) => resolve(cookies));
                    });

                    if (cookies && cookies.length > 0) {
                        cookies.forEach(cookie =>
                            allCookies.add(`${cookie.name}=${cookie.value}`)
                        );
                    }
                } catch (e) {}
            }

            // 4. 发送特殊请求
            const specialHeaders = {
                'Accept': 'application/json, text/plain, */*',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.cookie.match(/bili_jct=([^;]+)/)?.[1] || '',
                'Cookie': document.cookie,
                'X-Cookie': document.cookie,
                'X-Original-Cookie': document.cookie,
                'X-Debug-Cookie': document.cookie,
                'X-Cookie-Debug': 'true',
                // 添加更多特殊头
                'X-Cookie-Override': document.cookie,
                'X-Cookie-All': document.cookie,
                'X-Cookie-Raw': document.cookie,
                'X-Cookie-Full': document.cookie
            };

            const urls = [
                'https://api.bilibili.com/x/web-interface/nav',
                'https://passport.bilibili.com/x/passport-login/web/cookie/info',
                'https://api.bilibili.com/x/web-interface/nav/stat',
                'https://api.bilibili.com/x/player/v2',
                'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser',
                // 添加更多端点
                'https://api.bilibili.com/x/web-interface/wbi/index',
                'https://api.bilibili.com/x/space/wbi/acc/info',
                'https://api.bilibili.com/x/web-interface/search/default',
                'https://api.bilibili.com/x/web-interface/zone',
                'https://api.bilibili.com/x/web-show/res/locs'
            ];

            for (const url of urls) {
                try {
                    const response = await fetch(url, {
                        credentials: 'include',
                        headers: specialHeaders
                    });

                    const setCookie = response.headers.get('set-cookie');
                    if (setCookie) {
                        setCookie.split(',').forEach(cookie => {
                            const mainPart = cookie.split(';')[0];
                            if (mainPart) allCookies.add(mainPart.trim());
                        });
                    }
                } catch (e) {}
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // 5. 恢复原始API
            Object.defineProperty(Document.prototype, 'cookie', originalDescriptor);

            // 6. 返回所有cookie
            return Array.from(allCookies)
                .filter(cookie => {
                    const [key, value] = cookie.split('=');
                    return key && value && !key.includes(' ');
                })
                .join('; ');

        } catch (error) {
            console.error('获取cookie失败:', error);
            return document.cookie;
        }
    }

    // 显示通知
    function showNotification(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 70px;
            right: 80px;
            background-color: rgba(34, 34, 34, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 999999999;
            font-size: 14px;
            font-family: Arial, sans-serif;
            animation: fadeInOut 4s ease-in-out;
            white-space: pre-line;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                15% { opacity: 1; transform: translateY(0); }
                85% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);

        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 5000);
    }

    // 按钮
    function addButtons() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 999999;
        `;

        // 完整Cookie按钮
        const fullButton = document.createElement('button');
        fullButton.textContent = '获取Cookie';
        fullButton.style.cssText = `
            padding: 8px 16px;
            background: #fb7299;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;

        // 简易Cookie按钮
        const simpleButton = document.createElement('button');
        simpleButton.textContent = '简易获取';
        simpleButton.style.cssText = `
            padding: 8px 16px;
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;

        // 新增：指定Cookie按钮
        const specifiedButton = document.createElement('button');
        specifiedButton.textContent = '获取完整Cookie';
        specifiedButton.style.cssText = `
            padding: 8px 16px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;

        // 添加点击事件
        fullButton.onclick = function() {
            const cookies = formatCookies(document.cookie);
            GM_setClipboard(cookies);
            showNotification('完整Cookie已复制到剪贴板');
            console.log('完整Cookies:\n', cookies);
        };

        simpleButton.onclick = function() {
            const cookies = getImportantCookies(document.cookie);
            GM_setClipboard(cookies);
            showNotification('重要Cookie已复制到剪贴板');
            console.log('要Cookies:\n', cookies);
        };

        specifiedButton.onclick = async function() {
            try {
                specifiedButton.disabled = true;
                specifiedButton.textContent = '获取中...';

                const cookies = await getSpecifiedCookie();
                if (cookies) {
                    GM_setClipboard(cookies);
                    showNotification(`Cookie已复制 (${cookies.length}字符)\n包含 ${cookies.split(';').length} 个cookie`);
                    console.log('获取的Cookie字符串:\n', cookies);
                    console.log(`字符串长度: ${cookies.length}`);
                }
            } catch (error) {
                showNotification('获取Cookie失败: ' + error.message);
                console.error('获取Cookie失败:', error);
            } finally {
                specifiedButton.disabled = false;
                specifiedButton.textContent = '获取完整Cookie';
            }
        };

        container.appendChild(fullButton);
        container.appendChild(simpleButton);
        container.appendChild(specifiedButton);
        document.body.appendChild(container);
    }

    // 添加错误处理函数
    function handleError(error, context) {
        console.error(`[Cookie Getter] ${context}:`, error);
        return null;
    }

    // 修改按钮添加逻辑
    function addButtonsWhenReady() {
        if (!document.body) {
            setTimeout(addButtonsWhenReady, 100);
            return;
        }

        try {
            addButtons();
        } catch (error) {
            handleError(error, '添加按钮失败');
        }
    }

    // 修改初始化调用
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButtonsWhenReady);
    } else {
        addButtonsWhenReady();
    }

    // 添加页面错误监听
    window.addEventListener('error', function(event) {
        handleError(event.error, '页面错误');
    });

    // 添加未处理的Promise错误监听
    window.addEventListener('unhandledrejection', function(event) {
        handleError(event.reason, '未处理的Promise错误');
    });
})();