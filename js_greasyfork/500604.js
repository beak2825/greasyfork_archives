// ==UserScript==
// @name         Disable DRC Audio on YouTube
// @author       Adri
// @namespace    http://tampermonkey.net/
// @match        https://www.youtube.com/*
// @grant        none
// @version      0.1
// @description  Disables DRC Audio (Stable Volume) on YouTube
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/500604/Disable%20DRC%20Audio%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/500604/Disable%20DRC%20Audio%20on%20YouTube.meta.js
// ==/UserScript==

// ad-hoc script - manipulates yt html/js to manually disable stable volume
// executes on first-page load, assumes yt doesn't change drc after that
(function() {
    'use strict';
    console.log('ya')
    function waitForElement(selector) {
        return new Promise((resolve, reject) => {
            let element = document.querySelector(selector);
            if (element) {
                resolve(element);
            } else {
                const observer = new MutationObserver(mutations => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect();
                        resolve(element);
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        });
    }

    function disableDRC() {
        return new Promise((resolve, reject) => {
            waitForElement('.ytp-settings-button')
                .then(menuButton => {
                    menuButton.click();
                    menuButton.click();
                    return waitForElement('.ytp-drc-menu-item');
                })
                .then(drcMenuItem => {
                    if (drcMenuItem.getAttribute('aria-checked') === 'true') {
                        drcMenuItem.click();
                        console.log('Disabled DRC Audio');
                    } else {
                        console.log('DRC Audio is already disabled');
                    }
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // Main execution
    disableDRC()
        .catch(error => {
            console.error('Error:', error);
        });

})();