// ==UserScript==
// @name         ExHentai Download Button with Batch Download Support
// @namespace    https://github.com/troyt-666/exhentai-utilities
// @version      1.3.0
// @description  Adds download buttons (Original, Resample, H@H) to ExHentai/E-Hentai galleries with batch download support. Features progress tracking, error logging, and GP-aware downloading.
// @author       Troy T
// @homepageURL  https://github.com/troyt-666/exhentai-utilities
// @supportURL   https://github.com/troyt-666/exhentai-utilities/issues
// @match        https://exhentai.org/
// @match        https://exhentai.org/?*
// @match        https://exhentai.org/favorites.php*
// @match        https://exhentai.org/tag/*
// @match        https://e-hentai.org/
// @match        https://e-hentai.org/?*
// @match        https://e-hentai.org/favorites.php*
// @match        https://e-hentai.org/tag/*
// @connect      exhentai.org
// @connect      e-hentai.org
// @connect      hath.network
// @connect      *.hath.network
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @icon         https://exhentai.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/510654/ExHentai%20Download%20Button%20with%20Batch%20Download%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/510654/ExHentai%20Download%20Button%20with%20Batch%20Download%20Support.meta.js
// ==/UserScript==

/*
 * ExHentai Download Button with Batch Support
 * 
 * This userscript enhances ExHentai/E-Hentai gallery pages by adding:
 * - Individual download buttons for each gallery (Original, Resample, H@H)
 * - Batch download functionality with progress tracking
 * - Error logging and retry capabilities
 * - Toast notifications for H@H operations
 * 
 * Part of the ExHentai Utilities toolkit:
 * https://github.com/troyt-666/exhentai-utilities
 * 
 * Installation:
 * 1. Install Tampermonkey or compatible userscript manager
 * 2. Click on this script's raw URL
 * 3. Tampermonkey will prompt to install
 * 
 * Usage:
 * - Individual downloads: Click buttons on each gallery
 * - Batch downloads: Use checkboxes and batch panel (top-right)
 * - H@H downloads are queued to your Hentai@Home client
 * 
 * Note: All downloads follow standard ExHentai rules and consume GP
 */

(function() {
    'use strict';

    // Function to show a toast notification with a shrinking progress bar
    function showToast(message) {
        // Create the toast container
        var toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '15px';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
        toast.style.zIndex = '10000';
        toast.style.fontSize = '14px';
        toast.style.display = 'flex';
        toast.style.flexDirection = 'column';  // Stack icon/text and progress bar vertically
        toast.style.alignItems = 'center';
        toast.style.width = '300px';

        // Add an icon (optional)
        var icon = document.createElement('div');
        icon.innerHTML = '&#10004;'; // Checkmark icon (you can replace this with any other icon)
        icon.style.marginBottom = '10px';
        icon.style.color = '#4CAF50'; // Green color for success
        icon.style.fontSize = '20px';
        toast.appendChild(icon);

        // Add the message
        var messageText = document.createElement('span');
        messageText.textContent = message;
        toast.appendChild(messageText);

        // Create a progress bar at the bottom of the toast
        var progressBar = document.createElement('div');
        progressBar.style.height = '5px';
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = '#4CAF50';  // Green progress bar
        progressBar.style.borderRadius = '0 0 5px 5px';  // Rounded corners only at the bottom
        progressBar.style.transition = 'width 3s linear';  // Smooth shrink over 3 seconds
        toast.appendChild(progressBar);

        // Append the toast to the body
        document.body.appendChild(toast);

        // Start the progress bar shrinking
        setTimeout(function() {
            progressBar.style.width = '0';  // Shrink the width to 0 over 3 seconds
        }, 100);  // Small delay to ensure the progress bar appears at full width first

        // Automatically remove the toast after 3 seconds
        setTimeout(function() {
            toast.style.transition = 'opacity 0.5s ease-in-out';
            toast.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(toast);
            }, 500); // Wait for the fade-out transition to complete
        }, 3000); // Display for 3 seconds
    }

    // Function to show batch download progress
    function showBatchProgress(current, total, galleryTitle = '') {
        // Remove existing progress modal if any
        var existingModal = document.getElementById('batch-progress-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create progress modal
        var modal = document.createElement('div');
        modal.id = 'batch-progress-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.padding = '20px';
        modal.style.backgroundColor = '#333';
        modal.style.color = '#fff';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0px 0px 20px rgba(0,0,0,0.8)';
        modal.style.zIndex = '10001';
        modal.style.fontSize = '14px';
        modal.style.width = '400px';
        modal.style.textAlign = 'center';

        // Title
        var title = document.createElement('h3');
        title.textContent = 'Batch H@H Download Progress';
        title.style.margin = '0 0 15px 0';
        title.style.color = '#4CAF50';
        modal.appendChild(title);

        // Current gallery info
        var currentInfo = document.createElement('div');
        currentInfo.textContent = galleryTitle ? `Processing: ${galleryTitle}` : `Processing gallery ${current} of ${total}`;
        currentInfo.style.marginBottom = '15px';
        currentInfo.style.fontSize = '12px';
        modal.appendChild(currentInfo);

        // Progress bar container
        var progressContainer = document.createElement('div');
        progressContainer.style.width = '100%';
        progressContainer.style.height = '20px';
        progressContainer.style.backgroundColor = '#555';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.overflow = 'hidden';
        progressContainer.style.marginBottom = '10px';

        // Progress bar
        var progressBar = document.createElement('div');
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.width = ((current / total) * 100) + '%';
        progressBar.style.transition = 'width 0.3s ease';
        progressContainer.appendChild(progressBar);
        modal.appendChild(progressContainer);

        // Progress text
        var progressText = document.createElement('div');
        progressText.textContent = `${current} of ${total} completed (${Math.round((current / total) * 100)}%)`;
        progressText.style.fontSize = '12px';
        modal.appendChild(progressText);

        document.body.appendChild(modal);
    }

    // Function to hide batch progress
    function hideBatchProgress() {
        var modal = document.getElementById('batch-progress-modal');
        if (modal) {
            modal.remove();
        }
    }


    // Create batch download control panel
    function createBatchDownloadPanel() {
        var panel = document.createElement('div');
        panel.id = 'batch-download-panel';
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.backgroundColor = '#333';
        panel.style.color = '#fff';
        panel.style.borderRadius = '5px';
        panel.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
        panel.style.zIndex = '9999';
        panel.style.fontSize = '12px';
        panel.style.transition = 'all 0.3s ease';

        // Create toggle button (always visible)
        var toggleButton = document.createElement('div');
        toggleButton.id = 'batch-toggle-btn';
        toggleButton.innerHTML = '📥 Batch H@H';
        toggleButton.style.padding = '8px 12px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.backgroundColor = '#4CAF50';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.textAlign = 'center';
        toggleButton.style.userSelect = 'none';
        toggleButton.style.fontSize = '11px';
        toggleButton.title = 'Click to expand/collapse batch download panel';
        panel.appendChild(toggleButton);

        // Create collapsible content container
        var contentContainer = document.createElement('div');
        contentContainer.id = 'batch-content';
        contentContainer.style.display = 'none';
        contentContainer.style.padding = '10px';
        contentContainer.style.borderTop = '1px solid #555';
        contentContainer.style.marginTop = '0';

        // Title for expanded view
        var title = document.createElement('div');
        title.textContent = 'Batch H@H Download';
        title.style.fontWeight = 'bold';
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';
        contentContainer.appendChild(title);

        // Controls container
        var controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.flexDirection = 'column';
        controls.style.gap = '8px';
        controls.style.minWidth = '180px';

        // Select All/None buttons
        var selectButtonsContainer = document.createElement('div');
        selectButtonsContainer.style.display = 'flex';
        selectButtonsContainer.style.gap = '5px';

        var selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.style.flex = '1';
        selectAllBtn.style.padding = '3px 6px';
        selectAllBtn.style.fontSize = '11px';
        selectAllBtn.style.cursor = 'pointer';
        selectAllBtn.style.border = '1px solid #555';
        selectAllBtn.style.backgroundColor = '#444';
        selectAllBtn.style.color = '#fff';
        selectAllBtn.style.borderRadius = '3px';

        var selectNoneBtn = document.createElement('button');
        selectNoneBtn.textContent = 'Select None';
        selectNoneBtn.style.flex = '1';
        selectNoneBtn.style.padding = '3px 6px';
        selectNoneBtn.style.fontSize = '11px';
        selectNoneBtn.style.cursor = 'pointer';
        selectNoneBtn.style.border = '1px solid #555';
        selectNoneBtn.style.backgroundColor = '#444';
        selectNoneBtn.style.color = '#fff';
        selectNoneBtn.style.borderRadius = '3px';

        selectButtonsContainer.appendChild(selectAllBtn);
        selectButtonsContainer.appendChild(selectNoneBtn);
        controls.appendChild(selectButtonsContainer);

        // Selected count
        var selectedCount = document.createElement('div');
        selectedCount.id = 'selected-count';
        selectedCount.textContent = 'Selected: 0';
        selectedCount.style.textAlign = 'center';
        selectedCount.style.fontSize = '11px';
        selectedCount.style.color = '#aaa';
        controls.appendChild(selectedCount);

        // Download button
        var batchDownloadBtn = document.createElement('button');
        batchDownloadBtn.textContent = 'Download Selected H@H';
        batchDownloadBtn.style.padding = '8px';
        batchDownloadBtn.style.fontSize = '11px';
        batchDownloadBtn.style.cursor = 'pointer';
        batchDownloadBtn.style.border = '1px solid #4CAF50';
        batchDownloadBtn.style.backgroundColor = '#4CAF50';
        batchDownloadBtn.style.color = '#fff';
        batchDownloadBtn.style.borderRadius = '3px';
        batchDownloadBtn.style.fontWeight = 'bold';
        controls.appendChild(batchDownloadBtn);

        // Error log container (initially hidden)
        var errorLogContainer = document.createElement('div');
        errorLogContainer.id = 'error-log-container';
        errorLogContainer.style.display = 'none';
        errorLogContainer.style.marginTop = '8px';
        errorLogContainer.style.border = '1px solid #ff6b6b';
        errorLogContainer.style.borderRadius = '3px';
        errorLogContainer.style.backgroundColor = '#2a1a1a';

        var errorLogTitle = document.createElement('div');
        errorLogTitle.textContent = 'Download Errors:';
        errorLogTitle.style.fontSize = '10px';
        errorLogTitle.style.color = '#ff6b6b';
        errorLogTitle.style.padding = '3px 5px';
        errorLogTitle.style.borderBottom = '1px solid #ff6b6b';
        errorLogTitle.style.fontWeight = 'bold';
        errorLogContainer.appendChild(errorLogTitle);

        var errorLogText = document.createElement('textarea');
        errorLogText.id = 'error-log-text';
        errorLogText.style.width = '100%';
        errorLogText.style.height = '80px';
        errorLogText.style.fontSize = '9px';
        errorLogText.style.backgroundColor = 'transparent';
        errorLogText.style.color = '#ff9999';
        errorLogText.style.border = 'none';
        errorLogText.style.padding = '5px';
        errorLogText.style.resize = 'none';
        errorLogText.style.outline = 'none';
        errorLogText.readOnly = true;
        errorLogContainer.appendChild(errorLogText);

        var clearLogBtn = document.createElement('button');
        clearLogBtn.textContent = 'Clear Log';
        clearLogBtn.style.width = '100%';
        clearLogBtn.style.padding = '3px';
        clearLogBtn.style.fontSize = '9px';
        clearLogBtn.style.cursor = 'pointer';
        clearLogBtn.style.border = '1px solid #ff6b6b';
        clearLogBtn.style.backgroundColor = '#ff6b6b';
        clearLogBtn.style.color = '#fff';
        clearLogBtn.style.borderRadius = '0 0 3px 3px';
        clearLogBtn.addEventListener('click', function() {
            errorLogText.value = '';
            errorLogContainer.style.display = 'none';
        });
        errorLogContainer.appendChild(clearLogBtn);

        controls.appendChild(errorLogContainer);

        contentContainer.appendChild(controls);
        panel.appendChild(contentContainer);
        document.body.appendChild(panel);

        // Toggle functionality
        var isExpanded = false;
        toggleButton.addEventListener('click', function() {
            isExpanded = !isExpanded;
            if (isExpanded) {
                contentContainer.style.display = 'block';
                toggleButton.innerHTML = '📤 Batch H@H';
                toggleButton.style.backgroundColor = '#ff6b6b';
                toggleButton.title = 'Click to collapse panel';
            } else {
                contentContainer.style.display = 'none';
                toggleButton.innerHTML = '📥 Batch H@H';
                toggleButton.style.backgroundColor = '#4CAF50';
                toggleButton.title = 'Click to expand panel';
            }
        });

        // Event listeners
        selectAllBtn.addEventListener('click', function() {
            var checkboxes = document.querySelectorAll('.gallery-batch-checkbox');
            checkboxes.forEach(function(cb) { cb.checked = true; });
            updateSelectedCount();
        });

        selectNoneBtn.addEventListener('click', function() {
            var checkboxes = document.querySelectorAll('.gallery-batch-checkbox');
            checkboxes.forEach(function(cb) { cb.checked = false; });
            updateSelectedCount();
        });

        batchDownloadBtn.addEventListener('click', function() {
            startBatchDownload();
        });
    }

    // Function to update selected count
    function updateSelectedCount() {
        var checkboxes = document.querySelectorAll('.gallery-batch-checkbox:checked');
        var countElement = document.getElementById('selected-count');
        if (countElement) {
            countElement.textContent = 'Selected: ' + checkboxes.length;
        }
    }

    // Function to log errors
    function logError(galleryTitle, galleryLink, errorMessage) {
        var errorLogText = document.getElementById('error-log-text');
        var errorLogContainer = document.getElementById('error-log-container');
        
        if (errorLogText && errorLogContainer) {
            var timestamp = new Date().toLocaleTimeString();
            var logEntry = `[${timestamp}] ${galleryTitle}\n${galleryLink}\nError: ${errorMessage}\n\n`;
            errorLogText.value += logEntry;
            errorLogContainer.style.display = 'block';
            
            // Scroll to bottom of textarea
            errorLogText.scrollTop = errorLogText.scrollHeight;
        }
    }

    // Create the batch download panel
    createBatchDownloadPanel();

    // Loop through all gallery items on the search page
    var galleryItems = document.querySelectorAll('.gl1t');

    galleryItems.forEach(function(item) {
        var galleryLink = item.querySelector('a').href; // Get the gallery link
        var galleryTitle = item.querySelector('.gl4t.glname.glink') ? 
                          item.querySelector('.gl4t.glname.glink').textContent.trim() : 
                          (item.querySelector('img') ? item.querySelector('img').title : 'Unknown Gallery'); // Get gallery title

        // Add checkbox for batch download
        var checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.alignItems = 'center';
        checkboxContainer.style.gap = '5px';
        checkboxContainer.style.marginBottom = '5px';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'gallery-batch-checkbox';
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('change', updateSelectedCount);
        // Store gallery data for batch processing
        checkbox.dataset.galleryLink = galleryLink;
        checkbox.dataset.galleryTitle = galleryTitle;

        var checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = 'Batch H@H';
        checkboxLabel.style.fontSize = '11px';
        checkboxLabel.style.cursor = 'pointer';
        checkboxLabel.addEventListener('click', function() {
            checkbox.checked = !checkbox.checked;
            updateSelectedCount();
        });

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxLabel);
        item.appendChild(checkboxContainer);

        // Create a container div for buttons
        var buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex'; // Flex container for side-by-side buttons
        buttonContainer.style.gap = '5px'; // Gap between the buttons

        // Create a button style function to match the existing page style
        function createButton(text) {
            var button = document.createElement('button');
            button.innerText = text;
            button.style.padding = '5px 10px';  // Padding similar to the existing button style
            button.style.cursor = 'pointer';    // Pointer cursor for interaction
            button.style.border = '1px solid #ccc';  // Light border similar to the website
            button.style.backgroundColor = 'transparent'; // Match the page background color
            button.style.color = 'inherit';  // Use the same text color as the page
            button.style.fontSize = '12px';  // Match the font size for the website
            return button;
        }

        // Create the Original Archive button
        var downloadOriginalButton = createButton('Download Orginal');

        // Create the Resample Archive button
        var downloadResampleButton = createButton('Download Resample');

        // Create the Remote Server Download button (H@H)
        var downloadHaHButton = createButton('Download H@H');

        // Add all buttons to the container
        buttonContainer.appendChild(downloadOriginalButton);
        buttonContainer.appendChild(downloadResampleButton);
        buttonContainer.appendChild(downloadHaHButton);

        // Add the button container to the gallery item
        item.appendChild(buttonContainer);

        // Helper function to handle downloads (Original, Resample, or H@H)
        function handleDownloadButton(archiveType) {
            console.log("Fetching gallery page: " + galleryLink); // Log the gallery link being accessed
            if (archiveType === 'hath') {
                showToast("Fetching gallery page...");
            }

            // Step 1: Fetch the gallery page to find the archive download link
            GM_xmlhttpRequest({
                method: 'GET',
                url: galleryLink,
                onload: function(response) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response.responseText, 'text/html');

                    // Find the anchor element with "onclick" containing "popUp"
                    var archiveDownloadAnchor = doc.querySelector('a[onclick^="return popUp"]');
                    
                    if (archiveDownloadAnchor) {
                        console.log("Found archiveDownloadAnchor:", archiveDownloadAnchor); // Log the anchor element
                        if (archiveType === 'hath') {
                            showToast("Found archive download link!");
                        }

                        // Extract the URL from the onclick attribute (popUp() call)
                        var onclickContent = archiveDownloadAnchor.getAttribute('onclick');
                        var archiveUrlMatch = onclickContent.match(/popUp\('(.+?)'/);
                        
                        if (archiveUrlMatch && archiveUrlMatch[1]) {
                            var archiveUrl = archiveUrlMatch[1];
                            console.log("Extracted archive URL:", archiveUrl); // Log the extracted URL
                            if (archiveType === 'hath') {
                                showToast("Extracted archive URL successfully!");
                            }

                            // Step 2: Fetch the page where the form exists
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: archiveUrl,
                                onload: function(archivePageResponse) {
                                    var archiveDoc = parser.parseFromString(archivePageResponse.responseText, 'text/html');

                                    // Check if we are handling the H@H download
                                    if (archiveType === 'hath') {
                                        // Handle H@H download by submitting the form for H@H server
                                        var formElement = archiveDoc.querySelector('#hathdl_form');
                                        if (formElement) {
                                            var formAction = formElement.getAttribute('action');
                                            var formData = new FormData(formElement);
                                            formData.set('hathdl_xres', 'org'); // Set to 'Original'

                                            // Submit the form for remote server download
                                            GM_xmlhttpRequest({
                                                method: 'POST',
                                                url: formAction,
                                                data: new URLSearchParams(formData), // Simulate the form submission
                                                onload: function(formSubmitResponse) {
                                                    var successMessage = "An original resolution download has been queued for client";
                                                    if (formSubmitResponse.responseText.includes(successMessage)) {
                                                        showToast("H@H download successfully queued!");
                                                        console.log("H@H download successfully queued.");
                                                    } else {
                                                        showToast("Failed to queue H@H download.");
                                                        console.log("Failed to queue H@H download.");
                                                    }
                                                }
                                            });
                                        } else {
                                            showToast('H@H form not found!');
                                            console.log("Form element for H@H download not found.");
                                        }
                                        return;
                                    }

                                    // For original or resample downloads
                                    var formElement = archiveDoc.querySelector('form[action*="archiver.php"]');
                                    var formAction = formElement.getAttribute('action');
                                    console.log("Form action URL:", formAction); // Log the form action URL

                                    // Step 3: Simulate submitting the form by POSTing the request
                                    var dltypeValue = archiveType === 'original' ? 'org' : 'res';
                                    GM_xmlhttpRequest({
                                        method: 'POST',
                                        url: formAction,
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        data: `dltype=${dltypeValue}&dlcheck=Download ${archiveType === 'original' ? 'Original' : 'Resample'} Archive`,
                                        onload: function(formSubmitResponse) {
                                            var formSubmitDoc = parser.parseFromString(formSubmitResponse.responseText, 'text/html');

                                            // Extract the final redirect URL
                                            var redirectLink = formSubmitDoc.querySelector('#continue a') || formSubmitDoc.querySelector('script').innerText.match(/document\.location\s*=\s*"(.+?)"/)[1];

                                            if (redirectLink) {
                                                console.log(`Found final ${archiveType} download URL from redirect:`, redirectLink);

                                                // Poll for the final download link
                                                var checkForDownloadLink = function() {
                                                    GM_xmlhttpRequest({
                                                        method: 'GET',
                                                        url: redirectLink,
                                                        onload: function(downloadPageResponse) {
                                                            var downloadDoc = parser.parseFromString(downloadPageResponse.responseText, 'text/html');

                                                            // Check for the download link or message
                                                            var finalDownloadLink = downloadDoc.querySelector('a[href^="/archive/"]') || downloadDoc.body.innerHTML.includes("Click Here To Start Downloading");

                                                            if (finalDownloadLink) {
                                                                var finalUrl = redirectLink + "?start=1";
                                                                console.log("Final download URL:", finalUrl);
                                                                var a = document.createElement('a');
                                                                a.href = finalUrl;
                                                                a.style.display = 'none';
                                                                document.body.appendChild(a);
                                                                a.click();
                                                                document.body.removeChild(a);
                                                            } else {
                                                                console.log("Download link not available yet. Retrying in 2 seconds...");
                                                                setTimeout(checkForDownloadLink, 2000);
                                                            }
                                                        }
                                                    });
                                                };

                                                // Start polling for the download link
                                                checkForDownloadLink();
                                            } else {
                                                alert('Could not extract the final download URL!');
                                                console.log("Redirect URL not found in page:", formSubmitResponse.responseText);
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            alert('Could not extract archive URL from onclick attribute!');
                            console.log("Onclick content:", onclickContent);
                        }
                    } else {
                        alert('Archive download link not found!');
                        console.log("Archive download link not found in page:", response.responseText);
                    }
                }
            });
        }

        // Add event listeners for all buttons
        downloadOriginalButton.addEventListener('click', function() {
            handleDownloadButton('original');
        });
        downloadResampleButton.addEventListener('click', function() {
            handleDownloadButton('resample');
        });
        downloadHaHButton.addEventListener('click', function() {
            handleDownloadButton('hath');
        });
    });

    // Batch download functionality
    function startBatchDownload() {
        var selectedCheckboxes = document.querySelectorAll('.gallery-batch-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            showToast('Please select at least one gallery to download.');
            return;
        }

        var totalCount = selectedCheckboxes.length;
        var currentCount = 0;
        var successCount = 0;
        var failCount = 0;

        showToast(`Starting batch download of ${totalCount} galleries...`);

        // Process downloads sequentially with delay
        function processNextDownload() {
            if (currentCount >= totalCount) {
                // All downloads completed
                hideBatchProgress();
                showToast(`Batch download completed! Success: ${successCount}, Failed: ${failCount}`);
                return;
            }

            var checkbox = selectedCheckboxes[currentCount];
            var galleryLink = checkbox.dataset.galleryLink;
            var galleryTitle = checkbox.dataset.galleryTitle;

            showBatchProgress(currentCount + 1, totalCount, galleryTitle);

            // Process H@H download for this gallery
            processGalleryHaHDownload(galleryLink, galleryTitle, function(success, errorMessage) {
                if (success) {
                    successCount++;
                } else {
                    failCount++;
                    if (errorMessage) {
                        logError(galleryTitle, galleryLink, errorMessage);
                    }
                }
                currentCount++;
                
                // Wait 800ms before processing next download to avoid rate limiting
                setTimeout(processNextDownload, 800);
            });
        }

        // Start processing
        processNextDownload();
    }

    // Function to process H@H download for a single gallery
    function processGalleryHaHDownload(galleryLink, galleryTitle, callback) {
        console.log("[TRACE] Batch processing gallery: " + galleryLink);
        console.log("[TRACE] Gallery title: " + galleryTitle);
        console.log("[TRACE] Fetching gallery page: " + galleryLink);

        GM_xmlhttpRequest({
            method: 'GET',
            url: galleryLink,
            onload: function(response) {
                if (response.status !== 200) {
                    console.log("[TRACE] Failed to fetch gallery page, HTTP status: " + response.status);
                    callback(false, `Failed to fetch gallery page (HTTP ${response.status})`);
                    return;
                }

                console.log("[TRACE] Successfully fetched gallery page");
                var parser = new DOMParser();
                var doc = parser.parseFromString(response.responseText, 'text/html');

                var archiveDownloadAnchor = doc.querySelector('a[onclick^="return popUp"]');
                
                if (archiveDownloadAnchor) {
                    console.log("[TRACE] Found archiveDownloadAnchor:", archiveDownloadAnchor);
                    console.log("[TRACE] Found archive download link!");
                    
                    var onclickContent = archiveDownloadAnchor.getAttribute('onclick');
                    console.log("[TRACE] Onclick content: " + onclickContent);
                    var archiveUrlMatch = onclickContent.match(/popUp\('(.+?)'/);
                    
                    if (archiveUrlMatch && archiveUrlMatch[1]) {
                        var archiveUrl = archiveUrlMatch[1];
                        console.log("[TRACE] Extracted archive URL: " + archiveUrl);
                        console.log("[TRACE] Extracted archive URL successfully!");

                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: archiveUrl,
                            onload: function(archivePageResponse) {
                                if (archivePageResponse.status !== 200) {
                                    console.log("[TRACE] Failed to fetch archive page, HTTP status: " + archivePageResponse.status);
                                    callback(false, `Failed to fetch archive page (HTTP ${archivePageResponse.status})`);
                                    return;
                                }

                                console.log("[TRACE] Successfully fetched archive page");
                                var archiveDoc = parser.parseFromString(archivePageResponse.responseText, 'text/html');

                                var formElement = archiveDoc.querySelector('#hathdl_form');
                                if (formElement) {
                                    console.log("[TRACE] Found H@H form element");
                                    var formAction = formElement.getAttribute('action');
                                    console.log("[TRACE] Form action URL: " + formAction);
                                    var formData = new FormData(formElement);
                                    formData.set('hathdl_xres', 'org');
                                    console.log("[TRACE] Set hathdl_xres to 'org' for original resolution");

                                    console.log("[TRACE] Submitting H@H form...");
                                    GM_xmlhttpRequest({
                                        method: 'POST',
                                        url: formAction,
                                        data: new URLSearchParams(formData),
                                        onload: function(formSubmitResponse) {
                                            if (formSubmitResponse.status !== 200) {
                                                console.log("[TRACE] Failed to submit H@H form, HTTP status: " + formSubmitResponse.status);
                                                callback(false, `Failed to submit H@H form (HTTP ${formSubmitResponse.status})`);
                                                return;
                                            }

                                            console.log("[TRACE] Successfully submitted H@H form");
                                            var successMessage = "An original resolution download has been queued for client";
                                            var success = formSubmitResponse.responseText.includes(successMessage);
                                            
                                            if (success) {
                                                console.log("[TRACE] H@H download successfully queued for: " + galleryTitle);
                                                callback(true);
                                            } else {
                                                console.log("[TRACE] H@H queue failed - success message not found in response");
                                                console.log("[TRACE] Response text: " + formSubmitResponse.responseText.substring(0, 500) + "...");
                                                // Try to extract error message from response
                                                var errorDoc = parser.parseFromString(formSubmitResponse.responseText, 'text/html');
                                                var errorElement = errorDoc.querySelector('.stuffbox') || errorDoc.querySelector('p');
                                                var errorText = errorElement ? errorElement.textContent.trim() : 'Unknown error occurred';
                                                console.log("[TRACE] Extracted error text: " + errorText);
                                                callback(false, `H@H queue failed: ${errorText}`);
                                            }
                                        },
                                        onerror: function(error) {
                                            console.log("[TRACE] Network error submitting H@H form: " + (error.error || 'Unknown network error'));
                                            callback(false, `Network error submitting H@H form: ${error.error || 'Unknown network error'}`);
                                        }
                                    });
                                } else {
                                    console.log("[TRACE] H@H form element not found on archive page");
                                    console.log("[TRACE] Archive page HTML: " + archivePageResponse.responseText.substring(0, 1000) + "...");
                                    callback(false, 'H@H form not found on archive page');
                                }
                            },
                            onerror: function(error) {
                                console.log("[TRACE] Network error fetching archive page: " + (error.error || 'Unknown network error'));
                                callback(false, `Network error fetching archive page: ${error.error || 'Unknown network error'}`);
                            }
                        });
                    } else {
                        console.log("[TRACE] Could not extract archive URL from onclick attribute");
                        console.log("[TRACE] Onclick content was: " + onclickContent);
                        callback(false, 'Could not extract archive URL from gallery page');
                    }
                } else {
                    console.log("[TRACE] Archive download link not found on gallery page");
                    console.log("[TRACE] Gallery page HTML: " + response.responseText.substring(0, 1000) + "...");
                    callback(false, 'Archive download link not found on gallery page');
                }
            },
            onerror: function(error) {
                console.log("[TRACE] Network error fetching gallery page: " + (error.error || 'Unknown network error'));
                callback(false, `Network error fetching gallery page: ${error.error || 'Unknown network error'}`);
            }
        });
    }
})();
