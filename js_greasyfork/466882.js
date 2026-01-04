// ==UserScript==
// @name Wiktionary Language Prefs
// @description A script for re-ordering the languages on Wiktionary.
// @version 1.0.9
// @namespace https://www.mandog.com/
// @match https://*.wiktionary.org/wiki/*
// @match https://*.m.wiktionary.org/wiki/*
// @license GNU GPLv3
// @supportURL syntaxenjoyer@tutanota.com
// @downloadURL https://update.greasyfork.org/scripts/466882/Wiktionary%20Language%20Prefs.user.js
// @updateURL https://update.greasyfork.org/scripts/466882/Wiktionary%20Language%20Prefs.meta.js
// ==/UserScript==

const d = document;

// your language preferences here
const langPrefs = [];

// get anchor tag from url
const anchor = window.location.toString().split('#')[1];

/*** rearrange the languages on the page ***/

const par = d.getElementsByClassName(
	'mw-parser-output');

const wikiLangs = Array.from(par[0].getElementsByClassName('mw-heading2'));

// remove underscores
const langNames = Array.from(wikiLangs, (i) => {
  let headline = i.getElementsByTagName('h2');
  let id = headline.length ? headline[0].id : i.id;
	if (id.includes('_')) {
		let newId = id.replaceAll('_', ' ');
		return newId;
	}
	else {
		return id;
	}
});

const newOrder = {};

const frag = new DocumentFragment();

// rearrange the languages
for (let i = 0; i <= (wikiLangs.length - 1); i++) {
	if (langPrefs.includes(langNames[i])) {
		let key = langNames[i];
		let r = d.createRange();
		r.setStartBefore(wikiLangs[i]);
		wikiLangs[i+ 1] && wikiLangs.length > 2 ? 
			r.setEndBefore(wikiLangs[i + 1]) :
			r.setEndAfter(par[0].lastElementChild);
		let val = r.extractContents();
		newOrder[key] = val;
	}
}

// add to document fragment
langPrefs.forEach(i => {
	if (langNames.includes(i)) {
		frag.append(newOrder[i]);
	}
});

/*** rearrange the table of contents ***/

const toc = d.getElementById('toc');
const minitoc = d.getElementsByClassName('minitoc')[0];

if (minitoc) {
	const tocParent = minitoc.parentElement;

	tocParent.id === 'mf-section-0' ? tocParent.after(frag) : minitoc.nextElementSibling.after(frag);
} else if (toc) {
	const tocParent = toc.parentElement;

	tocParent.id === 'mf-section-0' ? tocParent.after(frag) : toc.after(frag);

	const contents = d.getElementsByClassName('toclevel-1');

	const contentsOrder = {};

	const contentsFrag = new DocumentFragment();

	// get language names from toc
	const contentsLangNames = Array.from(contents, (i) =>
		i.firstElementChild.getElementsByClassName(
			'toctext')[0].innerText);

	// rearrange toc
	for (let i = contents.length - 1; i>=0; i--) {
		let langEntry = contentsLangNames[i];
		if (langPrefs.includes(langEntry)) {
			let key = langEntry;
			let r = d.createRange();
			r.setStartBefore(contents[i]);
			contents[i + 1] ?
				r.setEndBefore(contents[i + 1]) :
				r.setEndAfter(contents[i].lastElementChild);
			let val = r.extractContents();
			contentsOrder[key] = val;
		}
	}

	langPrefs.forEach(i => {
		if (contentsLangNames.includes(i)) {
			contentsFrag.append(contentsOrder[i]);
		}
	});

	contents[0].parentNode.insertBefore(
		contentsFrag, contents[0].parentNode.firstElementChild);
} else {
	let contentDiv = d.getElementsByClassName('mw-parser-output')[0];

	contentDiv.firstChild.before(frag);
};

// scroll to correct anchor tag if it exists
if (anchor) {
	d.getElementById(anchor).scrollIntoView();
};