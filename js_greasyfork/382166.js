// ==UserScript==
// @name         美化推酷字体
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  推酷的辣眼字体实在顶不住了
// @author       huangqincan
// @match        https://www.tuicool.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382166/%E7%BE%8E%E5%8C%96%E6%8E%A8%E9%85%B7%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/382166/%E7%BE%8E%E5%8C%96%E6%8E%A8%E9%85%B7%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('*{font-family : "Microsoft YaHei"}');
})();