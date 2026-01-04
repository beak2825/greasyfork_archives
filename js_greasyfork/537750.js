// ==UserScript==
// @name         BDSMLR Download helper
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Download links, download all, size filters and auto scrolling
// @match        *://*.bdsmlr.com/*
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537750/BDSMLR%20Download%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/537750/BDSMLR%20Download%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const panel = document.createElement('div');
    panel.id = 'image-download-panel';
    panel.textContent = '📥 Image Download Panel';
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.width = '320px';
    panel.style.maxHeight = '50vh';
    panel.style.overflowY = 'auto';
    panel.style.overflowX = 'hidden';
    panel.style.padding = '12px';
    panel.style.backgroundColor = 'white';
    panel.style.border = '1px solid #ccc';
    panel.style.borderRadius = '6px';
    panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    panel.style.zIndex = '9999';
    panel.style.fontFamily = 'sans-serif';
    panel.style.fontSize = '14px';

    document.body.appendChild(panel);

    // Container for controls and image list
    const controls = document.createElement('div');
    controls.style.marginBottom = '10px';
    controls.style.flexShrink = '0';
    panel.appendChild(controls);

    const listContainer = document.createElement('div');
    listContainer.style.flexGrow = '1';
    listContainer.style.overflowY = 'auto';
    panel.appendChild(listContainer);

    // Helper: Create labeled slider input
    function createSlider(labelText, maxValue, defaultValue) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';

        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '2px';
        label.textContent = labelText;

        const valueSpan = document.createElement('span');
        valueSpan.style.marginLeft = '8px';
        valueSpan.textContent = defaultValue;

        const input = document.createElement('input');
        input.type = 'range';
        input.min = '0';
        input.max = maxValue.toString();
        input.value = defaultValue.toString();
        input.style.width = '90%';

        input.addEventListener('input', () => {
            valueSpan.textContent = input.value;
            filterAndRenderImages();
        });

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(valueSpan);

        return { container, input };
    }

    // Create sliders
    const widthSlider = createSlider('Min Width (px):', 1000, 0);
    const heightSlider = createSlider('Min Height (px):', 1000, 0);

    controls.appendChild(widthSlider.container);
    controls.appendChild(heightSlider.container);

    // Create "Download All" button
    const downloadAllBtn = document.createElement('button');
    downloadAllBtn.textContent = '⬇️ Download All';
    downloadAllBtn.style.marginBottom = '10px';
    downloadAllBtn.style.padding = '6px 12px';
    downloadAllBtn.style.fontSize = '14px';
    downloadAllBtn.style.cursor = 'pointer';
    downloadAllBtn.style.backgroundColor = '#3498db';
    downloadAllBtn.style.color = 'white';
    downloadAllBtn.style.border = 'none';
    downloadAllBtn.style.borderRadius = '4px';
    downloadAllBtn.style.userSelect = 'none';

    downloadAllBtn.addEventListener('click', () => {
        const minWidth = parseInt(widthSlider.input.value, 10);
        const minHeight = parseInt(heightSlider.input.value, 10);

        const filtered = imagesData.filter(data => data.width >= minWidth && data.height >= minHeight);

        if (filtered.length === 0) {
            alert('No images match the filter criteria to download.');
            return;
        }

        progress.max = filtered.length;
        progress.value = 0;

        filtered.forEach((data, idx) => {
            GM_download({
                url: data.url,
                name: data.filename,
                headers: { 'Referer': location.origin },
                onload: () => {
                    progress.value += 1;
                },
                onerror: err => {
                    console.error(`Download failed for ${data.filename}:`, err);
                    progress.value += 1; // still advance to avoid hanging the bar
                }
            });
        });
    });


    controls.insertBefore(downloadAllBtn, controls.firstChild);

    // Create the progress bar
    const progress = document.createElement('progress');
    progress.value = 0;
    progress.max = 100;
    progress.style.width = '100%';
    progress.style.marginTop = '10px';
    progress.style.height = '20px';

    // Add it to your controls area in the panel
    controls.appendChild(progress);

    let autoScrollEnabled = false;
    let autoScrollInterval = null;

    // Create the button
    const autoScrollBtn = document.createElement('button');
    autoScrollBtn.textContent = '▶️ Auto-Scroll';
    autoScrollBtn.style.margin = '5px';
    autoScrollBtn.style.padding = '4px 8px';
    autoScrollBtn.style.fontSize = '13px';
    autoScrollBtn.style.cursor = 'pointer';

    // Add to your panel's controls area
    controls.appendChild(autoScrollBtn);

    // Function to toggle auto-scrolling
    autoScrollBtn.addEventListener('click', () => {
        autoScrollEnabled = !autoScrollEnabled;

        if (autoScrollEnabled) {
            autoScrollBtn.textContent = '⏹️ Stop Auto-Scroll';
            autoScrollInterval = setInterval(() => {
                window.scrollBy(0, 500);  // scroll down 500px
            }, 500);  // every 500ms
        } else {
            autoScrollBtn.textContent = '▶️ Auto-Scroll';
            clearInterval(autoScrollInterval);
        }
    });

    // Store images info: { img, url, width, height, filename, containerDiv }
    const imagesData = [];

    // Utility to get filename from URL
    function getFilenameFromUrl(url, index) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.substring(pathname.lastIndexOf('/') + 1).split('?')[0];
            return filename || `image_${index + 1}.jpg`;
        } catch (e) {
            return `image_${index + 1}.jpg`;
        }
    }

    function createImageLink(imageInfo, index) {
        const container = document.createElement('div');
        container.style.marginBottom = '8px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '8px';  // spacing between thumbnail and link

        // Thumbnail image
        const thumb = document.createElement('img');
        thumb.src = imageInfo.url;
        thumb.alt = `Image ${index + 1}`;
        thumb.style.width = '40px';
        thumb.style.height = '40px';
        thumb.style.objectFit = 'cover';
        thumb.style.border = '1px solid #ccc';
        thumb.style.borderRadius = '3px';
        thumb.style.flexShrink = '0';

        // Download link
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `📥 Image ${index + 1} (${imageInfo.width}×${imageInfo.height})`;
        link.style.color = '#3498db';
        link.style.textDecoration = 'underline';
        link.style.cursor = 'pointer';
        link.style.userSelect = 'none';

        link.addEventListener('click', e => {
            e.preventDefault();
            GM_download({
                url: imageInfo.url,
                name: imageInfo.filename,
                headers: { 'Referer': location.origin },
                onerror: err => {
                    alert(`Download failed for ${imageInfo.filename}: ${err.error}`);
                    console.error('Download failed:', err);
                }
            });
        });

        container.appendChild(thumb);
        container.appendChild(link);

        return container;
    }


    function addImage(img) {
        const url = img.currentSrc || img.src;
        if (!url) return false;
        if (imagesData.some(data => data.url === url)) return false; // avoid duplicates

        function processImage() {
            const width = img.naturalWidth || img.width || 0;
            const height = img.naturalHeight || img.height || 0;
            const filename = getFilenameFromUrl(url, imagesData.length);

            // Check if image was already added (race condition)
            if (imagesData.some(data => data.url === url)) return;

            const containerDiv = createImageLink({ url, width, height, filename }, imagesData.length);

            imagesData.push({ img, url, width, height, filename, containerDiv });
            filterAndRenderImages();
        }

        if (img.complete && img.naturalWidth && img.naturalHeight) {
            // Image already loaded
            processImage();
        } else {
            // Wait for image to load to get natural size
            img.addEventListener('load', () => {
                processImage();
            }, { once: true });
        }

        return true;
    }


    // Render the filtered image list into the panel
    function filterAndRenderImages() {
        const minWidth = parseInt(widthSlider.input.value, 10);
        const minHeight = parseInt(heightSlider.input.value, 10);

        listContainer.innerHTML = '';

        const filtered = imagesData.filter(data => data.width >= minWidth && data.height >= minHeight);

        if (filtered.length === 0) {
            const noImages = document.createElement('div');
            noImages.textContent = 'No images match the filter criteria.';
            listContainer.appendChild(noImages);
            return;
        }

        filtered.forEach((data, idx) => {
            // Adjust the label to show updated index in filtered list
            const container = data.containerDiv;
            container.querySelector('a').textContent =
                `📥 Image ${idx + 1} (${data.width}×${data.height})`;
            listContainer.appendChild(container);
        });
    }

    // Initial populate images from existing <img> tags
    function populateImages() {
        const imgs = Array.from(document.querySelectorAll('img'));
        let addedCount = 0;
        imgs.forEach(img => {
            if (addImage(img)) addedCount++;
        });
        filterAndRenderImages();
        return addedCount;
    }

    populateImages();

    // Observe new images added dynamically
    const observer = new MutationObserver(mutations => {
        let newAdded = false;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    if (node.tagName === 'IMG') {
                        if (addImage(node)) newAdded = true;
                    } else if (node.querySelectorAll) {
                        const imgs = node.querySelectorAll('img');
                        imgs.forEach(img => {
                            if (addImage(img)) newAdded = true;
                        });
                    }
                }
            });
        });
        if (newAdded) filterAndRenderImages();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
