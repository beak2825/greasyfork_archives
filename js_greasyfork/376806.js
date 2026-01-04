// ==UserScript==
// @name           哥谭净化器 (感谢助手家族赞助的一张变色卡)
// @namespace      bbuh
// @description    Gotham Purifier 1.0
// @include        https://bbs.bbuhot.com/*
// @version        20190118
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/376806/%E5%93%A5%E8%B0%AD%E5%87%80%E5%8C%96%E5%99%A8%20%28%E6%84%9F%E8%B0%A2%E5%8A%A9%E6%89%8B%E5%AE%B6%E6%97%8F%E8%B5%9E%E5%8A%A9%E7%9A%84%E4%B8%80%E5%BC%A0%E5%8F%98%E8%89%B2%E5%8D%A1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376806/%E5%93%A5%E8%B0%AD%E5%87%80%E5%8C%96%E5%99%A8%20%28%E6%84%9F%E8%B0%A2%E5%8A%A9%E6%89%8B%E5%AE%B6%E6%97%8F%E8%B5%9E%E5%8A%A9%E7%9A%84%E4%B8%80%E5%BC%A0%E5%8F%98%E8%89%B2%E5%8D%A1%29.meta.js
// ==/UserScript==

blockAll();

var mo = new MutationObserver(function(allmutations) {
    blockAll();
});
mo.observe(document.querySelector('body'), {'childList': true,'characterData':false,'subtree': true});

function blockAll() {
		var dogs = new Array("dota救世主峰哥");//要屏蔽的ID，写在这行，注意英文引号

		// 主题列表页 针对ID
		for (x in dogs) {
			dog = document.evaluate('//table/tbody[tr[1]/td[2]//cite/a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}

		// 内容页 针对ID
		for (x in dogs) {
			dog = document.evaluate('//table/tbody[tr[1]/td[1]//a[text()="' + dogs[x] + '"]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}
}