// ==UserScript==
// @name Wikipedia2Wikiless
// @namespace -
// @version 1.2.1
// @description Redirects you from Wikipedia to ethical Wikiless.
// @author NotYou
// @run-at document-start
// @include *://wikipedia.org/*
// @include *://*.wikipedia.org/*
// @grant none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/436908/Wikipedia2Wikiless.user.js
// @updateURL https://update.greasyfork.org/scripts/436908/Wikipedia2Wikiless.meta.js
// ==/UserScript==

var _lang = location.host.split('.')[0]
var lang = 'lang=' + (_lang === 'www' ? 'en' : _lang)

location.href = 'https://wikiless.org' + location.pathname + (location.search ? location.search + '&' + lang : '?' + lang)