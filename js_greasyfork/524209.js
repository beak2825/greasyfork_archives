// ==UserScript==
// @name         Quick Ticket Rebatcher
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a button to open the Quick Ticket Rebatcher tool
// @author       Rob Clayton
// @match        https://workplace.plus.net/reports/tickets/open_tickets_report.html?strLocation=SouthAfrica
// @grant        GM_openInTab
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524209/Quick%20Ticket%20Rebatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/524209/Quick%20Ticket%20Rebatcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load before adding the button
    window.addEventListener('load', function() {
        // Find the table element where the button should be placed above
        const table = document.querySelector('table');

        if (table) {
            // Create the new "Open Quick Ticket Rebatcher" button
            const newButton = document.createElement('button');
            newButton.textContent = 'Open Quick Ticket Rebatcher';

            // Apply the specified styling to the button
            newButton.style.appearance = 'auto';
            newButton.style.userSelect = 'none';
            newButton.style.alignItems = 'flex-start';
            newButton.style.textAlign = 'center';
            newButton.style.cursor = 'pointer';
            newButton.style.boxSizing = 'border-box';
            newButton.style.backgroundColor = 'buttonface';
            newButton.style.color = 'buttontext';
            newButton.style.whiteSpace = 'pre';
            newButton.style.padding = '10px 20px';
            newButton.style.borderWidth = '2px';
            newButton.style.borderStyle = 'outset';
            newButton.style.borderColor = 'buttonborder';

            // Create a div container for centering the button
            const buttonContainer = document.createElement('div');
            buttonContainer.style.textAlign = 'center';  // Center the button horizontally
            buttonContainer.style.marginBottom = '20px'; // Add some space below the button
            buttonContainer.appendChild(newButton);

            // When clicked, open the Quick Ticket Rebatcher tool in the same page
            newButton.addEventListener('click', function() {
                const htmlContent = `
                    <div class="container">
                        <h2>Quick Ticket Rebatcher</h2>
                        <textarea id="ticketList" placeholder="Paste your list of tickets here, one per line..." rows="10"></textarea>
                        <input type="number" id="batchSize" placeholder="Enter batch size" />
                        <button id="toggleBatchType" class="toggle-btn">Use Letters for Batch Numbers (up to 26 batches)</button>
                        <button id="rebatchButton">Rebatch Tickets</button>
                        <h3>Batch Output:</h3>
                        <textarea id="batchOutput" readonly rows="10"></textarea>
                        <button id="copyButton">Copy to Clipboard</button>
                        <button id="resetButton">Reset</button>
                        <div id="warningMessage" class="warning" style="display: none;">
                            Warning: Batching with letters is only available for up to 26 batches. The numbering has been switched to numbers.
                        </div>
                    </div>
                `;

                document.body.innerHTML = htmlContent;

                // Event listeners for buttons
                document.getElementById('toggleBatchType').addEventListener('click', toggleBatchType);
                document.getElementById('rebatchButton').addEventListener('click', rebatchTickets);
                document.getElementById('copyButton').addEventListener('click', copyToClipboard);
                document.getElementById('resetButton').addEventListener('click', resetFields);

                // Set the initial button color immediately after the page loads
                updateToggleButton();
            });

            // Insert the button container above the table
            table.parentNode.insertBefore(buttonContainer, table);
        } else {
            console.error("Table not found.");
        }
    });

    let useLetters = false;

    // Function to update toggle button color based on the useLetters state
    function updateToggleButton() {
        const toggleButton = document.getElementById('toggleBatchType');
        if (useLetters) {
            toggleButton.textContent = 'Use Letters (up to 26 batches)';
            toggleButton.style.backgroundColor = '#007bff'; // Blue for letters
        } else {
            toggleButton.textContent = 'Use Numbers';
            toggleButton.style.backgroundColor = '#28a745'; // Green for numbers
        }
    }

    function toggleBatchType() {
        useLetters = !useLetters;
        const toggleButton = document.getElementById('toggleBatchType');
        toggleButton.classList.toggle('active', useLetters);

        updateToggleButton();
    }

    function rebatchTickets() {
        const ticketList = document.getElementById('ticketList').value.trim().split('\n');
        const batchSize = parseInt(document.getElementById('batchSize').value.trim());

        if (ticketList.length === 0 || isNaN(batchSize) || batchSize <= 0) {
            alert('Please provide a valid list of tickets and batch size.');
            return;
        }

        let batches = [];
        for (let i = 0; i < ticketList.length; i += batchSize) {
            batches.push(ticketList.slice(i, i + batchSize));
        }

        if (useLetters && batches.length > 26) {
            useLetters = false;
            document.getElementById('warningMessage').style.display = 'block';
            document.getElementById('warningMessage').style.color = 'red';  // Set warning text to red
            document.getElementById('warningMessage').textContent = 'Warning: Batching with letters is only available for up to 26 batches. The Labelling has been switched to numbers.';
            document.getElementById('toggleBatchType').textContent = 'Use Numbers';
            document.getElementById('toggleBatchType').style.backgroundColor = '#28a745'; // Change to green when using numbers
        } else {
            document.getElementById('warningMessage').style.display = 'none';
        }

        let output = '';
        batches.forEach((batch, index) => {
            let batchLabel = useLetters ? String.fromCharCode(65 + index) : index + 1;
            output += `${batchLabel}\n`;
            batch.forEach(ticket => output += `${ticket}\n`);
        });

        document.getElementById('batchOutput').value = output.trim();
    }

    function copyToClipboard() {
        const outputText = document.getElementById('batchOutput').value;
        navigator.clipboard.writeText(outputText)
            .then(() => alert("Batch output copied to clipboard!"))
            .catch(err => alert("Failed to copy text: " + err));
    }

    function resetFields() {
        document.getElementById('ticketList').value = '';
        document.getElementById('batchSize').value = '';
        document.getElementById('batchOutput').value = '';
        document.getElementById('warningMessage').style.display = 'none';
    }
})();
