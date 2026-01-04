// ==UserScript==
// @name        SM_VM_PHOTO_BYPASS_FINAL
// @namespace   Violentmonkey Scripts
// @match       https://sma.sefapps.in/Citizen/MonitoringVehicle*
// @grant       none
// @version     v2.3
// @author      BRUTAL RAVNYX
// @icon         https://i.postimg.cc/vH03MKxm/RAVNYX-1024-X1024-removebg-preview-1.png
// @description Sma site photo bypassing script with popup removal, redirection, and random image name generation
// @downloadURL https://update.greasyfork.org/scripts/534705/SM_VM_PHOTO_BYPASS_FINAL.user.js
// @updateURL https://update.greasyfork.org/scripts/534705/SM_VM_PHOTO_BYPASS_FINAL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random file name
    function getRandomFileName() {
        return `image_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
    }

    // Use MutationObserver to detect when the file input is added to the page
    const observer = new MutationObserver(() => {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput && fileInput.hasAttribute('capture')) {
            // Remove the 'capture' attribute to disable the camera
            fileInput.removeAttribute('capture');
            console.log("Capture attribute removed!");

            // Simulate selecting a dummy file (bypassing the photo selection)
            const dummyFileName = getRandomFileName();
            const dummyFile = new File([""], dummyFileName, { type: "image/jpeg" });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(dummyFile);
            fileInput.files = dataTransfer.files;

            // Trigger change event to simulate file selection
            fileInput.dispatchEvent(new Event('change'));
            console.log(`Dummy file selected: ${dummyFileName}`);
        }
    });

    // Automatically dismiss or bypass alert popups
    window.alert = function(message) {
        console.log("Blocked alert with message:", message);
    };

    window.confirm = function(message) {
        console.log("Blocked confirm with message:", message);
        return true; // Automatically "clicks" OK
    };

    // Automatically handle the Save button logic
    document.addEventListener('click', (event) => {
        if (event.target && event.target.matches('button#save')) { // Replace 'button#save' with the actual Save button selector
            console.log("Save button clicked!");

            // Simulate redirection after save
            setTimeout(() => {
                console.log("Redirecting to the next form...");
                window.location.reload(); // Reload the page or redirect to a specific URL
            }, 1000); // Delay to allow the Save action to complete
        }
    });

    // Start observing for changes in the document body
    observer.observe(document.body, { childList: true, subtree: true });

})();