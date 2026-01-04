// ==UserScript==
// @name         DLSite GAME TIELE Copy
// @namespace    https://twitter.com/Tescostum/
// @version      0.3
// @description  Copy game title
// @author       KBT
// @match        https://www.dlsite.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442463/DLSite%20GAME%20TIELE%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/442463/DLSite%20GAME%20TIELE%20Copy.meta.js
// ==/UserScript==
(function() {
    var listItem = document.querySelector(".topicpath > .topicpath_item:last-child");
    if(listItem) {
        listItem.style.userSelect = "text";
    }
    var titleItem = document.querySelector("#work_name");
    if(titleItem) {
        titleItem.style.userSelect = "text";
    }
})();