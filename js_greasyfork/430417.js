// ==UserScript==
// @name         91huayi
// @namespace    http://tampermonkey.net/
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_cc.aspx*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @grant        none
// @version      2.1.7
// @author       境界程序员、Dr.S
// @description  自用测试
// @homepageURL  https://greasyfork.org/zh-CN/scripts/483418
// @downloadURL https://update.greasyfork.org/scripts/430417/91huayi.user.js
// @updateURL https://update.greasyfork.org/scripts/430417/91huayi.meta.js
// ==/UserScript==

//功能
//❌倍速播放✅视频助手✅屏蔽或者跳过课堂签到、提醒、疲劳✅考试助手（试错算法仅面向可多次提交的考试）✅双模选择：单刷视频or视频+考试


(function () {
    'use strict';
    var submitTime = 6100000;//交卷时间控制 (多加了三个零，手动提交吧)
    var reTryTime = 2100000;//重考,视频进入考试延时控制 (多加了三个零，手动提交吧)
    var examTime = 10000000;//听课完成进入考试延时 (多加了三个零)
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
                //var playRateNow = tr ? tr : vSpeed;
                var playRateNow = 1;
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
                addSkipbtn();//跳过按钮
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
                    setInterval(examherftest, 11000000);//阿み杰此处要改11才能考试，循环法用examherftest检测考试按钮是否能点击（多加了三个零，手动考试吧）
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
                                        //examherftest();
                                        document.querySelector("button[onclick='closeBangZhu()']").click();//关闭温馨提醒
                                    } catch (error) {
                                        console.log("polyv上一段代码有误");
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
                                        //examherftest();
                                        document.querySelector("button[onclick='closeBangZhu()']").click();//关闭温馨提醒
                                    } catch (error) {
                                        console.log("CCplayer上一段代码有误");
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

                    var next = document.querySelector('input[class="state_lis_btn"][value="待考试"]');
                    if (next) {
                        setTimeout(function () {
                            var site = window.location.href;
                            site = site.replace("pages/exam_result.aspx?cwid", "course_ware/course_ware_polyv.aspx?cwid");
                            fetch(site)//测试原来的视频页是否存在
                                .then(response => response ? window.location.href = site : window.location.href = site.replace("pages/exam_result.aspx?cwid", "course_ware/course_ware_cc.aspx?cwid"))
                                .catch(error => console.error('考后回不到视频网址:', error));
                            //next.click();
                        }, 1000000);//下一节课延时
                    };
                } else { //考试没过
                    console.log("考试未通过")
                    document.querySelector("p[class='tips_text']").innerText = "本次未通过，正在尝试更换答案\r\n"
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
        alink.innerHTML = '手动试下';
        alink.style = btstyleA;

        alink.onclick = function (event) {
            showExam(true);
            delCookie("playState");
            addCourseWarePlayRecord();
            $('.sign-in-menu').empty()
            clearInterval(timerSign);
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
    function addrateinfo() {//插入说明 当前播放速率
        let adiv1 = document.createElement("div");
        adiv1.innerHTML = '666';
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
        checkbox.innerHTML = '<a id="mode" class="btn btn-default" style="font-size:12px;" >' + moderesult + '<br> [点击此处切换]</a > ';

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
        adiv2.innerHTML = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp...<br>&nbsp&nbsp&nbsp&nbsp&nbsp...';
        adiv2.id = 'jsinfo';
        adiv2.style = "position:relative;left:10px;width:250px;font-size:12px;text-align:left;border: 1px dashed #ff9595;";
        document.querySelector("div[id='jj']").parentNode.append(adiv2);
    };

    function changelayout() {
        document.querySelector("div[id='jj']").remove();
        document.querySelector("div[id='floatTips']").remove();
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
            if (document.querySelector("a[id='mode']").innerText.indexOf("视频+考试") != -1 && document.querySelectorAll("i[id='top_play']")[0].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerText == "待考试") {
                console.log("mode=2,阿み杰准备进入考试");
                clickexam();//阿み杰不想考试
            } else {
                console.log("mode=1,准备单刷视频");
                //自动播放下一个视频的
                const targetElements = document.querySelectorAll("i[id='top_play']");
                const parentElement = targetElements[0].parentElement;
                const grandparentElement = parentElement.parentElement;

                const lis = document.querySelectorAll("li[class='lis-inside-content']");
                var index = Array.from(lis).findIndex(li => li === grandparentElement);//找出当前页面是第几个课程
                console.log(index);
                if (index + 2 <= document.querySelectorAll("li[class='lis-inside-content']").length) {
                    index += 2;
                    console.log("新的Index：" + index);
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
                    } else if ($('button:contains("待考试")').length > 0) {
                        // 如果前两个按钮都没有找到，尝试点击第三个按钮
                        $('button:contains("待考试")').siblings().eq(0).click();
                    } else {
                        // 如果所有按钮都没有找到，执行其他操作或者提示用户
                        console.log('没有找到任何按钮');
                        // 或者执行其他逻辑
                    };
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