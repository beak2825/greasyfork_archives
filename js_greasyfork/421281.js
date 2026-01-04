// ==UserScript==
// @name         人社网公需课
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  打开视频播放页面后即可自动完成所有课程
// @author       浩浩
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_cc.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://jsxx.gdedu.gov.cn/groupIndex/goStudentActPage.do?*
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/play/player?*
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?*
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/examination/subexam?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421281/%E4%BA%BA%E7%A4%BE%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/421281/%E4%BA%BA%E7%A4%BE%E7%BD%91%E5%85%AC%E9%9C%80%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var keyTest = "jixujiaoyuTest";
    var keyResult = "jixujiaoyuResult";
    var keyOther = "jixujiaoyuOther";
    var keyTeacherSkip = "keyTeacherSkip";
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    var huayi = getHuayi();
    console.log(urlTip)

    if (window.location.href.indexOf("91huayi") != -1) {
        if (urlTip == "course_ware_cc.aspx") { //视频页面
            console.log("当前任务: 华医看视频")
            huayi.seeVideo()
        } else if (urlTip == "course_ware_polyv.aspx") {
            console.log("当前任务: 华医看视频2")
            huayi.seeVideo2()
        } else if (urlTip == "exam.aspx") { //考试页面
            console.log("当前任务: 华医考试")
            huayi.doTest()
        } else if (urlTip == "exam_result.aspx") { //考试结果页面
            console.log("当前任务: 华医考试结果审核")
            huayi.doResult()
        }
    }

    if (window.location.href.indexOf("jsxx") != -1) {
        if (urlTip == "goStudentActPage.do") {
            console.log("当前任务: 教师公需课 ")
            getTeacher().dealProblem()
        }
    }

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
        }
    }



    function getHuayi() {
        return {
            seeVideo: function () {
                var old_custom_player_stop = custom_player_stop
                custom_player_stop = function () {
                    old_custom_player_stop()
                    setTimeout(function () {
                        document.querySelector(".inputstyle2").click()
                    }, 1000)
                }

            },
            seeVideo2: function () {
                var old_s2j_onPlayOver = window.s2j_onPlayOver
                window.s2j_onPlayOver = function () {
                    old_s2j_onPlayOver()
                    setTimeout(function () {
                        document.querySelector(".inputstyle2").click()
                    }, 1000)
                }
            },
            doTest: function () {
                var answers = document.querySelectorAll("[id^='gvQuestion_result_']")
                for (var i = 0; i < answers.length; ++i) {
                    var v = answers[i].value
                    document.querySelectorAll("input[value='" + v + "']")[0].click()
                }
                setTimeout(function () {
                    document.querySelector("#btn_submit").click()
                }, 10000)
            },
            doResult: function () {
                var res = document.getElementsByTagName("b")[0].innerText;
                if (res == "考试通过！") { //考试通过
                    console.log("考试通过")
                    var next = document.querySelector(".two");
                    if (next) {
                        next.click();
                    }
                } else { //考试没过
                    console.log("考试未通过")
                    document.querySelector(".button").getElementsByTagName("input")[1].click(); //重新考试
                }

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
                        /*
                        var Div = document.createElement("div");
                        Div.id = "asd_control_div";
                        Div.style = "position: absolute;right:0px;top:0px;";
                        var skip = localStorage.getItem(keyTeacherSkip);
                        skip = (skip == "true" ? "秒刷:开" : "秒刷:关");
                        Div.innerHTML = "<button id='asd_skip_btn' style='background-color: red;cursor: pointer;width:60px;height:60px'>" + skip + "</button>";
                        document.querySelector("html").appendChild(Div);
                        document.querySelector("#asd_skip_btn").addEventListener("click", function () {
                            let v = localStorage.getItem(keyTeacherSkip);
                            v = (v == "true" ? false : true);
                            localStorage.setItem(keyTeacherSkip, v);
                            window.location.reload();
                        })

                        skip = localStorage.getItem(keyTeacherSkip);
                        */
                        var skip = "false";
                        var work;
                        var index_active = 0;
                        var canShowTiMu = true;

                        if (skip == "true") {
                            console.log("秒刷模式")

                            /*
                            work = setInterval(function () {
                                console.log(index_active + "       " + canShowTiMu + "              2das")
                                if (index_active < actives.length && canShowTiMu) {
                                    canShowTiMu = false;
                                    showActivity(actives[index_active].id, true)
                                    index_active = index_active + 1;
                                    let work_one = setInterval(function () {
                                        var fwindow = document.querySelector("iframe[name='qastoreInfo']").contentWindow;
                                        fwindow.document.querySelectorAll("input[name='formMap.optionId']")[0].click(); //先选A
                                        window.clearInterval(work_one)
                                        let work_two = setInterval(function () {
                                            fwindow.document.querySelectorAll("#submit")[0].click(); //提交
                                            window.clearInterval(work_two)
                                            checkIsToAnswerAgain(function () {
                                                console.log("触发回调")
                                                setTimeout(function () {
                                                    canShowTiMu = true
                                                }, 3000)
                                            });
                                        }, 3000)
                                    }, 3000)
                                } else if (index_active >= actives.length && canShowTiMu) {
                                    if (player && player.isPlaying) {
                                        setTimeout(function () {
                                            var duration = player.getDuration(); // 显示总时长
                                            var position = player.getPosition(); // 视频当前时间
                                            if (dyna_pro_over != 'Y' && position != null && position != '0' && position != '' && position != undefined && typeof (position) != 'undefined' && duration != null && duration != '0' && duration != '' && duration != undefined && typeof (duration) != 'undefined' && position > 0) {
                                                //如果触发这个操作后，标识已经完成完成
                                                setDyna(videoId, 'ACT007', 'Y', 'Y', position, '0', '0');
                                                //设置页面的是否完成的标识
                                                $('#dyna_pro_over').val('Y');
                                            }
                                            //上面的是结束标志
                                            window.clearInterval(work)
                                            console.log("当前视频完成")
                                            freshNowVideoFinishState() //更新当前视频的完成标志
                                            var next = getNextVideo()
                                            if (next) {
                                                next.click()
                                                finishTecher()
                                                setTimeout(function () {
                                                    index_active = 0;
                                                    canShowTiMu = true;
                                                }, 10000)
                                            } else {
                                                player.seek(Math.floor(player.getDuration()))
                                                alert("所有视频观看完毕")
                                            }
                                        }, 10000)
                                    }
                                }
                            }, 10000)
*/
                        } else {
                            console.log("自由模式")
                            var oldPlayer = undefined;
                            var canSkip = true;
                            var teach_have_done = false;
                            if (window.special_work) {
                                window.clearInterval(window.special_work)
                            }
                            window.special_work = setInterval(function () {
                                if (player && player.isPlaying && oldPlayer != player) {
                                    console.log("Player换了")
                                    canSkip = true;
                                    oldPlayer = player;
                                    player.setControlbarEnabled(true)
                                    player.setActivityEnabled(false)
                                    player.addEventListener("state", function (evt) { //监听视频播放结束
                                        var newState = evt.data["newState"];
                                        switch (newState) {
                                            case "COMPLETED":
                                                //播放完成，播放下一个视频
                                                /*
                                                setTimeout(function () {
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
                                                }, 3000);
                                                */
                                                break;
                                        }
                                    })
                                    player.addEventListener("activityActivate", function (evt) { //监听题目弹出
                                        console.log("题目弹出")
                                        checkIsToAnswerAgain(function () {
                                            updVedioTime();
                                        });
                                    })
                                    /*
                                    console.log("卧槽")
                                    showActivity(actives[actives.length - 1].id, true);
                                    checkIsToAnswerAgain(function () {
                                        updVedioTime();
                                    });
                                    */
                                }

                                let p = (player.getPosition() + 300);
                                if (canSkip && player.isPlaying) {
                                    if (p > player.getDuration()) {
                                        p = player.getDuration();
                                        canSkip = false;
                                    }
                                   // player.seek(p)
                                    setTimeout(function () {
                                        updVedioTime()
                                        if (!canSkip && !teach_have_done) {
                                            teach_have_done = true;
                                            console.log("当前视频完成666")
                                            var duration = player.getDuration(); // 显示总时长
                                            var position = player.getPosition(); // 视频当前时间
                                            if (dyna_pro_over != 'Y' && position != null && position != '0' && position != '' && position != undefined && typeof (position) != 'undefined' && duration != null && duration != '0' && duration != '' && duration != undefined && typeof (duration) != 'undefined' && position > 0) {
                                                //如果触发这个操作后，标识已经完成完成
                                                setDyna(videoId, 'ACT007', 'Y', 'Y', position, '0', '0');
                                                //设置页面的是否完成的标识
                                                $('#dyna_pro_over').val('Y');
                                            }
                                            setTimeout(function(){
                                                freshNowVideoFinishState() //更新当前视频的完成标志
                                                var next = getNextVideo()
                                                if (next) {
                                                    next.click()
                                                    finishTecher()
                                                } else {
                                                    player.seek(Math.floor(player.getDuration()))
                                                    alert("所有视频观看完毕")
                                                }
                                            }, 3000)
                                        }
                                    }, 1000)
                                }

                            }, 5000)

                        }
                    }

                }

                function checkIsToAnswerAgain(callback) {
                    window.clearInterval(window.work_special_teacher)
                    localStorage.removeItem("teacher_answer")
                    window.work_special_teacher = setInterval(function () { //检查是不是做错了
                        var fwindow = document.querySelector("iframe[name='qastoreInfo']").contentWindow;
                        var reBtn = fwindow.document.querySelector("#repeatSubmit");
                        var neBtn = fwindow.document.querySelector("#nextSubmit");
                        var subBtn = fwindow.document.querySelectorAll("#submit")[0];
                        if (reBtn) { //做错了，从做
                            var answer = fwindow.document.querySelector(".font_green.margin_r25").innerText.trim().substring(5).split(",");
                            for (var i = 0; i < answer.length; ++i) {
                                answer[i] = answer[i].charCodeAt(0) - "A".charCodeAt(0);
                            }
                            localStorage.setItem("teacher_answer", fwindow.document.querySelector(".font_green.margin_r25").innerText.trim().substring(5))
                            reBtn.click();
                        } else if (neBtn) { //做对了
                            //console.log("做对了")
                            neBtn.click();
                            window.clearInterval(window.work_special_teacher)
                            //console.log("开始回调")
                            if (callback) {
                                //console.log("真的回调了")
                                callback()
                                //updVedioTime();
                            }
                        } else if (subBtn) {
                            var fwindow = document.querySelector("iframe[name='qastoreInfo']").contentWindow;
                            let answer = localStorage.getItem("teacher_answer")
                            if (answer) {
                                answer = answer.split(",");
                                for (var i = 0; i < answer.length; ++i) {
                                    answer[i] = answer[i].charCodeAt(0) - "A".charCodeAt(0);
                                }
                                for (var i = 0; i < answer.length; ++i) {
                                    fwindow.document.querySelectorAll("input[name='formMap.optionId']")[answer[i]].click(); //选正确答案
                                }
                                localStorage.removeItem("teacher_answer")
                            } else {
                                var d = fwindow.document.querySelectorAll("input[name='formMap.optionId']")[0];
                                if (d) {
                                    d.click(); //先选A
                                }
                            }

                            subBtn.click()
                        }
                    }, 3000)
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

    function getRenli() {
        return {
            seeVideo: function () {
                var myinter = setInterval(function () {
                    if (p) {
                        window.clearInterval(myinter)
                        console.log("Clear")
                        if (p.getStatus() != "playing") {
                            p.play()
                        }

                        p.on("ended", function (e) {
                            setTimeout(function () {
                                next()
                            }, 1000)
                        })

                        checkTimu()
                    }
                }, 1000)

                var myinter2 = setInterval(function () {
                    var errorDiv = document.querySelector(".prism-ErrorMessage")
                    if (errorDiv && errorDiv.style.display != "none") {
                        document.querySelector(".prism-button.prism-button-retry").click()
                    }
                }, 60000)

                function checkTimu() {
                    setInterval(function () {
                        var panel = document.querySelector(".panel.window")
                        if (panel && panel.style.display != "none") {
                            console.log("题目弹出")
                            document.querySelectorAll("input[name='panduan']")[0].click()
                            setTimeout(function () {
                                subAnswer();
                                var jack = setInterval(function () {
                                    if (document.querySelectorAll(".l-btn-text")[0]) {
                                        window.clearInterval(jack)
                                        document.querySelectorAll(".l-btn-text")[0].click()
                                    }

                                }, 3000)
                            }, 3000)
                        }
                    }, 10000)
                }

                function next() { //暂时没用
                    var n = document.querySelectorAll(".append-plugin-tip a")[1]
                    if (n) {
                        n.click()
                    } else {
                        alert("全部看完了")
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
                    var jds = jd.querySelectorAll(".exam-subject-text-quecontent") //判断题选项
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

                    setTimeout(function () {
                        document.querySelector("#exam_sub").click() //提交
                        setTimeout(function () {
                            document.querySelectorAll(".panel.window.messager-window .l-btn.l-btn-small")[0].click() //点击确定
                        }, 1000)
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
                    if (!data.answer) {
                        switch (answers[i].lastElementChild.innerText) {
                            case "正确答案：正确": {
                                data.answer = ["A"]
                                break
                            }
                            case "正确答案：错误": {
                                data.answer = ["B"]
                                break
                            }
                            default: {
                                console.log("获取答案错误")
                            }
                        }
                    }
                    var f = findData(data.timu)
                    if (f == -1) {
                        res.push(data)
                    } else {
                        res[f].answer = data.answer
                    }

                }
                localStorage.setItem(keyResult, JSON.stringify(res))
                localStorage.setItem(keyOther, "true")

                setTimeout(function () {
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
    // Your code here...
})();