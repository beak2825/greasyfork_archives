// ==UserScript==
// @name         work
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      MIT
// @description  test
// @author       fc
// @match        *://*.baidu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460740/work.user.js
// @updateURL https://update.greasyfork.org/scripts/460740/work.meta.js
// ==/UserScript==

(function () {
	"use strict";
	console.log('hello');

	const a = document.createElement('a');
	a.className = 'test';

	// 将a插入页面中
	document.body.appendChild(a)
})();

GM_addStyle(`
	a.test {
		color: 'red';
	}
`)