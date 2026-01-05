// ==UserScript==
// @name         YouTube Video Speed & Seek Mouse Control
// @namespace    YPSSMC
// @version      4.0
// @description  Dynamically adjust video playback speed & seeking instantly with your mousewheel, no more need to go through player menus every time.
// @run-at       document-ready
// @include 	 http://www.youtube.com/* 
// @include 	 https://www.youtube.com/*
// @require 	 http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://greasyfork.org/scripts/12284-jquery-mousewheel-3-1-13/code/jQuery%20Mousewheel%203113.js
// @require      https://greasyfork.org/scripts/14098-bililiterange-js/code/bililiteRangejs.js?version=88786
// @require      https://greasyfork.org/scripts/14097-jquery-simulate/code/jQuery%20Simulate.js?version=88785
// @require      https://greasyfork.org/scripts/14096-jquery-simulate-extended-plugin-1-3-0/code/jQuery%20Simulate%20Extended%20Plugin%20130.js?version=88784
// @require      https://greasyfork.org/scripts/14095-jquery-simulate-key-sequence-plugin-1-3-0/code/jQuery%20Simulate%20Key-Sequence%20Plugin%20130.js?version=88783
// @author       drhouse
// @icon         https://s.ytimg.com/yts/img/favicon-vfldLzJxy.ico
// @downloadURL https://update.greasyfork.org/scripts/12286/YouTube%20Video%20Speed%20%20Seek%20Mouse%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/12286/YouTube%20Video%20Speed%20%20Seek%20Mouse%20Control.meta.js
// ==/UserScript==

$(document).ready(function () {
	function getPlaybackRate() {
		var v = $('.video-stream')[0];
		return v.playbackRate;
	}

	var speed = getPlaybackRate().toFixed(2);
	var isShift = false;
	var isAlt = false;
	var ytplayer = document.getElementById("movie_player");

	$(ytplayer).prepend('<div id="rate">' + speed + ' </div>');
	$("#rate").css("z-index","999");
	$("#rate").css('position', 'absolute');
	$("#rate").css('top', '0');
	$("#rate").css('right', '0');

	function setPlaybackRate(r) {
		var v = $('.video-stream')[0];
		if (v === undefined || v.playbackRate === undefined) {
			setTimeout(function(){setPlaybackRate(r);}, 1000);
			return;
		}
		v.playbackRate = r;
	}

	$(window.document).mousewheel(function(e, deltaX) {
		//Seek | Shift+WheelUp/Down
		if (e.shiftKey) {
			if (deltaX>0) {
				if (location.href.toString().indexOf("embed") == -1) { //youtube.com
					var ytplayer = document.getElementById("movie_player");
					var time = ytplayer.getCurrentTime();
					ytplayer.seekTo(time+5, true);
				}
				else{$('.video-stream').simulate("key-sequence", { sequence: "l" });} //embed
			} else {
				if (location.href.toString().indexOf("embed") == -1) { //youtube.com
					var ytplayer = document.getElementById("movie_player");
					var time = ytplayer.getCurrentTime();
					ytplayer.seekTo(time-5, true);
				}
				else{$('.video-stream').simulate("key-sequence", { sequence: "j" });} //embed
			}
			e.preventDefault();
		}

		//Speed | Alt+WheelUp/Down
		if (e.altKey) {
			var step = 0.25;
			if (e.deltaY<0) {         
				var speed = Math.max(0.0,(getPlaybackRate()-step).toFixed(2));
				setPlaybackRate(speed);
			} else { 
				var speed = Math.min(8,(getPlaybackRate()+step).toFixed(2));
				setPlaybackRate(speed);
			}
			e.preventDefault();
			$("#rate").remove();
			var speed = speed.toFixed(2);
			var ytplayer = document.getElementById("movie_player");
			$(ytplayer).prepend('<div id="rate">' + speed + ' </div>');
			$("#rate").css("z-index","999");
			$("#rate").css('position', 'absolute');
			$("#rate").css('top', '0');
			$("#rate").css('right', '0');

		}
	});
})