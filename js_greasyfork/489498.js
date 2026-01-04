// ==UserScript==
// @name YouTube - Force consistent video size (revert to pre-flexy)
// @namespace https://greasyfork.org/en/users/933798
// @version 20250418.11.22
// @description This style forces to use the pre-flexy video size before it first came out in 2018.
// @author Magma_Craft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/489498/YouTube%20-%20Force%20consistent%20video%20size%20%28revert%20to%20pre-flexy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489498/YouTube%20-%20Force%20consistent%20video%20size%20%28revert%20to%20pre-flexy%29.meta.js
// ==/UserScript==

(function() {
let css = `
div#primary.style-scope.ytd-watch-flexy, ytd-watch-flexy[flexy] #player-container-outer.ytd-watch-flexy {
  min-width: 853px !important;
  max-width: 853px !important;
}

/* Replace background from transparent to black translucent one */
ytd-watch-flexy[flexy] #player-container-outer.ytd-watch-flexy {
  background-color: #000000 !important;
}

/* Remove rounded edges on videos due to buggyness */
ytd-watch-flexy[rounded-player-large]:not([fullscreen]):not([theater]) #ytd-player.ytd-watch-flexy, ytd-watch-flexy[rounded-player] #ytd-player.ytd-watch-flexy {
  border-radius: 0px !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
