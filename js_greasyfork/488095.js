// ==UserScript==
// @name         Available GPU Nodes Display
// @namespace    http://tampermonkey.net/
// @version      2024-02-25
// @description  Display nodes with available GPUs
// @author       LTGuo
// @match        http://172.18.127.68:8888/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=127.68
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488095/Available%20GPU%20Nodes%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/488095/Available%20GPU%20Nodes%20Display.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let gpuAvailability = {}; // Store nodes with available GPUs
    let queryCount = 0; // Counter for completed queries
    const startID = 21;
    const totalQueries = 30; // Total number of queries to be made

    // Define a queue to hold node names for querying
    let queryQueue = [];

    // Function to process the query queue
    function processQueue() {
        if (queryQueue.length === 0) {
            // Optionally, display available nodes when the queue is empty
            displayAvailableNodes();
            return; // Exit if the queue is empty
        }

        const nodeName = queryQueue.shift(); // Get the first node name from the queue
        queryNode(nodeName, () => {
            // Callback function to process the next item in the queue
            setTimeout(processQueue, 500); // Introduce a 100ms delay before the next query
        });
    }

    function queryNode(nodeName, callback, retryCount = 0) {
        console.log("calling " + nodeName);
        const ws = new WebSocket('ws://172.18.127.66:8067/resource');
        const ipLast = parseInt(nodeName.replace('gpu', '')) - 21 + 101;

        ws.onopen = function() {
            const data = {
                "type": 1,
                "nodeName": nodeName,
                "nodeAddress": "172.18.127." + ipLast,
                "occupiedList": []
            };
            ws.send(JSON.stringify(data));
        };

        ws.onmessage = function(event) {
            const response = JSON.parse(event.data);
            updateGpuAvailability(nodeName, response);
            ws.close(); // Close the WebSocket connection
            callback(); // Call the callback function to process the next item in the queue
        };

        ws.onerror = function(error) {
            console.error('WebSocket Error for ' + nodeName + ': ', error);
            ws.close(); // Close the WebSocket connection even in case of an error
            if (retryCount < 2) {
                console.log(`Retrying ${nodeName} in 0.5 seconds...`);
                setTimeout(() => {
                    queryNode(nodeName, callback, retryCount + 1);
                }, 500);
            } else {
                callback();
            }
        };
    }


    // Adjust queryAllNodes to populate the queue instead of direct querying
    function queryAllNodes() {
        gpuAvailability = {}; // Reset availability status
        queryCount = 0; // Reset query count
        queryQueue = []; // Reset and populate the queue

        for (let i = startID; i < startID + totalQueries; i++) {
            queryQueue.push('gpu' + i);
        }

        processQueue(); // Start processing the queue
    }


    function updateGpuAvailability(nodeName, response) {
        if (response.occupied.includes('0')) { // Check if any GPU is available
            gpuAvailability[nodeName] = true; // Mark node as having available GPUs
        }

        queryCount++; // Increment counter after processing each query
        if (queryCount === totalQueries) { // Check if all queries are completed
            displayAvailableNodes(); // Call display function only after all queries are completed
        }
    }

    function displayAvailableNodes() {
        console.log("Available Nodes: ")
        console.log(gpuAvailability)
        const existingMessage = document.getElementById('gpuAvailabilityMessage');
        if (existingMessage) {
            existingMessage.remove(); // Remove the existing message before adding a new one
        }

        const availableNodes = Object.keys(gpuAvailability);
        const message = document.createElement('div');
        message.id = 'gpuAvailabilityMessage'; // Assign an ID to the message element for easy removal
        message.style.position = 'fixed';
        message.style.top = '10px';
        message.style.left = '10px';
        message.style.padding = '10px';
        message.style.backgroundColor = 'yellow';
        message.style.color = 'black';
        message.style.zIndex = '1000';
        message.style.border = '2px solid black';
        message.style.fontSize = '16px';

        if (availableNodes.length > 0) {
            message.textContent = 'Available GPU Nodes: ' + availableNodes.join(', ');
        } else {
            message.textContent = 'No available GPUs found.';
        }

        document.body.appendChild(message);
    }

    setInterval(queryAllNodes, 30000); // Re-query every 30 seconds
    queryAllNodes(); // Initial query
})();
