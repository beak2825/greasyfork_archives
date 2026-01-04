// ==UserScript==
// @name         屏蔽百度搜索的CSDN结果
// @version      1.0
// @description  在百度搜索结果中屏蔽CSDN的内容
// @author       大萌主
// @match        https://m.baidu.com/*
// @match        https://www.baidu.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/469055/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9A%84CSDN%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/469055/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9A%84CSDN%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.innerHTML = `DIV.c-result.result[data-log*='.csdn.net/'],DIV.c-container[mu*='.csdn.net/'] {display: none !important;}`;
    document.head.appendChild(style);
})();
