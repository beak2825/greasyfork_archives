// ==UserScript==
// @name         有道5000字数限制解除
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description  添加两个按钮，当粘贴进超过5000字时，点击这两个按钮会自动替换至下一个5000字或者上一个5000字。原来有道翻译网页中超过5000字后，5000字之后的部分不会被删掉，最近UI更新之后会被删掉，于是不得不写个脚本了，不然还得手动再粘贴一遍太麻烦了。
// @author       You
// @match        https://fanyi.youdao.com/?keyfrom=dict2.index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499111/%E6%9C%89%E9%81%935000%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/499111/%E6%9C%89%E9%81%935000%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==


let savePaste = '';
let _html = `
<div data-v-7a66a596="" id="previous5000" class="tab-item color_text_3"><span data-v-7a66a596="">上一个5000字</span></div>
<div data-v-7a66a596="" id="next5000" class="tab-item color_text_3"><span data-v-7a66a596="">下一个5000字</span></div>
`;



setTimeout(() => {
	document.querySelector("#js_fanyi_input").addEventListener("paste", function (e) {
		debugger;
		if (!(e.clipboardData && e.clipboardData.items)) {
			return;
		}

		currentIndex = 5000, maxCharsPerClick = 5000;
		for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
			var item = e.clipboardData.items[i];
			if (item.type !== 'text/plain') {
				continue;
			}
			item.getAsString(function (str) {
				// str 是获取到的字符串
				console.log(str);
				savePaste = str;
			})
		}
	});

	// 首先，获取到<div class="tab-left">元素
	var tabLeft = document.querySelector("div.tab-left");

	// 在<div class="tab-left">元素的末尾插入新内容
	tabLeft.insertAdjacentHTML('beforeend', _html);

	// 绑定点击事件到指定的元素
	document.querySelector("#next5000").addEventListener("click", handleNext);
	document.querySelector("#previous5000").addEventListener("click", handlePrevious);
}, 3000); // 得延时一下，不然会添加不上事件监听，不知道为什么




var maxCharsPerClick = 5000; // 每次点击最多读取的字符数
var currentIndex = 5000; // 当前读取的索引

function handleNext() {
	// 确保还有剩余的字符可以读取
	if (currentIndex + maxCharsPerClick <= savePaste.length) {

	} else {
		// 如果已经没有更多字符可以读取，可以提醒用户
		// alert("已经没有更多内容可以显示了。"); // 有道把alert赋值为空了
		console.log("已经没有更多内容可以显示了。");
	}

	// 计算从当前索引到最大索引之间的字符串
	var fragment = savePaste.substring(currentIndex, currentIndex + maxCharsPerClick); // 超过字符串长度也不会报错，所以就不管了

	// 将片段显示在页面上，这里假设有一个元素用来显示文本
	document.querySelector("#js_fanyi_input").innerText = fragment;
	document.querySelector("#js_fanyi_input").dispatchEvent(new InputEvent("input"));

	// 更新当前索引，为下一次点击准备
	currentIndex += maxCharsPerClick;
}

function handlePrevious() {
	// 确保还有剩余的字符可以读取
	if (currentIndex - maxCharsPerClick >= 5000) {
			// 计算从当前索引往前的字符串
			var startIndex = Math.max(0, currentIndex - 2 * maxCharsPerClick);
			var fragment = savePaste.substring(startIndex, currentIndex - maxCharsPerClick);

			// 将片段显示在页面上，这里假设有一个元素用来显示文本
			document.querySelector("#js_fanyi_input").innerText = fragment;
			document.querySelector("#js_fanyi_input").dispatchEvent(new InputEvent("input"));

			// 更新当前索引，为下一次点击准备
			currentIndex -= maxCharsPerClick;
	} else {
			// 如果已经没有更多字符可以读取，可以提醒用户
			console.log("已经到达文本的开头。");
	}
}
