// ==UserScript==
// @name         小黑盒楼层显示_全自动精简版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持小黑盒Web端显示楼层对应层号，采用监控楼层变动和捕获分页请求的方法实现全自动显示楼层信息，精简了完整版的搜索和抽奖功能
// @author       sjx01
// @match        https://www.xiaoheihe.cn/app/bbs/*
// @icon         https://www.xiaoheihe.cn/favicon.ico
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529211/%E5%B0%8F%E9%BB%91%E7%9B%92%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA_%E5%85%A8%E8%87%AA%E5%8A%A8%E7%B2%BE%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/529211/%E5%B0%8F%E9%BB%91%E7%9B%92%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA_%E5%85%A8%E8%87%AA%E5%8A%A8%E7%B2%BE%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_API = '/bbs/app/link/tree';
    const MONITOR_PARAMS = new Set(['hkey', '_time', 'nonce', 'link_id', 'page']);  // 除page参数其他皆为完整版和Debug版本预留API请求参数

    const state = {
        currentLinkId: null,
        pendingRequests: new Map(),
        floorData: {
            pageMap: new Map(),
            sortedFloors: [],
            domObserver: null,
            checkTimer: null
        }
    };

    const consoleTheme = {
        system: 'color: #9b59b6; font-weight: bold',
        apiHeader: 'color: #3498db; font-weight: bold',
        paramName: 'color: #2ecc71',
        paramValue: 'color: #e67e22',
        url: "color: #1E90FF; font-weight: bold",
        floor: 'color: #e74c3c; font-weight: bold'
    };

    //================ 样式系统 ================//
    const injectStyles = () => {
        if (document.getElementById('heybox-floor-style')) return;
        const style = document.createElement('style');
        style.id = 'heybox-floor-style';
        style.textContent = `
            .heybox-floor-tag {
                display: inline-block !important;
                min-width: 42px;
                margin-right: 8px;
                padding: 3px 8px;
                background: #f0f3ff;
                border-radius: 15px;
                color: #2f54eb;
                font-size: 12px;
                border: 1px solid #adc6ff;
                font-weight: 500;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                font-family: 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif;
                transition: transform 0.2s ease;
            }
            .heybox-floor-tag:hover {
                transform: scale(1.05);
                background: #d6e4ff;
            }
        `;
        document.head.appendChild(style);
    };

    //================ 核心拦截系统 ================//
    const setupGlobalInterception = () => {
        const nativeFetch = window.fetch;
        const nativeXHROpen = XMLHttpRequest.prototype.open;
        const nativeXHRSend = XMLHttpRequest.prototype.send;

        window.fetch = async (input, init) => {
            const urlObj = input.url ? new URL(input.url) : new URL(input);
            if (urlObj.pathname === TARGET_API) {
                const page = parseInt(urlObj.searchParams.get('page') || 1);
                const requestId = Symbol();

                state.pendingRequests.set(requestId, {
                    page: page,
                    timestamp: Date.now()
                });

                try {
                    const response = await nativeFetch(input, init);
                    const data = await response.clone().json();
                    processAPIRequest(urlObj, data, requestId);
                    return response;
                } finally {
                    state.pendingRequests.delete(requestId);
                }
            }
            return nativeFetch(input, init);
        };

        XMLHttpRequest.prototype.open = function(method, url) {
            this._enhancedURL = new URL(url, location.href);
            return nativeXHROpen.call(this, method, url);
        };

        XMLHttpRequest.prototype.send = function(body) {
            if (this._enhancedURL?.pathname === TARGET_API) {
                const page = parseInt(this._enhancedURL.searchParams.get('page')) || 1;
                const requestId = Symbol();

                state.pendingRequests.set(requestId, {
                    page: page,
                    timestamp: Date.now()
                });

                const originalOnload = this.onload;
                this.onload = function() {
                    if (this.status === 200) {
                        try {
                            const data = JSON.parse(this.responseText);
                            processAPIRequest(this._enhancedURL, data, requestId);
                        } catch(e) {
                            console.error('API解析错误:', e);
                        }
                    }
                    originalOnload?.call(this);
                    state.pendingRequests.delete(requestId);
                };
            }
            return nativeXHRSend.call(this, body);
        };
    };

    //================ 数据处理系统 ================//
    const processAPIRequest = (urlObj, data, requestId) => {
        const params = Object.fromEntries(urlObj.searchParams.entries());
        if (params.link_id !== state.currentLinkId) return;

        const requestInfo = state.pendingRequests.get(requestId);
        if (!requestInfo) return;

        const newFloors = extractFloorNumbers(data);
        if (newFloors.length === 0) return;

        state.floorData.pageMap.set(requestInfo.page, {
            floors: newFloors,
            timestamp: requestInfo.timestamp
        });

        updateSortedFloors();
        attemptImmediateInjection(newFloors.length);
        logAPIRequest(urlObj, newFloors);
    };

    const updateSortedFloors = () => {
        const sortedPages = Array.from(state.floorData.pageMap)
            .sort((a, b) => a[0] - b[0]);
        state.floorData.sortedFloors = sortedPages.flatMap(([page, data]) => data.floors);
    };

    //================ DOM操作系统 ================//
    const initDOMObserver = () => {
        if (state.floorData.domObserver) {
            state.floorData.domObserver.disconnect();
        }

        state.floorData.domObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    performInjection(getVisibleComments());
                }
            });
        });

        const commentList = document.querySelector('.link-comment__list');
        if (commentList) {
            state.floorData.domObserver.observe(commentList, {
                childList: true,
                subtree: true
            });
        }
    };

    const getVisibleComments = () => {
        return Array.from(
            document.querySelectorAll('.link-comment__comment-item:not(.comment-children-item)')
        ).filter(item => item.offsetParent !== null);
    };

    const attemptImmediateInjection = (newCount) => {
        let retry = 0;
        const checkAndInject = () => {
            const allItems = getVisibleComments();
            const expectedCount = state.floorData.sortedFloors.length;

            if (allItems.length >= expectedCount) {
                performInjection(allItems);
                return;
            }

            if (retry < 3) {
                retry++;
                setTimeout(checkAndInject, 300);
            }
        };
        checkAndInject();
    };

    const performInjection = (items) => {
        items.forEach((item, index) => {
            const floorNum = state.floorData.sortedFloors[index] || '−';
            const existingTag = item.querySelector('.heybox-floor-tag');

            if (existingTag) {
                existingTag.textContent = `#${floorNum}F`;
            } else {
                const tag = document.createElement('div');
                tag.className = 'heybox-floor-tag';
                tag.textContent = `#${floorNum}F`;
                const target = item.querySelector('.info-box__line-1') || item.querySelector('.comment-item__header');
                target?.prepend(tag);
            }
        });
    };

    //================ 健康检查系统 ================//
    const startHealthCheck = () => {
        if (state.floorData.checkTimer) clearInterval(state.floorData.checkTimer);

        state.floorData.checkTimer = setInterval(() => {
            if (!isPostPage() || state.floorData.sortedFloors.length === 0) return;

            const expected = state.floorData.sortedFloors.length;
            const actual = getVisibleComments().length;

            if (actual !== expected) {
                performInjection(getVisibleComments());
            }
        }, 2000);
    };

    //================ 路由系统 ================//
    const routeWatcher = () => {
        let currentLinkId = getLinkId(location.pathname);

        const observer = new MutationObserver(() => {
            const newLinkId = getLinkId(location.pathname);
            if (newLinkId === currentLinkId) return;

            if (currentLinkId) {
                clearFloorData();
            }

            currentLinkId = newLinkId;
            if (newLinkId) {
                handleNewLink(newLinkId);
            } else {
                stopHealthCheck();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const handleNewLink = (linkId) => {
        state.currentLinkId = linkId;
        state.floorData.pageMap.clear();
        state.floorData.sortedFloors = [];
        injectStyles();
        initDOMObserver();
        if (isPostPage()) startHealthCheck();
    };

    const stopHealthCheck = () => {
        if (state.floorData.checkTimer) {
            clearInterval(state.floorData.checkTimer);
            state.floorData.checkTimer = null;
        }
    };

    const clearFloorData = () => {
        stopHealthCheck();
        document.querySelectorAll('.heybox-floor-tag').forEach(tag => tag.remove());
    };

    //================ 工具方法 ================//
    const isPostPage = () => /\/link\/\d+/.test(location.pathname);

    const extractFloorNumbers = (data) => {
        try {
            return data.result.comments
                .map(commentGroup => commentGroup.comment?.[0])
                .filter(mainComment => mainComment?.floor_num > 0 && !mainComment.replyid)
                .map(mainComment => mainComment.floor_num);
        } catch(e) {
            console.error('楼层提取失败:', e);
            return [];
        }
    };

const logAPIRequest = (urlObj, floors) => {
    const params = Object.fromEntries(urlObj.searchParams.entries());

    if (params.link_id !== state.currentLinkId) {
        console.log(`%c[请求过滤] 忽略非当前帖子请求：${params.link_id}`, consoleTheme.system);
        return;
    }

    const requiredParams = {};
    MONITOR_PARAMS.forEach(key => {
        if (params[key]) requiredParams[key] = params[key];
    });

    const timestamp = new Date().toLocaleTimeString();
    console.groupCollapsed(
        `%c[${timestamp}][API捕获] page=${requiredParams.page} 楼层数:${floors.length}`,
        consoleTheme.apiHeader
    );

//    Object.entries(requiredParams).forEach(([k, v]) => {
//        console.log(`%c${k}: %c${v}`, consoleTheme.paramName, consoleTheme.paramValue);
//    });  //完整版和Debug版本预留输出，当前版本无作用，为了优化性能省略

    console.log(`%c楼层列表: %c${floors.join(', ')}`, consoleTheme.paramName, consoleTheme.floor);

//    console.log(`%c请求地址: %c${urlObj.href}`, consoleTheme.paramName, consoleTheme.url);  //完整版和Debug版本预留，为了优化性能省略

    console.groupEnd();
};

    const getLinkId = (path) => (path.match(/\/link\/([^\/?]+)/) || [])[1] || null;

    //================ 初始化 ================//
    (function init() {
        injectStyles();
        setupGlobalInterception();
        routeWatcher();
        if (isPostPage()) {
            handleNewLink(getLinkId(location.pathname));
        }
    })();
})();
