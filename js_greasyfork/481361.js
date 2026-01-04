// ==UserScript==
// @name         WorkOrder Info Change
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Trigger script based on URL hash change
// @author       YourName3
// @match        https://app.shopvox.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481361/WorkOrder%20Info%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/481361/WorkOrder%20Info%20Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processUrlHash() {
        var hash = window.location.hash;
        var guidPattern = /pos\/(work_orders|quotes)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
        var match = guidPattern.exec(hash);

        if (match) {
            var type = match[1]; // "work_orders" or "quotes"
            var guid = match[2];
            console.log("Type: " + type + ", GUID: " + guid);
            sendDataToAzure(type, guid);
        }
    }

    function sendDataToAzure(type, guid) {
        var azureUrl = "https://prod-25.australiasoutheast.logic.azure.com:443/workflows/272d34bf3ffa4e2a8dfb79c872771823/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4XHesCUHZdmpOiXVb9Zcv16-8tdGqMSz3oBV8bzVHpc";
        
        GM_xmlhttpRequest({
            method: "POST",
            url: azureUrl,
            data: JSON.stringify({ type: type, guid: guid }),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                console.log("Response from Azure: " + response.responseText);
                displayAzureResponse(response.responseText);
            },
            onerror: function(error) {
                console.error("Error sending data to Azure: ", error.responseText);
            }
        });
    }
  function displayAzureResponse(jsonData) {
        try {
            var data = JSON.parse(jsonData);
            var customerData = data.customerData; // Extracting customerData from the response

            var responseDiv = document.createElement('div');
            responseDiv.className = 'row';
            responseDiv.innerHTML = '<div class="col-sm-12 detail">' +
                                    '<div class="title ng-binding">Additional Customer Data</div>' +
                                    '<div class="ng-scope simple-format">' + customerData + '</div>' +
                                    '</div>';

            var insertLocation = document.querySelector('.details.ng-scope');
            if (insertLocation) {
                var wrapperDiv = document.createElement('div');
                wrapperDiv.className = 'wrapper';
                wrapperDiv.appendChild(responseDiv);

                insertLocation.appendChild(wrapperDiv);
            } else {
                console.error('Could not find the insertion point for the customer data.');
            }
        } catch (e) {
            console.error('Error parsing JSON response: ', e);
        }
    }

 window.addEventListener('hashchange', processUrlHash, false);
    processUrlHash();
})();
