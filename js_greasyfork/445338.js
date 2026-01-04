// ==UserScript==
// @name         Aerfaying / Gitblock Domain Redirect
// @namespace    https://github.com/Tim-Fang
// @version      0.1
// @description  Aerfaying / Gitblock 域名互转脚本
// @author       TimFang4162
// @match        *://*.aerfaying.com/*
// @match        *://*.gitblock.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license      copyright
// @downloadURL https://update.greasyfork.org/scripts/445338/Aerfaying%20%20Gitblock%20Domain%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/445338/Aerfaying%20%20Gitblock%20Domain%20Redirect.meta.js
// ==/UserScript==
(function () {
    var url = window.location.href;
    if (GM_getValue("DAT_domain", null) == null) {
        if (url.search("gitblock.cn") != -1) {
            GM_setValue("DAT_domain", "gitblock");
        }
        if (url.search("aerfaying.com") != -1) {
            GM_setValue("DAT_domain", "aerfaying");
        }
    }
    if (GM_getValue("DAT_domain") == "aerfaying") {
        if (url.search("gitblock.cn") != -1) {
            window.location.assign(window.location.href.replace("gitblock.cn", "aerfaying.com"));
        }
    }
    if (GM_getValue("DAT_domain") == "gitblock") {
        if (url.search("aerfaying.com") != -1) {
            window.location.assign(window.location.href.replace("aerfaying.com", "gitblock.cn"));
        }
    }
})();