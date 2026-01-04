// ==UserScript==
// @name         师学通助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  用于师学通网刷分
// @author       Guts
// @match        *://pn202136004.stu.teacher.com.cn/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/427135/%E5%B8%88%E5%AD%A6%E9%80%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427135/%E5%B8%88%E5%AD%A6%E9%80%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var count = 0;
var successCount = 0;
var scoreInterval;
(function() {
    'use strict';
    //setInterval(function(){ console.log("Hello"); }, 10000);
    if(!document.querySelector("body > div.content > div.studyCourseTime")){
        return;
    }
    setTimeout(function(){
        if ( typeof fatherTableId == "undefined" ) {
            alert("当前课程刷不了分，请换一个课程！");
        }
    },6000);
    let btn = document.createElement('a');
        btn.id = 'shuafen';
        btn.title = '刷分';
        btn.innerHTML = '刷分';
        btn.style.cssText = 'padding: 10px;background: #1E90ff;border: 2px solid #EDD;font-size: 12px;color: #ffffff;';
        btn.addEventListener('click', function (e) {
            updateFullScore();
        });
    let btnGetScore = document.createElement('a');
        btnGetScore.id = 'btnGetScore';
        btnGetScore.title = '获取分数';
        btnGetScore.innerHTML = '获取分数';
        btnGetScore.style.cssText = 'padding: 10px;background: #1E90ff;border: 2px solid #EDD;font-size: 12px;color: #ffffff;';
        btnGetScore.addEventListener('click', function (e) {
            getProjectPhaseId();
        });
    let countText = document.createElement('p');
        countText.id = 'countText';
        countText.title = '计分';
        countText.innerHTML = '共刷分0次，成功0次，共计0分钟';
        //countText.style.cssText = 'padding: 10px;background: #1E90ff;border: 2px solid #EDD;font-size: 12px;color: #ffffff;';
    document.querySelector("body > div.content > div.studyCourseTime").appendChild(btn);
    document.querySelector("body > div.content > div.studyCourseTime").appendChild(btnGetScore);
    document.querySelector("body > div.content > div.studyCourseTime").appendChild(countText);
    scoreInterval = setInterval(function(){
        var totalMins = document.querySelector("#courseStudyBestMinutesNumber").innerText;
        if(successCount*5 > totalMins){
            clearInterval(scoreInterval);
            alert("本课程已刷满分数!");
            refreshScore();
            return;
        }
        document.querySelector("#shuafen").click();
    }, 6000);
})();

function updateFullScore() {
    count += 1;
    console.log("第" + count + "次刷分!");
    var period = document.querySelector("#courseStudyTimeNumber").innerText;
        var obj = {
            "studyCircleId": studyCircleId,
            "userId": userId,
            "subjectTableId": 0,
            "fatherTableId": fatherTableId,
            "studyType": 13,
            "studyTime": 60,
            "action": "学习",
            "deviceType": "pc端",
            "studyPlanId": studyPlanId,
            "courseCode": courseCode,
            "actionType": 'hand',
            "period":period,
            "flagCode": "20200617"
        }
        $.ajax({
            url: 'http://pn202136004.stu.teacher.com.cn/studyRecord/insertStudyRecord',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            dataType: "json",
            success: function(result) {
                //setTimeout(function () {
                    //refreshScore();
                //},2000);
                if (result.isSuccess == 1) {
                    if(result.data){
                        document.querySelector("#countText").innerText = "共刷分" + count + "次，成功" + successCount + "次，共计" + successCount*5 + "分钟";
                        //alert(result.data);
                        return;
                    }
                    successCount += 1;
                    console.log("更新学习时长成功!成功" + successCount + "次");
                    //alert("更新学习时长成功!成功" + successCount + "次");
                    document.querySelector("#countText").innerText = "共刷分" + count + "次，成功" + successCount + "次，共计" + successCount*5 + "分钟";
                    //console.log(result);
                }
            }
        })
}

function refreshScore(){
    var refreshButton = document.querySelector("body > div.content > div.studyCourseTime > p.studyCourseTimeRefresh");
    refreshButton.click();
    console.log("执行点击!");
    //setInterval(function() {refreshButton.click();console.log("执行点击!");},120000);
}

function getTotalScore(ppid){
    var indexlayer = null;
     $.ajax({
        url: 'http://pn202136004.stu.teacher.com.cn/scoreStudent/findScoreStudentListByStudyPlanIdAndProjectPhaseId',
        type: 'POST',
        dataType: 'json',
        data: {
            id: studyPlanId,
            projectPhaseId: ppid
        },
         success:function(result){
                    if (result.isSuccess === 1) {
                        console.log(result);
                        layer.msg("已学总时长:" + result.data.scoreDetailDTO.contentTypeCourse.alreadyStudyTime + " 已得分数:" + result.data.scoreDetailDTO.contentTypeCourse.courseScore, { icon: 1 });
                        alert("已学总时长:" + result.data.scoreDetailDTO.contentTypeCourse.alreadyStudyTime + " 已得分数:" + result.data.scoreDetailDTO.contentTypeCourse.courseScore);
                    } else {
                        layer.msg(result.msg, { icon: 2 });
                    }
                },
                error: function (xhr, error) {
                    // 请求失败
                    layer.msg(error, { icon: 2 });
                },
                complete: function () {
                    layer.close(indexlayer);
                }
    });
}

function getProjectPhaseId(){
    var indexlayer = null;
    $.ajax({
        url: 'http://pn202136004.stu.teacher.com.cn/scoreStudent/findProjectPhaseScore',
        type: 'POST',
        dataType: 'json',
        data: '',
        success:function(result){
                    if (result.isSuccess === 1) {
                        console.log(result);
                        getTotalScore(result.data.projectPhaseScoreList[0].id);
                    } else {
                        layer.msg(result.msg, { icon: 2 });
                    }
                },
                error: function (xhr, error) {
                    // 请求失败
                    layer.msg(error, { icon: 2 });
                },
                complete: function () {
                    layer.close(indexlayer);
                }
    });
}

function getScore(){
    $.ajax({
                type:"GET",
                url:"http://pn202136004.stu.teacher.com.cn/scoreStudent/getRealControl?projectId="+projectId+"&userId="+userId,
                dataType:"JSON",
                beforeSend: function(e) {
                    console.log("成绩更新中...");
                    //indexlayer = layer.msg('成绩更新中...', {icon: 16,shade: 0.03,time:0});
                },
                success:function(result){
                    if (result.isSuccess === 1) {
                        console.log("成绩:" + result.data);
                        layer.msg(result.data, { icon: 1 });
                    } else {
                        layer.msg(result.msg, { icon: 2 });
                    }
                },
                error: function (xhr, error) {
                    // 请求失败
                    layer.msg(error, { icon: 2 });
                },
                complete: function () {
                    layer.close(indexlayer);
                }
            });
}