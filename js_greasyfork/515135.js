// ==UserScript==
// @name         Open AlphabetLinks in New Tabs 
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Open each video page link in a new tab. For alpha search pages.
// @author       955whynot
// @match        https://www.bloomsburyvideolibrary.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515135/Open%20AlphabetLinks%20in%20New%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/515135/Open%20AlphabetLinks%20in%20New%20Tabs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        // Selector for the alphabet panel links
        const alphabetSelector = 'a.accordion-toggle';

        // Function to open a single link
        function openLink(url) {
            const newTab = window.open(url, '_blank');
            if (newTab) {
                newTab.focus();
                console.log(`Opened: ${url}`);
            } else {
                console.log(`Failed to open: ${url}`);
            }
        }

        // Function to prompt the user to choose an alphabet section
        function selectAlphabet() {
            const alphabetLinks = document.querySelectorAll(alphabetSelector);
            const alphabetOptions = Array.from(alphabetLinks).map(link => link.innerText.trim().charAt(0)).join(', ');

            const selectedLetter = prompt(`Please enter a letter from the following options:\n${alphabetOptions}`);
            if (!selectedLetter) return null;

            const matchingLink = Array.from(alphabetLinks).find(link => link.innerText.trim().startsWith(selectedLetter));
            if (matchingLink) {
                matchingLink.click();
                return selectedLetter;
            } else {
                alert(`Letter "${selectedLetter}" not found. Please select a valid option.`);
                return null;
            }
        }

        // Function to open links in batches, controlled by the "Next Batch" button
        async function openLinksInControlledBatches() {
            const selectedLetter = selectAlphabet();
            if (!selectedLetter) return;

            setTimeout(async () => {
                const sectionId = `collapse${selectedLetter}`;
                const links = document.querySelectorAll(`#${sectionId} div.d-flex.align-items-b a`);

                console.log(`Found ${links.length} links under "${selectedLetter}".`);

                if (links.length === 0) {
                    alert('No video links found for the selected letter.');
                    return;
                }

                const urls = Array.from(links).map(link => {
                    return 'https://www.bloomsburyvideolibrary.com' + link.getAttribute('href');
                });

                let currentIndex = 0;
                const batchSize = 20;

                // Function to open the next batch of links
                function openNextBatch() {
                    const batch = urls.slice(currentIndex, currentIndex + batchSize);
                    console.log(`Opening batch with ${batch.length} links.`);

                    batch.forEach(openLink);
                    currentIndex += batchSize;

                    if (currentIndex >= urls.length) {
                        nextBatchButton.remove();
                        console.log('All links opened.');
                    }
                }

                // Add the "Next Batch" button to manually open each batch
                const nextBatchButton = document.createElement('button');
                nextBatchButton.innerText = 'Open Next Batch of Links';
                nextBatchButton.style.position = 'fixed';
                nextBatchButton.style.bottom = '20px';
                nextBatchButton.style.right = '20px';
                nextBatchButton.style.padding = '10px';
                nextBatchButton.style.backgroundColor = '#007BFF';
                nextBatchButton.style.color = 'white';
                nextBatchButton.style.border = 'none';
                nextBatchButton.style.cursor = 'pointer';

                // Attach click event to open the next batch
                nextBatchButton.addEventListener('click', openNextBatch);

                // Append the button to the body of the webpage
                document.body.appendChild(nextBatchButton);

                // Open the initial batch
                openNextBatch();
            }, 1000); // Small delay to ensure section loads after clicking on the alphabet section
        }

        // Add a button to manually trigger the script on the page
        const startButton = document.createElement('button');
        startButton.innerText = 'Open Video Links by Alphabet in Controlled Batches';
        startButton.style.position = 'fixed';
        startButton.style.bottom = '60px';
        startButton.style.right = '20px';
        startButton.style.padding = '10px';
        startButton.style.backgroundColor = 'orange';
        startButton.style.color = 'red';
        startButton.style.border = 'none';
        startButton.style.cursor = 'pointer';

        // When the button is clicked, run the openLinksInControlledBatches function
        startButton.addEventListener('click', openLinksInControlledBatches);

        // Append the start button to the body of the webpage
        document.body.appendChild(startButton);
    });
})();
