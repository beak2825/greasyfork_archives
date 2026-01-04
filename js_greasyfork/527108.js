// ==UserScript==
// @name        go to old reddit
// @namespace   Violentmonkey Scripts
// @match       *://*.reddit.com/*
// @grant       none
// @version     1.0
// @author      harvastum
// @run-at      document-start
// @description 3/20/2024, 10:04:33 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527108/go%20to%20old%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/527108/go%20to%20old%20reddit.meta.js
// ==/UserScript==

let u = document.location.href;
let pattern = /https?:\/\/www\.reddit\.com(?!\/(?:(?:media|gallery|settings)\b|r\/\w+\/s\/))([\/#?].*)?/
let found = u.match(pattern);
console.log("found: " + found);
if (pattern.test(u)) {
  // window.location = u.replace("www.reddit", "old.reddit");
  window.location.replace("https://old.reddit.com/" + found[1]);

}



