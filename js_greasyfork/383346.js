// ==UserScript==
// @name        [归档] 上海市大学生安全教育在线 - 自动答题（模拟考试版）
// @description 模拟考试的答案在页面里。
// @version     1.0
// @namespace   UnKnown
// @author      UnKnown
// @match       http://www.halnedu.com/pcexam/test/start
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/383346/%5B%E5%BD%92%E6%A1%A3%5D%20%E4%B8%8A%E6%B5%B7%E5%B8%82%E5%A4%A7%E5%AD%A6%E7%94%9F%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%20-%20%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E6%A8%A1%E6%8B%9F%E8%80%83%E8%AF%95%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/383346/%5B%E5%BD%92%E6%A1%A3%5D%20%E4%B8%8A%E6%B5%B7%E5%B8%82%E5%A4%A7%E5%AD%A6%E7%94%9F%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%20-%20%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E6%A8%A1%E6%8B%9F%E8%80%83%E8%AF%95%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(() => {

const clickAnswer = (question, answer) =>
	question.querySelector('input[value="' + answer + '"]').click();

// 1 & 2. True or False & Single Choice Question
document.querySelectorAll('#q1 .question, #q2 .question').forEach(
	question => clickAnswer(question, question.getAttribute("as"))
);

// 3. Multiple Choice Question
const MCQ = document.getElementById('q3');

/* Uncheck all checked checkbox in Multiple Choice Question first,
   in case of duplicated click */
MCQ.querySelectorAll('li.active').forEach(
	selected => {
		selected.classList.remove('active');
		selected.checked = false;
	}
);

MCQ.querySelectorAll('.question').forEach(
	question => question.getAttribute('as').split("").forEach(
		answer => clickAnswer(question, answer)
	)
);

})();

// 4. Show right answers

/* showAnswers = */ true &&
((onHover = false) =>
	document.head.appendChild( document.createElement("style") ).textContent = (
		onHover ? ".box .question:hover .answer, .box .question:focus " : ""
	) + ".answer {display: block !important}"
)();
