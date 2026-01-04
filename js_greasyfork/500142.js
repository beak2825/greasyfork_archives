// ==UserScript==
// @name         HiDive Series ID Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract and display series ID from network requests on HiDive
// @author       AnimeIsMyWaifu
// @match        https://www.hidive.com/season/*
// @grant        none
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/500142/HiDive%20Series%20ID%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/500142/HiDive%20Series%20ID%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Create and style a box to display the series number
const displayBox = document.createElement('div');
displayBox.id = 'series-display-box';
displayBox.style.position = 'fixed';
displayBox.style.top = '10px';
displayBox.style.right = '10px';
displayBox.style.padding = '10px';
displayBox.style.backgroundColor = 'white';
displayBox.style.border = '1px solid black';
displayBox.style.zIndex = '9999';
displayBox.style.display = 'none';
document.body.appendChild(displayBox);

// Function to extract and display the series number
function extractSeriesNumber(url) {
    const match = url.match(/https:\/\/dce-frontoffice\.imggaming\.com\/api\/v4\/series\/(\d+)/);
    if (match) {
        const seriesNumber = match[1];
        displayBox.textContent = `Series ID: ${seriesNumber}`;
        displayBox.style.display = 'block';
    }
}

// Monitor network requests
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
        const url = this.responseURL;
        if (url.includes('https://dce-frontoffice.imggaming.com/api/v4/series/')) {
            extractSeriesNumber(url);
        }
    });
    originalOpen.apply(this, arguments);
};

// Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function() {
    return originalFetch.apply(this, arguments).then(response => {
        const url = response.url;
        if (url.includes('https://dce-frontoffice.imggaming.com/api/v4/series/')) {
            extractSeriesNumber(url);
        }
        return response;
    });
};

// Function to check the current URL and toggle the display box
function checkURL() {
    if (window.location.href.startsWith('https://www.hidive.com/season/')) {
        displayBox.style.display = 'block';
    } else {
        displayBox.style.display = 'none';
    }
}

// Monitor URL changes
let lastURL = location.href;
new MutationObserver(() => {
    const currentURL = location.href;
    if (currentURL !== lastURL) {
        lastURL = currentURL;
        checkURL();
    }
}).observe(document, { subtree: true, childList: true });

// Initial check
checkURL();
})();
