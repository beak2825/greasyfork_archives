// ==UserScript==
// @name         批改网-粘贴限制解除⚠️
// @namespace    https://greasyfork.org/zh-CN/scripts/536849
// @version      1.0
// @description  解除批改网（pigai.org）作文编辑界面的的粘贴、右键和选择限制
// @author       CR.Zhu
// @match        http*://*.pigai.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536849/%E6%89%B9%E6%94%B9%E7%BD%91-%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E2%9A%A0%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/536849/%E6%89%B9%E6%94%B9%E7%BD%91-%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E2%9A%A0%EF%B8%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.addEventListener('load', function() {
        disablePasteRestrictions();
        const observer = new MutationObserver(function(mutations) {
            disablePasteRestrictions();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    function disablePasteRestrictions() {
        try {
            $('.no_paste, .no_paste *').off();
            $('#contents').off();
            document.onpaste = null;
        } catch (e) {}
    }
})();