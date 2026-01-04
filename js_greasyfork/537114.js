// ==UserScript==
// @name         Drawaria.online Avatar Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Switch between two saved avatars in Drawaria.online avatar builder.
// @author       YouTubeDrawaria
// @match        *://drawaria.online/avatar/builder*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/537114/Drawariaonline%20Avatar%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/537114/Drawariaonline%20Avatar%20Switcher.meta.js
// ==/UserScript==

(function($) { // Tampermonkey should pass the @require'd jQuery as $
    'use strict';

    // unsafeWindow is directly available due to @grant unsafeWindow
    const pageWindow = unsafeWindow;

    const AVATAR_SLOT_KEYS = {
        1: 'avatar_switcher_slot_1_image',
        2: 'avatar_switcher_slot_2_image'
    };
    const SWITCHER_PANEL_ID = 'avatar-switcher-panel';
    let scriptInitialized = false;

    function log(message, data) { console.log(`[Drawaria Avatar Switcher v0.5.1] ${message}`, data || ''); }
    function warn(message, data) { console.warn(`[Drawaria Avatar Switcher v0.5.1] ${message}`, data || ''); }
    function error(message, data) { console.error(`[Drawaria Avatar Switcher v0.5.1] ${message}`, data || ''); }

    // --- START OF COPIED FUNCTIONS (Ensure these are filled from v0.5) ---
    function addSwitcherStyles() {
        const styles = `
            #${SWITCHER_PANEL_ID} { background-color: #f0f0f0; border: 1px solid #ccc; padding: 10px; margin-top: 20px; border-radius: 5px; }
            #${SWITCHER_PANEL_ID} h3 { text-align: center; margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #333; }
            .${SWITCHER_PANEL_ID}-container { display: flex; justify-content: space-around; align-items: flex-start; }
            .${SWITCHER_PANEL_ID}-slot { display: flex; flex-direction: column; align-items: center; width: 45%; }
            .${SWITCHER_PANEL_ID}-preview-circle { width: 100px; height: 100px; border-radius: 50%; background-color: #fff; border: 2px solid #aaa; display: flex; justify-content: center; align-items: center; text-align: center; margin-bottom: 10px; overflow: hidden; font-size: 14px; color: #555; }
            .${SWITCHER_PANEL_ID}-preview-circle img { width: 100%; height: 100%; object-fit: cover; }
            #${SWITCHER_PANEL_ID} button { background-color: #fff; border: 1px solid #000; color: #000; padding: 5px 10px; margin-top: 5px; cursor: pointer; border-radius: 4px; font-size: 12px; width: 80px; }
            #${SWITCHER_PANEL_ID} button:hover { background-color: #e0e0e0; }
        `;
        $('<style>').prop('type', 'text/css').html(styles).appendTo('head');
    }

    function createSwitcherPanelHTML() {
        return `
            <div id="${SWITCHER_PANEL_ID}">
                <h3>2 avatars switcher</h3>
                <div class="${SWITCHER_PANEL_ID}-container">
                    <div class="${SWITCHER_PANEL_ID}-slot" id="avatar-slot-1-container"><div class="${SWITCHER_PANEL_ID}-preview-circle" id="avatar-preview-1"><span>avatar 1</span></div><button class="upload-btn" data-slot="1">upload</button><button class="delete-btn" data-slot="1">delete</button><button class="use-btn" data-slot="1">use</button></div>
                    <div class="${SWITCHER_PANEL_ID}-slot" id="avatar-slot-2-container"><div class="${SWITCHER_PANEL_ID}-preview-circle" id="avatar-preview-2"><span>avatar 2</span></div><button class="upload-btn" data-slot="2">upload</button><button class="delete-btn" data-slot="2">delete</button><button class="use-btn" data-slot="2">use</button></div>
                </div>
            </div>`;
    }

     function findKnownCategoryAnchor() {
        const knownExistingCategoryTexts = ["FACE", "EYES", "MOUTH", "ACCESSORIES"];
        const allElements = document.querySelectorAll('body *');
        for (const categoryText of knownExistingCategoryTexts) {
            for (let el of allElements) {
                if (el.childNodes.length === 1 && el.firstChild.nodeType === Node.TEXT_NODE && el.firstChild.textContent.trim().toUpperCase() === categoryText) { log(`Found category anchor (type 1): "${categoryText}" in`, el); return el; }
                if (el.textContent.trim().toUpperCase() === categoryText && el.children.length < 2) { if (['LI', 'DIV', 'SPAN', 'H3', 'H4', 'P'].includes(el.tagName)) { if ($(el).closest('ul').length > 0 || $(el).closest('.Panel.parts').length > 0 ) { log(`Found category anchor (type 2): "${categoryText}" in`, el); return el; } } }
            }
        }
        warn('No known category anchor element found.'); return null;
    }

    function injectSwitcherPanel() {
        const panelHTML = createSwitcherPanelHTML(); let $panel = $(panelHTML); const knownCategoryElement = findKnownCategoryAnchor();
        if (knownCategoryElement) {
            const $partsListUl = $(knownCategoryElement).closest('ul');
            if ($partsListUl.length) { const $container = $partsListUl.parent(); if ($container.length && !$container.is('body') && !$container.is('html')) { $container.append($panel); log('Avatar Switcher panel appended to parent of parts list UL.'); return; } else { $partsListUl.after($panel); log('Avatar Switcher panel appended *after* parts list UL.'); return; } }
            else { const $categoryParent = $(knownCategoryElement).parent(); if ($categoryParent.length && !$categoryParent.is('body') && !$categoryParent.is('html')) { $categoryParent.append($panel); log('Avatar Switcher panel appended to parent of category anchor.'); return; } }
        }
        const $targetContainer = $('.column.right .Panel.parts');
        if ($targetContainer.length) { $targetContainer.append($panel); log('Avatar Switcher panel appended to .column.right .Panel.parts'); }
        else { warn('Could not find .Panel.parts. Appending to body.'); $('body').append($panel); }
    }

    async function displayAvatarInSlotPreview(slotNumber, imageUrl) { const previewCircle = $(`#avatar-preview-${slotNumber}`); if (imageUrl) { previewCircle.html(`<img src="${imageUrl}" alt="Avatar ${slotNumber}">`); } else { previewCircle.html(`<span>avatar ${slotNumber}</span>`); } }
    async function loadAndDisplayAvatars() { for (const slotNumber of [1, 2]) { const imageUrl = await GM_getValue(AVATAR_SLOT_KEYS[slotNumber], null); await displayAvatarInSlotPreview(slotNumber, imageUrl); } log('Finished loading saved avatars.'); }
    async function handleUploadClick(slotNumber) { const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = async (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = async (e) => { const imageDataUrl = e.target.result; try { await GM_setValue(AVATAR_SLOT_KEYS[slotNumber], imageDataUrl); await displayAvatarInSlotPreview(slotNumber, imageDataUrl); log(`Avatar for slot ${slotNumber} uploaded.`); } catch (err) { error(`Error saving avatar for slot ${slotNumber}:`, err); alert(`Failed to save avatar slot ${slotNumber}.`); } }; reader.onerror = () => { error('FileReader failed.'); alert('Error reading file.'); }; reader.readAsDataURL(file); }; input.click(); }
    async function handleDeleteClick(slotNumber) { if (confirm(`Delete avatar in slot ${slotNumber}?`)) { await GM_deleteValue(AVATAR_SLOT_KEYS[slotNumber]); await displayAvatarInSlotPreview(slotNumber, null); log(`Avatar for slot ${slotNumber} deleted.`); } }
    // --- END OF COPIED FUNCTIONS ---

    async function handleUseClick(slotNumber) {
        const base64RawImageData = await GM_getValue(AVATAR_SLOT_KEYS[slotNumber], null);
        if (!base64RawImageData) {
            alert(`No avatar saved in slot ${slotNumber}. Upload an image first.`);
            return;
        }
        log(`Attempting to use avatar from slot ${slotNumber}`);

        if (typeof pageWindow.ACCOUNT_AVATARSAVE === 'undefined' || !Array.isArray(pageWindow.ACCOUNT_AVATARSAVE)) {
            error('pageWindow.ACCOUNT_AVATARSAVE is not defined or not an array AT THE TIME OF USE.', pageWindow.ACCOUNT_AVATARSAVE);
            alert('Error: Avatar configuration (ACCOUNT_AVATARSAVE) is missing or invalid. Cannot save.');
            return;
        }

        const base64JpegImageData = base64RawImageData.replace(/^data:[^;]+;/, 'data:image/jpeg;');
        const avatarPreviewImg = document.querySelector('.Panel.preview img.AvatarImage, .Panel.preview img');
        if (avatarPreviewImg) {
            avatarPreviewImg.src = base64RawImageData;
            log('Main avatar preview image updated.');
        } else {
            warn('Main avatar preview image element not found when trying to update preview.');
        }

        log('Current ACCOUNT_AVATARSAVE (from pageWindow):', JSON.stringify(pageWindow.ACCOUNT_AVATARSAVE));
        triggerSaveToServer(base64JpegImageData, pageWindow.ACCOUNT_AVATARSAVE);
    }

    function triggerSaveToServer(formattedBase64ImageData, avatarSaveObjectFromPage) {
        if (typeof pageWindow.LOGGEDIN === 'undefined') {
            warn('pageWindow.LOGGEDIN is undefined. Saving might fail or be treated as guest.');
        }

        log('Attempting to save avatar...');
        $.ajax({
            url: pageWindow.LOGGEDIN ? '/saveavatar' : '/uploadavatarimage',
            type: 'POST',
            data: {
                'avatarsave_builder': JSON.stringify(avatarSaveObjectFromPage),
                'imagedata': formattedBase64ImageData,
                'fromeditor': true
            },
            xhr: () => {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', evt => {
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total) * 100;
                        log(`Upload Progress: ${percentComplete.toFixed(0)}%`);
                    }
                }, false);
                return xhr;
            }
        }).done(data => {
            log('Avatar data sent, server responded with cache key:', data);
            fetch(`${location.origin}/avatar/cache/${data}.jpg`, { method: 'GET', mode: 'cors', cache: 'reload' })
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to fetch cached avatar: ${response.statusText} (status: ${response.status})`);
                    return response.blob();
                })
                .then(() => {
                    log('Avatar saved and cache confirmed! Redirecting to origin.');
                    alert('Avatar saved successfully!');
                    location.href = new URL(location.href).origin;
                })
                .catch(err => {
                    error('Error confirming saved avatar from cache.', err);
                    alert(`Avatar might be saved, but confirmation failed: ${err.message}. Please check your profile.`);
                    location.href = new URL(location.href).origin;
                });
        }).fail((jqXHR, textStatus, errorThrown) => {
            error('$.ajax save request failed.', { status: textStatus, error: errorThrown, response: jqXHR.responseText });
            alert(`Failed to save avatar: ${errorThrown || textStatus}. Server response: ${jqXHR.responseText}`);
        });
    }

    function runMainLogic() {
        if (scriptInitialized) {
            log('Main logic already initialized.');
            return;
        }
        scriptInitialized = true;
        log('Key elements and ACCOUNT_AVATARSAVE are present. Initializing main logic.');

        addSwitcherStyles();
        injectSwitcherPanel();
        loadAndDisplayAvatars();

        $(`#${SWITCHER_PANEL_ID}`).on('click', '.upload-btn', async function() { await handleUploadClick($(this).data('slot')); });
        $(`#${SWITCHER_PANEL_ID}`).on('click', '.delete-btn', async function() { await handleDeleteClick($(this).data('slot')); });
        $(`#${SWITCHER_PANEL_ID}`).on('click', '.use-btn', async function() { await handleUseClick($(this).data('slot')); });

        log('Avatar Switcher UI injected and event listeners attached.');
    }

    function initializeWhenReady() {
        if (!window.location.pathname.includes('/avatar/builder')) return;
        log('Avatar builder page. Waiting for page resources...');

        if (typeof $ === 'undefined') { error("jQuery ($) not available!"); return; } // Check jQuery from @require
        if (typeof GM_setValue === 'undefined') { error("GM functions not available!"); return; }

        let attempts = 0;
        const maxAttempts = 150; // Max 15 seconds (150 * 100ms)
        const checkInterval = 100; // Check every 100ms

        const intervalId = setInterval(() => {
            attempts++;
            const mainPanel = document.querySelector('main .Panel.preview');
            const accountSaveReady = typeof pageWindow.ACCOUNT_AVATARSAVE !== 'undefined' && Array.isArray(pageWindow.ACCOUNT_AVATARSAVE);

            if (mainPanel && accountSaveReady) {
                log(`Page resources ready after ${attempts * checkInterval}ms. ACCOUNT_AVATARSAVE found.`);
                clearInterval(intervalId);
                runMainLogic();
            } else if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                error(`Page resources not ready after ${maxAttempts * checkInterval}ms. ACCOUNT_AVATARSAVE ready: ${accountSaveReady}, Main panel found: ${!!mainPanel}`);
                if (!accountSaveReady) {
                    error('CRITICAL: pageWindow.ACCOUNT_AVATARSAVE is STILL not available. Avatar saving will likely fail.');
                    alert('Avatar Switcher: Critical configuration missing. Functionality may be broken.');
                }
                if (mainPanel) { warn('Attempting to run main logic despite potential issues.'); runMainLogic(); }
                else { error('Main panel element also not found. Cannot initialize script.'); }
            } else {
                if (attempts % 20 === 0) { log(`Still waiting for resources... Attempt ${attempts}. ACCOUNT_AVATARSAVE: ${accountSaveReady}, Main panel: ${!!mainPanel}`); }
            }
        }, checkInterval);
    }

    // Start the initialization process. $ should be jQuery here.
    $(initializeWhenReady);

})(jQuery); // Pass the jQuery provided by @require into the IIFE