// ==UserScript==
// @name         ShellShock Controls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Restore shellshock controls
// @author       Liam Wang
// @match        https://shellshock.io/
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433178/ShellShock%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/433178/ShellShock%20Controls.meta.js
// ==/UserScript==

window.localStorage.setItem('controls', '{"keyboard":{"game":{"up":"W","down":"S","left":"A","right":"D","jump":"SPACE","fire":"MOUSE 0","scope":null,"reload":"MOUSE 2","swap_weapon":"SHIFT","grenade":"Q"},"spectate":{"ascend":"E","descend":"C"}},"gamepad":{"game":{"jump":0,"fire":7,"scope":6,"reload":2,"swap_weapon":3,"grenade":5},"spectate":{"ascend":6,"descend":7}}}');