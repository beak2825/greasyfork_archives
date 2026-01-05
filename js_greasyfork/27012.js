// ==UserScript==
// @name SoundCloud hide reposts
// @namespace http://abs.ezw.me
// @version 1.2
// @author ABS
// @description Only see new songs in your SoundCloud stream
// @match *://soundcloud.com/stream
// @downloadURL https://update.greasyfork.org/scripts/27012/SoundCloud%20hide%20reposts.user.js
// @updateURL https://update.greasyfork.org/scripts/27012/SoundCloud%20hide%20reposts.meta.js
// ==/UserScript==

function norepost(){
	for (let repost of document.getElementsByClassName("soundList__item")) {
		if (repost.getElementsByClassName("sc-ministats-reposts").length > 0)
			repost.remove();
            console.log(repost);
	}
}
window.addEventListener("DOMNodeInserted", norepost, false);