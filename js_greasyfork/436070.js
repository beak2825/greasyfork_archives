// ==UserScript==
// @name AO3: Strip Work's Empty Paragraphs
// @description Strip empty paragraphs on Archive of Our Own fics
// @author the_wanlorn
// @version 1.0
// @license MIT
// @grant none
// @include https://archiveofourown.org/works/*
// @include https://archiveofourown.org/*/works/*
// @include http://archiveofourown.org/works/*
// @include http://archiveofourown.org/*/works/*
// @namespace https://greasyfork.org/users/844343
// @downloadURL https://update.greasyfork.org/scripts/436070/AO3%3A%20Strip%20Work%27s%20Empty%20Paragraphs.user.js
// @updateURL https://update.greasyfork.org/scripts/436070/AO3%3A%20Strip%20Work%27s%20Empty%20Paragraphs.meta.js
// ==/UserScript==

var work = document.getElementById('workskin');
var paragraphs = work.getElementsByTagName("p");

for (var i = 0; i < paragraphs.length; i++) {
    var no_text = paragraphs[i].textContent.replace(/\s|&nbsp;/gm,'').length == 0,
        no_content = paragraphs[i].querySelectorAll("[src]").length == 0;
        
    if (no_text && no_content) {
        paragraphs[i].remove();
    }
}