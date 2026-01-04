// ==UserScript==
// @name        YouTube Mods ver polymer
// @namespace   Violentmonkey Scripts
// @match       https://*.youtube.com/*
// @exclude     https://*.youtube.com/embed/*
// @grant       none
// @version     2020.07.26 23.04.17
// @author      copypastedata ttbbzz
// @description Created 7/22/2020, 5:xx:xx PM
// @downloadURL https://update.greasyfork.org/scripts/407632/YouTube%20Mods%20ver%20polymer.user.js
// @updateURL https://update.greasyfork.org/scripts/407632/YouTube%20Mods%20ver%20polymer.meta.js
// ==/UserScript==
var videoPlayer,channlNameStr;
var skip_buttons = [{text:"-5s",interval:-5},
					{text:"+5s",interval:5},
					{text:"+15s",interval:15},
					{text:"+30s",interval:30}]; //[ref009]

function seekVDO(t){videoPlayer.seekBy(t)}

//do mods on video page event [2020/07/22 5:00p - 9:09p]
document.addEventListener('yt-page-data-updated', run)
function run(e) {
	//console.log("data-updated",e)
	if(e && e.detail.pageType=='watch'){
		//add channel name to title
		var channlName = document.querySelector(".ytd-video-secondary-info-renderer #channel-name a");
		if (channlName) channlNameStr = channlName.text;
		if (document.title.indexOf(channlNameStr) == -1){
			document.title += " > "+channlNameStr;
			console.log("%c__channelName: "+channlNameStr+" appended to title.","color:orange;");
		} else { console.log("%c__'"+channlNameStr+"' string is already in the title.","color:orange;") }
		//title string check 2020/7/23 12:02a
		c0 = 0;
		timer0 = setInterval(function(){
			c0 += 333;
			//additional watch page check to prevent running out of watch page.
			//fixed below with clearing timer0, but leaving it hear anyway for secure
			if (document.title.indexOf(channlNameStr) == -1 && document.location.pathname.indexOf("watch") != -1){
				document.title += " > "+channlNameStr;
				console.log("%c__polymer yt title-reset watcher.","color:orange;");
			}
			if (c0 > 30000) clearInterval(timer0); //timeout
		},333);
		
		//PLAYER SKIP BUTTONS
		videoPlayer = document.getElementById("movie_player");
		if(videoPlayer) {
			//add skip buttons [ref009]
			skip_container = document.querySelector('.ytp-left-controls');
			check_existing_skipbuttons = document.querySelector('.skip');
			if (!check_existing_skipbuttons && skip_container) { /*check skip_container*/
				skip_buttons.forEach(function(b){ /*[ref014]*/
					sb = document.createElement('button');
					sb.setAttribute('class', 'ytp-button skip');
					sb.style.verticalAlign = "top"; /*added verticle center css so doesn't have to depend on youtube.css proxy | 3:19 PM 4/13/2019*/
					sb.style.textAlign = "center";
					sb.addEventListener('click',function(){seekVDO(b.interval)});
					//sb.setAttribute('onclick', 'seekVDO('+skip_buttons[b].interval+')'); //deprecated when use in GreaseMonkey as inline scripts cannot access GM sandbox
					sb.innerHTML = '<span>'+b.text+'</span>';
					skip_container.appendChild(sb);
				});
			}
		} else {console.log("%c__videoPlayer node not found","color:red;")}
	} else {clearInterval(timer0) /*clear timer0 function so it doesn't run after leaving the watch page [2020/7/23 6:27p]*/}
}
