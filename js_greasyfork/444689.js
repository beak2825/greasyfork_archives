// ==UserScript==
// @name         Console 加强版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  加强版 console ，用于调试代码。
// @author       Mu
// @match        */*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netease.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444689/Console%20%E5%8A%A0%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/444689/Console%20%E5%8A%A0%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
	('use strict');
	let consoleCount = 1;
	let messageBucket = [];
	let waitInterval = null;
	const MAX_CONSOLE_COUNT = 10;
	const DECORATE = 'color: #1890ff;padding:3px 20px 3px 12px;border:1px dashed #4C1D95;';
	// 获取变量类型
	function getType(obj) {
		var toString = Object.prototype.toString;
		var map = {
			'[object Boolean]': 'boolean',
			'[object Number]': 'number',
			'[object String]': 'string',
			'[object Function]': 'function',
			'[object Array]': 'array',
			'[object Date]': 'date',
			'[object RegExp]': 'regExp',
			'[object Undefined]': 'undefined',
			'[object Null]': 'null',
			'[object Object]': 'object'
		};
		return map[toString.call(obj)];
	}

	const CONSOLE_CONFIG = Object.freeze({
		// 成团输出
		isGroup: true,
		// 显示输出次数
		isShowCount: true,
		// 显示输出时间
		isShowTime: true,
		// 显示输出变量类型
		isShowType: true,
		// 显示trace信息
		isShowTrace: false
	});

	const myLog = ([consoleType, title, message]) => {
		console.group(
			`%c${title}%c${getType(message)}`,
			getPrevDecorate(consoleType),
			getMessageDecorate(consoleType)
		);
		console.log(message);
		console.groupEnd();
	};
	const getPrevDecorate = consoleType => {
		return DECORATE;
	};
	const getMessageDecorate = consoleType => {
		return DECORATE;
	};

	const primary = (...args) => {
		// if (consoleCount === 8) {
		// 	console.clear();
		// }
		// console.log(
		// 	`%cDev%c${args[0]}`,
		// 	'color:white;padding:3px 4px;background:#53a8ff;border:1px solid transparent;',
		// 	'color: #1890ff;padding:3px 4px;border:1px solid #53a8ff;'
		// );
		// if (args[1]) console.log(args[1]);
		// console.log(
		// 	`%cDev%c${args[0]}`,
		// 	'color:white;padding:3px 4px;background:#53a8ff;border:1px solid transparent;',
		// 	'color: #1890ff;padding:3px 4px;border:1px solid #53a8ff;'
		// );
		// if (args[1]) console.log(args[1]);

		messageBucket.push(['primary', ...args]);
		clearTimeout(waitInterval);
		waitInterval = setTimeout(() => exportFn());
	};
	const exportFn = () => {
		if (consoleCount % MAX_CONSOLE_COUNT === 0) {
			console.clear();
		}
		if (consoleCount > 1) console.log(' ');
		if (CONSOLE_CONFIG.isGroup) {
			console.group(getPrefix(), DECORATE);
		}
		messageBucket.forEach(m => {
			myLog(m);
			if (CONSOLE_CONFIG.isShowTrace) console.trace();
		});
		console.groupEnd();
		messageBucket = [];
		consoleCount++;
	};
	window.console.primary = primary;
	// console.primary('fire on the hole');

	const getPrefix = () => {
		return `%c${consoleCount}${new Date()
			.toLocaleString('zh', { hour12: false })
			.slice(4)
			.replace('/', '-')}`;
	};
})();
