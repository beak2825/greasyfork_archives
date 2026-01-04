// ==UserScript==
// @name         Roll20 FX Playground Tools
// @namespace    https://wiki.roll20.net/
// @version      0.2
// @description  Improved UI for Roll20's FX Playground
// @author       Braiba
// @match        https://wiki.roll20.net/fxplayground/
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js
// @downloadURL https://update.greasyfork.org/scripts/425092/Roll20%20FX%20Playground%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/425092/Roll20%20FX%20Playground%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fields = [
        {
            "name": "angle",
            "label": "Angle",
            "type": "number",
            "min": 0,
            "max": 360,
            "isOptional": true,
            "defaultValue": 0,
            "defaultRandom": 360
        },
        {
            "name": "duration",
            "label": "Duration",
            "type": "number",
            "min": 1,
            "isOptional": true,
            "defaultValue": -1
        },
        {
            "name": "emissionRate",
            "label": "Emission Rate",
            "type": "number",
            "min": 0,
            "defaultValue": 8
        },
        {
            "name": "gravity",
            "label": "Gravity",
            "type": "point",
            "defaultValue": {x: 0.4, y: 0.2}
        },
        {
            "name": "lifeSpan",
            "label": "Life Span",
            "type": "number",
            "min": 0,
            "defaultValue": 9,
            "defaultRandom": 7
        },
        {
            "name": "maxParticles",
            "label": "Max Particles",
            "type": "number",
            "min": 1,
            "defaultValue": 150
        },
        {
            "name": "positionRandom",
            "label": "Position Random",
            "type": "point",
            "defaultValue": {x: 10, y: 10}
        },
        {
            "name": "sharpness",
            "label": "Sharpness",
            "type": "number",
            "max": 100,
            "min": 0,
            "defaultValue": 40,
            "defaultRandom": 10
        },
        {
            "name": "size",
            "label": "Size",
            "type": "number",
            "min": 0,
            "defaultValue": 45,
            "defaultRandom": 15
        },
        {
            "name": "speed",
            "label": "Speed",
            "type": "number",
            "min": 0,
            "defaultValue": 5,
            "defaultRandom": 1.5
        },
        {
            "name": "startColour",
            "label": "Start Colour",
            "type": "colour",
            "defaultValue": [250, 218, 68, 1]
        },
        {
            "name": "startColourRandom",
            "label": "Start Colour Random",
            "type": "colour-random",
            "defaultValue": [62, 60, 60, 0]
        },
        {
            "name": "endColour",
            "label": "End Colour",
            "type": "colour",
            "defaultValue": [245, 35, 0, 0],
            "defaultRandom": [60, 60, 60, 0]
        },
        {
            "name": "endColourRandom",
            "label": "End Colour Random",
            "type": "colour-random",
            "defaultValue": [60, 60, 60, 0]
        }
    ];


    var builtInColours = [
        {
            "name": "Acid",
            "values": {
                "startColour": [0, 35, 10, 1],
                "startColourRandom": [0, 10, 10, 0.25],
                "endColour": [0, 75, 30, 0],
                "endColourRandom": [0, 20, 20, 0]
            }
        },
        {
            "name": "Blood",
            "values": {
                "startColour": [175, 0, 0, 1],
                "startColourRandom": [20, 0, 0, 0],
                "endColour": [175, 0, 0, 0],
                "endColourRandom": [20, 0, 0, 0]
            }
        },
        {
            "name": "Charm",
            "values": {
                "startColour": [200, 40, 150, 1],
                "startColourRandom": [25, 5, 20, 0.25],
                "endColour": [200, 40, 150, 0],
                "endColourRandom": [50, 10, 40, 0]
            }
        },
        {
            "name": "Death",
            "values": {
                "startColour": [10, 0, 0, 1],
                "startColourRandom": [5, 0, 0, 0.25],
                "endColour": [20, 0, 0, 0],
                "endColourRandom": [10, 0, 0, 0]
            }
        },
        {
            "name": "Fire",
            "values": {
                "startColour": [220, 35, 0, 1],
                "startColourRandom": [62, 0, 0, 0.25],
                "endColour": [220, 35, 0, 0],
                "endColourRandom": [60, 60, 60, 0]
            }
        },
        {
            "name": "Frost",
            "values": {
                "startColour": [90, 90, 175, 1],
                "startColourRandom": [0, 0, 0, 0.25],
                "endColour": [125, 125, 255, 0],
                "endColourRandom": [0, 0, 0, 0]
            }
        },
        {
            "name": "Holy",
            "values": {
                "startColour": [175, 130, 25, 1],
                "startColourRandom": [20, 10, 0, 0.25],
                "endColour": [175, 130, 50, 0],
                "endColourRandom": [20, 20, 20, 0]
            }
        },
        {
            "name": "Magic",
            "values": {
                "startColour": [50, 50, 50, 0.5],
                "startColourRandom": [150, 150, 150, 0.25],
                "endColour": [128, 128, 128, 0],
                "endColourRandom": [125, 125, 125, 0]
            }
        },
        {
            "name": "Slime",
            "values": {
                "startColour": [0, 250, 50, 1],
                "startColourRandom": [0, 20, 10, 0.25],
                "endColour": [0, 250, 50, 0],
                "endColourRandom": [20, 20, 20, 0]
            }
        },
        {
            "name": "Smoke",
            "values": {
                "startColour": [150, 150, 150, 1],
                "startColourRandom": [10, 10, 10, 0.5],
                "endColour": [200, 200, 200, 0],
                "endColourRandom": [10, 10, 10, 0]
            }
        },
        {
            "name": "Water",
            "values": {
                "startColour": [15, 15, 150, 1],
                "startColourRandom": [5, 5, 25, 0.25],
                "endColour": [10, 10, 100, 0],
                "endColourRandom": [10, 10, 25, 0]
            }
        }
    ];

    var builtInEffects = [
        {
            "name": "Beam",
            "values": {
                "maxParticles": 3000,
                "size": 15,
                "sizeRandom": 0,
                "lifeSpan": 15,
                "lifeSpanRandom": 0,
                "emissionRate": 50,
                "speed": 30,
                "speedRandom": 7,
                "angle": -1,
                "angleRandom": 1,
                "duration": 25
            }
        },
        {
            "name": "Breath",
            "values": {
                "maxParticles": 750,
                "size": 20,
                "sizeRandom": 10,
                "lifeSpan": 25,
                "lifeSpanRandom": 2,
                "emissionRate": 25,
                "speed": 15,
                "speedRandom": 3,
                "angle": -1,
                "angleRandom": 30,
                "duration": 25
            }
        },
        {
            "name": "Bubbling",
            "values": {
                "maxParticles": 200,
                "size": 15,
                "sizeRandom": 3,
                "lifeSpan": 20,
                "lifeSpanRandom": 5,
                "speed": 7,
                "speedRandom": 2,
                "gravity": { "x": 0.01, "y": 0.65 },
                "angle": 270,
                "angleRandom": 35,
                "emissionRate": 1
            }
        },
        {
            "name": "Burn",
            "values": {
                "maxParticles": 100,
                "size": 35,
                "sizeRandom": 15,
                "lifeSpan": 10,
                "lifeSpanRandom": 3,
                "speed": 3,
                "angle": 0,
                "emissionRate": 12
            }
        },
        {
            "name": "Burst",
            "values": {
                "maxParticles": 100,
                "size": 35,
                "sizeRandom": 15,
                "lifeSpan": 10,
                "lifeSpanRandom": 3,
                "speed": 3,
                "angle": 0,
                "emissionRate": 12,
                "onDeath": "explosion-magic" /* Not currently supported */
            }
        },
        {
            "name": "Explode",
            "values": {
                "maxParticles": 300,
                "size": 35,
                "sizeRandom": 10,
                "duration": 25,
                "lifeSpan": 20,
                "lifeSpanRandom": 5,
                "speed": 7,
                "speedRandom": 1,
                "angle": 0,
                "angleRandom": 360,
                "emissionRate": 300
            }
        },
        {
            "name": "Glow",
            "values": {
                "maxParticles": 500,
                "size": 5,
                "sizeRandom": 3,
                "lifeSpan": 17,
                "lifeSpanRandom": 5,
                "emissionRate": 7,
                "speed": 3,
                "speedRandom": 2,
                "angle": 270,
                "angleRandom": 45
            }
        },
        {
            "name": "Missile",
            "values": {
                "maxParticles": 350,
                "size": 7,
                "sizeRandom": 3,
                "lifeSpan": 7,
                "lifeSpanRandom": 5,
                "emissionRate": 50,
                "speed": 7,
                "speedRandom": 5,
                "angle": 135,
                "angleRandom": 0
            }
        },
        {
            "name": "Nova",
            "values": {
                "maxParticles": 500,
                "size": 15,
                "sizeRandom": 0,
                "lifeSpan": 30,
                "lifeSpanRandom": 0,
                "emissionRate": 1000,
                "speed": 7,
                "speedRandom": 0,
                "angle": 0,
                "angleRandom": 180,
                "duration": 5
            }
        },
        {
            "name": "Splatter",
            "values": {
                "maxParticles": 750,
                "size": 7,
                "sizeRandom": 3,
                "lifeSpan": 20,
                "lifeSpanRandom": 5,
                "emissionRate": 3,
                "speed": 7,
                "speedRandom": 2,
                "gravity": { "x": 0.01, "y": 0.5 },
                "angle": -1,
                "angleRandom": 20,
                "duration": 10
            }
        },

    ];

    var hexToRgb = function(hex) {
        hex = hex.replace(/^#/,'');

        var matches = hex.match(/[0-9a-f]{2}/gi);
        return [
            parseInt(matches[0], 16),
            parseInt(matches[1], 16),
            parseInt(matches[2], 16)
        ];
    }

    var numberToHex = function(n, digits) {
        return n.toString(16).padStart(digits, '0');
    }

    var rgbaToHex = function(rgba, ignoreAlpha) {
        return '#' + numberToHex(rgba[0], 2) + numberToHex(rgba[1], 2) + numberToHex(rgba[2], 2) + (ignoreAlpha ? '' : numberToHex(rgba[3], 2));
    }

    var addFieldValueToFx = function(fieldData, formData, fxData) {
        if (fieldData.type === 'number') {
            var numValue = -1;

            if (!fieldData.hasOwnProperty('isOptional') || !fieldData.isOptional || formData.hasOwnProperty(fieldData.name + 'Enabled')) {
                numValue = parseFloat(formData[fieldData.name]);
                if (numValue === NaN) {
                    numValue = fieldData.defaultValue;
                }
            }

            if (numValue !== fieldData.defaultValue) {
                fxData[fieldData.name] = numValue;
            }

            if (fieldData.hasOwnProperty('defaultRandom')) {
                var randomName = fieldData.name + 'Random';
                var randomValue = parseFloat(formData[randomName]);
                if (randomValue !== fieldData.defaultRandom) {
                    fxData[randomName] = randomValue;
                }
            }
        } else if (fieldData.type === 'point') {
            var pointXValue = parseFloat(formData[fieldData.name + 'X']);
            var pointYValue = parseFloat(formData[fieldData.name + 'Y']);

            if ((pointXValue !== NaN) && (pointYValue !== NaN)) {
                var pointValue = {x: pointXValue, y: pointYValue};
                if (JSON.stringify(pointValue) !== JSON.stringify(fieldData.defaultValue)) {
                    fxData[fieldData.name] = pointValue;
                }
            }
        } else if (fieldData.type === 'colour') {
            var colValue = hexToRgb(formData[fieldData.name]);
            var colOpacity = parseFloat(formData[fieldData.name + 'Opacity']);
            if (colOpacity !== NaN) {
                colValue.push(colOpacity/100);
            } else {
                colValue.push(fieldData.defaultValue[3]);
            }

            if (JSON.stringify(colValue) !== JSON.stringify(fieldData.defaultValue)) {
                fxData[fieldData.name] = colValue;
            }
        } else if (fieldData.type === 'colour-random') {
            var parts = ['R', 'G', 'B', 'A'];
            var partValues = [];

            for (var i in parts) {
                if (parts.hasOwnProperty(i)) {
                    var part = parts[i];

                    var partValue = parseFloat(formData[fieldData.name + part]);

                    if (partValue === NaN) {
                        partValue = fieldData.dataValue[i];
                    }

                    partValues.push(partValue);
                }
            }

            if (JSON.stringify(partValues) !== JSON.stringify(fieldData.defaultValue)) {
                fxData[fieldData.name] = partValues;
            }
        } else {
            console.error('Unexpected field type: ' + fieldData.type);
        }
    }

    var buildFxData = function() {
        var formData = {};
        for (var inputData of $('#controlsPlus').serializeArray()) {
            formData[inputData.name] = inputData.value;
        }

        var fxData = {};
        for (var field of fields) {
            addFieldValueToFx(field, formData, fxData);
        }

        if (fxData.hasOwnProperty('gravity')) {
        // Zero values aren't allowed for gravity
            if (fxData.gravity.x === 0) {
                fxData.gravity.x = 0.001;
            }

            if (fxData.gravity.y === 0) {
                fxData.gravity.y = 0.001;
            }
        }

        return fxData;
    }

    var doRefreshPlus = function() {
        var fxData = buildFxData();

        if (fxData.hasOwnProperty('gravity')) {
            // Gravity has an explicit override on the format in the playground code for some reason
            fxData.gravity = [fxData.gravity.x, fxData.gravity.y];
        }

        $('#data').val(JSON.stringify(fxData));

        $('#refresh').click();
    }

    var addBuiltInLoader = function($controlsPlus) {
        var $row = $('<div class="form-row">');

        var $colourSelect = $('<select></select>')
            .attr('id', 'builtInColor')
            .addClass('form-control');
        for (var colourData of builtInColours) {
            $colourSelect.append($('<option>' + colourData.name + '</option>'));
        }

        var $effectSelect = $('<select></select>')
            .attr('id', 'builtInEffect')
            .addClass('form-control');
        for (var effectData of builtInEffects) {
            $effectSelect.append($('<option>' + effectData.name + '</option>'));
        }

        var $loadBtn = $('<button type="button">Load Built-In</button>')
            .attr('id', 'loadButton')
            .addClass('btn btn-primary');

        $row.append($('<div class="col"></div>').append($colourSelect));
        $row.append($('<div class="col"></div>').append($effectSelect));
        $row.append($('<div class="col-auto"></div>').append($loadBtn));

        $controlsPlus.append($row);
    }

    var createFieldInput = function(fieldData, $row) {
        var initialValue = fieldData.defaultValue;
        var isEnabled = true;
        var fieldNames = [];

        if (fieldData.type === 'number') {
            var $numInput = $('<input />')
                .attr('type', 'number')
                .attr('name', fieldData.name)
                .attr('min', 0)
                .attr('step', 'any')
                .addClass('form-control');

            if (fieldData.hasOwnProperty('max')) {
                $numInput.attr('max', fieldData.max);
            }

            $row.append($('<div class="col"></div>').append($numInput));

            fieldNames.push(fieldData.name);

            if (fieldData.hasOwnProperty('defaultRandom')) {
                var $numRandomInput = $('<input />')
                    .attr('type', 'number')
                    .attr('name', fieldData.name + 'Random')
                    .attr('min', (fieldData.hasOwnProperty('min') ? fieldData.min : 0))
                    .attr('step', 'any')
                    .addClass('form-control');

                if (fieldData.hasOwnProperty('max')) {
                    $numRandomInput.attr('max', fieldData.max);
                }

                $row.append(
                    $('<div class="col"></div>')
                        .append(
                            $('<div class="input-group"></div>')
                                .append($('<div class="input-group-prepend"><div class="input-group-text">&plusmn;</div></div>'))
                                .append($numRandomInput)
                        )
                );

                // Angle can be disabled, but still have randomness applied
                // fieldNames.push(fieldData.name + 'Random');
            }

        } else if (fieldData.type === 'point') {
            var $xInput = $('<input />')
                .attr('type', 'number')
                .attr('name', fieldData.name + 'X')
                .addClass('form-control');

            var $yInput = $('<input />')
                .attr('type', 'number')
                .attr('name', fieldData.name + 'Y')
                .addClass('form-control');

            $row.append($('<div class="col"></div>').append($xInput));
            $row.append($('<div class="col-auto"><div class="form-control-plaintext">,</div></div>'));
            $row.append($('<div class="col"></div>').append($yInput));

            fieldNames.push(fieldData.name + 'X');
            fieldNames.push(fieldData.name + 'Y');
        } else if (fieldData.type === 'colour') {
            var $colInput = $('<input />')
                .attr('name', fieldData.name)
                .attr('type', 'color')
                .addClass('form-control');

            var $colOpacityInput = $('<input />')
                .attr('name', fieldData.name + 'Opacity')
                .attr('type', 'number')
                .attr('min', 0)
                .attr('max', 100)
                .attr('step', 'any')
                .addClass('form-control');

            $row.append($('<div class="col"></div>').append($colInput));
            $row.append($('<div class="col-auto"><div class="form-control-plaintext">x</div></div>'));
            $row.append(
                $('<div class="col"></div>')
                    .append(
                        $('<div class="input-group"></div>')
                            .append($colOpacityInput)
                            .append($('<div class="input-group-append"><div class="input-group-text">%</div></div>'))
                    )
            );

            fieldNames.push(fieldData.name);
        } else if (fieldData.type === 'colour-random') {
            var parts = ['R', 'G', 'B', 'A'];

            for (var i in parts) {
                if (parts.hasOwnProperty(i)) {
                    var part = parts[i];

                    var $partInput = $('<input />')
                        .attr('type', 'number')
                        .attr('name', fieldData.name + part)
                        .attr('min', 0)
                        .attr('max', (part === 'A' ? 1 : 255))
                        .attr('step', 'any')
                        .addClass('form-control')
                        .addClass('colour-part-' + part.toLowerCase());

                    $row.append($('<div class="col"></div>').append($partInput));
                }

                fieldNames.push(fieldData.name + part);
            }
        } else {
            console.error('Unexpected field type: ' + fieldData.type);
        }

        if (fieldData.hasOwnProperty('isOptional') && fieldData.isOptional) {
            var $enabledCheckbox = $('<input />')
                .attr('type', 'checkbox')
                .attr('name', fieldData.name + 'Enabled')
                .addClass('form-check-input')
                .data('linked-fields', fieldNames);

            if (isEnabled) {
                $enabledCheckbox.prop('checked', true);
            }

            $('label', $row).after($('<div class="col-auto"></div>').append($('<div class="form-check"></div>').append($enabledCheckbox)));
        }
    }

    var addFieldToForm = function($form, fieldData) {
        var html = `
<div class="form-group form-row">
    <label class="col-5 col-form-label">
        ${fieldData.label}
    </label>
</div>
`;
        var $row = $(html);

        createFieldInput(fieldData, $row);

        $form.append($row);
    }

    var getBuiltInValues = function() {
        var col = $('#builtInColor').val();
        var colData = builtInColours.find(function (findColData) {
            return (findColData.name === col);
        });

        var effect = $('#builtInEffect').val();
        var effectData = builtInEffects.find(function (findEffectData) {
            return (findEffectData.name === effect);
        });

        var values = {};

        Object.assign(values, colData.values);
        Object.assign(values, effectData.values);

        return values;
    }

    var loadFieldFromObject = function(fieldData, obj) {
        var isEnabled = true;
        var fieldNames = [];

        if (fieldData.type === 'number') {
            var $numInput = $('[name=' + fieldData.name +']');

            var initialValue = obj.hasOwnProperty(fieldData.name) ? obj[fieldData.name] : fieldData.defaultValue;

            if (initialValue === -1) {
                initialValue = 0;
                isEnabled = false;
            }

            $numInput.val(initialValue);
            $numInput.prop('disabled', !isEnabled);

            if (fieldData.hasOwnProperty('defaultRandom')) {
                var $numRandomInput = $('[name=' + fieldData.name +'Random]');

                $numRandomInput.val(obj.hasOwnProperty(fieldData.name + 'Random') ? obj[fieldData.name + 'Random'] : fieldData.defaultRandom);
            }
        } else if (fieldData.type === 'point') {
            var $xInput = $('[name=' + fieldData.name +'X]');
            var $yInput = $('[name=' + fieldData.name +'Y]');

            if (obj.hasOwnProperty(fieldData.name)) {
                var fieldValues = obj[fieldData.name];
                if (fieldValues.hasOwnProperty('x')) {
                    // The FX playground expects the gravity property in the form of an array, but actual Roll20 needs it as an object with x and y keys, so support both on import
                    $xInput.val(fieldValues.x);
                    $yInput.val(fieldValues.y);
                } else {
                    $xInput.val(fieldValues[0]);
                    $yInput.val(fieldValues[1]);
                }
            } else {
                $xInput.val(fieldData.defaultValue.x);
                $yInput.val(fieldData.defaultValue.y);
            }
        } else if (fieldData.type === 'colour') {
            var $colInput = $('[name=' + fieldData.name +']');
            var $colOpacityInput = $('[name=' + fieldData.name +'Opacity]');

            var colValue = (obj.hasOwnProperty(fieldData.name) ? obj[fieldData.name] : fieldData.defaultValue);
            $colInput.val(rgbaToHex(colValue, true));
            $colOpacityInput.val(colValue[3] * 100);
        } else if (fieldData.type === 'colour-random') {
            var parts = ['R', 'G', 'B', 'A'];

            for (var i in parts) {
                if (parts.hasOwnProperty(i)) {
                    var part = parts[i];

                    var $partInput = $('[name=' + fieldData.name + part +']');

                    var partValue = fieldData.defaultValue[i];
                    if (obj.hasOwnProperty(fieldData.name)) {
                        partValue = obj[fieldData.name][i];
                    }

                    if (part === 'A') {
                        // Display as percentage, to match opacity input
                        partValue *= 100;
                    }

                    $partInput.val(partValue);
                }
            }
        } else {
            console.error('Unexpected field type: ' + fieldData.type);
        }

        if (fieldData.hasOwnProperty('isOptional') && fieldData.isOptional) {
            var $enabledCheckbox = $('[name=' + fieldData.name +'Enabled]');

            $enabledCheckbox.prop('checked', isEnabled);
        }
    }

    var loadFromObject = function(obj) {
        for (var field of fields) {
            loadFieldFromObject(field, obj);
        }

        doRefreshPlus();
    }

    var copyFxDataToClipboard = function() {
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.writeText(JSON.stringify(buildFxData()))
                    .then(function() {
                        window.alert('The FX data has been copied to the clipboard');
                    }, function() {
                        window.alert('Could not copy to clipboard');
                    });
            }
        });
    }

    var loadFxDataFromClipboard = function() {
        navigator.permissions.query({name: "clipboard-read"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.readText()
                    .then(function(rawText) {
                        try {
                            var json = JSON.parse(rawText);
                            loadFromObject(json);
                        } catch (e) {
                            console.error(e);
                            window.alert('The contents of the clipboard does not appear to be FX data');
                        }
                    }, function() {
                        window.alert('Could not read from clipboard');
                    });
            }
        });
    }

    var init = function() {
        var css = `
#controls {
    display: none;
}

#controlsPlus {
    position: absolute;
    z-index: 1000;
    top: 10px;
    left: 10px;
    width: 450px;
    height: auto;
    padding: 10px;
    background-color: rgba(255,255,255,0.5);
}

#controlsPlus .form-control {
    padding: .125rem .5rem;
}

#controlsPlus .form-control:disabled,
#controlsPlus .form-control[readonly] {
    background-color: transparent;
    border-color: #495057;
    color: #495057;
}

#controlsPlus .form-check {
    display: flex;
    align-items: center;
    height: calc(1.5em + .75rem + 2px);
}

#controlsPlus .form-check-input {
    margin-top: 0;
}

#controlsPlus .colour-part-r {
    border-color: #F00;
    background-color: #FBB;
}

#controlsPlus .colour-part-g {
    border-color: #0F0;
    background-color: #BFB;
}

#controlsPlus .colour-part-b {
    border-color: #00F;
    background-color: #BBF;
}

`;
        $(document.head).append($('<style type="text/css">' + css + '</style>'));
        $(document.head).append($('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">'));

        var $controlsPlus = $('<form id="controlsPlus"></div>');

        addBuiltInLoader($controlsPlus);

        $controlsPlus.append($('<hr />'));

        for (var field of fields) {
            addFieldToForm($controlsPlus, field);
        }

        var importExportHtml = `
<div class="form-row">
    <div class="col">
        <button type="button" id="importBtn" class="btn btn-block btn-primary">Import from Clipboard</button>
    </div>

    <div class="col-auto">
        <div class="form-control-plaintext">|</div>
    </div>

    <div class="col">
        <button type="button" id="exportBtn" class="btn btn-block btn-primary">Export to Clipboard</button>
    </div>
`;
        $controlsPlus.append($(importExportHtml));

        $(document.body).append($controlsPlus);

        $('#controlsPlus input[type=checkbox]').on('change', function() {
            var $checkbox = $(this);
            var linkedFields = $checkbox.data('linked-fields');

            for (var linkedField of linkedFields) {
                $('[name=' + linkedField + ']').prop('disabled', !$checkbox.prop('checked'));
            }
        });

        $('#controlsPlus input').on('change', function() {
            doRefreshPlus();
        });

        $('#controlsPlus button#loadButton').on('click', function() {
            loadFromObject(getBuiltInValues());
        });

        $('#controlsPlus button#importBtn').on('click', function() {
            loadFxDataFromClipboard();
        });

        $('#controlsPlus button#exportBtn').on('click', function() {
            copyFxDataToClipboard();
        });
    }

    init();

    loadFromObject({});
})();
