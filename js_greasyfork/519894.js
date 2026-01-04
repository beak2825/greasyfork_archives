// ==UserScript==
// @name     pornhub title filter
// @namespace     pornhub_title_filter
// @version  1
// @description This script filters out pornhub videos containing certain keywords.
// I got tired of 'step' titles on pornhub, but you can adapt the filter as you see fit.
// Source https://github.com/nsfw-free-software/pornhub_filter_step
// @license WTFPLv2
// @grant    none
// @match https://www.pornhub.com/*
// @downloadURL https://update.greasyfork.org/scripts/519894/pornhub%20title%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/519894/pornhub%20title%20filter.meta.js
// ==/UserScript==

re = /step|hermanastra/i;

// filters homepage
matchs = document.querySelectorAll(".thumbnailTitle");
matchs.forEach(e => {
  if(e.innerText.match(re)){
		e.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
  }
});

// filters other pages, eg a category page
matchs = document.querySelectorAll(".gtm-event-thumb-click");
matchs.forEach(e => {
  if(e.innerText.match(re)){
		e.parentElement.parentElement.parentElement.parentElement.remove()
  }
});