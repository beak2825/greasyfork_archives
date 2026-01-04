

// ==UserScript==
// @name         Get the log in console
// @version      1.3
// @description  = =
// @author       NDM
// @include      https://online-judge.tepd.tk/Game/my-history/*

// @exclude      https://online-judge.tepd.tk/Game/my-history/


// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/133598
// @downloadURL https://update.greasyfork.org/scripts/36022/Get%20the%20log%20in%20console.user.js
// @updateURL https://update.greasyfork.org/scripts/36022/Get%20the%20log%20in%20console.meta.js
// ==/UserScript==
 
(function() {
window.addEventListener("click", (e)=>{
	if(e.target==document.getElementsByClassName("log-box")[0]){
        console.clear()
		console.log(document.getElementsByClassName("log-box")[0].value)
	}
});
 })();