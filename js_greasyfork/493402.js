// ==UserScript==
// @name         HTTP重定向至HTTPS
// @name:en      Redirect HTTP to HTTPS
// @namespace    https://greasyfork.org/zh-CN/users/1257285-dreamprostudio
// @version      2.0
// @description  自动将HTTP重定向为HTTPS
// @description:en Automatically redirect HTTP to HTTPS
// @author       DreamProStudio
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      GPL-3.0-or-later
// @homepageURL  http://www.coolapk.com/u/28432077
// @supportURL   https://greasyfork.org/zh-CN/users/1257285-dreamprostudio
// @icon         https://pic.imgdb.cn/item/668adf52d9c307b7e9cb7122.png
// @downloadURL https://update.greasyfork.org/scripts/495629/HTTP%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/495629/HTTP%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3HTTPS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 常量定义
    const CACHE_NAME = 'httpsSupportCache';
    const DISABLED_DOMAINS = 'disabledHttpsRedirectDomains';
    const HTTP_PROTOCOL = 'http:';
    const HTTPS_PROTOCOL = 'https:';
    const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7天的缓存过期时间

    // 变量初始化
    let cache = JSON.parse(localStorage.getItem(CACHE_NAME)) || {}; // 从本地存储中获取缓存数据
    let disabledDomains = JSON.parse(localStorage.getItem(DISABLED_DOMAINS)) || {}; // 从本地存储中获取禁用域名列表

    // 语言文本定义
    const lang = navigator.language || navigator.userLanguage;
    const isChinese = lang.startsWith('zh');
    const TEXTS = {
        clearCache: isChinese ? '清除HTTPS缓存' : 'Clear HTTPS Cache',
        disableRedirect: isChinese ? '禁用当前域名重定向' : 'Disable Redirect for Current Domain',
        enableRedirect: isChinese ? '启用当前域名重定向' : 'Enable Redirect for Current Domain',
        cacheCleared: isChinese ? '缓存已清除' : 'Cache has been cleared',
        redirectDisabled: isChinese ? '重定向已禁用' : 'Redirect has been disabled',
        redirectEnabled: isChinese ? '重定向已启用' : 'Redirect has been enabled'
    };

    /**
     * 更新缓存
     * @param {string} host - 主机名
     * @param {boolean} supportsHttps - 是否支持HTTPS
     */
    function updateCache(host, supportsHttps) {
        cache[host] = { supportsHttps, timestamp: Date.now() };
        localStorage.setItem(CACHE_NAME, JSON.stringify(cache));
    }

    /**
     * 检查主机是否支持HTTPS
     * @param {string} host - 主机名
     * @returns {Promise<boolean>} - 支持HTTPS返回true，不支持返回false
     */
    function checkHttpsSupport(host) {
        return fetch(`${HTTPS_PROTOCOL}//${host}`, { method: 'HEAD' })
            .then(response => response.ok)
            .catch(() => false);
    }

    /**
     * 检查缓存是否过期
     * @param {string} host - 主机名
     * @returns {boolean} - 过期返回true，否则返回false
     */
    function isCacheExpired(host) {
        if (!cache[host]) return true;
        return (Date.now() - cache[host].timestamp) > CACHE_EXPIRY;
    }

    /**
     * 将HTTP重定向至HTTPS
     */
    function redirectHttpToHttps() {
        const host = window.location.hostname;

        if (disabledDomains[host]) return;

        if (window.location.protocol === HTTP_PROTOCOL) {
            if (cache[host] && !isCacheExpired(host)) {
                if (cache[host].supportsHttps) {
                    window.location.replace(`${HTTPS_PROTOCOL}:${window.location.href.substring(5)}`);
                }
                return;
            }

            const httpsURL = `${HTTPS_PROTOCOL}:${window.location.href.substring(5)}`;

            checkHttpsSupport(host).then(supportsHttps => {
                updateCache(host, supportsHttps);
                if (supportsHttps) {
                    window.location.replace(httpsURL);
                }
            });
        }
    }

    /**
     * 清除过期缓存
     */
    function clearExpiredCache() {
        const now = Date.now();
        for (const host in cache) {
            if ((now - cache[host].timestamp) > CACHE_EXPIRY) {
                delete cache[host];
            }
        }
        localStorage.setItem(CACHE_NAME, JSON.stringify(cache));
    }

    /**
     * 更新用户脚本菜单命令
     */
    function updateMenuCommands() {
        GM_registerMenuCommand(TEXTS.clearCache, () => {
            clearExpiredCache(); // 只清除过期的缓存
            alert(TEXTS.cacheCleared);
        });

        const host = window.location.hostname;
        const isDisabled = disabledDomains[host];

        GM_registerMenuCommand(isDisabled ? TEXTS.enableRedirect : TEXTS.disableRedirect, () => {
            if (isDisabled) {
                delete disabledDomains[host];
            } else {
                disabledDomains[host] = true;
            }
            localStorage.setItem(DISABLED_DOMAINS, JSON.stringify(disabledDomains));
            alert(isDisabled ? TEXTS.redirectEnabled : TEXTS.redirectDisabled);
            location.reload();
        });
    }

    // 清除过期缓存
    clearExpiredCache();

    // 执行HTTP到HTTPS的重定向逻辑
    redirectHttpToHttps();

    // 注册和更新用户脚本菜单命令
    updateMenuCommands();

})();