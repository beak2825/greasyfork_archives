// ==UserScript==
// @name         清华慕课自动播放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  清华慕课自动播放脚本
// @author       zyf
// @match        http://www.xuetangx.com/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382878/%E6%B8%85%E5%8D%8E%E6%85%95%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/382878/%E6%B8%85%E5%8D%8E%E6%85%95%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

var loop = setInterval(function(){
	var v = document.getElementsByTagName('video')[0];
	if (v === undefined){
		var cur = document.querySelector('div.chapter.is-open li.active');
		if (cur !== null){
			var next = cur.nextElementSibling;
			if (next !== null){
				window.open(next.querySelector('a').href, "_top");
			}
		}
	}
	else if (v.readyState == 4){
		var t = document.querySelector('.xt_video_player_seek_handle');
		var process = t.style.left;
		if (process === ""){
			var p = document.querySelector('.xt_video_player_play_btn.fl');
			p.click();
		}
		else if (process == "100%"){
			var tcur = document.querySelector('div.chapter.is-open li.active');
			if (tcur !== null){
				var tnext = tcur.nextElementSibling;
				if (tnext !== null){
					window.open(tnext.querySelector('a').href, "_top");
				}
			}
		}
	}
}, 1000);