// ==UserScript==
// @name           DOLC.DE 萍聚社区屏蔽垃圾帖子
// @namespace discuz
// @description Filters out (censors) certain posts based on the filter list, for Discuz based bbs. Made for DOLC.de, may require modifications on other domains. This script is NOT original and is published under CC. 
// @description:zh Discuz 论坛在浏览器端屏蔽特定 ID 发言。适用于过滤各种五毛党，五美分党，无脑喷子。给DOLC.de 写的，用在其他论坛上可能需要修改。基于他人工作成果制作。使用方式：在 “dogs” 列表里加入想屏蔽的 ID, 用引号包围，半角逗号区隔。
// @include        http://dolc.de/*
// @include        http://*.dolc.de/*
// @version 0.0.1.20151217235228
// @downloadURL https://update.greasyfork.org/scripts/5346/DOLCDE%20%E8%90%8D%E8%81%9A%E7%A4%BE%E5%8C%BA%E5%B1%8F%E8%94%BD%E5%9E%83%E5%9C%BE%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/5346/DOLCDE%20%E8%90%8D%E8%81%9A%E7%A4%BE%E5%8C%BA%E5%B1%8F%E8%94%BD%E5%9E%83%E5%9C%BE%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==
var dogs = new Array("hh2", "伟大领袖", "ein", "面瘫胡","flh", "Dortmund110","柳桂花","coxinga", "柳漫", "应欣", "傻卵", "大湿", "飞天玉米");

// 主题列表页
for (x in dogs) {
	dog = document.evaluate('//table/tbody[tr[1]/td[2]//cite/a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			dog.snapshotItem(i).innerHTML = "<tr><td class='icn'><img src='static/image/common/folder_common.gif' /></a></td><th class='common'><b>造谣一时爽，全家火葬场：被屏蔽帖子 " + c + "<font color=red></th><td class='by'><cite><font color=red>" + dogs[x] + "</font></cite></td><td class='num'></td><td class='by'></td></tr>";
		}
	}
}

// 内容页
for (x in dogs) {
	dog = document.evaluate('//table/tbody[tr[1]/td[1]//a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			c = dog.snapshotItem(i).firstChild.childNodes[3].textContent.replace(/\s*/g, "").slice(0, 2);
			c = (Number(c) > 9) ? c + "楼" : c;
			dog.snapshotItem(i).innerHTML = "<b><center>清扫垃圾人人有责：被屏蔽帖子 " + c + " <font color=red>" + dogs[x] + "</font></center></b>";
		}
	}
}

for (x in dogs) {
	dog = document.evaluate('//table/tbody[tr[1]/td[1]/div[1]//font[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if (dog.snapshotLength) {
		for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
			c = String(dog.snapshotItem(i).firstChild.childNodes[3].textContent.match(/\d+#/)).replace(/#/, "楼");
			dog.snapshotItem(i).innerHTML = "<b><center>c被屏蔽帖子 " + c + " <font color=red>" + dogs[x] + "</font></center></b>";
		}
	}
}