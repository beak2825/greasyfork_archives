// ==UserScript==
// @name         百度文库去复制限制
// @namespace    https://github.com/hzmming
// @version      0.1
// @description  try to take over the world!
// @author       LoryHuang
// @match        https://wenku.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382141/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8E%BB%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/382141/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%8E%BB%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 原文档节点
    var docElem = document.getElementsByClassName('bd doc-reader')[0];
    var copyElem = docElem.cloneNode(true);//true表示深度克隆
    copyElem.oncopy = ''; //还原copy功能
    // 替换原文档节点
    docElem.replaceWith(copyElem)
})();