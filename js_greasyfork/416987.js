// ==UserScript==
// @name         南大科院校园网自动填充登录
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  只用于南昌大学科学技术学院校园网的自动登录
// @author       Chen Peng Fei
// @match        http://10.10.10.10/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416987/%E5%8D%97%E5%A4%A7%E7%A7%91%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/416987/%E5%8D%97%E5%A4%A7%E7%A7%91%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
	var timer = null;
	const reflashTime = 0.5; //在单引号里输入登陆后改变页面的时间，单位为秒
	window.onload = function () {
		const GetAccount = "123"; //在单引号里面填登陆账号（手机号）
		const GetPassWord = "123"; //在单引号里面填登陆密码
		const IsClick = true; //设置自动填充后是否登录，true启用，false关闭
		const Network_numb = 3; //1校园网，2中国移动，3中国电信
		var account = document.getElementsByName("DDDDD");
		var password = document.getElementsByName("upass");
		var network = document.getElementsByName("network");
		var login = document.getElementsByName("0MKKey");
        var btn = document.getElementsByClassName('edit_lobo_cell');

		function Login() {
			if (btn[0].value == "登录") {
				account[1].value = GetAccount;
				password[1].value = GetPassWord;
				network[Network_numb].checked = true;
				IsClick ? login[1].click() : function () {};
				location.href = "https://www.baidu.com";
			}
		}

		clearTimeout(timer);
		timer = setTimeout(() => {
			Login();
		}, reflashTime);
	};
})();
