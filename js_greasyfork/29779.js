// ==UserScript==
// @name Antisocial Quora Fork
// @description No more idiotic social media popups on Quora, better version with no scrollbar fix.
// @date 2015-02-22
// @include ^.*?.quora.com.*?$
// @license MIT
// @grant none
// @version 0.0.1.2017
// @namespace antisocialquorafork
// @downloadURL https://update.greasyfork.org/scripts/29779/Antisocial%20Quora%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/29779/Antisocial%20Quora%20Fork.meta.js
// ==/UserScript==


// Add global CSS styles
// from http://diveintogreasemonkey.org/patterns/add-css.html
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

addGlobalStyle('.fb-facepile { display: none !important; }');
addGlobalStyle('.modal_signup_background { display: none !important; }');
addGlobalStyle('.modal_signup_dialog { display: none !important; }');
addGlobalStyle('body { overflow: auto !important; }');


