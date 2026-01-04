// ==UserScript==
// @name         Tagsy
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  自动标注! 解放双手! 尽情摸鱼!
// @author       Gwencutilia
// @match        https://qlabel.tencent.com/workbench/tasks/*
// @icon         https://www.emojiall.com/images/60/microsoft/2728.png
// @require      https://update.greasyfork.org/scripts/542771/1625541/Tagsy_Import_New.js
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/535077/Tagsy.user.js
// @updateURL https://update.greasyfork.org/scripts/535077/Tagsy.meta.js
// ==/UserScript==
(async function () {
	await LoadGlobalAllScripts();
	ModelConfigs.DouBao.ApiKey = ""; 	// Doubao APIKey
	ModelConfigs.DeepSeek.ApiKey = ""; 	// DeepSeek APIKey
	ModelConfigs.ChatGPT.ApiKey = ""; 	// ChatGPT APIKey
	SeaTableConfig.ApiKey = ""; 		// SeaTable APIKey
	UserAuthConfig.UserID = ""; 		// 用户ID
	UserAuthConfig.Password = ""; 		// 用户密码
	await InitScript();
})()