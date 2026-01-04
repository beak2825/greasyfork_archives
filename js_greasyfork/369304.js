// ==UserScript==
// @name        KissAnime Beta Server Default and pfail=2
// @namespace   KissAnimePlayer
// @include     *kissanime.ru*
// @run-at      document-start
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @version     3.1
// @author      Kakyou
// @description Automatically sets the Beta server as default and also fixes the issue of the beta server player retrying when loading the video at the start. (Original at: https://pastebin.com/xY82U7yt by /u/HMS_Dreadnought)
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369304/KissAnime%20Beta%20Server%20Default%20and%20pfail%3D2.user.js
// @updateURL https://update.greasyfork.org/scripts/369304/KissAnime%20Beta%20Server%20Default%20and%20pfail%3D2.meta.js
// ==/UserScript==

function ChangeUrlDefault() {
    if(window.location.href.indexOf("&s=default") > -1) {
        window.stop();
        var updateLink = '&s=beta&pfail=2';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('&s=default', updateLink);
        location.replace(currentLink);
    }
}

function ChangeUrlBeta() {
	if(window.location.href.indexOf("&pfail=2") === -1) {
		if(window.location.href.indexOf("&s=beta") > -1) {
			window.stop();
			var updateLink = '&s=beta&pfail=2';
			var currentLink = window.location.href;
			currentLink = currentLink.replace('&s=beta', updateLink);
			location.replace(currentLink);
		}
	}
}

ChangeUrlBeta()
ChangeUrlDefault();