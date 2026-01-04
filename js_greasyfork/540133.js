// ==UserScript==
// @name        Efficient Scroll to Top
// @namespace   Essential Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      solarcosmic
// @license     MIT
// @description Lets you scroll to the top of a page by the click of a button without it being intrusive.
// @downloadURL https://update.greasyfork.org/scripts/540133/Efficient%20Scroll%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/540133/Efficient%20Scroll%20to%20Top.meta.js
// ==/UserScript==

/*
 * Efficient Scroll to Top
 * Lets you scroll to the top of a page by the click of a button without it being intrusive.
 *
 * How to use:
 *   1. Visit any page on the internet.
 *   2. Start reading the page - a black button should appear at the top right with an up arrow.
 *   3. You can click it to scroll back up to the top, or right click it to remove it for the duration that you're visiting that page.
 * Simple!
*/

// Create button to be used throughout the whole script
const button = createButton();

function createButton() {
    // Create button and apply a ton of styles
    const button = document.createElement("button");
    button.style = `
      display: none;
      position: fixed;
      top: 50px;
      right: 50px;
      z-index: 999;
      padding: 15px;
      font-size: 20px;
      opacity: 0;
      cursor: pointer;
      background-color: #000000;
      border-radius: 8px;
      border-style: none;
    `;
    // Up arrow which is shown on the button
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24" height="24" fill="#ffffff">
        <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/>
      </svg>
    `;
    document.body.appendChild(button); // Add the button to the body of the HTML
    return button;
}

/*
 * Determines when to show the button and what opacity should be set when/where.
*/
function doScrollAction() {
    if (!button) return;
    // Only start showing the button once scrolled past a specific point
    if (window.scrollY > 500) {
        button.style.display = "block"; // Show button
    } else {
        button.style.display = "none"; // Hide button
    }
    // Get the max scroll distance, then divide the current scroll distance by it
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScrollY > 0) button.style.opacity = window.scrollY / maxScrollY; // e.g. 0.72 for 72%
}

/*
 * I think you may know what this does.
 * This is the "scroll to top" behavior.
*/
button.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Extra effect
    });
});

/*
 * This hides the button on right click until the user leaves or refreshes the page.
 * This uses the "contextmenu" event, which works good!
*/
button.addEventListener("contextmenu", (event) => {
  event.preventDefault(); // Prevent the context menu from showing up
  button.remove(); // Removes the button, surprisingly no errors!
})

/*
 * Mouse enter & leave effects.
 * Mostly just for styles.
*/
button.addEventListener("mouseenter", () => {
    button.style.opacity = 1; // Make the button fully visible on hover
    button.style.transform = 'scale(1.1)'; // Expand the button for extra effect
})

button.addEventListener("mouseleave", () => {
    button.style.opacity = 0.5; // Return the opacity back to its initial state
    button.style.transform = 'initial'; // De-expand the button to its initial state
})

// Connect scroll event to visibility control function
window.addEventListener("scroll", doScrollAction, false);