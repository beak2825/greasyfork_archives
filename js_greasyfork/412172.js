// ==UserScript==
// @name		 AutoSignIn
// @name:zh-CN   自动签到工具
// @namespace    signin
// @version      0.0.1
// @description  用于各种网站论坛自动签到
// @include      http*://www.gopojie.net/*
// @include      https://account.lingfengyun.com/*
// @include      http*://www.52pojie.cn/*
// @note         论坛签到工具,整合自卡饭Coolkids论坛自动签到和jasonshaw网页自动化系列点击,做了一点微小的修改
// @grant 		GM_xmlhttpRequest
// @grant 		unsafeWindow
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/412172/AutoSignIn.user.js
// @updateURL https://update.greasyfork.org/scripts/412172/AutoSignIn.meta.js
// ==/UserScript==
(function () {
    if (isURL("account.lingfengyun.com/sign.aspx")) {
		//凌风云搜索签到 燕缘修改编辑
		document.getElementsByTagName('button')[0].click();
			return;
		}
	
	else if (isURL("gopojie.net")) { 
		//go破解
		document.getElementsByClassName('user-w-qd')[0].click();
		return;
	}
	else if (isURL("52pojie.cn")) { //52破解
		document.getElementsByClassName('qq_bind')[0].click();
		return;
	}
	else {
		//其他论坛
		qd();
		qd2();
	}
})();

function isURL(x) {
	return window.location.href.indexOf(x) != -1;
}

function qd() {
	if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
		var kxImg = document.getElementById("ch_s");
		var todaySayTextArea = document.getElementById("todaysay");
		if (kxImg == null) {
			return;
		}
		kxImg.setAttribute('checked', true);
		todaySayTextArea.value = "全自动签到,就是爽~";
		var button = document.getElementById("qiandao");
		button.submit();
		return;
	}
}

function qd2() {
	document.getElementById("kx").click();
	var todaySayTextArea = document.getElementById("todaysay");
	if (todaySayTextArea != null) {
		todaySayTextArea.value = "全自动签到,就是爽~";
	}
	unsafeWindow.showWindow('qwindow', 'qiandao', 'post', '0');
	return;
}

function qd3() {
	var elements = p.elements,
		i = 0;
	setTimeout(function () {
		try {
			if (elements instanceof Array) var els = p.elements;
			else { //function
				var els = p.elements();
			}
			while (els[i]) {
				var obj = (p.elements instanceof Array) ? document.querySelector(els[i]) : els[i];
				if (obj == null) return;
				if (obj.tagName == "A" && obj.href.indexOf("javascript") < 0 && obj.onclick == "undefined") GM_openInTab(obj.href);
				else obj.click();
				i++;
			}
		} catch (e) {
			alert(e);
		}
	}, 400);
	setTimeout(function () {
		if (autoClose) window.close();
	}, delay + 100);
	return;
}
	