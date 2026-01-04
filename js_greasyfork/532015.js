// ==UserScript==
// @name         SpaceAlpha Farm Plant Script (Auto Click)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically sends a POST request to plant on SpaceAlpha's farm every 4 seconds.
// @author       tt
// @match        https://spacealpha.net/train-units
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532015/SpaceAlpha%20Farm%20Plant%20Script%20%28Auto%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532015/SpaceAlpha%20Farm%20Plant%20Script%20%28Auto%20Click%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to send the POST request
    function sendPlantRequest(authToken) {
        const url = "https://spacealpha.net/api/planet/farm/plant";

        fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
                "x-access-token": authToken,
                "Cookies": "psd=false",
                "Origin": "https://spacealpha.net",
                "Referer": "https://spacealpha.net/train-units",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "DNT": "1",
            },
            body: "{}"
        })
        .then(response => {
            if (!response.ok) {
                console.error("Error sending request:", response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Response data:", data);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
    }

    // Main logic to retrieve auth_token and trigger the request every 4 seconds
    const authToken = localStorage.getItem("auth_token");
    if (authToken) {
        console.log("Auth token found:", authToken);

        // Send the first request immediately
        sendPlantRequest(authToken);

        // Set up an interval to send the request every 4 seconds
        setInterval(() => {
            sendPlantRequest(authToken);
        }, 2234); // 2234 milliseconds = 2 seconds
    } else {
        console.error("No auth_token found in local storage.");
    }
})();