// ==UserScript==
// @name         Notification Navbar
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Have notifications as a nav link!
// @author       BigNibba
// @include      https://anilist.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378058/Notification%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/378058/Notification%20Navbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loggedIn = true;
    let navDiv = document.getElementsByClassName("links")[0]; // gets the navbar
    for(let i = 0; i <= navDiv.childNodes.length-1;i++){
        if(navDiv.childNodes[i].innerText == "Login"){loggedIn = false;} // sees if login is available meaning user is not logged in
    }
    if(loggedIn == true){ // if they are not logged in they won't be able to access notifications
        let notifLink = document.createElement("a");
        notifLink.href="/notifications";
        notifLink.style.padding = "13px";
        notifLink.innerText = "Notifications";
        notifLink.setAttribute("class","link");
        navDiv.insertBefore(notifLink,navDiv.childNodes[12]); // Inserts the notification link before the search bar and after 'Forum'
    }
})();