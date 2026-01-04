// ==UserScript==
// @name         实验室安全考试
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  兰州交通大学实验室安全教育学习考试平台考试助手
// @author       白白小草
// @match        http://labmis.lzjtu.edu.cn/safe/client_pc/kstest-begin.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzjtu.edu.cn
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/480938/%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/480938/%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	setTimeout(() => {
		
		const floatingInfo = document.createElement('div');
		floatingInfo.className = 'floating-info';
		var info =
			'<div style="position: fixed; left: 0; top: 20%; transform: translateY(-50%); background-color: #3498db; color: #fff; padding: 10px; z-index: 1000;">选择题对应选项为<br>&nbsp;&nbsp;&nbsp;1-A<br>&nbsp;&nbsp;&nbsp;2-B<br>&nbsp;&nbsp;&nbsp;3-C<br>&nbsp;&nbsp;&nbsp;4-D<br/>判断题为<br>&nbsp;&nbsp;&nbsp;0-错误<br>&nbsp;&nbsp;&nbsp;1-正确</div>';
		floatingInfo.innerHTML = info;
		const header = document.getElementsByClassName('top');
		for (const head of header){
			head.appendChild(floatingInfo)
		}
		
		var answers = document.getElementsByClassName('CorrectAnswer');

		const valuesArray = Object.values(answers).map(item => item.value);

		// console.log(valuesArray)

		document.addEventListener('click', function(event) {

            const answerDiv = document.getElementById('answer');
			if (answerDiv) {
				// 获取父元素
				const parentElement = answerDiv.parentNode.parentNode;
				// 从父元素中移除 id="answer" 的 div 元素
				parentElement.removeChild(answerDiv.parentNode);
			}

			// 当前的题目数
			const tsIngValue = document.querySelector('.ts-ing').textContent;
			let count = valuesArray[tsIngValue - 1];
			// console.log('value:', count)
			if(count == 4){
				count = 3;
			}else if(count == 8){
				count = 4;
			}

			// 创建浮动图标元素
			const floatingIcon = document.createElement('div');
			floatingIcon.className = 'floating-icon';

			var html1 =
				'<div id="answer" style="position: fixed; left: 0; top: 50%; transform: translateY(-50%); background-color: #3498db; color: #fff; padding: 10px; border-radius: 50% 0 0 50%; z-index: 1000;">';
			var html2 = '</div>';
			floatingIcon.innerHTML = html1 + count + '<br>' + html2;
			// 将浮动图标添加到 #mashangxz 中
			// document.getElementById('mashangxz').appendChild(floatingIcon);
			const header = document.getElementsByClassName('top');
			for (const head of header){
				head.appendChild(floatingIcon)
			}
			// document.getElementsByClassName('top').appendChild(floatingIcon);
		});
	}, 500)

})();