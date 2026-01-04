// ==UserScript==
// @name        航天云课堂答题
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  航天云课堂自动答题脚本，多答几次可以更准确
// @author       wxy
// @match        https://train.casicloud.com/*
// @icon         https://xsd.i-xinnuo.com/xnt_pc/favicon.ico

// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @connect      casicloud.com
// @license      GPL-3.0 License

// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/376730-ns%E5%BA%93/code/NS%E5%BA%93.js?version=662553
// @require      https://greasyfork.org/scripts/453803-hotkeys-js/code/hotkeys-js.js?version=1109849
// @downloadURL https://update.greasyfork.org/scripts/457398/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/457398/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(() => {
    'use strict';
    //全局配置参数
    var GLOBAL = {
        fillAnswerDelay: 1E3, //填充答案的延迟，不建议小于0.5秒，默认一秒
        checkTo: null
    }
    //1、定时检测页面逻辑
    //2、如果是《考试记录》页面，读取考试记录列表，读取考卷问题列表
    //3、解析试卷列表，组装题库
    //4、检测答题页面，
    //5、开始答题
    //6、手动提交答题
    // 初始化 init func  这里才是核心
    function init() {
        setInterval(checkLoop, 10 * 1000);
        GLOBAL.checkTo = setInterval(checkAnswer, GLOBAL.fillAnswerDelay)
        window.addEventListener('load', checkLoop, true);
    }
    setTimeout(init, 1000);

    hotkeys('ctrl+alt+t', function () {
        checkLoop();
    });

    // 循环检测
    function checkLoop() {
        checkRecord();
        checkAnswer();
    }

    //检测考试记录页面
    function checkRecord() {
        if (NS.existsDomNode(".dialog-header")) {
            let header = document.getElementsByClassName("dialog-header")
            if (header && header.length > 0) {
                NS.log(header)

                for (let i = 0; i < header.length; i++) {
                    const headDiv = header[i];
                    let iTag = $(headDiv).parent().find("i.icon-close:first");
                    let uuid = "casicExamIds";
                    if (iTag) {
                        uuid = iTag.attr("id") || "casicExamIds";
                    }
                    let titleDiv = headDiv.getElementsByClassName("title");
                    if (titleDiv && titleDiv.length > 0) {
                        if (titleDiv[0].innerText == "考试记录") {
                            getRecordList(uuid)
                        }
                    }
                }
            }
        }
    }

    //获取开始记录
    function getRecordList(uuid) {
        let tds = $("td.btn-operation");
        NS.saveLocalStorageObj("cei_uuid", uuid)
        if (tds && tds.length > 0) {
            for (let i = 0; i < tds.length; i++) {
                const td = tds[i];
                let a = td.getElementsByClassName("btn-detail");
                if (a && a.length > 0) {
                    let href = a[0].getAttribute("href");
                    if (href) {
                        let examId = href.substr(href.lastIndexOf("score-detail/") + 13)
                        if (examId) {
                            let lsIds = readLsObj("cei_" + uuid);
                            lsIds[examId] = lsIds[examId] || false;
                            NS.saveLocalStorageObj("cei_" + uuid, lsIds)
                        }
                    }
                }
            }
            getScoreDetail(uuid);
        }
    }

    function readLsObj(key) {
        return NS.readLocalStorageObj(key) || {};
    }

    //ajax请求得分详情
    function getScoreDetail(uuid) {
        let lsIds = readLsObj("cei_" + uuid);
        let answers = readLsObj("answers_" + uuid);
        //获取token
        let token = readLsObj("token").access_token;
        let updateLs = function (key, value) {
            lsIds[key] = value
            NS.saveLocalStorageObj("cei_" + uuid, lsIds)
        }
        for (let key in lsIds) {
            if (!lsIds[key]) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://train.casicloud.com/api/v1/exam/exam/front/score-detail?examRecordId=" + key + "&_=" + new Date().getTime(),
                    headers: {
                        "Authorization": "Bearer__" + token
                    },
                    onload: function (r) {
                        if (r.status === 200) {
                            let paperJSON = JSON.parse(r.responseText)
                            let questions = paperJSON.paper.questions
                            for (let j = 0; j < questions.length; j++) {
                                const question = questions[j];
                                let qid = question.id;
                                answers[qid] = question.questionAttrCopys
                            }
                            updateLs(key, true);
                            NS.saveLocalStorageObj("answers_" + uuid, answers)
                        }
                    }
                });
            }
        }
    }


    //检测是否是答题页面
    function checkAnswer() {
        let quest = document.getElementsByClassName("question-type-item")
        if (quest && quest.length > 0) {
            let uuid = readLsObj("cei_uuid");
            let answers_ls = readLsObj("answers_" + uuid);
            let questId = quest[0].getAttribute("data-dynamic-key")
            let answer = answers_ls[questId]||[];
            console.log("answer", answer)
            if (answer != undefined) {
                let preview = $("div.preview-list")
                let answers = preview[0].getElementsByClassName("inline-block pointer")
                if (answers && answers.length > 0) {
                    let matchAnswer = false;
                    for (var i = 0; i < answers.length; i++) {
                        let aid = answers[i].getAttribute("id")
                        for (let jk = 0; jk < answer.length; jk++) {
                            const ele = answer[jk];
                            if (ele.type == 0) {
                                if (aid && aid.indexOf("-" + ele.name) > 0) {
                                    answers[i].click();
                                    matchAnswer = true;
                                }
                            }
                        }
                    }
                    if (!matchAnswer) {
                        answers[2].click();
                    }
                    nextQuest(); //提交下一题
                }
            }
        }
    }

    //清除定时任务
    function clearDs() {
        GLOBAL.checkTo & clearInterval(GLOBAL.checkTo)
    }

    //自动下一题
    function nextQuest() {
        let nextBtn = document.getElementsByClassName("btn white border")
        if (nextBtn && nextBtn.length > 0) {
            if (nextBtn.length > 1) {
                nextBtn[1].click()
            } else {
                let textC = nextBtn[0].textContent;
                textC == "上一题" ? clearDs() : nextBtn[0].click()
            }
        }
    }
})();