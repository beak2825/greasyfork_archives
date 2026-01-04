// ==UserScript==
// @name         qxyz
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Nex
// @match        *://new-qishi.sm.cn/*
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function(){
	function qxyz(){
		if(name === "未设置"){
			alert("请填写你的做题账号姓名");
		}
	}
	alert("姓名");
	qxyz();
})();