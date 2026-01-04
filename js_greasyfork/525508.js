// ==UserScript==
// @name         红石中继站去中间页
// @version      0.2
// @description  智能单跳转策略+页面元素处理
// @author       28074
// @match        *://www.mczwlt.net/*
// @grant        GM_openInTab
// @grant        window.close
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://www.mczwlt.net/favicon.ico
// @license MIT
// @namespace https://greasyfork.org/users/1429810
// @downloadURL https://update.greasyfork.org/scripts/525508/%E7%BA%A2%E7%9F%B3%E4%B8%AD%E7%BB%A7%E7%AB%99%E5%8E%BB%E4%B8%AD%E9%97%B4%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/525508/%E7%BA%A2%E7%9F%B3%E4%B8%AD%E7%BB%A7%E7%AB%99%E5%8E%BB%E4%B8%AD%E9%97%B4%E9%A1%B5.meta.js
// ==/UserScript==



(function() {
    'use strict';
    const unsafeWindow = window.wrappedJSObject || window;

    const decodeUrl = (encoded) => {
        try {
            let decoded = encoded;
            for(let i = 0; i < 3; i++) {
                if (/%[0-9A-Fa-f]{2}/.test(decoded)) {
                    decoded = decodeURIComponent(decoded);
                } else break;
            }
            return new URL(decoded).href;
        } catch(e) {
            console.error('URL解码失败:', e);
            return null;
        }
    };

    const handleInstantRedirect = () => {
        if (!location.pathname.includes('/go-external')) return;

        const urlParam = new URLSearchParams(location.search).get('url');
        if (!urlParam) return;

        const targetUrl = decodeUrl(urlParam);
        if (!targetUrl) return;

        window.stop();
        document.documentElement.innerHTML = '';

        GM_openInTab(targetUrl, { active: true });

        setTimeout(() => {
            window.close();
        });
    };

    const handlePageElements = () => {
        const replaceLinks = () => {
            document.querySelectorAll('a[href*="/go-external"]').forEach(link => {
                const match = link.href.match(/url=([^&]+)/);
                if (!match) return;

                const realUrl = decodeUrl(match[1]);
                if (!realUrl) return;

                const newLink = link.cloneNode(true);
                newLink.href = realUrl;

                const cleanLink = newLink.cloneNode(true);
                cleanLink.onclick = e => {
                    e.preventDefault();
                    GM_openInTab(realUrl, { active: true });
                };

                link.replaceWith(cleanLink);
            });
        };

        replaceLinks();

        new MutationObserver(replaceLinks).observe(document.body, {
            childList: true,
            subtree: true
        });

        if (unsafeWindow.$router?.push) {
            const originalPush = unsafeWindow.$router.push;
            unsafeWindow.$router.push = function(location) {
                if (location.path === '/external-link-warn' && location.query?.url) {
                    const realUrl = decodeUrl(location.query.url);
                    return realUrl ? GM_openInTab(realUrl) : originalPush(...arguments);
                }
                return originalPush(...arguments);
            };
        }
    };

    if (location.pathname.includes('/go-external')) {
        handleInstantRedirect();
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handlePageElements);
        } else {
            handlePageElements();
        }
    }
})();