// ==UserScript==
// @name         Danbooru Smart Canvas
// @namespace    https://sleazyfork.org/
// @version      1.1
// @description  Creates an adaptive canvas to enable zoom & pan for images on Danbooru (when viewing original) using scroll & drag, and click to set zoom to 1x/reset zoom
// @author       Broodyr
// @license      MIT
// @match        https://danbooru.donmai.us/posts/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/538023/Danbooru%20Smart%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/538023/Danbooru%20Smart%20Canvas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants - feel free to tweak these as desired
    const MAX_ZOOM_SCALE = 3; // 3 = 300% max zoom
    const ZOOM_FACTOR = 1.1; // 1.1 = 10% per scroll
    const TRANSITION = 'transform 0.1s ease-out'; // CSS transition for image panning/zooming
    const CANVAS_BG_COLOR = 'rgba(0, 0, 0, 0.05)'; // Background color for the canvas ('rgba(0, 0, 0, 0)' for none)
    const ZOOM_DISPLAY_FONT_SIZE = 15; // Font size (px) for the top-right zoom display
    const AUTOSCROLL_CANVAS_HEIGHT = 'calc(100vh - 32px)'; // CSS calculation for the canvas height when Autoscrolling is enabled
    const NOSCROLL_CANVAS_HEIGHT = 'calc(100vh - 32px - 107px)'; // CSS calculation for the canvas height when Autoscrolling is disabled (107px = Danbooru header height)
    const RESET_CLICK_THRESHOLD = 5; // Max mouse movement (px) for a click to count as a reset
    const RESET_CLICK_DURATION = 200; // Max click duration (ms) for a click to count as a reset

    // Script menu commands
    let isPanningEnabled = true;
    let panningToggleCommandId = null;
    let isAutoscrollEnabled = true;
    let autoscrollToggleCommandId = null;
    if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function') {
        isPanningEnabled = GM_getValue('panningEnabledUserSetting', true);
        isAutoscrollEnabled = GM_getValue('autoscrollEnabledUserSetting', true);
    }

    // Global references
    let imgObserver = null;
    let wrapper = null;
    let wrapperResizeObserver = null;
    let imageContainer = null;
    let img = null;
    let canvasController = null;
    let zoomDisplay = null;
    const originalNoteDimensions = new WeakMap();

    function registerOrUpdateMenuCommand(currentCommandId, isEnabled, name, callback) {
        let optionText = { enabled: `Disable ${name}`, disabled: `Enable ${name}` };

        if (typeof GM_registerMenuCommand !== 'function') {
            return currentCommandId;
        }

        const commandText = isEnabled ? optionText.enabled : optionText.disabled;
        if (currentCommandId !== null && typeof GM_unregisterMenuCommand === 'function') {
            try {
                GM_unregisterMenuCommand(currentCommandId);
            } catch (e) {
                console.warn(`Smart Canvas: Could not unregister old menu command:`, e);
            }
        }
        return GM_registerMenuCommand(commandText, callback);
    }

    function togglePanning() {
        isPanningEnabled = !isPanningEnabled;
        if (typeof GM_setValue === 'function') {
            GM_setValue('panningEnabledUserSetting', isPanningEnabled);
        }
        panningToggleCommandId = registerOrUpdateMenuCommand(panningToggleCommandId, isPanningEnabled, 'Panning', togglePanning);

        if (canvasController) {
            canvasController.updateCursorState();
        }
    }

    function toggleAutoscroll() {
        isAutoscrollEnabled = !isAutoscrollEnabled;
        if (typeof GM_setValue === 'function') {
            GM_setValue('autoscrollEnabledUserSetting', isAutoscrollEnabled);
        }
        autoscrollToggleCommandId = registerOrUpdateMenuCommand(autoscrollToggleCommandId, isAutoscrollEnabled, 'Autoscrolling', toggleAutoscroll);

        if (isAutoscrollEnabled) scrollToCanvas();
    }

    function scrollToCanvas() {
        const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: wrapperTop - 16, behavior: 'smooth' });

        if (wrapperResizeObserver) {
            wrapperResizeObserver.unobserve(wrapper);
            wrapperResizeObserver.disconnect();
            wrapperResizeObserver = null;
        }
    }

    // Adjusts layout and initial scale on window resize
    function handleResize() {
        if (!wrapper || !imageContainer || !img | !canvasController) {
            return;
        }

        img.style.transition = 'none'; // Disable transition during resize

        const availableHeightCss = isAutoscrollEnabled ? AUTOSCROLL_CANVAS_HEIGHT : NOSCROLL_CANVAS_HEIGHT;
        imageContainer.style.maxHeight = availableHeightCss;
        wrapper.style.height = availableHeightCss;

        let prevScale = canvasController.getScale();
        let prevX = canvasController.getPosX();
        let prevY = canvasController.getPosY();
        canvasController.destroy();

        const calcScale = Math.min(
            wrapper.clientWidth / img.naturalWidth,
            wrapper.clientHeight / img.naturalHeight
        );
        const newMinScale = Math.min(calcScale, 1);

        canvasController = CanvasController(newMinScale, prevScale, prevX, prevY);
    }

    function CanvasController(minScale, prevScale = null, prevX = null, prevY = null) {
        let scale = minScale;
        let posX = 0; let posY = 0;

        // If the canvas just resized, keep the previous scale & position if possible
        if (prevScale !== null && prevScale >= minScale) {
            scale = prevScale;
            posX = prevX;
            posY = prevY;
        }

        let lastX = 0; let lastY = 0;
        let isDragging = false;
        let clickStartTime = 0;
        let clickStartX = 0; let clickStartY = 0;

        img.style.transition = TRANSITION;

        // Keep image within the canvas bounds
        function constrainPosition() {
            const containerWidth = wrapper.clientWidth;
            const containerHeight = wrapper.clientHeight;
            const imgWidth = img.offsetWidth * scale;
            const imgHeight = img.offsetHeight * scale;

            if (imgWidth <= containerWidth) {
                posX = Math.max(0, Math.min(posX, containerWidth - imgWidth));
            } else {
                posX = Math.min(0, Math.max(posX, containerWidth - imgWidth));
            }

            if (imgHeight <= containerHeight) {
                posY = Math.max(0, Math.min(posY, containerHeight - imgHeight));
            } else {
                posY = Math.min(0, Math.max(posY, containerHeight - imgHeight));
            }
        }

        function updateZoomDisplay() {
            if (zoomDisplay) {
                zoomDisplay.textContent = `x${scale.toFixed(2)}`;
                if (Math.abs(scale - 1.0) <= 0.001) {
                    zoomDisplay.style.backgroundColor = 'rgba(0, 155, 230, 0.4)';
                    zoomDisplay.style.fontWeight = 'bold';
                    imageContainer.style.boxShadow = 'unset';
                } else if (Math.abs(scale - minScale) <= 0.001) {
                    zoomDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    zoomDisplay.style.fontWeight = 'bold';
                    imageContainer.style.boxShadow = '0 0 8px 2px rgba(0, 0, 0, 0.4)';
                } else {
                    zoomDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    zoomDisplay.style.fontWeight = 'normal';
                    imageContainer.style.boxShadow = 'unset';
                }
            }
        }

        // Modify note properties to match canvas scale and position
        function updateNotePositionsInternal() {
            const noteBoxes = document.querySelectorAll('.note-box');
            if (!noteBoxes.length || !img.naturalWidth || !img.naturalHeight || img.naturalWidth === 0 || img.naturalHeight === 0) {
                return;
            }

            noteBoxes.forEach(note => {
                let dimensions = originalNoteDimensions.get(note);

                if (!dimensions) {
                    const initialPercentWidth = parseFloat(note.style.width);
                    const initialPercentHeight = parseFloat(note.style.height);
                    const initialPercentTop = parseFloat(note.style.top);
                    const initialPercentLeft = parseFloat(note.style.left);

                    if (isNaN(initialPercentWidth) || isNaN(initialPercentHeight) || isNaN(initialPercentTop) || isNaN(initialPercentLeft)) {
                        return; // Skip this note if initial properties are somehow not valid percentages
                    }

                    dimensions = {
                        width: initialPercentWidth,
                        height: initialPercentHeight,
                        top: initialPercentTop,
                        left: initialPercentLeft
                    };
                    originalNoteDimensions.set(note, dimensions);
                }

                const newWidthPx = (dimensions.width / 100) * img.naturalWidth * scale;
                const newHeightPx = (dimensions.height / 100) * img.naturalHeight * scale;
                const newTopPx = (dimensions.top / 100) * img.naturalHeight * scale + posY;
                const newLeftPx = (dimensions.left / 100) * img.naturalWidth * scale + posX;

                note.style.width = newWidthPx + 'px';
                note.style.height = newHeightPx + 'px';
                note.style.top = newTopPx + 'px';
                note.style.left = newLeftPx + 'px';
            });
        }

        function updateCursorStateInternal() {
            if (!wrapper) return;

            if (!isPanningEnabled) {
                wrapper.style.cursor = 'default';
            } else if (isDragging) {
                wrapper.style.cursor = 'grabbing';
            } else if (scale > minScale) {
                wrapper.style.cursor = 'grab';
            } else {
                wrapper.style.cursor = 'default';
            }
        }

        function applyTransform() {
            constrainPosition();
            img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
            img.style.transformOrigin = '0 0';
            updateZoomDisplay();
            updateNotePositionsInternal();
            updateCursorStateInternal();
        }

        function resetZoom() {
            scale = minScale;
            const containerWidth = wrapper.clientWidth;
            const containerHeight = wrapper.clientHeight;
            const imgWidth = img.offsetWidth * scale;
            const imgHeight = img.offsetHeight * scale;
            posX = (containerWidth - imgWidth) / 2;
            posY = (containerHeight - imgHeight) / 2;
            applyTransform();
        }

        // Event Handlers
        const handleWheel = (e) => {
            const rect = wrapper.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const imgX = (mouseX - posX) / scale;
            const imgY = (mouseY - posY) / scale;
            const delta = -e.deltaY;
            let newScale = delta > 0 ? scale * ZOOM_FACTOR : scale / ZOOM_FACTOR;
            newScale = Math.max(minScale, Math.min(newScale, MAX_ZOOM_SCALE));

            if (newScale !== scale) {
                e.preventDefault();
                if (Math.abs(newScale - minScale) < 0.001) {
                    resetZoom();
                } else {
                    scale = newScale;
                    posX = mouseX - imgX * scale;
                    posY = mouseY - imgY * scale;
                    applyTransform();
                }
            }
        };

        const handleMouseDown = (e) => {
            if (e.button === 0) {
                clickStartTime = Date.now();
                clickStartX = e.clientX;
                clickStartY = e.clientY;

                if (isPanningEnabled && scale > minScale) {
                    isDragging = true;
                    lastX = e.clientX; lastY = e.clientY;
                    img.style.transition = 'none'; // Disable transition during drag
                    e.preventDefault();
                    updateCursorStateInternal();
                }
            }
        };

        const handleMouseUp = (e) => {
            if (e.button === 0) {
                const clickEndTime = Date.now();
                const clickFinalX = e.clientX;
                const clickFinalY = e.clientY;

                const wasDragging = isDragging;
                if (isDragging) isDragging = false;

                img.style.transition = TRANSITION; // Re-enable transition

                const isClick = (
                    clickEndTime - clickStartTime < RESET_CLICK_DURATION &&
                    Math.abs(clickFinalX - clickStartX) < RESET_CLICK_THRESHOLD &&
                    Math.abs(clickFinalY - clickStartY) < RESET_CLICK_THRESHOLD
                );

                if (isClick) {
                    // If current scale is not ~1.00, set to 1.0, else reset image
                    if (Math.abs(scale - 1.0) > 0.001) {
                        const rect = wrapper.getBoundingClientRect();
                        const mouseX = e.clientX - rect.left;
                        const mouseY = e.clientY - rect.top;
                        const imgX = (mouseX - posX) / scale;
                        const imgY = (mouseY - posY) / scale;

                        scale = 1.0;

                        // Center if image fits in frame, else base position on mouse
                        if (Math.abs(minScale - 1.0) <= 0.001) {
                            posX = (wrapper.clientWidth - img.naturalWidth) / 2;
                            posY = (wrapper.clientHeight - img.naturalHeight) / 2;
                        } else {
                            posX = mouseX - imgX * scale;
                            posY = mouseY - imgY * scale;
                        }
                        
                        applyTransform();
                    } else { // If scale is already 1.0, reset to minScale
                        resetZoom();
                    }
                } else if (wasDragging) {
                    applyTransform();
                }
            }
        };

        const handleMouseMove = (e) => {
            if (isDragging && scale > minScale) {
                const deltaX = e.clientX - lastX; const deltaY = e.clientY - lastY;
                posX += deltaX; posY += deltaY;
                lastX = e.clientX; lastY = e.clientY;
                applyTransform();
            }
        };

        wrapper.addEventListener('wheel', handleWheel);
        wrapper.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        function destroy() {
            wrapper.removeEventListener('wheel', handleWheel);
            wrapper.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        applyTransform();

        return {
            resetZoom,
            applyTransform,
            destroy,
            updateCursorState: updateCursorStateInternal,
            getScale: function() { return scale; },
            getPosX: function() { return posX; },
            getPosY: function() { return posY; }
        };
    }

    // Sets up the image, wrapper, and controller
    function initializeCanvas() {
        imageContainer = document.querySelector('section.image-container');
        img = document.querySelector('img#image');

        if (!img || !imageContainer) return;

        // Don't run if Danbooru's resize notice is active (image is sample)
        const resizeNotice = document.getElementById('image-resize-notice');
        if (resizeNotice && getComputedStyle(resizeNotice).display !== 'none') return;

        const availableHeightCss = isAutoscrollEnabled ? AUTOSCROLL_CANVAS_HEIGHT : NOSCROLL_CANVAS_HEIGHT;

        imageContainer.style.maxHeight = availableHeightCss;
        imageContainer.style.width = '100%';
        imageContainer.style.overflow = 'hidden';
        imageContainer.style.margin = '16px 0';
        imageContainer.style.transition = 'box-shadow 0.3s ease-in-out';

        if (img.parentElement !== imageContainer) {
            imageContainer.appendChild(img);
        }

        wrapper = document.createElement('div');
        wrapper.className = 'zoom-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.display = 'block';
        wrapper.style.overflow = 'hidden';
        wrapper.style.width = '100%';
        wrapper.style.height = availableHeightCss;
        wrapper.style.backgroundColor = CANVAS_BG_COLOR;

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // Autoscroll on page load
        let visibilityListenerActive = false;

        function handleVisibilityChange() {
            if (!document.hidden) {
                scrollToCanvas();
                detachVisibilityListener();
            }
        }

        function attachVisibilityListener() {
            if (!visibilityListenerActive) {
                document.addEventListener('visibilitychange', handleVisibilityChange);
                visibilityListenerActive = true;
            }
        }

        function detachVisibilityListener() {
            if (visibilityListenerActive) {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                visibilityListenerActive = false;
            }
        }

        if (isAutoscrollEnabled) {
            wrapperResizeObserver = new ResizeObserver(entries => {
                if (!wrapperResizeObserver || !entries || !entries.length) {
                    return;
                }

                const wrapperRect = entries[0].contentRect;
                if (wrapperRect.width > 0 && wrapperRect.height > 0) {
                    if (document.hidden) {
                        // Tab is hidden, defer the scroll
                        attachVisibilityListener();
                    } else {
                        // Tab is visible, scroll
                        scrollToCanvas();
                    }
                }
            });
            wrapperResizeObserver.observe(wrapper);
        }

        // Element to display current zoom scale
        zoomDisplay = document.createElement('div');
        zoomDisplay.className = 'zoom-factor-display';
        zoomDisplay.style.position = 'absolute';
        zoomDisplay.style.top = '10px';
        zoomDisplay.style.right = '10px';
        zoomDisplay.style.padding = '5px 10px';
        zoomDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        zoomDisplay.style.color = 'white';
        zoomDisplay.style.borderRadius = '8px';
        zoomDisplay.style.fontSize = ZOOM_DISPLAY_FONT_SIZE + 'px';
        zoomDisplay.style.fontFamily = 'sans-serif';
        zoomDisplay.style.zIndex = '100';
        zoomDisplay.style.backdropFilter = 'blur(5px)';
        zoomDisplay.style.webkitBackdropFilter = 'blur(5px)'; // For Safari
        zoomDisplay.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        zoomDisplay.style.cursor = 'pointer';
        zoomDisplay.style.userSelect = 'none';
        zoomDisplay.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            scrollToCanvas();
        });
        zoomDisplay.addEventListener('mouseup', (event) => {
            event.stopPropagation();
        });
        wrapper.appendChild(zoomDisplay);

        img.style.position = 'absolute';
        img.style.left = '0';
        img.style.top = '0';
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';
        img.style.objectFit = '';

        // Calculate initial scale and initialize controller
        function setupZoom() {
            img.style.width = img.naturalWidth + 'px';
            img.style.height = img.naturalHeight + 'px';

            const minScale = Math.min(
                wrapper.clientWidth / img.naturalWidth,
                wrapper.clientHeight / img.naturalHeight
            );
            const initialScale = Math.min(minScale, 1);

            canvasController = CanvasController(initialScale);
            canvasController.resetZoom();

            // Workaround for timing issue with notes for some browsers
            setTimeout(() => {
                if (canvasController) {
                    canvasController.applyTransform();
                }
            }, 0);
        }

        if (img.complete) {
            setupZoom();
        } else {
            img.addEventListener('load', setupZoom, { once: true });
        }
    }

    function setupCanvas() {
        if (imgObserver) {
            imgObserver.disconnect();
            imgObserver = null;
        }

        initializeCanvas();

        // Observe 'src' attribute changes on the image to re-initialize when full image is loaded
        const resizeNotice = document.getElementById('image-resize-notice');
        img = document.querySelector('img#image');
        if (img) {
            imgObserver = new MutationObserver(() => {
                if (!resizeNotice || getComputedStyle(resizeNotice).display === 'none') {
                    setupCanvas();
                }
            });
            imgObserver.observe(img, { attributes: true, attributeFilter: ['src'] });
        }
    }

    // Initialize menu commands
    panningToggleCommandId = registerOrUpdateMenuCommand(panningToggleCommandId, isPanningEnabled, 'Panning', togglePanning);
    autoscrollToggleCommandId = registerOrUpdateMenuCommand(autoscrollToggleCommandId, isAutoscrollEnabled, 'Autoscrolling', toggleAutoscroll);

    // Start script
    setupCanvas();
    window.addEventListener('resize', handleResize);
})();