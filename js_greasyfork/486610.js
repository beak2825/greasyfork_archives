// ==UserScript==
// @name         asana-expand-comments
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically click 'N more comments' button and 'See more' within comments in Asana
// @author       Bruce Sharpe
// @match        https://app.asana.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486610/asana-expand-comments.user.js
// @updateURL https://update.greasyfork.org/scripts/486610/asana-expand-comments.meta.js
// ==/UserScript==

(function () {
        'use strict';

        var selector = 'span.TaskStoryFeed-expandLink.PrimaryLinkButton[role="button"]';
        var seeMoreSelector = 'span.TruncatedRichText-expand.PrimaryLinkButton span.TypographyPresentation.TypographyPresentation--m';

        // Custom log function
        function tmLog(message) {
            console.log('tm: ' + message);
        }

        // Function to show the popup message
        function showPopupMessage() {
            // Create the popup element
            const popup = document.createElement('div');
            popup.textContent = 'Comments expanded';
            Object.assign(popup.style, {
                position: 'fixed',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#47aab5',
                color: 'white',
                fontWeight: 'bold',
                border: '1px solid #ddd',
                padding: '10px',
                zIndex: 1000,
                fontSize: '16px',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                textAlign: 'center'
            });

            // Add the popup to the body
            document.body.appendChild(popup);

            // Remove the popup after 2 seconds
            setTimeout(function () {
                popup.remove();
            }, 3000);
        }

        // Function to click the button and show the popup
        function clickLoadMoreButton() {
            tmLog('Searching for the more comments button');
            const loadMoreButton = document.querySelector(selector);

            if (loadMoreButton) {
                tmLog('More comments button found, clicking it');
                loadMoreButton.click();
                clickSeeMoreButton(); // Expand "See more" right away
                showPopupMessage();
            } else {
                tmLog('More comments button not found');
            }
        }

       // Function to click on "See more" elements
       function clickSeeMoreButton() {
            tmLog('Searching for "See More" buttons ');
            const seeMoreButtons = document.querySelectorAll(seeMoreSelector);

            if (seeMoreButtons.length > 0) {
                tmLog(seeMoreButtons.length + ' "See more" buttons found, clicking them');
                seeMoreButtons.forEach(button => button.click());
            } else {
                tmLog('No see more buttons found');
            }
        }

        // Observe DOM changes
        function isElementMatching(node) {
            return node.matches && node.matches('span.TaskStoryFeed-expandLink.PrimaryLinkButton[role="button"]');
        }

        function checkAndProcessNode(node) {
            if (isElementMatching(node)) {
                // Your logic when the desired span is found
                tmLog('More comments button found, clicking it');
                node.click();
                clickSeeMoreButton(); // Expand "See more" right away
                showPopupMessage();
                return true;
            }

            // Check all child nodes
            if (node.hasChildNodes()) {
                for (let child of node.childNodes) {
                    if (checkAndProcessNode(child)) {
                        return true;
                    }
                }
            }

            return false;
        }

        function observeDOMChanges() {
            const observer = new MutationObserver(mutations => {
                for (let mutation of mutations) {
                    if (mutation.addedNodes) {
                        for (let node of mutation.addedNodes) {
                            if (checkAndProcessNode(node)) {
                                //observer.disconnect(); // Optional: disconnect observer if the button is found and clicked
                                break;
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Modify handleScriptLoad function to use observeDOMChanges
        function handleScriptLoad() {
            tmLog('Handling script load');
            if (document.readyState === "complete" || document.readyState === "interactive") {
                tmLog('Document is already loaded, checking for button immediately');
                clickLoadMoreButton(); // Check once immediately
                observeDOMChanges(); // Then observe for changes
            } else {
                document.addEventListener('DOMContentLoaded', function () {
                    tmLog('DOMContentLoaded event fired, checking for button');
                    clickLoadMoreButton(); // Check once immediately after DOMContentLoaded
                    observeDOMChanges(); // Then observe for changes
                });
            }
        }

        // Run the handling function
        handleScriptLoad();

    })();
