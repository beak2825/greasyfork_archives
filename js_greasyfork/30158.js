// ==UserScript==
// @name        WeTransfer
// @namespace   WT
// @description Fixes the annoyances of every day use of WeTransfer
// @include     *wetransfer.com/*
// @include     *we.tl/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30158/WeTransfer.user.js
// @updateURL https://update.greasyfork.org/scripts/30158/WeTransfer.meta.js
// ==/UserScript==

function WeTransfer(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

WeTransfer(
  'body {background: #000 !important;}'
  +
  '.wallpaper, .nav__label {pointer-events: none !important; opacity: .8 !important;}'
  +
  '.panel {display: none !important;}'
  +
  '.spinner::after {content: "fixed by Glenn;" !important; color: #FFE !important; font-family: "Fakt Pro Normal", "Fakt Pro Normal Cyr", "Fakt Pro Normal Grk", -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif !important; font-size: 0.7em; text-shadow: 1px 1px 2px rgba(0,0,0,.5); position: relative; display: inline-block; top: -.5em; pointer-events: none;}'
);