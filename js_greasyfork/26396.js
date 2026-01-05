// ==UserScript==
// @name        NGA论坛加载黑科技插件
// @description NGA论坛加载黑科技插件，感谢远古大神：虚空之魂 和 LinTx
// @namespace   nga
// @include     http://bbs.ngacn.cc/*
// @include	    http://nga.178.com/*
// @include	    http://bbs.nga.cn/*
// @include   	http://club.178.com/*
// @include   	http://bbs.bigccq.cn/*
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/26396/NGA%E8%AE%BA%E5%9D%9B%E5%8A%A0%E8%BD%BD%E9%BB%91%E7%A7%91%E6%8A%80%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/26396/NGA%E8%AE%BA%E5%9D%9B%E5%8A%A0%E8%BD%BD%E9%BB%91%E7%A7%91%E6%8A%80%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


var loadNGAPlugin = function(){
	var head=document.getElementsByTagName("head")[0];
	var script=document.createElement("script");
	script.src="http://code.taobao.org/svn/myfirefoxsupport/trunk/nga/nga_command.js";
	head.appendChild(script);
};
loadNGAPlugin();
