// ==UserScript==
// @name        Close Zhihu LoginDialog
// @namespace   undefined
// @description 自动关闭登陆弹框
// @include     *://www.zhihu.com/*
// @version     0.02
// @connect-src       www.zhihu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438863/Close%20Zhihu%20LoginDialog.user.js
// @updateURL https://update.greasyfork.org/scripts/438863/Close%20Zhihu%20LoginDialog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
    setTimeout(function() {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        document.getElementsByClassName("Modal-closeButton")[0].dispatchEvent(e);
    },2000)
})();