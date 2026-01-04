// ==UserScript==
// @name         奥鹏自动答题脚本
// @namespace    http://tampermonkey.net/
// @version      2022.3.21.2
// @description  自动从接口获取答案并自动填写(需要答两次(可以全部选A),生成错题本后才会生效)
// @author       ｙｏｕｎｇｙｙ
// @require      https://code.jquery.com/jquery-3.6.0.js
// @match        https://learn.open.com.cn/StudentCenter/OnLineJob/TestPaper*
// @match        http://learn.open.com.cn/StudentCenter/MyWork/UndoneWork*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441072/%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/441072/%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 全局问题
let question;
// 错题本
let wrongList = [];
// 错题本中不包含的题
let okList = [];
let get_point = false;
let getHomework = "homeworkapi.open.com.cn/getHomework";

// 封装ajax
function addXMLRequestCallback(callback) {
    let oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            try {
                oldSend.apply(this, arguments);
            } catch (e) {
                console.log(e);
            }
        }
    }
}

// 获取url参数信息
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

function req(url, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success(data) {
            callback(data)
        }
    });
}

function selectA(list) {
    list.forEach(row => {
        // 获取答案选项
        const select = $(`div [itemid="${row.I1}"] li`);
        select.eq(0).click()
    })
}

// 根据错题本获取正确答案
function initquestion(question) {
    // 找出的问题数组
    $(".Test-Info-Right h2").text("自动答题中")
    let list = question.data.paperInfo.Items;
    wrongList.forEach(item => {
        let bust = (new Date()).getTime();
        let t = (new Date()).getTime() + 20;
        req(`https://learn.open.com.cn/StudentCenter/OnlineJob/GetQuestionDetail?bust=${bust}&itemBankId=${item.ItemBankId}&questionId=${item.QuestionId}&_=${t}`, (data) => {
            if (data.status === 1) {
                alert(data.message)
                return
            }
            const choices_list = data.data.Choices;
            list.forEach(row => {
                // 获取答案选项
                const select = $(`div [itemid="${row.I1}"] li`);

                if (data.data.I2 === row.I2) {
                    // 取消默认选中的 以及包含Choosed 样式的
                    for (let i = 0; i < select.length; i++) {
                        if (select.eq(i).hasClass("Choosed")) {
                            select.eq(i).click()
                        }
                    }

                    // 根据题目判断答案
                    for (let i = 0; i < choices_list.length; i++) {
                        if (choices_list[i].IsCorrect) {
                            select.eq(i).click()
                        }
                    }
                }
            })
        })
    })
}


(function () {
    'use strict';
    let url = window.location.href;
    if (url.includes("StudentCenter/OnLineJob/TestPaper")) {
        console.log("开始答题");
        addXMLRequestCallback(xhr => {
            xhr.addEventListener("load", () => {
                if (xhr.responseURL.includes(getHomework)) {
                    if (!get_point) {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            // 查询到接口后阻止继续监听
                            get_point = true
                            question = JSON.parse(xhr.responseText);
                            // 默认选中A
                            selectA(question.data.paperInfo.Items)
                            let bust = (new Date()).getTime();
                            let rangeKey = JSON.parse(question.data.stuHomeWorkInfo.rangeKey);
                            let courseExerciseId = getQueryVariable('courseExerciseId');
                            let t = (new Date()).getTime();
                            // 获取错题记录
                            let allWrongList = `https://learn.open.com.cn/StudentCenter/OnlineJob/GetWrongQuestions?bust=${bust}&courseid=${rangeKey.CourseId}&courseExerciseId=${courseExerciseId}&studentHomeworkId=${question.data.stuHomeWorkInfo.studentHomeworkId}&homeCourseId=${question.data.homeWorkInfo.courseId}&_=${t}`

                            req(allWrongList, (dataasd) => {
                                if (dataasd.status === 0) {
                                    wrongList = dataasd.data.Rows
                                    setTimeout(() => {
                                        console.log("延迟")
                                    }, 1000)
                                    initquestion(question);
                                } else {
                                    alert(dataasd.message + "\n需要先答一次(可以全部选A),生成错题本后才会生效\n本次将会默认全选A，提交答案后在重新做一次即可")
                                }
                            })
                        }
                    }
                }
            });
        });
    }
})();
