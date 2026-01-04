// ==UserScript==
// @name         Torn City Chain Watch Alert
// @namespace    http://tampermonkey.net/
// @version      5.7
// @description  Enhanced chain timer alert with advanced customization and preferences panel
// @author       Codex234
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/512491/Torn%20City%20Chain%20Watch%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/512491/Torn%20City%20Chain%20Watch%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const settings = {
        threshold: parseInt(localStorage.getItem('alertThreshold')) || -1,
        opacity: parseFloat(localStorage.getItem('flashOpacity')) || 0.3,
        audioSrc: localStorage.getItem('alarmSound') || 'https://www.soundjay.com/transportation/sounds/train-crossing-bell-01.mp3',
        volume: parseFloat(localStorage.getItem('volumeLevel')) || 0.25,
        flashPattern: localStorage.getItem('flashPattern') || 'regular',
        flashColor: localStorage.getItem('flashColor') || '#ff0000',
        placement: localStorage.getItem('containerPlacement') || 'top-right',
        contentVisible: localStorage.getItem('contentVisible') === 'true',
        selectedPreset: localStorage.getItem('selectedPreset') || '',
        prefsContentVisible: localStorage.getItem('prefsContentVisible') === 'true'
    };

    const state = {
        isInitialized: false,
        isBelowThreshold: false,
        hasAlerted: false,
        audioElement: null,
        alarmInterval: null,
        flashElement: null,
        flashInterval: null
    };

    let customSounds = JSON.parse(localStorage.getItem('customSounds')) || [
        { name: 'Train Bell', src: 'https://www.soundjay.com/transportation/sounds/train-crossing-bell-01.mp3', enabled: true },
        { name: 'Smoke Alarm', src: 'https://www.soundjay.com/mechanical/sounds/smoke-detector-1.mp3', enabled: true },
        { name: 'Car Alarm', src: 'https://www.soundjay.com/transportation/sounds/car-alarm-1.mp3', enabled: true },
        { name: 'Air Raid', src: 'https://cdn.pixabay.com/audio/2021/08/04/audio_21be84d662.mp3', enabled: true },
        { name: 'Dial Up', src: 'https://sfxcontent.s3.amazonaws.com/soundfx/EmergencyAlertSystemBeep.mp3', enabled: false },
        { name: 'Electric', src: 'https://cdn.freesound.org/previews/361/361491_4930962-lq.mp3', enabled: true },
        { name: 'Car Horn', src: 'https://cdn.freesound.org/previews/436/436587_1535323-lq.mp3', enabled: false },
        { name: 'Klaxon', src: 'https://cdn.freesound.org/previews/32/32088_114160-lq.mp3', enabled: true },
        { name: 'EAS Alarm', src: 'https://cdn.pixabay.com/audio/2022/03/15/audio_30d62f0685.mp3', enabled: true }
    ];

    let customFlashPatterns = JSON.parse(localStorage.getItem('customFlashPatterns')) || [
        { name: 'regular', sequence: [{ on: 2000, off: 2000 }], cycle: 4000, enabled: true },
        { name: 'pulse', sequence: [{ on: 2000, off: 1000 }], cycle: 3000, enabled: true },
        { name: 'rave', sequence: [{ on: 1000, off: 1000 }], cycle: 2000, enabled: true },
        { name: 'Off', sequence: [{ on: 0, off: 10000 }], cycle: 10000, enabled: true }
    ];

    let presets = JSON.parse(localStorage.getItem('presets')) || [];

    let FLASH_PATTERNS = {};
    customFlashPatterns.forEach(pattern => {
        if (pattern.enabled) {
            FLASH_PATTERNS[pattern.name] = { sequence: pattern.sequence, cycle: pattern.cycle };
        }
    });

    const PLACEMENT_OPTIONS = [
        { value: 'top-right', text: 'Top Right' },
        { value: 'under-chain', text: 'Under Chain' },
        { value: 'settings-menu', text: 'Settings Menu' }
    ];

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        if (attributes.style) Object.assign(element.style, attributes.style);
        return element;
    }

function getChainTime() {
    let selector = '.bar-timeleft___B9RGV';
    let element = document.querySelector(selector);

    if (!element) {
        selector = '.labelTitle___ZtfnD span span';
        element = document.querySelector(selector);
    }

    if (element) {
        const chainBar = element.closest('a.chain-bar___vjdPL');
        if (chainBar) {
            const progress = chainBar.querySelector('.progress___onlYW');
            if (progress && progress.classList.contains('cooldown___QOnHP')) {
                return -1;
            }
        }

        const text = element.textContent.trim();
        const cleanText = text.replace(/[()]/g, '');
        const match = cleanText.match(/(\d+):(\d+)/);
        if (match) {
            return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
    }
    return -1;
}

function updateFlashColor() {
    if (state.flashElement) {
        state.flashElement.style.backgroundColor = settings.flashColor;
    }
}

function startFlash() {
    if (!state.flashElement) {
        state.flashElement = createElement('div', {
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: settings.flashColor,
                pointerEvents: 'none',
                zIndex: '9999',
                transition: 'opacity 0.2s ease-in-out',
                opacity: '0'
            }
        });
        document.body.appendChild(state.flashElement);
    } else {
        state.flashElement.style.backgroundColor = settings.flashColor;
    }

    if (settings.opacity === 0) return;

    stopFlash();

    const pattern = FLASH_PATTERNS[settings.flashPattern] || FLASH_PATTERNS['regular'];
    let step = 0;

    function flashStep() {
        const current = pattern.sequence[step];
        state.flashElement.style.opacity = settings.opacity;
        setTimeout(() => {
            state.flashElement.style.opacity = '0';
            step = (step + 1) % pattern.sequence.length;
        }, current.on);
    }

    flashStep();
    state.flashInterval = setInterval(flashStep, pattern.cycle);
}

function stopFlash() {
    if (state.flashInterval) {
        clearInterval(state.flashInterval);
        state.flashInterval = null;
    }
    if (state.flashElement) {
        state.flashElement.style.opacity = '0';
    }
}

function updateAudioSource() {
    if (state.audioElement) {
        state.audioElement.src = settings.audioSrc;
        state.audioElement.load();
        updateVolume();
    }
}

function updateVolume() {
    if (state.audioElement) {
        state.audioElement.volume = settings.volume;
    }
}

function startAlarm() {
    if (!state.audioElement) {
        state.audioElement = new Audio(settings.audioSrc);
        updateVolume();
        document.body.appendChild(state.audioElement);
    }

    clearInterval(state.alarmInterval);
    state.audioElement.play();
    state.alarmInterval = setInterval(() => {
        if (state.audioElement.paused) {
            state.audioElement.currentTime = 0;
            state.audioElement.play();
        }
    }, 1000);
}

function stopAlarm() {
    clearInterval(state.alarmInterval);
    if (state.audioElement) {
        state.audioElement.pause();
        state.audioElement.currentTime = 0;
    }
}

function resetAlertState() {
    stopAlarm();
    stopFlash();
    state.hasAlerted = false;
    state.isBelowThreshold = false;
}

function monitorChain() {
    if (settings.threshold === -1) {
        resetAlertState();
        return;
    }

    const timeLeft = getChainTime();
    if (timeLeft === -1) return;

    const isBelow = timeLeft < settings.threshold;

    if (isBelow && !state.hasAlerted) {
        startAlarm();
        startFlash();
        state.hasAlerted = true;
    } else if (!isBelow && state.isBelowThreshold) {
        stopAlarm();
        stopFlash();
        state.hasAlerted = false;
    } else if (isBelow && !state.flashInterval) {
        startFlash();
    }

    state.isBelowThreshold = isBelow;
}
    function createUI() {
        if (state.isInitialized) {
            console.debug('[ChainWatch] UI already initialized, skipping');
            return;
        }
        state.isInitialized = true;

        console.debug('[ChainWatch] Creating UI with placement:', settings.placement);

        const container = createElement('div', {
            id: 'chainSaverContainer',
            role: 'region',
            'aria-label': 'Chain Saver Controls',
            style: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '5px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                minWidth: '150px',
                zIndex: '10000'
            }
        });

        const title = createElement('h1', {
            textContent: 'Chain Saver',
            role: 'button',
            'aria-expanded': settings.contentVisible,
            style: {
                margin: '0',
                fontSize: '16px',
                textAlign: 'center',
                cursor: 'pointer',
                color: '#000'
            }
        });

        const content = createElement('div', {
            className: 'chainSaverContent',
            style: { display: settings.contentVisible ? 'block' : 'none', padding: '10px 0' }
        });

        container.appendChild(title);
        container.appendChild(content);

        title.addEventListener('click', () => {
            const isVisible = content.style.display === 'none';
            content.style.display = isVisible ? 'block' : 'none';
            title.setAttribute('aria-expanded', isVisible);
            settings.contentVisible = isVisible;
            localStorage.setItem('contentVisible', isVisible);
        });

        content.appendChild(createDropdownSection('Alarm Sound', 'sound', customSounds.filter(s => s.enabled).map(s => ({
            value: s.src,
            text: s.name
        })), settings.audioSrc, settings.placement, (value) => {
            settings.audioSrc = value;
            localStorage.setItem('alarmSound', value);
            updateAudioSource();
        }));

        content.appendChild(createTimerSection('Timer', 'timer', settings.threshold, settings.placement, (value) => {
            settings.threshold = value;
            localStorage.setItem('alertThreshold', value);
            resetAlertState();
        }));

        content.appendChild(createSliderSection('Volume', 'volume', settings.volume, settings.placement, 0, 1, 0.01, (value) => {
            settings.volume = value;
            localStorage.setItem('volumeLevel', value);
            updateVolume();
        }));

        content.appendChild(createSliderSection('Flash Opacity', 'opacity', settings.opacity, settings.placement, 0, 1, 0.01, (value) => {
            settings.opacity = value;
            localStorage.setItem('flashOpacity', value);
        }));

        content.appendChild(createDropdownSection('Flash Pattern', 'pattern', customFlashPatterns.filter(p => p.enabled).map(p => ({
            value: p.name,
            text: p.name.charAt(0).toUpperCase() + p.name.slice(1)
        })), settings.flashPattern, settings.placement, (value) => {
            settings.flashPattern = value;
            localStorage.setItem('flashPattern', value);
            stopFlash();
            if (state.isBelowThreshold) startFlash();
        }));

        content.appendChild(createDropdownSection('Preset', 'preset', presets.map(p => ({
            value: p.name,
            text: p.name
        })), settings.selectedPreset, settings.placement, (value) => {
            const preset = presets.find(p => p.name === value);
            if (preset) {
                settings.selectedPreset = value;
                settings.threshold = preset.threshold;
                settings.audioSrc = preset.soundSrc;
                settings.volume = preset.volume;
                settings.flashColor = preset.flashColor;
                settings.opacity = preset.flashOpacity;
                settings.flashPattern = preset.flashPattern;
                localStorage.setItem('selectedPreset', value);
                localStorage.setItem('alertThreshold', preset.threshold);
                localStorage.setItem('alarmSound', preset.soundSrc);
                localStorage.setItem('volumeLevel', preset.volume);
                localStorage.setItem('flashColor', preset.flashColor);
                localStorage.setItem('flashOpacity', preset.flashOpacity);
                localStorage.setItem('flashPattern', preset.flashPattern);
                updateAudioSource();
                updateVolume();
                updateFlashColor(); // Update flash color immediately
                stopFlash();
                if (state.isBelowThreshold) startFlash();
                // Update UI sections
                const timerSection = content.querySelector(`#timerInput`)?.parentNode.parentNode;
                if (timerSection) {
                    const newTimerSection = createTimerSection('Timer', 'timer', settings.threshold, settings.placement, (val) => {
                        settings.threshold = val;
                        localStorage.setItem('alertThreshold', val);
                        resetAlertState();
                    });
                    content.replaceChild(newTimerSection, timerSection);
                }
                const soundSection = content.querySelector(`#soundSelect`)?.parentNode;
                if (soundSection) {
                    const newSoundSection = createDropdownSection('Alarm Sound', 'sound', customSounds.filter(s => s.enabled).map(s => ({
                        value: s.src,
                        text: s.name
                    })), settings.audioSrc, settings.placement, (val) => {
                        settings.audioSrc = val;
                        localStorage.setItem('alarmSound', val);
                        updateAudioSource();
                    });
                    content.replaceChild(newSoundSection, soundSection);
                }
                const volumeSection = content.querySelector(`#volumeSlider`)?.parentNode;
                if (volumeSection) {
                    const newVolumeSection = createSliderSection('Volume', 'volume', settings.volume, settings.placement, 0, 1, 0.01, (val) => {
                        settings.volume = val;
                        localStorage.setItem('volumeLevel', val);
                        updateVolume();
                    });
                    content.replaceChild(newVolumeSection, volumeSection);
                }
                const opacitySection = content.querySelector(`#opacitySlider`)?.parentNode;
                if (opacitySection) {
                    const newOpacitySection = createSliderSection('Flash Opacity', 'opacity', settings.opacity, settings.placement, 0, 1, 0.01, (val) => {
                        settings.opacity = val;
                        localStorage.setItem('flashOpacity', val);
                    });
                    content.replaceChild(newOpacitySection, opacitySection);
                }
                const patternSection = content.querySelector(`#patternSelect`)?.parentNode;
                if (patternSection) {
                    const newPatternSection = createDropdownSection('Flash Pattern', 'pattern', customFlashPatterns.filter(p => p.enabled).map(p => ({
                        value: p.name,
                        text: p.name.charAt(0).toUpperCase() + p.name.slice(1)
                    })), settings.flashPattern, settings.placement, (val) => {
                        settings.flashPattern = val;
                        localStorage.setItem('flashPattern', val);
                        stopFlash();
                        if (state.isBelowThreshold) startFlash();
                    });
                    content.replaceChild(newPatternSection, patternSection);
                }
                resetAlertState();
            }
        }));

        content.appendChild(createDropdownSection('Placement', 'placement', PLACEMENT_OPTIONS, settings.placement, settings.placement, (value) => {
            settings.placement = value;
            localStorage.setItem('containerPlacement', value);
            updateContainerPosition(container, title, content);
        }));

        console.debug('[ChainWatch] UI created, applying placement:', settings.placement);
        updateContainerPosition(container, title, content);

        console.debug('[ChainWatch] UI initialization complete');
    }

    function createExpandableSection(titleText, contentId, contentElement, isDarkMode) {
        const textColor = isDarkMode ? '#fff' : '#000';
        const section = createElement('div', { style: { marginBottom: '20px' } });
        const header = createElement('h3', {
            style: { margin: '0 0 10px 0', cursor: 'pointer', color: textColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
        });
        const title = createElement('span', { textContent: titleText });
        const arrow = createElement('span', {
            textContent: localStorage.getItem(`${contentId}Visible`) === 'true' ? '▲' : '▼',
            style: { fontSize: '12px', color: textColor }
        });
        header.appendChild(title);
        header.appendChild(arrow);
        const content = createElement('div', {
            style: { display: localStorage.getItem(`${contentId}Visible`) === 'true' ? 'block' : 'none' }
        });
        content.appendChild(contentElement);
        header.addEventListener('click', () => {
            const isVisible = content.style.display === 'none';
            content.style.display = isVisible ? 'block' : 'none';
            arrow.textContent = isVisible ? '▲' : '▼';
            localStorage.setItem(`${contentId}Visible`, isVisible);
        });
        section.appendChild(header);
        section.appendChild(content);
        return section;
    }

    function updateMainBarVolumeSlider() {
        const volumeSection = document.querySelector('#chainSaverContainer #volumeSlider')?.parentNode;
        if (volumeSection) {
            const newVolumeSection = createSliderSection('Volume', 'volume', settings.volume, settings.placement, 0, 1, 0.01, (value) => {
                settings.volume = value;
                localStorage.setItem('volumeLevel', value);
                updateVolume();
            });
            volumeSection.parentNode.replaceChild(newVolumeSection, volumeSection);
        }
    }

    function updateMainBarFlashPatternDropdown() {
        const patternSection = document.querySelector('#chainSaverContainer #patternSelect')?.parentNode;
        if (patternSection) {
            const newPatternSection = createDropdownSection('Flash Pattern', 'pattern', customFlashPatterns.filter(p => p.enabled).map(p => ({
                value: p.name,
                text: p.name.charAt(0).toUpperCase() + p.name.slice(1)
            })), settings.flashPattern, settings.placement, (value) => {
                settings.flashPattern = value;
                localStorage.setItem('flashPattern', value);
                stopFlash();
                if (state.isBelowThreshold) startFlash();
            });
            patternSection.parentNode.replaceChild(newPatternSection, patternSection);
        }
    }

    function updateMainBarSoundDropdown() {
        const soundSection = document.querySelector('#chainSaverContainer #soundSelect')?.parentNode;
        if (soundSection) {
            const newSoundSection = createDropdownSection('Alarm Sound', 'sound', customSounds.filter(s => s.enabled).map(s => ({
                value: s.src,
                text: s.name
            })), settings.audioSrc, settings.placement, (value) => {
                settings.audioSrc = value;
                localStorage.setItem('alarmSound', value);
                updateAudioSource();
            });
            soundSection.parentNode.replaceChild(newSoundSection, soundSection);
        }
    }

    function updateMainBarTimerSection() {
        const timerSection = document.querySelector('#chainSaverContainer #timerInput')?.parentNode.parentNode;
        if (timerSection) {
            const newTimerSection = createTimerSection('Timer', 'timer', settings.threshold, settings.placement, (value) => {
                settings.threshold = value;
                localStorage.setItem('alertThreshold', value);
                resetAlertState();
            });
            timerSection.parentNode.replaceChild(newTimerSection, timerSection);
        }
    }

    function updateMainBarOpacitySlider() {
        const opacitySection = document.querySelector('#chainSaverContainer #opacitySlider')?.parentNode;
        if (opacitySection) {
            const newOpacitySection = createSliderSection('Flash Opacity', 'opacity', settings.opacity, settings.placement, 0, 1, 0.01, (value) => {
                settings.opacity = value;
                localStorage.setItem('flashOpacity', value);
            });
            opacitySection.parentNode.replaceChild(newOpacitySection, opacitySection);
        }
    }

    function applyPreset(preset) {
        settings.threshold = preset.threshold;
        settings.audioSrc = preset.soundSrc;
        settings.volume = preset.volume;
        settings.flashColor = preset.flashColor;
        settings.opacity = preset.flashOpacity;
        settings.flashPattern = preset.flashPattern;
        settings.selectedPreset = preset.name;
        localStorage.setItem('selectedPreset', preset.name);
        localStorage.setItem('alertThreshold', preset.threshold);
        localStorage.setItem('alarmSound', preset.soundSrc);
        localStorage.setItem('volumeLevel', preset.volume);
        localStorage.setItem('flashColor', preset.flashColor);
        localStorage.setItem('flashOpacity', preset.flashOpacity);
        localStorage.setItem('flashPattern', preset.flashPattern);
        updateAudioSource();
        updateVolume();
        updateFlashColor(); // Ensure flash color is updated immediately
        stopFlash();
        if (state.isBelowThreshold) startFlash();
        updateMainBarTimerSection();
        updateMainBarSoundDropdown();
        updateMainBarVolumeSlider();
        updateMainBarOpacitySlider();
        updateMainBarFlashPatternDropdown();
        resetAlertState();
    }

    function createPreferencesPanel() {
        if (document.getElementById('chainSaverPrefs')) {
            console.debug('[ChainWatch] Preferences panel already exists, skipping');
            return;
        }
        console.debug('[ChainWatch] Creating preferences panel');

        const generalSettings = document.querySelector('.preferences-container.m-top10');
        if (!generalSettings) {
            console.warn('[ChainWatch] General settings container not found');
            return;
        }

        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#fff' : '#000';

        const container = createElement('div', {
            id: 'chainSaverPrefs',
            className: 'tt-container rounding mt10 tt-theme-background'
        });

        const title = createElement('div', {
            className: 'title collapsed',
            style: { cursor: 'pointer', color: textColor }
        });

        const titleText = createElement('div', {
            className: 'text',
            textContent: 'Chain Saver Presets',
            style: { color: textColor }
        });

        title.appendChild(titleText);

        const content = createElement('div', {
            style: { display: settings.prefsContentVisible ? 'block' : 'none', padding: '10px' }
        });

        title.addEventListener('click', () => {
            const isVisible = content.style.display === 'none';
            content.style.display = isVisible ? 'block' : 'none';
            title.classList.toggle('collapsed', !isVisible);
            settings.prefsContentVisible = isVisible;
            localStorage.setItem('prefsContentVisible', isVisible);
        });

        // Local state for preset creation
        let presetSettings = {
            threshold: -1,
            soundSrc: customSounds[0]?.src || '',
            volume: 0.25,
            flashColor: '#ff0000',
            flashOpacity: 0.3,
            flashPattern: 'regular'
        };

        const timerContent = createTimerSection('Timer', 'timer', presetSettings.threshold, 'top-right', (value) => {
            presetSettings.threshold = value;
        });
        timerContent.querySelectorAll('label, button').forEach(el => {
            el.style.color = textColor;
        });
        timerContent.querySelectorAll('input').forEach(input => {
            input.style.color = '#000';
            input.style.backgroundColor = '#fff';
        });
        content.appendChild(createExpandableSection('Timer', 'timerContent', timerContent, isDarkMode));

        const flashSettingsContent = createElement('div');
        const colorSection = createElement('div', { style: { marginBottom: '10px' } });
        const colorLabel = createElement('label', {
            textContent: 'Flash Color:',
            style: { display: 'block', marginBottom: '5px', color: textColor }
        });
        const colorInput = createElement('input', {
            type: 'color',
            value: presetSettings.flashColor,
            style: { width: '100px' }
        });
        colorInput.addEventListener('change', () => {
            presetSettings.flashColor = colorInput.value;
        });
        colorSection.appendChild(colorLabel);
        colorSection.appendChild(colorInput);
        flashSettingsContent.appendChild(colorSection);
        const opacitySection = createSliderSection('Flash Opacity', 'opacity', presetSettings.flashOpacity, 'top-right', 0, 1, 0.01, (value) => {
            presetSettings.flashOpacity = value;
        });
        opacitySection.querySelectorAll('label').forEach(el => {
            el.style.color = textColor;
        });
        flashSettingsContent.appendChild(opacitySection);
        const patternsContent = createElement('div');
        const patternForm = createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '10px' } });
        const patternNameInput = createElement('input', {
            type: 'text',
            placeholder: 'Pattern Name',
            style: { flex: '1', padding: '5px', color: 'black' }
        });
        const patternOnInput = createElement('input', {
            type: 'number',
            placeholder: 'On (ms)',
            style: { flex: '1', padding: '5px', color: 'black' }
        });
        const patternOffInput = createElement('input', {
            type: 'number',
            placeholder: 'Off (ms)',
            style: { flex: '1', padding: '5px', color: 'black' }
        });
        const addPatternBtn = createElement('button', {
            textContent: 'Add Pattern',
            style: { padding: '5px 10px', color: textColor }
        });
        patternForm.appendChild(patternNameInput);
        patternForm.appendChild(patternOnInput);
        patternForm.appendChild(patternOffInput);
        patternForm.appendChild(addPatternBtn);
        patternsContent.appendChild(patternForm);

        const patternsList = createElement('ul', { style: { listStyle: 'none', padding: '0', marginBottom: '10px' } });
        function updatePatternsList(listElement = patternsList) {
            listElement.innerHTML = '';
            customFlashPatterns.forEach(pattern => {
                const li = createElement('li', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' } });
                const radio = createElement('input', {
                    type: 'radio',
                    name: 'patternSelect',
                    value: pattern.name,
                    checked: presetSettings.flashPattern === pattern.name,
                    style: { margin: '0 5px' }
                });
                radio.addEventListener('change', () => {
                    presetSettings.flashPattern = pattern.name;
                });
                li.appendChild(radio);
                li.appendChild(createElement('span', { textContent: `${pattern.name} (${pattern.sequence[0].on}ms on, ${pattern.sequence[0].off}ms off)`, style: { flex: '1', color: textColor } }));
                const toggle = createElement('input', {
                    type: 'checkbox',
                    checked: pattern.enabled,
                    style: { margin: '0 10px' }
                });
                toggle.addEventListener('change', () => {
                    pattern.enabled = toggle.checked;
                    localStorage.setItem('customFlashPatterns', JSON.stringify(customFlashPatterns));
                    FLASH_PATTERNS = {};
                    customFlashPatterns.forEach(p => {
                        if (p.enabled) {
                            FLASH_PATTERNS[p.name] = { sequence: p.sequence, cycle: p.cycle };
                        }
                    });
                    updateMainBarFlashPatternDropdown();
                    updatePatternsList();
                });
                li.appendChild(toggle);
                const deleteBtn = createElement('button', {
                    textContent: 'Delete',
                    style: { padding: '2px 5px', color: textColor }
                });
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete "${pattern.name}"?`)) {
                        customFlashPatterns = customFlashPatterns.filter(p => p.name !== pattern.name);
                        localStorage.setItem('customFlashPatterns', JSON.stringify(customFlashPatterns));
                        FLASH_PATTERNS = {};
                        customFlashPatterns.forEach(p => {
                            if (p.enabled) {
                                FLASH_PATTERNS[p.name] = { sequence: p.sequence, cycle: p.cycle };
                            }
                        });
                        updatePatternsList();
                        updateMainBarFlashPatternDropdown();
                    }
                });
                li.appendChild(deleteBtn);
                listElement.appendChild(li);
            });
        }
        addPatternBtn.addEventListener('click', () => {
            if (patternNameInput.value && patternOnInput.value && patternOffInput.value) {
                const onTime = parseInt(patternOnInput.value);
                const offTime = parseInt(patternOffInput.value);
                if (onTime > -1 && offTime > -1) {
                    const newPattern = {
                        name: patternNameInput.value.toLowerCase(),
                        sequence: [{ on: onTime, off: offTime }],
                        cycle: onTime + offTime,
                        enabled: true
                    };
                    customFlashPatterns.push(newPattern);
                    localStorage.setItem('customFlashPatterns', JSON.stringify(customFlashPatterns));
                    FLASH_PATTERNS[newPattern.name] = { sequence: newPattern.sequence, cycle: newPattern.cycle };
                    patternNameInput.value = '';
                    patternOnInput.value = '';
                    patternOffInput.value = '';
                    updatePatternsList();
                    updateMainBarFlashPatternDropdown();
                } else {
                    alert('On and Off times must be positive numbers.');
                }
            } else {
                alert('Please fill in all fields.');
            }
        });
        updatePatternsList();
        patternsContent.appendChild(patternsList);
        flashSettingsContent.appendChild(patternsContent);

        content.appendChild(createExpandableSection('Flash Settings', 'flashSettingsContent', flashSettingsContent, isDarkMode));

        const soundsContent = createElement('div');
        const soundForm = createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '10px' } });
        const soundNameInput = createElement('input', {
            type: 'text',
            placeholder: 'Sound Name',
            style: { flex: '1', padding: '5px', color: 'black' }
        });
        const soundUrlInput = createElement('input', {
            type: 'url',
            placeholder: 'Sound URL',
            style: { flex: '2', padding: '5px', color: 'black' }
        });
        const addSoundBtn = createElement('button', {
            textContent: 'Add Sound',
            style: { padding: '5px 10px', color: textColor }
        });
        soundForm.appendChild(soundNameInput);
        soundForm.appendChild(soundUrlInput);
        soundForm.appendChild(addSoundBtn);
        soundsContent.appendChild(soundForm);

        const soundsList = createElement('ul', { style: { listStyle: 'none', padding: '0', marginBottom: '10px' } });
        function updateSoundsList(listElement = soundsList) {
            listElement.innerHTML = '';
            customSounds.forEach(sound => {
                const li = createElement('li', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' } });
                const radio = createElement('input', {
                    type: 'radio',
                    name: 'soundSelect',
                    value: sound.src,
                    checked: presetSettings.soundSrc === sound.src,
                    style: { margin: '0 5px' }
                });
                radio.addEventListener('change', () => {
                    presetSettings.soundSrc = sound.src;
                });
                li.appendChild(radio);
                li.appendChild(createElement('span', { textContent: sound.name, style: { flex: '1', color: textColor } }));
                const toggle = createElement('input', {
                    type: 'checkbox',
                    checked: sound.enabled,
                    style: { margin: '0 10px' }
                });
                toggle.addEventListener('change', () => {
                    sound.enabled = toggle.checked;
                    localStorage.setItem('customSounds', JSON.stringify(customSounds));
                    updateMainBarSoundDropdown();
                    updateSoundsList();
                });
                li.appendChild(toggle);
                const deleteBtn = createElement('button', {
                    textContent: 'Delete',
                    style: { padding: '2px 5px', color: textColor }
                });
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete "${sound.name}"?`)) {
                        customSounds = customSounds.filter(s => s.src !== sound.src);
                        localStorage.setItem('customSounds', JSON.stringify(customSounds));
                        updateSoundsList();
                        updateMainBarSoundDropdown();
                    }
                });
                li.appendChild(deleteBtn);
                listElement.appendChild(li);
            });
        }
        addSoundBtn.addEventListener('click', () => {
            if (soundNameInput.value && soundUrlInput.value) {
                customSounds.push({ name: soundNameInput.value, src: soundUrlInput.value, enabled: true });
                localStorage.setItem('customSounds', JSON.stringify(customSounds));
                soundNameInput.value = '';
                soundUrlInput.value = '';
                updateSoundsList();
                updateMainBarSoundDropdown();
            }
        });
        updateSoundsList();
        soundsContent.appendChild(soundsList);

        const volumeSection = createSliderSection('Volume', 'volume', presetSettings.volume, 'top-right', 0, 1, 0.01, (value) => {
            presetSettings.volume = value;
        });
        volumeSection.querySelectorAll('label').forEach(el => {
            el.style.color = textColor;
        });
        soundsContent.appendChild(volumeSection);

        content.appendChild(createExpandableSection('Volume and Sounds', 'soundsContent', soundsContent, isDarkMode));

        const presetsContent = createElement('div');
        const presetForm = createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '10px' } });
        const presetNameInput = createElement('input', {
            type: 'text',
            placeholder: 'Preset Name',
            style: { flex: '1', padding: '5px', color: 'black' }
        });
        const savePresetBtn = createElement('button', {
            textContent: 'Save Preset',
            style: { padding: '5px 10px', color: textColor }
        });
        presetForm.appendChild(presetNameInput);
        presetForm.appendChild(savePresetBtn);

        savePresetBtn.addEventListener('click', () => {
            if (presetNameInput.value) {
                presets.push({
                    name: presetNameInput.value,
                    threshold: presetSettings.threshold,
                    soundSrc: presetSettings.soundSrc,
                    volume: presetSettings.volume,
                    flashColor: presetSettings.flashColor,
                    flashOpacity: presetSettings.flashOpacity,
                    flashPattern: presetSettings.flashPattern
                });
                localStorage.setItem('presets', JSON.stringify(presets));
                presetNameInput.value = '';
                updatePresetsList();
                updateMainBarPresetDropdown();
            }
        });

        const presetsList = createElement('ul', { style: { listStyle: 'none', padding: '0' } });
        function updatePresetsList(listElement = presetsList) {
            listElement.innerHTML = '';
            presets.forEach(preset => {
                const li = createElement('li', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' } });
                const radio = createElement('input', {
                    type: 'radio',
                    name: 'presetSelect',
                    value: preset.name,
                    checked: settings.selectedPreset === preset.name,
                    style: { margin: '0 5px' }
                });
                radio.addEventListener('change', () => {
                    // Load preset settings into form for editing
                    presetSettings.threshold = preset.threshold;
                    presetSettings.soundSrc = preset.soundSrc;
                    presetSettings.volume = preset.volume;
                    presetSettings.flashColor = preset.flashColor;
                    presetSettings.flashOpacity = preset.flashOpacity;
                    presetSettings.flashPattern = preset.flashPattern;
                    // Update form controls
                    const timerInput = timerContent.querySelector('#timerInput');
                    if (timerInput) {
                        timerInput.value = presetSettings.threshold === -1 ? 'Off' : formatTime(presetSettings.threshold);
                    }
                    const colorInput = colorSection.querySelector('input[type="color"]');
                    if (colorInput) colorInput.value = presetSettings.flashColor;
                    const opacitySlider = opacitySection.querySelector('#opacitySlider');
                    if (opacitySlider) {
                        opacitySlider.value = presetSettings.flashOpacity;
                        opacitySlider.previousElementSibling.textContent = `Flash Opacity: ${presetSettings.flashOpacity === 0 ? 'OFF' : `${Math.round(presetSettings.flashOpacity * 100)}%`}`;
                    }
                    const patternRadio = patternsList.querySelector(`input[name="patternSelect"][value="${presetSettings.flashPattern}"]`);
                    if (patternRadio) patternRadio.checked = true;
                    const soundRadio = soundsList.querySelector(`input[name="soundSelect"][value="${presetSettings.soundSrc}"]`);
                    if (soundRadio) soundRadio.checked = true;
                    const volumeSlider = volumeSection.querySelector('#volumeSlider');
                    if (volumeSlider) {
                        volumeSlider.value = presetSettings.volume;
                        volumeSlider.previousElementSibling.textContent = `Volume: ${Math.round(presetSettings.volume * 100)}%`;
                    }
                });
                li.appendChild(radio);
                li.appendChild(createElement('span', { textContent: preset.name, style: { flex: '1', color: textColor } }));
                const removeBtn = createElement('button', {
                    textContent: 'Remove',
                    style: { padding: '2px 5px', color: textColor }
                });
                removeBtn.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete "${preset.name}"?`)) {
                        presets = presets.filter(p => p.name !== preset.name);
                        localStorage.setItem('presets', JSON.stringify(presets));
                        if (settings.selectedPreset === preset.name) {
                            settings.selectedPreset = '';
                            localStorage.setItem('selectedPreset', '');
                        }
                        updatePresetsList();
                        updateMainBarPresetDropdown();
                    }
                });
                li.appendChild(removeBtn);
                listElement.appendChild(li);
            });
        }
        updatePresetsList();
        presetsContent.appendChild(presetForm);
        presetsContent.appendChild(presetsList);
        content.appendChild(createExpandableSection('Presets', 'presetsContent', presetsContent, isDarkMode));

        container.appendChild(title);
        container.appendChild(content);
        generalSettings.parentNode.insertBefore(container, generalSettings.nextSibling);
        console.debug('[ChainWatch] Preferences panel created and inserted');
    }

    function updateMainBarPresetDropdown() {
        const presetSection = document.querySelector('#chainSaverContainer #presetSelect')?.parentNode;
        if (presetSection) {
            const newPresetSection = createDropdownSection('Preset', 'preset', presets.map(p => ({
                value: p.name,
                text: p.name
            })), settings.selectedPreset, settings.placement, (value) => {
                const preset = presets.find(p => p.name === value);
                if (preset) {
                    applyPreset(preset);
                }
            });
            presetSection.parentNode.replaceChild(newPresetSection, presetSection);
        }
    }

    function createDropdownSection(label, id, options, selected, placement, onChange) {
        const section = createElement('div', { style: { marginBottom: '10px' } });
        const labelColor = placement === 'top-right' ? '#000' : '#fff';
        const labelEl = createElement('label', {
            htmlFor: `${id}Select`,
            textContent: `${label}:`,
            style: { display: 'block', marginBottom: '5px', color: labelColor }
        });
        const select = createElement('select', {
            id: `${id}Select`,
            style: { width: '100%', padding: '2px' }
        });

        if (id === 'preset' && options.length === 0) {
            const option = createElement('option', { value: '', textContent: 'No Presets' });
            select.appendChild(option);
        } else {
            options.forEach(opt => {
                const option = createElement('option', {
                    value: opt.value,
                    textContent: opt.text
                });
                select.appendChild(option);
            });
        }

        select.value = selected.toString();
        select.addEventListener('change', (e) => onChange(e.target.value));

        section.appendChild(labelEl);
        section.appendChild(select);
        return section;
    }

    function createSliderSection(label, id, value, placement, min, max, step, onChange) {
        const section = createElement('div', { style: { marginBottom: '10px' } });
        const labelColor = placement === 'top-right' ? '#000' : '#fff';
        const labelEl = createElement('label', {
            htmlFor: `${id}Slider`,
            textContent: `${label}: ${id === 'volume' ? `${Math.round(value * 100)}%` : value === 0 ? 'OFF' : `${Math.round(value * 100)}%`}`,
            style: { display: 'block', marginBottom: '5px', color: labelColor }
        });
        const slider = createElement('input', {
            type: 'range',
            id: `${id}Slider`,
            min,
            max,
            step,
            value,
            style: { width: '100%' }
        });

        slider.addEventListener('input', (e) => {
            const newValue = parseFloat(e.target.value);
            labelEl.textContent = `${label}: ${id === 'volume' ? `${Math.round(newValue * 100)}%` : newValue === 0 ? 'OFF' : `${Math.round(newValue * 100)}%`}`;
            onChange(newValue);
        });

        section.appendChild(labelEl);
        section.appendChild(slider);
        return section;
    }

    function createTimerSection(label, id, value, placement, onChange) {
        const section = createElement('div', { style: { marginBottom: '10px' } });
        let labelColor, inputTextColor, inputBgColor, buttonTextColor;

        if (placement === 'top-right') {
            labelColor = '#000';
            inputTextColor = '#000';
            inputBgColor = '#fff';
            buttonTextColor = '#000';
        } else if (placement === 'under-chain') {
            const isDarkMode = document.body.classList.contains('dark-mode');
            labelColor = isDarkMode ? '#fff' : '#000';
            inputTextColor = isDarkMode ? '#fff' : '#000';
            inputBgColor = isDarkMode ? '#333' : '#fff';
            buttonTextColor = isDarkMode ? '#fff' : '#000';
        } else {
            labelColor = '#fff';
            inputTextColor = '#fff';
            inputBgColor = '#333';
            buttonTextColor = '#fff';
        }

        const labelEl = createElement('label', {
            textContent: `${label}:`,
            style: { display: 'block', marginBottom: '5px', color: labelColor }
        });
        const inputContainer = createElement('div', {
            style: { display: 'flex', alignItems: 'center', gap: '5px' }
        });

        const minDecBtn = createElement('button', {
            textContent: '-',
            'aria-label': 'Decrease minutes',
            style: { padding: '2px 5px', fontSize: '12px', color: buttonTextColor }
        });
        const minIncBtn = createElement('button', {
            textContent: '+',
            'aria-label': 'Increase minutes',
            style: { padding: '2px 5px', fontSize: '12px', color: buttonTextColor }
        });
        const secDecBtn = createElement('button', {
            textContent: '-',
            'aria-label': 'Decrease seconds',
            style: { padding: '2px 5px', fontSize: '12px', color: buttonTextColor }
        });
        const secIncBtn = createElement('button', {
            textContent: '+',
            'aria-label': 'Increase seconds',
            style: { padding: '2px 5px', fontSize: '12px', color: buttonTextColor }
        });

        const input = createElement('input', {
            type: 'text',
            id: `${id}Input`,
            value: value === -1 ? 'Off' : formatTime(value),
            'aria-label': 'Timer threshold (MM:SS or Off)',
            style: {
                width: '60px',
                padding: '2px',
                textAlign: 'center',
                color: inputTextColor,
                backgroundColor: inputBgColor,
                border: '1px solid #ccc'
            }
        });

        const updateValue = (totalSeconds) => {
            input.value = totalSeconds <= 0 ? 'Off' : formatTime(totalSeconds);
            onChange(totalSeconds <= 0 ? -1 : totalSeconds);
        };

        const parseTime = () => {
            if (input.value.toLowerCase() === 'off') return -1;
            const match = input.value.match(/^(\d+):(\d{0,2})$/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const totalSeconds = minutes * 60 + seconds;
                if (seconds > 59) return -1;
                return totalSeconds === 0 ? -1 : Math.min(300, Math.max(-1, totalSeconds));
            }
            return -1;
        };

        minDecBtn.addEventListener('click', () => {
            let totalSeconds = parseTime();
            if (totalSeconds === -1) totalSeconds = 0;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            updateValue(Math.max(-1, (minutes - 1) * 60 + seconds));
        });

        minIncBtn.addEventListener('click', () => {
            let totalSeconds = parseTime();
            if (totalSeconds === -1) totalSeconds = 0;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            updateValue(Math.min(300, (minutes + 1) * 60 + seconds));
        });

        secDecBtn.addEventListener('click', () => {
            let totalSeconds = parseTime();
            if (totalSeconds === -1) totalSeconds = 0;
            updateValue(Math.max(-1, totalSeconds - 1));
        });

        secIncBtn.addEventListener('click', () => {
            let totalSeconds = parseTime();
            if (totalSeconds === -1) totalSeconds = 0;
            updateValue(Math.min(300, totalSeconds + 1));
        });

        input.addEventListener('input', () => {
            const validFormat = input.value.match(/^(\d+):(\d{0,2})$|^off$/i);
            input.style.border = validFormat ? '1px solid #ccc' : '1px solid red';
        });

        input.addEventListener('change', () => {
            let totalSeconds = parseTime();
            totalSeconds = Math.max(-1, Math.min(300, totalSeconds));
            updateValue(totalSeconds);
            input.style.border = '1px solid #ccc';
        });

        inputContainer.appendChild(minDecBtn);
        inputContainer.appendChild(minIncBtn);
        inputContainer.appendChild(input);
        inputContainer.appendChild(secDecBtn);
        inputContainer.appendChild(secIncBtn);
        section.appendChild(labelEl);
        section.appendChild(inputContainer);
        return section;
    }

    function formatTime(seconds) {
        if (seconds <= 0) return 'Off';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    const updateContainerPosition = debounce(function(container, title, content) {
        console.debug('[ChainWatch] Updating position to:', settings.placement);
        try {
            if (container.parentNode) {
                console.debug('[ChainWatch] Removing container from parent:', container.parentNode);
                container.parentNode.removeChild(container);
            }

            if (!container.contains(title)) {
                console.debug('[ChainWatch] Reattaching title to container');
                container.appendChild(title);
            }
            if (!container.contains(content)) {
                console.debug('[ChainWatch] Reattaching content to container');
                container.appendChild(content);
            }

            container.style.position = '';
            container.style.top = '';
            container.style.right = '';
            container.style.bottom = '';
            container.style.left = '';
            container.style.width = '';
            container.style.minWidth = '150px';
            container.style.margin = '';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            container.style.borderRadius = '8px';
            container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            container.style.color = '';
            container.style.padding = '5px';
            title.style.color = '#000';
            title.style.textAlign = 'center';
            title.style.fontSize = '16px';
            content.style.backgroundColor = '';
            content.style.padding = '10px 0';
            content.style.position = '';
            content.style.left = '';
            content.style.top = '';
            content.style.width = '';
            const labels = content.querySelectorAll('label');
            labels.forEach(label => label.style.color = '#000');

            if (settings.placement === 'top-right') {
                container.style.position = 'fixed';
                container.style.top = '10px';
                container.style.right = '10px';
                container.style.zIndex = '10000';
                document.body.appendChild(container);
                console.debug('[ChainWatch] Placed at top-right, container attached to body');
            } else if (settings.placement === 'under-chain') {
                const chainBar = document.querySelector('.chain-bar___vjdPL');
                if (chainBar && chainBar.parentNode) {
                    const isDarkMode = document.body.classList.contains('dark-mode');
                    const textColor = isDarkMode ? '#fff' : '#000';
                    container.style.margin = '0 auto';
                    container.style.backgroundColor = 'transparent';
                    container.style.borderRadius = '0';
                    container.style.boxShadow = 'none';
                    title.style.color = textColor;
                    title.style.textAlign = 'center';
                    labels.forEach(label => label.style.color = textColor);
                    const timerSection = content.querySelector(`#timerInput`)?.parentNode.parentNode;
                    if (timerSection) {
                        const newTimerSection = createTimerSection('Timer', 'timer', settings.threshold, settings.placement, (value) => {
                            settings.threshold = value;
                            localStorage.setItem('alertThreshold', value);
                            resetAlertState();
                        });
                        content.replaceChild(newTimerSection, timerSection);
                    }
                    chainBar.parentNode.insertBefore(container, chainBar.nextSibling);
                    console.debug('[ChainWatch] Placed under chain, container attached');
                } else {
                    console.warn('[ChainWatch] Chain bar not found, falling back to top-right');
                    settings.placement = 'top-right';
                    localStorage.setItem('containerPlacement', 'top-right');
                    updateContainerPosition(container, title, content);
                    return;
                }
            } else if (settings.placement === 'settings-menu') {
                const settingsMenu = document.querySelector('ul.settings-menu');
                if (settingsMenu) {
                    const existingItems = settingsMenu.querySelectorAll('.chain-saver');
                    console.debug('[ChainWatch] Found existing chain-saver items:', existingItems.length);
                    existingItems.forEach(item => {
                        console.debug('[ChainWatch] Removing existing chain-saver item');
                        item.remove();
                    });

                    const li = createElement('li', {
                        className: 'setting chain-saver',
                        style: { position: 'relative' }
                    });

                    const label = createElement('label', {
                        className: 'setting-container'
                    });

                    const iconWrapper = createElement('div', { className: 'icon-wrapper' });
                    const iconSpan = createElement('span', {
                        textContent: '⚙️',
                        style: {
                            fontSize: '16px',
                            color: '#fff',
                            lineHeight: '28px',
                            display: 'inline-block',
                            width: '28px',
                            height: '28px',
                            textAlign: 'center'
                        }
                    });
                    iconWrapper.appendChild(iconSpan);

                    const titleSpan = createElement('span', {
                        className: 'setting-name',
                        textContent: 'Chain Saver',
                        style: { flex: '1', color: '#ccc' }
                    });

                    const choiceContainer = createElement('div', { className: 'choice-container' });
                    const arrow = createElement('span', {
                        textContent: '▼',
                        style: { fontSize: '12px', color: '#fff' }
                    });
                    choiceContainer.appendChild(arrow);

                    content.style.display = settings.contentVisible ? 'block' : 'none';
                    content.style.backgroundColor = '#333';
                    content.style.padding = '10px';
                    content.style.borderRadius = '0';
                    content.style.boxShadow = 'none';
                    content.style.position = 'absolute';
                    content.style.left = '0';
                    content.style.top = '100%';
                    content.style.width = '100%';
                    content.style.zIndex = '1000';
                    labels.forEach(label => label.style.color = '#fff');
                    container.removeChild(title);
                    container.removeChild(content);

                    label.appendChild(iconWrapper);
                    label.appendChild(titleSpan);
                    label.appendChild(choiceContainer);
                    li.appendChild(label);
                    li.appendChild(content);

                    label.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const isVisible = content.style.display === 'none';
                        content.style.display = isVisible ? 'block' : 'none';
                        settings.contentVisible = isVisible;
                        localStorage.setItem('contentVisible', isVisible);
                    });

                    const settingsItem = Array.from(settingsMenu.children).find(child =>
                        child.textContent.toLowerCase().includes('settings') ||
                        child.querySelector('a[href*="/preferences.php"]')
                    );
                    if (settingsItem && settingsItem.nextSibling) {
                        settingsMenu.insertBefore(li, settingsItem.nextSibling);
                    } else {
                        settingsMenu.appendChild(li);
                    }
                    console.debug('[ChainWatch] Placed in settings menu, li attached');
                } else {
                    console.warn('[ChainWatch] Settings menu not found, falling back to top-right');
                    settings.placement = 'top-right';
                    localStorage.setItem('containerPlacement', 'top-right');
                    updateContainerPosition(container, title, content);
                    return;
                }
            }

            if (!document.body.contains(container) && settings.placement !== 'settings-menu') {
                console.warn('[ChainWatch] Container not in DOM, reattaching to body');
                document.body.appendChild(container);
            }
            console.debug('[ChainWatch] Container placement complete, in DOM:', document.body.contains(container));
        } catch (error) {
            console.error('[ChainWatch] Error in updateContainerPosition:', error);
            settings.placement = 'top-right';
            localStorage.setItem('containerPlacement', 'top-right');
            container.style.position = 'fixed';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            container.style.borderRadius = '8px';
            container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            title.style.color = '#000';
            if (!container.contains(title)) container.appendChild(title);
            if (!container.contains(content)) container.appendChild(content);
            document.body.appendChild(container);
            console.debug('[ChainWatch] Fallback to top-right due to error');
        }
    }, 100);

function observeChainTimer(callback) {
        try {
            console.debug('[ChainWatch] Starting observer for chain timer');
            const observer = new MutationObserver((mutations) => {
                const timerElement = document.querySelector('.bar-timeleft___B9RGV');
                if (timerElement || window.location.pathname.includes('/preferences.php')) {
                    console.debug('[ChainWatch] Timer or preferences page found, initializing UI');
                    callback();
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                if (!state.isInitialized) {
                    console.debug('[ChainWatch] Fallback UI initialization');
                    callback();
                }
            }, 5000);
        } catch (error) {
            console.error('[ChainWatch] Error in observeChainTimer:', error);
            setTimeout(() => {
                console.debug('[ChainWatch] Fallback UI initialization');
                createUI();
                if (window.location.pathname.includes('/preferences.php')) {
                    createPreferencesPanel();
                }
            }, 1000);
        }
    }

    console.debug('[ChainWatch] Script initializing');
    observeChainTimer(() => {
        createUI();
        if (window.location.pathname.includes('/preferences.php')) {
            createPreferencesPanel();
        }
        setInterval(monitorChain, 1000);
    });
})();