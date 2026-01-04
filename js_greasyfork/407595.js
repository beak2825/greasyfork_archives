// ==UserScript==
// @name Bandcamp: Stick Track List & Description to Player
// @namespace myfonj
// @version 1.1.0
// @description Moves album variations and merchandise down so playlist or track description appears right below player.
// @author myf
// @license CC0 - Public Domain
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bandcamp.com/*
// @downloadURL https://update.greasyfork.org/scripts/407595/Bandcamp%3A%20Stick%20Track%20List%20%20Description%20to%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/407595/Bandcamp%3A%20Stick%20Track%20List%20%20Description%20to%20Player.meta.js
// ==/UserScript==

(function() {
let css = `
/*
Originally https://userstyles.org/styles/123397/
https://greasyfork.org/en/scripts/407595
https://userstyles.world/style/24273

Changelog
1.1.0 (2025-09-19) Added tiny "current track" decorations.
1.0.0 (2025-09-19) Removed the non-bandcamp hostnames scoping, basically noone uses branded BC instances. RIP regexp("https?://(?!([^.]+\\\\.)*?bandcamp.com/)[^/]+/.*").
0.0.1 (around 2018) Init, scoped globally.

Quite unbelieavable these selectors still work, after nearly a decade…
*/
/*
move merchandising down, so playlist or track description moves up below player
*/
#centerWrapper #pgBd #trackInfoInner {
	display: flex;
	flex-direction: column;
}
#centerWrapper #pgBd #trackInfoInner > .tralbumCommands  {
	order: 1;
}
/*
move upcoming shows down, so discography moves up below band info
*/
#centerWrapper #pgBd #rightColumn {
	display: flex;
	flex-direction: column;
}
#centerWrapper #pgBd #rightColumn > #showography {
	order: 1;
}
/*
more distinguishable "current" and "currently playing" track
*/
.current_track {
 outline: 1px solid color-mix(in srgb, currentcolor, transparent);
}
.play_status.playing {
 filter: invert(1);
}
/*
make modals less modal, probably not needed anymore (?)
* OFF for now /
.ui-widget-overlay {
	display: none;
}
.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.nu-dialog.no-title {
	position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: auto !important;
    left: auto !important;
}
/* */

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
