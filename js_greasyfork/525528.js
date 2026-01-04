// ==UserScript==
// @name        New script duolingo.com
// @namespace   Violentmonkey Scripts
// @match       https://www.duolingo.com/learn*
// @grant       none
// @version     1.0
// @author      -
// @description 2/1/2025, 6:00:23 PM
// @downloadURL https://update.greasyfork.org/scripts/525528/New%20script%20duolingocom.user.js
// @updateURL https://update.greasyfork.org/scripts/525528/New%20script%20duolingocom.meta.js
// ==/UserScript==
(function() {
    // Create a container div
    let container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.background = "white";
    container.style.padding = "10px";
    container.style.border = "2px solid black";
    container.style.zIndex = "9999";
    container.style.borderRadius = "10px";

    // Function to create buttons
    function createButton(amount) {
        let button = document.createElement("button");
        button.innerText = amount + " XP";
        button.style.margin = "5px";
        button.style.padding = "10px";
        button.style.cursor = "pointer";
        button.style.fontSize = "16px";
        button.onclick = function() {
            alert("Added " + amount + " XP! (Simulation)");
            // In reality, Duolingo does not allow direct XP modification.
        };
        container.appendChild(button);
    }

    // Create buttons for XP options
    createButton(1000);
    createButton(10000);
    createButton(100000);

    // Add container to the page
    document.body.appendChild(container);
})();