// ==UserScript==
// @id             SEU-WLAN-CHN
// @name           SEU无线网登陆信息中文页
// @description    SEU东南大学无线网登陆信息中文页, 修复SEU无线网登录页全部不显示中文文字的问题.
// @version        1.0.0
// @author         Y.W. Le
// @include        https://w.seu.edu.cn/*
// @include        http://w.seu.edu.cn/*
// @run-at         document-idle
// @grant          none
// @namespace https://greasyfork.org/users/177896
// @downloadURL https://update.greasyfork.org/scripts/40240/SEU%E6%97%A0%E7%BA%BF%E7%BD%91%E7%99%BB%E9%99%86%E4%BF%A1%E6%81%AF%E4%B8%AD%E6%96%87%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/40240/SEU%E6%97%A0%E7%BA%BF%E7%BD%91%E7%99%BB%E9%99%86%E4%BF%A1%E6%81%AF%E4%B8%AD%E6%96%87%E9%A1%B5.meta.js
// ==/UserScript==

var allLinks, allLinks_T, allLinks_B, allLinks_A, thisLink, myurl, i;
var myurl = window.location.href;

allLinks = document.evaluate(
    '//label',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	
allLinks_T = document.evaluate(
    '//h3',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	
allLinks_A = document.evaluate(
    '//a',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
	
allLinks_B = document.evaluate(
    '//button',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);


for (var i = 0; i < allLinks.snapshotLength; i++) {
	thisLink = allLinks.snapshotItem(i);
	if (thisLink.innerHTML.indexOf("LOGOUT_USERNAME") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("LOGOUT_USERNAME", "用户名 ");
	}
	if (thisLink.innerHTML.indexOf("LOGOUT_DOMAIN") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("LOGOUT_DOMAIN", "所属院校 ");
	}
	if (thisLink.innerHTML.indexOf("LOGOUT_IP") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("LOGOUT_IP", "登录IP ");
	}
	if (thisLink.innerHTML.indexOf("LOGOUT_LOCATION") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("LOGOUT_LOCATION", "登录地点 ");
	}
	if (thisLink.innerHTML.indexOf("LOGOUT_TIMER") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("LOGOUT_TIMER", "在线时长 ");
	}
}

for (var i = 0; i < allLinks_T.snapshotLength; i++) {
	thisLink = allLinks_T.snapshotItem(i);
	if (thisLink.innerHTML.indexOf("LOGOUT_TITLE") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("LOGOUT_TITLE", "东南大学 (修正/LeYuwei)");
	}
}

for (var i = 0; i < allLinks_B.snapshotLength; i++) {
	thisLink = allLinks_B.snapshotItem(i);
	if (thisLink.innerHTML.indexOf("LOGOUT_BUTTON") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("LOGOUT_BUTTON", "退出登录");
	}
}

for (var i = 0; i < allLinks_A.snapshotLength; i++) {
	thisLink = allLinks_A.snapshotItem(i);
	if (thisLink.innerHTML.indexOf("SELF_SERVICE") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("SELF_SERVICE", "自助服务");
	}
	if (thisLink.innerHTML.indexOf("HELP") != -1) {
		thisLink.innerHTML = thisLink.innerHTML.replace("HELP", "帮助");
	}
}
