// ==UserScript==
// @name         sso password logon
// @namespace    http://tampermonkey.net/
// @version      0.0.4-beta
// @description  SSO-online显示密码登录
// @author       junliang.li
// @match        http://rt-unity-portal.idc1.fn/*
// @match        https://*.ztna-dingtalk.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/493551/sso%20password%20logon.user.js
// @updateURL https://update.greasyfork.org/scripts/493551/sso%20password%20logon.meta.js
// ==/UserScript==

(function () {
    "use strict";
    //参考https://zhuanlan.zhihu.com/p/557532887
    const originFetch = fetch;
    window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            if (!url.includes("/openapi/getLoginDisposition")) {
                return response;
            }
            const responseClone = response.clone();
            let res = await responseClone.json();
            if (res?.data?.loginDispositionList) {
                if (!res.data.loginDispositionList.includes("1")) {
                    res.data.loginDispositionList.push("1");
                }
                if (!res.data.loginDispositionList.includes("2")) {
                    res.data.loginDispositionList.push("2");
                }
            }
            const responseNew = new Response(JSON.stringify(res), response);
            return responseNew;
        });
    };
})();