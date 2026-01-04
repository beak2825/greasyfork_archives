// ==UserScript==
// @name         Rupashree Anti AI
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Rupashree Helper helps you to make your life simple
// @author       Hopeless DEO
// @match        https://wbrupashree.gov.in/admin/*
// @downloadURL https://update.greasyfork.org/scripts/523840/Rupashree%20Anti%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/523840/Rupashree%20Anti%20AI.meta.js
// ==/UserScript==
$(document).ready(function(){
    initialize();

    // Function to add random modification to image
    function modifyImage(file) {
        console.log('🖼️ Original image:', {
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            type: file.type
        });

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                console.log('📖 Image loaded into FileReader');

                const img = new Image();
                img.onload = function() {
                    console.log('📏 Image dimensions:', {
                        width: img.width,
                        height: img.height
                    });

                    // Create canvas
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');

                    // Draw original image
                    ctx.drawImage(img, 0, 0);

                    // Get all image data
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    // Generate random changes
                    const randomBrightness = Math.random() * 10 - 5; // Random value between -5 and 5
                    const randomContrast = (Math.random() * 0.2) + 0.9; // Random value between 0.9 and 1.1
                    const randomOffset = Math.floor(Math.random() * 5) - 2; // Random value between -2 and 2

                    console.log('🎲 Random modifications:', {
                        brightness: randomBrightness.toFixed(2),
                        contrast: randomContrast.toFixed(2),
                        offset: randomOffset
                    });

                    // Loop through all pixels
                    for (let i = 0; i < data.length; i += 4) {
                        // Apply random modifications to each channel
                        for (let j = 0; j < 3; j++) { // Apply to RGB channels only
                            let value = data[i + j];

                            // Apply contrast
                            value = ((value / 255 - 0.5) * randomContrast + 0.5) * 255;

                            // Apply brightness
                            value += randomBrightness;

                            // Add random offset
                            value += randomOffset;

                            // Ensure value stays within 0-255 range
                            data[i + j] = Math.min(255, Math.max(0, Math.round(value)));
                        }
                        // Alpha channel (data[i + 3]) remains unchanged
                    }

                    // Add a few random pixels for extra uniqueness
                    for (let k = 0; k < 5; k++) {
                        const randomX = Math.floor(Math.random() * canvas.width);
                        const randomY = Math.floor(Math.random() * canvas.height);
                        const pixelIndex = (randomY * canvas.width + randomX) * 4;

                        // Slightly modify the random pixels
                        for (let j = 0; j < 3; j++) {
                            data[pixelIndex + j] = Math.min(255,
                                Math.max(0,
                                    data[pixelIndex + j] + (Math.random() * 10 - 5)
                                )
                            );
                        }
                    }

                    // Put the modified data back
                    ctx.putImageData(imageData, 0, 0);

                    // Convert back to file
                    canvas.toBlob((blob) => {
                        const modifiedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: new Date().getTime()
                        });

                        console.log('✨ Modified image:', {
                            name: modifiedFile.name,
                            size: (modifiedFile.size / 1024).toFixed(2) + ' KB',
                            type: modifiedFile.type,
                            sizeDifference: ((modifiedFile.size - file.size) / 1024).toFixed(2) + ' KB'
                        });

                        resolve(modifiedFile);
                    }, file.type);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Function to intercept file inputs
    function interceptFileUploads() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        console.log('🔍 Found file inputs:', fileInputs.length);

        fileInputs.forEach(input => {
            // Skip if already modified
            if (input.dataset.modified) return;
            input.dataset.modified = true;

            console.log('🎯 Adding image modifier to input:', {
                id: input.id || 'no-id',
                name: input.name || 'no-name'
            });

            // Store the original change handler if it exists
            const originalOnChange = input.onchange;

            // Add new change handler
            input.onchange = async function(e) {
                if (this.files && this.files[0]) {
                    const file = this.files[0];

                    // Check if it's an image
                    if (!file.type.startsWith('image/')) {
                        console.log('⚠️ Non-image file selected:', file.type);
                        if (originalOnChange) originalOnChange.call(this, e);
                        return;
                    }

                    console.log('🚀 Starting image modification process...');

                    // Modify the image
                    const modifiedFile = await modifyImage(file);

                    // Create a new FileList-like object
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(modifiedFile);
                    this.files = dataTransfer.files;

                    console.log('✅ Image modification complete');

                    // Call original change handler if it exists
                    if (originalOnChange) {
                        console.log('📤 Calling original change handler');
                        originalOnChange.call(this, e);
                    }
                }
            };
        });
    }

    // Initial setup
    function initialize() {
        console.log('🎬 Initializing image modifier script');
        interceptFileUploads();

        // Set up a MutationObserver to handle dynamically added file inputs
        const observer = new MutationObserver((mutations) => {
            console.log('👀 DOM changes detected, checking for new file inputs');
            interceptFileUploads();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('✨ Image modifier script initialized successfully');
    }

});