// ==UserScript==
// @name         Pluspora Unread Notifications
// @namespace    http://aperturized.com
// @version      0.2.2
// @description  Opens the notification page with unread messages only. Optionally modifies the link on the bell icon to open the notifications page directly.
// @author       carsten.schlipf(at)aperturized.com
// @match        https://pluspora.com/*
// @match        https://*.pluspora.com/**
// @match        https://joindiaspora.org/*
// @match        https://*.joindiaspora.org/**
// @match        https://deko.cloud/**
// @match        https://despora.de/*
// @match        https://*.despora.de/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373282/Pluspora%20Unread%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/373282/Pluspora%20Unread%20Notifications.meta.js
// ==/UserScript==

// Set to false to disable login on the browser console.
const LOG_ENABLED=true;

// Set to true to always open the notifications in a new page instead of a popup.
const ALWAYS_NEW_PAGE=false;


function logMsg(message) {
    if (! LOG_ENABLED)
    {
        return;
    }
    console.log ("[pluspora.notification_page] " + message);
}

(function() {
    'use strict';
    logMsg ("Running Pluspora Notification Page Tampermonkey script.");

    var notificationsLink = document.getElementById("notifications-link");
    if (! notificationsLink ) {
        logMsg("Element notifications-link not found. Exiting.");
        return;
    }

    // Modify URL to open unread elements only
    notificationsLink.setAttribute("href", notificationsLink.getAttribute("href") + "?show=unread");
    logMsg("Modified link to open unread messages only.");

    // Modify View all
    var viewAllElements = document.getElementsByClassName("view_all");
    if (viewAllElements.length == 0 ) {
        logMsg("No elements with the class view_all found.")
    }
    for (var i = 0; i < viewAllElements.length; i++) {
        var viewAllElement = viewAllElements[i];
        var linkElement = viewAllElement.getElementsByTagName('a')[0];
        linkElement.setAttribute("href", linkElement.getAttribute("href") + "?show=unread");
        linkElement.textContent = "View all unread";
    }

    // Modify link to open page directly
    if (ALWAYS_NEW_PAGE) {
        notificationsLink.setAttribute("id", "notifications-link-modified");
        notificationsLink.removeAttribute("data-toggle");
        logMsg("Modified link to open notification page instead.");
    }
})();