// ==UserScript==
// @name         Simple IMVU Product Scene Unhide Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to unhide avatars on IMVU product scene URLs.
// @author       heapsofjoy
// @match        *://*.imvu.com/catalog/products_in_scene.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511665/Simple%20IMVU%20Product%20Scene%20Unhide%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/511665/Simple%20IMVU%20Product%20Scene%20Unhide%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the page title contains "Products in Scene"
    if (window.location.pathname.includes("products_in_scene.php")) {

        // Create the button element
        let button = document.createElement('button');

        // Style the button
        button.innerText = "Unhide pls :3";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.width = "100px"; // Set a width suitable for text
        button.style.height = "25px"; // Adjust height
        button.style.borderRadius = "20px"; // Rounded rectangle shape
        button.style.backgroundColor = "#151617"; // Button color
        button.style.color = "#ffffff"; // White text for contrast
        button.style.border = "none";
        button.style.fontWeight = "bold";
        button.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)";
        button.style.cursor = "pointer";
        button.style.zIndex = "1000";
        button.style.fontSize = "12px"; // Adjust font size for better fit
        button.style.transition = "background-color 0.3s, transform 0.2s"; // Transition for hover effects

        // Center the text inside the button
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";

        // Add hover effect
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = "#979797"; // Change color on hover
            button.style.transform = "scale(1.05)"; // Slightly grow on hover
        });

        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = "#151617"; // Revert color on mouse out
            button.style.transform = "scale(1)"; // Revert to original size
        });

        // Append the button to the body
        document.body.appendChild(button);

        // Variable to track the state of the button clicks
        let clickState = 0;

        // Add click event to execute the unhide action
        button.addEventListener('click', function() {
            clickState++; // Increment click state with each click

            if (clickState === 5) {
                // Change button text to final message
                button.innerText = "OKAY!!! GOODBYE, LOSER!!! I TOLD YOU NOT TO MAKE ME ANGRY, AND YOU JUST HAD TO PUSH MY BUTTONS, DIDN'T YOU? NOW I’M LEAVING AND I’M NOT COMING BACK! I CAN’T BELIEVE YOU WOULD ACT LIKE THIS! (UNLESS, OF COURSE, YOU REFRESH, LOL, BUT STILL, YOU HAVE TO STOP POKING ME!! IT'S JUST SO ANNOYING! WHY CAN'T YOU UNDERSTAND THAT I'M NOT IN THE MOOD FOR THIS DRAMA? IT’S LIKE YOU DON'T EVEN CARE ABOUT MY FEELINGS! I’M SO FRUSTRATED RIGHT NOW! YOU KNOW HOW I FEEL ABOUT THIS, YET YOU CONTINUE TO TEST MY PATIENCE! UGH! IT'S LIKE YOU WANT ME TO BE MISERABLE! I CAN'T TAKE IT ANYMORE! THIS IS SO SAD, AND YOU KNOW IT! GOODBYE, AND DON'T EVEN THINK ABOUT TRYING TO REACH OUT! I JUST CAN'T WITH YOU RIGHT NOW! I HOPE YOU THINK ABOUT WHAT YOU'VE DONE!)";
                button.style.width = "200px"; // Increase height when text changes
                button.style.height = "475px"; //Set a width suitable for text
                button.style.cursor = "not-allowed"; // Change cursor to indicate inactivity
                button.disabled = true; // Disable the button
                setTimeout(() => {
                    button.style.display = 'none'; // Hide the button after a short delay
                }, 12000); // Delay before disappearing
                return; // Exit after this point
            }

            if (clickState === 4) {
                // Change button text and increase height
                button.innerText = "GRRRR";
                button.style.height = "30px"; // Increase height when text changes again
                return; // Exit after this point
            }

            if (clickState === 3) {
                // Change button text and increase height
                button.innerText = "REALLY STOP BEFORE I GET ANGY";
                button.style.height = "60px"; // Increase height when text changes
                return; // Exit after this point
            }

            if (clickState === 2) {
                // Change button text and increase height
                button.innerText = "Stop clicking me dummy >:( I already unhid them";
                button.style.height = "70px"; // Increase height when text changes
                return; // Exit if already unhidden
            }

            // Assuming avatars have a class 'avatar-hidden' that hides them
            let hiddenAvatars = document.querySelectorAll('.avatar-hidden');

            // Unhide each avatar
            hiddenAvatars.forEach(function(avatar) {
                avatar.style.display = 'block';   // Ensure it's displayed
                avatar.style.visibility = 'visible'; // Ensure visibility
                console.log("Avatar unhid: ", avatar); // Log unhidden avatar
            });

            // Handle URL modification
            let url = window.location.href;
            let avatarPattern = /avatar\d+=/g;
            let count = 1;
            url = url.replace(avatarPattern, function() {
                return 'avatar' + (count++) + '=';
            });

            // If the URL was modified, navigate to the new URL
            if (url !== window.location.href) {
                window.location.href = url;
            }

            // Mark avatars as unhidden
            clickState = 1; // Set state to 1 to reflect that avatars were unhidden
        });
    }
})();
