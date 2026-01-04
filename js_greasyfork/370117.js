// ==UserScript==
// @name         Bilibili 专栏去除选中复制限制
// @namespace    https://github.com/stormyyd/
// @version      0.0.4
// @description  去除 Bilibili 专栏中的选中及复制限制
// @author       stormyyd
// @match        *://www.bilibili.com/read/*
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @license      Do What The F*ck You Want To Public License
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/370117/Bilibili%20%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/370117/Bilibili%20%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function allowSelection(jNode) {
        jNode.css('user-select', 'auto');
        jNode.on("copy", function() {
            GM_setClipboard(window.getSelection().toString());
        });
    }

    waitForKeyElements(".article-holder", allowSelection);
})();
