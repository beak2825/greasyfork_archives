// ==UserScript==
// @name         Global Redirect Menu for .io Games
// @namespace    http://tampermonkey.net/
// @version      1.1.000000001
// @description  Open a saved URL from any .io site with ` key, set it up by pressing # putting the website in and press go to save
// @author       EccentricCoder
// @match        *://*.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538718/Global%20Redirect%20Menu%20for%20io%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/538718/Global%20Redirect%20Menu%20for%20io%20Games.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'global_redirect_url';
    const MENU_ID = 'gm-io-redirect-menu';

    let menuVisible = false;
    const menu = document.createElement('div');
    menu.id = MENU_ID;
    Object.assign(menu.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0.9)',
        width: '320px',
        height: '180px',
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        border: '2px solid #00ccff',
        borderRadius: '12px',
        padding: '20px',
        zIndex: '99999',
        display: 'none',
        boxSizing: 'border-box',
        color: '#ffffff',
        fontFamily: 'Segoe UI, sans-serif',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        transition: 'opacity 0.25s ease, transform 0.25s ease'
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Paste URL here...';
    Object.assign(input.style, {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        marginBottom: '14px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '14px',
        outline: 'none'
    });

    const goButton = document.createElement('button');
    goButton.textContent = 'GO';
    Object.assign(goButton.style, {
        padding: '10px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#00ccff',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'background-color 0.2s ease, transform 0.2s ease'
    });

    goButton.onmouseover = () => goButton.style.backgroundColor = '#00aacc';
    goButton.onmouseout = () => goButton.style.backgroundColor = '#00ccff';
    goButton.onmousedown = () => goButton.style.transform = 'scale(0.95)';
    goButton.onmouseup = () => goButton.style.transform = 'scale(1)';

    menu.appendChild(input);
    menu.appendChild(goButton);
    document.body.appendChild(menu);

    function toggleMenu() {
        menuVisible = !menuVisible;
        if (menuVisible) {
            const saved = localStorage.getItem(STORAGE_KEY) || '';
            input.value = saved;
            menu.style.display = 'block';
            requestAnimationFrame(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'translate(-50%, -50%) scale(1)';
            });
            input.focus();
        } else {
            menu.style.opacity = '0';
            menu.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                if (!menuVisible) menu.style.display = 'none';
            }, 250);
        }
    }

    function saveAndClose() {
        let url = input.value.trim();
        if (!url) return;
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        localStorage.setItem(STORAGE_KEY, url);
        toggleMenu();
    }

    function launchSaved() {
        const url = localStorage.getItem(STORAGE_KEY);
        if (url) {
            window.open(url, '_blank');
        } else {
            console.warn('[GM-Redirect] No URL saved. Press # to set one.');
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === '#' || (e.shiftKey && e.key === '3')) {
            e.preventDefault();
            toggleMenu();
        } else if (e.key === '`') {
            e.preventDefault();
            launchSaved();
        } else if (e.key === 'Escape' && menuVisible) {
            toggleMenu();
        }
    });

    goButton.addEventListener('click', saveAndClose);

    document.addEventListener('click', (e) => {
        if (menuVisible && !menu.contains(e.target) && e.target !== goButton) {
            toggleMenu();
        }
    });
})();