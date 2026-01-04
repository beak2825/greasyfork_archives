// ==UserScript==
// @name         移除CSDN关注才能阅读文章
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  本插件用于移除CSDN关注博主才可阅读博文的限制
// @license      MIT
// @author       xdr630
// @match        https://greasyfork.org/zh-CN/scripts?q=CSDN%E5%B0%B1%E4%B8%8D%E5%85%B3%E6%B3%A8
// @match        https://*.blog.csdn.net/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469975/%E7%A7%BB%E9%99%A4CSDN%E5%85%B3%E6%B3%A8%E6%89%8D%E8%83%BD%E9%98%85%E8%AF%BB%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/469975/%E7%A7%BB%E9%99%A4CSDN%E5%85%B3%E6%B3%A8%E6%89%8D%E8%83%BD%E9%98%85%E8%AF%BB%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('#article_content').removeAttr("style");
        $('.hide-article-box').remove();
    });

})();