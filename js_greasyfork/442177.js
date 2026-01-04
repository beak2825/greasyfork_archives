// ==UserScript==
// @name        Automatically Start - speedtest.net
// @namespace   Violentmonkey Scripts
// @match       *://www.speedtest.net/
// @grant       none
// @license     GNU GPLv3
// @version     1.0
// @author      doge2018
// @description This script automatically starts the speedtest.
// @downloadURL https://update.greasyfork.org/scripts/442177/Automatically%20Start%20-%20speedtestnet.user.js
// @updateURL https://update.greasyfork.org/scripts/442177/Automatically%20Start%20-%20speedtestnet.meta.js
// ==/UserScript==

window.OOKLA.globals.shouldStartOnLoad = true;
document.location.href = "run";