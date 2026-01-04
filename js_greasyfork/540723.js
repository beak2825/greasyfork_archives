// ==UserScript==
// @name         三三制平台自动答题
// @namespace    自动答题
// @license      Common
// @version      1.0.0
// @description  做这个不是浪费我的时间是什么？
// @author       Roy
// @match        https://33.bxwxm.com.cn/index/exam/show/id/*
// @icon         https://33.bxwxm.com.cn/static/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/540723/%E4%B8%89%E4%B8%89%E5%88%B6%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/540723/%E4%B8%89%E4%B8%89%E5%88%B6%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let isProcessing = false;
    async function init() {
        if (isProcessing) return;
        isProcessing = true;
        const Std_message = getRandomYiyan();
        const questions = document.querySelectorAll(".list-unstyled.question");
        if (questions.length === 0) {
            console.log("未找到题目元素");
            isProcessing = false;
            return;
        }
        for (const q of questions) {
            const title = cleanQuestion(q.querySelector(".question_title").innerText);
            const options = extractOptions(q);
            if (q.querySelector("div")) {
                addMessage(q, "当前章节已完成，将不进行答题！", Std_message);
                const correctAnswer = extractCorrectAnswer(q);
                if(correctAnswer != "未知") {
                    await submitToServer(title, options, correctAnswer).catch(e => {
                        console.error(`题目提交失败: ${title}`, e);
                    });
                }
                continue;
            }
            await processQuestion(q, title, options, Std_message);
        }
        isProcessing = false;
    }
    function extractCorrectAnswer(questionBox) {
        const children = questionBox.children;
        const divs = [];
        for (let i = 0; i < children.length; i++) {
            if (children[i].tagName === 'DIV') {
                divs.push(children[i]);
            }
        }
        if (divs.length < 2) return "未知";
        const answerDiv = divs[divs.length - 2];
        const answerText = answerDiv.innerText.trim();
        if (answerText.includes("正确答案：")) {
            const match = answerText.match(/正确答案：\s*([A-Z,]+)/);
            return match ? match[1].trim() : "未知";
        } else if (answerText.includes("您已选")) {
            const match = answerText.match(/您已选\s+([A-Z,]+)/);
            return match ? match[1].trim() : "未知";
        }
        return "未知";
    }
    function getUtf8Length(str) {
        return encodeURIComponent(str).replace(/%[A-F\d]{2}/g, 'U').length;
    }
    function generateChecksum(question, options) {
        const optionsText = options.join("\n");
        const questionLength = getUtf8Length(question); 
        const optionsLength = getUtf8Length(optionsText);
        return (questionLength * optionsLength + 4747).toString();
    }
    async function submitToServer(question, options, correctAnswer) {
        try {
            const requestData = new URLSearchParams();
            requestData.append("question", question);
            requestData.append("options", options.join("\n"));
            requestData.append("correct_answer", correctAnswer);
            requestData.append("checksum", generateChecksum(question, options));
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: "http://33.royeae.top/submit.php",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "DtbOiFkyVcCrWOnM"
                    },
                    data: requestData.toString(),
                    onload: resolve,
                    onerror: reject
                });
            });
            const result = JSON.parse(response.responseText);
            if (result.code === 1) {
                console.log("提交成功:", question);
            } else {
                console.error("提交失败:", result.msg);
            }
        } catch (error) {
            console.error("请求异常:", error);
        }
    }
    function processQuestion(questionBox, question, options, Std_message) {
        return new Promise((resolve) => {
            const requestData = new URLSearchParams();
            requestData.append("question", question);
            requestData.append("options", options.join("\n"));
            requestData.append("type", "null");
            requestData.append("token", "z18pognycjict6g7");
            GM_xmlhttpRequest({
                url: 'https://33.royeae.top/search.php',
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: requestData.toString(),
                onload: function (res) {
                    try {
                        const result = JSON.parse(res.responseText);
                        if (result.code === 1 && result.answer) {
                            checkAndSelectAnswer(questionBox, result.answer, Std_message);
                        } else {
                            addMessage(questionBox, `接口错误：${result.msg || "未知错误"}`);
                        }
                    } catch (e) {
                        addMessage(questionBox, "解析答案失败");
                    } finally {
                        resolve();
                    }
                },
                onerror: function () {
                    addMessage(questionBox, "请求答案失败");
                    resolve();
                }
            });
        });
    }
    function checkAndSelectAnswer(questionBox, answer, Std_message) {
        const options = questionBox.querySelectorAll(".question_info");
        const answers = answer.split('#').map(ans => ans.trim());
        let isMatched = true;
        const answerMap = {
            "√": "正确",
            "对": "正确",
            "正确": "正确",
            "×": "错误",
            "错": "错误",
            "错误": "错误"
        };
        answers.forEach(ans => {
            const mappedAnswer = answerMap[ans] || ans;
            const option = Array.from(options).find(opt => {
                const text = cleanText(opt.innerText);
                return (
                    text === mappedAnswer || 
                    text.replace(/^[A-Z]/, "") === mappedAnswer || 
                    text.includes(mappedAnswer) || 
                    mappedAnswer.includes(text) 
                );
            });
            if (option) {
                const radio = option.querySelector(".a-radio");
                if (radio) radio.checked = true;
            } else {
                isMatched = false;
            }
        });
        if (isMatched) {
            addMessage(questionBox, `接口返回答案：${answer}\n已自动勾选，请再确认一遍！`, Std_message);
        } else {
            addMessage(questionBox, `接口返回答案：${answer}\n但未完全匹配，同学你自己勾选一下吧`, Std_message);
        }
    }
    function extractOptions(questionBox) {
        return Array.from(questionBox.querySelectorAll(".question_info")).map(opt => cleanText(opt.innerText));
    }
    function cleanQuestion(text) {
        return text.replace(/^\[.*?\]/, "").replace(/第\s*\d+\s*题\s*、/, "").trim();
    }
    function cleanText(text) {
        return text.replace(/( |\t|[\r\n])|\s+|\s+$/g, "").replace(/^[A-Z][．|\.|,|、|，|,]?/, "");
    }
    function getRandomYiyan() {
        const yiyanList = [
            "Roy：三三制？我以为我在玩答题闯关游戏，结果发现是‘学习通’的换皮DLC，南宁师大你赢了！",
            "匿名：三三制答题答到怀疑人生，学校是不是觉得我们人均‘最强大脑’？答不完的题，刷不完的课，我直接裂开！",
            "K：你以为你在学习？不，你只是在完成学校的KPI！",
            "悲伤大学生：三三制，一款专治学生‘太闲’的良药，答完题直接进入‘贤者模式’，谢谢学校让我提前体验社畜生活！",
            "匿名：三三制？学习通Pro Max Plus！南宁师大你是懂折磨的，答题答到手抽筋，学分还没见影！"
        ];

        // 随机选择一条
        const randomIndex = Math.floor(Math.random() * yiyanList.length);
        return yiyanList[randomIndex];
    }
    function addMessage(element, message, Std_message="") {
        const msg = document.createElement("div");
        msg.style.backgroundColor = "#1e1e1e";
        msg.style.color = "#ffffff";
        msg.style.padding = "13px";
        msg.style.borderRadius = "5px";
        msg.style.marginTop = "8px";
        msg.style.fontFamily = "monospace";
        msg.style.fontStyle = "normal";
        msg.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
        if(Std_message == ""){
            msg.innerText = message;
        }else{
            const messageContent = document.createElement("div");
            messageContent.innerText = message;
            msg.appendChild(messageContent);
            const jiange = document.createElement("div");
            jiange.innerText = "————————————————————";
            jiange.style.fontSize = "0.8em";
            jiange.style.color = "#F0FFFF";
            jiange.style.lineHeight = "25px";
            msg.appendChild(jiange);
            const yiyanContent = document.createElement("div");
            yiyanContent.innerText = Std_message;
            yiyanContent.style.fontSize = "0.9em";
            yiyanContent.style.color = "#8470FF";
            yiyanContent.style.lineHeight = "25px";
            yiyanContent.style.display = "inline-block"; 
            const link = document.createElement("a");
            link.href = "https://docs.qq.com/form/page/DV0pMY0Zpd2p5SkZx";
            link.innerText = "我也来吐槽一句";
            link.style.marginLeft = "10px"; 
            link.style.color = "#6495ED";
            link.target = "_blank";
            link.style.textDecoration = "underline";
            const container = document.createElement("div");
            container.style.display = "flex"; 
            container.style.alignItems = "center"; 
            container.appendChild(yiyanContent);
            container.appendChild(link);
            msg.appendChild(container); 
        }
        element.appendChild(msg);
    }
    const timer = setInterval(() => {
        if (document.getElementById("question-list-box")) {
            clearInterval(timer);
            init();
        }
    }, 500);
})();
