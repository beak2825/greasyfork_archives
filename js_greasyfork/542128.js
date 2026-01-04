// ==UserScript==
// @name         TurboFicks
// @namespace    http://turbobricks.com/
// @version      264
// @description  Fixes broken links on Turbobricks
// @author       pinguin
// @license      gnu gpl
// @include      *turbobricks.com*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542128/TurboFicks.user.js
// @updateURL https://update.greasyfork.org/scripts/542128/TurboFicks.meta.js
// ==/UserScript==

// PIHB - Pre-Interstitial Helper Buttons - Adds navigation buttons to top of threads in mobile
GM_addStyle(`.block-outer:not(.block-outer--after) .pageNavWrapper:not(.pageNavWrapper--forceShow) {display: block !important;} .block-outer-main, .block-row-main { float: left !important;} .block-outer-opposite, .block-row-opposite { float: right !important;}`);

// Dancing Penguin
let lookup_table = {
	'https://turbobricks.com/data/avatars/m/12/12241.jpg?1727919708': 'https://i.imgur.com/Ld9eVyS.gif',
};
for (let image of document.getElementsByTagName('img')) {
	for (let query in lookup_table) {
		if (image.src == query) {
			image.src = lookup_table[query];
		}
	}
}

// Link Fixer
 const thread = /\?t\=/ ;
 const post = /\?p\=/ ;
 const regex = /.*show(?:post|thread)\.php\?(?:p|t)\=([0-9]+).*/i;

if (thread.exec(window.location.href)) {
    // make thread url;
    window.location.href = window.location.href.replace(regex, "https://turbobricks.com/index.php?threads/$1");
}
else if (post.exec(window.location.href)) {
    // make post url
    window.location.href = window.location.href.replace(regex, "https://turbobricks.com/index.php?posts/$1");
}