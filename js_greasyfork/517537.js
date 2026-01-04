// ==UserScript==
// @name         WebMD Retro Theme
// @namespace    http://tampermonkey.net/
// @version      2024-11-15
// @license MIT
// @description  Customizable theme for Web MiniDisc Pro, configuration can be found at the bottom of the settings dialog
// @author       Pablo Maciá
// @match        https://web.minidisc.wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517537/WebMD%20Retro%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/517537/WebMD%20Retro%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MIN_BRIGHTNESS = 2;
    const MAX_BRIGHTNESS = 10;

    const themes = {
        white:   ['#F0F0F0', '#AAAAAA', '#555555', '#000000'],
        gray:    ['#7F7F7F', '#555555', '#2A2A2A', '#000000'],
        red:     ['#FF0000', '#AA0000', '#550000', '#000000'],
        orange:  ['#FF7F00', '#AA5500', '#552A00', '#000000'],
        yellow:  ['#FFFF00', '#AAAA00', '#555500', '#000000'],
        leaf:    ['#7FFF00', '#55AA00', '#2A5500', '#000000'],
        green:   ['#00FF00', '#00AA00', '#005500', '#000000'],
        aqua:    ['#00FF7F', '#00AA55', '#00552A', '#000000'],
        cyan:    ['#00FFFF', '#00AAAA', '#005555', '#000000'],
        azure:   ['#007FFF', '#0055AA', '#002A55', '#000000'],
        blue:    ['#0000FF', '#0000AA', '#000055', '#000000'],
        purple:  ['#7F00FF', '#5500AA', '#2A0055', '#000000'],
        pink:    ['#FF007F', '#AA0055', '#55002A', '#000000'],
        magenta: ['#FF00FF', '#AA00AA', '#550055', '#000000'],
        DMG:     ['#8cad28', '#6c9421', '#426b29', '#214231'],
    };

    const filters = {
        none: 'none',
        crt1: 'crt1',
        crt2: 'crt2',
        lcd: 'lcd'
    };

    const settings = {
        enabled: true,
        darkMode: true,
        theme: 'white',
        filter: filters.none,
        brightness: 10,
    };

    let themeLoaded = false;
    let activeTheme;
    let themeStyle;
    let pageStyle;
    let screenFilter;
    let screenBrightnessFilter;

    function readSetting(key, defaultValue) {
        return localStorage[key] === undefined ? defaultValue : localStorage[key];
    }

    function loadSettings() {
        settings.enabled = readSetting('rt_enabled', settings.enabled);
        settings.darkMode = readSetting('rt_dark_mode', settings.darkMode);
        settings.theme = readSetting('rt_theme', settings.theme);
        settings.filter = readSetting('rt_filter', settings.filter);
        settings.brightness = readSetting('rt_brightness', settings.brightness);
        saveSettings();
    }

    function saveSettings() {
        localStorage.rt_enabled = settings.enabled;
        localStorage.rt_dark_mode = settings.darkMode;
        localStorage.rt_theme = settings.theme;
        localStorage.rt_filter = settings.filter;
        localStorage.rt_brightness = settings.brightness;
    }

    function setEnabledSetting(value) {
        settings.enabled = value;
        saveSettings();
    }

    function setDarkModeSetting(value) {
        settings.darkMode = value;
        saveSettings();
    }

    function setThemeSetting(value) {
        settings.theme = value;
        saveSettings();
    }

    function setFilterSetting(value) {
        settings.filter = value;
        saveSettings();
    }

    function setBrightnessSetting(value) {
        settings.brightness = value;
        saveSettings();
        setBrightness(settings.brightness);
    }

    function init() {
        loadSettings();
        initEvents();
        if (settings.enabled === 'true') {
            insertStyles();
            insertScreenModifiers();
            themeLoaded = true;
        }
    }

    function initEvents() {
        initOnSettingsDialogOpenEvent();
    }

    function initOnSettingsDialogOpenEvent() {
        const body = document.querySelector('body');
        const config = { childList: true };
        const callback = (mutationsList, observer) => {
            let settingsDialog = null;

            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.classList.contains('MuiDialog-root') && node.querySelector('h2').innerText == 'Settings') {
                            settingsDialog = node;
                            break;
                        }
                    }
                }
            }

            if (settingsDialog) {
                insertThemeSettingsToDialog(settingsDialog);
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(body, config);
    }

    function insertThemeSettingsToDialog(dialog) {
        const content = dialog.querySelector('.MuiDialogContent-root');
        console.log(content);

        const sectionLabel = document.createElement('p');
        sectionLabel.classList.add('MuiTypography-root', 'MuiDialogContentText-root', 'MuiTypography-body1', 'css-1rddy68-header');
        sectionLabel.innerText = 'WebMD Retro Theme (Reload to apply changes)';
        content.appendChild(sectionLabel);

        const enabledLabel = document.createElement('label');
        enabledLabel.classList.add('MuiFormControlLabel-root', 'MuiFormControlLabel-labelPlacementStart', 'css-1q5bp8s-propertyBox');
        content.appendChild(enabledLabel);

        const enabledCb = document.createElement('input');
        enabledCb.id = 'rt_enabled';
        enabledCb.checked = settings.enabled === 'true';
        enabledCb.type = 'checkbox';
        enabledCb.addEventListener('change', () => { setEnabledSetting(enabledCb.checked); });
        enabledLabel.appendChild(enabledCb);

        const enabledLabelText = document.createElement('span');
        enabledLabelText.classList.add('MuiTypography-root', 'MuiTypography-body1', 'MuiFormControlLabel-label', 'css-1fmsrhg-spread');
        enabledLabelText.innerText = 'Enable retro theme';
        enabledLabel.appendChild(enabledLabelText);

        const darkModeLabel = document.createElement('label');
        darkModeLabel.classList.add('MuiFormControlLabel-root', 'MuiFormControlLabel-labelPlacementStart', 'css-1q5bp8s-propertyBox');
        content.appendChild(darkModeLabel);

        const darkModeCb = document.createElement('input');
        darkModeCb.id = 'rt_dark_mode';
        darkModeCb.type = 'checkbox';
        darkModeCb.checked = settings.darkMode === 'true';
        darkModeCb.addEventListener('change', () => { setDarkModeSetting(darkModeCb.checked); });
        darkModeLabel.appendChild(darkModeCb);

        const darkModeLabelText = document.createElement('span');
        darkModeLabelText.classList.add('MuiTypography-root', 'MuiTypography-body1', 'MuiFormControlLabel-label', 'css-1fmsrhg-spread');
        darkModeLabelText.innerText = 'Dark mode';
        darkModeLabel.appendChild(darkModeLabelText);

        const themeLabel = document.createElement('label');
        themeLabel.classList.add('MuiFormControlLabel-root', 'MuiFormControlLabel-labelPlacementStart', 'css-1q5bp8s-propertyBox');
        content.appendChild(themeLabel);

        const themeSelect = document.createElement('select');
        themeSelect.id = 'rt_theme';
        themeSelect.addEventListener('change', () => { setThemeSetting(themeSelect.value); });
        themeLabel.appendChild(themeSelect);

        Object.keys(themes).forEach(themeName => {
            const themeOption = document.createElement('option');
            themeOption.innerText = themeName;
            themeOption.value = themeName;
            if (themeName === settings.theme) {
                themeOption.selected = true;
            }
            themeSelect.appendChild(themeOption);
        });

        const themeLabelText = document.createElement('span');
        themeLabelText.classList.add('MuiTypography-root', 'MuiTypography-body1', 'MuiFormControlLabel-label', 'css-1fmsrhg-spread');
        themeLabelText.innerText = 'Theme';
        themeLabel.appendChild(themeLabelText);

        const filterLabel = document.createElement('label');
        filterLabel.classList.add('MuiFormControlLabel-root', 'MuiFormControlLabel-labelPlacementStart', 'css-1q5bp8s-propertyBox');
        content.appendChild(filterLabel);

        const filterSelect = document.createElement('select');
        filterSelect.id = 'rt_filter';
        filterSelect.addEventListener('change', () => { setFilterSetting(filterSelect.value); });
        filterLabel.appendChild(filterSelect);

        Object.keys(filters).forEach(filterName => {
            const filterOption = document.createElement('option');
            filterOption.innerText = filterName;
            filterOption.value = filterName;
            if (filterName === settings.filter) {
                filterOption.selected = true;
            }
            filterSelect.appendChild(filterOption);
        });

        const filterLabelText = document.createElement('span');
        filterLabelText.classList.add('MuiTypography-root', 'MuiTypography-body1', 'MuiFormControlLabel-label', 'css-1fmsrhg-spread');
        filterLabelText.innerText = 'Filter';
        filterLabel.appendChild(filterLabelText);

        const brightnessLabel = document.createElement('label');
        brightnessLabel.classList.add('MuiFormControlLabel-root', 'MuiFormControlLabel-labelPlacementStart', 'css-1q5bp8s-propertyBox');
        content.appendChild(brightnessLabel);

        const brightnessRange = document.createElement('input');
        brightnessRange.id = 'rt_brightness';
        brightnessRange.type = 'range';
        brightnessRange.min = MIN_BRIGHTNESS;
        brightnessRange.max = MAX_BRIGHTNESS;
        brightnessRange.value = settings.brightness;
        brightnessRange.addEventListener('change', () => { setBrightnessSetting(brightnessRange.value); });
        brightnessLabel.appendChild(brightnessRange);

        const brightnessLabelText = document.createElement('span');
        brightnessLabelText.classList.add('MuiTypography-root', 'MuiTypography-body1', 'MuiFormControlLabel-label', 'css-1fmsrhg-spread');
        brightnessLabelText.innerText = 'Brightness';
        brightnessLabel.appendChild(brightnessLabelText);
    }

    function getThemeColor(colorIndex) {
        return activeTheme[settings.darkMode === 'true' ? 3 - colorIndex : colorIndex];
    }

    function generateThemeStyles() {
        return ':root{--color-0: ' + getThemeColor(0) + '; --color-1: ' + getThemeColor(1) + '; --color-2: ' + getThemeColor(2) + '; --color-3: ' + getThemeColor(3) + '}';
    }

    function setActiveTheme(newTheme) {
        activeTheme = newTheme;

        if (!themeStyle) {
            themeStyle = document.createElement('style');
            document.getElementsByTagName('body')[0].appendChild(themeStyle);
        }

        themeStyle.innerText = generateThemeStyles();
    }

    function setBrightness(value) {
        if (!screenBrightnessFilter) { return; }
        value = value < MIN_BRIGHTNESS ? MIN_BRIGHTNESS : value;
        value = value > MAX_BRIGHTNESS ? MAX_BRIGHTNESS : value;
        const filterOpacity = (MAX_BRIGHTNESS - value) / 10;
        screenBrightnessFilter.style.opacity = filterOpacity;
    }

    function insertScreenModifiers() {
        screenFilter = document.createElement('div');
        screenFilter.id = 'rt-screen-filter';
        screenFilter.classList.add('rt-screen-filter', settings.filter);
        document.getElementsByTagName('body')[0].appendChild(screenFilter);

        screenBrightnessFilter = document.createElement('div');
        screenBrightnessFilter.id = 'rt-screen-brightness';
        screenBrightnessFilter.classList.add('rt-screen-filter');
        document.getElementsByTagName('body')[0].appendChild(screenBrightnessFilter);
        setBrightness(settings.brightness);
    }

    function insertStyles() {
        setActiveTheme(themes[settings.theme]);

        // GLOBALS
        let css = 'svg, h1, h2, h3, h4, p, i, b, li, .MuiTypography-root, .MuiAlert-message, .MuiTooltip-tooltip{color: var(--color-3); font-family: Courier !important;}';
        css += '.Mui-error, .Mui-focused{color: var(--color-3) !important; font-family: Courier !important;}';

        // SCREEN FILTERS
        css += '.rt-screen-filter{z-index: 1000000001; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none;}';

        // CRT filter
        css += '.rt-screen-filter.crt1{background: repeating-linear-gradient(0deg, #111, #111 1px, transparent 3px, transparent 4px); opacity: 0.2}';
        css += '.rt-screen-filter.crt2{background: repeating-linear-gradient(0deg, #111, #111 1px, transparent 3px, transparent 4px), radial-gradient(white, black 65%); opacity: 0.2}';

        // LCD filter
        css += '.rt-screen-filter.lcd{background: repeating-linear-gradient(0deg, #11111133, #11111133 1px, transparent 2px, transparent 5px), repeating-linear-gradient(90deg, #11111133, #11111133 1px, transparent 2px, transparent 5px); opacity: 0.2}';

        // Brightness filter
        css += '#rt-screen-brightness{background: #000000; opacity: 0.0}';

        // CONTAINERS
        // Body
        css += 'body{background: var(--color-0);}';

        // Card container
        css += '.MuiPaper-root.MuiPaper-elevation{background: var(--color-0); border: solid 1px var(--color-3); border-radius: 0px !important;}';

        // Tooltip
        css += '.MuiTooltip-tooltip{background: var(--color-1); border: solid 1px var(--color-3); border-radius: 0px !important;}';

        // Menu box
        css += '[class*="-menuContainer"].MuiBox-root{background: var(--color-1); border: solid 1px var(--color-3); border-radius: 0px !important;}';

        // COMPONENTS
        // Scrollbar
        css += '::-webkit-scrollbar{width: 20px;}';
        css += '::-webkit-scrollbar-track {background: var(--color-1);}';
        css += '::-webkit-scrollbar-thumb {background: var(--color-2);}';
        css += '::-webkit-scrollbar-thumb:hover, ::-webkit-scrollbar-thumb:active {background: var(--color-3);}';

        // Button
        css += 'button{background: var(--color-2) !important; color: var(--color-0) !important; border-radius: 0px !important; font-family: Courier !important; font-weight: bold !important;}';
        css += 'button:hover, button:active{background: var(--color-3) !important}';
        css += 'button.MuiButtonGroup-firstButton, button.MuiButtonGroup-middleButton{border-right: 1px solid var(--color-0) !important; border-color: var(--color-0) !important;}';
        css += 'button svg{color: var(--color-0) !important;}';

        // List
        css += '.MuiList-root .MuiMenuItem-root{color: var(--color-3)}';
        css += '.MuiList-root .MuiMenuItem-root:hover, .MuiList-root .MuiMenuItem-root:hover .MuiTypography-root, .MuiList-root .MuiMenuItem-root:hover svg{background: var(--color-2); color: var(--color-0)}';
        css += '.MuiList-root .MuiMenuItem-root.Mui-selected{background: var(--color-3); color: var(--color-0);}';
        css += '.MuiList-root .MuiMenuItem-root button{background: transparent !important;}';
        css += '.MuiList-root .MuiMenuItem-root button svg{color: var(--color-3) !important;}';
        css += '.MuiList-root .MuiMenuItem-root.Mui-selected button svg, .MuiList-root .MuiMenuItem-root:hover button svg{color: var(--color-0) !important;}';

        // Input
        css += '.MuiFormLabel-root, .MuiInputLabel-standard, .MuiInputBase-input{color: var(--color-2)}';
        css += '.Mui-focused .MuiInputBase-input{color: var(--color-3)}';
        css += '.MuiInputBase-root.MuiInput-underline::before, .MuiInputBase-root.MuiInput-underline::after{border-color: var(--color-1) !important;}';
        css += '.MuiInputBase-root svg{color: var(--color-3) !important;}';

        // Select
        css += '.MuiSelect-select{color: var(--color-3)}';

        // Checkbox
        css += '.MuiSwitch-root .MuiButtonBase-root{color: var(--color-2);}';
        css += '.MuiSwitch-root .MuiSwitch-track{background: var(--color-1); opacity: 1;}';
        css += '.MuiSwitch-root .Mui-checked{color: var(--color-3);}';
        css += '.MuiSwitch-root .Mui-checked + .MuiSwitch-track{background: var(--color-2); opacity: 1;}';

        // Progress bar
        css += '.MuiLinearProgress-root{background: var(--color-1) !important;}';
        css += '.MuiLinearProgress-root .MuiLinearProgress-bar{background: var(--color-3) !important;}';

        // Toolbar
        css += '[class*="-toolbarHighlight"].MuiToolbar-regular{background: var(--color-2) !important;}';

        // Playlist table
        css += '.MuiTableCell-head, .MuiTableCell-body{border-color: var(--color-1);}';
        css += '.MuiTableCell-body svg{color: var(--color-3)}';
        css += '.MuiTableCell-head, .MuiTableCell-body, .MuiTableCell-body span{color: var(--color-2); font-family: Courier !important;}';
        css += '.MuiTableRow-hover:hover{background: var(--color-2) !important;}';
        css += '.MuiTableRow-hover:hover .MuiTableCell-head, .MuiTableRow-hover:hover .MuiTableCell-body, .MuiTableRow-hover:hover .MuiTableCell-body span{color: var(--color-0);}';
        css += '[class*="-currentTrackRow"] .MuiTableCell-head, [class*="-currentTrackRow"] .MuiTableCell-body, [class*="-currentTrackRow"] .MuiTableCell-body span{color: var(--color-3)}';
        css += '[class*="-rowClass-trackRow"].Mui-selected{background: var(--color-1) !important;}';
        css += '[class*="-rowClass-trackRow"].Mui-selected:hover{background: var(--color-2) !important;}';

        // Format badge
        css += '[class*="-formatBadge"]{background: var(--color-3) !important; color: var(--color-0) !important; border: none;}';

        // LCD
        css += '[class*="-lcd"]{background: var(--color-0); border-radius: 0; border: solid 1px var(--color-3)}';
        css += '[class*="-lcdText"]{color: var(--color-3) !important; background: transparent; border: none;}';
        css += '[class*="-lcdDisc"]{background: transparent; border: none;}';
        css += '[class*="-lcdDisc"] svg, [class*="-lcdDisc"] g{color: var(--color-3) !important; fill: var(--color-3) !important;}';

        // Duration bar
        css += '.css-biokn-duration{background: var(--color-3); filter: none;}';

        pageStyle = document.createElement('style');
        pageStyle.innerText = css;
        document.getElementsByTagName('body')[0].appendChild(pageStyle);
    }

    init();
})();