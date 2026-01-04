// ==UserScript==
// @name         facebook - Hide Stories Sections + blur contacts
// @namespace    http://fiverr.come/web_coder_nsd
// @version      0.4
// @description  facebook - Hide Stories sections on a news feed using MutationObserver
// @author       Noushad Bhuiyan
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474397/facebook%20-%20Hide%20Stories%20Sections%20%2B%20blur%20contacts.user.js
// @updateURL https://update.greasyfork.org/scripts/474397/facebook%20-%20Hide%20Stories%20Sections%20%2B%20blur%20contacts.meta.js
// ==/UserScript==

function cleanTitle()
{
    const regex = /^\(.*\) /;

    if(document.title.match(regex) != null)
    {
        document.title = document.title.replace(regex, '');
    }
}

(function() {
    'use strict';

    function hideStoriesSection(){
        const spans = document.querySelectorAll('span[dir="auto"] span[id^="\\:"]')
        for (const span of spans) {
            if (span.innerText.includes("Stories\n \n · \n \n · ")) {
                //span.style.display = "none";
                var parent = span.closest('[aria-describedby]')
                parent.innerText = "removed story"
                parent.style.color = "white"
            }
        }
        const reels = document.querySelectorAll('[aria-label="Reels"]')
        for (const reel of reels) {
            reel.remove()
        }
    }
    function hideManipulativeRecommendedPost(){
        const spans = document.querySelectorAll('span[dir="auto"] div[role="button"]')
        for (const span of spans) {
            if (span.innerText.includes("Follow")) {
                //span.style.display = "none";
                var parent = span.closest('[aria-describedby]')
                parent.innerText = "removed manipulative recommended posts"
                parent.style.color = "white"
            }
        }
    }

    // Function to hide the Reels and short videos section
    function hideReelsSection() {
        const spans = document.querySelectorAll("span");

        for (const span of spans) {
            if (span.innerText.includes("Reels and short videos")) {
                const parent = span.closest("div.x1lliihq");
                parent.style.display = "none";

                //console.log("Hidden the Reels Section");

                return true;
            }
        }

        return false;
    }

    // Function to hide the Top Reels section
    function hideReelsTopSection() {
        const spans = document.querySelectorAll("span");

        for (const span of spans) {
            if (span.innerText.includes("Reels")) {
                const parent = span.closest("div.x1qughib");
                parent.style.display = "none";

                //console.log("Hidden the Top Reels Section");

                return true;
            }
        }

        return false;
    }

    function blurContacts() {
        const contactList = document.querySelector(".xwib8y2 ul");

        // Check if the checkbox with the specified ID already exists
        var checkbox = document.getElementById("blurCheckbox");

        // If it doesn't exist, create the checkbox
        if (!checkbox) {
            // Create a div for flex layout
            const flexContainer = document.createElement("div");
            flexContainer.style.display = "flex";
            flexContainer.style.alignItems = "center"; // Align items vertically
            flexContainer.style.margin = "15px"; // Align items vertically

            // Create the checkbox and set it to checked by default
            checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "blurCheckbox";
            checkbox.checked = true; // Checked by default

            // Function to toggle blur effect based on checkbox state
            function toggleBlur() {
                if (checkbox.checked) {
                    contactList.style.filter = "blur(7px)";
                } else {
                    contactList.style.filter = "";
                }
            }

            // Add event listener to the checkbox
            checkbox.addEventListener("change", toggleBlur);

            // Create a label for the checkbox
            const label = document.createElement("label");
            label.textContent = "Blur Contacts";
            label.htmlFor = "blurCheckbox";
            label.style.marginLeft = "5px"; // Add spacing between checkbox and label

            // Append the checkbox and label to the flex container
            flexContainer.appendChild(checkbox);
            flexContainer.appendChild(label);

            // Add the flex container to the contact list's parent
            contactList.parentElement.prepend(flexContainer);

            toggleBlur()
        }

    }
    // Function to observe mutations in the document
    function observeMutations() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "childList") {
                    // Call your functions here when the DOM changes
                    hideReelsSection();
                    hideReelsTopSection();
                    hideManipulativeRecommendedPost()
                    hideStoriesSection();
                    blurContacts();
                }
                //cleanTitle()
            });
        });

        const config = {
            childList: true,
            subtree: true
        };

        // Start observing the document
        observer.observe(document, config);
    }

    // Start observing mutations when the page loads
    window.addEventListener("load", observeMutations);
})();