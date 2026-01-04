// ==UserScript==
// @name        Hide Explore tab results in mobile mode 
// @namespace   Violentmonkey Scripts
// @match       https://www.instagram.com/*
// @grant       none
// @version     1.0
// @author      jside
// @description Hide Explore tab results and "use mobile app" banner in mobile mode 
// @downloadURL https://update.greasyfork.org/scripts/441833/Hide%20Explore%20tab%20results%20in%20mobile%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/441833/Hide%20Explore%20tab%20results%20in%20mobile%20mode.meta.js
// ==/UserScript==

let styleSheet = `
.Z_Hl2 {
  display: none !important;
}
.K6yM_ {
  display: none !important;
}
`;

let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);
