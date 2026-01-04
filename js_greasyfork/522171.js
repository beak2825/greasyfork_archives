// ==UserScript==
// @name         华医网自动播放与答题
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  打开视频播放页面后即可自动完成所有课程
// @author       砖瓦核弹头ChangeByJEFF
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @match        *://jsxx.gdedu.gov.cn/groupIndex/goStudentActPage.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522171/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8E%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/522171/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8E%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var keyTest = "jixujiaoyuTest";
    var keyResult = "jixujiaoyuResult";
    var keyExamIds = "jixujiaoyuExamIds";
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    // 使用 window.location 获取当前页面的 URL 查询参数
    var params = new URLSearchParams(window.location.search);

    var huayi = getHuayi();

    if (urlTip == "course_ware_polyv.aspx") { //视频页面
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
    } else if (urlTip == "course.aspx") {
        console.log("当前任务: 华医看视频选择 ")
        huayi.videoOrExam()
    } else if (urlTip == "exam_code.aspx") {
        console.log("当前任务: 验证码 ")
        huayi.code()
    } else {
        console.log("其它")
    }


    function getHuayi() {
        return {
            seeVideo: function () {
                localStorage.removeItem(keyTest);
                localStorage.removeItem(keyResult);
                let video = document.querySelector('video');
                window.playInterval = setInterval(() => {
                    if(video.duration != NaN){
                        video.currentTime = Math.max(0, video.duration - 1);
                        //停止定时器，因为我们已经设置了 currentTime
                        clearInterval(window.playInterval);
                    }
                }, 1000);
                window.playInterval2 = setInterval(() => {
                    if (video.paused) {
                        video.play();
                    }
                    if (window.player && window.player.getCurrentLevel() != 1) {
                        window.player.changeLevel(1)
                    }
                    video.volume = 0;
                    video.muted = true;
                    //video.currentTime = Math.max(0, video.duration - 5);
                }, 1000);
                window.examInterval = setInterval(() => {
                    this.examherftest();
                }, 1000);
                /*
                var myid = prefix + vid;
                var myinter = setInterval(function () {
                    var myvideo = getSWF(myid);
                    console.log("当前进度: " + myvideo.getPosition() + " 总进度: " + myvideo.getDuration());
                    if (myvideo.getPosition() == myvideo.getDuration()) {
                        window.clearInterval(myinter);
                        setTimeout(function () {
                            check_next_click();
                        }, 1000);
                        //console.log("三秒后进入下一步");
                    }
                }, 3000);
                */
                /*window.s2j_onPlayOver = function () {
                    console.log("播放完毕")
                    showExam(true);
                    delCookie("playState");
                    addCourseWarePlayRecord();
                    setTimeout(function () {
                        document.querySelector(".inputstyle2").click()
                    }, 1000)
                }*/
            },
            examherftest : function() {  //考试按钮激活状态检测
                var hreftest = document.getElementById("jrks").attributes["href"].value;
                if (hreftest != "#") { //考试按钮已激活
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
                        if ($('button:contains("未学习")').length > 0) {
                            $('button:contains("未学习")').siblings().eq(0).click();
                        } else if ($('button:contains("学习中")').length > 0) {
                            $('button:contains("学习中")').siblings().eq(0).click();
                        } else if ($('button:contains("待考试")').length > 0 && document.querySelector("a[id='mode']").innerText.indexOf("视频+考试") != -1) {
                            $('button:contains("待考试")').siblings().eq(0).click();
                        } else {
                            console.log('没有找到任何按钮');
                            clearInterval(examInterval);
                        };
                    };
                };
            },
            decodeHtmlEntities: function(encodedString) {
                if(encodedString == null){return null;};
                var textArea = document.createElement('textarea');
                textArea.innerHTML = encodedString;
                return textArea.value;
            },
            doTest: function () {
                var questions = {};
                var index = 0;
                var oldTest = JSON.parse(this.decodeHtmlEntities(localStorage.getItem(keyTest)));
                var w = this.decodeHtmlEntities(localStorage.getItem(keyResult));
                var wrongs = w ? w.split("&") : null;
                while (true) {
                    var question = document.querySelectorAll(".q_name")[index];
                    if (question == null) break;
                    else {
                        var q = this.decodeHtmlEntities(question.innerHTML.substring(2));
                        questions[q] = "A";
                        if (oldTest && oldTest[q]) {
                            questions[q] = oldTest[q];
                        }
                        if (wrongs && wrongs.indexOf(q) != -1) { //旧选项错误
                            console.log("旧选项错误   " + q);
                            questions[q] = getNextChoice(questions[q]);
                        }
                        var answer = getChoiceCode(questions[q]);
                        var gid = question.getAttribute('data-qid');
                        var element = document.querySelectorAll("[name=radio_" + gid)[answer];
                        if (!element) {
                            console.log("找不到选项，默认选A index: " + index + " answer: " + answer);
                            questions[q] = "A";
                            answer = getChoiceCode("A");
                            element = document.querySelectorAll("[name=radio_" + gid)[answer];
                            //localStorage.removeItem(keyTest)
                        }
                        element.click();
                        index = index + 1;
                    }
                }
                console.log(questions)

                localStorage.setItem(keyTest, JSON.stringify(questions));

                setTimeout(function () {
                    document.querySelector("#btn_submit").click();
                }, 1000);

                function getChoiceCode(an) { //用于获取选项字符编码
                    return an.charCodeAt(0) - "A".charCodeAt(0);
                }

                function getNextChoice(an) { //用于获取下一个选项字符
                    var code = an.charCodeAt(0) + 1;
                    return String.fromCharCode(code);
                }
            },
            doResult: function () {
                var res = document.querySelectorAll(".tips_text")[0].innerText;
                var an = document.querySelectorAll(".state_cour_lis");
                var dds = [];
                // 遍历每个 'state_cour_lis' 元素
                an.forEach(function(element) {
                    // 查找当前元素内的所有 <img> 标签
                    var imgs = element.querySelectorAll('img');

                    // 遍历找到的所有 <img> 标签
                    imgs.forEach(function(img) {
                        // 检查 img 的 src 属性是否包含 "error"
                        if (img.src.includes("error")) {
                            dds.push(element.querySelectorAll('.state_lis_text')[0]);
                        }
                    });
                });
                if (res == "考试通过") { //考试通过
                    console.log("考试通过")
                    var cwids = localStorage.getItem(keyExamIds).split(",");
                    //判断是否为空，不为空，拿第一个参数跳转
                    if (cwids.length > 0 && cwids[0].trim()) {
                        cwids.shift();
                        localStorage.setItem(keyExamIds,cwids.join(","));
                        //跳转到这个页面上
                        window.location.href = '../pages/exam.aspx?cwid='+cwids[0];
                    }
                    var next = document.querySelector('.state_lis_btn[value="待考试"]');
                    if (next) {
                        next.click();
                    }
                } else { //考试没过
                    console.log("考试未通过")
                    var wrong = "";
                    for (var i = 0; i < dds.length; ++i) {
                        wrong = wrong + dds[i].title + "&";
                    }
                    console.log(wrong)
                    if (wrong.length != 0) {
                        localStorage.setItem(keyResult, wrong);
                        document.querySelector("input[value='重新考试']").click(); //重新考试
                    }
                }

            },
            videoOrExam: function(){
                //给页面添加申请学分按钮跳转
                const tempSpan = document.querySelector('.pace_text');
                if (tempSpan) {
                    // 创建新的 <a> 元素
                    const newAnchor = document.createElement('a');
                    // 设置 <a> 元素的 href 属性和其他属性
                    newAnchor.href = '../pages/apply_certificate_top.aspx?cid='+params.get('cid'); // 替换为实际链接
                    newAnchor.textContent = '申请学分'; // 设置链接文本
                    newAnchor.target = '_blank';
                    // 将新 <a> 插入到 tempSpan 的最后面
                    tempSpan.appendChild(newAnchor);
                }
                //给每个待考试的元素添加点击跳转按钮
                // 获取所有的 <span> 元素
                const spans = document.querySelectorAll('span');
                var cwids = [];
                // 创建一个数组来保存匹配的元素
                const matchingSpans = [];
                // 遍历每个 <span> 元素
                spans.forEach(function(span) {
                    // 检查 span 的文本内容是否等于 "待考试"
                    if (span.textContent.trim() === '待考试') {
                        var element = span.nextElementSibling;
                        var cwid = element.getAttribute("data-cwrid");
                        cwids.push(cwid);
                        element.insertAdjacentHTML('afterend','<a href="../pages/exam.aspx?cwid='+cwid+'" target="_blank"><strong>点击跳转考试</strong></a>');
                    }
                });
                localStorage.setItem(keyExamIds,cwids.join(","));
                // 获取文档中的所有元素
                /*const allElements = document.querySelectorAll('.play_process[style="color: #1277af"]');
                console.info(allElements);
                allElements.forEach(function(element) {
                    var cwid = element.getAttribute("data-cwrid");
                    element.insertAdjacentHTML('afterend','<a href="../pages/exam.aspx?cwid='+cwid+'"><strong>点击跳转考试</strong></a>');
                });*/
            },
            code: function(){
                window.playInterval = setInterval(() => {
                    var codeInput = document.querySelector("#txtCheckCode");
                    if(codeInput){
                        var inputValue = codeInput.value.trim();

                        // 如果输入内容不足5个字符，则直接退出
                        if (inputValue.length < 5) {
                            console.log("输入的内容不足5个字符");
                            return; // 跳出函数或当前逻辑块
                        }

                        // 如果输入内容超过5个字符，则截取前5个字符
                        if (inputValue.length > 5) {
                            inputValue = inputValue.substring(0, 5);
                            codeInput.value = inputValue; // 将截取后的内容重新赋值给输入框
                        }
                        var btnYes = document.querySelector("#btnYes");
                        btnYes.click();
                    }
                }, 1000);
            }
        }
    }

    function getTeacher() {
        return {
            dealProblem: function () {
                localStorage.removeItem(keyTest)
                localStorage.removeItem(keyResult)
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
    // Your code here...
})();