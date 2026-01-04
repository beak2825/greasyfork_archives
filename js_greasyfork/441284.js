// ==UserScript==
// @name         sonarcloud auto load code
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  auto load code
// @license      MIT
// @author       IgnaV
// @license      -
// @match        https://sonarcloud.io/*
// @icon         https://sonarcloud.io/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/441284/sonarcloud%20auto%20load%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/441284/sonarcloud%20auto%20load%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const loading = () => document.body.innerHTML.search('Loading more lines...') !== -1;
    const cond = () => document.querySelector('button.css-1l8mct1.e1ggc5wq0');

    let intervalId;
    const interval = (callback, ms) => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        if (callback) {
            intervalId = setInterval(callback, ms);
        }
    };

    let started = false;
    const loadCode = () => {
        let count = 0;
        interval(() => {
            if (!loading()) {
                const button = cond();
                if (button) {
                    started = true;
                    button.click();
                } else if (started) {
                    interval();
                }
            } else if (count >= 40) {
                interval();
            }
            count++;
        }, 200);
    };
    loadCode();

    let permanentIntervalid = setInterval(loadCode, 5000);
    document.addEventListener("visibilitychange", (event) => {
        if (permanentIntervalid) {
            clearInterval(permanentIntervalid);
        }
        if (document.visibilityState == "visible") {
            permanentIntervalid = setInterval(loadCode, 5000);
        }
    });
})();