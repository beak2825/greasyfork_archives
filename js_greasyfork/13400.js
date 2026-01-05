// ==UserScript==
// @name          Wikipedia 2 Wikiwand
// @version       2.0
// @run-at        document-start
// @description   This script is an easy way to try out and view Wikiwand which displays a clean and modernized version of Wikipedia.
// @run-at        document-start
// @include       https://*.wikipedia.*/*
// @include       http://*.wikipedia.*/*
// @exclude       http://en.wikipedia.org/wiki/*?oldformat=true
// @exclude       https://en.wikipedia.org/wiki/*?oldformat=true
// @author        drhouse
// @grant         none
// @namespace https://greasyfork.org/users/10118
// @downloadURL https://update.greasyfork.org/scripts/13400/Wikipedia%202%20Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/13400/Wikipedia%202%20Wikiwand.meta.js
// ==/UserScript==

var url = document.URL;
var parseA = /^https?:\/\/(\w+)\.wikipedia\.org\/wiki\/([^\?#]+)(\?[^#]+)?(#.+)?/;
var parseB = /^https?:\/\/\w+\.wikipedia\.org\/([\w-]+)\/([^\?#]+)(\?[^#]+)?(#.+)?/;
if (parseA.test(url)) {
    window.location.replace(url.replace(parseA, 'https://www.wikiwand.com/$1/$2$4'));
} else if (parseB.test(url)) {
    window.location.replace(url.replace(parseB, 'https://www.wikiwand.com/$1/$2$4'));
}