// ==UserScript==
// @name         DC Blind Contest 👁️
// @namespace    https://greasyfork.org/en/users/781396
// @version      1.8
// @description  Displays the hidden entries
// @author       YAD
// @match        https://*.designcontest.com/*/*/*
// @icon         https://designcontest.nyc3.digitaloceanspaces.com/images/favicon.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493567/DC%20Blind%20Contest%20%F0%9F%91%81%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/493567/DC%20Blind%20Contest%20%F0%9F%91%81%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let loading = false; // Track loading state
    let iframeLoadDelay = parseInt(localStorage.getItem('iframeLoadDelay')) || 1000; // Default delay for loading iframe (in ms)
    let nextEntryDelay = parseInt(localStorage.getItem('nextEntryDelay')) || 500; // Default delay before loading the next iframe (in ms)
    const loadedEntries = new Set(); // Track loaded entries

    // Function to create an iframe for each entry and extract the image
    function loadEntryImage(entryURL, targetElement) {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = "block"; // Make the iframe visible for debugging
            iframe.style.width = "1px"; // Set a width for the iframe
            iframe.style.height = "1px"; // Set a height for the iframe
            iframe.style.position = "fixed"; // Position it fixed on the screen
            iframe.style.top = "10px"; // Position it near the top
            iframe.style.left = "10px"; // Position it near the left
            iframe.style.zIndex = "9999"; // Make sure it's on top of other elements
            iframe.src = entryURL; // Load the entry page in the iframe
            document.body.appendChild(iframe);

            // Wait for the iframe to fully load
            iframe.onload = function() {
                setTimeout(() => {
                    try {
                        // Access the content of the iframe
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                        // Extract the og:image meta tag
                        const ogImageTag = iframeDoc.querySelector('meta[property="og:image"]');
                        if (ogImageTag) {
                            const imageUrl = ogImageTag.getAttribute("content");

                            // Clear existing content in the target element
                            targetElement.innerHTML = '';

                            // Create the image element
                            const imgElement = document.createElement('img');
                            imgElement.src = imageUrl;
                            imgElement.alt = "Contest Image";
                            imgElement.className = "contest-card__img";
                            imgElement.style.width = "100%"; // Responsive image
                            imgElement.style.height = "100%"; // Maintain aspect ratio
                            imgElement.onerror = function() {
                                this.src = 'https://designcontest.nyc3.digitaloceanspaces.com/images/contests/no-image-regular.jpg'; // Placeholder image on error
                            };

                            // Create the anchor element for the image
                            const linkElement = document.createElement('a');
                            linkElement.href = entryURL;
                            linkElement.className = "contest-card__link";
                            linkElement.appendChild(imgElement);

                            // Append the link (with the image) into the target element
                            targetElement.appendChild(linkElement);

                            // Mark the entry as loaded
                            loadedEntries.add(entryURL);
                        } else {
                            console.warn('No og:image found in iframe.');
                        }
                    } catch (error) {
                        console.error("Error accessing iframe content:", error);
                    } finally {
                        // Remove the iframe after processing
                        document.body.removeChild(iframe);
                        resolve(); // Resolve the promise when done
                    }
                }, iframeLoadDelay); // Use the iframe load delay from settings
            };

            // Handle iframe load error
            iframe.onerror = function() {
                console.error("Error loading iframe for:", entryURL);
                document.body.removeChild(iframe);
                reject(); // Reject the promise on error
            };
        });
    }

    // Create a button to manually trigger the image loading
    const triggerButton = document.createElement('button');
    triggerButton.innerHTML = '👓'; // Use an emoji for the button
    triggerButton.style.position = 'fixed';
    triggerButton.style.top = '10px';
    triggerButton.style.right = '10px';
    triggerButton.style.zIndex = '9999';
    triggerButton.style.width = '50px'; // Set a fixed width for circular button
    triggerButton.style.height = '50px'; // Set a fixed height for circular button
    triggerButton.style.borderRadius = '50%'; // Make it circular
    triggerButton.style.backgroundColor = '#353535'; // Button background color
    triggerButton.style.color = 'white'; // Text color
    triggerButton.style.border = 'none'; // No border
    triggerButton.style.cursor = 'pointer'; // Pointer cursor
    triggerButton.style.fontSize = '20px'; // Font size
    triggerButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)'; // Shadow effect
    triggerButton.style.display = 'flex'; // Flexbox for centering
    triggerButton.style.alignItems = 'center'; // Center vertically
    triggerButton.style.justifyContent = 'center'; // Center horizontally
    triggerButton.style.transition = 'background-color 0.3s'; // Transition for hover effect

    // Add hover effect
    triggerButton.onmouseover = function() {
        triggerButton.style.backgroundColor = '#0056b3'; // Darker blue on hover
    };
    triggerButton.onmouseout = function() {
        if (!loading) triggerButton.style.backgroundColor = '#353535'; // Original color
    };

    // Add click event to start/stop loading
    triggerButton.addEventListener('click', async () => {
        if (loading) {
            loading = false; // Stop loading
            triggerButton.innerHTML = '👓'; // Reset button to default state
            triggerButton.style.backgroundColor = '#007BFF'; // Original color
            console.log("Loading stopped.");
        } else {
            loading = true; // Start loading
            triggerButton.innerHTML = '👁️'; // Change button to loading state
            const contestEntries = [...document.querySelectorAll('.contest-card__number')];
            if (contestEntries.length > 0) {
                console.log(`${contestEntries.length} contest entries found.`);
                for (let index = 0; index < contestEntries.length && loading; index++) {
                    const entry = contestEntries[index];
                    const entryURL = entry.href; // Get the href from the entry link

                    // Skip already loaded entries
                    if (loadedEntries.has(entryURL)) {
                        console.log(`Entry already loaded: ${entryURL}`);
                        continue; // Skip this entry
                    }

                    const targetElement = entry.closest('.contest-card').querySelector('.contest-card__bg'); // Target the background element
                    triggerButton.style.backgroundColor = '#28A745'; // Change button color to green while loading
                    await loadEntryImage(entryURL, targetElement); // Load the image for this entry
                    await new Promise(resolve => setTimeout(resolve, nextEntryDelay)); // Wait before loading the next iframe
                }
                loading = false; // Stop loading after the loop
                triggerButton.innerHTML = '👓'; // Reset button to default state
                triggerButton.style.backgroundColor = '#353535'; // Original color
            } else {
                console.log('No contest entries found.');
            }
        }
    });

    // Create a small settings button
    const settingsButton = document.createElement('button');
    settingsButton.innerHTML = '⚙️'; // Settings icon
    settingsButton.style.position = 'fixed';
    settingsButton.style.top = '50px'; // Position below the main button
    settingsButton.style.right = '10px';
    settingsButton.style.zIndex = '9999';
    settingsButton.style.width = '30px'; // Small button size
    settingsButton.style.height = '30px'; // Small button size
    settingsButton.style.borderRadius = '50%'; // Make it circular
    settingsButton.style.backgroundColor = '#353535'; // Green background
    settingsButton.style.color = 'white'; // Text color
    settingsButton.style.border = 'none'; // No border
    settingsButton.style.cursor = 'pointer'; // Pointer cursor
    settingsButton.style.fontSize = '9px'; // Font size
    settingsButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)'; // Shadow effect

    // Add hover effect for settings button
    settingsButton.onmouseover = function() {
        settingsButton.style.backgroundColor = '#218838'; // Darker green on hover
    };
    settingsButton.onmouseout = function() {
        settingsButton.style.backgroundColor = '#353535'; // Original color
    };

    // Create settings modal
    const settingsModal = document.createElement('div');
    settingsModal.style.position = 'fixed';
    settingsModal.style.top = '50%';
    settingsModal.style.left = '50%';
    settingsModal.style.transform = 'translate(-50%, -50%)'; // Center the modal
    settingsModal.style.width = '300px';
    settingsModal.style.padding = '20px';
    settingsModal.style.color = '#fff';
    settingsModal.style.backgroundColor = '#353535'; // White background for modal
    settingsModal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)'; // Shadow effect
    settingsModal.style.zIndex = '9999';
    settingsModal.style.borderRadius = '10px';
    settingsModal.style.display = 'none'; // Hidden by default

    // Small close button for settings modal
    const closeButton = document.createElement('buttonx');
    closeButton.innerText = '❌'; // Close icon
    closeButton.style.position = 'absolute';
    closeButton.style.top = '7px';
    closeButton.style.right = '7px';
    closeButton.style.fontSize = '15px'; // Smaller font size for close button
    closeButton.style.backgroundColor = 'transparent'; // Transparent background
    closeButton.style.border = 'none'; // No border
    closeButton.style.cursor = 'pointer'; // Pointer cursor
    closeButton.style.color = 'red'; // Red color for close button
    closeButton.title = 'Close'; // Tooltip for close button

    // Close settings modal
    closeButton.onclick = function() {
        settingsModal.style.display = 'none'; // Close the modal
    };
    settingsModal.appendChild(closeButton); // Append close button to modal

    // Modal title
    const modalTitle = document.createElement('h3');
    modalTitle.innerText = 'Settings:';
    modalTitle.style.fontWeight = 'bold';
    modalTitle.style.paddingBottom = '7px';
    settingsModal.appendChild(modalTitle);

    // Input for iframe load delay
    const iframeDelayLabel = document.createElement('label');
    iframeDelayLabel.innerText = 'Iframe Load Delay (ms): ';
    settingsModal.appendChild(iframeDelayLabel);

    const iframeDelayInput = document.createElement('input');
    iframeDelayInput.type = 'number';
    iframeDelayInput.value = iframeLoadDelay;
    iframeDelayInput.style.width = '100%'; // Full width for input
    settingsModal.appendChild(iframeDelayInput);

    // Input for next entry delay
    const nextEntryDelayLabel = document.createElement('label');
    nextEntryDelayLabel.innerText = 'Next Entry Delay (ms): ';
    settingsModal.appendChild(nextEntryDelayLabel);

    const nextEntryDelayInput = document.createElement('input');
    nextEntryDelayInput.type = 'number';
    nextEntryDelayInput.value = nextEntryDelay;
    nextEntryDelayInput.style.width = '100%'; // Full width for input
    settingsModal.appendChild(nextEntryDelayInput);

    // Save settings button
    const saveButton = document.createElement('button');
    saveButton.innerText = '💾';
    saveButton.style.marginTop = '10px';
    saveButton.style.padding = '5px 10px';
    saveButton.onclick = function() {
        iframeLoadDelay = parseInt(iframeDelayInput.value);
        nextEntryDelay = parseInt(nextEntryDelayInput.value);
        localStorage.setItem('iframeLoadDelay', iframeLoadDelay);
        localStorage.setItem('nextEntryDelay', nextEntryDelay);
        console.log(`Settings saved: iframeLoadDelay=${iframeLoadDelay}, nextEntryDelay=${nextEntryDelay}`);
        settingsModal.style.display = 'none'; // Close modal after saving
    };
    settingsModal.appendChild(saveButton);

    // Reset settings button
    const resetButton = document.createElement('button');
    resetButton.innerText = '🔄️';
    resetButton.style.marginTop = '10px';
    resetButton.style.padding = '5px 10px';
    resetButton.onclick = function() {
        iframeLoadDelay = 1000; // Default value
        nextEntryDelay = 500; // Default value
        iframeDelayInput.value = iframeLoadDelay; // Update input field
        nextEntryDelayInput.value = nextEntryDelay; // Update input field
        localStorage.removeItem('iframeLoadDelay'); // Clear from localStorage
        localStorage.removeItem('nextEntryDelay'); // Clear from localStorage
        console.log('Settings reset to default.');
    };
    settingsModal.appendChild(resetButton);

    // Open settings modal
    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block'; // Show the modal
    });

    // Append buttons to the body
    document.body.appendChild(triggerButton);
    document.body.appendChild(settingsButton);
    document.body.appendChild(settingsModal);
})();
