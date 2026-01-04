// ==UserScript==
// @name         TornPointsListing
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds point listings to the points page even when unavailable
// @author       Resh
// @match        https://www.torn.com/pmarket.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492116/TornPointsListing.user.js
// @updateURL https://update.greasyfork.org/scripts/492116/TornPointsListing.meta.js
// ==/UserScript==


// paste API Key below inside the '' (full key required for full functionality)
const API_KEY = '';


function displayError(error) {
    console.log(error);
    $('#fetchMessage').html("API ERROR - " + error).css('color', 'red');
}

function buildPointsTable(pointMarketData) {
    let listingHash = pointMarketData["pointsmarket"];

    fetch("https://api.torn.com/user/?selections=log,basic&log=5000&key="+API_KEY+"&comment=TornPointsListing")
    .then(response => {
            // indicates whether the response is successful (status code 200-299) or not
        if (!response.ok) {
            throw new Error(`Response Status: ${reponse.status}`);
        }
        return response.json();
    })
    .then(data => {
        if("error" in data) {
            displayError(data.error.error);
        } else {
            addOwnerLogInfo(listingHash, data);
        }

        let processedListings = [];

        Object.keys(listingHash).forEach(function(listingId){
            processedListings.push(
                {
                    "listingId": listingId,
                    "name" : listingHash[listingId]["name"],
                    "cost": listingHash[listingId]["cost"],
                    "quantity": listingHash[listingId]["quantity"],
                    "totalCost": listingHash[listingId]["total_cost"],
                    "self": listingHash[listingId]["self"]
                }
            )
        });

        // sort by individual point cost as that's how the original display works
        processedListings.sort(function(a, b) {
            return a.cost - b.cost;
        })

        processedListings.forEach(addTableLine)

    })
    .catch(error => displayError(error))
}


function addOwnerLogInfo(listingHash, logData) {
    let ownerName = logData["name"] + " [" + logData["player_id"] + "]";
    if(logData["log"]) {
        Object.keys(logData["log"]).forEach(function(logId){
            if (logData["log"][logId]["data"]["listing_id"] in listingHash) {
                listingHash[logData["log"][logId]["data"]["listing_id"]]["name"] = ownerName;
                listingHash[logData["log"][logId]["data"]["listing_id"]]["self"] = true;
            }
        });
    }
}

function addTableLine(listingInfo) {
    let trClass = listingInfo["self"] ? "self" : "normal";
    let ownerName = listingInfo["name"] ? listingInfo["name"] : "Someone";

    $('#pointListTableBody').append(
        `
        <tr class="` + trClass + `">
            <td class="pointd">` + ownerName + `</td>
            <td class="pointd">` + listingInfo["quantity"] + `</td>
            <td class="pointd">$` + listingInfo["cost"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
            <td class="pointd">$` + listingInfo["totalCost"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `</td>
        </tr>
        `
    )
}


(function() {
    'use strict';

    if ($('div.info-msg-cont.red').size() > 0 && $('#pointArea').size() < 1) {
        const pointTable = `
        <style>
            th, table.pointTable td.pointd {
                border: 1px solid #ddd;
                color: var(--activity-log-table-text-color);
                line-height: 12px;
                vertical-align: middle;
                height: 30px;
            }
            th {
                font-weight: 700;
                background: var(--default-panel-gradient);
            }
            table.pointTable tr.normal td.pointd {
                padding: 0 9px;
                background: var(--default-bg-panel-color);
            }
            table.pointTable tr.self td.pointd {
                padding: 0 9px;
                background: rgba(110, 160, 55, 0.5);
            }
        </style>
        <br/>
        <div id="fetchMessage" style="font-size: 20px;">Fetching points info...</div>
        <br/>
        <table id="pointTable" class="pointTable" style="width:100%">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Points</th>
                    <th>Cost Each</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody id="pointListTableBody">

            </tbody>
        </table>`;
        $('div.content-wrapper[role="main"]').append(pointTable);

        fetch("https://api.torn.com/market/?selections=Pointsmarket&key="+API_KEY+"&comment=TornPointsListing")
        .then(response => {
            // indicates whether the response is successful (status code 200-299) or not
            if (!response.ok) {
                throw new Error(`Response Status: ${reponse.status}`);
            }
            return response.json();
        })
        .then(data => {
            if("error" in data) {
                displayError(data.error.error);
            } else {
                buildPointsTable(data);
            }
        })
        .catch(error => displayError(error))

    } else {
        console.log("Didn't find error message");
    }
})();

