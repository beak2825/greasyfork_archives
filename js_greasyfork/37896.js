// ==UserScript==
// @name         Discord Visible Video, and Audio
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  displays video and audio without you having to download it on discord! I dont mind if you port this to betterDiscord just as long as theres a link to this script!
// @author       You
// @match        https://discordapp.com/channels/*
// @match        http://discordapp.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37896/Discord%20Visible%20Video%2C%20and%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/37896/Discord%20Visible%20Video%2C%20and%20Audio.meta.js
// ==/UserScript==

(function() {
    'use strict';
	//main Loop, LOOKS FOR LINKS
	function hasAttach(element){
		if(element.id == "checked"){
			return false;
		}
		var children = element.childNodes;
		element.id = "checked";
			if(children !== undefined){
				return true;
			}else{
				return false;
			}

		}
	function displayAs(element,url,video){
		video.src = url;
		video.setAttribute("controls", "");
		element.appendChild(video);
	}
	setInterval(function(){
		//msg first support later


		//loop for lattest 5 messages
		var Acc = document.getElementsByClassName("accessory");
		for(var i=1; i<Acc.length; i++){
			var videoTemplate = document.createElement("video");
            videoTemplate.style.height = "214px";
			var curAcc = Acc[Math.abs(Acc.length - i)];
			if(hasAttach(curAcc)){
			  console.log("Video Found");
			  var children = curAcc.childNodes;
			  var url = curAcc.childNodes[0].childNodes[1].childNodes[0].href;
			  var endCap = url.split(".").pop();
				var validEndCapsVid = "webm mp4 wma m4v mov avi flx mpg wmv";
				var validEndCapsAud = "mp3 aac ogg m4a flac wav";
			  if(!validEndCapsVid.includes(endCap) && !validEndCapsAud.includes(endCap) && endCap == undefined){
				  return;
			  }
              if(validEndCapsAud.includes(endCap)){
				 videoTemplate = document.createElement("audio");
			  }
			  //videoTemplate.setAttribute("style", "");
			  displayAs(curAcc,url,videoTemplate);
		    }
		}
	},300);
    // Your code here...
})();