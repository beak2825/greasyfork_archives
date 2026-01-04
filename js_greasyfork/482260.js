// ==UserScript==
// @name        Remove watermark - jnews.jd.com
// @namespace   Violentmonkey Scripts
// @match       http://jnews.jd.com/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 8/18/2021, 3:42:04 PM
// @downloadURL https://update.greasyfork.org/scripts/482260/Remove%20watermark%20-%20jnewsjdcom.user.js
// @updateURL https://update.greasyfork.org/scripts/482260/Remove%20watermark%20-%20jnewsjdcom.meta.js
// ==/UserScript==

const timer = setInterval(() => {
  if (!document.body?.firstChild?.style) {
    return;
  }
  clearTimeout(timer);
  document.body.firstChild.style.backgroundImage = 'none';
});