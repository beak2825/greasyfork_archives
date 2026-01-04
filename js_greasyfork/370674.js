// ==UserScript==
// @name         SkillBox Dark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Hot Week
// @match        *://live.skillbox.ru/code/online/*
// @description  Dark theme for live.skillbox.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370674/SkillBox%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/370674/SkillBox%20Dark.meta.js
// ==/UserScript==

(function() {
jQuery(document).ready(function($) {
	$(".icon-skillbox").css("cursor","pointer");
	$(".icon-skillbox").click(function(){
		$("body").css("background-color","rgb(45,45,45)");
		$(".title").css("color","rgba(255,255,255,0.88)")
		$(".comments__clearfix").css("color","rgba(255,255,255,0.85)");
		$(".comments__total").css("color","rgba(255,255,255,0.85)");
		$(".comments__add-field textarea").css("background-color","rgb(240,240,240)");
		$(".comments__text-wrapper").css("color","rgba(255,255,255,0.85)");
		$(".comments-user__name").css("color","rgba(255,255,255,0.90)");
		$(".comments__action-item").css("color","rgba(255,255,255,0.90)");
		$(".date svg").css("fill","#3988ec");
		$(".date span").css("color","#3988ec");
	});
});
})();