// ==UserScript==
// @name          Wiki2wand
// @version       1.2
// @run-at        document-start
// @description   Redirect Wikipedia to Wikiwand.
// @include       http://*.wikipedia.org/wiki/*
// @include       https://*.wikipedia.org/wiki/*
// @include       http://*.wiktionary.org/wiki/*
// @include       https://*.wiktionary.org/wiki/*
// @include       http://*.wikiquote.org/wiki/*
// @include       https://*.wikiquote.org/wiki/*
// @exclude       http://*.wikipedia.org/wiki/*?oldformat=true
// @exclude       https://*.wikipedia.org/wiki/*?oldformat=true
// @exclude       http://*.wiktionary.org/wiki/*?oldformat=true
// @exclude       https://*.wiktionary.org/wiki/*?oldformat=true
// @exclude       http://*.wikiquote.org/wiki/*?oldformat=true
// @exclude       https://*.wikiquote.org/wiki/*?oldformat=true
// @author        ylusid
// @namespace     https://greasyfork.org/en/users/1355994-ylusid
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/504795/Wiki2wand.user.js
// @updateURL https://update.greasyfork.org/scripts/504795/Wiki2wand.meta.js
// ==/UserScript==

var theurl = document.URL;
var parser = /^https?:\/\/(\w+)\.(m\.)?(\w+)\.org\/wiki\/([^\?#]+)(\?[^#]+)?(#.+)?/;

domain = theurl.match(parser)[3];
var wikiwand_app = "articles";
if (domain == "wiktionary") {
    wikiwand_app = "dictionary";
} else if (domain == "wikiquote") {
    wikiwand_app = "quotes";
}

window.location.replace(theurl.replace(parser, 'https://www.wikiwand.com/$1/' + wikiwand_app + '/$4$6'))
