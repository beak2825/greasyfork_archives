// ==UserScript==
// @name         Garmin Connect: sort calendar workout list 
// @namespace    http://tampermonkey.net/
// @description  Sorts the workout list in the Garmin Connect calendar in alphabetical order
// @author       flowstate
// @match        https://connect.garmin.com/modern/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=garmin.com
// @grant        window.onurlchange
// @license      MIT
// @version      0.5.3
// @downloadURL https://update.greasyfork.org/scripts/542471/Garmin%20Connect%3A%20sort%20calendar%20workout%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/542471/Garmin%20Connect%3A%20sort%20calendar%20workout%20list.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlPrefix = 'https://connect.garmin.com/modern/calendar/';
    const urlToMatch = 'https://connect.garmin.com/modern/calendar';
    let currentPageMatchesUrl = false;

    function sortList(ul) {
        if (ul.getAttribute('data-sorted') === '1') {
            return;
        }
        ul.setAttribute('data-sorted', '1');

        const new_ul = ul.cloneNode(false);
        const lis = [];
        for (let i = ul.childNodes.length; i--;) {
            if (ul.childNodes[i].nodeName === 'LI') {
                lis.push(ul.childNodes[i]);
            }
        }

        lis.sort(function (a, b) {
            const aText = a.childNodes[0].title;
            const bText = b.childNodes[0].title;

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

    function onWorkoutList(elem) {
        sortList(document.querySelector(dropdown))
    }

    const dropdown = ".calendar-add-workout-list .sidebar-list";
    const sidebarItem = ".calendar-add-workout-list .sidebar-item";
    const closeButton = ".calendar-add-workout button.close"

    // we have to poll for the workout list and never stop because all
    // the other elements of the page are dynamically destroyed and created
    // as well. (e.g. it's not really feasible to try to tell when the calendar 
    // cells are clicked, because you'd have to be constantly
    // polling for them as well; they're destroyed and recreated
    // as you navigate the calendar.)
    //
    // this has the advantage of being an extremely simple solution.

    // let foundElement = false
    function pollForElement(readySelector, callback) {
        let timer = undefined;

        const tryNow = function () {
            const elem = document.querySelector(readySelector);
            if (elem) {
                // if (!foundElement) {
                    callback(elem);
                // }
                // foundElement = true
            } else {
                // foundElement = false
            }
            timer = setTimeout(tryNow, 300);
        };

        const stop = function () {
            clearTimeout(timer)
            timer = undefined
        }

        tryNow();
        return {
            stop
        }
    }

    let tasks = [];
    function init() {
        tasks.push(pollForElement(sidebarItem, onWorkoutList))
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
        const href = window.location.href
        const urlMatches = href.startsWith(urlPrefix) || href === urlToMatch;
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