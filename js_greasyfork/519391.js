// ==UserScript==
// @name         Immich quality switcher
// @version      2024-11-30
// @description  Script for Immich that adds a button to show original image or video instead of scaled down or transcoded version
// @author       You
// @match        https://demo.immich.app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1404702
// @downloadURL https://update.greasyfork.org/scripts/519391/Immich%20quality%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/519391/Immich%20quality%20switcher.meta.js
// ==/UserScript==

// Globals
let IMG_NODE_LIST = [];
let VIDEO_NODE_LIST = [];
let SWITCH_TO_ORIGINAL_BUTTON = null;
let SWITCH_TO_PREVIEW_BUTTON = null;
let SHOW_ORIGINAL = false;

// Main
(function() {
    'use strict';

    console.log("Show original quality image or video Tampermonkey script running");

    window.switchToOriginal = switchToOriginal;
    window.switchToPreview = switchToPreview;

    let selector = "#immich-asset-viewer > div > div > div.flex:has(button)";
    waitForElement(selector, (html_bar) => {
        console.log("Found html bar node " + html_bar);
        addButtonWithSVG(html_bar);
    });
    let imgselector = "#immich-asset-viewer img[src]";
    waitForElement(imgselector, (img_node) => {
        console.log("Found new image node");

        const observer = new MutationObserver((mutations, obs) => {
            console.log("Image list before cleanup");
            console.log(IMG_NODE_LIST);
            IMG_NODE_LIST = IMG_NODE_LIST.filter(entry => {
                if (!entry.node.isConnected) {
                    entry.observer.disconnect();
                    return false
                }
                return true;
            });
            console.log("Image list after cleanup");
            console.log(IMG_NODE_LIST);
            switchToCurrentSelectedQuality();
        });
        observer.observe(img_node, {
            attributes: true,
            childList: true
        });

        IMG_NODE_LIST.push({node: img_node, observer: observer});
        switchToCurrentSelectedQuality();
    });
    let videoselector = "#immich-asset-viewer video[src]";
    waitForElement(videoselector, (video_node) => {
        console.log("Found new video node");

        const observer = new MutationObserver((mutations, obs) => {
            console.log("Video list before cleanup");
            console.log(VIDEO_NODE_LIST);
            VIDEO_NODE_LIST = VIDEO_NODE_LIST.filter(entry => {
                if (!entry.node.isConnected) {
                    entry.observer.disconnect();
                    return false
                }
                return true;
            });
            console.log("Video list after cleanup");
            console.log(VIDEO_NODE_LIST);
            switchToCurrentSelectedQuality();
        });
        observer.observe(video_node, {
            attributes: true,
            childList: true
        });

        VIDEO_NODE_LIST.push({node: video_node, observer: observer});
        switchToCurrentSelectedQuality();
    });
})();


// Helper functions
function switchToCurrentSelectedQuality(selector, callback) {
    console.log("Updating image and video sources to selected quality");
    IMG_NODE_LIST.forEach(entry => {
        let node = entry.node;
        if (SHOW_ORIGINAL && node && node.src && node.src.includes('thumbnail?size=preview&')) {
            node.src = node.src.replace('thumbnail?size=preview&', 'original?');
        }
        if (!SHOW_ORIGINAL && node && node.src && node.src.includes('original?')) {
            node.src = node.src.replace('original?', 'thumbnail?size=preview&');
        }
    });
    VIDEO_NODE_LIST.forEach(entry => {
        let node = entry.node;
        if (SHOW_ORIGINAL && node && node.src && node.src.includes('video/playback')) {
            node.src = node.src.replace('video/playback', 'original');
        }
        if (!SHOW_ORIGINAL && node && node.src && node.src.includes('original')) {
            node.src = node.src.replace('original', 'video/playback');
        }
    });
}

function waitForElement(selector, callback) {
    findNewElementWithCallback(selector, callback);
    const observer = new MutationObserver((mutations, obs) => {
        findNewElementWithCallback(selector, callback);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function findNewElementWithCallback(selector, callback) {
    const element = document.querySelectorAll(selector);
    if (element) {
        element.forEach(node => {
            if (!node.hasAttribute('tmElementFound')) {
                node.setAttribute('tmElementFound', '');
                callback(node);
            }
        });
    }
}

function switchToOriginal() {
    console.log("Switching img and video sources to original quality");
    SHOW_ORIGINAL = true;
    switchToCurrentSelectedQuality();
    SWITCH_TO_PREVIEW_BUTTON.removeAttribute('style');
    SWITCH_TO_ORIGINAL_BUTTON.setAttribute('style', 'display:none');
}

function switchToPreview() {
    console.log("Switching img and video sources to preview quality");
    SHOW_ORIGINAL = false;
    switchToCurrentSelectedQuality();
    SWITCH_TO_ORIGINAL_BUTTON.removeAttribute('style');
    SWITCH_TO_PREVIEW_BUTTON.setAttribute('style', 'display:none');
}

function addButtonWithSVG(parentElement) {
    // Create the button element
    var button = document.createElement('button');

    // Set button classes
    button.className = 'flex place-content-center place-items-center rounded-full bg-transparent hover:bg-immich-bg/30 text-white hover:dark:text-white p-3 transition-all disabled:cursor-default hover:dark:text-immich-dark-gray';

    // Set button title attribute
    button.setAttribute('title', 'Show Original');
    button.setAttribute('onclick', 'window.switchToOriginal()');

    if (SHOW_ORIGINAL) {
        // Set second button to hidden
        button.setAttribute('style', 'display:none');
    }

    // Create SVG element
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    // Create path element (placeholder path)
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M4 4h16v16H4z M8 12h8M12 8v8');

    // Append path to SVG
    svg.appendChild(path);

    // Append SVG to button
    button.appendChild(svg);

    SWITCH_TO_ORIGINAL_BUTTON = button;

    // Insert button as the first child of the parent element
    parentElement.insertBefore(button, parentElement.firstChild);

    ///////////////////
    // Second button that will switch to preview
    ///////////////////

    // Create the button element
    var button2 = document.createElement('button');

    // Set button classes
    button2.className = 'flex place-content-center place-items-center rounded-full bg-transparent hover:bg-immich-bg/30 text-white hover:dark:text-white p-3 transition-all disabled:cursor-default hover:dark:text-immich-dark-gray';

    // Set button title attribute
    button2.setAttribute('title', 'Show Preview');
    button2.setAttribute('onclick', 'window.switchToPreview()');

    if (!SHOW_ORIGINAL) {
        // Set second button to hidden
        button2.setAttribute('style', 'display:none');
    }

    // Create SVG element
    var svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg2.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg2.setAttribute('width', '24');
    svg2.setAttribute('height', '24');
    svg2.setAttribute('viewBox', '0 0 24 24');
    svg2.setAttribute('fill', 'none');
    svg2.setAttribute('stroke', 'currentColor');
    svg2.setAttribute('stroke-width', '2');
    svg2.setAttribute('stroke-linecap', 'round');
    svg2.setAttribute('stroke-linejoin', 'round');

    // Create path element (placeholder path)
    var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M4 4h16v16H4z M8 12h8');

    // Append path to SVG
    svg2.appendChild(path2);

    // Append SVG to button
    button2.appendChild(svg2);

    SWITCH_TO_PREVIEW_BUTTON = button2;

    // Insert button as the first child of the parent element
    parentElement.insertBefore(button2, parentElement.firstChild);
}