// ==UserScript==
// @name         HTML5 stop autoplay
// @namespace    https://infovikol.ch/
// @version      0.1
// @description  Prevent HTML5 videos or music from autoplaying. Move mouse over player to start playing.
// @author       Alex
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24811/HTML5%20stop%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/24811/HTML5%20stop%20autoplay.meta.js
// ==/UserScript==

function stop() {
    this.pause();  
    //this.currentTime=0;
    this.removeEventListener("timeupdate", stop, false);
}

function mv() {
    this.removeEventListener("timeupdate", stop, false);
    this.removeEventListener("mouseover", mv,true);
    this.play();
}

function loop() {
    tag = document.querySelectorAll('video,audio');
    for(i = 0; i < tag.length; i++){
        if(tag[i].getAttribute("paused")!=1){
        	tag[i].autoplay=false;
            tag[i].controls=true;
          	tag[i].addEventListener("timeupdate", stop, false);
            tag[i].addEventListener("mouseover", mv,true);
            tag[i].setAttribute("paused",1);
    	}
    }
    
    setTimeout(function(){
		loop();
	}, 1000);
}

loop();