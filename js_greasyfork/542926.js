// ==UserScript==
// @name         Tampermonkey Port: Logitech F4 Hold Trigger
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  press f4 to load miniprofile
// @author       whiskey_jack
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/542926/Tampermonkey%20Port%3A%20Logitech%20F4%20Hold%20Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/542926/Tampermonkey%20Port%3A%20Logitech%20F4%20Hold%20Trigger.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hasTriggered = false; // Prevents re-triggering while key is held down

    document.addEventListener('keydown', (event) => {
        if (event.code === 'F4' && !hasTriggered) {
            hasTriggered = true; // Mark as triggered to block re-triggering on hold

            // Updated DOM: text is inside <span id="link-aria-label-*"
            // class "linkTitle____NPyM">Back to profile</span> within the <a>
            const element = (() => {
                const label = document.querySelector('span.linkTitle____NPyM, span[id^="link-aria-label"]');
                return label ? label.closest('a[role="button"], a[href*="profiles.php"]') : null;
            })();

            if (element) {
                element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));

                setTimeout(() => {
                    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
                }, 650);
            } else {
                // If not found, allow another try without needing keyup
                hasTriggered = false;
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'F4') {
            hasTriggered = false; // Allow triggering again on next press
        }
    });
})();
