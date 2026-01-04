// ==UserScript==
// @name         Youtube clickbait capitalization fix
// @namespace    Youtube
// @version      2023-12-18
// @match https://*.youtube.com
// @description  Makes all Youtube video titles consistent, only the first letter of the title is uppercase
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482594/Youtube%20clickbait%20capitalization%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/482594/Youtube%20clickbait%20capitalization%20fix.meta.js
// ==/UserScript==


function formatTitle(element) {
    // Get the title attribute of the parent element
    let titleText = element.parentNode.getAttribute('title');

    // Split the title into words
    let words = titleText.split(' ');

    // Capitalize the first word and make the rest lowercase
    words = words.map((word, index) => {
        if (index === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
            return word.toLowerCase();
        }
    });

    // Join the words back together
    let formattedTitle = words.join(' ');

    // Set the text content of the element to the formatted title
    element.textContent = formattedTitle;
}

function observeTitleChanges() {
    // Get all elements with the tag <yt-formatted-string> and the id #video-title
    let titleElements = document.querySelectorAll('yt-formatted-string#video-title');

    // Create a MutationObserver instance
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
                formatTitle(mutation.target.querySelector('yt-formatted-string#video-title'));
            }
        });
    });

    // Start observing each parent element for changes in its title attribute
    titleElements.forEach(titleElement => {
        observer.observe(titleElement.parentNode, { attributes: true, attributeFilter: ['title'] });
        formatTitle(titleElement);
    });
}



(function() {
    'use strict';

// Set up a timer to check continuously if the titles have loaded
let checkInterval = setInterval(() => {
    if (document.querySelectorAll('yt-chip-cloud-chip-renderer').length > 5) {
        clearInterval(checkInterval);
        observeTitleChanges();
    }
}, 500);
})();