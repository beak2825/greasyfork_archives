// ==UserScript==
// @name         白鷺跨域助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  实现跨域请求
// @author       ManneHoshisora
// @match        http://localhost:5173/*
// @match        https://afurete233.github.io/Ayaka_TeaRoom/*
// @run-at       document-start
// @license      MIT
// @connect      ageapi.omwjhz.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest           
// @downloadURL https://update.greasyfork.org/scripts/505484/%E7%99%BD%E9%B7%BA%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/505484/%E7%99%BD%E9%B7%BA%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function request(prop) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            responseType: "json",
            ...prop,
            headers: {
                // Authorization: "Bearer " + getToken(),
                accept: "application/json",
                ...prop.headers,
            },
            onload: async (e) => {
                // if (e.response.access_token) setToken(e.response.access_token);
                // if (e.response.refresh_token) setRefreshToken(e.response.refresh_token);
                // if (e.status === 401 && prop.__isRefreshToken !== true) {
                //     const isSuccess = await refreshToken();
                //     if (isSuccess) {
                //         if (prop.__isAccessToken !== true) {
                //             const res = await request(prop);
                //             resolve(res);
                //         } else {
                //             resolve(true);
                //         }
                //     } else {
                //         location.href = getLoginHref();
                //     }
                // }
                resolve(e);
            },
            onerror: reject,
            onabort: reject,
            ontimeout: reject,
            timeout: 5000,
        });
    });
}

async function apiGet(url) {
    return request({
        method: "GET",
        url: url,
        // data: JSON.stringify({ query: data }),
    });
}

unsafeWindow.queryData = (url) => {
    return apiGet(url);
};


unsafeWindow.version = "1.0.0";

(async () => {
    const i = setInterval(() => {
        if (typeof unsafeWindow.run !== "undefined") {
            clearInterval(i);
            unsafeWindow.run.forEach((e) => e());
        }
    });
})();