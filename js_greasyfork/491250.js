// ==UserScript==
// @name        piczel.tv hide banner
// @namespace   Violentmonkey Scripts
// @match       https://piczel.tv/*
// @grant       none
// @version     1.0
// @author      justrunmyscripts
// @description hide the banner (currently containing "Meet Pix!")
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @run-at document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491250/piczeltv%20hide%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/491250/piczeltv%20hide%20banner.meta.js
// ==/UserScript==

const disconnect = VM.observe(document.body, () => {
  const xpathResults = document.evaluate("//div[text()='Meet Pix!']", document, null, XPathResult.ANY_TYPE, null );
  const element = xpathResults.iterateNext();
  const parent_el = element.parentElement;
  parent_el.setAttribute('style', `display: none;`);
});