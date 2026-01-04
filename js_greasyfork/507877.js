// ==UserScript==
// @name         Torn Mugging Script
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Tracks changes in user bazaar and status with the API, and notifies you for mugging.
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      api.torn.com
// @license      GPU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/507877/Torn%20Mugging%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/507877/Torn%20Mugging%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = localStorage.getItem('API_KEY');
    let userId = localStorage.getItem('lastUserId') || '';
    let isMinimized = localStorage.getItem('isMinimized') === 'true';
    let notificationActive = false;
    const enableTestButton = false; //                                                   The Test Button is Here!
    if (!apiKey) {
        apiKey = prompt('Please enter your Torn API key:');
        if (apiKey) {
            localStorage.setItem('API_KEY', apiKey);
        }
    }
    let previousBazaarItems = 0;
    let previousBazaarValue = 0;
    let trackerBox = document.createElement('div');
    trackerBox.id = 'trackerBox';
    trackerBox.style.position = 'fixed';
    trackerBox.style.top = '10px';
    trackerBox.style.left = '10px';
    trackerBox.style.width = '230px';
    trackerBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    trackerBox.style.color = 'white';
    trackerBox.style.padding = '15px';
    trackerBox.style.zIndex = '99999';
    trackerBox.style.border = '2px solid white';
    trackerBox.style.fontFamily = 'Arial, sans-serif';
    trackerBox.style.fontSize = '12px';
    trackerBox.style.lineHeight = '1.4';
    trackerBox.style.boxSizing = 'border-box';
    trackerBox.innerHTML = `
        <div id="header" style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin-bottom: 15px; color: #4CAF50;">Mugging Script</h3>
            <button id="minimizeButton" style="background-color: #4CAF50; color: white; border: none; cursor: pointer; padding: 5px 10px; border-radius: 3px;">${isMinimized ? '+' : '-'}</button>
        </div>
        <div id="content" ${isMinimized ? 'style="display:none;"' : ''}>
            <input type="text" id="userIdInput" maxlength="9" placeholder="Enter User ID" value="${userId}" style="width: 100%; max-width: 140px; padding: 8px; margin-bottom: 15px; border: none; border-radius: 3px;">
            <button id="fetchButton" style="width: 100%; padding: 10px; background-color: #4CAF50; color: white; font-weight: bold; border: none; cursor: pointer; border-radius: 3px; margin-bottom: 15px;">Fetch Data</button>
            <div id="outputBox" style="margin-top: 15px; max-height: 500px; overflow-y: auto; color: #FFFFFF;"></div>
            <button id="attackButton" style="width: 100%; padding: 10px; background-color: #FF0000; color: white; font-weight: bold; border: none; cursor: not-allowed; border-radius: 3px; margin-top: 15px;" disabled>Attack (Unavailable)</button>
            ${enableTestButton ? '<button id="testButton" style="width: 100%; padding: 10px; background-color: #FF8800; color: white; font-weight: bold; border: none; cursor: pointer; border-radius: 3px; margin-top: 15px;">Test Notification</button>' : ''}
        </div>
    `;
    document.body.appendChild(trackerBox);
    document.getElementById('minimizeButton').addEventListener('click', function() {
        const contentDiv = document.getElementById('content');
        if (isMinimized) {
            contentDiv.style.display = 'block';
            this.innerText = '-';
            localStorage.setItem('isMinimized', 'false');
        } else {
            contentDiv.style.display = 'none';
            this.innerText = '+';
            localStorage.setItem('isMinimized', 'true');
        }
        isMinimized = !isMinimized;
    });
    document.getElementById('fetchButton').addEventListener('click', function() {
        userId = document.getElementById('userIdInput').value;
        if (userId) {
            localStorage.setItem('lastUserId', userId);
            fetchData(userId);
        } else {
            document.getElementById('outputBox').innerHTML = '<p style="color: red;">Please enter a valid User ID.</p>';
        }
    });
    function fetchData(userId) {
        const bazaarUrl = `https://api.torn.com/user/${userId}?selections=bazaar&key=${apiKey}`;
        const statusUrl = `https://api.torn.com/user/${userId}?selections=basic&key=${apiKey}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: bazaarUrl,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                let output = `<br><h4 style="color: #FFD700; text-align: left; margin-bottom: 15px;">Bazaar Data for User ID ${userId}</h4>`;
                if (data && data.bazaar) {
                    if (data.bazaar.length > 0) {
                        let totalItems = 0;
                        let totalValue = 0;
                        data.bazaar.forEach(item => {
                            totalItems += item.quantity;
                            totalValue += item.quantity * item.price;
                        });
                        previousBazaarItems = totalItems;
                        previousBazaarValue = totalValue;
                        output += `
                            <p style="margin: 5px 0 10px;"><strong>Total Bazaar Items:</strong> ${totalItems}</p>
                            <p style="margin: 5px 0 10px;"><strong>Total Bazaar Value:</strong> $${totalValue.toLocaleString()}</p>
                        `;
                    } else {
                        output += `<p>The bazaar is empty.</p>`;
                    }
                } else {
                    output += `<p>No items in the bazaar or an error occurred.</p>`;
                }
                output += `<br>`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: statusUrl,
                    onload: function(response) {
                        const data = JSON.parse(response.responseText);
                        let attackButtonEnabled = false;
                        if (data && data.status) {
                            let statusColor = '';
                            if (data.status.state === 'Okay') {
                                statusColor = 'green';
                                attackButtonEnabled = true;
                            } else if (data.status.state === 'Hospital') {
                                statusColor = 'red';
                            } else if (data.status.state === 'Traveling') {
                                statusColor = 'blue';
                            }
                            output += `<h4 style="text-align: left; color: #FFD700; margin-bottom: 10px;">Status Information</h4>`;
                            output += `<p style="color:${statusColor}; margin: 5px 0 10px;"><strong>Status:</strong> ${data.status.description}</p>`;
                        } else {
                            output += `<p>No status information found or an error occurred.</p>`;
                        }
                        document.getElementById('outputBox').innerHTML = output;
                        const attackButton = document.getElementById('attackButton');
                        if (attackButton) {
                            attackButton.replaceWith(attackButton.cloneNode(true));
                            const newAttackButton = document.getElementById('attackButton');
                            if (attackButtonEnabled) {
                                newAttackButton.innerText = 'Attack';
                                newAttackButton.style.backgroundColor = 'green';
                                newAttackButton.style.cursor = 'pointer';
                                newAttackButton.disabled = false;
                                newAttackButton.addEventListener('click', function() {
                                    if (!notificationActive) {
                                        notificationActive = true;
                                        sendPopupNotification('Bazaar Changed', 'Bazaar value or items decreased. Click OK to attack!', userId);
                                    }
                                });
                            } else {
                                newAttackButton.innerText = 'Attack (Unavailable)';
                                newAttackButton.style.backgroundColor = 'red';
                                newAttackButton.style.cursor = 'not-allowed';
                                newAttackButton.disabled = true;
                            }
                        }
                    }
                });
            }
        });
    }
    function sendPopupNotification(title, message, userId) {
        alert(`${title}\n\n${message}`);
        window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`, '_blank');
        notificationActive = false;
    }
    if (enableTestButton) {
        document.getElementById('testButton').addEventListener('click', function() {
            sendPopupNotification('Test Notification', 'This is a test. Click to attack!', userId);
        });
    }
    function startLiveUpdates() {
        setInterval(() => {
            if (userId) {
                fetchData(userId);
            }
        }, 3000);
    }
    if (userId) {
        fetchData(userId);
    }
    startLiveUpdates();
})();
