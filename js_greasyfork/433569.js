// ==UserScript==
// @name     AO3: strip empty paragraphs
// @description Strip empty paragraphs from works on Archive of Our Own
// @version  1
// @grant    none
// @include https://archiveofourown.org/works/*
// @include http://archiveofourown.org/works/*
// @namespace https://greasyfork.org/users/94761
// @downloadURL https://update.greasyfork.org/scripts/433569/AO3%3A%20strip%20empty%20paragraphs.user.js
// @updateURL https://update.greasyfork.org/scripts/433569/AO3%3A%20strip%20empty%20paragraphs.meta.js
// ==/UserScript==

// modified from https://greasyfork.org/en/scripts/36801-ao3-strip-empty-paragraphs to specify only removing empty paragraphs in the userstuff module

var usertext = document.getElementsByClassName("userstuff module");
var paragraphs = usertext[0].getElementsByTagName("p");

for (var i = 0; i < paragraphs.length; i++) {
  if (paragraphs[i].textContent.trim() == "") {
    paragraphs[i].remove();
  }
}