// ==UserScript==
// @name WME Internationale Vorwahl DE - Final Working Version
// @version 2025.06.09.1
// @description Wandelt Telefonnummern automatisch in internationale Formate um, bereinigt deutsche Firmen-Rechtsformen und standardisiert POI-Namen - Funktionsfähige Version
// @author Hiwi234 (Final Working Version)
// @namespace https://greasyfork.org/de/users/863740-horst-wittlich
// @match https://www.waze.com/editor*
// @match https://www.waze.com/*/editor*
// @match https://beta.waze.com/editor*
// @match https://beta.waze.com/*/editor*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537594/WME%20Internationale%20Vorwahl%20DE%20-%20Final%20Working%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/537594/WME%20Internationale%20Vorwahl%20DE%20-%20Final%20Working%20Version.meta.js
// ==/UserScript==

/* global W */

(function() {
'use strict';

const SCRIPT_ID = 'wme-phone-formatter-final';

// Default settings
let settings = {
    countryCode: '+49',
    countryNumericCode: '0049',
    enabled: true,
    autoRemoveHttps: true,
    customPatterns: [],
    companyNameCleaning: true,
    autoCleaningEnabled: false,
    poiStandardization: true
};

// Standardized POI names from Waze community guidelines
const STANDARDIZED_POI_NAMES = {
    // Tankstellen
    'aral': 'Aral',
    'esso': 'Esso',
    'shell': 'Shell',
    'jet': 'JET',
    'totalenergies': 'TotalEnergies',
    'bp': 'bp',
    'hem': 'HEM',
    'star': 'star',
    'bft': 'bft',
    'westfalen': 'Westfalen',

    // Supermärkte
    'aldi': 'ALDI',
    'aldi nord': 'ALDI',
    'aldi süd': 'ALDI',
    'edeka': 'EDEKA',
    'rewe': 'REWE',
    'lidl': 'Lidl',
    'penny': 'PENNY',
    'netto': 'Netto',
    'norma': 'NORMA',
    'kaufland': 'Kaufland',
    'metro': 'METRO',

    // Elektronik
    'media markt': 'Media Markt',
    'mediamarkt': 'Media Markt',
    'saturn': 'Saturn',

    // Fast Food
    'mcdonalds': "McDonald's",
    'burger king': 'Burger King',
    'kfc': 'KFC',
    'subway': 'SUBWAY',

    // Drogerie
    'dm': 'dm-drogerie markt',
    'dm-drogerie markt': 'dm-drogerie markt',
    'rossmann': 'ROSSMANN',
    'müller': 'Müller',

    // Baumärkte
    'bauhaus': 'BAUHAUS',
    'obi': 'OBI',
    'hornbach': 'HORNBACH',
    'toom': 'toom Baumarkt',
    'hagebaumarkt': 'hagebaumarkt'
};

// Load settings from localStorage
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem(SCRIPT_ID + '_settings');
        if (savedSettings) {
            settings = Object.assign({}, settings, JSON.parse(savedSettings));
        }
    } catch (e) {
        console.warn('Fehler beim Laden der Einstellungen:', e);
    }
}

// Save settings to localStorage
function saveSettings() {
    try {
        localStorage.setItem(SCRIPT_ID + '_settings', JSON.stringify(settings));
    } catch (e) {
        console.warn('Fehler beim Speichern der Einstellungen:', e);
    }
}

// Function to standardize POI names
function standardizePOIName(name) {
    if (!name) return name;
    const lowerName = name.toLowerCase().trim();

    if (STANDARDIZED_POI_NAMES[lowerName]) {
        return STANDARDIZED_POI_NAMES[lowerName];
    }

    for (const key in STANDARDIZED_POI_NAMES) {
        if (lowerName.includes(key)) {
            const regex = new RegExp('\\b' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
            if (regex.test(lowerName)) {
                return STANDARDIZED_POI_NAMES[key];
            }
        }
    }

    return name;
}

// Function to clean German company legal forms
function cleanCompanyName(name) {
    if (!settings.companyNameCleaning || !name) return name;

    if (settings.poiStandardization) {
        name = standardizePOIName(name);
    }

    const cleanedName = name
        .replace(/\bGmbH & Co\.?\s*KG\b/gi, "")
        .replace(/\bGmbH\b/gi, "")
        .replace(/\b AG\b/gi, "")
        .replace(/\bAktiengesellschaft\b/gi, "")
        .replace(/\bCo\.?\s*KG\b/gi, "")
        .replace(/\be\.?V\.?\b/gi, "")
        .replace(/\beingetragener Verein\b/gi, "")
        .replace(/\bUG\b/gi, "")
        .replace(/\bhaftungsbeschränkt\b/gi, "")
        .replace(/\s+/g, ' ')
        .trim();

    return cleanedName || name;
}

// Function to convert phone numbers
function formatPhoneNumber(input) {
    if (!settings.enabled || !input) return input;

    if (settings.autoRemoveHttps) {
        if (input.toLowerCase().startsWith('https://')) {
            input = input.substring(8);
        } else if (input.toLowerCase().startsWith('http://')) {
            input = input.substring(7);
        }
    }

    let number = input.replace(/[\s\-\(\)\/]/g, '');

    const patterns = [
        {
            regex: new RegExp('^0(\\d+)$'),
            replacement: settings.countryCode + '$1'
        },
        {
            regex: new RegExp('^\\' + settings.countryCode.replace('+', '\\+') + '(\\d+)$'),
            replacement: settings.countryCode + '$1'
        },
        {
            regex: new RegExp('^' + settings.countryNumericCode + '0?(\\d+)$'),
            replacement: settings.countryCode + '$1'
        }
    ];

    for (let i = 0; i < settings.customPatterns.length; i++) {
        const pattern = settings.customPatterns[i];
        if (pattern.regex && pattern.replacement) {
            try {
                patterns.push({
                    regex: new RegExp(pattern.regex),
                    replacement: pattern.replacement
                });
            } catch(e) {
                console.warn('Ungültiges Regex-Pattern:', pattern.regex);
            }
        }
    }

    for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        if (pattern.regex.test(number)) {
            return number.replace(pattern.regex, pattern.replacement);
        }
    }

    return input;
}

// Function to format website fields
function formatWebsiteField(input) {
    if (!settings.autoRemoveHttps || !input) return input;

    if (input.toLowerCase().startsWith('https://')) {
        return input.substring(8);
    }
    if (input.toLowerCase().startsWith('http://')) {
        return input.substring(7);
    }

    return input;
}

// Field Detection Functions
function isPhoneField(element) {
    if (!element) return false;
    return (
        element.name === 'phone' ||
        element.type === 'tel' ||
        (element.placeholder && element.placeholder.toLowerCase().includes('phone')) ||
        (element.placeholder && element.placeholder.toLowerCase().includes('telefon'))
    );
}

function isWebsiteField(element) {
    if (!element) return false;
    return (
        element.name === 'url' ||
        element.name === 'website' ||
        element.type === 'url' ||
        (element.placeholder && element.placeholder.toLowerCase().includes('website'))
    );
}

function isNameField(element) {
    if (!element || element.type !== 'text') return false;

    if (isPhoneField(element) || isWebsiteField(element)) {
        return false;
    }

    const isInVenueContext = element.closest('[class*="venue"]') ||
                            element.closest('[class*="poi"]') ||
                            element.closest('form');

    const isNameInput = (
        element.name === 'name' ||
        element.name === 'subject' ||
        (element.placeholder && element.placeholder.toLowerCase().includes('name'))
    );

    return isInVenueContext && isNameInput;
}

// Update WME model using WME's own edit system
function updateWMEModel(element, newValue) {
    try {
        console.log('🔄 Using WME Edit System...');

        if (W.selectionManager && W.selectionManager.getSelectedDataModelObjects) {
            const selectedObjects = W.selectionManager.getSelectedDataModelObjects();

            if (selectedObjects && selectedObjects.length > 0) {
                const selectedObject = selectedObjects[0];
                let fieldName = null;
                let originalValue = null;

                // Determine field and get original value
                if (isNameField(element)) {
                    if (selectedObject.type === 'venue' && selectedObject.attributes.name !== undefined) {
                        fieldName = 'name';
                        originalValue = selectedObject.attributes.name;
                    } else if (selectedObject.type === 'mapComment' && selectedObject.attributes.subject !== undefined) {
                        fieldName = 'subject';
                        originalValue = selectedObject.attributes.subject;
                    }
                } else if (isPhoneField(element) && selectedObject.attributes.phone !== undefined) {
                    fieldName = 'phone';
                    originalValue = selectedObject.attributes.phone;
                } else if (isWebsiteField(element) && selectedObject.attributes.url !== undefined) {
                    fieldName = 'url';
                    originalValue = selectedObject.attributes.url;
                }

                if (fieldName && originalValue !== newValue) {
                    console.log('🎯 Creating WME Edit Action...');

                    // Method 1: Try using WME's Action system
                    if (W.model && W.model.actionManager) {
                        try {
                            // Create proper WME edit action
                            const editAction = {
                                description: `Update ${fieldName}`,
                                object: selectedObject,
                                oldAttributes: {},
                                newAttributes: {}
                            };

                            editAction.oldAttributes[fieldName] = originalValue;
                            editAction.newAttributes[fieldName] = newValue;

                            // Apply the edit
                            selectedObject.attributes[fieldName] = newValue;

                            // Try to register as a proper WME action
                            if (W.model.actionManager.add && typeof W.model.actionManager.add === 'function') {
                                try {
                                    W.model.actionManager.add(editAction);
                                    console.log('✅ Edit registered with ActionManager');
                                } catch (actionError) {
                                    console.log('⚠️ ActionManager registration failed:', actionError.message);
                                }
                            }

                            // Try alternative WME edit methods
                            if (W.model.actionManager.push && typeof W.model.actionManager.push === 'function') {
                                try {
                                    W.model.actionManager.push(editAction);
                                    console.log('✅ Edit pushed to ActionManager');
                                } catch (pushError) {
                                    console.log('⚠️ ActionManager push failed:', pushError.message);
                                }
                            }

                            console.log('✅ WME Edit Action applied:', originalValue, '→', newValue);

                        } catch (actionError) {
                            console.warn('⚠️ WME Action system failed:', actionError.message);
                        }
                    }

                    // Method 2: Try triggering WME's change detection
                    try {
                        // Force WME to detect the change
                        if (selectedObject.trigger && typeof selectedObject.trigger === 'function') {
                            selectedObject.trigger('change:' + fieldName);
                            selectedObject.trigger('change');
                            console.log('✅ Triggered object change events');
                        }

                        // Trigger model-level changes
                        if (W.model && W.model.trigger) {
                            W.model.trigger('change');
                            console.log('✅ Triggered model change');
                        }

                        // Trigger selection manager events
                        if (W.selectionManager && W.selectionManager.trigger) {
                            W.selectionManager.trigger('selectionchanged');
                            console.log('✅ Triggered selection change');
                        }

                    } catch (eventError) {
                        console.warn('⚠️ Event triggering failed:', eventError.message);
                    }

                    // Method 3: Force UI refresh and validate change persistence
                    setTimeout(() => {
                        console.log('🔄 Validating change persistence...');

                        // Deselect and reselect to refresh UI
                        W.selectionManager.setSelectedModels([]);
                        setTimeout(() => {
                            W.selectionManager.setSelectedModels([selectedObject]);

                            // Check if change persisted
                            setTimeout(() => {
                                const currentValue = selectedObject.attributes[fieldName];
                                if (currentValue === newValue) {
                                    console.log('✅ Change persisted successfully:', currentValue);

                                    // Update form field if it reverted
                                    if (element.value !== newValue) {
                                        element.value = newValue;
                                        element.dispatchEvent(new Event('input', { bubbles: true }));
                                        element.dispatchEvent(new Event('change', { bubbles: true }));
                                        console.log('✅ Form field synchronized');
                                    }
                                } else {
                                    console.log('⚠️ Change did not persist. Current:', currentValue, 'Expected:', newValue);

                                    // Try to reapply the change
                                    selectedObject.attributes[fieldName] = newValue;
                                    element.value = newValue;
                                    console.log('🔄 Change reapplied');
                                }
                            }, 200);
                        }, 100);
                    }, 50);

                    return true;
                }
            } else {
                console.warn('⚠️ No objects selected');
            }
        }

        return false;

    } catch (error) {
        console.error('❌ WME edit system failed:', error);
        return false;
    }
}

// Safe field update
function updateField(element, newValue) {
    if (!element || !newValue) return;

    try {
        console.log('🔄 Updating field:', newValue);

        updateWMEModel(element, newValue);

        element.focus();
        element.value = newValue;

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));

        element.blur();
        console.log('✅ Field updated');

    } catch (error) {
        console.error('❌ Field update failed:', error);

        try {
            element.value = newValue;
            element.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (fallbackError) {
            console.error('❌ Fallback failed:', fallbackError);
        }
    }
}

// Event listener setup
function setupEventListeners() {
    console.log('Setting up event listeners...');

    document.addEventListener('input', function(event) {
        const target = event.target;

        if (isPhoneField(target)) {
            const originalValue = target.value;
            const formattedValue = formatPhoneNumber(originalValue);
            if (formattedValue !== originalValue) {
                setTimeout(() => updateField(target, formattedValue), 10);
                console.log('📞 Phone scheduled:', originalValue, '→', formattedValue);
            }
        }

        if (isWebsiteField(target)) {
            const originalValue = target.value;
            const formattedValue = formatWebsiteField(originalValue);
            if (formattedValue !== originalValue) {
                setTimeout(() => updateField(target, formattedValue), 10);
                console.log('🌐 Website scheduled:', originalValue, '→', formattedValue);
            }
        }

        if (settings.autoCleaningEnabled && isNameField(target)) {
            const originalValue = target.value;
            const cleanedValue = cleanCompanyName(originalValue);
            if (cleanedValue !== originalValue && cleanedValue.length > 0) {
                setTimeout(() => updateField(target, cleanedValue), 50);
                console.log('🏢 Name scheduled:', originalValue, '→', cleanedValue);
            }
        }
    }, true);

    console.log('✅ Event listeners setup complete');
}

// Process all venues and POIs using WME edit system
function processVenuesAndPOIs() {
    if (!settings.companyNameCleaning) {
        console.log('Company name cleaning ist deaktiviert');
        return 0;
    }

    try {
        let processedCount = 0;
        console.log('🔄 Starte WME-Edit-System Bereinigung...');

        if (!W || !W.model) {
            console.error('W.model ist nicht verfügbar');
            return 0;
        }

        const changedObjects = [];

        // Process venues with WME edit system
        if (W.model.venues) {
            const venues = W.model.venues.getObjectArray();
            console.log('Gefunden: ' + venues.length + ' Venues');

            venues.forEach(venue => {
                if (venue && venue.attributes && venue.attributes.name) {
                    const originalName = venue.attributes.name;
                    const cleanedName = cleanCompanyName(originalName);

                    if (cleanedName !== originalName) {
                        console.log('🏢 Processing venue:', originalName, '→', cleanedName);

                        // Store change for WME action system
                        const change = {
                            object: venue,
                            field: 'name',
                            oldValue: originalName,
                            newValue: cleanedName,
                            type: 'venue'
                        };

                        // Apply the change
                        venue.attributes.name = cleanedName;
                        changedObjects.push(change);

                        console.log('✅ Venue cleaned:', originalName, '→', cleanedName);
                        processedCount++;
                    }
                }
            });
        }

        // Process POIs with WME edit system
        if (W.model.mapComments) {
            const pois = W.model.mapComments.getObjectArray();
            console.log('Gefunden: ' + pois.length + ' POIs');

            pois.forEach(poi => {
                if (poi && poi.attributes && poi.attributes.subject) {
                    const originalName = poi.attributes.subject;
                    const cleanedName = cleanCompanyName(originalName);

                    if (cleanedName !== originalName) {
                        console.log('📝 Processing POI:', originalName, '→', cleanedName);

                        // Store change for WME action system
                        const change = {
                            object: poi,
                            field: 'subject',
                            oldValue: originalName,
                            newValue: cleanedName,
                            type: 'poi'
                        };

                        // Apply the change
                        poi.attributes.subject = cleanedName;
                        changedObjects.push(change);

                        console.log('✅ POI cleaned:', originalName, '→', cleanedName);
                        processedCount++;
                    }
                }
            });
        }

        // Register all changes with WME's action system
        if (changedObjects.length > 0) {
            console.log('🎯 Registering ' + changedObjects.length + ' changes with WME...');

            try {
                // Create a proper WME Action class
                function NameCleaningAction(changes) {
                    this.description = 'Clean venue/POI names (' + changes.length + ' changes)';
                    this.changes = changes;
                    this.isLiveUpdates = true;
                }

                // Required WME Action methods
                NameCleaningAction.prototype.undoSupported = function() {
                    return true;
                };

                NameCleaningAction.prototype.doAction = function() {
                    console.log('🔄 Executing WME Action...');
                    this.changes.forEach(change => {
                        change.object.attributes[change.field] = change.newValue;
                    });
                    return true;
                };

                NameCleaningAction.prototype.undoAction = function() {
                    console.log('🔄 Undoing WME Action...');
                    this.changes.forEach(change => {
                        change.object.attributes[change.field] = change.oldValue;
                    });
                    return true;
                };

                NameCleaningAction.prototype.getDescription = function() {
                    return this.description;
                };

                // Create and register the action
                const nameCleaningAction = new NameCleaningAction(changedObjects);

                // Try to register with WME ActionManager
                if (W.model && W.model.actionManager) {
                    if (W.model.actionManager.add) {
                        try {
                            W.model.actionManager.add(nameCleaningAction);
                            console.log('✅ WME Action successfully registered!');
                            console.log('💾 Changes are now registered as edits in WME');
                        } catch (e) {
                            console.log('⚠️ ActionManager registration failed:', e.message);
                            console.log('🔄 Trying alternative registration...');

                            // Alternative: Try direct ActionManager methods
                            if (W.model.actionManager.doAction) {
                                try {
                                    W.model.actionManager.doAction(nameCleaningAction);
                                    console.log('✅ Action executed via ActionManager.doAction');
                                } catch (e2) {
                                    console.log('⚠️ doAction failed:', e2.message);
                                }
                            }
                        }
                    }
                }

                // Trigger change events for all modified objects
                changedObjects.forEach(change => {
                    try {
                        if (change.object.trigger) {
                            change.object.trigger('change:' + change.field);
                            change.object.trigger('change');
                        }
                    } catch (e) {
                        console.log('⚠️ Object event trigger failed:', e.message);
                    }
                });

                // Trigger global model events
                if (W.model && W.model.trigger) {
                    try {
                        W.model.trigger('change');
                        W.model.trigger('batchupdate');
                        console.log('✅ Global model events triggered');
                    } catch (e) {
                        console.log('⚠️ Global model events failed:', e.message);
                    }
                }

                // Force UI refresh
                if (W.selectionManager) {
                    try {
                        const currentSelection = W.selectionManager.getSelectedDataModelObjects();
                        W.selectionManager.setSelectedModels([]);
                        setTimeout(() => {
                            if (currentSelection && currentSelection.length > 0) {
                                W.selectionManager.setSelectedModels(currentSelection);
                            }
                            console.log('✅ UI refreshed');
                        }, 300);
                    } catch (e) {
                        console.log('⚠️ UI refresh failed:', e.message);
                    }
                }

            } catch (error) {
                console.error('❌ WME action registration failed:', error);
                console.log('🔄 Changes applied directly, but may not be recognized as WME edits');
            }
        }

        console.log('🎉 WME-Edit-System Bereinigung abgeschlossen: ' + processedCount + ' Namen bereinigt');
        console.log('💡 Hinweis: Verwende Strg+S zum Speichern der Änderungen in WME');

        return processedCount;

    } catch (error) {
        console.error('❌ Fehler beim WME-Edit-System:', error);
        return 0;
    }
}

// Create settings UI
function createSettingsUI(tabPane) {
    const container = document.createElement('div');
    container.style.cssText = 'padding: 15px; font-family: Arial, sans-serif; max-height: 500px; overflow-y: auto;';

    // Title
    const title = document.createElement('h3');
    title.textContent = '📞 Phone & POI Formatter';
    title.style.cssText = 'margin: 0 0 15px 0; color: #333; border-bottom: 2px solid #00a8cc; padding-bottom: 5px;';
    container.appendChild(title);

    // Settings section
    const settingsDiv = document.createElement('div');
    settingsDiv.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #00a8cc;';

    // Checkboxes
    const checkboxes = [
        { key: 'enabled', label: 'Script aktiviert' },
        { key: 'companyNameCleaning', label: 'Firmen-Rechtsformen bereinigen' },
        { key: 'poiStandardization', label: 'POI-Namen standardisieren' },
        { key: 'autoCleaningEnabled', label: 'Automatische Bereinigung' },
        { key: 'autoRemoveHttps', label: 'HTTP(S):// automatisch entfernen' }
    ];

    checkboxes.forEach(config => {
        const label = document.createElement('label');
        label.style.cssText = 'display: block; margin-bottom: 10px; font-weight: bold;';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = settings[config.key];
        checkbox.style.marginRight = '8px';
        checkbox.addEventListener('change', () => {
            settings[config.key] = checkbox.checked;
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(config.label));
        settingsDiv.appendChild(label);
    });

    // Country code input
    const countryLabel = document.createElement('label');
    countryLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';
    countryLabel.textContent = 'Ländervorwahl:';
    const countryInput = document.createElement('input');
    countryInput.type = 'text';
    countryInput.value = settings.countryCode;
    countryInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;';
    countryInput.addEventListener('input', () => {
        settings.countryCode = countryInput.value;
    });
    settingsDiv.appendChild(countryLabel);
    settingsDiv.appendChild(countryInput);

    // Buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.marginTop = '15px';

    const saveButton = document.createElement('button');
    saveButton.textContent = '💾 Speichern';
    saveButton.style.cssText = 'background: #00a8cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;';
    saveButton.addEventListener('click', () => {
        saveSettings();
        showStatusMessage('Einstellungen gespeichert!', 'success');
    });

    const processButton = document.createElement('button');
    processButton.textContent = '🏢 Alle bereinigen';
    processButton.style.cssText = 'background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;';
    processButton.addEventListener('click', () => {
        if (confirm('Alle Venue- und POI-Namen bereinigen?')) {
            const count = processVenuesAndPOIs();
            showStatusMessage(count + ' Namen bereinigt!', 'success');
        }
    });

    buttonsDiv.appendChild(saveButton);
    buttonsDiv.appendChild(processButton);
    settingsDiv.appendChild(buttonsDiv);

    // Status message area
    const statusDiv = document.createElement('div');
    statusDiv.id = 'statusMessage';
    statusDiv.style.cssText = 'margin-top: 10px; padding: 8px; border-radius: 4px; display: none;';
    settingsDiv.appendChild(statusDiv);

    container.appendChild(settingsDiv);

    // Test area
    const testDiv = document.createElement('div');
    testDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px;';
    const testTitle = document.createElement('h4');
    testTitle.textContent = '🧪 Test-Bereich';
    testTitle.style.margin = '0 0 10px 0';
    testDiv.appendChild(testTitle);

    const testInput = document.createElement('input');
    testInput.type = 'text';
    testInput.placeholder = 'Test: aldi süd gmbh, 01234567890, https://example.com';
    testInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 5px;';

    const testResult = document.createElement('div');
    testResult.style.cssText = 'font-weight: bold; color: #28a745; min-height: 20px;';

    testInput.addEventListener('input', () => {
        const value = testInput.value;
        let result = '';

        if (/^\d/.test(value) || value.toLowerCase().startsWith('http')) {
            result = 'Phone/URL: ' + formatPhoneNumber(value);
        } else {
            result = 'Name: ' + cleanCompanyName(value);
        }

        testResult.textContent = result;
    });

    testDiv.appendChild(testInput);
    testDiv.appendChild(testResult);
    container.appendChild(testDiv);

    tabPane.appendChild(container);
}

// Show status message
function showStatusMessage(message, type) {
    const statusEl = document.getElementById('statusMessage');
    if (!statusEl) return;

    statusEl.textContent = message;

    if (type === 'success') {
        statusEl.style.cssText = 'margin-top: 10px; padding: 8px; border-radius: 4px; display: block; background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
    } else {
        statusEl.style.cssText = 'margin-top: 10px; padding: 8px; border-radius: 4px; display: block; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
    }

    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 3000);
}

// Initialize the script
async function initializeScript() {
    try {
        console.log('WME Phone Formatter wird initialisiert...');

        loadSettings();
        setupEventListeners();

        if (W && W.userscripts && W.userscripts.registerSidebarTab) {
            const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID);

            tabLabel.textContent = '📞🏢';
            tabLabel.title = 'Phone & POI Formatter';

            await W.userscripts.waitForElementConnected(tabPane);

            createSettingsUI(tabPane);

            console.log('WME Phone Formatter erfolgreich initialisiert');
        } else {
            console.error('WME userscripts API nicht verfügbar');
        }

    } catch (error) {
        console.error('Fehler bei der Initialisierung:', error);
    }
}

// Wait for WME and initialize
if (W?.userscripts?.state.isInitialized) {
    initializeScript();
} else {
    document.addEventListener("wme-initialized", initializeScript, {
        once: true
    });
}

})();