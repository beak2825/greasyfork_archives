// ==UserScript==
// @name         OceanHero Requester
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  Send repeated requests to OceanHero in a controlled way.
// @author       Taeyang
// @match        https://oceanhero.today/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524388/OceanHero%20Requester.user.js
// @updateURL https://update.greasyfork.org/scripts/524388/OceanHero%20Requester.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Settings
    const targetUrl = "https://oceanhero.today/web?q=test"; // URL to send requests
    const requestInterval = 1000; // Time between requests in milliseconds (e.g., 1000ms = 1 second)
    const maxThreads = 5; // Number of concurrent requests (equivalent to Python threads)

    // Counter for the number of requests sent
    let totalRequests = 0;

    // Function to perform the fetch request
    async function sendRequest(threadName) {
        try {
            const response = await fetch(targetUrl, {
                method: "GET",
                credentials: "include", // Include cookies automatically if logged in
            });

            if (response.ok) {
                totalRequests++;
                console.log(`<${threadName}> Request #${totalRequests}: Success`);
            } else {
                console.warn(`<${threadName}> Request failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error(`<${threadName}> Error: ${error}`);
        }
    }

    // Function to start threads (concurrent requests)
    function startThreads() {
        for (let i = 1; i <= maxThreads; i++) {
            const threadName = `Thread${i}`;
            setInterval(() => sendRequest(threadName), requestInterval); // Repeat requests in each thread
        }
    }

    // Start the script
    console.log("Starting OceanHero Requester script...");
    startThreads();
})();