// ==UserScript==
// @name         1Flix.to Anti-Popup & Redirect Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aggressively blocks invisible pop-ups and redirect attempts on 1flix.to
// @author       Twin
// @match        *://1flix.to/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536932/1Flixto%20Anti-Popup%20%20Redirect%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/536932/1Flixto%20Anti-Popup%20%20Redirect%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block attempts to open new windows/tabs
    window.open = function() {
        console.warn('Blocked window.open attempt');
        return null;
    };

    // Block location change attempts
    Object.defineProperty(window, 'location', {
        configurable: false,
        enumerable: true,
        get: function() {
            return window._location || document.location;
        },
        set: function(value) {
            console.warn('Blocked location redirect to:', value);
        }
    });

    // Prevent automatic navigation via beforeunload
    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        e.returnValue = '';
    });

    // Stop click hijacking
    document.addEventListener('click', function(e) {
        let el = e.target;
        while (el) {
            if (el.tagName === 'A' && el.href && /ad|click|sponsor|out\.php/i.test(el.href)) {
                console.warn('Blocked suspicious link:', el.href);
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }
            el = el.parentElement;
        }
    }, true);

    // Periodic cleanup of suspicious iframes or scripts
    setInterval(() => {
        document.querySelectorAll('iframe, script').forEach(el => {
            const src = el.src || '';
            if (/ads|track|popup|click|doubleclick|out\.php/i.test(src)) {
                console.warn('Removing suspicious element:', src);
                el.remove();
            }
        });
    }, 1000);
})();