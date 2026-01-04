// ==UserScript==
// @name         Discovery+ link extractor for Discovery Plus
// @version      1
// @description  Easily extract all links from Discovery+
// @author       pix
// @match        https://www.discoveryplus.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.discoveryplus.com
// @grant        none
// @license      GPL3
// @namespace    dpluslinkextract
// @downloadURL https://update.greasyfork.org/scripts/435419/Discovery%2B%20link%20extractor%20for%20Discovery%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/435419/Discovery%2B%20link%20extractor%20for%20Discovery%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

console.log(`%c Discovery+ Link Extractor \n [!] Run dplus.rip() to start [!] `, 'background: #FFF; color: #FF0006');
class ripcommand{
	rip(){
		var browser = prompt("what browser are you using? (none if you dont want a yt-dlp command)")
		console.log(`%c [!] Copy the command below. [!] `, 'background: #FFF; color: #FF0006');
		var alllinks = ``
		const regex = /https:\/\/www.discoveryplus.com\/video\/.*\/.*/g;
		var x = document.querySelectorAll("a");
		for (var i=0; i<x.length; i++){
			var nametext = x[i].textContent;
			var cleantext = nametext.replace(/\s+/g, ' ').trim();
			var cleanlink = x[i].href;
			cleanlink = [cleanlink].toString()
			if([cleantext] != `Resume`){
				if(cleanlink.match(regex)){
			  	if (browser == "" || browser == undefined || browser == null) {
			   		alllinks = alllinks + `${[cleanlink]}\n`
		    	}else{
			  		alllinks = alllinks + `yt-dlp --cookies-from-browser ${browser} "${[cleanlink]}" && `
		    	}
		    }
		  }
		}
		alllinks = alllinks.slice(0, -3)
		console.log(alllinks)
		console.log(`%c [!] Copy the command above. [!] `, 'background: #FFF; color: #FF0006');
	}
}
var dplus = new ripcommand()
window.dplus = new ripcommand()
})();