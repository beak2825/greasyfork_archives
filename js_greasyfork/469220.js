// ==UserScript==
// @name         Native Promise for YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @license      MIT
// @description  YouTube replaced Promise with polyfill in some old browsers.
// @author       CY Fung
// @match        https://*.youtube.com/*
// @match        https://www.youtube-nocookie.com/embed/*
// @run-at       document-start
// @grant        none
// @unwrap
// @allFrames
// @inject-into  page
// @compatible   firefox Firefox >= 52 && Firefox < 69
// @compatible   edge Edge >= 15 && Edge < 79
// @downloadURL https://update.greasyfork.org/scripts/469220/Native%20Promise%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/469220/Native%20Promise%20for%20YouTube.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (typeof PromiseRejectionEvent !== 'function') {

        /*
        
            Minimum Requirement:
                async ()=>{}: Chrome 55, Edge 15, Safari 11, Firefox 52, Opera 42
            
            Target Browsers below the following versions:
                PromiseRejectionEvent: Chrome 49, Edge 79, Safari 11, Firefox 69, Opera 36
            
            This script will only work for 
                Edge >= 15 && Edge < 79
                Firefox >= 52 && Firefox <= 69
        
        */

        try {

            const truePromise = (async () => { })().constructor; // suppress polyfill if the old browser can support async arrow function;

            window.PromiseRejectionEvent = (() => {
                throw 'PromiseRejectionEvent is not supported';
            }); // Waterfox Classic does not have "PromiseRejectionEvent"

            if (truePromise !== Promise) window.Promise = truePromise; // if the script runs after polyfill.

        } catch (e) {
            throw 'Your browser is too old. This script will not work for you';
        }

    }

})();