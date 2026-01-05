
// ==UserScript==
// @name         One Click Copy URIs
// @namespace    http://github.com/kba
// @version      0.2
// @description  Adds buttons to text links and videos to copy the linked URI to clipboard in one click.
// @author       kba
// @match        */*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_log

// @require      https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @require      https://code.jquery.com/jquery-2.2.0.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.8/clipboard.min.js

// @downloadURL https://update.greasyfork.org/scripts/18562/One%20Click%20Copy%20URIs.user.js
// @updateURL https://update.greasyfork.org/scripts/18562/One%20Click%20Copy%20URIs.meta.js
// ==/UserScript==
/* jshint -W097, esnext:true */
/* globals GM_log, GM_setValue, GM_getValue, GM_registerMenuCommand, GM_config, Clipboard, $ */
'use strict';

// Setup configuration
GM_config.init({
	'id': 'one-click-copy',
	'title': 'Configure OneClickCopy',
	'fields': {

		'auto_video': {
			'label': 'Add Copy Button to all videos?',
			'type': 'checkbox',
			'default': false,
		},

		'timeout': {
			'label': 'Delay in ms before adding button to video',
			'type': 'number',
			'default': 1500,
		},

		'auto_text': {
			'label': 'Add Copy Button to all Text links?',
			'type': 'checkbox',
			'default': false,
		},

		"include_links": {
			'label': 'Selectors to find text links. First matching selector is used.',
			'type': 'textarea',
			'rows': 5,
			'width': 30,
			'default': [
				'#content a[href]',
				'a[href]'
			].join("\n"),
		},


		"skip_parents": {
			'label': 'Skip text links that are children of parents matching these selectors',
			'type': 'textarea',
			'rows': 10,
			'width': 30,
			'default': [
				'header',
				'#header',
				'footer',
				'#footer',
				'#tags',
				'*[id*=tags]',
				'*[class*=tags]',
				'#categories',
				'*[id*=categories]',
				'*[class*=categories]',
				'#navigation',
				'.nav',
				'*[role="navigation"]',
			].join("\n"),
		},

	},

});

// Helper to add inline CSS rules
function addCSSRules(rules) {
	var style   = document.createElement("style");
	style.innerHTML = rules.replace(/;/g, '!important ;');
	document.head.appendChild(style);
}

// Add CSS
$('head').append($('<style>').append(`

	.gm-link-tools {
		position: relative;
		display: inline-block;
		line-height: 1;
		padding: 0 2px;
		cursor: copy;
		font-size: 150%;
		opacity: 1;
		vertical-align: middle;
		background: gray;
		color: white;
		height: initial;
		width: initial;
		z-index: 1001;
	}

	.gm-link-tools > span {
		display: block;
		overflow:hidden;
		max-height:100%;
	}

	.gm-link-tools.copied {
		color: #6f5;
	}

`));

// The rules that determine which links are skipped
var skip_parents = GM_config.get('skip_parents').split(/\n/g);
var excludeMatchers = {
	'numeric': function($link) { return /^\d+$/.test($link.html()); },
	'image': function($link) { return $("img", $link).length; },
	'parent': function($link) { 
		for (var i = 0 ; i < skip_parents.length ; i++) {
			if ($link.parents(skip_parents[i]).length > 0) {
				return skip_parents[i];
			}
		}
	},
};

// Create the button
function createCopyLink(href) {
	return $(`
		<a data-clipboard-text="${href}" title="Copy to Clipboard" class="gm-link-tools">
			<span>∀</span>
		</a>
	`);
}

// Add clipboard functionality to copy button and add after element
function appendClipboardLink($el, $copyLink) {
	var clipboard = new Clipboard($copyLink[0]);
	clipboard.on('success', function(e) {
		$copyLink.addClass("copied");
		$copyLink.html('<span>✔</span>');
		return false;
	});
	clipboard.on('error', function(e) {
		$copyLink.addClass("failed");
		$copyLink.html('<span>X</span>');
	});
	$("<span>")
		.on('click tap mousedown touchstart', function(evt) {
			evt.stopPropagation();
			return false;
		})
		.append($copyLink)
		.insertAfter($el);
}

//
// Text Links
//

function clippifyLink(){
	/* jshint validthis:true */
	var $link = $(this);
	for (var rule in excludeMatchers) {
		var result = excludeMatchers[rule]($link);
		if (result) {
			GM_log(`SKIP ${rule}/${result}: '${$link.text()}'`);
			return;
		}
	}
	var href = $link[0].href;
	var $copyLink = createCopyLink(href);
	appendClipboardLink($link, $copyLink);
}

function clippifyLinks(){
	var links;
	var includeLinks = GM_config.get('include_links').split(/\n/g);
	for (var i = 0 ; i < includeLinks.length ; i++) {
		links = $(includeLinks[i]);
		if (links.length > 0) {
			break;
		}
	}
	$(links).each(clippifyLink);
}

//
// Videos
//

function clippifyVideo() {
	/* jshint validthis:true */
	var $video = $(this);
	var src = $video[0].currentSrc;
	if (! src) return;
	var $copyLink = createCopyLink(src);
	appendClipboardLink($video, $copyLink);
}

function clippifyVideos() {
	$("video").each(clippifyVideo);
}

//
// Setup menu commands
//
GM_registerMenuCommand('Configure One-Click-Copy', GM_config.open.bind(GM_config), 'c');
GM_registerMenuCommand("Text Links: Add Copy Button", clippifyLinks, "l");
GM_registerMenuCommand("Videos: Add Copy Button", clippifyVideos, "v");

//
// Automate adding buttons
//
if (GM_config.get('auto_video')) {
	setTimeout(function() {
		$("video").one('progress', clippifyVideo);
	}, GM_config.get('timeout'));
}
if (GM_config.get('auto_text')) {
	setTimeout(function() {
		clippifyLinks();
	}, GM_config.get('timeout'));
}






// vim: set noet ts=4 sw=4 :
