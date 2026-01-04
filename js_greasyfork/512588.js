// ==UserScript==
// @name         Torn Combat Logger
// @namespace    http://torn.com/
// @version      3.7
// @description  Logger to track attacks 
// @author       Quanna_Parker
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512588/Torn%20Combat%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/512588/Torn%20Combat%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Torn API key
    const apiKey = "ADD_API_KEY"; 
// Replace with your actual API key

    // Combat logs storage
    let combatLogs = JSON.parse(localStorage.getItem("combatLogs")) || [];

    // Function to log API requests
    async function fetchAttacks() {
        try {
            console.log('Fetching attack logs...');
            const response = await fetch(`https://api.torn.com/user/?selections=attacks&key=${apiKey}`);
            const data = await response.json();
            if (data.attacks) {
                console.log('Attack data fetched successfully:', data);
                processCombatLogs(data.attacks);
            } else {
                console.error('Error fetching attack data:', data);
            }
        } catch (error) {
            console.error('Failed to fetch attack logs:', error);
        }
    }

    // Process and store combat logs
    function processCombatLogs(attacks) {
        console.log('Processing combat logs...');
        Object.values(attacks).forEach(attack => {
            const logEntry = {
                time: new Date(attack.timestamp_started * 1000).toLocaleString(),
                attacker: attack.attacker_name || 'Unknown',
                damage: attack.damage || 'N/A',
                result: attack.result || 'N/A',
                attackType: attack.stance || 'N/A',
                yourHealthBefore: attack.attacker_before || 'N/A',
                yourHealthAfter: attack.attacker_after || 'N/A'
            };
            combatLogs.push(logEntry);
            console.log('Logged attack:', logEntry);
        });
        localStorage.setItem("combatLogs", JSON.stringify(combatLogs));
        console.log('Combat logs saved to localStorage');
    }

    // Function to display logs in a window
    function viewLogs() {
        let logWindow = document.createElement('div');
        logWindow.style.position = 'fixed';
        logWindow.style.top = '50px';
        logWindow.style.right = '50px';
        logWindow.style.width = '400px';
        logWindow.style.height = '400px';
        logWindow.style.backgroundColor = 'white';
        logWindow.style.border = '1px solid black';
        logWindow.style.zIndex = 1000;
        logWindow.style.overflowY = 'scroll';
        logWindow.style.padding = '10px';
        logWindow.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        logWindow.style.borderRadius = '10px';

        let closeButton = document.createElement('button');
        closeButton.innerHTML = 'Close';
        closeButton.style.float = 'right';
        closeButton.onclick = function() {
            document.body.removeChild(logWindow);
        };

        let logContent = document.createElement('div');
        logWindow.appendChild(closeButton);
        logWindow.appendChild(logContent);
        document.body.appendChild(logWindow);

        // Logs display
        let logsHTML = '<h3>Combat Logs</h3>';
        combatLogs.forEach(log => {
            logsHTML += `<p><strong>Time:</strong> ${log.time}<br/>
                         <strong>Attacker:</strong> ${log.attacker}<br/>
                         <strong>Damage:</strong> ${log.damage}<br/>
                         <strong>Result:</strong> ${log.result}<br/>
                         <strong>Attack Type:</strong> ${log.attackType}<br/>
                         <strong>Your Health (Before):</strong> ${log.yourHealthBefore}<br/>
                         <strong>Your Health (After):</strong> ${log.yourHealthAfter}</p><hr/>`;
        });
        logContent.innerHTML = logsHTML;
    }

    // Create a button element
    function createButton(text, className, onClickFunction) {
        const button = document.createElement('button');
        button.innerText = text;
        button.classList.add(className);
        button.addEventListener('click', onClickFunction);
        return button;
    }

    // Create div containers for buttons
    const combatLogBtn = createButton('Combat Logs', 'combat-logs-btn', viewLogs);
    const container = document.createElement('div');
    container.classList.add('combat-container');
    container.append(combatLogBtn);
    document.body.appendChild(container);

    // Basic CSS for button placement
    const style = document.createElement('style');
    style.innerHTML = `
        .combat-container {
            position: fixed;
            top: calc(30% + 50px);
            right: 0;
            z-index: 1000;
        }
        .combat-logs-btn {
            margin: 5px;
            padding: 3px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Fetch the attacks every minute
    window.addEventListener('load', function() {
        setInterval(fetchAttacks, 60000); // Poll every 60 seconds
    });

})();
