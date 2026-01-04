// ==UserScript==
// @name         Lemmy Toolbox
// @version      1.04
// @description  A Set of utilities to make Lemmy more usable
// @author       admin@sarcasticdeveloper.com
// @match        https://*/*
// @namespace    https://sarcasticdeveloper.com
// @icon         https://join-lemmy.org/static/assets/icons/favicon.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468768/Lemmy%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/468768/Lemmy%20Toolbox.meta.js
// ==/UserScript==

var isLemmy = document.head.querySelector("[name~=Description][content]").content === "Lemmy";

if (isLemmy) {
    NodeList.prototype.forEach = NodeList.prototype.forEach || Array.prototype.forEach;

    // Set every noopener nofollow link to open in a new window
    document.querySelectorAll('[rel="noopener nofollow"]').forEach(x=> x.setAttribute("target","_blank"));
}


