// ==UserScript==
// @name         Doccano - Convert URLs to Clickable Hyperlinks
// @version      1.1.1
// @namespace    http://tampermonkey.net/
// @description  For the Doccano text annotator application: replace non-clickable urls with hyperlinks.
// @author       Kyle Nakamura
// @license      MIT
// @match        */projects/1/text-classification*
// @icon         https://doccano.herokuapp.com/static/_nuxt/img/icon.c360b38.png
// @downloadURL https://update.greasyfork.org/scripts/456651/Doccano%20-%20Convert%20URLs%20to%20Clickable%20Hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/456651/Doccano%20-%20Convert%20URLs%20to%20Clickable%20Hyperlinks.meta.js
// ==/UserScript==


// Global constants
const urlRegStr = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    urlRegExp = new RegExp(urlRegStr, 'i'),
    urlMaxLength = 2083,
    loadtimeDelay = 200;


/**
 *  Check if a string is a valid URL/URI.
 *
 *  @param  {string}    str
 *  @return {boolean}
 */
function isURL(str) {
    return str.length < urlMaxLength && urlRegExp.test(str);
}


/**
 *  Wrap a string in an HTML <a> tag to create a clickable hyperlink.
 *
 *  @param  {string}    url
 *  @return {string}
 */
function makeHyperlink(url) {
    return `<a href="${url}" target="_blank">${url}</a>`;
}


function findAndReplaceUrl() {
    let hyperlinkCreated = false;

    // Iterate over all elements with the relevant classnames
    // (in case multiple such elements exist).
    document.querySelectorAll('.v-card__text.title.highlight').forEach(el => {
        // Extract first word from the element and trim extra whitespace.
        const url = el.innerHTML.split(',')[0].trim();

        // Insert the clickable hyperlink in place within `el`,
        // replacing only the non-clickable url.
        if (isURL(url)) {
            el.innerHTML = el.innerHTML.replace(url, makeHyperlink(url));
            hyperlinkCreated = true;
        }
    });

    return hyperlinkCreated;
}


// Repeat every 500 ms because the page never refreshes and
// therefore the script never executes twice within the same session.
const interval = setInterval(() => {
    // Cancel interval after a url was replaced on this page load.
    if (findAndReplaceUrl()) {
        clearInterval(interval);

        // Additionally, add event listeners to repeat
        // on every page navigation done via button presses.
        document.querySelectorAll('button').forEach(el => {
            el.addEventListener('click', () => {
                let eventInterval = setInterval(() => {
                    if (findAndReplaceUrl()) {
                        clearInterval(eventInterval);
                    }
                }, parseInt(loadtimeDelay / 5));
            });
        });
    };
}, loadtimeDelay);
