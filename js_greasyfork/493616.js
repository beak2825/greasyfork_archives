// ==UserScript==
// @name         TypePulseX v1 - Typer for Google Docs & Slides
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Types text human-like with personas, emotions, voice input, optional AI-enhanced typing mistakes, themes, soundscapes, and more.
// @author       AWarrior (Reviewed by and written by Reehee)
// @match        https://docs.google.com/document/d/*
// @match        https://docs.google.com/presentation/d/*
// @icon         https://i.imgur.com/nwFO7Ff.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493616/TypePulseX%20v1%20-%20Typer%20for%20Google%20Docs%20%20Slides.user.js
// @updateURL https://update.greasyfork.org/scripts/493616/TypePulseX%20v1%20-%20Typer%20for%20Google%20Docs%20%20Slides.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const DEFAULT_API_KEY = 'Enter your personal API Key here. DO NOT PUBLISH YOUR APIKEY PLEASE. FOR GODS SAKE DONT DO IT.';
    let API_KEY = GM_getValue('typePulseXApiKey', DEFAULT_API_KEY);
    const TYPING_SOUND_URL = 'https://www.soundjay.com/buttons/beep-01a.mp3';
    const DEFAULT_SETTINGS = {
        lowerBound: 60,
        upperBound: 140,
        typoRatePercent: 5,
        enableTypos: true,
        useAdvancedAlgorithm: true,
        enableSentencePauses: false,
        sentencePauseDurationMinutes: 1,
        persona: 'procrastinator',
        emotion: 'neutral',
        theme: 'light',
        soundscape: 'typewriter',
        aiFillerFreq: 0.1,
        aiTypingEnhance: true,
        speedMultiplier: 1.0,
        cursorBlink: true,
        fontSize: 14,
        customColor: '#007AFF',
        enableSound: true,
        enableHaptics: false,
        autoSave: true,
        gamifiedStats: true,
        enableAI: true,
        maxTypoLength: 3,
        typoCharDelayMs: 50,
        typoPreBackspaceDelayMs: 150,
        backspaceDelayMs: 90,
        advSpaceMin: 1.8,
        advSpaceMax: 2.8,
        advWordEndMin: 1.1,
        advWordEndMax: 1.5,
        advPunctuationMultiplier: 1.3,
        advRandomPauseChance: 0.02,
        advRandomPauseMinMs: 150,
        advRandomPauseMaxMs: 400,
        advTypoRecognitionMinMs: 250,
        advTypoRecognitionMaxMs: 800,
        advBackspaceDelayMs: 100,
        sentencePauseProbability: 0.5,
        punctuationPauseMinMs: 500,
        punctuationPauseMaxMs: 1000,
        modeSwitchProbability: 0.05,
        fastModeFactor: 0.8,
        slowModeFactor: 1.2
    };

    const PERSONAS = {
        procrastinator: { typoRateMultiplier: 1.2, pauseFreqMultiplier: 1.5, aiPrompt: 'casual, hesitant tone', quirk: 'ugh', aiTypoStyle: 'random pauses' },
        overthinker: { typoRateMultiplier: 0.8, pauseFreqMultiplier: 1.2, aiPrompt: 'analytical, cautious tone', backspaceFreq: 0.5, quirk: 'hmm', aiTypoStyle: 'frequent backspaces' },
        multitasker: { typoRateMultiplier: 1.0, pauseFreqMultiplier: 1.8, aiPrompt: 'distracted, abrupt tone', quirk: 'brb', aiTypoStyle: 'missed letters' },
        rookie: { typoRateMultiplier: 1.5, pauseFreqMultiplier: 0.8, aiPrompt: 'clumsy, eager tone', quirk: 'oops', aiTypoStyle: 'extra letters' },
        poet: { typoRateMultiplier: 0.5, pauseFreqMultiplier: 1.0, aiPrompt: 'lyrical, dramatic tone', quirk: 'alas', aiTypoStyle: 'subtle hesitations' }
    };

    const EMOTIONS = {
        frustrated: { typoRateMultiplier: 1.5, pauseFreqMultiplier: 1.2, speedMod: 1.2, aiPrompt: 'angry, rushed tone', quirk: 'argh' },
        excited: { typoRateMultiplier: 0.8, pauseFreqMultiplier: 0.8, speedMod: 0.8, aiPrompt: 'energetic, upbeat tone', quirk: '!!' },
        bored: { typoRateMultiplier: 1.0, pauseFreqMultiplier: 1.5, speedMod: 1.5, aiPrompt: 'lazy, monotone tone', quirk: 'zzz' },
        neutral: { typoRateMultiplier: 1.0, pauseFreqMultiplier: 1.0, speedMod: 1.0, aiPrompt: 'neutral tone', quirk: '' },
        inspired: { typoRateMultiplier: 0.6, pauseFreqMultiplier: 0.9, speedMod: 0.9, aiPrompt: 'creative, flowing tone', quirk: 'wow' }
    };

    const SOUNDSCAPES = {
        typewriter: 'https://www.soundjay.com/mechanical/typewriter-key-1.mp3',
        keyboard: 'https://www.soundjay.com/buttons/beep-01a.mp3',
        rain: 'https://www.soundjay.com/nature/rain-01.mp3',
        none: null
    };

    // --- State Variables ---
    let settings = GM_getValue('typePulseXSettings', DEFAULT_SETTINGS);
    let cancelTyping = false;
    let typingInProgress = false;
    let overlayElement = null;
    let infoPopupElement = null;
    let settingsPopupElement = null;
    let isFastMode = false;
    let stats = { time: 0, errors: 0, chars: 0, aiCalls: 0 };
    let inputHistory = [];

    // --- CSS with Enhanced Dragging, Color Matching, and Aesthetics ---
    GM_addStyle(`
        .taqtaq-overlay, .taqtaq-settings {
            position: fixed; padding: 20px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); z-index: 10000;
            display: flex; flex-direction: column; width: 360px; font-family: 'Helvetica Neue', sans-serif; font-size: ${settings.fontSize}px;
            transform: scale(0); opacity: 0; transition: all 0.3s ease-out; background: ${settings.customColor}22; color: #333;
            will-change: transform, top, left; /* Optimize dragging */
        }
        .taqtaq-overlay.active, .taqtaq-settings.active { transform: scale(1); opacity: 1; animation: bounceIn 0.5s ease-out; }
        @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0; }
            60% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
        }
        .taqtaq-header {
            padding: 12px 16px; cursor: move; border-bottom: 1px solid ${settings.customColor}44; border-radius: 16px 16px 0 0;
            display: flex; justify-content: space-between; align-items: center; user-select: none; background: linear-gradient(to bottom, ${settings.customColor}33, ${settings.customColor}22);
        }
        .taqtaq-header-title { font-weight: 600; font-size: 16px; color: ${settings.customColor}; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); }
        .taqtaq-header-title small { font-size: 12px; color: #777; display: block; margin-top: 2px; }
        .taqtaq-info-icon {
            cursor: pointer; font-style: normal; font-weight: bold; color: ${settings.customColor}; border: 2px solid ${settings.customColor};
            border-radius: 50%; width: 22px; height: 22px; display: inline-flex; justify-content: center; align-items: center; font-size: 12px;
            transition: transform 0.2s; background: #fff;
        }
        .taqtaq-info-icon:hover { transform: scale(1.1); }
        .taqtaq-close-btn {
            cursor: pointer; font-size: 24px; color: #888; transition: color 0.2s, transform 0.2s;
        }
        .taqtaq-close-btn:hover { color: #ff4444; transform: scale(1.1); }
        .taqtaq-content { padding: 20px; display: flex; flex-direction: column; gap: 18px; }
        .taqtaq-overlay textarea {
            width: 100%; padding: 12px; border-radius: 10px; resize: vertical; box-sizing: border-box; min-height: 120px; font-size: ${settings.fontSize}px;
            border: 1px solid ${settings.customColor}44; transition: border-color 0.3s, box-shadow 0.3s; background: #fff; color: #333;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .taqtaq-overlay textarea:focus { border-color: ${settings.customColor}; box-shadow: 0 0 8px ${settings.customColor}44; outline: none; }
        .taqtaq-input-group { display: flex; gap: 12px; align-items: center; }
        .taqtaq-input-group label { flex-basis: 60px; font-weight: 500; color: #555; }
        .taqtaq-input-group input[type="number"], .taqtaq-settings input[type="number"], .taqtaq-settings input[type="text"] {
            width: 70px; padding: 8px; border-radius: 8px; border: 1px solid ${settings.customColor}44; font-size: 13px; transition: all 0.3s;
            background: #fff; color: #333; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .taqtaq-input-group input:focus { border-color: ${settings.customColor}; box-shadow: 0 0 6px ${settings.customColor}44; outline: none; }
        .taqtaq-input-group input[type="checkbox"] {
            appearance: none; width: 18px; height: 18px; border: 2px solid ${settings.customColor}; border-radius: 4px; cursor: pointer;
            transition: background-color 0.2s; background: #fff;
        }
        .taqtaq-input-group input[type="checkbox"]:checked { background: ${settings.customColor}; }
        .taqtaq-input-group input[type="checkbox"]:hover { box-shadow: 0 0 4px ${settings.customColor}44; }
        .taqtaq-options-group { display: flex; flex-direction: column; gap: 12px; }
        .taqtaq-checkbox-item { display: flex; align-items: center; gap: 12px; }
        .taqtaq-checkbox-item label { font-size: 13px; }
        .taqtaq-eta, .taqtaq-stats { font-size: 12px; color: #888; text-align: center; font-style: italic; }
        .taqtaq-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
        .taqtaq-button {
            padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; background: ${settings.customColor};
            color: #fff; box-shadow: 0 3px 10px ${settings.customColor}44; transition: all 0.3s ease; font-weight: 500;
        }
        .taqtaq-button:hover { transform: translateY(-3px); box-shadow: 0 6px 14px ${settings.customColor}66; }
        .taqtaq-cancel-button { background: #666; }
        .taqtaq-info-popup {
            position: absolute; border: 1px solid ${settings.customColor}44; border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.2); padding: 16px; max-width: 400px; z-index: 10001;
            background: ${settings.customColor}22; color: #333; transform: scale(0); opacity: 0; transition: all 0.3s;
        }
        .taqtaq-info-popup.active { transform: scale(1); opacity: 1; animation: popIn 0.4s ease-out; }
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .taqtaq-overlay.dark { background: #1C1C1E; color: #E5E5E7; }
        .taqtaq-overlay.light { background: ${settings.customColor}22; color: #333; }
        .taqtaq-overlay.retro { background: #000; color: #0f0; font-family: 'Courier New', monospace; }
        .taqtaq-overlay.dark .taqtaq-header { background: linear-gradient(to bottom, #2C2C2E, #1C1C1E); }
        .taqtaq-overlay.light .taqtaq-header { background: linear-gradient(to bottom, ${settings.customColor}33, ${settings.customColor}22); }
        .taqtaq-overlay.retro .taqtaq-header { background: linear-gradient(to bottom, #111, #000); }
        .taqtaq-overlay.dark textarea, .taqtaq-overlay.dark input[type="number"], .taqtaq-overlay.dark input[type="checkbox"] { background: #2C2C2E; color: #E5E5E7; border: 1px solid #444; }
        .taqtaq-overlay.light textarea, .taqtaq-overlay.light input[type="number"], .taqtaq-overlay.light input[type="checkbox"] { background: #fff; color: #333; border: 1px solid ${settings.customColor}44; }
        .taqtaq-overlay.retro textarea, .taqtaq-overlay.retro input[type="number"], .taqtaq-overlay.retro input[type="checkbox"] { background: #111; color: #0f0; border: 1px solid #0f0; }
        .taqtaq-tab-bar { display: flex; gap: 10px; margin-bottom: 15px; border-bottom: 2px solid ${settings.customColor}44; background: ${settings.customColor}11; padding: 5px; border-radius: 8px; }
        .taqtaq-tab { padding: 8px 15px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.3s; color: #666; border-radius: 6px; }
        .taqtaq-tab.active { border-bottom-color: ${settings.customColor}; color: ${settings.customColor}; background: ${settings.customColor}22; }
        .taqtaq-tab:hover { color: ${settings.customColor}; background: ${settings.customColor}11; }
        .taqtaq-settings-content { padding: 15px; flex-grow: 1; overflow-y: auto; border-radius: 0 0 16px 16px; }
        .blink { animation: blink 0.5s infinite; }
        @keyframes blink { 50% { opacity: 0; } }
    `);

    // --- Main Logic ---
    function initializeScript() {
        console.log('TypePulseX v3.5 initializing...');
        try {
            insertButtons();
        } catch (e) {
            console.error('Initialization error:', e);
        }
    }

    function insertButtons() {
        const extensionsMenu = document.getElementById('docs-extensions-menu');
        if (!extensionsMenu || document.getElementById('typepulsex-button')) return;

        const typePulseButton = createButton('TypePulseX', 'typepulsex-button');
        typePulseButton.addEventListener('click', handleTaqtaqClick);
        const stopButton = createButton('Stop', 'stop-button', true);
        stopButton.style.color = 'red';
        stopButton.addEventListener('click', handleStopClick);

        try {
            console.log('Inserting buttons into Extensions menu...');
            extensionsMenu.parentNode.insertBefore(typePulseButton, extensionsMenu.nextSibling);
            typePulseButton.parentNode.insertBefore(stopButton, typePulseButton.nextSibling);
            console.log('Buttons inserted successfully.');
        } catch (e) {
            console.error('Error inserting buttons:', e);
        }
    }

    function createButton(text, id, hidden = false) {
        const button = document.createElement('div');
        button.textContent = text;
        button.classList.add('menu-button', 'goog-control', 'goog-inline-block');
        button.style.userSelect = 'none';
        button.style.cursor = 'pointer';
        button.id = id;
        if (hidden) button.style.display = 'none';
        return button;
    }

    function handleTaqtaqClick() {
        console.log('TypePulseX button clicked.');
        if (typingInProgress) {
            const stopButton = document.getElementById('stop-button');
            if (stopButton) {
                stopButton.classList.add('blink');
                setTimeout(() => stopButton.classList.remove('blink'), 1000);
            }
            return;
        }
        showOverlay();
    }

    function handleStopClick() {
        if (typingInProgress) {
            cancelTyping = true;
            const stopButton = document.getElementById('stop-button');
            if (stopButton) stopButton.textContent = 'Stopping...';
        }
    }

    function showOverlay() {
        console.log('Attempting to show overlay...');
        if (overlayElement) {
            console.log('Overlay exists, showing it.');
            overlayElement.style.display = 'flex';
            overlayElement.classList.add('active');
            updateUIColor();
            return;
        }

        try {
            overlayElement = document.createElement('div');
            overlayElement.classList.add('taqtaq-overlay', settings.theme);

            const header = document.createElement('div');
            header.classList.add('taqtaq-header');
            const title = document.createElement('div');
            title.classList.add('taqtaq-header-title');
            const titleText = document.createElement('span');
            titleText.textContent = 'TypePulseX v3.5';
            const subtitle = document.createElement('small');
            subtitle.textContent = 'by reehee';
            title.appendChild(titleText);
            title.appendChild(document.createElement('br'));
            title.appendChild(subtitle);

            const iconsContainer = document.createElement('div');
            iconsContainer.style.display = 'flex';
            iconsContainer.style.gap = '10px';
            const infoIcon = document.createElement('i');
            infoIcon.classList.add('taqtaq-info-icon');
            infoIcon.textContent = 'i';
            infoIcon.addEventListener('click', toggleInfoPopup);
            const closeBtn = document.createElement('span');
            closeBtn.classList.add('taqtaq-close-btn');
            closeBtn.textContent = '×';
            closeBtn.addEventListener('click', () => overlayElement.style.display = 'none');
            iconsContainer.appendChild(infoIcon);
            iconsContainer.appendChild(closeBtn);
            header.appendChild(title);
            header.appendChild(iconsContainer);
            overlayElement.appendChild(header);

            const content = document.createElement('div');
            content.classList.add('taqtaq-content');

            const textField = document.createElement('textarea');
            textField.placeholder = 'Type, paste, or speak your text...';
            const voiceButton = document.createElement('button');
            voiceButton.textContent = 'Voice Input';
            voiceButton.classList.add('taqtaq-button');
            voiceButton.addEventListener('click', () => handleVoiceInput(textField));
            const etaLabel = document.createElement('div');
            etaLabel.classList.add('taqtaq-eta');
            const statsLabel = document.createElement('div');
            statsLabel.classList.add('taqtaq-stats');
            statsLabel.textContent = 'Speed: 0 chars/sec | Errors: 0 | AI Calls: 0';

            const buttons = document.createElement('div');
            buttons.classList.add('taqtaq-buttons');
            const settingsButton = document.createElement('button');
            settingsButton.textContent = 'Settings';
            settingsButton.classList.add('taqtaq-button');
            settingsButton.addEventListener('click', showSettingsPopup);
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Start Typing';
            confirmButton.classList.add('taqtaq-button', 'taqtaq-confirm-button');
            confirmButton.addEventListener('click', () => startTypingProcess(textField));
            buttons.appendChild(settingsButton);
            buttons.appendChild(confirmButton);

            content.appendChild(textField);
            content.appendChild(voiceButton);
            content.appendChild(etaLabel);
            content.appendChild(statsLabel);
            content.appendChild(buttons);
            overlayElement.appendChild(content);

            document.body.appendChild(overlayElement);
            overlayElement.style.left = `${Math.max(0, (window.innerWidth - overlayElement.offsetWidth) / 2)}px`;
            overlayElement.style.top = `${Math.max(0, (window.innerHeight - overlayElement.offsetHeight) / 2)}px`;
            setTimeout(() => overlayElement.classList.add('active'), 10);
            makeDraggable(overlayElement, header);
            updateEta(etaLabel, textField);
            textField.addEventListener('input', () => updateEta(etaLabel, textField));
            console.log('Overlay created and appended.');
        } catch (e) {
            console.error('Error creating overlay:', e);
        }
    }

    // --- Settings Popup ---
    function showSettingsPopup() {
        console.log('Attempting to show settings popup...');
        if (settingsPopupElement) {
            settingsPopupElement.style.display = 'flex';
            settingsPopupElement.classList.add('active');
            updateUIColor();
            return;
        }

        settingsPopupElement = document.createElement('div');
        settingsPopupElement.classList.add('taqtaq-settings', settings.theme);
        settingsPopupElement.style.left = '60%';
        settingsPopupElement.style.top = '50%';
        settingsPopupElement.style.transform = 'translate(-50%, -50%)';

        const header = document.createElement('div');
        header.classList.add('taqtaq-header');
        const title = document.createElement('div');
        title.classList.add('taqtaq-header-title');
        title.appendChild(document.createElement('span')).textContent = 'Settings';
        title.appendChild(document.createElement('small')).textContent = 'Customize Your Typer';
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('taqtaq-close-btn');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => settingsPopupElement.style.display = 'none');
        header.appendChild(title);
        header.appendChild(closeBtn);

        const tabBar = document.createElement('div');
        tabBar.classList.add('taqtaq-tab-bar');
        const tabs = [
            { id: 'typing', label: 'Typing' },
            { id: 'ai', label: 'AI' },
            { id: 'ui', label: 'UI' }
        ];
        tabs.forEach(tab => {
            const tabElement = document.createElement('div');
            tabElement.classList.add('taqtaq-tab');
            tabElement.textContent = tab.label;
            tabElement.dataset.tab = tab.id;
            tabElement.addEventListener('click', () => switchTab(tab.id));
            tabBar.appendChild(tabElement);
        });

        const content = document.createElement('div');
        content.classList.add('taqtaq-settings-content');
        content.appendChild(createTypingSettings());
        content.appendChild(createAISettings());
        content.appendChild(createUISettings());
        switchTab('typing');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('taqtaq-button', 'taqtaq-confirm-button');
        saveButton.addEventListener('click', () => {
            saveSettings();
            settingsPopupElement.style.display = 'none';
        });

        settingsPopupElement.appendChild(header);
        settingsPopupElement.appendChild(tabBar);
        settingsPopupElement.appendChild(content);
        settingsPopupElement.appendChild(saveButton);
        document.body.appendChild(settingsPopupElement);
        setTimeout(() => settingsPopupElement.classList.add('active'), 10);
        makeDraggable(settingsPopupElement, header);
        console.log('Settings popup created and appended.');
    }

    function switchTab(tabId) {
        const tabs = settingsPopupElement.querySelectorAll('.taqtaq-tab');
        const contents = settingsPopupElement.querySelectorAll('.taqtaq-settings-tab');
        tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabId));
        contents.forEach(content => content.style.display = content.id === `tab-${tabId}` ? 'block' : 'none');
    }

    function createTypingSettings() {
        const tab = document.createElement('div');
        tab.id = 'tab-typing';
        tab.classList.add('taqtaq-settings-tab');
        tab.appendChild(createInputGroup('Speed Min (ms)', 'number', settings.lowerBound, val => { settings.lowerBound = val; }));
        tab.appendChild(createInputGroup('Speed Max (ms)', 'number', settings.upperBound, val => { settings.upperBound = val; }));
        tab.appendChild(createInputGroup('Typos (%)', 'number', settings.typoRatePercent, val => { settings.typoRatePercent = val; }));
        tab.appendChild(createInputGroup('Enable Typos', 'checkbox', settings.enableTypos, val => { settings.enableTypos = val; }));
        tab.appendChild(createInputGroup('Advanced Rhythm', 'checkbox', settings.useAdvancedAlgorithm, val => { settings.useAdvancedAlgorithm = val; }));
        tab.appendChild(createInputGroup('Sentence Pauses', 'checkbox', settings.enableSentencePauses, val => { settings.enableSentencePauses = val; }));
        tab.appendChild(createInputGroup('Pause Duration (min)', 'number', settings.sentencePauseDurationMinutes, val => { settings.sentencePauseDurationMinutes = val; }));
        tab.appendChild(createInputGroup('Persona', 'select', settings.persona, val => { settings.persona = val; }, Object.keys(PERSONAS)));
        tab.appendChild(createInputGroup('Emotion', 'select', settings.emotion, val => { settings.emotion = val; }, Object.keys(EMOTIONS)));
        return tab;
    }

    function createAISettings() {
        const tab = document.createElement('div');
        tab.id = 'tab-ai';
        tab.classList.add('taqtaq-settings-tab');
        tab.style.display = 'none';
        tab.appendChild(createInputGroup('Enable AI', 'checkbox', settings.enableAI, val => {
            if (val && API_KEY === DEFAULT_API_KEY) {
                alert('Please input an API Key to be able to run this part of the program. (Sorry I’d love to give you all this myself but it’s just not possible.) Also make sure to get an API Key from OpenAI, it will work the best. Note: This feature is in beta, so it’s not perfect—don’t expect miracles!');
                settings.enableAI = false;
            } else {
                settings.enableAI = val;
            }
        }));
        tab.appendChild(createInputGroup('AI Typing Enhance', 'checkbox', settings.aiTypingEnhance, val => {
            if (val && API_KEY === DEFAULT_API_KEY) {
                alert('Please input an API Key to be able to run this part of the program. (Sorry I’d love to give you all this myself but it’s just not possible.) Also make sure to get an API Key from OpenAI, it will work the best. Note: This feature is in beta, so it’s not perfect—don’t expect miracles!');
                settings.aiTypingEnhance = false;
            } else {
                settings.aiTypingEnhance = val;
            }
        }));
        tab.appendChild(createInputGroup('AI Filler Freq (%)', 'number', settings.aiFillerFreq * 100, val => { settings.aiFillerFreq = val / 100; }));
        tab.appendChild(createInputGroup('API Key', 'text', API_KEY, val => {
            API_KEY = val || DEFAULT_API_KEY;
            GM_setValue('typePulseXApiKey', API_KEY);
            console.log('API Key updated to:', API_KEY);
        }));
        const note = document.createElement('p');
        note.textContent = 'Note: Input your OpenAI API key here and DO NOT SHARE IT WITH ANYONE!';
        note.style.fontSize = '12px';
        note.style.color = '#ff4444';
        tab.appendChild(note);
        return tab;
    }

    function createUISettings() {
        const tab = document.createElement('div');
        tab.id = 'tab-ui';
        tab.classList.add('taqtaq-settings-tab');
        tab.style.display = 'none';
        tab.appendChild(createInputGroup('Theme', 'select', settings.theme, val => { settings.theme = val; }, ['dark', 'light', 'retro']));
        tab.appendChild(createInputGroup('Soundscape', 'select', settings.soundscape, val => { settings.soundscape = val; }, Object.keys(SOUNDSCAPES)));
        tab.appendChild(createInputGroup('Font Size (px)', 'number', settings.fontSize, val => { settings.fontSize = val; }));
        tab.appendChild(createInputGroup('Custom Color', 'color', settings.customColor, val => { settings.customColor = val; }));
        tab.appendChild(createInputGroup('Cursor Blink', 'checkbox', settings.cursorBlink, val => { settings.cursorBlink = val; }));
        tab.appendChild(createInputGroup('Enable Sound', 'checkbox', settings.enableSound, val => { settings.enableSound = val; }));
        tab.appendChild(createInputGroup('Enable Haptics', 'checkbox', settings.enableHaptics, val => { settings.enableHaptics = val; }));
        tab.appendChild(createInputGroup('Auto-Save', 'checkbox', settings.autoSave, val => { settings.autoSave = val; }));
        tab.appendChild(createInputGroup('Gamified Stats', 'checkbox', settings.gamifiedStats, val => { settings.gamifiedStats = val; }));
        return tab;
    }

    function createInputGroup(labelText, type, value, onChange, options = null) {
        const group = document.createElement('div');
        group.classList.add('taqtaq-input-group');
        const label = document.createElement('label');
        label.textContent = labelText;
        let input;

        if (type === 'select') {
            input = document.createElement('select');
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
                input.appendChild(option);
            });
            input.value = value;
        } else {
            input = document.createElement('input');
            input.type = type;
            if (type === 'checkbox') input.checked = value;
            else input.value = value;
        }

        input.addEventListener('change', () => {
            if (type === 'checkbox') onChange(input.checked);
            else if (type === 'number') onChange(parseFloat(input.value) || 0);
            else onChange(input.value);
        });
        group.appendChild(label);
        group.appendChild(input);
        return group;
    }

    function saveSettings() {
        GM_setValue('typePulseXSettings', settings);
        updateTheme();
        updateUIColor();
        if (overlayElement) {
            overlayElement.querySelector('textarea').style.fontSize = `${settings.fontSize}px`;
        }
    }

    function updateEta(etaLabel, textField) {
        const charCount = textField.value.length;
        const low = settings.lowerBound;
        const high = settings.upperBound;
        if (charCount > 0 && low >= 0 && high >= low) {
            let baseMs = charCount * ((low + high) / 2);
            if (settings.enableTypos) baseMs += charCount * (settings.typoRatePercent / 100) * 500;
            const etaMinutes = Math.ceil(baseMs / 60000);
            etaLabel.textContent = `ETA: ~${etaMinutes} min`;
        } else {
            etaLabel.textContent = '';
        }
    }

    function updateTheme() {
        if (overlayElement) overlayElement.classList.replace(overlayElement.classList[1], settings.theme);
        if (settingsPopupElement) settingsPopupElement.classList.replace(settingsPopupElement.classList[1], settings.theme);
    }

    function updateUIColor() {
        GM_addStyle(`
            .taqtaq-overlay, .taqtaq-settings { background: ${settings.customColor}22; }
            .taqtaq-header { background: linear-gradient(to bottom, ${settings.customColor}33, ${settings.customColor}22); border-bottom-color: ${settings.customColor}44; }
            .taqtaq-header-title { color: ${settings.customColor}; }
            .taqtaq-info-icon { color: ${settings.customColor}; border-color: ${settings.customColor}; }
            .taqtaq-button { background: ${settings.customColor}; box-shadow: 0 3px 10px ${settings.customColor}44; }
            .taqtaq-button:hover { box-shadow: 0 6px 14px ${settings.customColor}66; }
            .taqtaq-overlay textarea, .taqtaq-settings input[type="number"], .taqtaq-settings input[type="text"] { border-color: ${settings.customColor}44; }
            .taqtaq-overlay textarea:focus, .taqtaq-settings input:focus { border-color: ${settings.customColor}; box-shadow: 0 0 6px ${settings.customColor}44; }
            .taqtaq-input-group input[type="checkbox"] { border-color: ${settings.customColor}; }
            .taqtaq-input-group input[type="checkbox"]:checked { background: ${settings.customColor}; }
            .taqtaq-input-group input[type="checkbox"]:hover { box-shadow: 0 0 4px ${settings.customColor}44; }
            .taqtaq-tab-bar { border-bottom-color: ${settings.customColor}44; background: ${settings.customColor}11; }
            .taqtaq-tab.active { border-bottom-color: ${settings.customColor}; color: ${settings.customColor}; background: ${settings.customColor}22; }
            .taqtaq-tab:hover { color: ${settings.customColor}; background: ${settings.customColor}11; }
            .taqtaq-info-popup { background: ${settings.customColor}22; border-color: ${settings.customColor}44; }
        `);
    }

    function toggleInfoPopup(event) {
        if (infoPopupElement) hideInfoPopup();
        else showInfoPopup(event.target);
        event.stopPropagation();
    }

    function showInfoPopup(iconElement) {
        try {
            hideInfoPopup();
            infoPopupElement = document.createElement('div');
            infoPopupElement.classList.add('taqtaq-info-popup');
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Instructions:';
            p.appendChild(strong);
            const ul = document.createElement('ul');
            [
                'Enter text or use voice input.',
                'Adjust settings via Settings button.',
                'Click "Start Typing" to begin.',
                'Keep tab active for best results.'
            ].forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                ul.appendChild(li);
            });
            infoPopupElement.appendChild(p);
            infoPopupElement.appendChild(ul);
            document.body.appendChild(infoPopupElement);
            const rect = iconElement.getBoundingClientRect();
            infoPopupElement.style.top = `${rect.bottom + window.scrollY + 5}px`;
            infoPopupElement.style.left = `${rect.left + window.scrollX}px`;
            setTimeout(() => infoPopupElement.classList.add('active'), 10);
            document.addEventListener('click', handleClickOutsideInfoPopup, true);
        } catch (e) {
            console.error('Error showing info popup:', e);
        }
    }

    function handleClickOutsideInfoPopup(event) {
        if (infoPopupElement && !infoPopupElement.contains(event.target) && !event.target.classList.contains('taqtaq-info-icon')) {
            hideInfoPopup();
        }
    }

    function hideInfoPopup() {
        if (infoPopupElement) {
            infoPopupElement.remove();
            infoPopupElement = null;
            document.removeEventListener('click', handleClickOutsideInfoPopup, true);
        }
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.transition = 'none'; // Disable transition during drag
            document.onmousemove = throttle(elementDrag, 10); // Faster throttle (100fps)
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                element.style.transition = 'all 0.3s ease-out'; // Re-enable transition
            };
        };
        function elementDrag(e) {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            requestAnimationFrame(() => {
                element.style.top = `${Math.max(0, Math.min(window.innerHeight - element.offsetHeight, element.offsetTop - pos2))}px`;
                element.style.left = `${Math.max(0, Math.min(window.innerWidth - element.offsetWidth, element.offsetLeft - pos1))}px`;
            });
        }
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    async function handleVoiceInput(textField) {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input not supported in this browser.');
            return;
        }
        try {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                textField.value = transcript;
            };
            recognition.onerror = (e) => console.error('Voice recognition error:', e);
            recognition.start();
            setTimeout(() => recognition.stop(), 5000);
        } catch (e) {
            console.error('Error with voice input:', e);
        }
    }

    async function startTypingProcess(textField) {
        const inputElement = findInputElement();
        if (!inputElement) {
            alert('Could not find input area. Place cursor in Doc/Slide.');
            return;
        }
        const text = textField.value.trim();
        if (!text) {
            alert('Please enter text to type.');
            return;
        }
        typingInProgress = true;
        cancelTyping = false;
        stats = { time: 0, errors: 0, chars: 0, aiCalls: 0 };
        overlayElement.style.display = 'none';
        const stopButton = document.getElementById('stop-button');
        if (stopButton) stopButton.style.display = 'inline-block';
        try {
            const start = Date.now();
            await typeStringWithLogic(inputElement, text);
            stats.time = Date.now() - start;
            updateStats();
            if (settings.autoSave) inputHistory.push(text);
        } catch (e) {
            console.error('Typing process error:', e);
        } finally {
            typingInProgress = false;
            if (stopButton) {
                stopButton.style.display = 'none';
                stopButton.textContent = 'Stop';
            }
        }
    }

    function findInputElement() {
        try {
            const iframe = document.querySelector('.docs-texteventtarget-iframe');
            if (iframe && iframe.contentDocument) {
                return iframe.contentDocument.activeElement || iframe.contentDocument.body;
            }
            return document.activeElement || document.body;
        } catch (e) {
            console.error('Error finding input element:', e);
            return null;
        }
    }

    async function typeStringWithLogic(inputElement, string) {
        const personaSettings = PERSONAS[settings.persona];
        const emotionSettings = EMOTIONS[settings.emotion];
        let i = 0;
        while (i < string.length) {
            if (cancelTyping) break;
            if (/\w/.test(string[i])) {
                const wordStart = i;
                while (i < string.length && /\w/.test(string[i])) i++;
                const word = string.slice(wordStart, i);
                const typoRate = settings.typoRatePercent * (personaSettings.typoRateMultiplier || 1) * (emotionSettings.typoRateMultiplier || 1);
                const hasTypo = settings.enableTypos && Math.random() < (typoRate / 100);
                await typeWord(inputElement, string, wordStart, i, hasTypo ? Math.floor(Math.random() * (word.length - 1)) : -1);
            } else {
                const delayMs = calculateDelay(string, i);
                await simulateKey(inputElement, string[i], delayMs);
                if (/[.!?]/.test(string[i]) && settings.enableSentencePauses && Math.random() < settings.sentencePauseProbability) {
                    await delay(settings.sentencePauseDurationMinutes * 60 * 1000);
                }
                i++;
                stats.chars++;
            }
            if (settings.enableAI && Math.random() < settings.aiFillerFreq * (personaSettings.pauseFreqMultiplier || 1) * (emotionSettings.pauseFreqMultiplier || 1)) {
                const filler = await generateAIText(`Short ${personaSettings.aiPrompt} phrase`, 10);
                await delay(500);
                await typeText(inputElement, filler + ' ', 100);
                await delay(500);
                for (let j = 0; j < filler.length + 1; j++) await simulateKey(inputElement, '\b', 50);
                stats.aiCalls++;
            }
            if (settings.gamifiedStats && Math.random() < 0.01) {
                const scoreText = ` [Score: ${stats.chars}] `;
                await typeText(inputElement, scoreText, 50);
                await delay(1000);
                for (let j = 0; j < scoreText.length; j++) await simulateKey(inputElement, '\b', 50);
            }
            if (Math.random() < settings.modeSwitchProbability) isFastMode = !isFastMode;
        }
    }

    async function typeWord(inputElement, string, start, end, typoPosition) {
        const personaSettings = PERSONAS[settings.persona];
        for (let j = start; j < end; j++) {
            if (cancelTyping) return;
            let delayMs = calculateDelay(string, j);
            if (j === typoPosition || (settings.enableAI && settings.aiTypingEnhance && Math.random() < 0.1)) {
                if (settings.aiTypingEnhance && settings.enableAI) {
                    await aiSimulateTypo(inputElement, string[j], personaSettings.aiTypoStyle);
                } else {
                    const wrongChar = getNearbyKey(string[j]);
                    await simulateKey(inputElement, wrongChar, settings.typoCharDelayMs);
                    const extraTypos = Math.floor(Math.random() * settings.maxTypoLength);
                    for (let k = 0; k < extraTypos; k++) {
                        await simulateKey(inputElement, getNearbyKey(string[j]), settings.typoCharDelayMs);
                    }
                    await delay(settings.useAdvancedAlgorithm ?
                        Math.random() * (settings.advTypoRecognitionMaxMs - settings.advTypoRecognitionMinMs) + settings.advTypoRecognitionMinMs :
                        settings.typoPreBackspaceDelayMs);
                    for (let k = 0; k < extraTypos + 1; k++) {
                        await simulateKey(inputElement, '\b', settings.useAdvancedAlgorithm ? settings.advBackspaceDelayMs : settings.backspaceDelayMs);
                    }
                }
                stats.errors++;
            }
            await simulateKey(inputElement, string[j], delayMs);
            stats.chars++;
        }
    }

    async function aiSimulateTypo(inputElement, correctChar, typoStyle) {
        switch (typoStyle) {
            case 'random pauses':
                await delay(Math.random() * 300 + 200);
                await simulateKey(inputElement, correctChar, 0);
                break;
            case 'frequent backspaces':
                await simulateKey(inputElement, getNearbyKey(correctChar), settings.typoCharDelayMs);
                await delay(200);
                await simulateKey(inputElement, '\b', settings.backspaceDelayMs);
                await simulateKey(inputElement, correctChar, 0);
                break;
            case 'missed letters':
                if (Math.random() < 0.5) await simulateKey(inputElement, correctChar, 0);
                else {
                    await delay(150);
                    await simulateKey(inputElement, correctChar, 0);
                }
                break;
            case 'extra letters':
                await simulateKey(inputElement, correctChar, settings.typoCharDelayMs);
                const extra = Math.floor(Math.random() * 2);
                for (let i = 0; i < extra; i++) {
                    await simulateKey(inputElement, getNearbyKey(correctChar), settings.typoCharDelayMs);
                }
                await delay(300);
                for (let i = 0; i < extra; i++) {
                    await simulateKey(inputElement, '\b', settings.backspaceDelayMs);
                }
                break;
            case 'subtle hesitations':
                await delay(Math.random() * 150 + 100);
                await simulateKey(inputElement, correctChar, 0);
                if (Math.random() < 0.3) {
                    await simulateKey(inputElement, '\b', settings.backspaceDelayMs);
                    await delay(100);
                    await simulateKey(inputElement, correctChar, 0);
                }
                break;
            default:
                await simulateKey(inputElement, getNearbyKey(correctChar), settings.typoCharDelayMs);
                await delay(200);
                await simulateKey(inputElement, '\b', settings.backspaceDelayMs);
                await simulateKey(inputElement, correctChar, 0);
        }
        stats.aiCalls++;
    }

    function calculateDelay(string, i) {
        let baseDelay = Math.random() * (settings.upperBound - settings.lowerBound) + settings.lowerBound;
        if (settings.useAdvancedAlgorithm) {
            const prevChar = i > 0 ? string[i - 1] : null;
            const nextChar = i < string.length - 1 ? string[i + 1] : null;
            if (prevChar === ' ') baseDelay *= Math.random() * (settings.advSpaceMax - settings.advSpaceMin) + settings.advSpaceMin;
            else if (/[.,!?;:]/.test(prevChar)) baseDelay *= settings.advPunctuationMultiplier;
            else if (/\w/.test(string[i]) && (nextChar === ' ' || !nextChar)) baseDelay *= Math.random() * (settings.advWordEndMax - settings.advWordEndMin) + settings.advWordEndMin;
            if (Math.random() < settings.advRandomPauseChance) baseDelay += Math.random() * (settings.advRandomPauseMaxMs - settings.advRandomPauseMinMs) + settings.advRandomPauseMinMs;
        }
        return baseDelay * (isFastMode ? settings.fastModeFactor : settings.slowModeFactor) * settings.speedMultiplier * (EMOTIONS[settings.emotion].speedMod || 1);
    }

    async function simulateKey(inputElement, charOrCode, keyDelay) {
        if (cancelTyping) return;
        try {
            const eventProps = { bubbles: true, cancelable: true };
            let eventType, keyEventProps;
            if (charOrCode === '\n') {
                eventType = 'keydown';
                keyEventProps = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 };
            } else if (charOrCode === '\b') {
                eventType = 'keydown';
                keyEventProps = { key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8 };
            } else {
                eventType = 'keypress';
                keyEventProps = { key: charOrCode, charCode: charOrCode.charCodeAt(0), keyCode: charOrCode.charCodeAt(0), which: charOrCode.charCodeAt(0) };
            }
            Object.assign(eventProps, keyEventProps);
            const event = new KeyboardEvent(eventType, eventProps);
            inputElement.dispatchEvent(event);
            if (settings.enableSound) playTypingSound(SOUNDSCAPES[settings.soundscape] || TYPING_SOUND_URL);
            if (settings.enableHaptics) window.navigator.vibrate?.(10);
            await delay(keyDelay);
        } catch (e) {
            console.error('Error simulating key:', e);
        }
    }

    async function typeText(inputElement, text, delayMs) {
        for (let char of text) {
            await simulateKey(inputElement, char, delayMs);
        }
    }

    async function generateAIText(prompt, maxTokens) {
        if (!API_KEY || API_KEY === DEFAULT_API_KEY) {
            await delay(500);
            return 'uhh...';
        }
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.openai.com/v1/completions',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
                data: JSON.stringify({ model: 'text-davinci-003', prompt, max_tokens: maxTokens }),
                onload: (response) => resolve(JSON.parse(response.responseText).choices[0].text.trim()),
                onerror: () => {
                    delay(500).then(() => resolve('uhh...'));
                }
            });
        });
    }

    function playTypingSound(url) {
        try {
            new Audio(url).play().catch(e => console.warn('Sound playback failed:', e));
        } catch (e) {
            console.error('Error playing sound:', e);
        }
    }

    function updateStats() {
        const speed = stats.time > 0 ? (stats.chars / (stats.time / 1000)).toFixed(2) : 0;
        const statsLabel = document.querySelector('.taqtaq-stats');
        if (statsLabel) statsLabel.textContent = `Speed: ${speed} chars/sec | Errors: ${stats.errors} | AI Calls: ${stats.aiCalls}`;
    }

    function getNearbyKey(char) {
        const keyboard = {
            'q': 'wa', 'w': 'qase', 'e': 'wsdr', 'r': 'edft', 't': 'rfgy', 'y': 'tghu', 'u': 'yhji', 'i': 'ujko', 'o': 'iklp', 'p': 'ol',
            'a': 'qsxz', 's': 'awdcz', 'd': 'serfx', 'f': 'drtgv', 'g': 'ftyhb', 'h': 'gyujn', 'j': 'huikm', 'k': 'jiol', 'l': 'kop'
        };
        const lowerChar = char.toLowerCase();
        const adjacent = keyboard[lowerChar] || char;
        return adjacent[Math.floor(Math.random() * adjacent.length)] || char;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(() => resolve(!cancelTyping), ms));
    }

    const initInterval = setInterval(() => {
        if (document.getElementById('docs-extensions-menu') && document.querySelector('.docs-texteventtarget-iframe')) {
            console.log('Extensions menu and iframe found, initializing...');
            clearInterval(initInterval);
            initializeScript();
        } else {
            console.log('Waiting for Extensions menu or iframe...');
        }
    }, 500);

    setTimeout(() => {
        if (!document.getElementById('typepulsex-button')) {
            console.error('Initialization timeout. Script may not work on this page. Check if Extensions menu exists.');
            clearInterval(initInterval);
        }
    }, 10000);
})();