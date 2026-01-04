// ==UserScript==
// @name         Erai-raws Image previews next to anime titles
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Show image preview next to the anime titles on Erai-raws
// @author       dr.bobo0
// @license      MIT
// @match        https://www.erai-raws.info/
// @match        https://www.erai-raws.info/latest-releases/*
// @match        https://www.erai-raws.info/episodes/*
// @match        https://www.erai-raws.info/subtitles/*
// @match        https://www.erai-raws.info/batches/*
// @match        https://www.erai-raws.info/specials/*
// @match        https://www.erai-raws.info/encodes/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAMFBMVEVHcEy3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISG3ISFbcynrAAAAD3RSTlMA1OaywnKHOhgNXPQmnEsN6GgJAAACVUlEQVRYhe1WSYKEIAyUfZf//3YgLAbEbpzrTJ1EKbJVIsfxj78Ck/BLqj4lI9TF6Ci3r8mW0YjBX7EliTeIbfo5sAkPQQaWHjbp6qKTYH07NEa6x5eNzawuB6YzfHIghi1+qBmztXI21UBleqRbtVRAD7qtxRXOnhZ49h1tbXS6K4NUejmtc0DnJv04UgU8XvvAgtVPuxcQ2dvfKh/AS/2F8otjjLJCJlh//9bRdZBbiBLCawBKcoc+fdI1OiJD5sbit854ELa2gbpx57lgx7UwtRh70FHCGcdNTa3y2mh/ZsHOiTiRIcrkCVkUzZ3i1xW5mgRz2G7IsavwtTNc8JAYhghkWPUWdkHhY8EssTWxw0wiOI0t72RWfIqKqWPF97gONfiF4o2ATIkbP2u+vyh8oo4nnPe6B5TR4v8HZak7HzhV6xqK9KHhPGwYXjFsUqxl6V0NUedKOGxA0aGkKQPu3nhnc9HAbiQ6mK9YEmQV/xUjCOTKb5mvQyPMMyhb5d0GPLXyatHkivXCsAFAmcQQF9gjUsB/toudmWk7zqGpVqAu02So9Mlhk3cLaD3je+uz7kpgmM3FveD13+HQIKEQta0CpuUzYUKtx+3saJ13IMD8P8sldUtmw/A7b1cRUGgEh8dKLuFF4GkApznUX9GLlrMgn6hP4Kjcdq32j4BZ1qxCNO/4YpQ7/Z6EEaUA1/ptElABLofeJIHMdVPvkgAJHFrc4J78CjUmsPvE1tvvoPF+I5OlHbauKmol3JLWuHWAnxNQ3jJKw+ZdybLXN/t//HX8ACejMFAROu21AAAAAElFTkSuQmCC
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/506193/Erai-raws%20Image%20previews%20next%20to%20anime%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/506193/Erai-raws%20Image%20previews%20next%20to%20anime%20titles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Configuration and Defaults ===
    const storagePrefix = "erai_raws_image_cache_";
    let imageSize = GM_getValue('imageSize', 90);
    let useSquareImages = GM_getValue('useSquareImages', false);
    let imagePosition = GM_getValue('imagePosition', 'left');
    let loadingAnimation = GM_getValue('loadingAnimation', 'spin');
    const maxRetries = 3;

    // === Cache Management Functions ===
    function clearAllCache() {
        const keys = GM_listValues();
        for (const key of keys) {
            if (key.startsWith(storagePrefix)) {
                GM_deleteValue(key);
            }
        }
    }

    function getCachedImageCount() {
        const keys = GM_listValues();
        return keys.filter(key => key.startsWith(storagePrefix)).length;
    }

    // === Spinner Creation with Multiple Styles ===
    function createSpinner() {
        if (loadingAnimation === 'none') return null;

        const spinner = document.createElement('div');
        spinner.className = `erai-raws-spinner ${loadingAnimation}`;
        spinner.style.position = "absolute";
        spinner.style.top = "50%";
        spinner.style.left = "50%";
        spinner.style.transform = "translate(-50%, -50%)";

        const style = document.createElement('style');
        style.textContent = `
            .erai-raws-spinner.spin {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
            }
            .erai-raws-spinner.pulse {
                width: 30px;
                height: 30px;
                background-color: #3498db;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
            }
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.5; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        return spinner;
    }

    // === Image Fetching with Direct URL ===
    function fetchImage(url, retryCount = 0) {
        return new Promise((resolve, reject) => {
            const localStorageKey = storagePrefix + url;
            const cachedImage = GM_getValue(localStorageKey);

            if (cachedImage) {
                resolve(cachedImage);
                return;
            }

            // Get the preview image URL directly from the first tr's data-preview-image attribute
            const firstRow = document.querySelector(`tr[data-preview-image]`);
            if (firstRow && firstRow.getAttribute('data-preview-image')) {
                const previewUrl = firstRow.getAttribute('data-preview-image');
                try {
                    GM_setValue(localStorageKey, previewUrl);
                } catch (e) {
                    console.warn("GM storage is full or unavailable. Image caching failed.", e);
                }
                resolve(previewUrl);
                return;
            }

            // Fallback to original fetch method if data-preview-image is not available
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    let preview = doc.querySelector(".entry-content-poster img[data-src]");
                    let imageSrc;

                    if (preview) {
                        imageSrc = preview.getAttribute("data-src");
                    } else {
                        preview = doc.querySelector(".entry-content-poster img");
                        if (preview) {
                            imageSrc = preview.getAttribute("src");
                        } else {
                            throw new Error("Image not found in the fetched HTML.");
                        }
                    }

                    if (imageSrc) {
                        try {
                            GM_setValue(localStorageKey, imageSrc);
                        } catch (e) {
                            console.warn("GM storage is full or unavailable. Image caching failed.", e);
                        }
                        resolve(imageSrc);
                    } else {
                        throw new Error("Image source not found in the fetched HTML.");
                    }
                })
                .catch((error) => {
                    if (retryCount < maxRetries) {
                        console.warn(`Fetch failed for ${url}. Retrying... (${retryCount + 1}/${maxRetries})`, error);
                        setTimeout(() => {
                            fetchImage(url, retryCount + 1).then(resolve).catch(reject);
                        }, 1000);
                    } else {
                        reject(`Failed to load image after ${maxRetries} retries: ${error.message}`);
                    }
                });
        });
    }

    // === Adjust Release Links Styling ===
    function adjustReleaseLinks() {
        document.querySelectorAll('.release-links').forEach(row => {
            const th = row.querySelector('th');
            if (th) {
                th.style.display = 'block';
                th.style.width = '100%';
                th.querySelectorAll('a').forEach(link => {
                    link.style.marginRight = '10px';
                });
            }
        });
    }

    // === Inject Images into the Page ===
    function injectImages() {
        const tbodies = document.querySelectorAll("table.table:not(.table_side) tbody");
        tbodies.forEach(tbody => {
            if (tbody.classList.contains('has-image')) return;

            const firstRow = tbody.querySelector("tr");
            if (!firstRow) return;

            const titleCell = firstRow.querySelector("th");
            if (!titleCell) return;

            const link = titleCell.querySelector("a.aa_ss_ops_new");
            if (!link) return;

            // Create wrappers
            const wrapper = document.createElement("div");
            wrapper.className = 'erai-raws-preview-wrapper';
            wrapper.style.display = "flex";
            wrapper.style.alignItems = "flex-start";
            wrapper.style.flexDirection = imagePosition === 'left' ? 'row' : 'row-reverse';

            const imgWrapper = document.createElement("div");
            imgWrapper.style.position = "relative";
            imgWrapper.style.width = `${imageSize}px`;
            imgWrapper.style.height = useSquareImages ? `${imageSize}px` : 'auto';
            imgWrapper.style.margin = imagePosition === 'left' ? '0 10px 0 0' : '0 0 0 10px';

            const img = document.createElement("img");
            img.className = 'erai-raws-preview-image';
            img.style.width = '100%';
            img.style.height = useSquareImages ? '100%' : 'auto';
            img.style.objectFit = useSquareImages ? "cover" : "contain";

            const spinner = createSpinner();
            if (spinner) imgWrapper.appendChild(spinner);
            imgWrapper.appendChild(img);

            const contentWrapper = document.createElement("div");
            contentWrapper.style.flexGrow = "1";
            contentWrapper.style.display = "flex";
            contentWrapper.style.flexDirection = "column";

            // Move existing rows to contentWrapper
            Array.from(tbody.children).forEach(row => contentWrapper.appendChild(row));

            // Style rows
            const rows = contentWrapper.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.marginBottom = '2px';
                const cells = row.querySelectorAll('th, td');
                cells.forEach(cell => {
                    cell.style.paddingTop = '2px';
                    cell.style.paddingBottom = '2px';
                });
            });

            // Add separators
            if (rows.length >= 3) {
                const separator = document.createElement('hr');
                separator.style.margin = '2px 0';
                separator.style.borderTop = '1px solid #444';

                rows[0].after(separator.cloneNode());
                rows[1].after(separator.cloneNode());
            }

            // Handle resolution options
            const resolutionOptions = contentWrapper.querySelectorAll('.res-label');
            if (resolutionOptions.length > 0) {
                const resolutionWrapper = document.createElement("div");
                resolutionWrapper.style.alignSelf = "flex-end";
                resolutionWrapper.style.marginLeft = "auto";
                resolutionOptions.forEach(option => resolutionWrapper.appendChild(option));

                const clockRow = contentWrapper.querySelector('tr:has(.clock_font)');
                if (clockRow) {
                    const clockCell = clockRow.querySelector('th');
                    clockCell.style.display = "flex";
                    clockCell.style.justifyContent = "space-between";
                    clockCell.style.alignItems = "center";
                    clockCell.appendChild(resolutionWrapper);
                }
            }

            // Append wrappers
            wrapper.appendChild(imgWrapper);
            wrapper.appendChild(contentWrapper);

            // Clear tbody and append new structure
            tbody.innerHTML = '';
            const newRow = document.createElement("tr");
            const newCell = document.createElement("td");
            newCell.colSpan = "12";
            newCell.appendChild(wrapper);
            newRow.appendChild(newCell);
            tbody.appendChild(newRow);

            // Get preview image URL from data-preview-image attribute if available
            const previewImageUrl = firstRow.getAttribute('data-preview-image');
            if (previewImageUrl) {
                img.src = previewImageUrl;
                tbody.classList.add('has-image');
                if (spinner) spinner.style.display = 'none';
            } else {
                // Fallback to fetching image if attribute not available
                fetchImage(link.href)
                    .then(imageSrc => {
                        img.src = imageSrc;
                        tbody.classList.add('has-image');
                        if (spinner) spinner.style.display = 'none';
                    })
                    .catch(error => {
                        console.error("Image fetch error:", error);
                        if (spinner) spinner.style.display = 'none';
                    });
            }
        });

        adjustReleaseLinks();
    }

    // === Update Image Styles Based on Settings ===
    function updateImageStyles() {
        document.querySelectorAll(".erai-raws-preview-wrapper").forEach(wrapper => {
            wrapper.style.flexDirection = imagePosition === 'left' ? 'row' : 'row-reverse';

            const imgWrapper = wrapper.querySelector('.erai-raws-preview-image').parentNode;
            imgWrapper.style.width = `${imageSize}px`;
            imgWrapper.style.height = useSquareImages ? `${imageSize}px` : 'auto';
            imgWrapper.style.margin = imagePosition === 'left' ? '0 10px 0 0' : '0 0 0 10px';

            const img = imgWrapper.querySelector('.erai-raws-preview-image');
            img.style.width = '100%';
            img.style.height = useSquareImages ? '100%' : 'auto';
            img.style.objectFit = useSquareImages ? "cover" : "contain";

            const spinner = imgWrapper.querySelector('.erai-raws-spinner');
            if (spinner) {
                spinner.className = `erai-raws-spinner ${loadingAnimation}`;
            } else if (loadingAnimation !== 'none') {
                const newSpinner = createSpinner();
                if (newSpinner) imgWrapper.insertBefore(newSpinner, img);
            }
        });
    }

    // === Create Settings Popup ===
    function createSettingsPopup() {
        // Prevent multiple popups
        if (document.querySelector('.erai-raws-settings-popup')) return;

        const popup = document.createElement('div');
        popup.className = 'erai-raws-settings-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#1e1e1e';
        popup.style.padding = '30px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
        popup.style.zIndex = '9999';
        popup.style.color = '#e0e0e0';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.minWidth = '300px';
        popup.style.border = '1px solid #333';

        // Accessibility Enhancements
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'true');
        popup.setAttribute('aria-labelledby', 'settingsTitle');

        const title = document.createElement('h2');
        title.id = 'settingsTitle';
        title.textContent = 'Image Preview Settings';
        title.style.marginTop = '0';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        title.style.color = '#fff';
        popup.appendChild(title);

        // === Create Label Helper Function ===
        const createLabel = (text) => {
            const label = document.createElement('label');
            label.textContent = text;
            label.style.marginBottom = '5px';
            label.style.color = '#bbb';
            label.style.display = 'block';
            return label;
        };

        // === Image Size Control ===
        popup.appendChild(createLabel('Image Size'));

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '50';
        slider.max = '200';
        slider.value = imageSize;
        slider.style.width = '100%';
        slider.style.marginBottom = '15px';
        slider.style.accentColor = '#8844ee';
        slider.id = 'imageSizeSlider';

        const sizeLabel = document.createElement('div');
        sizeLabel.textContent = `${imageSize}px`;
        sizeLabel.style.marginBottom = '20px';
        sizeLabel.style.textAlign = 'center';
        sizeLabel.style.fontWeight = 'bold';
        sizeLabel.style.color = '#fff';

        slider.addEventListener('input', () => {
            const newSize = parseInt(slider.value);
            imageSize = newSize;
            sizeLabel.textContent = `${newSize}px`;
            updateImageStyles();
        });

        popup.appendChild(slider);
        popup.appendChild(sizeLabel);

        // === Square Images Toggle ===
        const squareCheckbox = document.createElement('input');
        squareCheckbox.type = 'checkbox';
        squareCheckbox.id = 'squareImages';
        squareCheckbox.checked = useSquareImages;
        squareCheckbox.style.marginRight = '10px';
        squareCheckbox.addEventListener('change', () => {
            useSquareImages = squareCheckbox.checked;
            updateImageStyles();
        });

        const squareLabel = document.createElement('label');
        squareLabel.htmlFor = 'squareImages';
        squareLabel.textContent = 'Use Square Images';
        squareLabel.style.display = 'flex';
        squareLabel.style.alignItems = 'center';
        squareLabel.style.marginBottom = '20px';
         squareLabel.style.cursor = 'pointer';
         squareLabel.insertBefore(squareCheckbox, squareLabel.firstChild);

        popup.appendChild(squareLabel);

         // === Image Position Control ===
        const positionLabel = createLabel('Image Position');

        const positionSelect = document.createElement('select');
        positionSelect.style.width = '100%';
        positionSelect.style.marginBottom = '20px';
        positionSelect.style.padding = '5px';
        positionSelect.style.backgroundColor = '#333';
        positionSelect.style.color = '#fff';
        positionSelect.style.border = '1px solid #555';
        positionSelect.style.borderRadius = '3px';
        positionSelect.addEventListener('change', () => {
            imagePosition = positionSelect.value;
            updateImageStyles();
        });

         const leftOption = document.createElement('option');
        leftOption.value = 'left';
        leftOption.textContent = 'Left';
        positionSelect.appendChild(leftOption);

        const rightOption = document.createElement('option');
        rightOption.value = 'right';
        rightOption.textContent = 'Right';
        positionSelect.appendChild(rightOption);

        positionSelect.value = imagePosition;
        popup.appendChild(positionLabel);
        popup.appendChild(positionSelect);

        // === Loading Animation Style Control ===
        const loadingLabel = createLabel('Loading Animation');

        const loadingSelect = document.createElement('select');
        loadingSelect.style.width = '100%';
        loadingSelect.style.marginBottom = '20px';
        loadingSelect.style.padding = '5px';
        loadingSelect.style.backgroundColor = '#333';
        loadingSelect.style.color = '#fff';
        loadingSelect.style.border = '1px solid #555';
        loadingSelect.style.borderRadius = '3px';
         loadingSelect.addEventListener('change', () => {
            loadingAnimation = loadingSelect.value;
            GM_setValue('loadingAnimation', loadingAnimation);
            updateImageStyles();
         });

         const noneOption = document.createElement('option');
        noneOption.value = 'none';
        noneOption.textContent = 'None';
        loadingSelect.appendChild(noneOption);

         const spinOption = document.createElement('option');
        spinOption.value = 'spin';
        spinOption.textContent = 'Spin';
        loadingSelect.appendChild(spinOption);

        const pulseOption = document.createElement('option');
        pulseOption.value = 'pulse';
        pulseOption.textContent = 'Pulse';
        loadingSelect.appendChild(pulseOption);

        loadingSelect.value = loadingAnimation;
        popup.appendChild(loadingLabel);
        popup.appendChild(loadingSelect);

        // === Buttons ===
        const buttonStyle = `
            padding: 10px 15px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s, transform 0.1s;
            color: #fff;
        `;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = buttonStyle;
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.addEventListener('click', () => {
            GM_setValue('imageSize', imageSize);
            GM_setValue('useSquareImages', useSquareImages);
            GM_setValue('imagePosition', imagePosition);
            GM_setValue('loadingAnimation', loadingAnimation);
             document.body.removeChild(popup);
        });
         saveButton.addEventListener('mouseover', () => {
            saveButton.style.backgroundColor = '#45a049';
        });
        saveButton.addEventListener('mouseout', () => {
            saveButton.style.backgroundColor = '#4CAF50';
        });


        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
         cancelButton.style.cssText = buttonStyle;
         cancelButton.style.backgroundColor = '#f44336';
        cancelButton.addEventListener('click', () => {
             document.body.removeChild(popup);
            location.reload();
        });
         cancelButton.addEventListener('mouseover', () => {
            cancelButton.style.backgroundColor = '#da190b';
        });
        cancelButton.addEventListener('mouseout', () => {
            cancelButton.style.backgroundColor = '#f44336';
        });

        // === Cache Information and Management ===
        const cacheInfoDiv = document.createElement('div');
        cacheInfoDiv.style.marginTop = '20px';
        cacheInfoDiv.style.textAlign = 'center';
        cacheInfoDiv.style.color = '#bbb';
        cacheInfoDiv.textContent = `Images cached: ${getCachedImageCount()}`;
        popup.appendChild(cacheInfoDiv);

         const clearCacheButton = document.createElement('button');
        clearCacheButton.textContent = 'Clear Cache';
        clearCacheButton.style.cssText = buttonStyle;
        clearCacheButton.style.backgroundColor = '#2196F3';
        clearCacheButton.style.display = 'block';
        clearCacheButton.style.width = '100%';
        clearCacheButton.style.marginTop = '15px';
         clearCacheButton.addEventListener('click', () => {
            clearAllCache();
            cacheInfoDiv.textContent = `Images cached: ${getCachedImageCount()}`;
            alert('Cache cleared successfully!');
        });
         clearCacheButton.addEventListener('mouseover', () => {
            clearCacheButton.style.backgroundColor = '#0b7dda';
        });
        clearCacheButton.addEventListener('mouseout', () => {
            clearCacheButton.style.backgroundColor = '#2196F3';
        });

        // === Button Container ===
         const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);

         popup.appendChild(buttonContainer);
         popup.appendChild(clearCacheButton);


         // === Accessibility: Focus Management and Keyboard Controls ===
        popup.tabIndex = -1;
        popup.focus();


        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                document.body.removeChild(popup);
                 document.removeEventListener('keydown', handleKeyDown);
            }
        }
        document.addEventListener('keydown', handleKeyDown);

         // Remove event listener when popup is removed
        popup.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleKeyDown);
        });

         document.body.appendChild(popup);
    }

    // === Register Menu Command for Settings ===
    GM_registerMenuCommand("Erai-raws Image Preview Settings", createSettingsPopup);

    // === Keyboard Shortcut for Settings (Ctrl+Shift+S) ===
    function handleKeyboardShortcut(event) {
        // Check for Ctrl + Shift + S
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 's') {
            event.preventDefault();
            createSettingsPopup();
        }
    }

    document.addEventListener('keydown', handleKeyboardShortcut);


    // === Initialize Script ===
    injectImages();
    adjustReleaseLinks();

})();