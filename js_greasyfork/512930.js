// ==UserScript==
// @name         115 Cookie登录 (使用document.cookie获取Cookie)
// @namespace    115_cookie_login_document_cookie
// @version      1.8
// @description  直接通过脚本中的配置设置Cookie，使用 document.cookie 获取 Cookie
// @author       BennieCHAN
// @license MIT
// @match        *://*.115.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/512930/115%20Cookie%E7%99%BB%E5%BD%95%20%28%E4%BD%BF%E7%94%A8documentcookie%E8%8E%B7%E5%8F%96Cookie%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512930/115%20Cookie%E7%99%BB%E5%BD%95%20%28%E4%BD%BF%E7%94%A8documentcookie%E8%8E%B7%E5%8F%96Cookie%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 直接在脚本中配置所需的Cookie信息
    const cookieConfig = {
        UID: 'your_UID_value_here',     // 将 'your_UID_value_here' 替换为实际的 UID 值
        CID: 'your_CID_value_here',     // 将 'your_CID_value_here' 替换为实际的 CID 值
        SEID: 'your_SEID_value_here'    // 将 'your_SEID_value_here' 替换为实际的 SEID 值
    };

    const validDuration = 30; // 默认 Cookie 有效期为 30 天

    /**
     * 使用 document.cookie 获取所有 Cookie
     */
    function getCookiesFromDocument() {
        console.log("使用 document.cookie 获取当前页面的Cookie...");
        const cookies = document.cookie.split(';');
        let cookieMap = new Map();
        cookies.forEach(cookie => {
            const [name, value] = cookie.split('=').map(c => c.trim());
            cookieMap.set(name, value);
        });
        console.log("获取到的Cookie：", cookieMap);
        return cookieMap;
    }

    /**
     * 检查 Cookie 是否已经设置
     */
    function checkCookiesExist() {
        console.log("开始检查Cookie是否存在...");
        return new Promise((resolve) => {
            const cookieMap = getCookiesFromDocument();

            let allCookiesExist = Object.keys(cookieConfig).every(key => {
                let expectedValue = cookieConfig[key];
                let currentValue = cookieMap.get(key);
                console.log(`检查Cookie [${key}]，期望值：${expectedValue}, 当前值：${currentValue}`);
                return currentValue === expectedValue;
            });

            resolve(allCookiesExist);
        });
    }

    /**
     * 直接从脚本配置中设置 Cookie
     */
    function setCookiesFromConfig() {
        console.log("开始设置Cookie...");
        Object.keys(cookieConfig).forEach(key => {
            const value = cookieConfig[key];
            console.log(`设置Cookie [${key}]，值为：${value}`);
            document.cookie = `${key}=${value}; domain=.115.com; path=/; max-age=${60 * 60 * 24 * validDuration}; secure`;
            console.log(`Cookie [${key}] 设置成功`);
        });

        // 设置完所有 Cookie 后刷新页面
        setTimeout(function () {
            console.log("设置完所有Cookie，刷新页面...");
            location.reload();
        }, 1000);
    }

    /**
     * 初始化 Cookie 设置，避免重复设置
     */
    function initCookieLogin() {
        console.log("开始初始化Cookie登录...");
        checkCookiesExist().then(cookiesExist => {
            if (!cookiesExist) {
                console.log('Cookie 不存在或不匹配，开始设置...');
                setCookiesFromConfig();
            } else {
                console.log('Cookie 已经存在且匹配，不需要重新设置');
            }
        }).catch(error => {
            console.error('检查Cookie时发生错误: ', error);
        });
    }

    // 脚本执行入口
    setTimeout(function () {
        console.log("脚本开始执行...");
        initCookieLogin();  // 检查并设置Cookie
    }, 1000);
})();
