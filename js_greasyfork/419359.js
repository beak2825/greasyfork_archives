// ==UserScript==
// @name YouTube Simple Cinema Mode
// @namespace q1k
// @version 1.0.1
// @description While video is playing the page will turn dark automatically, giving focus to the video.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/419359/YouTube%20Simple%20Cinema%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/419359/YouTube%20Simple%20Cinema%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
  #movie_player.playing-mode, #movie_player, #movie_player.playing-mode > *, #movie_player > *, #movie_player.seeking-mode {
    z-index: 2000000000 !important; /*2147483646*/
  }
  #player .player-api {
    z-index: auto !important;
  }
  .ytp-contextmenu,
  .yt-uix-clickcard-card,
  #appbar-guide-menu,
  #movie_player > .ytp-tooltip,
  #yt-uix-videoactionmenu-menu,
  paper-dialog.ytd-popup-container[role="dialog"]
  {
    z-index: 2147483647 !important;
  }
  #movie_player:before {
    content: "";
    position: fixed !important;
    top: 0;
    left: 0;
    width: 110vw;
    height: 110vh;
    background: rgba(0, 0, 0, /*[[opacity]]*/);
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    pointer-events: none;
    z-index: 1999999999; /*2147483645*/
  }
  #movie_player.playing-mode:before,
  #movie_player.seeking-mode:before {
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }
  
  /*fix*/
  #movie_player {
    contain: none;
  }
  #movie_player {
    overflow: unset;
  }
  #movie_player.ended-mode .html5-video-container {
    visibility: hidden;
  }
  #player ~ #content,
  .ytp-iv-video-content {
    pointer-events: none;
  }
  #player ~ #content > *,
  .ytp-iv-video-content > * {
    pointer-events: auto;
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
