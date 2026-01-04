// ==UserScript==
// @name        Remove Skip to next video button 
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @grant       none
// @version     1.0
// @author      jside
// @description Removes the skip to next video button present in media bar 
// @downloadURL https://update.greasyfork.org/scripts/441832/Remove%20Skip%20to%20next%20video%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/441832/Remove%20Skip%20to%20next%20video%20button.meta.js
// ==/UserScript==

let styleSheet = `
.ytp-next-button {
  display: none !important;
}
`;

let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);
