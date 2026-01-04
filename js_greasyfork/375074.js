// ==UserScript==
// @name         Tiktok Web Player Controls
// @namespace    https://kmcgurty.com
// @version      1
// @description  Stop your ears from getting blown out by every tiktok video
// @author       kmcgurty
// @match        https://m.tiktok.com/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375074/Tiktok%20Web%20Player%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/375074/Tiktok%20Web%20Player%20Controls.meta.js
// ==/UserScript==

var player = document.querySelector("#jp_video_0");
player.setAttribute("controls", "");
player.volume = 0.15;