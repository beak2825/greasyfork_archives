// ==UserScript==
// @name         Craftserve Website Avatar Change 
// @namespace    https://greasyfork.org/pl/users/416294-patrykcholewa
// @version      1.0.2
// @description  Changes Steve emoji of user avatars to premium nick ones
// @author       PatrykCholewa
// @include      http://*.csrv.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401360/Craftserve%20Website%20Avatar%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/401360/Craftserve%20Website%20Avatar%20Change.meta.js
// ==/UserScript==

(function() {
	function changeAvatars() {

		var ul = document.querySelector(".lista-top+ul");
		var imgs = ul.querySelectorAll(".gracz > img");
		for (var img of imgs) {
			var currentUrl = img.getAttribute("src");
			var urlParts = currentUrl.split("/");
			var nick = urlParts[urlParts.length - 2];
			if (nick.match(/^[0-9a-zA-Z_-]+$/)) {
				var newUrl = "https://minotar.net/helm/" + nick;
				img.setAttribute("src", newUrl);
			}
		}

	}
	
	
	var observer = new MutationObserver(changeAvatars); 
	observer.observe(document.querySelector('.lista-top+ul'), {childList: true});
	
})()
