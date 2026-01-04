// ==UserScript==
// @name         超星尔雅_不答题
// @namespace    http://oibit.cn/
// @version      1.1.1
// @description  超星尔雅
// @author       LangHu
// @match        *://mooc1-1.chaoxing.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/384312/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85_%E4%B8%8D%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/384312/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85_%E4%B8%8D%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

'use strict';

var CourseListElement = [];
var CourseListArray = [];
var Timer = null;
var VideoPlayer = {};
var QuestionListElement = [];
var QuestionListArray = [];
var QuestionAnwserSize = 0;
var CurrentCourseNum = 0;

function tips(text, color="red") {
    console.log("%c【oibit.cn】：" + text , "color:" + color);
}

/*
**    尔雅课程脚本
**    oibit.cn
**    Begin
*/

function eryaGetAllCourse() {
    CourseListArray = $('.cells>.ncells a');
    tips("获取完成 | 课程数：" + CourseListArray.length);
}

function eryaSwitchToCourse() {
    if ( CourseListArray.length <= CurrentCourseNum ) {
        tips("刷课完成，请刷新查看最新结果。");
        return false;
    }
    var CurrentCourse = CourseListArray[CurrentCourseNum++];
    CurrentCourse.click();
    setTimeout(function() {

        $('.tabtags>span[title="视频"]').click();
    setTimeout(function(){
        var CourseStatus = $("iframe").contents().find(".ans-job-finished").length > 0 ? true : false;
        if (CourseStatus) {
            tips("任务点已完成，进入下一课程----------5s----------" + (CurrentCourseNum-1), color='blue');
            setTimeout(function(){
                eryaSwitchToCourse();
                return false;
            }, 5000);
        } else {
            Timer = setInterval(function() {
                VideoPlayer = $("iframe").contents().find("iframe").contents().find('video#video_html5_api')[0];
                if ( VideoPlayer.error == null ) {
                    clearInterval(Timer);
                    VideoPlayer.muted = true;
                    tips("开始播放课程.");
                    VideoPlayer.play();
                    eryaPlayListener();
                }
            }, 2000);
        }
    }, 5000);

    },5000);
    
}

function eryaPlayListener() {
    VideoPlayer.addEventListener('ended',function(){
        tips('视频播放完毕，5秒后切换到下一视频......(5s)');
        eryaSwitchToCourse();
    },false);
    VideoPlayer.addEventListener('pause',function(){
        VideoPlayer.play();
    },false);
}
/*
**    尔雅课程脚本
**    oibit.cn
**    End
*/

$(function() {
    var CurrentUrl = window.location.href ;
    if( CurrentUrl.indexOf('mooc1-1.chaoxing.com/mycourse/studentstudy') >= 0 ) {
        tips("初始化课程数据......(5s)");
        setTimeout(function() {
            eryaGetAllCourse();
            eryaSwitchToCourse();
        },5000);
    }
});