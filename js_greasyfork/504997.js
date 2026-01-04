// ==UserScript==
// @name         Return Google Search Counter
// @author       NWP
// @description  Brings back the Google search counter
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @include      https://www.google.*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504997/Return%20Google%20Search%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/504997/Return%20Google%20Search%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const debug = false;

    function log(message, data) {
        if (debug) {
            if (data !== undefined && data !== null) {
                console.log(message, data);
            } else {
                console.log(message);
            }
        }
    }

    function relocateResultStats(observer) {
        const resultStats = document.getElementById('result-stats');
        const appbar = document.getElementById('appbar');

        log(resultStats ? "Found resultStats:" : "resultStats not found.", resultStats);
        log(appbar ? "Found appbar:" : "appbar not found.", appbar);

        if (!resultStats || !appbar) {
            log("One or both elements (resultStats, appbar) not found. Stopping observer.");
            observer.disconnect();
            return;
        }

        if (!appbar.contains(resultStats)) {
            log("Appending resultStats to appbar.");
            try {
                appbar.appendChild(resultStats);
                log("Stopping observer as the task is complete.");
                observer.disconnect();
            } catch (e) {
                console.error("Error appending resultStats to appbar:", e);
            }
        } else {
            log("resultStats is already in the appbar, stopping observer.");
            observer.disconnect();
        }
    }

    const observer = new MutationObserver(() => {
        log("MutationObserver detected changes in the DOM.");
        relocateResultStats(observer);
    });

    log("Starting MutationObserver.");
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    log("Performing initial check.");
    relocateResultStats(observer);

})();