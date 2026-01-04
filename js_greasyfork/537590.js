// ==UserScript==
// @name         Tagsy_W2TickRoo
// @namespace    http://tampermonkey.net/*
// @version      1.0.10
// @description  Tagsy的分支模块, 用于自动登录万维平台以及打卡
// @author       Gwencutilia
// @match        https://wanwei.myapp.com/*
// @match        *://mail.qq.com/cgi-bin/today*
// @match        *://mail.qq.com/cgi-bin/mail_list*
// @match        *://mail.qq.com/cgi-bin/readmail*
// @icon         https://www.emojiall.com/images/60/microsoft/2728.png
// @require      https://update.greasyfork.org/scripts/542771/1625541/Tagsy_Import_New.js
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/537590/Tagsy_W2TickRoo.user.js
// @updateURL https://update.greasyfork.org/scripts/537590/Tagsy_W2TickRoo.meta.js
// ==/UserScript==

(async function () {
    const username = "";
    const password = "";
	await LoadGlobalAllScripts();
	await W2AutoMatically(username, password);
})();