// ==UserScript==
// @name         SFDC Case
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add functionality to the Entitlement Button and to the Search Location Button and add button to open new task.
// @author       Emanuel Farinha
// @match        https://hp.my.salesforce.com/*?nooverride=1&isdtp=vw*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428426/SFDC%20Case.user.js
// @updateURL https://update.greasyfork.org/scripts/428426/SFDC%20Case.meta.js
// ==/UserScript==

// SALESFORCE Cases
'use strict';

// all inputs
const entitlementButton = document.querySelector('input[name="entitlement"]')
const searchLocationButton = document.querySelector('input[name="account_update"]')
const caseId = window.location.pathname.replace("/", "")
let accountId = "";
let assetLocation = "";
// without this , if case dont have account assigned can throw a error
if(document.querySelector(".efhpFieldValue")){
    accountId = document.querySelector(".efhpFieldValue").children[0].href.replace("javascript:srcUp(%27%2F","").replace("%3Fisdtp%3Dvw%27);", "")
}


// create button for entitlement
entitlementButton.onclick = () => {
    window.open(`https://hp--c.visualforce.com/apex/GSDCSCEntitlementlightningPage?entitleCaseId=${caseId}`, "_blank")
}

// creation of search location button
document.querySelectorAll('.helpButton').forEach((el) => {
    if (el.innerText === "Asset Location"){
        // without this , if case dont have asset location assigned can throw a error
        if (el.parentElement.nextSibling.children[0].children[0]){
        assetLocation = el.parentElement.nextSibling.children[0].children[0].href.replace("javascript:srcUp(%27%2F", "").replace("%3Fisdtp%3Dvw%27);", "")
        }
    }
})
// create button for search location
searchLocationButton.onclick = () => {
    window.open(`https://hp--c.visualforce.com/apex/GSDCSCAccountLocationSearch?LocId=${assetLocation}&AccountId=${accountId}&id=${caseId}`, "_blank")
}

// create button for New Task to easy access
const newBOT = document.createElement("input");
newBOT.classList.add("btn")
newBOT.value = "New Task"
newBOT.title = "New Task"
newBOT.onclick = () => {
    window.open(`https://hp.my.salesforce.com/00T/e?who_id=${accountId}&what_id=${caseId}&isdtp=vw`, "_blank")
}
// put button on html
document.querySelector("#topButtonRow").insertBefore(newBOT, entitlementButton)
