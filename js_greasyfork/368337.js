// ==UserScript==
// @name         A在线学习挂机
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  http://www.ca163.net在线学习自动挂机，自动过答题验证
// @author       sam
// @match        *://www.ca163.net/ca163/authc/media/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/368337/A%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/368337/A%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==
//document.getElementsByTagName("param")[5].value = "df=1&autoplay=1&ban_seek_by_limit_time=off&ban_history_time=on&watchStartTime=1500&vid=ddfe05d6d52cfaccd4712bc7dab2f335_d&start=-1&end=-1&";
$(document).ready(function(){//防止文档在完全加载（就绪）之前运行 jQuery 代码
    /*
    var time=$("span#askTime").text()//测试获取当前视频总时间
    var hh=Number(time.substr(0,2))
    var mm=Number(time.substr(3,2))
    var ss=Number(time.substr(6,2))
    var sum_ss=hh*60*60+mm*60+ss //视频总秒数，数值型变量
    //alert(sum_ss);
    */

    //alert( $("div.banner-2s").children().eq(2).html());
    //$("div.banner-2s").children().eq(2).trigger("click")
    InitTitle();
    var ex_time= 0
    setInterval(function () {
        ex_time=ex_time+1
        $("a#ex_time").html('<p style=" margin:0px 0px 0px 5px;float:left;">检测:'+ex_time+'</p>')
        AutoAnswer();
        AutoNext();
    }, 10000);//延迟执行,否则获取不到课程列表
});

function InitTitle(){
    $("div.course-panel-footer").append('<a href="javascript:;" id="ex_time" class="course-panel-footer-active menubtn"><p style=" margin:0px 0px 0px 5px;float:left;">开始挂机</p></a>')
}

function AutoAnswer(){
    if (!$("div.panel.window").is(":hidden")) //判断答题窗口出现
    {
        //alert("答题");
        $("input:radio:first").attr("checked",true);
        $("a.reply-sub").click();
        $("div.panel.window").hide();
    }
    if(!$("div.panel.window.messager-window").is(":hidden")){ //判断答题完毕窗口出现
        //alert("答题完毕");
        $("span.l-btn-text").click();
        $("div.panel.window.messager-window").hide();
    };
}

function AutoNext(){
    var getTitle=$.trim($("td.backClass2td").text())
    var realTitle=getTitle.substring(2,getTitle.length) //去掉标题的“课件”两个字
    var realPercent=$("span#realPlayVideoTime")  //获取学习进度[0~99,null]
    var cList=$("li.level1").children("a.level1") //获取课程列表
    var i=cList.length
    if (realPercent.length == 0 && i > 0){
        for(var j=0;j<i;j++){ //遍历课程列表，自动点击下一个节课
            if (cList.eq(j).children("span.node_name").text()==realTitle) //在课程列表中查找当前课程
            {
                if (j<i-1){
                    cList.eq(j+1).find("a").each(function(){ //定位当前课程，点击下一节课
                        this.click();
                    });
                }
                else
                {
                    //需解决最后一节课完毕后，跳转到选其他课程，开始新课程学习
                    //$("div.banner-2s").children().eq(2).click();
                }
            }
        }
    }
}

