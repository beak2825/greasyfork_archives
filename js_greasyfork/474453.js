// ==UserScript==
// @name         🔥知到/智慧树-网课【答题小助手】-- 持续更新 | 支持作业、测验、考试答题 | 题库持续更新 | 题库永久免费 |✍💯
// @namespace    starlism
// @version      1.3
// @description  🔥知到/智慧树-网课答题小助手。支持以下功能：1、智慧树课堂测验答题【支持自动搜索相关题目、自动做题和保存】；2、智慧树课程考试答题【支持自动搜索相关题目、自动做题和保存】
// @author       starlism
// @match        *://*.zhihuishu.com/stuExamWeb*
// @connect      free.tikuhai.com
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @resource css https://unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css
// @license      MIT
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/474453/%F0%9F%94%A5%E7%9F%A5%E5%88%B0%E6%99%BA%E6%85%A7%E6%A0%91-%E7%BD%91%E8%AF%BE%E3%80%90%E7%AD%94%E9%A2%98%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91--%20%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%20%7C%20%E6%94%AF%E6%8C%81%E4%BD%9C%E4%B8%9A%E3%80%81%E6%B5%8B%E9%AA%8C%E3%80%81%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%20%7C%20%E9%A2%98%E5%BA%93%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%20%7C%20%E9%A2%98%E5%BA%93%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%20%7C%E2%9C%8D%F0%9F%92%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/474453/%F0%9F%94%A5%E7%9F%A5%E5%88%B0%E6%99%BA%E6%85%A7%E6%A0%91-%E7%BD%91%E8%AF%BE%E3%80%90%E7%AD%94%E9%A2%98%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91--%20%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%20%7C%20%E6%94%AF%E6%8C%81%E4%BD%9C%E4%B8%9A%E3%80%81%E6%B5%8B%E9%AA%8C%E3%80%81%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%20%7C%20%E9%A2%98%E5%BA%93%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%20%7C%20%E9%A2%98%E5%BA%93%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%20%7C%E2%9C%8D%F0%9F%92%AF.meta.js
// ==/UserScript==

const qrCode = `
data:image/png;base64,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
`

enableWebpackHook();

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const config = {
    awaitTime: 5000,
    stopTimer: false,
    questionCount: 0,
    finishCount: 0,
    questionType: {
        '判断题': 10,
        '单选题': 20,
        '多选题': 25,
        '填空题': 30,
        '问答题': 40,
    }
};

// answer question and click to next question
function answerQuestion(questionBody, questionIndex) {
    const questionTitle = questionBody.querySelector('.subject_describe div,.smallStem_describe p').__Ivue__._data.shadowDom.textContent;
    appendToTable(questionTitle,"", questionIndex);
    // 题目类型处理
    const questionType = questionBody.querySelector(".subject_type").innerText.match(/【(.+)】|$/)[1]
    let type = config.questionType[questionType]
    if (type === undefined) {
        type = -1;
    }
    // console.log(type);
    // get answer
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://free.tikuhai.com/q?q=" + encodeURIComponent(questionTitle),
        //         headers: {
        //             "Content-type": "application/x-www-form-urlencoded"
        //         },
        //         data: 'question=' + encodeURIComponent(questionTitle),
        onload: function(xhr) {
            const res = JSON.parse(xhr.responseText);
            const msg = res.msg;
            let answerString = res.data;
            if (msg === "暂无答案") {
                answerString = "暂无答案"
                changeAnswerInTable(answerString, questionIndex, true)
            } else {
                let isSelect = chooseAnswer(type, questionBody, answerString);
                changeAnswerInTable(answerString, questionIndex, isSelect)
            }
            // switch to next question
            document.querySelectorAll('.switch-btn-box > button')[1].click()
        },
        onerror: function(err) {
            console.log(err)
        }
    });
}

// choose the correct option of question
function chooseAnswer(questionType, questionBody, answerString) {
    let isSelect = false;
    // 判断题
    if (questionType === 10) {
        // 获取选项
        const firstOptionText = questionBody.querySelector(".node_detail")
        const firstOption = questionBody.querySelector(".nodeLab")
        // 选项表示正确
        if (firstOptionText.innerText.match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/)) {
            if (answerString.match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/)) {
                firstOption.click();
                isSelect = true;
            } else {
                // const secondOption = questionBody.querySelectorAll(".nodeLab")[1];
                // secondOption.cilck();
                questionBody.querySelectorAll(".nodeLab")[1].click();
                isSelect = true;
            }
        } else {
            if (answerString.match(/(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/)) {
                // const secondOption = questionBody.querySelectorAll(".nodeLab")[1];
                // secondOption.cilck();
                questionBody.querySelectorAll(".nodeLab")[1].click();
                isSelect = true;
            } else {
                firstOption.click();
                isSelect = true;
            }
        }
    }
    // 单选题
    if (questionType === 20) {
        const regexPattern = new RegExp("^(" + answerString + ")$");
        // 获取所有选项
        const optionsTextAll = questionBody.querySelectorAll(".node_detail")
        const optionsAll = questionBody.querySelectorAll(".nodeLab")
        for (let i = 0; i < optionsAll.length; i++) {
            if (regexPattern.test(optionsTextAll[i].innerText)) {
                optionsAll[i].click();
                isSelect = true;
                break;
            }
        }
    }
    // 多选题
    if (questionType === 25) {
        const regexPattern = new RegExp("^(" + answerString + ")$");
        // 获取所有选项
        const optionsTextAll = questionBody.querySelectorAll(".node_detail")
        const optionsAll = questionBody.querySelectorAll(".nodeLab")
        for (let i = 0; i < optionsAll.length; i++) {
            if (regexPattern.test(optionsTextAll[i].innerText)) {
                optionsAll[i].click();
                isSelect = true;
            }
        }
    }
    // 填空题

    // 问答题

    return isSelect;
}

function appendToTable(questionTitle, answerString, questionIndex) {
    const table = document.querySelector("#record-table");
    table.innerHTML += `<tr><td>` + questionIndex + `</td><td>` + questionTitle + `</td><td id=answer${questionIndex}>正在搜索...</td></tr>`
    //     const tr = document.createElement("tr");
    //     tr.appendChild(1);
    //     tr.appendChild(questionTitle);
    //     tr.appendChild(answerString);
    //     table.appendChild(tr)
}

function changeAnswerInTable(answerString, questionIndex, isSelect) {
    document.querySelector(`#answer${questionIndex}`).innerText = answerString;
    if (answerString === "暂无答案") {
        // document.querySelector(`#answer${questionIndex}`).style.color = 'red';
        document.querySelector(`#answer${questionIndex}`).insertAdjacentHTML('beforeend',`<p style="color:red">扫码下载APP从完整版题库中获取答案</p>`)
    }
    if (!isSelect) {
        document.querySelector(`#answer${questionIndex}`).insertAdjacentHTML('beforeend',`<p style="color:green">未匹配答案，请根据搜索结果手动选择答案</p>`)
    }
}

function enableWebpackHook() {
    let originCall = Function.prototype.call
    Function.prototype.call = function (...args) {
        const result = originCall.apply(this, args)
        if (args[2]?.default?.version === '2.5.2') {
            args[2]?.default?.mixin({
                mounted: function () {
                    this.$el['__Ivue__'] = this
                }
            })
        }
        return result
    }
}


unsafeWindow.onload = (() => (async () => {
    // css style
    GM_addStyle(GM_getResourceText("css"));
    const cssStyle = `
    <div class="panel panel-info" style="z-index:99999; position:fixed; left:0; top:10%; width:22vw">
      <div class="panel-heading">
        <h3 class="panel-title" style="display:flex; align-items:center; justify-content:center">✍智慧树网课作业考试小助手✍</h3>
      </div>
      <div class="panel-body" id="qr-code" style="display:flex; align-items:center; justify-content:center; margin-top:-10px"></div>
      <div class="panel-body" style="display:flex; align-items:center; justify-content:center; margin-top:-30px">扫码下载APP，获得完整版题库答案</div>
      <div style="display:flex; align-items:center; justify-content:center">读取题目中...</div>
      <div class="panel-body" style="max-height:35vh; overflow-y:scroll; margin-top:0px">
        <div class="bs-example" data-example-id="bordered-table">
          <table class="table table-bordered" id="record-table">
            <thead>
              <tr>
                <th>#</th>
                <th>题目</th>
                <th>答案</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    `
    document.body.insertAdjacentHTML('beforeend', cssStyle);

    // QR Code
    const img = new Image();
    img.src = qrCode;
    img.width = 200;
    img.height = 200;
    document.querySelector("#qr-code").appendChild(img);

    // wait load
    await sleep(config.awaitTime);

    // get all question body
    var questionBodyAll = document.querySelectorAll(".examPaper_subject.mt20")
    if (questionBodyAll.length === 0) {
        return;
    }
    config.questionCount = questionBodyAll.length;

    // generate interval
    answerQuestion(questionBodyAll[0], 1)
    let finishCount = 1;
    var interval = setInterval(()=>{
        answerQuestion(questionBodyAll[finishCount], finishCount+1);
        finishCount += 1;
        if (finishCount === questionBodyAll.length) {
            clearInterval(interval);
            return;
        }
    }, 3000);

    //     for (let i = 0; i < questionBodyAll.length; i++) {
    //         setTimeout(answerQuestion(questionBodyAll[i]), 1000*i);
    //     }


    // setInterval(()=>{answerQuestion()}, 1000);

    // document.querySelector(".asdfgh").innerHTML = questionTitle
    // console.log(questionTitle)
    // Your code here...
}))();