// ==UserScript==
// @name         Attack Buttons
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Add Start Fight Buttons ontop of Weapons
// @author       Stig [2648238]
// @match        https://www.torn.com/loader.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488106/Attack%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/488106/Attack%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        let el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(function() {
                waitForElement(selector, callback);
            }, 500);
        }
    }

    function addButtons() {
        let weaponImages = document.querySelectorAll('.weaponImage___tUzwP');
        let originalButton = document.querySelector('.dialogButtons___nX4Bz .torn-btn.btn___RxE8_.silver');

        if (originalButton) {
            let count = 0;

            weaponImages.forEach(function(weaponImage) {
                if (count < 4) {
                    let button = document.createElement('button');
                    button.type = 'submit';
                    button.className = originalButton.className + ' custom-added-button';
                    button.setAttribute('i-data', originalButton.getAttribute('i-data'));
                    button.textContent = originalButton.textContent;
                    button.style.position = 'absolute';
                    button.style.zIndex = '9999';

                    let preloaderWrapClone = originalButton.querySelector('.preloader-wrap').cloneNode(true);
                    button.appendChild(preloaderWrapClone);

                    document.body.appendChild(button);

                    let weaponImageRect = weaponImage.getBoundingClientRect();
                    button.style.top = (window.scrollY + weaponImageRect.top + (weaponImageRect.height - button.offsetHeight) / 2) + 'px';
                    button.style.left = (window.scrollX + weaponImageRect.left + (weaponImageRect.width - button.offsetWidth) / 2) + 'px';

                    button.addEventListener('click', function(event) {
                        originalButton.click();
                        document.querySelectorAll('.custom-added-button').forEach(customButton => customButton.remove());
                        event.preventDefault();
                    });

                    count++;
                }
            });
        }
    }

    waitForElement('.coreWrap___LtSEy', function(coreWrap) {
        waitForElement('.appHeaderWrapper___uyPti', function(appHeaderWrapper) {
            waitForElement('.playersModelWrap___rZigq', function(topSection) {
                waitForElement('.dialogButtons___nX4Bz', function(titleContainer) {
                    addButtons();
                });
            });
        });
    });
})();