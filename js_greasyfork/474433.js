// ==UserScript==
// @name         YouTube No Rounded Video
// @namespace    https://yakisova.com
// @version      1.0
// @description  No need to round videos
// @author       yakisova41
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474433/YouTube%20No%20Rounded%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/474433/YouTube%20No%20Rounded%20Video.meta.js
// ==/UserScript==

GM_addStyle("ytd-watch-flexy[rounded-player-large][default-layout] #ytd-player.ytd-watch-flexy{border-radius:0;}");