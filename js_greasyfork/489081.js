// ==UserScript==
// @name         clear
// @version      1.1
// @description  Clears local storage and indexedDB data
// @match        https://www.genschat.com/*
// @match       https://www.characterwaifu.com/*
// @grant        none
// @license MIT
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/489081/clear.user.js
// @updateURL https://update.greasyfork.org/scripts/489081/clear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Specify the name of the IndexedDB database you want to clear
    const databaseName = 'localforage';


 // Specify the time interval between clearing each object store, in milliseconds
       const loopDelay = 20;

    // Open the IndexedDB database
    const request = indexedDB.open(databaseName);

    // Event handler for successful database opening
    request.onsuccess = function(event) {
        const db = event.target.result;

        // Get a list of object store names in the database
        const objectStoreNames = Array.from(db.objectStoreNames);

        // Define a function to clear the next object store
        const clearNextObjectStore = function() {
            if (objectStoreNames.length > 0) {
                const objectStoreName = objectStoreNames.shift();
                const transaction = db.transaction(objectStoreName, 'readwrite');
                const objectStore = transaction.objectStore(objectStoreName);
                const clearRequest = objectStore.clear();

                clearRequest.onsuccess = function() {
                    console.log(`Cleared all data in object store: ${objectStoreName}`);
                    // Call the function again after a delay
                    setTimeout(clearNextObjectStore, loopDelay);
                };

                clearRequest.onerror = function(event) {
                    console.error(`An error occurred while clearing data in object store: ${objectStoreName}`, event.target.error);
                };
            } else {
                console.log('All data in the IndexedDB database has been cleared.');
            }
        };

        // Start the loop
        clearNextObjectStore();
    };

    // Event handler for database errors
    request.onerror = function(event) {
        console.error('An error occurred while opening the IndexedDB database:', event.target.error);
    };
    localStorage.clear();
})();