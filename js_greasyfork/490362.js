// ==UserScript==
// @name         美化知乎打印
// @namespace    http://tampermonkey.net/
// @version      2024-03-20
// @description  在打印知乎文章网页时，或者另存为pdf时，有很多干扰元素占面积，这个脚本能删除这些干扰元素。但是右侧的分享等按钮是滚动才出现，所以不能立马删除。
// @author       Tajang
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490362/%E7%BE%8E%E5%8C%96%E7%9F%A5%E4%B9%8E%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490362/%E7%BE%8E%E5%8C%96%E7%9F%A5%E4%B9%8E%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

window.onload = function () {
	"use strict";
	//删除头部横幅
	// 执行 XPath 查询以选择要删除的元素
	let xpathResult = document.evaluate(
		'//*[@id="root"]/div/main/div/div[1]/div/div[1]',
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	);

	// 获取查询结果中的第一个节点
	let buttonToRemove = xpathResult.singleNodeValue;

	// 检查按钮元素是否存在
	if (buttonToRemove) {
		// 从父元素中移除按钮元素
		buttonToRemove.parentNode.removeChild(buttonToRemove);
		console.log("头部横幅已删除");
	} else {
		console.log("头部横幅元素找不到");
	}

	//删除底部功能栏
	// 执行 XPath 查询以选择要删除的元素
	let botbar = document.evaluate(
		'//*[@id="root"]/div/main/div/article/div[4]/div[1]/div[1]',
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	);

	// 获取查询结果中的第一个节点
	let buttonToRemove2 = botbar.singleNodeValue;

	// 检查按钮元素是否存在
	if (buttonToRemove2) {
		// 从父元素中移除按钮元素
		buttonToRemove2.parentNode.removeChild(buttonToRemove2);
		console.log("底部功能栏已删除");
	} else {
		console.log("底部功能栏找不到");
	}

	//删除关注按钮
	// 执行 XPath 查询以选择要删除的元素
	let gzbar = document.evaluate(
		'//*[@id="root"]/div/main/div/article/header/div[1]/button',
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	);

	// 获取查询结果中的第一个节点
	let buttonToRemove7 = gzbar.singleNodeValue;

	// 检查按钮元素是否存在
	if (buttonToRemove7) {
		// 从父元素中移除按钮元素
		buttonToRemove7.parentNode.removeChild(buttonToRemove7);
		console.log("关注按钮已删除");
	} else {
		console.log("关注按钮找不到");
	}
	//删除赞同人数
	// 执行 XPath 查询以选择要删除的元素
	let zanbar = document.evaluate(
		'//*[@id="root"]/div/main/div/article/header/div[3]',
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	);

	// 获取查询结果中的第一个节点
	let buttonToRemove3 = zanbar.singleNodeValue;

	// 检查按钮元素是否存在
	if (buttonToRemove3) {
		// 从父元素中移除按钮元素
		buttonToRemove3.parentNode.removeChild(buttonToRemove3);
		console.log("赞同人数栏已删除");
	} else {
		console.log("赞同人数栏找不到");
	}

	//删除回到顶部按钮
	// 执行 XPath 查询以选择要删除的元素
	let hdbar = document.evaluate(
		'//*[@id="root"]/div/div[3]/div/div/button',
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	);

	// 获取查询结果中的第一个节点
	let buttonToRemove4 = hdbar.singleNodeValue;

	// 检查按钮元素是否存在
	if (buttonToRemove4) {
		// 从父元素中移除按钮元素
		buttonToRemove4.parentNode.removeChild(buttonToRemove4);
		console.log("回到顶部按钮已删除");
	} else {
		console.log("回到顶部按钮找不到");
	}
	//删除右侧赞同按钮
	// 等待元素出现的函数
	function waitForElement(xpath, callback) {
		const element = document.evaluate(
			xpath,
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;

		if (element) {
			// 如果找到元素，执行回调函数
			callback(element);
		} else {
			// 如果未找到元素，延迟一段时间后再次尝试
			setTimeout(function () {
				waitForElement(xpath, callback);
			}, 1000); // 每隔1秒重新尝试一次
		}
	}

	// 调用 waitForElement 函数，传入元素的 XPath 和删除元素的操作
	waitForElement(
		'//*[@id="root"]/div/main/div/article/div[4]/div[1]/div/button',
		function (element) {
			// 删除找到的元素
			element.parentNode.removeChild(element);
			console.log("元素已删除");
		}
	);

	//删除右侧分享按钮
	function waitForElement2(xpath, callback) {
		const element = document.evaluate(
			xpath,
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;
		if (element) {
			// 如果找到元素，执行回调函数
			callback(element);
		} else {
			// 如果未找到元素，延迟一段时间后再次尝试
			setTimeout(function () {
				waitForElement2(xpath, callback);
			}, 1000); // 每隔1秒重新尝试一次
		}
	}

	// 调用 waitForElement 函数，传入元素的 XPath 和删除元素的操作
	waitForElement2(
		'//*[@id="root"]/div/main/div/article/div[4]/div[1]/div/div',
		function (element) {
			// 删除找到的元素
			element.parentNode.removeChild(element);
			console.log("元素已删除");
		}
	);

	//删除底部栏
	// 执行 XPath 查询以选择要删除的元素
	let footbar = document.evaluate(
		'//*[@id="root"]/div/main/div/div[2]',
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	);

	// 获取查询结果中的第一个节点
	let buttonToRemove8 = footbar.singleNodeValue;

	// 检查按钮元素是否存在
	if (buttonToRemove8) {
		// 从父元素中移除按钮元素
		buttonToRemove8.parentNode.removeChild(buttonToRemove8);
		console.log("底部已删除");
	} else {
		console.log("底部找不到");
	}
};
