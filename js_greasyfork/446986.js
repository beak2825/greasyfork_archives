// ==UserScript==
// @icon            http://passport.ouchn.cn/assets/images/logo.png
// @name            评分系统新版本
// @namespace       [url=mailto:1152673513@qq.com]1152673513@qq.com[/url]
// @author          ShenHua
// @description     评分助手
// @match           *://*.ouchn.cn/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         1.0.1
// @grant           GM_addStyle
// @run-at          document-end
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_setClipboard
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/446986/%E8%AF%84%E5%88%86%E7%B3%BB%E7%BB%9F%E6%96%B0%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446986/%E8%AF%84%E5%88%86%E7%B3%BB%E7%BB%9F%E6%96%B0%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    setInterval(function(){
        var lists = $('.sync-scroll').eq(2).children().children();
        lists.each(function(){
           	var items;
    		var item;
    		var doe;
            var score;
            doe = "100";
            score = parseInt(doe);
            if(doe == '20'){
                   items = ['19','18','20','17'];
            }else if(doe == '30'){
                   items = ['29','28','30','27'];
            }else if(doe == '30'){
                   items = ['29','28','30','27'];
            }else{
                   items = [(score - 10)+".0",(score - 9)+".0",(score - 8)+".0",(score - 7)+".0",(score - 6)+".0",(score - 5)+".0",(score - 4)+".0",(score - 3)+".0",(score - 2)+".0",(score - 1)+".0"];
            }
        	var xh = $(this).children().eq(0).children().eq(1).children().eq(0).text();
            var xm = $(this).children().eq(0).children().eq(2).children().eq(0).text();
            var xy = $(this).children().eq(1).children().eq(0).text();

            var jxb = $(this).children().eq(2).children().eq(0).text();
            var zt = $(this).children().eq(3).children().eq(0).children().eq(0).text();
            var cj = $(this).children().eq(7).children().eq(0).children().eq(0);
            console.log("学号：" + xh + " - 姓名：" + xm + " - 学院："+ xy + " - 教学班："+ jxb + " - 状态："+ zt + " - 成绩："+ cj.val() +"分\n");
            item = items[Math.floor(Math.random()*items.length)];
            if(zt == "已交" && cj.val() == ""){
                cj.focus();
                cj.val(item);
                console.log("已经为未评分的学生："+xm+"->>>评分："+item+"分！");
                cj.blur();
            }else if(zt == "已交" &&  parseInt(cj.val())< 90){
                cj.focus();
                cj.val(item);
                console.log("已经为需要重新评分的学生："+xm+"->>>重新评分："+item+"分！");
                cj.blur();
            }else if(zt == "未交" && cj.val()!=""){
                cj.focus();
            	cj.val("");
                cj.blur();
            }
        })
        console.log("若有下一页将在10秒后自动开始进入下一页评分！");
        setTimeout(function(){
            if($(".pager-button:last").children().eq(0).text()=="下一页 >"){
                $(".pager-button:last").children().eq(0).click();
            }
        },10000)
    },9000)

})();

