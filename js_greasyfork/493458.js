// ==UserScript==
// @name         安阳师范继续教育自动答题
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  安阳师范继续教育自动答题 v1.1
// @author       Abiu iikx.cc
// @match        https://kc.jxjypt.cn/paper/start*
// @match        http://kc.jxjypt.cn/paper/start*
// @match        http://kc.jxjypt.cn/classroom/start*
// @match        https://kc.jxjypt.cn/classroom/start*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493458/%E5%AE%89%E9%98%B3%E5%B8%88%E8%8C%83%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/493458/%E5%AE%89%E9%98%B3%E5%B8%88%E8%8C%83%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// 监听xhr
	function addXMLRequestCallback(callback) {
		var oldSend, i;
		if (XMLHttpRequest.callbacks) {
			XMLHttpRequest.callbacks.push(callback);
		} else {
			XMLHttpRequest.callbacks = [callback];
			oldSend = XMLHttpRequest.prototype.send;
			XMLHttpRequest.prototype.send = function () {
				for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
					XMLHttpRequest.callbacks[i](this);
				}
				oldSend.apply(this, arguments);
			};
		}
	}
	// 获取当前URL
	function getCurrentURL() {
		return window.location.href;
	}

	if (getCurrentURL().includes('kc.jxjypt.cn/paper/start')) {
		addExercise();
	} else if (getCurrentURL().includes('kc.jxjypt.cn/classroom/start')) {
		addCurriculumQuestion();
	}

	function addCurriculumQuestion() {
		let CURRICULUM_LENGTH =
			document.querySelectorAll('dd[data-jie-id]').length; // 课程节数

		let CURRICULUM_INDEX = 0; // 课程索引

		function clickJie() {
			if (CURRICULUM_INDEX >= CURRICULUM_LENGTH) return;
			document
				.querySelectorAll('dd[data-jie-id]')
				[CURRICULUM_INDEX].click();
			setTimeout(() => {
				document
					.querySelectorAll('.m-question-option')
					.forEach((item) => {
						item.click();
					});

				CURRICULUM_INDEX++;
				setTimeout(() => {
					clickJie();
				}, 1000);
			}, 2000);
		}

		function createStartButton() {
			let button = document.createElement('button');
			button.innerHTML = '开始答题';
			button.style.padding = '10px 20px';
			button.style.margin = '10px 0';
			button.style.background = '#10A546';
			button.style.color = 'white';
			button.style.border = 'none';
			button.style.borderRadius = '5px';
			button.style.cursor = 'pointer';
			button.onclick = function () {
				clickJie();
			};
			document
				.querySelector('.course')
				.insertBefore(
					button,
					document.querySelector('.course').firstChild
				);
		}

		createStartButton();
	}

	function addExercise() {
		let QUESTION_INDEX = 0; // 题索引
		let QUESTION_LENGTH = document
			.querySelector('#e__doneCount')
			.innerHTML.split('/')[1]
			.trim(); // 题目总数

		addXMLRequestCallback(function (xhr) {
			xhr.addEventListener('load', function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					if (
						xhr.responseURL.indexOf(
							'https://kc.jxjypt.cn/paper/question/resolve/tx'
						) === -1
					)
						return;
					let res = JSON.parse(xhr.responseText);
					if (QUESTION_INDEX >= QUESTION_LENGTH) return;
					if (document.querySelector('.jiandati') != null) {
						let question =
							document.querySelectorAll('.e__textarea')[
								QUESTION_INDEX
							];
						question.value = res.data;
					} else {
						// 参考答案：D\n答案解析：暂无
						//参考答案：ABC\n答案解析：暂无
						// 正则提取出答案D
						let answer = res.content
							.match(/参考答案：(.*)/)[1]
							.split('');
						console.log(answer);
						// 查找.sub-answer下的子元素dd 属性data-value值为answer的元素
						answer.forEach((item) => {
							if (item.includes('对')) {
								item = '正确';
							} else if (item.includes('错')) {
								item = '错误';
							}
							document
								.querySelectorAll('.sub-answer')
								[QUESTION_INDEX].querySelector(
									`dd[data-value="${item}"]`
								)
								.click();
						});
					}
					QUESTION_INDEX++;
					clickZkjx();
				}
			});
		});

		// 点击展开解析
		function clickZkjx() {
			if (QUESTION_INDEX >= QUESTION_LENGTH)
				return document.getElementById('btn_submit').click();
			document.getElementsByClassName('zkjx')[QUESTION_INDEX].click();
		}

		// 创建按钮填写答案
		function createAnswerButton() {
			let button = document.createElement('button');
			button.innerHTML = '填写答案';
			button.style.padding = '10px 20px';
			button.style.margin = '10px 0';
			button.style.background = '#10A546';
			button.style.color = 'white';
			button.style.border = 'none';
			button.style.borderRadius = '5px';
			button.style.cursor = 'pointer';
			button.onclick = function () {
				clickZkjx();
			};
			// 在.ft之前插入按钮
			document
				.getElementsByClassName('ft')[0]
				.insertBefore(
					button,
					document.getElementsByClassName('ft')[0].firstChild
				);
		}
		createAnswerButton();
	}
	console.log('脚本载入完毕');
})();
