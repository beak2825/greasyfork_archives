// ==UserScript==
// @name         Messenger Modal Photo Zoom, Drag, Under Mouse
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Adds zoom support for opened photos on messenger.com
// @match        https://www.messenger.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532923/Messenger%20Modal%20Photo%20Zoom%2C%20Drag%2C%20Under%20Mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/532923/Messenger%20Modal%20Photo%20Zoom%2C%20Drag%2C%20Under%20Mouse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentImage = null;
    let currentScale = 1;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let startTranslateX = 0, startTranslateY = 0;
    let lastImageSrc = "";

    let controlsContainer = null;
    const step = 0.1;  // Zoom increment step

    // Reset transform parameters and update the image.
    function resetTransform() {
        currentScale = 1;
        currentTranslateX = 0;
        currentTranslateY = 0;
        updateTransform();
    }

    // Function: updateTransform
    // Applies a CSS transform (translation and scaling) to the current image.
    // Uses !important to override Messenger’s inline styles and sets a high z-index.
    function updateTransform() {
        if (currentImage) {
            const transformString = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
            currentImage.style.setProperty('transform', transformString, 'important');
            currentImage.style.setProperty('transform-origin', '0 0', 'important');
            currentImage.style.setProperty('z-index', '100000', 'important');
            updateNavigationZIndex();
        }
    }

    // Function: updateNavigationZIndex
    // Sets the z-index on the parent's parent elements of the "Next photo" and "Previous photo" buttons
    // to ensure they remain visible above the zoomed image.
    function updateNavigationZIndex() {
        const navButtons = document.querySelectorAll('[aria-label="Next photo"], [aria-label="Previous photo"]');
        navButtons.forEach(btn => {
            let container = (btn.parentElement && btn.parentElement.parentElement) ? btn.parentElement.parentElement : btn;
            container.style.setProperty('z-index', '100001', 'important');
        });
    }

    // Function: createControls
    // Creates a fixed global control bar at the top center with buttons for zooming in, resetting, and zooming out.
    function createControls() {
        controlsContainer = document.createElement('div');
        controlsContainer.style.position = 'fixed';
        controlsContainer.style.top = '10px';
        controlsContainer.style.left = '50%';
        controlsContainer.style.transform = 'translateX(-50%)';
        controlsContainer.style.zIndex = '10000';
        controlsContainer.style.display = 'flex';
        controlsContainer.style.gap = '10px';
        controlsContainer.style.background = 'rgba(0, 0, 0, 0.5)';
        controlsContainer.style.padding = '5px 10px';
        controlsContainer.style.borderRadius = '5px';

        const zoomInButton = document.createElement('button');
        zoomInButton.innerHTML = '+';
        zoomInButton.style.fontSize = '18px';
        zoomInButton.style.padding = '5px 10px';
        zoomInButton.style.cursor = 'pointer';
        zoomInButton.style.border = 'none';
        zoomInButton.style.background = 'white';
        zoomInButton.style.borderRadius = '3px';
        zoomInButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (currentImage) {
                const rect = currentImage.getBoundingClientRect();
                const offsetX = rect.width / 2;
                const offsetY = rect.height / 2;
                const zoomFactor = 1 + step;
                currentTranslateX += (1 - zoomFactor) * offsetX;
                currentTranslateY += (1 - zoomFactor) * offsetY;
                currentScale *= zoomFactor;
                updateTransform();
            }
        });

        const resetButton = document.createElement('button');
        resetButton.innerHTML = '🔍';
        resetButton.style.fontSize = '18px';
        resetButton.style.padding = '5px 10px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.border = 'none';
        resetButton.style.background = 'white';
        resetButton.style.borderRadius = '3px';
        resetButton.addEventListener('click', function(e) {
            e.stopPropagation();
            resetTransform();
        });

        const zoomOutButton = document.createElement('button');
        zoomOutButton.innerHTML = '-';
        zoomOutButton.style.fontSize = '18px';
        zoomOutButton.style.padding = '5px 10px';
        zoomOutButton.style.cursor = 'pointer';
        zoomOutButton.style.border = 'none';
        zoomOutButton.style.background = 'white';
        zoomOutButton.style.borderRadius = '3px';
        zoomOutButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (currentImage) {
                const rect = currentImage.getBoundingClientRect();
                const offsetX = rect.width / 2;
                const offsetY = rect.height / 2;
                const zoomFactor = 1 - step;
                currentTranslateX += (1 - zoomFactor) * offsetX;
                currentTranslateY += (1 - zoomFactor) * offsetY;
                currentScale *= zoomFactor;
                updateTransform();
            }
        });

        controlsContainer.appendChild(zoomInButton);
        controlsContainer.appendChild(resetButton);
        controlsContainer.appendChild(zoomOutButton);
        document.body.appendChild(controlsContainer);
    }

    // Function: removeControls
    // Removes the global control bar from the document.
    function removeControls() {
        if (controlsContainer) {
            controlsContainer.remove();
            controlsContainer = null;
        }
    }

    // Function: isVisible
    // Checks if an element is visible (has a nonzero bounding rectangle).
    function isVisible(el) {
        return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    }

    // Function: isModalActive
    // Determines if a photo modal is active by checking for visible "Next photo" or "Previous photo" elements.
    function isModalActive() {
        const next = document.querySelector('[aria-label="Next photo"]');
        const prev = document.querySelector('[aria-label="Previous photo"]');
        return (next && isVisible(next)) || (prev && isVisible(prev));
    }

    // Function: observeImageSrcChanges
    // Observes changes to the "src" attribute of the image. If a change is detected, resets the transform.
    function observeImageSrcChanges(img) {
        const attrObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    if (img.src !== lastImageSrc) {
                        lastImageSrc = img.src;
                        resetTransform();
                    }
                }
            });
        });
        attrObserver.observe(img, { attributes: true });
    }

    // Function: setCurrentImage
    // Sets the current image (which must have a blob URL) to receive zoom and drag functionality.
    // If the same image element is reused with a different src, resets transformation parameters.
    function setCurrentImage(img) {
        if (!img.src || !img.src.startsWith('blob:')) return;
        if (!isModalActive()) return;

        if (currentImage === img) {
            if (img.src !== lastImageSrc) {
                lastImageSrc = img.src;
                resetTransform();
            }
        } else {
            currentImage = img;
            lastImageSrc = img.src;
            resetTransform();
            observeImageSrcChanges(currentImage);
        }

        if (!currentImage.dataset.zoomEnhanced) {
            currentImage.dataset.zoomEnhanced = "true";

            currentImage.addEventListener('wheel', function(e) {
                e.preventDefault();
                const rect = currentImage.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                const zoomFactor = e.deltaY < 0 ? (1 + step) : (1 - step);
                currentTranslateX += (1 - zoomFactor) * offsetX;
                currentTranslateY += (1 - zoomFactor) * offsetY;
                currentScale *= zoomFactor;
                updateTransform();
            }, { passive: false });

            currentImage.addEventListener('mousedown', function(e) {
                isDragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                startTranslateX = currentTranslateX;
                startTranslateY = currentTranslateY;
                e.preventDefault();
            });
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                const dx = e.clientX - dragStartX;
                const dy = e.clientY - dragStartY;
                currentTranslateX = startTranslateX + dx;
                currentTranslateY = startTranslateY + dy;
                updateTransform();
            });
            document.addEventListener('mouseup', function() {
                isDragging = false;
            });
        }
    }

    // Listen for clicks on navigation buttons to trigger a zoom reset.
    document.addEventListener('click', function(e) {
        if (e.target.closest('[aria-label="Next photo"]') || e.target.closest('[aria-label="Previous photo"]')) {
            setTimeout(() => {
                if (currentImage) {
                    resetTransform();
                }
            }, 100);
        }
    });

    // MutationObserver: Watches for DOM changes to detect when a modal is active and new images are added.
    const observer = new MutationObserver(function(mutations) {
        if (!isModalActive()) {
            removeControls();
            currentImage = null;
            return;
        }
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType !== 1) return;
                if (node.tagName.toLowerCase() === 'img') {
                    setCurrentImage(node);
                } else {
                    const imgs = node.querySelectorAll('img');
                    imgs.forEach(function(img) {
                        setCurrentImage(img);
                    });
                }
            });
        });
        if (isModalActive() && currentImage && !controlsContainer) {
            createControls();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
