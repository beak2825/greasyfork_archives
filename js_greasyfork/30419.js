// ==UserScript==
// @name         Fimfiction - Group Button Shows Recent Threads
// @namespace    arcum42
// @version      0.2
// @description  Changes the Group button to default to the Recent Threads page.
// @author       arcum42
// @match        https://www.fimfiction.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30419/Fimfiction%20-%20Group%20Button%20Shows%20Recent%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/30419/Fimfiction%20-%20Group%20Button%20Shows%20Recent%20Threads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Text plus group icon
    var allGroupsText = `<i class="fa fa-group"></i>All Groups`;

    // Grab the first match for all of the following buttons with css.
    var mainGroup = document.querySelector(".user_toolbar a[href='/groups']");
    var groupThreads = document.querySelector(".user_toolbar a[href='/groups/threads']");
    var groupDiv = document.querySelector(".user_toolbar li.divider");

    // Swap the urls for the buttons in question.
    mainGroup.href = "/groups/threads";
    groupThreads.href = "/groups";

    // Remove the divider to make it look nicer, and rename "Recent Threads" to "All Groups" with an appropriate icon.
    groupDiv.remove();
    groupThreads.innerHTML = allGroupsText;

})();