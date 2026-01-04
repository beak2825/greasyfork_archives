// ==UserScript==
// @name         Access Denied
// @namespace    https://greasyfork.org/en/users/946530-devfishh
// @version      1.0
// @description  Pretends your access to a website is denied. Enter your webiste URL on line 6 (If URL contains www then add that too)
// @author       DevFish
// @match        https://www.tiktok.com/*
// @grant        window.close
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/481304/Access%20Denied.user.js
// @updateURL https://update.greasyfork.org/scripts/481304/Access%20Denied.meta.js
// ==/UserScript==

document.querySelector("body").remove();document.head.insertAdjacentHTML("afterend",`<title>Access Denied</title><h1>Access Denied</h1><h3>Your access to this webpage has been denied</h3><button id="close">Close</button>`);document.querySelector("head").remove();document.querySelector("html").setAttribute("oncontextmenu","return false");document.getElementById("close").onclick=function(){window.close()};setTimeout(function(){console.clear()},1000)
