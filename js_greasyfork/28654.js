// ==UserScript==
// @name         NoTwitterMoments2
// @namespace    https://www.fuken.xyz
// @version      0.2
// @description  I don't like that new twitter "feature" and also i don't like JQuery much
// @author       Juan Dominguez Jara
// @match        https://*.twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28654/NoTwitterMoments2.user.js
// @updateURL https://update.greasyfork.org/scripts/28654/NoTwitterMoments2.meta.js
// ==/UserScript==

document.querySelector("[data-global-action=moments]").remove()