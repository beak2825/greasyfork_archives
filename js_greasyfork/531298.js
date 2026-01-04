// ==UserScript==
// @name         Discourse Avatar Replacer (DiceBear Adventurer) v1.2 (Debug Enabled)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces Discourse user avatars with DiceBear Adventurer SVGs based on user ID or username. (Debug logging enabled)
// @author       dari & AI Assistant
// @match        *://*.discourse.org/*
// @match        *://*.linux.do/*
// @icon         https://api.dicebear.com/9.x/adventurer/svg?seed=tampermonkey&size=64
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531298/Discourse%20Avatar%20Replacer%20%28DiceBear%20Adventurer%29%20v12%20%28Debug%20Enabled%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531298/Discourse%20Avatar%20Replacer%20%28DiceBear%20Adventurer%29%20v12%20%28Debug%20Enabled%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[DICEBEAR REPLACER] Script starting...'); // Log script start

    const DICEBEAR_API_URL_BASE = 'https://api.dicebear.com/9.x/adventurer/svg?seed=';
    const PROCESSED_ATTRIBUTE = 'data-dicebear-avatar-replaced';

    function getUserIdentifier(imgElement) {
        console.log('[DICEBEAR REPLACER] Trying to get identifier for:', imgElement);

        // 1. Check data-user-id on img
        let userId = imgElement.getAttribute('data-user-id');
        if (userId && userId.trim() !== '') {
            console.log(`[DICEBEAR REPLACER] Found User ID on img: ${userId}`);
            return userId;
        }

        // 2. Check data-user-id on closest ancestor
        const userElement = imgElement.closest('[data-user-id]');
        if (userElement) {
            userId = userElement.getAttribute('data-user-id');
            if (userId && userId.trim() !== '') {
                console.log(`[DICEBEAR REPLACER] Found User ID on ancestor [${userElement.tagName}]: ${userId}`);
                return userId;
            }
        }

        // 3. Fallback: Extract username from parent link href
        const parentLink = imgElement.closest('a[href*="/u/"]');
        if (parentLink && parentLink.href) {
            const match = parentLink.href.match(/\/u\/([^\/]+)/);
            if (match && match[1]) {
                const username = match[1];
                console.log(`[DICEBEAR REPLACER] Found Username in link [${parentLink.tagName}]: ${username}`);
                return username; // Use username as the seed
            } else {
                 console.log('[DICEBEAR REPLACER] Found parent link, but no username match in href:', parentLink.href);
            }
        } else {
             console.log('[DICEBEAR REPLACER] No parent link with /u/ found.');
        }

        // 4. Fallback: Username from title/alt (often less reliable)
        const usernameFromAttr = imgElement.getAttribute('title') || imgElement.getAttribute('alt');
        if (usernameFromAttr && usernameFromAttr.trim() !== '' && !usernameFromAttr.includes('Avatar')) { // Avoid generic "Avatar" alt text
           console.log(`[DICEBEAR REPLACER] Found identifier from title/alt: ${usernameFromAttr.trim()}`);
           return usernameFromAttr.trim();
        }


        console.warn('[DICEBEAR REPLACER] Could not determine User ID or Username for:', imgElement);
        return null;
    }

    function replaceAvatars() {
        console.log('[DICEBEAR REPLACER] Running replaceAvatars function...');
        // Select all images with 'avatar' class NOT already processed
        const avatarImages = document.querySelectorAll(`img.avatar:not([${PROCESSED_ATTRIBUTE}])`);
        console.log(`[DICEBEAR REPLACER] Found ${avatarImages.length} potential avatar images with class 'avatar' to process.`);

        if (avatarImages.length === 0) {
             console.log("[DICEBEAR REPLACER] No new images with class 'avatar' found this time.");
             // Let's also check if ANY images matching the original src pattern exist, maybe the class is wrong on homepage?
             // This is for debugging only:
             const allUserImages = document.querySelectorAll('img[src*="/user_avatar/"]');
             console.log(`[DICEBEAR REPLACER] DEBUG: Found ${allUserImages.length} images with '/user_avatar/' in src (regardless of class).`);
        }


        avatarImages.forEach((img, index) => {
            console.log(`[DICEBEAR REPLACER] Processing image #${index + 1}:`, img);
            img.setAttribute(PROCESSED_ATTRIBUTE, 'true'); // Mark as processed

            const identifier = getUserIdentifier(img);

            if (identifier && identifier.trim() !== '') {
                const seed = identifier.trim();
                const newSrc = `${DICEBEAR_API_URL_BASE}${encodeURIComponent(seed)}`;

                if (img.src !== newSrc) {
                    console.log(`[DICEBEAR REPLACER] Replacing src for Identifier: ${seed}. Old src: ${img.src}, New src: ${newSrc}`);
                    img.src = newSrc; // Replace the source
                    img.removeAttribute('srcset'); // Remove srcset
                    // Let's keep width/height for now
                } else {
                    console.log(`[DICEBEAR REPLACER] Identifier ${seed} found, but src ${img.src} is already the target DiceBear URL. Skipping.`);
                }
            } else {
                console.warn('[DICEBEAR REPLACER] No identifier found for image:', img);
            }
        });
        console.log('[DICEBEAR REPLACER] Finished replaceAvatars function run.');
    }

    // --- MutationObserver ---
    const observer = new MutationObserver(mutations => {
        let needsUpdate = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(`img.avatar:not([${PROCESSED_ATTRIBUTE}])`) || node.querySelector(`img.avatar:not([${PROCESSED_ATTRIBUTE}])`)) {
                            console.log('[DICEBEAR REPLACER] MutationObserver detected added node potentially containing an avatar:', node);
                            needsUpdate = true;
                            break;
                        }
                    }
                }
            }
            if (needsUpdate) break;
        }

        if (needsUpdate) {
            console.log('[DICEBEAR REPLACER] DOM change detected, scheduling avatar replacement.');
            clearTimeout(observer.debounceTimer);
            observer.debounceTimer = setTimeout(replaceAvatars, 200); // Slightly longer debounce for dynamic loads
        }
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    console.log('[DICEBEAR REPLACER] MutationObserver started.');

    // --- Initial Run ---
    console.log('[DICEBEAR REPLACER] Scheduling initial run.');
    // Increased timeout significantly to wait for potentially slow homepage elements
    setTimeout(replaceAvatars, 1500);

})();