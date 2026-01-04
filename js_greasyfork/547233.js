// ==UserScript==
// @name         Twitter Image Magnifying Glass
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Image magnifier for Twitter/X. Hold hotkey Ctrl+Alt to activate, press any key to disable. Hover over images to view them with magnifying glass. Features adjustable size, zoom level, and scroll wheel zoom control.
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4Ii8+PHBhdGggZD0ibTIxIDIxLTQuMzUtNC4zNSIvPjwvc3ZnPg==
// @license      MIT
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/547233/Twitter%20Image%20Magnifying%20Glass.user.js
// @updateURL https://update.greasyfork.org/scripts/547233/Twitter%20Image%20Magnifying%20Glass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // State variables
    let magnifier = null;
    let currentImage = null;
    let magnifierActive = false;

    // Load saved settings
    let savedHotkey = GM_getValue('magnifier_hotkey', 'ctrl+alt');
    let savedSize = GM_getValue('magnifier_size', 200);
    let savedZoom = GM_getValue('magnifier_zoom', 3);

    // Utility functions
    const createSliderModal = (title, icon, currentValue, unit, min, max, step, tickStep, majorTickStep) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 999999; display: flex;
            align-items: center; justify-content: center; font-family: Arial, sans-serif;
        `;

        overlay.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 400px; width: 90%;">
                <h3 style="margin: 0 0 20px 0; text-align: center; color: #333;">${icon} ${title}</h3>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; color: #555; font-weight: bold;">
                        ${title.split(' ')[1]}: <span id="valueDisplay">${currentValue}</span>${unit}
                    </label>
                    <div style="position: relative;">
                        <input type="range" id="slider" min="${min}" max="${max}" step="${step}" value="${currentValue}" 
                               style="width: 100%; height: 8px; border-radius: 5px; background: #ddd; outline: none;">
                        <div id="ticks" style="position: relative; height: 20px; margin-top: 5px;"></div>
                    </div>
                </div>
                <div style="margin-bottom: 20px; font-size: 12px; color: #666; text-align: center;">
                    Click tick marks for quick ${title.toLowerCase()} • ${min}${unit} to ${max}${unit}
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="save" style="background: #1da1f2; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px;">Save</button>
                    <button id="cancel" style="background: #ccc; color: #333; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px;">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const slider = overlay.querySelector('#slider');
        const valueDisplay = overlay.querySelector('#valueDisplay');
        const ticksContainer = overlay.querySelector('#ticks');

        // Create ticks
        for (let i = min; i <= max; i += tickStep) {
            const position = ((i - min) / (max - min)) * 100;
            const isMajor = majorTickStep && i % majorTickStep === 0;
            const isWhole = tickStep >= 1 ? true : i % 1 === 0;

            const tick = document.createElement('div');
            tick.style.cssText = `
                position: absolute; left: ${position}%; top: 0; width: 2px;
                height: ${isMajor ? '12px' : isWhole ? '10px' : '6px'};
                background: ${isMajor ? '#666' : isWhole ? '#666' : '#bbb'};
                cursor: pointer; transform: translateX(-50%);
            `;
            tick.addEventListener('click', () => { slider.value = i; valueDisplay.textContent = i; });
            ticksContainer.appendChild(tick);

            // Add labels for major ticks
            if (isMajor && (i === min || i % majorTickStep === 0)) {
                const label = document.createElement('div');
                label.style.cssText = `
                    position: absolute; left: ${position}%; top: 14px; font-size: 10px;
                    color: #666; transform: translateX(-50%); cursor: pointer;
                `;
                label.textContent = i + unit;
                label.addEventListener('click', () => { slider.value = i; valueDisplay.textContent = i; });
                ticksContainer.appendChild(label);
            }
        }

        slider.addEventListener('input', () => valueDisplay.textContent = slider.value);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) document.body.removeChild(overlay); });

        return { overlay, slider, saveBtn: overlay.querySelector('#save'), cancelBtn: overlay.querySelector('#cancel') };
    };

    // Menu commands
    GM_registerMenuCommand('Configure Hotkey', () => {
        const validKeys = ['alt', 'ctrl', 'shift', 'ctrl+alt', 'ctrl+shift', 'alt+shift'];
        let input, error = false;

        do {
            input = prompt(`Enter magnifier activation hotkey:${error ? '\n\n❌ INVALID INPUT! Please use one of the options below.' : ''}\n\n📋 Valid options:\n• ${validKeys.join('\n• ')}\n\nCurrent hotkey: ${savedHotkey}`, savedHotkey);
            if (input === null) return;
            input = input.trim().toLowerCase();
            error = !validKeys.includes(input);
        } while (error);

        savedHotkey = input;
        GM_setValue('magnifier_hotkey', savedHotkey);
        alert(`✅ Hotkey set to: ${savedHotkey.toUpperCase().replace('+', ' + ')}\n\nPlease refresh the page for changes to take effect.`);
    });

    GM_registerMenuCommand('Configure Size', () => {
        const { overlay, slider, saveBtn, cancelBtn } = createSliderModal('Magnifier Size', '🔍', savedSize, 'px', 50, 2000, 1, 50, 200);
        saveBtn.addEventListener('click', () => {
            savedSize = parseInt(slider.value);
            GM_setValue('magnifier_size', savedSize);
            document.body.removeChild(overlay);
            alert(`✅ Magnifier size set to: ${savedSize}px\n\nPlease refresh the page for changes to take effect.`);
        });
        cancelBtn.addEventListener('click', () => document.body.removeChild(overlay));
    });

    GM_registerMenuCommand('Configure Zoom', () => {
        const { overlay, slider, saveBtn, cancelBtn } = createSliderModal('Zoom Level', '🔎', savedZoom, 'x', 1, 20, 0.5, 0.5, 2);
        saveBtn.addEventListener('click', () => {
            savedZoom = parseFloat(slider.value);
            GM_setValue('magnifier_zoom', savedZoom);
            document.body.removeChild(overlay);
            alert(`✅ Zoom level set to: ${savedZoom}x\n\nPlease refresh the page for changes to take effect.`);
        });
        cancelBtn.addEventListener('click', () => document.body.removeChild(overlay));
    });

    // Parse hotkey settings
    const keySettings = (() => {
        const keyMap = {
            'alt': { alt: true, ctrl: false, shift: false },
            'ctrl': { alt: false, ctrl: true, shift: false },
            'shift': { alt: false, ctrl: false, shift: true },
            'ctrl+alt': { alt: true, ctrl: true, shift: false },
            'ctrl+shift': { alt: false, ctrl: true, shift: true },
            'alt+shift': { alt: true, ctrl: false, shift: true }
        };
        return keyMap[savedHotkey] || { alt: true, ctrl: true, shift: false };
    })();

    // Core functions
    const createMagnifier = () => {
        const mag = document.createElement('div');
        mag.id = 'image-magnifier';
        mag.style.cssText = `
            position: fixed; width: ${savedSize}px; height: ${savedSize}px;
            border: 3px solid #000; border-radius: 50%; background: #fff;
            background-repeat: no-repeat; box-shadow: 0 0 20px rgba(0,0,0,0.5);
            pointer-events: none; z-index: 10000; display: none; transition: opacity 0.1s ease;
        `;
        document.body.appendChild(mag);
        return mag;
    };

    const updateMagnifier = (e, img) => {
        if (!magnifier || !img) return;
        
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const magSize = savedSize / 2;

        // Use natural dimensions for proper aspect ratio
        const bgWidth = (img.naturalWidth || rect.width) * savedZoom;
        const bgHeight = (img.naturalHeight || rect.height) * savedZoom;
        
        // Calculate scale factors to map mouse position correctly
        const scaleX = bgWidth / rect.width;
        const scaleY = bgHeight / rect.height;

        magnifier.style.backgroundImage = `url('${img.src}')`;
        magnifier.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
        magnifier.style.backgroundPosition = `${-((x * scaleX) - magSize)}px ${-((y * scaleY) - magSize)}px`;
        magnifier.style.left = `${e.clientX - magSize}px`;
        magnifier.style.top = `${e.clientY - magSize}px`;
        magnifier.style.display = 'block';
    };

    const hideMagnifier = () => {
        if (magnifier) {
            magnifier.style.display = 'none';
        }
    };
    const isImage = (el) => {
        if (!el) return false;
        
        if (el.tagName === 'IMG') return true;
        if (el.style?.backgroundImage && el.style.backgroundImage !== 'none') return true;
        if (el.getAttribute('data-testid') === 'tweetPhoto') return true;
        if (el.classList.contains('css-9pa8cd')) return true;
        if (el.querySelector('img')) return true;
        
        return false;
    };
    const isActivationKeyPressed = (e) => e.altKey === keySettings.alt && e.ctrlKey === keySettings.ctrl && e.shiftKey === keySettings.shift;

    // Event listeners
    document.addEventListener('keydown', (e) => {
        if (isActivationKeyPressed(e) && !magnifierActive) {
            magnifierActive = true;
            if (!magnifier) magnifier = createMagnifier();
        } else if (magnifierActive && !isActivationKeyPressed(e)) {
            magnifierActive = false;
            currentImage = null;
            hideMagnifier();
        }
    }, { passive: true });

    document.addEventListener('click', (e) => {
        if (magnifierActive) {
            magnifierActive = false;
            currentImage = null;
            hideMagnifier();
        }
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
        if (!magnifierActive) return;
        
        const target = e.target;
        if (isImage(target)) {
            currentImage = target;
            updateMagnifier(e, target);
        } else {
            currentImage = null;
            hideMagnifier();
        }
    });

    document.addEventListener('mouseleave', () => {
        if (magnifierActive) {
            currentImage = null;
            hideMagnifier();
        }
    }, { passive: true });

    document.addEventListener('wheel', (e) => {
        if (!magnifierActive || !currentImage) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        savedZoom = Math.max(0.1, Math.min(20, savedZoom + (e.deltaY > 0 ? -0.1 : 0.1)));
        GM_setValue('magnifier_zoom', savedZoom);
        updateMagnifier(e, currentImage);

        // Show zoom indicator
        let indicator = document.getElementById('zoomIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'zoomIndicator';
            indicator.style.cssText = `
                position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.8);
                color: white; padding: 8px 12px; border-radius: 4px; font-family: Arial, sans-serif;
                font-size: 14px; z-index: 10001; pointer-events: none; will-change: opacity;
            `;
            document.body.appendChild(indicator);
        }
        indicator.textContent = `Zoom: ${savedZoom.toFixed(1)}x`;
        indicator.style.display = 'block';
        
        clearTimeout(window.zoomIndicatorTimeout);
        window.zoomIndicatorTimeout = setTimeout(() => indicator.style.display = 'none', 1000);
    }, { passive: false });

    // Load message
    console.log(`🔍 Twitter Image Magnifier loaded! Press ${savedHotkey.toUpperCase().replace('+', ' + ')} to activate.`);
    console.log(`💡 Works on Twitter/X images. Right-click Tampermonkey icon → Configure settings.`);
    console.log(`🎯 Scroll wheel adjusts zoom when magnifier is active.`);

})();
