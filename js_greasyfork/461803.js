// ==UserScript==
// @name        Remove twitch embed on fextralife
// @namespace   Violentmonkey Scripts
// @match       https://*.wiki.fextralife.com/*
// @grant       none
// @version     1.0
// @author      geco
// @description 14/3/2023 12:48:51
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461803/Remove%20twitch%20embed%20on%20fextralife.user.js
// @updateURL https://update.greasyfork.org/scripts/461803/Remove%20twitch%20embed%20on%20fextralife.meta.js
// ==/UserScript==
document.getElementById("sidebar-wrapper").remove();
document.getElementById("wrapper").style.paddingLeft = "0px";