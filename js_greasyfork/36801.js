// ==UserScript==
// @name     AO3: strip empty paragraphs
// @description Strip empty paragraphs from works on Archive of Our Own
// @version  4
// @license public domain
// @grant    none
// @include https://archiveofourown.org/works/*
// @include http://archiveofourown.org/works/*
// @include https://archiveofourown.org/collections/*
// @include http://archiveofourown.org/collections/*
// @namespace https://greasyfork.org/users/94761
// @downloadURL https://update.greasyfork.org/scripts/36801/AO3%3A%20strip%20empty%20paragraphs.user.js
// @updateURL https://update.greasyfork.org/scripts/36801/AO3%3A%20strip%20empty%20paragraphs.meta.js
// ==/UserScript==

var paragraphs = document.getElementsByTagName("p");

for (var para of paragraphs) {
  if (!para.textContent.trim() && para.children.length === 0) {
    para.remove();
  }
}