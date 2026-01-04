// ==UserScript==
// @name         bilibili屏蔽首页推广
// @namespace    https://github.com/strange-qwq/bilibili_blocks_homepage_ad
// @version      1.0.0.20250419
// @description  屏蔽首页广告及推广视频
// @author       QWQ
// @match        https://www.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533327/bilibili%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/533327/bilibili%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==

const hiddenDivClassName = 'hidden-div';
const hookApi = '/wbi/index/top/feed/rcmd';
let replaceEle = null;
const originalXHR = window.XMLHttpRequest;
const originalFetch = window.fetch;

(function () {
    'use strict';
    // 方式一：Hook请求响应
    hookHTTP();
    // 由于请求可能在hook之前执行，所以此处需要手动隐藏一次，如果有大佬知道怎么优化，欢迎PR
    setTimeout(hiddenAdEl, 1000);
    // 方式二：替换广告盒子显示（缺点：如果在定时器中运行，滑动时其它视频会频繁出现位移现象，所以未启用）
    // setInterval(hiddenAdEl, 5000);
})();

/**
 * Hook 函数
 */
function hookHTTP() {
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        // 重写open方法记录请求信息
        const originalOpen = xhr.open;
        xhr.open = function(method, url) {
            this._requestUrl = url;
            originalOpen.apply(this, arguments);
        };
        // 重写send方法拦截响应
        const originalSend = xhr.send;
        xhr.send = function(body) {
            const self = this;
            this.addEventListener('readystatechange', function() {
                if (self.readyState === 4 && self.status === 200) {
                    try {
                        // 检查目标接口
                        if (this._requestUrl.includes(hookApi)) {
                            const modifiedData = modifyResponse(JSON.parse(self.responseText));
                            Object.defineProperty(self, 'responseText', {
                                writable: true,
                                value: JSON.stringify(modifiedData)
                            });
                        }
                    } catch (e) {
                        console.error('Response parse error:', e);
                    }
                }
            });
            originalSend.apply(this, arguments);
        };
        return xhr;
    };
    window.fetch = function(input, init) {
        return originalFetch.apply(this, arguments).then(response => {
            if (typeof input === 'string' && input.includes(hookApi)) {
                // 克隆响应以便修改
                const clonedResponse = response.clone();
                return clonedResponse.json().then(data => {
                    const modifiedData = modifyResponse(data);
                    return new Response(
                        JSON.stringify(modifiedData),
                        {
                            headers: response.headers,
                            status: response.status,
                            statusText: response.statusText
                        }
                    );
                }).catch(e => {
                    console.error('Fetch response parse error:', e);
                    return response;
                });
            }
            return response;
        });
    };
}

/**
 * 过滤广告响应
 */
function modifyResponse (data) {
    data.data.item = data.data.item.filter((it) => {
        if (it.goto === 'ad') return false;
        return true;
    })
    return data;
}

/**
 * 隐藏广告盒子
 * - 该函数有两种隐藏方式，你可以通过修改以下注释来切换运行方式
 * - 方式一：隐藏广告盒子（缺点：如果在定时器中运行，滑动时其它视频会频繁出现位移现象）
 * - 方式二：遮挡广告盒子（缺点：不太好看）
 */
function hiddenAdEl() {
    let black = Array.from(document.querySelectorAll('.bili-video-card.is-rcmd')).filter((it) =>
        Array.from(it.querySelectorAll('.bili-video-card__stats--text')).some((i) => {
            if (i.innerText === '广告') return true;
            return false;
        })
    );
    black.forEach((it) => {
        if (Array.from(it.parentElement.classList).includes('feed-card')) {
            black.push(it.parentElement);
        }
    });
    black.push(...Array.from(document.querySelectorAll('.bili-video-card.is-rcmd:has(.vui_icon.bili-video-card__stats--icon)')));
    // black = black.filter((it) => {
    //     if (it.style.display === 'none') return false;
    //     if (it.querySelector(hiddenDivClassName)) return false;
    //     return true;
    // });
    black.forEach((it) => {
        // it.style.display = 'none';
        // it.appendChild(buildReplaceEle(it));
        it.parentElement.removeChild(it);
        // console.log('hidden element =>', it);
    });
    black = [];
}

/**
 * 构造广告盒子遮挡
 */
function buildReplaceEle(el) {
    if (el) {
        el.style.opacity = 0.1;
        el.style.position = 'relative';
    }
    if (replaceEle) {
        return replaceEle;
    }
    replaceEle = document.createElement('div');
    replaceEle.classList.add(hiddenDivClassName);
    replaceEle.style.top = 0;
    replaceEle.style.left = 0;
    replaceEle.style.width = '100%';
    replaceEle.style.height = '100%';
    replaceEle.style.display = 'flex';
    replaceEle.style.zIndex = Infinity;
    replaceEle.style.borderRadius = '12px';
    replaceEle.style.position = 'absolute';
    replaceEle.style.alignItems = 'center';
    replaceEle.style.justifyContent = 'center';
    const span = document.createElement('span');
    span.innerText = '广告';
    span.style.color = '#999999';
    span.style.fontSize = '16px';
    replaceEle.appendChild(span);
    // replaceEle.style.background = 'rgba(0, 0, 0, 0.5)';
    return replaceEle;
}
