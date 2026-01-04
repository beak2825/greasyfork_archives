// ==UserScript==
// @name         Zlef's modal and settings
// @namespace    com.zlef.modal
// @version      1.0.2
// @description  Modal and settings framework, designed with Idle Pixel in mind but expanded beyond that scope.
// @author       Zlef
// @grant        none
// @license      MIT
// ==/UserScript==

// v1.0.1 Added tracking dirty state for settings
// Buttons added via settings are untested/unrefined (Since picking the project back up)

(function() {
    'use strict';

    class Modal {
        constructor(pluginName) {
            this.pluginName = pluginName;
            this.modals = [];
            this.overlay = null;
            this.closeCallbacks = []; // Stack to keep track of closeCallbacks
            this.initCustomCSS();
        }

        initCustomCSS() {
            const css = `
				.zlefs-modal {
					position: absolute;
					background-color: #fff;
					border-radius: 8px;
					box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					max-height: 80vh;
					max-width: 80vh;
					display: flex;
					flex-direction: column;
					overflow: hidden; /* Ensures rounded corners are visible */
				}
				.zlefs-modal-header {
					cursor: move;
                    padding-bottom: 40px;
					background-color: #f1f1f1;
					border-bottom: 1px solid #ccc;
					position: sticky;
					top: 0;
					left: 0;
					right: 0;
					width: 100%;
					box-sizing: border-box;
					border-top-left-radius: 8px; /* Ensure header has rounded corners */
					border-top-right-radius: 8px; /* Ensure header has rounded corners */
					z-index: 10; /* Ensure header is above the content */
				}
                .zlefs-modal-header-text {
					position: absolute; /* Position the text absolutely */
            		top: 50%; /* Center the text vertically */
            		left: 10px; /* Align the text to the left */
            		transform: translateY(-50%); /* Adjust the vertical positioning */
            		pointer-events: none; /* Makes the text click-throughable */
            		height: 20px; /* Define the height of the text */
                    font-weight: bold;
				}
				.zlefs-modal-content {
					padding: 0 20px 20px 20px;
					overflow-y: auto;
					flex-grow: 1; /* Allows the content to grow and fill the remaining space */
				}
				.zlefs-close-button {
					position: absolute;
					top: 10px;
					right: 10px;
					background: none;
					border: none;
					cursor: pointer;
					z-index: 11; /* Ensure close button is above the header */
				}
                #zlefs-modal-overlay {
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
                .zlefs-section {
                    border: 1px solid black;
                    background-color: white;
                    padding: 10px 10px 0px 10px;
                    margin-bottom: 10px;
                }
                .zlefs-section-title {
                    margin-bottom: 10px;
                    margin-left: 2px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .zlefs-section-content {
                    display: none;
                }
                .zlefs-section-content.zlefs-hidden {
                    display: block;
                }
                .zlefs-item {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }
                .zlefs-checkbox-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 400px;
                }
                .zlefs-checkbox-label {
                    flex: 1;
                    text-align: left;
                    margin-right: 10px;
                }
                .zlefs-checkbox-input {
                    flex: 0;
                    text-align: right;
                }
                .zlefs-vertical-divider {
						width: 1px;
						background-color: #ccc;
                        padding: 0;
                        display: flex;
               }
            `;
            const style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }

        createOverlay(closeOnOutsideClick = true) {
            if (this.overlay) return;

            this.overlay = document.createElement('div');
            this.overlay.id = 'zlefs-modal-overlay';

            if (this.overlay && closeOnOutsideClick) {
                this.overlay.addEventListener('click', (event) => {
                    if (event.target === this.overlay) {
                        this.closeTopModal();
                    }
                });
            }

            document.body.appendChild(this.overlay);
        }

        addModal(content, name, width = 'auto', height = 'auto', closeCallback = null, useOverlay = true, closeOnOutsideClick = true) {
            if (useOverlay) this.createOverlay(closeOnOutsideClick);
            const parentElement = useOverlay ? this.overlay : document.body;

            const modalBox = document.createElement('div');
            modalBox.className = 'zlefs-modal';
            modalBox.style.width = typeof width === 'number' ? `${width}px` : width;
            modalBox.style.height = typeof height === 'number' ? `${height}px` : height;

            const closeButton = document.createElement('button');
            closeButton.className = 'zlefs-close-button';
            closeButton.textContent = '✖';
            closeButton.addEventListener('click', () => {
                this.closeModal(modalBox);
                if (closeCallback) closeCallback();
            });

            const header = document.createElement('div');
            header.className = 'zlefs-modal-header';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            nameSpan.className = 'zlefs-modal-header-text';

            header.appendChild(nameSpan);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'zlefs-modal-content';
            contentWrapper.appendChild(content);

            modalBox.appendChild(header);
            modalBox.appendChild(closeButton);
            modalBox.appendChild(contentWrapper);
            parentElement.appendChild(modalBox);

            this.modals.push(modalBox);
            this.closeCallbacks.push(closeCallback);

            this.makeDraggable(modalBox, header);
        }

        addFloatingModal(content, name, width, height, closeCallback) {
            this.addModal(content, name, width, height, closeCallback, false, false);
        }


        closeModal(modal) {
            const modalIndex = this.modals.indexOf(modal);
            if (modalIndex !== -1) {
                this.modals.splice(modalIndex, 1);
                this.closeCallbacks.splice(modalIndex, 1);
            }
            if (modal && modal.parentElement) {
                modal.parentElement.removeChild(modal);
            }


            if (this.modals.length === 0 && this.overlay) {
                document.body.removeChild(this.overlay);
                this.overlay = null;
            }
        }

        closeTopModal() {
            if (this.modals.length > 0) {
                const topModal = this.modals[this.modals.length - 1];
                const topCallback = this.closeCallbacks[this.closeCallbacks.length - 1];
                this.closeModal(topModal);
                if (topCallback) topCallback();
            }
        }

        makeDraggable(modalBox, header) {
            let offsetX = 0, offsetY = 0, startX = 0, startY = 0;

            const onMouseDown = (e) => {
                e.preventDefault();

                startX = e.clientX;
                startY = e.clientY;

                offsetX = modalBox.offsetLeft;
                offsetY = modalBox.offsetTop;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onMouseMove = (e) => {
                e.preventDefault();
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;

                let newLeft = offsetX + dx;
                let newTop = offsetY + dy;

                modalBox.style.left = `${newLeft}px`;
                modalBox.style.top = `${newTop}px`;
            };

            const onMouseUp = (e) => {
                const rect = modalBox.getBoundingClientRect();
                const corners = {
                    topLeft: { left: rect.left, top: rect.top },
                    bottomRight: { left: rect.right, top: rect.bottom }
                };

                if (rect.left < 0) {
                    modalBox.style.left = (rect.width/2) + 'px';
                }
                if (rect.top < 0) {
                    modalBox.style.top = (rect.height/2) + 'px';
                }
                if (rect.right > window.innerWidth) {
                    modalBox.style.left = (window.innerWidth - (rect.width/2)) + 'px';
                }
                if (rect.bottom > window.innerHeight) {
                    modalBox.style.top = (window.innerHeight - (rect.height/2)) + 'px';
                }

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };


            header.addEventListener('mousedown', onMouseDown);
        }

        repositionModal(modalBox) {
            if (!modalBox) return;

            const rect = modalBox.getBoundingClientRect();
            const corners = {
                topLeft: { left: rect.left, top: rect.top },
                bottomRight: { left: rect.right, top: rect.bottom }
            };

            if (rect.left < 0) {
                modalBox.style.left = (rect.width / 2) + 'px';
            }
            if (rect.top < 0) {
                modalBox.style.top = (rect.height / 2) + 'px';
            }
            if (rect.right > window.innerWidth) {
                modalBox.style.left = (window.innerWidth - (rect.width / 2)) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                modalBox.style.top = (window.innerHeight - (rect.height / 2)) + 'px';
            }
        }

        addTitle(parent, text, level = 2, textAlign = 'left') {
            const title = document.createElement(`h${level}`);
            title.textContent = text;
            title.style.textAlign = textAlign;
            parent.appendChild(title);
            return title
        }

        addSection(parent, sectionTitleText) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'zlefs-section';

            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'zlefs-section-title';
            sectionTitle.textContent = sectionTitleText;

            const sectionContent = document.createElement('div');
            sectionContent.className = 'zlefs-section-content';

            sectionTitle.addEventListener('click', () => {
                const modal = this.findParentModal(sectionDiv);

                // Track the original top position of the modal
                const originalTop = modal.getBoundingClientRect().top;
                const originalScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                // Toggle the section visibility
                sectionContent.classList.toggle('zlefs-hidden');

                // Calculate the new height of the section
                const newTop = modal.getBoundingClientRect().top;
                const deltaHeight = parseInt((originalTop - newTop));

                // Adjust the top position of the modal
                const currentTop = parseInt(window.getComputedStyle(modal).top);
                modal.style.top = `${(currentTop + deltaHeight)}px`;

                this.repositionModal(modal);

            });

            sectionDiv.appendChild(sectionTitle);
            sectionDiv.appendChild(sectionContent);
            parent.appendChild(sectionDiv);

            return sectionContent;
        }

        findParentModal(element) {
            while (element && !element.classList.contains('zlefs-modal')) {
                element = element.parentElement;
            }
            return element;
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

        addDivider(parent, margin = 5) {
            const divider = document.createElement('hr');
            divider.style.width = `calc(100% - ${2 * margin}px)`;
            divider.style.marginLeft = `${margin}px`;
            divider.style.marginRight = `${margin}px`;
            parent.appendChild(divider);
            return divider;
        }

        addVDivider(parent) {
            const divider = document.createElement('div');
            divider.className = 'zlefs-vertical-divider';
            parent.appendChild(divider);
        }

        addInput(parent, type, value, placeholder, min, max, onChange, label = undefined) {
            const inputContainer = document.createElement('div');
            inputContainer.style.display = 'flex';
            inputContainer.style.alignItems = 'center';
            inputContainer.style.marginBottom = '10px';

            if (label){
                const inputLabel = document.createElement('label');
                inputLabel.textContent = label;
                inputLabel.style.marginRight = '10px';
                inputLabel.style.flex = '1';
                inputLabel.style.cursor = 'pointer';
                inputContainer.appendChild(inputLabel);
            }

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

            inputContainer.appendChild(input);
            parent.appendChild(inputContainer);
        }

        addCheckbox(parent, checked, onChange, label = undefined) {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'zlefs-checkbox-container';
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.marginBottom = '10px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checked;
            checkbox.className = 'zlefs-checkbox-input';
            checkbox.style.flex = '0';
            checkbox.style.cursor = 'pointer';
            checkbox.addEventListener('change', (event) => onChange(event.target.checked));


            if (label){
                const checkboxLabel = document.createElement('label');
                checkboxLabel.textContent = label;
                checkboxLabel.className = 'zlefs-checkbox-label';
                checkboxLabel.style.flex = '1';
                checkboxLabel.style.cursor = 'pointer';

                checkboxContainer.appendChild(checkboxLabel);
                checkboxLabel.addEventListener('click', () => checkbox.click());
            }

            checkboxContainer.appendChild(checkbox);
            parent.appendChild(checkboxContainer);
        }

        addButton(parent, text, onClick, className = 'btn') {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = className;
            button.addEventListener('click', onClick);
            parent.appendChild(button);
            return button;
        }

        addRadioButtons(modal, name, options, selectedValue, onChange, label) {
            const radioContainer = document.createElement('div');
            radioContainer.className = 'row';
            radioContainer.style.display = 'flex';
            radioContainer.style.flexWrap = 'wrap';

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

            modal.appendChild(radioContainer);
            return radioContainer;
        }

        addCombobox(parent, options, selectedValue, onChange, label = undefined) {
            const comboboxContainer = document.createElement('div');
            comboboxContainer.style.display = 'flex';
            comboboxContainer.style.alignItems = 'center';
            comboboxContainer.style.marginBottom = '10px';

            if (label) {
                const comboboxLabel = document.createElement('label');
                comboboxLabel.textContent = label;
                comboboxLabel.style.marginRight = '10px';
                comboboxLabel.style.flex = '1';
                comboboxLabel.style.cursor = 'pointer';
                comboboxContainer.appendChild(comboboxLabel);
            }

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
            parent.appendChild(comboboxContainer);
            return comboboxContainer;
        }
    }


    class SettingsManager {
        constructor(prefix, settings) {
            this.prefix = prefix;
            this.defaultSettings = JSON.parse(JSON.stringify(settings));
            this.settings = settings;
            this.modalContent = null;
            this.loadSettings();
            this._dirty = false;
        }

        markDirty() {
            this._dirty = true;
        }

        clearDirty() {
            this._dirty = false;
        }

        isDirty() {
            return this._dirty;
        }

        saveSettings() {
            const settingsToSave = {};

            const processSettings = (settings, saveObj) => {
                for (const key in settings) {
                    const setting = settings[key];
                    if (setting.type === 'button') {
                        continue; // Skip button types
                    }
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
                    } else if (setting.type === 'radio' || setting.type === 'combobox') {
                        saveObj[key] = {
                            type: 'radio',
                            options: setting.options,
                            value: setting.value
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
                            if (setting.type === 'button') {
                                continue; // Skip button types
                            }
                            if (setting.type === 'section') {
                                processLoadedSettings(loadedSettings[key].settings, setting.settings);
                            } else if (setting.type === 'multicheckbox') {
                                for (const subKey in setting.values) {
                                    // Update subKey if it exists in loadedSettings or retain default value
                                    setting.values[subKey] = loadedSettings[key].values[subKey] !== undefined
                                        ? loadedSettings[key].values[subKey]
                                    : setting.values[subKey];
                                }
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
            console.log('Resetting settings to default');
            this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
            this.saveSettings();
            console.log('Settings after reset:', this.settings);
        }

        deleteSettings() {
            console.log('Deleting settings from local storage');
            localStorage.removeItem(`${this.prefix}_settings`);
        }


        getSettings() {
            return this.settings;
        }

        settingsChanged(fullKey, value, subKey = null) {
            this.markDirty();
            const keys = fullKey.split('.');
            let currentSettings = this.settings;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!currentSettings[keys[i]]) {
                    console.error(`Missing key in path: ${keys[i]}`);
                    return;
                }
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
                currentSettings[finalKey].value = value;
                // console.log(`Radio in ${fullKey} changed to: ${value}`);
            } else {
                currentSettings[finalKey].value = value;
                // console.log(`${fullKey} changed to: ${value}`);
            }
            this.saveSettings();
        }

        createSettingsContent(modal, width = 'auto', height = 'auto', closeCallback = null) {
            return () => {
                const content = document.createElement('div');
                modal.addTitle(content, "Settings");

                const buildSettings = (settings, parent, parentKey = '') => {
                    if (!parent) {
                        console.error('Parent element is null');
                        return;
                    }

                    for (const key in settings) {
                        const setting = settings[key];
                        const fullKey = parentKey ? `${parentKey}.${key}` : key;

                        if (setting.type === 'section') {
                            const sectionContent = modal.addSection(parent, setting.name);
                            buildSettings(setting.settings, sectionContent, fullKey);
                        } else if (setting.type === 'multicheckbox') {
                            const sectionContent = modal.addSection(parent, setting.name);
                            for (const subKey in setting.values) {
                                modal.addCheckbox(sectionContent, setting.values[subKey], (value) => {
                                    this.settingsChanged(fullKey, value, subKey);
                                }, subKey);
                            }
                        } else if (setting.type === 'checkbox') {
                            modal.addCheckbox(parent, setting.value, (value) => {
                                this.settingsChanged(fullKey, value);
                            }, key);
                        } else if (setting.type === 'numinput') {
                            modal.addInput(parent, 'number', setting.value, '', setting.minValue, setting.maxValue, (value) => {
                                this.settingsChanged(fullKey, value);
                            }, key);
                        } else if (setting.type === 'text') {
                            modal.addInput(parent, 'text', setting.value, setting.placeholder, undefined, undefined, (value) => {
                                this.settingsChanged(fullKey, value);
                            }, key);
                        } else if (setting.type === 'radio') {
                            modal.addRadioButtons(parent, key, setting.options, setting.value, (value) => {
                                this.settingsChanged(fullKey, value);
                            }, key);
                        } else if (setting.type === 'combobox') {
                            modal.addCombobox(parent, setting.options, setting.value, (value) => {
                                this.settingsChanged(fullKey, value);
                            }, key);
                        } else if (setting.type === 'button') {
                            modal.addButton(parent, setting.name, setting.function, 'btn');
                        }
                    }
                };


                buildSettings(this.settings, content);

                // Make sure the content is attached to the DOM before adding buttons
                modal.addModal(content, `${this.prefix} Settings`, width, height, closeCallback);
            };
        }




    }

    // Assign to a single namespace
    window.zlef = {
        Modal,
        SettingsManager
    };

})();
