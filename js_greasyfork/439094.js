// ==UserScript==
// @name         CSDN启用代码复制
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make CSDN code pre selectable.
// @author       You
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://*.iteye.com/blog/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439094/CSDN%E5%90%AF%E7%94%A8%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/439094/CSDN%E5%90%AF%E7%94%A8%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    setTimeout(function () {
        $("#content_views pre").css("user-select", "text");
        $("#content_views pre code").css("user-select", "text");
    }, 100);
})();
