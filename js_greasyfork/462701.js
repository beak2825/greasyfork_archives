// ==UserScript==
// @name         Google Image Search Button
// @namespace    https://www.google.com/
// @version      1
// @description  Adds a button for Google Image Search on the Google start page.
// @author       AlifTheLegend
// @match        https://www.google.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462701/Google%20Image%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/462701/Google%20Image%20Search%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button element
    var button = document.createElement("button");
    button.innerHTML = "Google Images";
    button.style.backgroundColor = "#4285f4";
    button.style.color = "white";
    button.style.border = "none";
    button.style.margin = "0 10px";
    button.style.padding = "10px 20px";
    button.style.borderRadius = "4px";

    // Add an event listener to the button
    button.addEventListener ("click", function() {
        // Redirect to Google Images
        window.location.href = "https://www.google.com/search?tbm=isch";
    });

    // Add the button to the page
    var div = document.createElement("div");
    div.style.textAlign = "center";
    div.appendChild(button);

    var searchform = document.querySelector("#tsf");
    searchform.appendChild(div);
})();
