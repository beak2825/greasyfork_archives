// ==UserScript==
// @name         中国教育干部网络学院,大学生网络党校学习助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  大学生网络党校视频每隔20分钟暂停一次严重影响大学生学习上进的积极性，此脚本可以免除20分钟的限制，帮助学员更好畅游知识的海洋。如果发现系统无法登录，请先关闭脚本后再登录。
// @author       Tailwind，感谢TCH
// @match        *://study.enaea.edu.cn/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/436291/%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%2C%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%BD%91%E7%BB%9C%E5%85%9A%E6%A0%A1%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436291/%E4%B8%AD%E5%9B%BD%E6%95%99%E8%82%B2%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%2C%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%BD%91%E7%BB%9C%E5%85%9A%E6%A0%A1%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function()
{
    'use strict';


    //课程列表页  https://study.enaea.edu.cn/circleIndexRedirect.do?action=toNewMyClass&type=course&circleId=115203&syllabusId=703035&isRequired=true&studentProgress=12
    if(window.location.pathname=='/circleIndexRedirect.do')
    {
        $(".banner_right").append("<p class='home_new-xg' style='font-weight:bold'>刷课信息：<span id='message'>自动运行中......</span></p>");

        //确保课程都加载后再刷课
        $("#J_listContent").bind('DOMNodeInserted', function(e) {
            if(  $("#J_myOptionRecords_info").text().length>2 )  //根据最下方课程条数显示“共 xx 条”来查验是否数据已加载完成
            {
                $("#J_listContent").unbind('DOMNodeInserted') ;
                bindEachLearnButton(); ////绑定每个【学习】按钮事件
                autoClickNextCourse(); //自动单击下一课
                //定时刷新以便定位要刷的新课程
                setInterval(function(){
                    console.log("每50分钟刷新查看课程进度有无变化，进行中......");
                    window.location.reload();
                },50*60*1000);
            }
        });
    }
    //视频观看页  https://study.enaea.edu.cn/viewerforccvideo.do?courseId=291026&circleId=115203
    else if(window.location.pathname=='/viewerforccvideo.do')
    {
        //选择未看完章节
        $(".cvtb-main-content-kecheng-content").bind('DOMNodeInserted', function(e) {
            if( $(".cvtb-main-content-kecheng-content").text().length>!15){  //跳过“数据加载中...”提示
                $(".cvtb-MCK-CsCt-studyProgress").each(function(){
                   if($(this).text()!="100%"){
                       $(this).parent().parent().click();
                       $(".cvtb-main-content-kecheng-content").unbind("DOMNodeInserted");
                       return false;
                   }
                });

            }
        });

        //自动播放，解除20分钟弹窗限制
        setInterval(function() {
            /*
            if( $("#replaybtn").css("display") == "block")  //none
            {
                $(".ccH5Poster").css("display","none");
                $("#replaybtn").click();
                if($("#ccH5jumpInto").length!=0) $("#ccH5jumpInto").click();
            }
            */

            //解除20分钟弹窗限制
            if(document.getElementsByClassName("dialog-box").length!=0)
            {
                console.log("检测到20分钟限制，去除限制");
                document.getElementsByClassName("dialog-button-container")[0].children[0].click();
            }
            console.log("检测中");
        },3000);
    }


    //绑定每个【学习】按钮事件
    function bindEachLearnButton()
    {
        //绑定按钮事件，当单击【学习】按钮时提示刷课信息
        $(".golearn").on("click",function(){
            let nextCourse;  //下一个未完成的课程
            let trViewing=$(this).parent().parent(); //当前课程所在行

            //根据百分比查找下一个未完成的课程
            trViewing.nextAll().find(".progressvalue").each(function(){
                //console.log("progress",progress);
                if($(this).text()!="100%")
                {
                    let trNext=$(this).parent().parent().parent();
                    nextCourse=$(trNext).find(".course-title").text();
                    return false;
                }
            })

            let course=$(trViewing).find(".course-title").text();
            $(trViewing).css("background-color","rgb(255 188 188)");
            $("#message").html("观看【" + course + "】中......  <br/>下一课[" + nextCourse + "]");
        });
    }


    // //自动单击未完成的课程
    function autoClickNextCourse()
    {
            $(".odd,.even").each(function(){
                let progressvalue=$(this).find(".progressvalue").text();
                if (progressvalue!="100%"){
                    $(this).find(".golearn").append("<span id='abcc'>a</span>");
                    $(this).find(".golearn")[0].click();
                    let data_vurl ="https://study.enaea.edu.cn" +  $(this).find(".golearn").attr("data-vurl");
                    window.open(data_vurl, "studyPage");
                    return false;   //相当于break;
                }
            });
    }

})();
