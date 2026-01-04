// ==UserScript==
// @name         Drawaria.online Custom Frame Avatars
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Adds a custom "FRAMES" section to the Drawaria.online avatar builder. Each frame includes a specific emoji, and clicking saves the combined image directly to your profile.
// @author       YouTubeDrawaria
// @match        *://drawaria.online/avatar/builder/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541483/Drawariaonline%20Custom%20Frame%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/541483/Drawariaonline%20Custom%20Frame%20Avatars.meta.js
// ==/UserScript==

(function($, undefined) { // jQuery noConflict wrapper
    'use strict';

    // --- CONFIGURATION ---
    // SVG Frames and Emojis data. Each entry defines a combined frame+emoji avatar.
    // 'frame_svg_part' and 'emoji_svg_part' are combined into one SVG for display and saving.
    const FRAMES_DATA = [
        {
            id: 'frame-gold-classic-smiley',
            name: 'Gold Smiley',
            frame_svg_part: '<rect x="2" y="2" width="96" height="96" fill="none" stroke="#FFD700" stroke-width="4" rx="8" ry="8"/>',
            emoji_svg_part: '<circle cx="50" cy="50" r="35" fill="#FFC107"/><circle cx="35" cy="40" r="5" fill="#333"/><circle cx="65" cy="40" r="5" fill="#333"/><path d="M30,65 Q50,75 70,65" fill="none" stroke="#333" stroke-width="4"/>'
        },
        {
            id: 'frame-neon-blue-pensive',
            name: 'Neon Pensive',
            frame_svg_part: '<rect x="5" y="5" width="90" height="90" fill="none" stroke="#00FFFF" stroke-width="2" stroke-dasharray="5,3"><animate attributeName="stroke-dashoffset" from="0" to="100" dur="5s" repeatCount="indefinite"/></rect>',
            emoji_svg_part: '<circle cx="50" cy="50" r="35" fill="#FFC107"/><circle cx="35" cy="40" r="5" fill="#333"/><circle cx="65" cy="40" r="5" fill="#333"/><path d="M30,65 Q50,55 70,65" fill="none" stroke="#333" stroke-width="4"/>' // Straight/pensive mouth
        },
        {
            id: 'frame-floral-cry',
            name: 'Floral Crying',
            frame_svg_part: '<defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:rgb(255,100,0);stop-opacity:1"/><stop offset="100%" style="stop-color:rgb(255,200,0);stop-opacity:1"/></linearGradient><path id="f1" d="M0,0 Q10,5 0,10 Q5,10 10,0 Z" fill="url(#g1)"/></defs><use href="#f1" x="5" y="5"/><use href="#f1" x="95" y="5" transform="rotate(90 95 5)"/><use href="#f1" x="95" y="95" transform="rotate(180 95 95)"/><use href="#f1" x="5" y="95" transform="rotate(270 5 95)"/><rect x="15" y="15" width="70" height="70" fill="none" stroke="#8B4513" stroke-width="1"/>',
            emoji_svg_part: '<circle cx="50" cy="50" r="35" fill="#FFC107"/><circle cx="35" cy="40" r="5" fill="#333"/><circle cx="65" cy="40" r="5" fill="#333"/><path d="M30,65 C35,55 65,55 70,65" fill="none" stroke="#333" stroke-width="4"/><circle cx="40" cy="55" r="3" fill="#00BFFF"/><circle cx="60" cy="55" r="3" fill="#00BFFF"/>' // Frown + tears
        },
        {
            id: 'frame-blue-circles-shocked',
            name: 'Blue Shocked',
            frame_svg_part: '<rect x="0" y="0" width="100" height="100" fill="none" stroke="#6A5ACD" stroke-width="2"/><circle cx="10" cy="10" r="8" fill="#FFC0CB"/><circle cx="90" cy="10" r="8" fill="#FFC0CB"/><circle cx="10" cy="90" r="8" fill="#FFC0CB"/><circle cx="90" cy="90" r="8" fill="#FFC0CB"/>',
            emoji_svg_part: '<circle cx="50" cy="50" r="35" fill="#FFC107"/><circle cx="35" cy="40" r="5" fill="#333"/><circle cx="65" cy="40" r="5" fill="#333"/><ellipse cx="50" cy="65" rx="15" ry="10" fill="#333"/>' // O-shaped mouth
        },
        {
            id: 'frame-art-deco-sunglasses',
            name: 'Art Deco Cool',
            frame_svg_part: '<rect x="5" y="5" width="90" height="90" fill="none" stroke="#A9A9A9" stroke-width="2"/><line x1="5" y1="20" x2="20" y2="5" stroke="#D3D3D3" stroke-width="1.5"/><line x1="80" y1="5" x2="95" y2="20" stroke="#D3D3D3" stroke-width="1.5"/><line x1="5" y1="80" x2="20" y2="95" stroke="#D3D3D3" stroke-width="1.5"/><line x1="80" y1="95" x2="95" y2="80" stroke="#D3D3D3" stroke-width="1.5"/><path d="M10 5 L10 15 L20 15" fill="none" stroke="#A9A9A9" stroke-width="3"/><path d="M90 5 L90 15 L80 15" fill="none" stroke="#A9A9A9" stroke-width="3"/><path d="M10 95 L10 85 L20 85" fill="none" stroke="#A9A9A9" stroke-width="3"/><path d="M90 95 L90 85 L80 85" fill="none" stroke="#A9A9A9" stroke-width="3"/>',
            emoji_svg_part: '<circle cx="50" cy="50" r="35" fill="#FFC107"/><rect x="25" y="35" width="50" height="15" fill="#333"/><path d="M30,65 Q50,75 70,65" fill="none" stroke="#333" stroke-width="4"/>' // Sunglasses + smile
        }
        // Add more custom SVG combined frames + emojis here!
        // Remember to give the outer SVG a viewBox="0 0 100 100"
    ];

    const CONSTANTS = {
        CUSTOM_CATEGORY_NAME: "CUSTOM FRAME AVATARS",
        KNOWN_EXISTING_CATEGORY_TEXT: "ACCESSORIES", // Anchor point in UI
        CUSTOM_CATEGORY_MARKER_ATTRIBUTE: "data-custom-category-scripted",
        CUSTOM_FRAME_MARKER_ATTRIBUTE: "data-custom-frame-scripted",
        STORAGE_KEY: 'drawaria_avatar_selected_frame_v1_5', // Unique key for localStorage
        AVATAR_SIZE: 128, // Standard avatar size in px for canvas rendering
        UPLOAD_URL: 'https://drawaria.online/uploadavatarimage'
    };

    // --- END CONFIGURATION ---

    let customCategoryAdded = false;
    let observer = null;
    let avatarCanvas = null; // Hidden canvas for rendering and uploading
    let avatarCanvasContext = null;
    let isCanvasReady = false; // New flag to track canvas readiness
    let activeFrameLayerItem = null; // This variable should ideally be managed more locally or passed, but keeping it for now to minimize changes.

    function log(message, data) { console.log(`[Drawaria Custom Avatars v${GM_info.script.version}] ${message}`, data || ''); }
    function warn(message, data) { console.warn(`[Drawaria Custom Avatars v${GM_info.script.version}] ${message}`, data || ''); }
    function error(message, data) { console.error(`[Drawaria Custom Avatars v${GM_info.script.version}] ${message}`, data || ''); }

    /**
     * Converts an SVG XML string to a Base64 data URL.
     * @param {string} svgString
     * @returns {string}
     */
    function svgToBase64DataUrl(svgString) {
        // Original implementation which is fine for basic SVG characters:
        const base64 = btoa(unescape(encodeURIComponent(svgString)));
        return `data:image/svg+xml;base64,${base64}`;
    }

    /**
     * Creates a complete SVG string from parts.
     * @param {string} framePartSvg
     * @param {string} emojiPartSvg
     * @returns {string} Full SVG XML
     */
    function createFullSvg(framePartSvg, emojiPartSvg) {
        return `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${framePartSvg}${emojiPartSvg}</svg>`;
    }

    /**
     * Clones and modifies a category header LI element.
     * @param {string} categoryName
     * @param {HTMLElement} templateCategoryLi
     * @returns {HTMLElement}
     */
    function cloneAndModifyCategoryHeaderLi(categoryName, templateCategoryLi) {
        if (!templateCategoryLi) {
            error('No templateCategoryLi provided for cloning! Creating basic LI.');
            const newHeader = document.createElement('li');
            newHeader.className = 'category';
            newHeader.textContent = categoryName;
            return newHeader;
        }
        const newHeader = $(templateCategoryLi).clone()[0];
        newHeader.textContent = categoryName;
        newHeader.id = '';
        newHeader.setAttribute(CONSTANTS.CUSTOM_CATEGORY_MARKER_ATTRIBUTE, 'true');
        return newHeader;
    }

    /**
     * Clones and modifies an asset LI element for a custom frame.
     * @param {Object} frameData - {id, name, frame_svg_part, emoji_svg_part}
     * @param {HTMLElement} templateAssetLi
     * @returns {HTMLElement}
     */
    function cloneAndModifyFrameLi(frameData, templateAssetLi) {
        const fullSvg = createFullSvg(frameData.frame_svg_part, frameData.emoji_svg_part);
        const svgDataUrl = svgToBase64DataUrl(fullSvg);

        const newItem = $(templateAssetLi).clone()[0];
        newItem.title = frameData.name;

        const img = newItem.querySelector('img');
        if (img) {
            img.src = svgDataUrl;
            img.alt = frameData.name;
            // Ensure style properties are set, prevent browser defaults
            if (!img.style.objectFit) img.style.objectFit = 'contain';
            if (img.draggable === undefined) img.draggable = false;
            if (img.srcset) img.srcset = ''; // Clear srcset to prevent unwanted loading
        } else {
            warn('Template asset li did not contain an img. Creating one for frame.');
            const newImg = document.createElement('img');
            newImg.src = svgDataUrl;
            newImg.alt = frameData.name;
            newImg.className = 'asset';
            newImg.draggable = false;
            newImg.style.objectFit = 'contain';
            newItem.innerHTML = ''; // Clear existing content if any
            newItem.appendChild(newImg);
        }

        newItem.id = '';
        newItem.setAttribute(CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE, 'true');
        newItem.setAttribute('data-frame-id', frameData.id);
        newItem.onclick = null; // Clear existing onclick to prevent conflicts

        $(newItem).on('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
            handleCustomFrameClick(frameData, newItem);
        });

        return newItem;
    }

    /**
     * Creates and returns the "Clear Avatar" LI element.
     * @param {HTMLElement} templateAssetLi
     * @returns {HTMLElement}
     */
    function createClearAvatarLi(templateAssetLi) {
        const newItem = $(templateAssetLi).clone()[0];
        newItem.title = 'Clear Custom Avatar';
        newItem.id = ''; // Clear ID from template
        newItem.setAttribute(CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE, 'true');
        newItem.setAttribute('data-frame-id', 'no-frame'); // Unique ID for clear option

        // Remove image if present and add text content
        const img = newItem.querySelector('img');
        if (img) img.remove();

        const itemNameSpan = document.createElement('span');
        itemNameSpan.className = 'item-name'; // Use existing class for text styling
        itemNameSpan.textContent = 'Clear Avatar';

        // Clear existing content and append new elements
        $(newItem).empty().append(itemNameSpan);

        // Add specific classes for styling
        $(newItem).addClass('no-frame-option').removeClass('frame-option');

        // Attach dedicated click handler
        $(newItem).off('click').on('click', removeFrame);

        return newItem;
    }

    /**
     * Initializes the hidden canvas for avatar rendering and upload.
     */
    function setupAvatarCanvas() {
        if (!avatarCanvas) {
            avatarCanvas = document.createElement('canvas');
            avatarCanvas.width = CONSTANTS.AVATAR_SIZE;
            avatarCanvas.height = CONSTANTS.AVATAR_SIZE;
            avatarCanvasContext = avatarCanvas.getContext('2d');
            avatarCanvas.style.display = 'none'; // Keep hidden
            document.body.appendChild(avatarCanvas);
            isCanvasReady = true;
            log('Hidden avatar canvas initialized.');
        } else {
            // Ensure context is still valid if canvas was previously created
            if (!avatarCanvasContext) {
                 avatarCanvasContext = avatarCanvas.getContext('2d');
                 isCanvasReady = true;
                 log('Re-initialized avatar canvas context.');
            }
        }
    }

    /**
     * Draws the combined SVG onto the canvas and triggers the upload.
     * @param {Object} frame - The selected frame object.
     * @param {boolean} isInitialLoad - True if called during page load, false if by user click.
     */
    async function renderAndUploadAvatar(frame, isInitialLoad = false) {
        if (!isCanvasReady || !avatarCanvas || !avatarCanvasContext) {
            error('Avatar canvas not initialized or ready for rendering. Aborting upload.', {isCanvasReady, avatarCanvas, avatarCanvasContext});
            alert('Cannot save avatar: Canvas not ready. Please refresh the page and try again.');
            return;
        }

        log(`Rendering ${frame.name} to canvas for upload...`);
        const fullSvg = createFullSvg(frame.frame_svg_part, frame.emoji_svg_part);
        const svgDataUrl = svgToBase64DataUrl(fullSvg);

        const img = new Image();
        img.src = svgDataUrl;

        img.onload = async () => {
            avatarCanvasContext.clearRect(0, 0, CONSTANTS.AVATAR_SIZE, CONSTANTS.AVATAR_SIZE);
            avatarCanvasContext.drawImage(img, 0, 0, CONSTANTS.AVATAR_SIZE, CONSTANTS.AVATAR_SIZE);

            try {
                // Get Base64 data for upload. JPEG is generally preferred for avatars.
                const imageDataUrl = avatarCanvas.toDataURL('image/jpeg', 0.9); // Quality 0.9 for balance

                // Update the preview image in the avatar builder UI immediately
                const previewImg = document.querySelector('.Panel.preview img.AvatarImage, #selfavatarimage');
                if (previewImg) {
                    previewImg.src = imageDataUrl;
                    log('Avatar preview updated locally with new frame.');
                }

                // Only trigger save to backend if it's a user action, not initial load
                if (!isInitialLoad) {
                    await uploadAvatarImage(imageDataUrl);

                    // Update active class in the right panel and localStorage only after successful upload
                    $('.item-option[data-frame-id]').removeClass('active');
                    $(`.item-option[data-frame-id="${frame.id}"]`).addClass('active');
                    $('.item-option.no-frame-option').removeClass('active');

                    localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify({ id: frame.id, name: frame.name }));
                } else {
                    // On initial load, just update UI and localStorage based on the loaded frame
                    $('.item-option[data-frame-id]').removeClass('active');
                    $(`.item-option[data-frame-id="${frame.id}"]`).addClass('active');
                    $('.item-option.no-frame-option').removeClass('active');
                    updateActiveFrameLayer(frame.name, frame.id);
                    log('Initial load: Avatar preview and UI updated.');
                }

            } catch (err) {
                error('Failed to render, get image data, or upload avatar:', err);
                alert(`Failed to apply & save avatar: ${err.message}. Check console for details.`);
            }
        };
        img.onerror = (e) => {
            error('Failed to load SVG image onto canvas.', e);
            alert('Error rendering avatar. SVG might be malformed or invalid.');
        };
    }

    /**
     * Uploads the Base64 image data to Drawaria's server.
     * This mimics the upload logic from the "Drawaria Avatar Copy Players" script.
     * @param {string} base64ImageData
     */
    async function uploadAvatarImage(base64ImageData) {
        log('Attempting to upload avatar image to Drawaria server...');

        try {
            const response = await fetch(CONSTANTS.UPLOAD_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: 'imagedata=' + encodeURIComponent(base64ImageData)
            });

            if (response.ok && response.status === 200) {
                const responseText = await response.text();
                if (responseText && responseText.trim()) {
                    log('Avatar upload successful. Server responded:', responseText);
                    alert('Avatar saved successfully! Page will reload to confirm.');
                    location.reload(); // Reload to see the permanent change
                } else {
                    throw new Error('Server returned empty or invalid response after upload.');
                }
            } else {
                throw new Error(`Server responded with status: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            error('Avatar upload failed:', error);
            throw new Error(`Upload failed: ${error.message}. Please check console (F12) for details.`);
        }
    }

    /**
     * Handles when a custom frame is clicked in the right panel.
     * @param {Object} frameData - The frame object.
     * @param {HTMLElement} clickedLiElement - The LI element that was clicked.
     */
    function handleCustomFrameClick(frameData, clickedLiElement) {
        log(`Clicked frame: ${frameData.name}. Preparing to save.`);
        renderAndUploadAvatar(frameData, false); // Not initial load

        // Visual feedback immediately (active class will be managed after upload success)
        $(clickedLiElement).siblings().removeClass('active');
        $(clickedLiElement).addClass('active');
    }

    /**
     * Removes the current frame from the avatar by uploading a blank/default image.
     */
    async function removeFrame() {
        if (!isCanvasReady || !avatarCanvas || !avatarCanvasContext) {
            warn('Canvas not ready for clearing avatar. Aborting.');
            alert('Cannot clear avatar: Canvas not ready. Please refresh the page and try again.');
            return;
        }

        log('Removing frame. Uploading a transparent default avatar...');
        avatarCanvasContext.clearRect(0, 0, CONSTANTS.AVATAR_SIZE, CONSTANTS.AVATAR_SIZE); // Clear canvas to transparent

        // Use PNG for transparency when clearing
        const imageDataUrl = avatarCanvas.toDataURL('image/png');

        // Update preview
        const previewImg = document.querySelector('.Panel.preview img.AvatarImage, #selfavatarimage');
        if (previewImg) {
            previewImg.src = imageDataUrl;
        }

        try {
            await uploadAvatarImage(imageDataUrl);
            if (activeFrameLayerItem) {
                $(activeFrameLayerItem).remove();
                activeFrameLayerItem = null;
            }
            $('.item-option[data-frame-id]').removeClass('active');
            $('.item-option.no-frame-option').addClass('active');
            localStorage.removeItem(CONSTANTS.STORAGE_KEY);
            log('Frame removed and transparent avatar uploaded successfully.');
        } catch (err) {
            error('Failed to upload transparent avatar for frame removal:', err);
            alert(`Error removing frame: ${err.message}.`);
        }
    }

    /**
     * Updates or creates the "Frame" item in the left panel's active layers list.
     * @param {string} frameName
     * @param {string} frameId
     */
    function updateActiveFrameLayer(frameName, frameId) {
        const playerlist = document.getElementById('playerlist');
        if (!playerlist) {
            warn('Left panel playerlist not found for active frame layer.');
            return;
        }

        activeFrameLayerItem = playerlist.querySelector(`li[${CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE}="true"]`);

        if (frameId === 'no-frame') { // If "Clear Avatar" is selected
            if (activeFrameLayerItem) {
                $(activeFrameLayerItem).remove();
                activeFrameLayerItem = null;
            }
            return;
        }

        if (!activeFrameLayerItem) {
            activeFrameLayerItem = document.createElement('li');
            activeFrameLayerItem.className = 'layer-item custom-frame-layer';
            activeFrameLayerItem.setAttribute(CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE, 'true');
            activeFrameLayerItem.setAttribute('data-frame-id', frameId);

            const layerNameSpan = document.createElement('span');
            layerNameSpan.className = 'layer-name';
            layerNameSpan.textContent = `Custom: ${frameName}`; // Indicate it's a custom saved avatar

            const layerControlsDiv = document.createElement('div');
            layerControlsDiv.className = 'layer-controls';

            const removeButton = document.createElement('button');
            removeButton.className = 'btn-remove-part';
            removeButton.title = 'Remove Custom Avatar';
            removeButton.textContent = 'x';
            $(removeButton).on('click', removeFrame);

            // Move Up/Down buttons (disabled)
            const moveUpButton = document.createElement('button');
            moveUpButton.className = 'btn-move-up';
            moveUpButton.title = 'Move Up (disabled for custom avatar)';
            moveUpButton.textContent = '▲';
            moveUpButton.disabled = true;

            const moveDownButton = document.createElement('button');
            moveDownButton.className = 'btn-move-down';
            moveDownButton.title = 'Move Down (disabled for custom avatar)';
            moveDownButton.textContent = '▼';
            moveDownButton.disabled = true;

            layerControlsDiv.append(removeButton, moveUpButton, moveDownButton);
            activeFrameLayerItem.append(layerNameSpan, layerControlsDiv);

            // Prepend to playerlist
            $(playerlist).prepend(activeFrameLayerItem);
            log('Created new active custom avatar layer in left panel.');
        } else {
            activeFrameLayerItem.querySelector('.layer-name').textContent = `Custom: ${frameName}`;
            activeFrameLayerItem.setAttribute('data-frame-id', frameId);
            log('Updated existing active custom avatar layer in left panel.');
        }
    }

    /**
     * Finds the target UL list for categories and template LI elements.
     * This logic is adapted from the provided Custom Emojis script.
     * @returns {Object|null}
     */
    function findTargetListAndTemplates() {
        let knownCategoryElement = null;
        const categoryTitles = document.querySelectorAll('.category');
        for (let el of categoryTitles) {
            if (el.textContent.trim().toUpperCase() === CONSTANTS.KNOWN_EXISTING_CATEGORY_TEXT) {
                knownCategoryElement = el;
                break;
            }
        }

        if (!knownCategoryElement) {
            warn(`Could not find the anchor category "${CONSTANTS.KNOWN_EXISTING_CATEGORY_TEXT}".`);
            return null;
        }
        log(`Found anchor category "${CONSTANTS.KNOWN_EXISTING_CATEGORY_TEXT}":`, knownCategoryElement);

        const targetListElement = $(knownCategoryElement).closest('ul')[0];
        if (!targetListElement) {
            warn('Could not find the main <ul> list containing the anchor category.');
            return null;
        }
        log('Found target <ul> list element:', targetListElement);

        const templateCategoryLi = targetListElement.querySelector('li.category');
        // Find a representative asset item, ignoring other categories or special items
        let templateAssetLi = targetListElement.querySelector(`li:not(.category):not(.title):not([${CONSTANTS.CUSTOM_CATEGORY_MARKER_ATTRIBUTE}]):not([${CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE}])`);


        if (!templateCategoryLi) { warn('Template for category header (li.category) not found.'); return null; }
        if (!templateAssetLi) {
            warn('Template for asset item (li:not(.category)) not found. Trying fallback.');
            // Fallback for asset LI if the stricter selector fails
            const allLis = targetListElement.querySelectorAll('li');
            for (let li of allLis) {
                if (!li.classList.contains('category') && li.querySelector('img.asset')) {
                    log('Using fallback asset LI template.');
                    templateAssetLi = li;
                    break;
                }
            }
            if (!templateAssetLi) {
                 warn('No suitable asset LI template found, even with fallback.');
                 return null;
            }
        }

        log('Found templates: Category LI, Asset LI', { templateCategoryLi, templateAssetLi });
        return { targetListElement, knownCategoryElement, templateCategoryLi, templateAssetLi };
    }

    /**
     * Attempts to add the custom "CUSTOM AVATARS" category and its items.
     * @returns {boolean} - True if added successfully, false otherwise.
     */
    function attemptToAddCustomFrames() {
        if (customCategoryAdded) {
            // Already added, ensure canvas is ready and load saved state if not already done
            if (!isCanvasReady) {
                 setupAvatarCanvas();
                 if (isCanvasReady) loadSavedFrame(); // Only load if canvas is ready now
            }
            if (observer) observer.disconnect();
            log('Custom category already added. Observer disconnected.');
            return true;
        }

        const result = findTargetListAndTemplates();
        if (!result) return false;

        const { targetListElement, knownCategoryElement, templateCategoryLi, templateAssetLi } = result;

        if (targetListElement.querySelector(`li[${CONSTANTS.CUSTOM_CATEGORY_MARKER_ATTRIBUTE}="true"]`)) {
            log('Custom category already exists in the list. Finalizing.');
            customCategoryAdded = true;
            if (observer) observer.disconnect();
            // Ensure canvas is ready before attempting to load saved frame
            setupAvatarCanvas();
            if (isCanvasReady) loadSavedFrame();
            return true;
        }

        log('Adding new CUSTOM AVATARS category and items to the right panel.');

        const newHeader = cloneAndModifyCategoryHeaderLi(CONSTANTS.CUSTOM_CATEGORY_NAME, templateCategoryLi);
        $(knownCategoryElement).after(newHeader);

        let currentElement = newHeader; // Anchor for inserting items
        FRAMES_DATA.forEach(frame => {
            const newLi = cloneAndModifyFrameLi(frame, templateAssetLi);
            $(currentElement).after(newLi);
            currentElement = newLi;
        });

        // Add the "Clear Avatar" option
        const noFrameLi = createClearAvatarLi(templateAssetLi);
        $(currentElement).after(noFrameLi);


        log(`Successfully added "${CONSTANTS.CUSTOM_CATEGORY_NAME}" category with ${FRAMES_DATA.length} items.`);
        customCategoryAdded = true;
        if (observer) observer.disconnect();

        // Ensure canvas is ready before loading saved frame
        setupAvatarCanvas();
        if (isCanvasReady) loadSavedFrame();

        return true;
    }

    /**
     * Loads the previously selected frame from localStorage and applies it.
     */
    function loadSavedFrame() {
        if (!isCanvasReady) {
            warn('Canvas not ready for loading saved frame. Deferring loadSavedFrame.');
            return;
        }

        const savedFrameJson = localStorage.getItem(CONSTANTS.STORAGE_KEY);
        if (savedFrameJson) {
            try {
                const savedFrame = JSON.parse(savedFrameJson);
                if (savedFrame.id === 'no-frame') {
                    log("Saved avatar is 'Clear Avatar'. Activating it.");
                    $('.item-option[data-frame-id]').removeClass('active');
                    $('.item-option.no-frame-option').addClass('active');
                    updateActiveFrameLayer('Clear Avatar', 'no-frame'); // Update left panel for 'no-frame'
                    // No need to render anything if it's 'no-frame', current avatar is already clear
                } else {
                    const frameToApply = FRAMES_DATA.find(f => f.id === savedFrame.id);
                    if (frameToApply) {
                        // Only update preview and left panel, don't re-upload on page load
                        renderAndUploadAvatar(frameToApply, true); // True for isInitialLoad
                        log(`Loaded saved avatar: ${frameToApply.name}`);
                    } else {
                        // If saved ID is not found in FRAMES_DATA, clear it.
                        warn(`Saved avatar ID "${savedFrame.id}" not found in current FRAMES_DATA. Clearing saved state.`);
                        localStorage.removeItem(CONSTANTS.STORAGE_KEY);
                        // Default to 'Clear Avatar' visually and in left panel.
                        $('.item-option[data-frame-id]').removeClass('active');
                        $('.item-option.no-frame-option').addClass('active');
                        updateActiveFrameLayer('Clear Avatar', 'no-frame');
                    }
                }
            } catch (e) {
                error("Failed to parse or load saved avatar data. Clearing localStorage.", e);
                localStorage.removeItem(CONSTANTS.STORAGE_KEY);
                $('.item-option[data-frame-id]').removeClass('active');
                $('.item-option.no-frame-option').addClass('active');
            }
        } else {
            log("No saved avatar found in localStorage. Setting 'Clear Avatar' as active by default.");
            $('.item-option[data-frame-id]').removeClass('active');
            $('.item-option.no-frame-option').addClass('active');
            updateActiveFrameLayer('Clear Avatar', 'no-frame'); // Show "Clear Avatar" in left panel
        }
    }


    /**
     * Injects CSS styles into the document.
     * Uses GM_addStyle (Tampermonkey/Greasemonkey) or falls back to appending a style tag.
     * @param {string} css
     */
    function injectCSS(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    function startObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver((mutationsList, obs) => {
            // Check for avatar container and initialize canvas
            const avatarContainer = document.getElementById('avatarcontainer');
            if (avatarContainer && !isCanvasReady) { // Ensure canvas is initialized only once and when container is present
                 setupAvatarCanvas();
                 // If canvas is now ready, and categories were added, load saved frame
                 if (isCanvasReady && customCategoryAdded) {
                     loadSavedFrame();
                 }
            }

            // Attempt to add custom frames
            if (attemptToAddCustomFrames()) {
                // If categories are added and observer has done its job, disconnect
                obs.disconnect();
                observer = null;
            }
        });
        // Observe the entire document for changes (childList and subtree are important for dynamic loading)
        observer.observe(document.documentElement, { childList: true, subtree: true });
        log('MutationObserver started.');

        // Initial check in case elements are already present very early
        setTimeout(() => {
            if (!customCategoryAdded) {
                log("Initial attempt to add frames after a short delay (post-DOMReady).");
                attemptToAddCustomFrames();
            }
            if (!isCanvasReady) {
                // Fallback for canvas initialization if observer somehow missed it or it takes longer
                const avatarContainer = document.getElementById('avatarcontainer');
                if (avatarContainer) {
                    setupAvatarCanvas();
                    if (isCanvasReady && customCategoryAdded) {
                        loadSavedFrame();
                    }
                }
            }
        }, 750);
    }

    // Main execution block when jQuery is ready
    $(() => {
        log("jQuery ready. Script starting main logic.");

        injectCSS(`
            /* --- Right Panel Category & Item Styling --- */

            /* Basic styling for the custom category header */
            li[${CONSTANTS.CUSTOM_CATEGORY_MARKER_ATTRIBUTE}="true"] {
                font-weight: bold;
                padding: 0.5em 1em;
                margin-top: 1em;
                border-bottom: 1px solid #b0b5b9;
                background-color: #e6f7ff; /* Lighter blue for custom category */
                border-radius: 5px;
                text-align: center;
                color: #333;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            /* Styling for custom frame items */
            li[${CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE}="true"].item-option {
                width: 60px; /* Consistent size */
                height: 60px;
                border-radius: 50%;
                background-color: #ffffff;
                border: 1px solid #dee2e6;
                cursor: pointer;
                display: flex;
                flex-direction: column; /* To stack image and name if name is shown */
                align-items: center;
                justify-content: center;
                overflow: hidden; /* Hide overflow for circular image */
                position: relative; /* For item-name positioning */
                box-sizing: border-box;
                transition: all 0.2s ease;
                margin: 5px; /* Add some margin for spacing */
                flex-shrink: 0; /* Prevent shrinking in flex container */
            }
            li[${CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE}="true"].item-option:hover {
                border-color: #007bff;
                box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
                background-color: #e9f0f7;
            }
            li[${CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE}="true"].item-option.active {
                border-color: #007bff !important;
                box-shadow: 0 0 8px rgba(0, 123, 255, 0.8) !important;
                background-color: #e9f0f7;
            }

            /* Image inside the custom frame item */
            li[${CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE}="true"].item-option img.asset {
                width: 100%; /* Fill the circular item */
                height: 100%;
                object-fit: contain; /* Ensure SVG fits */
                border-radius: 50%; /* Make image circular */
            }

            /* Item name (tooltip-like) */
            li[${CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE}="true"].item-option .item-name {
                font-size: 0.6em;
                text-align: center;
                word-break: break-word;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 2px 0;
                display: none; /* Hidden by default */
                border-bottom-left-radius: 50%; /* Match parent border-radius */
                border-bottom-right-radius: 50%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                box-sizing: border-box; /* Include padding/border in width */
            }
            li[${CONSTANTS.CUSTOM_FRAME_MARKER_ATTRIBUTE}="true"].item-option:hover .item-name {
                display: block; /* Show on hover */
            }

            /* Specific styles for the "Clear Avatar" option */
            li[data-frame-id="no-frame"].no-frame-option {
                background-color: #f0f0f0;
                color: #555;
                font-weight: bold;
                font-size: 0.7em;
                justify-content: center;
                align-items: center;
                padding: 5px; /* Add some padding for text */
            }
            li[data-frame-id="no-frame"].no-frame-option img {
                display: none; /* Ensure no image is shown */
            }
            li[data-frame-id="no-frame"].no-frame-option .item-name {
                position: static; /* Text is part of flow, not absolutely positioned */
                background: none;
                color: inherit;
                padding: 0;
                white-space: normal;
                overflow: visible;
                text-overflow: clip;
                font-size: 0.7em; /* Inherit font size from parent */
                display: block; /* Always visible for clear button */
            }
            li[data-frame-id="no-frame"].no-frame-option:hover {
                 border-color: #dc3545; /* Red for clear/remove */
                 background-color: #f8d7da;
            }
            li[data-frame-id="no-frame"].no-frame-option.active {
                border-color: #dc3545 !important;
                box-shadow: 0 0 8px rgba(220, 53, 69, 0.8) !important;
            }

            /* --- Left Panel Active Layer Styling --- */
            .layer-item.custom-frame-layer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5em;
                margin-bottom: 0.3em;
                background-color: #f0f8ff;
                border-radius: 7px;
                font-size: 0.8em;
                transition: background-color 0.2s ease;
            }
            .layer-item.custom-frame-layer:hover {
                background-color: #fbffad;
            }
            .layer-item.custom-frame-layer .layer-name {
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 5px;
            }
            .layer-item.custom-frame-layer .layer-controls {
                display: flex;
                gap: 5px;
            }
            .layer-item.custom-frame-layer .layer-controls button {
                background: #ff5050; /* Red for remove button */
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                padding: 3px 6px;
                font-size: 0.7em;
                line-height: 1;
                min-width: 20px;
                text-align: center;
            }
            .layer-item.custom-frame-layer .layer-controls button:hover {
                background: #cc0000;
            }

            .layer-item.custom-frame-layer .layer-controls .btn-move-up,
            .layer-item.custom-frame-layer .layer-controls .btn-move-down {
                background: #cccccc; /* Grey for disabled buttons */
                cursor: not-allowed;
            }
        `);


        // Use onPageReady or directly call startObserver depending on how DOM is loaded.
        // Given `MutationObserver` is used, it should reliably pick up elements.
        if (window.location.pathname.includes('/avatar/builder')) {
            log('Avatar builder page detected. Initializing script.');
            startObserver();
        } else {
            log('Not on avatar builder page. Script will not actively modify DOM.');
        }
    });

})(window.jQuery);