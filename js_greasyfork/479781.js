// ==UserScript==
// @name         Doc88Downloader
// @namespace    https://github.com/lomexicano/Doc88Downloader
// @version      2.1
// @description  Download screenshots from all pages from a Doc88 file in one PDF
// @author       lomexicano
// @match        https://www.doc88.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.11.1/pdf-lib.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479781/Doc88Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/479781/Doc88Downloader.meta.js
// ==/UserScript==

// Function to extract the page title from the HTML
function extractPageTitle() {
    const pageTitleElement = document.querySelector('h1[title]');
    if (pageTitleElement) {
        return pageTitleElement.getAttribute('title').trim();
    }
    return 'merged_pages'; // Default title if not found
}

// Function to download the current page's "page_i" elements in a PDF file;
async function downloadPagesAsPDF(from, to) {
    'use strict';

    const pageTitle = extractPageTitle();
    console.log('Page title: '+pageTitle);

    const pdfDoc = await window.PDFLib.PDFDocument.create();

    for (let i = from; i <= to; i++) {
        ongoingProcess = true;
        if (cancelProcess) {
            break;
        }
        const pageCanvas = document.getElementById('page_' + i);
        if (pageCanvas === null) {
            console.log('OK! All pages were added to the PDF...');
            break;
        }
        console.log('Adding page '+i+' to the PDF...');

        const blob = await new Promise((resolve) => {
            pageCanvas.toBlob((blob) => resolve(blob));
        });

        // Convert the blob to a Uint8Array
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const image = await pdfDoc.embedPng(uint8Array);

        // Add a new page with the same dimensions as the image
        const page = pdfDoc.addPage([image.width, image.height]);

        // Draw the image onto the page
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const imageWidth = image.width;
        const imageHeight = image.height;

        const scaleFactor = Math.min(pageWidth / imageWidth, pageHeight / imageHeight);

        page.drawImage(image, {
            x: 0,
            y: 0,
            width: imageWidth * scaleFactor,
            height: imageHeight * scaleFactor,
        });
    }

    if (!cancelProcess) {
        const pdfBytes = await pdfDoc.save();
        const anchor = document.createElement('a');
        anchor.download = pageTitle + '.pdf';
        anchor.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        anchor.click();
        URL.revokeObjectURL(anchor.href);

        //cancelButton.textContent = "Cancel";
        //cancelButton.disabled = true;
    }
    ongoingProcess = false;
}

function displayAllPages() {
    // Check if the 'continue_page' element exists
    const continuePage = document.getElementById('continue_page');
    if (continuePage) {
        // Find the button with class 'iconfont more' inside 'continue_page'
        const moreButton = continuePage.querySelector('.iconfont.more');
        if (moreButton) {
            // Trigger a click event on the button
            moreButton.click();
            console.log('Clicking the button to display all pages...');

            // Wait for 2 seconds (2000 milliseconds) after clicking, so it loads the other pages HTML, at least;
            setTimeout(() => {
            }, 2000);
        }
    }
}


async function scrollToPagesWithPercentage() {
    const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while (true) {
        ongoingProcess = true;
        let pagesWithPercentage = document.querySelectorAll('div.page_pb[id^="pagepb_"]');
        let allPagesLoaded = true; // Track if all pages have been loaded successfully

        for (let i = 0; i < pagesWithPercentage.length; i++) {
            if (cancelProcess) {
                break;
            }

            const page = pagesWithPercentage[i];

            const updatedText = page.textContent.trim();
            if (updatedText.endsWith('%')) {
                console.log('Loading page '+(i+1)+'/'+pagesWithPercentage.length+'...');
                // Scroll to the page
                page.scrollIntoView({ behavior: 'smooth' });

                // Wait for a moment (you can adjust the delay as needed)
                await waitFor(100);

                // Check if the percentage is still there after each 100ms increment
                let percentageRemoved = false;

                for (let j = 0; j < 12; j++) {
                    await waitFor(100);

                    // Update the page.textContent value in each iteration
                    const updatedText = page.textContent.trim();

                    if (!updatedText.endsWith('%')) {
                        // If the percentage is no longer there, set flag for this page
                        percentageRemoved = true;
                        break;
                    }
                }

                if (!percentageRemoved) {
                    // If the percentage is still there after 20 attempts, set flag for all pages
                    allPagesLoaded = false;
                    console.log('This page could not be loaded yet. Coming back for it later...');
                }
            }
        }

        // If all pages have had their percentage removed, exit the loop
        if (allPagesLoaded) {
            console.log('All pages loaded successfully!');
            break;
        }

        if (cancelProcess) {
            break;
        }
    }

    ongoingProcess = false;
}



let cancelProcess = false; // Flag to indicate if the processes should be canceled
let ongoingProcess = false; // Flag to indicate if there is an ongoing process

function createDownloadButton() {
    const container = document.createElement('div'); // Container for the buttons
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.width = '160px'; // Adjust the width as needed

    // Create the white rectangle with black outline
    container.style.backgroundColor = 'white';
    container.style.border = '2px solid black';
    container.style.padding = '10px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'loadAllPagesCheckbox'; // Set the checkbox ID
    checkbox.checked = true; // Default value is true

    const checkboxLabel = document.createElement('label');
    checkboxLabel.textContent = 'Load all pages';
    checkboxLabel.htmlFor = 'loadAllPagesCheckbox'; // Associate the label with the checkbox

    const button = document.createElement('button');
    button.textContent = 'Download PDF';
    button.style.marginTop = '5px';

    const cancelButton = document.createElement('button'); // Cancel button
    cancelButton.textContent = 'Cancel';
    cancelButton.style.marginTop = '7px'; // Add margin to separate from other buttons
    cancelButton.disabled = true; // Initially disable the Cancel button

    // Function to update cancel button text and enable/disable it
    function updateCancelButton(text, isEnabled) {
        cancelButton.textContent = text;
        cancelButton.disabled = !isEnabled;
    }

    // Add a click event listener to the cancel button
    cancelButton.addEventListener('click', async () => {
        cancelProcess = true; // Set the cancel flag to true
        updateCancelButton('OK. Canceled.', false); // Disable the Cancel button
        button.disabled = false;

        setTimeout(() => {
            updateCancelButton('Cancel', false);
            cancelProcess = true;
        }, 1500);

        console.log('Canceled ongoing processes.');
        cancelProcess = false; // Set the cancel flag to true
    });

    // Add a click event listener to the download button
    button.addEventListener('click', async () => {
        const shouldLoadAllPages = document.getElementById('loadAllPagesCheckbox').checked;
        updateCancelButton('Cancel', true); // Enable the Cancel button

        button.disabled = true;
        if (shouldLoadAllPages) {
            ongoingProcess = true; // There is an ongoing process
            await displayAllPages();

            if (cancelProcess) {
                console.log('Download canceled.');
                ongoingProcess = false; // No ongoing process
                cancelProcess = false; // Reset the cancel flag
                return; // Exit the function if canceled
            }

            await scrollToPagesWithPercentage();

            if (cancelProcess) {
                console.log('Download canceled.');
                ongoingProcess = false; // No ongoing process
                cancelProcess = false; // Reset the cancel flag
                return; // Exit the function if canceled
            }
        }

        if (cancelProcess) {
            console.log('Download canceled.');
            ongoingProcess = false; // No ongoing process
            cancelProcess = false; // Reset the cancel flag
            return; // Exit the function if canceled
        }

        await downloadPagesAsPDF(1, 9999);
        ongoingProcess = false; // No ongoing process
        button.disabled = false;
    });

    const buttonContainer = document.createElement('div'); // Container for the buttons
    buttonContainer.style.display = 'flex'; // Use flex to align checkbox and button horizontally

    buttonContainer.appendChild(checkbox); // Append checkbox to container
    buttonContainer.appendChild(checkboxLabel); // Append label to container

    container.appendChild(buttonContainer); // Append checkbox container to main container
    container.appendChild(button); // Append button to main container
    container.appendChild(cancelButton); // Append cancel button to main container

    document.body.appendChild(container); // Append the main container to the page
}

// Call the function to create the buttons when the page loads
window.addEventListener('load', createDownloadButton);
