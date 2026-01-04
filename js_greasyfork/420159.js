// ==UserScript==
// @name         fandomwidth
// @version      0.3
// @description  resizes fandom for smaller window widths.
// @match        http://fandom.com/*
// @match        https://fandom.com/*
// @match        http://*.fandom.com/*
// @match        https://*.fandom.com/*
// @namespace    https://greasyfork.org/users/217495-eric-toombs
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/420159/fandomwidth.user.js
// @updateURL https://update.greasyfork.org/scripts/420159/fandomwidth.meta.js
// ==/UserScript==

document.getElementsByClassName("WikiaSiteWrapper")[0].style.width = "auto"