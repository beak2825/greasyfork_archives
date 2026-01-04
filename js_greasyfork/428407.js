// ==UserScript==
// @name         EEAFJ Modify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  search more early
// @author       zhan
// @match        https://gk.eeafj.cn/jsp/scores/gkcj/scores_enter.jsp
// @icon         https://www.google.com/s2/favicons?domain=eeafj.cn
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/428407/EEAFJ%20Modify.user.js
// @updateURL https://update.greasyfork.org/scripts/428407/EEAFJ%20Modify.meta.js
// ==/UserScript==


function find(evnt){
    console.log('1')
	var myEvent = evnt || window.event;
	if(!myEvent){
		window.location = "http://www.eeafj.cn/";
	}
	document.forms[0].ksh.value = document.forms[0].ksh.value.trim();
	//document.getElementById("pwd").value = document.getElementById("pwd").value.trim();
	//document.getElementById("logname").value = document.getElementById("logname").value.trim();
	if(document.getElementById("logname").value==""){
		alert("帐号不为空");
		return false;
	}
	if(document.getElementById("pwd").value==""){
		alert("密码不为空");
		return false;
	}
	if(document.forms[0].ksh.value==""){
		alert("考生不为空");
		return false;
	}else if(!pattern.test(document.forms[0].ksh.value)){
		alert("考生号请输入数字");
		return false;
	}
	/*
	if(document.getElementById("check").value==""){
		alert("验证码不为空");
		return false;
	}*/
	document.getElementById("findbtn").disabled=true;
	document.getElementById("findbtn").style.filter="gray";
	document.getElementById("findbtn").value="正在查询";
	document.getElementById("restbtn").style.display="none";
	document.getElementById("pwd").value = MD5(document.getElementById("pwd").value);
	/* do_encrypt(document.getElementById("pwd")); */
	document.forms[0].submit();
}

(function() {
    'use strict';
    console.log('2')
    let btn = document.querySelector("#findbtn");
    btn.addEventListener('click',() => {
    find(event)
});
    btn.disabled = '';
    btn.value = '查询';
})();