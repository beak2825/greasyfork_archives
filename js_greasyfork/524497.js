// ==UserScript==
// @name         解除B站区域限制_辅助工具
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  修复使用解除B站区域限制的小问题
// @author       三年二班
// @match        *://www.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524497/%E8%A7%A3%E9%99%A4B%E7%AB%99%E5%8C%BA%E5%9F%9F%E9%99%90%E5%88%B6_%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/524497/%E8%A7%A3%E9%99%A4B%E7%AB%99%E5%8C%BA%E5%9F%9F%E9%99%90%E5%88%B6_%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href;
    let title = document.title;
    let regexTraditional = /[\u3400-\u4DBF\uF900-\uFAFF\u2E80-\u2EFF\u31C0-\u31EF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u31A0-\u31BF\u4DC0-\u4DFF\uA490-\uA4CF\uA000-\uA48F\uA4D0-\uA4FF\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF\uFF00-\uFFEF]/;

    if (url.includes("bilibili.com/bangumi/play")) {

        if (title.includes("僅限") || regexTraditional.test(title)) {
            if (!url.includes("?") && !url.includes("spm_id_from")) {
                let newUrl = url + "?spm_id_from=333.1387.0.0";
                window.location.href = newUrl;
                return;
            }
            if (url.includes("from")) {
                if (url.includes("?")) {
                    let newUrl = url.replace("?", "");
                    window.location.href = newUrl;
                }
            }
        }
    }
    window.addEventListener('load', function() {
        let url = window.location.href;
        let title = document.title;

        if (url.includes("bilibili.com/bangumi/play")) {
            if (title.includes("僅限") || regexTraditional.test(title)) {
                if (url.includes("from_spmid")) {
                    if (url.includes("?")) {
                        let newUrl = url.replace("?", "");
                        window.location.href = newUrl;
                    }
                }
            }
        }
    });

})();

