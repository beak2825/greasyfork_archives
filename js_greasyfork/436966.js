// ==UserScript==
// @name         SauceNAO 默认勾选自动搜图，新标签页打开结果
// @description  修改自作者DanoR
// @version      1.0.1
// @author       無限の未知
// @namespace    none
// @grant        none
// @include      *://saucenao.com/*
// @downloadURL https://update.greasyfork.org/scripts/436966/SauceNAO%20%E9%BB%98%E8%AE%A4%E5%8B%BE%E9%80%89%E8%87%AA%E5%8A%A8%E6%90%9C%E5%9B%BE%EF%BC%8C%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/436966/SauceNAO%20%E9%BB%98%E8%AE%A4%E5%8B%BE%E9%80%89%E8%87%AA%E5%8A%A8%E6%90%9C%E5%9B%BE%EF%BC%8C%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {

    var cb = document.getElementById("auto-cb");

    if (cb) cb.checked = true;

    var qsa = function(selector) {
        var result = [], arr = document.querySelectorAll(selector), i;

        for(i = 0; i < arr.length; i++) {
            result.push(arr[i]);
        }

        return result;
    };


    var as = qsa('div.resultcontentcolumn>a, div.resultmiscinfo>a'), i, a;


    for(i in as) {
        a = as[i];

        a.target = '_blank';

    }

})();