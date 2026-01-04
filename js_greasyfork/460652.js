// ==UserScript==
// @name         MyAnimeList - filter badges from first to latest
// @namespace    http://myanimelist.net/profile/kyoyatempest
// @version      1.1
// @description  Filters badges from first to latest instead of latest to first.
// @author       kyoyacchi
// @match        https://myanimelist.net/profile/*
// @grant        none
// @icon         https://myanimelist.net/favicon.ico
// @license      gpl3.0
// @downloadURL https://update.greasyfork.org/scripts/460652/MyAnimeList%20-%20filter%20badges%20from%20first%20to%20latest.user.js
// @updateURL https://update.greasyfork.org/scripts/460652/MyAnimeList%20-%20filter%20badges%20from%20first%20to%20latest.meta.js
// ==/UserScript==
function Apply () {
  try {
let parent = document.getElementById('badges');
    if (!parent) return
let arr = Array.from(parent.childNodes);
arr = arr.filter(function(e) {
return e.textContent != "View All"//for mobile version.
});

arr.reverse()
parent.append(...arr)
  console.log("Applied.")
  } catch(e) {
    console.error(`An error occurred.\n${e.message || e})`)
}
}
Apply()