// ==UserScript==
// @name         同济大学实验室安全教育考试助手
// @namespace    https://gitee.com/xialugui/tongji-aqjy
// @version      0.0.2
// @description  提供试题答案查询功能。
// @author       陆龟
// @license      Apache-2.0
// @copyright    2023,陆龟
// @homepageURL  https://xialugui.github.io/tongji-aqjy
// @supportURL   https://xialugui.github.io/tongji-aqjy
// @contributionURL  https://xialugui.github.io/tongji-aqjy
// @match        http://aqjy.tongji.edu.cn/userOperation!afterLogin.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM_log
// @grant        GM_addStyle
// @require      https://unpkg.com/dexie/dist/dexie.js
// @require      https://cdn.staticfile.org/PapaParse/5.4.1/papaparse.min.js
// @require      https://cdn.staticfile.org/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/473046/%E5%90%8C%E6%B5%8E%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473046/%E5%90%8C%E6%B5%8E%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_log("加载同济大学实验室安全教育考试辅助脚本");
    GM_addStyle(`
        #aqjy-container {
            background: #1a59b7;
            color: #ffffff;
            overflow: hidden;
            z-index: 9999;
            position: fixed;
            padding: 5px;
            text-align: center;
            margin-left: 100px;
            bottom: 0;
            left: 0;
            width: 30%;
            height: 30%;
        }`
    )

    const questionCount = 1886
    const db = new Dexie("TongjiAqjyDatabase");
    $(document).ready(function () {


        initUI()
        if (!db.isOpen()) {
            db.version(1).stores({
                questions: `
                        ++id,
                        type,
                        title,
                        content,
                        answer,
                        analysis
                        `,
            });
        }
        initDb()
    });
    const findButton = $("<button id='aqjy-find'>查询</button>")
    const contentDiv = $("<div id='aqjy-content'></div>")

    function initUI() {
        let container = $("<div id='aqjy-container'></div>")
        let nameText = $("<div><h3>考试助手</h3></div>")
        let processText = $("<div id='aqjy-process'>加载中，请不要刷新页面<p id='aqjy-process-value'></p></div>")

        container.append(nameText)
        container.append(processText)
        findButton.on("click", find)
        container.append(findButton)
        container.append(contentDiv)
        $("body").append(container)
    }

    function callback(data) {
        console.log("data,", data)
    }

    function loadCompleted() {
        $("#aqjy-process").html("试题加载完成，点击查询按钮查题")
    }

    function setProcessValue(count) {
        $("#aqjy-process-value").html(count + "/" + questionCount)
    }

    function initDb() {
        db.questions.count().then(value => {
                console.log("试题已加载！数量：", value)
                if (value >= questionCount) {
                    loadCompleted()
                }
                if (value <= 0) {
                    let question
                    Papa.parse("http://rzd7cswle.hd-bkt.clouddn.com/test.csv",
                        {
                            download: true,
                            step: function (row) {
                                question = row.data
                                db.questions.put({
                                    type: question[0],
                                    title: question[1],
                                    content: question[2],
                                    answer: question[3],
                                    analysis: question[4]
                                }).then(function (key) {
                                    if (key >= questionCount) {
                                        loadCompleted()
                                    } else {
                                        setProcessValue(key)
                                    }
                                })
                            },
                            complete: function () {
                                console.log("试题文件下载成功!");
                            },
                        }
                    )
                }
            }
        )
    }

    function findFailed() {
        findButton.html("查询失败，点击重试")
    }

    function setContentHtml(questions) {
        let content = ""
        for (const question of questions) {
            content += "知识点："+question.type+ "\n"
            content += "题型："+question.title+ "\n"
            content +="题目："+ question.content+ "\n"
            content += "答案："+question.answer+ "\n"
            content += "解析："+question.analysis + "\n"
        }
        contentDiv.html(content)
    }

    function find() {

        let contentPrefix
        try {
            contentPrefix = $("#iframe_updatediv").contents().find("#table1 > tbody>tr:eq(3)>td:eq(1)").html().trim()
                .substring(0, 5);
        } catch (e) {
            findFailed()
        }
        if (contentPrefix === undefined) {
            findFailed();
        } else {
            console.log(
                contentPrefix
            );
            db.questions.where("content").startsWith(contentPrefix).toArray().then(questions => {
                setContentHtml(questions)
            })
        }
    }

})();
