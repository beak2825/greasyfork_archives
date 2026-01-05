// ==UserScript==
// @name				Tieba Bypass Login
// @name:zh-CN			Tieba Bypass Login
// @namespace			xuyiming.open@outlook.com
// @author				依然独特
// @description			解除百度贴吧强制登录
// @description:zh-CN	解除百度贴吧强制登录
// @version				0.0.4
// @run-at				document-start
// @require				https://greasyfork.org/scripts/18715-hooks/code/Hooks.js?version=661566
// @include				*://tieba.baidu.com/*
// @include				*://tiebac.baidu.com/*
// @include				*://*.tieba.baidu.com/*
// @match				*://tieba.baidu.com/*
// @match				*://tiebac.baidu.com/*
// @match				*://*.tieba.baidu.com/*
// @grant				unsafeWindow
// @license				CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/24845/Tieba%20Bypass%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/24845/Tieba%20Bypass%20Login.meta.js
// ==/UserScript==

"use strict";

(function() {
	let executed = false

	// We want to change user login state as soon as possible
	Hooks.get(unsafeWindow, "_", (...args) => {
		const [_target, _propertyName, _oldValue, _newValue] = args
		
		// Only on desktop site `PageData' will be defined
		if (!executed && unsafeWindow.PageData != null) {
			unsafeWindow.PageData.user.is_login = 1
			unsafeWindow.PageData.user.no_login_user_browse_switch = 0
			executed = true
		}

		return Hooks.Reply.get(args);
	})
})()
