// ==UserScript==
// @name        Better sexstories.com
// @namespace   Violentmonkey Scripts
// @match       https://www.sexstories.com/story/*
// @grant       none
// @version     1.0
// @author      -
// @description Provide tab title based on story title - 8/28/2022, 9:46:08 PM
// @downloadURL https://update.greasyfork.org/scripts/450356/Better%20sexstoriescom.user.js
// @updateURL https://update.greasyfork.org/scripts/450356/Better%20sexstoriescom.meta.js
// ==/UserScript==

setTimeout(function() {
  const title = document.querySelector('div.story_info > h2').innerText;
  document.title = title + ' - XNXX Sex Stories';
}, 1000);