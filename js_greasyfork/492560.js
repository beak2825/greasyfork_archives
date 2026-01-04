// ==UserScript==
// @name        Wallhaven - Fix Inaccessible Subscription Page
// @namespace   NooScripts
// @match       https://wallhaven.cc/*
// @grant       none
// @version     1.0
// @author      NooScripts
// @description If you're encountering HTML Error Code 500 or a blank page on your Wallhaven "Subscriptions" page, this script adds a button to the top of the user menu to clear all subscription notifications, potentially resolving the issue.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492560/Wallhaven%20-%20Fix%20Inaccessible%20Subscription%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/492560/Wallhaven%20-%20Fix%20Inaccessible%20Subscription%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a "Clear Subscriptions" link with YOUR unique CSRF token and open it
    function createLinkWithToken() {
        // Get the contents of "csrf-token"
        var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

        // Construct the URL with YOUR unique token
        var url = "https://wallhaven.cc/subscription/tag/clear?_token=" + csrfToken;

        // Open contructed URL in the current tab
    window.location.href = url;
    }

    // Locate where the button will be placed
    var dropdownContent = document.querySelector('[class="dropdown-header"]');

    // Create a button element
    var button = document.createElement('button');
    button.innerHTML = "Clear Subscription Notifications";
    button.onclick = createLinkWithToken;

    // Button Style
    button.style.background = "#303030";
    button.style.color = "#85f3fc";
    button.style.border = "#85f3fc 1px solid";
    button.style.cursor = "pointer";
    button.style.width = "auto"; // Set width to auto

    // Buttons hover effect
    button.addEventListener("mouseover", function() {
        button.style.background = "#85f3fc";
        button.style.color = "#303030";
    });

    button.addEventListener("mouseout", function() {
        button.style.background = "#303030";
        button.style.color = "#85f3fc";
    });

    // Append the button to the bottom of the selected placement
    dropdownContent.appendChild(button);
})();