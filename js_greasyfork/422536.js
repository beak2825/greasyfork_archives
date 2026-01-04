// ==UserScript==
// @name         Estate Agent Mug Helper
// @namespace    hardy.estate.mug
// @version      0.1
// @description  Shows if it is profitable to mug someone with Estate Agency Listing
// @author       Hardy [2131687]
// @match        https://www.torn.com/properties.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422536/Estate%20Agent%20Mug%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/422536/Estate%20Agent%20Mug%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let merits = 10;
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function getMugAmount(cashOnHand) {
        let mugPercent = 5 +((5*(5*parseInt(merits)))/100);
        let mugAmount = Math.floor((cashOnHand * mugPercent)/100);
        return mugAmount;
    }
    function addPropertyInfo() {
        let area = document.querySelector(".market-table");
        if (area) {
            let listings = area.querySelectorAll(".icons .odd");
            for (const listing of listings) {
                let nodeList = listing.querySelector(".confirm-info").children;
                let sellValue = parseInt(nodeList[2].innerText.split("$")[1].replace(/,/g, "").replace(/\s/g, ""))*0.75;
                let cost = parseInt(listing.querySelector(".expander-info .cost").innerText.split("$")[1].replace(/,/g, "").replace(/\s/g, ""));
                let mug = getMugAmount(cost);
                let profit = mug + sellValue - cost;
                nodeList[0].innerHTML = `<span class="bold">Profit: </span>$${formatNumber(profit)}`;
                if (profit >= 1500000) {
                    listing.classList.add("profitable");
                }
            }
        }
    }


    $(document).ajaxComplete((event, jqXHR, ajaxObj) => {
        if (ajaxObj.data) {
            if (window.location.href.includes("properties.php?step=sellingmarket") && ajaxObj.data.includes("step=sellingMarket")) {
                addPropertyInfo();
            }
        }
    })
GM_addStyle(`
.profitable {background-color: #a4eca4;}
`);
})();