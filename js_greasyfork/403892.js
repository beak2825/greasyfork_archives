// ==UserScript==
// @name         my-煎蛋随手拍过滤
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  煎蛋随手拍过滤
// @author       You
// @include      *://jandan.net*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403892/my-%E7%85%8E%E8%9B%8B%E9%9A%8F%E6%89%8B%E6%8B%8D%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/403892/my-%E7%85%8E%E8%9B%8B%E9%9A%8F%E6%89%8B%E6%8B%8D%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var local_url = window.location.href;
    console.log("当前地址："+local_url);
    //暂时设置：随手拍才过滤
    if (local_url.indexOf("jandan.net/ooxx") != -1 ) {
        var list = $("li[id^='comment-']");
        //console.log(list);
        var totalNum = list.length;
        var hideNum = 0;
        $(list).each(function(i, o) {
            var like = $(o).find(".tucao-like-container").find("span").text();
            var unlike = $(o).find(".tucao-unlike-container").find("span").text();
            var tucaoStr = $(o).find(".tucao-unlike-container").find("a").text();
            var tucao = tucaoStr.substring(tucaoStr.indexOf("[")+1, tucaoStr.indexOf("]"));

            //console.log(like+","+unlike+","+tucao);
            //OO小于20个，则隐藏
            if ( like<20 ) {
                $(this).hide(); //隐藏不显示。
                hideNum++;
            }
        });
        console.log("本页总个数："+totalNum+"，隐藏个数："+hideNum);
    }

})();