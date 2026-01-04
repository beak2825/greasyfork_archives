// ==UserScript==
// @name        AP Stats Name Converter
// @namespace   Violentmonkey Scripts
// @match       http://www.ltcconline.net/greenl/java/Statistics/catStatProb/categorizingStatProblemsJavaScript.html*
// @grant       none
// @version     1.0
// @author      bob-source
// @description converts the dumb names into ones used in AP Stats
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/528317/AP%20Stats%20Name%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/528317/AP%20Stats%20Name%20Converter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Only run the script if we are on the expected page
    if (document.querySelector('input[name="quux[1]"]')) {
        // Mapping of original names to AP Stats terminology
        const nameMapping = {
            'Confidence Interval for a Population Mean': 'One-sample t-interval for a mean',
            'Confidence Interval for a Proportion': 'One-sample z-interval for a proportion',
            'Confidence Interval for the Diff. Between 2 Means (Independent Samples)': 'Two-sample t-interval for the difference of means',
            'Confidence Interval for Paired Data (Dependent Samples)': 'Paired t-interval for the mean difference',
            'Confidence Interval for the Difference Between 2 Proportions': 'Two-sample z-interval for the difference of proportions',
            'Hypothesis Test for a Population Mean': 'One-sample t-test for a mean',
            'Hypothesis Test for a Population Proportion': 'One-sample z-test for a proportion',
            'Hyp. Test for the Difference Between 2 Means (Independent Samples)': 'Two-sample t-test for the difference of means',
            'Hyp. Test for Paired Data (Dependent Samples)': 'Paired t-test for the mean difference',
            'Hyp. Test fro the Difference Between 2 Proportions': 'Two-sample z-test for the difference of proportions'
        };

        // Function to replace text in all elements that could contain the statistical terms
        function updateAllElements() {
            // Process labels
            const labels = document.querySelectorAll('label');
            labels.forEach(label => {
                Object.keys(nameMapping).forEach(originalText => {
                    if (label.textContent.includes(originalText)) {
                        label.textContent = label.textContent.replace(originalText, nameMapping[originalText]);
                    }
                });
            });

            // Process divs
            const divs = document.querySelectorAll('div');
            divs.forEach(div => {
                // Only process text nodes directly in the div (not in child elements)
                for (let i = 0; i < div.childNodes.length; i++) {
                    const node = div.childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE) {
                        Object.keys(nameMapping).forEach(originalText => {
                            if (node.textContent.includes(originalText)) {
                                node.textContent = node.textContent.replace(originalText, nameMapping[originalText]);
                            }
                        });
                    }
                }
            });

            // Process text nodes after checkboxes
            for (let i = 1; i <= 15; i++) {
                const checkbox = document.querySelector(`input[name="quux[${i}]"]`);
                if (checkbox) {
                    let nextNode = checkbox.nextSibling;
                    if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
                        Object.keys(nameMapping).forEach(originalText => {
                            if (nextNode.textContent.includes(originalText)) {
                                nextNode.textContent = nextNode.textContent.replace(originalText, " " + nameMapping[originalText]);
                            }
                        });
                    }
                }
            }

            // Process any other text elements or spans that might contain the text
            const spans = document.querySelectorAll('span');
            spans.forEach(span => {
                Object.keys(nameMapping).forEach(originalText => {
                    if (span.textContent.includes(originalText)) {
                        span.textContent = span.textContent.replace(originalText, nameMapping[originalText]);
                    }
                });
            });

            // Process paragraphs
            const paragraphs = document.querySelectorAll('p');
            paragraphs.forEach(p => {
                Object.keys(nameMapping).forEach(originalText => {
                    if (p.textContent.includes(originalText)) {
                        p.textContent = p.textContent.replace(originalText, nameMapping[originalText]);
                    }
                });
            });
          console.log("code is ran");
        }

        // Run the update function initially
        updateAllElements();

        // Run it again after a short delay to handle any dynamic content
        setTimeout(updateAllElements, 1000);

        // Set up a MutationObserver to handle dynamically added content
        const observer = new MutationObserver(function(mutations) {
            updateAllElements();
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();