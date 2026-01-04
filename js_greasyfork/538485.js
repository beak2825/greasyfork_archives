// ==UserScript==
// @name         Torn Mug-Be-Gone (Desktop & Mobile)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Removes the Mug Button on your attack pages 
// @author       HeyItzWerty [3626448]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/538485/Torn%20Mug-Be-Gone%20%28Desktop%20%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538485/Torn%20Mug-Be-Gone%20%28Desktop%20%20Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SINGLETON CHECK ---
    if (document.getElementById('mug-be-gone-wrapper')) {
        return;
    }

    // --- Configuration ---
    const DEFAULT_TOP = '100px';
    const DEFAULT_LEFT = '20px';
    const WRAPPER_SIZE = 90; // The new, larger invisible touch area size in pixels
    const BUTTON_SIZE = 70;  // The visible button size in pixels

    // --- Create Elements ---
    const wrapper = document.createElement('div');
    wrapper.id = 'mug-be-gone-wrapper';

    const toggleButton = document.createElement('div');
    toggleButton.id = 'mug-toggle-button';
    toggleButton.textContent = 'Mug';

    wrapper.appendChild(toggleButton);
    document.body.appendChild(wrapper);

    // --- Retrieve Saved Settings ---
    let buttonTop = GM_getValue('buttonTop', DEFAULT_TOP);
    let buttonLeft = GM_getValue('buttonLeft', DEFAULT_LEFT);

    // --- ON-LOAD POSITION VALIDATION ---
    function validateAndSetPosition(topStr, leftStr) {
        let top = parseInt(topStr, 10);
        let left = parseInt(leftStr, 10);
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left < 0) left = 0;
        if (left > viewportWidth - WRAPPER_SIZE) left = viewportWidth - WRAPPER_SIZE;
        if (top < 0) top = 0;
        if (top > viewportHeight - WRAPPER_SIZE) top = viewportHeight - WRAPPER_SIZE;

        wrapper.style.top = `${top}px`;
        wrapper.style.left = `${left}px`;
    }
    validateAndSetPosition(buttonTop, buttonLeft);


    let mugDisabled = GM_getValue('mugDisabled', false);
    function updateButtonState() {
        if (mugDisabled) {
            toggleButton.classList.add('disabled');
            toggleButton.classList.remove('enabled');
        } else {
            toggleButton.classList.add('enabled');
            toggleButton.classList.remove('disabled');
        }
    }
    updateButtonState();

    // --- Unified Drag-and-Drop / Click Logic ---
    let isDragging = false;
    let hasDragged = false;
    let offsetX, offsetY;

    function dragStart(e) {
        if (e.type === 'touchstart') e.preventDefault();
        isDragging = true;
        hasDragged = false;
        wrapper.style.cursor = 'grabbing';

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        offsetX = clientX - wrapper.getBoundingClientRect().left;
        offsetY = clientY - wrapper.getBoundingClientRect().top;
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        hasDragged = true;

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const wrapperWidth = wrapper.offsetWidth;
        const wrapperHeight = wrapper.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newLeft = clientX - offsetX;
        let newTop = clientY - offsetY;

        if (newLeft < 0) newLeft = 0;
        if (newLeft > viewportWidth - wrapperWidth) newLeft = viewportWidth - wrapperWidth;
        if (newTop < 0) newTop = 0;
        if (newTop > viewportHeight - wrapperHeight) newTop = viewportHeight - wrapperHeight;

        wrapper.style.left = `${newLeft}px`;
        wrapper.style.top = `${newTop}px`;
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        wrapper.style.cursor = 'grab';

        if (hasDragged) {
            GM_setValue('buttonTop', wrapper.style.top);
            GM_setValue('buttonLeft', wrapper.style.left);
        } else {
            mugDisabled = !mugDisabled;
            GM_setValue('mugDisabled', mugDisabled);
            updateButtonState();
            findAndHideMugButton();
        }
    }

    wrapper.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    wrapper.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);

    // --- Function to Find and Hide the Mug Button ---
    function findAndHideMugButton() {
        if (!mugDisabled) return;
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
            if (btn.textContent.trim().toLowerCase() === 'mug') {
                btn.style.setProperty('display', 'none', 'important');
                break;
            }
        }
    }
    const observer = new MutationObserver(findAndHideMugButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Chat Command to Reset Button Position ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && typeof e.target.id === 'string' && e.target.id.includes('chat-input')) {
            if (e.target.value.trim() === '/mugreset') {
                e.preventDefault();
                e.target.value = '';
                validateAndSetPosition(DEFAULT_TOP, DEFAULT_LEFT);
                GM_setValue('buttonTop', DEFAULT_TOP);
                GM_setValue('buttonLeft', DEFAULT_LEFT);
                alert('Mug-Be-Gone button position has been reset!');
            }
        }
    });

    // --- Styles ---
    GM_addStyle(`
        #mug-be-gone-wrapper {
            position: fixed !important;
            width: ${WRAPPER_SIZE}px !important;
            height: ${WRAPPER_SIZE}px !important;
            z-index: 9999 !important;
            border-radius: 50% !important;
            cursor: grab !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background-color: transparent !important;
        }
        #mug-toggle-button {
            width: ${BUTTON_SIZE}px !important;
            height: ${BUTTON_SIZE}px !important; /* <-- THIS WAS THE TYPO. IT IS NOW FIXED. */
            background-color: #333 !important;
            color: white !important;
            border-radius: 50% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-size: 18px !important;
            font-weight: bold !important;
            box-shadow: 0 0 10px 3px transparent !important;
            transition: box-shadow 0.3s ease !important;
            user-select: none !important;
            -webkit-user-select: none !important;
        }
        #mug-toggle-button.enabled {
            box-shadow: 0 0 15px 5px #0f0 !important; /* Green */
        }
        #mug-toggle-button.disabled {
            box-shadow: 0 0 15px 5px #f00 !important; /* Red */
        }
    `);
})();