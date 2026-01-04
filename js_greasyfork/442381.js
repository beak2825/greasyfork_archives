// ==UserScript==
// @name         No servers found fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A temporary fix for the no servers found error
// @author       0xE3
// @match        https://*.tankionline.com/*
// @icon         https://tankicheats.com/favicon.ico
// @require      https://firebasestorage.googleapis.com/v0/b/tankichat-e80a2.appspot.com/o/server-fix.js?alt=media
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442381/No%20servers%20found%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/442381/No%20servers%20found%20fix.meta.js
// ==/UserScript==

if(window.server && window.server.isBroken) {
  window.server.fix();
}