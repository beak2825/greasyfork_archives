// ==UserScript==
// @name         e-cology免登录
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  保存e-cology登录后的Cookies，并用于后续绕过人脸验证登录
// @author       Douglas Lee
// @match        https://www.e-cology.com.cn/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505839/e-cology%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/505839/e-cology%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loginPageUrl = "https://www.e-cology.com.cn/login";
    const portalViewUrlPattern = "https://www.e-cology.com.cn/portal/view/";
    const logoutApiUrl = "https://www.e-cology.com.cn/papi/basiconline/offline/exitConn";

    if (window.location.href.startsWith(loginPageUrl)) {
        const savedCookies = JSON.parse(localStorage.getItem('savedCookies') || '[]');
        if (savedCookies.length > 0) {
            savedCookies.forEach(cookie => setCookie(cookie));

            // 检查设置的 cookie 是否包含 ETEAMSID
            if (document.cookie.includes('ETEAMSID')) {
                window.location.href = "https://www.e-cology.com.cn/";
            }
        }

    } else if (window.location.href.startsWith(portalViewUrlPattern)) {
        const currentCookies = document.cookie.split("; ").map(cookieStr => {
            const [name, value] = cookieStr.split("=");
            return {
                name,
                value,
                domain: ".e-cology.com.cn",
                path: "/",
                secure: false,
                httpOnly: false,
                sameSite: "unspecified",
                session: true
            };
        });
        localStorage.setItem('savedCookies', JSON.stringify(currentCookies));
    }

    (function() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            if (args[0] && typeof args[0] === 'string' && args[0] === logoutApiUrl) {
                localStorage.removeItem('savedCookies');
            }
            return originalFetch.apply(this, args);
        };

        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            if (method.toUpperCase() === 'POST' && url === logoutApiUrl) {
                localStorage.removeItem('savedCookies');
            }
            return originalXHROpen.apply(this, [method, url, ...rest]);
        };
    })();

    function setCookie(cookie) {
        let cookieString = `${cookie.name}=${cookie.value}; domain=${cookie.domain}; path=${cookie.path};`;
        if (cookie.secure) cookieString += ' Secure;';
        if (cookie.httpOnly) cookieString += ' HttpOnly;';
        if (cookie.sameSite !== "unspecified") cookieString += ` SameSite=${cookie.sameSite};`;
        if (!cookie.session && cookie.expirationDate) {
            const date = new Date(cookie.expirationDate * 1000);
            cookieString += ` Expires=${date.toUTCString()};`;
        }
        document.cookie = cookieString;
    }
})();
