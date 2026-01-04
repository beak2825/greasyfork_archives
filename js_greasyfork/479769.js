// ==UserScript==
// @license MIT
// @name         Reddit Dropdown Menu
// @namespace    http://tampermonkey.net/
// @version      0.2.5-Beta
// @description  Adds a dropdown menu with links to r/all and r/popular
// @author       Daniel Vasquez
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479769/Reddit%20Dropdown%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/479769/Reddit%20Dropdown%20Menu.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create dropdown menu container
    let dropdown = document.createElement("div");
    dropdown.textContent = "RMenu"; // Text for the dropdown button
    dropdown.style.position = "fixed";
    dropdown.style.top = "6px";
    dropdown.style.right = "5px";
    dropdown.style.zIndex = "1000";
    dropdown.style.padding = "10px 20px";
    dropdown.style.backgroundColor = "#FF4500";
    dropdown.style.border = "none";
    dropdown.style.color = "white";
    dropdown.style.borderRadius = "5px";
    dropdown.style.cursor = "pointer";
    dropdown.style.textAlign = "center";

    // Style for the dropdown content
    let dropdownContentStyle = "display: none; position: fixed; right: 10px; top: 46px; background-color: #f9f9f9; min-width: 160px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1001; border-radius: 5px;";

    // Create dropdown content
    let dropdownContent = document.createElement("div");
    dropdownContent.style = dropdownContentStyle;

    // Timeout variable to manage the hover state
    let hoverTimeout;

    // Create menu items
    function createMenuItem(text, href) {
        let item = document.createElement("a");
        item.textContent = text;
        item.href = href;
        item.style.color = "black";
        item.style.padding = "12px 16px";
        item.style.textDecoration = "none";
        item.style.display = "block";
        item.onmouseover = function() { this.style.backgroundColor = "#f1f1f1"; };
        item.onmouseout = function() { this.style.backgroundColor = "#f9f9f9"; };
        return item;
    }

    // Append items to dropdown content
    dropdownContent.appendChild(createMenuItem("Go to r/all", "https://www.reddit.com/r/all/"));
    dropdownContent.appendChild(createMenuItem("Go to r/popular", "https://www.reddit.com/r/popular/"));

    // Show dropdown content on hover and reset the timeout
    dropdown.onmouseover = function() {
        clearTimeout(hoverTimeout);
        dropdownContent.style.display = "block";
    };

    // Hide dropdown content after a delay
    dropdown.onmouseout = function() {
        hoverTimeout = setTimeout(function() {
            dropdownContent.style.display = "none";
        }, 500); // 500 milliseconds delay
    };

    // Append dropdown content to dropdown
    dropdown.appendChild(dropdownContent);

    // Append dropdown to the body
    document.body.appendChild(dropdown);

    // Move the profile button to avoid overlap
    let profileButton = document.querySelector("#USER_DROPDOWN_ID"); // Replace with the actual ID or class of the Reddit profile button
    if (profileButton) {
        profileButton.style.right = "1px"; // Adjust as needed to move the profile button
    }
})();