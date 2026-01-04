// ==UserScript==
// @name         Website Save Point
// @namespace    http://tampermonkey.net/
// @version      1
// @author       longkidkoolstar
// @icon         https://cdn2.iconfinder.com/data/icons/web-design-development-ui-vol-4/96/166-512.png
// @license      MIT
// @description  Saves and loads website Point in time. Kind of like that one Rick and Morty episode but more nerdy.
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/471160/Website%20Save%20Point.user.js
// @updateURL https://update.greasyfork.org/scripts/471160/Website%20Save%20Point.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Register the "Save" menu command
    GM_registerMenuCommand("Save Data", function() {
        // Get the current website URL
        var url = window.location.href;
        // Get the current website data
        var data = {
            html: JSON.stringify(document.getElementsByTagName("html")[0].innerHTML),
            localStorage: JSON.stringify(localStorage),
            sessionStorage: JSON.stringify(sessionStorage)
        };

        // Save the data to the Tampermonkey storage
        GM_setValue(url, JSON.stringify(data));

        // Alert the user that the data has been saved
        alert("Data saved for " + url);
    });

    // Register the "Load" menu command
    GM_registerMenuCommand("Load Data", function() {
        // Get the current website URL
        var url = window.location.href;

        // Get the saved data from the Tampermonkey storage
        var savedData = JSON.parse(GM_getValue(url, null));

        // If there is saved data, replace the current page content and storage data with it
        if (savedData) {
            var newData = JSON.parse(savedData.html);
            document.getElementsByTagName("html")[0].innerHTML = newData;

            // Restore local storage data
            var newLocalStorageData = JSON.parse(savedData.localStorage);
            for (var key in newLocalStorageData) {
                localStorage.setItem(key, newLocalStorageData[key]);
            }

            // Restore session storage data
            var newSessionStorageData = JSON.parse(savedData.sessionStorage);
            for (var key in newSessionStorageData) {
                sessionStorage.setItem(key, newSessionStorageData[key]);
            }

            // Alert the user that the data has been loaded
            alert("Data loaded for " + url);
        } else {
            // Alert the user that there is no saved data for this website
            alert("No saved data for " + url);
        }
    });
})();