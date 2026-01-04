// ==UserScript==
// @name         Useless Things Series: Brightness Overlay with Slider
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Centralized brightness overlay with unified control panel. Press Alt+B to toggle everything.
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/488174/Useless%20Things%20Series%3A%20Brightness%20Overlay%20with%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/488174/Useless%20Things%20Series%3A%20Brightness%20Overlay%20with%20Slider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let controlsVisible = false;
    let autoHideTimeout = null;

    const DEFAULT_BRIGHTNESS = 50;
    const DEFAULT_COLOR = '#808080';
    const AUTO_HIDE_DELAY = 8000;

    const savedBrightness = localStorage.getItem('brightness');
    const savedColor = localStorage.getItem('color');
    const savedOverlayState = localStorage.getItem('overlayVisible');
    let currentBrightness = savedBrightness ? parseInt(savedBrightness) : DEFAULT_BRIGHTNESS;
    let currentColor = savedColor || DEFAULT_COLOR;
    let overlayVisible = savedOverlayState === 'true';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: none;
        pointer-events: none;
        transition: opacity 0.4s ease, background-color 0.3s ease;
        opacity: 0;
    `;

    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid rgba(255, 140, 0, 0.5);
        border-radius: 12px;
        padding: 18px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        display: none;
        width: 380px;
        max-height: 70vh;
        overflow-y: auto;
        pointer-events: auto;
        opacity: 0;
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(16px);
        transform: scale(0.95);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        user-select: none;
        will-change: transform;
    `;

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 2px solid rgba(255, 140, 0, 0.5);';
    
    const title = document.createElement('div');
    title.textContent = 'Brightness Control';
    title.style.cssText = 'font-weight: bold; font-size: 18px; background: linear-gradient(135deg, #FF8C00, #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.title = 'Close Panel';
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: #999;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        border-radius: 4px;
    `;
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.color = '#fff';
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.color = '#999';
        closeBtn.style.background = 'transparent';
    });
    closeBtn.addEventListener('click', hidePanel);
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    controlPanel.appendChild(header);

    const valueDisplay = document.createElement('div');
    valueDisplay.textContent = `${currentBrightness}%`;
    valueDisplay.style.cssText = `
        color: #fff;
        font-size: 48px;
        font-weight: 800;
        text-align: center;
        margin: 15px 0;
        text-shadow: 0 2px 10px rgba(255, 140, 0, 0.4);
        letter-spacing: 2px;
    `;
    controlPanel.appendChild(valueDisplay);

    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = `
        margin: 20px 0;
        position: relative;
    `;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = currentBrightness;
    slider.style.cssText = `
        width: 100%;
        height: 10px;
        background: linear-gradient(to right, #1a1a1a, #ffffff);
        border-radius: 8px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
    `;

    const style = document.createElement('style');
    style.textContent = `
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #FF8C00, #FFA500);
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(255, 140, 0, 0.4);
            transition: transform 0.2s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(255, 140, 0, 0.6);
        }
        input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #FF8C00, #FFA500);
            cursor: pointer;
            border-radius: 50%;
            border: none;
            box-shadow: 0 2px 8px rgba(255, 140, 0, 0.4);
            transition: transform 0.2s ease;
        }
        input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(255, 140, 0, 0.6);
        }
        select option {
            background: #2a2a2a;
            color: #ffffff;
        }
    `;
    document.head.appendChild(style);

    sliderContainer.appendChild(slider);
    controlPanel.appendChild(sliderContainer);

    const presetsLabel = document.createElement('div');
    presetsLabel.textContent = 'Quick Presets';
    presetsLabel.style.cssText = `
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        font-weight: 600;
        margin-top: 20px;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
    `;
    controlPanel.appendChild(presetsLabel);

    const presetContainer = document.createElement('div');
    presetContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: space-between;
        margin-bottom: 20px;
    `;

    const presets = [
        { label: '25%', value: 25 },
        { label: '50%', value: 50 },
        { label: '75%', value: 75 },
        { label: '100%', value: 100 }
    ];

    presets.forEach(preset => {
        const btn = document.createElement('button');
        btn.textContent = preset.label;
        btn.style.cssText = `
            flex: 1;
            padding: 10px 16px;
            background: linear-gradient(135deg, rgba(255, 140, 0, 0.2), rgba(255, 165, 0, 0.1));
            color: #fff;
            border: 2px solid rgba(255, 140, 0, 0.3);
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
        `;
        btn.onmouseover = () => {
            btn.style.background = 'linear-gradient(135deg, #FF8C00, #FFA500)';
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.4)';
        };
        btn.onmouseout = () => {
            btn.style.background = 'linear-gradient(135deg, rgba(255, 140, 0, 0.2), rgba(255, 165, 0, 0.1))';
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        };
        btn.onclick = () => {
            slider.value = preset.value;
            updateOverlay(preset.value, colorPicker.value);
            resetAutoHideTimeout();
        };
        presetContainer.appendChild(btn);
    });
    controlPanel.appendChild(presetContainer);

    const colorLabel = document.createElement('div');
    colorLabel.textContent = 'Color Settings';
    colorLabel.style.cssText = `
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        font-weight: 600;
        margin-top: 15px;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
    `;
    controlPanel.appendChild(colorLabel);

    const colorContainer = document.createElement('div');
    colorContainer.style.cssText = `
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 15px;
    `;

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = currentColor;
    colorPicker.style.cssText = `
        width: 70px;
        height: 44px;
        border: 2px solid rgba(255, 140, 0, 0.3);
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
    `;
    colorPicker.onmouseover = () => {
        colorPicker.style.transform = 'scale(1.05)';
        colorPicker.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.3)';
        colorPicker.style.borderColor = 'rgba(255, 140, 0, 0.5)';
    };
    colorPicker.onmouseout = () => {
        colorPicker.style.transform = 'scale(1)';
        colorPicker.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        colorPicker.style.borderColor = 'rgba(255, 140, 0, 0.3)';
    };
    colorContainer.appendChild(colorPicker);

    const colorSelector = document.createElement('select');
    colorSelector.style.cssText = `
        flex: 1;
        padding: 12px 14px;
        font-size: 14px;
        border: 2px solid rgba(255, 140, 0, 0.3);
        border-radius: 8px;
        background: linear-gradient(135deg, rgba(50, 50, 60, 0.8), rgba(40, 40, 50, 0.8));
        color: #ffffff;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        font-weight: 600;
    `;
    colorSelector.onmouseover = () => {
        colorSelector.style.borderColor = 'rgba(255, 140, 0, 0.5)';
        colorSelector.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    };
    colorSelector.onmouseout = () => {
        colorSelector.style.borderColor = 'rgba(255, 140, 0, 0.3)';
        colorSelector.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    };

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Color Temperature Presets';
    colorSelector.appendChild(defaultOption);

    const colorOptions = [
        { name: 'Warm Peach', value: '#ffddad' },
        { name: 'Soft Pink', value: '#ffb6b9' },
        { name: 'Coral', value: '#fab1a0' },
        { name: 'Golden Yellow', value: '#f9cb40' },
        { name: 'Mint', value: '#a0e7e5' },
        { name: 'Cool Grey', value: '#cfd8dc' },
        { name: 'Sky Blue', value: '#82b1ff' },
        { name: 'Lavender', value: '#b388ff' },
        { name: 'Rose', value: '#f48fb1' },
        { name: 'Sage Green', value: '#81c784' }
    ];

    colorOptions.forEach(colorOption => {
        const option = document.createElement('option');
        option.value = colorOption.value;
        option.text = colorOption.name;
        colorSelector.appendChild(option);
    });
    colorContainer.appendChild(colorSelector);
    controlPanel.appendChild(colorContainer);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset to Default';
    resetButton.style.cssText = `
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, rgba(220, 50, 50, 0.9), rgba(180, 30, 30, 0.9));
        color: #fff;
        border: 2px solid rgba(220, 50, 50, 0.4);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        margin-top: 15px;
    `;
    resetButton.onmouseover = () => {
        resetButton.style.background = 'linear-gradient(135deg, rgba(255, 80, 80, 0.9), rgba(220, 50, 50, 0.9))';
        resetButton.style.transform = 'translateY(-2px)';
        resetButton.style.boxShadow = '0 4px 12px rgba(220, 50, 50, 0.4)';
    };
    resetButton.onmouseout = () => {
        resetButton.style.background = 'linear-gradient(135deg, rgba(220, 50, 50, 0.9), rgba(180, 30, 30, 0.9))';
        resetButton.style.transform = 'translateY(0)';
        resetButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    };
    resetButton.onclick = () => {
        slider.value = DEFAULT_BRIGHTNESS;
        colorPicker.value = DEFAULT_COLOR;
        colorSelector.value = '';
        updateOverlay(DEFAULT_BRIGHTNESS, DEFAULT_COLOR);
        resetAutoHideTimeout();
    };
    controlPanel.appendChild(resetButton);

    const shortcutHint = document.createElement('div');
    shortcutHint.textContent = 'Press Alt+B to toggle overlay';
    shortcutHint.style.cssText = `
        color: rgba(255, 255, 255, 0.4);
        font-size: 12px;
        text-align: center;
        margin-top: 15px;
        font-style: italic;
    `;
    controlPanel.appendChild(shortcutHint);

    // Create floating button
    const floatingButton = document.createElement('div');
    floatingButton.id = 'brightness-fab';
    floatingButton.textContent = '☀';
    floatingButton.title = 'Brightness Control (Click to toggle panel)';
    Object.assign(floatingButton.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#FF8C00',
        color: '#fff',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.1)',
        zIndex: '9998',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    });

    floatingButton.addEventListener('mouseenter', () => {
        floatingButton.style.transform = 'scale(1.1) rotate(90deg)';
        floatingButton.style.boxShadow = '0 6px 20px rgba(255, 140, 0, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.2)';
    });

    floatingButton.addEventListener('mouseleave', () => {
        floatingButton.style.transform = 'scale(1) rotate(0deg)';
        floatingButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.1)';
    });

    floatingButton.addEventListener('click', () => {
        if (controlPanel.style.display === 'none' || controlPanel.style.opacity === '0') {
            showPanel();
        } else {
            hidePanel();
        }
    });

    document.body.appendChild(overlay);
    document.body.appendChild(floatingButton);
    document.body.appendChild(controlPanel);

    updateOverlay(currentBrightness, currentColor);
    if (overlayVisible) {
        overlay.style.display = 'block';
        floatingButton.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }

    function updateOverlay(brightness, color) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const alpha = 1 - (brightness / 100);
        overlay.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        currentBrightness = brightness;
        currentColor = color;
        valueDisplay.textContent = `${brightness}%`;
        localStorage.setItem('brightness', brightness);
        localStorage.setItem('color', color);
    }

    function showEverything() {
        overlay.style.display = 'block';
        floatingButton.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        overlayVisible = true;
        localStorage.setItem('overlayVisible', 'true');
    }

    function hideEverything() {
        overlay.style.opacity = '0';
        floatingButton.style.transform = 'scale(0.8)';
        floatingButton.style.opacity = '0';
        hidePanel();
        setTimeout(() => {
            overlay.style.display = 'none';
            floatingButton.style.display = 'none';
            floatingButton.style.transform = 'scale(1)';
            floatingButton.style.opacity = '1';
        }, 300);
        overlayVisible = false;
        localStorage.setItem('overlayVisible', 'false');
    }

    function showPanel() {
        controlPanel.style.display = 'block';
        setTimeout(() => {
            controlPanel.style.opacity = '1';
            controlPanel.style.transform = 'scale(1)';
        }, 10);
        controlsVisible = true;
        resetAutoHideTimeout();
    }

    function hidePanel() {
        controlPanel.style.opacity = '0';
        controlPanel.style.transform = 'scale(0.95)';
        setTimeout(() => {
            controlPanel.style.display = 'none';
        }, 300);
        controlsVisible = false;
        clearTimeout(autoHideTimeout);
    }

    function toggleEverything() {
        if (overlayVisible) {
            hideEverything();
        } else {
            showEverything();
        }
    }

    function resetAutoHideTimeout() {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = setTimeout(() => {
            if (controlsVisible) {
                hidePanel();
            }
        }, AUTO_HIDE_DELAY);
    }

    slider.addEventListener('input', function() {
        updateOverlay(this.value, colorPicker.value);
        resetAutoHideTimeout();
    });

    colorPicker.addEventListener('input', function() {
        updateOverlay(slider.value, this.value);
        resetAutoHideTimeout();
    });

    colorSelector.addEventListener('change', function() {
        if (this.value) {
            colorPicker.value = this.value;
            updateOverlay(slider.value, this.value);
            resetAutoHideTimeout();
            setTimeout(() => this.value = '', 100);
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key.toLowerCase() === 'b') {
            event.preventDefault();
            toggleEverything();
        }
    });

    console.log('Brightness Overlay v5.0 loaded! Press Alt+B to toggle overlay, click floating button to open/close panel');

})();
