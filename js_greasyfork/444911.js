// ==UserScript==
// @name         奥鹏自动答题脚本--基于youngyy版本修改
// @namespace    http://tampermonkey.net/
// @version      2022.5.15
// @description  自动从接口获取答案并自动填写[需要答两次(默认全选程序生成的错误答案),生成错题本后才会生效]
// @author       hhq
// @require      https://code.jquery.com/jquery-3.6.0.js
// @match        https://learn.open.com.cn/StudentCenter/OnLineJob/TestPaper*
// @match        http://learn.open.com.cn/StudentCenter/MyWork/UndoneWork*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444911/%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC--%E5%9F%BA%E4%BA%8Eyoungyy%E7%89%88%E6%9C%AC%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/444911/%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC--%E5%9F%BA%E4%BA%8Eyoungyy%E7%89%88%E6%9C%AC%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
// 源代码版本 https://greasyfork.org/zh-CN/scripts/441072-%E5%A5%A5%E9%B9%8F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC
// 基于原作者 youngyy 的源代码修改而来,获取答案的思路很nice
// 添加加了点统计信息,部分提示,默认选择错误答案
// 解决题目相同但选项不同的问题

// 全局问题
let question;
// 错题本
let wrongList = [];
// 错题本中不包含的题
// let okList = [];
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
        },
        error(e) {
            log('请求失败,1秒后重新请求.地址' + url);
            setTimeout(() => {
                req(url, callback);
            }, 1000)
        }
    });
}


// 根据错题本获取正确答案
function initquestion(question) {
    //自动答题开始
    intiTotal();
    $("#total_msg").text("自动答题中,请勿操作...")

    // 找出的问题数组
    let questionList = question.data.paperInfo.Items;
    let wrongGetTotal = 0;

    wrongList.forEach(item => {
        let bust = (new Date()).getTime();
        let t = (new Date()).getTime() + 20;
        req(`https://learn.open.com.cn/StudentCenter/OnlineJob/GetQuestionDetail?bust=${bust}&itemBankId=${item.ItemBankId}&questionId=${item.QuestionId}&_=${t}`, (data) => {
            wrongGetTotal++;
            if (wrongGetTotal >= wrongList.length) {
                //自动答题结束
                // alert('自动答题结束');
                $("#total_msg").text("自动答题结束");
            }

            if (data.status === 1) {
                alert(data.message)
                return
            }

            let wrongData = data.data;
            selectRightAnswer(questionList, wrongData)
        })
    })
}


function selectRightAnswer(questionList, wrongData, isSub) {

    const choicesList = wrongData.Choices;

    //遍历当前题目,查找该错题
    questionList.forEach(row => {

        //题目跟错题匹配
        if (wrongData.I2 === row.I2 ) {

            // 存在子题目
            if (row.Sub.length > 0) {
                wrongData.Sub.forEach(wrongSub => {
                    selectRightAnswer(row.Sub, wrongSub, true)
                })
            }

            //无答案
            if (choicesList.length <= 0) {
                if (!isSub) {
                    writeTotal++;
                    showTotal();
                }
                return;
            }

            //验证选项也相同
            if (identical(wrongData.I6, row.I6)) {
                if (!isSub) {
                    writeTotal++;
                    showTotal();
                }

                // console.log('存在的错题')
                // console.log(data)

                // 获取答案选项
                const select = $(`div [itemid="${row.I1}"] li`);
                selectRightColor(select, isSub);

                // 取消默认选中的 以及包含Choosed 样式的
                for (let i = 0; i < select.length; i++) {
                    if (select.eq(i).hasClass("Choosed")) {
                        select.eq(i).click()
                    }
                }

                // 根据数据判断勾选答案
                for (let i = 0; i < choicesList.length; i++) {
                    if (choicesList[i].IsCorrect) {
                        select.eq(i).click()
                    }
                }
            }

        }
    })
}



//判断一维数组是否相同
function identical(a, b) {
    if (!($.isArray(a) && $.isArray(b) && a.length === b.length)) {
        return false;
    }

    for (let i = 0, len = a.length; i < len; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

//全部选择不存在的答案
function selectError(data) {
    let list = (data.answerInfo === "")? data.paperInfo.Items : data.answerInfo.Items;

    for (let i = 0, len = list.length; i < len; i++) {
        errorInit(list[i]);
    }
}

function errorInit(row, isSub) {
    // 存在子选项时,处理子选项
    if (row.Sub.length > 0) {
        let sub = row.Sub;
        for (let i = 0, len = sub.length; i < len; i++) {
            errorInit(sub[i], true);
        }
        return;
    }

    let CancelRadius = '';
    let Choosed = '';
    let itemSelect = row.I15;

    //生成错误项
    if ($(`div [itemid="${row.I1}"] li i`).hasClass('Cancel-Radius')) {
        CancelRadius = 'Cancel-Radius';
    }
    if (itemSelect.length > 0 && itemSelect[itemSelect.length - 1] >= $(`div [itemid="${row.I1}"] li`).length) {
        Choosed = 'Choosed';
    }
    $(`div [itemid="${row.I1}"] ul`).append(`<li class="Item-Option ${Choosed}"><i class="${CancelRadius}">错</i>错误答案</li>`);


    // 获取答案选项
    let select = $(`div [itemid="${row.I1}"] li`);
    selectAlertColor(select, isSub);


    // 取消默认选中的 以及包含Choosed 样式的
    for (let i = 0, len = itemSelect.length; i < len; i++) {
        select.eq(itemSelect[i]).click();
    }

    select.eq(-1).click();
}

//添加颜色
function selectRightColor(select, isSub) {
    if (isSub) {
        select.parents('.Subject-Description').find('.Subject-Title').attr('style', 'background-color: #none;');
    } else {
        select.parents('.Subject-Area').find('.Subject-Title').attr('style', 'background-color: #none;');
    }
}

function selectAlertColor(select, isSub) {
    if (isSub) {
        select.parents('.Subject-Description').find('.Subject-Title').attr('style', 'background-color: #ff4949;');
    } else {
        select.parents('.Subject-Area').find('.Subject-Title').attr('style', 'background-color: #ff4949;');
    }
}


//统计信息
let questionTotal = 0;
let wrongTotal = 0;
let writeTotal = 0;

function showTotal() {
    $("#total_text").html(
        `当前考试${questionTotal}题,已自动答题${writeTotal}题(错题库共${wrongTotal}题)
        <br>若自动答题数太少可根据考试机会多提交几次,扩大错题库
        <br><span style="color: #ff4949;">红色标记为不存在错题库中的题目,最后一次考试机会中请手动选择答案后提交</span>
`
    )
}


function intiTotal() {
    questionTotal = question.data.paperInfo.Items.length;
    wrongTotal = wrongList.length;
}

function intiMsg() {
    $('.Top-Test-Info.fixed').css('z-index', '5');
    $(".Top-Test-Info").append('<div id="total_msg" style="color: #23cfad;"></div>').append('<div id="total_text"></div>')
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
                            window.question = question = JSON.parse(xhr.responseText);

                            // 默认选中一个错误的答案
                            selectError(question.data)

                            intiMsg();
                            $("#total_msg").text("生成错误答案...");

                            let bust = (new Date()).getTime();
                            let rangeKey = JSON.parse(question.data.stuHomeWorkInfo.rangeKey);
                            let courseExerciseId = getQueryVariable('courseExerciseId');
                            let t = (new Date()).getTime();
                            // 获取错题记录
                            let allWrongList = `https://learn.open.com.cn/StudentCenter/OnlineJob/GetWrongQuestions?bust=${bust}&courseid=${rangeKey.CourseId}&courseExerciseId=${courseExerciseId}&studentHomeworkId=${question.data.stuHomeWorkInfo.studentHomeworkId}&homeCourseId=${question.data.homeWorkInfo.courseId}&_=${t}`

                            req(allWrongList, (dataasd) => {
                                if (dataasd.status === 0) {
                                    // alert('点击开始自动答题');
                                    wrongList = dataasd.data.Rows
                                    initquestion(question);
                                } else {
                                    alert(dataasd.message + "\n需要先答一次,生成错题本后才会生效\n本次将会默认全选程序生成的错误答案，提交答案后在重新做一次即可")
                                    $("#total_msg").text("\n需要先答一次,生成错题本后才会生效\n本次将会默认全选程序生成的错误答案，提交答案后在重新做一次即可")
                                    $(".Subject-Description").attr('style', '');
                                }
                            })
                        }
                    }
                }
            });
        });
    }
})();
