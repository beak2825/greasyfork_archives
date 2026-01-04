// ==UserScript==
// @name         CTR
// @namespace    http://tampermonkey.net/
// @version      2024-12-07
// @description  Rotate colors on the webpage, including images and ads!
// @author
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519106/CTR.user.js
// @updateURL https://update.greasyfork.org/scripts/519106/CTR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeGamma(c) {
        if ( c <= 0.04045 ) {
            return c / 12.92;
        } else {
            return Math.pow( ( c + 0.055 ) / 1.055, 2.4 );
        }
    }

    function applyGamma(c) {
        if ( c <= 0.0031308 ) {
            return 12.92 * c;
        } else {
            return 1.055 * Math.pow( c, 1.0 / 2.4 ) - 0.055;
        }
    }

    function getMat(theta) {
        var u = 1/Math.sqrt(3);
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);

        var rotMat = [
            [
                cos + u*u*(1 - cos),
                u*u*(1 - cos) - u*sin,
                u*u*(1 - cos) + u*sin
            ],
            [
                u*u*(1 - cos) + u*sin,
                cos + u*u*(1 - cos),
                u*u*(1 - cos) - u*sin
            ],
            [
                u*u*(1 - cos) - u*sin,
                u*u*(1 - cos) + u*sin,
                cos + u*u*(1 - cos)
            ]
        ];

        return rotMat;
    }

    function rotateColor(color, theta) {
        var rotMat = getMat(-theta);

        // Convert to linear sRGB
        var r_lin = removeGamma(color.r / 255);
        var g_lin = removeGamma(color.g / 255);
        var b_lin = removeGamma(color.b / 255);

        // Apply rotation
        var r_rot = r_lin * rotMat[0][0] + g_lin * rotMat[1][0] + b_lin * rotMat[2][0];
        var g_rot = r_lin * rotMat[0][1] + g_lin * rotMat[1][1] + b_lin * rotMat[2][1];
        var b_rot = r_lin * rotMat[0][2] + g_lin * rotMat[1][2] + b_lin * rotMat[2][2];

        // Convert back to sRGB
        var r = Math.round(applyGamma(r_rot) * 255);
        var g = Math.round(applyGamma(g_rot) * 255);
        var b = Math.round(applyGamma(b_rot) * 255);

        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        return {r: r, g: g, b: b, a: color.a};
    }

    function parseRGBColor(colorStr) {
        if (colorStr.startsWith('rgb(') || colorStr.startsWith('rgba(')) {
            var colorValues = colorStr.match(/[\d.]+/g).map(Number);
            var r = colorValues[0];
            var g = colorValues[1];
            var b = colorValues[2];
            var a = colorValues[3] !== undefined ? colorValues[3] : 1;
            return {r: r, g: g, b: b, a: a};
        } else if (colorStr.startsWith('#')) {
            var hex = colorStr.substring(1);
            if (hex.length === 3) {
                let r = parseInt(hex[0] + hex[0], 16);
                let g = parseInt(hex[1] + hex[1], 16);
                let b = parseInt(hex[2] + hex[2], 16);
                return {r: r, g: g, b: b, a: 1};
            } else if (hex.length === 6) {
                let r = parseInt(hex.substring(0,2), 16);
                let g = parseInt(hex.substring(2,4), 16);
                let b = parseInt(hex.substring(4,6), 16);
                return {r: r, g: g, b: b, a: 1};
            }
        } else {
            var ctx = document.createElement('canvas').getContext('2d');
            ctx.fillStyle = colorStr;
            var computedColor = ctx.fillStyle;
            if (computedColor.startsWith('#')) {
                return parseRGBColor(computedColor);
            }
        }
        return {r: 0, g: 0, b: 0, a: 1};
    }

    function rgbToColorString(color) {
        if (color.a !== undefined && color.a < 1) {
            return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
        } else {
            return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        }
    }

    var elements = [];

    function initializeColors() {
        elements = [];
        var allElements = document.querySelectorAll('*');
        allElements.forEach(function(el) {
            var computedStyle = window.getComputedStyle(el);

            var color = computedStyle.color;
            var backgroundColor = computedStyle.backgroundColor;
            var borderColors = {
                borderTopColor: computedStyle.borderTopColor,
                borderRightColor: computedStyle.borderRightColor,
                borderBottomColor: computedStyle.borderBottomColor,
                borderLeftColor: computedStyle.borderLeftColor
            };

            // Text color
            if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
                var parsedColor = parseRGBColor(color);
                elements.push({el: el, property: 'color', originalColor: parsedColor});
            }

            // Background color
            if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
                var parsedBgColor = parseRGBColor(backgroundColor);
                elements.push({el: el, property: 'backgroundColor', originalColor: parsedBgColor});
            }

            // Border colors
            for (var prop in borderColors) {
                var borderColor = borderColors[prop];
                if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
                    var parsedBorderColor = parseRGBColor(borderColor);
                    elements.push({el: el, property: prop, originalColor: parsedBorderColor});
                }
            }
        });
    }

    function applyRotation(theta) {
        // Rotate text/background/border colors individually
        elements.forEach(function(item) {
            if (document.body.contains(item.el)) {
                var rotatedColor = rotateColor(item.originalColor, theta);
                item.el.style[item.property] = rgbToColorString(rotatedColor);
            }
        });

        // Also apply a global hue-rotate filter to affect everything including images
        var angleDegrees = (theta * 180 / Math.PI);
        document.documentElement.style.filter = 'hue-rotate(' + angleDegrees + 'deg)';
    }

    window.addEventListener('load', function() {
        initializeColors();

        var controlContainer = document.createElement('div');
        controlContainer.id = 'controlContainer';
        controlContainer.style.position = 'fixed';
        controlContainer.style.top = '10px';
        controlContainer.style.left = '10px';
        controlContainer.style.zIndex = 10000;
        controlContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        controlContainer.style.padding = '5px';
        controlContainer.style.borderRadius = '5px';
        controlContainer.style.display = 'flex';
        controlContainer.style.alignItems = 'center';
        controlContainer.style.gap = '5px';
        document.body.appendChild(controlContainer);
        console.log('Control container added to body:', controlContainer);

        var slider = document.createElement('input');
        slider.type = 'range';
        slider.id = 'angleSlider';
        slider.min = 0;
        slider.max = 360;
        slider.value = 0;
        slider.style.width = '150px';
        console.log('Slider created:', slider);
        controlContainer.appendChild(slider);

        var resetButton = document.createElement('button');
        resetButton.id = 'resetButton';
        resetButton.textContent = 'Reset';
        controlContainer.appendChild(resetButton);

        var arrowButton = document.createElement('button');
        arrowButton.id = 'arrowButton';
        arrowButton.textContent = 'Reposition';
        controlContainer.appendChild(arrowButton);

        var positions = [
            {top: '10px', left: '10px', bottom: '', right: ''},    // Top-left
            {top: '10px', left: '', bottom: '', right: '10px'},    // Top-right
            {top: '', left: '', bottom: '10px', right: '10px'},    // Bottom-right
            {top: '', left: '10px', bottom: '10px', right: ''}     // Bottom-left
        ];
        var positionIndex = 0;

        function updatePosition() {
            var pos = positions[positionIndex];
            controlContainer.style.top = pos.top;
            controlContainer.style.left = pos.left;
            controlContainer.style.bottom = pos.bottom;
            controlContainer.style.right = pos.right;
        }

        document.getElementById('arrowButton').addEventListener('click', function() {
            positionIndex = (positionIndex + 1) % positions.length;
            updatePosition();
        });

        document.getElementById('angleSlider').addEventListener('input', function() {
            var angleDegrees = parseFloat(this.value);
            var theta = angleDegrees * Math.PI / 180;
            applyRotation(theta);
        });

        document.getElementById('resetButton').addEventListener('click', function() {
            document.getElementById('angleSlider').value = 0;
            applyRotation(0);
        });
    });
})();
