// ==UserScript==
// @name         Garmin Connect: Persist Activity Time/Distance Chart Setting
// @namespace    http://tampermonkey.net/
// @description Persists time/distance activity chart setting in Connect, for the current browser
// @author       You
// @match        https://connect.garmin.com/modern/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        window.onurlchange
// @license      MIT
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/546236/Garmin%20Connect%3A%20Persist%20Activity%20TimeDistance%20Chart%20Setting.user.js
// @updateURL https://update.greasyfork.org/scripts/546236/Garmin%20Connect%3A%20Persist%20Activity%20TimeDistance%20Chart%20Setting.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlPrefix = 'https://connect.garmin.com/modern/activity/'
    let currentPageMatchesUrl = false;

    const toggleQuery = '.chart-toggle-options';

    let tasks = []    

    waitForUrl()

    function waitForUrl() {
        // if (window.onurlchange == null) {
            // feature is supported
            window.addEventListener('urlchange', onUrlChange);
        // }
        onUrlChange();
    }

    function onUrlChange() {
        const urlMatches = window.location.href.startsWith(urlPrefix);
        if (!currentPageMatchesUrl) {
            if (urlMatches) {
                currentPageMatchesUrl = true;
                init();
            }
        } else {
            if (!urlMatches) {
                currentPageMatchesUrl = false;
                deinit();
            }
        }
    }

    function init() {
        tasks = [];
        tasks.push(runWhenReady(toggleQuery, installHandler));
    }
    function deinit() {
        tasks.forEach(task => task.stop());
        tasks = [];
    }

    function runWhenReady(readySelector, callback) {
        let numAttempts = 0;
        let timer = undefined

        const tryNow = function () {
            const elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
                } else {
                    timer = setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };

        const stop = function () {
            clearTimeout(timer);
            timer = undefined
        }

        tryNow();
        return {
            stop
        }
    }

    function installHandler(elem) {
        const timeButton = elem.querySelector(".time-toggle");
        const distanceButton = elem.querySelector(".distance-toggle");
        timeButton.addEventListener('click', () => {
            // localStorage.setItem('_distance_time_pref', 'time');
            localStorage.removeItem('_distance_time_pref');
        });
        distanceButton.addEventListener('click', () => {
            localStorage.setItem('_distance_time_pref', 'distance');
        })
        const pref = localStorage.getItem('_distance_time_pref');
        // if (pref === 'time') {
            // timeButton.click();
            //
            // time is the default and clicking the button here
            // just causes the chart to be rerendered
            // unnecessarily
        // }
        
        if (pref === 'distance') {
            distanceButton.click();
        }
    }
})();