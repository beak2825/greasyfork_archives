// ==UserScript==
// @name TPFC - Use Direct Download Link
// @description Rewrites download links to go straight to the source instead of TPFC's internal tracker.
// @namespace r-a-y/tpfc/direct-download
// @match https://www.portablefreeware.com/*
// @exclude-match https://www.portablefreeware.com/forums/*
// @version 1.0
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/489583/TPFC%20-%20Use%20Direct%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/489583/TPFC%20-%20Use%20Direct%20Download%20Link.meta.js
// ==/UserScript==

const links = document.querySelectorAll('li.download a.external');

for ( let i = 0, len = links.length; i < len; ++i ) {
	links[i].setAttribute( "href", links[i].getAttribute("title") );
}