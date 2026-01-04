// ==UserScript==
// @name         东北财经大学自动完成学习任务  (www.edufe.com.cn) (classroom.edufe.com.cn)
// @description  可用于东北财经大学完成视频观看和pdf浏览任务，暂不支持完成学习之后的作业任务。使用方式：进入东财我的教室页面https://classroom.edufe.com.cn/，点击【继续学习或开始学习】按钮，即可自动开始执行任务，执行完毕会自动停止。支持刷课时，需要手动开启，默认关闭，开启方法设置第22行的sks = true。刷课时模式默认只刷第一章第一小节
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       莫大元帅
// @run-at       document-start
// @match        http://kczy.study.edufe.com.cn/*
// @match        https://kczy.study.edufe.com.cn/*
// @require     https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422821/%E4%B8%9C%E5%8C%97%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%AD%A6%E4%B9%A0%E4%BB%BB%E5%8A%A1%20%20%28wwwedufecomcn%29%20%28classroomedufecomcn%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422821/%E4%B8%9C%E5%8C%97%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%AD%A6%E4%B9%A0%E4%BB%BB%E5%8A%A1%20%20%28wwwedufecomcn%29%20%28classroomedufecomcn%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        if(window.location.href.indexOf('mainPage') != -1){
           for(var i=0;i<$('.course-list li a').length;i++){
            if($('.course-list li a:eq('+i+')').attr('class').indexOf('video-done') != -1 || $('.course-list li a:eq('+i+')').attr('class').indexOf('homework') != -1 || $('.course-list li a:eq('+i+')').attr('class').indexOf('text-done') != -1){
                var status = false;
                var sks = false;
                //如果完成全部学习任务，则进入刷课时模式,刷课时模式需要手动开启（sks变为true，默认false）。
                if(sks && i == $('.course-list li a').length-1){
                   if($('.stat-icon1 em').text().indexOf('小时') == -1){
                       i = 0;
                       status = true;
                   }
                   if($('.stat-icon1 em').text().indexOf('小时') != -1){
                       var studyTime = parseInt($('.stat-icon1 em').text().split('小时')[0]);
                       if(studyTime < 5){
                           i = 0;
                           status = true;
                       }
                   }
                }
                if(!status){
                   continue;
                }
            }
            var arr = $('.course-list li a:eq('+i+')').attr('onclick').split('(')[1].substr(0, $('.course-list li a:eq('+i+')').attr('onclick').split('(')[1].length-1).split(',');
            var chapterIds = arr[0];var subChapterId2 = arr[1];var serviceId = arr[2];var serviceType = arr[3];var studyProgress = arr[4];
            $("#chapterId").val(chapterIds);
            $("#subChapterId").val(subChapterId2);
            $("#serviceId").val(serviceId);
            $("#serviceType").val(serviceType);
            var url = "";
            if(serviceType == '4'){
                url = "/lms-study/study/studyPage#!/video/"+serviceId+"/start:"+studyProgress;
            }else if(serviceType == '5'){
                url = "/lms-study/study/studyPage#!/quiz/"+serviceId+"/"+studyProgress;
            }else if(serviceType == '2'){
                url = "/lms-study/study/studyPage#!/doc/download/"+serviceId;
            }else{
                url = "/lms-study/study/studyPage#!/doc/"+serviceType+"/"+serviceId;
            }
            $("#inputForm").attr("action", url);
            $("#inputForm").submit();
            break;
           }
        }else if(window.location.href.indexOf('study/studyPage') != -1){
            console.log('开始执行video');
            var courseid = avalon.vmodels['course_controller'].courseid;
            var type = avalon.vmodels['course_controller'].coursetype;
            var versionCode = $("#versionCode").val();
            var chapterId = $("#chapterId").val();
            var subChapterId = $("#subChapterId").val();
            $.get("/lms-study/updateState", {
                versionCode : versionCode,chapterId : chapterId, subChapterId : subChapterId,
                serviceId : courseid, serviceType : 4, studyProgress : '-999'
            }, function (data) {
                if(data.result != 'success'){
                    alert("保存进度异常！");
                }else{
                    console.log('执行成功');
                    window.location.href = '/lms-study/mainPage?versionCode='+versionCode+'&homeworkFlag=1';
                }
            }, 'json');
        }
    }, 500);
})();