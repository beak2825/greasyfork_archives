// ==UserScript==
// @name         CSDN移除多复制出来的页脚
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  CSDN移除复制自动添加的信息
// @author       felix
// @match        https://blog.csdn.net/*
// @downloadURL https://update.greasyfork.org/scripts/428394/CSDN%E7%A7%BB%E9%99%A4%E5%A4%9A%E5%A4%8D%E5%88%B6%E5%87%BA%E6%9D%A5%E7%9A%84%E9%A1%B5%E8%84%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/428394/CSDN%E7%A7%BB%E9%99%A4%E5%A4%9A%E5%A4%8D%E5%88%B6%E5%87%BA%E6%9D%A5%E7%9A%84%E9%A1%B5%E8%84%9A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener("copy", function (e) {
        e.preventDefault();
        var copyTxt = `${window.getSelection(0).toString()}`;
        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', copyTxt);
        } else if (window.clipboardData) {
            return window.clipboardData.setData("text", copyTxt);
        }
    })
})();