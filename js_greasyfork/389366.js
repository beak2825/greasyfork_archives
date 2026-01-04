// ==UserScript==
// @name         AO3 Hide Images
// @namespace    ao3-hide-images
// @version      1.1
// @description  Hides images from AO3 works and summaries.
// @author       yuube
// @match        http*://*.archiveofourown.org/works/*
// @match        http*://*.archiveofourown.org/collections/*/works/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389366/AO3%20Hide%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/389366/AO3%20Hide%20Images.meta.js
// ==/UserScript==

// Hide images in chapters.
var chapters = document.querySelector('#chapters');
chapters.querySelectorAll('img').forEach(function (img) {
   img.style.display = 'none';
});

// Hide images in summary.
var summary = document.querySelector('.summary');
summary.querySelectorAll('img').forEach(function (img) {
   img.style.display = 'none';
});
