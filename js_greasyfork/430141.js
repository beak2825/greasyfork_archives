// ==UserScript==
// @name         网游小说网
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  网游小说网阅读小说（支持←→翻页，支持下一章预加载，去广告）
// @author       reamd7
// @match        *://www.wangyouxiaoshuo.com/*
// @icon         https://www.google.com/s2/favicons?domain=wangyouxiaoshuo.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430141/%E7%BD%91%E6%B8%B8%E5%B0%8F%E8%AF%B4%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/430141/%E7%BD%91%E6%B8%B8%E5%B0%8F%E8%AF%B4%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(window, "ty", {
        value: function () {},
        configurable: false,
        enumerable: true
    })
    Object.defineProperty(window, "tj", {
        value: function () {},
        configurable: false,
        enumerable: true
    })
    document.addEventListener("DOMContentLoaded", function(e) {
        var preloadLink = document.createElement("link");
        preloadLink.href = document.querySelector('body > div > div > div > div > div.m-page > a.btn.btn-danger.pull-right.col-md-2.col-xs-3.col-sm-3').href;
        preloadLink.rel = "prefetch";
        preloadLink.as = "document";
        document.head.appendChild(preloadLink);
document.body.addEventListener("keyup", function(e) {
            if (e.code === "ArrowRight") {
                document.querySelector('body > div > div > div > div > div.m-page > a.btn.btn-danger.pull-right.col-md-2.col-xs-3.col-sm-3').click()
            } else if (e.code === "ArrowLeft") {
                document.querySelector("body > div > div > div > div > div.m-page > a.btn.btn-danger.pull-left.col-md-2.col-xs-3.col-sm-3").click()
            }
        })
    })

})();