// ==UserScript==
// @name         传智考试答题(支持选填)
// @namespace    https://stu.ityxb.com/writePaper/busywork/*
// @namespace    https://stu.ityxb.com/writePaper/exam/*
// @version      3.3
// @description  传智教育答题
// @author       yichen11818 二开作者HCG_Sky 原作者：土豆
// @connect      *
// @match        https://stu.ityxb.com/writePaper/busywork/*
// @match        https://stu.ityxb.com/writePaper/exam/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518464/%E4%BC%A0%E6%99%BA%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%28%E6%94%AF%E6%8C%81%E9%80%89%E5%A1%AB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518464/%E4%BC%A0%E6%99%BA%E8%80%83%E8%AF%95%E7%AD%94%E9%A2%98%28%E6%94%AF%E6%8C%81%E9%80%89%E5%A1%AB%29.meta.js
// ==/UserScript==

// API配置
const API_KEY = ''; // 在这里填入你的AI API密钥
const API_URL = 'https://openai.proxy.com/v1/chat/completions'; // chatgpt proxy地址 https://ai.zeroai.one/v1/chat/completions
const QUESTION_API_URL = 'https://cx.icodef.com/wyn-nb'; // 题库接口地址 请前往https://q.icodef.com/ 获取key
const QUESTION_API_KEY = ''; // 在这里填入题库API密钥

// 其他全局变量
var tibody; // 题目数组
var total = 0; // 题目总数量
var index = 0; // 搜题索引自动增加
var questionNumber = "" // ai搜索题号
var questionInputMode = false; // 是否处于输入题号模式
var answersVisible = true; // 是否显示答案

["visibilitychange", "blur", "focus", "focusin", "focusout"].forEach((e) => {
    window.addEventListener(
        e,
        (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            return false;
        },
        true
    );
});
document.hasFocus = () => true;
Object.defineProperty(document, "hidden", {
    get() {
        return false;
    },
});

window.onload = function () {

    tibody = document.getElementsByClassName("questionItem question-item-box");
    total = tibody.length;

    // 添加按键事件监听器
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 192) { // 检测键码为192的键（~键）
            if (index < total) {
                index = index + 1;
                answer(tibody[index]);
            }
        }

        // 检测键码为191的键（?键）
        if (event.keyCode == 191) {
            if (questionInputMode && questionNumber.length > 0) { // 如果已经在输入题号模式，并且输入了题号
                gptSearch(questionNumber); // 调用 ai 搜索
                questionNumber = ""; // 清空 questionNumber
                questionInputMode = false; // 退出输入题号模式
            } else {
                questionInputMode = true; // 进入输入题号模式
            }
        }
        // 检测主键盘数字键(48-57)和小键盘数字键(96-105)
        if (questionInputMode && ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105))) {
            // 对于小键盘数字，减去48得到实际数字
            var keyNum = event.keyCode >= 96 ? event.keyCode - 96 : event.keyCode - 48;
            questionNumber += keyNum.toString(); // 添加数字到 questionNumber
            console.log(questionNumber);
        }
        if (event.keyCode == 77) {
            toggleAnswersVisibility();
        }
        if (event.keyCode == 78) {
            toggleAnswersblibility();
            }
    });
    answer(tibody[index]); // 初始化时自动搜索第一个答案
}

function toggleAnswersVisibility() {
    answersVisible = !answersVisible;
    const spans = document.querySelectorAll('.question-title-box span');
    spans.forEach(span => {
        span.style.opacity = answersVisible ? '0.1' : '0';
    });
}
function toggleAnswersblibility() {
    const spans = document.querySelectorAll('.question-title-box span');
    spans.forEach(span => {
        span.style.opacity = answersVisible ? '0.1' : '0.3';
    });
}
function gptSearch(questionNumber) {
    // 确保题号在范围内
    const questionIndex = parseInt(questionNumber) - 1;
    if (questionIndex < 0 || questionIndex >= tibody.length) {
        console.error('Invalid question number:', questionNumber);
        return;
    }
    console.log(questionIndex);
    const ti = tibody[questionIndex];
    console.log(ti);
    const questionText1 = ti.querySelector(".question-title-box .myEditorTxt").innerText.trim();

    // Get the options
    const options = Array.from(ti.querySelectorAll(".radio_item .myEditorTxt")).map(option => option.innerText.trim());
    // Combine question text and options
    const questionText = `${questionText1}\n选项:\n${options.join('\n')}`;
    console.log(questionText);
    GM_xmlhttpRequest({
        method: 'POST',
        url: API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': API_KEY
        },
        data: JSON.stringify({
            model: 'gpt-4o', // 根据需要选择模型
            messages: [{ role: 'user', content: questionText }]
        }),
        onload: function (response) {
            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                let daan = data.choices[0].message.content.trim();
                // 处理答案
                let answerarray = daan.split('#'); // 根据需要调整分隔符
                let daanlength = ti.getElementsByClassName("radio_item question-option-item-box").length; // 多少个选项
                for (let i = 0; i < daanlength; i++) {
                    for (let i2 = 0; i2 < answerarray.length; i2++) {
                        let optionText = ti.getElementsByClassName("radio_item question-option-item-box")[i].innerText;
                        optionText = optionText.replace(/[\s、]/g, ''); // 去除多余的空格和标点符号
                        if (optionText == answerarray[i2]) {
                            ti.getElementsByClassName("radio_item question-option-item-box")[i].firstElementChild.click();
                        }
                    }
                }

                // 显示答案
                let newdaan = ' ';
                for (let i = 0; i < answerarray.length; i++) {
                    newdaan = newdaan + '<br>' + answerarray[i];
                }
                let fragment = document.createDocumentFragment(); // 创建文档片段
                let span = document.createElement('span');
                newdaan = newdaan.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                console.log(newdaan);
                span.style.opacity = '0.1';
                span.innerHTML = `d:${newdaan}`;
                fragment.appendChild(span);
                ti.getElementsByClassName("question-title-box")[0].appendChild(fragment); // 一次性添加到DOM中
            } else {
                console.error('Error:', response.statusText);
            }
        },
        onerror: function (error) {
            console.error('Request failed:', error);
        }
    });
}

function answer(ti) {
    GM_xmlhttpRequest({//油猴脚本提供的异步函数
        method: 'POST',
        url: QUESTION_API_URL,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': QUESTION_API_KEY,
        },
        data: 'question=' + encodeURIComponent(ti.getElementsByClassName("question-title-box")[0].innerText),
        timeout: 2000,
        onload: function (xhr) {
            // 自动选择答案
            let json = JSON.parse(xhr.responseText);
            let daan = json.data;
            if (json.code == -1) {
                daan = " ";
            }
            let answerarray = daan.split('#'); // 答案数组

            let daanlength = ti.getElementsByClassName("radio_item question-option-item-box").length; // 多少个选项

            for (let i = 0; i < daanlength; i++) {
                for (let i2 = 0; i2 < answerarray.length; i2++) {
                    if (answerarray[i2] == '正确') {
                        answerarray[i2] = '对';
                    }
                    if (answerarray[i2] == '错误') {
                        answerarray[i2] = '错';
                    }
                    let optionText = ti.getElementsByClassName("radio_item question-option-item-box")[i].innerText;
                    optionText = optionText.replace(/[\s、]/g, ''); // 去除多余的空格和标点符号
                    if (optionText == answerarray[i2]) {
                        ti.getElementsByClassName("radio_item question-option-item-box")[i].firstElementChild.click();
                    }
                }
            }

            // 显示答案
            let newdaan = ' ';
            for (let i = 0; i < answerarray.length; i++) {
                newdaan = newdaan + '<br>' + answerarray[i];
            }
            let fragment = document.createDocumentFragment(); // 创建文档片段
            let span = document.createElement('span');
            newdaan = newdaan.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            console.log(newdaan);
            span.style.opacity = '0.1';
            span.innerHTML = `d:${newdaan}`;
            fragment.appendChild(span);
            ti.getElementsByClassName("question-title-box")[0].appendChild(fragment); // 一次性添加到DOM中
        }
    })
}
