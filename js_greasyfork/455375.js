// ==UserScript==
// @name         【Major】CSDN免登录免关注阅读复制
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @license      no
// @description  CSDN可直接复制代码，无需登录，无需关注才能阅读
// @author       major
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @icon         https://csdnimg.cn/public/favicon.ico
// @grant        none
// @run-at       document-end

// @note         去除关注才能继续阅读
// @downloadURL https://update.greasyfork.org/scripts/455375/%E3%80%90Major%E3%80%91CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/455375/%E3%80%90Major%E3%80%91CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //去除剪贴板劫持
    csdn.copyright.init("", "", "");
    // 免登陆复制
    $('#content_views pre,#content_views pre code').css('user-select','auto');

    // 去除关注才能继续阅读（PC模式下实测有效）
    $("#article_content").removeAttr("style");
    $(".hide-article-box").remove();
})();