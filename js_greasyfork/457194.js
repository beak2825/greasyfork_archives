// ==UserScript==
// @name        抖音来客后台 title显示nav
// @namespace   Violentmonkey Scripts
// @match       https://life.douyin.com/p/goods*
// @match       https://life.douyin.com/p/home*
// @grant       ShowLe_e
// @version     1.18
// @author      -
// @description 2023年1月31日 14:25:09
// @license     MIT
// @require     https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/457194/%E6%8A%96%E9%9F%B3%E6%9D%A5%E5%AE%A2%E5%90%8E%E5%8F%B0%20title%E6%98%BE%E7%A4%BAnav.user.js
// @updateURL https://update.greasyfork.org/scripts/457194/%E6%8A%96%E9%9F%B3%E6%9D%A5%E5%AE%A2%E5%90%8E%E5%8F%B0%20title%E6%98%BE%E7%A4%BAnav.meta.js
// ==/UserScript==


   //每隔3秒执行一次

setTimeout(function() {
	$("#staff-mark").remove();
	var nTit = $("div[class^=src-pages-HomeV2-components-VerificationV2-index-module__account-select-indicator__wrapper]").text();
	var nTit2 = nTit.replace("北海市", "");
	var nTit3 = nTit2.replace("海城区", "");
	var nTit4 = nTit3.replace("银海区", "");
	let nTitle133 = nTit4.replace("有限公司", "");

console.log(nTitle133)

  var nTitle1 = nTitle133.split('(')[0];


console.log(nTitle1)

	document.title = nTitle1;


	setInterval(function() {
		let nTitle2 = $(".life-core-menu-item-active:first").text();
		let nTitle = nTitle1 + " " + nTitle2;
		document.title = nTitle;
	}, 3000);



}, 2500);