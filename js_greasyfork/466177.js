// ==UserScript==
// @name         Episodes Average Score - MAL
// @namespace    AverageEPScore
// @version      1
// @description  Shows the total episodes average score on any anime entries on MAL.
// @author       hacker09
// @match        https://myanimelist.net/*/*/*/episode
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466177/Episodes%20Average%20Score%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/466177/Episodes%20Average%20Score%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector(".episode-title").innerText += ' (Total episodes average score ' + ([...document.querySelectorAll("span.value")].map(row => row.innerText).filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b) / [...document.querySelectorAll("span.value")].map(row => row.innerText).length).toFixed(2) + ') (' + (([...document.querySelectorAll("span.value")].map(row => row.innerText).filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b) / [...document.querySelectorAll("span.value")].map(row => row.innerText).length) * 100 / 5).toFixed(2) + '%)'; //Show the Average Score results
})();