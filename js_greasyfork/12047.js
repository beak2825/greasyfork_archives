// ==UserScript==
// @name            WME Simplify Segments
// @description     Simplifies segment geometry
// @version         2.1.6
// @author          SAR85
// @copyright       SAR85
// @license         CC BY-NC-ND
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://editor-beta.waze.com/*
// @namespace       https://greasyfork.org/users/9321
// @require		    https://greasyfork.org/scripts/9794-wlib/code/wLib.js?version=106259
// @downloadURL https://update.greasyfork.org/scripts/12047/WME%20Simplify%20Segments.user.js
// @updateURL https://update.greasyfork.org/scripts/12047/WME%20Simplify%20Segments.meta.js
// ==/UserScript==

/* global W */
/* global $ */
/* global wLib */

(function () {
    'use strict';

    var UpdateSegmentGeometry = require('Waze/Action/UpdateSegmentGeometry'),
        DEFAULT_SIMP_FACTOR = 0.8,
        DEFAULT_PROTECTION_DISTANCE = 10,
        options,
        messageBar;

    /**
     * Updates options and stores the options in localStorage.
     */
    function saveOptions(key, value) {
        if (key && value) {
            options[key] = value;
            localStorage.simplifySegments = JSON.stringify(options);
        }
    }

    /**
     * Creates an array of segment objects to simplify later.
     * @param all {Boolean} Specifies whether to include all segments (true) or 
     * just selected ones (false).
     * @return {Array} Array containing segment objects.
     */
    function createSegmentArray(all) {
        var seg,
            segmentArray = [],
            wmeSegmentObjects = W.model.segments.objects;
        if (all) {
            for (seg in wmeSegmentObjects) {
                if (wmeSegmentObjects.hasOwnProperty(seg)) {
                    segmentArray.push(wmeSegmentObjects[seg]);
                }
            }
        } else {
            W.selectionManager.selectedItems.forEach(function (object) {
                if (object.model.type === 'segment') {
                    segmentArray.push(object.model);
                }
            });
        }
        return segmentArray;
    }

    /**
     * Simplifies segment objects contained in an array.
     * @param segmentArray {Array} Array containing segment objects to simplify.
     * @param e {Number} Optional simplification factor. Default is 0.8.
     * @param j {Number} Distance from junction to allow simplification. 
     * Default is 5.
     */
    function simplifySegments(segmentArray, e, j) {
        var i,
            n,
            newGeo,
            segment,
            segmentsSimplifed = 0,
            segmentsNotSimplified = 0,
            numComponents,
            firstToSecondDistance,
            secondToLastDistance,
            protectJunction1 = null,
            protectJunction2 = null;

        e = e || DEFAULT_SIMP_FACTOR;
        j = j || DEFAULT_PROTECTION_DISTANCE;
        segmentArray = segmentArray || [];

        for (i = 0, n = segmentArray.length; i < n; i++) {

            segment = segmentArray[i];

            if (W.model.actionManager.actions.length > 100) {
                messageBar.displayMessage('tooManyEdits');
                return;
            }

            if (segment.isGeometryEditable() && segment.state !== 'Delete' &&
                segment.attributes.junctionID === null &&
                inMapExtent(segment.geometry.getBounds())) {

                numComponents = segment.geometry.components.length;
                firstToSecondDistance = segment.geometry.components[0]
                    .distanceTo(segment.geometry.components[1]);
                secondToLastDistance = segment.geometry.components[numComponents - 2]
                    .distanceTo(segment.geometry.components[numComponents - 1]),
                newGeo = segment.geometry.clone();

                console.debug('SimpSeg: Evaluating segment ' + segment.attributes.id);
                console.debug('SimpSeg: First distance: ' + firstToSecondDistance + '.');
                console.debug('SimpSeg: Second distance: ' + secondToLastDistance + '.');

                if (Math.abs(firstToSecondDistance) < j) {
                    console.debug('SimpSeg: Protecting first junction.');
                    protectJunction1 = newGeo.components.shift();
                }
                if (Math.abs(secondToLastDistance) < j) {
                    console.debug('SimpSeg: Protecting second junction.');
                    protectJunction2 = newGeo.components.pop();
                }
                newGeo = newGeo.simplify(e);
                if (protectJunction1) {
                    newGeo.components.unshift(protectJunction1);
                    protectJunction1 = null;
                }
                if (protectJunction2) {
                    newGeo.components.push(protectJunction2);
                    protectJunction2 = null;
                }
                if (newGeo.components.length <
                    segment.geometry.components.length) {
                    console.debug('Segment ID ' + segment.attributes.id + ' simplifed from ' +
                        segment.geometry.components.length + ' to ' +
                        newGeo.components.length +
                        ' nodes.');
                    W.model.actionManager.add(new UpdateSegmentGeometry(segment,
                        segment.geometry,
                        newGeo));
                    segmentsSimplifed += 1;
                } else {
                    console.debug('Segment ID ' + segment.attributes.id +
                        ' cannot be simplifed using factor ' + e + '.');
                    segmentsNotSimplified += 1;
                }
            }
        }

        messageBar.displayMessage({
            messageText: segmentsSimplifed + ' segment(s) simplified. ' +
            segmentsNotSimplified +
            ' segment(s) not simplifed.',
            messageType: 'info'
        });
    }

    /**
     * Clears all geometry nodes between endpoints of a segment.
     */
    function clearGeometry(segment) {
        var newGeo, n;

        if (segment && segment.isGeometryEditable() &&
            segment.attributes.junctionID === null &&
            inMapExtent(segment.geometry.getBounds())) {
            n = segment.geometry.components.length;
            newGeo = segment.geometry.clone();
            newGeo.components.splice(1, n - 2);
            W.model.actionManager.add(
                new UpdateSegmentGeometry(segment, segment.geometry, newGeo));
        }
    }

    /**
     * Checks if OL.bounds object is within the visible map area.
     */
    function inMapExtent(bounds) {
        return W.map.getExtent().intersectsBounds(bounds);
    }
    
    /**
     * Callback for selection change event.
     */
    function onSelectionChanged() {
        W.selectionManager.hasSelectedItems() ?
            W.selectionManager.selectedItems[0].model.type ===
            'segment' && $('#simplifysegments').fadeIn('fast') :
            $('#simplifysegments').fadeOut('fast');
    }
    /**
     * Callback for segment geometry simplification.
     */
    function onSimplify(e, all) {
        if (all === void 0) {
            all = !W.selectionManager.selectionCountByType.segment;
        }
        if (!wLib.Util.mapReady() || !wLib.Util.modelReady()) {
            messageBar.displayMessage('waitingForData');
        }
        wLib.Model.onModelReady(function () {
            simplifySegments(
                createSegmentArray(all),
                $('#simplifysegment-factor').val(),
                $('#simplifysegment-junction').val());
        }, true);
    }
    
    /**
     * Callback for clearing segment geometry.
     */
    function onClear() {
        var selectedObject;
        return W.selectionManager.hasSelectedItems() &&
            (selectedObject = W.selectionManager.selectedItems[0].model) &&
            selectedObject.type === 'segment' &&
            clearGeometry(selectedObject);
    }
    
    /**
     * Callback for help button.
     */
    function onHelpClicked() {
        alert('To use WME Simplify Segments: \n' +
            '1. Select a segment \n' +
            '2. Select an appropriate simplification factor (usually 0.8-1.0) \n' +
            '3. Select an appropriate junction protection distance (usually >=5) \n' +
            '3. Click the link to simplify or clear the geometry \n' +
            'Alternatively, use the shortcut "Ctrl-Shift-S".');
    }

    function updateAlert() {
        var simplifySegmentsVersion = '2.1.6',
            alertOnUpdate = true,
            versionChanges = 'WME Simplify Segments has been updated to ' +
                simplifySegmentsVersion + '.\n';
        versionChanges += 'Changes:\n';
        versionChanges += '[*] Updated for editor compatibility.\n';
        if (alertOnUpdate && window.localStorage &&
            window.localStorage.simplifySegmentsVersion !==
            simplifySegmentsVersion) {
            window.localStorage.simplifySegmentsVersion =
            simplifySegmentsVersion;
            alert(versionChanges);
        }
    }

    function simpSegInit() {
        /* HTML */
        var content = '<div id="simplifysegments"> <p id="simplifysegment-help" style="text-align: center; margin-bottom: 2px; text-decoration: underline; font-weight: bold; cursor: help;">WME Simplify Segments</p> <p style="text-align: center; margin: 0px;">Simplification factor: <input type="number" min="0" max="20" step="0.1" id="simplifysegment-factor" style="height: 20px; background-color: rgba(0,0,0,0.8); padding-left: 2px; border: 1px solid white; color: white; width: 50px"> </p> <p style="text-align: center; margin: 2px 0 0 0;">Junction protection: <input type="number" min="0" max="20" id="simplifysegment-junction" style="height: 20px; background-color: rgba(0,0,0,0.8); padding-left: 2px; border: 1px solid white; color: white; width: 50px"> </p> <p style="color: white;margin: 2px 0 0 0;"><a id="simplifysegment-simplifylink" style="cursor:pointer; color: rgb(27,237,30)">Simplify Geometry</a> | <a id="simplifysegment-clearlink" style="cursor:pointer; color: red;">Clear Geometry</a></p> </div>';
        var css = {
            'display': 'none',
            'position': 'absolute',
            'top': '120px',
            'left': '73px',
            'padding': '4px',
            'background-color': 'rgba(0,0,0,0.8)',
            'border-radius': '5px',
            'border': 'none',
            'color': 'white',
            'font-size': '0.9em'
        };

        messageBar = new wLib.Interface.MessageBar({
            messagePrefix: 'WME Simplify Segments:'
        });
        messageBar.saveMessage({
            messageName: 'tooManyEdits',
            messageType: 'warn',
            messageText: 'Too many unsaved edits. Save and try again.'
        });
        messageBar.saveMessage({
            messageName: 'waitingForData',
            messageType: 'info',
            messageText: 'Waiting for data.'
        });

        /* Load options */
        if (localStorage &&
            void 0 === typeof localStorage.simplifySegments) {
            localStorage.simplifySegments = '{}';
        }
        options = JSON.parse(localStorage.simplifySegments);

        /* Add HTML to page and initialize */
        $('#map').append(content);
        $('#simplifysegments').css(css);
        $('#simplifysegment-factor').val(options.e || DEFAULT_SIMP_FACTOR);
        $('#simplifysegment-junction').val(options.j ||
            DEFAULT_PROTECTION_DISTANCE);
        
        /* Add event listeners */
        $('#simplifysegment-simplifylink').click(onSimplify);
        $('#simplifysegment-clearlink').click(onClear);
        $('#simplifysegment-help').click(onHelpClicked);
        $('#simplifysegment-factor').change(function () {
            saveOptions('e', $('#simplifysegment-factor').val());
        });
        $('#simplifysegment-junction').change(function () {
            saveOptions('j', $('#simplifysegment-junction').val());
        });
        W.selectionManager.events.register('selectionchanged', null,
            onSelectionChanged);
        
        // Shortcut for simplifying all = ctrl+shift+s
        new wLib.Interface.Shortcut('simplifyAllSegments', 'editing', 'CS+s',
            onSimplify, null).add();
        
        // Check for segments already selected on load.
        if (W.selectionManager.hasSelectedItems() &&
            W.selectionManager.selectedItems[0].model.type === 'segment') {
            $('#simplifysegments').fadeIn('fast');
        }

        updateAlert();
    }

    function simpSegBootstrap() {
        if (window.$ && void 0 !== typeof wLib &&
            window.W && window.W.accelerators && $('#map').size()) {
            console.debug('SimpSeg: Initializing...');
            simpSegInit();
        } else {
            console.debug('SimpSeg: Bootstrap failed. Trying again...');
            window.setTimeout(function () {
                simpSegBootstrap();
            }, 1000);
        }

    }

    console.debug('SimpSeg: Bootstrap...');
    simpSegBootstrap();
} ());