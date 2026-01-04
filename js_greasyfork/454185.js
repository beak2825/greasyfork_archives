// ==UserScript==
// @name        Force Instagram dark mode
// @description Forces instagram dark mode on desktop
// @namespace   
// @match       https://www.instagram.com/*
// @author      suki
// @version     1.0
// @license     MIT
// @grant       none
// @run-at      document-start
// @icon        https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://instagram.com&size=128
// @downloadURL https://update.greasyfork.org/scripts/454185/Force%20Instagram%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/454185/Force%20Instagram%20dark%20mode.meta.js
// ==/UserScript==


const urlParams = new URLSearchParams(window.location.search);
const url = window.location.search

if(!url.includes("theme=dark")) {
  urlParams.set('theme', 'dark');
  window.location.search = urlParams;
}

else {
  
}