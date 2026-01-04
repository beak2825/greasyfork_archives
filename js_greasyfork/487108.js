// ==UserScript==
// @name         instagram Default Volume (with Volume Booster)
// @namespace    instagramDefaultVolume
// @version      2.0.8
// @description  Set your Instagram videos default volumes (Up to 300%)
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        *://*.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/487108/instagram%20Default%20Volume%20%28with%20Volume%20Booster%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487108/instagram%20Default%20Volume%20%28with%20Volume%20Booster%29.meta.js
// ==/UserScript==

console.log("instagramDefaultVolume Loaded");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const videoGainNodes = new WeakMap();

window.addEventListener('load', () => {
    document.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }, { once: true });

    if (!localStorage.getItem('defaultVolume')) {
        localStorage.setItem('defaultVolume', 0.2);
    }

    const findVolumeDiv = () => {
        const targetElement = document.body;
        const volumeDiv = document.createElement('div');

        volumeDiv.id = 'igDefaultVolume';
        volumeDiv.style.position = 'fixed';
        volumeDiv.style.bottom = '1px';
        volumeDiv.style.right = '1px';
        volumeDiv.style.zIndex = '2147483647';

        volumeDiv.style.display = 'flex';
        volumeDiv.style.alignItems = 'center';
        volumeDiv.style.padding = '6px 10px';
        volumeDiv.style.borderRadius = '14px';
        volumeDiv.style.cursor = 'pointer';
        volumeDiv.style.backgroundColor = '#262626';
        volumeDiv.style.border = '1px solid #363636';
        volumeDiv.style.color = '#fff';
        volumeDiv.style.fontFamily = '-apple-system, system-ui, sans-serif';
        volumeDiv.style.fontSize = '12px';
        volumeDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
        volumeDiv.style.transition = 'all 0.2s ease';

        volumeDiv.addEventListener('mouseenter', () => volumeDiv.style.transform = 'scale(1.05)');
        volumeDiv.addEventListener('mouseleave', () => volumeDiv.style.transform = 'scale(1)');

        const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgIcon.setAttribute("width", "20");
        svgIcon.setAttribute("height", "20");
        svgIcon.setAttribute("viewBox", "0 0 24 24");
        svgIcon.style.fill = "#ffffff";
        svgIcon.style.marginRight = "8px";
        svgIcon.style.cursor = "pointer";

        const titleElement = document.createElementNS("http://www.w3.org/2000/svg", "title");
        titleElement.textContent = "Click to reset to 100%";
        svgIcon.appendChild(titleElement);

        const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svgIcon.appendChild(iconPath);

        const ICON_PATHS = {
            mute: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z",
            low: "M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z",
            high: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
        };

        const volumeBtn = document.createElement('button');
        volumeBtn.id = 'volumeBtn';
        volumeBtn.style.display = 'flex';
        volumeBtn.style.alignItems = 'center';
        volumeBtn.style.background = 'transparent';
        volumeBtn.style.border = 'none';
        volumeBtn.style.color = 'inherit';
        volumeBtn.style.padding = '0';
        volumeBtn.style.cursor = 'pointer';

        const volumeSelectorInput = document.createElement('input');
        volumeSelectorInput.type = 'range';

        const SPLIT_POINT = 100;
        const MAX_POINT = 130;

        volumeSelectorInput.min = 0;
        volumeSelectorInput.max = MAX_POINT;
        volumeSelectorInput.step = 1;

        const currentVol = parseFloat(localStorage.getItem('defaultVolume')) || 1;
        if (currentVol <= 1) {
            volumeSelectorInput.value = currentVol * 100;
        } else {
            volumeSelectorInput.value = 100 + ((currentVol - 1) * 15);
        }

        volumeSelectorInput.style.display = 'none';
        volumeSelectorInput.style.width = '100px';
        volumeSelectorInput.style.marginLeft = '10px';
        volumeSelectorInput.style.cursor = 'ew-resize';
        volumeSelectorInput.style.appearance = 'none';
        volumeSelectorInput.style.background = 'transparent';

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            #igDefaultVolume input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 12px;
                width: 12px;
                border-radius: 50%;
                background: #ffffff;
                margin-top: -4px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.5);
                transition: transform 0.1s;
            }
            #igDefaultVolume input[type=range]:active::-webkit-slider-thumb {
                transform: scale(1.3);
            }
            #igDefaultVolume input[type=range]::-webkit-slider-runnable-track {
                width: 100%;
                height: 4px;
                cursor: pointer;
                background: #555;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(styleSheet);

        const volumeSelectorText = document.createElement('span');
        volumeSelectorText.style.minWidth = '40px';
        volumeSelectorText.style.textAlign = 'center';
        volumeSelectorText.style.fontWeight = '700';

        const updateSliderVisuals = (val) => {
            const max = parseInt(volumeSelectorInput.max);
            const visualFillLimit = Math.min(val, SPLIT_POINT);
            const percentage = (visualFillLimit / max) * 100;

            let color = '#0095f6';
            if (val > SPLIT_POINT) color = '#ff4d4d';

            volumeSelectorInput.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #555 ${percentage}%, #555 100%)`;
        };

        const updateVolumeLogic = () => {
            let val = parseFloat(volumeSelectorInput.value);
            let realVolume = 0;
            let displayPercent = 0;

            if (val <= SPLIT_POINT) {
                realVolume = val / 100;
                displayPercent = Math.round(realVolume * 100);
            } else {
                const boostProgress = (val - SPLIT_POINT) / (MAX_POINT - SPLIT_POINT);
                realVolume = 1 + (boostProgress * 2);
                displayPercent = Math.round(realVolume * 100);
            }

            volumeSelectorText.textContent = displayPercent + '%';

            if (realVolume === 0) {
                iconPath.setAttribute("d", ICON_PATHS.mute);
            } else if (realVolume < 0.5) {
                iconPath.setAttribute("d", ICON_PATHS.low);
            } else {
                iconPath.setAttribute("d", ICON_PATHS.high);
            }

            if (realVolume > 1) {
                volumeSelectorText.style.color = '#ff4d4d';
            } else {
                volumeSelectorText.style.color = 'inherit';
            }
            svgIcon.style.fill = '#ffffff';

            updateSliderVisuals(val);
            localStorage.setItem('defaultVolume', realVolume);
            setVolumeForVideos();
        };

        updateVolumeLogic();

        volumeSelectorInput.addEventListener('input', updateVolumeLogic);

        svgIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            volumeSelectorInput.value = 100;
            updateVolumeLogic();
        });

        volumeDiv.appendChild(svgIcon);
        volumeDiv.appendChild(volumeBtn);
        volumeBtn.appendChild(volumeSelectorText);
        volumeBtn.appendChild(volumeSelectorInput);

        let isExpanded = false;

        volumeDiv.addEventListener('click', (event) => {
            event.stopPropagation();
            if (event.target !== volumeSelectorInput) {
                isExpanded = !isExpanded;
                if (isExpanded) {
                    volumeSelectorInput.style.display = 'block';
                    updateSliderVisuals(volumeSelectorInput.value);
                } else {
                    volumeSelectorInput.style.display = 'none';
                }
            }
        });

        targetElement.appendChild(volumeDiv);
    };

    setInterval(() => {
        if (!document.getElementById('igDefaultVolume')) {
            findVolumeDiv();
        }
    }, 1000);

    const setVolumeForVideos = () => {
        const desiredVolume = parseFloat(localStorage.getItem('defaultVolume'));
        const videos = document.getElementsByTagName('video');

        for (let video of videos) {
            try {
                if (desiredVolume <= 1.0) {
                    video.volume = desiredVolume;
                    if (videoGainNodes.has(video)) {
                        videoGainNodes.get(video).gain.value = 1;
                    }
                } else {
                    video.volume = 1.0;
                    if (!videoGainNodes.has(video)) {
                        const source = audioCtx.createMediaElementSource(video);
                        const gainNode = audioCtx.createGain();
                        source.connect(gainNode);
                        gainNode.connect(audioCtx.destination);
                        videoGainNodes.set(video, gainNode);
                    }
                    const gainNode = videoGainNodes.get(video);
                    gainNode.gain.value = desiredVolume;
                }
            } catch (err) {
                 if (desiredVolume > 1) video.volume = 1;
                 else video.volume = desiredVolume;
            }
        }
    };

    setVolumeForVideos();
    new MutationObserver(() => setVolumeForVideos()).observe(document.body, { childList: true, subtree: true });
});