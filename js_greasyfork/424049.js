// ==UserScript==
// @name         B站速度调节
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       wh
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424049/B%E7%AB%99%E9%80%9F%E5%BA%A6%E8%B0%83%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/424049/B%E7%AB%99%E9%80%9F%E5%BA%A6%E8%B0%83%E8%8A%82.meta.js
// ==/UserScript==
var tipShowTimer = null, top, left;
function removeTip(){
	clearTimeout(tipShowTimer);
	tipShowTimer = null;
	$("#targetSpeed").hide();
}
function fadeOutTip(){
	clearTimeout(tipShowTimer);
	tipShowTimer = null;
	$("#targetSpeed").fadeOut('slow');
}
function showTip(speed){
	removeTip();
	var wrap = $('.bilibili-player-dm-tip-wrap');
	var size = 200;
	top = wrap.height() / 2 - 100;
	left = wrap.width() / 2 - 100;
	$("#targetSpeed").stop().hide().text(speed).css('left',left).css('top',top).fadeIn('fast');
	tipShowTimer = setTimeout(fadeOutTip, 1500);
}
var data = {Digit1: 1, Digit2: 1.2, Digit3: 1.5, Digit4: 2, Digit5: 3, Digit6: 4};
(function() {
    'use strict';
    setTimeout(function(){
    	var size = 200;
    	$('.bilibili-player-dm-tip-wrap').append("<div id='targetSpeed' " +
		"style='z-index:17;font-size:80px;text-align:center;position:absolute;background-color:rgba(0,0,0,.4);" +
		"border-radius:16px;width:"+size+"px;height:"+size+"px;line-height:"+size+"px;color:#fff'>"+"</div>");
		$("#targetSpeed").hide();
		document.onkeydown = function(event) {
	    	console.log(event);
	    	if(event.altKey) {
	    		var keys = Object.keys(data);
	    		if(keys.includes(event.code)){
	    			var speed = data[event.code];
	    			document.querySelector('video').playbackRate=speed;
	    			showTip(speed);
	    		}
		    }
		};
    }, 5000);
})();