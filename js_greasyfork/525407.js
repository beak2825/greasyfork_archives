// ==UserScript==
// @namespace   confused
// @name        adventuretimeDOTru adDel
// @version     1
// @description removes the notice in player that asks to turn off adblock
// @match       https://adventuretime.ru/*
// @grant       none
// @noframes
// @license MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/525407/adventuretimeDOTru%20adDel.user.js
// @updateURL https://update.greasyfork.org/scripts/525407/adventuretimeDOTru%20adDel.meta.js
// ==/UserScript==

var x = document.querySelector("#oframeplayerJS > pjsdiv:nth-child(18)");
x.remove();