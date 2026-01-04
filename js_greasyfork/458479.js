// ==UserScript==
// @name         simple daily zhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简化知乎日报页面
// @author       snape-max
// @match        https://daily.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458479/simple%20daily%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/458479/simple%20daily%20zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if($("div.header.navbar-fixed-top").length>0)
    {
        $("div.header.navbar-fixed-top").remove();
    }
    if($("div.download").length>0)
    {
        $("div.download").remove();
    }
    if($("div.footer").length>0)
    {
        $("div.footer").remove();
    }
    if($("a.read-more").length>0)
    {
        $("a.read-more").remove();
    }
    if($("div.Daily").length>0)
    {
        $("div.Daily").remove();
    }
    if($("a.view-more").length>0)
    {
        $("a.view-more").remove();
    }
    
})();