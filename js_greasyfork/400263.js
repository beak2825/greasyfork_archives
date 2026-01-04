// ==UserScript==
// @name Full Theater invidious
// @namespace https://greasyfork.org/en/users/322108-nullgemm
// @version 0.1.1
// @description Maximize the video player without going fullscreen.
// @author nullgemm
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://invidio\.?us.*)$/
// @downloadURL https://update.greasyfork.org/scripts/400263/Full%20Theater%20invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/400263/Full%20Theater%20invidious.meta.js
// ==/UserScript==

(function() {
let css = `
.pure-u-md-2-24
  {
    width: 0;
  }

  .pure-u-md-20-24
  {
    width: 100%;
  }

  .navbar
  {
    position: fixed;
    left: 0;
    right: 0;
    margin: 0;
    padding: 1em;
    z-index: 2;
    opacity: 0;
    background-color: rgba(35, 35, 35, 1);
    box-shadow: 0 0 10px #000;
  }

  .pure-u-md-4-24,
.pure-u-md-12-24,
.pure-u-md-8-24
  {
    opacity: 0;
    transition: opacity 0.05s linear 0.05s;
  }

  .navbar:hover .pure-u-md-4-24,
.navbar:hover .pure-u-md-12-24,
.navbar:hover .pure-u-md-8-24
  {
    opacity: 1;
  }

  .navbar:hover
  {
    opacity: 1;
  }

  #player-container
  {
    padding-bottom: 100vh;
    padding-left: 0;
    padding-right: 0;
  }

  .player-dimensions.vjs-fluid
  {
    padding-top: 100vh;
  }

  .vjs-big-play-button
  {
    top: calc(50% - 45px / 2) !important;
    left: calc(50% - 90px / 2) !important;
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
