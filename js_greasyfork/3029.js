// ==UserScript==
// @name           Vimeo fullscreen link
// @namespace      vimeo.armeagle.nl
// @description    Because the user videos do not load in Firefox 4, add a link to the fullscreen version the bottom
// @include        http://vimeo.com/*
// @version 0.0.1.20140705065009
// @downloadURL https://update.greasyfork.org/scripts/3029/Vimeo%20fullscreen%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/3029/Vimeo%20fullscreen%20link.meta.js
// ==/UserScript==

window.setTimeout(function() {
	var fullscreenUrlBase = "http://vimeo.com/moogaloop.swf?clip_id=";
	
	var objects = document.getElementsByTagName('object');
	if ( objects.length == 0 ) {
		return;
	}

	var pattern = /player(\d+)_\d+/;
	var matches = pattern.exec(objects[0].getAttribute('id'));
	if ( matches == null || matches.length < 2 ) {
		return;
	}
	var fullscreenUrl = fullscreenUrlBase + matches[1];
	
	var link = document.createElement('a');
	link.setAttribute('href', fullscreenUrl);
	link.appendChild(document.createTextNode('View in fullscreen'));
	
	document.getElementById('meat').appendChild(link);
	
	}, 1000);
	