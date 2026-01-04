// ==UserScript==
// @name            Youtube Embed Skip Buttons Mod
// @namespace       userscript
// @include         *.youtube.com/embed/*
// @include         *.youtube-nocookie.com/embed/*
// @version         2017.8.22
// @description     Skip buttons for embeded youtube iframes.
// @author          copypastetada ttbbzz
// @homepageURL     https://greasyfork.org/en/users/2617
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/407744/Youtube%20Embed%20Skip%20Buttons%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/407744/Youtube%20Embed%20Skip%20Buttons%20Mod.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded",function(){
	function seekVDO(interval){
		interval += Math.floor(vdo_player.getCurrentTime());
		vdo_player.seekTo(interval);
	}
	var vdo_player = document.querySelector(".html5-video-player"),
		skip_buttons = [{text:"-5s",interval:-5},
						{text:"+5s",interval:5},
						{text:"+15s",interval:15}];
	var timer0 = setInterval(function(){
		if(vdo_player) {
			skip_container = document.querySelector('.ytp-left-controls');
			check_existing_skipbtn = document.querySelector('.skip');
			if (!check_existing_skipbtn && skip_container) {
				skip_buttons.forEach(function(b){ 
					sb = document.createElement('button');
					sb.setAttribute('class', 'ytp-button skip');
					sb.addEventListener('click',function(){seekVDO(b.interval)});
					sb.innerHTML = '<span>'+b.text+'</span>';
					sb.style.verticalAlign = "top";
					sb.style.textAlign = "center";
					skip_container.appendChild(sb);
				});
			} else { console.log("%cplayer control div.ytp-left-controls not found","color:maroon;"); }
			clearInterval(timer0);
		} else {
			console.log("%clooking for div.html5-video-player","color:teal;");
			vdo_player = document.querySelector(".html5-video-player");
		}
	},100);
},false);