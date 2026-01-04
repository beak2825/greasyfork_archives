// ==UserScript==
// @name         Terraria wiki 自动简体中文
// @namespace    http://hplzh.cn/
// @version      1.1
// @description  将 Terraria wiki 的简繁转换选项自动设置为简体中文
// @author       hplzh
// @match        https://terraria.wiki.gg/zh/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/503176/Terraria%20wiki%20%E8%87%AA%E5%8A%A8%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/503176/Terraria%20wiki%20%E8%87%AA%E5%8A%A8%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

// @ts-check

(function() {
    'use strict';

    let variant = /** @type {HTMLSpanElement | null} */ (document.querySelector("#p-variants-label > span"))?.innerText;
    if(variant && variant.endsWith("简体")) {}
    else {
        let search = new URLSearchParams(location.search);
        if(!search.has("variant")) {
            search.append("variant", "zh-cn");
            location.search = search.toString();
        }
    }
})();
