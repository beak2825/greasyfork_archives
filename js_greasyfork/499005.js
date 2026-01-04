// ==UserScript==
// @name         YCZY录入成绩
// @namespace    http://tampermonkey.net/
// @version      2024-06-26
// @description  记录学生成绩
// @license 
// @author       You
// @match        *://125.219.132.9/jwweb/XSCJ/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499005/YCZY%E5%BD%95%E5%85%A5%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/499005/YCZY%E5%BD%95%E5%85%A5%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var textarea1 = document.createElement('textarea');
	textarea1.rows = '10';
	textarea1.cols = '20';
	textarea1.id = 'textarea';
	textarea1.textContent = "平时成绩";
	document.body.appendChild(textarea1);

	textarea1.addEventListener('input',function () {
		console.log('demo....')
		console.log('Text changed to:', this.value);
		const pastedData = this.value;
		let arr = [];
		try {
			arr = pastedData.split('\n')
					.filter(item => item !== '') // 兼容Excel行末\n，防止出现多余空行
					.map(item => item.split('\t')) // 将每行按制表符分割成列
					.map(item => {
						// 去掉每列中的\r字符，使用模板字符串
						return item.map(str => str.replace(/\r/g, ''));
					});
		} catch (error) {
			console.error("Error parsing pasted data:", error);
			return; // 在遇到异常时终止处理
		}

		var sum = 1
		arr.forEach(item => {
			// console.log(sum)
			console.log(item)
			console.log(item[0])
			console.log(item[1])
			// CHKPSCJ1

			var inputElement1 = document.getElementById('CHKPSCJ' + sum);
			inputElement1.value = item[0];

			var inputElement2 = document.getElementById('CHKQMCJ' + sum);
			inputElement2.value = item[1];
			sum++
		});

        var summ=1
        arr.forEach(item => {
			var inputElement1 = document.getElementById('CHKPSCJ' + summ);
			inputElement1.focus();
			summ++
		});


	})


document.querySelectorAll('input').forEach(function (input) {
		input.addEventListener('paste', function (event) {
			event.preventDefault(); // 可选：阻止默认粘贴行为
			// 获取粘贴板数据
			const clipboardData = event.clipboardData || window.clipboardData;
			const pastedData = clipboardData.getData('Text');

			// 初始化用于存储解析后的数据的数组
			let arr = [];
			try {
				arr = pastedData.split('\n')
						.filter(item => item !== '') // 兼容Excel行末\n，防止出现多余空行
						.map(item => item.split('\t')) // 将每行按制表符分割成列
						.map(item => {
							// 去掉每列中的\r字符，使用模板字符串
							return item.map(str => str.replace(/\r/g, ''));
						});
			} catch (error) {
				console.error("Error parsing pasted data:", error);
				return; // 在遇到异常时终止处理
			}

			var preIdAll = event.target.id
			var preID = getLastNumber(event.target.id);
			var result = preIdAll.replace(new RegExp(preID, ''), "");
			let preNumber = Number(preID)

			arr.forEach(item => {
				var inputElement1 = document.getElementById(result+ preNumber);
				inputElement1.value='';
				inputElement1.value = item[0];
				preNumber++;
			});


		});
	});


	function getLastNumber(str) {
		const match = str.match(/(\d+)$/);
		return match ? match[1] : null;
	}

})();