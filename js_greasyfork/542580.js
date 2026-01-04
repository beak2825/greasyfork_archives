// ==UserScript==
// @name         Tagsy_WeComTable
// @namespace    http://tampermonkey.net/*
// @version      1.0.3
// @description  Tagsy的分支模块, 用于自动填写企业微信的产量表格
// @author       Gwencutilia
// @match        https://doc.weixin.qq.com/*
// @icon         https://www.emojiall.com/images/60/microsoft/2728.png
// @require      https://update.greasyfork.org/scripts/542771/1625541/Tagsy_Import_New.js
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/542580/Tagsy_WeComTable.user.js
// @updateURL https://update.greasyfork.org/scripts/542580/Tagsy_WeComTable.meta.js
// ==/UserScript==

(async function () {
        let Username = "";
	await LoadGlobalAllScripts();
	await Tagsy_WeComTable(Username);
})();