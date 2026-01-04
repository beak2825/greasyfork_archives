// ==UserScript==
// @name         Tagsy_QLTaskCount
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Tagsy的分支模块, 用于完善 QLabel 的任务统计功能
// @author       Gwencutilia
// @match        https://qlabel.tencent.com/workbench/work-time
// @match        https://qlabel.tencent.com/workbench/label-tasks
// @match        https://qlabel.tencent.com/workbench/work-time/*
// @match        https://qlabel.tencent.com/workbench/label-tasks/*
// @icon         https://www.emojiall.com/images/60/microsoft/2728.png
// @require      https://update.greasyfork.org/scripts/542771/1625541/Tagsy_Import_New.js
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/540717/Tagsy_QLTaskCount.user.js
// @updateURL https://update.greasyfork.org/scripts/540717/Tagsy_QLTaskCount.meta.js
// ==/UserScript==
(async function () {
	await LoadGlobalAllScripts();
	await QLTaskCount();
})()