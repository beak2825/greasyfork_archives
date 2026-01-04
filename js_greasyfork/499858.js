// ==UserScript==
// @name         IWC iwantclips cards styling
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  Restyle clip card on store page
// @author       Sketch
// @match        https://iwantclips.com/store/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iwantclips.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499858/IWC%20iwantclips%20cards%20styling.user.js
// @updateURL https://update.greasyfork.org/scripts/499858/IWC%20iwantclips%20cards%20styling.meta.js
// ==/UserScript==

const style = document.createElement("style");
let css = '';

(function() {
  // store page
  css = `
.ais-Hits-list,
#wishlist-clips-container {
  display: flex;
  flex-wrap: wrap;
}

.ais-Hits-item,
.wishlist-item {
  width: 25%;
}

.ais-Hits-item > .clip,
.wishlist-item > .clip {
  width: 100%;
  padding: 10px;
  margin: 0;
}

.clip[id^="clip-"] .content-extended {
  opacity: 1;
  z-index: 3;
  position: relative;
  top: 0;
  border: 0;
  background: transparent;
}

.clip[id^="clip-"] .content-box {
  max-height: none;
  margin: 0;
  padding: 0;
}

.clip[id^="clip-"] .content-title {
  padding: 0 6px 0 0;
}

.clip[id^="clip-"] .content-title a {
  max-width: none!important;
  max-height: none;
  white-space: normal;
  text-transform: lowercase;
}

.clip[id^="clip-"] .content-title a:first-letter {
  text-transform: uppercase;
  display: block;
}

.clip[id^="clip-"] .content-title + .d-flex {
  gap: 6px
}

.clip[id^="clip-"] .content-extended [data-target="#shareModal"],
.clip[id^="clip-"] .content-footer > .hidden-xs,
.clip[id^="clip-"] .content-footer .content-type {
  display: none !important;
}

.clip[id^="clip-"] .content-extended .description-block {
  border: 0;
}

.clip[id^="clip-"] .content-meta.visible-xs {
  display: flex!important;
}

.clip[id^="clip-"] .content-footer .video-icon {
  display: block;
  height: 14px;
  width: 14px;

  position: absolute;
  left: 1rem;
  top: 1rem;
}

.clip[id^="clip-"] .content-footer .video-icon:before {
  height: 14px;
  width: 14px;
  z-index: 1;
  display: block;
  margin-top: -5px;
}

.clip[id^="clip-"] .cart-icon:before {
  display: block;
}

.clip[id^="clip-"] .content-price {
  white-space: nowrap;
  margin-bottom: 0;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.clip[id^="clip-"] .content-buttons-ext {
  padding-top: 0;
}
`;

  style.innerHTML = css;
  document.body.appendChild(style);
})();
