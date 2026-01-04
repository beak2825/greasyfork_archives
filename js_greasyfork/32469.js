// ==UserScript==
// @name        TVTropes anti-NoScript remover
// @namespace   Alice
// @include     http://tvtropes.org/*
// @version     1
// @grant       none
// @description:en See additional info
// @description See additional info
// @downloadURL https://update.greasyfork.org/scripts/32469/TVTropes%20anti-NoScript%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/32469/TVTropes%20anti-NoScript%20remover.meta.js
// ==/UserScript==

var alc = document.getElementsByTagName("script");
for (let i = 0; i < alc.length; i++) {
    if (alc[i].innerHTML.match(/8d1f/)) {
		alc[i].remove();
		console.log(`Script ${i} removed!`);
	}
}