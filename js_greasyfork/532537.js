// ==UserScript==
// @name         GitHub Scroll To Top
// @namespace    http://tampermonkey.net/
// @version      2025-04-11
// @description  Adds a scroll to top button to github
// @author       Charles Pritchard
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532537/GitHub%20Scroll%20To%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/532537/GitHub%20Scroll%20To%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetElementSelector = ".application-main";
    const buttonClassName = "simple-scroll-top-button";
    const scrollThreshold = 200; // Pixels to scroll before showing button

    let scrollButton = null; // Keep a reference to the button

    // Function to handle showing/hiding the button based on scroll
    function handleScroll() {
        if (!scrollButton) return; // Exit if button doesn't exist

        if (window.scrollY > scrollThreshold) {
            // Show button
            scrollButton.style.opacity = "1";
            scrollButton.style.transform = "translateY(0)";
        } else {
            // Hide button
            scrollButton.style.opacity = "0";
            scrollButton.style.transform = "translateY(50px)"; // Move down
        }
    }

    function addButton() {
        if (document.querySelector(`.${buttonClassName}`)) {
            scrollButton = document.querySelector(`.${buttonClassName}`); // Ensure reference is set if already exists
            return; // Button already exists
        }

        const button = document.createElement("button");
        button.textContent = "↑ Top";
        button.className = buttonClassName;
        button.onclick = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        // Base styles
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.zIndex = "9999";
        button.style.padding = "8px 12px";
        button.style.cursor = "pointer";
        button.style.backgroundColor = "#222"; // Darker background
        button.style.color = "#eee"; // Lighter text
        button.style.border = "1px solid #555"; // Adjusted border
        button.style.borderRadius = "4px";

        // Animation styles
        button.style.opacity = "0"; // Start hidden
        button.style.transform = "translateY(50px)"; // Start shifted down
        button.style.transition =
            "opacity 0.3s ease-out, transform 0.3s ease-out"; // Smooth transition

        document.body.appendChild(button);
        scrollButton = button; // Store reference
        console.log("Scroll Top button added (initially hidden).");

        // Add scroll listener only once
        window.removeEventListener("scroll", handleScroll); // Remove previous just in case
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Check initial scroll position immediately
        handleScroll();
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        if (document.querySelector(targetElementSelector)) {
            addButton();
            // Keep observer running? If GitHub SPA navigation removes/re-adds
            // .application-main, you might need the button added again.
            // If you only want it added once per full page load, disconnect.
            // observer.disconnect();
        }
    });

    const checkBodyInterval = setInterval(() => {
        if (document.body) {
            clearInterval(checkBodyInterval);
            // Initial check
            if (document.querySelector(targetElementSelector)) {
                addButton();
            } else {
                // Start observing if target not found initially
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }
        }
    }, 100);
})();