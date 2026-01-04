// ==UserScript==
// @name         Discourse delete loading animation
// @version      1.1
// @description  remove Discourse id "d-splash" section...
// @namespace https://greasyfork.org/users/1442595
// @author       Dahi
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/538538/Discourse%20delete%20loading%20animation.user.js
// @updateURL https://update.greasyfork.org/scripts/538538/Discourse%20delete%20loading%20animation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSplashElement() {
        const splashElement = document.getElementById('d-splash');
        if (splashElement) {
            splashElement.remove();
        }
    }

    function initRemove() {
        removeSplashElement();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRemove);
    } else {
        initRemove();
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes) {
                removeSplashElement();
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();