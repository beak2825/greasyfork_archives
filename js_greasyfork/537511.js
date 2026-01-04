// ==UserScript==
// @name         爱壹帆去除播放中的广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  爱壹帆去除播放中的广告,需要登录一个普通账号
// @author       CeeYang
// @match        *://*.iyf.tv/*
// @match        *://*.yfsp.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yfsp.tv
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/537511/%E7%88%B1%E5%A3%B9%E5%B8%86%E5%8E%BB%E9%99%A4%E6%92%AD%E6%94%BE%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/537511/%E7%88%B1%E5%A3%B9%E5%B8%86%E5%8E%BB%E9%99%A4%E6%92%AD%E6%94%BE%E4%B8%AD%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 该脚本需要登录一个普通账号！！！！
    // 测试了半天，当前页面刷新还是无法跳过广告！！！
    // 进入首页后，注入完脚本，主要靠 user/getuserext 借口中的权限判断
    // 在播放页刷新，用户信息接口还没拉取到，广告内容已经初始化好了。
    // 将就用吧，垃圾代码，浪费我5个小时。

    // 劫持 fetch
    var originalFetch = window.fetch;
    window.fetch = function() {
        var url = arguments[0];
        /// 用户信息
        if (typeof url === 'string' && (url.includes('getuserinfo') || url.includes('getuseinfo'))) {
            console.log('[vip_inject] fetch 拦截到用户信息请求:', url);
            return originalFetch.apply(this, arguments).then(function(response) {
                return response.clone().json().then(function(data) {
                    // 只修改 bigV 及 bigVBeginTime/bigVEndTime
                    if (data && data.data) {
                        data.data.bigV = true;
                        data.data.vipLevel = 2;
                        data.data.vipCategoryId = 1;
                        data.data.vipTypeName = "超级VIP";
                        data.data.eDate = "2026-05-27T23:09:00Z";
                        data.data.bigVBeginTime = "2025-05-27T23:09:00Z";
                        data.data.bigVEndTime = "2099-05-27T23:09:00Z";
                        data.data.gid = 1;
                    }
                    if (data && data.data.info) {
                        data.data.info[0].userLevel = 2;
                        data.data.info[0].vipImage = "/assets/images/membership/g-VIP.png"
                        data.data.info[0].gold = 9999;
                        data.data.info[0].endDate = "2026-05-27";
                        data.data.info[0].endDays = 365;
                    }
                    console.log('[vip_inject] fetch 返回伪造数据:', data);
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                });
            });
        }
        /// 播放广告
        if (typeof url === 'string' && (url.includes('user/getuserext') || url.includes('user/getuserext'))) {
            console.log('[vip_inject] fetch 拦截到用户扩展请求:', url);
            return originalFetch.apply(this, arguments).then(function(response) {
                return response.clone().json().then(function(data) {
                    if (data && data.data && data.data.info) {
                            for (var i = 0; i < data.data.info.length; i++) {
                                data.data.info[i].isValid = true;
                            }
                        }
                    console.log('[vip_inject] fetch 返回伪造数据:', data);
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                });
            });
        }
        return originalFetch.apply(this, arguments);
    };

    // 劫持 XMLHttpRequest
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._isTarget = url.includes('getuserinfo') || url.includes('getuseinfo');
        this._isUserExt = url.includes('user/getuserext');
        this._isADList = url.includes('play/o');
        this._isPlay = url.includes('video/play');
        this._url = url;
        return originalOpen.apply(this, arguments);
    };
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this._isTarget) {
            console.log('[vip_inject] XMLHttpRequest open 拦截到用户信息请求：', this._url);
            var xhr = this;
            var onReadyStateChange = xhr.onreadystatechange;
            var onLoad = xhr.onload;
            var realOnReadyStateChange = function() {
                if (xhr.readyState === 4) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (data && data.data) {
                            data.data.bigV = true;
                            data.data.vipLevel = 2;
                            data.data.vipCategoryId = 1;
                            data.data.vipTypeName = "超级VIP";
                            data.data.eDate = "2026-05-27T23:09:00Z";
                            data.data.bigVBeginTime = "2025-05-27T23:09:00Z";
                            data.data.bigVEndTime = "2099-05-27T23:09:00Z";
                            data.data.gid = 1;
                        }
                        if (data && data.data.info) {
                            data.data.info[0].userLevel = 2;
                            data.data.info[0].vipImage = "/assets/images/membership/g-VIP.png"
                            data.data.info[0].gold = 9999;
                            data.data.info[0].endDate = "2026-05-27";
                            data.data.info[0].endDays = 365;
                        }
                        var newText = JSON.stringify(data);
                        Object.defineProperty(xhr, 'responseText', {value: newText});
                        Object.defineProperty(xhr, 'response', {value: newText});
                        console.log('[vip_inject] XMLHttpRequest 返回伪造用户信息数据:', data);
                    } catch(e) {
                        console.log('[vip_inject] 解析原始响应失败:', e);
                    }
                }
                onReadyStateChange && onReadyStateChange.apply(xhr, arguments);
            };
            xhr.onreadystatechange = realOnReadyStateChange;
            xhr.onload = function() {
                realOnReadyStateChange();
                onLoad && onLoad.apply(xhr, arguments);
            };
            return originalSend.apply(this, arguments);
        } else if (this._isUserExt) {
            console.log('[vip_inject] XMLHttpRequest open 拦截到用户扩展请求:', this._url);
            var xhr = this;
            var onReadyStateChange = xhr.onreadystatechange;
            var onLoad = xhr.onload;
            var realOnReadyStateChange = function() {
                if (xhr.readyState === 4) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (data && data.data && data.data.info) {
                            for (var i = 0; i < data.data.info.length; i++) {
                                data.data.info[i].isValid = true;
                            }
                        }
                        var newText = JSON.stringify(data);
                        Object.defineProperty(xhr, 'responseText', {value: newText});
                        Object.defineProperty(xhr, 'response', {value: newText});
                        console.log('[vip_inject] XMLHttpRequest 返回伪造用户扩展数据:', data);
                    } catch(e) {
                        console.log('[vip_inject] 解析原始用户扩展响应失败:', e);
                    }
                }
                onReadyStateChange && onReadyStateChange.apply(xhr, arguments);
            };
            xhr.onreadystatechange = realOnReadyStateChange;
            xhr.onload = function() {
                realOnReadyStateChange();
                onLoad && onLoad.apply(xhr, arguments);
            };
            return originalSend.apply(this, arguments);
        } else if (this._isADList) {
            console.log('[vip_inject] XMLHttpRequest open 拦截到广告列表请求:', this._url);
            var xhr = this;
            var onReadyStateChange = xhr.onreadystatechange;
            var onLoad = xhr.onload;
            var realOnReadyStateChange = function() {
                if (xhr.readyState === 4) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        data.data = [];
                        var newText = JSON.stringify(data);
                        Object.defineProperty(xhr, 'responseText', {value: newText});
                        Object.defineProperty(xhr, 'response', {value: newText});
                        console.log('[vip_inject] XMLHttpRequest 返回伪造广告列表数据:', data);
                    } catch(e) {
                        console.log('[vip_inject] 解析原始广告列表响应失败:', e);
                    }
                }
                onReadyStateChange && onReadyStateChange.apply(xhr, arguments);
            };
            xhr.onreadystatechange = realOnReadyStateChange;
            xhr.onload = function() {
                realOnReadyStateChange();
                onLoad && onLoad.apply(xhr, arguments);
            };
            return originalSend.apply(this, arguments);
        } else if (this._isPlay) {
            console.log('[vip_inject] XMLHttpRequest open 拦截到播放请求:', this._url);
            var xhr = this;
            var onReadyStateChange = xhr.onreadystatechange;
            var onLoad = xhr.onload;
            var realOnReadyStateChange = function() {
                if (xhr.readyState === 4) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (data && data.data.info) {
                            data.data.info[0].pauseData = [];
                            data.data.info[0].startData = [];
                        }
                        var newText = JSON.stringify(data);
                        Object.defineProperty(xhr, 'responseText', {value: newText});
                        Object.defineProperty(xhr, 'response', {value: newText});
                        console.log('[vip_inject] XMLHttpRequest 返回伪造播放数据:', data);
                    } catch(e) {
                        console.log('[vip_inject] 解析原始播放响应失败:', e);
                    }
                }
                onReadyStateChange && onReadyStateChange.apply(xhr, arguments);
            };
            xhr.onreadystatechange = realOnReadyStateChange;
            xhr.onload = function() {
                realOnReadyStateChange();
                onLoad && onLoad.apply(xhr, arguments);
            };
            return originalSend.apply(this, arguments);
        } else {
            return originalSend.apply(this, arguments);
        }
    };
    console.log('[vip_inject] JS 注入已生效');

    // 延迟 500 毫秒后，清除 localStorage 中所有 ggs_20xx 键
    setTimeout(function() {
        for (var key in localStorage) {
            if (localStorage.hasOwnProperty(key) && /^ggs_20/.test(key)) {
                localStorage.setItem(key, JSON.stringify([]));
                console.log('[vip_inject] 已清除 localStorage:', key);
            }
        }
    }, 500);
})();