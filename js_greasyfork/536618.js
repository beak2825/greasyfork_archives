// ==UserScript==
// @name        map-making.app hide UI
// @namespace   alienperfect
// @match       https://map-making.app/*
// @grant       GM_addStyle
// @version     1.1
// @author      Alien Perfect
// @description Press `h` to hide the UI
// @downloadURL https://update.greasyfork.org/scripts/536618/map-makingapp%20hide%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/536618/map-makingapp%20hide%20UI.meta.js
// ==/UserScript==

"use strict";

const key = "h";
let style;
let hidden;

document.addEventListener("keydown", (e) => {
  if (e.key === key && document.activeElement.tagName !== "INPUT" && !hidden) return hide();
  if (e.key === key && hidden) return show();
});

function hide() {
  style = GM_addStyle(`
    .embed-controls {display: none !important}
    .SLHIdE-sv-links-control {display: none !important}
    [class$="gmnoprint"], [class$="gm-style-cc"] {display: none !important}
  `);

  hidden = true;
}

function show() {
  style.remove();
  hidden = false;
}
