// ==UserScript==
// @name        Wikipeida sticky table header
// @description Make the table header always visible
// @icon        https://en.wikipedia.org/static/favicon/wikipedia.ico
// @match       *://*.wikipedia.org/*
// @match       *://*.wikiquote.org/*
// @match       *://*.wikisource.org/*
// @match       *://*.wikinews.org/*
// @match       *://*.wikimedia.org/*
// @match       *://*.wikidata.org/*
// @match       *://*.wiktionary.org/*
// @match       *://*.wikiversity.org/*
// @match       *://*.wikibooks.org/*
// @match       *://*.wikivoyage.org/*
// @match       *://*.mediawiki.org/*
// @version     1.0
// @grant       GM_addStyle
// @namespace   https://greasyfork.org/users/113252-garrison-baird
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/373950/Wikipeida%20sticky%20table%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/373950/Wikipeida%20sticky%20table%20header.meta.js
// ==/UserScript==

GM_addStyle(`#bodyContent thead {
	position: sticky;
	top: 0px;
}`)