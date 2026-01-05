// ==UserScript==
// @name        plug.dj simple autowoot
// @namespace   sadfsdsaaaasd
// @description Auto-woot songs on plug.dj
// @include     https://plug.dj/*
// @include     https://stg.plug.dj/*
// @version     0.3.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/11731/plugdj%20simple%20autowoot.user.js
// @updateURL https://update.greasyfork.org/scripts/11731/plugdj%20simple%20autowoot.meta.js
// ==/UserScript==

function waitAndRegister() {
	setTimeout(function(){ 
		if(typeof(API) === 'undefined' || API.enabled !== true) { 
			waitAndRegister();
		} else {
			document.getElementById("woot").click();
			API.on(API.ADVANCE, function(){
				setTimeout(function(){ 
					document.getElementById("woot").click();
				}, 5000);
			});
		}
	}, 1000);
};
waitAndRegister();