// ==UserScript==
// @name         Garmin Connect: sort activity course dropdown
// @namespace    http://tampermonkey.net/
// @description  Sorts Garmin connect activity course dropdown alphabetically
// @author       You
// @match        https://connect.garmin.com/modern/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        window.onurlchange
// @license      MIT
// @version      0.4
// @downloadURL https://update.greasyfork.org/scripts/542472/Garmin%20Connect%3A%20sort%20activity%20course%20dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/542472/Garmin%20Connect%3A%20sort%20activity%20course%20dropdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlPrefix = 'https://connect.garmin.com/modern/activity/'
    let currentPageMatchesUrl = false;

    function sortList(ul) {
        const new_ul = ul.cloneNode(false);
        const lis = [];
        for (let i = ul.childNodes.length; i--;) {
            if (ul.childNodes[i].nodeName === 'LI') {
                lis.push(ul.childNodes[i]);
            }
        }

        lis.sort(function (a, b) {
            // sort the "--" (no course) entry first
            if (a.getAttribute("data-value") === '-1') return -1;
            if (b.getAttribute("data-value") === '-1') return 1;

            const aText = a.childNodes[0].textContent;
            const bText = b.childNodes[0].textContent;

            // sorts case-insensitively and handles numbers correctly (e.g. "7" < "10")
            return aText.localeCompare(bText, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        });

        for (let i = 0; i < lis.length; i++) {
            new_ul.appendChild(lis[i]);
        }
        ul.parentNode.replaceChild(new_ul, ul);
    }

    const dropdownParent = '#course-dropdown + div.dropdown + div.dropdown';
    // don't know of way to be sure that the drop-down was fully populated,
    // so we sort on every click
    function installHandler(elem) {
        elem.addEventListener('click', function (e) {
            sortList(elem.querySelector('ul[role=menu]'));
        });
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

    let tasks = []    
    function init() {
        tasks = [];
        tasks.push(runWhenReady(dropdownParent, installHandler));
    }
    function deinit() {
        tasks.forEach(task => task.stop());
        tasks = [];
    }

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

    waitForUrl()
})();