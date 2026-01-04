// ==UserScript==
// @name           GoTo Meeting Muter
// @description    Press M to toggle
// @author         Talha Habib
// @include        https://app.gotomeeting.com/*
// @version        1.0
// @email        talha@codeot.com
// @namespace    http://codeot.com
// @downloadURL https://update.greasyfork.org/scripts/374026/GoTo%20Meeting%20Muter.user.js
// @updateURL https://update.greasyfork.org/scripts/374026/GoTo%20Meeting%20Muter.meta.js
// ==/UserScript==

(function(){

document.onkeyup = function(e) {
  if (e.which == 77) {
        
	document.querySelector("audio").style.position = "absolute"; 
	document.querySelector("audio").style.top = "0"; 
	document.querySelector("audio").style.left = "0"; 
	document.querySelector("audio").style.zIndex = "999"; 
    if(document.querySelector("audio").muted){
        document.querySelector("audio").controls = "true";
        document.querySelector("audio").muted = false;
    }else{
              document.querySelector("audio").controls = "false";
	      document.querySelector("audio").muted = true;
   }		
  }
};

})();