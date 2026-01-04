// ==UserScript==
// @name         Auto Tag Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://e-hentai.org/
// @match        https://e-hentai.org/?*
// @match        https://e-hentai.org/tag/*
// @match        https://e-hentai.org/watched
// @match        https://e-hentai.org/watched*
// @match        https://exhentai.org/
// @match        https://exhentai.org/?*
// @match        https://exhentai.org/tag/*
// @match        https://exhentai.org/watched
// @match        https://exhentai.org/watched*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419967/Auto%20Tag%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/419967/Auto%20Tag%20Search.meta.js
// ==/UserScript==

(function() {
'use strict';

var includeTags = [
    'language:english$',
];
var excludeTags = [];
// var excludeTags = [
//     'female:femdom$'
// ];

var i;
for (i = 0; i < excludeTags.length; i++) {
    excludeTags[i] = "-" + excludeTags[i];
}
var tags = includeTags.concat(excludeTags);
var tagsQuery = "";
var tagQuery;
var search = document.querySelector('.nopm > input[type="text"]');
for (i = 0; i < tags.length; i++) {
    tagQuery = tags[i];
    if (!search.value.includes(tagQuery)) {
        tagsQuery += tagQuery + " ";
    }
}
if (tagsQuery.length && !search.value.includes(tagsQuery)) {
    if (search.value.length) {
        search.value += " ";
    }
    search.value += tagsQuery;
    var submit = document.querySelector('.nopm > input[type="submit"]');
    submit.click();
}

})();
