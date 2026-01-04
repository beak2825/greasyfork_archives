// ==UserScript==
// @name zuanke8.com topics blocking tools
// @namespace discuz
// @description:en zuanke8.com junk blocking
// @description:zh 屏蔽赚吧包含特定关键字和用户的主题不予显示，减少水帖干扰。
// @include        http://www.zuanke8.com/*
// @version 0.0.1
// @description zuanke8.com junk blocking
// @downloadURL https://update.greasyfork.org/scripts/36661/zuanke8com%20topics%20blocking%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/36661/zuanke8com%20topics%20blocking%20tools.meta.js
// ==/UserScript==

// 主题列表页
var btopics = new Array("小知", "斐讯", "和包");
for (x in btopics) {
	xtopics = document.evaluate('//table/tbody[tr[1]/th[1]//a[contains(text(),"' + btopics[x] + '")]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (xtopics.snapshotLength) {
		for (var i = 0, c = ""; i < xtopics.snapshotLength; i++) {
			xtopics.snapshotItem(i).innerHTML = "<tbody style='display:none;'></tbody>";
		}
	}
}

// 屏蔽特定用户的发帖
// 直接填写用户名在引号里面，每组引号用半角逗号隔开。
var abusers = new Array("", "");
for (x in abusers) {
	abuser = document.evaluate('//table/tbody[tr[1]/td[2]//cite/a[text()="' + abusers[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (abuser.snapshotLength) {
		for (var i = 0, c = ""; i < abuser.snapshotLength; i++) {
			abuser.snapshotItem(i).innerHTML = "<tbody style='display:none;'></tbody>";
		}
	}
}