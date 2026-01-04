// ==UserScript==
// @name         Nordic Discord
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Discord theme. Will eventually be compatible with 100r ecosystem themes
// @author       Sasha Koshka
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422409/Nordic%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/422409/Nordic%20Discord.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var sheet = document.createElement("style");
  sheet.innerHTML = `
* {
  font-family: monospace !important;
  font-size: 12px !important;
}

:root{
  --background:#2E3440;
  --f_high:#ECEFF4;
  --f_med:#9DC4C3;
  --f_low:#B4B8C0;
  --f_inv:#5E81AC;
  --b_high:#5E81AC;
  --b_med:#434C5E;
  --b_low:#3B4252;
  --b_inv:#ABCDCC;
}

button[aria-label="Send a gift"], button[aria-label="Open GIF picker"], div.toolbar-1t6TWx > a[href="https://support.discord.com"]{
  display:none !important;
}

.avatar-1BDn8e, .avatar-3uk_u9 {
  width: 32px;
  height: 32px;
  padding-left: 4px;
  filter: sepia(100%) brightness(80%) hue-rotate(170deg) grayscale(20%);
}

.messageContent-2qWWxC {
  padding-bottom: 4px;
}

.menu-3sdvDG * {
  color: var(--f_inv) !important;
}

.bar-2Qqk5Z, .barFill-23-gu-, .grabber-3mFHz2{
  background-color: var(--f_inv) !important;
  border: none !important;
}

.colorDefault-2K3EoJ.focused-3afm-j {
  background-color: var(--f_inv) !important;
  color: var(--f_inv) !important;
}

.theme-dark {
  --background-primary: var(--b_low) !important;
  --background-secondary: var(--b_med) !important;
  --background-secondary-alt: var(--b_med) !important;
  --background-tertiary: var(--b_low) !important;
  --background-accent: var(--b_med) !important;
  --background-floating: var(--b_inv) !important;
  --background-modifier-selected: var(--b_high) !important;

  --text-normal: var(--f_high) !important;
  --text-link: var(--f_med) !important;
  --text-muted: var(--f_low) !important;
  --channels-default: var(--f_low) !important;
  --interactive-active: var(--f_high) !important;
  --interactive-muted: var(--f_low) !important;
  --interactive-hover: var(--f_high) !important;

  --channeltextarea-background: transparent;
  --scrollbar-auto-scrollbar-color-thumb: var(--b_high) !important;
  --scrollbar-auto-scrollbar-color-track: var(--b_med) !important;

}


`;
  document.head.appendChild(sheet);
})();