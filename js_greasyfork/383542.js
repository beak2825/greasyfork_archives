// ==UserScript==
// @name        [归档] 上海市大学生安全教育在线 - 自动答题（在线题库版）
// @description 可处理正式考试，顺便去除各种限制。
// @version     1
// @namespace   UnKnown
// @author      UnKnown
// @match       http://www.halnedu.com/pcexam/test/start*
// @require     https://greasyfork.org/scripts/383541.js
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/383542/%5B%E5%BD%92%E6%A1%A3%5D%20%E4%B8%8A%E6%B5%B7%E5%B8%82%E5%A4%A7%E5%AD%A6%E7%94%9F%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%20-%20%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E5%9C%A8%E7%BA%BF%E9%A2%98%E5%BA%93%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/383542/%5B%E5%BD%92%E6%A1%A3%5D%20%E4%B8%8A%E6%B5%B7%E5%B8%82%E5%A4%A7%E5%AD%A6%E7%94%9F%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%20-%20%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E5%9C%A8%E7%BA%BF%E9%A2%98%E5%BA%93%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

/* TODO:
   模糊匹配
   匹配时去除题目名称或答案内容中的中英文括号等符号
   选择题按答案内容而非 ABCD 匹配

   对于自动答题失败的题目：
      输出可供直接搜索的、去除中英文括号与空格的文本
      搞个搜索答案按钮？点击后跳转到搜索引擎

   分类统计自动答题失败的题目数量
   无失败题目时，输出表示成功的日志
*/

// 解除各种限制
(function () {
  document.oncontextmenu = null;
  document.onselectstart = null;
  document.onkeydown     = null;
  document.oncopy        = null;
})();
// 准备待答题目

// 序号： ( 一 OR 二位十进制数字 ) + ( 中文逗号 OR ( 英文句点 + 空格 ) )
const getQuestionName =
aQuestionNodeList => Array.from(aQuestionNodeList).map(
  aQuestionDiv => aQuestionDiv.querySelector('h1').textContent
  .replace(/^\d{1,2}(，|\. |\.)/, "") // 去除题目序号
  .replace(/\s/g, "")                 // 去除空白字符
);

var questionAll = document.querySelectorAll('.question');
var questionNameAll = getQuestionName(questionAll);
/*
1. True or False
2. Single Choice Question
3. Multiple Choice Question
*/
// Questions' Elements
const [ToF, SCQ, MCQ] = ["q1", "q2", "q3"].map(
  qn => document.getElementById(qn)
);

// Questions' NodeLists
var [ToFQuestionAll, SCQQuestionAll, MCQQuestionAll]
  = [ToF, SCQ, MCQ].map(
    questionDiv => questionDiv.querySelectorAll('.question')
  );

// Question names' Arrays
var ToFQuestionNameAll = getQuestionName(ToFQuestionAll);
var SCQQuestionNameAll = getQuestionName(SCQQuestionAll);
var MCQQuestionNameAll = getQuestionName(MCQQuestionAll);

// Uncheck all checked checkbox under a div
function unselect(aDiv) {
  aDiv.querySelectorAll('.active').forEach(aSelected => {
    aSelected.classList.remove("active");
    aSelected.querySelector('input').checked = false;
  });
}
// Uncheck all checked checkbox in Multiple Choice Question first
// in case of duplicated click
if (MCQ.querySelector('.active') !== null) unselect(MCQ);

// ! function below will only run after the file loaded

// AL === AnswerLib

function ToFQuestionFiller(theALMap) {

  ToFQuestionNameAll.forEach((ToFQuestionName, index) => {

    var answer = theALMap.get(ToFQuestionName);
    var questionDiv = ToFQuestionAll[index];

    try {

      if (answer === undefined) {
        throw "未找到第" + (index + 1) + "道判断题的答案，题目开头为：" + ToFQuestionName.slice(0, 50);
      } else if ((answer === "正确")) {
        questionDiv.querySelector('input[value="1"]').click();
      } else if ((answer === "错误")) {
        questionDiv.querySelector('input[value="0"]').click();
      } else {
        throw "第" + (index + 1) + "道判断题的答案数据有误，题目开头为：" + ToFQuestionName.slice(0, 50);
      }

    } catch (e) { console.log(e); }
  });

}

// Answer String > Verify > Answer Element > click
function SCQQuestionFiller(theALMap) {

  SCQQuestionNameAll.forEach((SCQQuestionName, index) => {

    var answer = theALMap.get(SCQQuestionName);
    var questionDiv = SCQQuestionAll[index];

    try {

      if (answer === undefined) {
        throw "未找到第" + (index + 1) + "道单选题的答案，题目开头为：" + SCQQuestionName.slice(0, 50);
      } else {

        var answerKey = answer.charAt(0); // 目前仅取答案首个字符（ABCD），不判断答案内容

        if (["A", "B", "C", "D"].includes(answerKey)) {
          questionDiv.querySelector('input[value="' + answerKey + '"]').click();
        } else {
          throw "第" + (index + 1) + "道单选题的答案数据有误，题目开头为：" + SCQQuestionName.slice(0, 50);
        }

      }

    } catch (e) { console.log(e); }

  });

}

// Answer String > Answer Array > Verify > Answer Element Array > click
function MCQQuestionFiller(theALMap) {

  MCQQuestionNameAll.forEach((MCQQuestionName, index) => {

    var answer = theALMap.get(MCQQuestionName);
    var questionDiv = MCQQuestionAll[index];

    // Unselect when selected by previous answebLib
    if ( questionDiv.querySelector('.active') !== null ) {
      unselect(questionDiv);
    }

    try {

      if ( answer === undefined ) {
        throw "未找到第" + (index + 1) + "道多选题的答案，题目开头为：" + MCQQuestionName.slice(0, 50);
      } else if ( !Array.isArray(answer) ) {
        throw "第" + (index + 1) + "道多选题的答案数据有误（应为数组），题目开头为：" + MCQQuestionName.slice(0, 50);
      } else {
          // 目前仅取答案首个字符（ABCD），不判断答案内容
        var answerKeyAll = answer.map( answer => answer.charAt(0) );

        if ( answerKeyAll.every(
          answerKey => ["A", "B", "C", "D"].includes(answerKey)
        ) ) {
          answerKeyAll.forEach(
            answerKey => questionDiv.querySelector('input[value="' + answerKey + '"]').click()
          );
        } else {
          throw "第" + (index + 1) + "道多选题的答案数据有误，题目开头为：" + MCQQuestionName.slice(0, 50);
        }

      }

    } catch (e) { console.log(e); }

  });

}

function questionFiller(theALMap) {
  var aLine = "-".repeat(22);

  console.log(aLine + "判断题" + aLine);
  ToFQuestionFiller(theALMap);
  console.log(aLine + "单选题" + aLine);
  SCQQuestionFiller(theALMap);
  console.log(aLine + "多选题" + aLine);
  MCQQuestionFiller(theALMap);
}

function Array2Filter2Map(theArray, theSeparator) {
  let theMap = new Map();

  theArray.forEach(item => {
    var splited  = item.split(theSeparator);
    splited.shift(); // Remove ID
    var type     = splited.shift();
    var question = splited.shift();
    var answer   = splited.filter( x => (x !== "") );
    
    if (answer.length === 1) {
      answer = answer[0];
    }
    // 仅提取页面上的题目
    if (questionNameAll.includes(question)) {
      theMap.set(question, answer);
    }
  });

  return theMap;
}

function init() {
  var AnswerLibText = AnswerLib;
  var AnswerLibArray = AnswerLibText.trim().split("\n");
  var AnswerLibSeparator = AnswerLibArray.shift().charAt(0);

  var AnswerLibMap = Array2Filter2Map(AnswerLibArray, AnswerLibSeparator);

  console.log(AnswerLibMap);
  questionFiller(AnswerLibMap);
}

init();