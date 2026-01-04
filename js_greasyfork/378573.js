// ==UserScript==
// @name        Rapidvideo as a default server
// @namespace   KissAnimePlayer
// @include     *kissanime.ru*
// @run-at      document-start
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @version     1.0
// @author     K̶៩ηꀸꋪɨនន Ð H̶υηɬ៩ꋪ
// @description Set the default preferred server to Rapidvideo without the need of account
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/378573/Rapidvideo%20as%20a%20default%20server.user.js
// @updateURL https://update.greasyfork.org/scripts/378573/Rapidvideo%20as%20a%20default%20server.meta.js
// ==/UserScript==

function ChangeUrlDefault() {
    if(window.location.href.indexOf("&s=default") > -1) {
        window.stop();
        var updateLink = '&s=rapidvideo';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('&s=default', updateLink);
        location.replace(currentLink);
    }
}

function ChangeUrlBeta() {
	if(window.location.href.indexOf("&reb=3") === -1) {
		if(window.location.href.indexOf("&s=rapidvideo") > -1) {
			window.stop();
			var updateLink = '&s=rapidvideo&reb=3';
			var currentLink = window.location.href;
			currentLink = currentLink.replace('&s=rapidvideo', updateLink);
			location.replace(currentLink);
		}
	}
}

ChangeUrlBeta()
ChangeUrlDefault();