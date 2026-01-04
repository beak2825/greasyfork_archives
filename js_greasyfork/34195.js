// ==UserScript==
// @name         Count online buddies
// @version      1.2
// @description  Tool to measure your e-peen counting your buddies
// @author       A Meaty Alt
// @include      /sa=editBuddies/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/34195/Count%20online%20buddies.user.js
// @updateURL https://update.greasyfork.org/scripts/34195/Count%20online%20buddies.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var title = document.getElementsByClassName("titlebg")[0].firstElementChild;
    var evenRows = document.getElementsByClassName("windowbg"); //except last 2
    var oddRows = document.getElementsByClassName("windowbg2"); //except first 2

    var amountFriends = evenRows.length - 2 + oddRows.length - 2;

    title.innerHTML += "<div style='float:right'>Number of buddies: " + amountFriends+"</div>";


    var whereToSearch = document.getElementsByTagName("body")[0].innerHTML;
    var onlineUsers = (whereToSearch.match(/title=\"Personal Message \(Online\)/g) || []).length;

    title.innerHTML += "<div style='float:right; clear:both;'>Number of online buddies: " + onlineUsers+"</div>";
})();