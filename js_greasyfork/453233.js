// ==UserScript==
// @name         	u.gg AD remove
// @namespace    	https://greasyfork.org/users/928242
// @version      	1.0
// @description 	Removes AD and unnecessary sections
// @author      	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @match        	https://u.gg/lol/champions/*
// @icon         	https://www.google.com/s2/favicons?sz=64&domain=u.gg
// @grant        	none
// @license      	MIT
// @downloadURL https://update.greasyfork.org/scripts/453233/ugg%20AD%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/453233/ugg%20AD%20remove.meta.js
// ==/UserScript==

function GM_addStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css.replace(/;/g, ' !important;');
	head.appendChild(style);
}

GM_addStyle(`

.live-game-ad,
.champion-profile-ad,
.toughest-matchups,
.og-feature,
.stats-skills {
    display: none;
}

`);

