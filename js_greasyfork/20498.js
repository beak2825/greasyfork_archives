// ==UserScript==
// @name           二手鱼监控
// @description  二手鱼监控，当搜索结果页出现指定价格范围内的商品时弹出提示
// @include        http*://s.2.taobao.com/list/*
// @author         reizhi
// @copyright      reizhi
// @version        1.2
// @grant  none
// @namespace https://greasyfork.org/users/4421
// @downloadURL https://update.greasyfork.org/scripts/20498/%E4%BA%8C%E6%89%8B%E9%B1%BC%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/20498/%E4%BA%8C%E6%89%8B%E9%B1%BC%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

Notification.requestPermission();

setInterval("location.reload()", 10000);
var block = localStorage.getItem("block");
var keyword = new Array();
for (i = 0;; i++) {
	keyword[i] = block.slice(0, block.indexOf(","));
	block = block.slice(block.indexOf(",") + 1, 99);
	if (block.indexOf(",") < 0) {
		keyword[i]=block;
		break;
	}
}

var ls = document.getElementsByClassName("item-info-wrapper item-idle clearfix");
for (i = 0; i < ls.length; i++) {
	var price = parseInt(ls[i].getElementsByTagName("em")[0].innerText) + 0;
	var link = ls[i].getElementsByTagName("a")[0];
	if (check(i)) {
		if (price <= 360 && price >= 200) {

			if (sessionStorage.getItem("links") != link.href) {
				link.click();
				var notification = new Notification("发现一个目标进入价格区间！");
				var audio = new Audio("http://reizhi.u.qiniudn.com/5363.mp3");
				audio.play();
			}
			sessionStorage.setItem("links", link.href);
			break;

		}
	}

}

function check(x) {
	var describe = ls[x].getElementsByClassName("item-description")[0].innerText;
	for (j = 0; j < keyword.length; j++) {
		if (describe.indexOf(keyword[i]) > 0) {
			return false;
			break
		}
	}
	return true;
}