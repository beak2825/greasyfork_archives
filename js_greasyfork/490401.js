// ==UserScript==
// @name         csv
// @namespace    http://tampermonkey.net/
// @version      2
// @description  download csv of auction wins
// @author       Indochine
// @match        *https://www.torn.com/page.php?sid=events*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490401/csv.user.js
// @updateURL https://update.greasyfork.org/scripts/490401/csv.meta.js
// ==/UserScript==

(function() {
    const apiKey = "*api here*"; // add api here

    async function fetchAndDownloadCSV() {
        try {
            const response = await fetch(`https://api.torn.com/user/?selections=log&log=4320&key=${apiKey}`);
            if (!response.ok) {
                throw new Error("Failed to fetch data from the Torn API");
            }
            const data = await response.json();

            const csvContent = formatDataToCSV(data);

            var a = document.createElement('a');
            a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
            a.download = 'auction_data.csv';
            a.click();
        } catch (error) {
            console.error("Error fetching or downloading CSV:", error);
        }
    }

function formatDataToCSV(data) {
    let csvContent = "Log ID,Title,Timestamp,Category,Owner ID,Item ID,Item UID,Final Price\n";
    Object.keys(data.log).forEach(logId => {
        const log = data.log[logId];
        const logIdValue = log.log;
        const title = log.title;
        const timestamp = log.timestamp;
        const category = log.category;
        const owner = log.data.owner;
        const item = log.data.item[0];
        const itemId = item.id;
        const finalPrice = log.data.final_price;
        const itemUid = `'${item.uid}`;
        csvContent += `${logIdValue},${title},${timestamp},${category},${owner},${itemId},${itemUid},${finalPrice}\n`;
    });
    return csvContent;
}



    let customBtn = document.createElement("button");
    customBtn.className = "custom-button";
    customBtn.innerText = "Download Auction Logs";
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
