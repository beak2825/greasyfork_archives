// ==UserScript==
// @name         简化 CSDN
// @namespace    http://js.zombie110year.top/
// @version      1.0
// @description  简化 CSDN 博客页面
// @license      GPL v3
// @author       zombie110year@outlook.com
// @match        *://blog.csdn.net/*/article/details/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/386996/%E7%AE%80%E5%8C%96%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/386996/%E7%AE%80%E5%8C%96%20CSDN.meta.js
// ==/UserScript==

/**
 * MathJax 可正常运行
 */
(function () {
    'use strict';
    //自动展开
    document.querySelector(".btn-readmore").click();
    //去除剪贴板劫持
    csdn.copyright.init("", "", "");
    // 获取博文主体
    let _main = document.querySelector("#mainBox > main");
    document.body = document.createElement("body");
    document.body.append(_main);

    // 重设 样式
    _main.style = "margin: 0px auto 40px auto !important; width: auto !important;";
})();
