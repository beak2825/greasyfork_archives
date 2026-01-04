// ==UserScript==
// @name         PornHub Auto Enlarge Player
// @namespace    https://greasyfork.org/en/users/321241-yiwohifiru/scripts/387922
// @version      0.8.0
// @description  Automatically sets the PornHub player to Wide, and scrolls to it
// @author       tyrone4469, yiwohifiru
// @supportURL   https://greasyfork.org/en/scripts/387922-pornhub-auto-enlarge-player-quality/feedback#feedback-favoriters
// @match        *://www.pornhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387922/PornHub%20Auto%20Enlarge%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/387922/PornHub%20Auto%20Enlarge%20Player.meta.js
// ==/UserScript==

window.onload = setTimeout(function(){
	if( window.location.pathname.indexOf("/gif/") != -1 ){
		document.getElementsByClassName("toggleGifWebmButton")[0].click();
	} else {
		localStorage.setItem("player_quality", '{"quality":"720"}');
		document.getElementById("player").classList.add("wide");
		document.getElementById("hd-rightColVideoPage").classList.add("wide");
        var rect = document.getElementById("main-container").getBoundingClientRect();
		window.scrollBy( rect.left, rect.top );
	}
}, 1000);