// ==UserScript==
// @name         F365 External Links in new window
// @description  Target _blank
// @match        http://forum.football365.com/*
// @grant        none
// @version 0.0.1.20150806075943
// @namespace https://greasyfork.org/users/14019
// @downloadURL https://update.greasyfork.org/scripts/11510/F365%20External%20Links%20in%20new%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/11510/F365%20External%20Links%20in%20new%20window.meta.js
// ==/UserScript==

$("a.postlink:not([href*='forum.football365'])").attr("target","_blank")