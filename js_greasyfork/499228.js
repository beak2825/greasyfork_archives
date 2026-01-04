// ==UserScript==
// @name         Popup Work In Progress
// @namespace    com.zlef.popupframework
// @version      1.0.1
// @description  Example of a popup framework with sections and dynamic IDs
// @author       Zlef
// @match        *://idle-pixel.com/login/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499228/Popup%20Work%20In%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/499228/Popup%20Work%20In%20Progress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Popup {
        constructor(pluginName) {
            this.pluginName = pluginName;
            this.popups = [];
            this.overlay = null;
            this.initCustomCSS();
        }

        initCustomCSS() {
            const css = `
                .zlefsPopupHeader {
                    cursor: move;
                    padding-bottom: 38px;
                    background-color: #f1f1f1;
                    border-bottom: 1px solid #ccc;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    box-sizing: border-box;
                }
                .zlefsPopupBox {
                    position: absolute;
                    background-color: #fff;
                    padding: 40px 20px 20px 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    max-height: 80vh;
                    overflow-y: auto;
                    max-width: 90%;
                }
                .zlefsCloseButton {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                #zlefsPopupOverlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .zlefs-settings-section {
                    border: 1px solid black;
                    background-color: white;
                    padding: 10px 10px 0px 10px;
                    margin-bottom: 10px;
                }
                .zlefs-settings-section-title {
                    margin-bottom: 10px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .zlefs-settings-section-content {
                    display: none;
                }
                .zlefs-settings-section-content.zlefs-hidden {
                    display: block;
                }
                .zlefs-setting-item {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }
                .zlefs-setting-multicheckbox-item {
                    display: flex;
                    flex-direction: column;
                }
                .zlefs-setting-checkbox-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 400px;
                }
                .zlefs-setting-checkbox-label {
                    flex: 1;
                    text-align: left;
                    margin-right: 10px;
                }
                .zlefs-setting-checkbox-input {
                    flex: 0;
                    text-align: right;
                }
            `;
            const style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }

        createOverlay() {
            if (this.overlay) return;

            this.overlay = document.createElement('div');
            this.overlay.id = 'zlefsPopupOverlay';
            this.overlay.addEventListener('click', (event) => {
                if (event.target === this.overlay) {
                    this.closeTopPopup();
                }
            });

            document.body.appendChild(this.overlay);
        }

        addPopup(content, name, width = 'auto', height = 'auto', closeCallback = null) {
            this.createOverlay();

            const popupBox = document.createElement('div');
            popupBox.className = 'zlefsPopupBox';
            popupBox.style.width = typeof width === 'number' ? `${width}px` : width;
            popupBox.style.height = typeof height === 'number' ? `${height}px` : height;

            const closeButton = document.createElement('button');
            closeButton.className = 'zlefsCloseButton';
            closeButton.textContent = '✖';
            closeButton.addEventListener('click', () => {
                this.closePopup(popupBox);
                if (closeCallback) closeCallback();
            });

            const header = document.createElement('div');
            header.className = 'zlefsPopupHeader';

            popupBox.appendChild(header);
            popupBox.appendChild(closeButton);
            popupBox.appendChild(content);
            this.overlay.appendChild(popupBox);
            this.popups.push(popupBox);

            this.makeDraggable(popupBox, header);
        }



        makeDraggable(popupBox, header) {
            let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

            const onMouseDown = (e) => {
                // console.log(`offsetX: ${offsetX}, offsetY: ${offsetY}, startX: ${startX}, startY: ${startY}, `);
                e.preventDefault();

                startX = e.clientX;
                startY = e.clientY;
                // console.log(`offsetX: ${offsetX}, offsetY: ${offsetY}, startX: ${startX}, startY: ${startY}, `);
                // console.log(`corners.topLeft.left: ${corners.topLeft.left}, corners.topLeft.top: ${corners.topLeft.top}, corners.bottomRight.left: ${corners.bottomRight.left}, corners.bottomRight.top: ${corners.bottomRight.top}, `);

                offsetX = popupBox.offsetLeft;
                offsetY = popupBox.offsetTop;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onMouseMove = (e) => {
                e.preventDefault();
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;

                let newLeft = offsetX + dx;
                let newTop = offsetY + dy;

                popupBox.style.left = `${newLeft}px`;
                popupBox.style.top = `${newTop}px`;
            };

            const onMouseUp = (e) => {
                const rect = popupBox.getBoundingClientRect();
                const corners = {
                    topLeft: { left: rect.left, top: rect.top },
                    bottomRight: { left: rect.right, top: rect.bottom }
                };

                if (rect.left < 0) {
                    popupBox.style.left = (rect.width/2) + 'px';
                }
                if (rect.top < 0) {
                    popupBox.style.top = (rect.height/2) + 'px';
                }
                if (rect.right > window.innerWidth) {
                    popupBox.style.left = (window.innerWidth - (rect.width/2)) + 'px';
                }
                if (rect.bottom > window.innerHeight) {
                    popupBox.style.top = (window.innerHeight - (rect.height/2)) + 'px';
                }

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };


            header.addEventListener('mousedown', onMouseDown);
        }

        repositionPopup(popupBox) {
            if (!popupBox) return;

            const rect = popupBox.getBoundingClientRect();
            const corners = {
                topLeft: { left: rect.left, top: rect.top },
                bottomRight: { left: rect.right, top: rect.bottom }
            };

            if (rect.left < 0) {
                popupBox.style.left = (rect.width / 2) + 'px';
            }
            if (rect.top < 0) {
                popupBox.style.top = (rect.height / 2) + 'px';
            }
            if (rect.right > window.innerWidth) {
                popupBox.style.left = (window.innerWidth - (rect.width / 2)) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                popupBox.style.top = (window.innerHeight - (rect.height / 2)) + 'px';
            }
        }


        closePopup(popup) {
            this.overlay.removeChild(popup);
            this.popups = this.popups.filter(p => p !== popup);
            if (this.popups.length === 0) {
                document.body.removeChild(this.overlay);
                this.overlay = null;
            }
        }

        closeTopPopup() {
            if (this.popups.length > 0) {
                this.closePopup(this.popups[this.popups.length - 1]);
            }
        }

        addTitle(parent, text, level = 2, textAlign = 'left') {
            const title = document.createElement(`h${level}`);
            title.textContent = text;
            title.style.textAlign = textAlign;
            parent.appendChild(title);
            return title
        }

        addSection(parent, sectionId, sectionTitleText) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'zlefs-settings-section';
            sectionDiv.id = sectionId;

            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'zlefs-settings-section-title';
            sectionTitle.textContent = sectionTitleText;

            const sectionContent = document.createElement('div');
            sectionContent.className = 'zlefs-settings-section-content';

            sectionTitle.addEventListener('click', () => {
                sectionContent.classList.toggle('zlefs-hidden');
                // const popup = this.popupFramework.popups[this.popupFramework.popups.length - 1];
                // if (popup) {
                //    this.popupFramework.repositionPopup(popup);
                // }
            });

            sectionDiv.appendChild(sectionTitle);
            sectionDiv.appendChild(sectionContent);
            parent.appendChild(sectionDiv);

            return sectionContent;
        }


        addInput(parent, label, type, value, placeholder, min, max, onChange, id) {
            const inputContainer = document.createElement('div');
            inputContainer.style.display = 'flex';
            inputContainer.style.alignItems = 'center';
            inputContainer.style.marginBottom = '10px';
            inputContainer.id = id;

            const inputLabel = document.createElement('label');
            inputLabel.textContent = label;
            inputLabel.style.marginRight = '10px';
            inputLabel.style.flex = '1';
            inputLabel.style.cursor = 'pointer';
            inputContainer.appendChild(inputLabel);

            const input = document.createElement('input');
            input.type = type;
            input.value = value;
            input.style.flex = '0';
            if (placeholder) input.placeholder = placeholder;
            if (min !== undefined) input.min = min;
            if (max !== undefined) input.max = max;
            input.addEventListener('input', (event) => {
                let inputValue = event.target.value;
                if (type === 'number') {
                    if (inputValue < min) inputValue = min;
                    if (inputValue > max) inputValue = max;
                    event.target.value = inputValue;
                }
                onChange(inputValue);
            });

            inputLabel.addEventListener('click', () => input.focus());
            inputContainer.appendChild(input);
            parent.appendChild(inputContainer);
        }

        addCheckbox(parent, label, checked, onChange, id) {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'zlefs-setting-checkbox-container';
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.marginBottom = '10px';
            checkboxContainer.id = id;

            const checkboxLabel = document.createElement('label');
            checkboxLabel.textContent = label;
            checkboxLabel.className = 'zlefs-setting-checkbox-label';
            checkboxLabel.style.flex = '1';
            checkboxLabel.style.cursor = 'pointer';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checked;
            checkbox.className = 'zlefs-setting-checkbox-input';
            checkbox.style.flex = '0';
            checkbox.style.cursor = 'pointer';
            checkbox.addEventListener('change', (event) => onChange(event.target.checked));

            checkboxLabel.addEventListener('click', () => checkbox.click());

            checkboxContainer.appendChild(checkboxLabel);
            checkboxContainer.appendChild(checkbox);
            parent.appendChild(checkboxContainer);
        }

        addButton(parent, text, onClick, className = '') {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = className;
            button.addEventListener('click', onClick);
            parent.appendChild(button);
            return button;
        }

        addDivider(parent, margin = 5) {
            const divider = document.createElement('hr');
            divider.style.width = `calc(100% - ${2 * margin}px)`;
            divider.style.marginLeft = `${margin}px`;
            divider.style.marginRight = `${margin}px`;
            parent.appendChild(divider);
            return divider;
        }

        addVDivider(parent, margin = 20) {
            const divider = document.createElement('div');
            divider.style.width = '1px';
            divider.style.backgroundColor = '#ccc';
            divider.style.margin = `0 ${margin}px`;
            parent.appendChild(divider);
            return divider;
        }

        addDiv(parent) {
            const div = document.createElement('div');
            parent.appendChild(div);
            return div;
        }

        addContainer(parent) {
            const container = document.createElement('div');
            container.className = 'container';
            parent.appendChild(container);
            return container;
        }

        addRow(parent) {
            const row = document.createElement('div');
            row.className = 'row';
            parent.appendChild(row);
            return row;
        }

        addCol(parent, size = '', align = 'left') {
            const col = document.createElement('div');
            col.className = size ? `col-${size}` : 'col';
            col.style.textAlign = align === 'centre' ? 'center' : align;
            parent.appendChild(col);
            return col;
        }

        addRadioButtons(popup, name, options, selectedValue, onChange, id) {
            const radioContainer = document.createElement('div');
            radioContainer.style.display = 'flex';
            radioContainer.style.flexWrap = 'wrap';
            radioContainer.id = id;

            options.forEach(option => {
                const radioWrapper = document.createElement('div');
                radioWrapper.style.display = 'flex';
                radioWrapper.style.alignItems = 'center';
                radioWrapper.style.marginRight = '10px';
                radioWrapper.style.marginBottom = '10px';

                const radioLabel = document.createElement('label');
                radioLabel.textContent = option;
                radioLabel.style.marginRight = '10px';
                radioLabel.style.flex = '1';
                radioLabel.style.cursor = 'pointer';

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = name;
                radio.value = option;
                radio.checked = option === selectedValue;
                radio.style.flex = '0';
                radio.addEventListener('change', () => onChange(option));

                radioLabel.addEventListener('click', () => radio.click());

                radioWrapper.appendChild(radio);
                radioWrapper.appendChild(radioLabel);
                radioContainer.appendChild(radioWrapper);
            });

            popup.appendChild(radioContainer);
            return radioContainer;
        }

        addCombobox(popup, label, options, selectedValue, onChange, id) {
            const comboboxContainer = document.createElement('div');
            comboboxContainer.style.display = 'flex';
            comboboxContainer.style.alignItems = 'center';
            comboboxContainer.style.marginBottom = '10px';
            comboboxContainer.id = id;

            const comboboxLabel = document.createElement('label');
            comboboxLabel.textContent = label;
            comboboxLabel.style.marginRight = '10px';
            comboboxLabel.style.flex = '1';
            comboboxContainer.appendChild(comboboxLabel);

            const combobox = document.createElement('select');
            combobox.style.flex = '0';
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.text = option;
                if (option === selectedValue) optionElement.selected = true;
                combobox.appendChild(optionElement);
            });
            combobox.addEventListener('change', (event) => onChange(event.target.value));

            comboboxContainer.appendChild(combobox);
            popup.appendChild(comboboxContainer);
            return comboboxContainer;
        }
    }

    class SettingsManager {
        constructor(popupFramework, prefix, settings, instance, settingsUpdate) {
            this.prefix = prefix;
            this.defaultSettings = JSON.parse(JSON.stringify(settings));
            this.settings = settings;
            this.popupFramework = popupFramework;
            this.instance = instance
            this.settingsUpdate = settingsUpdate;
            this.popupIndex = null; // Initialize popupIndex
            this.loadSettings();
            this.createSettingsContent();
        }

        saveSettings() {
            const settingsToSave = {};

            const processSettings = (settings, saveObj) => {
                for (const key in settings) {
                    const setting = settings[key];
                    if (setting.type === 'section') {
                        saveObj[key] = {
                            type: 'section',
                            name: setting.name,
                            settings: {}
                        };
                        processSettings(setting.settings, saveObj[key].settings);
                    } else if (setting.type === 'multicheckbox') {
                        saveObj[key] = {
                            type: 'multicheckbox',
                            values: {}
                        };
                        for (const subKey in setting.values) {
                            saveObj[key].values[subKey] = setting.values[subKey];
                        }
                    } else if (setting.type === 'radio') {
                        saveObj[key] = {
                            type: 'radio',
                            values: setting.values,
                            active: setting.active
                        };
                    } else {
                        saveObj[key] = {
                            type: setting.type,
                            value: setting.value
                        };
                    }
                }
            };

            processSettings(this.settings, settingsToSave);
            localStorage.setItem(`${this.prefix}_settings`, JSON.stringify(settingsToSave));
        }

        loadSettings() {
            const savedSettings = JSON.parse(localStorage.getItem(`${this.prefix}_settings`));
            if (savedSettings) {
                const processLoadedSettings = (loadedSettings, currentSettings) => {
                    for (const key in currentSettings) {
                        if (loadedSettings[key] !== undefined) {
                            const setting = currentSettings[key];
                            if (setting.type === 'section') {
                                processLoadedSettings(loadedSettings[key].settings, setting.settings);
                            } else if (setting.type === 'multicheckbox') {
                                for (const subKey in setting.values) {
                                    setting.values[subKey] = loadedSettings[key].values[subKey];
                                }
                            } else if (setting.type === 'radio') {
                                setting.active = loadedSettings[key].active;
                            } else {
                                setting.value = loadedSettings[key].value;
                            }
                        }
                    }

                    // Remove settings that no longer exist in current settings
                    for (const key in loadedSettings) {
                        if (currentSettings[key] === undefined) {
                            delete loadedSettings[key];
                        }
                    }
                };

                processLoadedSettings(savedSettings, this.settings);
                localStorage.setItem(`${this.prefix}_settings`, JSON.stringify(this.settings));
            }
        }

        resetSettings() {
            this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
            this.saveSettings();
            this.settingsUpdate(this.defaultSettings);
        }

        deleteSettings() {
            localStorage.removeItem(`${this.prefix}_settings`);
        }

        settingsChanged(fullKey, value, subKey = null) {
            const keys = fullKey.split('.');
            let currentSettings = this.settings;

            for (let i = 0; i < keys.length - 1; i++) {
                if (currentSettings[keys[i]].type === 'section') {
                    currentSettings = currentSettings[keys[i]].settings;
                } else if (currentSettings[keys[i]].type === 'multicheckbox' && subKey) {
                    currentSettings = currentSettings[keys[i]].values;
                } else {
                    currentSettings = currentSettings[keys[i]];
                }
            }

            const finalKey = keys[keys.length - 1];

            if (!currentSettings[finalKey]) {
                console.error(`settingsChanged - Key ${finalKey} not found in settings`);
                return;
            }

            if (subKey) {
                currentSettings[finalKey].values[subKey] = value;
                // console.log(`Setting ${fullKey}[${subKey}] changed to: ${value}`);
            } else if (currentSettings[finalKey].type === 'radio') {
                currentSettings[finalKey].active = value;
                // console.log(`Radio in ${fullKey} changed to: ${value}`);
            } else {
                currentSettings[finalKey].value = value;
                // console.log(`${fullKey} changed to: ${value}`);
            }
            this.saveSettings();
            this.settingsUpdate(this.settings);
        }

        createSettingsContent() {
            const content = document.createElement('div');
            this.popupFramework.addTitle(content, "Settings");
            const popupIndex = this.popupFramework.popups.length;
            let inputIndex = 0;

            Object.keys(this.settings).forEach(key => {
                const setting = this.settings[key];

                if (setting.type === 'section') {
                    const sectionContent = this.popupFramework.addSection(content, `section-${key}`, setting.name);

                    Object.keys(setting.settings).forEach(subKey => {
                        const subSetting = setting.settings[subKey];
                        this.addSettingContent(subSetting, subKey, sectionContent, popupIndex, inputIndex, key);
                        inputIndex++;
                    });
                } else {
                    this.addSettingContent(setting, key, content, popupIndex, inputIndex);
                    inputIndex++;
                }
            });

            return content;
        }

        addSettingContent(setting, key, target, popupIndex, inputIndex, section = null) {
            const container = document.createElement('div');
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            const fullKey = section ? `${section}.${key}` : key;
            const popup = this.popupFramework.popups[this.popupFramework.popups.length - 1];

            if (setting.type === 'numinput') {
                this.popupFramework.addInput(
                    container,
                    label,
                    'number',
                    setting.value,
                    '',
                    setting.minValue,
                    setting.maxValue,
                    (value) => {
                        this.settingsChanged(fullKey, parseInt(value));
                        if (popup) this.popupFramework.repositionPopup(popup);
                    },
                    `${this.popupFramework.pluginName}-settings-input-${popupIndex}-${inputIndex}`
                );
            } else if (setting.type === 'text') {
                this.popupFramework.addInput(
                    container,
                    label,
                    'text',
                    setting.value,
                    setting.placeholder,
                    undefined,
                    undefined,
                    (value) => {
                        this.settingsChanged(fullKey, value);
                        if (popup) this.popupFramework.repositionPopup(popup);
                    },
                    `${this.popupFramework.pluginName}-settings-input-${popupIndex}-${inputIndex}`
                );
            } else if (setting.type === 'checkbox') {
                this.popupFramework.addCheckbox(
                    container,
                    label,
                    setting.value,
                    (checked) => {
                        console.log(`Checkbox ${fullKey} changed to: ${checked}`);
                        this.settingsChanged(fullKey, checked);
                        if (popup) this.popupFramework.repositionPopup(popup);
                    },
                    `${this.popupFramework.pluginName}-settings-checkbox-${popupIndex}-${inputIndex}`
                );
            } else if (setting.type === 'multicheckbox') {
                const multicheckboxContainer = document.createElement('div');
                multicheckboxContainer.className = 'zlefs-setting-multicheckbox-item';

                Object.keys(setting.values).forEach(subKey => {
                    const subContainer = document.createElement('div');
                    subContainer.className = 'zlefs-setting-item';

                    const subLabel = subKey.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                    const subFullKey = `${fullKey}.${subKey}`;

                    this.popupFramework.addCheckbox(
                        subContainer,
                        subLabel,
                        setting.values[subKey],
                        (checked) => {
                            console.log(`MultiCheckbox ${subFullKey} changed to: ${checked}`);
                            this.settingsChanged(fullKey, checked, subKey);
                            if (popup) this.popupFramework.repositionPopup(popup);
                        },
                        `${this.popupFramework.pluginName}-settings-checkbox-${popupIndex}-${inputIndex}`
                    );

                    multicheckboxContainer.appendChild(subContainer);
                });

                container.appendChild(multicheckboxContainer);
            } else if (setting.type === 'radio') {
                this.popupFramework.addRadioButtons(
                    container,
                    label,
                    setting.values,
                    setting.active,
                    (value) => {
                        console.log(`Radio ${fullKey} changed to: ${value}`);
                        this.settingsChanged(fullKey, value);
                        if (popup) this.popupFramework.repositionPopup(popup);
                    },
                    `${this.popupFramework.pluginName}-settings-radio-${popupIndex}-${inputIndex}`
                );
            } else if (setting.type === 'combobox') {
                this.popupFramework.addCombobox(
                    container,
                    label,
                    setting.options,
                    setting.value,
                    (value) => {
                        console.log(`Combobox ${fullKey} changed to: ${value}`);
                        this.settingsChanged(fullKey, value);
                        if (popup) this.popupFramework.repositionPopup(popup);
                    },
                    `${this.popupFramework.pluginName}-settings-combobox-${popupIndex}-${inputIndex}`
                );
            }

            target.appendChild(container);
        }


    }

    class PopupTesting {
        constructor() {
            const pluginName = 'PopupTesting'
            this.popupFramework = new Popup(pluginName);

            this.settings = {
                'testNumInput': {type: 'numinput', value: 10, minValue: 0, maxValue: 20},
                'section1': {
                    type: 'section',
                    name: "Section 1",
                    settings: {
                        'testCheckbox': {type: 'checkbox', value: true},
                        'testInput': {type: "text", value: "Hello", placeholder: "Hello message!"},
                        'testCheckboxes': {type: 'multicheckbox', values: {'apple': true, 'pear': false, 'banana': true, 'cooked_chicken': false, 'cooked_bird_meat': false, 'cooked_meat': false, 'honey': false, 'cheese': false,}},
                    }
                },
                'section2': {
                    type: 'section',
                    name: "Section 2",
                    settings: {
                        'testRadio': {type: 'radio', values: ["item1", "item2", "item3"], active: "item1"},
                        'testCombo': {type: 'combobox', options: ['apple', 'banana', 'pear'], value: "apple"}
                    }
                },
                'testInputNoSection': {type: "text", value: "Free from sections", placeholder: "Hello message!"},
                'testInputNoSection': {type: "text", value: "Free from sections", placeholder: "Hello message!"}
            };
            this.defaultSettings = JSON.parse(JSON.stringify(this.settings));

            // Plugin name for prefix, sets storage key etc, needs to be unique.
            this.settingsManager = new SettingsManager(this.popupFramework, pluginName, this.settings, this, this.updateSettings);

            this.initUI();
        }

        settingsPopup() {
            const content = this.settingsManager.createSettingsContent();
            this.popupFramework.addPopup(content, 'settings', 'auto', 'auto', () => this.onSettingsPopupClose());
        }

        updateSettings(newSettings) {
            this.settings = newSettings;
            console.log('Settings updated:', this.settings);
        }

        onSettingsPopupClose() {
            console.log('Popup closed');
        }

        initUI() {
            const testButton = this.createButton('Test Popup', () => this.settingsPopup());
            const resetButton = this.createButton('Reset settings', () => this.settingsManager.resetSettings());
            const deleteButton = this.createButton('Delete from local', () => this.settingsManager.deleteSettings());
            const logButton = this.createButton('Log this.settings', () => console.log(this.settings));
            const differentPopupButton = this.createButton('Open a different popup', () => this.differentPopup());

            const topBar = document.querySelector('.top-bar');
            [testButton, resetButton, deleteButton, logButton, differentPopupButton].forEach(button => topBar.appendChild(button));
        }

        createButton(text, onClick) {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', onClick);
            return button;
        }

        differentPopup() {
            const content = document.createElement('div');

            this.popupFramework.addTitle(content, "Example Item", 3, 'center');

            const container = this.popupFramework.addContainer(content);
            const rowDiv = this.popupFramework.addRow(container);
            const depositColDiv = this.popupFramework.addCol(rowDiv, '6', 'centre');
            const withdrawColDiv = this.popupFramework.addCol(rowDiv, '6', 'centre');

            this.popupFramework.addTitle(depositColDiv, 'Deposit Amount', 5, 'center');
            this.popupFramework.addInput(depositColDiv, '', 'number', 100, '', undefined, undefined, (value) => {
                console.log('Deposit amount changed:', value);
            }, 'depositAmount');
            const depositButton = this.popupFramework.addButton(depositColDiv, 'DEPOSIT', () => {
                console.log("Pressed deposit button");
            }, 'btn btn-secondary deposit-button');
            depositButton.style.backgroundColor = "red";
            depositButton.style.color = "white";

            this.popupFramework.addTitle(withdrawColDiv, 'Withdraw Amount', 5, 'center');
            this.popupFramework.addInput(withdrawColDiv, '', 'number', 200, '', undefined, undefined, (value) => {
                console.log('Withdraw amount changed:', value);
            }, 'withdrawAmount');

            const withdrawButton = this.popupFramework.addButton(withdrawColDiv, 'WITHDRAW', () => {
                const take_amount = document.getElementById('withdrawAmount').value;
                console.log("Pressed withdraw button");
            }, 'btn btn-secondary withdraw-button');
            withdrawButton.style.backgroundColor = "green";
            withdrawButton.style.color = "white";

            this.popupFramework.addPopup(content, 'Withdraw Popup', 500, 'auto', () => {
                console.log('Popup closed');
            });
        }
    }

    new PopupTesting();
})();
