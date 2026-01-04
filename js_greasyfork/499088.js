// ==UserScript==
// @name           Wiki Link Preview
// @namespace      https://github.com/AbdurazaaqMohammed
// @version        1.0
// @author         Abdurazaaq Mohammed
// @description    Show a preview of a linked wiki page when hovering over a link like Wikipedia does.
// @match          https://*.*/*
// @match          http://*.*/*
// @homepage       https://github.com/AbdurazaaqMohammed/userscripts
// @license        The Unlicense
// @supportURL     https://github.com/AbdurazaaqMohammed/userscripts/issues
// @grant          GM_xmlhttpRequest
// @connect        *
// @downloadURL https://update.greasyfork.org/scripts/499088/Wiki%20Link%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/499088/Wiki%20Link%20Preview.meta.js
// ==/UserScript==
(function() {
	'use strict';

	const previewBox = document.createElement('div');
	previewBox.id = 'previewBox';
	Object.assign(previewBox.style, {
		position: 'absolute',
		border: '1px solid #ccc',
		padding: '10px',
		background: '#fff',
		zIndex: 10000,
		display: 'none',
		maxWidth: '300px',
		boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
		borderRadius: '4px'
	});
	document.body.appendChild(previewBox);

	function extractSummary(htmlContent, isWikiLink) {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = htmlContent;
		const summary = tempDiv.querySelector(isWikiLink ? '#mw-content-text .mw-parser-output > p' : 'p') ;
		return summary ? summary.textContent : 'No summary available.';
	}

	function showPreviewBox(link, content) {
		previewBox.innerHTML = content;
		previewBox.style.display = 'block';
		const rect = link.getBoundingClientRect();
		previewBox.style.top = (window.scrollY + rect.top - previewBox.offsetHeight - 10) + 'px';
		previewBox.style.left = (window.scrollX + rect.left) + 'px';
	}

	document.body.addEventListener('mouseover', function(event) {
		const t = event.target;
		if (t.tagName === 'A') {
			const url = t.href;
		  const isWikiLink = url.includes('wiki') || url.includes('miraheze');
			if (url
				&& isWikiLink // Comment this line if you want to try it with all links.
			   ) {
				GM_xmlhttpRequest({
					method: 'GET',
					url: url,
					onload: function(response) {
						try {
							const summary = extractSummary(response.responseText, isWikiLink);
							showPreviewBox(t, summary);
						} catch (e) {
							console.error('Failed to extract summary', e);
							showPreviewBox(t, 'Error loading summary.');
						}
					},
					onerror: function(error) {
						console.error('Error loading the page:', error);
						showPreviewBox(t, 'Error loading page.');
					}
				});
			}
		}
	});

	document.body.addEventListener('mouseout', function(event) {
		if (event.target.tagName === 'A') {
			previewBox.style.display = 'none';
		}
	});
})();