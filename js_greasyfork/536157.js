// ==UserScript==
// @name         Routing Data to Chime
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Send routing data to Chime
// @author       You
// @match        https://outboundflow-dub.amazon.com/KTW1/cora*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536157/Routing%20Data%20to%20Chime.user.js
// @updateURL https://update.greasyfork.org/scripts/536157/Routing%20Data%20to%20Chime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
.routing-menu {
    background: #232f3e;
    border: 1px solid #37475a;
    border-radius: 4px;
    padding: 10px;
    position: fixed;
    top: 10px;
    right: 10px;
    width: 250px;
    z-index: 10000;
    font-family: 'Amazon Ember', Arial, sans-serif;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
}

.routing-menu.collapsed {
    width: auto;
    padding: 5px 30px 5px 10px;
}

.routing-menu h3 {
    color: #ffffff;
    margin: 0 0 10px 0;
    font-size: 14px;
    text-align: center;
    padding-bottom: 5px;
    border-bottom: 1px solid #37475a;
}

.routing-menu.collapsed h3 {
    margin: 0;
    padding: 0;
    border: none;
}

.routing-menu label {
    color: #ffffff;
    font-size: 12px;
    display: block;
    margin: 5px 0;
}

.routing-menu input {
    width: 100%;
    padding: 4px;
    margin: 2px 0 8px;
    border: 1px solid #37475a;
    border-radius: 3px;
    background: #ffffff;
    font-size: 12px;
}

.routing-menu button {
    padding: 6px;
    margin: 3px 0;
    background: #ff9900;
    border: none;
    border-radius: 3px;
    color: #000000;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
}

.routing-menu button:hover {
    background: #ffa41c;
}

.toggle-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    width: 20px;
    height: 20px;
    padding: 0;
    font-size: 16px;
    line-height: 1;
}

.collapsed-info {
    display: none;
    color: #ffffff;
    font-size: 11px;
    margin-top: 5px;
}

.routing-menu.collapsed .collapsed-info {
    display: block;
}

.routing-menu.collapsed .menu-content {
    display: none;
}

.tooltip {
font-size: xx-small;
color: white;
display: contents;
text-transform: full-size-kana;

}
`;

    // Create the menu HTML
    const menu = document.createElement('div');
    menu.className = 'config-menu';
    menu.innerHTML = `
<div class="routing-menu">
    <button class="toggle-button">−</button>
    <h3>Routing Chime Notification</h3>
    <div class="collapsed-info">
        Webhook: <span id="webhookDisplay">Not set</span><br>
        Current Threshold:<br>
        Routing: <span id="routingDisplay">Not set</span><br>
        Total Routing: <span id="totalRoutingDisplay">Not set</span><br>
        Transit: <span id="transitDisplay">Not set</span><br>
        Total Transit: <span id="totalTransitDisplay">Not set</span><br>

    </div>
    <div class="menu-content">
        <label>Webhook URL:</label>
        <input type="text" id="webhookUrl" placeholder="Enter Chime webhook URL">

        <hr>

        <label>Routing Threshold:<br> <span class="tooltip">(min. for one route to send msg)</span></label>
        <input type="number" id="routingThreshold" placeholder="Enter threshold value">

        <label>Total Routing Threshold:<br> <span class="tooltip">(min. for all totes in routing to send msg)</span></label>
        <input type="number" id="totalRoutingThreshold" placeholder="Enter total threshold value">

<hr>

        <label>Transit Threshold:<br> <span class="tooltip">(min. for one route to send msg)</span></label>
        <input type="number" id="transitThreshold" placeholder="Enter threshold value">

        <label>Total Transit Threshold:<br> <span class="tooltip">(min. for all totes in transit to send msg)</span></label>
        <input type="number" id="totalTransitThreshold" placeholder="Enter total threshold value">

        <button id="saveSettings">Save Settings</button>
        <button id="checkNow">Check Now</button>
    </div>
</div>
`;

    // Add this to your existing JavaScript code
    function initializeMenu() {
        const menu = document.querySelector('.routing-menu');
        const toggleButton = document.querySelector('.toggle-button');

        if(GM_getValue('webhookUrl') != null)
        {
            document.getElementById('webhookUrl').value = GM_getValue('webhookUrl');
        }

        if(GM_getValue('routingThreshold') != null)
        {
            document.getElementById('routingThreshold').value = GM_getValue('routingThreshold');
        }
        if(GM_getValue('totalRoutingThreshold') != null)
        {
            document.getElementById('totalRoutingThreshold').value = GM_getValue('totalRoutingThreshold');
        }

        if(GM_getValue('transitThreshold') != null)
        {
            document.getElementById('transitThreshold').value = GM_getValue('transitThreshold');
        }
        if(GM_getValue('totalTransitThreshold') != null)
        {
            document.getElementById('totalTransitThreshold').value = GM_getValue('totalTransitThreshold');
        }

        toggleButton.addEventListener('click', () => {
            menu.classList.toggle('collapsed');
            toggleButton.textContent = menu.classList.contains('collapsed') ? '+' : '−';
        });
    }

    // Add the styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Update display values function
    function updateDisplayValues() {
        document.getElementById('webhookDisplay').textContent = GM_getValue('webhookUrl', 'Not set').substring(0, 20) + '...';
        document.getElementById('routingDisplay').textContent = GM_getValue('routingThreshold', 'Not set');
        document.getElementById('totalRoutingDisplay').textContent = GM_getValue('totalRoutingThreshold', 'Not set');
        document.getElementById('transitDisplay').textContent = GM_getValue('transitThreshold', 'Not set');
        document.getElementById('totalTransitDisplay').textContent = GM_getValue('totalTransitThreshold', 'Not set');
    }


    // Rest of your existing code remains the same
    document.body.appendChild(menu);

    // Save configuration
    document.getElementById('saveSettings').addEventListener('click', () => {
        GM_setValue('webhookUrl', document.getElementById('webhookUrl').value);
        GM_setValue('routingThreshold', parseInt(document.getElementById('routingThreshold').value) || 0);
        GM_setValue('totalRoutingThreshold', parseInt(document.getElementById('totalRoutingThreshold').value) || 0);
        GM_setValue('transitThreshold', parseInt(document.getElementById('transitThreshold').value) || 0);
        GM_setValue('totalTransitThreshold', parseInt(document.getElementById('totalTransitThreshold').value) || 0);

        updateDisplayValues();
        alert('Configuration saved!');
    });

    initializeMenu();
    updateDisplayValues();


    // Function to collect and send data
    function collectAndSendData() {
        const data = [];
        const rows = document.querySelectorAll('.tabulator-row');
        const routingThreshold = GM_getValue('routingThreshold', 0);
        const transitThreshold = GM_getValue('transitThreshold', 0);
        const totalRoutingThreshold = GM_getValue('totalRoutingThreshold', 0);
        const totalTransitThreshold = GM_getValue('totalTransitThreshold', 0);
        const webhookUrl = GM_getValue('webhookUrl', '');

        if (!webhookUrl) {
            console.log('Webhook URL not configured');
            return false;
        }

        let totalRouting = 0;
        let totalTransit = 0;
        const routingAlerts = [];
        const transitAlerts = [];

        rows.forEach(row => {
            const ppNameCell = row.querySelector('.tabulator-cell[tabulator-field="ppName"]');
            const routingCell = row.querySelector('.tabulator-cell[tabulator-field="PickingPickedRouting"] a');
            const transitCell = row.querySelector('.tabulator-cell[tabulator-field="PickingPickedInTransit"] a');

            if (!ppNameCell) return;

            const ppName = ppNameCell.textContent;
            const routing = parseInt(routingCell?.textContent || '0');
            const transit = parseInt(transitCell?.textContent || '0');

            totalRouting += routing;
            totalTransit += transit;

            if (routing >= routingThreshold) {
                routingAlerts.push({
                    ppName: ppName,
                    routing: routing,
                    transit: transit
                });
            }
            if (transit >= transitThreshold) {
                transitAlerts.push({
                    ppName: ppName,
                    routing: routing,
                    transit: transit
                });
            }
        });

        let messageText = "/md @present\n\n";

        // Individual Routing Alerts
        if (routingAlerts.length > 0) {
            messageText += "**🚨 Routing Threshold Alert**\n\n" +
                "| Process Path | Routing | InTransit |\n" +
                "|--------------|---------|-----------|" +
                "\n" + routingAlerts.map(item =>
                                         `| ${item.ppName} | ${item.routing} | ${item.transit} |`
                                        ).join('\n') + "\n\n";
        }

        // Individual Transit Alerts
        if (transitAlerts.length > 0) {
            messageText += "**🚨 InTransit Threshold Alert**\n\n" +
                "| Process Path | Routing | InTransit |\n" +
                "|--------------|---------|-----------|" +
                "\n" + transitAlerts.map(item =>
                                         `| ${item.ppName} | ${item.routing} | ${item.transit} |`
                                        ).join('\n') + "\n\n";
        }

        // Total Thresholds Alert
        if (totalRouting >= totalRoutingThreshold || totalTransit >= totalTransitThreshold) {
            messageText += "**📊 Total Volumes Alert**\n\n" +
                "| Category | Current Value | Threshold |\n" +
                "|----------|---------------|-----------|" +
                `\n| Total Routing | ${totalRouting} | ${totalRoutingThreshold} |` +
                `\n| Total Transit | ${totalTransit} | ${totalTransitThreshold} |` +
                "\n\n\n";
        }

        if (messageText === "") {
            console.log('No thresholds exceeded');
            return false;
        }

        // Send the combined message
        GM_xmlhttpRequest({
            method: 'POST',
            url: webhookUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ Content: messageText }),
            onload: function(response) {
                console.log('Response:', response);
            },
            onerror: function(error) {
                console.error('Error details:', error);
            }
        });

        return true;
    }

    function isDataLoaded() {
        const tabulatorTable = document.querySelector('.tabulator-table');
        if (!tabulatorTable) return false;

        const rows = tabulatorTable.querySelectorAll('.tabulator-row');
        return rows.length > 0;
    }

    function waitForData() {
        return new Promise(resolve => {
            let attempts = 0;
            const maxAttempts = 30; // Maximum 30 seconds of waiting

            const checkInterval = setInterval(() => {
                attempts++;

                try {
                    if (isDataLoaded()) {
                        clearInterval(checkInterval);
                        console.log('Data loaded successfully');
                        resolve(true);
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        console.log('Timeout waiting for data');
                        resolve(false);
                    }
                } catch (error) {
                    console.error('Error checking data:', error);
                    clearInterval(checkInterval);
                    resolve(false);
                }
            }, 1000);
        });
    }

    async function startAutoCheck() {
        console.log('Starting auto check...');

        setTimeout(collectAndSendData, 15000);
    }

    // Start the automatic checking when the script loads
    startAutoCheck();

    // Add send data button listener
    document.getElementById('checkNow').addEventListener('click', () => {
        if (collectAndSendData()) {
            alert('Data sent successfully!');
        } else {
            alert('No data to send or webhook not configured!');
        }
    });

})();