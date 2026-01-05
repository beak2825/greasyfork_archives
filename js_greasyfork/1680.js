// ==UserScript==
// @name		Orion Sucks
// @namespace	http://www.megacoder.com
// @description Use monospace for the body so text comes out right
// @include     http://support.us.oracle.com/oip/faces/secure/srm/srview/*
// @include     https://support.us.oracle.com/oip/faces/secure/srm/srview/*
// @require     http://code.jquery.com/jquery-1.8.0.min.js
// @run-at		document-end
// @version		1.0.1
// @downloadURL https://update.greasyfork.org/scripts/1680/Orion%20Sucks.user.js
// @updateURL https://update.greasyfork.org/scripts/1680/Orion%20Sucks.meta.js
// ==/UserScript==

$(document).ready(function() {
	(function(font) {
		var     head  = document.getElementsByTagName('head')[0];
		var     link  = document.createElement('link');
		var     style = document.createElement('style');
		var     fonty = document.createTextNode(
			'body * { font-family: "' + font.family + '", monospace, arial, sans-serif !important; -moz-user-select: text !important; -moz-user-select: text !important }'
		);
		link.rel  = 'stylesheet';
		link.href = 'https://fonts.googleapis.com/css?family=' + font.family + ':' + (font.style || []) + '&subset=' + (font.subset || ['latin']);
		head.appendChild(link);
		style.styleSheet ? style.styleSheet.cssText = fonty.nodeValue : style.appendChild(fonty);
		head.appendChild(style);
	})({ family:'Droid Sans Mono', style:['400','700'] });

	$('DIV.dijitTitlePaneTextNode').css( '-moz-user-select: text !important' );

});

// vim: noet sw=4 ts=4 ff=unix
