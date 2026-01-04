// ==UserScript==
// @name        Nova Serve
// @namespace   KissAnimePlayer
// @include     *kissanime.ru*
// @run-at      document-start
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @version     1.1
// @author     K̶៩ηꀸꋪɨនន
// @description Nova Serve as a default server(for those who uses nova server)
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/380587/Nova%20Serve.user.js
// @updateURL https://update.greasyfork.org/scripts/380587/Nova%20Serve.meta.js
// ==/UserScript==

function ChangeUrlDefault() {
    if(window.location.href.indexOf("&s=default") > -1) {
        window.stop();
        var updateLink = '&s=nova&reb=1';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('&s=default', updateLink);
        location.replace(currentLink);
    }
}

function ChangeUrlBeta() {
	if(window.location.href.indexOf("&reb=1") === -1) {
		if(window.location.href.indexOf("&s=nova") > -1) {
			window.stop();
			var updateLink = '&s=nova&reb=1';
			var currentLink = window.location.href;
			currentLink = currentLink.replace('&s=nova', updateLink);
			location.replace(currentLink);
		}
	}
}

ChangeUrlBeta()
ChangeUrlDefault();