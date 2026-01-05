// ==UserScript==
// @name        youtube murottal only
// @namespace   https://github.com/fuadmuhammad/youtube-disable-audio
// @include     https://www.youtube.com/*
// @version     1
// @grant       GM_xmlhttpRequest
// @description greasemonkey script to mute youtube audio and play quran murottal
// @downloadURL https://update.greasyfork.org/scripts/17538/youtube%20murottal%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/17538/youtube%20murottal%20only.meta.js
// ==/UserScript==
var player_id = (unsafeWindow.document.querySelector("#c4-player")                       // Channel video
			 	|| unsafeWindow.document.querySelector("#player div#movie_player")          // Default HTML5 Video
			 	|| unsafeWindow.document.querySelector("#player > div.html5-video-player"));
player_id.mute();

var mp3_list = [];
var current_track = 0;

var audio_player = unsafeWindow.document.createElement('audio');

GM_xmlhttpRequest({
    method: 'GET',
		url: 'http://statics.ilmoe.com/alquran/Murottal-Al-Quran-Anak/Muhammad_Thoha_AlJunayd/juz_30/',
    onload: function(resp){			
			//alert(resp.responseText);
			var el = document.createElement('html');
			el.innerHTML = resp.responseText
			var matches = el.querySelectorAll("html body pre a");
			var index=0;
			for (var i=0;i<matches.length; i++){
				if(matches[i].href.endsWith('mp3')){
					var str_href = matches[i].href;
					var new_str = str_href.replace("https://www.youtube.com","http://statics.ilmoe.com/alquran/Murottal-Al-Quran-Anak/Muhammad_Thoha_AlJunayd/juz_30");     			
					mp3_list[index]=new_str;
					index++;
  			}
			}
			current_track = mp3_list.length-1;
			//alert(mp3_list[current_track]);
			audio_player.src = mp3_list[current_track];
			
			setInterval(function(){
				if(audio_player.ended){
					//alert("next");
					current_track--;
					if(current_track==0){
						current_track = mp3_list.length-1;
					}
					//alert(mp3_list[current_track]);
					audio_player.src = mp3_list[current_track];
					audio_player.load();
					audio_player.play();	
				}
			},30000);
			audio_player.load();
			audio_player.play();
    }
});