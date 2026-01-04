// ==UserScript==
// @name         正组鉴屎-豆瓣关键字检测
// @namespace    none
// @version      1.1
// @description  这走廊有股味儿
// @license      MIT
// @author       发明时光机
// @match        https://www.douban.com/group/728957/*
// @grant        unsafeWindow
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @include      @
// @downloadURL https://update.greasyfork.org/scripts/446298/%E6%AD%A3%E7%BB%84%E9%89%B4%E5%B1%8E-%E8%B1%86%E7%93%A3%E5%85%B3%E9%94%AE%E5%AD%97%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446298/%E6%AD%A3%E7%BB%84%E9%89%B4%E5%B1%8E-%E8%B1%86%E7%93%A3%E5%85%B3%E9%94%AE%E5%AD%97%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const asf = document.querySelectorAll("a");
    $("head").append("<style> .test{left: 10px;bottom: 100px;background: #e799b0;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 175px;height: 22px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;display:none;}</style>")
    $("body").append(" <div class='test'>检测中...</div>");
    $(document).ready(function(){
        $("[href]").hover(function(){
        //$("div[class='test']").text("检测到💩");
        $("div[class='test']").show();
        asf.forEach((af) => {
            af.onmouseover = function () {
                var urltxt = af.href
                //console.log(urltxt);
                $.get(urltxt,function(data,status){
                    //console.log(data.includes("💩"));
                    if(data.includes("💩")){
                        console.log("1");
                        $("div[class='test']").text("检测到💩");
                        //$("div[class='test']").show();
                    }else{
                        $("div[class='test']").text("前方安全");
                        //$("div[class='test']").show();
                    }
                });
            }
        })
    },function(){
            $("div[class='test']").text("检测中...");
            $("div[class='test']").hide();
    });
    });
})();

