// ==UserScript==
// @name         广东新安职业技术学院自动学习脚本
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  广东新安职业技术学院自动学习脚本v 1.0
// @author       xiyue
// @match        https://*.edu-edu.com/*
// @match        https://*.edu-edu.com.cn/*
// @match        https://*.edu-xl.com/*
// @icon         https://mc.furryworld.top/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/js-cookie/latest/js.cookie.min.js
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/js-cookie/latest/js.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432831/%E5%B9%BF%E4%B8%9C%E6%96%B0%E5%AE%89%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/432831/%E5%B9%BF%E4%B8%9C%E6%96%B0%E5%AE%89%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// https://hnilearning.edu-xl.com/top.html

(function() {
    'use strict';
    // 视频模块
    var __video,
        dt,
        url = window.location.href
    // video
    function gets() {
        __video = document.querySelector("video")
        if (__video && url.includes("cws.edu-edu.com/")) {
            console.log("")
            document.querySelector(".ivu-switch.ivu-switch-default").click()
            dt = document.querySelector(".mediaDuration dt")
            dt.innerText = "[代理运行中] --- " + dt.innerText

            function play() {
                __video = document.querySelector("video")
                if (document.querySelector(".ivu-modal").style.display === "none") {
                    if (!document.querySelector(".prism-play-btn").className.includes("playing")) {
                        document.querySelector(".prism-play-btn").click()
                    } else {
                        try {
                            __video.play()
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    setTimeout(play, 1000)
                } else {
                    setTimeout(play, 1000)
                }
                if (document.querySelector(".alert-modal .ivu-modal-mask").style.display === "") {
                    console.log("停止计时警告")
                    document.querySelector(".btn.ivu-btn.ivu-btn-primary").click()
                }
            }
            play()
            // 答题模块
            var lastQ = "",
                ends = 10,
                sts = 0

            function anss() {
                if (document.querySelector(".ivu-modal").style.display !== "none") {
                    if (sts === 0) {
                        console.log("答题")
                    }
                    var ans = document.querySelector(".positiveSolution").innerText.replace(/【答案】/, "").replace(/\s/g, "").split("")
                    var sel = []
                    for (var i = 0; i < ans.length; i++) {
                        sel.push(ans[i].toUpperCase().charCodeAt() - 65)
                    }
                    if (sel.length) {
                        if (lastQ !== document.querySelectorAll(".question-stem-content-preview")[1].innerText || sts === ends) {
                            sts = 0
                            lastQ = document.querySelectorAll(".question-stem-content-preview")[1].innerText
                            var ansArr = document.querySelectorAll(".question-option")
                            for (var i = 0; i < sel.length; i++) {
                                console.log(ansArr[sel[i]], ans, sel)
                                try {
                                    if (!ansArr[sel[i]].querySelector(".mark").className.includes("correct")) {
                                        ansArr[sel[i]].querySelector(".mark").click()
                                    }
                                } catch (err) {
                                    console.log(err)
                                }
                            }

                            document.querySelector(".ivu-btn.ivu-btn-primary").click()
                            setTimeout(function() {
                                document.querySelector(".ivu-btn.ivu-btn-primary").click()
                                anss()
                            }, 1000)
                        } else {
                            sts++
                            console.log("等待题目加载")
                            setTimeout(anss, 500)
                        }
                    } else {
                        setTimeout(anss, 500)
                    }
                } else {
                    setTimeout(anss, 500)
                }
            }
            anss()
        } else {
            setTimeout(gets, 1000)
        }
    }
    gets()
    // 作业
    function zuoye() {
        if (url.includes("edu-edu.com.cn")) {
            console.log("作业页面")
            if (url.includes("doexam")) {
                datiView()
            } else if (url.includes("doresult")) {
                refs()
            } else if (url.includes("doview")) {
                getId()
            }
        }

        // 新 答题模块
        function datiView() {
            document.querySelector(".ui-paper-iframe").onload = function() {
                var iframeDocument = document.querySelector(".ui-paper-iframe").contentDocument
                var insarr = []
                var tmList = getEls([".ui-question.ui-question-sub.ui-question-1", ".ui-question.ui-question-independency.ui-question-1", ".ui-question.ui-question-independency.ui-question-2"])

                function getEls(arrs) {
                    for (var i = 0; i < arrs.length; i++) {
                        var ass = iframeDocument.querySelectorAll(arrs[i])
                        for (var j = 0; j < ass.length; j++) {
                            insarr.push(ass[j])
                        }
                    }
                    return insarr
                }
                console.log(iframeDocument)
                console.log(tmList.length, tmList)
                if (tmList.length) {
                    console.log(Cookies.get("ids"))
                    var ids = Cookies.get("ids") || url.replace(/^.+doexam\//, "").replace(/_.+/, "")
                    axios.get(`https://${window.location.host}/exam/student/exam/answer/${ids}`)
                        .then(function(response) {
                            console.log(response)
                            if (response.data.success) {
                                var answers = response.data.answers
                                console.log(answers);
                                var colli = 0
                                for (var i = 0; i < tmList.length; i++) {
                                    var lis = [0]
                                    if (answers[colli]) {
                                        var lis_a = "a"
                                        if (answers[colli].answer !== "") {
                                            lis_a = answers[colli].answer
                                        } else {
                                            colli++
                                            lis_a = answers[colli].answer
                                        }
                                        lis_a = lis_a.split("")
                                        for (var j = 0; j < lis_a.length; j++) {
                                            lis[j] = lis_a[j].toUpperCase().charCodeAt() - 65
                                        }
                                    }
                                    for (var k = 0; k < tmList[i].querySelectorAll("li").length; k++) {
                                        tmList[i].querySelectorAll("li")[k].className = ""
                                        console.log(tmList[i].querySelectorAll("li")[k])
                                    }
                                    for (var j = 0; j < lis.length; j++) {
                                        if (!tmList[i].querySelectorAll("li")[lis[j]].className.includes("ui-option-selected")) {
                                            tmList[i].querySelectorAll("li")[lis[j]].querySelector("span").click()
                                        }
                                    }
                                    document.querySelector("#next-btn").click()
                                    colli++
                                }
                                if (Cookies.get("ids")) {
                                    iframeDocument.querySelector(".ui-question-group-title").innerText += " -- [答题完毕 1.5 秒后自动提交]"
                                } else {
                                    iframeDocument.querySelector(".ui-question-group-title").innerText += " -- [无答案,随机填写 1.5 秒后自动提交]"
                                }
                                console.log("答题完成")
                                setTimeout(function() {
                                    document.querySelector(".ui-action-submit").click()
                                    document.querySelector(".ui-action-bar button").click()
                                }, 1500)
                            } else {
                                for (var i = 0; i < tmList.length; i++) {
                                    tmList[i].querySelectorAll("li")[0].querySelector("span").click()
                                    document.querySelector("#next-btn").click()
                                }
                                iframeDocument.querySelector(".ui-question-group-title").innerText += " -- [无答案,随机填写 1.5 秒后自动提交]"
                                console.log("答题完成")
                                setTimeout(function() {
                                    document.querySelector(".ui-action-submit").click()
                                    document.querySelector(".ui-action-bar button").click()
                                }, 1500)
                            }
                        })
                        .catch(function(error) {
                            alert("网络故障, 请刷新页面, 或等待一段时间后再尝试")
                            console.log(error);
                        });
                } else {
                    console.log("等待加载完成")
                    setTimeout(zuoye, 1000)
                }
            }
        }

        // 刷新页面
        function refs() {
            var hhs = document.createElement("h1")
            var score = document.querySelector(".ui-score")
            if (score) {
                var ns = parseInt(score.innerText)
                console.log(isNaN(ns))
                if (isNaN(ns)) {
                    console.log("等待得分刷新")
                    hhs.innerText = "[自动脚本] --- 等待分数刷新"
                    document.querySelector("#ui-client-wrapper h2").appendChild(hhs)
                    setTimeout(function() {
                        window.location.reload()
                    }, 1000)
                } else if (ns === 100.0) {
                    hhs.innerText = "[自动脚本] --- 满分,不需要继续答题"
                    document.querySelector("#ui-client-wrapper h2").appendChild(hhs)
                } else {
                    hhs.innerText = "[自动脚本] --- 正在获取答案[分数刷新有延迟,查看分数为100就不用继续作答了] [注意需要同意弹出窗口]"
                    document.querySelector("#ui-client-wrapper h2").appendChild(hhs)
                    setTimeout(function() {
                        document.querySelectorAll(".ui-op-button a")[0].click()
                    }, 3000)
                    setTimeout(function() {
                        hhs.innerText = "[自动脚本] --- 正在答题"
                        document.querySelectorAll(".ui-op-button a")[1].click()
                    }, 7000)
                }
            } else {
                hhs.innerText = "[自动脚本] --- 没有完成记录,请先完成一次考试再到此页面"
                document.querySelector("#ui-client-wrapper h2").appendChild(hhs)
            }
        }
        // 获取试卷id
        function getId() {
            var urid = window.location.href.replace(/.+doview\//, "").replace(/\/.+/, "")
            Cookies.set("ids", urid)
            setTimeout(function() {
                window.close()
            }, 1000)
        }
    }
    zuoye()

    // 答题模块
    function datiViews() {
        document.querySelector(".ui-paper-iframe").onload = function() {
            var iframeDocument = document.querySelector(".ui-paper-iframe").contentDocument
            console.log(iframeDocument)
            var tmList = iframeDocument.querySelectorAll(".ui-question.ui-question-independency.ui-question-1")
            if (tmList.length) {
                localforage.getItem("answers").then(function(value) {
                    if (value) {
                        for (var i = 0; i < tmList.length; i++) {
                            var qus = tmList[i].querySelector(".ui-question-content-wrapper").innerText
                            var ans = tmList[i].querySelectorAll(".ui-question-options li")
                            var ttls = "没有答案"
                            for (var j = 0; j < value.length; j++) {
                                if (value[j].qus === qus) {
                                    ttls = value[j].ans
                                }
                            }
                            console.log(qus, ttls)
                            ans[0].querySelector("span").click()
                            for (var j = 0; j < ans.length; j++) {
                                if (ans[j].querySelector("div").innerText === ttls) {
                                    ans[j].querySelector("span").click()
                                }
                            }
                        }
                        console.log("答题结束")
                    } else {
                        console.log("没有数据")
                    }
                })
            } else {
                console.log("等待加载完成")
                setTimeout(zuoye, 1000)
            }
        }
    }
    // 记录答案模块
    function saveD() {
        console.log("记录答案模块")

    }
    // 作业 管理器 - [弃用]
    var deruntime = null

    function zyMaster() {
        if (url.includes("https://hieugk.edu-xl.com/")) {
            console.log("主页面")

            function mainView() {
                var deiframes = document.querySelector("#iframUrl").contentDocument
                if (deiframes.querySelector(".examination_top.main h3") && deiframes.querySelector(".examination_top.main h3").innerText.includes("平时作业")) {
                    deiframes = document.querySelector("#iframUrl").contentDocument
                    console.log("平时作业管理页面")
                    // 判断是否在作业页面
                    function cde() {
                        deiframes = document.querySelector("#iframUrl").contentDocument
                        if (deiframes.querySelector(".examination_top.main h3") && deiframes.querySelector(".examination_top.main h3").innerText.includes("平时作业")) {
                            setTimeout(cde, 1000)
                        } else {
                            console.log("退出作业管理页面")
                            mainView()
                        }
                    }
                    cde()
                    // 运行时
                    function runs() {
                        if (deruntime) {
                            clearTimeout(deruntime)
                        }
                        deruntime = setTimeout(runs, 500)

                    }
                    // 刷新作业列表
                    function updateZy() {
                        localforage.getItem("works").then(function(value) {
                            console.log("更新", value)
                            var list = deiframes.querySelectorAll(".task_list.main li")
                            for (var i = 0; i < list.length; i++) {
                                var ctts = check(list[i].querySelector("h3").innerText.substring(1))
                                if (ctts === -1) {
                                    value.push({
                                        name: list[i].querySelector("h3").innerText.substring(1),
                                        fraction: 0,
                                        step: 0,
                                        ansear: []
                                    })
                                } else {
                                    list[i].querySelector(".task_box_right a").innerText += ` (${value[ctts].fraction})`
                                }
                            }
                            localforage.setItem("works", value).then(function(value1) {
                                console.log("更新完成", value1)
                            })

                            function check(titles) {
                                for (var i = 0; i < value.length; i++) {
                                    if (value[i].name === titles) {
                                        return i
                                    }
                                }
                                return -1
                            }
                        })
                    }
                } else {
                    setTimeout(mainView, 1000)
                }
            }
            mainView()
        }
    }
    zyMaster()
})();