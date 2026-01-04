// ==UserScript==
// @name        BTF Xmas Querier
// @namespace   BTFXmas
// @version     1.0.1
// @description 请先关闭浏览器或浏览器插件的阻止弹窗功能。
// @include     /^https?\:\/\/(www.)?bittorrentfiles\.me\/xmas[0-9]{4,}.php\?.*$/
// @copyright   2017.12.03 By Z
// @downloadURL https://update.greasyfork.org/scripts/35922/BTF%20Xmas%20Querier.user.js
// @updateURL https://update.greasyfork.org/scripts/35922/BTF%20Xmas%20Querier.meta.js
// ==/UserScript==

window.onload = function () {
	var Querier = document.createElement("button");
	var tabletitle = document.getElementsByClassName("tabletitle");
	Querier.style.cssText = "height:40px;background-color:#253140;color:#fff;display:block;border:1px solid #fff;margin:5px auto;cursor:pointer;border-radius:5px;";
	Querier.innerHTML = "点击遍历彩蛋网页<br>(注意：一次性打开24个网页)";
	Querier.onclick = function () {
		var BTFXmasPic = document.getElementById("xmas");

		for (var i = 0; i < BTFXmasPic.areas.length; i++) {
			window.open(BTFXmasPic.areas[i].href);
		}
	};
	tabletitle[0].appendChild(Querier);
};