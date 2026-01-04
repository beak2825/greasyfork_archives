// ==UserScript==
// @name         文章最大宽度查看
// @namespace    javy_liu
// @version      0.2
// @description  对于有些网页，特别是教程类页面，希望最大化网页内容查看
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js

// @author       javy_liu
// @match        https://juejin.im/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/403783/%E6%96%87%E7%AB%A0%E6%9C%80%E5%A4%A7%E5%AE%BD%E5%BA%A6%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403783/%E6%96%87%E7%AB%A0%E6%9C%80%E5%A4%A7%E5%AE%BD%E5%BA%A6%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        $(".main-container,.entry-public-main").css('max-width', '100%');
        $(".main-area").width('100%');

        //头部添加清除下载记录按钮
        $("body").prepend(`<button id='toggle_nav' style="position:absolute;left:0px;top:0;z-index:1000;background-color: green;padding:10px;color:white;opacity: 0.7;">Toggle Sidebar Nav</button>`);
        $("#toggle_nav").on("click", function(){
            if($(this).data("visible") == 1){
                $(".sidebar,.entry-public-aside").css("display", "block");
                $(this).data("visible",0);
            }else{
                $(".sidebar,.entry-public-aside").css("display", "none");
                $(this).data("visible",1);
            };

        });

    }, 100);

})();