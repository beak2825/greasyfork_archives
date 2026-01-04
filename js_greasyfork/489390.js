// ==UserScript==
// @name         Torn Attack Timer
// @namespace    http://tampermonkey.net/
// @version      1.27
// @description  Attack timer for Torn with a new button
// @author       You
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489390/Torn%20Attack%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/489390/Torn%20Attack%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL includes "attackLog"
    if (window.location.href.includes("attackLog")) {
        return; // Exit the script if the URL includes "attackLog"
    }

    // Define the API key storage key
    const apiKeyStorageKey = 'tornApiKey';

    // Create and style div elements
    const coverDiv = createDiv('tornCoverDiv', 'fixed', '25%', '51%', '280px', '400px');
    const infoDiv = createDiv('tornInfoDiv', 'fixed', '12%', '0', '100%', null);

    // Create and style button element
    const newButton = createButton('tornNewButton', 'fixed', coverDiv.style.top, coverDiv.style.left);

    // Initialize script
    initializeScript();

    // Function to create and style a div element
    function createDiv(id, position, top, left, width, height) {
        const div = document.createElement('div');
        div.id = id;
        div.style.position = position;
        div.style.top = top;
        div.style.left = left;
        div.style.backgroundColor = 'black';
        div.style.color = 'white';
        div.style.padding = '10px';
        div.style.zIndex = '9998';
        div.style.width = width;
        div.style.height = height;
        div.style.textAlign = 'center';
        document.body.insertBefore(div, document.body.firstChild);
        return div;
    }

    // Function to create and style a button element
    function createButton(id, position, top, left) {
        const button = document.createElement('button');
        button.id = id;
        button.classList = 'torn-btn';
        button.style.position = position;
        button.style.top = top;
        button.style.left = left;
        button.style.transform = 'translate(80px,350px)';
        button.style.width = '170px';
        button.style.color = 'white';
        button.style.zIndex = '9999';
        button.textContent = 'WAIT for Counter';
        button.disabled = true;
        document.body.insertBefore(button, document.body.firstChild);
        return button;
    }

    // Function to initialize the script
    function initializeScript() {
        const userId = getUserIdFromUrl();
        if (!userId) {
            console.error('User ID not found in the URL.');
            return;
        }

        const apiKey = getApiKey();
        const apiEndpoint = `https://api.torn.com/user/${userId}?selections=basic,personalstats,profile&key=${apiKey}`;
        const apiEndpoint2 = `https://api.torn.com/user/?selections=basic,bars&key=${apiKey}`;

        fetchUser(apiEndpoint2);

        // Store dynamic data in the div for later use
        infoDiv.dataset.apiEndpoint = apiEndpoint;
    }

    // Function to fetch user data
    function fetchUser(apiEndpoint2) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiEndpoint2,
            onload: function(response) {
                const data2 = JSON.parse(response.responseText);
                if (data2.status.state === "Okay" && data2.energy.current>=25) {
                    newButton.addEventListener("click", async () => {
                        const url = window.location.href;
                        const x = url.indexOf("ID=");
                        const ID = url.substring(x + 3);
                        const step = `step=startFight&user2ID=${ID}`;
                        await fetch("/loader.php?sid=attackData&mode=json", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "x-requested-with": "XMLHttpRequest",
                            },
                            body: step,
                        });
                    });
                    fetchData(infoDiv.dataset.apiEndpoint, infoDiv, coverDiv);
                } else {
                    endAll();
                }
            }
        });
    }

    // Function to fetch data from the API
    function fetchData(apiEndpoint, infoDiv, coverDiv) {
        const maxRetries = 60;
        let retryCount = 0;

        function fetchWithRetry() {
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiEndpoint,
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    displayData(data, infoDiv, coverDiv);
                },
                onerror: function(error) {
                    console.error('API Request Failed', error);
                    if (retryCount < maxRetries) {
                        console.log('Retrying in 1 second...');
                        setTimeout(fetchWithRetry, 1000); // Retry after 1 second
                        retryCount++;
                    } else {
                        alert('API problem - cannot get data from API since 60 seconds - please refresh page');
                    }
                }
            });
        }

        // Start the initial fetch attempt
        fetchWithRetry();
    }

    // Function to display data in the div
    function displayData(data, infoDiv, coverDiv) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeDifference = calculateTimeDifference(currentTime, data.status.until);
        infoDiv.innerHTML = `<strong style="font-size: 20px;">Hosp-Out: ${timeDifference}</strong>`;
        coverDiv.innerHTML = `
            <div style="text-align: left; margin-bottom: 3%;">Name: ${data.name}</div>
            <div style="text-align: left; margin-bottom: 3%;">ID: ${data.player_id}</div>
            <div style="text-align: left; margin-bottom: 3%;">Level: ${data.level}</div>
            <div style="text-align: left; margin-bottom: 3%;">Age: ${data.age}</div>
            <div style="text-align: left;margin-bottom: 6%;">Status: ${data.status.state}</div>
            <div style="text-align: left; margin-bottom: 3%;">Attacks Won: ${data.personalstats.attackswon}</div>
            <div style="text-align: left; margin-bottom: 3%;">Time Played: ${data.personalstats.useractivity.toLocaleString('en-US')}</div>
            <div style="text-align: left; margin-bottom: 3%;">Best Damage: ${data.personalstats.bestdamage}</div>
            <div style="text-align: left; margin-bottom: 3%;">Highest Level Beaten: ${data.personalstats.highestbeaten}</div>
            <div style="text-align: left; margin-bottom: 3%;">Stat Enhancers Used: ${data.personalstats.statenhancersused}</div>
            <div style="text-align: left; margin-bottom: 3%;">Networth: ${data.personalstats.networth}</div>
            <div style="text-align: left; margin-bottom: 3%;">Xanax Used: ${data.personalstats.xantaken}</div>
            <div style="text-align: left; margin-bottom: 3%;">Energy Drink Used: ${data.personalstats.energydrinkused}</div>
            <div style="text-align: left; margin-bottom: 3%;">Energy Refills: ${data.personalstats.refills}</div>
        `;
        if (data.status.until <= currentTime) {
            newButton.disabled = false;
            newButton.textContent = 'ATTACK';
            newButton.style.color = 'red';
            newButton.style.zIndex = '100000';
        } else {
            setTimeout(() => fetchData(infoDiv.dataset.apiEndpoint, infoDiv, coverDiv), 1000);
        }
    }

    // Function to end the script
    function endAll() {
        coverDiv.style.display = 'none';
        infoDiv.style.display = 'none';
        newButton.style.display = 'none';
    }

    // Function to get the API key
    function getApiKey() {
        
        let apiKey = GM_getValue(apiKeyStorageKey);
        alert ("API key= "+apiKey)
        if (!apiKey) {
            apiKey = prompt('Enter your Torn API key:');
            GM_setValue(apiKeyStorageKey, apiKey);
        }
        return apiKey;
    }

    // Function to get the user ID from the URL
    function getUserIdFromUrl() {
        const userIdMatch = window.location.href.match(/user2ID=(\d+)/);
        return userIdMatch ? userIdMatch[1] : null;
    }

    // Function to calculate time difference between two timestamps in HH:mm:ss format
    function calculateTimeDifference(currentTime, targetTime) {
        const timeDifference = Math.max(targetTime - currentTime, 0); // Ensure non-negative value
        const hours = Math.floor(timeDifference / 3600);
        const minutes = Math.floor((timeDifference % 3600) / 60);
        const seconds = timeDifference % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
})();
