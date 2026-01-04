// ==UserScript==
// @name         jx filter ad
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  jx filter ad，不保证适用所有的jx页面，自用~
// @author       ltxlong
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535880/jx%20filter%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/535880/jx%20filter%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let jx_filter_ad_open_flag = false;
    const the_jx_url_trait = [
        'v.qq.com',
        'iqiyi.com',
        'iq.com',
        'youku.com',
        'le.com',
        'tudou.com',
        'mgtv.com',
        'sohu.com',
        '1905.com',
        'bilibili.com',
        'pptv.com',
        'baofeng.com',
        'acfun.cn',
        'miguvideo.com',
        'yinyuetai.com',
        'fun.tv',
        'wasu.cn'
    ];

    const originUrl = window.location.origin;
    const originSearch = window.location.search;

    const hasMatchInSearch = the_jx_url_trait.some(trait => originSearch.includes(trait));
    if (hasMatchInSearch) {
        jx_filter_ad_open_flag = true;
    }

    if (!jx_filter_ad_open_flag) {
        return;
    }

    // 可以自定义需要去掉的id和class和其他定义的元素
    const adEleId = [];
    const adEleClass = [];
    const adEleOther = ['span[id]'];

    // 固定为PC ua
    Object.defineProperty(navigator, 'userAgent', {
        get: function () {
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
        }
    });

    // Hook setInterval
    try {
        const originalSetInterval = window.setInterval;
        window.setInterval = function(callback, delay, ...args) {

            const callbackString = callback.toString();
            const filterPatterns = [
                '.appendChild(',
                '.insertBefore(',
                '.insertAfter(',
                '.append(',
                '.prepend(',
                '.after(',
                '.before(',
                '.appendTo(',
                '.prependTo(',
                '.html(',
                '.replaceWith(',
                '.wrap(',
                '.wrapAll(',
                '.wrapInner(',
            ];

            let isBlockFlag = false;
            if (typeof callbackString === 'string' && callbackString !== '[native code]') {
                for (const pattern of filterPatterns) {
                    if (callbackString.includes(pattern)) {
                        console.warn(`HOOK: Callback string contains filter pattern: "${pattern}"`);
                        isBlockFlag = true;
                        break;
                    }
                }
            }

            if (isBlockFlag) {
                return 0;
            }

            // --- 如果没有阻止，调用原始的 setInterval ---
            const intervalId = originalSetInterval.call(this, callback, delay, ...args);
            return intervalId;
        }
    } catch (error) {
        console.error('Error getting callback toString() or during string analysis:', error);
    }

    // 确保浏览器支持 Navigation API
    try {
        if ('navigation' in window) {

            window.navigation.addEventListener('navigate', (event) => {
                const destinationUrl = event.destination.url;

                const destinationOrigin = new URL(destinationUrl).origin;

                // Check if the destination origin is different from the current origin
                if (destinationOrigin !== originUrl) {
                    console.warn(`阻止了到非同源地址的跳转: ${destinationUrl}`);

                    // Prevent the default navigation behavior
                    // event.canIntercept must be true for preventDefault to work on this event type
                    if (event.canIntercept) {
                        event.preventDefault();;
                    } else {
                        console.log(`Navigation to ${destinationUrl} cannot be intercepted.`);
                        // Note: Some navigations like target="_blank" might not be interceptable this way
                    }


                } else {
                    console.log(`允许同源跳转: ${destinationUrl}`);
                    // Let the navigation proceed
                }

            });

            console.log(`当前页面源: ${window.location.origin}`);
            console.log('Navigation API 监听已启动...');

        } else {
            console.warn('当前浏览器不支持 Navigation API，请考虑使用 click/submit 监听作为替代。');
            // Fallback to click/submit method if necessary
        }

    } catch (e) {
        // Handle potential errors if the URL is invalid or cannot be parsed
        console.error('无法解析目标URL或发生错误:', e);
        // Decide whether to prevent or allow on error - usually allowing is safer
        // Let's assume allowing is the default if we can't verify
    }

    function removeTargetBlankDivs() {
        try {
            const blankTargetAnchors = document.querySelectorAll('a[target="_blank"]');
            if (blankTargetAnchors.length === 0) {
                //console.log("----------------No target='_blank' anchors found.");
                return;
            }

            blankTargetAnchors.forEach(anchor => {
                const parentDiv = anchor.closest('div');
                if (parentDiv) {
                    if (parentDiv.parentNode) {
                        //console.log("----------------Removing div: ", anchor.outerHTML);
                        parentDiv.remove();
                    }
                }
            });
        } catch (error) {
            console.error("----------------Error accessing or modifying content: ", error);
        }
    }

    function removeAdElement() {

        if (adEleId.length === 0 && adEleClass.length === 0 && adEleOther.length === 0) {
            return;
        }

        const selectors = [];
        if (adEleId.length > 0) {
            selectors.push(...adEleId.map(id => `#${id}`));
        }
        if (adEleClass.length > 0) {
            selectors.push(...adEleClass.map(className => `.${className}`));
        }
        if (adEleOther.length > 0) {
            selectors.push(...adEleOther.map(otherEle => `${otherEle}`));
        }
        if (selectors.length === 0) {
            return;
        }

        const combinedSelector = selectors.join(', ');
        try {
            const elementsToRemove = document.querySelectorAll(combinedSelector);

            elementsToRemove.forEach(element => {
                // 使用 element.remove() 是现代且推荐的删除元素方法
                // 兼容性：IE（Edge 除外）不支持，但现代浏览器都支持
                if (element && typeof element.remove === 'function') {
                    element.remove();
                    // console.log("已删除元素:", element); // 可选：记录删除的元素
                } else if (element && element.parentNode) {
                    // 兼容旧浏览器，通过父节点删除
                    element.parentNode.removeChild(element);
                    // console.log("已删除元素 (旧方法):", element); // 可选：记录删除的元素
                }
            });
        } catch(error) {
            console.error("删除元素时发生错误:", error);
        }
    }

    removeTargetBlankDivs();
    removeAdElement();

    // 考虑网速慢和卡顿的情况
    setTimeout(() => { removeTargetBlankDivs(); removeAdElement(); }, 1000)
    setTimeout(() => { removeTargetBlankDivs(); removeAdElement(); }, 2000)
    setTimeout(() => { removeTargetBlankDivs(); removeAdElement(); }, 3000)
    setTimeout(() => { removeTargetBlankDivs(); removeAdElement(); }, 5000)
    setTimeout(() => { removeTargetBlankDivs(); removeAdElement(); }, 10000)
    setTimeout(() => { removeTargetBlankDivs(); removeAdElement(); }, 20000)
    setTimeout(() => { removeTargetBlankDivs(); removeAdElement(); }, 30000)

    try {
        window.addEventListener('load', () => {
            removeTargetBlankDivs();
            removeAdElement();
        })
    } catch (error) {
        console.error("监听页面load发生错误:", error);
    }

})();