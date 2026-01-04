// ==UserScript==
// @name         Mini Youtube Window
// @namespace    https://greasyfork.org/en/scripts/409994-mini-youtube-window
// @version      1.0.1
// @description  Opens A tiny window for background music
// @author       Konghe Won
// @include      *
// @exclude      https://www.youtube.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409994/Mini%20Youtube%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/409994/Mini%20Youtube%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function ask(){
	var answer = prompt("Do you want to put in the video ID of the Youtube video, just open Youtube home, search on Youtube, or don't open anything? (1,2,3,4)",1);
	if(answer != 1 && answer != 2 && answer != 3){
		ask()
	}else{
		if(answer == 1){
			var id = prompt("What is the video ID?","dQw4w9WgXcQ");
			window.open("https://www.youtube.com/watch?v="+id, "_blank", "toolbar=yes,top=500,left=500,width=600,height=400");
		}else if(answer == 2){
			window.open("https://www.youtube.com", "_blank", "toolbar=yes,top=500,left=500,width=600,height=400");
		}else if(answer == 3){
			var search = prompt("What do you want to search up?","Never Gonna Give You Up");
			search.replace(/ /g,"+");
			window.open("https://www.youtube.com/results?search_query="+search, "_blank", "toolbar=yes,top=500,left=500,width=600,height=400");
	    }else if(answer == 4){
		    return
		}
	}
	}
	ask()
})();