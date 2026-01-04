// ==UserScript==
// @name         Instagram Volume Control Enhanced
// @namespace    https://greasyfork.org/fr/scripts/498295-instagram-volume-control-enhanced
// @version      1.8
// @description  Adjust default volume on Instagram videos with a user-friendly interface and persistent settings, now with a modern look
// @author       Manu OVG
// @match        https://www.instagram.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498295/Instagram%20Volume%20Control%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/498295/Instagram%20Volume%20Control%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_VOLUME = 0.3;
    const VOLUME_STORAGE_KEY = 'instagram_volume';
    const SPEED_STORAGE_KEY = 'instagram_speed';
    const DEFAULT_SPEED = 1.0;

    const getStoredValue = (key, defaultValue) => {
        const storedValue = localStorage.getItem(key);
        return storedValue !== null ? parseFloat(storedValue) : defaultValue;
    };

    const setStoredValue = (key, value) => {
        localStorage.setItem(key, value);
    };

    const setVolume = (volume) => {
        document.querySelectorAll('video').forEach(video => {
            video.volume = volume;
        });
    };

    const setSpeed = (speed) => {
        document.querySelectorAll('video').forEach(video => {
            video.playbackRate = speed;
        });
    };

    const createVolumeControlUI = () => {
        const controlContainer = document.createElement('div');
        Object.assign(controlContainer.style, {
            position: 'fixed',
            bottom: '100px', // Position at the bottom
            right: '10px',  // Position at the right
            zIndex: '9999',
            backgroundColor: 'rgba(34, 34, 34, 0.8)',
            color: '#fff',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            transition: 'opacity 0.3s, transform 0.3s',
            opacity: '0.9',
            transform: 'scale(1)',
            backdropFilter: 'blur(8px)',
        });

        const createControlElement = (type, props) => {
            const element = document.createElement(type);
            Object.assign(element.style, props.style);
            Object.assign(element, props.attrs);
            return element;
        };

        const volumeIcon = createControlElement('span', {
            style: { marginRight: '10px', fontSize: '20px', color: '#FFD700' },
            innerHTML: '🔊',
        });

        const volumeLabel = createControlElement('label', {
            style: { marginRight: '10px', fontWeight: 'bold', fontSize: '14px' },
            innerText: 'Volume:',
        });

        const volumeSlider = createControlElement('input', {
            style: {
                appearance: 'none',
                width: '120px',
                height: '6px',
                background: 'linear-gradient(to right, #FFD700, #FF4500)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
            },
            attrs: {
                type: 'range',
                min: '0',
                max: '1',
                step: '0.01',
                value: getStoredValue(VOLUME_STORAGE_KEY, DEFAULT_VOLUME),
            },
        });

        // Modern slider style
        volumeSlider.addEventListener('input', () => {
            const volume = parseFloat(volumeSlider.value);
            setStoredValue(VOLUME_STORAGE_KEY, volume);
            setVolume(volume);
            controlContainer.style.backgroundColor = `rgba(34, ${Math.round(volume * 255)}, 34, 0.8)`;
        });

        const speedLabel = createControlElement('label', {
            style: { marginLeft: '10px', marginRight: '10px', fontWeight: 'bold', fontSize: '14px' },
            innerText: 'Speed:',
        });

        const speeds = [0.5, 1, 1.5, 2];
        const speedSelect = createControlElement('select', {
            style: {
                background: '#333',
                color: '#FFD700',
                borderRadius: '5px',
                padding: '2px 5px',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '14px',
            },
            attrs: {
                onchange: () => {
                    const speed = parseFloat(speedSelect.value);
                    setStoredValue(SPEED_STORAGE_KEY, speed);
                    setSpeed(speed);
                },
            },
        });

        speeds.forEach(speed => {
            const option = document.createElement('option');
            option.value = speed;
            option.innerText = `${speed}x`;
            if (speed === getStoredValue(SPEED_STORAGE_KEY, DEFAULT_SPEED)) {
                option.selected = true;
            }
            speedSelect.appendChild(option);
        });

        const resetButton = createControlElement('button', {
            style: {
                backgroundColor: '#FFD700',
                color: '#333',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
            },
            innerText: 'Reset',
            attrs: {
                onclick: () => {
                    volumeSlider.value = DEFAULT_VOLUME;
                    setStoredValue(VOLUME_STORAGE_KEY, DEFAULT_VOLUME);
                    setVolume(DEFAULT_VOLUME);

                    speedSelect.value = DEFAULT_SPEED;
                    setStoredValue(SPEED_STORAGE_KEY, DEFAULT_SPEED);
                    setSpeed(DEFAULT_SPEED);

                    controlContainer.style.backgroundColor = 'rgba(34, 34, 34, 0.8)';
                },
                onmouseover: () => {
                    resetButton.style.backgroundColor = '#FF4500';
                },
                onmouseout: () => {
                    resetButton.style.backgroundColor = '#FFD700';
                },
            },
        });

        controlContainer.appendChild(volumeIcon);
        controlContainer.appendChild(volumeLabel);
        controlContainer.appendChild(volumeSlider);
        controlContainer.appendChild(speedLabel);
        controlContainer.appendChild(speedSelect);
        controlContainer.appendChild(resetButton);
        document.body.appendChild(controlContainer);

        controlContainer.addEventListener('mouseover', () => {
            controlContainer.style.opacity = '1';
            controlContainer.style.transform = 'scale(1.05)';
        });

        controlContainer.addEventListener('mouseout', () => {
            controlContainer.style.opacity = '0.9';
            controlContainer.style.transform = 'scale(1)';
        });

        setVolume(getStoredValue(VOLUME_STORAGE_KEY, DEFAULT_VOLUME));
        setSpeed(getStoredValue(SPEED_STORAGE_KEY, DEFAULT_SPEED));
    };

    window.addEventListener('load', createVolumeControlUI);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'VIDEO' || (node.querySelectorAll && node.querySelectorAll('video').length > 0)) {
                        setTimeout(() => {
                            const videos = node.tagName === 'VIDEO' ? [node] : node.querySelectorAll('video');
                            videos.forEach(video => {
                                video.volume = getStoredValue(VOLUME_STORAGE_KEY, DEFAULT_VOLUME);
                                video.playbackRate = getStoredValue(SPEED_STORAGE_KEY, DEFAULT_SPEED);
                            });
                        }, 500);
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
