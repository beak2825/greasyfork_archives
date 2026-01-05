// ==UserScript==
// @name        Slim Extratorrent
// @namespace   http://extratorrent.cc/cactuspie
// @description Removes useless content from extratorrent.cc
// @include     /^https?://(www\.)?extratorrent\.cc.*/
// @require       https://code.jquery.com/jquery-3.1.1.min.js
// @version     1
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/28795/Slim%20Extratorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/28795/Slim%20Extratorrent.meta.js
// ==/UserScript==

(function(){
	$(".blog_left").first().parent().remove();
	$("h2").remove();
	$(".tztbl").remove();
	$(".tztblpage").remove();
	$(".copyrights").remove();
	$(".h_search").prop("width", "70%");
	$(".stext").prop("style", "width: 100%");
	$(".warnIp").parent().remove();
	$(".warn3").parent().remove();
	$(".warn4").parent().remove();
	$(".wrn_txt8").parent().parent().remove();
	$("script[src*='adskeeper']").remove();
	$("a[href*='adskeeper']").parent().parent().remove();
	$("img[src='https://images4et.com/images/other/warning-vpn2.gif']").closest("table").remove();
})();
