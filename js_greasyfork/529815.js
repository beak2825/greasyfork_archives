// ==UserScript==
// @name        CivFanatics: CivMods Download Button
// @namespace   http://tampermonkey.net/
// @version     1.2
// @description Adds a second download button to install via the CivMods mod manager (via a civmods:// URL)
// @author      @Chr1Z
// @match       https://forums.civfanatics.com/resources/*
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/529815/CivFanatics%3A%20CivMods%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/529815/CivFanatics%3A%20CivMods%20Download%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Find the original download button
    const originalButton = document.querySelector("a.button--icon--download");
    if (!originalButton) return; // Exit if no button is found

    // Get the original download URL
    const originalUrl = originalButton.href;
    if (!originalUrl) return; // Exit if no URL is found

    // Extract the mod ID from the original download URL
    const match = originalUrl.match(/(\d+)\/download$/);
    if (!match) return; // Exit if no mod ID is found

    const modId = match[1]; // The captured numerical ID

     const pageAction = document.querySelector("div.p-title-pageAction");
    if (pageAction) {
        pageAction.style.display = "flex";
    }

    // Create a copy of the original button
    const newButton = originalButton.cloneNode(true);
    newButton.style.marginLeft = "8px";
    newButton.style.background = "linear-gradient(90deg, #446479, #1a465f)";
    newButton.href = "civmods://install?modCfId=" + encodeURIComponent(modId);

    // Add the CivMods icon to it
    const icon = newButton.querySelector("i");
    icon.insertAdjacentHTML('afterend', '<img src="https://civmods.com/static/logo.png" width="32" height="32" style="margin-right: 4px;" />');
    icon.remove();
    newButton.querySelector(".button-text").innerHTML = "Install with <b>CivMods</b>";
    newButton.title = "Requires CivMods mod manager";

    // Insert the new button next to the original
    originalButton.insertAdjacentElement("afterend", newButton);
})();