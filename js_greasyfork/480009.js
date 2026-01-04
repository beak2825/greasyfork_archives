// ==UserScript==
// @name        Link redirects remover for Qwant Lite
// @namespace   rawmonk
// @match       https://lite.qwant.com/
// @grant       none
// @version     1.0
// @author      rawmonk
// @license     ISC
// @description Remove redirections links on QWant Lite
// @downloadURL https://update.greasyfork.org/scripts/480009/Link%20redirects%20remover%20for%20Qwant%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/480009/Link%20redirects%20remover%20for%20Qwant%20Lite.meta.js
// ==/UserScript==
for(var i = 0, l=document.links.length; i<l; i++) {
  elem = document.links[i];
  if (elem.href.includes("redirect")) {
    elem.href = decodeURIComponent(atob(elem.href.split("/")[5].split("?")[0]))
  }
}