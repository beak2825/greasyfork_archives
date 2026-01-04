// ==UserScript==
// @name         b站复用历史稿件限制30解除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可以使用任意投稿历史作为投稿模板
// @author       Yuandiaodiaodiao
// @match        *://member.bilibili.com/platform/upload/video/frame*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457996/b%E7%AB%99%E5%A4%8D%E7%94%A8%E5%8E%86%E5%8F%B2%E7%A8%BF%E4%BB%B6%E9%99%90%E5%88%B630%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/457996/b%E7%AB%99%E5%A4%8D%E7%94%A8%E5%8E%86%E5%8F%B2%E7%A8%BF%E4%BB%B6%E9%99%90%E5%88%B630%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(() => {
        const el = document.querySelector('.archive-list-container');
        if (!el) return;
        const v = el.__vue__;
        if (!v.totalArchives) return;
        if (v.hacked) return;
        v.hacked = true;
        Object.defineProperties(v,
            {
                totalPages:
                {
                    value: Math.ceil(v.totalArchives / 8),
                    writeable: false
                }
            });
        const ori = v.$api.getArchives;
        v.$api.getArchives = function (...args) {
            const oriRes = ori.apply(this, args);
            return oriRes.then((res) => {
                res.archives.slice = function () { return this };
                return res;
            })
        }
    }, 100);

})();