// ==UserScript==
// @name         半自动安全微伴答题脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提取题目并自动选择答案，支持手动触发
// @author       ChatGPT-4o and MapleL
// @match        https://weiban.mycourse.cn/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514004/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/514004/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastQuestion;

    // 提取页面中的题目
    function getQuestion() {
        let question = document.querySelector('.quest-stem').innerText.trim();
        return question.replace(/^[\d.、]+/, '').trim();
    }

    // 提取页面中的选项
    function getOptions() {
        return Array.from(document.querySelectorAll('.quest-option-item .quest-option-top')).map(item => item.innerText.trim());
    }

    // 查找 GitHub 文本中是否存在该题的答案
    function findAnswerInGitHub(question) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://raw.githubusercontent.com/pooneyy/WeibanQuestionsBank/refs/heads/main/weibanQuestionBank.md',
                onload: function(response) {
                    if (response.status === 200) {
                        const content = response.responseText;
                        const lines = content.split('\n');
                        const matchedLine = lines.find(line => line.includes(question));
                        if (matchedLine) {
                            const answerParts = matchedLine.split('|').slice(3).map(answer => answer.trim()).filter(answer => answer.length > 0);
                            resolve(answerParts);
                        } else {
                            resolve(null);
                        }
                    } else {
                        reject('无法获取题库');
                    }
                },
                onerror: function() {
                    reject('请求错误');
                }
            });
        });
    }

    // 选择正确答案
    function selectOptionByText(answer) {
        let options = getOptions();
        let correctOption = options.find(option => option.includes(answer));
        if (correctOption) {
            let optionElement = Array.from(document.querySelectorAll('.quest-option-item')).find(item => item.innerText.includes(correctOption));
            if (optionElement) {
                optionElement.click();
                console.log(`选项: ${correctOption} 被选择`);
                return true;
            } else {
                console.log(`选项: ${correctOption} 不存在，选择失败`);
                return false;
            }
        }
    }

    // 自动选择正确答案（多选题支持）
    async function selectCorrectAnswer() {
        let question = getQuestion();
        let answers = await findAnswerInGitHub(question);
        let errFlag = false;

        console.log(`获取到题目：${question}`);
        console.log(`获取到答案：${answers}`)

        if (answers && answers.length > 0) {
            answers.forEach(answer => {
                if (!selectOptionByText(answer)) {
                    errFlag = true;
                    console.log(`答案 ${answer} 与选项不匹配，已暂停答题`);
                }
            });
        } else {
            errFlag = true;
            console.log(`未找到题目: ${question} 对应的答案`);
        }
        if (errFlag == true) {
            return false;
        } else {
            return true;
        }
    }

    async function startAutoAnswer() {
        let selectStatus = await selectCorrectAnswer();
        if (selectStatus == true) {
            lastQuestion = getQuestion();
            setTimeout(() => {
                const buttons = document.querySelectorAll('button .mint-button-text');
                let nextButton = Array.from(buttons).find(button => button.textContent.includes("下一题"));
                if (nextButton) {
                    nextButton.click();
                    console.log('延迟0.5秒后点击下一题');
                    const observer = new MutationObserver((mutationsList, observer) => {
                        console.log('正在检测题目更新');
                        let newQuestion = getQuestion();
                        if (newQuestion !== lastQuestion) {
                            console.log('检测到题目更新，即将延迟0.5秒后继续自动答题');
                            observer.disconnect();
                            setTimeout(() => {
                                startAutoAnswer();
                                console.log('继续自动答题');
                            }, 500);
                        }
                    });
                    observer.observe(document.querySelector('.quest-stem').parentNode, { childList: true, subtree: true, characterData: true });
                    console.log('开始检测题目更新');
                } else {
                    console.log('未找到下一题按钮');
                }
            }, 500);
        } else {
            console.log(`题目: ${getQuestion()} 自动答题失败`);
            alert('未找到题目对应的答案，请手动作答');
        }
    }

    // 创建并插入“开始自动答题”按钮
    function createAnswerButton() {
        let button = document.createElement('button');
        button.innerText = '开始自动答题';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            console.log("尝试自动答题");
            startAutoAnswer();
        });

        document.body.appendChild(button);
    }

    // 等待页面加载完成并创建按钮
    window.addEventListener('load', function() {
        createAnswerButton();
    });
})();