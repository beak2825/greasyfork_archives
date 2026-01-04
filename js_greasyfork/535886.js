// ==UserScript==
// @name         湖北工业大学校园网自动登陆
// @namespace    http://tampermonkey.net/
// @version      25.05.13.21
// @license      MIT
// @description  校园网自动登陆
// @author       Yui
// @match        http://202.114.177.246/*
// @match        http://202.114.177.115/*
// @match        http://202.114.177.114/*
// @match        http://202.114.177.113/*
// @exclude      http://202.114.177.114/srun_portal_success?ac_id=1&theme=pro
// @exclude      http://202.114.177.246/srun_portal_success?ac_id=1&theme=pro
// @exclude      http://202.114.177.115/srun_portal_success?ac_id=1&theme=pro
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535886/%E6%B9%96%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/535886/%E6%B9%96%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

if (confirm("是否自动登录")) {
	(function() {
    	let option = document.querySelectorAll("#domain option");

        /*
    		option[0]：校园网
    		option[1]：中国移动
    		option[2]：中国电信
    		option[3]：中国联通
    	*/
    	option[0].selected = true; // 这里修改选中项，修改"[]"中的数字即可，比如现在括号中是"0"，默认使用校园网登录

    	document.querySelector("#username").value="xxxxxxxx"; // xxxxxxxx处改为你的账号

    	document.querySelector("#password").value="xxxxxxxx"; // xxxxxxxx处改为你的密码

    	document.querySelector("#login-account").click();
	})();
}