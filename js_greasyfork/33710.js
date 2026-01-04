// ==UserScript==
// @name         AngelOfDeath Scripted V3.2
// @namespace    Beta Tested
// @icon         http://bitssurfer.com/favicon-96x96.png
// @homepageURL  https://www.youtube.com/channel/UCyeAV5tj99pf5zfIXpKB_0A
// @version      V3.2
// @description  Auto Click Bitssurfer
// @author       Turkiyede BTC
// @match        http://bitssurfer.com/surf/browse
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/33710/AngelOfDeath%20Scripted%20V32.user.js
// @updateURL https://update.greasyfork.org/scripts/33710/AngelOfDeath%20Scripted%20V32.meta.js
// ==/UserScript==

var remove = setInterval(function(){
	if ($(".btn.btn-warning.waves-effect.waves-light").text() !== "") {
		$("frame").remove();
		$("iframe").remove();
		$("div.row.frame").remove();
	}
}, 1);
$(document).ready(function(){
	clearInterval(remove);
	if ($("div.row.frame")) {
		$("div.row.frame").remove();
	}
	var refresh = setInterval(function(){
		if($("span#tmr").text() == "Wrong Captcha Refresh"){
			$('.refresh').click();
			clearInterval(refresh);
		}
	}, 1);
	var browse = setInterval(function(){
		if($(".btn.btn-success").text() !== ""){
			(function () {
				var finish = document.getElementsByClassName("btn btn-success");
				$('#'+finish[0].id).mousedown();
				$('#'+finish[0].id).click();
				$('#'+finish[0].id).mouseup();
				clearInterval(browse);
			})();
		}
	}, 1000);
});