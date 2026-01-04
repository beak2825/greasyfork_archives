// ==UserScript==
// @name         人脸绕过
// @version      1.0.3
// @description  技能培训人脸绕过
// @author       晚风
// @match        https://www.sxzyjn.cn/Course/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @namespace https://greasyfork.org/users/1408151
// @downloadURL https://update.greasyfork.org/scripts/520118/%E4%BA%BA%E8%84%B8%E7%BB%95%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/520118/%E4%BA%BA%E8%84%B8%E7%BB%95%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // @run-at       document-start
    //中途免人脸
    unsafeWindow.show = function() {
        console.log("人脸验证");
    };
    //下一节免限制
    unsafeWindow.nextkpoint = function() {
        var no = kpoints.split('|');
        location.href = "/Course/Videos.aspx?id=526&kid=" + no[parseInt(nowkpoint) + 1].split(',')[0];
        console.log("下一节");
        return;
    };
    //考试免人脸
    unsafeWindow.noExam = function(pid, cid) {
        location.href = "/Exam/ExamList.aspx?cid=" + cid + "&kid=" + pid;
        console.log("参加考试");
        return;
    };
    //解锁立即学习按钮
    unsafeWindow.switchkpoint = function(num) {
        var no = kpoints.split('|');
        location.href = "/Course/Videos.aspx?id=526&kid=" + no[num].split(',')[0];
        alert("第"+(no[num].split(',')[0]-2979)+"节");
        return;
    };
    //自动下一条
    unsafeWindow.addstudytime = function() {
        if (studytime > 0 && s4 < 100) {
            //alert("章节id:"+s1+"课程id:"+s2+"总时长:"+s3+"百分比:"+s4+"学习时间:"+studytime)
            studytime = studytime > 30 ? 60 : studytime;
            $.post("/Ashx/CourseHandler.ashx?act=video",
                   { KPOINT_ID: s1, COURSE_ID: s2, xuexisch: studytime },
                   function (result) {
                studytime = 0;
                if (result == "-2") {
                    alert("登录超时，请重新登录！");
                    location.href = "/index.aspx";
                }
                else if (result == "-10") {
                    alert('请勿同时播放多个课程，系统只记录最后一个课程进度！');
                    player.pause();
                }
                else {
                    var arr = result.split('|');
                    $("#nowvideo").css("width", (arr[2] >= 100 ? 100 : arr[2]) + "%");
                    $("#sp_nowvideo").text((arr[2] >= 100 ? 100 : arr[2]) + "%");
                    s4 = arr[2];
                    $("#str_jindu_" + arr[0]).css("width", (arr[2] >= 100 ? 100 : arr[2]) + "%");
                    $("#sp_jindu_" + arr[0]).text((arr[2] >= 100 ? 100 : arr[2]) + "%");
                    if (arr[2] >= 100) {
                        $("#a_exam_" + s1).css("display", "inline-block");
                    };
                    console.log(s4);
                    if(s4 >= 100){
                        console.log("准备下一条");
                        nextkpoint();
                        console.log("成功下一条");
                    }else{
                        console.log("没看完呢");
                    }
                }
            });
        }
    };

})();