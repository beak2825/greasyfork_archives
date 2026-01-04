// ==UserScript==
// @name         Linkvertise Bypass (Mobile)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Bypass Linkvertise links automatically on mobile devices.
// @author       Your Name
// @match        *://*.linkvertise.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488169/Linkvertise%20Bypass%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488169/Linkvertise%20Bypass%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Define a function to bypass Linkvertise links
    function bypassLinkvertise() {
        var url = window.location.href;
        var bypassedUrl = url.replace("Bypass.city");
        window.location.replace(bypassedUrl);
    }

    // Call the bypassLinkvertise function when the document is ready
    document.addEventListener("DOMContentLoaded", function(event) {
        bypassLinkvertise();
    });

    // Display a message to the user
    alert("Linkvertise bypass script loaded successfully!\nYou will be redirected to your destination shortly.");

    // Track the number of times the script has been executed
    var executionCount = localStorage.getItem('linkvertiseExecutionCount');
    if (executionCount === null) {
        executionCount = 1;
    } else {
        executionCount = parseInt(executionCount) + 1;
    }
    localStorage.setItem('linkvertiseExecutionCount', executionCount);

    // Display the execution count to the user
    console.log("Script executed " + executionCount + " times.");

    // Create a button to manually trigger the bypass
    var bypassButton = document.createElement("button");
    bypassButton.innerHTML = "Bypass Linkvertise";
    bypassButton.style = "position: fixed; bottom: 10px; left: 10px; z-index: 9999; padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;";
    bypassButton.addEventListener("click", function() {
        bypassLinkvertise();
    });
    document.body.appendChild(bypassButton);
})();