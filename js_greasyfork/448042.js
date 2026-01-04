/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               I'm PY_DNG!
// @name:zh-CN         我是PY_DNG！
// @namespace          PY_DNG Debugger
// @version            0.1
// @description        For debugging
// @description:zh-CN  用以调试，提供$、$ALL、$CrE、$CopyProp、$CopyProps等基本函数
// @author             PY-DNG
// @license            GPL-3
// @match              http*://*/*
// @icon               https://api.iowen.cn/favicon/get.php?url=
// @grant              none
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/448042/I%27m%20PY_DNG%21.user.js
// @updateURL https://update.greasyfork.org/scripts/448042/I%27m%20PY_DNG%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.isPY_DNG = true;
	window.PYshowing = false;
	const func_baks = {};
	const funcs = window.PYfuncs = {
		'$': $,
		'$All': $All,
		'$CrE': $CrE,
		'copyProp': copyProp,
		'copyProps': copyProps
	};
	window.showPY = function() {
		if (window.PYshowing) {return false;}
		for (const [fname, func] of Object.entries(funcs)) {
			func_baks[fname] = window[fname];
			window[fname] = func;
		}
	};
	window.hidePY = function() {
		if (!window.PYshowing) {return false;}
		for (const [fname, func] of Object.entries(funcs)) {
			window[fname] = func_baks[fname];
		}
	};

	// Basic functions
	// querySelector
	function $() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelector(arguments[1]);
				break;
			default:
				return document.querySelector(arguments[0]);
		}
	}
	// querySelectorAll
	function $All() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelectorAll(arguments[1]);
				break;
			default:
				return document.querySelectorAll(arguments[0]);
		}
	}
	// createElement
	function $CrE() {
		switch(arguments.length) {
			case 2:
				return arguments[0].createElement(arguments[1]);
				break;
			default:
				return document.createElement(arguments[0]);
		}
	}
	// Object1[prop] ==> Object2[prop]
	function copyProp(obj1, obj2, prop) {obj1[prop] !== undefined && (obj2[prop] = obj1[prop]);}
	function copyProps(obj1, obj2, props) {props.forEach((prop) => (copyProp(obj1, obj2, prop)));}
})();