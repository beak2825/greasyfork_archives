// ==UserScript==
// @name         sex stories margin fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes margins, disables most css, fixes document/tab title on sexstories.com
// @author       You
// @match        https://www.sexstories.com/story/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374363/sex%20stories%20margin%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374363/sex%20stories%20margin%20fixer.meta.js
// ==/UserScript==


document.querySelector("head").innerHTML += `<style>#story_center_panel {
  width: inherit;
  margin: 10px auto;
  border-style: solid;
  border-width: 2px;
  }</style>`;

document.querySelector("title").innerText = document.querySelector("h2").innerText;

