// ==UserScript==
// @name         Extra Video Control
// @version      2.2
// @description  Manipulate and center video elements on web pages. (Zoom, Invert, save per site, Move, Volume boost, Reset changes)
// @run-at      document-start
// @match        *://*/*
// @grant        none
// @author TallTacoTristan
// @license MIT
// @namespace https://greasyfork.org/users/1253611
// @downloadURL https://update.greasyfork.org/scripts/505039/Extra%20Video%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/505039/Extra%20Video%20Control.meta.js
// ==/UserScript==
// Declare variables
let xaxis = 1.0;
let yaxis = 1.0;
let xposition = 0;
let yposition = 0;

// Check if stored values exist for the current site
if (localStorage.getItem('xaxis')) {
    xaxis = parseFloat(localStorage.getItem('xaxis'));
    yaxis = parseFloat(localStorage.getItem('yaxis'));
    xposition = parseInt(localStorage.getItem('xposition'));
    yposition = parseInt(localStorage.getItem('yposition'));
}

// Apply transformations to all existing video elements
applyTransformations();

document.addEventListener('keydown', (event) => {
    if (event.altKey) {
        switch (event.keyCode) {
            case 88: // 'x' key
                if (event.shiftKey) {
                    if (xaxis < 0) xaxis += 0.04;
                    else xaxis -= 0.04;
                } else {
                    if (xaxis < 0) xaxis -= 0.04;
                    else xaxis += 0.04;
                }
                break;
            case 89: // 'y' key
                if (event.shiftKey) {
                    if (yaxis < 0) yaxis += 0.04;
                    else yaxis -= 0.04;
                } else {
                    if (yaxis < 0) yaxis -= 0.04;
                    else yaxis += 0.04;
                }
                break;
            case 61: // '+' key
                if (xaxis < 0) xaxis -= 0.04;
                else xaxis += 0.04;
                if (yaxis < 0) yaxis -= 0.04;
                else yaxis += 0.04;
                break;
            case 173: // '-' key
                if (xaxis < 0) xaxis += 0.04;
                else xaxis -= 0.04;
                if (yaxis < 0) yaxis += 0.04;
                else yaxis -= 0.04;
                break;
            case 85: // 'u' key (up)
                yposition -= 20;
                break;
            case 72: // 'h' key (left)
                xposition -= 20
                break;
            case 74: // 'j' key (down)
                yposition += 20
                break;
            case 75: // 'k' key (right)
                xposition += 20
                break;
            case 82: // 'r' key (reset)
                xaxis = 1.0;
                yaxis = 1.0;
                xposition = 0;
                yposition = 0;
                break;
        }

        // Save the transformation values for the current site
        localStorage.setItem('xaxis', xaxis);
        localStorage.setItem('yaxis', yaxis);
        localStorage.setItem('xposition', xposition);
        localStorage.setItem('yposition', yposition);

        // Apply transformations to all video elements
        applyTransformations();
    }
});
// Function to apply transformations to all video elements
function applyTransformations() {
    document.querySelectorAll('video').forEach(video => {
        video.style.transform = `scale(${xaxis}, ${yaxis}) translate(${xposition}px, ${yposition}px)`;
    });
}

// Mutation observer to detect changes in the DOM and reapply transformations
const config = { childList: true, subtree: true };
const callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            applyTransformations();
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(document, config);

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();
gainNode.gain.value = 1.0; // Initial gain value

// Keep track of video elements that have been connected to the gain node
const connectedVideos = new Set();

document.addEventListener('keydown', function(event) {
    if (event.shiftKey) {
        if (event.key === '+') {
            // Increase volume by 0.5
            gainNode.gain.value = Math.min(gainNode.gain.value + 0.5, 10.0); // Adjust maximum gain as needed
        } else if (event.key === '_') {
            // Decrease volume by 0.5
            gainNode.gain.value = Math.max(gainNode.gain.value - 0.5, 0.0);
        }

        // Connect gain node to all video elements that haven't been connected yet
        document.querySelectorAll('video').forEach(video => {
            if (!connectedVideos.has(video)) {
                const source = audioCtx.createMediaElementSource(video);
                source.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                connectedVideos.add(video);
            }
        });
    }
});