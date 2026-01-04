// ==UserScript==
// @name          StackOverflow Always Dark Theme
// @description   Enables Dark Theme Forever.
// @author        nullgemm
// @version       0.1.1
// @grant         none
// @match         *://stackoverflow.com/*
// @run-at        document-end
// @icon          https://stackoverflow.com/favicon.ico
// @namespace     https://greasyfork.org/en/users/322108-nullgemm
// @downloadURL https://update.greasyfork.org/scripts/400254/StackOverflow%20Always%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/400254/StackOverflow%20Always%20Dark%20Theme.meta.js
// ==/UserScript==

document.getElementsByTagName("body")[0].classList.add("theme-dark");
document.getElementsByClassName("theme-selector")[0].style.display = "none";