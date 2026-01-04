// ==UserScript==
// @name        Free forever
// @namespace   Violentmonkey Scripts
// @match       https://www.genschat.com/*
// @grant       none
// @version     1.0
// @license MIT
// @author      -
// @description chat as many times you want it wont tell you to pay
// @downloadURL https://update.greasyfork.org/scripts/484302/Free%20forever.user.js
// @updateURL https://update.greasyfork.org/scripts/484302/Free%20forever.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof(Storage) !== "undefined") {
        // Get the current value of "aiChat" from local storage
        var aiChatValue = localStorage.getItem("aiChat");

        // Check if "aiChat" value exists
        if (aiChatValue !== null) {
            // Parse the "aiChat" value as JSON
            var aiChatObj = JSON.parse(aiChatValue);

            // Check if "dayConfig" array exists
            if (aiChatObj.hasOwnProperty("dayConfig")) {
                // Modify the "free" value in the "dayConfig" array
                aiChatObj.dayConfig.free = 1000;

                // Stringify the modified "aiChat" object
                var modifiedValue = JSON.stringify(aiChatObj);

                // Update the "aiChat" value in local storage
                localStorage.setItem("aiChat", modifiedValue);
                console.log("Successfully modified the local storage value.");
            } else {
                console.log("The 'dayConfig' array does not exist in 'aiChat' value.");
            }
        } else {
            console.log("The 'aiChat' value does not exist in local storage.");
        }
    } else {
        console.log("Local storage is not supported by the browser.");
    }
    function processElements() {
        // Rename elements with class "blur" to "f"
        const blurElements = document.querySelectorAll('.blur');
        blurElements.forEach(function(element) {
            element.classList.remove('blur');
            element.classList.add('f');
        });

        // Remove classes "lock", "van-icon", "van-icon-lock", "van-overlay", "van-popup", and "van-popup--center"
        const removeElements = document.querySelectorAll('.lock, .van-icon, .van-icon-lock, .van-overlay, .van-popup, .van-popup--center');
        const hideElements = document.querySelectorAll('.van-popup, .van-popup--center');
        hideElements.forEach(function(element) {
            element.style.display = 'none';
        });
        removeElements.forEach(function(element) {

            element.classList.remove('lock', 'van-icon', 'van-icon-lock');
        });

        // Call the function again after a delay
        setTimeout(processElements, 100);
    }

    // Start the element processing
    processElements();
})();