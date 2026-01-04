// ==UserScript==
// @name        GeoGuessr Better Emotes Wheel
// @namespace   https://greasyfork.org/en/users/1435525-rawblocky
// @match       https://www.geoguessr.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant       GM_addStyle
// @license     MIT
// @version     1.0
// @author      Rawblocky
// @description Simplifies the look of the emote wheel by getting rid of a lot of the bloat
// @downloadURL https://update.greasyfork.org/scripts/529343/GeoGuessr%20Better%20Emotes%20Wheel.user.js
// @updateURL https://update.greasyfork.org/scripts/529343/GeoGuessr%20Better%20Emotes%20Wheel.meta.js
// ==/UserScript==


// Configuration
const emoteMenuOpacity = 0.1 // 0 = Transparent, 1 = Opaque
const emoteMenuBlurAmount = 0.25 // How blurred should the emote menu background be?


// Code
GM_addStyle(`

/* Remove background blur */
[class*="emote-wheel_overlay__"] {display: none !important}

/* Wheel effects */
[class*="emote-wheel_wheel__"] {
  /* Remove 3D effect */
  transform: perspective(600px) !important;
  /* Add blur */
  backdrop-filter: blur(${emoteMenuBlurAmount}rem) !important;
  -webkit-backdrop-filter: blur(${emoteMenuBlurAmount}rem) !important;
  /* Remove transition + add background color */
  animation: none !important;
  background-color: rgb(0 0 0 / ${emoteMenuOpacity}) !important
}

/* Remove wedges */
[class*="emote-wheel_svgButton__"] {animation: none !important}

/* Change button easing */
[class*="emote-wheel_root__"] {--smooth: cubic-bezier(0,1,0.49,1.04) !important}

/* Remove emote icons transition/delay */
[class*="emote-wheel_emoteContainer__"] {animation: none !important; opacity: 1 !important}
`);