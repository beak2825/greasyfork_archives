// ==UserScript==
// @name         "Avatar Shop" to "Catalog"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple thing that replaces "avatar shop" with "Catalog" because its annoying
// @author       Petajoega
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453999/%22Avatar%20Shop%22%20to%20%22Catalog%22.user.js
// @updateURL https://update.greasyfork.org/scripts/453999/%22Avatar%20Shop%22%20to%20%22Catalog%22.meta.js
// ==/UserScript==

function start() {
    var cata = document.getElementById("font-header-2 nav-menu-title text-header");
    cata.innerHTML = "Catalog";
      setTimeout(start, 0);
}
start();