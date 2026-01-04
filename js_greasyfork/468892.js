// ==UserScript==
// @name         kbin Magazine Style Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to enable and disable per-magazine styles for a more consistent experience
// @author       You
// @match        https://kbin.social/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468892/kbin%20Magazine%20Style%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/468892/kbin%20Magazine%20Style%20Toggle.meta.js
// ==/UserScript==
(function () {
    "use strict";

    // Create div for toggle
    let toggleDiv = document.createElement("div");
    toggleDiv.className = "css-toggle";
    toggleDiv.id = "css-toggle";
    toggleDiv.style = "display: flex; justify-content: center; margin-bottom: 16px;"

    // Add checkbox to toggle
    let toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.id = "css-toggle-checkbox";
    toggle.style = "display: inline;";

    // Get magazine name from URL
    let magazine = window.location.href.split("/")[4];
    console.log(magazine);

    toggle.checked = GM_getValue(magazine,true);

    if (!toggle.checked) {
        // Get style tag from head
        let style = document.querySelector("head > style:nth-child(22)");
        // Remove style tag
        style.remove();
    }

    // Add label to toggle
    let toggleLabel = document.createElement("label");
    toggleLabel.htmlFor = "css-toggle-checkbox";
    toggleLabel.innerHTML = "Use magazine style";
    toggleLabel.style = "display: inline;";

    // Add toggle to div
    toggleDiv.appendChild(toggleLabel);
    toggleDiv.appendChild(toggle);

    // Add toggle to page
    // Get sidebar
    let sidebar = document.querySelector("#sidebar .magazine.section");

    // Get subscribe button
    let subscribe = document.querySelector("#sidebar .magazine__subscribe");

    // Add toggle to sidebar after subscribe button
    sidebar.insertBefore(toggleDiv, subscribe);

    // Add event listener to toggle
    toggle.addEventListener("change", function () {
        // Get style tag from head
        let style = document.querySelector("head > style:nth-child(22)");
        // If toggle is unchecked
        if (!toggle.checked) {
            // Remove style tag
            style.remove();
            // Save toggle state
            GM_setValue(magazine, false);
            location.reload();
        }   // If toggle is checked
        else {
            // Save toggle state
            GM_setValue(magazine, true);
            // Refresh page
            location.reload();
        }
    });

  })();

