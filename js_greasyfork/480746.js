// ==UserScript==
// @name        Enhancer for YouTube Style Fix
// @namespace   https://greasyfork.org/en/users/34131-velc-gf
// @version     1.1.0
// @author      Velarde, Louie C.
// @description Fixes Enhancer for YouTube’s buttons and tooltips to match the website’s appearance
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?domain=www.mrfdev.com/enhancer-for-youtube&sz=64
// @license     LGPL-3.0
// @run-at      document-start
// @grant       GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/480746/Enhancer%20for%20YouTube%20Style%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/480746/Enhancer%20for%20YouTube%20Style%20Fix.meta.js
// ==/UserScript==
GM_addStyle(`.ytp-left-controls .ytp-efyt-button {
  width:var(--yt-delhi-pill-height,48px) !important;
  min-width:unset;
  height:var(--yt-delhi-pill-height,48px) !important;
  backdrop-filter:var(--yt-frosted-glass-backdrop-filter-override,blur(16px));
  background:var(--yt-spec-overlay-background-medium-light,rgba(0,0,0,.3));
  border-radius:50%;
  margin-right:var(--yt-delhi-pill-top-height,12px);
  margin-top:var(--yt-delhi-pill-top-height,12px);
  padding:0 !important;
  text-shadow:0 0 2px #000;
}`);

GM_addStyle(`.ytp-big-mode .ytp-left-controls .ytp-efyt-button {
  margin:var(--yt-delhi-big-mode-pill-top-height,20px) 0 0 12px;
  height:var(--yt-delhi-big-mode-pill-height,56px) !important;
}
`);

GM_addStyle(`.ytp-left-controls .ytp-efyt-button::after {
  content:"";
  position:absolute;
  inset:4px;
  background:transparent;
  pointer-events:none;
  border-radius:28px;
}`);

GM_addStyle(`.ytp-left-controls .ytp-efyt-button:hover::after {
  background-color:var(--yt-spec-overlay-button-secondary,rgba(255,255,255,.1));
  transition:background-color .2s cubic-bezier(.05,0,0,1);
}`);

GM_addStyle(`.ytp-left-controls .ytp-efyt-button:active::after {
  background-color:var(--yt-spec-overlay-tonal-hover,rgba(255,255,255,.2));
  transition:background-color .2s cubic-bezier(.05,0,0,1);
}`);

GM_addStyle('.ytp-left-controls .ytp-efyt-button svg {padding:var(--yt-delhi-pill-top-height,12px) !important}');
GM_addStyle('.ytp-big-mode .ytp-left-controls .ytp-efyt-button svg {padding:calc((var(--yt-delhi-big-mode-pill-height, 56px) - 24px)/2) !important}');
GM_addStyle('#efyt-volume-booster {margin-left:var(--yt-delhi-pill-top-height,12px); margin-right:0}');
GM_addStyle('#efyt-controls-button svg, .ytp-efyt-button svg {width:24px; height:unset; scale:1.5}');


function fix() {
  if (window.location.pathname === '/watch') {
    let fullscreenGrid = document.querySelector('.ytp-fullscreen-grid');
    let tooltipContainer = document.querySelector('.ytp-efyt-tooltip .ytp-tooltip-text');
    if (fullscreenGrid && tooltipContainer) {
      fullscreenGrid.style.display = 'none';
      tooltipContainer.classList.add('ytp-tooltip-bottom-text');
    } else {
      setTimeout(fix, 20);
    }
  }
}

window.addEventListener('yt-navigate-finish', fix);