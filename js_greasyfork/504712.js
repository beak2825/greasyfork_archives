// ==UserScript==
// @name         Torn Chain Timer Alert and Quick Access
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Monitor chain timer and provide quick access to targets in Torn City. Alerts trigger only for chains of 10 hits or more.
// @author       MummaPhucka
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504712/Torn%20Chain%20Timer%20Alert%20and%20Quick%20Access.user.js
// @updateURL https://update.greasyfork.org/scripts/504712/Torn%20Chain%20Timer%20Alert%20and%20Quick%20Access.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Torn API Key
    const API_KEY = 'OHX3N6jQ93MqTSjn';

    // Target IDs
    const TARGET_IDS = ['200728', '67254', '112024', '583658', '3379302', '3296717', '2615305', '641971', '349224', '936857'];

    // Torn API Endpoints
   const CHAIN_ENDPOINT = `https://api.torn.com/faction/?selections=chain&key=${API_KEY}`;

    // Notification threshold in seconds (e.g., 300 seconds = 5 minutes)
    const ALERT_THRESHOLD = 90;

    // Minimum chain hits required to trigger alerts
    const MIN_CHAIN_HITS = 10;

    // Inject a custom HTML element
    function displayInPage(message) {
        const container = document.createElement('div');
        container.innerHTML = message;
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = '#f44336';
        container.style.color = '#ffffff';
        container.style.padding = '15px';
        container.style.borderRadius = '5px';
        container.style.zIndex = '10000';
        container.style.fontSize = '14px';  
        container.style.maxWidth = '300px';
        container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        
        document.body.appendChild(container);

        // Remove the notification after 10 seconds
        setTimeout(() => {
            container.remove();
        }, 10000); // 10 seconds
    }

    // Get Chain Data
    async function getChainData() {
        try {
            const response = await fetch(CHAIN_ENDPOINT);
            const data = await response.json();
            const chainHits = data.chain.current || 0;
            const chainTimer = data.chain.timeout || 0;
            return { chainHits, chainTimer };
        } catch (error) {
            console.error('Error fetching chain data:', error);
            return { chainHits: 0, chainTimer: 0 };
        }
    }

    // Generate Attack Links for Multiple Targets
    function generateAttackLinks() {
        return TARGET_IDS.map(id => `<a href="https://www.torn.com/profiles.php?XID=${id}" target="_blank" style="color: #ffffff;">Attack Target ${id}</a>`).join('<br>');
    }

    // Monitor Chain Timer
    async function monitorChain() {
        while (true) {
            const { chainHits, chainTimer } = await getChainData();

        if (chainHits >= MIN_CHAIN_HITS && chainTimer <= ALERT_THRESHOLD) {
                const attackLinks = generateAttackLinks();
                const message = `<strong>Chain of ${chainHits} hits is at ${chainTimer} seconds!</strong><br><br>${attackLinks}`;
                displayInPage(message);
            }

            await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute before checking again
        }
    }

    // Start monitoring when the script runs
    monitorChain();

})();