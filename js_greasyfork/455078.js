// ==UserScript==
// @name         华医网绕过视频
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  华医网加速听课与自动答题，2021年12月结合新系统调整进行了功能升级完善修正。本脚本是在“砖瓦核弹头”的代码基础上进行的功能完善与升级。【功能】：1.答题功能会自动记录答案，大幅提高答题成功率；2.增加延时避免弹出验证码。3.播放5倍速；4.增加跳过视频按钮；5.自动进入考试。【待完善】：1.调试代码与无用代码清理。
// @author       Dr.S
// @license      AGPL License
// @match        *://cme26.91huayi.com/course_ware/course_ware_cc.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @match        *://jsxx.gdedu.gov.cn/groupIndex/goStudentActPage.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455078/%E5%8D%8E%E5%8C%BB%E7%BD%91%E7%BB%95%E8%BF%87%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/455078/%E5%8D%8E%E5%8C%BB%E7%BD%91%E7%BB%95%E8%BF%87%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var submitTime = 6100;//交卷时间控制
    var reTryTime = 2100;//重考,视频进入考试延时控制
    var randomX = 5000;//随机延时上限
    var vSpeed=1; //默认播放速度
    //记录字段
    var keyTest = "jixujiaoyu_Test";
    var keyResult = "jixujiaoyu_Result";
    var keyThisQuestions="jixujiaoyu_ThisQuestions";
    var keyTestAnswer = "jixujiaoyu_TestAnswer";
    var keyRightAnswer = "jixujiaoyu_RightAnswer";
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    var huayi = getHuayi();

    if (urlTip == "course_ware_cc.aspx" ||  urlTip == "course_ware_polyv.aspx" ) { //视频页面
        console.log("当前任务: 华医看视频")
        huayi.seeVideo()
    } else if (urlTip == "exam.aspx") { //考试页面
        console.log("当前任务: 华医考试")
        huayi.doTest()
    } else if (urlTip == "exam_result.aspx") { //考试结果页面
        console.log("当前任务: 华医考试结果审核")
        huayi.doResult()
    } else if (urlTip == "goStudentActPage.do") {
        console.log("当前任务: 教师公需课 ")
        getTeacher().dealProblem()
    } else {
        console.log("其它情况")
    }


    function getHuayi() {
        return {
            seeVideo: function () {
                cleanKeyStorage();
                addSkipbtn();//跳过按钮
                //速度调节部分
                window.onload = function () {
                    var videoObj=document.querySelector("video")
                    try {
                        setInterval(() => {
                           videoObj .playbackRate = vSpeed;
                        }, 1 * 1000);
                console.log("成功激活加速");
                    } catch (error) {console.log(error);}

                 videoObj.onended = function() {
                      console.log("播放完成，准备进入考试");
                 setTimeout(function () {
                     document.getElementById("jrks").click();
                 }, (reTryTime+Math.ceil(Math.random()*randomX)));
                 };
               };
            },
            doTest: function () {
                var questions = JSON.parse(localStorage.getItem(keyTest))||{};
                var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer))||{};
                var qTestAnswer = {};
                var index = 0;
                //var oldTest = JSON.parse(localStorage.getItem(keyTest));
                //var oldqRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer))
                //var oldqTestAnswer = JSON.parse(localStorage.getItem(keyTestAnswer))
                var thisQuestions="";
                var tq=localStorage.getItem(keyThisQuestions)
                var oldQuestions = tq ? tq.split("&") : null;
                var w = localStorage.getItem(keyResult);
                var wrongs = w ? w.split("&") : null;
                //加载存储
              /*  if (oldqRightAnswer!=null && oldqRightAnswer!="") {
                    qRightAnswer=oldqRightAnswer
                                                                  }

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

                    //存储相关记录
                localStorage.setItem(keyThisQuestions, thisQuestions);
                localStorage.setItem(keyTest, JSON.stringify(questions));
                localStorage.setItem(keyTestAnswer, JSON.stringify(qTestAnswer));



                function getChoiceCode(an) { //用于获取选项字符编码
                    return an.charCodeAt(0) - "A".charCodeAt(0);

                }

                function getNextChoice(an) { //用于获取下一个选项字符
                    var code = an.charCodeAt(0) + 1;
                    return String.fromCharCode(code);
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
    function skipVideo() {//这是drs追加跳过视频的代码，还没有测试
        var oVideo = document.getElementsByTagName('video')[0];
        if(oVideo){
            oVideo.currentTime=oVideo.duration-1
        }
    }
    function addSkipbtn(){//插入按钮快进视频按钮
        let alink=document.createElement("a");
        alink.innerHTML='快进视频';
        alink.style="font-size: 16px;font-weight: 300;text-decoration: none;text-align: center;line-height: 40px;height: 40px;padding: 0 40px;display: inline-block;appearance: none;cursor: pointer;border: none;box-sizing: border-box;transition-property: all;transition-duration: .3s;background-color: #4cb0f9;border-color: #4cb0f9;border-radius: 4px;margin: 5px;color: #FFF;"
       alink.onclick=function(event){
            skipVideo();
        };
        document.getElementById("jrks").parentNode.append(alink);
    }

    function cleanKeyStorage(){//缓存清理
        localStorage.removeItem(keyTest);
        localStorage.removeItem(keyResult);
        localStorage.removeItem(keyThisQuestions);
        localStorage.removeItem(keyTestAnswer);
        localStorage.removeItem(keyRightAnswer);
    }
//---------------------------------全局函数区end------------------------------//


 //---------------------------------下列代码适用于gdedu.gov------------------------------//
    function getTeacher() {
        return {
            dealProblem: function () {
                localStorage.removeItem(keyTest);
                localStorage.removeItem(keyResult);
                localStorage.removeItem(keyThisQuestions);
                localStorage.removeItem(keyTestAnswer);
                localStorage.removeItem(keyRightAnswer);
                finishTecher()

                function finishTecher() {
                    var res = document.querySelector("#actName").innerText.indexOf("课程考核")
                    if (res != -1) { //课程考核
                        console.log("课程考核")
                        dealQuestions()
                    } else {
                        console.log("看视频")
                        var work = setInterval(function () {
                            if (player && player.isPlaying) {
                                var duration = player.getDuration(); // 显示总时长
                                var position = player.getPosition(); // 视频当前时间
                                if (dyna_pro_over != 'Y' && position != null && position != '0' && position != '' && position != undefined && typeof (position) != 'undefined' && duration != null && duration != '0' && duration != '' && duration != undefined && typeof (duration) != 'undefined' && position > 0) {
                                    //如果触发这个操作后，标识已经完成完成
                                    setDyna(videoId, 'ACT007', 'Y', 'Y', position, '0', '0');
                                    //设置页面的是否完成的标识
                                    $('#dyna_pro_over').val('Y');
                                }
                                window.clearInterval(work)
                                console.log("当前视频完成")
                                freshNowVideoFinishState() //更新当前视频的完成标志
                                var next = getNextVideo()
                                if (next) {
                                    next.click()
                                    finishTecher()
                                } else {
                                    player.seek(Math.floor(player.getDuration()))
                                    alert("所有视频观看完毕")
                                }
                            }
                        }, 10000)
                    }

                }

                function freshNowVideoFinishState() {
                    document.querySelector(".data.cur").childNodes[1].firstElementChild.setAttribute("src", "http://jsxxcss.gdedu.gov.cn/profession_lecture/latest/images/round_full.png")
                }

                function getNextVideo() {
                    var imgs = document.getElementsByTagName("img")
                    for (var i = 0; i < imgs.length; ++i) {
                        if (imgs[i].src == "http://jsxxcss.gdedu.gov.cn/profession_lecture/latest/images/round_empty.png" || imgs[i].src == "http://jsxxcss.gdedu.gov.cn/profession_lecture/latest/images/round_half.png") { //未完成节点
                            return imgs[i].parentElement.parentElement
                        }
                    }
                    return null
                }

                function dealQuestions() {
                    var qs = document.getElementsByClassName("oh")
                    var questions = {}
                    var oldQuestions = JSON.parse(localStorage.getItem(keyTest))
                    var wrongs = JSON.parse(localStorage.getItem(keyResult))
                    for (var i = 0; i < qs.length; ++i) {
                        var q = qs[i].firstElementChild.firstElementChild.firstElementChild.innerText.substring(2)
                        questions[q] = "A"
                        if (wrongs && wrongs[q]) {
                            //console.log(q)
                            questions[q] = wrongs[q]
                        }
                        var cs = questions[q].split(",")
                        for (var j = 0; j < cs.length; ++j) {
                            if (cs[j]) {
                                var code = getChoiceCode(cs[j])
                                var choice = qs[i].children[1].children[code]
                                if (choice) {
                                    choice.firstElementChild.firstElementChild.firstElementChild.click()
                                } else {
                                    console.log("i: " + i + " code: " + code + " cs[j]: " + cs[j])
                                }
                            }
                        }

                    }
                    localStorage.setItem(keyTest, JSON.stringify(questions))
                    setTimeout(function () {
                        document.querySelector("#submitBtn").click()
                        var work2 = setInterval(function () {
                            if (!document.querySelector("#submitBtn")) {
                                window.clearInterval(work2)
                                doResult()
                            }
                        }, 1000)
                    }, 1000)

                }

                function getChoiceCode(an) { //用于获取选项字符编码
                    return an.charCodeAt(0) - "A".charCodeAt(0);
                }

                function doResult() {
                    console.log("获取正确答案")
                    if (document.querySelector(".fr").parentElement.innerText.match(/\d+分/)[0] == "100分") {
                        alert("已经满分了，可以关闭此网页了")
                        return
                    }
                    var qs = document.getElementsByClassName("oh")
                    var wrongs = JSON.parse(localStorage.getItem(keyResult))
                    if (!wrongs) wrongs = {}
                    for (var i = 0; i < qs.length; ++i) {
                        var cs = qs[i].children[1].children
                        var q = qs[i].firstElementChild.firstElementChild.firstElementChild.innerText.substring(2)
                        if (wrongs[q]) wrongs[q] = ""
                        for (var j = 0; j < cs.length; ++j) {
                            if (cs[j] && cs[j].firstElementChild.lastElementChild.getAttribute("class") == "right-answer") {
                                wrongs[q] = wrongs[q] + "," + String.fromCharCode("A".charCodeAt(0) + j);
                            }
                        }
                    }
                    localStorage.setItem(keyResult, JSON.stringify(wrongs))
                    setTimeout(function () {
                        document.querySelector(".redoBtn").click()
                        var work3 = setInterval(function () {
                            if (document.querySelector("#submitBtn")) {
                                window.clearInterval(work3)
                                dealQuestions()
                            }
                        }, 1000)
                    }, 1000)

                }
            }
        }
    }

})();