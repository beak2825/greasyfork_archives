// ==UserScript==
// @name         Instagram Video Controls with Persistent UI and Volume
// @description  Adds native controls to Instagram videos + draggable UI (remembers volume/mute/position)
// @description  based on the script https://greasyfork.org/en/scripts/536598-instagram-video-controls
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @author       manaka
// @match        *://*.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537876/Instagram%20Video%20Controls%20with%20Persistent%20UI%20and%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/537876/Instagram%20Video%20Controls%20with%20Persistent%20UI%20and%20Volume.meta.js
// ==/UserScript==

(function () {
    const POS_KEY = 'igvc-ui-position';
    const SETTINGS_KEY = 'igvc-settings';

    const settings = loadSettings();

    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    function loadSettings() {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    volume: typeof parsed.volume === 'number' ? parsed.volume : 0.5,
                    muted: typeof parsed.muted === 'boolean' ? parsed.muted : false
                };
            } catch {
                return { volume: 0.5, muted: false };
            }
        }
        return { volume: 0.5, muted: false };
    }

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    const createControlUI = () => {
        const container = document.createElement('div');
        container.id = 'igvc-floating-ui';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.background = 'rgba(0,0,0,0.7)';
        container.style.color = '#fff';
        container.style.padding = '6px 10px';
        container.style.borderRadius = '8px';
        container.style.fontSize = '12px';
        container.style.fontFamily = 'sans-serif';
        container.style.cursor = 'move';
        container.style.userSelect = 'none';

        const savedPos = localStorage.getItem(POS_KEY);
        if (savedPos) {
            const { top, left } = JSON.parse(savedPos);
            container.style.top = top;
            container.style.left = left;
            container.style.right = 'auto';
        }

        const volumeLabel = document.createElement('label');
        volumeLabel.textContent = 'Volume: ';
        volumeLabel.style.marginRight = '4px';

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '1';
        volumeSlider.step = '0.01';
        volumeSlider.value = settings.volume;
        volumeSlider.style.verticalAlign = 'middle';

        const muteLabel = document.createElement('label');
        muteLabel.style.marginLeft = '10px';
        muteLabel.textContent = 'Mute';

        const muteCheckbox = document.createElement('input');
        muteCheckbox.type = 'checkbox';
        muteCheckbox.checked = settings.muted;
        muteCheckbox.style.marginLeft = '4px';

        volumeSlider.addEventListener('input', () => {
            settings.volume = parseFloat(volumeSlider.value);
            settings.muted = false;
            muteCheckbox.checked = false;
            saveSettings();
            applySettingsToAll();
        });

        muteCheckbox.addEventListener('change', () => {
            settings.muted = muteCheckbox.checked;
            saveSettings();
            applySettingsToAll();
        });

        container.appendChild(volumeLabel);
        container.appendChild(volumeSlider);
        container.appendChild(muteLabel);
        container.appendChild(muteCheckbox);
        document.body.appendChild(container);

        makeDraggable(container, volumeSlider);
    };

    const makeDraggable = (element, ignoreElement) => {
        let offsetX, offsetY, isDragging = false;

        element.addEventListener('mousedown', (e) => {
            if (ignoreElement.contains(e.target)) return; // prevent drag on slider
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const left = `${e.clientX - offsetX}px`;
            const top = `${e.clientY - offsetY}px`;
            element.style.left = left;
            element.style.top = top;
            element.style.right = 'auto';
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            localStorage.setItem(POS_KEY, JSON.stringify({
                top: element.style.top,
                left: element.style.left
            }));
        };
    };

    const applySettings = (video) => {
        video.muted = settings.muted;
        video.volume = settings.volume;
    };

    const monitorVideo = (video) => {
        if (video.dataset.igvcProcessed) return;
        video.dataset.igvcProcessed = 'true';

        video.setAttribute('controls', 'true');
        video.style.position = 'relative';
        video.style.zIndex = '1';

        if (location.pathname.startsWith('/stories/')) {
            video.style.height = 'calc(100% - 62px)';
        }

        applySettings(video);

        video.addEventListener('volumechange', () => {
            applySettings(video);
        });

        const originalPlay = video.play;
        video.play = function () {
            const result = originalPlay.apply(this, arguments);
            result.then(() => applySettings(this)).catch(() => {});
            return result;
        };
    };

    const applySettingsToAll = () => {
        document.querySelectorAll('video').forEach(applySettings);
    };

    const applyToAllVideos = () => {
        document.querySelectorAll('video').forEach(monitorVideo);
    };

    const init = () => {
        createControlUI();
        applyToAllVideos();
        const observer = new MutationObserver(debounce(applyToAllVideos, 300));
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    init();
})();
