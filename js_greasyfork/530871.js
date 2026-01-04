// ==UserScript==
// @name         Percentage to Fraction Converter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert all percentages on nwdb.info to fractions with special rules for under 40%.
// @author       Fortunate
// @match        http://nwdb.info/*
// @match        https://nwdb.info/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530871/Percentage%20to%20Fraction%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/530871/Percentage%20to%20Fraction%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function for new conversion rule (under 40%)
    function newConversion(numberStr) {
        var number = parseFloat(numberStr);
        if (number === 0) return "0"; // Handle division by zero
        var reciprocal = 100 / number;
        var rounded = parseFloat(reciprocal.toPrecision(3)); // Round to 3 significant digits for two decimal places
        var formatted = rounded % 1 === 0 ? rounded.toString() : rounded.toLocaleString('en', {maximumFractionDigits: 2});
        return "1/" + formatted;
    }

    // Function to convert percentage string to fraction string
    function getFractionString(numberStr) {
        var number = parseFloat(numberStr);
        if (Math.abs(number) < 40) {
            return newConversion(numberStr);
        } else {
            return numberStr + "/100";
        }
    }

    // Regular expression to match percentage patterns
    var regex = /(-?\d+(\.\d+)?)\s*%(?!\d)/g;

    // Function to process percentage badges in a given node
    function processPercentageBadges(node) {
        if (!node) return;
        var badges = node.querySelectorAll('span.badge.item-badge');
        badges.forEach(function(badge) {
            var originalText = badge.textContent;
            var newText = originalText.replace(regex, function(match, p1) {
                return getFractionString(p1);
            });
            if (newText !== originalText) {
                badge.textContent = newText;
            }
        });
    }

    // Initial processing of all percentage badges on the page
    function initialProcess() {
        var badges = document.querySelectorAll('span.badge.item-badge');
        badges.forEach(function(badge) {
            var originalText = badge.textContent;
            var newText = originalText.replace(regex, function(match, p1) {
                return getFractionString(p1);
            });
            if (newText !== originalText) {
                badge.textContent = newText;
            }
        });
    }

    initialProcess();

    // Function to find and handle the "Perk Buckets" tab
    function setupPerkBucketsHandler() {
        var perkBucketsTabButton = null;
        var buttons = document.querySelectorAll('button');
        for (var button of buttons) {
            var span = button.querySelector('span:first-child');
            if (span && span.textContent.trim() === "Perk Buckets") {
                perkBucketsTabButton = button;
                break;
            }
        }

        if (perkBucketsTabButton) {
            var tabPanelId = perkBucketsTabButton.getAttribute("aria-controls");
            var perkBucketsTabPanel = document.getElementById(tabPanelId);

            if (perkBucketsTabPanel) {
                // Process initially
                processPercentageBadges(perkBucketsTabPanel);

                // Add click event listener with delay to reprocess on click
                perkBucketsTabButton.addEventListener("click", function() {
                    setTimeout(function() {
                        processPercentageBadges(perkBucketsTabPanel);
                    }, 300); // Increased delay to 300ms to ensure content is rendered
                });

                // Periodic check for tab content visibility and conversion
                setInterval(function() {
                    if (perkBucketsTabPanel && window.getComputedStyle(perkBucketsTabPanel).display !== "none") {
                        processPercentageBadges(perkBucketsTabPanel);
                    }
                }, 500); // Check every 500ms
            }
        }
    }

    // Run setup after a delay to ensure DOM is fully loaded
    setTimeout(setupPerkBucketsHandler, 1000);

    // General MutationObserver for dynamic content on the whole page
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        processPercentageBadges(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true
    });
})();