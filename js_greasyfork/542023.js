// ==UserScript==
// @name         Grow a Garden Website Modifier Hider
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide Extra Modifier Buttons for a Cleaner View On The Grow a Garden Calculator Website!
// @author       TronGamerYT
// @match        https://www.growagardencalculator.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542023/Grow%20a%20Garden%20Website%20Modifier%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/542023/Grow%20a%20Garden%20Website%20Modifier%20Hider.meta.js
// ==/UserScript==

// You’re free to use, share, and modify this script — just keep my name on it ✌️

(function() {
    'use strict';

    const STORAGE_KEY = 'hiddenGrowGardenFruits';
    // Only target fruit mutation buttons | Add new button class below if needed
const BUTTON_SELECTOR = 'button.modifier-button';

    function getSavedHidden() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveHidden(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function hideButton(btn) {
        btn.style.display = 'none';
    }

    function showButton(btn) {
        btn.style.display = '';
    }

    function addHideOverlay(button) {
        if (button.querySelector('.tm-hide-overlay')) return;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.className = 'tm-hide-overlay';
        overlay.textContent = 'Hide';
        Object.assign(overlay.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#222',
            color: '#fff',
            border: '1px solid #444',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: '10'
        });

        button.appendChild(overlay);

        button.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'auto';
        });
        button.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        });

        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const label = button.textContent.trim();
            const hiddenList = getSavedHidden();
            if (!hiddenList.includes(label)) {
                hiddenList.push(label);
                saveHidden(hiddenList);
            }
            hideButton(button);
        });
    }

    function processButtons() {
        const hiddenList = getSavedHidden();
        const buttons = document.querySelectorAll(BUTTON_SELECTOR);

        buttons.forEach(btn => {
            const label = btn.textContent.trim();
            if (hiddenList.includes(label)) {
                hideButton(btn);
            } else {
                showButton(btn);
                addHideOverlay(btn);
            }
        });
    }

    function createRestoreUI() {
        const box = document.createElement('div');
        box.textContent = '🔄 Restore Buttons';
        Object.assign(box.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#28a745',
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 10000,
            fontSize: '42px',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        });

        box.addEventListener('click', () => {
            saveHidden([]);
            processButtons();
        });

        document.body.appendChild(box);
    }

    setInterval(processButtons, 1000);
    window.addEventListener('load', () => setTimeout(createRestoreUI, 1500));
})();
