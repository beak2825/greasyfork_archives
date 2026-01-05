// ==UserScript==
// @name        Thisav Download Link
// @description Create a link for Thisav video
// @author      f1238762001
// @include     http://www.thisav.com/video*
// @include     http://m.thisav.com/play?videoid=*
// @include     http://www.thisav-d.com/video/*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/17404
// @downloadURL https://update.greasyfork.org/scripts/29968/Thisav%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/29968/Thisav%20Download%20Link.meta.js
// ==/UserScript==

(function () {
	var download_link = document.createElement("a");
	download_link.innerHTML = "Donwload";
	// 影片flv位置
	var v_scr = document.getElementById("mpl").getAttribute("flashvars");
	if (document.URL.match(/www\.thisav\.com./) != null) { // 電腦版的網站
		// 切割為單純的.flv位址
		let v_star = v_scr.indexOf("&file=") + 6;
		download_link.href = v_scr.substring(v_star);
	} else if (document.URL.match(/m\.thisav\.com/) != null) { // 手機版的網站
		let v_star = v_scr.indexOf("&file=") + 6;
		let v_end = v_scr.indexOf("&menu");
		download_link.href = v_scr.substring(v_star, v_end);
	}
	//添加下載連結
	document.getElementById("mediaspace").insertBefore(download_link, document.getElementById("mpl"));
	//設定html5 player
	var html5_player = document.createElement("video");
	html5_player.src = download_link.href;
	html5_player.setAttribute("controls", "controls");
	html5_player.style.cssText = "height: 100%; width: 100%;"
	//將flash player換成html5 player
	var this_av_player = document.getElementById("my-video");
	var this_av_player_parent = this_av_player.parentNode;
	this_av_player_parent.removeChild(this_av_player);
	this_av_player_parent.appendChild(html5_player);
})();
