// ==UserScript==
// @name         Give Me! "Git Clone"
// @namespace    https://antidote.day
// @version      0.2
// @description  It is a user script that allows adding git clone to the url with repository from Github.
// @author       Antidote
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476766/Give%20Me%21%20%22Git%20Clone%22.user.js
// @updateURL https://update.greasyfork.org/scripts/476766/Give%20Me%21%20%22Git%20Clone%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    function Inject() {
        var inputElement = document.querySelector("#local-panel > ul > li:nth-child(1) > tab-container > div:nth-child(2) > div > input");
        var copyElement = document.querySelector("#local-panel > ul > li:nth-child(1) > tab-container > div:nth-child(2) > div > div > clipboard-copy");
        inputElement.value = "git clone " + inputElement.value;
        copyElement.value = inputElement.value;
    }

    runWhenReady('#local-panel > ul > li:nth-child(1) > tab-container > div:nth-child(2) > div > input', Inject);
})();
