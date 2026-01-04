// ==UserScript==
// @name         Arceus X Bypass
// @namespace    Rain
// @version      Yes1.7.3
// @description Made By x
// @author       Rain
// @match        https://loot-link.com/s?*
// @match        https://loot-links.com/s?*
// @match        https://lootlink.org/s?*
// @match        https://lootlinks.co/s?*
// @match        https://lootdest.info/s?*
// @match        https://lootdest.org/s?*
// @match        https://lootdest.com/s?*
// @match        https://links-loot.com/s?*
// @match        https://linksloot.net/s?*
// @match        https://spdmteam.com/key-system*
// @grant        none
// @license Rain
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/491045/Arceus%20X%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/491045/Arceus%20X%20Bypass.meta.js
// ==/UserScript==

if (document.title == 'Just a moment...') {
    return;
}

var Current_URL = window.location.href;
var Page_Title = document.title;

if (Current_URL.includes("https://spdmteam.com/key-system-1?hwid=")) {
  window.location.href = "https://spdmteam.com/api/keysystem"
}

if (Page_Title.includes("NEO") && Page_Title.includes("1")) {
  window.location.href = "https://spdmteam.com/api/keysystem?step=1&advertiser=linkvertise&OS=ios";
}

if (Current_URL.includes("https://spdmteam.com/key-system-2?hwid=")) {
  window.location.href = "https://loot-link.com/s?mYit";
}

if (Page_Title.includes("NEO") && Page_Title.includes("2")) {
  window.location.href = "https://spdmteam.com/api/keysystem?step=2&advertiser=linkvertise&OS=ios";
}

if (Current_URL.includes("https://spdmteam.com/key-system-3?hwid=")) {
  window.location.href = "https://loot-link.com/s?qlbU";
}

if (Page_Title.includes("NEO") && Page_Title.includes("3")) {
  window.location.href = "https://spdmteam.com/api/keysystem?step=3&advertiser=linkvertise&OS=ios";
}