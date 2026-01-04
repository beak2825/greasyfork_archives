// ==UserScript==
// @name         ChatGPT Preset Text Button
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a button on chatgpt.com to insert preset text into the input area
// @author       
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/518528/ChatGPT%20Preset%20Text%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/518528/ChatGPT%20Preset%20Text%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    var btn = document.createElement("button");
    btn.innerHTML = "Insert Preset Text";
    // Preset text content
    var presetText = "This is the preset text.";

    // Set button styles
    btn.style.position = "fixed";
    btn.style.top = "50%";
    btn.style.right = "0px";
    btn.style.transform = "translateY(-50%)";
    btn.style.padding = "10px 15px";
    btn.style.backgroundColor = "#FFFFFF"; // White background
    btn.style.color = "#000000"; // Black text
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "normal";
    btn.style.border = "1px solid #000000";
    btn.style.borderRadius = "5px 0 0 5px";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "9999";
    btn.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";

    // Add the button to the page
    document.body.appendChild(btn);

    // Button click event
    btn.addEventListener("click", function() {
        // Get the input area element
        var inputDiv = document.getElementById("prompt-textarea");
        if (inputDiv && inputDiv.contentEditable === "true") {
            // Insert the preset text into the input area
            inputDiv.innerHTML = '<p>' + presetText + '</p>';

            // Move the cursor to the end of the text
            var range = document.createRange();
            var sel = window.getSelection();
            range.selectNodeContents(inputDiv);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);

            // Trigger input event to notify any listeners of the change
            var event = new Event('input', { bubbles: true });
            inputDiv.dispatchEvent(event);
        } else {
            alert("Input area not found!");
        }
    });
})();
