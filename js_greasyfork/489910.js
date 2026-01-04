// ==UserScript==
// @name         FightButtonLibrary
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  Library for fight button usage start
// @author       me
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @esversion    8
// ==/UserScript==

(function() {
    'use strict';
    let step={};
    let sfight="";


     
    // Function to prompt user for API key
    function promptForApiKey() {
        var apiKey = prompt("Please enter your API key:");
        if (apiKey !== null && apiKey !== "") {
            GM_setValue("apiKey", apiKey); // Save API key locally
            return apiKey;
        } else {
            alert("API key cannot be empty!");
            return null;
        }
    }

    // Function to start the process
    function startProcess() {
        // Check if API key is already saved
        var savedApiKey = GM_getValue("apiKey");

        if (!savedApiKey) {
            savedApiKey = promptForApiKey();
        }

        if (savedApiKey) {
            // Extract user ID from URL
            var url = window.location.href;
            var userIdMatch = url.match(/user2ID=(\d+)/);
            var userId = userIdMatch ? userIdMatch[1] : null;

            if (userId) {
                // Define the URL
                var apiUrl = "https://api-torn-members.glitch.me/update/";

                // Define the query parameters
                var query = {
                    "item": "startFight",
                    "key": savedApiKey,
                    "opponent": userId,
                };

                // Construct the full URL with query parameters
                var fullUrl = apiUrl + "?item=" + query.item + "&key=" + query.key +"&opponent=" + query.opponent;

                // Send the request
                GM_xmlhttpRequest({
                    method: "GET",
                    url: fullUrl,
                    onload: function(response) {
                        handleResponse(response.responseText); // Handle the response
                        

                    },
                    onerror: function(error) {
                        console.error("Request failed:", error);
                    }
                });
            } else {
                console.error("User ID not found in URL.");
            }
        }
    }

    // Function to handle the response
    function handleResponse(responseText) {
        step=JSON.parse(responseText);
        sfight=step.warlink;
        //alert(sfight)
    }
    //create and style the button
    const coverDiv = createDiv('tornCoverDiv', 'fixed', '25%', '51%', '280px', '140px');
    const infoDiv = createDiv('tornInfoDiv', 'fixed', '25%', '86%', '170px', '420px');
    // Create and style button element
    const newButton = createButton('tornNewButton', 'fixed', coverDiv.style.top, coverDiv.style.left);
    //create the divs
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
        div.style.display = 'none';
        document.body.insertBefore(div, document.body.firstChild);
        return div;
    }
     // create the button
    function createButton(id, position, top, left) {
        const button = document.createElement('button');
        button.id = id;
        button.classList = 'torn-btn';
        button.style.position = position;
        button.style.top = top;
        button.style.left = left;
        button.style.transform = 'translate(75px,120px)';
        button.style.width = '170px';
        button.style.color = 'white';
        button.style.zIndex = '9999';
        button.style.display = 'none';
        button.textContent = 'WAIT for Counter';
        button.disabled = true;
        document.body.insertBefore(button, document.body.firstChild);
        return button;
    }
    
    
        
    


            


    // Expose the startProcess function to be called externally
    window.updateItemLibrary = {
        startProcess: startProcess
    };
    window.getSFight = function() {
        return sfight;
    };

})();
