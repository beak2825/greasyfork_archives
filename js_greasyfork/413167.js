// ==UserScript==
// @name         Streamer List Embedded IP2
// @namespace    https://ip2always.win/
// @version      0.2
// @description  A Script to view who is online while browsing IP2
// @author       You
// @match        https://ip2always.win/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413167/Streamer%20List%20Embedded%20IP2.user.js
// @updateURL https://update.greasyfork.org/scripts/413167/Streamer%20List%20Embedded%20IP2.meta.js
// ==/UserScript==

function frame(){
var live = document.createElement("iframe");
live.id = "live";
live.setAttribute("src", "https://ip2.online/embedded");
live.setAttribute("height", "500")
live.setAttribute("width", "100%")
document.body.getElementsByTagName("blockquote")[1].before(live)
}
frame();