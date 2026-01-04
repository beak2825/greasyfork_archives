// ==UserScript==
// @name         Cpasbien cover images beside titles 
// @namespace    https://www.cpasbien.*/*
// @version      3.3
// @license      MIT
// @description  Display torrent cover images with adjustable size and beautiful layout
// @author       dr.bobo0
// @match        https://www-cpasbien.com/*
// @match        https://www1.cpasbien.to/*
// @match        https://www.cpasbien.wtf/*
// @match        https://www.cpasbien.rs/*
// @match        https://www.cpasbien.pm/*
// @match        https://www.cpasbien.city/*
// @match        https://www.cpasbien.sbs/*
// @match        https://www.cpasbien.*/*
// @include      https://www.cpasbien.*/*
// @include      https://www.cpasbien4.*/*
// @include      https://www.cpasbien5.*/*
// @include      https://www.cpasbien5.com/*
// @include      https://www.cpasbien.diy/*
// @icon     data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADEUlEQVR4nO2av0tbURTH38svNcGAaUWCHbqUpkpRpw5CoUJLwUkEkXQsqLugf4Lg4uKuCJnclNLBUhTdikOHJkZLqkUxRklM9MUYjenSod9vrMkjtWe497t9HvddvhzOPe+ee59ZLpfLhsJySBuQlg6AtAFpuey+EI9GgT8sLAA7uaSYpn1Xf6pUwvlbWoDDY2PAgUDA1vTKZ4AOgLQBaZl29wGRkRHgd+EwDmhuBizTGrYrs6kJuLC+jn5cWMbek79qUj4DdACkDUir6j6AS4TfsnBAWxuy0wlo1ttqNDYitrYCW3t7dU2vfAboAEgbkJbtXsDjoJgdHiJTDahbPh/y2Rmgi/3YlPIZoAMgbUBa9msAP8hkkHlNci/A5wMNDciFAvLaGqC1sgLsHhi43WiNUj4DdACkDUjLdg1w8xo+PUW+uUHm8dwbxOPIy8uA1s4O8D758QwO/sVpbVI+A3QApA1Iy1UqFuFBPpcDLl5dAZf5O51KIfN3//wcORZDpjVuXFwA+uic/zH1AhvZLHDm5ATYQTWJ51M+A3QApA1Iy4yursKHOTU6CgMe0V2c1+sFDnZ14YxcI2iNcj9fwbyvoF7jJp0G/kZnlFnaZ5Ab4+HmJrDyGaADIG1AWq4nvb3wwJqfB/ZOTAAHh4dxBlqTFTWAakYFu93I3EtcXgI6aN/ynMb/zOeBv8zNAb/s7MT5DMWlAyBtQFpV/w+I0T9B5vg4cGhoCF+gNVtxZsg1g/buFXx8fCcn6F7i++Ii8Jv+fuMuKZ8BOgDSBqRl+x+hFPX/PyYngV/09eELdJ5g7NOpXrUacHQEGN3eBi4uLQF39/QYdqR8BugASBuQlu0awErTd/3r1BTwq/Z2fMFDt4sHB8i7u4AbVBMezMwAP+voqNHp7VI+A3QApA1Iq+4awCpSv/55ehr4Lf9neH0N+DGRAO6enQUOBoN1OkQpnwE6ANIGpPXPawCLp/8UiQDntraAX9MZpN/vvx9jv6V8BugASBuQ1r3XAFYymQTO0l3g01Dof9rRGaADIG1AWr8AhIEBFM6P8KEAAAAASUVORK5CYII=
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/522357/Cpasbien%20cover%20images%20beside%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/522357/Cpasbien%20cover%20images%20beside%20titles.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Default values and settings
    const DEFAULT_IMAGE_WIDTH = 120;
    const MIN_IMAGE_WIDTH = 60;
    const MAX_IMAGE_WIDTH = 240;

    // Get saved image width or use default
    let currentImageWidth = GM_getValue('imageWidth', DEFAULT_IMAGE_WIDTH);

    // Create settings menu
    GM_registerMenuCommand('Adjust Image Size', showSettingsDialog);

    function showSettingsDialog() {
        // Create dialog container
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            width: 300px;
        `;

        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.style.marginBottom = '20px';

        // Create label
        const label = document.createElement('label');
        label.textContent = 'Image Width: ';
        label.style.marginBottom = '10px';
        label.style.display = 'block';

        // Create size display
        const sizeDisplay = document.createElement('span');
        sizeDisplay.textContent = `${currentImageWidth}px`;
        sizeDisplay.style.marginLeft = '10px';

        // Create slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = MIN_IMAGE_WIDTH;
        slider.max = MAX_IMAGE_WIDTH;
        slider.value = currentImageWidth;
        slider.style.width = '100%';
        slider.style.margin = '10px 0';

        // Create buttons container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';

        // Create buttons
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = `
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = `
            padding: 8px 16px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        // Add event listeners
        slider.addEventListener('input', () => {
            sizeDisplay.textContent = `${slider.value}px`;
            updateAllImageSizes(parseInt(slider.value));
        });

        saveButton.addEventListener('click', () => {
            currentImageWidth = parseInt(slider.value);
            GM_setValue('imageWidth', currentImageWidth);
            updateAllImageSizes(currentImageWidth);
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        });

        cancelButton.addEventListener('click', () => {
            updateAllImageSizes(currentImageWidth);
            document.body.removeChild(dialog);
            document.body.removeChild(overlay);
        });

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;

        // Assemble dialog
        sliderContainer.appendChild(label);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(sizeDisplay);
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);
        dialog.appendChild(sliderContainer);
        dialog.appendChild(buttonContainer);

        // Add to page
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    function updateAllImageSizes(width) {
        const height = Math.floor(width * 1.5); // Maintain aspect ratio
        document.querySelectorAll('.image-container').forEach(container => {
            container.style.width = `${width}px`;
            container.style.height = `${height}px`;
        });
        document.querySelectorAll('.torrent-container').forEach(container => {
            container.style.minHeight = `${height}px`;
        });
    }

    // Add global styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        @keyframes loading-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .torrent-container {
            display: flex;
            align-items: center;
            padding: 10px;
            gap: 20px;
            width: 100%;
            min-height: ${currentImageWidth * 1.5}px;
            background: white;
            border-radius: 8px;
            margin: 5px 0;
            transition: all 0.2s ease;
        }

        .torrent-container:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .image-container {
            flex-shrink: 0;
            width: ${currentImageWidth}px;
            height: ${currentImageWidth * 1.5}px;
            transition: all 0.2s ease;
        }

        .info-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 10px;
        }

        .title-container {
            font-size: 1.1em;
            margin-bottom: 10px;
        }

        .title-container a {
            color: #2c3e50;
            text-decoration: none;
            font-weight: bold;
            transition: color 0.2s ease;
        }

        .title-container a:hover {
            color: #c54524;
        }

        .stats-container {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .stats-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #666;
            font-size: 0.9em;
        }
    `;
    document.head.appendChild(styleSheet);

    function reorganizeLayout(row) {
        // Find the title link - check both direct child and nested structure
        const titleCell = row.querySelector("td a.titre");
        if (!titleCell) return;

        // Get the parent TD that contains all the row content
        const parentTd = titleCell.closest('td');
        if (!parentTd) return;

        // Find the sibling TDs for size, seed, and leech
        const allTds = row.querySelectorAll('td');
        let sizeElement = null;
        let seedElement = null;
        let leechElement = null;

        // Find elements in the following TDs
        for (let i = 0; i < allTds.length; i++) {
            if (allTds[i] === parentTd) {
                // Size is in the next TD
                if (allTds[i + 1]) {
                    sizeElement = allTds[i + 1].querySelector('.poid');
                }
                // Seed is in the TD after that
                if (allTds[i + 2]) {
                    seedElement = allTds[i + 2].querySelector('.up');
                }
                // Leech is in the TD after that
                if (allTds[i + 3]) {
                    leechElement = allTds[i + 3].querySelector('.down');
                }
                break;
            }
        }

        // Create new container structure
        const container = document.createElement("div");
        container.className = "torrent-container";

        // Create image container
        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";

        // Create loading placeholder
        const loadingPlaceholder = document.createElement("div");
        loadingPlaceholder.style.width = "100%";
        loadingPlaceholder.style.height = "100%";
        loadingPlaceholder.style.background = "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)";
        loadingPlaceholder.style.backgroundSize = "200% 100%";
        loadingPlaceholder.style.borderRadius = "8px";
        loadingPlaceholder.style.animation = "loading-shimmer 1.5s infinite";

        imageContainer.appendChild(loadingPlaceholder);

        // Create info container
        const infoContainer = document.createElement("div");
        infoContainer.className = "info-container";

        // Create title container
        const titleContainer = document.createElement("div");
        titleContainer.className = "title-container";

        // Clone the title link and its content (including the .maxi div)
        const clonedTitle = titleCell.cloneNode(true);
        titleContainer.appendChild(clonedTitle);

        // Create stats container
        const statsContainer = document.createElement("div");
        statsContainer.className = "stats-container";

        // Add size, seed, and leech info
        if (sizeElement) {
            const sizeInfo = document.createElement("div");
            sizeInfo.className = "stats-item";
            sizeInfo.innerHTML = `📦 ${sizeElement.textContent}`;
            statsContainer.appendChild(sizeInfo);
        }

        if (seedElement) {
            const seedInfo = document.createElement("div");
            seedInfo.className = "stats-item";
            const seedText = seedElement.querySelector('.seed_ok') ?
                seedElement.querySelector('.seed_ok').textContent : seedElement.textContent;
            seedInfo.innerHTML = `⬆️ ${seedText}`;
            statsContainer.appendChild(seedInfo);
        }

        if (leechElement) {
            const leechInfo = document.createElement("div");
            leechInfo.className = "stats-item";
            leechInfo.innerHTML = `⬇️ ${leechElement.textContent}`;
            statsContainer.appendChild(leechInfo);
        }

        // Assemble the containers
        infoContainer.appendChild(titleContainer);
        infoContainer.appendChild(statsContainer);
        container.appendChild(imageContainer);
        container.appendChild(infoContainer);

        // Set colspan to span all columns
        parentTd.setAttribute('colspan', allTds.length);

        // Replace the content of the first TD
        parentTd.innerHTML = '';
        parentTd.appendChild(container);

        // Hide the other TDs in the row
        for (let i = 0; i < allTds.length; i++) {
            if (allTds[i] !== parentTd) {
                allTds[i].style.display = 'none';
            }
        }

        // Fetch and display the image
        const xhr = new XMLHttpRequest();
        xhr.open("GET", titleCell.href);
        xhr.responseType = "document";
        xhr.onload = function() {
            const preview = xhr.response.querySelector("#bigcover img");
            if (preview) {
                const previewImage = document.createElement("img");
                previewImage.src = preview.getAttribute("src");
                previewImage.style.width = "100%";
                previewImage.style.height = "100%";
                previewImage.style.objectFit = "cover";
                previewImage.style.borderRadius = "8px";
                previewImage.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                previewImage.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";

                // Add hover effects
                previewImage.addEventListener('mouseenter', () => {
                    previewImage.style.transform = "scale(1.05)";
                    previewImage.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                });

                previewImage.addEventListener('mouseleave', () => {
                    previewImage.style.transform = "scale(1)";
                    previewImage.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                });

                imageContainer.innerHTML = '';
                imageContainer.appendChild(previewImage);
            } else {
                imageContainer.innerHTML = '';
            }
        };

        xhr.onerror = function() {
            imageContainer.innerHTML = '';
        };

        xhr.send();
    }

    // Process all rows in the torrent table
    document.querySelectorAll("tr").forEach(row => {
        reorganizeLayout(row);
    });
})();