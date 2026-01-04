// ==UserScript==
// @name 新标签页打开
// @namespace undefined
// @version 0.1
// @description 强制所有链接在新标签页打开
// @match https://*/*
// @match http://*/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/32549/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/32549/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
document.body.addEventListener('mousedown', function (e) {
	e.target.target = '_blank';
    e.target.parentNode.target='_blank';
	e.target.parentNode.parentNode.target='_blank';
	e.target.parentNode.parentNode.parentNode.target='_blank';
	e.target.parentNode.parentNode.parentNode.parentNode.target='_blank';
})