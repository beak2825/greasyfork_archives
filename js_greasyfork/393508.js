// ==UserScript==
// @name         独播库外链豆瓣搜索
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  独播库
// @author       LiangZ
// @match        https://www.duboku.net/*
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393508/%E7%8B%AC%E6%92%AD%E5%BA%93%E5%A4%96%E9%93%BE%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/393508/%E7%8B%AC%E6%92%AD%E5%BA%93%E5%A4%96%E9%93%BE%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    // Your code here...
    $(".myui-vodlist__detail h4").each(function(){
        var subject = $(this).find("a").html();
        $(this).after("<a href='https://search.douban.com/movie/subject_search?search_text=" + subject + "' target='_blank'><img src='http://stdl.qq.com/stdl/newtabcms/icon/0026_100.png' crossorigin='Anonymous' width='25' height='25'></a>");
    });
})();