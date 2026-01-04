// ==UserScript==
// @name         （更丝滑的）洛谷个人主页可见化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  1
// @author       Lawsonwang
// @match        https://www.luogu.com.cn/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504060/%EF%BC%88%E6%9B%B4%E4%B8%9D%E6%BB%91%E7%9A%84%EF%BC%89%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E5%8F%AF%E8%A7%81%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/504060/%EF%BC%88%E6%9B%B4%E4%B8%9D%E6%BB%91%E7%9A%84%EF%BC%89%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E5%8F%AF%E8%A7%81%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let rt = document.querySelector("#app");
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                let sb = document.querySelector(".introduction");
                if (sb.style === null || sb.style.display == "block") return;
                sb.style.display = "block";
            }
        });
    });

    const config = { subtree: true, childList: true };
    observer.observe(rt, config);
})();