// ==UserScript==
// @name         HailuoAI Minimax Video Prompt Queue and Bulk Download
// @namespace    http://tampermonkey.net/
// @version      3.15
// @description  Allows queuing multiple prompts and images for HailuoAI Video generator and adds bulk download functionality with enhanced queue control features. Visit https://github.com/BillarySquintin/Billy_Scripts/
// @author       Billary
// @match        https://hailuoai.video/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512177/HailuoAI%20Minimax%20Video%20Prompt%20Queue%20and%20Bulk%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/512177/HailuoAI%20Minimax%20Video%20Prompt%20Queue%20and%20Bulk%20Download.meta.js
// ==/UserScript==


(function() {
    'use strict';

    if (!window.location.href.startsWith('https://hailuoai.video/')) {
        return;
    }

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.left = '0';
    buttonContainer.style.right = '0';
    buttonContainer.style.zIndex = '1000';
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.alignItems = 'center';
    document.body.appendChild(buttonContainer);

    // Create the Selected Videos Counter
    const selectedCounter = document.createElement('div');
    selectedCounter.textContent = '';
    selectedCounter.style.backgroundColor = '#007BFF';
    selectedCounter.style.color = 'white';
    selectedCounter.style.padding = '5px 10px';
    selectedCounter.style.borderRadius = '5px';
    selectedCounter.style.marginRight = '10px';
    selectedCounter.style.display = 'none'; // Initially hidden
    buttonContainer.appendChild(selectedCounter);

    // Create the Prompt Queue button
    const queueButton = document.createElement("button");
    queueButton.innerHTML = "Prompt Queue";
    queueButton.style.backgroundColor = "#4CAF50";
    queueButton.style.color = "white";
    queueButton.style.border = "none";
    queueButton.style.padding = "10px";
    queueButton.style.borderRadius = "5px";
    queueButton.style.cursor = "pointer";
    queueButton.style.margin = '0 5px';
    buttonContainer.appendChild(queueButton);

    // Create the Bulk Download button
    const bulkDownloadButton = document.createElement("button");
    bulkDownloadButton.innerHTML = "Bulk Download";
    bulkDownloadButton.style.backgroundColor = "#4CAF50";
    bulkDownloadButton.style.color = "white";
    bulkDownloadButton.style.border = "none";
    bulkDownloadButton.style.padding = "10px";
    bulkDownloadButton.style.borderRadius = "5px";
    bulkDownloadButton.style.cursor = "pointer";
    bulkDownloadButton.style.margin = '0 5px';
    buttonContainer.appendChild(bulkDownloadButton);

    // Create the Toggle Autoplay button
    const toggleAutoplayButton = document.createElement("button");
    toggleAutoplayButton.innerHTML = "Disable Autoplay";
    toggleAutoplayButton.style.backgroundColor = "#4CAF50";
    toggleAutoplayButton.style.color = "white";
    toggleAutoplayButton.style.border = "none";
    toggleAutoplayButton.style.padding = "10px";
    toggleAutoplayButton.style.borderRadius = "5px";
    toggleAutoplayButton.style.cursor = "pointer";
    toggleAutoplayButton.style.margin = '0 5px';
    buttonContainer.appendChild(toggleAutoplayButton);

    // Create the Pause All Videos button
    const pauseAllButton = document.createElement("button");
    pauseAllButton.innerHTML = "Pause All Videos";
    pauseAllButton.style.backgroundColor = "#4CAF50";
    pauseAllButton.style.color = "white";
    pauseAllButton.style.border = "none";
    pauseAllButton.style.padding = "10px";
    pauseAllButton.style.borderRadius = "5px";
    pauseAllButton.style.cursor = "pointer";
    pauseAllButton.style.margin = '0 5px';
    buttonContainer.appendChild(pauseAllButton);

    // Function to generate a random delay between min and max milliseconds
    function getRandomDelay(minMs, maxMs) {
        return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    }

    // Variable to track autoplay state
    let isAutoplayEnabled = true;

    // Function to update video autoplay settings
    function updateVideoAutoplay() {
        let videoElements = document.querySelectorAll('div.video-cards video');
        videoElements.forEach(function(video) {
            if (isAutoplayEnabled) {
                video.setAttribute('autoplay', '');
                video.muted = true;
            } else {
                video.removeAttribute('autoplay');
                video.pause();
            }
        });
    }

    // Function to handle video hover events
    function handleVideoHover(event) {
        if (!isAutoplayEnabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    // Function to add hover event listeners to video cards
    function addHoverListeners() {
        let videoCards = document.querySelectorAll('div.video-cards');
        videoCards.forEach(function(card) {
            if (!card.getAttribute('data-hover-listener-added')) {
                card.addEventListener('mouseenter', handleVideoHover, true);
                card.addEventListener('mouseover', handleVideoHover, true);
                card.setAttribute('data-hover-listener-added', 'true');
            }
        });
    }

    // Observer to watch for new video elements being added to the page
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                updateVideoAutoplay();
                addHoverListeners();
            }
        });
    });

    // Start observing the body for changes in the child elements
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial setup
    updateVideoAutoplay();
    addHoverListeners();

    // Event listener for Toggle Autoplay button
    toggleAutoplayButton.addEventListener('click', function() {
        isAutoplayEnabled = !isAutoplayEnabled;
        toggleAutoplayButton.innerHTML = isAutoplayEnabled ? "Disable Autoplay" : "Enable Autoplay";
        updateVideoAutoplay();
    });

    // Event listener for Pause All Videos button
    pauseAllButton.addEventListener('click', function() {
        let videoElements = document.querySelectorAll('div.video-cards video');
        videoElements.forEach(function(video) {
            video.pause();
        });
    });

    // Create a container div for the prompt queue
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '10000';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.padding = '10px';
    container.style.maxWidth = '400px';
    container.style.overflowY = 'auto';
    container.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    container.style.borderRadius = '8px';
    container.style.display = 'none';

    // Create a close button for the container
    var closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
        container.style.display = 'none';
    });
    container.appendChild(closeButton);

    // Create a label for the textarea
    var label = document.createElement('label');
    label.textContent = 'Enter your prompts here (JSON format for images), separated by "---":';
    label.style.display = 'block';
    label.style.marginBottom = '5px';
    container.appendChild(label);

    // Create a textarea for prompts
    var textarea = document.createElement('textarea');
    textarea.rows = 10;
    textarea.cols = 40;
    textarea.placeholder = 'Enter your prompts here, separated by "---"';
    textarea.style.width = '100%';
    textarea.style.boxSizing = 'border-box';
    container.appendChild(textarea);

    // Create a label and input for Repeat Count
    var repeatLabel = document.createElement('label');
    repeatLabel.textContent = 'Repeat Count (default 1, "~" for infinity):';
    repeatLabel.style.display = 'block';
    repeatLabel.style.marginTop = '10px';
    container.appendChild(repeatLabel);

    var repeatInput = document.createElement('input');
    repeatInput.type = 'text';
    repeatInput.value = '1';
    repeatInput.style.width = '100%';
    container.appendChild(repeatInput);

    // Create a label and input for Starting Prompt Number
    var startPromptLabel = document.createElement('label');
    startPromptLabel.textContent = 'Starting Prompt Number (default 1):';
    startPromptLabel.style.display = 'block';
    startPromptLabel.style.marginTop = '10px';
    container.appendChild(startPromptLabel);

    var startPromptInput = document.createElement('input');
    startPromptInput.type = 'number';
    startPromptInput.value = '1';
    startPromptInput.min = '1';
    startPromptInput.style.width = '100%';
    container.appendChild(startPromptInput);

    // Create a label to display the current batch number
    var batchLabel = document.createElement('label');
    batchLabel.textContent = 'Current Batch: 0';
    batchLabel.style.display = 'block';
    batchLabel.style.marginTop = '10px';
    container.appendChild(batchLabel);

    // Create a label to display the current prompt number
    var promptCounterLabel = document.createElement('label');
    promptCounterLabel.textContent = 'Current Prompt: 0 / 0';
    promptCounterLabel.style.display = 'block';
    promptCounterLabel.style.marginTop = '10px';
    container.appendChild(promptCounterLabel);

    // Create control buttons (Pause, Back, Hold)
    var controlButtonsContainer = document.createElement('div');
    controlButtonsContainer.style.marginTop = '10px';
    container.appendChild(controlButtonsContainer);

    var pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause Queue';
    pauseButton.style.marginRight = '10px';
    pauseButton.style.padding = '5px 10px';
    pauseButton.style.cursor = 'pointer';
    controlButtonsContainer.appendChild(pauseButton);

    var backButton = document.createElement('button');
    backButton.textContent = 'Go Back One';
    backButton.style.marginRight = '10px';
    backButton.style.padding = '5px 10px';
    backButton.style.cursor = 'pointer';
    controlButtonsContainer.appendChild(backButton);

    var holdButton = document.createElement('button');
    holdButton.textContent = 'Hold Current Prompt';
    holdButton.style.padding = '5px 10px';
    holdButton.style.cursor = 'pointer';
    controlButtonsContainer.appendChild(holdButton);

    // Create an "Add Images" button
    var addImagesButton = document.createElement('button');
    addImagesButton.textContent = 'Add Images';
    addImagesButton.style.marginTop = '10px';
    addImagesButton.style.marginRight = '10px';
    addImagesButton.style.padding = '5px 10px';
    addImagesButton.style.cursor = 'pointer';
    container.appendChild(addImagesButton);

    // Create a start button
    var startButton = document.createElement('button');
    startButton.textContent = 'Start Queue';
    startButton.style.marginTop = '10px';
    startButton.style.padding = '5px 10px';
    startButton.style.cursor = 'pointer';
    container.appendChild(startButton);

    // Append the container to the body
    document.body.appendChild(container);

    // Add an event listener to the queueButton to toggle the prompt queue container
    queueButton.addEventListener('click', function() {
        container.style.display = (container.style.display === 'none') ? 'block' : 'none';
    });

    // Store images added via "Add Images" button
    var imagesMap = new Map();

    // Handle adding images through file selection
    addImagesButton.addEventListener('click', function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.jpg,.jpeg,.png';
        fileInput.multiple = true;
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function(event) {
            var files = event.target.files;
            if (files.length === 0) return;

            Array.from(files).forEach(function(file) {
                imagesMap.set(file.name, file);
            });

            alert('Images have been added. Please ensure the filenames in your JSON input match the selected images.');
        });

        fileInput.click();
    });

    // Initialize variables
    var promptQueue = [];
    var originalPromptQueue = [];
    var totalRepeatCount = 1;
    var currentRepeat = 0;
    var startingPromptIndex = 1;
    var currentPromptNumber = 0;
    var totalPromptCount = 0;
    var totalPrompts = 0;
    var isPaused = false;
    var isHolding = false;

    // Now, when the start button is clicked, we start processing the prompts
    startButton.addEventListener('click', function() {
        // Clear previous queue
        promptQueue = [];

        var content = textarea.value.trim();

        if (!content) {
            alert('Please enter prompts or image-prompt pairs in the textarea.');
            return;
        }

        var repeatCountInput = repeatInput.value.trim();
        var repeatCount = 1;
        if (repeatCountInput === '~') {
            repeatCount = Infinity;
        } else {
            repeatCount = parseInt(repeatCountInput, 10);
            if (isNaN(repeatCount) || repeatCount < 1) {
                repeatCount = 1;
            }
        }

        var startPromptInputValue = parseInt(startPromptInput.value.trim(), 10);
        startingPromptIndex = isNaN(startPromptInputValue) || startPromptInputValue < 1 ? 1 : startPromptInputValue;

        var items = content.split('---').map(item => item.trim()).filter(item => item.length > 0);

        totalPrompts = items.length;

        processTextareaItems(items, function() {
            if(promptQueue.length === 0) {
                alert('No valid prompts or images to process.');
                return;
            }

            // Duplicate the promptQueue based on repeat count
            totalRepeatCount = repeatCount;
            currentRepeat = 0;

            originalPromptQueue = promptQueue.slice(); // Make a copy of the original prompts

            // Initialize prompt counters
            totalPromptCount = originalPromptQueue.length;

            // Adjust the prompt queue based on the starting prompt index
            startingPromptIndex = Math.min(startingPromptIndex, promptQueue.length);
            startingPromptIndex = Math.max(1, startingPromptIndex);
            promptQueue = promptQueue.slice(startingPromptIndex - 1);

            // Update the batch label
            batchLabel.textContent = 'Current Batch: ' + (currentRepeat + 1);

            // Set the current prompt number
            currentPromptNumber = startingPromptIndex;

            updatePromptCounterLabel();

            // Disable the start button to prevent multiple clicks
            startButton.disabled = true;

            // Start processing the prompts
            processPrompts();
        });
    });

    // Function to update the prompt counter label
    function updatePromptCounterLabel() {
        promptCounterLabel.textContent = 'Current Prompt: ' + currentPromptNumber + ' / ' + totalPromptCount;
    }

    // Function to process items from textarea
    function processTextareaItems(items, callback) {
        items.forEach(function(item) {
            try {
                // Try to parse item as JSON
                var jsonItem = JSON.parse(item);
                if (Array.isArray(jsonItem)) {
                    jsonItem.forEach(function(entry) {
                        processJsonEntry(entry);
                    });
                } else if (typeof jsonItem === 'object' && jsonItem !== null) {
                    // Single JSON object
                    processJsonEntry(jsonItem);
                } else {
                    alert('Invalid JSON format. Expected an object or an array of objects.');
                }
            } catch (e) {
                // Not JSON, treat as text prompt
                promptQueue.push({ type: 'text', content: item });
            }
        });

        callback();
    }

    // Function to check for the specific error message
    //function checkForErrorMessage(callback) {
    //    // Check for the error message element
    //    var errorMessageElement = document.querySelector('div.adm-auto-center-content');
    //    if (errorMessageElement && errorMessageElement.textContent.includes('An error occurred while generating the content, please try again')) {
    //        callback(true);
    //    } else {
    //        callback(false);
    //    }
    //}

    function processJsonEntry(entry) {
        if (entry.filename && entry.prompt) {
            // Check if the image has been added via "Add Images"
            if (imagesMap.has(entry.filename)) {
                promptQueue.push({
                    type: 'image',
                    file: imagesMap.get(entry.filename),
                    prompt: entry.prompt
                });
            } else {
                alert(`Image "${entry.filename}" has not been added via "Add Images". Please add it.`);
            }
        } else {
            alert('Invalid JSON entry. Each entry must have "filename" and "prompt".');
        }
    }

    // Function to set the value of a textarea in a way that React recognizes
    function setNativeValue(element, value) {
        const lastValue = element.value;
        element.value = value;
        const event = new Event('input', { bubbles: true });
        // Hack to make React notice the change
        const tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
    }

    // Updated processPrompts function with random delay
    function processPrompts() {
        // If paused or holding, wait and retry
        if (isPaused || isHolding) {
            setTimeout(processPrompts, 1000);
            return;
        }

        if (promptQueue.length === 0) {
            currentRepeat++;
            if (currentRepeat < totalRepeatCount || totalRepeatCount === Infinity) {
                // Reset the promptQueue to original and start over
                promptQueue = originalPromptQueue.slice();
                // Update the batch label
                batchLabel.textContent = 'Current Batch: ' + (currentRepeat + 1);
                // Reset the current prompt number
                currentPromptNumber = 1;
                updatePromptCounterLabel();
                processPrompts();
            } else {
                alert('All prompts have been processed.');
                startButton.disabled = false;
                // Reset the batch label and prompt counter
                batchLabel.textContent = 'Current Batch: 0';
                promptCounterLabel.textContent = 'Current Prompt: 0 / 0';
            }
            return;
        }

        var item = promptQueue.shift();

        // Update current prompt number
        updatePromptCounterLabel();

        // Wait for queue space before proceeding
        waitForQueueSpace(function() {
            // Remove any uploaded image before processing the next prompt
            removeUploadedImage();

            if (item.type === 'text') {
                processTextPrompt(item.content, function() {
                    currentPromptNumber++;
                    // Wait between 10 and 45 seconds before proceeding to the next prompt
                    var delay = getRandomDelay(10000, 45000);
                    console.log('Waiting for ' + (delay / 1000) + ' seconds before processing the next prompt.');
                    setTimeout(processPrompts, delay);
                });
            } else if (item.type === 'image') {
                revealUploadPane(function() {
                    processImagePrompt(item, function() {
                        currentPromptNumber++;
                        // Wait between 10 and 45 seconds before proceeding to the next prompt
                        var delay = getRandomDelay(10000, 45000);
                        console.log('Waiting for ' + (delay / 1000) + ' seconds before processing the next prompt.');
                        setTimeout(processPrompts, delay);
                    });
                });
            }
        });
    }

    // Updated waitForQueueSpace function
    function waitForQueueSpace(callback) {
        var checkQueue = setInterval(function() {
            // If paused or holding, wait and retry
            if (isPaused || isHolding) {
                return; // Do nothing, stay in the interval
            }

            var submitButtonLoading = document.querySelector('img[src="/assets/img/dark-loading.png"]');

            var submitButtonReady = false;

            var queueCounterFound = false;
            var queueTextCurrentSize = 0;
            var queueTextMaxSize = 5; // Default to 5 if not found

            // Check if submit button is not loading
            if (!submitButtonLoading) {
                submitButtonReady = true;
            } else {
                console.log('Submit button is loading. Waiting...');
            }

            // Try to get queue size from the queue counter
            var queueCounterElements = document.querySelectorAll('div.bg-clip-text');

            queueCounterElements.forEach(function(element) {
                var textContent = element.textContent.replace(/\s+/g, '');
                var numbers = textContent.match(/\d+/g);

                if (numbers && numbers.length === 2) {
                    queueTextCurrentSize = parseInt(numbers[0], 10);
                    queueTextMaxSize = parseInt(numbers[1], 10);
                    queueCounterFound = true;
                }
            });

            // If we didn't find the counter with numbers, try to get queue size from the message text
            if (!queueCounterFound) {
                var messageElement = document.querySelector('div.font-medium');
                if (messageElement) {
                    var messageText = messageElement.textContent.trim();
                    var match = messageText.match(/(\d+)\s+jobs\s+in\s+queue/);
                    if (match) {
                        queueTextCurrentSize = parseInt(match[1], 10);
                        queueTextMaxSize = 5; // Assuming max queue size is 5
                        queueCounterFound = true;
                    } else if (messageText.includes('you can queue')) {
                        // Assuming queue is empty when the message says 'you can queue 5 jobs at once'
                        queueTextCurrentSize = 0;
                        queueTextMaxSize = 5;
                        queueCounterFound = true;
                    }
                } else {
                    console.log('Queue message element not found.');
                }
            }

            // Count number of queued videos (waiting to be processed) by class 'video-gen-loading'
            var queuedVideoElements = document.querySelectorAll('div.video-gen-loading');
            var queuedVideoCount = queuedVideoElements.length;

            // Count number of processing videos (currently being processed) by elements with 'role="progressbar"'
            var processingVideoElements = document.querySelectorAll('[role="progressbar"]');
            var processingVideoCount = processingVideoElements.length;

            // Output the counts for debugging
            console.log('Submit button ready:', submitButtonReady);
            console.log('Queue counter found:', queueCounterFound);
            console.log('Queue counter size:', queueTextCurrentSize + '/' + queueTextMaxSize);
            console.log('Queued video count:', queuedVideoCount);
            console.log('Processing video count:', processingVideoCount);

            // Decide on the current queue size
            var totalQueueSize = queuedVideoCount + processingVideoCount;
            var maxQueueSize = Math.max(queueTextMaxSize, 5);

            if (totalQueueSize < maxQueueSize && submitButtonReady) {
                clearInterval(checkQueue);
                // Wait for a random delay before proceeding
                var delay = getRandomDelay(10000, 45000);
                console.log('Waiting for ' + (delay / 1000) + ' seconds before submitting the next prompt.');
                setTimeout(callback, delay);
            } else {
                console.log('Queue is full (' + totalQueueSize + '/' + maxQueueSize + ') or submit button not ready. Waiting...');
            }
        }, 2000);
    }



    // Function to check for error messages
    function checkForErrorMessage(callback) {
        var errorElement = document.querySelector('.web-toast.error');
        if (errorElement) {
            callback(true);
            // Optionally remove the error element to prevent duplicate detections
            errorElement.remove();
        } else {
            callback(false);
        }
    }

    // Updated processTextPrompt function with retry logic
    function processTextPrompt(prompt, callback, retryCount = 0) {
        var maxRetries = 3;
        var promptTextarea = document.querySelector('.description_wrap textarea');
        if(!promptTextarea) {
            alert('Could not find prompt textarea on the page.');
            startButton.disabled = false;
            return;
        }

        setNativeValue(promptTextarea, prompt);

        waitForSubmitButton(function(submitButton) {
            submitButton.click();
            // Wait for potential error message
            setTimeout(function() {
                checkForErrorMessage(function(hasError) {
                    if (hasError) {
                        if (retryCount < maxRetries) {
                            console.log('Error occurred. Retrying prompt in 3 seconds. Retry count: ' + (retryCount + 1));
                            setTimeout(function() {
                                processTextPrompt(prompt, callback, retryCount + 1);
                            }, 3000);
                        } else {
                            console.log('Max retries reached for this prompt. Moving to next prompt.');
                            callback();
                        }
                    } else {
                        // Proceed to the next prompt
                        callback();
                    }
                });
            }, 3000);
        });
    }

    // Updated processImagePrompt function with submission error handling
    function processImagePrompt(item, callback, retryCount = 0) {
        var maxRetries = 3;
        var promptTextarea = document.querySelector('.description_wrap textarea');
        if (!promptTextarea) {
            alert('Could not find prompt textarea on the page.');
            startButton.disabled = false;
            return;
        }

        setNativeValue(promptTextarea, item.prompt);

        uploadImage(item.file, function(success) {
            if (!success) {
                alert('Failed to upload image.');
                callback();
                return;
            }

            waitForSubmitButton(function(submitButton) {
                submitButton.click();
                // Wait for potential error message
                setTimeout(function() {
                    checkForErrorMessage(function(hasError) {
                        if (hasError) {
                            if (retryCount < maxRetries) {
                                console.log('Error occurred. Retrying prompt in 3 seconds. Retry count: ' + (retryCount + 1));
                                setTimeout(function() {
                                    // Remove the image and attempt to upload again
                                    removeUploadedImage();
                                    // Open upload pane again if needed
                                    revealUploadPane(function() {
                                        processImagePrompt(item, callback, retryCount + 1);
                                    });
                                }, 3000);
                            } else {
                                console.log('Max retries reached for this prompt. Removing image and moving to next prompt.');
                                removeUploadedImage();
                                callback();
                            }
                        } else {
                            // Proceed to the next prompt
                            callback();
                        }
                    });
                }, 3000);
            });
        });
    }

    // Function to wait until the image has finished uploading
    function waitForImageUpload(callback) {
        var maxRetries = 30; // Adjust retries as necessary
        var retries = 0;
        var checkUpload = setInterval(function() {
            var uploadedImage = document.querySelector('img[alt="uploaded image"]');
            if (uploadedImage) {
                // Get the closest parent div with class 'relative'
                var parentDiv = uploadedImage.closest('div.relative');
                if (parentDiv) {
                    // Check if there is a child div.absolute (the overlay with the spinner or error)
                    var overlayDiv = parentDiv.querySelector('div.absolute');
                    if (overlayDiv) {
                        // Check if the retry button is present
                        var retryButton = overlayDiv.querySelector('svg.fill-\\[\\#F55762\\]');
                        if (retryButton) {
                            console.log('Image upload failed. Retrying...');
                            // Click the retry button
                            var retryButtonParent = retryButton.closest('div.cursor-pointer');
                            if (retryButtonParent) {
                                retryButtonParent.click();
                            } else {
                                console.log('Retry button parent not found.');
                            }
                        } else {
                            console.log('Image is still uploading...');
                        }
                    } else {
                        clearInterval(checkUpload);
                        console.log('Image upload successful.');
                        callback(true);
                    }
                } else {
                    console.log('Cannot find parent div of the uploaded image.');
                    retries++;
                }
            } else {
                console.log('Uploaded image element not found.');
                retries++;
            }

            if (retries >= maxRetries) {
                clearInterval(checkUpload);
                console.log('Image upload timed out.');
                callback(false);
            }
        }, 2000);
    }

    // Function to remove any uploaded image
    function removeUploadedImage() {
        var removeButton = document.querySelector('span.hover\\:cursor-pointer');
        if (removeButton) {
            removeButton.click();
            console.log('Uploaded image removed.');
        } else {
            console.log('No uploaded image to remove.');
        }
    }

    // Updated revealUploadPane function
    function revealUploadPane(callback) {
        // Updated selector to match the new element
        var uploadPaneOpener = document.querySelector('span.inline-block.group-hover\\:hidden');
        if (uploadPaneOpener) {
            uploadPaneOpener.click();
            // Wait for the upload pane to appear
            setTimeout(function() {
                callback();
            }, 1000); // Adjust the delay if necessary
        } else {
            alert('Could not find the button to open the upload pane.');
            startButton.disabled = false;
        }
    }

    // Function to upload an image
    function uploadImage(file, callback, uploadRetryCount = 0) {
        var maxUploadRetries = 3;
        var uploadInput = document.querySelector('.ant-upload input[type="file"]');
        if (!uploadInput) {
            console.log('Could not find image upload input on the page.');
            if (uploadRetryCount < maxUploadRetries) {
                console.log('Retrying to find the upload input. Retry count: ' + (uploadRetryCount + 1));
                setTimeout(function() {
                    uploadImage(file, callback, uploadRetryCount + 1);
                }, 1000);
            } else {
                alert('Failed to find image upload input after multiple attempts.');
                callback(false);
            }
            return;
        }

        var dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        uploadInput.files = dataTransfer.files;

        uploadInput.dispatchEvent(new Event('change', { bubbles: true }));

        // Wait for image to finish uploading
        waitForImageUpload(function(success) {
            if (success) {
                callback(true);
            } else {
                if (uploadRetryCount < maxUploadRetries) {
                    console.log('Image upload failed. Removing image and retrying upload. Retry count: ' + (uploadRetryCount + 1));
                    removeUploadedImage();
                    uploadImage(file, callback, uploadRetryCount + 1);
                } else {
                    alert('Image upload failed after multiple attempts.');
                    callback(false);
                }
            }
        });
    }

    // Function to check if the submit button is available
    function isSubmitButtonAvailable() {
        var submitButton = getSubmitButton();
        return submitButton !== null;
    }

    // Function to get the submit button
    function getSubmitButton() {
        var buttons = document.querySelectorAll('div.cursor-pointer');
        for (var i = 0; i < buttons.length; i++) {
            var img = buttons[i].querySelector('img[alt="hilo ai video create icon"]');
            if (img) {
                return buttons[i];
            }
        }
        return null;
    }

    // Function to wait for the submit button to be available
    function waitForSubmitButton(callback) {
        var checkButton = setInterval(function() {
            if (isSubmitButtonAvailable()) {
                clearInterval(checkButton);
                var submitButton = getSubmitButton();
                callback(submitButton);
            }
        }, 1000);
    }

    // Event listeners for control buttons
    pauseButton.addEventListener('click', function() {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume Queue' : 'Pause Queue';
    });

    backButton.addEventListener('click', function() {
        if (currentPromptNumber > 1) {
            // Move back one prompt
            currentPromptNumber -= 2; // Subtract 2 because processPrompts will increment it by 1
            promptQueue.unshift(originalPromptQueue[currentPromptNumber]); // Re-insert the previous prompt at the beginning
            updatePromptCounterLabel();
        } else {
            alert('Already at the first prompt.');
        }
    });

    holdButton.addEventListener('click', function() {
        isHolding = !isHolding;
        holdButton.textContent = isHolding ? 'Release Hold' : 'Hold Current Prompt';
    });

    // BULK DOWNLOAD FUNCTIONALITY STARTS HERE

    // Create a container div for the bulk download
    var bulkDownloadContainer = document.createElement('div');
    bulkDownloadContainer.style.position = 'fixed';
    bulkDownloadContainer.style.top = '50px';
    bulkDownloadContainer.style.left = '50%';
    bulkDownloadContainer.style.transform = 'translateX(-50%)';
    bulkDownloadContainer.style.zIndex = '10000';
    bulkDownloadContainer.style.backgroundColor = 'white';
    bulkDownloadContainer.style.border = '1px solid black';
    bulkDownloadContainer.style.padding = '10px';
    bulkDownloadContainer.style.maxWidth = '400px';
    bulkDownloadContainer.style.overflowY = 'auto';
    bulkDownloadContainer.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    bulkDownloadContainer.style.borderRadius = '8px';
    bulkDownloadContainer.style.display = 'none';

    // Create a close button for the bulk download container
    var bulkCloseButton = document.createElement('button');
    bulkCloseButton.textContent = 'X';
    bulkCloseButton.style.position = 'absolute';
    bulkCloseButton.style.top = '5px';
    bulkCloseButton.style.right = '5px';
    bulkCloseButton.style.background = 'transparent';
    bulkCloseButton.style.border = 'none';
    bulkCloseButton.style.fontSize = '16px';
    bulkCloseButton.style.cursor = 'pointer';
    bulkCloseButton.addEventListener('click', function() {
        bulkDownloadContainer.style.display = 'none';
    });
    bulkDownloadContainer.appendChild(bulkCloseButton);

    // Create "Download All Visible Videos" button
    var downloadAllButton = document.createElement('button');
    downloadAllButton.textContent = 'Download All Visible Videos';
    downloadAllButton.style.marginTop = '10px';
    downloadAllButton.style.padding = '5px 10px';
    downloadAllButton.style.cursor = 'pointer';
    bulkDownloadContainer.appendChild(downloadAllButton);

    // Create "Select All Visible" button
    var selectAllButton = document.createElement('button');
    selectAllButton.textContent = 'Select All Visible';
    selectAllButton.style.marginTop = '10px';
    selectAllButton.style.marginRight = '10px';
    selectAllButton.style.padding = '5px 10px';
    selectAllButton.style.cursor = 'pointer';
    bulkDownloadContainer.appendChild(selectAllButton);

    // Create "Deselect All" button
    var deselectAllButton = document.createElement('button');
    deselectAllButton.textContent = 'Deselect All';
    deselectAllButton.style.marginTop = '10px';
    deselectAllButton.style.marginRight = '10px';
    deselectAllButton.style.padding = '5px 10px';
    deselectAllButton.style.cursor = 'pointer';
    bulkDownloadContainer.appendChild(deselectAllButton);

    // Create "Select Videos Between" button
    var selectBetweenButton = document.createElement('button');
    selectBetweenButton.textContent = 'Select Videos Between';
    selectBetweenButton.style.marginTop = '10px';
    selectBetweenButton.style.marginRight = '10px';
    selectBetweenButton.style.padding = '5px 10px';
    selectBetweenButton.style.cursor = 'pointer';
    bulkDownloadContainer.appendChild(selectBetweenButton);

    // Create "Download Selected" button
    var downloadSelectedButton = document.createElement('button');
    downloadSelectedButton.textContent = 'Download Selected';
    downloadSelectedButton.style.marginTop = '10px';
    downloadSelectedButton.style.padding = '5px 10px';
    downloadSelectedButton.style.cursor = 'pointer';
    bulkDownloadContainer.appendChild(downloadSelectedButton);

    // Append the bulk download container to the body
    document.body.appendChild(bulkDownloadContainer);

    // Add event listener to the bulkDownloadButton to toggle the bulk download container
    bulkDownloadButton.addEventListener('click', function() {
        bulkDownloadContainer.style.display = (bulkDownloadContainer.style.display === 'none') ? 'block' : 'none';
        // Add checkboxes to videos
        addCheckboxesToVideos();
        // Update the selected counter
        updateSelectedCounter();
    });

    // Function to add checkboxes to videos
    function addCheckboxesToVideos() {
        let videoElements = document.querySelectorAll('div.video-cards');
        videoElements.forEach(function(videoElement, index) {
            // Check if the checkbox is already added
            if (!videoElement.querySelector('.video-checkbox')) {
                // Create a checkbox
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'video-checkbox';
                checkbox.style.position = 'absolute';
                checkbox.style.top = '10px';
                checkbox.style.left = '10px';
                checkbox.style.zIndex = '100';
                checkbox.style.transform = 'scale(2)'; // Make the checkbox twice as big
                // Add event listener to update the counter when checkbox state changes
                checkbox.addEventListener('change', updateSelectedCounter);
                // Append the checkbox to the video element
                videoElement.style.position = 'relative'; // Ensure the video element is positioned relative
                videoElement.appendChild(checkbox);
            }
        });
    }

    // Function to update the selected counter
    function updateSelectedCounter() {
        let checkboxes = document.querySelectorAll('.video-checkbox');
        let selectedCount = 0;
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                selectedCount++;
            }
        });
        if (selectedCount > 0) {
            selectedCounter.textContent = 'Selected Videos: ' + selectedCount;
            selectedCounter.style.display = 'block';
        } else {
            selectedCounter.style.display = 'none';
        }
    }

    // "Select All Visible" button event listener
    selectAllButton.addEventListener('click', function() {
        let checkboxes = document.querySelectorAll('.video-checkbox');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
        updateSelectedCounter();
    });

    // "Deselect All" button event listener
    deselectAllButton.addEventListener('click', function() {
        let checkboxes = document.querySelectorAll('.video-checkbox');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
        updateSelectedCounter();
    });

    // "Select Videos Between" button event listener
    selectBetweenButton.addEventListener('click', function() {
        let checkboxes = Array.from(document.querySelectorAll('.video-checkbox'));
        let selectedIndexes = checkboxes.map((checkbox, index) => checkbox.checked ? index : -1).filter(index => index !== -1);

        if (selectedIndexes.length < 2) {
            alert('Please select at least two videos to use this feature.');
            return;
        }

        let start = Math.min(...selectedIndexes);
        let end = Math.max(...selectedIndexes);

        for (let i = start; i <= end; i++) {
            checkboxes[i].checked = true;
        }
        updateSelectedCounter();
    });

    // "Download Selected" button event listener
    downloadSelectedButton.addEventListener('click', function() {
        // Disable the button to prevent multiple clicks
        downloadSelectedButton.disabled = true;
        downloadSelectedButton.innerHTML = "Processing...";

        // Start processing the selected videos
        processSelectedVideos(function() {
            // Re-enable the button after processing
            downloadSelectedButton.disabled = false;
            downloadSelectedButton.innerHTML = "Download Selected";
        });
    });

    // "Download All Visible Videos" button event listener
    downloadAllButton.addEventListener('click', function() {
        // Disable the button to prevent multiple clicks
        downloadAllButton.disabled = true;
        downloadAllButton.innerHTML = "Processing...";

        // Start processing the videos
        processVideos(function() {
            // Re-enable the button after processing
            downloadAllButton.disabled = false;
            downloadAllButton.innerHTML = "Download All Visible Videos";
        });
    });

    // Updated processVideos function with random delay
    function processVideos(callback) {
        // Array to hold the video data
        let videoDataArray = [];

        // Get all video elements
        let videoElements = Array.from(document.querySelectorAll('div.video-cards'));

        if (videoElements.length === 0) {
            alert('No videos found on the page.');
            callback();
            return;
        }

        // Helper function to process each video element with random delay
        function processVideoElement(index) {
            if (index >= videoElements.length) {
                // All videos processed, save the data and call the callback
                saveVideoData(videoDataArray);
                callback();
                return;
            }

            const videoElement = videoElements[index];

            // Extract the prompt
            let promptElement = videoElement.querySelector('.line-clamp-2');
            let prompt = promptElement ? promptElement.textContent.trim() : '';

            // Get the download button
            let downloadButton = videoElement.querySelector('div.flex.items-center.mb-2\\.5.cursor-pointer');

            if (downloadButton) {
                // Simulate a click on the download button to trigger the download logic
                downloadButton.click();

                // Wait for a brief moment to allow any JavaScript to execute
                setTimeout(function() {
                    // Attempt to retrieve the raw video URL
                    let rawVideoUrl = null;

                    // Get the video tag and replace watermark URL
                    let videoTag = videoElement.querySelector('video');
                    if (videoTag) {
                        let watermarkedUrl = videoTag.getAttribute('src');
                        if (watermarkedUrl) {
                            rawVideoUrl = watermarkedUrl.replace('video_watermark', 'video_raw');
                        }
                    }

                    if (rawVideoUrl) {
                        // Add the data to the array
                        videoDataArray.push({
                            prompt: prompt,
                            raw_video_url: rawVideoUrl
                        });
                    }

                    // Move to the next video after a random delay between 500ms and 2500ms
                    var delay = getRandomDelay(500, 2500);
                    console.log('Waiting for ' + delay + ' milliseconds before processing the next video.');
                    setTimeout(function() {
                        processVideoElement(index + 1);
                    }, delay);
                }, 500); // Initial 500ms delay after clicking download button
            } else {
                console.log('Download button not found for a video.');
                // Move to the next video immediately if no download button
                processVideoElement(index + 1);
            }
        }

        // Start processing the first video element
        processVideoElement(0);
    }

    // Updated processSelectedVideos function with random delay
    function processSelectedVideos(callback) {
        // Array to hold the video data
        let videoDataArray = [];

        // Get all video elements with selected checkboxes
        let videoElements = Array.from(document.querySelectorAll('div.video-cards'));
        let selectedVideoElements = videoElements.filter(function(videoElement) {
            let checkbox = videoElement.querySelector('.video-checkbox');
            return checkbox && checkbox.checked;
        });

        if (selectedVideoElements.length === 0) {
            alert('No videos selected for download.');
            callback();
            return;
        }

        // Helper function to process each video element with random delay
        function processVideoElement(index) {
            if (index >= selectedVideoElements.length) {
                // All videos processed, save the data and call the callback
                saveVideoData(videoDataArray);
                callback();
                return;
            }

            const videoElement = selectedVideoElements[index];

            // Extract the prompt
            let promptElement = videoElement.querySelector('.line-clamp-2');
            let prompt = promptElement ? promptElement.textContent.trim() : '';

            // Get the download button
            let downloadButton = videoElement.querySelector('div.flex.items-center.mb-2\\.5.cursor-pointer');

            if (downloadButton) {
                // Simulate a click on the download button to trigger the download logic
                downloadButton.click();

                // Wait for a brief moment to allow any JavaScript to execute
                setTimeout(function() {
                    // Attempt to retrieve the raw video URL
                    let rawVideoUrl = null;

                    // Get the video tag and replace watermark URL
                    let videoTag = videoElement.querySelector('video');
                    if (videoTag) {
                        let watermarkedUrl = videoTag.getAttribute('src');
                        if (watermarkedUrl) {
                            rawVideoUrl = watermarkedUrl.replace('video_watermark', 'video_raw');
                        }
                    }

                    if (rawVideoUrl) {
                        // Add the data to the array
                        videoDataArray.push({
                            prompt: prompt,
                            raw_video_url: rawVideoUrl
                        });
                    }

                    // Move to the next video after a random delay between 500ms and 2500ms
                    var delay = getRandomDelay(500, 2500);
                    console.log('Waiting for ' + delay + ' milliseconds before processing the next video.');
                    setTimeout(function() {
                        processVideoElement(index + 1);
                    }, delay);
                }, 500); // Initial 500ms delay after clicking download button
            } else {
                console.log('Download button not found for a video.');
                // Move to the next video immediately if no download button
                processVideoElement(index + 1);
            }
        }

        // Start processing the first selected video element
        processVideoElement(0);
    }

    // Function to save the video data as a JSON file
    function saveVideoData(data) {
        if (data.length === 0) {
            alert('No video data to save.');
            return;
        }

        // Convert the data to JSON format
        let jsonData = JSON.stringify(data, null, 2);

        // Create a blob from the JSON data
        let blob = new Blob([jsonData], { type: 'application/json' });

        // Create a download link
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'video_data.json';

        // Append the link to the body
        document.body.appendChild(a);

        // Programmatically click the link to trigger the download
        a.click();

        // Remove the link from the document
        document.body.removeChild(a);

        // Revoke the object URL
        URL.revokeObjectURL(url);

        alert('Video data has been saved as video_data.json');
    }

})();