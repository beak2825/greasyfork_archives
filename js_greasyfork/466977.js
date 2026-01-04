// ==UserScript==
// @name         Auto Jump to Live
// @namespace    autojumptolive
// @version      0.1
// @description  Auto jump to live.
// @author       zaelggk
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466977/Auto%20Jump%20to%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/466977/Auto%20Jump%20to%20Live.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function callback(mutations, observer) {
        mutations.forEach(mutation => {
            if (mutation.type == 'attributes') {
                if (mutation.attributeName == 'title'){
                    return;
                }
                if (!mutation.target.disabled){
                    mutation.target.click();
                }
            }
        })
    }

    let btn = document.getElementsByClassName('ytp-live-badge ytp-button')[0];
    if (btn == undefined) {
        return;
    }
    let config = { attributes: true };
    const observer = new MutationObserver(callback);
    observer.observe(btn, config);
})();