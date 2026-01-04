// ==UserScript==
// @name        Unlimited Topic Question Answers
// @namespace   Violentmonkey Scripts
// @match       https://www.savemyexams.com/*/topic-questions/*
// @grant       none
// @license     MIT
// @version     1.1
// @author      Hexanut
// @description Removes the 10 use free limit on viewing topic question answers continuously
// @downloadURL https://update.greasyfork.org/scripts/519461/Unlimited%20Topic%20Question%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/519461/Unlimited%20Topic%20Question%20Answers.meta.js
// ==/UserScript==

setInterval(() => {
  localStorage.removeItem("SME.topic-question-part-solution-views");
}, 1000);