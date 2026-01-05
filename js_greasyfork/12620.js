// ==UserScript==
// @name         WME Segment Locker
// @description  Locks segment to appropriate rank in WME
// @version      1.0.4
// @author       SAR85
// @grant        none
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/*
// @namespace    https://greasyfork.org/users/9321
// @require			https://greasyfork.org/scripts/9794-wlib/code/wLib.js?version=106259
// @downloadURL https://update.greasyfork.org/scripts/12620/WME%20Segment%20Locker.user.js
// @updateURL https://update.greasyfork.org/scripts/12620/WME%20Segment%20Locker.meta.js
// ==/UserScript==

/* global W */
/* global $ */
/* global wLib */

(function () {
    'use strict';
    var lockerOptions,
        lockerPresets,
        UpdateObject = require('Waze/Action/UpdateObject'),
        messageBar,
        defaultOptions = {
            presets: [
                { name: 'Custom', street: null, primary: 2, freeway: 5, ramp: 5, trail: null, major: 3, minor: 2, dirt: null, boardwalk: null, stairway: null, prvt: null, railroad: 2, runway: 5, parking: null, service: null },
                { name: 'California - standard', street: null, primary: 2, freeway: 5, ramp: 5, trail: null, major: 3, minor: 2, dirt: null, boardwalk: null, stairway: null, prvt: null, railroad: 2, runway: 5, parking: null, service: null },
                { name: 'California - metro', street: null, primary: 2, freeway: 5, ramp: 5, trail: null, major: 3, minor: 3, dirt: null, boardwalk: null, stairway: null, prvt: null, railroad: 2, runway: 5, parking: null, service: null },
                { name: 'Canada', street: null, primary: 2, freeway: 5, ramp: null, trail: null, major: 4, minor: 3, dirt: null, boardwalk: null, stairway: null, prvt: null, railroad: 2, runway: 5, parking: null, service: null },
                { name: 'Texas', street: null, primary: 3, freeway: 5, ramp: 4, trail: null, major: 5, minor: 4, dirt: null, boardwalk: null, stairway: null, prvt: null, railroad: 2, runway: null, parking: null, service: null },
                { name: 'Washington', street: null, primary: 2, freeway: 5, ramp: 5, trail: null, major: 3, minor: 2, dirt: null, boardwalk: null, stairway: null, prvt: null, railroad: 2, runway: 5, parking: null, service: null }
            ],
            lastPreset: 'Custom'
        };

	/**
	 * Saves script settings to localStorage.
	 * @param key {String} The name of the option or setting.
	 * @param value {String|Object} The value of the option.
	 */
    function saveOptions(key, value) {
        if (key && value) {
            lockerOptions[key] = value;
            localStorage.lockerOptions = JSON.stringify(lockerOptions);
            console.debug('WME Locker: localStorage options saved: ', localStorage.lockerOptions);
            console.debug('WME Locker: lockerOptions: ', lockerOptions);
        }
    }

	/**
	 * Saves an object containing lock values per roadType under the
	 * provided name.
	 * @param name {String} Name for the preset.
	 * @param lockObject {Object} Object containing locks specified by roadType.
	 */
    function savePreset(name, lockObject) {
        if (name && lockObject) {
            lockObject.name = name;
            lockerPresets.push(lockObject);
            saveOptions('presets', lockerPresets);
            console.debug('WME Locker: Saving preset.', lockerPresets);
        }
    }

	/**
	 * Deletes a lock preset.
	 * @param name {String} The name of the preset.
	 * @param index {String} The index of the preset. If not provided, will look
	 * up index using presetExists().
	 */
    function removePreset(name, index) {
        if (name) {
            if (name === "Custom") {
                messageBar.displayMessage('customreadonly');
                return;
            }
            index = index || presetExists(name).index;
            $('.lkrpresetoption').each(function () {
                var $this = $(this);
                if ($this.attr('value') === name) {
                    console.debug('WME Locker: Found preset entry for ' + name + '. Removing.');
                    $this.remove();
                }
            });
            lockerPresets.splice(index, 1);
            console.debug('WME Locker: Removed above preset from lockerPresets.', lockerPresets);
            saveOptions('presets', lockerPresets);
        }
    }

	/**
	 * Resets localStorage options and refresh page.
	 */
    function clearSavedOptions() {
        var x = confirm('Are you sure you want to remove all saved options for WME Segment Locker and reload the page?');
        if (x) {
            localStorage.removeItem('lockerOptions');
            location.reload();
        }
    }

	/**
	 * Checks if a preset already exists by name.
	 * @param name {String} The name of the preset to look for.
	 * @return {Object} Object with boolean property "found" specifying
	 * whether a preset was found or not. If found, the object also has
	 * "index," specifying the index of the preset in the lockerPresets
	 * array and "preset," containing the preset object from the array.
	 */
    function presetExists(name) {
        var i, n;
        console.debug('WME Locker: Looking for preset: ' + name + '.');
        if (name) {
            for (i = 0, n = lockerPresets.length; i < n; i++) {
                if (name === lockerPresets[i].name) {
                    console.debug('WME Locker: Preset found:', lockerPresets[i]);
                    return { found: true, index: i, preset: lockerPresets[i] };
                }
            }
            console.debug('WME Locker: No preset found.');
            return { found: false };
        }
    }

	/**
	 * Event handler for adding a preset.
	 * @callback
	 * @param event {Event} The event object.
	 */
    function onAddPresetClicked(event) {
        var name = prompt('Enter preset name.');
        if (!name) {
            return;
        }
        if (presetExists(name).found) {
            messageBar.displayMessage('presetexists');
        } else {
            savePreset(name, getLocks());
            createPresetEntry(presetExists(name).preset);
            $('#lkrpreset').val(name).change();
            saveOptions('lastPreset', name);
        }
    }

	/**
	 * Event handler for renaming a preset.
	 * @callback
	 * @param event {Event} The event object.
	 */
    function onRenamePresetClicked(event) {
        var name = prompt('Enter preset name.'),
            preset = presetExists($('#lkrpreset').val());
        if (!name) {
            return;
        }
        if (presetExists(name).found) {
            messageBar.displayMessage('presetexists');
        } else if (preset.found && preset.preset.name === 'Custom') {
            messageBar.displayMessage('customreadyonly');
        } else if (preset.found) {
            removePreset(preset.preset.name, preset.index);
            savePreset(name, preset.preset);
            createPresetEntry(presetExists(name).preset);
            $('#lkrpreset').val(name);
            saveOptions('lastPreset', name);
        }
    }

	/**
	 * Event handler for removing a preset.
	 * @callback
	 * @param event {Event} The event object.
	 */
    function onRemovePresetClicked(event) {
        removePreset($('#lkrpreset').val());
    }

	/**
	 * Event handler for selecting a preset.
	 * Sets input box lock values based on pre-configured sets of locks.
	 * @callback
	 * @param event {Event} The event object.
	 */
    function onPresetClicked(event) {
        var preset = presetExists($('#lkrpreset').val());
        if (preset.found) {
            if (preset.preset.name === 'Custom') {
                $('#lkrRenamePreset, #lkrRemovePreset').attr('disabled', true).css('color', 'gray');
            } else {
                $('#lkrRenamePreset, #lkrRemovePreset').attr('disabled', false).css('color', '');
            }
            $('.lkrselect').each(function () {
                var $this = $(this),
                    streetType = $this.attr('name');
                $this.val('' + preset.preset[streetType]);
            });
            saveOptions('lastPreset', preset.preset.name);
        } else {
            messageBar.displayMessage('presetNotFound');
            $('.lkrpresetoption').each(function () {
                var $this = $(this);
                if ($this.attr('value') === $('#lkrpreset').val()) {
                    console.debug('WME Locker: Found preset entry for ' + name + '. Removing.');
                    $this.remove();
                }
            });
        }
    }

	/**
	 * Event handler for changing value of a lock.
	 * Sets preset to "Custom" and updates values for custom preset.
	 * @callback
	 * @param event {Event} The event object.
	 */
    function onLockValueChanged(event) {
        var customPreset = presetExists('Custom');
        lockerPresets.splice(customPreset.index, 1);
        console.debug('WME Locker: Removed custom preset from lockerPresets.', lockerPresets);
        savePreset('Custom', getLocks());
        saveOptions('lastPreset', 'Custom');
        $('#lkrpreset').val('Custom');
    }

	/**
	 * Gets the lock values from the form and returns them as an object.
	 * @return locksObject {Object} Object containing lock values by roadType
	 */
    function getLocks() {
        var locksObject = {};
        $('.lkrselect').each(function () {
            var $this = $(this),
                streetType = $this.attr('name');
            locksObject[streetType] = $this.val();
        });
        return locksObject;
    }

	/**
	 * Checks for selected items and puts selected segments in an object used by
	 * lock function. If no selected segments, sends all loaded segments to be locked.
	 */
    function Lkr_Lock() {
        var t = 0, selection, key, selectedSegments = {};
        if (W.selectionManager.hasSelectedItems()) {
            selection = W.selectionManager.selectedItems;
            for (t; t < selection.length; t++) {
                if (selection[t].model.type === 'segment') {
                    key = selection[t].model.attributes.id;
                    selectedSegments[key] = selection[t].model;
                }
            }
            Lkr_LockLoop(selectedSegments);
        } else {
            Lkr_LockLoop(W.model.segments.objects);
        }
    }

	/**
	 * Enumerates through object containing segment information and locks each segment as necessary.
	 */
    function Lkr_LockLoop(segmentObject) {
        var t,
            currentSegment,
            needslock,
            mapBounds = W.map.getExtent(),
            numSegmentsLocked = 0,
            numSegmentsChecked = 0;
        for (t in segmentObject) {
            if (!segmentObject.hasOwnProperty(t)) {
                continue;
            }
            if (W.model.actionManager.actions.length > 99) {
                messageBar.displayMessage('tooManyEdits');
                return;
            }
            currentSegment = W.model.segments.get(t);
            numSegmentsChecked++;
            if (currentSegment.arePropertiesEditable() && currentSegment.state !== 'Delete' &&
                mapBounds.intersectsBounds(currentSegment.geometry.getBounds())) {
                needslock = Lkr_CheckLock(currentSegment);
                if (needslock) {
                    W.model.actionManager.add(new UpdateObject(currentSegment, { lockRank: needslock - 1 }));
                    numSegmentsLocked++;
                }
            }
        }
        messageBar.displayMessage({
            messageText: numSegmentsLocked + ' segments locked. ' +
            numSegmentsChecked + ' segments checked.',
            messageType: 'info'
        });
    }

	/**
	 * Checks current lock value of segment and determines if locking is necessary.
	 * @param segarg The WME segment object to check.
	 * @return lockto The appropriate lock rank.
	 */
    function Lkr_CheckLock(segarg) {
        var types = { 1: "street", 2: "primary", 3: "freeway", 4: "ramp", 5: "trail", 6: "major", 7: "minor", 8: "dirt", 10: "boardwalk", 16: "stairway", 17: "prvt", 18: "railroad", 19: "runway", 20: "parking", 21: "service" };
        var attributes, segtype, seglock, segrank, typename, lockto,
            locks = getLocks();

        attributes = segarg.attributes;
        segtype = attributes.roadType;
        seglock = attributes.lockRank; /* lockRank = chosen lock in editor */
        segrank = attributes.rank; /* rank = traffic lock */

        typename = types[segtype];
        lockto = locks[typename];

        if (seglock === null && segrank + 1 > lockto) { return false; }/* don't change auto traffic locks if higher than desired lock */
        if (lockto > W.loginManager.user.rank + 1) { return false; } /* don't try to lock higher than user's rank */
        if (lockto === null) { return false; } /* don't change if desired lock is auto */
        if (seglock + 1 < lockto) { return lockto; } /* return desired lock level if current lock is lower */
        return false; /* default to no changes */
    }

	/**
	 * Creates <option> element for a lock preset.
	 * @param presetObject {Object} Object containing the name of the preset and lock values per roadType.
	 */
    function createPresetEntry(presetObject) {
        $('<option/>')
            .addClass('lkrpresetoption')
            .attr('value', presetObject.name)
            .text(presetObject.name)
            .appendTo($('#lkrpreset'));
    }

    function updateAlert() {
        var lockerVersion = '1.0.4',
            alertOnUpdate = true,
            versionChanges = 'WME Segment Locker has been updated to ' + lockerVersion + '.\n';
        versionChanges += 'Changes:\n';
        versionChanges += '[*] Updated for editor compatibility.\n';
        if (alertOnUpdate && window.localStorage && window.localStorage.lockerVersion !==
            lockerVersion) {
            window.localStorage.lockerVersion = lockerVersion;
            alert(versionChanges);
        }
    }

    function Lkr_init() {
        /* HTML */
        var tab = '<li><a href="#sidepanel-locker" data-toggle="tab" id="lockertab">Locker</a></li>',
            content = '<div class="tab-pane" id="sidepanel-locker"> <table> <tr> <td><strong>Lock Preset:</strong></td> <td> <select id="lkrpreset" name="lkrpreset"> </select> </td> </tr> </table> <div style="margin-top: 10px; text-align: center"> <button id="lkrAddPreset" style="margin-right: 5px">Save</button> <button id="lkrRenamePreset" style="margin-right: 5px;">Rename</button> <button id="lkrRemovePreset" style="margin-right: 5px;">Delete</button> </div> <div style="margin-top: 10px; text-align: center;"> <button id="lkrbtn">Lock It Down!</button> </div> <hr style="position:relative; margin: 20px 0 0 0"> <table> <tr class="lkrheading"> <td><strong>Highways</strong></td> </tr> <tr> <td>Minor highway:</td> <td> <select class="lkrselect" name="minor"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Major highway:</td> <td> <select class="lkrselect" name="major"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Freeway:</td> <td> <select class="lkrselect" name="freeway"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Ramp:</td> <td> <select class="lkrselect" name="ramp"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr class="lkrheading"> <td><strong>Streets</strong></td> </tr> <tr> <td>Street:</td> <td> <select class="lkrselect" name="street"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Primary Street:</td> <td> <select class="lkrselect" name="primary"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr class="lkrheading"> <td><strong>Other - drivable</strong></td> </tr> <tr> <td>Parking lot road:</td> <td> <select class="lkrselect" name="parking"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Private road:</td> <td> <select class="lkrselect" name="prvt"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Dirt road:</td> <td> <select class="lkrselect" name="dirt"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr class="lkrheading"> <td><strong>Non-drivable</strong></td> </tr> <tr> <td>Walking trail:</td> <td> <select class="lkrselect" name="trail"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Pedestrian boardwalk:</td> <td> <select class="lkrselect" name="boardwalk"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Stairway:</td> <td> <select class="lkrselect" name="stairway"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Railroad:</td> <td> <select class="lkrselect" name="railroad"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> <tr> <td>Runway:</td> <td> <select class="lkrselect" name="runway"> <option value="null">Auto (1)</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> </select> </td> </tr> </table> <div style="margin-top: 20px; text-align: center;"> <a id="lkrclearoptions" style="cursor: pointer">Click here to clear all saved options and reload page.</a> </div> </div>';

        /* Create message bar */
        messageBar = new wLib.Interface.MessageBar({
            messagePrefix: 'WME Segment Locker:'
        });
        messageBar.saveMessage({
            messageName: 'presetexists',
            messageText: 'Preset name already exists. Try a different name or delete the original first.',
            messageType: 'warn'
        });
        messageBar.saveMessage({
            messageName: 'customreadonly',
            messageText: 'Cannot delete or rename "Custom" preset.',
            messageType: 'warn'
        });
        messageBar.saveMessage({
            messageName: 'presetNotFound',
            messageText: 'Error finding preset. If errors persist, click the "clear all options" link',
            messageType: 'error'
        });
        messageBar.saveMessage({
            messageName: 'tooManyEdits',
            messageText: 'Too many unsaved edits.Save and try again.',
            messageType: 'warn'
        });

        /* Get options or set default options */
        if ('undefined' === typeof localStorage.lockerOptions) {
            localStorage.lockerOptions = JSON.stringify(defaultOptions);
        }
        lockerOptions = JSON.parse(localStorage.lockerOptions);
        lockerPresets = lockerOptions.presets;

        /* Add HTML to page */
        $('#user-tabs ul.nav-tabs').append(tab);
        $('#user-info div.tab-content').append(content);
        $('tr.lkrheading').css({ "border-top": "20px solid white", "border-bottom": "20px solid white" });

        /* Dynamically add preset options */
        lockerOptions.presets.forEach(function (value, index, array) {
            createPresetEntry(value);
        });

        /* Add event listeners */
        $('#lkrpreset').change(onPresetClicked);
        $('.lkrselect').change(onLockValueChanged);
        $('#lkrAddPreset').click(onAddPresetClicked);
        $('#lkrRenamePreset').click(onRenamePresetClicked);
        $('#lkrRemovePreset').click(onRemovePresetClicked);
        $('#lkrbtn').click(Lkr_Lock);
        $('#lkrclearoptions').click(clearSavedOptions);

        /* Shortcut */
        new wLib.Interface.Shortcut('locker', 'editing', 'CS+l', Lkr_Lock, this).add();

        /* Get last used preset and set as selected or use "Custom" as default. */
        if (!presetExists(lockerOptions.lastPreset).found) {
            saveOptions('lastPreset', 'Custom');
        }
        $('#lkrpreset').val(lockerOptions.lastPreset).change();

        updateAlert();
    }

    function Lkr_bootstrap(count) {
        console.debug('Locker: Bootstrap...');
        if (window.$ && 'undefined' !== typeof wLib &&
            $('#user-tabs ul.nav-tabs').length > 0 &&
            $('#user-info div.tab-content').length > 0) {
            console.debug('Locker: Running init.');
            Lkr_init();
        } else if (count < 10) {
            window.setTimeout(function () {
                Lkr_bootstrap(++count);
            }, 1000);
        } else {
            console.error('Locker: Bootstrap error.');
        }
    }

    Lkr_bootstrap(0);
} ());