// ==UserScript==
// @name        Uqer / JoinQuant Xueqiu Link
// @namespace   https://github.com/henix/userjs/uqer_xueqiu_link
// @author      henix
// @version     20200701.1
// @description 为优矿 / 聚宽的结果中的 secID / code 添加到雪球的链接
// @match       https://uqer.io/labs/*
// @match       https://www.joinquant.com/research*
// @license     MIT License
// @require     https://cdn.jsdelivr.net/npm/domo@0.5.9/lib/domo.js
// @downloadURL https://update.greasyfork.org/scripts/32386/Uqer%20%20JoinQuant%20Xueqiu%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/32386/Uqer%20%20JoinQuant%20Xueqiu%20Link.meta.js
// ==/UserScript==

var secIDPatt = /^([0-9]{6})\.(XSHG|XSHE)$/;

var markets = {
	"XSHG": "SH",
	"XSHE": "SZ"
};

function replaceLink() {
	[].concat(
		Array.from(document.querySelectorAll(".result td")),
		window.frames.length > 0 ? Array.from(window.frames[0].document.body.querySelectorAll("table.dataframe td")) : []
	).forEach(function(td) {
		if (td.childNodes && td.childNodes[0] && td.childNodes[0].nodeType == Node.TEXT_NODE) {
			var m = secIDPatt.exec(td.textContent);
			if (m) {
				var market = markets[m[2]] || "";
				var xqLink = "https://xueqiu.com/S/" + market + m[1];
				var a = A({ target: "_blank", href: xqLink }, td.textContent);
				td.innerHTML = "";
				td.appendChild(a);
			}
		}
	});
}

setInterval(replaceLink, 2000);
