// ==UserScript==
// @name         Reddit Hide Button (GraphQL + Remove DOM v0.7.2)
// @namespace    https://tampermonkey.net/
// @version      0.7.2
// @description  Adds a "Hide" button next to the join button on Reddit posts, or appends it to the credit bar if no join button is present. When clicked, it calls Reddit’s GraphQL API to hide the post and then removes the post element from the DOM.
// @author       Your Name
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528164/Reddit%20Hide%20Button%20%28GraphQL%20%2B%20Remove%20DOM%20v072%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528164/Reddit%20Hide%20Button%20%28GraphQL%20%2B%20Remove%20DOM%20v072%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper: log messages with a prefix.
    function log(msg) {
        console.log("[Reddit Hide Button] " + msg);
    }

    // Extract a cookie value by name.
    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // Call Reddit’s GraphQL API to hide the post.
    function hidePost(postId) {
        const csrfToken = getCookie("csrf_token");
        if (!csrfToken) {
            log("CSRF token not found in cookies.");
            return;
        }
        log("Hiding post: " + postId);
        fetch("https://www.reddit.com/svc/shreddit/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                operation: "UpdatePostHideState",
                variables: { input: { postId: postId, hideState: "HIDDEN" } },
                csrf_token: csrfToken,
            }),
            credentials: "include" // Ensure cookies are sent.
        })
        .then(response => response.json())
        .then(data => {
            log("Hide post response:");
            console.log(data);
        })
        .catch(error => {
            log("Error hiding post:");
            console.error(error);
        });
    }

    // When the custom Hide button is clicked.
    function onHideButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        log("Hide button clicked.");

        // Find the closest credit bar container.
        const creditBar = e.target.closest('span[slot="credit-bar"]');
        if (!creditBar) {
            log("Credit bar not found.");
            return;
        }

        // Locate the overflow menu element to extract the post ID.
        const overflowElem = creditBar.querySelector('shreddit-post-overflow-menu');
        if (!overflowElem) {
            log("Overflow menu element not found; cannot determine post id.");
            return;
        }
        const postId = overflowElem.getAttribute("post-id");
        if (!postId) {
            log("Post id attribute not found.");
            return;
        }
        // Hide the post via the API.
        hidePost(postId);

        // Remove the post element from the DOM.
        // Try a couple of common selectors for Reddit posts.
        const postContainer = creditBar.closest('div[data-testid="post-container"]') || creditBar.closest('article');
        if (postContainer) {
            postContainer.remove();
            log("Post container removed from DOM.");
        } else {
            log("Post container not found; unable to remove from DOM.");
        }
    }

    // Create a new Hide button element. If a reference button is provided, copy its className.
    function createHideButton(refButton) {
        const hideBtn = document.createElement("button");
        hideBtn.type = "button";
        hideBtn.textContent = "Hide";
        if (refButton) {
            hideBtn.className = refButton.className + " tm-hide-button";
        }
        // Style the button so it sits above the post overlay.
        hideBtn.style.marginLeft = "4px";
        hideBtn.style.cursor = "pointer";
        hideBtn.style.position = "relative";
        hideBtn.style.zIndex = "10";

        // Attach the click event listener in capture mode.
        hideBtn.addEventListener("click", onHideButtonClick, true);
        return hideBtn;
    }

    // Process a credit bar element by inserting the Hide button.
    function processCreditBar(creditBar) {
        if (creditBar.querySelector(".tm-hide-button")) return; // Avoid duplicates.
        // Try to locate a join button first.
        const joinButton = creditBar.querySelector('shreddit-join-button[data-testid="credit-bar-join-button"]');
        let hideButton;
        if (joinButton) {
            hideButton = createHideButton(joinButton);
            joinButton.parentNode.insertBefore(hideButton, joinButton.nextSibling);
        } else {
            // If there's no join button, just append the Hide button.
            hideButton = createHideButton(null);
            creditBar.appendChild(hideButton);
        }
        log("Inserted Hide button.");
    }

    // Initialize the script by processing existing credit bars and setting up a MutationObserver.
    function init() {
        document.querySelectorAll('span[slot="credit-bar"]').forEach(processCreditBar);
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches && node.matches('span[slot="credit-bar"]')) {
                            processCreditBar(node);
                        }
                        node.querySelectorAll && node.querySelectorAll('span[slot="credit-bar"]').forEach(processCreditBar);
                    }
                });
            });
        });
        observer.observe(document.body, {childList: true, subtree: true});
        log("Initialized Reddit Hide Button (GraphQL + Remove DOM) script.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
