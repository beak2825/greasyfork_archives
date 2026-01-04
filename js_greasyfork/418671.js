// ==UserScript==
// @name         Wikipedia Width Changer
// @namespace    https://garner.io
// @version      1.2
// @description  Constrains Wikipedia articles to 40em in width for easier reading.
// @author       John Garner
// @icon         https://www.wikipedia.org/static/favicon/wikipedia.ico
// @grant        none
// @run-at       document-start
// @include      *://*.wikipedia.org/*
// @exclude      *://*.wikipedia.org/w/*
// @exclude      *://*.wikipedia.org/wiki/Main_Page*
// @exclude      *://*.wikipedia.org/wiki/Talk*
// @exclude      *://*.wikipedia.org/wiki/Special*
// @exclude      *://*.wikipedia.org/wiki/Wikipedia*
// @exclude      *://*.wikipedia.org/wiki/Help*
// @exclude      *://*.wikipedia.org/wiki/Portal*
// @downloadURL https://update.greasyfork.org/scripts/418671/Wikipedia%20Width%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/418671/Wikipedia%20Width%20Changer.meta.js
// ==/UserScript==

document.getElementById("content").style.maxWidth = '40em';
document.getElementById("content").style.margin = 'auto';