// ==UserScript==
// @name         Bypass Steam Age Check
// @namespace    http://store.steampowered.com/
// @version      1.0
// @license      GPLv3
// @description  Instantly bypass the Steam store age verification
// @author       xdpirate
// @match        https://store.steampowered.com/agecheck/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442378/Bypass%20Steam%20Age%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/442378/Bypass%20Steam%20Age%20Check.meta.js
// ==/UserScript==
document.getElementById("ageYear").value = "1984";
document.getElementById("view_product_page_btn").click();
