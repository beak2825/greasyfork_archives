// ==UserScript==
// @name        KissAnime Beta Server2 and pfail=34
// @namespace   KissAnimePlayer
// @include     *kissanime.ru*
// @run-at      document-start
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @version     1.0
// @author     Kakyou modified by K̶៩ηꀸꋪɨនន Ð H̶υηɬ៩ꋪ
// @description Original sricpt is created by Kakyou. This is the modified version of script as the oringinal script is not working anymore due to server error of beta serve.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/377787/KissAnime%20Beta%20Server2%20and%20pfail%3D34.user.js
// @updateURL https://update.greasyfork.org/scripts/377787/KissAnime%20Beta%20Server2%20and%20pfail%3D34.meta.js
// ==/UserScript==

function ChangeUrlDefault() {
    if(window.location.href.indexOf("&s=default") > -1) {
        window.stop();
        var updateLink = '&s=beta2&pfail=34';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('&s=default', updateLink);
        location.replace(currentLink);
    }
}

function ChangeUrlBeta() {
	if(window.location.href.indexOf("&pfail=34") === -1) {
		if(window.location.href.indexOf("&s=beta2") > -1) {
			window.stop();
			var updateLink = '&s=beta2&pfail=34';
			var currentLink = window.location.href;
			currentLink = currentLink.replace('&s=beta2', updateLink);
			location.replace(currentLink);
		}
	}
}

ChangeUrlBeta()
ChangeUrlDefault();