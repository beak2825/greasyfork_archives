// ==UserScript==
// @name        Hide key points on PsychologyToday
// @namespace   StephenP
// @match       https://www.psychologytoday.com/*
// @grant       none
// @license     copyleft
// @version     1.0
// @author      StephenP
// @description Hide key points on PsychologyToday to prevent a lazy approach to reading.
// @downloadURL https://update.greasyfork.org/scripts/509427/Hide%20key%20points%20on%20PsychologyToday.user.js
// @updateURL https://update.greasyfork.org/scripts/509427/Hide%20key%20points%20on%20PsychologyToday.meta.js
// ==/UserScript==
let stl=document.createElement("STYLE");
stl.innerHTML=".blog_entry__key-points{display: none}"
document.body.appendChild(stl);