// ==UserScript==
// @name         自动删除无忧启动论坛搜索时链接中的highlight
// @namespace    https://greasyfork.org/zh-CN/users/141921
// @version      0.0.1
// @description  自动删除无忧启动论坛搜索时链接中的highlight,防止网页卡住
// @author       Vinx
// @match
// @grant        none
// @require      http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @include      http://bbs.wuyou.net/search.php?*
// @downloadURL https://update.greasyfork.org/scripts/38958/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%97%A0%E5%BF%A7%E5%90%AF%E5%8A%A8%E8%AE%BA%E5%9D%9B%E6%90%9C%E7%B4%A2%E6%97%B6%E9%93%BE%E6%8E%A5%E4%B8%AD%E7%9A%84highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/38958/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%97%A0%E5%BF%A7%E5%90%AF%E5%8A%A8%E8%AE%BA%E5%9D%9B%E6%90%9C%E7%B4%A2%E6%97%B6%E9%93%BE%E6%8E%A5%E4%B8%AD%E7%9A%84highlight.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var link = $(".pbw .xs3 a");
    var a=link.find("a");
    for(var i=0;i<link.length; i++)
    {
        var href = $(link[i]).attr("href");
        var newhref = href.replace(/(&)?highlight=(\S*)(&)?/,"");
        $(link[i]).attr("href",newhref);
    }
    // Your code here...
})();