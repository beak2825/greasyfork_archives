// ==UserScript==
// @name         Garmin Connect: save activity chart order
// @namespace    http://tampermonkey.net/
// @description Fixes Connect bug where activity chart order is not saved for devices that don't have step speed loss
// @author       You
// @match        https://connect.garmin.com/modern/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        window.onurlchange
// @license      MIT
// @version      0.4
// @downloadURL https://update.greasyfork.org/scripts/546232/Garmin%20Connect%3A%20save%20activity%20chart%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/546232/Garmin%20Connect%3A%20save%20activity%20chart%20order.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlPrefix = 'https://connect.garmin.com/modern/activity/'
    let currentPageMatchesUrl = false;

    const chartListQuery = '.customize-charts-list .sortable-checkboxes';

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
        tasks.push(runWhenReady(chartListQuery, fixSaveOrder));
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


    function fixSaveOrder(elem) {
        const runningActivityTypeElement = document.querySelector("[data-activity-type='running']");
        if (runningActivityTypeElement) {
            const children = Array.from(elem.children)
            if (children.some(child => child.getAttribute('data-which') === 'directStepSpeedLoss')) {
                console.log("step speed loss chart exists, nothing to do")
            } else {
                console.log("step speed loss chart doesn't exist")
            }

            const newNode = elem.lastElementChild.cloneNode();
            newNode.setAttribute('data-which', 'directStepSpeedLoss');
            newNode.setAttribute('style', 'display:none'); //not strictly necessary but doesn't hurt
            elem.appendChild(newNode);
            console.log("successfully added invisible entry for step speed loss chart. chart order should be savable now")
        }
    }
})();