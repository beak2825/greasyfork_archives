// ==UserScript==
// @name         Wikimedia Commons Wikicode Presets
// @namespace    http://tampermonkey.net/
// @version      2025-07-19
// @description  Wikicode presets manager for Wikimedia Commons.
// @author       Franco Brignone
// @match        https://commons.wikimedia.org/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543055/Wikimedia%20Commons%20Wikicode%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/543055/Wikimedia%20Commons%20Wikicode%20Presets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'wikicode_presets';
    const SETTINGS_KEY = 'wikicode_presets_settings';

    function loadPresets() {
        return JSON.parse(GM_getValue(STORAGE_KEY, '[]'));
    }

    function savePresets(presets) {
        GM_setValue(STORAGE_KEY, JSON.stringify(presets));
    }

    function loadSettings() {
        const defaultSettings = {
            compactEnabled: false,
            compactTrigger: 'click', // or 'hover'
            compactAction: 'copy' // or 'paste'
        };
        const stored = GM_getValue(SETTINGS_KEY, null);
        if (!stored) return defaultSettings;
        try {
            const s = JSON.parse(stored);
            return {...defaultSettings, ...s};
        } catch {
            return defaultSettings;
        }
    }

    function saveSettings(settings) {
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
    }

    let settings = loadSettings();

    // Track last focused input or textarea so paste can insert there even after popup focus
    let lastFocusedInput = null;
    document.addEventListener('focusin', e => {
        const t = e.target;
        if (t && (t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && t.type === 'text'))) {
            lastFocusedInput = t;
        }
    });

    function insertAtCursor(text) {
        const active = lastFocusedInput || document.activeElement;
        if (!active) return false;
        if (active.tagName === 'TEXTAREA' || (active.tagName === 'INPUT' && active.type === 'text')) {
            const start = active.selectionStart;
            const end = active.selectionEnd;
            const val = active.value;
            active.value = val.slice(0, start) + text + val.slice(end);
            active.selectionStart = active.selectionEnd = start + text.length;
            active.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }
        return false;
    }

    const button = document.createElement('button');
    button.textContent = '+';
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '85px',
        right: '20px',
        background: '#0073ff',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        fontSize: '24px',
        cursor: 'pointer',
        zIndex: '9999',
        opacity: '0.4',
        transition: 'opacity 0.3s',
        userSelect: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    });
    button.title = 'Wikicode Presets';
    document.body.appendChild(button);

    button.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
    });
    button.addEventListener('mouseleave', () => {
        button.style.opacity = '0.4';
    });

    const settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = '⚙️';
    Object.assign(settingsBtn.style, {
        position: 'fixed',
        bottom: '90px',
        right: '70px',
        background: '#555',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        width: '32px',
        height: '32px',
        fontSize: '18px',
        cursor: 'pointer',
        opacity: '0.4',
        transition: 'opacity 0.3s',
        zIndex: '10000',
        userSelect: 'none',
        display: 'none',
        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
    });
    document.body.appendChild(settingsBtn);

    settingsBtn.addEventListener('mouseenter', () => { settingsBtn.style.opacity = '1'; });
    settingsBtn.addEventListener('mouseleave', () => { settingsBtn.style.opacity = '0.4'; });

    settingsBtn.onclick = () => {
        refreshModal();
        modal.style.display = 'block';
        compactPopup.style.display = 'none';
    };

    if (settings.compactEnabled) {
        settingsBtn.style.display = 'block';
    }

    const modal = document.createElement('div');
    Object.assign(modal.style, {
        display: 'none',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        padding: '25px 30px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        zIndex: '10000',
        maxWidth: '650px',
        width: '95%',
        maxHeight: '85%',
        overflowY: 'auto',
        borderRadius: '12px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
        userSelect: 'text',
    });
    document.body.appendChild(modal);

    const compactPopup = document.createElement('div');
    Object.assign(compactPopup.style, {
        display: 'none',
        position: 'fixed',
        bottom: '130px',
        right: '20px',
        background: '#fff',
        padding: '12px 14px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        zIndex: '10001',
        maxHeight: '320px',
        overflowY: 'auto',
        borderRadius: '8px',
        minWidth: '220px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: '14px',
        color: '#222',
        userSelect: 'none',
    });
    document.body.appendChild(compactPopup);

    function createButton(text, onClick, extraStyles = {}) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            marginRight: '8px',
            padding: '6px 14px',
            fontSize: '14px',
            borderRadius: '6px',
            border: '1.5px solid #0073ff',
            backgroundColor: '#0073ff',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s',
            userSelect: 'none',
            ...extraStyles,
        });
        btn.onmouseenter = () => {
            btn.style.backgroundColor = '#005ecb';
            btn.style.borderColor = '#005ecb';
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = '#0073ff';
            btn.style.borderColor = '#0073ff';
        };
        btn.onclick = onClick;
        return btn;
    }

    function refreshModal() {
        modal.innerHTML = '';
        const presets = loadPresets();

        const title = document.createElement('h2');
        title.textContent = 'Wikicode Presets';
        title.style.marginBottom = '20px';
        title.style.color = '#0073ff';
        modal.appendChild(title);

        presets.forEach((preset, index) => {
            const container = document.createElement('div');
            Object.assign(container.style, {
                marginBottom: '18px',
                paddingBottom: '12px',
                borderBottom: '1px solid #eee',
            });

            const header = document.createElement('div');
            Object.assign(header.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px',
            });

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = preset.name;
            nameInput.placeholder = 'Preset name';
            Object.assign(nameInput.style, {
                flex: '1',
                marginRight: '10px',
                fontSize: '15px',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1.5px solid #ccc',
                transition: 'border-color 0.3s',
            });
            nameInput.onfocus = () => { nameInput.style.borderColor = '#0073ff'; };
            nameInput.onblur = () => { nameInput.style.borderColor = '#ccc'; };

            const toggleBtn = createButton(preset.hidden ? 'Show Code' : 'Hide Code', () => {
                preset.hidden = !preset.hidden;
                presets[index] = preset;
                savePresets(presets);
                refreshModal();
            });
            toggleBtn.style.flexShrink = '0';

            header.appendChild(nameInput);
            header.appendChild(toggleBtn);
            container.appendChild(header);

            if (!preset.hidden) {
                const textarea = document.createElement('textarea');
                textarea.value = preset.code;
                Object.assign(textarea.style, {
                    width: '100%',
                    height: '110px',
                    marginTop: '6px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    borderRadius: '6px',
                    border: '1.5px solid #ccc',
                    padding: '10px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s',
                });
                textarea.onfocus = () => { textarea.style.borderColor = '#0073ff'; };
                textarea.onblur = () => { textarea.style.borderColor = '#ccc'; };

                const btnRow = document.createElement('div');
                Object.assign(btnRow.style, { marginTop: '8px' });

                const copyBtn = createButton('Copy', () => {
                    navigator.clipboard.writeText(textarea.value.replace(/\r?\n/g, '\n'));
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
                });

                const saveBtn = createButton('Save', () => {
                    presets[index] = { ...preset, name: nameInput.value.trim(), code: textarea.value };
                    savePresets(presets);
                    refreshModal();
                }, { backgroundColor: '#28a745', borderColor: '#28a745' });
                saveBtn.onmouseenter = () => {
                    saveBtn.style.backgroundColor = '#1e7e34';
                    saveBtn.style.borderColor = '#1e7e34';
                };
                saveBtn.onmouseleave = () => {
                    saveBtn.style.backgroundColor = '#28a745';
                    saveBtn.style.borderColor = '#28a745';
                };

                const deleteBtn = createButton('Delete', () => {
                    if (confirm(`Delete preset "${preset.name || '(Unnamed)'}"?`)) {
                        presets.splice(index, 1);
                        savePresets(presets);
                        refreshModal();
                    }
                }, { backgroundColor: '#dc3545', borderColor: '#dc3545' });
                deleteBtn.onmouseenter = () => {
                    deleteBtn.style.backgroundColor = '#b02a37';
                    deleteBtn.style.borderColor = '#b02a37';
                };
                deleteBtn.onmouseleave = () => {
                    deleteBtn.style.backgroundColor = '#dc3545';
                    deleteBtn.style.borderColor = '#dc3545';
                };

                btnRow.appendChild(copyBtn);
                btnRow.appendChild(saveBtn);
                btnRow.appendChild(deleteBtn);

                container.appendChild(textarea);
                container.appendChild(btnRow);
            } else {
                const quickCopy = createButton('Copy', () => {
                    navigator.clipboard.writeText(preset.code.replace(/\r?\n/g, '\n'));
                    quickCopy.textContent = 'Copied!';
                    setTimeout(() => { quickCopy.textContent = 'Copy'; }, 1500);
                });
                container.appendChild(quickCopy);
            }

            modal.appendChild(container);
        });

        // Settings section
        const settingsContainer = document.createElement('div');
        Object.assign(settingsContainer.style, {
            marginTop: '25px',
            paddingTop: '15px',
            borderTop: '2px solid #0073ff',
        });

        const compactToggleLabel = document.createElement('label');
        compactToggleLabel.style.display = 'flex';
        compactToggleLabel.style.alignItems = 'center';
        compactToggleLabel.style.fontSize = '15px';
        compactToggleLabel.style.marginBottom = '10px';
        compactToggleLabel.style.userSelect = 'none';

        const compactToggle = document.createElement('input');
        compactToggle.type = 'checkbox';
        compactToggle.checked = settings.compactEnabled;
        compactToggle.style.marginRight = '8px';
        compactToggle.onchange = () => {
            settings.compactEnabled = compactToggle.checked;
            saveSettings(settings);
            alert('Compact View ' + (settings.compactEnabled ? 'enabled' : 'disabled') + '. Reload page to apply.');
        };

        compactToggleLabel.appendChild(compactToggle);
        compactToggleLabel.appendChild(document.createTextNode('Enable Compact View'));

        const triggerSelectLabel = document.createElement('label');
        triggerSelectLabel.style.marginLeft = '15px';
        triggerSelectLabel.style.userSelect = 'none';
        triggerSelectLabel.style.fontSize = '15px';
        triggerSelectLabel.textContent = 'Trigger on: ';

        const triggerSelect = document.createElement('select');
        triggerSelect.style.marginLeft = '8px';
        triggerSelect.style.padding = '4px 6px';
        triggerSelect.style.borderRadius = '6px';
        triggerSelect.style.border = '1.5px solid #ccc';
        triggerSelect.style.fontSize = '15px';
        ['click', 'hover'].forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
            if (settings.compactTrigger === opt) option.selected = true;
            triggerSelect.appendChild(option);
        });
        triggerSelect.onchange = () => {
            settings.compactTrigger = triggerSelect.value;
            saveSettings(settings);
            alert('Compact View trigger set to "' + settings.compactTrigger + '". Reload page to apply.');
        };

        const compactActionLabel = document.createElement('label');
        compactActionLabel.style.display = 'flex';
        compactActionLabel.style.alignItems = 'center';
        compactActionLabel.style.marginTop = '12px';
        compactActionLabel.style.fontSize = '15px';
        compactActionLabel.style.userSelect = 'none';

        compactActionLabel.textContent = 'On preset click: ';
        compactActionLabel.style.marginRight = '8px';

        const actionCopyLabel = document.createElement('label');
        actionCopyLabel.style.marginRight = '15px';
        actionCopyLabel.style.cursor = 'pointer';
        actionCopyLabel.style.userSelect = 'none';
        const actionCopyRadio = document.createElement('input');
        actionCopyRadio.type = 'radio';
        actionCopyRadio.name = 'compactAction';
        actionCopyRadio.value = 'copy';
        actionCopyRadio.checked = (settings.compactAction === 'copy');
        actionCopyRadio.style.marginRight = '4px';
        actionCopyLabel.appendChild(actionCopyRadio);
        actionCopyLabel.appendChild(document.createTextNode('Copy to clipboard'));

        const actionPasteLabel = document.createElement('label');
        actionPasteLabel.style.cursor = 'pointer';
        actionPasteLabel.style.userSelect = 'none';
        const actionPasteRadio = document.createElement('input');
        actionPasteRadio.type = 'radio';
        actionPasteRadio.name = 'compactAction';
        actionPasteRadio.value = 'paste';
        actionPasteRadio.checked = (settings.compactAction === 'paste');
        actionPasteRadio.style.marginRight = '4px';
        actionPasteLabel.appendChild(actionPasteRadio);
        actionPasteLabel.appendChild(document.createTextNode('Paste at cursor'));

        compactActionLabel.appendChild(actionCopyLabel);
        compactActionLabel.appendChild(actionPasteLabel);

        [actionCopyRadio, actionPasteRadio].forEach(radio => {
            radio.onchange = () => {
                if (radio.checked) {
                    settings.compactAction = radio.value;
                    saveSettings(settings);
                    alert('Compact View action set to "' + settings.compactAction + '". Reload page to apply.');
                }
            };
        });

        settingsContainer.appendChild(compactToggleLabel);

        const triggerContainer = document.createElement('div');
        triggerContainer.style.marginBottom = '10px';
        triggerContainer.appendChild(triggerSelectLabel);
        triggerSelectLabel.appendChild(triggerSelect);
        settingsContainer.appendChild(triggerContainer);

        settingsContainer.appendChild(compactActionLabel);

        modal.appendChild(settingsContainer);

        const addBtn = createButton('Add New Preset', () => {
            presets.push({ name: '', code: '', hidden: false });
            savePresets(presets);
            refreshModal();
        });
        addBtn.style.marginTop = '20px';

        const closeBtn = createButton('Close', () => { modal.style.display = 'none'; }, {
            backgroundColor: '#6c757d',
            borderColor: '#6c757d',
            marginLeft: '12px'
        });
        closeBtn.onmouseenter = () => {
            closeBtn.style.backgroundColor = '#565e64';
            closeBtn.style.borderColor = '#565e64';
        };
        closeBtn.onmouseleave = () => {
            closeBtn.style.backgroundColor = '#6c757d';
            closeBtn.style.borderColor = '#6c757d';
        };

        const btnRow = document.createElement('div');
        btnRow.style.marginTop = '24px';
        btnRow.appendChild(addBtn);
        btnRow.appendChild(closeBtn);

        modal.appendChild(btnRow);
    }

    function refreshCompactPopup() {
        compactPopup.innerHTML = '';
        const presets = loadPresets();
        if (!presets.length) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No presets saved.';
            emptyMsg.style.color = '#666';
            compactPopup.appendChild(emptyMsg);
            return;
        }

        presets.forEach(preset => {
            const item = document.createElement('div');
            item.textContent = preset.name || '(Unnamed)';
            Object.assign(item.style, {
                padding: '8px 10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                userSelect: 'none',
            });
            item.title = 'Click to ' + (settings.compactAction === 'paste' ? 'paste' : 'copy') + ' preset';

            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#e6f0ff';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });

            item.addEventListener('click', () => {
                if (settings.compactAction === 'paste') {
                    if (!insertAtCursor(preset.code.replace(/\r?\n/g, '\n'))) {
                        // fallback to copy
                        navigator.clipboard.writeText(preset.code.replace(/\r?\n/g, '\n'));
                        item.textContent = 'No input focused — Copied!';
                    } else {
                        item.textContent = 'Pasted!';
                    }
                } else {
                    navigator.clipboard.writeText(preset.code.replace(/\r?\n/g, '\n'));
                    item.textContent = 'Copied!';
                }
                setTimeout(() => { item.textContent = preset.name || '(Unnamed)'; }, 1500);
            });

            compactPopup.appendChild(item);
        });
    }

    if (settings.compactEnabled) {
        refreshCompactPopup();

        if (settings.compactTrigger === 'click') {
            button.onclick = (e) => {
                e.stopPropagation();
                if (compactPopup.style.display === 'block') {
                    compactPopup.style.display = 'none';
                } else {
                    compactPopup.style.display = 'block';
                    modal.style.display = 'none';
                }
            };

            document.addEventListener('click', () => {
                compactPopup.style.display = 'none';
            });

            compactPopup.addEventListener('click', e => e.stopPropagation());
        } else if (settings.compactTrigger === 'hover') {
            button.onmouseenter = () => {
                refreshCompactPopup();
                compactPopup.style.display = 'block';
                modal.style.display = 'none';
            };
            button.onmouseleave = () => {
                setTimeout(() => {
                    if (!compactPopup.matches(':hover') && !button.matches(':hover')) {
                        compactPopup.style.display = 'none';
                    }
                }, 300);
            };
            compactPopup.onmouseleave = () => {
                compactPopup.style.display = 'none';
            };
        }
        settingsBtn.style.display = 'block';
    } else {
        button.onclick = () => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            } else {
                refreshModal();
                modal.style.display = 'block';
            }
            compactPopup.style.display = 'none';
        };
        settingsBtn.style.display = 'none';
    }

})();