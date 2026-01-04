/**
 * @file    Library for userscripts on AnimeBytes.
 * @author  TheFallingMan
 * @version 1.1.0
 * @license GPL-3.0
 *
 * Exports `delicious`, containing `delicious.settings` and
 * `delicious.utilities`.
 *
 * This implements settings, providing functions for storing and setting
 * values, and methods to create an organised userscript settings page within
 * the user's profile settings.
 *
 * Additionally, provides several (hopefully) useful functions through
 * `delicious.utilities`.
 */

/* global GM_setValue:false, GM_getValue:false */

/**
 * @namespace
 * Root namespace for the delicious library.
 */
var delicious = (function ABDeliciousLibrary(){ // eslint-disable-line no-unused-vars
    "use strict";

    /**
     * A helper function for creating a HTML element, defining some properties
     * on it and appending child nodes.
     *
     * @param {string} tagName The type of element to create.
     * @param {Object.<string, any>} properties
     * An object containing properties to set on the new element.
     * Note: does not support nested elements (e.g. "style.width" does _not_ work).
     * @param {(Node[]|string[])} children Child nodes and/or text to append.
     */
    function newElement(tagName, properties, children) {
        var elem = document.createElement(tagName);
        if (properties) {
            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    elem[key] = properties[key];
                }
            }
        }
        if (children) {
            for (var i = 0; i < children.length; i++) {
                if (typeof children[i] === 'string') {
                    elem.appendChild(document.createTextNode(children[i]));
                } else {
                    elem.appendChild(children[i]);
                }
            }
        }
        return elem;
    }

    /**
     * Logs a message to the debug console, prefixing it if it is a string.
     *
     * @param {any} message
     */
    function log(message) {
        console.debug(
            typeof message === 'string' ? ('[Delicious] '+message) : message
        );
    }

    /**
     * Uesful Javascript functions related to AnimeBytes.
     */
    var utilities = {
        /**
         * Click handler for those triangles which drop down menus. Toggles
         * displaying the associated submenu.
         *
         * @param {MouseEvent} ev
         */
        toggleSubnav: function(ev) {
            // Begin at the bound element.
            var current = ev.target;
            // Keep traversing up the node's parents until we find an
            // adjacent .subnav element.
            while (current
                    && !(current.nextSibling && current.nextSibling.classList.contains('subnav'))) {
                current = current.parentNode;
            }
            if (!current)
                return;
            var subnav = current.nextSibling;

            // Remove already open menus.
            var l = document.querySelectorAll('ul.subnav');
            for (var i = 0; i < l.length; i++) {
                if (l[i] === subnav)
                    continue;
                l[i].style.display = 'none';
            }
            var k = document.querySelectorAll('li.navmenu.selected');
            for (var j = 0; j < k.length; j++) {
                k[j].classList.remove('selected');
            }

            // Logic to toggle visibility.
            var willShow = (subnav.style.display==='none');
            subnav.style.display = willShow?'block':'none';
            if (willShow)
                subnav.parentNode.classList.add('selected');
            else
                subnav.parentNode.classList.remove('selected');

            ev.stopPropagation();
            ev.preventDefault();
            return false;
        },

        /**
         * Applies default options to an object containing possibly
         * incomplete options.
         *
         * @param {Object.<string, any>} options User-specified options.
         * @param {Object.<string, any>} defaults Default options.
         * @returns {Object.<string, any>} Object containing user-specified
         * option if it is present, else the default.
         */
        applyDefaults: function(options, defaults) {
            if (!options)
                return defaults;
            var newObject = {};
            for (var key in defaults) {
                if (defaults.hasOwnProperty(key)) {
                    if (options.hasOwnProperty(key))
                        newObject[key] = options[key];
                    else
                        newObject[key] = defaults[key];
                }
            }
            for (var key2 in options) {
                if (!newObject.hasOwnProperty(key2)) {
                    newObject[key2] = options[key2];
                }
            }
            return newObject;
        },

        /**
         * Makes the given text suitable for inserting into HTML as text.
         *
         * @param {string} text Bare text.
         * @returns {string} HTML escaped text.
         */
        htmlEscape: function(text) {
            return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        /** A non-breaking space character. */
        nbsp: '\xa0',

        _bytes_units: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
        _bytes_base: 1024,

        /**
         * Parses a string containing a number of bytes (e.g. "4.25 GiB") and
         * returns the number of bytes.
         *
         * Note: uses IEC prefixes (KiB, MiB, etc.).
         *
         * @param {string} bytesString Bytes as string.
         * @returns {number} Number of bytes.
         */
        parseBytes: function(bytesString) {
            var split = bytesString.split(/\s+/);
            var significand = parseFloat(split[0]);
            var magnitude = this._bytes_units.indexOf(split[1]);
            if (magnitude === -1)
                throw 'Bytes unit not recognised. Make sure you are using IEC prefixes (KiB, MiB, etc.)';
            return significand * Math.pow(this._bytes_base, magnitude);
        },

        /**
         * Formats a number of bytes as a string with an appropriate unit.
         *
         * @param {number} numBytes Number of bytes
         * @param {number} [decimals=2] Number of decimal places to use.
         * @returns {string} Bytes formatted as string.
         */
        formatBytes: function(numBytes, decimals) {
            // Adapted from https://stackoverflow.com/a/18650828
            if (numBytes === 0)
                return '0 ' + this._bytes_units[0];
            if (decimals === undefined)
                decimals = 2;
            var magnitude = Math.floor(Math.log(numBytes) / Math.log(this._bytes_base));
            // Extra parseFloat is so trailing 0's are removed.
            return parseFloat(
                (numBytes / Math.pow(this._bytes_base, magnitude)).toFixed(decimals)
            ) + ' ' + this._bytes_units[magnitude];
        },

        /**
         * Given a element.dataset property name in camelCase, returns the corresponding
         * data- attribute name with hyphens.
         * @param {string} str JS `dataset` name.
         * @returns {string} HTML `data-` name.
         */
        toDataAttr: function(str) {
            return 'data-'+str.replace(/[A-Z]/g, function(a){return '-'+a.toLowerCase();});
        }
    };

    var _isSettingsPage = window.location.href.indexOf('/user.php?action=edit') !== -1;

    /**
     * Container for all setting-related functions.
     */
    var settings = {
        /** Prefix used when setting element ID attributes. */
        _idPrefix: 'setting_',
        /** Event type used when saving. */
        _eventName: 'deliciousSave',
        /** Data attribute JS name for primary keys. */
        _settingKey: 'settingKey',
        /** Data attribute JS name for subkeys. */
        _settingSubkey: 'settingSubkey',

        /** HTML attribute name for primary keys. */
        _dataSettingKey: utilities.toDataAttr('settingKey'),
        /** HTML attribute name for primary subkeys. */
        _dataSettingSubkey: utilities.toDataAttr('settingSubkey'),

        /** Whether this page is a user settings page. */
        isSettingsPage: _isSettingsPage,

        /**
         * Creates the delicious settings `div`.
         * @returns {HTMLDivElement}
         */
        _createDeliciousPage: function() {
            log('Creating settings page...');
            var settingsDiv = document.createElement('div');
            settingsDiv.id = 'delicious_settings';

            var header = document.createElement('div');
            header.className = 'head colhead_dark strong';
            header.textContent = 'Userscript Settings';
            settingsDiv.appendChild(header);

            var settingsList = document.createElement('ul');
            settingsList.className = 'nobullet ue_list';

            var simpleSection = document.createElement('div');
            simpleSection.id = 'delicious_basic_settings';
            settingsList.appendChild(simpleSection);

            settingsDiv.appendChild(settingsList);

            return settingsDiv;
        },

        /**
         * Click handler for user profile tab links. Displays the clicked page
         * and hides any other page.
         *
         * @param {MouseEvent} ev
         */
        _tabLinkClick: function(ev) {
            log('Clicked tab link: ' + ev.target.textContent);
            var clickedId = ev.target.getAttribute('href').replace(/^#/, '');
            document.querySelector('.ue_tabs .selected').classList.remove('selected');
            var tabs = document.querySelectorAll('#tabs > div');
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].style.display = (tabs[i].id === clickedId)?'block':'none';
            }

            ev.target.classList.add('selected');
            ev.stopPropagation();
            ev.preventDefault();
            return false;
        },

        /**
         * Attaches our click handler to the existing tab links.
         */
        _relinkClickHandlers: function() {
            log('Rebinding tab click handlers...');
            var tabLinks = document.querySelectorAll('.ue_tabs a');
            for (var i = 0; i < tabLinks.length; i++) {
                tabLinks[i].addEventListener('click', this._tabLinkClick);
            }
        },

        /**
         * Inserts the given settings div into the user settings page.
         * @param {string} label Name to display for this page.
         * @param {HTMLDivElement} settingsPage Element containing the page.
         */
        insertSettingsPage: function(label, settingsPage) {
            log('Inserting a settings page...');
            var linkItem = document.createElement('li');
            linkItem.appendChild(document.createTextNode('•'));

            var link = document.createElement('a');
            link.href = '#' + settingsPage.id;
            link.textContent = label;
            linkItem.appendChild(link);

            document.querySelector('.ue_tabs').appendChild(linkItem);
            this._relinkClickHandlers();

            settingsPage.style.display = 'none';
            var tabs = document.querySelector('#tabs');
            tabs.insertBefore(settingsPage, tabs.lastElementChild);
        },

        /**
         * Inserts the delicious settings page. Attaches a listener to the
         * form `submit` event, and temporarily disables the default `onsubmit`
         * attribute which is set.
         */
        _insertDeliciousSettings: function() {
            this.insertSettingsPage('Userscript Settings',
                this._createDeliciousPage());

            var userform = document.querySelector('form#userform');
            userform.addEventListener('submit', this._deliciousSaveAndSubmit);

            if (userform.hasAttribute('onsubmit')) {
                userform.dataset['onsubmit'] = userform.getAttribute('onsubmit');
                userform.removeAttribute('onsubmit');
                log('Previous onsubmit: ' + userform.dataset['onsubmit']);
            }
        },

        _settingsInserted: !!document.getElementById('delicious_settings'),

        /**
         * Ensures the settings page has been inserted, creating and inserting
         * it if the page is a user settings page.
         *
         * Returns true if on the user settings page, false otherwise.
         */
        ensureSettingsInserted: function() {
            if (!this.isSettingsPage) {
                log('Not a profile settings page; doing nothing...');
                if (!this.rootSettingsList) {
                    this._basicSection = newElement('div',
                        {id: 'delicious_basic_settings',
                            className: 'dummy'});
                    this.rootSettingsList = newElement('ul',
                        {className: 'dummy nobullet ue_list'},
                        [this._basicSection]);
                }
                return false;
            } else {
                if (!this._settingsInserted) {
                    log('Settings not yet inserted; inserting...');
                    this._settingsInserted = true;

                    this._insertDeliciousSettings();
                } else {
                    log('Settings already inserted; continuing...');
                }
                if (!this.rootSettingsList) {
                    log('Locating settings div...');
                    this.rootSettingsList = document.querySelector('#delicious_settings .ue_list');
                    this._basicSection = this.rootSettingsList.querySelector('#delicious_basic_settings');
                }
                return true;
            }
        },

        /**
         * Saves the settings and submits the rest of the user settings form.
         * @param {Event} ev Form element.
         */
        _deliciousSaveAndSubmit: function(ev) {
            if (settings.saveAllSettings(ev.target)) {
                ev.target.removeEventListener('submit', settings._deliciousSaveAndSubmit);
                if (ev.target.dataset['onsubmit'])
                    ev.target.setAttribute('onsubmit', ev.target.dataset['onsubmit']);
                ev.target.submit();
            } else {
                var errorBox = document.querySelector('.error_message');
                if (errorBox)
                    errorBox.scrollIntoView();
                ev.stopPropagation();
                ev.preventDefault();
            }
        },

        /**
         * Sends the save event to all elements contained within `rootElement`
         * and with the appropriate `data-` settings attribute set.
         * @param {HTMLElement} rootElement Root element.
         * @returns {boolean} True if all elements saved successfully, false otherwise.
         */
        saveAllSettings: function(rootElement) {
            log('Saving all settings...');
            var cancelled = false;
            var settingsItems = rootElement.querySelectorAll('['+this._dataSettingKey+']');
            for (var i = 0; i < settingsItems.length; i++) {
                log('Sending save event for setting key: ' + settingsItems[i].dataset[this._settingKey]);
                var saveEvent = new Event(this._eventName, {cancelable: true});
                if (!settingsItems[i].dispatchEvent(saveEvent)) {
                    cancelled = true;
                }
            }
            log('Form submit cancelled: ' + cancelled);
            return !cancelled;
        },

        /**
         * Saves an element, reading the key from its dataset and
         * the value from its `property` attribute.
         * @param {HTMLElement} element
         * @param {string} property
         */
        saveOneElement: function(element, property) {
            if (element.dataset[this._settingKey])
                this.set(element.dataset[this._settingKey], element[property]);
            else
                log('Skipping blank: ' + element.outerHTML);
        },

        /**
         * If `key` is not set, set it to `defaultValue` and returns `defaultValue`.
         * Otherwise, returns the stored value.
         * @param {string} key
         * @param {any} defaultValue
         * @returns {any}
         */
        init: function(key, defaultValue) {
            var value = this.get(key, undefined);
            if (value === undefined) {
                this.set(key, defaultValue);
                return defaultValue;
            } else {
                return value;
            }
        },

        /**
         * Sets `key` to `value`. Currently uses GM_setValue, storing internally
         * as JSON.
         */
        set: function(key, value) {
            GM_setValue(key, JSON.stringify(value));
        },

        /**
         * Gets `key`, returns `defaultValue` if it is not set.
         * Currently uses GM_getValue, storing internally as JSON.
         */
        get: function(key, defaultValue) {
            var value = GM_getValue(key, undefined);
            if (value !== undefined) {
                return JSON.parse(value);
            } else {
                return defaultValue;
            }
        },

        /**
         * Migrates a string stored in `key` as a bare string to a
         * JSON encoded string.
         * @param {string} key Setting key.
         * @returns {any} String value.
         */
        _migrateStringSetting: function(key) {
            var val;
            try {
                val = this.get(key);
            } catch (exc) {
                if (exc instanceof SyntaxError
                    && GM_getValue(key, undefined) !== undefined) {
                    // Assume the current variable is a bare string.
                    // Re-store it as a JSON string.
                    val = GM_getValue(key);
                    this.set(key, val);
                } else {
                    throw exc; // Something else happened
                }
            }
            return val;
        },

        /**
         * Inserts `newElement` as a chlid of `rootElement` sorted, by comparing
         * `newText` to each element's textContent.
         *
         * If `refElement` is specified, will start _after_ `refElement`.
         *
         * @param {HTMLElement} newElement Element to insert.
         * @param {HTMLElement} rootElement Parent element to insert `newElement` into.
         * @param {HTMLElement} [refElement] Reference element to insert after this or later.
         */
        _insertSorted: function(newElement, rootElement, refElement) {
            var current = rootElement.firstElementChild;
            if (refElement) {
                if (refElement.parentNode !== rootElement)
                    throw 'refElement is not a direct child of rootElement';
                current = refElement.nextElementSibling;
            }
            while (current && (current.textContent <= newElement.textContent)) {
                current = current.nextElementSibling;
            }
            if (current) {
                rootElement.insertBefore(newElement, current);
            } else {
                rootElement.appendChild(newElement);
            }
        },

        /**
         * Inserts a checkbox with the given parameters to the basic settings
         * section. Returns true if the stored `key` value is true, false otherwise.
         *
         * @param {string} key Setting key.
         * @param {string} label Label for setting, placed in left column.
         * @param {string} description Description for setting, placed right of checkbox.
         * @returns {boolean} Value of the `key` setting.
         * @example
         * // Very basic enable/disable script setting.
         * if (!delicious.settings.basicScriptCheckbox('EnableHideTreats', 'Hides Treats', 'Hide those hideous treats!')) {
         *      return;
         * }
         * // Rest of userscript here.
         */
        basicScriptCheckbox: function(key, label, description) {
            this.init(key, true);
            if (this.ensureSettingsInserted()) {
                this.addBasicCheckbox(key, label, description);
            }
            return this.get(key);
        },

        /**
         * Inserts a checkbox to the basic section and returns it.
         *
         * @param {string} key Setting key.
         * @param {string} label Left label.
         * @param {string} description Right description.
         * @param {Object.<string, any>} options Further options for the checkbox.
         * @see {settings.createCheckbox} for accepted `options`.
         */
        addBasicCheckbox: function(key, label, description, options) {
            var checkboxLI = this.createCheckbox(
                key, label, description, options);
            this.insertBasicSetting(checkboxLI);
            return checkboxLI;
        },

        /**
         * Inserts an element containing a basic setting to the basic settings
         * section, above the individual script sections.
         * @param {HTMLElement} setting Setting element.
         */
        insertBasicSetting: function(setting) {
            this._insertSorted(setting, this._basicSection);
        },

        /**
         * Creates, inserts and returns a script section to the settings page.
         * Inserts an Enable/Disable checkbox associated with `key` into
         * the section.
         * @param {string} key Setting key.
         * @param {string} title Section title.
         * @param {string} description Basic description.
         * @param {Object.<string, any>} options Further options for the checkbox.
         */
        addScriptSection: function(key, title, description, options) {
            options = utilities.applyDefaults(options, {
                checkbox: false
            });

            var section = this.createSection(title);

            if (options['checkbox']) {
                var enableBox = this.createCheckbox(key, 'Enable/Disable', description, options);
                section.appendChild(enableBox);
            }

            this._insertSorted(section, this.rootSettingsList,
                this._basicSection);
            return section;
        },

        /**
         * Inserts a section into the settings page, placing it after the
         * basic settings and sorting it alphabetically.
         * @param {HTMLElement} section Setting section.
         */
        insertSection: function(section) {
            this._insertSorted(section, this.rootSettingsList,
                this._basicSection);
        },

        _createSettingLI: function(label, rightElements) {
            return newElement('li', {}, [
                newElement('span', {className: 'ue_left strong'}, [label]),
                newElement('span', {className: 'ue_right'}, rightElements),
            ]);
        },

        /**
         * @param {string} key Setting key.
         * @param {string} label Label text.
         * @param {string} description Short description.
         * @param {Object.<string, any>} options Further options (see source code).
         */
        createCheckbox: function(key, label, description, options) {
            options = utilities.applyDefaults(options, {
                default: true, // Default state of checkbox.
                onSave: function(ev) {
                    settings.saveOneElement(ev.target, 'checked');
                }
            });

            var checkbox = newElement('input', {type: 'checkbox'});
            checkbox.dataset[this._settingKey] = key;
            checkbox.id = this._idPrefix + key;

            var currentValue = options['default'];
            if (this.get(key, currentValue))
                checkbox.setAttribute('checked', 'checked');

            if (options['onSave'] !== null) {
                checkbox.addEventListener(this._eventName, options['onSave']);
            }

            var li = this._createSettingLI(label, [
                checkbox,
                ' ',
                newElement('label', {htmlFor: this._idPrefix+key}, [description]),
            ]);

            return li;
        },

        /**
         * Event handler attached to h3 section heading. Toggles visibility
         * of associated section body.
         */
        _toggleSection: function(ev) {
            var sectionBody = ev.currentTarget.parentNode.parentNode.nextElementSibling;
            var willShow = sectionBody.style.display === 'none';
            sectionBody.style.display = willShow ? 'block' : 'none';

            var toggleTriangle = ev.currentTarget.firstElementChild;
            toggleTriangle.textContent = willShow ? '▼' : '▶';

            ev.preventDefault();
            ev.stopPropagation();
        },

        /**
         * Creates a collapsible script section with the given title.
         * Clicking the section heading will toggle the visibility of the
         * section's settings.
         *
         * **Important.** Appending directly into the returned div element will
         * not work. You must append to the section's body div.
         *
         * Correct example:
         *
         *    var section = delicious.settings.createCollapsibleSection('Script Name');
         *    var s = section.querySelector('.settings_section_body');
         *    s.appendChild(delicious.settings.createCheckbox(...));
         *    delicious.setttings.insertSection(section);
         *
         * Incorrect example:
         *
         *    var section = delicious.settings.createCollapsibleSection('Script Name');
         *    // This will not be able to collapse/expand the section correctly!
         *    section.appendChild(delicious.settings.createCheckbox(...));
         *    delicious.setttings.insertSection(section);
         *
         *
         * @param {string} title Script title.
         * @param {boolean} defaultState If true, the section will be expanded by default.
         * @returns {HTMLDivElement} Script section.
         */
        createCollapsibleSection: function(title, defaultState) {
            var toggleTriangle = newElement('a',
                {textContent: (defaultState ? '▼' : '▶')});
            var heading = newElement('h3', {}, [toggleTriangle, ' ', title]);
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', this._toggleSection);

            var sectionHeading = newElement('div', {className: 'settings_section_heading'},
                [newElement('li', {}, [heading]) ]);
            sectionHeading.style.marginBottom = '20px';

            var sectionBody = newElement('div', {className: 'settings_section_body'});
            sectionBody.style.display = defaultState ? 'block' : 'none';

            var section = newElement('div', {className: 'delicious_settings_section'},
                [sectionHeading, sectionBody]);
            section.style.marginTop = '30px';
            return section;
        },

        /**
         * Creates a setting section, returns it but does not insert it into
         * the page.
         */
        createSection: function(title) {
            var heading = newElement('h3', {}, [title]);
            var section = newElement('div', {className: 'delicious_settings_section'}, [
                newElement('li', {}, [heading])
            ]);
            section.style.marginTop = '30px';
            return section;
        },

        /**
         * @param {string} key Setting key.
         * @param {string} label Label text.
         * @param {string} description Short description.
         * @param {Object.<string, any>} options Further options (see source code).
         */
        createTextSetting: function(key, label, description, options) {
            options = utilities.applyDefaults(options, {
                width: null, // CSS 'width' for the text box.
                lineBreak: false, // Whether to place the description on its own line.
                default: '', // Default text.
                required: false, // If true, text cannot be blank.
                onSave: function(ev) {
                    settings.saveOneElement(ev.target, 'value');
                }
            });

            var inputElem = newElement('input', {
                type: 'text',
                id: this._idPrefix+key
            });
            inputElem.value = this.get(key, options['default']);
            inputElem.dataset[this._settingKey] = key;
            inputElem.style.width = options['width'];
            inputElem.required = options['required'];

            var li = this._createSettingLI(label, [
                inputElem,
                (options['lineBreak'] && description) ? newElement('br') : ' ',
                newElement('label', {htmlFor: this._idPrefix+key}, [description])
            ]);

            if (options['onSave'] !== null) {
                inputElem.addEventListener(this._eventName, options['onSave']);
            }

            return li;
        },

        /**
         * Creates and returns a drop-down setting.
         *
         * `valuesArray` must contain 2-tuples of strings; values will
         * be stored as strings.
         *
         * The default value specified in `options` must be identical to a
         * setting value in `valuesArray`.
         * @example
         * // Creates a drop-down with 2 options, and the second option default.
         * delicious.settings.createDropdown('TimeUnit', 'Select time',
         *      'Select a time unit to use', [['Hour', '1'], ['Day', '24']],
         *      {default: '24'})
         * @param {string} key Setting key.
         * @param {string} label Left label.
         * @param {string} description Right description.
         * @param {[string, string][]} valuesArray Array of 2-tuples [text, setting value].
         * @param {Object.<string, any>} options Further options.
         */
        createDropDown: function(key, label, description, valuesArray, options) {
            options = utilities.applyDefaults(options, {
                lineBreak: false, // Whether to place the description on its own line.
                default: null, // Default value.
                onSave: function(ev) {
                    settings.saveOneElement(ev.target, 'value');
                }
            });

            var select = newElement('select');
            select.dataset[this._settingKey] = key;
            select.id = this._idPrefix+key;

            var currentValue = this.get(key, options['default']);

            for (var i = 0; i < valuesArray .length; i++) {
                var newOption = newElement('option', {
                    value: valuesArray[i][1],
                    textContent: valuesArray[i][0]
                });
                if (valuesArray[i][1] === currentValue)
                    newOption.setAttribute('selected', 'selected');
                select.appendChild(newOption);
            }

            var li = this._createSettingLI(label, [
                select,
                (options['lineBreak'] && description) ? newElement('br') : ' ',
                newElement('label', {htmlFor: this._idPrefix+key}, [description])
            ]);

            if (options['onSave'] !== null) {
                select.addEventListener(this._eventName, options['onSave']);
            }

            return li;
        },

        /**
         * Returns a number setting element. Value is stored as a number.
         * Note that an empty input is stored as `null`. Empty input can be
         * disallowed by specifying `{required: true}` in `options`.
         *
         * @param {string} key Setting key.
         * @param {string} label Label text.
         * @param {string} description Short description.
         * @param {Object.<string, any>} options Further options (see source code).
         */
        createNumberInput: function(key, label, description, options) {
            options = utilities.applyDefaults(options, {
                lineBreak: false, // Whether to place the description on its own line.
                default: '', // Default value.
                allowDecimal: true,
                allowNegative: false,
                required: false, // If true, input cannot be blank.
                onSave: function(ev) {
                    settings.set(key, parseFloat(ev.target.value));
                }
            });

            var input = newElement('input');
            input.id = this._idPrefix+key;
            input.dataset[this._settingKey] = key;
            input.type = 'number';
            if (options['allowDecimal'])
                input.step = 'any';
            if (!options['allowNegative'])
                input.min = '0';
            input.required = options['required'];
            input.value = this.get(key, options['default']);

            var li = this._createSettingLI(label, [
                input,
                (options['lineBreak'] && description) ? newElement('br') : ' ',
                newElement('label', {htmlFor: this._idPrefix+key}, [description])
            ]);

            if (options['onSave'] !== null) {
                input.addEventListener(this._eventName, options['onSave']);
            }

            return li;
        },

        /**
         * Creates a setting containing many checkboxes. Stores the value as
         * an object, with subkeys as keys and true/false as values.
         *
         * @example
         * // Creates a setting with 2 checkboxes,
         * delicious.settings.createFieldSetSetting('FLPoolLocations',
         *      'Freeleech status locations',
         *      [['Navbar', 'navbar'], ['User menu', 'usermenu']]);
         * // Example stored value
         * delicious.settings.get('FLPoolLocations') == {
         *      'navbar': true,
         *      'usermenu': false
         * };
         *
         * @param {string} key Root setting key.
         * @param {string} label Label text.
         * @param {[string, string][]} fields Array of 2-tuples of [text, subkey].
         * @param {string} description Short description.
         * @param {Object.<string, any>} options Further options (see source code).
         */
        createFieldSetSetting: function(key, label, fields, description, options) {
            options = utilities.applyDefaults(options, {
                default: [],
                onSave: function(ev) {
                    var obj = {};
                    var checkboxes = ev.target.querySelectorAll('['+settings._dataSettingSubkey+']');
                    for (var i = 0; i < checkboxes.length; i++) {
                        obj[checkboxes[i].dataset[settings._settingSubkey]] = checkboxes[i].checked;
                    }
                    settings.set(ev.target.dataset[settings._settingKey], obj);
                }
            });

            var fieldset = newElement('span');
            fieldset.dataset[this._settingKey] = key;

            var currentSettings = this.get(key, {});

            for (var i = 0; i < fields.length; i++) {
                var checkbox = newElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = this._idPrefix+key+'_'+fields[i][1];
                checkbox.dataset[this._settingSubkey] = fields[i][1];

                var current = currentSettings[fields[i][1]];
                if (current === undefined)
                    current = options['default'].indexOf(fields[i][1]) !== -1;

                if (current)
                    checkbox.checked = true;

                var newLabel = newElement('label', {htmlFor: this._idPrefix+key+'_'+fields[i][1]}, [
                    checkbox, ' ', fields[i][0]
                ]);
                newLabel.style.marginRight = '15px';

                fieldset.appendChild(newLabel);
            }

            if (options['onSave'] !== null) {
                fieldset.addEventListener(this._eventName, options['onSave']);
            }

            var children = [fieldset];
            if (description) {
                children.push(newElement('br'));
                children.push(description);
            }

            var li = this._createSettingLI(label, children);

            return li;
        },

        /**
         * Event handler to move the containing row up one.
         */
        _moveRowUp: function(ev) {
            var thisRow = ev.target.parentNode;
            if (thisRow.previousElementSibling) {
                thisRow.parentNode.insertBefore(
                    thisRow,
                    thisRow.previousElementSibling
                );
            }
            if (ev.preventDefault) {
                ev.preventDefault();
                ev.stopPropagation();
            }
        },

        /**
         * Event handler to move the containing row down one.
         * Implemented by moving the row underneath this one up one.
         */
        _moveRowDown: function(ev) {
            var thisRow = ev.target.parentNode;
            if (thisRow.nextElementSibling) {
                settings._moveRowUp({target: thisRow.nextElementSibling.firstElementChild});
            }
            ev.preventDefault();
            ev.stopPropagation();
        },

        /**
         * Event handler to delete a row.
         */
        _deleteRow: function(ev) {
            var row = ev.target.parentNode;
            row.parentNode.removeChild(row);
            ev.preventDefault();
            ev.stopPropagation();
        },

        /**
         * Creates a new row for a multi-row setting. Used when clicking
         * the new row button.
         */
        _createRow: function(values, columns, allowSort, allowDelete) {
            var row = newElement('div', {className: 'setting_row'});
            row.style.marginBottom = '2px';

            if (allowSort === undefined || allowSort) {
                var upButton = newElement('button', {textContent: '▲',
                    title: 'Move up'});
                upButton.addEventListener('click', this._moveRowUp);
                row.appendChild(upButton);
                row.appendChild(document.createTextNode(' '));

                var downButton = newElement('button', {textContent: '▼',
                    title: 'Move down'});
                downButton.addEventListener('click', this._moveRowDown);
                row.appendChild(downButton);
                row.appendChild(document.createTextNode(' '));
            }

            for (var i = 0; i < columns.length; i++) {
                var cell = newElement('input', {type: columns[i][2]});
                if (cell.type === 'number') {
                    cell.min = '0';
                    cell.step = 'any';
                }
                var subkey = columns[i][1];
                cell.dataset[this._settingSubkey] = subkey;
                cell.placeholder = columns[i][0];
                if (values[subkey] !== undefined) {
                    cell.value = values[subkey];
                }
                row.appendChild(cell);
                row.appendChild(document.createTextNode(' '));
            }

            if (allowDelete === undefined || allowDelete) {
                var delButton = newElement('button', {textContent: '✖',
                    title: 'Delete'});
                delButton.addEventListener('click', this._deleteRow);
                row.appendChild(delButton);
            }

            return row;
        },

        /**
         * Creates and returns a multi-row setting. That is, a setting with
         * certain columns and a variable number of rows.
         *
         * Setting is stored as an array of objects. Every input type except
         * number is stored as a string. Number input allows any non-negative number,
         * possibly blank. If blank, a number input will be stored as null.
         *
         * @example
         * // Returns a row setting with one row by default.
         * delicious.settings.createRowSetting('QuickLinks', 'Quick Links',
         *      [['Label', 'label', 'text'], ['Link', 'href', 'text']],
         *      {default: [{label: 'Home', href: 'https://animebytes.tv'}]})
         *
         * // Example stored value.
         * delicious.settings.get('QuickLinks') == [
         *      {label: 'Home', href: 'https://animebytes.tv'}
         * ];
         *
         * @param {string} key Root setting key.
         * @param {string | HTMLElement} label Left label.
         * @param {string[][]} columns Array of 3-tuples which are
         * [column label, subkey, input type]. Input type is the `type` attribute
         * of the cell's `<input>` element.
         * @param {string | HTMLElement} description Short description, placed above rows.
         * @param {Object} options Further options (see source code).
         */
        createRowSetting: function(key, label, columns, description, options) {
            options = utilities.applyDefaults(options, {
                default: [],
                newButtonText: '+',
                allowSort: true,
                allowDelete: true,
                allowNew: true,
                onSave: function(ev) {
                    var list = [];
                    var rows = ev.target.querySelectorAll('.setting_row');
                    for (var i = 0; i < rows.length; i++) {
                        var obj = {};
                        var columns = rows[i].querySelectorAll('['+settings._dataSettingSubkey+']');
                        for (var j = 0; j < columns.length; j++) {
                            var val = columns[j].value;
                            if (columns[j].type === 'number')
                                val = parseFloat(val);
                            obj[columns[j].dataset[settings._settingSubkey]] = val;
                        }
                        list.push(obj);
                    }
                    settings.set(key, list);
                }
            });

            var children;
            if (description) {
                children = [description, newElement('br')];
            } else {
                children = undefined;
            }
            var rowDiv = newElement('div', {className: 'ue_right'}, children);

            var rowContainer = newElement('div');
            rowContainer.dataset[this._settingKey] = key;
            rowContainer.className = 'row_container';
            if (options['onSave'] !== null)
                rowContainer.addEventListener(this._eventName, options['onSave']);
            if (description)
                rowContainer.style.marginTop = '5px';
            rowDiv.appendChild(rowContainer);

            var current = this.get(key, options['default']);
            for (var i = 0; i < current.length; i++) {
                rowContainer.appendChild(
                    this._createRow(current[i], columns, options['allowSort'],
                        options['allowDelete']));
            }

            if (options['allowNew']) {
                var newButton = newElement('button', {textContent: options['newButtonText'], title: 'New'});
                newButton.style.marginTop = '8px';
                newButton.addEventListener('click', function(ev) {
                    rowContainer.appendChild(
                        settings._createRow({}, columns,
                            options['allowSort'],
                            options['allowDelete']));
                    ev.preventDefault();
                    ev.stopPropagation();
                });
                rowDiv.appendChild(newButton);
            }

            var li = newElement('li', {}, [
                newElement('span', {className: 'ue_left strong'}, [label]),
                rowDiv
            ]);

            return li;
        },

        /**
         * Returns a colour input, with optional checkbox to enable/disable
         * the whole setting and reset to default value.
         *
         * If the checkbox is unchecked, a `null` will be stored as the value.
         * Else, the colour will be stored as #rrggbb.
         *
         * @param {string} key Setting key.
         * @param {string} label Left label.
         * @param {string} description Short description on right.
         * @param {Object.<string, any>} options Further options (see source code).
         */
        createColourSetting: function(key, label, description, options) {
            options = utilities.applyDefaults(options, {
                default: '#000000',
                checkbox: true,
                resetButton: true,
                onSave: function(ev) {
                    if (options['checkbox'] && !checkbox.checked) {
                        settings.set(key, null);
                    } else {
                        settings.set(key, ev.target.value);
                    }
                }
            });

            var currentColour = this.get(key, options['default']);

            var disabled = currentColour === null && options['checkbox'];
            if (options['checkbox']) {
                var checkbox = newElement('input',
                    {type: 'checkbox', checked: !disabled});
                checkbox.addEventListener('change', function(ev) {
                    colour.disabled = !ev.target.checked;
                    if (reset)
                        reset.disabled = !ev.target.checked;
                    ev.stopPropagation();
                });
            }

            var colour = newElement('input', {type: 'color'});
            colour.dataset[this._settingKey] = key;
            colour.id = this._idPrefix+key;
            colour.disabled = disabled;

            if (currentColour !== null)
                colour.value = currentColour;
            else
                colour.value = options['default'];

            if (options['onSave'] !== null)
                colour.addEventListener(this._eventName, options['onSave']);

            if (options['resetButton']) {
                var reset = newElement('button', {textContent: 'Reset'});
                reset.addEventListener('click', function(ev) {
                    colour.value = options['default'];
                    ev.preventDefault();
                    ev.stopPropagation();
                });
                reset.disabled = disabled;
            }

            var right = [];
            if (options['checkbox']) {
                right.push(checkbox);
                right.push(' ');
            }
            right.push(colour);
            right.push(' ');
            if (options['resetButton']) {
                right.push(reset);
                right.push(' ');
            }
            right.push(newElement('label', {htmlFor: this._idPrefix+key},
                [description]));
            return this._createSettingLI(label, right);
        },


        /**
         * Shows an error message in a friendly red box near the top of the
         * page.
         *
         * `errorId` should be a unique string identifying the type of error.
         * It is used to remove previous errors of the same type before
         * displaying the new error.
         *
         * @param {string | HTMLElement} message
         * @param {string} errorId
         */
        showErrorMessage: function(message, errorId) {
            var errorDiv = newElement('div', {className: 'error_message'},
                [message]);
            if (errorId) {
                errorDiv.dataset['errorId'] = errorId;
                var existing = document.querySelector('[data-error-id="'+errorId+'"');
                if (existing)
                    existing.parentNode.removeChild(existing);
            }
            var thinDiv = document.querySelector('div.thin');
            thinDiv.parentNode.insertBefore(errorDiv, thinDiv);
            return errorDiv;
        },
    };

    return {
        settings: settings,
        utilities: utilities
    };
})();