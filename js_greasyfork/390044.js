// ==UserScript==
// @name        KissAnime Beta Server Default Without Account
// @namespace   KissAnimePlayer
// @include     *kissanime.ru*
// @run-at      document-start
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @version     1.3
// @author      Kendriss
// @description Automatically sets the Beta server as default
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/390044/KissAnime%20Beta%20Server%20Default%20Without%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/390044/KissAnime%20Beta%20Server%20Default%20Without%20Account.meta.js
// ==/UserScript==

function ChangeUrlDefault() {
    if(window.location.href.indexOf("&s=default") > -1) {
        window.stop();
        var updateLink = '&s=beta&pfail=34';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('&s=default', updateLink);
        location.replace(currentLink);
    }
}

function ChangeUrlBeta() {
	if(window.location.href.indexOf("&pfail=34") === -1) {
		if(window.location.href.indexOf("&s=beta") > -1) {
			window.stop();
			var updateLink = '&s=beta&pfail=34';
			var currentLink = window.location.href;
			currentLink = currentLink.replace('&s=beta', updateLink);
			location.replace(currentLink);
		}
	}
}

ChangeUrlBeta()
ChangeUrlDefault();