// ==UserScript==
// @name        网课通用脚本
// @namespace   Violentmonkey Scripts
// @match       https://hfut.xuetangx.com/*
// @match       https://hfut.yuketang.cn/*
// @match       https://mooc1-1.chaoxing.com/*
// @match       https://changjiang-exam.yuketang.cn/*
// @version     0.7
// @author      QuarkWitcher
// @grant       GM_xmlhttpRequest
// @require     https://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.js
// @description 通过自行填写JSON文件 识别XML路径自动答题
// @downloadURL https://update.greasyfork.org/scripts/401779/%E7%BD%91%E8%AF%BE%E9%80%9A%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/401779/%E7%BD%91%E8%AF%BE%E9%80%9A%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
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
            try {
                const inputConfig = JSON.parse(prompt("请输入配置JSON:"));
                config.mainElecs = inputConfig.mainElecs;
                config.questionText = inputConfig.questionText;
                config.questionNum = inputConfig.questionNum;
                config.questionInput = inputConfig.questionInput;
                config.answer = inputConfig.answer;
                console.log(config);
            }
            catch (err) {
                alert("JSON输入错误", err)
                return false
            }
            String.prototype.replaceAll = function (s1, s2) {
                return this.replace(new RegExp(s1, "gm"), s2);
            }

            let lis = $(config.mainElecs);
            if (lis.length == 0) {
                alert("获取题目=0，还没加载完或者错误");
                return false;
            }
            let Questions = []
            for (let i = 0; i < lis.length; i++) {
                const questionText = $(lis[i]).find(config.questionText).text()
                const num = $(lis[i]).find(config.questionNum).text()
                const qi = $(lis[i]).find(config.questionInput)
                const qa = $(lis[i]).find(config.answer)
                const answerList = []
                if (qi.length == 2) { //==2 认为为是判断题 认为先正后错 建议手动检查 
                    answerList.push({
                        ansInput: $(qi[0]),
                        ansText: "正确"
                    })
                    answerList.push({
                        ansInput: $(qi[1]),
                        ansText: "错误"
                    })
                }
                else {
                    for (let count = 0; count < qi.length; count++) {
                        answerList.push({
                            ansInput: $(qi[count]),
                            ansText: $(qa[count]).text()
                        })
                    }
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
            alert('搜索全部完成，请手动检查提交')
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
        method: 'POST',
        url: 'http://qackqi.cn/OnlineCourseBot/topic',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: "q=" + encodeURIComponent(question.question) + "&token=",
        onload: function (xhr) {
            const result = JSON.parse(xhr.responseText)
            var answer;
            if (result.answer.indexOf(' --- ') != -1) {
                answer = result.answer.split(' --- ')
            } else {
                answer = result.answer.split('')
            }
            question.mainElec.append(
                `>>>${result.answer}<<<`
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



function getAnswer_1(question) {
    const index = question.num
    getedAnswer[index] = false
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://test.vcing.top:81/japi.php?key=chaoxing&q=' + encodeURIComponent(question.question),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        onload: function (xhr) {
            const result = JSON.parse(xhr.responseText)
            const answer = result.answer.split('#')
            question.mainElec.append(
                `>>>${result.answer}<<<`
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

