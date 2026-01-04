// ==UserScript==
// @name         PriceSF
// @namespace    http://tampermonkey.net/
// @version      2025-04-10
// @description  Internal tool for pricefx support
// @author       You
// @match        https://pricefx.lightning.force.com/lightning/*/Case/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=force.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532378/PriceSF.user.js
// @updateURL https://update.greasyfork.org/scripts/532378/PriceSF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const priceSFClass = "pricesf-btn"
    GM_addStyle(`
        .${priceSFClass} {
          background-color: #077FFF;
          transition: background-color 0.3s;
        }
        .${priceSFClass}:hover {
          background-color:rgb(0, 88, 176);
          cursor: pointer;
        }
      `);

    function isNotCase() {
        const isNotCase = !window.location.href.includes('/r/Case/')
        if (isNotCase) {
            Array.from(document.getElementsByClassName(priceSFClass)).forEach(el => el.style.display = 'none')
        }

        return isNotCase    
    }

    // Function to check and highlight articles
    function highlightInternalArticles() {
        // Get all article elements
        const articles = document.querySelectorAll('article');

        // Check each article
        articles.forEach(article => {
            // Get the text content of the article
            const articleText = article.textContent || '';

            // Check if the article contains "To: Internal"
            if (articleText.includes('To: Internal')) {
                // Set the background color
                article.style.backgroundColor = '#ff3b6b50';
            }
        });
    }

    // Run the function immediately
    highlightInternalArticles();

    // Set up interval to run every second
    setInterval(highlightInternalArticles, 1000);


    //////////////////////////////////////////////////////////

    injectCopyPublicButton();

    function injectCopyPublicButton() {
        const button = document.createElement('button');
        button.classList.add(priceSFClass)
        button.innerHTML = 'Copy Portal URL';
        button.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 9999;
        padding: 6px 8px;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        font-size: 12px;
        width: 120px;
        height: 32px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

        // Store the current URL
        let currentUrl = '';

        // Function to update the button's click handler with the latest URL
        function updateUrlHandler() {
            if (isNotCase()) {
                return
            }
            
            const newUrl = window.location.href;

            // Only update if URL has changed
            if (newUrl !== currentUrl) {
                button.style.display = 'block'
                currentUrl = newUrl;

                // Update click handler
                button.onclick = async () => {
                    try {
                        const caseId = currentUrl.match(/Case\/([a-zA-Z0-9]+)\/view/)?.[1];

                        if (!caseId) {
                            return null;
                        }

                        const portalUrl = `https://pricefx.my.site.com/helpdesk/s/case/${caseId}`;

                        await navigator.clipboard.writeText(portalUrl);

                        // Visual feedback
                        const originalText = button.innerHTML;
                        button.innerHTML = '✅ Copied!';
                        button.style.backgroundColor = '#45a049';

                        setTimeout(() => {
                            button.innerHTML = originalText;
                            button.style.removeProperty('background-color')
                        }, 3000);
                    } catch (err) {
                        console.error('Failed to copy URL:', err);
                        button.innerHTML = '❌ Error';
                        setTimeout(() => {
                            button.innerHTML = 'Copy Portal URL';
                        }, 3000);
                    }
                };
            }
        }

        // Initial setup
        document.body.appendChild(button);
        updateUrlHandler();

        // Update URL handler every second
        setInterval(updateUrlHandler, 1000);
    }

    //////////////////////////////////////////////////////////

    injectCopyPartitionButton();

    function injectCopyPartitionButton() {
        const button = document.createElement('button');
        button.classList.add(priceSFClass)
        button.style.cssText = `
        position: fixed;
        top: 10px;
        left: 140px;
        z-index: 9999;
        padding: 6px 8px;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        font-size: 12px;
        height: 32px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

        // Store the current URL
        let currentUrl = '';
        let partitionText = ''

        // Function to update the button's click handler with the latest URL
        function updatePartitionHandler() {
            if (isNotCase()) {
                return
            }

            const newUrl = window.location.href;

            // Only update if URL has changed
            if (newUrl !== currentUrl || !partitionText) {
                button.style.display = 'block'
                currentUrl = newUrl;

                function extractPartitionText(rawText) {
                    const partitionLabel = 'Partition\n';
                    const partitionIndex = rawText.indexOf(partitionLabel);

                    if (partitionIndex === -1) {
                        console.log('Partition label not found in the text.');
                        return null;
                    }

                    // Find the index of the text immediately after "Partition\n"
                    const startIndex = partitionIndex + partitionLabel.length;

                    //Find the index of the next line
                    const endIndex = rawText.indexOf('\n', startIndex+1);

                    if (endIndex === -1) {
                        console.log('End line not found after partition');
                        return null;
                    }
                    const partitionText = rawText.substring(startIndex, endIndex).trim();
                    console.log(partitionText);

                    return partitionText;
                }
                if (document.querySelector('section')) {
                    partitionText = extractPartitionText(document.querySelector('section').innerText)
                }


                if (!button.innerHTML.includes("!")) {
                    button.innerHTML = `Copy ${partitionText}`;
                }


                // Update click handler
                button.onclick = async () => {
                    try {

                        if (!partitionText) {
                            throw new Error("Could not get partition text");
                        }

                        await navigator.clipboard.writeText(partitionText);

                        // Visual feedback
                        const originalText = button.innerHTML;
                        button.innerHTML = '✅ Copied!';
                        button.style.backgroundColor = '#45a049';
                        button.style.width = '120px';

                        setTimeout(() => {
                            button.innerHTML = originalText;
                            button.style.width = 'auto';
                            button.style.removeProperty('background-color')
                        }, 3000);
                    } catch (err) {
                        console.error('Failed to copy URL:', err);
                        button.innerHTML = '❌ Error!';
                        setTimeout(() => {
                            button.innerHTML = 'Copy Portal URL';
                        }, 3000);
                    }
                };
            }
        }

        // Initial setup
        document.body.appendChild(button);
        updatePartitionHandler();

        // Update URL handler every second
        setInterval(updatePartitionHandler, 1000);
    }
})();