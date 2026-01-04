// ==UserScript==
// @name         Talkomatic Visual+
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Makes Talkomatic look better and allows you to have a Imagery background
// @match        https://classic.talkomatic.co/room.html?roomId=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540200/Talkomatic%20Visual%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/540200/Talkomatic%20Visual%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';
document.body.style.backgroundColor = '#000000fe';
    function setFullscreenBackground(src) {
        const img = document.createElement('img');
        img.src = src;
        Object.assign(img.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: '-2147483647',
            pointerEvents: 'none'
        });
        document.body.appendChild(img);
        return img;
    }

    // === Persistent Toggle Flag ===
    let fxEnabled = localStorage.getItem('talkomatic-fx') !== 'false';
    let bgImageEl = null;

    // === Load saved background ===
    const savedImage = localStorage.getItem('talkomatic-background');
    if (savedImage && fxEnabled) {
        bgImageEl = setFullscreenBackground(savedImage);
    }

    // === Styling loop ===
    setInterval(() => {
        if (!fxEnabled) return;

        document.querySelectorAll('*').forEach(el => {
            const tag = el.tagName.toUpperCase();
            const style = getComputedStyle(el);
            const display = style.display;

            const hasText = [...el.childNodes].some(
                n => n.nodeType === 3 && n.textContent.trim().length > 0
            );

            el.style.boxShadow = 'none';
            el.style.textShadow = hasText ? '0 0 3px black, 0 0 6px black' : 'none';

            if (['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(tag)) {
                el.style.boxShadow = '0 0 7px rgba(0,0,0,0.9)';
            }
        });

        document.querySelectorAll('*:not(button):not(input):not(textarea):not(.chat-row > *):not(.bg-upload-ignore)').forEach(el => {
            const bg = getComputedStyle(el).backgroundColor;
            if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') return;
            if (!el.dataset.originalBg) {
                el.dataset.originalBg = bg;
            }
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                const [_, r, g, b] = match;
                el.style.backgroundColor = `rgba(${r},${g},${b},0.4)`;
            }
        });

        document.querySelectorAll('.chat-row').forEach(row => {
            [...row.children].forEach(child => {
                child.style.opacity = '0.7';
            });
        });

        document.querySelectorAll('input[type="text"], textarea').forEach(el => {
            el.style.backgroundColor = 'transparent';
            el.style.color = 'inherit';
            el.style.border = '1px solid black';
            el.style.boxShadow = '0 0 5px black';
            el.style.caretColor = 'black';
        });
    }, 50);

    // === Upload button ===
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = 'image/*';
    uploadInput.style.display = 'none';
    uploadInput.id = 'bg-upload-button';

    const uploadButton = document.createElement('label');
    uploadButton.setAttribute('for', 'bg-upload-button');
    uploadButton.textContent = '📁 Upload Background';
    uploadButton.classList.add('bg-upload-ignore');
    Object.assign(uploadButton.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: '9999',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        padding: '6px 14px',
        background: '#222',
        color: '#fff',
        border: '1px solid orange',
        borderRadius: '4px',
        cursor: 'pointer'
    });

    document.body.append(uploadInput, uploadButton);

    uploadInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const dataURL = event.target.result;
            localStorage.setItem('talkomatic-background', dataURL);

            if (fxEnabled) {
                if (bgImageEl) bgImageEl.remove();
                bgImageEl = setFullscreenBackground(dataURL);
            }
        };
        reader.readAsDataURL(file);
    });

    // === Toggle FX button ===
    const toggleFX = document.createElement('button');
    toggleFX.textContent = fxEnabled ? '🌓 Disable Visual FX' : '🌕 Enable Visual FX';
    toggleFX.classList.add('bg-upload-ignore');
    Object.assign(toggleFX.style, {
        position: 'fixed',
        bottom: '10px',
        left: '180px',
        zIndex: '9999',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        padding: '6px 14px',
        background: '#222',
        color: '#fff',
        border: '1px solid orange',
        borderRadius: '4px',
        cursor: 'pointer'
    });

    toggleFX.onclick = () => {
        fxEnabled = !fxEnabled;
        localStorage.setItem('talkomatic-fx', fxEnabled);
        toggleFX.textContent = fxEnabled ? '🌓 Disable Visual FX' : '🌕 Enable Visual FX';

        if (!fxEnabled) {
            document.querySelectorAll('*').forEach(el => {
                if (!el.classList.contains('bg-upload-ignore')) {
                    el.style.boxShadow = '';
                    el.style.textShadow = '';
                    el.style.opacity = '';
                    if (el.dataset.originalBg) {
                        el.style.backgroundColor = el.dataset.originalBg;
                    }
                }
            });
            document.querySelectorAll('input[type="text"], textarea').forEach(el => {
                el.style.backgroundColor = '';
                el.style.color = '';
                el.style.border = '';
                el.style.boxShadow = '';
                el.style.caretColor = '';
            });
            if (bgImageEl) bgImageEl.remove();
        } else {
            const bg = localStorage.getItem('talkomatic-background');
            if (bg) bgImageEl = setFullscreenBackground(bg);
        }
    };

    document.body.append(toggleFX);
})();
