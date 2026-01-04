// ==UserScript==
// @name        Hide user-exclusive glyphs from GlyphWiki's recent changes
// @namespace   szc
// @description Add a checkbox to GlyphWiki's recent changes page that hides user-exclusive glyphs.
// @include     /^https?://(en\.|ko\.|zhs\.|zht\.|)glyphwiki\.org/wiki/Special:Recentchanges.*$/
// @version     1.005
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32231/Hide%20user-exclusive%20glyphs%20from%20GlyphWiki%27s%20recent%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/32231/Hide%20user-exclusive%20glyphs%20from%20GlyphWiki%27s%20recent%20changes.meta.js
// ==/UserScript==

let i18nStrings = {}; // over-engineering?

i18nStrings['ja'] = {
	toggleLabel: 'ユーザー占有グリフを隠す',
}

i18nStrings['en'] = {
	toggleLabel: 'Hide user glyphs',
}

i18nStrings['ko'] = {
	toggleLabel: '사용자 점유 글리프을감추기',
}

i18nStrings['zhs'] = {
	toggleLabel: 'Hide user glyphs', // TODO
}

i18nStrings['zht'] = {
	toggleLabel: 'Hide user glyphs', // TODO
}

let pageLanguage = window.location.host.split('.')[0];
pageLanguage = (pageLanguage == 'glyphwiki') ? 'ja' : pageLanguage;

function addClasses() {
	let userGlyphsSub = document.querySelectorAll(':first-child[href*=\'_\']');
	
	for (var i = 0; i < userGlyphsSub.length; i++) {
		userGlyphsSub[i].parentNode.classList.add('x-user-glyph');
	}
}

function addToggle() {
	let rcHeader = document.querySelector('.right_body > .texts');
	let toggle = document.createElement('input');
	let toggleLabel = document.createElement('label');
	
	toggle.setAttribute('type', 'checkbox');
	toggle.setAttribute('id', 'x-user-glyphs-hide-show');
	if (GM_getValue('hideUserGlyphs') === true) {
		toggle.checked = true;
		showHideUserGlyphs(false, toggle); // is this an acceptable way of doing this??
	}
	toggle.addEventListener('click', showHideUserGlyphs);
	
	toggleLabel.setAttribute('for', 'x-user-glyphs-hide-show');
	toggleLabel.innerHTML = i18nStrings[pageLanguage].toggleLabel;
	
	rcHeader.appendChild(toggle);
	rcHeader.appendChild(toggleLabel);
}

function addStyles() {
	GM_addStyle(".x-hide-user-glyphs .x-user-glyph { display: none; }");
}

function showHideUserGlyphs(event, toggle) {
	toggle = event.target || toggle;
	
	if (toggle.checked) {
		document.body.classList.add('x-hide-user-glyphs');
		GM_setValue('hideUserGlyphs', true);
	} else {
		document.body.classList.remove('x-hide-user-glyphs');
		GM_setValue('hideUserGlyphs', false);
	}
}

addClasses();
addToggle();
addStyles();