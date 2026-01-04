// ==UserScript==
// @name        Lovoo Auto Like with Stop Condition and Modern UI
// @namespace   Tempermonkey Scripts
// @match       https://**.lovoo.com/*
// @grant       none
// @version     1.1
// @author      Manu OVG
// @license MIT
// @description Automates "Like" clicks on Lovoo, shows a modern UI for each like, waits before clicking, and stops if "Likes are exhausted" message appears or profile is incomplete
// @downloadURL https://update.greasyfork.org/scripts/520346/Lovoo%20Auto%20Like%20with%20Stop%20Condition%20and%20Modern%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/520346/Lovoo%20Auto%20Like%20with%20Stop%20Condition%20and%20Modern%20UI.meta.js
// ==/UserScript==

// Function to simulate a "Like" click
async function autoLike() {
    // Check if the message "Tes « j’aime » sont épuisés" is displayed
    const noMoreLikesMessage = document.querySelector('.space-before.space-after.h3.u-text-center.u-padding-top-sm');
    if (noMoreLikesMessage && noMoreLikesMessage.textContent.includes('Tes « j’aime » sont épuisés')) {
        // Display a modern "No more likes" notification
        showNotification("No more likes available. Stopping...");
        console.log("No more likes available. Stopping script.");
        return; // Stop the script if the message is found
    }

    // Check if the profile photo upload message is present
    const photoRequiredMessage = document.querySelector('p');
    if (photoRequiredMessage && photoRequiredMessage.textContent.includes('Tu n\'obtiendras malheureusement rien sans photo de profil')) {
        // Display a modern "No profile photo" notification
        showNotification("You need to upload a profile photo to like users. Stopping...");
        console.log("Profile photo required. Stopping script.");
        return; // Stop the script if the message is found
    }

    // Check if the profile photo upload button is present (as a fallback)
    const photoUploadButton = document.querySelector('div.o-button.o-button--gender');
    if (photoUploadButton) {
        // Display a modern "No profile photo" notification
        showNotification("You need to upload a profile photo to like users. Stopping...");
        console.log("Profile photo required. Stopping script.");
        return; // Stop the script if the button is found
    }

    // Find all "Like" buttons
    const likeButtons = document.querySelectorAll('span[data-automation-id="vote-yes-button"]');

    // If there are "Like" buttons, click one
    if (likeButtons.length > 0) {
        // Get the first "Like" button (you can modify this if you want to target a specific user)
        const likeButton = likeButtons[0];

        // Show the "Liked" UI notification first
        showNotification("You've liked a user!");

        // Wait 1 second to display the notification
        setTimeout(() => {
            // Now simulate the click after the delay
            likeButton.click();
        }, 1000);  // Show the notification for 1 second before clicking the "Like" button
    }

    // Wait for 1 to 3 seconds to simulate a delay before clicking again
    const delay = Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds
    setTimeout(autoLike, delay);
}

// Function to show a modern UI notification
function showNotification(message) {
    // Create the notification element
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background-color: #4CAF50; color: white; padding: 15px 25px; border-radius: 10px; font-family: Arial, sans-serif; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); z-index: 9999;">
            <strong>${message}</strong>
        </div>
    `;

    // Append the notification to the body
    document.body.appendChild(notification);

    // Automatically remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Start the auto-like function after the page is loaded
window.addEventListener('load', () => {
    setTimeout(autoLike, 1000); // Start after a 1-second delay to ensure the page is fully loaded
});
