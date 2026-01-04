// ==UserScript==
// @name         华医助手 Dr.wu
// @namespace    http://tampermonkey.net/
// @version      24.12.5.1
// @description  2024.11.26 基于之前首创作者Dr.s,二创作者：境界程序员的开发。在应用过程中发现，二创版本对官方页面改动太大，且在实际应用过程中有播放视频结束，还没有答题就自动跳到下一个视频了，声明：此版本只针对北方华医，不需要扫码答题的。
// @author       三创作者，Dr.wu 二创作者：境界程序员   原创作者：Dr.S。
// @license      AGPL License
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_cc.aspx*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @grant        none
//脚本捐赠不会开启新的功能，所以无需声明antifeature
// @downloadURL https://update.greasyfork.org/scripts/518959/%E5%8D%8E%E5%8C%BB%E5%8A%A9%E6%89%8B%20Drwu.user.js
// @updateURL https://update.greasyfork.org/scripts/518959/%E5%8D%8E%E5%8C%BB%E5%8A%A9%E6%89%8B%20Drwu.meta.js
// ==/UserScript==


//更新历史
//2024.11.26 基于之前首创作者Dr.s,二创作者：境界程序员的开发。在应用过程中发现，二创版本对官方页面改动太大，广告太多。且在实际应用过程中有播放视频结束，还没有答题就自动跳到下一个视频了，声明：此版本只针对北方华医，不需要扫码答题的。
//
//2022年和首创作者沟通过，他当时因为疫情，没有电脑也迟迟未能更新。



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
    var clock = null;
    advis();
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
        try {
            document.querySelector("img[id='Pic']").style.display = "block";
        } catch (error) { };
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
                //var playRateNow = tr ? tr : vSpeed;
                var playRateNow = 1;
                cleanKeyStorage();



                asynckillsendQuestion();//屏蔽课堂问答的函数；
                killsendQuestion2();//屏蔽课堂问答的函数2；

                killsendQuestion3(); //循环检测问答对话框是否弹出。
                
                // addrateinfo();//插入一些按钮
                // addratebtn(1);
                // addratebtn(1.5);
                // addratebtn(2);
                // addratebtn(3);
                // addratebtn(5);
                // addratebtn(10);
                //addSkipbtn();//跳过按钮
                // addinfo();//脚本信息
                // changelayout();
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
                    clock = setInterval(examherftest, 3000);//阿み杰此处要改11才能考试，循环法用examherftest检测考试按钮是否能点击
                    function cheack_cxam(){
                        console.log('检测是否可以考试')
                    }
                    cheack_cxam(clock);
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
                                // console.log("polyv加载完毕，静音，稍后尝试触发一次播放");
                                player?.j2s_setVolume(0);
                                document.querySelector("video").defaultMuted = true;
                                setTimeout(function () {
                                    try {
                                        // document.querySelector("video").volume = 0;//实际测试，主要靠这一条静音
                                        player.j2s_resumeVideo();
                                        //document.querySelector("video").muted = true;
                                        examherftest();
                                        console.log("在检测是否可以考试？")
                                        //document.querySelector("button[onclick='closeBangZhu()']").click();//关闭温馨提醒
                                    } catch (error) {
                                        console.log("上一段代码有误");
                                    };
                                }, 2000); //延时点击播放，之前是5秒
                            };
                            break;
                        case 2:
                            window.on_CCH5player_ready()
                            {
                                //console.log("CCplayer加载完毕，静音，稍后尝试触发一次播放");
                                cc_js_Player?.setVolume(0);
                                document.querySelector("video").defaultMuted = true;
                                setTimeout(function () {
                                    try {
                                        //document.querySelector("video").volume = 0;//实际测试，主要靠这一条静音
                                        cc_js_Player.play();
                                        //document.querySelector("video").muted = true;
                                        examherftest();
                                        //document.querySelector("button[onclick='closeBangZhu()']").click();//关闭温馨提醒
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
                var index = 0;


                while (true) {
                    var question = document.querySelectorAll("table[class='tablestyle']")[index];

                    if (question == null) break;
                    else {
                        var q = question.querySelector(".q_name").innerText.substring(2).replace(/\s*/g, "");//问题的具体文本
                        //thisQuestions=thisQuestions+q+"@"


                        if (qRightAnswer.hasOwnProperty(q)) { //当查询到记录了正确答案时的操作

                            //console.log("问题:"+ q + ",有答案:"+ qRightAnswer[q]);
                            var rightSelection = findAnwser("tbody", index, qRightAnswer[q]) //返回答案选项label
                            rightSelection.click();

                        } else {
                            if (questions.hasOwnProperty(q)) {
                                questions[q] = getNextChoice(questions[q]);//通过Unicode数字+1切换到下一个选项，返回的是字母选项
                                //console.log("不知道答案:"+ q+"，测试："+questions[q]);
                            } else { //如果系统没有记录
                                questions[q] = "A";
                            };

                            var answer = getChoiceCode(questions[q]);//将字母选项转换为Unicode数字并减去A代表的65，等于选项顺序，0是第一个选项
                            var element = document.querySelectorAll("tbody")[index].getElementsByTagName("label")[answer];//获取到的是4-5个选项的数组answer等于选项顺序，0是第一个选项
                            //document.querySelector("#gvQuestion_rbl_" + index + "_" + answer + "_" + index);


                            if (!element) { //选项除错机制
                                console.log("找不到选项，选项更改为A index: " + index + " answer: " + answer);
                                questions[q] = "A";
                                answer = getChoiceCode("A");
                                element = document.querySelectorAll("tbody")[index].getElementsByTagName("label")[answer];//获取到的是4-5个选项的数组answer等于选项顺序，0是第一个选项
                                //document.querySelector("#gvQuestion_rbl_" + index + "_" + answer + "_" + index);
                                //localStorage.removeItem(keyTest)
                            };
                            try {
                                var answerText = element.innerText.substring(3);//"A、"占用3个字符
                                //console.log("测试语法:" + (answerText == element.innerText.trim().substring(2)));

                                //element.nextSibling.innerText.trim().substring(2); //获得当前答案文本
                                qTestAnswer[q] = answerText;
                                //console.log("qTestAnswer："+error);
                            } catch (error) { console.log("答案文本获取失败A：" + error); };
                            element.click();
                        };
                        index = index + 1;
                    };
                };

                //存储相关记录

                localStorage.setItem(keyTest, JSON.stringify(questions));
                localStorage.setItem(keyTestAnswer, JSON.stringify(qTestAnswer));

                setTimeout(function () {
                    document.querySelector("#btn_submit").click();
                }, (submitTime + Math.ceil(Math.random() * randomX))); //交卷延时
                ///专用函数区
                function findAnwser(qakey, index, rightAnwserText) {
                    var answerslist = document.querySelectorAll(qakey)[index];
                    var arr = answerslist.getElementsByTagName("label");

                    for (var i = 0; i < arr.length; i++) {
                        //console.log(arr[i].innerText);
                        if (arr[i].innerText.substring(3) == rightAnwserText) {
                            //if (arr[i].innerText.trim().substring(2) == rightAnwserText) {
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
                var dds = $(".state_cour_lis");
                localStorage.removeItem(keyResult);//移除错题表缓存
                if (res == "考试通过" || res == "考试通过！" || res == "完成项目学习可以申请学分了") { //考试通过
                    console.log("考试通过");
                    //localStorage.setItem(keyResult, "");//记录最后一次答对的题目。
                    saveRightAnwser();//记录最后一次答对的题目。
                    SaveAllAnwser(); //存储所有记录的答案
                    cleanKeyStorage();//如果通过清理答案
                    var next = document.getElementsByClassName("state_lis_btn state_lis_han")[0];
                    if (next) {
                        setTimeout(function () {next.click();}, 1000);//下一节课延时
                        try{
                        var playing = document.querySelector("#top_play");
                             if (playing) {
                        setTimeout(function () {playing.click();}, 1000);//点击播放按钮
                        // let volume_0 = document.querySelector("video").volume
                        // setTimeout(function() {volume_0 = 0},3000)
                             }
                    }catch (err) {
                        console.log("无法播放："+err);
                }
                    }
                } else { //考试没过
                    console.log("考试未通过")
                    document.querySelector("p[class='tips_text']").innerText = "本次未通过，正在尝试更换答案\r\n（此为正常现象，脚本几秒后刷新，请勿操作）"
                    var qWrong = {};
                    for (var i = 0; i < dds.length; ++i) {
                        if (!dds[i].querySelector("img").src.includes("bar_img")) {//这里表示否定
                            qWrong[dds[i].querySelector("p").title.replace(/\s*/g, "")] = i
                        };
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
            console.log("没找到章节名称");
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
            //debugger;
            var iswrong = false;
            if (!qWrongs.hasOwnProperty(q)) { //当查询到记录了正确答案时的操作
                console.log("正确的题目：" + q + "，答案：" + qTestAnswer[q]);
                qRightAnswer[q] = qTestAnswer[q];
            } else { console.log("错误的题目：" + q + "，答案：" + qTestAnswer[q]); };

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
            //document.querySelector("a[id=" + "'" + ra + "x']").style = btstyleC;
            //document.getElementById("playrate").innerHTML = "当前播放速率" + ra + "x";
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
        // document.querySelector("div[id='jj']").parentNode.append(checkbox);
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
    };


    function cleanKeyStorage() {//缓存清理
        localStorage.removeItem(keyTest);
        localStorage.removeItem(keyResult);
        localStorage.removeItem(keyTestAnswer);
        localStorage.removeItem(keyRightAnswer);
    };
    function examherftest() {//考试按钮激活状态检测
        var hreftest = document.getElementById("jrks").attributes["href"].value;
        var state = document.querySelectorAll("i[id='top_play']")[0].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
        //console.log("测试考试" + hreftest);
        if ( hreftest != "#"|| (typeof getMaxPlayTime == "function" ? getMaxPlayTime() | 0 : 1) == (typeof player.j2s_getDuration == "function" ? player.
            j2s_getDuration() | 0 : 0) || (typeof getMaxPlayTime == "function" ? getMaxPlayTime() | 0 : 1) == (typeof player.getDuration == "function" ? player.getDuration() | 0 
            : 0)) {//value不为#说明考试按钮已经激活
            //console.log("已经播放完了");
            clickexam();}
        else if (state == "已完成"){
            console.log("已播放完毕并且已考试完毕")
            next_video();
        }
        else{console.log(" 在循环检测是否可以考试，或是否已完成。")
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
        var clockms = setInterval(async function () {
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
                if ($("button[onclick='closeProcessbarTip()']").length && $("button[onclick='closeProcessbarTip()']").length > 0 && $("div[id='div_processbar_tip']").css("display") == "block") {
                    console.log("检测到温馨提示对话框（不能拖拽），尝试跳过");//
                    //$("button[onclick='closeBangZhu()']").click();
                    $("button[onclick='closeProcessbarTip()']").click();
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
                var state = document.querySelectorAll("i[id='top_play']")[0].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerText;
                if ($('video').prop('paused') == true && state != "已完成") {
                    console.log("视频意外暂停，恢复播放");
                    $('video').get(0).play();
                    $('video').prop('volumed') = 0;
                    $('video').prop('muted') = true;
                } else if (state == "已完成") {
                    document.querySelector("video").pause();
                    //clearInterval(clockms);
                };
            } catch (err) {
                //console.log(err);
            };
        }, 2000);
    };

    function advis() {
        let div1 = document.createElement("div");
        div1.innerHTML = `
    <div id='Div1' style="max-width:220px;text-align:left;padding: 10px 10px;font-family:微软雅黑;font-size:20px;float: left;position:fixed;top:140px;left: 10px;z-index: 99999; background-color: rgba(184, 247, 255, 0.7); overflow-x: auto;">
    <span id='clo' style="float: right;position: absolute;top:14px;right:5px;cursor:pointer;font-size:16px">❎</span>
    <div style="font-size:22px;font-weight:bolder;color:red;">温馨提示：</div>
    <hr style="margin-top: 10px;margin-bottom: 10px;">
    <span id="tixing" style="font-size:16px;font-weight:normal;color:black;text-align:right;">倍速已经被禁止<br> 可自动播放及答题 <br> 且用且珍惜<br></span>
    <br>
    <span style="font-size:18px;font-weight:bold;color:black;">急危重症救治中心</span> <br>
    <span style="font-size:18px;font-weight:bold;color:green;text-align:right;"> Dr.wu</span> <br>
    </div> `;
        document.body.append(div1);
//         let share1 = document.querySelector("a[id='Share1']");
//         let share2 = document.querySelector("a[id='Share2']");
        let clo = document.querySelector("span[id='clo']");
//         share1.onclick = function () {
//             window.open("https://greasyfork.org/zh-CN/scripts/500010", "_blank");
//         };
//         share2.onclick = function () {
//             window.open("https://greasyfork.org/zh-CN/scripts/494635", "_blank");
//         };
        clo.onclick = function () {
            alert("真的要关掉吗，不再犹豫一下？        Dr.wu")
            document.querySelector("div[id='Div1']").style.display = "none";  //关闭温馨提示提示框
        };
    };

   function next_video(){
    //自动播放下一个视频的
    const targetElements = document.querySelectorAll("i[id='top_play']");
    const parentElement = targetElements[0].parentElement;
    const grandparentElement = parentElement.parentElement;

    const lis = document.querySelectorAll("li[class='lis-inside-content']");
    var index = Array.from(lis).findIndex(li => li === grandparentElement);//找出当前页面是第几个课程
    //console.log(index);
    if (index + 2 <= document.querySelectorAll("li[class='lis-inside-content']").length) {
        index += 2;
        //console.log("新的Index：" + index);
        document.querySelector("#top_body > div.video-container > div.page-container > div.page-content > ul > li:nth-child(" + index + ") > h2").click();
        setTimeout(function () {
            document.evaluate("//button[contains(., '知道了')]", document, null, XPathResult.ANY_TYPE).iterateNext().click();
        }, 2000);
    } else {
        // 尝试点击第一个按钮
        if ($('button:contains("未学习")').length > 0) {
            $('button:contains("未学习")').siblings().eq(0).click();
        } else if ($('button:contains("学习中")').length > 0) {
            // 如果第一个按钮没有找到，尝试点击第二个按钮
            $('button:contains("学习中")').siblings().eq(0).click();
        } else if ($('button:contains("待考试")').length > 0 && document.querySelector("a[id='mode']").innerText.indexOf("视频+考试") != -1) {
            // 如果前两个按钮都没有找到，尝试点击第三个按钮
            $('button:contains("待考试")').siblings().eq(0).click();
        } else {
            // 如果所有按钮都没有找到，执行其他操作或者提示用户
            console.log('没有找到任何按钮');
            clearInterval(clock);
            // 或者执行其他逻辑
        };
    };

   }





    //---------------------------------全局函数区end------------------------------//



})();