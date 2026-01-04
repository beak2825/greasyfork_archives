// ==UserScript==
// @name         Drawaria.online Custom Emojis! :3
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds new custom emojis to Drawaria.online avatar builder and attempts to save them to the profile when clicked.
// @author       YouTubeDrawaria
// @match        *://drawaria.online/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536643/Drawariaonline%20Custom%20Emojis%21%20%3A3.user.js
// @updateURL https://update.greasyfork.org/scripts/536643/Drawariaonline%20Custom%20Emojis%21%20%3A3.meta.js
// ==/UserScript==

(function($, undefined) { // jQuery noConflict wrapper
    'use strict';

    // --- CONFIGURATION ---
    const newCustomEmojis = [
        // Emojis anteriores que se conservan (Mono original eliminado)
        { name: 'Ghost',  id: 'custom_face_ghost',  url: 'https://i.ibb.co/G4rcDxtr/5b17de15-3964-46ec-8af9-f5980940123b-removebg-preview.png' },
        { name: 'Dog',    id: 'custom_face_dog',    url: 'https://i.ibb.co/3mJvGWng/dog-face-removebg-preview.png' },

        // Nuevos emojis agregados
        { name: 'Monkey', id: 'custom_face_monkey_new', url: 'https://i.postimg.cc/mDkXk9Rs/monkey-face-removebg-preview.png' },
        { name: 'Demon', id: 'custom_face_demon', url: 'https://i.postimg.cc/7Y3ppgZs/smiling-face-with-horns-removebg-preview.png' },
        { name: 'Exploding Head', id: 'custom_face_exploding_head', url: 'https://emojiisland.com/cdn/shop/products/7_large.png' },
        { name: 'OMG Face', id: 'custom_face_omg', url: 'https://emojiisland.com/cdn/shop/products/OMG_Emoji_Icon_0cda9b05-20a8-47f0-b80f-df5c982e0963_large.png' },
        { name: 'Tears Face', id: 'custom_face_tears', url: 'https://emojiisland.com/cdn/shop/products/Tears_Emoji_Icon_2_large.png?v=1571606092' },
        { name: 'Pumpkin', id: 'custom_face_pumpkin', url: 'https://emojiisland.com/cdn/shop/products/Pumpkin_Emoji_Icon_169be5a5-3354-4573-b327-5d69e23e8458_large.png' },
        { name: 'Cold Face', id: 'custom_face_cold', url: 'https://emojiisland.com/cdn/shop/products/9_large.png' },
        { name: 'Hot Face', id: 'custom_face_hot', url: 'https://emojiisland.com/cdn/shop/products/8_large.png' },
        { name: 'Raised Eyebrow', id: 'custom_face_raised_eyebrow', url: 'https://i.ibb.co/v6xdzRnm/original-removebg-preview.png' },
        { name: 'Nerd Face', id: 'custom_face_nerd', url: 'https://emojiisland.com/cdn/shop/products/Nerd_Emoji_Icon_4ab932f8-9ec9-4180-8420-c74b84546f57_large.png' },
        { name: 'Poop Face', id: 'custom_face_poop', url: 'https://emojiisland.com/cdn/shop/products/Poop_Emoji_2_large.png?v=1571606092' }
    ];
    const customCategoryName = "Custom Faces";
    const knownExistingCategoryText = "FACE"; // O "EYE", "MOUTH". Se usa como ancla.
    const customCategoryMarkerAttribute = "data-custom-category-scripted";
    const customEmojiMarkerAttribute = "data-custom-emoji-scripted";
    // --- END CONFIGURATION ---

    let customCategoryAdded = false;
    let observer = null;

    function log(message, data) { console.log(`[Drawaria Custom Emojis v0.9.1] ${message}`, data || ''); }
    function warn(message, data) { console.warn(`[Drawaria Custom Emojis v0.9.1] ${message}`, data || ''); }
    function error(message, data) { console.error(`[Drawaria Custom Emojis v0.9.1] ${message}`, data || ''); }

    function cloneAndModifyAssetLi(emojiData, templateAssetLi) {
        if (!templateAssetLi) {
            error('No templateAssetLi provided for cloning!');
            const newItem = document.createElement('li');
            const img = document.createElement('img');
            newItem.title = emojiData.name; img.src = emojiData.url; img.alt = emojiData.name;
            img.className = 'asset'; img.draggable = false; img.style.objectFit = 'contain';
            newItem.appendChild(img);
            newItem.setAttribute(customEmojiMarkerAttribute, 'true');
            newItem.setAttribute('data-custom-emoji-id', emojiData.id);
            newItem.addEventListener('click', (event) => {
                event.stopPropagation(); event.preventDefault();
                handleCustomEmojiClick(emojiData, newItem);
            });
            return newItem;
        }
        const newItem = templateAssetLi.cloneNode(true);
        newItem.title = emojiData.name;
        const img = newItem.querySelector('img');
        if (img) {
            img.src = emojiData.url; img.alt = emojiData.name;
            if (!img.style.objectFit) img.style.objectFit = 'contain';
            if (img.draggable === undefined) img.draggable = false;
            if (img.srcset) img.srcset = '';
        } else {
            warn('Template asset li did not contain an img. Creating one.');
            const newImg = document.createElement('img');
            newImg.src = emojiData.url; newImg.alt = emojiData.name; newImg.className = 'asset';
            newImg.draggable = false; newImg.style.objectFit = 'contain';
            newItem.innerHTML = ''; newItem.appendChild(newImg);
        }
        newItem.id = '';
        newItem.setAttribute(customEmojiMarkerAttribute, 'true');
        newItem.setAttribute('data-custom-emoji-id', emojiData.id);
        newItem.onclick = null;
        newItem.addEventListener('click', (event) => {
            event.stopPropagation(); event.preventDefault();
            handleCustomEmojiClick(emojiData, newItem);
        });
        return newItem;
    }

    function cloneAndModifyCategoryHeaderLi(categoryName, templateCategoryLi) {
        if (!templateCategoryLi) {
            error('No templateCategoryLi provided for cloning!');
            const newHeader = document.createElement('li');
            newHeader.className = 'category'; newHeader.textContent = categoryName;
            newHeader.setAttribute(customCategoryMarkerAttribute, 'true');
            return newHeader;
        }
        const newHeader = templateCategoryLi.cloneNode(true);
        newHeader.textContent = categoryName; newHeader.id = '';
        newHeader.setAttribute(customCategoryMarkerAttribute, 'true');
        return newHeader;
    }

    function handleCustomEmojiClick(emojiData, clickedLiElement) {
        log(`Clicked ${emojiData.name}, URL: ${emojiData.url}`);

        const avatarPreviewImg = document.querySelector('.Panel.preview img.AvatarImage, .Panel.preview img');
        if (avatarPreviewImg) {
            avatarPreviewImg.src = emojiData.url;
            log('Avatar preview image updated.');
        } else {
            warn('Avatar preview image element not found.');
        }

        if (window.ACCOUNT_AVATARSAVE && typeof window.ACCOUNT_AVATARSAVE === 'object') {
            window.ACCOUNT_AVATARSAVE.face = emojiData.id;
            log('Attempted to update ACCOUNT_AVATARSAVE.face to:', window.ACCOUNT_AVATARSAVE.face);
            log('Current ACCOUNT_AVATARSAVE:', JSON.stringify(window.ACCOUNT_AVATARSAVE));
        } else {
            warn('window.ACCOUNT_AVATARSAVE not found or not an object. Saving might fail or use default face.');
            if (!window.ACCOUNT_AVATARSAVE) {
                window.ACCOUNT_AVATARSAVE = { face: emojiData.id, eye: 0, mouth: 0, acc: 0 };
                warn('Initialized a basic ACCOUNT_AVATARSAVE. This might be incorrect.');
            }
        }

        const parentUl = clickedLiElement.closest('ul');
        if (parentUl) {
            parentUl.querySelectorAll('li.active').forEach(activeLi => activeLi.classList.remove('active'));
        }
        clickedLiElement.classList.add('active');

        log('Fetching image data to prepare for save...');
        fetch(emojiData.url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = function() {
                    let base64ImageData = reader.result;
                    if (blob.type && blob.type !== 'image/jpeg') {
                        log(`Image type is ${blob.type}. Using as is or converting for backend if needed.`);
                    } else {
                        base64ImageData = reader.result.replace(/^data:[^;]+;/, 'data:image/jpeg;');
                    }
                    log('Image data fetched and converted to base64. Triggering save.');
                    triggerSaveWithImageData(base64ImageData);
                };
                reader.onerror = function() {
                    error('FileReader failed to read image blob.');
                    alert('Error preparing image for save. Could not read image data.');
                };
                reader.readAsDataURL(blob);
            })
            .catch(err => {
                error('Failed to fetch or process custom emoji image for saving.', err);
                alert(`Error fetching image: ${err.message}`);
            });
    }

    function triggerSaveWithImageData(base64ImageData) {
        if (!window.LOGGEDIN) {
            alert("Error: You must be logged in to save your avatar.");
            warn("Save attempt aborted: User not logged in.");
            return;
        }
        if (!window.ACCOUNT_AVATARSAVE) {
            alert("Error: Avatar configuration is missing. Cannot save.");
            warn("Save attempt aborted: ACCOUNT_AVATARSAVE is null/undefined.");
            return;
        }

        log('Saving avatar with custom image data...');
        const console_log_save_status = (text) => log(`Save Status: ${text}`);
        console_log_save_status('Uploading...');

        $.ajax({
            url:  LOGGEDIN ? '/saveavatar' : '/uploadavatarimage',
            type: 'POST',
            data: {
                'avatarsave_builder': JSON.stringify(ACCOUNT_AVATARSAVE),
                'imagedata': base64ImageData,
                'fromeditor': true
            },
            xhr: ()=> {
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
            console_log_save_status('Saving...');
            log('Avatar data sent, server responded with cache key:', data);
            fetch(`${location.origin}/avatar/cache/${data}.jpg`, { method: 'GET', mode: 'cors', cache: 'reload' })
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to fetch cached avatar: ${response.statusText}`);
                    return response.blob();
                })
                .then(() => {
                    console_log_save_status('Save OK!');
                    log('Avatar saved and cache confirmed! Redirecting to origin.');
                    location.href = new URL(location.href).origin;
                })
                .catch(err => {
                    error('Error confirming saved avatar from cache.', err);
                    console_log_save_status('Save attempt finished, but cache confirmation failed.');
                    alert(`Avatar might be saved, but confirmation failed: ${err.message}. Please check your profile.`);
                });
        }).fail((jqXHR, textStatus, errorThrown) => {
            error('$.ajax save request failed.', { status: textStatus, error: errorThrown, response: jqXHR.responseText });
            console_log_save_status('Upload Image');
            alert(`Failed to save avatar: ${errorThrown || textStatus}. Server response: ${jqXHR.responseText}`);
        });
    }

    function findTargetListAndTemplates() {
        const allElements = document.querySelectorAll('body *');
        let knownCategoryElement = null;
        for (let el of allElements) {
            if (el.childNodes.length === 1 && el.firstChild.nodeType === Node.TEXT_NODE && el.firstChild.textContent.trim().toUpperCase() === knownExistingCategoryText) {
                knownCategoryElement = el; break;
            }
            if (el.textContent.trim().toUpperCase() === knownExistingCategoryText && el.children.length < 2) {
                if (['LI', 'DIV', 'SPAN', 'H3', 'H4', 'P'].includes(el.tagName)) {
                    knownCategoryElement = el; break;
                }
            }
        }
        if (!knownCategoryElement) return null;
        log(`Found element containing "${knownExistingCategoryText}":`, knownCategoryElement);
        let targetListElement = knownCategoryElement.closest('ul');
        if (!targetListElement) {
            if (knownCategoryElement.tagName === 'LI' && knownCategoryElement.parentElement.tagName === 'UL') {
                targetListElement = knownCategoryElement.parentElement;
            } else {
                let parentCandidate = knownCategoryElement.parentElement; let searchDepth = 0;
                while (parentCandidate && searchDepth < 5 && !targetListElement) {
                    targetListElement = parentCandidate.querySelector('ul');
                    if(targetListElement && targetListElement.querySelector('li.category')) break;
                    targetListElement = null; parentCandidate = parentCandidate.parentElement; searchDepth++;
                }
            }
        }
        if (!targetListElement) { warn('Could not find the main <ul> list.'); return null; }
        log('Found target <ul> list element:', targetListElement);
        const templateCategoryLi = targetListElement.querySelector('li.category');
        const templateAssetLi = targetListElement.querySelector('li:not(.category)');
        if (!templateCategoryLi) { warn('Template for category header (li.category) not found.'); return null; }
        if (!templateAssetLi) { warn('Template for asset item (li:not(.category)) not found.'); return null; }
        log('Found templates: Category LI, Asset LI', { templateCategoryLi, templateAssetLi });
        return { targetListElement, templateCategoryLi, templateAssetLi };
    }

    function attemptToAddCustomEmojis() {
        if (customCategoryAdded) {
            if (observer) observer.disconnect();
            log('Custom category already added. Observer disconnected.');
            return true;
        }
        const result = findTargetListAndTemplates();
        if (!result) return false;
        const { targetListElement, templateCategoryLi, templateAssetLi } = result;
        if (targetListElement.querySelector(`li[${customCategoryMarkerAttribute}="true"]`)) {
            log('Custom category already exists in the list. Finalizing.');
            customCategoryAdded = true; if (observer) observer.disconnect(); return true;
        }
        log('Adding new category and emojis to the list.');
        const newHeader = cloneAndModifyCategoryHeaderLi(customCategoryName, templateCategoryLi);
        targetListElement.appendChild(newHeader);
        newCustomEmojis.forEach(emoji => {
            const newLi = cloneAndModifyAssetLi(emoji, templateAssetLi);
            targetListElement.appendChild(newLi);
        });
        log(`Successfully added "${customCategoryName}" category with ${newCustomEmojis.length} emojis.`);
        customCategoryAdded = true; if (observer) observer.disconnect();
        return true;
    }

    function startObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver((mutationsList, obs) => {
            if (attemptToAddCustomEmojis()) {
                obs.disconnect(); observer = null;
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        log('MutationObserver started.');
        setTimeout(() => {
            if (!customCategoryAdded) {
                log("Initial attempt to add emojis after a longer delay."); // Increased delay for initial attempt
                attemptToAddCustomEmojis();
            }
        }, 2500); // Increased delay for initial attempt
    }

    function onPageReady(callback) {
        if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
            setTimeout(callback, 750);
        } else {
            document.addEventListener('DOMContentLoaded', () => setTimeout(callback, 1000));
            window.addEventListener('load', () => setTimeout(callback, 2000));
        }
    }

    if (typeof $ === 'undefined') {
        error("jQuery is not loaded. Script will not function correctly. Ensure @require is working.");
        return;
    }

    $(() => {
        log("jQuery ready. Script starting main logic.");
        onPageReady(() => {
            if (window.location.pathname.includes('/avatar/builder')) {
                log('Avatar builder page detected. Initializing script.');
                if (typeof window.LOGGEDIN === 'undefined') {
                    warn('window.LOGGEDIN is undefined. Saving will likely fail or be treated as guest.');
                }
                if (typeof window.ACCOUNT_AVATARSAVE === 'undefined') {
                    warn('window.ACCOUNT_AVATARSAVE is undefined. This variable is needed for saving existing avatar parts.');
                }
                startObserver();
            } else {
                log('Not on avatar builder page. Script will not actively modify DOM.');
            }
        });
    });

})(window.jQuery);