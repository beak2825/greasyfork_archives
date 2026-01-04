// ==UserScript==
// @name         Webpurr https
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Change webpurr http links to https
// @author       hoh
// @match        http://webpurr.com/
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/389301/Webpurr%20https.user.js
// @updateURL https://update.greasyfork.org/scripts/389301/Webpurr%20https.meta.js
// ==/UserScript==
(function(){
"use strict";
	let observer = new MutationObserver(function(){
		Array.from(document.querySelectorAll(".progressHolder")).forEach(function(link){
			if(link.innerText.match("http:")){
				link.innerText = link.innerText.replace("http:","https:");
			};
		});
	});
	observer.observe(document,{
		attributes: false,
		childList: true,
		subtree: true
	});
})();