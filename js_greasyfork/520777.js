// ==UserScript==
// @name         Civitai Direct Link Helper
// @name:zh-CN   Civitai 下载助手
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Adds a convenient copy button next to download buttons on Civitai to easily get direct download links for models
// @description:zh-CN  在 Civitai 的下载按钮旁添加复制按钮，轻松复制直链地址 还有去广告
// @author       hua
// @match        https://civitai.com/*
// @match        https://civitai.green/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520777/Civitai%20Direct%20Link%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520777/Civitai%20Direct%20Link%20Helper.meta.js
// ==/UserScript==




(function () {
    'use strict';
    unsafeWindow.setInterval = function (fn, time) {
    };
    const origin_setTimeout = unsafeWindow.setTimeout;
    unsafeWindow.setTimeout = function (fn, time) {
        const tags = ['schedule', 'coreAdServerStart', 'exited', 'maybeFetchNotificationAndTrackCurrentUrl', 'googletagservices', '/api/internal/activity', 'iframe_api'];
        if (tags.some(tag => fn.toString().includes(tag))) {
            return;
        }
        function fn_() {
            fn();
        }
        origin_setTimeout(fn_, time);
    };

    hookCreateElement();
    changeInfo();
    modifywebpack();
    function modifywebpack() {
        let webpackChunk_N_E;
        const hookPush = () => {
            const originPush = webpackChunk_N_E.push;
            webpackChunk_N_E.push = function (chunk) {
                const funs = chunk?.[1];
                if (funs?.['68714'] && !funs['68714'].inject) {
                    let funStr = funs['68714'].toString();
                    // funStr = funStr.replace('function(e,i,t){', 'function(e,i,t){debugger;');
                    // funStr = funStr.replace('function(e,t,n){"use strict";', 'function(e,t,n){"use strict";debugger;');
                    let match_tag = funStr.match(/return (.{1,5})\.length\?\(0,/);
                    if (match_tag) {
                        const tag = match_tag[1];
                        funStr = funStr.replace(`return ${tag}.length?(0,`, `${tag}=${tag}.filter(item => item.type !== "ad");return ${tag}.length?(0,`);
                    }
                    funs['68714'] = new Function('return ' + funStr)();
                    funs['68714'].inject = true;
                }
                if (funs?.['56053'] && !funs['56053'].inject) {
                    let funStr = funs['56053'].toString();
                    // funStr = funStr.replace('function(e,t,i){"use strict";', 'function(e,t,i){"use strict";debugger;');
                    let match_tag = funStr.match(/children\:(.{1,5})\.map\(\(/);
                    if (match_tag) {
                        const tag = match_tag[1];
                        const re_match = funStr.match(/return\(0,(.{1,5}).jsx\)\("div"/);
                        if (re_match) {
                            const re_str = re_match[0];
                            funStr = funStr.replace(re_str, `${tag}.forEach((item,i)=>{ ${tag}[i] = item.filter(ite => ite.data.type !== "ad")});${re_str}`);
                        }
                    }
                    funs['56053'] = new Function('return ' + funStr)();
                    funs['56053'].inject = true;
                }
                originPush.call(this, chunk);
            };
        };
        Object.defineProperty(unsafeWindow, 'webpackChunk_N_E', {
            get: function () {
                return webpackChunk_N_E;
            },
            set: function (value) {
                webpackChunk_N_E = value;
                hookPush();
            }
        });
    }

    function changeInfo() {
        const originFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = function (url, options) {
            async function fetch_request(response) {
                if (url.includes('/announcement.getAnnouncements')) {
                    try {
                        const data = await response.json();
                        if (data.result?.data?.json) data.result.data.json = [];
                        console.log('modify announcement.getAnnouncements');
                        response = new Response(JSON.stringify(data), response);
                    } catch (e) {
                        console.log('fetch_request error', e);
                    }
                }
                if (url.includes('auth/session')) {
                    try {
                        const data = await response.json();
                        if (data.user) {
                            const user = data.user;
                            user.allowAds = false;
                            console.log('modify auth/session');
                        }
                        response = new Response(JSON.stringify(data), response);
                    } catch (e) {
                        console.log('fetch_request error', e);
                    }
                }
                return response;
            }
            return originFetch(url, options).then(fetch_request);
        };

        let monitorcount = 1;
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT' && node.id === '__NEXT_DATA__') {
                        monitorcount--;
                        console.log('modify __NEXT_DATA__');
                        if (monitorcount <= 0) {
                            observer.disconnect();
                        }
                        modify(node);
                    }
                    
                }
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        function modify(node) {
            const initalData = JSON.parse(node.textContent);
            const trpcData = initalData.props?.pageProps?.trpcState?.json;
            if (trpcData) {
                const queries = trpcData.queries || [];
                if (queries.length > 0) {
                    const query = queries[0];
                    const data = query.state?.data || [];
                    const remveIndex = [];
                    data.forEach((item, index) => {
                        const ignoreFlags = ['Announcement', 'Event', 'CosmeticShop'];
                        if (ignoreFlags.includes(item.type)) {
                            remveIndex.push(index);
                        }
                    });
                    remveIndex.reverse();
                    remveIndex.forEach(index => {
                        data.splice(index, 1);
                    });
                }
            }

            const flags = initalData.props?.pageProps?.flags;
            if (flags) {
                flags.adsEnabled = false;
            }
            const session = initalData.props?.pageProps?.session;
            if (session?.user) {
                const user = session.user;
                user.allowAds = false;
            }
            node.textContent = JSON.stringify(initalData);
        }

    }

    function paraseDownloadUrl(button) {
        let originalColor = window.getComputedStyle(button).color;
        const restoreTimeout = 10000;
        let interval = null;
        const restore = () => {
            button.style.color = originalColor;
        };

        const onError = () => {
            clearInterval(interval);
            interval = null;
            button.style.color = '#FF0000';
            setTimeout(() => {
                restore();
            }, restoreTimeout);
        };

        const onSuccess = () => {
            clearInterval(interval);
            interval = null;
            navigator.clipboard.writeText(button.downloadUrl).then(() => {
            }).catch((e) => {
                alert('copy error:' + e.message);
            });
            button.style.color = '#00FF00';
            setTimeout(() => {
                restore();
            }, restoreTimeout);
        };
        if (button.downloadUrl) {
            onSuccess();
            return;
        }
        const uri = button.getAttribute('href');
        interval = setInterval(() => {
            button.style.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        }, 100);

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://civitai.com${uri}`,
            timeout: 10000,
            anonymous: false,
            redirect: 'manual',
            maxRedirects: 0,
            onload: function (response) {
                const downloadUrl = response.responseHeaders.match(/location:(.*?)(?:\r?\n)/i)?.[1];
                button.downloadUrl = downloadUrl;
                downloadUrl ? onSuccess() : onError();
            },
            onerror: function (error) {
                console.log('onerror', error);
                onError();
            },
            ontimeout: function () {
                console.log('ontimeout');
                onError();
            }
        });
    }

    function hookDownloadButton(node) {
        let isClick = false;
        let timers = [];
        node.addEventListener('click', function (e) {
            if (isClick) {
                isClick = false;
                return;
            }
            e.preventDefault();
            const timer = setTimeout(() => {
                isClick = true;
                timers.forEach(timer => clearTimeout(timer));
                timers.length = 0;
                node.click();
            }, 300);
            timers.push(timer);
        });
        node.addEventListener('dblclick', function (e) {
            e.preventDefault();
            timers.forEach(timer => clearTimeout(timer));
            timers.length = 0;
            paraseDownloadUrl(node);
        });
    }

    function hookCreateElement() {
        const origin_createElement = unsafeWindow.document.createElement;
        unsafeWindow.document.createElement = function () {
            const node = origin_createElement.apply(this, arguments);
            if (arguments[0].toUpperCase() === 'A') {
                const originSetAttribute = node.setAttribute;
                node.setAttribute = function (name, value) {
                    if (name === 'href' ) {
                        if (value?.startsWith('/api/download/models/')){
                            console.log('hookButton');
                            hookDownloadButton(node);
                        }
                        if (value?.includes('/pricing?utm_campaign=holiday_promo')) {
                            node.style.display = 'none';
                            console.log('hookPricing');
                        }
                    }
                    return originSetAttribute.call(this, name, value);
                };
            }
            if (arguments[0].toUpperCase() === 'IFRAME') {
                return null;
            }
            return node;
        };
        unsafeWindow.document.createElement.toString = origin_createElement.toString.bind(origin_createElement);
    }

})();
