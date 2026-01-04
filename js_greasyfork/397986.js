// ==UserScript==
// @name        Allow zoom on Achewood
// @version     4
// @grant       none
// @match       *://*.achewood.com/*
// @match       *://achewood.com/*
// @description Allows zooming on Achewood.com
// @namespace   https://greasyfork.org/users/324881
// @downloadURL https://update.greasyfork.org/scripts/397986/Allow%20zoom%20on%20Achewood.user.js
// @updateURL https://update.greasyfork.org/scripts/397986/Allow%20zoom%20on%20Achewood.meta.js
// ==/UserScript==

document.querySelectorAll('[content*="width=device-width"]')[0].setAttribute("content", "width=device-width");
