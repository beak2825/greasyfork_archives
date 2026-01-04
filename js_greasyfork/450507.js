// ==UserScript==
// @name         fetchProxyHeaders
// @namespace    pixocial
// @version      1.1
// @description  用于拦截fetch请求，修改header
// @author       liujp
// @include      https:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixocial.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450507/fetchProxyHeaders.user.js
// @updateURL https://update.greasyfork.org/scripts/450507/fetchProxyHeaders.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("fetchProxyHeaders使用说明, 在控制台定义一次window.CUSTOME_HEADERS = {customHeader: 'hahaha'}即可")
    const customeHeadersCacheName = `${unsafeWindow.location.origin}_CUSTOME_HEADERS`;

    const globalMethods = {
        setCacheCustomHeaders: (value) => {
            let newValue = value;
            if (typeof newValue !== "string") {
                newValue = JSON.stringify(newValue);
            }
            console.log('====设置/更新自定义请求头====', newValue);
            GM_setValue(customeHeadersCacheName, newValue);
        },
        getCacheCustomHeaders: () => {
            const customeHeadersCacheString = GM_getValue(customeHeadersCacheName) || '';

            console.log('====获取请求头缓存====', customeHeadersCacheString);
            return customeHeadersCacheString ? JSON.parse(customeHeadersCacheString) : null;
        }
    }

    const originFetch = unsafeWindow.fetch;

    function getCustomHeaders() {
        let currentCustomHeaders = unsafeWindow.CUSTOME_HEADERS || window.CUSTOME_HEADERS || null;

        const cacheCustomHeaders = globalMethods.getCacheCustomHeaders();

        if (!!currentCustomHeaders) {
            if (cacheCustomHeaders !== JSON.stringify(currentCustomHeaders)) {
                globalMethods.setCacheCustomHeaders(currentCustomHeaders);
            }

            return currentCustomHeaders;
        }

        if (!!cacheCustomHeaders) return cacheCustomHeaders;

        console.error('没找到自定义的headers! 请在控制台定义: window.CUSTOME_HEADERS = {customHeader: "I am a custom header"}');

        return {};
    }
    unsafeWindow.fetch = function proxyFetch(url, options) {
        const customHeaders = getCustomHeaders() || {};
        return originFetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...customHeaders,
            }
        });
    }
    unsafeWindow.setCustomHeaders = (customHeaders) => {
        globalMethods.setCacheCustomHeaders(customHeaders);
    }
})();