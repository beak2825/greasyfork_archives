// ==UserScript==
// @name         CS2 Skin Editor
// @namespace    https://www.meckedev.de
// @version      0.6.2
// @description  Enhance your CS2 skin experience with CS2 Skin Editor! This Chrome extension adds a convenient 'Edit Skin' button to CS2 item links, allowing you to effortlessly modify and personalize your favorite skins on a dedicated website. Customize and experiment with your CS2 skins like never before.
// @author       Mecke_Dev
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478181/CS2%20Skin%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/478181/CS2%20Skin%20Editor.meta.js
// ==/UserScript==

// Define a function to add the "Edit Skin" button with styling
function addButton(link) {
    // Check if the URL contains "?gen=" and if the button with a specific id is not already present
    if (link.href.indexOf('?gen=') === -1 && !document.getElementById('editSkinButton')) {
        var btn = document.createElement("a");
        btn.textContent = "Edit Skin";
        btn.id = 'editSkinButton'; // Use a unique id for the button
        btn.style.display = "inline-block";
        btn.style.margin = "0 10px";
        btn.style.padding = "10px";
        btn.style.backgroundColor = "#4CAF50";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px"; // Rounded corners
        btn.style.cursor = "pointer";

        // Adjust other CSS properties as needed

        var url = `https://www.meckedev.de/?gen=${encodeURIComponent(link.href)}`;
        btn.onclick = function() {
            window.open(url, '_blank');
        };
        link.parentNode.insertBefore(btn, link.nextSibling);
    }
}

// Function to observe changes in the DOM
function observeDOM() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'A' && node.href && node.href.includes("+csgo_econ_action_preview")) {
                        // Check if the button class is not already present
                        if (!node.classList.contains('editSkinButton')) {
                            addButton(node);
                        }
                    } else if (node.querySelectorAll) {
                        var links = node.querySelectorAll('a[href*="+csgo_econ_action_preview"]');
                        links.forEach(function(subNode) {
                            // Check if the button class is not already present
                            if (!subNode.classList.contains('editSkinButton')) {
                                addButton(subNode);
                            }
                        });
                    }
                });
            }
        });
    });

    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}

// Call the function to start observing
observeDOM();
