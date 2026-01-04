// ==UserScript==
// @name         PornHub sucks
// @namespace    *://*.tampermonkey.net/*
// @version      0.1
// @description  Don't watch porn, kids.
// @author       Martin McWatters
// @match        https://pornhub.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427529/PornHub%20sucks.user.js
// @updateURL https://update.greasyfork.org/scripts/427529/PornHub%20sucks.meta.js
// ==/UserScript==

document.querySelector('body').style.display = 'none';
