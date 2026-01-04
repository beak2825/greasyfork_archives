  // ==UserScript==
  // @name        Page Load Time
  // @match       *://*/*
  // @grant       none
  // @version     1.0.0
  // @author      NoUser
  // @description Display the page load time using the Level 2 Navigation Timing API.
  // @namespace   https://greasyfork.org/users/1016720
  // @homepage    https://greasyfork.org/en/scripts/493805-page-load-time
  // @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493805/Page%20Load%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/493805/Page%20Load%20Time.meta.js
  // ==/UserScript==

// https://w3c.github.io/navigation-timing/
//
// Note:
// Initial loads show results which are longer than what the browser's console shows
// Subsequent loads are consistent with what the browser's console shows

(function() {
    'use strict';
    window.addEventListener('load', function() {
        setTimeout(() => {
            const [navigationTiming] = performance.getEntriesByType('navigation');

            if (navigationTiming) {
                const loadTime = navigationTiming.loadEventEnd - navigationTiming.startTime;
                let loadTimeText;

                // Check if load time is less than 1 second
                if (loadTime < 1000) {
                    // Display in milliseconds
                    loadTimeText = loadTime.toFixed(0) + 'ms';
                } else {
                    // Display in seconds
                    loadTimeText = (loadTime / 1000).toFixed(2) + 's';
                }

                const loadTimeDiv = document.createElement('div');
                loadTimeDiv.textContent = 'Page Load Time: ' + loadTimeText;
                Object.assign(loadTimeDiv.style, {
                    position: 'fixed',
                    bottom: '0px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    padding: '5px 10px',
                    fontSize: '14px',
                    zIndex: '10000',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                });
                document.body.appendChild(loadTimeDiv);
            } else {
                console.warn('Level 2 Navigation Timing API may not be supported in this browser.');
            }
        }, 10);
    });
})();