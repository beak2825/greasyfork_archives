// ==UserScript==
// @name         线上知识平台 刷题脚本  防伪考试
// @namespace    Dipper 假币上传
// @version      2.4
// @description  选择考试到刷题界面， 看到试题后  您有两种方式刷题：无脑 按空格/点击右侧按钮“金手指” ，即可搜题，选择答案, 下一题 。。。。。 提交试卷  上传题库  
// @author       佐佐木
// @match        https://kaoshi.pbcexam.cn/*
// @icon         http://doc.ruoyi.vip/images/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
//

// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/453853/%E7%BA%BF%E4%B8%8A%E7%9F%A5%E8%AF%86%E5%B9%B3%E5%8F%B0%20%E5%88%B7%E9%A2%98%E8%84%9A%E6%9C%AC%20%20%E9%98%B2%E4%BC%AA%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453853/%E7%BA%BF%E4%B8%8A%E7%9F%A5%E8%AF%86%E5%B9%B3%E5%8F%B0%20%E5%88%B7%E9%A2%98%E8%84%9A%E6%9C%AC%20%20%E9%98%B2%E4%BC%AA%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
// 设置修改后，需要刷新或重新打开网课页面才会生效

// 修改 获取章节路径 从本地缓存中获取
// 修改 多选题的处理方式

(function() {
    'use strict';
    $('head').append('<link href="https://lib.baomitu.com/layui/2.6.8/css/layui.css" rel="stylesheet" type="text/css" />');

    let dianboArr = []
    let reqobject = {}; //存入试题方法；
    let courseName = ""; //课程名称；
    let zhangjieName = ""; // 章节名称
    // 题目类型
    let contentType = "";
    let content = "";
    let answer = "";
    let options = [];
    var timeid; //找题定时器
    var timeid2; //找题定时器
    let testNumlist = []; //刷题时题目 当前数量/总数量
    let reqTestList = []; //试题列表
    let rightTestList = []; //正确试题列表

    var myAS = getAutoSee();

    myAS.ceshi();

    function getAutoSee() {
        return {
            addWindows: function() {
                $('#cesehiwindows').html('');
                let content1 = "<div style='margin: 0;color:red;'>" +
                    "<a class='btn btn-blue btn-pc retrain-button-pc'  id='updateBtn' style='position: inherit;display: block;margin: 10px 0;'>上传试题</a>" +
                    "<a class='btn btn-blue btn-pc retrain-button-pc'  id='searchBtn' style='position: inherit;display: block;margin: 10px 0;'>搜索答案</a>" +
                    "<a class='btn btn-blue btn-pc retrain-button-pc'  id='backFirst' style='position: inherit;display: block;margin: 10px 0;'>返回首页</a>" +
                    "<a class='btn btn-blue btn-pc retrain-button-pc'  id='goldFinger' style='position: inherit;display: block;margin: 10px 0;'>金手指</a>" +

                    "</div>";
                $("#cesehiwindows").html(content1);

            },

            ceshi: function() {

                $("body").prepend("<div id='cesehiwindows' style=\" display:block; padding:0px; position: fixed; top: 300px; right: 20px;z-index: 999;\"></div>");

                myAS.addWindows();

                $("#updateBtn").bind("click", e => { getErrotQuestion() });

                $("#searchBtn").bind("click", e => { getAnswer() });

                $("#goldFinger").bind("click", e => { blankSpace() });

                $("#backFirst").bind("click", e => { window.location.href = "https://kaoshi.pbcexam.cn/dashboard"; });

                $(document).keydown(function(e) { var e = e || window.event; if (e.keyCode == 32) { blankSpace() } })

                // 跳转到刷题页面
                // creatsocketIn();

                function tester() {
                    // console.log("跳转到刷题页面");
                }

                // 上传结果追加页面
                function uploadMsg(msg) {
                    let uploadMsg = $("#uploadMsg")
                    if (uploadMsg.length > 0) { uploadMsg.remove(); }

                    $(".watermark").prepend("<div id='uploadMsg' class='row'> <div style='margin:10px 30px 0; color:red; '> " + msg + " </div></div>");

                }
                // 搜索答案后，追加页面
                function answerMsg(msg) {
                    let answerMsg = $("#answerMsg")
                    if (answerMsg.length > 0) { answerMsg.remove(); }

                    $("#quesTitle").after("<div id='answerMsg' class='row'> <div style='margin:10px 30px 0; color:red; '> " + msg + " </div></div>");

                }

                // 空格关联事件
                function blankSpace() {

                    let answerMsg = $("#answerMsg").length > 0;
                    let wrongBox = $(".test_result").length > 0;

                    let uploadBox = $(".new-exam-title").length > 0;

                    if (uploadBox) {
                        getErrotQuestion()
                    } else if (!answerMsg && !wrongBox) { // 搜索题目
                        getAnswer()
                    } else if (answerMsg && !wrongBox) { // 验证题目
                        // console.log("验证题目");
                        checkAnswer()
                    } else if (wrongBox) { // 上传答案/下一题
                        // console.log("下一题");
                        nextOne()
                    }

                }

                //验证题目/交卷
                function checkAnswer() {

                    // 交卷按钮
                    let submitExamBtn = $(".submitExam").length > 0;
                    // 确认交卷按钮
                    let whiteBlueBtn = $(".btn-white-blue").length > 0;

                    if (whiteBlueBtn) {
                        $(".btn-white-blue")[0].click();
                    } else if (submitExamBtn) {
                        $(".submitExam")[0].click();
                    } else {
                        $(".nextPage")[0].click();
                    }

                }
                //准备进入下一题
                function nextOne() {
                    // console.log("准备进入下一题！");

                    let zurl = 'https://brush.chiwenm.com/api/iq/orn/change3';

                    let titleEle = $('.question-main-content')
                    let typeName = $(titleEle).find(".ques-type").text().replace('[', '').replace(']', '');
                    let titleName = $(titleEle).find(".ques-type").next().text();
                    let answerName = $(titleEle).find(".ques-answers .test_result .rightAnswer .left").text().replace('正确答案:', '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                    // console.log("获取题目:"+typeName+titleName);
                    // console.log("获取题目:"+typeName+answerName);
                    //                     $.ajax({
                    //                         url: zurl,
                    //                         type: "post",
                    //                         contentType: "application/json",
                    //                         dataType: "json",
                    //                         data:  JSON.stringify({
                    //     contenttype: typeName,
                    //     content: titleName
                    // }),
                    //                         success: function (msg) {
                    //                             console.log(msg)

                    //                            if (msg.code === 200) {
                    //                                   uploadMsg(msg.msg);
                    checkAnswer()
                        //                             }

                    //                         }
                    //                     });

                }

                //搜索题目答案
                function getAnswer() {
                    window.clearInterval(timeid); //清楚定时器
                    let zurl = 'https://brush.chiwenm.com/api/iq/orn/getOne2';
                    let titleEle = $('#quesTitle')
                    let typeName = $(titleEle).find(".ques-type").text().replace('[', '').replace(']', '');
                    let titleName = $(titleEle).find(".title-pre").text();
                    // console.log("获取题目:"+typeName+titleName);
                    answerMsg("正在搜索答案")
                        // $(".shuatiMsg").text("正在搜索答案")
                    $.ajax({
                        url: zurl,
                        type: "post",
                        contentType: "application/json",
                        dataType: "json",
                        data: JSON.stringify({
                            contenttype: typeName,
                            content: titleName
                        }),
                        success: function(msg) {
                            // console.log("请求结果：",msg);
                            let msgs = msg.msg;
                            if (msg.code === 200) {
                                msgs = "【" + msg.data.contenttype + "】  正确答案：" + msg.data.rightop;
                            }
                            answerMsg(msgs);
                            answerAssignment(typeName, msg)

                        }
                    });
                }
                // 清洗答案
                function washAnswer(type, rightAnswer) {
                    let rightList = Array.from(rightAnswer);
                    let list = [];
                    let array = "ABCDEFG";
                    rightList.map(item => { list.push(array.indexOf(item)) })
                    if (type.replace(/(^\s*)|(\s*$)/g, "") === "判断题") {
                        list = [];
                        if (rightAnswer.indexOf("错") > -1) {
                            list.push(1)
                        } else {
                            list.push(0)
                        }
                    }
                    return list;
                }

                // 答案赋值
                function answerAssignment(type, data) {
                    //答案列表
                    let htmlAnswer = $(".option-list li");
                    if (data.code === 200) {
                        let list = washAnswer(type, data.data.rightop.replace(/[\r\n]/g, "").replace(/(^\s*)|(\s*$)/g, ""));
                        list.map(item => { htmlAnswer[item].click() });
                    } else {
                        htmlAnswer[0].click()
                        if (type.replace(/(^\s*)|(\s*$)/g, "") === "多选题") {
                            htmlAnswer.each(function(index, item) { $(item).click() });
                        }
                    }

                }
                //上传正确答案
                function changequestion() {
                    uploadMsg("上传正确答案--本次更新试题长度：" + rightTestList.length);
                    // console.log("上传正确答案--本次更新试题长度："+rightTestList.length)
                    if (rightTestList.length != 0) {
                        let zurl = 'https://brush.chiwenm.com/api/iq/orn/change2';
                        // let zurl = 'http://192.168.2.109:8080/api/iq/orn/change';
                        $.ajax({
                            url: zurl,
                            type: "post",
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify(rightTestList),
                            success: function(msg) {
                                // console.log(msg)
                                if (msg.code === 200) {
                                    uploadMsg(msg.msg);
                                }

                            }
                        });
                    }

                }

                // 获取错题库试题
                function getErrotQuestion() {
                    uploadMsg("正在获取错题信息");
                    //跳转试题界面
                    $('.nav-tabs li:last-child a')[0].click();
                    //点击全部试题
                    let allQuestionBtn = $('.new-result-btn');
                    if (allQuestionBtn.length > 0) {
                        allQuestionBtn[3].click();
                        window.clearInterval(timeid); //清楚定时器
                        let questionsBox = $('.question-main-content');
                        uploadMsg("正在获取错题信息");
                        rightTestList = [];
                        questionsBox.each(function(index, element) {
                            let typeName = $(element).find(".ques-title span:nth-child(2)").text().replace('[', '').replace(']', '');
                            let titleName = $(element).find(".ques-title span:nth-child(3)").text();
                            let answerName = $(element).find(".ques-answers .test_result .rightAnswer .left").text().replace('正确答案:', '').replace(/[\r\n]/g, "").replace(/\ +/g, "");
                            rightTestList.push({ "content": titleName, "rightop": answerName, "contenttype": typeName });
                        });
                        // 上传试题
                        changequestion();
                    }
                }
                //创建找题定时器
                function creatsocketIn() {
                    timeid = window.setInterval(() => {
                        let exam_tittle = $('.new-exam-title');
                        if (exam_tittle.length > 0 && exam_tittle.text() === "考前必测2021【5】") { getErrotQuestion() }
                    }, 1000);
                }
            },
        }
    }

    // Your code here...
})();