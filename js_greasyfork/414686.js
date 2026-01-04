// ==UserScript==
// @name        XKCD Explain Button
// @namespace   Violentmonkey Scripts
// @match       *://*.xkcd.com/*
// @grant       none
// @version     1.0.1
// @author      Jonah Lawrence - youtube.com/DevProTips
// @description Add a button to XKCD comics next to the "Random" button which links to the explainxkcd for the current comic
// @downloadURL https://update.greasyfork.org/scripts/414686/XKCD%20Explain%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/414686/XKCD%20Explain%20Button.meta.js
// ==/UserScript==

// locate all of the "Random" buttons on the page
Array.from(document.querySelectorAll(".comicNav a[href*='random']")).forEach(x => {
  // get the meta tag containing the fully qualified comic url and replace xkcd with explainxkcd
  let explainUrl = document.querySelector(".comicNav ~ a[href^='https://xkcd.com/']").href.replace("xkcd","explainxkcd")
  // insert a new item before the random button linking to the explainxkcd url
  x.parentElement.insertAdjacentHTML("beforeBegin",`<li><a href='${explainUrl}'>Explain</a></li>`)
})