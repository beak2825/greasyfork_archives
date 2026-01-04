// ==UserScript==
// @name         广轻web自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  广轻电信，移动web端自动登录，使用前请输入你的学号，密码以及你的运营商
// @author       Kadoce Ace
// @match        *://10.0.0.37/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373311/%E5%B9%BF%E8%BD%BBweb%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/373311/%E5%B9%BF%E8%BD%BBweb%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

window.setTimeout(function (){
	var username = document.getElementsByName("DDDDD")[1];
	var password = document.getElementsByName("upass")[1];
	var isp = document.getElementsByName("ISP_select")[0];
	var formSubmit = document.getElementsByName("0MKKey")[1];
	if(username != null){
        // 请在此下面引号↓输入你的 学号
		username.value = "";
        // 请在此下面引号↓输入你的 密码
		password.value = "";
        // 请在此下面引号↓输入你的 运营商（中国电信：@telecom  中国移动：@cmcc）
		isp.value = "@telecom";
        if((username.value.length > 0) && (password.value.length > 0)){
            formSubmit.click();
        }else{
            alert("你还没在插件内填写你的信息！");
        }
	}
}, 1000);