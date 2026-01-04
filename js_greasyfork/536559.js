// ==UserScript==
// @name         Tagsy_LSTockDaily
// @namespace    http://tampermonkey.net/*
// @version      1.0.12
// @description  Tagsy的功能拓展, 用于自动填写日报
// @author       Gwencutilia
// @match        http://biaoju.labelvibe.com/*
// @icon         https://www.emojiall.com/images/60/microsoft/2728.png
// @require      https://update.greasyfork.org/scripts/542771/1625541/Tagsy_Import_New.js
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/536559/Tagsy_LSTockDaily.user.js
// @updateURL https://update.greasyfork.org/scripts/536559/Tagsy_LSTockDaily.meta.js
// ==/UserScript==

(async function () {
	await LoadGlobalAllScripts();
	let username = "";
	let password = "";
	await DailyRefresh(username, password);
	await DailyAt(username, password);
})()