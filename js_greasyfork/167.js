// ==UserScript==
// @name           18P2P thanks by one_click
// @description    18P2P一键感谢
// @include        *
// @require        http://code.jquery.com/jquery-latest.min.js
// @author         congxz6688
// @version        2015.8.13.0
// @grant          GM_log
// @namespace https://greasyfork.org/scripts/167
// @downloadURL https://update.greasyfork.org/scripts/167/18P2P%20thanks%20by%20one_click.user.js
// @updateURL https://update.greasyfork.org/scripts/167/18P2P%20thanks%20by%20one_click.meta.js
// ==/UserScript==


if(document.title.indexOf("18P2P -")!=-1 && (window.location.href.indexOf("viewthread.php")!=-1|| window.location.href.indexOf("redirect.php")!=-1)){
	var formhash=$('[name="formhash"]').val();
	var mainurl=$('[href*="thankyou.php"]')[0].href;
	$('[href*="thankyou.php"]:has(img)').attr({"href":""}).click(function(){
		GM_log("开始运行一键感谢程序……")
		var urll = mainurl + "&thankyousubmit=1&formhash="+formhash+"&reason=Thanks";
		var autothank = new XMLHttpRequest();
		autothank.open('POST', urll, false);
		autothank.onreadystatechange = callback;
		autothank.send(null);
		function callback(){
			GM_log("一键感谢 ok!")
			window.location.reload();
		}
	})
}