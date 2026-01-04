// ==UserScript==
// @name         Neopets quickref link
// @namespace    https://greasyfork.org/es/users/1143878-justdownloadin
// @version      1.0
// @description  Replaces the link on the "My Pets" button on the sidebar to take you to the pet quickref page isntead of the homepage
// @author       Zana
// @match        *://*.neopets.com/*
// @icon         https://icons.duckduckgo.com/ip2/neopets.com.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517351/Neopets%20quickref%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/517351/Neopets%20quickref%20link.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

$(document).ready(
    function replaceLink() { $('.profile-linkflex[href="/home/index.phtml"]').attr('href', "/quickref.phtml"); }
);