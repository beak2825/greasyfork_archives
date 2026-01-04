// ==UserScript==
// @name         Google Sheets Enable Scandinavian Keyboard On Mac
// @namespace    https://gist.github.com/f-steff
// @version      1.3
// @description  Fix shift+option+number keys in Google Sheets on Mac while using a Scandinavian keyboard layout, by interception of shift+option+number keys, and replace them with the correct char pasted in. Flaws: Does not enter edit mode when inserting into inactivated sheet cells.
// @author       Flemming Steffensen
// @match        http://docs.google.com/spreadsheets/*
// @match        https://docs.google.com/spreadsheets/*
// @include      http://docs.google.com/spreadsheets/*
// @include      https://docs.google.com/spreadsheets/*
// @grant        none
// @license      MIT
// @homepageURL  https://gist.github.com/f-steff/ace84434e1ee4e1107bcf0ba8d72ed2b
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/522449/Google%20Sheets%20Enable%20Scandinavian%20Keyboard%20On%20Mac.user.js
// @updateURL https://update.greasyfork.org/scripts/522449/Google%20Sheets%20Enable%20Scandinavian%20Keyboard%20On%20Mac.meta.js
// ==/UserScript==


function simulatePaste(code, character) {
    navigator.clipboard.writeText(character).then(() => {
        document.execCommand('paste');
    });
}

(function() {
    'use strict';

    var isMac = navigator.platform.indexOf("Mac") === 0
    if (!isMac) return; // Only a fix for Mac computer

    // Store the original addEventListener function
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    // To my supprise, browser keyboard events are unfiltered hardware events, so they need debounching.
    const debounceTime = 50; // milliseconds
    let lastInvocationTime = 0;

    // Hack: Override addEventListener on the EventTarget prototype
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const isPassive = options && (typeof options === 'object') && options.passive;
        const customListener = (event) => {
            if (type === "keydown" && event.shiftKey && event.altKey && event.code.startsWith("Digit")) {
                if (!isPassive) {
                    event.preventDefault(); // Prevent the default key action
                }
                const currentTime = new Date().getTime();
                if (currentTime - lastInvocationTime > debounceTime) {

                    console.log("Current: " + currentTime + " Last: " + lastInvocationTime + " = Shift and Option are pressed together with " + event.code);
                    lastInvocationTime = currentTime;

                    // Handle keys
                         if (event.code === "Digit1") { simulatePaste(event.code, "¯"); } //  Sheets mapping is: upper border set
                    else if (event.code === "Digit2") { simulatePaste(event.code, "”"); } //  Sheets mapping is: right border set
                    else if (event.code === "Digit3") { simulatePaste(event.code, "$"); } //  Sheets mapping is: lower border set
                    else if (event.code === "Digit4") { simulatePaste(event.code, "¢"); } //  Sheets mapping is: left border set
                    else if (event.code === "Digit5") { simulatePaste(event.code, "‰"); }
                    else if (event.code === "Digit6") { simulatePaste(event.code, "˜"); } //  Sheets mapping is: all border clear
                    else if (event.code === "Digit7") { simulatePaste(event.code, "\\"); } // Sheets mapping is: all border set
                    else if (event.code === "Digit8") { simulatePaste(event.code, "{"); }
                    else if (event.code === "Digit9") { simulatePaste(event.code, "}"); }
                    else if (event.code === "Digit0") { simulatePaste(event.code, "≈"); }
                } else return;
            } else {
                listener.call(this, event);
            }
        };
        // Call the original addEventListener function
        originalAddEventListener.call(this, type, customListener, options);
    };
})();
