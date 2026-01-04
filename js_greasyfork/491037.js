// ==UserScript==
// @name        Maxroll Adblock popup be gone
// @namespace   Violentmonkey Scripts
// @match       https://maxroll.gg/*
// @grant       none
// @version     1.0.0.1
// @author      -
// @license MIT
// @description 27/03/2024, 22:16:01
// @downloadURL https://update.greasyfork.org/scripts/491037/Maxroll%20Adblock%20popup%20be%20gone.user.js
// @updateURL https://update.greasyfork.org/scripts/491037/Maxroll%20Adblock%20popup%20be%20gone.meta.js
// ==/UserScript==

var tm = new Date
tm = tm.setDate(tm.getDate() + 1)
localStorage.setItem("adBlockWarning", `{"value":true,"expiry":${tm}}`);