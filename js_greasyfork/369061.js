// ==UserScript==
// @name        隐身访问贴吧主页 Fix
// @description 隐身访问其他人的贴吧主页不留下访问记录(对已改名的用户也同样有效
// @author      酷企鹅Link fix:Sonic853
// @include     http://tieba.baidu.com/home/*
// @version     1.0.3.4
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @namespace https://blog.853lab.com/
// @downloadURL https://update.greasyfork.org/scripts/369061/%E9%9A%90%E8%BA%AB%E8%AE%BF%E9%97%AE%E8%B4%B4%E5%90%A7%E4%B8%BB%E9%A1%B5%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/369061/%E9%9A%90%E8%BA%AB%E8%AE%BF%E9%97%AE%E8%B4%B4%E5%90%A7%E4%B8%BB%E9%A1%B5%20Fix.meta.js
// ==/UserScript==
(function () {
	gd_cltb(0);
	function gd_cltb(gd_n) {
	if (!gd_getReqString('un')) return;
	var gd_unz = document.querySelector('.user_name').innerHTML;
	if (!gd_unz) return;
	var gd_unlength = gd_unz.length;
	var i=0;
	for(i;i<gd_unlength;i++){
		if(gd_unz.charAt(i) == "<"){
			break;
		}
	}
	var gd_un = gd_unz.substr(0,i).replace("用户名:","");
	if (!gd_un) return;
	if (unsafeWindow && unsafeWindow.PageData && unsafeWindow.PageData.tbs) {
		var gd_tbs = unsafeWindow.PageData.tbs;
	} else {
		gd_n++;
		if (gd_n > 20) return;
		setTimeout(function () {
		gd_cltb(gd_n)
		}, 600);
		return;
	}
	console.log(gd_un, gd_tbs);
	GM_xmlhttpRequest({
		method: 'POST',
		url: 'http://tieba.baidu.com/home/post/delvisite',
		data: 'ie=utf-8&tbs=' + gd_tbs + '&un=' + gd_un,
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		onload: function (response) {
		console.log(response);
		if (response.responseText.indexOf('\\u6210\\u529f') != - 1) document.querySelector('div[class="right_aside"]>div[class="ihome_aside_section ihome_visitor "]>h1[class="ihome_aside_title"]').innerHTML = document.querySelector('div[class="right_aside"]>div[class="ihome_aside_section ihome_visitor "]>h1[class="ihome_aside_title"]').innerHTML + '<font color=red> (已清除记录)</font>'
		}
	});
	}
	function gd_getReqString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var Req = window.location.search.substr(1).match(reg);
	if (Req) return Req[2];
	return null;
	}
}) ()