// ==UserScript==
// @name              简易自动搜题职教云
// @namespace         a
// @version           0.0.2
// @description       简易自动搜题
// @author            Sokowm
// @match             *://*.zjy2.icve.com.cn/*
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/520852/%E7%AE%80%E6%98%93%E8%87%AA%E5%8A%A8%E6%90%9C%E9%A2%98%E8%81%8C%E6%95%99%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/520852/%E7%AE%80%E6%98%93%E8%87%AA%E5%8A%A8%E6%90%9C%E9%A2%98%E8%81%8C%E6%95%99%E4%BA%91.meta.js
// ==/UserScript==

//填写搜题服务器地址和端口，如https://www.baidu.com:8085/
// 获取所有包含 'wrkxajis' 的元素ID
// 获取subjectList元素
const subjectList = document.querySelector('.subjectList');
if (!subjectList) {
    console.log('未找到subjectList元素');
}

// 获取subjectList下的所有subjectDet元素
const subjectElements = subjectList.querySelectorAll('.subjectDet');
let answersCount = 0;

// 创建异步函数处理单个题目
async function processSubject(element) {
    const titleElement = element.querySelector('div.titleBox > div.seeTitle.titleTwo > span.htmlP.ql-editor');
    const elementId = element.id;
    
    if (titleElement) {
        try {
            const response = await fetch('https://www.cccq.fun:8085/', {
                method: 'POST',
                body: JSON.stringify({
                    question: titleElement.textContent
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            const answerData = result[0];
            const correctAnswerText = answerData.options[answerData.answer];
            answersCount++;
            
            console.log('题目ID:', elementId);
            console.log('问题:', answerData.question);
            console.log('正确答案:', `${answerData.answer} - ${correctAnswerText}`);
            console.log('------------------------');
        } catch (error) {
            console.error('Error fetching data from API:', error);
        }
    }
}

// 按顺序处理所有题目
async function processAllSubjects() {
    for (const element of subjectElements) {
        await processSubject(element);
    }
    console.log(`\n获取答案完成！总共获取到 ${answersCount} 个答案`);
}

// 开始处理
processAllSubjects();