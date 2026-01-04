// esversion: 6
// ==UserScript==
// @name         Disable page visibility API
// @namespace    https://www.androidacy.com/pva/
// @version      1.2
// @description  Block autoplay and pagevisibility events
// @author       Androidacy
// @include      *
// @exclude      https://www.google.com/adsense/new/*
// @icon         https://www.androidacy.com/wp-content/uploads/cropped-cropped-cropped-cropped-New-Project-32-69C2A87-1-192x192.jpg
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/443691/Disable%20page%20visibility%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/443691/Disable%20page%20visibility%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // For debugging, run localStorage.setItem('_daua_debug', 'true') in your console
    const debug = localStorage.getItem('_daua_debug')
    // Intercept all focus events
    const origEvtListener = window.addEventListener // eslint-disable-no-undef
    window.addEventListener = (a, b, c) => {
        if (a === 'blur' || a === 'focus' || a === 'visibilitychange' || a === 'webkitvisiblitychange') {
            if (debug) {
                console.debug('Nooping eventListener: ', a, b, c)
            }
            return undefined
        } else {
            return origEvtListener(a, b, c)
        }
    }
    window.addEventListener.toString = () => {
        return origEvtListener.toString()
    }
})();