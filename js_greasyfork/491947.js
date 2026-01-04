// ==UserScript==
// @name youtube disable round
// @namespace https://userstyles.world/user/mikan loupe
// @version 20240408.03.51
// @description youtubeの丸角を四角に戻します
// @author mikan loupe
// @license mit
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/491947/youtube%20disable%20round.user.js
// @updateURL https://update.greasyfork.org/scripts/491947/youtube%20disable%20round.meta.js
// ==/UserScript==

(function() {
let css = `
ytd-watch-flexy[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy {
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
