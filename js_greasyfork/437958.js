// ==UserScript==
// @name        Become an Hero - reddit.com
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/r/* 
// @grant       none
// @run-at      document-idle
// @version     1.0
// @author      -
// @description Become an Hero on reddit.com!
// @license     WTF
// @downloadURL https://update.greasyfork.org/scripts/437958/Become%20an%20Hero%20-%20redditcom.user.js
// @updateURL https://update.greasyfork.org/scripts/437958/Become%20an%20Hero%20-%20redditcom.meta.js
// ==/UserScript==

var anhero = Object.values(document.querySelectorAll('button'))?.filter((a,b)=>{ return a.textContent == "Become a Hero" });
if (anhero[0]) anhero[0].textContent = "Become an Hero";
  