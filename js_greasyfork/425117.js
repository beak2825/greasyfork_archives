// ==UserScript==
// @name         仅打印错题
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  仅供问卷星客户使用，在成绩单页面，仅打印错误题目到PDF；
// @author       任亚军
// @match        https://www.wjx.cn/wjx/activitystat/printkapian.aspx?activity=*
// @match        https://chengzidili.wjx.cn/wjx/activitystat/printkapian.aspx?activity=*
// @match        http://chengzidili.wjx.cn/wjx/activitystat/printkapian.aspx?activity=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/425117/%E4%BB%85%E6%89%93%E5%8D%B0%E9%94%99%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/425117/%E4%BB%85%E6%89%93%E5%8D%B0%E9%94%99%E9%A2%98.meta.js
// ==/UserScript==

(function() {

    function hideerror(){
        if($("#divShowError input").prop("checked")==false){
           $("#divShowError input").click();
            $("#divShowError").hide();
        }

        $("img[src='//image.wjx.com/images/newimg/score-form/blank_wrong.png']").parent().hide().prev("span").html("").css({"display":"inline-block","width":"100px","border-bottom":"1px solid #8c8c8c"});
        //    $("img[src='//image.wjx.com/images/newimg/score-form/blank_right.png']").parent().parent().hide().prev("span").html("").css({"display":"inline-block","width":"100px","border-bottom":"1px solid #8c8c8c"});
        $(".answer-ansys").hide();
        $(".icon").hide();
        $(".judge_ques_right").hide();
        $(".judge_ques_false").hide();
        var title1 = document.querySelector("#qywx-or-realname").innerText;
        var title2 = document.querySelector("#divAnswer > h3").innerText;
        var title = title2 + "_" + title1;
        //alert(title);
        document.querySelector("head > title").innerText = title;
        document.querySelector("#divAnswer > div > div:nth-child(2) > div.clearfix > div:nth-child(1)").style = "display:none";
        $("img[src='//image.wjx.cn/images/newimg/score-form/blank_wrong.png']").parent().hide().prev("span").each(function(i,v){
            $(v).css("display","inline-block");
            var curwidth = $(v).width()+20;
            $(v).css("border-bottom","1px solid #8c8c8c").css("margin-bottom","-2px").width(curwidth).text("");
        });
        //$("span").filter(function(){return $(this).text().indexOf("正确答案")==0}).hide();
    }
    $(function(){
        //$("#Ulchoosebutton li").eq(1).children("a")[0].onclick();
        hideerror()
    })


})();

