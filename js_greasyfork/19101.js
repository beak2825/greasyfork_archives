// ==UserScript==
// @name        Livecap » Youtube
// @namespace   s4nji
// @description Redirects livecap to youtube
// @include     https://www.livecap.tv/t/*
// @version     2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/19101/Livecap%20%C2%BB%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/19101/Livecap%20%C2%BB%20Youtube.meta.js
// ==/UserScript==

var lc2yt = setInterval( attemptRedirect, 100 );

function attemptRedirect() {
	var iframe 	= document.querySelector('.iframeContent > iframe');
	var iframedoc 	= iframe.contentDocument || iframe.contentWindow.document;

	var vEL     = iframedoc.getElementById('youtubePlayer');
	var vID     = vEL.src.substr(30,11);
	var vURL    = `https://www.youtube.com/watch?v=${vID}`;

	location.href = vURL;
}