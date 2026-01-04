// ==UserScript==
// @name         Coloured hashtag-labels in Google Tasks
// @namespace    https://github.com/jola16/userscripts/
// @version      2024-02-29b
// @description  Dynamically transforms #hashtags to coloured "labels" in Google Calendar Tasks view. To see it in action, go to your Google Calender and switch to the Tasks view. 
// @author       Jonas Larsen
// @match        https://tasks.google.com/embed/fullscreen*
// @match        https://tasks.google.com/*/embed/fullscreen*
// @icon         https://upload.wikimedia.org/wikipedia/commons/5/5b/Google_Tasks_2021.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488694/Coloured%20hashtag-labels%20in%20Google%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/488694/Coloured%20hashtag-labels%20in%20Google%20Tasks.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to create trusted HTML
    const myp = trustedTypes.createPolicy("myP", {
        createHTML: (string) => string,
    });

    // Function to generate a consistent pastel-like background color based on the label text
    const generateBackgroundColor = function (text) {
        let backgroundColor;

        // Generate a hash code from the text
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Convert the hash to a hexadecimal color
        const color = (hash & 0x00FFFFFF).toString(16).toUpperCase().padStart(6, '0');

        // Convert the hexadecimal color to an RGB color
        const r = Math.round(parseInt(color.substring(0, 2), 16));
        const g = Math.round(parseInt(color.substring(2, 4), 16));
        const b = Math.round(parseInt(color.substring(4, 6), 16));

        // Calculate the pastel-like color by reducing the saturation and lightness
        const hsl = rgbToHsl(r, g, b);
        const pastelHSL = [hsl[0], hsl[1] * 0.6, Math.min(hsl[2] * 1.2, 90)];

        // Convert the pastel-like HSL color back to RGB
        const pastelRGB = hslToRgb(...pastelHSL);

        // Convert the RGB color to a CSS color string
        backgroundColor = `rgb(${Math.round(pastelRGB[0])}, ${Math.round(pastelRGB[1])}, ${Math.round(pastelRGB[2])})`;

        // Check the contrast ratio with white
        let contrastRatio = getContrastRatio(backgroundColor, '#FFFFFF');

        // If the contrast ratio is below the recommended threshold (e.g., 4.5:1), adjust the color
        while (contrastRatio < 4.5) {
            // Adjust the color to ensure sufficient contrast ratio with white
            backgroundColor = increaseContrastWithWhite(backgroundColor);
            // Recalculate the contrast ratio with white
            contrastRatio = getContrastRatio(backgroundColor, '#FFFFFF');
        }

        return backgroundColor;
    };



    // Function to calculate contrast ratio between two colors
    const getContrastRatio = function(color1, color2) {
        // Convert colors to RGBA format
        const rgba1 = colorToRGBA(color1);
        const rgba2 = hexToRgb(color2);

        // Calculate luminance for color 1
        const lum1 = luminance(rgba1[0], rgba1[1], rgba1[2]);

        // Calculate luminance for color 2
        const lum2 = luminance(rgba2[0], rgba2[1], rgba2[2]);

        // Find the lighter and darker colors
        const lighterColor = Math.max(lum1, lum2);
        const darkerColor = Math.min(lum1, lum2);

        // Calculate contrast ratio
        const contrast = (lighterColor + 0.05) / (darkerColor + 0.05);

        return contrast;
    }

    // Function to convert color string to RGBA array
    const colorToRGBA = function(color) {
        const rgba = color.match(/\d+/g).map(Number);
        return rgba;
    }

    // Function to convert hex color to RGB array
    const hexToRgb = function(hex) {
        // Remove # if present
        hex = hex.replace('#', '');

        // Convert short hex to full hex
        if (hex.length === 3) {
            hex = hex.split('').map(function (x) {
                return x + x;
            }).join('');
        }

        // Parse hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return [r, g, b];
    }

    // Function to calculate luminance from RGB components
    const luminance = function(r, g, b) {
        const a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    // Function to increase the contrast ratio with white
    const increaseContrastWithWhite = function (backgroundColor) {
        // Extract RGB values from the background color string
        const rgbValues = backgroundColor.match(/\d+(\.\d+)?/g);
        const r = Math.round(parseFloat(rgbValues[0]));
        const g = Math.round(parseFloat(rgbValues[1]));
        const b = Math.round(parseFloat(rgbValues[2]));

        // Calculate the perceived luminance of the background color
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // Calculate the desired luminance of white (1)
        const desiredLuminance = 1;

        // Calculate the luminance difference
        const luminanceDifference = desiredLuminance - luminance;

        // Adjust each RGB component to darken the color while maintaining its hue and saturation
        const darkenedR = Math.max(Math.min(r + Math.round(luminanceDifference * 0.2126), 255), 0);
        const darkenedG = Math.max(Math.min(g + Math.round(luminanceDifference * 0.7152), 255), 0);
        const darkenedB = Math.max(Math.min(b + Math.round(luminanceDifference * 0.0722), 255), 0);

        // Convert the adjusted RGB values to a CSS color string
        return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
    };


    // Function to convert RGB color to HSL color
    const rgbToHsl = function (r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
    };

    // Function to convert HSL color to RGB color
    const hslToRgb = function (h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = function (p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    };


    // Function to fix the label on a specified node
    const fixlabel = function (node) {
        'use strict';
        // Restore <label>tag</label> back to a simple #tag
        let tempHTML = node.innerHTML.replace(/<label.*?>(\S+)<\/label>/g, '#$1');

        // Replace #tag with <label>tag</label>, with styling
        tempHTML = tempHTML.replace(/#(\S+)/g, function (match, p1) {
            // Generate a consistent pastel-like background color based on the tag content
            const backgroundColor = generateBackgroundColor(p1);

            // Create trusted HTML for the label
            return `<label style="background-color: ${backgroundColor}; border-color: ${backgroundColor}; border-radius: 4px; padding: 0 4px 0 4px; color: #ffffff">${p1}</label>`;
        });

        // Set the modified HTML back to the node
        node.innerHTML = myp.createHTML(tempHTML);
    };


    // Function to iterate through all div > html-blob elements and fix labels
    const fixlabels = function () {
        'use strict';
        const entries = document.querySelectorAll('div > html-blob');
        /* console.log(entries.length); */
        if (entries.length > 0) {
            for (const entry of entries) {
                fixlabel(entry);
            }
        }
    };

    // Flag to indicate whether observer is currently running
    let observerRunning = false;

    // Function to observe mutations and call fixlabel for each changed node of type html-blob
    const observe = function () {
        'use strict';
        const observer = new MutationObserver(function(mutationsList, observer) {
            if (observerRunning) return;
            observerRunning = true;
            setTimeout(() => {
                /* console.log("slept for 1000 ms. Will now call fixlabels"); */
                fixlabels();
                observerRunning = false;
            }, 1000);
        });

        // Start observing mutations on the entire document
        observer.observe(document, { subtree: true, childList: true });
    };


    // Wait for the entire window to be fully loaded
    window.addEventListener('load', function() {
        // console.log('Window fully loaded. Will sleep for ms before continuing');
        setTimeout(() => {
            // console.log("slept for a short while. Will now continue");

            // Debugging - Find all html-blob on the page
            // const blobs = document.querySelectorAll('html-blob');
            // console.error(blobs);

            // Call fixlabels function to initially fix labels
            fixlabels();

            // Call observe function to start observing mutations
            observe();

        }, 200);

    });
})();