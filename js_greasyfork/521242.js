// ==UserScript==
// @name        v501block trump on news.google.com
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description Automatically scrolls to the bottom of pages with infinite scrolling and then modifies content by removing "Trump", "transgender", "Elon Musk", "MTG", "Marjorie", "SCOTUS", "Supreme Court", "MAGA", and hiding the sections containing those words
// @include     https://news.google.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/521242/v501block%20trump%20on%20newsgooglecom.user.js
// @updateURL https://update.greasyfork.org/scripts/521242/v501block%20trump%20on%20newsgooglecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let instancesRemoved = 0; // Counter for instances of words removed

    // Function to check if the page is still loading content (based on the presence of a loading indicator)
    function isPageStillLoading() {
        const loadingIndicators = document.querySelectorAll('.loading,.loading-spinner,.infinite-scroll-loading'); // Customize based on common loading classes
        return loadingIndicators.length > 0;
    }

    // Function to scroll to the bottom of the page and load more content
    function scrollToBottom() {
        window.scrollTo(0, document.documentElement.scrollHeight);
    }

    // Function to load the entire page by continuously scrolling until no more content is being loaded
    function loadEntirePage() {
        const interval = setInterval(() => {
            scrollToBottom(); // Scroll to the bottom
            if (!isPageStillLoading()) {
                clearInterval(interval); // Stop scrolling when the page has finished loading
            }
        }, 1000); // Scroll every 1 second to allow time for content to load
    }

    // Function to disable and replace words like 'Trump', 'transgender', 'Elon Musk', 'MTG', 'Marjorie', 'SCOTUS', 'Supreme Court', 'MAGA' and hide the entire section containing those words
    function disableAndReplaceWords() {
        const links = document.getElementsByTagName('a');
        for (let link of links) {
            // Check if the link text or href contains any of the specified words (case-insensitive)
            if (link.textContent.toLowerCase().includes('trump') || link.href.toLowerCase().includes('trump') || 
                link.textContent.toLowerCase().includes('transgender') || link.href.toLowerCase().includes('transgender') || 
                link.textContent.toLowerCase().includes('musk') || link.href.toLowerCase().includes('musk') ||
                link.textContent.toLowerCase().includes('mtg') || link.href.toLowerCase().includes('mtg') ||
                link.textContent.toLowerCase().includes('marjorie') || link.href.toLowerCase().includes('marjorie') ||
                link.textContent.toLowerCase().includes('scotus') || link.href.toLowerCase().includes('scotus') ||
                link.textContent.toLowerCase().includes('supreme court') || link.href.toLowerCase().includes('supreme court') ||
                link.textContent.toLowerCase().includes('putin') || link.href.toLowerCase().includes('putin') ||
                link.textContent.toLowerCase().includes('newsmax') || link.href.toLowerCase().includes('newsmax') ||
                link.textContent.toLowerCase().includes('hegseth') || link.href.toLowerCase().includes('hegseth') ||
                link.textContent.toLowerCase().includes('rfk') || link.href.toLowerCase().includes('rfk') ||
                link.textContent.toLowerCase().includes('kennedy') || link.href.toLowerCase().includes('kennedy') ||
                link.textContent.toLowerCase().includes('ukraine') || link.href.toLowerCase().includes('ukraine') ||
                link.textContent.toLowerCase().includes('zelensky') || link.href.toLowerCase().includes('zelensky') ||
                link.textContent.toLowerCase().includes('migrant') || link.href.toLowerCase().includes('migrant') ||
                link.textContent.toLowerCase().includes('immigrant') || link.href.toLowerCase().includes('immigrant') ||
                link.textContent.toLowerCase().includes('migration') || link.href.toLowerCase().includes('migration') ||
                link.textContent.toLowerCase().includes('abortion') || link.href.toLowerCase().includes('abortion') ||
                link.textContent.toLowerCase().includes('fox news') || link.href.toLowerCase().includes('fox news') ||
                link.textContent.toLowerCase().includes('january 6') || link.href.toLowerCase().includes('january 6') ||
                link.textContent.toLowerCase().includes('guilfoyle') || link.href.toLowerCase().includes('guilfoyle') ||
                link.textContent.toLowerCase().includes('Jan. 6') || link.href.toLowerCase().includes('jan. 6') ||
                link.textContent.toLowerCase().includes('immigration') || link.href.toLowerCase().includes('immigration') ||
                link.textContent.toLowerCase().includes('pelosi') || link.href.toLowerCase().includes('pelosi') ||
                link.textContent.toLowerCase().includes('republican') || link.href.toLowerCase().includes('republican') ||
                link.textContent.toLowerCase().includes('republicans') || link.href.toLowerCase().includes('republicans') ||
                link.textContent.toLowerCase().includes('dreamers') || link.href.toLowerCase().includes('dreamers') ||
                link.textContent.toLowerCase().includes('AOC') || link.href.toLowerCase().includes('AOC') ||
                link.textContent.toLowerCase().includes('GOP') || link.href.toLowerCase().includes('GOP') ||
                link.textContent.toLowerCase().includes('biden') || link.href.toLowerCase().includes('biden') ||
                link.textContent.toLowerCase().includes('inauguration') || link.href.toLowerCase().includes('inauguration') ||
                link.textContent.toLowerCase().includes('maga') || link.href.toLowerCase().includes('maga')) {
                
                let blockParent = link.closest('div, p, section, article, aside, header, footer, main, nav, form');
                
                // Remove images in the parent block element
                if (blockParent) {
                    const images = blockParent.getElementsByTagName('img');
                    for (let img of images) {
                        // Hide the image completely (forcefully hide it)
                        img.style.display = 'none';
                    }

                    // Hide the entire parent block element
                    blockParent.style.display = 'none';
                }

                // Modify link styles to make it disabled
                link.textContent = '-';
                link.style.pointerEvents = 'none';
                link.style.color = 'gray';
                link.style.textDecoration = 'none';
                link.onclick = function(e) {
                    e.preventDefault();
                };

                instancesRemoved++; // Increment the counter for each word instance removed
            }
        }
    }

    // Function to replace 'Trump', 'transgender', 'Elon Musk', 'MTG', 'Marjorie', 'SCOTUS', 'Supreme Court', 'MAGA' with a placeholder text ('yyy') in all text nodes
    function replaceWords() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            // Replace occurrences of 'Trump', 'transgender', 'Elon Musk', 'MTG', 'Marjorie', 'SCOTUS', 'Supreme Court', 'MAGA' (case-insensitive, word boundaries to avoid partial matches)
            const originalText = node.nodeValue;
            node.nodeValue = node.nodeValue.replace(/\b(Trump|transgender|Elon Musk|MTG|Marjorie|SCOTUS|Supreme Court|MAGA)('s|ed|ing)?\b/gi, 'yyy');
            
            // If any text was replaced, increment the counter
            if (originalText!== node.nodeValue) {
                instancesRemoved++; 
            }
        }
    }

    // Function to wait for 5 seconds before executing modifications
    function waitAndExecute(callback) {
        setTimeout(callback, 2000); // Wait for 2 seconds before executing modifications
    }

    // Function to ensure the page has fully loaded
    function waitForPageLoad(callback) {
        if (document.readyState === 'complete') {
            // Page is already fully loaded
            callback();
        } else {
            // Wait until the page is fully loaded
            window.addEventListener('load', callback);
        }
    }

    // Function to create and show the floating message for instances replaced
    function showItemsReplacedMessage() {
        const message = document.createElement('div');
        message.textContent = `${instancesRemoved}`; // Only show the number
        message.style.position = 'fixed';
        message.style.top = '10px';
        message.style.right = '10px'; // Position to the right
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '5px';
        message.style.zIndex = '9998'; // Lower z-index to ensure buttons are on top
        message.style.fontSize = '16px';
        message.style.fontWeight = 'bold';
        message.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        document.body.appendChild(message);

        // Make the message disappear after 3 seconds
        setTimeout(() => {
            message.style.transition = 'opacity 1s';
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 1000); // Remove after fade-out
        }, 6000);
    }

    // Function to create and show the days of freedom message
    function showDaysOfFreedomMessage() {
        const startDate = new Date('2024-12-09T00:00:00');
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const message = document.createElement('div');
        message.textContent = `${diffDays}`; // Only show the number of days
        message.style.position = 'fixed';
        message.style.top = '10px';
        message.style.left = '10px'; // Position to the left
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '5px';
        message.style.zIndex = '9998'; // Lower z-index to ensure buttons are on top
        message.style.fontSize = '16px';
        message.style.fontWeight = 'bold';
        message.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        document.body.appendChild(message);

        // Make the message disappear after 3 seconds
        setTimeout(() => {
            message.style.transition = 'opacity 1s';
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 1000); // Remove after fade-out
        }, 6000);
    }

    // Function to add the "Reload" button at the top of the page
    function addReloadButton() {
        const reloadButton = document.createElement('button');
        reloadButton.textContent = 'Reload';
        reloadButton.style.position = 'fixed';
        reloadButton.style.top = '10px';
        reloadButton.style.left = '50%';
        reloadButton.style.transform = 'translateX(-50%)';
        reloadButton.style.backgroundColor = 'blue';
        reloadButton.style.color = 'white';
        reloadButton.style.border = 'none';
        reloadButton.style.padding = '10px 20px';
        reloadButton.style.fontSize = '16px';
        reloadButton.style.zIndex = '9999'; // Make sure it's always on top
        reloadButton.addEventListener('click', () => {
            location.reload();
        });
        document.body.appendChild(reloadButton);
    }

    // Function to add the "ST" button at the bottom-right
    function addSTButton() {
        const stButton = document.createElement('button');
        stButton.textContent = 'ST';
        stButton.style.position = 'fixed';
        stButton.style.bottom = '10px';
        stButton.style.right = '10px';
        stButton.style.backgroundColor = 'red';
        stButton.style.color = 'white';
        stButton.style.border = 'none';
        stButton.style.padding = '10px 20px';
        stButton.style.fontSize = '16px';
        stButton.style.zIndex = '9999'; // Make sure it's always on top
        stButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll smoothly to the top of the page
        });
        document.body.appendChild(stButton);
    }

    // Function to add hover effect for "Hide Image" button
    function addHideImageButton(img) {
        const hideButton = document.createElement('button');
        hideButton.textContent = 'Hide Image';
        hideButton.style.position = 'absolute';
        hideButton.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        hideButton.style.color = 'white';
        hideButton.style.padding = '5px 10px';
        hideButton.style.border = 'none';
        hideButton.style.borderRadius = '5px';
        hideButton.style.cursor = 'pointer';
        hideButton.style.zIndex = '10000'; // Ensure it stays on top

        // Position the button over the image
        hideButton.style.top = `${img.getBoundingClientRect().top + window.scrollY + 10}px`;
        hideButton.style.left = `${img.getBoundingClientRect().left + window.scrollX + 10}px`;

        // Add hover effect to show the button
        img.style.position = 'relative';
        img.addEventListener('mouseover', function() {
            img.parentElement.appendChild(hideButton);
        });

        hideButton.addEventListener('click', function() {
            img.style.display = 'none';
            hideButton.remove();
        });

        // Remove button when mouse leaves
        img.addEventListener('mouseout', function() {
            hideButton.remove();
        });
    }

    // Function to execute the entire process
    function runProcess() {
        loadEntirePage(); // Scroll the page to load all content
        waitAndExecute(() => {
            // After 2 seconds, execute the content modification functions
            disableAndReplaceWords();
            replaceWords();

            // Add Hide Image button functionality to all images
            const images = document.querySelectorAll('img');
            images.forEach((img) => {
                addHideImageButton(img);
            });

            // After all scripts are done, show the floating messages
            setTimeout(() => {
                showDaysOfFreedomMessage(); // Show the days of freedom message
                setTimeout(() => {
                    showItemsReplacedMessage(); // Show the number of items replaced
                }, 1000); // Wait 1 second before showing the message
            }, 1000); // Wait 1 second before showing the messages
        });
    }

    // Ensure the page is fully loaded before running the script
    waitForPageLoad(function() {
        // Wait 3 seconds before adding buttons
        setTimeout(() => {
            addReloadButton(); // Add Reload button
            addSTButton(); // Add ST button
        }, 3000);  // 3-second delay

        runProcess();       // Run the process for cleaning and modifying content
    });

})();