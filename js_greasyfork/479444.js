// ==UserScript==
// @name         kook降噪无限试用
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  实现无buff会员无限制使用AI降噪2.0
// @author       Hell
// @match        https://www.kookapp.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kookapp.cn
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479444/kook%E9%99%8D%E5%99%AA%E6%97%A0%E9%99%90%E8%AF%95%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479444/kook%E9%99%8D%E5%99%AA%E6%97%A0%E9%99%90%E8%AF%95%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const urls = ["https://www.kookapp.cn/api/v3/user/rights-remaining","https://www.kookapp.cn/api/v3/user/rights-start"]
    const sJson = Response.prototype.json;
    Response.prototype.json = function () {
        let result = sJson.call(this);
        if (!urls.includes(this.url)) {
            return result;
        }
        return new Promise((resolve, reject) => {
            result
                .then((resolve2) => {
                resolve2.data.is_vip = true;
                resolve2.data.remaining = 10086;
                resolve(resolve2);
            })
                .catch((reject2) => {reject(reject2)})
        })
    }
})();