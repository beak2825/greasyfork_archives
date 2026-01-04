// ==UserScript==
// @name         自考365期末考试
// @namespace    LZJ
// @version      2024-02-29
// @description  自考365的期末考试
// @author       You
// @match        https://member.zikao365.com/web-qz/moni/exam/exam_toExam.action?centerExamFlag=gckh
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zikao365.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490199/%E8%87%AA%E8%80%83365%E6%9C%9F%E6%9C%AB%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/490199/%E8%87%AA%E8%80%83365%E6%9C%9F%E6%9C%AB%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 获取答案字符串
	var json = document.querySelector("#userAnsMapStr").innerText
	var j = JSON.parse(json)

	// 转换成数组
	var q_list = []
	for (let key in j) {
		q_list.push(j[key])
	}

	// 递归处理答案
	function doQuestion(q_list, index) {
		if (index >= q_list.length) {
			return;
		}
		var question = q_list[index]
		var rightAnswer = question['rightAnswer']
		var questionID = question['questionID']

		choseAnswer(rightAnswer, questionID)

		// 设置5秒的延迟后再次调用doQuestion
		setTimeout(() => {
			doQuestion(q_list, index + 1);
		}, 500);
	}

	function choseAnswer(rightAnswer, questionID) {
		// 找到题目
		var el = document.getElementsByClassName("span_" + questionID)
		// 切换题目
		el[0].parentNode.childNodes[1].click()
		// 选择答案
		let answer_list = []
		for (var i = 0; i < rightAnswer.length; i++) {
			var answer2 = rightAnswer[i].charCodeAt(0) - 65
			let answer_key = answer2
			// answer_list.push(answer)
			// document.getElementsByClassName("saveOneQuestion")[key].parentNode.children[0].checked = true
			setTimeout(function() {
				document.getElementsByClassName("saveOneQuestion")[answer_key].parentNode.children[0]
					.checked =
					true
			}, 100)
		}
	}

	// 启动
	setTimeout(()=>{
		doQuestion(q_list, 0);
	}, 1000)

})();