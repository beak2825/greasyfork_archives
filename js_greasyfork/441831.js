// ==UserScript==
// @name        Hide Fullscreen title
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @grant       none
// @version     1.0
// @author      jside
// @description Hides top title in Fullscreen mode 
// @downloadURL https://update.greasyfork.org/scripts/441831/Hide%20Fullscreen%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/441831/Hide%20Fullscreen%20title.meta.js
// ==/UserScript==

let styleSheet = `
.ytp-gradient-top {
  display: none !important;
}

.ytp-chrome-top {
  display: none !important;
}
`;

let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);
