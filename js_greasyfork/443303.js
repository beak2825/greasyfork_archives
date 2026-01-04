// ==UserScript==
// @name         广东理工学院学习工具
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  功能1：自动考试，功能2：挂机看视频，3.可以随时开始期末考试。使用本工具之前请先安装脚本管理器https://www.tampermonkey.net/
// @author       雾中仙
// @match        *.edu-edu.com/exam/student/exam/start/*
// @match        https://gdlgxy.edu-xl.com/MyOnlineCourseNew/OnlineLearningNew/OnlineLearningNewIndex
// @match        https://whcj.edu-edu.com/cws/home/couresware/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443303/%E5%B9%BF%E4%B8%9C%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/443303/%E5%B9%BF%E4%B8%9C%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.href.startsWith('https://whcj.edu-edu.com/cws/home/couresware/play/')) {
        clearInterval(1)
        clearInterval(2)
    } else if (location.href == 'https://gdlgxy.edu-xl.com/MyOnlineCourseNew/OnlineLearningNew/OnlineLearningNewIndex') {
        qmks_click = function (mid, time, timeend, finalExamSource, examMessage, isFaceQM, termcourseID, allowCount_CJ, vs_CJ, limitedTime_CJ, resume_CJ, vr_CJ) {
            //滚动条回到顶端
            window.top.document.documentElement.scrollTop = "100";
            window.top.document.body.scrollTop = "100" // 不能带px

            $.ajax({
                url: '/MyOnlineCourseNew/OnlineLearningNew/IsLimitIp',
                type: 'post',
                dataType: 'json',
                async: false,//把ajax改为同步。不会拦截，成功了
                data: { termCourse_id: termcourseID, IpAddr: $("#hidIpAddr").val() },
                success: function (data) {
                    if (!data.state) {
                        alert("当前IP[" + $("#hidIpAddr").val() + "]不在限制范围内,请联系管理员");
                        return;
                    } else {
                        $("#hidcourseCode").val(mid);
                        $("#hidcourse_id").val(termcourseID);
                        $("#hidButtonName").val("期末考试");
                        ShowCjAndDb(termcourseID, 3);
                    }
                }
            });
        };
        ZYShow = function(ksCode, type) {
            type = type == 3 ? 1 : type;
            var s_url = "";
            $.ajax({
                url: '/MyOnlineCourseNew/OnlineLearningNew/GetExamUrl',
                type: 'post',
                dataType: 'json',
                async: false,
                data:
                {
                    ksType: type,
                    termcourseID: $("#hidcourse_id").val()
                },
                success: function (data) {
                    if (data.state) {
                        s_url = data.msg;
                        //console.log("s_url:" + s_url);
                        window.open(s_url);
                    } else {
                        alert(data.msg);
                    }
                }
            });
        }
    }else {
        window.onload = () => {
            let iframe = document.createElement("iframe")
            iframe.src = 'https://whcj.edu-edu.com/exam-admin/home/my/exam/review/'+__ExamIns.userExamId
            iframe.onload = () => {
                $.getJSON("/exam/student/exam/answer/"+__ExamIns.userExamId,(res) =>{
                    let paper = document.querySelector(".ui-paper-iframe").contentDocument
                    for (let i=0;i<res.answers.length;i++){
                        let answers = res.answers[i].answer.split("")
                        for(let j=0;j<answers.length;j++){
                            paper.querySelector("#q_" + res.answers[i].questionId +" [code='" + answers[j] +"'] span").click()
                        }
                    }
                    __ExamIns.SaveItem(null,null,null,null,function(){
                        $.post('/exam/student/exam/submit/'+__ExamIns.userExamId,{}, function(){
                            window.location=__ExamIns.basePath+'/finished/'+__ExamIns.userExamId
                        })
                    })
                })
            }
            document.body.append(iframe)
        }
    }
})();