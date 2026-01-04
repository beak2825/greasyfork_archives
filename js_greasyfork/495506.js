// ==UserScript==
// @name         Scroll to top button
// @version      0.3
// @description  Adds a button to scroll to the top of the page
// @autor        Bins
// @license      MIT
// @match        *://*/*
// @grant        none
// @namespace    https://greasyfork.org/users/757542
// @downloadURL https://update.greasyfork.org/scripts/495506/Scroll%20to%20top%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/495506/Scroll%20to%20top%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ensure the script runs only in the topmost window
    if (window.top !== window.self) {
        return;
    }

    function createScrollButton() {
        // Create the button
        var button = document.createElement("button");
        button.innerHTML = "&#x2B06;"; // Unicode for up arrow
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.zIndex = "9999";
        button.style.fontSize = "24px";
        button.style.width = "50px";
        button.style.height = "50px";
        button.style.backgroundColor = "#4CAF50";
        button.style.border = "none";
        button.style.color = "white";
        button.style.textAlign = "center";
        button.style.textDecoration = "none";
        button.style.borderRadius = "50%";
        button.style.boxShadow = "0 2px 5px 0 rgba(0,0,0,0.26),0 2px 10px 0 rgba(0,0,0,0.16)";
        button.style.transition = "background-color 0.3s, opacity 0.3s";
        button.style.opacity = "0"; // Initially hidden
        button.style.pointerEvents = "none"; // Prevent interaction when hidden

        // Add ARIA attributes for accessibility
        button.setAttribute("aria-label", "Scroll to top");

        // Change color on hover
        button.onmouseover = function() {
            button.style.backgroundColor = "#45a049";
        }
        button.onmouseout = function() {
            button.style.backgroundColor = "#4CAF50";
        }

        // Add the button to the body of the document
        document.body.appendChild(button);

        // Show the button when scrolled down 100px
        window.addEventListener('scroll', function() {
            if (document.documentElement.scrollTop > 100) {
                button.style.opacity = "1";
                button.style.pointerEvents = "auto";
            } else {
                button.style.opacity = "0";
                button.style.pointerEvents = "none";
            }
        });

        // When the button is clicked, scroll to the top of the page
        button.addEventListener("click", function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    // Ensure the DOM is fully loaded before creating the button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createScrollButton);
    } else {
        createScrollButton();
    }
})();
