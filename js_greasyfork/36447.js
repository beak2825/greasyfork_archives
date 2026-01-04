// ==UserScript==
// @name         SPON AntiAdBlockBlocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Chal
// @match        http://www.spiegel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36447/SPON%20AntiAdBlockBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/36447/SPON%20AntiAdBlockBlocker.meta.js
// ==/UserScript==
Object.defineProperty(window, 'abbUA', {
  value: false,
  writable: false
});
