// ==UserScript==
// @name         GitHub Issues Editor Full Screen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a full screen button in the right-top of the github issue editor.
// @match        https://github.com/*/issues/*
// @grant        none
// @author       m2kar （m2kar.cn#gmail.com）
// @origin-url   https://gist.github.com/m2kar/a9beddbd946dada991e87ed366b9b24e
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467156/GitHub%20Issues%20Editor%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/467156/GitHub%20Issues%20Editor%20Full%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // Create a button element
    var button = document.createElement("a");
    // Set the button text
    button.textContent = "";
    // Set the button id
    button.id = "toggle-div-style-button";
    // Set the button style
    button.style.marginLeft = "10px";


    var span = document.createElement("span");
    // Set the span text
    span.textContent = "\u2922"; // Unicode character for full-screen symbol
    // Set the span style
    span.style.fontSize = "16px";
    span.style.lineHeight = "18px";
    span.style.textAlign = "center";
    // Append the span to the button
    button.appendChild(span);

    // Get the element with id="slash-issue_body"
    var slash = document.getElementById("slash-issue_body");
    // Insert the button after the slash element
    slash.parentNode.insertBefore(button, slash.nextSibling);

    // Add a click event listener to the button
    button.addEventListener("click", function() {
        // Get all div elements with the specified class name
        var divs = document.getElementsByClassName("timeline-comment color-bg-default hx_comment-box--tip");
        // Loop through the divs and toggle their style attribute
        for (var i = 0; i < divs.length; i++) {
            // If the div has the original style, change it to the new style
            if (divs[i].getAttribute("style") === null || divs[i].getAttribute("style") === "") {
                divs[i].setAttribute("style", "position: fixed; height: 100%; width: 100%; left: 0px; top: 0px; z-index: 999;");
            }
            // If the div has the new style, change it to the original style
            else {
                divs[i].setAttribute("style", "");
            }
        }
    });
})();
