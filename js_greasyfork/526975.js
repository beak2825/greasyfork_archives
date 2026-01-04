// ==UserScript==
// @name        Savemyexams revision note views and topic questions unlimiter
// @namespace   Violentmonkey Scripts
// @match       http*://*.savemyexams.com/*
// @grant       none
// @version     1.0
// @author      Bobletsbob
// @description 2/15/2025, 10:32:13 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526975/Savemyexams%20revision%20note%20views%20and%20topic%20questions%20unlimiter.user.js
// @updateURL https://update.greasyfork.org/scripts/526975/Savemyexams%20revision%20note%20views%20and%20topic%20questions%20unlimiter.meta.js
// ==/UserScript==

setInterval(() => {
  localStorage.removeItem("SME.topic-question-part-solution-views");
  localStorage.removeItem("SME.revision-note-views")
}, 1000);