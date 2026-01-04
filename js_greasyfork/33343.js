// ==UserScript==
// @name        Add bounding boxes to GlyphWiki
// @namespace   szc
// @description Add bounding boxes to 200px GlyphWiki preview images that approximate the one on the Glyph Editor
// @include     /^https?://(en\.|ko\.|zhs\.|zht\.|)glyphwiki\.org/.*$/
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33343/Add%20bounding%20boxes%20to%20GlyphWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/33343/Add%20bounding%20boxes%20to%20GlyphWiki.meta.js
// ==/UserScript==

function addClasses() {
	let images = document.getElementsByClassName('glyph');
	
	for (var i = 0; i < images.length; i++) {	
		let image = images.item(i);
		
		if (
			image.classList.contains('thumb100')
			||
			image.classList.contains('thumb')
		) {
			continue;
		}
		
		let wrapper = document.createElement('div');
		let boundingBox = document.createElement('div');

		wrapper.classList.add('x-glyph-200-wrapper');
		boundingBox.classList.add('x-glyph-200-bounding-box');
		
		wrapper.innerHTML = image.outerHTML + boundingBox.outerHTML;
		image.outerHTML = wrapper.outerHTML;
	}
}

function addStyles() {
	GM_addStyle(`
.x-glyph-200-wrapper {
	position: relative;
	display: inline-block;
}

.x-glyph-200-bounding-box {
	position: absolute;
	top: 0;
	border: 1px dotted darkgrey;
	content: "";
	height: 176px;
	width: 176px;
	margin-top: calc(12px + 1em);
	margin-left: 12px;
}

.compare ~ .x-glyph-200-bounding-box {
	margin-top: calc(12px + 1em);
	margin-left: calc(12px + 1em);
}
	`);
}

addClasses();
addStyles();