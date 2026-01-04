// ==UserScript==
// @name Controls for YouTube - Alternative Theme (OBSOLETE)
// @namespace lednerg
// @version 20.9.7
// @description This theme was for the Chrome extension "Controls for YouTube", but now it's included in the extension itself.
// @author lednerg
// @license CC0-1.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/410798/Controls%20for%20YouTube%20-%20Alternative%20Theme%20%28OBSOLETE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410798/Controls%20for%20YouTube%20-%20Alternative%20Theme%20%28OBSOLETE%29.meta.js
// ==/UserScript==

(function() {
let css = `
.yts-centered.yts-seek-duration {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPVJREFUeNrsmMsNwjAQRBNECSkmTVBHuHKmklAKDUAx4eizWUtEQpH4eMCxdz0rjXIaKU8aJ+NtvfeNhdk0RoYgBCEIQQhCEIIQRDmIE42iLrEHm9B+v9Q8F1Gf0AMJAQkziYZEnlVB5hlF3Z89WUA+xQbxZAN5FxvEkxXkVWwQTxEgy9ggnmJAnmODeCCQNmKLsta65SQ6iqYYU4kgYa6iw+Opumv1orNoX11p3Bb6XiaiFQ77LgYiJcgtJt8LzxD7xUJrfBU/RPUVxURpNFHj1V+sTFx11S8fHBALlypKv9R4bhoJQhCCEIQgBCEIQSoFuQswAPERVNhVvu63AAAAAElFTkSuQmCC') !important;
    transition-duration: 0s;
}
.yts-control-wrapper {
    margin: 0 7px;
}
button.ytp-button.yts-replay-button.yts-replay-button-medium.yts-replay-button-rewind.yts-block {
    transform: translate( -15%, 0% )!important;    
}
.ytp-fullscreen button.ytp-button.yts-replay-button.yts-replay-button-medium.yts-replay-button-rewind.yts-block {
    transform: translate( 0%, 0% )!important;    
}
.yts-control-wrapper .yts-replay-button {
    font-size: 0%;
    transform: translate( 0%, 0% )!important;
    transition: transform 1.5s ease-out;
    transition-delay: 1s;
}
.yts-replay-button {
    zoom: 0.8;
    padding: 1px 4px 0 6px!important;
    transition: padding-top .5s ease-in-out !important;
    transition-delay: .25s !important;
}
.yts-replay-button:hover  {
    padding-top: 5px !important;
    transition: padding-top .125s ease-in-out !important;
    transition-delay: 0s !important;
}
.yts-replay-button-short {
    padding: 1px 8px !important;
    margin: 0 0px;
}
.yts-replay-button small {
    text-shadow: 0 0 1px black, 0 0 2px black, 0 0 3px black;
    position: relative;
    padding-top: 0px !important;
    top: -15px;
    font-size: 11pt;
    opacity: 0;  
    transition: opacity .35s ease-out;
    transition-delay: .25s;
}
.yts-replay-button:hover small {
    opacity: 1 !important;
    transition: opacity .125s linear !important; /**/
    transition-delay: 0s !important;
}
.ytp-fullscreen .yts-replay-button {
    width: auto !important;
}
.ytp-fullscreen .yts-replay-button-short {
    margin: 0 0px !important;
}
.ytp-fullscreen .yts-replay-button {
    zoom: 1.2;
    position: relative !important;
    bottom: 2px !important;
}
.ytp-fullscreen .yts-control-wrapper {
    margin: 0px 7px;
}
.ytp-fullscreen .yts-seek-duration small{
    zoom: 1 !important;
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
