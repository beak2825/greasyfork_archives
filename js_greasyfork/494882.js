// ==UserScript==
// @name         Dynamic OCR with Tesseract.js
// @namespace    http://tampermonkey.net/
// @version      1.9.5
// @description  Extract text from dynamically changing images using Tesseract.js
// @author       Ojo Ngono 
// @match        https://my.dropz.xyz/member/task/captcha?*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@2/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/494882/Dynamic%20OCR%20with%20Tesseractjs.user.js
// @updateURL https://update.greasyfork.org/scripts/494882/Dynamic%20OCR%20with%20Tesseractjs.meta.js
// ==/UserScript==










(function() {
    'use strict';

    // Function to perform OCR on a given image element
    function performOCR(img) {
        // Create a canvas element to preprocess the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Preprocessing: Convert the image to grayscale and increase contrast
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = gray > 128 ? 255 : 0; // Binarize image
            data[i + 3] = 255; // Set alpha to fully opaque
        }
        ctx.putImageData(imageData, 0, 0);

        // Get the preprocessed image data URL
        const preprocessedImageSrc = canvas.toDataURL();

        Tesseract.recognize(
            preprocessedImageSrc,
            'eng',
            {
                logger: m => console.log(m)
            }
        ).then(({ data: { text } }) => {
            console.log('Extracted text:', text);

            // Display the extracted text on the image
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = img.offsetTop + 'px';
            overlay.style.left = img.offsetLeft + 'px';
            overlay.style.width = img.width + 'px';
            overlay.style.height = img.height + 'px';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            overlay.style.color = 'black';
            overlay.style.zIndex = '1000';
            overlay.innerText = text;
            img.parentNode.style.position = 'relative';
            img.parentNode.appendChild(overlay);

            // Fill the CAPTCHA input field with the extracted text
            const captchaInput = document.querySelector('input[placeholder="CAPTCHA CODE HERE"]');
            if (captchaInput) {
                captchaInput.value = text.trim();
            }

            // Wait for 13 seconds before submitting the form
            setTimeout(() => {
                // Submit the form automatically after filling the CAPTCHA input
                const submitButton = document.querySelector('input[type="submit"].btn.btn-info.btn-sm.mt-3.mb-4');
                if (submitButton) {
                    submitButton.click();
                }
            }, 13000); // 13 seconds delay
        }).catch(err => {
            console.error(err);
        });
    }

    // Function to find the specific captcha image
    function findCaptchaImage() {
        // Use a more specific selector if possible to target the captcha image
        const captchaImg = document.querySelector('form img[src^="data:image/png;base64"]');
        if (captchaImg) {
            observer.observe(captchaImg, { attributes: true });
            performOCR(captchaImg); // Perform OCR on initial load
        }
    }

    // MutationObserver to monitor changes in the src attribute of the captcha image
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                performOCR(mutation.target);
            }
        });
    });

    // Initial call to find and observe the captcha image
    findCaptchaImage();

    // Monitor changes in the DOM to re-check for captcha image in case of reloads or updates
    const bodyObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                findCaptchaImage();
            }
        });
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
})();
