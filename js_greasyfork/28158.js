// ==UserScript==
// @name	Referrer Hider
// @description	Hides referrer.
// @namespace	https://greasyfork.org/users/19952-xant1k-bt
// @include	http://*
// @include	https://*
// @run-at	document-start
// @grant	none
// @version	1.0
// @author	Adapted by Lichtenshtein
// @downloadURL https://update.greasyfork.org/scripts/28158/Referrer%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/28158/Referrer%20Hider.meta.js
// ==/UserScript==

function hideRefer(c){var b=c.target;if(b&&b.tagName!=="A"){b=b.parentNode}if(b&&b.tagName==="A"){b.rel="noreferrer"}}window.addEventListener("click",hideRefer,true);window.addEventListener("contextmenu",hideRefer,true);