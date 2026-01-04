// ==UserScript==
// @name         Torn - Hide level upgrade link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the level upgrade link so you don't click it by mistake
// @author       DokuganRyu [563000]
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/470091/Torn%20-%20Hide%20level%20upgrade%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/470091/Torn%20-%20Hide%20level%20upgrade%20link.meta.js
// ==/UserScript==
try{
	document.getElementById("pointsLevel").remove();
}catch{
	console.log("No level upgrade link found on this page.");
}
