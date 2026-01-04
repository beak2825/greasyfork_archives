// ==UserScript==
// @name         chinahrt全自动刷课
// @version      0.0.3
// @namespace    https://github.com/N3verL4nd/chinahrt
// @description  chinahrt全自动刷课，使用见 https://n3verl4nd.blog.csdn.net/article/details/131187984
// @author       N3verL4nd
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAArFJREFUWEftlttPE0EUxr+9ddtdYOXSSmmlFFoasSFemmg0qYkIMfGF/9J/wTeN0cSYGBHEBBIoLSIU0VrKpe1eagaySWVmutu+GJPO4+5cfvOdc745wkGl3sI/HEIf4L9ToHrqoHLi4LTRgmm1IAhAMCDgmi4ibEgQhe4SyncOFA9tFMoWaucO9wRJFDAZlpCeUKAq/kA8AY7PHKwWmqic+i8WRRaQTciIj8qeFB0Bjo4dvN9ooOX/7L8OnLshYybaWQouALn5m/XeD3dJ5qcCSEQkrhJcgLfrdabshV8mvtdsPEoEPeV1JzzOqhjSROZ8JsBO2cJa0WQueLFSQ6lqYWpYQT4ZQnSQfzt3g+iwhFw64B/g9VqDm+0uANlNkYB8UkMupnqqkc+qMBgqUAqQOiex5412AHdOJhzAUlqDpvBNIBOXMTtBJyQF0El+ciALgHwfUEUspjTMjrGzPmKIuJ+hlaIA1ksmtg+srhRon7wwE0IuTieoHhTwZJ7+TgGsbDexe2T3DJAdV/E8o1HriTMu3QlR3ymAz4UmSj96A1AkActzOqZH6DD4BtjYM7G5130IYkMynmV0jHHqfXRQxMObPnKg/NvGh81mVyG4HQ1gcVYH22out5oel3Fr0kcVOC3g5cdz2JxH72oVPE1ruDfh7QMPMirCBo3IdMIvRfPi6WUNF2BMl0Aynjii1yAGRIyINZgADRN4tVa/aDiujnfFOg5PbCykNAyp/roPYsPEjn0DkInfflr4tMV+D7xu3P4/eV1GNsFXqWM/sLVv4usuvyK8QGIjEu6m2I+Qu9azIyKt2OoOvyp4EF439w1AJpLmhHjDfoVvUO6GJOHSMZkb86vAngq0L6ieOSA+UalddsWWfZmkA0ERhi4iYkjMUusUqq4AvGLey/8+QF+BP0npcPDdfTv7AAAAAElFTkSuQmCC
// @match        http://*.chinahrt.com/*
// @match        https://*.chinahrt.com/*
// @match        http://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        http://videoadmin.chinahrt.com/videoPlay/play*
// @match        https://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
//
// @grant        unsafeWindow
// @grant        GM_notification
// @connect      gp.chinahrt.com
// @connect      videoadmin.chinahrt.com.cn
// @connect      videoadmin.chinahrt.com
// @grant        GM_xmlhttpRequest
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/495221/chinahrt%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/495221/chinahrt%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

// ---------------------------------------------------------------------------



(function() {
    'use strict';

    // 2分钟刷新下当前页面，防止意外情况
    setInterval(function(){
        location.reload();
    }, 2*60*1000);

    // 拦截 Vue 页面 url 变化
    setInterval(function(){
        if (document.querySelector('#app') != undefined){
            if (document.querySelector('#app').__vue__.$router.afterHooks.length === 0) {
                document.querySelector('#app').__vue__.$router.afterHooks.push(()=>{location.reload();});
            }
        }
    }, 500);


    // 用户凭证
    var token = sessionStorage.getItem('jwtToken');
    // 固定值
    var platformId = sessionStorage.getItem('platformId');

    // 我的课程页面
    if (window.location.href.indexOf("v_selected_course") > -1) {
        sessionStorage.setItem("home", window.location.href + "&jwtToken="+token);

        // 培训id
        var trainplanId = window.location.href.match(/trainplanId=([^&]*)/)[1];
        sessionStorage.setItem("trainplanId", trainplanId);

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://gp.chinahrt.com/gp6/lms/stu/trainplanCourseHandle/selected_course?curPage=1&pageSize=1&learnFinish=0&trainplanId=" + trainplanId + "&platformId=" + platformId,
            headers: {
                "Hrttoken": token
            },
            onload: function(response) {
                var jsonResult = JSON.parse(response.responseText);
                // 所有未完成课程
                var courseStudyList = jsonResult.data.courseStudyList;
                if (courseStudyList == null || courseStudyList.length == 0) {
                    GM_notification({
                        text: " ",
                        title: "所有课程已学完！！！",
                        image:"data:image/png;base64,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"});
                    return;
                }

                // 只取一个课程
                var courseId = courseStudyList[0].courseId;
                sessionStorage.setItem("courseId", courseId);


                // 课程详情
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://gp.chinahrt.com/gp6/lms/stu/course/courseDetail?courseId=" + courseId + "&trainplanId=" + trainplanId + "&platformId=" + platformId,
                    headers: {
                        "Hrttoken": token
                    },
                    onload: function(response) {
                        var jsonResult = JSON.parse(response.responseText);
                        // 章节列表
                        var chapterList = jsonResult.data.course.chapter_list;
                        var courseName = jsonResult.data.course.name;

                        if (chapterList == null || chapterList.length == 0) {
                            console(jsonResult.data.course.name + " 无章节信息");
                            return;
                        }
                        for(var j = 0; j < chapterList.length; j++) {
                            var sectionList = chapterList[j].section_list;
                            var chapterName = chapterList[j].name;

                            if (sectionList == null || sectionList.length == 0) {
                                continue;
                            }
                            for(var k = 0; k < sectionList.length; k++) {
                                if(sectionList[k].study_status != '已学完') {
                                    var sectionId = sectionList[k].id;
                                    sessionStorage.setItem("sectionId", sectionId);
                                    // 跳转待学习课程章节
                                    window.top.location.href = "https://gp.chinahrt.com/index.html#/v_video?platformId=" + platformId + "&trainplanId=" + trainplanId + "&courseId=" + courseId + "&sectionId=" + sectionId;

                                    return;
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    if (window.location.href.indexOf("/v_video") > -1) {
        var checkJob = setInterval(() => {
            // 检测当前学习章节状态
            var courseId = sessionStorage.getItem('courseId');
            var trainplanId = sessionStorage.getItem('trainplanId');
            var platformId = sessionStorage.getItem('platformId');
            var sectionId = sessionStorage.getItem('sectionId');
            var home = sessionStorage.getItem('home');

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://gp.chinahrt.com/gp6/lms/stu/course/courseDetail?courseId=" + courseId + "&trainplanId=" + trainplanId + "&platformId=" + platformId,
                headers: {
                    "Hrttoken": token
                },
                onload: function(response) {
                    var jsonResult = JSON.parse(response.responseText);
                    console.log(jsonResult);
                    // 章节列表
                    var chapterList = jsonResult.data.course.chapter_list;
                    var courseName = jsonResult.data.course.name;

                    if (chapterList == null || chapterList.length == 0) {
                        console(jsonResult.data.course.name + " 无章节信息");
                        return;
                    }
                    for(var j = 0; j < chapterList.length; j++) {
                        var sectionList = chapterList[j].section_list;
                        var chapterName = chapterList[j].name;

                        if (sectionList == null || sectionList.length == 0) {
                            continue;
                        }
                        for(var k = 0; k < sectionList.length; k++) {
                            if(sectionList[k].id == sectionId) {
                                if (sectionList[k].study_status == '已学完') {
                                    clearInterval(checkJob);
                                    // 调回我的课程页面
                                    window.location.href = home;
                                } else {
                                    console.log("当前课程章节学习进度: " + sectionList[k].studyTimeStr + ", 总进度: " + sectionList[k].total_time_str);
                                    return;
                                }
                            }
                        }
                    }
                }
            });
        }, 5000);
    }

    // 视频播放初始化
    function init() {
        // 移除讨厌的事件
        removePauseBlur();
        // 总是显示播放进度
        player.changeControlBarShow(true);
        // 静音
        player.videoMute();
        // 自动播放
        player.videoPlay();
    }

    // 课程播放页面
    if (window.location.href.indexOf("/videoPlay/play") > -1) {
        var tmp = setInterval(function () {
            if (player != undefined) {
                player.addListener('loadedmetadata', init);
                init();
                clearInterval(tmp);
            }
        }, 500);
    }
})();

