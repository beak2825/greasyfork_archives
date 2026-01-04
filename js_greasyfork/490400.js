// ==UserScript==
// @name         csv bazaar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  download csv of all bazaar sales from events page
// @author       Indochine
// @match        *https://www.torn.com/page.php?sid=events*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490400/csv%20bazaar.user.js
// @updateURL https://update.greasyfork.org/scripts/490400/csv%20bazaar.meta.js
// ==/UserScript==

(function() {
    const apiKey = "insert"; // add api here

    async function fetchAndDownloadCSV() {
        try {
            const response = await fetch(`https://api.torn.com/user/?selections=log&log=1221&key=${apiKey}`);
            if (!response.ok) {
                throw new Error("Failed to fetch data from the Torn API");
            }
            const data = await response.json();

            const csvContent = formatDataToCSV(data);

            var a = document.createElement('a');
            a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
            a.download = 'bazaar_data.csv';
            a.click();
        } catch (error) {
            console.error("Error fetching or downloading CSV:", error);
        }
    }

    function formatDataToCSV(data) {
        let csvContent = "Log ID,Title,Timestamp,Category,Buyer,Item ID,Quantity,Cost Each,Total Cost\n";
        Object.keys(data.log).forEach(logId => {
            const log = data.log[logId];
            const logIdValue = log.log;
            const title = log.title;
            const timestamp = log.timestamp;
            const category = log.category;
            const buyer = log.data.buyer;
            const itemId = log.data.item;
            const quantity = log.data.quantity;
            const costEach = log.data.cost_each;
            const totalCost = log.data.total_cost;
            csvContent += `${logIdValue},${title},${timestamp},${category},${buyer},${itemId},${quantity},${costEach},${totalCost}\n`;
        });
        return csvContent;
    }

    let customBtn = document.createElement("button");
    customBtn.className = "custom-button";
    customBtn.innerText = "Download Bazaar Logs";
    customBtn.style.backgroundColor = "#444";
    customBtn.style.color = "white";
    customBtn.style.padding = "10px 20px";

    let targetElement = document.querySelector("div.titleContainer___QrlWP > h4.title___rhtB4");
    if (targetElement) {
        targetElement.parentNode.appendChild(customBtn);
    } else {
        console.error("Target element not found.");
    }

    customBtn.addEventListener("click", fetchAndDownloadCSV);
})();
