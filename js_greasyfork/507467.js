// ==UserScript==
// @name         Amazon Seller Product Price Loader
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Optimized version to load Amazon product prices with customizable settings, minimized RAM usage, and UI.
// @license      MIT https://opensource.org/licenses/MIT
// @match        https://sellercentral.amazon.com/*
// @match        https://sellercentral.amazon.co.uk/*
// @match        https://sellercentral.amazon.de/*
// @match        https://sellercentral.amazon.fr/*
// @match        https://sellercentral.amazon.it/*
// @match        https://sellercentral.amazon.es/*
// @match        https://sellercentral.amazon.ca/*
// @match        https://sellercentral.amazon.com.mx/*
// @match        https://sellercentral.amazon.com.br/*
// @match        https://sellercentral.amazon.co.jp/*
// @match        https://sellercentral.Amazon.com.br/*
// @match        https://sellercentral.amazon.com.au/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @resource     IMPORTED_CSS https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/507467/Amazon%20Seller%20Product%20Price%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/507467/Amazon%20Seller%20Product%20Price%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function applySettings() {
        // Apply font size, font family, and bold settings
        document.body.style.fontSize = `${options.fontSize}px`;
        document.body.style.fontFamily = options.fontFamily;
        document.body.style.fontWeight = options.fontBold ? 'bold' : 'normal';

        // Apply font color
        document.body.style.color = options.fontColor || 'initial';

        // Apply glow settings if enabled
        if (options.glowEnabled) {
            document.body.style.textShadow = `0px 0px 5px ${options.glowColor}`;
        } else {
            document.body.style.textShadow = 'none';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Load saved options from GM_setValue
        options.fontSize = GM_getValue('fontSize', 14); // Default to 14px if not set
        options.fontFamily = GM_getValue('fontFamily', 'Arial'); // Default to Arial if not set
        options.fontBold = GM_getValue('fontBold', false); // Default to false if not set
        options.fontColor = GM_getValue('fontColor', '#000000'); // Default to black if not set
        options.glowEnabled = GM_getValue('glowEnabled', false); // Default to false if not set
        options.glowColor = GM_getValue('glowColor', '#ffffff'); // Default to white if not set

        // Apply loaded settings
        applySettings();

        // Create font color input and add event listener
        const fontColorInput = document.createElement('input');
        fontColorInput.type = 'color';
        fontColorInput.value = options.fontColor; // Set the current font color
        fontColorInput.addEventListener('change', (e) => {
            options.fontColor = e.target.value;
            GM_setValue('fontColor', options.fontColor);
            applySettings(); // Reapply settings to update font color immediately
        });

        // Add the font color input to the settings UI (for example, adding to a settings container)
        document.body.appendChild(fontColorInput); // Adjust where you want it placed in your UI
    });

    const defaultOptions = {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        textColor: '#0066c0',
        priceColor: '#0066c0',
        reviewsColor: '#008800',
        sellerColor: '#cc5500',
        glowColor: '#ff00ff',
        showFrame: true,
        frameColor: '#cccccc',
        loadDelay: 10,
        currency: 'default',
        enableNotifications: false
    };

    let options = Object.keys(defaultOptions).reduce((acc, key) => {
        acc[key] = GM_getValue(key, defaultOptions[key]);
        return acc;
    }, {});

    const MAX_RETRIES = 2;
    const RETRY_DELAY = 40;

    // Add Tailwind CSS
    GM_addStyle(GM_getResourceText("IMPORTED_CSS"));

    function addCustomStyle() {
        let styles = [];

        if (options.fontBold) {
            styles.push('font-bold');
        }

        if (options.glowIntensity > 0) {
            styles.push(`text-shadow: 0 0 ${options.glowIntensity * 20}px ${options.glowColor}`);
        }

        styles.push(`color: ${options.priceColor}`);
        styles.push(`font-family: ${options.fontFamily}`);
        styles.push(`font-size: ${options.fontSize}`);

        const glowBlurRadius = options.glowIntensity * 10;
        const glowSpreadRadius = options.glowIntensity * 5;
        styles.push(`text-shadow: 0 0 ${glowBlurRadius}px ${options.glowColor}, 0 0 ${glowSpreadRadius}px ${options.glowColor}`);

        styles.push(`color: ${options.priceColor}`);
        styles.push(`font-family: ${options.fontFamily}`);
        styles.push(`font-size: ${options.fontSize}`);

        const customStyle = styles.join('; ');
        document.documentElement.style.setProperty('--custom-style', customStyle);

        if (options.glowIntensity > 0) {
            styles.push(`text-shadow: 0 0 ${options.glowIntensity * 20}px ${options.glowColor}`);
        }

        styles.push(`color: ${options.priceColor}`);
        styles.push(`font-family: ${options.fontFamily}`);
        styles.push(`font-size: ${options.fontSize}`);
        const isDarkMode = document.body.classList.contains('dark');

        function getInvertedColor(color) {
            // Convert the hex color to RGB
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            // Invert the RGB values
            const invR = 255 - r;
            const invG = 255 - g;
            const invB = 255 - b;

            // Convert the inverted RGB values back to hex
            return `#${invR.toString(16).padStart(2, '0')}${invG.toString(16).padStart(2, '0')}${invB.toString(16).padStart(2, '0')}`;
        }

        GM_addStyle(`
        .price-display-container {
            display: block;
            margin-top: 4px;
        }
        .price-display {
            display: block;
            font-size: ${options.fontSize};
            font-family: ${options.fontFamily};
            color: ${isDarkMode ? getInvertedColor(options.priceColor) : options.priceColor};
            text-shadow: 0 0 ${glowBlurRadius}px ${options.glowColor}, 0 0 ${glowSpreadRadius}px ${options.glowColor};
            font-weight: ${options.fontBold ? 'bold' : 'normal'};
            -webkit-text-stroke: 2px var(--glow-color);
        }
        .rating-display {
            display: block;
            font-size: ${options.fontSize};
            font-family: ${options.fontFamily};
            color: ${isDarkMode ? getInvertedColor(options.reviewsColor) : options.reviewsColor};
            text-shadow: 0 0 ${glowBlurRadius}px ${options.glowColor}, 0 0 ${glowSpreadRadius}px ${options.glowColor};
            font-weight: ${options.fontBold ? 'bold' : 'normal'};
            -webkit-text-stroke: 2px var(--glow-color);
        }
        .seller-display {
            display: block;
            font-size: ${options.fontSize};
            font-family: ${options.fontFamily};
            color: ${isDarkMode ? getInvertedColor(options.sellerColor) : options.sellerColor};
            text-shadow: 0 0 ${glowBlurRadius}px ${options.glowColor}, 0 0 ${glowSpreadRadius}px ${options.glowColor};
            font-weight: ${options.fontBold ? 'bold' : 'normal'};
            -webkit-text-stroke: 2px var(--glow-color);
        }
        .loading {
            opacity: 0.9;
            padding: 1px 8px;
            border: 1px solid ${options.frameColor};
            display: inline-block;
        }

        #amazon-price-loader-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 90%;
            overflow: hidden;
            border: 1px solid #ccc;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }

        .tooltip {
            position: absolute;
            background: white;
            border: 1px solid black;
            padding: 10px;
            z-index: 1000;
        }

        .setting-row {
            display: flex;
            flex-direction: column;
            width: 48%;
            margin-bottom: 10px;
        }

        .setting-label {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .setting-button {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-size: 14px;
            width: 100%;
            margin-top: 10px;
        }

        .setting-button:hover {
            background-color: #0056b3;
        }

        .color-picker {
            width: 100%;
            height: 30px;
            border: none;
            padding: 0;
            cursor: pointer;
        }

        .font-picker {
            width: 100%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .font-size-input {
            width: 100%;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
    `);
    }

    function createSettingsUI() {
        // Check if the settings overlay already exists
        if (document.querySelector('.settings-overlay')) {
            return; // Exit the function if the overlay is already present
        }
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container bg-white shadow-md rounded-lg p-2 w-48';
        const title = document.createElement('h2');
        title.textContent = 'Settings';
        title.classList.add('text-xs', 'font-bold', 'mb-2');
        settingsContainer.style.position = 'fixed';
        settingsContainer.style.top = '0px'; // Adjust the value to move the menu up or down
        settingsContainer.style.right = '70px'; // Adjust the value to move the menu left or right

        settingsContainer.appendChild(title);

        // Display Settings
        const displaySettings = document.createElement('div');
        displaySettings.classList.add('mb-2');

        const fontSizeRow = document.createElement('div');
        fontSizeRow.classList.add('flex', 'items-center', 'justify-between');

        const fontSizeLabel = document.createElement('label');
        fontSizeLabel.textContent = 'Size';
        fontSizeLabel.classList.add('text-xxs', 'font-medium');

        const fontSizeInput = document.createElement('input');
        fontSizeInput.type = 'number';
        fontSizeInput.value = options.fontSize.replace('px', '');
        fontSizeInput.min = 8;
        fontSizeInput.max = 36;
        fontSizeInput.className = 'w-10 px-1 py-0.5 border rounded text-xxs';
        fontSizeInput.onchange = (e) => {
            options.fontSize = `${e.target.value}px`;
            addCustomStyle();
        };

        fontSizeRow.appendChild(fontSizeLabel);
        fontSizeRow.appendChild(fontSizeInput);
        displaySettings.appendChild(fontSizeRow);

        const fontFamilyRow = document.createElement('div');
        fontFamilyRow.classList.add('flex', 'items-center', 'justify-between');

        const fontFamilyLabel = document.createElement('label');
        fontFamilyLabel.textContent = 'Font';
        fontFamilyLabel.classList.add('text-xxs', 'font-medium');

        const fontFamilyInput = document.createElement('select');
        fontFamilyInput.className = 'w-full px-1 py-0.5 border rounded text-xxs';
        fontFamilyInput.onchange = (e) => {
            options.fontFamily = e.target.value;
            addCustomStyle();
        };

        const fonts = [
            'Arial, sans-serif',
            'Times New Roman, serif',
            'Verdana, sans-serif',
            'Georgia, serif',
            'Courier New, monospace',
            'Roboto, sans-serif',
            'Open Sans, sans-serif',
            'Lato, sans-serif',
            'Montserrat, sans-serif',
            'Poppins, sans-serif'
        ];
        fonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            option.selected = options.fontFamily === font;
            fontFamilyInput.appendChild(option);
        });

        // Bold functionality
        const fontBoldRow = document.createElement('div');
        fontBoldRow.classList.add('flex', 'items-center', 'justify-between');

        const fontBoldLabel = document.createElement('label');
        fontBoldLabel.textContent = 'Bold';
        fontBoldLabel.classList.add('text-xxs', 'font-medium');

        const fontBoldCheckbox = document.createElement('input');
        fontBoldCheckbox.type = 'checkbox';
        fontBoldCheckbox.checked = options.fontBold;
        fontBoldCheckbox.className = 'w-4 h-4 border rounded';
        fontBoldCheckbox.onchange = (e) => {
            options.fontBold = e.target.checked;
            addCustomStyle();
        };

        fontBoldRow.appendChild(fontBoldLabel);
        fontBoldRow.appendChild(fontBoldCheckbox);
        displaySettings.appendChild(fontBoldRow);

        fontFamilyRow.appendChild(fontFamilyLabel);
        fontFamilyRow.appendChild(fontFamilyInput);
        displaySettings.appendChild(fontFamilyRow);
        displaySettings.appendChild(fontBoldCheckbox);
        displaySettings.appendChild(fontBoldLabel);

        settingsContainer.appendChild(displaySettings);

        // Color Settings
        const colorSettings = document.createElement('div');
        colorSettings.classList.add('mb-2');

        const priceColorRow = document.createElement('div');
        priceColorRow.classList.add('flex', 'items-center', 'justify-between');

        const priceColorLabel = document.createElement('label');
        priceColorLabel.textContent = 'Price';
        priceColorLabel.classList.add('text-xxs', 'font-medium');

        const priceColorInput = document.createElement('input');
        priceColorInput.type = 'color';
        priceColorInput.value = options.priceColor;
        priceColorInput.className = 'w-5 h-5 border rounded-full';
        priceColorInput.onchange = (e) => {
            options.priceColor = e.target.value;
            addCustomStyle();
        };

        priceColorRow.appendChild(priceColorLabel);
        priceColorRow.appendChild(priceColorInput);
        colorSettings.appendChild(priceColorRow);

        const reviewsColorRow = document.createElement('div');
        reviewsColorRow.classList.add('flex', 'items-center', 'justify-between');

        const reviewsColorLabel = document.createElement('label');
        reviewsColorLabel.textContent = 'Reviews';
        reviewsColorLabel.classList.add('text-xxs', 'font-medium');

        const reviewsColorInput = document.createElement('input');
        reviewsColorInput.type = 'color';
        reviewsColorInput.value = options.reviewsColor;
        reviewsColorInput.className = 'w-5 h-5 border rounded-full';
        reviewsColorInput.onchange = (e) => {
            options.reviewsColor = e.target.value;
            addCustomStyle();
        };

        reviewsColorRow.appendChild(reviewsColorLabel);
        reviewsColorRow.appendChild(reviewsColorInput);
        colorSettings.appendChild(reviewsColorRow);

        const sellerColorRow = document.createElement('div');
        sellerColorRow.classList.add('flex', 'items-center', 'justify-between');

        const sellerColorLabel = document.createElement('label');
        sellerColorLabel.textContent = 'Seller';
        sellerColorLabel.classList.add('text-xxs', 'font-medium');

        const sellerColorInput = document.createElement('input');
        sellerColorInput.type = 'color';
        sellerColorInput.value = options.sellerColor;
        sellerColorInput.className = 'w-5 h-5 border rounded-full';
        sellerColorInput.onchange = (e) => {
            options.sellerColor = e.target.value;
            addCustomStyle();
        };

        sellerColorRow.appendChild(sellerColorLabel);
        sellerColorRow.appendChild(sellerColorInput);
        colorSettings.appendChild(sellerColorRow);

        settingsContainer.appendChild(colorSettings);

        // Global Glow Settings
        const glowSettings = document.createElement('div');
        glowSettings.classList.add('mb-2');

        const glowColorRow = document.createElement('div');
        glowColorRow.classList.add('flex', 'items-center', 'justify-between');

        const glowColorLabel = document.createElement('label');
        glowColorLabel.textContent = 'Glow Color';
        glowColorLabel.classList.add('text-xxs', 'font-medium');

        const glowColorInput = document.createElement('input');
        glowColorInput.type = 'color';
        glowColorInput.value = options.glowColor;
        glowColorInput.className = 'w-5 h-5 border rounded-full';
        glowColorInput.onchange = (e) => {
            options.glowColor = e.target.value;
            GM_setValue('glowColor', options.glowColor); // Save to memory
            addCustomStyle();
        };
        const glowColor = options.glowColor || '#ff00ff';
        const glowIntensity = options.glowIntensity || 0.5;
        const isBold = options.isBold ? 'bold' : 'normal';
        const fontColor = options.fontColor || '#000000';

        const style = document.createElement('style');
        style.innerHTML = `
        .price-display, .rating-display, .seller-display {
            text-shadow: 0 0 ${glowIntensity * 10}px ${glowColor}; /* Apply glow */
            color: ${fontColor}; /* Apply font color */
            font-weight: ${isBold}; /* Apply bold if set */
        }
    `;
        document.head.appendChild(style);
        addCustomStyle();

        const glowIntensityInput = document.createElement('input');
        glowIntensityInput.type = 'range';
        glowIntensityInput.min = 0;
        glowIntensityInput.max = 1;
        glowIntensityInput.step = 0.01;
        glowIntensityInput.value = options.glowIntensity;
        glowIntensityInput.className = 'w-full';
        glowIntensityInput.onchange = (e) => {
            options.glowIntensity = parseFloat(e.target.value);
            GM_setValue('glowIntensity', options.glowIntensity); // Save to memory
            addCustomStyle();
        };

        const glowIntensityLabel = document.createElement('label');
        glowIntensityLabel.textContent = 'Glow Intensity';
        glowIntensityLabel.classList.add('text-xxs', 'font-medium');

        glowColorRow.appendChild(glowColorLabel);
        glowColorRow.appendChild(glowColorInput);
        glowSettings.appendChild(glowColorRow);
        glowSettings.appendChild(glowIntensityLabel);
        glowSettings.appendChild(glowIntensityInput);

        settingsContainer.appendChild(glowSettings);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('flex', 'justify-end', 'space-x-2');

        const saveButton = document.createElement('button');
        saveButton.className = 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-0.5 px-2 rounded text-xxs';
        saveButton.textContent = 'Close';
        saveButton.onclick = () => {
            options.fontSize = `${fontSizeInput.value}px`;
            options.fontFamily = fontFamilyInput.value;
            options.fontBold = fontBoldCheckbox.checked;
            options.priceColor = priceColorInput.value;
            options.reviewsColor = reviewsColorInput.value;
            options.sellerColor = sellerColorInput.value;
            options.glowColor = GM_getValue('glowColor', '#ff00ff'); // Default glow color
            options.glowIntensity = GM_getValue('glowIntensity', 0.5); // Default glow intensity
            options.isBold = GM_getValue('isBold', false); // Default bold setting (false = not bold)
            options.fontColor = GM_getValue('fontColor', '#000000'); // Default font color


            Object.keys(options).forEach(key => {
                GM_setValue(key, options[key]);
            });

            addCustomStyle();
            document.body.removeChild(settingsOverlay);
        };



        buttonsContainer.appendChild(saveButton);
        settingsContainer.appendChild(buttonsContainer);

        const settingsOverlay = document.createElement('div');
        settingsOverlay.className = 'settings-overlay';
        settingsOverlay.appendChild(settingsContainer);
        settingsOverlay.style.backgroundColor = 'transparent'; // Ensure it's transparent
        document.body.appendChild(settingsOverlay);
    }

    function getCurrencySymbol(currency) {
        const symbols = {
            'USD': '$ ',
            'EUR': '€ ',
            'GBP': '£ ',
            'NIS': '₪ ',
            'JPY': '¥ '
        };
        return symbols[currency] || '';
    }

    async function fetchPriceAndRating(url, retries = 0) {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 5000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            const priceElement = doc.querySelector('.a-price .a-offscreen');
            let price = priceElement ? priceElement.textContent.trim() : 'No price found';

            if (options.currency !== 'default') {
                price = `${getCurrencySymbol(options.currency)} ${price.replace(/[^\d.]/g, '')}`;
            }

            const ratingElement = doc.querySelector('.a-icon-alt');
            let rating = ratingElement ? ratingElement.textContent : 'No rating found';
            const numberOfRatingsElement = doc.querySelector('#acrCustomerReviewText');
            let numberOfRatings = numberOfRatingsElement ? numberOfRatingsElement.textContent : '0 ratings';

            return { price, rating, numberOfRatings };
        } catch (error) {
            if (retries < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return fetchPriceAndRating(url, retries + 1);
            }
            return { price: 'Error fetching price', rating: 'Error fetching rating', numberOfRatings: 'Error fetching ratings' };
        }
    }

    async function fetchPriceRatingAndSeller(url, retries = 0) {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 5000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });

            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            const priceElement = doc.querySelector('.a-price .a-offscreen');
            let price = priceElement ? priceElement.textContent.trim() : 'No price found';

            if (options.currency !== 'default') {
                price = `${getCurrencySymbol(options.currency)} ${price.replace(/[^\d.]/g, '')}`;
            }

            const ratingElement = doc.querySelector('.a-icon-alt');
            let rating = ratingElement ? ratingElement.textContent : 'No rating found';

            const numberOfRatingsElement = doc.querySelector('#acrCustomerReviewText');
            let numberOfRatings = numberOfRatingsElement ? numberOfRatingsElement.textContent : '0 ratings';

            const sellerElement = doc.querySelector('#sellerProfileTriggerId');
            let sellerName = sellerElement ? sellerElement.textContent.trim() : 'Seller info not available';

            return { price, rating, numberOfRatings, sellerName };
        } catch (error) {
            if (retries < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return fetchPriceRatingAndSeller(url, retries + 1);
            }
            return { price: 'Error fetching price', rating: 'Error fetching rating', numberOfRatings: 'Error fetching ratings', sellerName: 'Error fetching seller' };
        }
    }

    async function displayPriceRatingAndSeller(link) {
        const existingDisplay = link.nextElementSibling;
        if (existingDisplay && existingDisplay.classList.contains('price-display-container')) return;

        const parentContainer = document.createElement('div');
        parentContainer.className = 'price-link-container';
        link.parentNode.insertBefore(parentContainer, link);
        parentContainer.appendChild(link);

        const container = document.createElement('div');
        container.className = 'price-display-container loading';
        container.style.border = options.showFrame ? `0.1px solid ${options.frameColor}` : 'none';
        container.style.padding = '0.1em';

        const priceDisplay = document.createElement('div');
        priceDisplay.className = 'price-display';
        priceDisplay.textContent = 'Loading price...';

        const ratingDisplay = document.createElement('div');
        ratingDisplay.className = 'rating-display';
        ratingDisplay.textContent = 'Loading rating...';

        const sellerDisplay = document.createElement('div');
        sellerDisplay.className = 'seller-display';
        sellerDisplay.textContent = 'Loading seller...';

        container.appendChild(priceDisplay);
        container.appendChild(ratingDisplay);
        container.appendChild(sellerDisplay);
        parentContainer.appendChild(container);

        try {
            await new Promise(resolve => setTimeout(resolve, options.loadDelay));
            const { price, rating, numberOfRatings, sellerName } = await fetchPriceRatingAndSeller(link.href);

            priceDisplay.textContent = price;
            ratingDisplay.textContent = `${rating} (${numberOfRatings})`;
            sellerDisplay.textContent = `Seller: ${sellerName}`;

            priceDisplay.classList.remove('loading');
            ratingDisplay.classList.remove('loading');
            sellerDisplay.classList.remove('loading');

            if (options.enableNotifications && price !== 'No price found' && price !== 'Error fetching price') {
                alert(`Price fetched: ${price}`);
            }
        } catch (error) {
            console.error('Failed to fetch price and rating', error);
        }
    }

    function setupPriceAndRatingDisplay() {
        const productLinks = document.querySelectorAll('a[href*="/dp/"]');
        productLinks.forEach(link => displayPriceRatingAndSeller(link));
    }

    addCustomStyle();
    setupPriceAndRatingDisplay();

    // Register the command for settings
    GM_registerMenuCommand('Amazon Price Loader Settings', createSettingsUI);

    // MutationObserver to monitor changes on the page
    const observer = new MutationObserver(setupPriceAndRatingDisplay);
    observer.observe(document.body, { childList: true, subtree: true });
})();