// ==UserScript==
// @name         52pg
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.52pg.net/*
// @grant        none
// @unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/377983/52pg.user.js
// @updateURL https://update.greasyfork.org/scripts/377983/52pg.meta.js
// ==/UserScript==

document.getElementsByTagName( 'base' )[0].setAttribute( 'href', 'https://www.52pg.net/' );