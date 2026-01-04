// ==UserScript==
// @name         苏州大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动登录校园网脚本，适配登录页的所有页面，如果发生异常显示，请先关闭本脚本再刷新
// @author       PengFei Chen
// @match        http://10.9.1.3/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417203/%E8%8B%8F%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/417203/%E8%8B%8F%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const account = ""; //单引号里填账号
	const passWord = ""; //单引号里填密码
	const loginTime = 1; //设定多少秒后登陆，默认为1s，立即登录请设置为0
	var ISP = document.getElementsByName("ISP_select"); //01校园网，11中国移动
	var inputAccount = document.getElementsByName("DDDDD"); //1
	var inputPassWord = document.getElementsByName("upass"); //1
	var inputLogin = document.getElementsByName("0MKKey"); //1
	var Timer;
	Timer = window.setTimeout(function () {
		ISP[0][1].selected = true;
		inputAccount[1].value = account;
		inputPassWord[1].value = passWord;
		inputLogin[1].click();
		clearTimeout(Timer);
	}, loginTime * 1000);
	// Your code here...
})();
