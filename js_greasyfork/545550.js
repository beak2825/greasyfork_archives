// ==UserScript==
// @name         屏蔽浮动广告 & 外部链接广告
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  自动隐藏网页中的浮动广告（包括固定/绝对定位的a、img、div等），并且如果广告元素的链接（href/src）指向外部域名，也进行屏蔽
// @author       YourName
// @match        *://*/*
// @require           https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @license     MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545550/%E5%B1%8F%E8%94%BD%E6%B5%AE%E5%8A%A8%E5%B9%BF%E5%91%8A%20%20%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/545550/%E5%B1%8F%E8%94%BD%E6%B5%AE%E5%8A%A8%E5%B9%BF%E5%91%8A%20%20%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHostname = window.location.hostname;

    /**
     * 判断一个 URL 是否为外部链接（非当前域名）
     * @param {string} url - 要检查的链接，比如 href 或 src
     * @returns {boolean} - 是否是外部链接
     */
    function isExternalLink(url) {
        if (!url) return false;

        // 处理 javascript:, mailto:, tel:, 空等情况
        if (/^javascript:|mailto:|tel:|data:/i.test(url)) {
            return false;
        }

        try {
            // 创建一个 URL 对象（兼容相对路径）
            let linkUrl;

            if (url.startsWith('//')) {
                // 协议相对 URL，如 //ads.com/banner
                linkUrl = new URL('https:' + url);
            } else if (/^\/\//.test(url) === false && !url.match(/^https?:\/\//i)) {
                // 相对路径，如 /images/ad.png 或 ./ad.jpg，视为当前域名
                return false;
            } else {
                linkUrl = new URL(url, window.location.origin);
            }

            const linkHostname = linkUrl.hostname;

            // 比较 hostname （可考虑是否忽略 www. 等，下面做简单严格比较）
            return linkHostname !== currentHostname;
        } catch (e) {
            // URL 解析失败，可能格式不对，保守起见不屏蔽
            return false;
        }
    }

    /**
     * 检查元素是否包含外部链接，如果是则返回 true
     * @param {Element} el - DOM 元素
     * @returns {boolean}
     */
    function hasExternalLink(el) {
        if (el.tagName === 'A' && el.href) {
            return isExternalLink(el.href);
        } else if ((el.tagName === 'IMG' || el.tagName === 'IFRAME') && el.src) {
            return isExternalLink(el.src);
        }
        return false;
    }

    /**
     * 隐藏浮动广告元素，包括疑似广告以及外部链接广告
     */
    function hideFloatingAndExternalAds() {
        try {
            const elements = document.querySelectorAll('a[href]');
            elements.forEach(el => {
                const hasExternal = hasExternalLink(el);
                if (hasExternal) {
                    console.log('屏蔽广告元素:', el, '| 是浮动广告，含外部链接:', hasExternal);
                    el.style.display = 'none';
                }
            });
            
            $("body *").filter(function() {
                return $(this).css("position") === "fixed";
            }).remove();
        } catch (e) {
            console.warn('选择器匹配出错:', e);
        }
    }

    /**
     * 监听 DOM 变化，处理后续动态加载的广告
     */
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });
            if (shouldCheck) {
                hideFloatingAndExternalAds();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载后执行
    setTimeout(() => {
        hideFloatingAndExternalAds();
        observeDOMChanges(); // 监听后续动态广告
    }, 1000);
})();