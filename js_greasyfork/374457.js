// ==UserScript==
// @name         remember input
// @name:zh      记忆输入内容
// @supportURL   https://github.com/rectcircle/remember-input
// @namespace    https://github.com/rectcircle/remember-input
// @license      MIT
// @version      1.0.0
// @description         remember input content, when reopen will auto filled 
// @description:zh      记忆用户输入的内容，不小心关闭后重新打开将自动恢复填充内容（当初始状态时输入框内容为空时）
// @author       Rectcircle <rectcircle96@gmail.com>
// @icon         https://rectcircle-10022766.cos.ap-shanghai.myqcloud.com/user-script/remember-input/icon.png
// @include      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/374457/remember%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/374457/remember%20input.meta.js
// ==/UserScript==

//创建一个闭包，避免污染外部名字空间
;(function(){

	const STORAGE_KEY = '__remember_inputs_values__'

	function getRemeberValue(key){
		var remebers = localStorage.getItem(STORAGE_KEY);
		if(remebers == null){
			return null;
		}
		remebers = JSON.parse(remebers);
		return remebers[key] || null;
	}

	function setRemeberValue(key, value){
		var remebers = localStorage.getItem(STORAGE_KEY);
		if(remebers == null){
			remebers = "{}";
		}
		remebers = JSON.parse(remebers);
		remebers[key] = value;
		remebers = JSON.stringify(remebers);
		localStorage.setItem(STORAGE_KEY, remebers);
	}

	//创建一个元素的css选择符格式为tag#id.class
	function createCSSSelectorByEle(ele) {
		var selector = ele.localName;
		if (ele.id != "") {
			selector += '#' + ele.id;
		}
		if (ele.className != "") {
			var classNames = ele.classList;
			classNames.forEach(function (value) {
				selector += '.' + value;
			})
		}
		return selector;
	}

	function createSaveListener(ele, key){
		return function () {
			var value = ele.value;
			setRemeberValue(key, value);
			//=========personal hack, you can delete=========
			if (window.simplemde != undefined) {
				var mykey = "simplemde";
				var myvalue = window.simplemde.value();
				setRemeberValue(mykey, myvalue);
			}
			//===============================================
		}
	}
	
	function main(){
		console.log("开始恢复并监听输入")

		// 查询当前页面的输入框
		var nodes = document.body.querySelectorAll('textarea, input')

		//key计数
		var keyCnt = {};

		//=========personal hack, you can delete=========
		if (window.simplemde != undefined) {
			var key = "simplemde";
			if (keyCnt[key] === undefined) {
				keyCnt[key] = 1;
			} else {
				keyCnt[key]++;
				key = key + (keyCnt[key] - 1);
			}
			var value = getRemeberValue(key);
			if (window.simplemde.value() == "" && value != null) {
				window.simplemde.value(value)
			}
		}
		//===============================================

		// 遍历输入框
		nodes.forEach(function(ele){
			// 检测输入框是否为空且本地存储上是否有内容如果有直接恢复
			var key = createCSSSelectorByEle(ele);
			if (keyCnt[key] === undefined){
				keyCnt[key] = 1;
			} else {
				keyCnt[key] ++;
				key = key + (keyCnt[key] - 1);
			}
			var value = getRemeberValue(key);
			if(ele.value == "" && value != null){
				ele.value = value
			}
			// 添加监听函数
			ele.addEventListener("keydown", createSaveListener(ele, key));
		});

		// 给所有的输入框的修改添加事件，将修改内容放到本地存储中
	}
	setTimeout(main, 1000);
})();