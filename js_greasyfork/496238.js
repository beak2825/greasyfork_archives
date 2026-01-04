// ==UserScript==
// @name         Font Toggle Menu { press esc }
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Toggle font menu with the ESC key
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496238/Font%20Toggle%20Menu%20%7B%20press%20esc%20%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/496238/Font%20Toggle%20Menu%20%7B%20press%20esc%20%7D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the list of fonts to cycle through
    var fonts = [
        "Arial",
        "Helvetica",
        "Times New Roman",
        "Georgia",
        "Courier New",
        "Verdana",
        "Geneva",
        "Trebuchet MS",
        "Arial Black",
        "Impact",
        "Comic Sans MS"
    ];

    // Create the font menu
    var fontMenu = document.createElement("div");
    fontMenu.style.position = "fixed";
    fontMenu.style.top = "10px";
    fontMenu.style.right = "10px";
    fontMenu.style.padding = "10px";
    fontMenu.style.backgroundColor = "#fff";
    fontMenu.style.border = "1px solid #ccc";
    fontMenu.style.zIndex = "9999";
    fontMenu.style.display = "none";

    fonts.forEach(function(font) {
        var fontButton = document.createElement("button");
        fontButton.textContent = font;
        fontButton.style.fontFamily = font;
        fontButton.style.marginRight = "5px";
        fontButton.addEventListener("click", function() {
            document.body.style.fontFamily = this.style.fontFamily;
        });
        fontMenu.appendChild(fontButton);
    });

    document.body.appendChild(fontMenu);

    // Toggle font menu visibility on ESC key press
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            if (fontMenu.style.display === "none" || fontMenu.style.display === "") {
                fontMenu.style.display = "block";
            } else {
                fontMenu.style.display = "none";
            }
        }
    });
})();
