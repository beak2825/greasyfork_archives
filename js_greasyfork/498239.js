// ==UserScript==
// @name         🥇【华医网小助手】全网唯一真实免费|无人值守|自动静音|视频助手|考试助手
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  1.倍速播放（已失效）；2.视频助手；3.考试助手（试错算法仅面向可多次提交的考试）；4.双模选择：单刷视频or视频+考试；5.屏蔽或者跳过课堂签到、提醒、疲劳
// @author       bugfix:stonepy 二创作者：境界程序员   原创作者：Dr.S
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_cc.aspx*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498239/%F0%9F%A5%87%E3%80%90%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80%E7%9C%9F%E5%AE%9E%E5%85%8D%E8%B4%B9%7C%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%7C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%7C%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%7C%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498239/%F0%9F%A5%87%E3%80%90%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80%E7%9C%9F%E5%AE%9E%E5%85%8D%E8%B4%B9%7C%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%7C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%7C%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%7C%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//更新历史
//■2023.12.1调整默认播放速度5倍（仅首次登录起效，后续以用户更改过的倍速保存），免得用户感觉不到脚本在运行
//■2023.12.3优化了视频播放逻辑，能够自动切换下一个视频，而不是播完1个就卡在考试认证处（也导致了不修改代码就无法进入考试）
//■2023.12.15新增模式切换，可以选择先单刷视频（无人值守），刷完再打开考试开关，就可以连续考试了
//■2023.12.21将脚本控制台上移到显眼的位置，方便用户操作；增加生效的倍速按钮变色(删除了原先的文字提醒)
//■2023.12.24优化了倍速调整的逻辑，无需刷新网页
//■2023.12.25添加了网页静音代码，润物细无声
//■2024.1.11在人脸识别页面增加温馨提醒，考试功能仅为答案遍历，而非自动搜索答案
//■2024.4.15修复了不自动切换视频的问题（因网站版本限制，目前脚本倍速已失效）
//■2024.4.28由于与用户无法取得联系，在页面上增加了反馈机制的说明
//■2024.6.3尝试修复CC播放器和保利威播放器加载事件bug
//■2024.6.5增加视频过程中对温馨提示（疲劳）的检测
//■2024.6.7根据赞赏和评论区反馈，修复了一种视频意外暂停的情况
//■2024.6.17修复了网站改版后无法考试的问题


(function () {
    'use strict';
    var submitTime = 6100;//交卷时间控制
    var reTryTime = 2100;//重考,视频进入考试延时控制
    var examTime = 10000;//听课完成进入考试延时
    var randomX = 5000;//随机延时上限
    var vSpeed = 1; //首次使用脚本的默认播放速度
    var autoSkip = false; //一个可能会封号的功能。
    //记录字段
    var keyPlayRate = "JJ_Playrate";
    var keyTest = "JJ_Test";
    var keyResult = "JJ_Result";
    var keyThisTitle = "JJ_ThisTitle";
    var keyTestAnswer = "JJ_TestAnswer";
    var keyRightAnswer = "JJ_RightAnswer";
    var keyAllAnswer = "JJ_AllAnswer";
    //按钮样式
    var btstyleA = "font-size: 16px;font-weight: 300;text-decoration: none;text-align: center;line-height: 40px;height: 40px;padding: 0 40px;display: inline-block;appearance: none;cursor: pointer;border: none;box-sizing: border-box;transition-property: all;transition-duration: .3s;background-color: #4cb0f9;border-color: #4cb0f9;border-radius: 4px;margin: 5px;color: #FFF;";
    var btstyleB = "font-size: 12px;font-weight: 300;text-decoration: none;text-align: center;line-height: 20px;height: 20px;padding: 0 5px;display: inline-block;appearance: none;cursor: pointer;border: none;box-sizing: border-box;transition-property: all;transition-duration: .3s;background-color: #4cb0f9;border-color: #4cb0f9;border-radius: 4px;margin: 5px;color: #FFF;";
    var btstyleC = "font-size: 12px;font-weight: 300;text-decoration: none;text-align: center;line-height: 20px;height: 20px;padding: 0 5px;display: inline-block;appearance: none;cursor: pointer;border: none;box-sizing: border-box;transition-property: all;transition-duration: .3s;background-color: #f15854;border-color: #f15854;border-radius: 4px;margin: 5px;color: #FFF;";
    //页面判别
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    var huayi = getHuayi();
    var nspeed = 0;


    if (urlTip == "course_ware_polyv.aspx") { //保利威播放器视频页面
        console.log("当前任务: 华医看视频");
        huayi.seeVideo(1);
    } else if (urlTip == "course_ware_cc.aspx") { //CC播放器视频页面
        console.log("当前任务: 华医看视频");
        huayi.seeVideo(2);
    } else if (urlTip == "exam.aspx") { //考试页面
        console.log("当前任务: 华医考试");
        huayi.doTest();
    } else if (urlTip == "course.aspx" || urlTip == "cme.aspx") { //课程列表页面
        console.log("当前任务: 课程列表");
        huayi.courseList();
    } else if (urlTip == "exam_result.aspx") { //考试结果页面
        console.log("当前任务: 华医考试结果审核");
        huayi.doResult();
    } else {
        console.log("其它情况");
    };

    function getHuayi() {
        return {
            courseList: function () {
                addAnwserCopybtn();
                DelAllAnwser();

            },
            seeVideo: function (e) {
                var tr = localStorage.getItem(keyPlayRate);
                //console.log("存储读取" + tr);//读取倍速
                var playRateNow = tr ? tr : vSpeed;

                cleanKeyStorage();



                asynckillsendQuestion();//屏蔽课堂问答的函数；
                killsendQuestion2();//屏蔽课堂问答的函数2；

                killsendQuestion3(); //循环检测问答对话框是否弹出。

                addrateinfo();//插入一些按钮
                addratebtn(1);
                addratebtn(1.5);
                addratebtn(2);
                addratebtn(3);
                addratebtn(5);
                addratebtn(10);
                //addSkipbtn();//跳过按钮
                addinfo();//脚本信息
                changelayout();
                //速度调节部分

                window.onload = function () {
                    localStorage.setItem(keyThisTitle, JSON.stringify(window.document.title));//储存章节标题
                    // console.log("准备激活加速");
                    ratechg(playRateNow);
                    if (autoSkip == true) {//秒过功能，签完别尝试
                        setTimeout(function () {
                            skipVideo();
                        }, (submitTime + Math.ceil(Math.random() * randomX)));
                        console.log("秒过了！");

                    };
                    setInterval(examherftest, 11000);//阿み杰此处要改11才能考试，循环法用examherftest检测考试按钮是否能点击
                    // try {
                    //     videoObj.onended = function () {
                    //         console.log("播放完成，准备进入考试");
                    //         // if (document.querySelector("a[id='mode']").innerText != "当前模式：视频+考试\n[点击此处切换]") {
                    //         clickexam();//阿み杰不想考试
                    //         // };
                    //     };
                    // } catch (error) { console.log("播放器1检测错误"); }

                    switch (e) {
                        case 1:
                            window.s2j_onPlayerInitOver()
                            {
                                console.log("polyv加载完毕，静音，稍后尝试触发一次播放");
                                document.querySelector("video").defaultMuted = true;
                                setTimeout(function () {
                                    try {
                                        document.querySelector("video").volume = 0;//实际测试，主要靠这一条静音
                                        player.j2s_resumeVideo();
                                        document.querySelector("video").muted = true;
                                        examherftest();
                                        document.querySelector("button[onclick='closeBangZhu()']").click();//关闭温馨提醒
                                    } catch (error) {
                                        console.log("上一段代码有误");
                                    };
                                }, 2000); //延时点击播放，之前是5秒
                            };
                            break;
                        case 2:
                            window.on_CCH5player_ready()
                            {
                                console.log("CCplayer加载完毕，静音，稍后尝试触发一次播放");
                                document.querySelector("video").defaultMuted = true;
                                setTimeout(function () {
                                    try {
                                        document.querySelector("video").volume = 0;//实际测试，主要靠这一条静音
                                        cc_js_Player.play();
                                        document.querySelector("video").muted = true;
                                        examherftest();
                                        document.querySelector("button[onclick='closeBangZhu()']").click();//关闭温馨提醒
                                    } catch (error) {
                                        console.log("上一段代码有误");
                                    };
                                }, 2000); //延时点击播放，之前是5秒
                            };
                            break;
                        default:
                            console.log("其他播放器？");
                    };

                };
            },
            doTest: function () {
                var questions = JSON.parse(localStorage.getItem(keyTest)) || {};
                var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) || {};
                if (JSON.stringify(qRightAnswer) == "{}") {
                    qRightAnswer = LoadRightAnwser();
                };
                var qTestAnswer = {};

                var hy_questions = document.querySelectorAll('.test table');
                let i = 0;
                while(i < hy_questions.length) {
                    // var question = document.querySelector(".q_name");
                    let question = hy_questions[i].querySelector(".q_name");
                    let answer_element = hy_questions[i].querySelector("tbody")

                    console.log("问题:"+ question.innerText);
                    if (question == null) break;
                    else {
                        var q = question.innerText.substring(2).replace(/\s*/g, "");
                        //thisQuestions=thisQuestions+q+"@"
                        console.log(q);
                        console.log(qRightAnswer);


                        if (qRightAnswer.hasOwnProperty(q)) { //当查询到记录了正确答案时的操作

                            console.log("问题:"+ q + ",有答案:"+ qRightAnswer[q]);
                            var rightSelection = findAnwserWithElement(answer_element, qRightAnswer[q]) //返回答案选项id
                            rightSelection.click();

                        } else {
                            if (questions.hasOwnProperty(q)) {
                                questions[q] = getNextChoice(questions[q]);
                                console.log("不知道答案:"+ q+"，测试："+questions[q]);
                            } else { //如果系统没有记录
                                questions[q] = "A";
                            };

                            var answer = getChoiceCode(questions[q]);
                            var element = findAnwserElementWithElement(answer_element, questions[q]);


                            if (!element) { //选项除错机制
                                questions[q] = "A";
                                answer = getChoiceCode("A");
                                element = findAnwserElementWithElement(answer_element, questions[q])
                                //localStorage.removeItem(keyTest)
                            };
                            try {
                                var answerText = element.innerText.trim().substring(2); //获得当前答案文本
                                qTestAnswer[q] = answerText;
                                //console.log("qTestAnswer："+error);
                            } catch (error) { console.log("答案文本获取失败A：" + error); };
                            element.click();
                        };
                        i++;
                    };
                };

                //存储相关记录

                localStorage.setItem(keyTest, JSON.stringify(questions));
                localStorage.setItem(keyTestAnswer, JSON.stringify(qTestAnswer));

                setTimeout(function () {
                    document.querySelector("#btn_submit").click();
                }, (submitTime + Math.ceil(Math.random() * randomX))); //交卷延时
                ///专用函数区
                function findAnwser(qakey, rightAnwserText) {
                    var answerslist = document.querySelector(qakey);
                    var arr = answerslist.getElementsByTagName("label");

                    for (var i = 0; i < arr.length; i++) {
                        //console.log(arr[i].innerText);
                        if (arr[i].innerText.substring(2) == rightAnwserText) {
                            return arr[i].htmlFor;
                        };
                    };
                };

                function findAnwserWithElement(qaElement, rightAnwserText) {
                    var arr = qaElement.getElementsByTagName("label");

                    for (var i = 0; i < arr.length; i++) {
                        //console.log(arr[i].innerText);
                        if (arr[i].innerText.trim().substring(2) == rightAnwserText) {
                            return arr[i];
                        };
                    };
                };
                function findAnwserElementWithElement(qaElement, rightAnwserText) {
                    var arr = qaElement.getElementsByTagName("label");

                    for (var i = 0; i < arr.length; i++) {
                        //console.log(arr[i].innerText);
                        if (arr[i].innerText.trim().substring(0,1) == rightAnwserText) {
                            return arr[i];
                        };
                    };
                };

                function getChoiceCode(an) { //用于获取选项字符编码
                    var charin = an || "A";
                    return charin.charCodeAt(0) - "A".charCodeAt(0);

                };

                function getNextChoice(an) { //用于获取下一个选项字符
                    var code = an.charCodeAt(0) + 1;
                    return String.fromCharCode(code);
                };
                ///专用函数区结束
            },
            doResult: function () {
                //var res = document.getElementsByTagName("b")[0].innerText;
                //var dds = document.getElementsByTagName("dd");
                var res = $(".tips_text")[0].innerText;
                const dds = document.querySelectorAll('.state_cour_lis');

                localStorage.removeItem(keyResult);//移除错题表缓存
                if (res == "考试通过" || res == "考试通过！" || res == "完成项目学习可以申请学分了") { //考试通过
                    console.log("考试通过");
                    //localStorage.setItem(keyResult, "");//记录最后一次答对的题目。
                    saveRightAnwser();//记录最后一次答对的题目。
                    SaveAllAnwser(); //存储所有记录的答案
                    cleanKeyStorage();//如果通过清理答案

                    var next = document.querySelector(".state_lis_han");
                    if (next) {
                        setTimeout(function () { next.click(); }, 1000);//下一节课延时
                    };
                } else { //考试没过
                    console.log("考试未通过")
                    document.querySelector("p[class='tips_text']").innerText = "本次未通过，正在尝试更换答案\r\n（此为正常现象，脚本几秒后刷新，请勿操作）"

                    var qWrong = {};
                    for (var i = 0; i < dds.length; ++i) {
                        const img = dds[i].querySelector('img');
                        let question = dds[i].querySelector('p');

                        if(!img.src.includes('bar_img.png')) {
                            qWrong[question.title.replace(/\s*/g, "")] = i
                        }

                    };

                    if (qWrong != {}) {
                        localStorage.setItem(keyResult, JSON.stringify(qWrong));
                        saveRightAnwser();
                        setTimeout(function () {
                            $("input[type=button][value='重新考试']").click();
                        }, (reTryTime + Math.ceil(Math.random() * randomX)) * 1);

                        //重新考试
                    };
                };

            },
        };
    };

    //---------------------------------全局函数区------------------------------//
    //答案记录函数区开始//
    function SaveAllAnwser() {//保存历史题目答案
        var qAllAnswer = JSON.parse(localStorage.getItem(keyAllAnswer)) || {};
        var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) || {};
        var qTitle = JSON.parse(localStorage.getItem(keyThisTitle)) || "没有记录到章节名称";
        var qOldAnswer = qAllAnswer[qTitle] || {};
        for (var q in qRightAnswer) {
            qOldAnswer[q] = qRightAnswer[q];
        };
        qAllAnswer[qTitle] = qOldAnswer;

        if (qAllAnswer != null) {//保存正确答案
            localStorage.setItem(keyAllAnswer, JSON.stringify(qAllAnswer));
        };
    };
    function LoadRightAnwser() {//加载历史题目答案
        var qAllAnswer = JSON.parse(localStorage.getItem(keyAllAnswer)) || {};
        //var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) ||{};
        var qTitle = JSON.parse(localStorage.getItem(keyThisTitle)) || "没有记录到章节名称";
        if (qTitle == "没有记录到章节名称") {
            return {};
        };
        var qOldAnswer = qAllAnswer[qTitle] || {};
        return qOldAnswer
    };
    function saveRightAnwser() { //记录本次测试到的正确答案

        var qRightAnswer = JSON.parse(localStorage.getItem(keyRightAnswer)) || {};
        var qTestAnswer = JSON.parse(localStorage.getItem(keyTestAnswer)) || {};
        var qkeyTest = JSON.parse(localStorage.getItem(keyTest)) || {};

        //错题表
        var qWrongs = JSON.parse(localStorage.getItem(keyResult)) || {};

        for (var q in qTestAnswer) {
            console.log("题目：" + q + "，答案：" + qTestAnswer[q]);
            //debugger;
            var iswrong = false;
            if (!qWrongs.hasOwnProperty(q)) { //当查询到记录了正确答案时的操作
                console.log("正确的题目：" + q + "，答案：" + qTestAnswer[q]);
                qRightAnswer[q] = qTestAnswer[q];
            } //else{ console.log("错误的题目："+q+"，答案："+qTestAnswer[q]);}

        };
        localStorage.removeItem(keyTestAnswer);//清理临时记录
        if (qRightAnswer != null) {//保存正确答案
            localStorage.setItem(keyRightAnswer, JSON.stringify(qRightAnswer));
        };
    };
    //答案记录函数区结束//

    //答案复制相关按钮
    function addAnwserCopybtn() {//插入答案复制按钮
        let alink = document.createElement("a");
        alink.innerHTML = '显示已记录答案';
        alink.style = btstyleB;

        alink.onclick = function (event) {
            var qAllAnswer = JSON.parse(localStorage.getItem(keyAllAnswer)) || {};
            var Aout = JSON.stringify(qAllAnswer, null, "\t")
            //Aout=encodeURIComponent(Aout);
            //window.prompt("请复制",Aout);
            if (document.getElementById("AnwserOut")) {
                document.getElementById("AnwserOut").innerHTML = Aout;
            } else {
                let textout = document.createElement("textarea");
                textout.id = "AnwserOut";
                textout.innerHTML = Aout;
                textout.rows = 20;
                textout.cols = 30;
                document.getElementById("main_div").parentNode.append(textout);
            };

        };
        document.getElementById("main_div").parentNode.append(alink);

    };
    function DelAllAnwser() {//插入清除答案按钮
        let alink = document.createElement("a");
        alink.innerHTML = '清除已记录答案';
        alink.style = btstyleB;

        alink.onclick = function (event) {

            var r = confirm("确定清除历史答案？!");
            if (r) {
                localStorage.removeItem(keyAllAnswer);
            };
        };
        document.getElementById("main_div").parentNode.append(alink);
    };
    //答案复制相关按钮 end
    function skipVideo() {//这是跳过视频的代码
        var oVideo = document.getElementsByTagName('video')[0];
        if (oVideo) {
            oVideo.currentTime = oVideo.duration - 1
        };
    };

    function clickexam() { //延时点击考试按钮。
        console.log("已点击考试按钮");
        setTimeout(function () {
            document.querySelector("#jrks").click();
        }, (Math.ceil(Math.random() * randomX)));
        //}, (examTime + Math.ceil(Math.random() * randomX)));
    };
    //按钮插入函数相关
    function addSkipbtn() {//插入按钮快进视频按钮
        let alink = document.createElement("a");
        alink.innerHTML = '快进视频';
        alink.style = btstyleA;

        alink.onclick = function (event) {
            skipVideo();
        };
        document.querySelector("div[id='jj']").parentNode.append(alink);
    };

    function addratebtn(ra) {//倍率调整按钮
        let alink = document.createElement("a");
        alink.innerHTML = '' + ra + 'x';
        alink.style = btstyleB;
        alink.className = "speed";
        alink.id = ra + "x";
        alink.onclick = function (event) {
            ratechg(ra);
            try {
                var arr = document.querySelectorAll("a[class='speed']");
                arr.forEach(function (item, index, arr) {
                    arr[index].style = btstyleB;
                });
            } catch (error) {
            };
            alink.style = btstyleC;
        };
        document.querySelector("div[id='jj']").parentNode.append(alink);
    }
    function ratechg(ra) {//倍率调整
        var videoObj = document.querySelector("video")
        try {
            clearInterval(nspeed);
            nspeed = setInterval(() => {
                videoObj.playbackRate = ra;
            }, 1 * 1000);
            localStorage.setItem(keyPlayRate, ra);
            document.querySelector("a[id=" + "'" + ra + "x']").style = btstyleC;
            document.getElementById("playrate").innerHTML = "当前播放速率" + ra + "x";
            //console.log("倍率调整为" + ra);
        } catch (error) { console.log("倍率调整错误" + error); };
    };
    function addrateinfo() {//插入说明
        let adiv1 = document.createElement("div");
        adiv1.innerHTML = '当前播放速率';
        adiv1.id = 'playrate';
        adiv1.style = "font-size: 15px;text-align: center;margin-top: 10px;";
        document.querySelector("div[id='jj']").parentNode.append(adiv1);

    };
    function addinfo() {//插入说明
        //模式切换按钮
        var moderesult = localStorage.getItem("华医mode");
        if (moderesult == 2) {
            moderesult = "当前模式：视频+考试";
        } else {//包括了结果为1或者无存储的情况
            moderesult = "当前模式：单刷视频";
        };
        var checkbox = document.createElement('div');
        checkbox.innerHTML = '<a id="mode" class="btn btn-default" style="background-color: rgba(184, 247, 255, 0.7);font-size:22px;" >' + moderesult + '<br> [点击此处切换]</a > ';

        // 添加到页面的 body 元素中
        document.querySelector("div[id='jj']").parentNode.append(checkbox);
        //插入说明部分
        let mode1 = document.querySelector("a[id='mode']");
        mode1.onclick = function () {
            if (mode1.innerText == "当前模式：单刷视频\n[点击此处切换]") {
                mode1.innerText = "当前模式：视频+考试\n[点击此处切换]";
                localStorage.setItem("华医mode", "2");
            } else {
                mode1.innerText = "当前模式：单刷视频\n[点击此处切换]";
                localStorage.setItem("华医mode", "1");
            };
        };

        let adiv2 = document.createElement("div");
        adiv2.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp本人医学研一学生，经常要帮师兄师姐刷华医视频，属实太累。偶然在抖音发现Dr.S的脚本，结果刷完1个视频立刻考试，导致频繁人脸识别跟手动区别不大。原作者已不更新，于是我自学修改了播放逻辑，实现无人值守连续播放。现将原先自用的脚本分享给大家❤❤<br><h3>&nbsp&nbsp&nbsp&nbsp&nbsp刷完视频再切换考试模式，即可连续考试。</h3>';
        adiv2.id = 'jsinfo';
        adiv2.style = "position:relative;left:10px;width:250px;font-size:12px;text-align:left;border: 1px dashed #ff9595;";
        document.querySelector("div[id='jj']").parentNode.append(adiv2);
    };

    function changelayout() {
        document.querySelector("div[id='jj']").remove();
        document.querySelector("div[class='top']").outerHTML = '<div class="top" style="padding-top: 6px;font-size:18px;color: #ff0000;">如服务器调整，脚本可能失效。反馈意见、免费增加课程请在Greasyfork私信或脚本反馈区联络。也欢迎投喂↓</div>';
        document.querySelector("div[id='jxmb']").innerHTML = "如果你想对脚本表示肯定或意见，可以通过赞赏码备注；如果要与我反复交流，则需移步到下载本脚本的页面，在“反馈”区留下意见或直接私信我。<br><br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp由于脚本工作原理是根据当前网址决定是否运行代码，所以网址未适配则将不运行；页面改版也可能导致脚本报错不运行。这类问题与我交流是有解决可能性的，业余时间可免费受理。";
        document.querySelector("div[id='jxmb']").style.fontSize = "14px";
        if (document.querySelector(".coent .l .videolist .bnt1_0") != null) {
            document.querySelector(".coent .l .videolist .bnt1_0").style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAABsCAIAAAAdev4BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMwMkVFQjM1MDUyRTExRUZCNTIyRUVGNEI2NjBBRUIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMwMkVFQjM2MDUyRTExRUZCNTIyRUVGNEI2NjBBRUIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzAyRUVCMzMwNTJFMTFFRkI1MjJFRUY0QjY2MEFFQjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzAyRUVCMzQwNTJFMTFFRkI1MjJFRUY0QjY2MEFFQjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7h7g0VAAAHHElEQVR42uxa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')";
            document.querySelector("#bnt1 > div > h4").remove();//删除教学目标里的子标题“教学目标”
        } else {
            console.log("无教学目标");
        };

    };

    function cleanKeyStorage() {//缓存清理
        localStorage.removeItem(keyTest);
        localStorage.removeItem(keyResult);
        localStorage.removeItem(keyTestAnswer);
        localStorage.removeItem(keyRightAnswer);
    };
    function examherftest() {//考试按钮激活状态检测
        var hreftest = document.getElementById("jrks").attributes["href"].value;
        //console.log("测试考试"+hreftest);
        if (hreftest != "#") {//value不为#说明考试按钮已经激活
            if (document.querySelector("a[id='mode']").innerText.indexOf("视频+考试") != -1) {
                console.log("mode=2,阿み杰准备进入考试");
                clickexam();//阿み杰不想考试
            } else {
                console.log("mode=1,准备单刷视频");
                //自动播放下一个视频的
                const targetElements = document.querySelectorAll("i[id='top_play']");
                const parentElement = targetElements[0].parentElement;
                const grandparentElement = parentElement.parentElement;

                const lis = document.querySelectorAll("li[class='lis-inside-content']");
                var index = Array.from(lis).findIndex(li => li === grandparentElement);
                console.log(index);
                if (index + 2 <= document.querySelectorAll("li[class='lis-inside-content']").length) {
                    index += 2;
                    console.log("新的Index" + index);
                    document.querySelector("#top_body > div.video-container > div.page-container > div.page-content > ul > li:nth-child(" + index + ") > h2").click();
                    setTimeout(function () {
                        document.evaluate("//button[contains(., '知道了')]", document, null, XPathResult.ANY_TYPE).iterateNext().click();
                    }, 2000);
                };
            };
        } else {//#代表考试按钮还没激活
            //继续播放，无需任何操作
        };
    };
    //课堂问答跳过，临时版
    function sleep(timeout) {
        return new Promise((resolve) => { setTimeout(resolve, timeout); });
        console.log("课堂问答循环调用");
    };
    function asynckillsendQuestion() {
        (async function () {
            while (!window.player || !window.player.sendQuestion) {
                await sleep(20);
            };
            //console.log("课堂问答跳过插入");
            player.sendQuestion = function () {
                //console.log("播放器尝试弹出课堂问答，已屏蔽。");
            };
        })();
    };
    function killsendQuestion2() {
        if (typeof (isInteraction) == "undefined") {
            //console.log('变量未定义');
        } else {
            console.log('isInteraction设置off');
            isInteraction = "off";
        };
    };
    function killsendQuestion3() { //点击跳过按钮版的跳过课堂答题
        setInterval(async function () {
            try {
                if ($('.pv-ask-head').length && $('.pv-ask-head').length > 0) {
                    console.log("检测到问题对话框，尝试跳过");
                    $(".pv-ask-skip").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($('.signBtn').length && $('.signBtn').length > 0) {
                    console.log("检测到签到对话框，尝试跳过");
                    $(".signBtn").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($("button[onclick='closeBangZhu()']").length && $("button[onclick='closeBangZhu()']").length > 0 && $("div[id='div_processbar_tip']").css("display") == "block") {
                    console.log("检测到温馨提示对话框（不能拖拽），尝试跳过");//
                    $("button[onclick='closeBangZhu()']").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($("button[class='btn_sign']").length && $("button[class='btn_sign']").length > 0) {
                    console.log("检测到温馨提示对话框（疲劳提醒），尝试跳过");
                    $("button[class='btn_sign']").click();
                };
            } catch (err) {
                console.log(err);
            };
            try {
                if ($('video').prop('paused') == true) {
                    console.log("视频意外暂停，恢复播放");
                    $('video').get(0).play();
                };
            } catch (err) {
                console.log(err);
            };
        }, 2000);
    };

    //---------------------------------全局函数区end------------------------------//



})();
