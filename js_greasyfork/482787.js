// ==UserScript==
// @name         富學寶典答題助手
// @namespace    iedu.foxconn.com
// @version      3.0.0
// @description  富學寶典答題助手——收集答案、展示答案。使用方法，每次答題後點擊“收集”用來保存本次考題中的正確答案，每次答題前點擊“展示”用來將已經保存過的正確答案展示到題目下方。
// @author       otc
// @include      https://iedu.foxconn.com/*
// @license MIT
// @require https://update.greasyfork.org/scripts/453745/1299382/Web%E6%8C%89%E9%88%95%E6%B3%A8%E5%85%A5.js
// @downloadURL https://update.greasyfork.org/scripts/482787/%E5%AF%8C%E5%AD%B8%E5%AF%B6%E5%85%B8%E7%AD%94%E9%A1%8C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/482787/%E5%AF%8C%E5%AD%B8%E5%AF%B6%E5%85%B8%E7%AD%94%E9%A1%8C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){
function ieduClean() {
    localStorage.removeItem("answerList")
}

function ieduCollect() {
    let lsAnswerList = localStorage.getItem('answerList');
    let answerList = lsAnswerList ? JSON.parse(lsAnswerList) : [];
    console.log(answerList);
    let resultList = document.getElementsByClassName("question_warp");
    for (let index = 0; index < resultList.length; index++) {
        result = resultList[index];
        questionTitle = result.getElementsByTagName("h3")[0].textContent.split(". ")[1];
        questionOptionListHTML = result.getElementsByClassName("option_list")[0];
        questionAnswer = result.getElementsByClassName("option_list")[0].getElementsByClassName("answer")[0].textContent;
        questionAnswer = questionAnswer.split("\n")[0].trim();
        answerList[answerList.length + 1] = {
            questionTitle: questionTitle,
            questionOptionListHTML: questionOptionListHTML,
            questionAnswer: questionAnswer
        }
    }
    localStorage.setItem("answerList", JSON.stringify(answerList));
    console.log(localStorage.getItem("answerList"))
}

function ieduShowAnswer() {
    let lsAnswerList = localStorage.getItem('answerList');
    let answerList = lsAnswerList ? JSON.parse(lsAnswerList) : [];
    if (answerList.length == 0) {
        alert("请先打一遍题！将答案保存后，再进行此操作！")
    }
    let questionList = document.getElementsByClassName("question_warp");
    for (let index = 0; index < questionList.length; index++) {
        question = questionList[index];
        questionTitle = question.getElementsByTagName("h3")[0].textContent.split(". ")[1];
        filterdList = answerList.filter(function(c) {
            if (!c) return false;
            if (questionTitle == c.questionTitle) {
                return true
            }
        })
        console.log(filterdList);
        for (let j = 0; j < filterdList.length; j++) {
            console.log(filterdList[j].questionAnswer);
            questionAnswerValue = filterdList[j].questionAnswer.split('：')[1]
            question.append(questionAnswerValue);
            console.log(question);
            let options = question.getElementsByTagName("label")
            for (let option of options) {
                for(let v of questionAnswerValue.split("")){
                    if(option.textContent.replaceAll("\n","").replaceAll("\t","").startsWith(v)){
                        option.click()
                    }
                }
                
            }
        }
    }
}

function ieduSearch(questionTitle) {
    let lsAnswerList = localStorage.getItem('answerList');
    let answerList = lsAnswerList ? JSON.parse(lsAnswerList) : [];
    if (answerList.length == 0) {
        alert("请先打一遍题！将答案保存后，再进行此操作！")
    }
    let questionList = document.getElementsByClassName("question_warp");
    filterdList = answerList.filter(function(c) {
        if (!c) return false;
        if (questionTitle == c.questionTitle) {
            return true
        }
    }) ;
        for (let index = 0; index < filterdList.length; index++) {
        console.log(JSON.stringify(filterdList[index]))
    }
} 
  
  
const buttons = [  
  { name: '第一步：收集（請在答題完畢後觸發）', func: ieduCollect },  
  { name: '第二步：展示（請在答題前觸發）', func: ieduShowAnswer }  
];  
createButtons(buttons);
})();