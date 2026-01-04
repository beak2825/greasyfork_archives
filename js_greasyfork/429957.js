// ==UserScript==
// @name         Block add-block warning | deccanchronicle.com
// @version      1.0.1
// @description        blocks the message that blosks adblock.
// @author       Dalveer
// @match        https://*.deccanchronicle.com/*
// @compatible   chrome
// ******************************************************
// Please leave review/ feedback / rating for this script
// ******************************************************
// @namespace https://greasyfork.org/users/797771
// @downloadURL https://update.greasyfork.org/scripts/429957/Block%20add-block%20warning%20%7C%20deccanchroniclecom.user.js
// @updateURL https://update.greasyfork.org/scripts/429957/Block%20add-block%20warning%20%7C%20deccanchroniclecom.meta.js
// ==/UserScript==
function f(){
	if(document.querySelector("#adblock-warning") == null){
		setTimeout(f, 1000);
		return;
	}
	document.querySelector("#adblock-warning").style.display="none";
	document.querySelector("body").style.overflow = "scroll";
	document.querySelector("#autoRefresh").checked = false;
}
f();

