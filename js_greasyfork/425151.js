// ==UserScript==
// @name         OpenWrt自动登录
// @namespace    https://greasyfork.org/zh-CN/users/6065-hatn
// @version      0.1
// @description  未登录/登录失效时 自动登录，使用前需配置 userAccount 里的账号密码 以及修改 @include 为正确的ip/域名
// @author       hatn
// @icon         http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @include      http*://192.168.123.2/*
// @include      http*://192.168.123.2
// @require0      https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @grant        none
// @run-at     	 document-end
// @downloadURL https://update.greasyfork.org/scripts/425151/OpenWrt%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/425151/OpenWrt%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

const userAccount = {name: 'root', pass: 'password'}; // 配置账号密码

let autoLoginObj = {
	init() {
		let $userInput = $('input[name="luci_username"]:eq(0)');
		let $passInput = $('input[name="luci_password"]:eq(0)');

		if ($userInput.length < 1 || $passInput.length < 1) return console.log('Log: No need to login in !');
		if (userAccount.name == '' || userAccount.pass == '') return console.log('Log: user/pass not format !');

		$userInput[0].value = userAccount.name;
		$passInput[0].value = userAccount.pass;
		$('input[value="登录"]:eq(0)').click();
	}
};

autoLoginObj.init();