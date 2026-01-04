// ==UserScript==
// @name         MioBt去广告
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  MioBT去除页面广告
// @author       montaro2014
// @license      MIT
// @match        http://www.miobt.com/*
// @match        https://www.miobt.com/*
// @icon         https://www.google.com/s2/favicons?domain=miobt.com
// @grant        GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/481240/MioBt%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/481240/MioBt%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function () {

    var selectors = [
        ".gg_canvas",
        ".c1 .box:nth-child(2)",
        ".c1 .box:nth-child(2)",
        ".c1 .box:nth-child(2)",
        ".c1 .box:nth-child(2)"
    ];
    removeAd();

    function removeAd() {
        selectors.forEach(selector => {
            GM_addStyle(`${selector} {display: none!important;}`);
            removeBySelector(selector);
        })
    }
    var observer = new MutationObserver(function (e) {
        removeAd();
    });
    var observerConfig = {
        childList: true,
        subtree: true
    }

    var querySelectorAll = document.querySelectorAll;

    function removeBySelector(selector) {
        if (!querySelectorAll) return;
        var doms = querySelectorAll.call(document, selector);
        if (doms.length > 0) {
            for (var dom of doms) {
                dom && dom.remove();
            }
        }
    }
    window.addEventListener("DOMContentLoaded", function () {
        observer.observe(document.body, observerConfig);
        removeAd();
    })
    window.addEventListener("scroll", function () {
        removeAd();
    })
})();
