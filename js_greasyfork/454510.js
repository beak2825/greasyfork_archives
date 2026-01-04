// ==UserScript==
// @name         Notification Navbar
// @namespace    https://anilist.co
// @version      1.0
// @description  Have notifications as a nav link!
// @author       BigNibba / Korakys
// @include      https://anilist.co/*
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/454510/Notification%20Navbar.user.js
// @updateURL https://update.greasyfork.org/scripts/454510/Notification%20Navbar.meta.js
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
        notifLink.innerText = "Notifications";
        notifLink.setAttribute("class","link");
        navDiv.insertBefore(notifLink,navDiv.childNodes[0]); // Inserts the notification link before the search bar and after 'Forum'
    }
    if(loggedIn == true){ // if they are not logged in they won't be able to access notifications
        let notifLink = document.createElement("a");
        notifLink.href="/terms";
        notifLink.innerText = "Simple Feed";
        notifLink.setAttribute("class","link");
        navDiv.insertBefore(notifLink,navDiv.childNodes[1]); // Inserts the notification link before the search bar and after 'Forum'
    }
    if(loggedIn == true){ // if they are not logged in they won't be able to access notifications
        let notifLink = document.createElement("a");
        notifLink.href="/settings";
        notifLink.innerText = "Settings";
        notifLink.setAttribute("class","link");
        navDiv.insertBefore(notifLink,navDiv.childNodes[13]); // Inserts the notification link before the search bar and after 'Forum'
    }
})();