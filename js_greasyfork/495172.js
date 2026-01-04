// ==UserScript==
// @name         Admin
// @namespace    com.Ethan.Admin
// @author       Ethan
// @version      0.0.2
// @description  Admin / Tester tools
// @match        file:///C:/Users/tk_50_1n3h7y0/OneDrive/OLD/Desktop/Codeing/Urben/Urben/index.html
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495172/Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/495172/Admin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    var button = document.createElement("button");
    button.innerHTML = "Click Me!";
    button.style = "top: 0; right: 0; position: absolute; z-index: 99999; padding: 20px;";

    // Find the target <div> (replace with your actual selector)
    var targetDiv = document.querySelector("panel-settings");

    if (targetDiv) {
        targetDiv.appendChild(button);
    } else {
        console.error("Target <div> not found. Make sure your selector is correct.");
    }
})();
