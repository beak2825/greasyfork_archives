// ==UserScript==
// @name         动漫屋翻页快捷键
// @namespace    https://greasyfork.org/zh-CN/users/4330
// @version      0.3
// @description  方向键[→]下一页，方向键[←]上一页
// @author       x2009again
// @match        http://www.dm5.com/*
// @exclude      http://www.dm5.com/manhua-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383840/%E5%8A%A8%E6%BC%AB%E5%B1%8B%E7%BF%BB%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/383840/%E5%8A%A8%E6%BC%AB%E5%B1%8B%E7%BF%BB%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function HiddenComment(evt){//隐藏评论
        event=evt;
        window.localStorage.setItem("dm5_HiddenComment","1");
        $("div.view-comment").remove();
        $(event.target).off().on("click",ShowComment).text("显示评论");
    }
    function ShowComment(){//显示评论
        window.localStorage.setItem("dm5_HiddenComment","0");
        window.location.reload();
    }
    if(!!window.localStorage.getItem("dm5_HiddenComment")&&window.localStorage.getItem("dm5_HiddenComment")=="1"){//隐藏状态
        $("div.view-comment").remove();
        var $btnShowComment=$('<a href="javascript:void(0);" class="block">显示评论</a>');
        $("a.block").parent("div.container").append($btnShowComment);
        $btnShowComment.click(ShowComment);
    }
    else{
        var $btnHiddenComment=$('<a href="javascript:void(0);" class="block">隐藏评论</a>');
        $("a.block").parent("div.container").append($btnHiddenComment);
        $btnHiddenComment.click(HiddenComment);
    }
    $(document).keydown(function (evt) {
        evt = evt ? evt : (window.event ? window.event : null);
        if (evt.keyCode == 39){
            if($("#last-win").is(':visible')){
                console.log("下一章");
                window.location.href=$("a.view-btn-next").attr("href");//下一章
            }
            else{
                console.log("下一页");
                ShowNext();//下一页
            }
        }
        if (evt.keyCode == 37){
            console.log("上一页");
            ShowPre();//上一页
        }
        if (evt.keyCode == 86){  //v键是回到顶部
            window.scrollTo(0,0);
        }
    });
})();