// ==UserScript==
// @name         去死吧！小木
// @namespace    github.com/tandf
// @version      0.0.1
// @description  干掉学堂在线中讨厌的学堂小木对话框
// @author       tandf
// @match        http://www.xuetangx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40998/%E5%8E%BB%E6%AD%BB%E5%90%A7%EF%BC%81%E5%B0%8F%E6%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/40998/%E5%8E%BB%E6%AD%BB%E5%90%A7%EF%BC%81%E5%B0%8F%E6%9C%A8.meta.js
// ==/UserScript==
var XiaoMu = document.getElementById('qarobot');
if (XiaoMu) {
	XiaoMu.parentNode.removeChild(XiaoMu);
}