// ==UserScript==
// @name         No Grok Button
// @namespace    http://tampermonkey.net/
// @version      2023-12-09
// @description  Removes the Grok button on Twitter (or X for weirdos)
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481777/No%20Grok%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/481777/No%20Grok%20Button.meta.js
// ==/UserScript==
function ifElementExistsThen(selector, callback) {
    var checker = setInterval(function() {
        if ($(selector).length) {
            clearInterval(checker);
            callback();
        }
    }, 50);
}
(function() {
    'use strict';
    const iconSelector = '[aria-label="Grok"]';
    ifElementExistsThen(iconSelector, () => {
        document.querySelectorAll(iconSelector)[0].parentElement.removeChild(document.querySelectorAll(iconSelector)[0]);
    });
})();