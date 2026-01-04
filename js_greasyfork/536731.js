// ==UserScript==
// @name        Google AI Studio Paste To File
// @namespace   Violentmonkey Scripts
// @match       https://aistudio.google.com/u/0/prompts/*
// @grant       none
// @author      Skibidi Rizz
// @version     1.0
// @description Intercepts large pastes and uploads as text files
// @downloadURL https://update.greasyfork.org/scripts/536731/Google%20AI%20Studio%20Paste%20To%20File.user.js
// @updateURL https://update.greasyfork.org/scripts/536731/Google%20AI%20Studio%20Paste%20To%20File.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const maxNonPasteLength = 1000;
    // Function to clean text for use as filename
    function cleanFilename(text) {
        return text.substring(0, 20)
            .replace(/[\\/:*?"<>|]/g, '_')
            .trim();
    }

    // Function to close overlay menu by clicking the backdrop
    function closeOverlay() {
        setTimeout(() => {
            try {
                const backdropElement = document.querySelector("body > div.cdk-overlay-container > div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing");
                if (backdropElement) {
                    backdropElement.click();
                    console.log("Successfully closed upload overlay by clicking backdrop");
                } else {
                    console.log("Backdrop element not found");
                }
            } catch (e) {
                console.error("Error closing overlay:", e);
            }
        }, 10); // Give it time for the upload to complete
    }

    // Function to find and click the upload button
    function clickUploadButton() {
        // Try the provided selector first
        let uploadButton = document.querySelector("button[_ngcontent-ng-c2767593862]");

        // If that doesn't work, try alternative methods
        if (!uploadButton) {
            // Find buttons that might be related to uploads
            const buttons = Array.from(document.querySelectorAll('button'));
            uploadButton = buttons.find(el => {
                // Look for buttons with upload icons or text
                const innerText = el.innerText ? el.innerText.toLowerCase() : '';
                const hasUploadIcon = el.querySelector('svg') !== null;

                return hasUploadIcon ||
                       innerText.includes('upload') ||
                       innerText.includes('attach');
            });
        }

        if (uploadButton) {
            uploadButton.click();
            return true;
        }

        console.error('Upload button not found');
        return false;
    }

    // Function to find the file input with multiple methods
    function findFileInput() {
        // First click the upload button to reveal the file input
        if (!clickUploadButton()) {
            return Promise.resolve(null);
        }

        // Wait a short time for the input to be added to the DOM
        return new Promise(resolve => {
            setTimeout(() => {
                // Try the provided selector first
                let fileInput = document.querySelector("input[_ngcontent-ng-c2767593862]");

                // If that doesn't work, try alternative methods
                if (!fileInput) {
                    // Find any hidden file input
                    const fileInputs = Array.from(document.querySelectorAll('input[type="file"]'));
                    fileInput = fileInputs.find(el => el.multiple);
                }

                resolve(fileInput);
            }, 10); // Give it 200ms for the DOM to update
        });
    }

    // Function to create text file and trigger upload
    async function createAndUploadFile(text, filename) {
        // Create a Blob with the text content
        const blob = new Blob([text], { type: 'text/plain' });

        // Create a File object from the Blob
        const file = new File([blob], `${filename}.txt`, { type: 'text/plain' });

        // Find file input (now returns a Promise)
        const fileInput = await findFileInput();

        if (fileInput) {
            try {
                // Try using DataTransfer API
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;

                // Dispatch change event to trigger upload
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);

                console.log(`Uploaded "${filename}.txt" (${text.length} characters)`);

                // Close overlay menu after upload by clicking backdrop
                closeOverlay();
            } catch (error) {
                console.error('DataTransfer API failed:', error);

                // Fallback: Download the file for manual selection
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${filename}.txt`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Alert the user
                setTimeout(() => {
                    alert('Please select the downloaded file manually');
                }, 500);
            }
        } else {
            console.error('File input element not found');
            alert('Could not find the file upload element. Please copy the text to a file and upload manually.');
        }
    }

    // Function to find the textarea with multiple methods
    function findTextarea() {
        // Try the provided selector first
        let textarea = document.querySelector("textarea[_ngcontent-ng-c329905920]");

        // If that doesn't work, try alternative methods
        if (!textarea) {
            // Find the main textarea in the chat interface
            const textareas = Array.from(document.querySelectorAll('textarea'));
            textarea = textareas.find(el =>
                el.placeholder &&
                (el.placeholder.toLowerCase().includes('message') ||
                 el.placeholder.toLowerCase().includes('ask'))
            );
        }

        return textarea;
    }

    // Function to set up the paste interceptor
    function setupPasteInterceptor() {
        const textarea = findTextarea();

        if (textarea) {
            // Add paste event listener
            textarea.addEventListener('paste', function(e) {
                // Get pasted text from clipboard
                const clipboardData = e.clipboardData || window.clipboardData;
                const pastedText = clipboardData.getData('text');

                // Check if pasted text is longer than maxNonPasteLength characters
                if (pastedText && pastedText.length > maxNonPasteLength) {
                    // Prevent default paste
                    e.preventDefault();

                    // Create filename from first 20 chars
                    const filename = cleanFilename(pastedText);

                    // Create and upload file
                    createAndUploadFile(pastedText, filename);
                }
            });

            console.log('Paste interceptor set up successfully');
        } else {
            // If textarea not found yet, try again in a moment
            setTimeout(setupPasteInterceptor, 1000);
        }
    }

    // Observe DOM changes to detect when the textarea is added
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            if (findTextarea()) {
                // Textarea found, set up interceptor and disconnect observer
                setupPasteInterceptor();
                observer.disconnect();
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Try to set up immediately or observe DOM for changes
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            findTextarea() ? setupPasteInterceptor() : observeDOMChanges();
        });
    } else {
        findTextarea() ? setupPasteInterceptor() : observeDOMChanges();
    }
})();