// ==UserScript==
// @name         方便知乎专栏的打印/Facilitate the PDF printing for the zhihu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用该脚本可以完整的打印知乎专栏的内容。
// @author       Huoleeeeee
// @match        *://zhuanlan.zhihu.com/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/438249/%E6%96%B9%E4%BE%BF%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E7%9A%84%E6%89%93%E5%8D%B0Facilitate%20the%20PDF%20printing%20for%20the%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/438249/%E6%96%B9%E4%BE%BF%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E7%9A%84%E6%89%93%E5%8D%B0Facilitate%20the%20PDF%20printing%20for%20the%20zhihu.meta.js
// ==/UserScript==

(function() {
     'use strict';
       var fa=$("body");
        var btn=$("<li></li>");
        var h = $(document).height()-$(window).height();
        var json={
            "background":"#31e16d",
            "height":"16px",
            "padding":"5px",
            "cursor": "pointer",
            "top":"300px",
            "right":"80px",
            "position": "fixed"
        };
        btn.css(json);
        //添加按钮
        btn.html("<span id='lfsenior'>打印成pdf</span>");
        fa.append(btn);
        var bodywidth=$("#body").css("width");
        var mainwidth=$("#main").css("width");
        btn.click(function () {
            //滑动到底部加载所有图片
            //网速不够的话可以调大该时间
             $("html,body").animate({
                 scrollTop: h
             }, 500);
            btn.hide();
            //滑动完之后再打印
            setTimeout(function () {
             $(".ContentItem-actions").remove();
             $(".ColumnPageHeader-Wrapper").remove();
             $(".PostIndex-Contributions").remove()
             $(".Recommendations-Main").remove()
             $(".Comments-container").remove()
             window.print();
            $(document).scrollTop(0);
            location.reload();
            //网速不够的话可以调大该时间
            }, 600);
            });
    })();