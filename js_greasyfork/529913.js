// ==UserScript==
// @name         YandexGPT Summarize
// @namespace    YandexGPT
// @author       NK
// @version      1.0
// @description  Скрипт добавляет плавающую кнопку на страницы, которая при нажатии открывает YandexGPT (300.ya.ru) и передает текущий URL для создания обобщенного текста видео или статьи.
// @match        *://*/*
// @match        *://300.ya.ru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @homepage     https://github.com/NikitaKrulov/TampermonkeyYaGPT
// @icon         https://300.ya.ru/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/529913/YandexGPT%20Summarize.user.js
// @updateURL https://update.greasyfork.org/scripts/529913/YandexGPT%20Summarize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we're on the Yandex GPT site
    if (window.location.hostname === '300.ya.ru') {
        // Get the URL parameter if it exists
        const urlParams = new URLSearchParams(window.location.search);
        const sourceUrl = urlParams.get('url');

        if (sourceUrl) {
            // Function to find and interact with elements on the Yandex GPT page
            function fillAndSubmitForm() {
                // Use the exact selector for the textarea from the HTML
                const inputField = document.querySelector('textarea.textarea');

                // Use the exact selector for the submit button from the HTML
                const submitButton = document.querySelector('button.button.submit');

                if (inputField) {
                    console.log('Found input field, filling with URL:', sourceUrl);

                    // Focus the textarea first
                    inputField.focus();

                    // Set the value and trigger events
                    inputField.value = sourceUrl;
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    inputField.dispatchEvent(new Event('change', { bubbles: true }));

                    // Add a brief delay to ensure the input is processed
                    setTimeout(() => {
                        // If we found a submit button, enable and click it
                        if (submitButton) {
                            console.log('Found submit button, enabling and clicking it');

                            // Remove disabled attribute
                            submitButton.removeAttribute('disabled');

                            // Remove the disabled class
                            submitButton.classList.remove('disabled');

                            // Wait a brief moment and then click
                            setTimeout(() => {
                                submitButton.click();
                            }, 300);
                        } else {
                            console.log('Submit button not found yet, retrying...');
                            setTimeout(fillAndSubmitForm, 500);
                        }
                    }, 300);
                } else {
                    console.log('Input field not found yet, retrying...');
                    setTimeout(fillAndSubmitForm, 500);
                }
            }

            // Wait for the page to load and then attempt to fill the form
            // Try immediately and then retry a few more times if needed
            setTimeout(fillAndSubmitForm, 500);
            setTimeout(fillAndSubmitForm, 1000);
            setTimeout(fillAndSubmitForm, 2000);
        }

        return;
    }

    var floatingButton = document.createElement('div');
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.width = '40px';
    floatingButton.style.height = '40px';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.zIndex = '9999';

    var svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('class', 'alice__icon');
    svgIcon.setAttribute('width', '40');
    svgIcon.setAttribute('height', '40');
    svgIcon.setAttribute('viewBox', '0 0 40 40');
    svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('fill-rule', 'evenodd');
    path1.setAttribute('clip-rule', 'evenodd');
    path1.setAttribute('d', 'M19.973 12.22c-.525 0-1.032.19-1.488.455-.46.269-.914.64-1.345 1.069-.864.857-1.702 2.005-2.396 3.21-.694 1.206-1.266 2.505-1.575 3.68-.155.588-.249 1.166-.251 1.697-.002.525.086 1.058.347 1.51.261.453.679.795 1.135 1.055.461.264 1.008.47 1.594.63 1.172.32 2.583.475 3.973.476 1.39.002 2.802-.149 3.974-.466.586-.159 1.134-.364 1.595-.627.457-.26.874-.602 1.136-1.055.261-.453.349-.985.347-1.511-.002-.532-.096-1.11-.25-1.698-.308-1.176-.878-2.478-1.571-3.685-.694-1.207-1.53-2.356-2.393-3.214-.432-.43-.885-.801-1.345-1.07-.456-.266-.963-.456-1.488-.456zm-5.41 10.871c-.08-.14-.147-.38-.145-.754.001-.367.068-.813.202-1.321.267-1.015.777-2.191 1.424-3.313.646-1.122 1.407-2.154 2.152-2.895.373-.37.727-.651 1.045-.837.322-.188.565-.251.732-.251.165 0 .408.063.73.252.318.185.671.467 1.044.837.744.742 1.504 1.775 2.15 2.898.645 1.124 1.155 2.301 1.421 3.318.133.508.2.956.201 1.323.002.374-.065.614-.146.756-.081.14-.256.317-.58.502-.318.18-.738.345-1.244.482-1.012.274-2.285.416-3.58.414-1.294-.001-2.567-.147-3.58-.423-.506-.138-.926-.303-1.245-.485-.324-.185-.499-.362-.58-.503z');
    path1.setAttribute('fill', 'currentColor');

    var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('fill-rule', 'evenodd');
    path2.setAttribute('clip-rule', 'evenodd');
    path2.setAttribute('d', 'M32 20c0 6.627-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8s12 5.373 12 12zm-1.5 0c0 5.799-4.701 10.5-10.5 10.5S9.5 25.799 9.5 20 14.201 9.5 20 9.5 30.5 14.201 30.5 20z');
    path2.setAttribute('fill', 'currentColor');

    svgIcon.appendChild(path1);
    svgIcon.appendChild(path2);

    floatingButton.appendChild(svgIcon);

    document.body.appendChild(floatingButton);

    // Create an error message element
    var errorContainer = document.createElement('div');
    errorContainer.id = 'error-message';
    errorContainer.style.position = 'fixed';
    errorContainer.style.bottom = '70px';
    errorContainer.style.right = '20px';
    errorContainer.style.padding = '10px';
    errorContainer.style.backgroundColor = 'rgba(136, 16, 16, 0.9)';
    errorContainer.style.border = '1px solid red';
    errorContainer.style.borderRadius = '5px';
    errorContainer.style.zIndex = '9999';
    errorContainer.style.maxWidth = '300px';
    errorContainer.style.display = 'none';
    document.body.appendChild(errorContainer);

    // Make the button draggable
    var isDragging = false;
    var startOffsetX = 0;
    var startOffsetY = 0;

    // Restore saved position if available
    var savedPositionX = GM_getValue('floatingButtonX');
    var savedPositionY = GM_getValue('floatingButtonY');
    if (savedPositionX !== undefined && savedPositionY !== undefined) {
        floatingButton.style.left = savedPositionX + 'px';
        floatingButton.style.top = savedPositionY + 'px';
        // Remove default bottom/right positioning
        floatingButton.style.bottom = 'auto';
        floatingButton.style.right = 'auto';
    }

    // Mouse events for dragging
    floatingButton.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events for mobile devices
    floatingButton.addEventListener('touchstart', function(event) {
        var touch = event.touches[0];
        startDrag(touch);
        event.preventDefault(); // Prevent scrolling while dragging
    });
    document.addEventListener('touchmove', function(event) {
        var touch = event.touches[0];
        drag(touch);
        event.preventDefault(); // Prevent scrolling while dragging
    });
    document.addEventListener('touchend', endDrag);

    function startDrag(event) {
        isDragging = true;
        startOffsetX = (event.clientX || event.pageX) - floatingButton.offsetLeft;
        startOffsetY = (event.clientY || event.pageY) - floatingButton.offsetTop;
    }

    function drag(event) {
        if (isDragging) {
            var clientX = event.clientX || event.pageX;
            var clientY = event.clientY || event.pageY;

            // Calculate new position
            var newX = clientX - startOffsetX;
            var newY = clientY - startOffsetY;

            // Apply boundary checking
            var maxX = window.innerWidth - floatingButton.offsetWidth;
            var maxY = window.innerHeight - floatingButton.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            // Update button position
            floatingButton.style.left = newX + 'px';
            floatingButton.style.top = newY + 'px';
            floatingButton.style.bottom = 'auto';
            floatingButton.style.right = 'auto';
        }
    }

    function endDrag() {
        if (isDragging) {
            isDragging = false;
            // Save position for persistence
            GM_setValue('floatingButtonX', parseInt(floatingButton.style.left));
            GM_setValue('floatingButtonY', parseInt(floatingButton.style.top));
        }
    }

    // Function to show error message
    function showError(message) {
        var errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Hide after 5 seconds
        setTimeout(function() {
            errorElement.style.display = 'none';
        }, 5000);
    }

    // Add click event to the floating button
    floatingButton.addEventListener('click', function() {
        // Store the current URL to be used on the Yandex GPT site
        GM_setValue('sourceArticleUrl', window.location.href);
        // Open YandexGPT with the current URL
        window.open('https://300.ya.ru/?url=' + encodeURIComponent(window.location.href), '_blank');
    });
})();