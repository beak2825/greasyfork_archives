// ==UserScript==
// @name         TW map arrival date time helper
// @namespace    http://tampermonkey.net/
// @version      2024-02-14
// @description  TW cz map arrival date time helper
// @author       LZ
// @match        https://greasyfork.org/en
// @match        https://*/game.php*screen=map*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487652/TW%20map%20arrival%20date%20time%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/487652/TW%20map%20arrival%20date%20time%20helper.meta.js
// ==/UserScript==
(function() {
    // Define the function to update the table with arrival times
    const updateTableWithArrivalTimes = () => {
        // Check if the arrival-date-time row already exists
        if (document.getElementById('arrival-date-time')) {
            return;
        }

        const mapPopupDiv = document.getElementById('map_popup');
        if (!mapPopupDiv) return;

        const infoContentTable = mapPopupDiv.querySelector('#info_content');
        if (!infoContentTable) return;

        const tbody = infoContentTable.querySelector('tbody');
        const lastTr = tbody ? tbody.querySelector('tr:has(table)') : null;
        if (!lastTr) return;

        const td = lastTr.querySelector('td');
        const innerTable = td ? td.querySelector('table') : null;
        if (!innerTable) return;

        const innerTbody = innerTable.querySelector('tbody');
        const innerLastTr = innerTbody ? innerTbody.querySelector('tr:last-child') : null;
        if (!innerLastTr) return;

        // Clone the last row and add an id to the newRow
        const newRow = innerLastTr.cloneNode(true);
        newRow.setAttribute('id', 'arrival-date-time');
        innerTbody.appendChild(newRow);

        Array.from(newRow.cells).forEach(cell => {
            const duration = cell.textContent.trim().split(':');
            if (duration.length === 3) {
                const [hrs, mins, secs] = duration.map(Number);
                const now = new Date();
                const arrivalTime = new Date(now.getTime() + hrs * 3600000 + mins * 60000 + secs * 1000);

                const formattedArrivalTime = `${arrivalTime.getDate().toString().padStart(2, '0')}.${(arrivalTime.getMonth() + 1).toString().padStart(2, '0')}. ${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}:${arrivalTime.getSeconds().toString().padStart(2, '0')}`;
                cell.textContent = formattedArrivalTime;

                if (arrivalTime.getHours() >= 23 || arrivalTime.getHours() < 8) {
                    cell.style.color = 'red';
                }
            }
        });
    };

    // Create a MutationObserver to observe changes and update the table
    const observer = new MutationObserver((mutationsList, observer) => {
        // Disconnect the observer to prevent an infinite loop
        observer.disconnect();

        // Update the table with arrival times
        updateTableWithArrivalTimes();

        // Reconnect the observer after modifications
        observer.observe(targetNode, { childList: true, subtree: true });
    });

    // Specify the target node and observer options
    const targetNode = document.getElementById('map_popup');
    const observerOptions = { childList: true, subtree: true };

    // Start observing the target node
    if (targetNode) {
        observer.observe(targetNode, observerOptions);
    } else {
        console.log('Target node for observer not found.');
    }

})();