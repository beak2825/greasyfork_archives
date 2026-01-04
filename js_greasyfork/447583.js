// ==UserScript==
// @name         老烤鸭限制修改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除老烤鸭复制限制 修改选中样式
// @author       Jerry Wang
// @match        http://www.laokaoya.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447583/%E8%80%81%E7%83%A4%E9%B8%AD%E9%99%90%E5%88%B6%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/447583/%E8%80%81%E7%83%A4%E9%B8%AD%E9%99%90%E5%88%B6%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var userSelectCss = 'user-select: text !important;-webkit-user-select: text !important;-webkit-touch-callout: text !important;';
    var handler = function (event) {
        event.stopPropagation();
        if (event.stopImmediatePropagation) { event.stopImmediatePropagation(); }
        event.returnValue = true;
    };
    document.styleSheets[0].insertRule("body ::selection { background: rgba(246,203,144,0.5) !important;  color: black !important;}");
    var labels = ['html', 'body', 'div', 'p', 'b', 'strong', 'small', 'span', 'pre', 'a', 'form', 'iframe', 'ul', 'li', 'dl', 'dt', 'dd', 'table', 'tr', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    var style;
    for (i in labels) {
        var divs = document.getElementsByTagName(labels[i]);
        var len = divs.length;
        for (var i = 0; i < len; ++i) {
            var obj = divs[i];
            //CSS
            if (obj) {
                style = obj.currentStyle ? obj.currentStyle : window.getComputedStyle(obj, null);
                if (style.userSelect == "none") {
                    obj.setAttribute('style', userSelectCss);
                }
            }
            //JS
            var actions = ['select', 'selectstart', 'selectend', 'copy', 'cut', 'paste', 'keydown', 'keyup', 'keypress', 'contextmenu', 'dragstart'];
            for (var j in actions) {
                obj.addEventListener(actions[j], handler);

            }
        }
    }
})();