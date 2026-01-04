// ==UserScript==
// @name              允许右键复制GM
// @description       解除大部分网站禁止复制、剪切、选择文本、右键菜单的限制。
// @homepageURL       https://github.com/xinggsf/gm/
// @author            gm
// @version           1.8
// @include           *://wenku.baidu.com/*
// @include           *://youshibaodian.com/*
// @include           *://*.youshibaodian.com/*
// @include           *://*.meipian.cn/*
// @include           *://5ykj.com/*
// @include           *://*.5ykj.com/*
// @include           *://mmyuer.com/*
// @include           *://*.mmyuer.com/*

// @grant             GM_addStyle
// @run-at            document-start
// @namespace text-select-contextmenu
// @downloadURL https://update.greasyfork.org/scripts/425146/%E5%85%81%E8%AE%B8%E5%8F%B3%E9%94%AE%E5%A4%8D%E5%88%B6GM.user.js
// @updateURL https://update.greasyfork.org/scripts/425146/%E5%85%81%E8%AE%B8%E5%8F%B3%E9%94%AE%E5%A4%8D%E5%88%B6GM.meta.js
// ==/UserScript==

"use strict";
// 域名规则列表
const rules = {
	plus: {
		hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
		unhook_eventNames: "mousedown|mouseup|keydown|keyup",
		dom0: true,
		hook_addEventListener: true,
		hook_preventDefault: true,
		add_css: true
	}
};

const returnTrue = e => true;
// 获取目标域名应该使用的规则
const getRule = (host) => rules[host] || rules.plus;
const dontHook = e => !!e.closest('form');
// 储存被 Hook 的函数
const EventTarget_addEventListener = EventTarget.prototype.addEventListener;
const document_addEventListener = document.addEventListener;
const Event_preventDefault = Event.prototype.preventDefault;
// 要处理的 event 列表
let hook_eventNames, unhook_eventNames, eventNames;

// Hook addEventListener proc
function addEventListener(type, func, useCapture) {
	const _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
	const a = hook_eventNames.includes(type) ? [type, returnTrue, useCapture] : arguments;
	_addEventListener.apply(this, a);
}

// 清理或还原DOM节点的onxxx属性
function clearLoop() {
	let type, prop,
	c = [document,document.body, ...document.getElementsByTagName('div')],
	// https://life.tw/?app=view&no=746862
	e = document.querySelector('iframe[src="about:blank"]');
	if (e && e.clientWidth>99 && e.clientHeight>11) {
		e = e.contentWindow.document;
		c.push(e, e.body);
	}

	for (e of c) {
		if (!e) continue;
		e = e.wrappedJSObject || e;
		for (type of eventNames) {
			prop = 'on' + type;
			e[prop] = null;
		}
	}
}

function init() {
	// 获取当前域名的规则
	let rule = getRule(location.host);
	// 设置 event 列表
	hook_eventNames = rule.hook_eventNames.split("|");
	// Allowed to return value
	unhook_eventNames = rule.unhook_eventNames.split("|");
	eventNames = hook_eventNames.concat(unhook_eventNames);

	if (rule.dom0) {
		setInterval(clearLoop, 9e3);
		setTimeout(clearLoop, 1e3);
		window.addEventListener('load', clearLoop, true);
	}

	if (rule.hook_addEventListener) {
		EventTarget.prototype.addEventListener = addEventListener;
		document.addEventListener = addEventListener;
	}

	if (rule.hook_preventDefault) {
		Event.prototype.preventDefault = function () {
			if (dontHook(this.target) || !eventNames.includes(this.type)) {
				Event_preventDefault.apply(this, arguments);
			}
		};
	}

	if (rule.add_css) GM_addStyle(
		`html, * {
			-webkit-user-select:text !important;
			-moz-user-select:text !important;
			user-select:text !important;
		}
		::-moz-selection {color:#111 !important; background:#05D3F9 !important;}
		::selection {color:#111 !important; background:#05D3F9 !important;}`
	);
}

init();
