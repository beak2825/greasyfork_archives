// ==UserScript==
// @name         Yet Another Wikipedia 2 Wikiwand
// @version      0.1
// @description  Redirect Wikipedia to Wikiwand.
// @namespace    https://greasyfork.org/en/users/705158-fy-meng
// @run-at       document-start
// @include      https://*.wikipedia.*/*
// @include      http://*.wikipedia.*/*
// @exclude      http://*.wikipedia.org/wiki/*?oldformat=true
// @exclude      https://*.wikipedia.org/wiki/*?oldformat=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416101/Yet%20Another%20Wikipedia%202%20Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/416101/Yet%20Another%20Wikipedia%202%20Wikiwand.meta.js
// ==/UserScript==

var url = document.URL;
var regex1 = /^https?:\/\/(\w+)\.wikipedia\.org\/wiki\/([^\?#]+)(\?[^#]+)?(#.+)?/;
var regex2 = /^https?:\/\/\w+\.wikipedia\.org\/([\w-]+)\/([^\?#]+)(\?[^#]+)?(#.+)?/;
if (regex1.test(url)) {
    window.location.replace(url.replace(regex1, 'https://www.wikiwand.com/$1/$2$4'));
} else if (regex2.test(url)) {
    window.location.replace(url.replace(regex2, 'https://www.wikiwand.com/$1/$2$4'));
}