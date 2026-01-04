// ==UserScript==
// @name         hu60自动登录
// @namespace    https://greasyfork.org/zh-CN/users/6065-hatn
// @version      0.1.2
// @description  未登录/登录失效时 自动登录，使用前需配置 userAccount 里的账号密码
// @author       hatn
// @icon         http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @include       http*://hu60.cn*
// @include       http*://hu60.net*
// @grant        none
// @run-at     	document-end
// @downloadURL https://update.greasyfork.org/scripts/405113/hu60%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/405113/hu60%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

const userAccount = {name: '你的账号', pass: '你的密码'}; // 配置账号密码

(function() {
    'use strict';
    if (userAccount.name == '' || userAccount.pass == '' || userAccount.name == '你的账号' || userAccount.pass == '你的密码') return console.log('Log: user/pass not format !');
	let catReg = /title=.立即注册./gi;
	let catLogin = /(user.login.html)\?u=[^"]+"[\s]+title="登录"/gi;
	let header_str = $('header')[0].outerHTML;
	if (!catReg.test(header_str) || $('.login-form').length >= 1) return console.log('log: hu60 autologin not work'); // 登录/注册页 不作处理

	let loginUrlRes = catLogin.exec(header_str);
	if (loginUrlRes == null) return console.log('error: find login url failed');
	let loginUrl = loginUrlRes[1].replace(/html/i, "json");

	// auto login
	$.post(loginUrl, {...userAccount, go: 1}, data => {
		console.log(data);
		location.href = location.href;
	});
})();