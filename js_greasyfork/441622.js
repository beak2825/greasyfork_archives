// ==UserScript==
// @name         2022年省网  公需课：继续教育测试【自动播放】
// @namespace    http://tampermonkey.net/
// @version      0.82
// @description  打开视频播放页面课程
// @author       左手天才
//视频播放网址
// @match        *://ggfw.gdhrss.gov.cn/zxpx/auc/play/player?*
 
//进入作业界面
// @match        *://ggfw.gdhrss.gov.cn/zxpx/auc/courseExam?*
 
//完成作业后界面
// @match        *://ggfw.gdhrss.gov.cn/zxpx/auc/examination/subexam?*
 
//进入课程界面
// @match        *://ggfw.gdhrss.gov.cn/zxpx/auc/myCourse
 
//进入选小节页面
// @match        *://ggfw.gdhrss.gov.cn/zxpx/hyper/courseDetail?*
 
//进入课程列表页面
// @match        *://ggfw.gdhrss.gov.cn/zxpx/hyper/search/courselist
 
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/441622/2022%E5%B9%B4%E7%9C%81%E7%BD%91%20%20%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%9A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E6%B5%8B%E8%AF%95%E3%80%90%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/441622/2022%E5%B9%B4%E7%9C%81%E7%BD%91%20%20%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%9A%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E6%B5%8B%E8%AF%95%E3%80%90%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%91.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    var keyTest = "jixujiaoyuTest";
    var keyResult = "jixujiaoyuResult";
    var keyOther = "jixujiaoyuOther";
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    if (window.location.href.indexOf("ggfw") != -1) {
 
        var renli = getRenli()
        if (urlTip == "player") {
            console.log("当前任务: 人力公需课视频 ")
            renli.seeVideo()
        } else if (urlTip == "courseExam") {
            console.log("当前任务: 人力公需课作业 ")
            renli.doTest()
        } else if (urlTip == "subexam") {
            console.log("当前任务: 人力公需课作业结果 ")
            renli.doResult()
        }  else if (urlTip == "myCourse") {
            console.log("当前任务: 人力公需课我的课程 ")
           renli.myCourse()
        }  else if (urlTip == "courseDetail") {
            console.log("当前任务: 人力公需课课程小节 ")
            renli.courseDetail()
       } else if (urlTip == "courselist") {
            console.log("当前任务: 人力公需课课程列表 ")
            renli.courseList()
       }
    }
 
    function getRenli() {
        //循环开始
        return {
 
           //我的课程页面
           myCourse: function (){
console.log("当前任务: 进入我的课程页面 ")
},
 
           //课程小节
          courseDetail: function (){
console.log("当前任务: 进入课程小节页面 ")
},
           //课程列表
           courseList: function (){
console.log("当前任务: 进入课程列表 ")
},
 
            seeVideo: function () {
                var myinter = setInterval(function () {
                    window.clearInterval(myinter)
                    if (p.getStatus() != "playing") {
                        p.play()
                    }
 
                    p.on("ended", function (e) {
                        setTimeout(function () {
                            next()
                        }, 1000)
                    })
                    checkTimu()
                }, 1000)
 
                var myinter2 = setInterval(function () {
                    var errorDiv = document.querySelector(".prism-ErrorMessage")
                    if (errorDiv && errorDiv.style.display != "none") {
                        document.querySelector(".prism-button.prism-button-retry").click()
                    }
                }, 20000)
                //间隔20秒钟。
                //这边是答题功能部分
                function checkTimu() {
                    setInterval(function () {
                                                var txt=document.getElementById('realPlayVideoTime').innerHTML
                        console.log(txt)
                        if(txt>=80||txt=="已完成"){
                            var n = document.querySelectorAll(".append-plugin-tip a")[1]
                            if (n) {
                                n.click()
                            } else {
                                location.href="https://ggfw.gdhrss.gov.cn/zxpx/auc/courseExam?exid=EX2021050000005601"
                                //alert("全部看完了")
                            }
                        }
                    var panel = document.querySelector(".panel.window")
                        if (panel && panel.style.display != "none") {
                            console.log("题目弹出")
                            document.querySelectorAll("input[name='panduan']")[0].click()
                            setTimeout(function () {
                                subAnswer();
                                setTimeout(function () {
                                    document.querySelectorAll(".l-btn-text")[0].click()
                                }, 2000)
                                setTimeout(function () {
                                    document.querySelectorAll(".l-btn-text")[0].click()
                                }, 2000)
                            }, 1000)
                        }
                    }, 10000)
 
                }
 
                function next() { //暂时没用
                    var n = document.querySelectorAll(".append-plugin-tip a")[1]
                    if (n) {
                        n.click()
                    } else {
                        location.href="https://ggfw.gdhrss.gov.cn/zxpx/auc/courseExam?exid=EX2021050000005601"
                        //alert("全部看完了")
                    }
                }
            },
            doTest: function () {
                var juge = localStorage.getItem(keyOther)
                if (juge != "true") {
                    var res = JSON.parse(localStorage.getItem(keyResult))
 
                    var rd = document.querySelector(".exam-subject-rd")
                    var rdqs = rd.querySelectorAll(".exam-subject-text-que-title") //题目
                    var rds = rd.querySelectorAll(".exam-subject-text-quecontent") //单选题选项
                    for (let i = 0; i < rds.length; ++i) {
                        let an = findAnswer(rdqs[i].innerText.substring(2));
                        if (an) {
                            let a = getChoiceCode(an[0])
                            rds[i].querySelectorAll(".exam-subject-text-queanswar")[a].firstElementChild.click()
                            console.log("单选题自动选 " + i)
                        } else {
                            rds[i].querySelectorAll(".exam-subject-text-queanswar")[0].firstElementChild.click() //选A
                        }
                    }
 
                    var ms = document.querySelector(".exam-subject-ms")
                    var msqs = ms.querySelectorAll(".exam-subject-text-que-title") //题目
                    var mss = ms.querySelectorAll(".exam-subject-text-quecontent") //多选题选项
                    for (let i = 0; i < mss.length; ++i) {
                        let an = findAnswer(msqs[i].innerText.substring(2));
                        if (an) {
                            for (let j = 0; j < an.length; ++an) {
                                let a = getChoiceCode(an[j])
                                mss[i].querySelectorAll(".exam-subject-text-queanswar")[a].firstElementChild.click()
                                console.log("多选题自动选 " + i)
                            }
                        } else {
                            mss[i].querySelectorAll(".exam-subject-text-queanswar")[0].firstElementChild.click() //选A
                        }
                    }
 
                    var jd = document.querySelector(".exam-subject-jd") //判断题
                    var jdqs = jd.querySelectorAll(".exam-subject-text-que-title") //题目
                    var jds = jd.querySelectorAll(".exam-subject-text-quecontent")//判断题选项
                    for (let i = 0; i < jds.length; ++i) {
                        let an = findAnswer(jdqs[i].innerText.substring(2));
                        if (an) {
                            let a = getChoiceCode(an[0])
                            jds[i].querySelectorAll(".exam-subject-text-jdanswer")[a].firstElementChild.click()
                            console.log("判断题自动选 " + i)
                        } else {
                            jds[i].querySelectorAll(".exam-subject-text-jdanswer")[0].firstElementChild.click() //选A
                        }
                    }
 
                    function findAnswer(timu) {
                        if (res) {
                            for (let i = 0; i < res.length; ++i) {
                                if (res[i].timu == timu) {
                                    return res[i].answer
                                }
                            }
                        }
                    }
 
                    setTimeout(function(){
                        document.querySelector("#exam_sub").click()//提交
                        setTimeout(function () {
                            document.querySelectorAll(".panel.window.messager-window .l-btn.l-btn-small")[0].click()//点击确定
                        },1000)
                    }, 1000)
                } else {
                    localStorage.setItem(keyOther, "false")
                    setTimeout(function () {
                        window.location.reload()
                    }, 1000)
                }
 
                function getChoiceCode(an) { //用于获取选项字符编码
                    return an.charCodeAt(0) - "A".charCodeAt(0);
                }
 
            },
            doResult: function () {
                var res = JSON.parse(localStorage.getItem(keyResult))
                if (!res) res = new Array()
                var reg = new RegExp("[A-Z]{1}", "g");
                var timus = document.querySelectorAll(".exam-subject-text-que-title")
                var answers = document.querySelectorAll(".exam-subject-text-quecontent")
                for (var i = 0; i < timus.length; ++i) {
                    var data = {}
                    data.timu = timus[i].innerText.substring(2);
                    data.answer = answers[i].lastElementChild.innerText.match(reg)
                    if(!data.answer){
                        switch(answers[i].lastElementChild.innerText){
                            case "正确答案：正确":{
                                data.answer = ["A"]
                                break
                            }
                            case "正确答案：错误":{
                                data.answer = ["B"]
                                break
                            }
                            default: {
                                console.log("获取答案错误")
                            }
                        }
                    }
                    var f = findData(data.timu)
                    if(f == -1){
                        res.push(data)
                    } else {
                        res[f].answer = data.answer
                    }
 
                }
                localStorage.setItem(keyResult, JSON.stringify(res))
                localStorage.setItem(keyOther, "true")
 
                setTimeout(function(){
                    window.history.back(-1);
                }, 1000)
 
                function findData(timu) {
                    if (res) {
                        for (let i = 0; i < res.length; ++i) {
                            if (res[i].timu == timu) {
                                return i
                            }
                        }
                    }
                    return -1
                }
            }
        }
    }
   
})();