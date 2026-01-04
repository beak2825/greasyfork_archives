// ==UserScript==
// @name         芷荷_v_22.0108
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  【更新内容】：1.运行环境为沙盒模式；2.添加输出版本信息
// @author       芷荷
// @license      dy1106
// @match        http://cme26.91huayi.com/course_ware/course_ware_polyv.aspx?cwid=ce168b7f-1a36-40ba-ae81-ad2d00ff58e3
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @match        *://jsxx.gdedu.gov.cn/groupIndex/goStudentActPage.do?*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/438191/%E8%8A%B7%E8%8D%B7_v_220108.user.js
// @updateURL https://update.greasyfork.org/scripts/438191/%E8%8A%B7%E8%8D%B7_v_220108.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var banben = "【芷荷_v_22.0108】"
    //版本定义
    var submitTime = 6100;//交卷时间控制
    var reTryTime = 2100;//重考,视频进入考试延时控制
    var randomX = 3150;//随机延时上限，原5000
    var vSpeed = 5; //默认播放速度（最高16）
    //记录字段
    var keyTest = "jixujiaoyu_Test";
    var keyResult = "jixujiaoyu_Result";
    var keyThisQuestions ="jixujiaoyu_ThisQuestions";
    var keyTestAnswer = "jixujiaoyu_TestAnswer";
    var keyRightAnswer = "jixujiaoyu_RightAnswer";
    var urlInfos = unsafeWindow.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    var huayi = getHuayi();

    if (urlTip == "course_ware_cc.aspx" || urlTip == "course_ware_polyv.aspx") { //观看视频页面
        if (document.title.indexOf("公需课") == -1) {//查找字符串，==等未找到，则代表不是公需课
            console.log("华医_观看视频" + banben)
            huayi.seeVideo()
        }
    } else if (urlTip == "exam.aspx") { //考试页面
        console.log("华医_考试" + banben)
        huayi.doTest()
    } else if (urlTip == "exam_result.aspx") { //考试成绩页面
        console.log("华医_考试成绩审核" + banben)
        huayi.doResult()
    } else if (document.title.indexOf("公需课") != -1) {//查找字符串，!=等找到，则代表是公需课
        console.log("华医_公需课 " + banben)
        huayi.see_gxk_Video()
    } else if (urlTip == "knowledge_navigation.aspx") { //课程导航页面
        console.log("华医_课程导航" + banben)
        //huayi.doResult()
    } else if (urlTip == "cme.aspx") { //课程导航页面
        console.log("华医_继续教育" + banben)
    }

    function getHuayi() {
        return {
            seeVideo: function () {
                cleanKeyStorage();//清理缓存
                var shijian = suijiyanshi(1562,4891)//随机时间赋值给setTimeout
                function suijiyanshi (start,end) {
                    return Math.round(Math.random()*(end-start)+start)
                }
                setTimeout(function (){//延时的命令
                    //alert("芷荷出品");//弹窗的意思
                    tsp();//自动跳过视频函数
                }, shijian);//延时命令尾部===============================
                window.onload = function () {//速度调节部分
                    var videoObj=document.querySelector("video")
                    try {
                        setInterval(() => {
                            videoObj .playbackRate = vSpeed;//playbackRate【控制播放速度】
                        }, 1 * 1000);
                        console.log("加速成功_" + shijian + "毫秒进入考试");
                    } catch (error) {console.log(error);}
                    videoObj.onended = function() {
                        console.log("播放完成，准备进入考试");
                        setTimeout(function () {
                            document.getElementById("jrks").click();
                        }, (reTryTime+Math.ceil(Math.random()*randomX)));
                    };
                };
            },
            see_gxk_Video: function () {
                cleanKeyStorage();//清理缓存

                var videoObji = document.querySelector("video");

                videoObji.onended = function() {//onended【音频播放完的意思】
                    console.log("播放完成，准备进入考试");
                    setTimeout(function () {
                        document.getElementById("jrks").click();
                    }, (reTryTime+Math.ceil(Math.random()*randomX)));
                };
                console.log("出来了");
            },

            doTest: function () {
                var questions = JSON.parse(localStorage.getItem(keyTest))||{};
                var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer))||{};
                var qTestAnswer = {};
                var index = 0;
                //var oldTest = JSON.parse(localStorage.getItem(keyTest));
                //var oldqRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer))
                //var oldqTestAnswer = JSON.parse(localStorage.getItem(keyTestAnswer))
                var thisQuestions = "";
                var tq=localStorage.getItem(keyThisQuestions)
                var oldQuestions = tq ? tq.split("&") : null;
                var w = localStorage.getItem(keyResult);
                var wrongs = w ? w.split("&") : null;
                //加载存储
                /*  if (oldqRightAnswer!=null && oldqRightAnswer!="") {qRightAnswer=oldqRightAnswer}
                if (oldqTestAnswer!=null) {qTestAnswer=oldqTestAnswer}
                */
                //if (oldTest!=null) {questions=oldTest}
                ///测试代码区
                function findAnwser(qakey,rightAnwserText){
                    var answerslist=document.querySelector(qakey);
                    var arr=answerslist.getElementsByTagName("label");
                    for(var i=0;i<arr.length;i++){
                        //console.log(arr[i].innerText);
                        if (arr[i].innerText.substring(2)==rightAnwserText) {
                            return arr[i].htmlFor;
                        }
                    }
                }
                ///测试结束
                while (true) {
                    var question = document.querySelector("#gvQuestion_question_" + index);
                    if (question == null) break;
                    else {
                        var q = question.innerHTML.substring(2);
                        thisQuestions = thisQuestions+q+"&"
                        if (qRightAnswer.hasOwnProperty(q)){ //当查询到记录了正确答案时的操作
                            console.log("已得知答案:"+ qRightAnswer[q]);
                        }else if (questions.hasOwnProperty(q)){
                            questions[q] = getNextChoice(questions[q]);
                            console.log("尚未知答案:"+ q + "，推测：" + questions[q]);
                        }else
                        { //如果系统没有记录
                            questions[q] = "A";
                        }
                        var answer = getChoiceCode(questions[q]);
                        var element = document.querySelector("#gvQuestion_rbl_" + index + "_" + answer + "_" + index);
                        if (!element) { //选项除错机制
                            console.log("找不到选项，选项更改为A index: " + index + " answer: " + answer);
                            questions[q] = "A";
                            answer = getChoiceCode("A");
                            element = document.querySelector("#gvQuestion_rbl_" + index + "_" + answer + "_" + index);
                            //localStorage.removeItem(keyTest)
                        }
                        try{
                            var answerText=element.nextSibling.innerHTML.trim().substring(2); //获得当前答案文本
                            qTestAnswer[q]=answerText;
                        } catch (error) {console.log("答案文本获取失败："+error);}
                        element.click();
                        index = index + 1;
                    }
                }

                //存储相关记录
                localStorage.setItem(keyThisQuestions, thisQuestions);
                localStorage.setItem(keyTest, JSON.stringify(questions));
                localStorage.setItem(keyTestAnswer, JSON.stringify(qTestAnswer));

                setTimeout(function () {
                    document.querySelector("#btn_submit").click();
                }, (submitTime+Math.ceil(Math.random()*randomX))); //交卷延时

                function getChoiceCode(an) { //用于获取选项字符编码
                    return an.charCodeAt(0) - "A".charCodeAt(0);
                }

                function getNextChoice(an) { //用于获取下一个选项字符
                    var code = an.charCodeAt(0) + 1;
                    return String.fromCharCode(code);
                }
            },
            doResult: function () {
                var res = document.getElementsByTagName("b")[0].innerText;
                var dds = document.getElementsByTagName("dd");
                console.log(res)
                if (res == "完成项目学习可以申请学分了") { //考试通过
                    cleanKeyStorage();//如果通过缓存清理（答案）
                    var next = document.querySelector(".s_but");
                    if (next) {
                        setTimeout(function () {
                            window.location.href="http://cme22.91huayi.com/pages/knowledge_navigation.aspx";
                            //next.click();//弹窗好的按钮
                        }, (reTryTime+Math.ceil(Math.random()*randomX)));//随机跳转课程导航页面
                    }
                } else if ( res == "考试通过！") { //考试通过！
                    var shijian = suijiyanshi(1890,5102)//随机时间赋值给setTimeout
                    function suijiyanshi (start,end) {
                        return Math.round(Math.random()*(end-start)+start)
                    }
                    cleanKeyStorage();//如果通过清理答案
                    let next = document.querySelector(".two");
                    if (next) {
                        console.log("准备立即学习")
                        setTimeout(function () {
                            next.click();
                        }, shijian);
                    }
                } else if ( res == "考试没过！") { //考试没过！
                    var wrong = "";
                    for (var i = 0; i < dds.length; ++i) {
                        wrong = wrong + dds[i].title + "&";
                    }
                    if (wrong.length != 0) {
                        localStorage.setItem(keyResult, wrong);
                        saveRightAnwser();
                        setTimeout(function () {
                            document.querySelector(".button").getElementsByTagName("input")[1].click();
                        }, (reTryTime+Math.ceil(Math.random()*randomX)));//重新考试
                    }
                }

                function saveRightAnwser() { //记录本次测试到的正确答案

                    var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) ||{};
                    var qTestAnswer = JSON.parse(localStorage.getItem(keyTestAnswer))||{};
                    //错题表
                    var w = localStorage.getItem(keyResult);
                    var wrongs = w ? w.split("&") : null;

                    for (var q in qTestAnswer) {
                        //var item = qTestAnswer[q];

                        if (wrongs && wrongs.indexOf(q) == -1) { //没有出现在错题表
                            if (!qRightAnswer[q] !== null ) {
                                console.log("正确的题目："+q+"，答案："+qTestAnswer[q]);
                                qRightAnswer[q]=qTestAnswer[q];
                            }else{console.log("找不到答案内容无法记录");}
                        }
                    }
                    localStorage.removeItem(keyTestAnswer);//清理临时记录
                    if (qRightAnswer!=null) {//保存正确答案
                        localStorage.setItem(keyRightAnswer, JSON.stringify(qRightAnswer));
                    }
                }
            }
        }
    }

    //---------------------------------全局函数区------------------------------//
    function tsp(){//自动跳过视频--------
        if(document.URL.search('result.aspx')>0){
            var kcs=document.querySelectorAll('div.case3>div.left>dl>dd')
            if(kcs.length>0){
                console.log('准备自动跳过视频');
                for (var i=0;i<kcs.length;i++){
                    if( document.querySelectorAll('div.case3>div.left>dl>dd>input')[i].value=="立即学习"){
                        document.querySelectorAll('div.case3>div.left>dl>dd>input')[i].click()
                    }
                }
            }
        }else if(document.URL.search('course_ware/course_ware_polyv.aspx')>0){document.location.href=(document.URL.replace('course_ware/course_ware_polyv.aspx','pages/exam.aspx'))}
        else if(document.URL.search('course_ware/course_ware_cc.aspx')>0){document.location.href=(document.URL.replace('course_ware/course_ware_cc.aspx','pages/exam.aspx'))}
    }//---------end-----------------------

    function cleanKeyStorage(){//缓存清理（答案）
        localStorage.removeItem(keyTest);
        localStorage.removeItem(keyResult);
        localStorage.removeItem(keyThisQuestions);
        localStorage.removeItem(keyTestAnswer);
        localStorage.removeItem(keyRightAnswer);
    }
    //---------------------------------全局函数区end------------------------------//
})();