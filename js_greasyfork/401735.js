// ==UserScript==
// @name        形势政策刷题
// @namespace   Violentmonkey Scripts
// @match       https://hfut.xuetangx.com/*
// @version     1.1.7
// @author      QuarkWitcher
// @grant       GM_xmlhttpRequest
// @require     https://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.js
// @description 起飞
// @downloadURL https://update.greasyfork.org/scripts/401735/%E5%BD%A2%E5%8A%BF%E6%94%BF%E7%AD%96%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/401735/%E5%BD%A2%E5%8A%BF%E6%94%BF%E7%AD%96%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==

let getedAnswer = {}

let config = {
    mainElecs: "",//主要节点选则器路径
    questionText: "",//相对于主要节点 获取问题文本 其text()应为问题文本
    questionNum: "",//相对于主要节点 text() 唯一标识符
    questionInput: "",//相对于主要节点  获取到答案后点击该元素 
    answer: "",//应当和与input绑定 text()获取答案文本
}

$(window).keydown(function (event) {
    switch (event.key) {
        case 's':

            const config = {
                "mainElecs": ".paper-list>li",
                "questionText": "span.content",
                "questionNum": "span.num",
                "questionInput": "input",
                "answer": ".answer>label>span"
            };

            String.prototype.replaceAll = function (s1, s2) {
                return this.replace(new RegExp(s1, "gm"), s2);
            }

            let lis = $(config.mainElecs);
            if (lis.length == 0) {
                alert("还没加载完，请重试");
                return false;
            }
            let Questions = []
            for (let i = 0; i < lis.length; i++) {
                const questionText = $(lis[i]).find(config.questionText).text()
                const num = $(lis[i]).find(config.questionNum).text()
                const qi = $(lis[i]).find(config.questionInput)
                const qa = $(lis[i]).find(config.answer)
                const answerList = []
                for (let count = 0; count < qi.length; count++) {
                    answerList.push({
                        ansInput: $(qi[count]),
                        ansText: $(qa[count]).text()
                    })
                }
                Questions.push({
                    mainElec: $(lis[i]),
                    question: questionText,
                    questionNum: num,
                    answerList: answerList
                })
            }
            console.log(Questions)
            blockGetAnswer(Questions, 0)
    }
});

function blockGetAnswer(lis, index) {
    if (index < lis.length) {
        let question = lis[index]
        getAnswer(question);
        setTimeout(function () { blockGetAnswer(lis, index + 1); }, 2000 + Math.floor(Math.random() * 2000));
    }
    else {
        var text = ''
        Object.keys(getedAnswer).forEach(function (key) {
            if (getedAnswer[key] == false) {
                text += key + ','
            }
        })
        if (text == '') {
            alert('全部完成')
        }
        else {
            alert("没有搜索到" + text)
            lis[index - 1].append(
                `   [全部完成${"没有搜索到" + text}]`
            )
        }
    }
}

function blockClick(lis, index) {
    if (index < lis.length) {
        if (!$(lis[index]).is(":checked")) {
            lis[index].click()
        }
        setTimeout(function () { blockClick(lis, index + 1); }, 3000 + Math.floor(Math.random() * 3000));
    }
}


function getAnswer(question) {
    const index = question.num
    getedAnswer[index] = false
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://api.xmlm8.com/tk.php?t=' + encodeURIComponent(question.question),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        onload: function (xhr) {
            const result = JSON.parse(xhr.responseText)
            const answer = result.da.split('\u0001')
            question.mainElec.append(
                `>>>${JSON.stringify(answer)}<<<`
            )
            console.log("====================================")
            console.log(xhr.responseText)
            clickList = []
            for (let i = 0; i < question.answerList.length; i++) {
                for (let j = 0; j < answer.length; j++) {
                    if (question.answerList[i].ansText == answer[j]) {
                        console.log("选中", answer[j])
                        clickList.push(question.answerList[i].ansInput)
                        getedAnswer[index] = true
                    }
                }
            }
            blockClick(clickList, 0)
        },
        ontimeout: function () {
            console.log('超时')
            question.mainElec.append(
                `>>> 获取失败 <<< `
            )
        }
    })
}


function getAnswer_0(question) {
    const index = question.num
    getedAnswer[index] = false
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://wk.bcaqfy.xin/cxapi?tm=' + encodeURIComponent(question.question),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        onload: function (xhr) {
            const getStr = xhr.responseText.replaceAll("", "||")
            const result = JSON.parse(getStr)
            const answer = result.answer.split('||')
            question.mainElec.append(
                `>>>${result.answer}<<<`
            )
            console.log("====================================")
            console.log(result.tm)
            console.log(answer)
            clickList = []
            for (let i = 0; i < question.answerList.length; i++) {
                for (let j = 0; j < answer.length; j++) {
                    if (question.answerList[i].ansText == answer[j]) {
                        console.log("选中", answer[j])
                        clickList.push(question.answerList[i].ansInput)
                        getedAnswer[index] = true
                    }
                }
            }
            blockClick(clickList, 0)
        },
        ontimeout: function () {
            console.log('超时')
            question.mainElec.append(
                `>>> 获取失败 <<< `
            )
        }
    })
}

