// ==UserScript==
// @name         妖火免币下载
// @namespace    https://yaohuo.me/
// @version      3.9.0
// @description  免币下载附件
// @author       鱼知秋
// @match        *://yaohuo.me/*
// @match        *://*.yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474238/%E5%A6%96%E7%81%AB%E5%85%8D%E5%B8%81%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/474238/%E5%A6%96%E7%81%AB%E5%85%8D%E5%B8%81%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (/^\/bbs-.*\.html$/.test(window.location.pathname)) {
        let aurl = document.getElementsByClassName("urlbtn");
        if (aurl.length > 0) {
            for (let i = 0; i < aurl.length; i++) {
                let url = aurl[i].getAttribute("href");
                let reg = /(&)*classid=(\d*)&book_id=(\d*)/g;
                url = url.replace(reg, "");
                aurl[i].setAttribute("href", `${url}`);
            }
        }
    }
})();
