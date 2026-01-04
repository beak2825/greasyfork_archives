// ==UserScript==
// @name         找色差趣味小游戏--辅助器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       初衷
// @match        http://www.zhaosecha.com/
// @match        www.zhaosecha.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhaosecha.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473363/%E6%89%BE%E8%89%B2%E5%B7%AE%E8%B6%A3%E5%91%B3%E5%B0%8F%E6%B8%B8%E6%88%8F--%E8%BE%85%E5%8A%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/473363/%E6%89%BE%E8%89%B2%E5%B7%AE%E8%B6%A3%E5%91%B3%E5%B0%8F%E6%B8%B8%E6%88%8F--%E8%BE%85%E5%8A%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// Your code here...

	// 创建一个输入框 用于输入关卡数
	const input = document.createElement('input');
	input.type = 'number';
	input.id = 'levelNum';
	input.value = '1';
	document.body.appendChild(input);
	// 创建一个按钮 用于开始
	const btn = document.createElement('button');
	btn.id = 'start';
	btn.innerText = '开始';
	document.body.appendChild(btn);

	let interval = null;

	let gradeNum = 0;
	// 点击按钮
	document.getElementById('start').onclick = function() {
		// 监听页面是否开始 如果界面没有 重新测试和开始测试按钮开始检索
		if (document.getElementById('play')) {
			document.getElementById('play').click();
		}
		clickBtn();
		// 一直重复之前的操作
		interval = setInterval(() => {
			clickBtn();
		}, 350);

	};

	function clickBtn() {
		if (!(gradeNum&&gradeNum!=0)){
			setTimeout(() => {
				// 获取输入框的值
				const level = document.getElementById('levelNum');
				gradeNum = level.value;
			}, 1000);
		}
		// <div id="box" style="display: block; width: 500px; height: 500px;" className="lv4"><span onMouseDown="checkClick(0)"
		// 																						 style="width:50%;height:50%;border:3px solid #ddd;border-radius:10px;background-color:#491386;"></span><span
		// 	onMouseDown="checkClick(1)"
		// 	style="width:50%;height:50%;border:3px solid #ddd;border-radius:10px;background-color:#491386;"></span><span
		// 	onMouseDown="checkClick(2)"
		// 	style="width:50%;height:50%;border:3px solid #ddd;border-radius:10px;background-color:rgb(188,134,249);"></span><span
		// 	onMouseDown="checkClick(3)"
		// 	style="width:50%;height:50%;border:3px solid #ddd;border-radius:10px;background-color:#491386;"></span></div>
		// 根据元素寻找不同的元素 并且点击 点击之后重复之前的操作
		// 获取所有的span
		const spans = document.querySelectorAll('#box span');
		// 获取所有的颜色
		const colors = Array.from(spans).map(span => span.style.backgroundColor);
		// 获取不同的颜色
		const diffColor = colors.find(color => colors.filter(c => c === color).length === 1);
		// 获取不同颜色的索引
		const diffIndex = colors.findIndex(color => color === diffColor);
		// 点击不同颜色的元素
		let element = spans[diffIndex];
		let event = new MouseEvent('mousedown', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		element.dispatchEvent(event);
		event = new MouseEvent('mouseup', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		element.dispatchEvent(event);
		//<span class="o" style="float:left;">过关:<span id="grade">41</span> </span>
		const grade = document.querySelector('#grade');
		console.log(grade.innerText);
		if (grade.innerText === gradeNum+'') {
			// 停止程序
			alert('停止程序');
			clearInterval(interval);//清除定时器
		}
	}
})();
