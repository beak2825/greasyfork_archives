// ==UserScript==
// @name       V2EX 添加回复引用
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  V2EX回复引用；显示新浪图床的图片。
// @author       misterchou@qq.com
// @match        *://*.v2ex.com/t/*
// @icon        https://www.v2ex.com/static/img/icon_rayps_64.png
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/387572/V2EX%20%E6%B7%BB%E5%8A%A0%E5%9B%9E%E5%A4%8D%E5%BC%95%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/387572/V2EX%20%E6%B7%BB%E5%8A%A0%E5%9B%9E%E5%A4%8D%E5%BC%95%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //     window.abc('helloWorld')

    //     unsafeWindow.abc = function(msg) {
    //         alert(msg);
    //     };

    unsafeWindow.replyOne = function (e) {

        var obj = $(e);

        // 原文
        var originalContent = obj.find(".reply_content").text();
        // 回复框
        var replyContent = $("#reply_content");
        var oldContent = replyContent.val();

        // 修改回复框高度
        $("#reply_content").height( function(i,h){
            return h + 27;
        } );

        // 楼层数
        var floorNum = obj.find(".no").text();
        // 用户名
        var username = obj.find(".dark").text();

        // @用户 ;拼接字符 ：
        // @user  原文：“2233123” \n
        // 回复：
        var prefix = "@" + username + " ";
        var newContent = prefix + "#" + floorNum + " 原文：“" + originalContent + "”\n======\n回复：";

        // 如果输入框是空的，则把当前的内容写入；
        // 如果输入框不为空，则判断新字符串和旧的输入框内容是否相等，当不等时，则重新拼接字符串，
        // 拼接的规则是：输入框已有的字符串 + 换行 + 新的字符串
        0 < oldContent.length ? oldContent != newContent && (newContent = oldContent + "\n\n" + newContent) : newContent;
        replyContent.focus();
        replyContent.val(newContent);
        moveEnd($("#reply_content"));

        var k = jQuery.Event("keydown");//模拟一个键盘事件
        k.keyCode = 13;//keyCode=13是回车
        $("input.pagination-num").trigger(k);//模拟页码框按下回车
    }

    $(" td > div.fr > a").each((i, obj) => {
        //  转换jquery对象
        var o = $(obj);
        o.attr("onclick", "window.replyOne(this.parentNode.parentNode)");
    });

    // 显示新浪微博的图片
    // 给img添加referer policy 标签，解决referer图片防盗链
    setTimeout( function(){
        var link = "" ;
        // 遍历所有的img标签
        $("img").each( (i,obj) => {
            var o = $(obj);
            // 判断图片的链接是否包含sinaimg关键字
            if( o.attr("src").indexOf("sinaimg") > 0 ){
                // 给这个标签加上referrerPlicy属性
                o.attr("referrerpolicy","no-referrer");
                // 备份图片的src
                link = o.attr("src");
                // 重新设置src，让页面重新加载一次图片
                o.attr("src",link);
            }
        });
    },1500);
})();

