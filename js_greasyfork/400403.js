// ==UserScript==
// @name        Beta360p As Default Serve
// @namespace   KissAnimePlayer
// @include     *kissanime.ru*
// @run-at      document-start
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @version     1.2
// @author      Kendriss
// @description Automatically Set Serve As Beta360p
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/400403/Beta360p%20As%20Default%20Serve.user.js
// @updateURL https://update.greasyfork.org/scripts/400403/Beta360p%20As%20Default%20Serve.meta.js
// ==/UserScript==

function ChangeUrlDefault() {
    if(window.location.href.indexOf("&s=default") > -1) {
        window.stop();
        var updateLink = '&s=beta360p&pfail=34';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('&s=default', updateLink);
        location.replace(currentLink);
    }
}

function ChangeUrlBeta() {
	if(window.location.href.indexOf("&pfail=34") === -1) {
		if(window.location.href.indexOf("&s=beta360p") > -1) {
			window.stop();
			var updateLink = '&s=beta360p&pfail=34';
			var currentLink = window.location.href;
			currentLink = currentLink.replace('&s=beta360p', updateLink);
			location.replace(currentLink);
		}
	}
}

ChangeUrlBeta()
ChangeUrlDefault();