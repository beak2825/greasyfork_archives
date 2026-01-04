// ==UserScript==
// @name         lolinez
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @run-at       document-start
// @author       You
// @match        *://www.lolinez.com/*
// @grant        none
// @unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/372106/lolinez.user.js
// @updateURL https://update.greasyfork.org/scripts/372106/lolinez.meta.js
// ==/UserScript==

location.href = location.href.replace('http://www.lolinez.com/?','');