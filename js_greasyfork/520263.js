// ==UserScript==
// @name         Approve All Timesheets
// @namespace    http://tampermonkey.net/
// @version      2024-12-07
// @description  Approvel all Siebel School timesheets with one click
// @author       Geoffrey Challen <challen@illinois.edu>
// @match        https://my.siebelschool.illinois.edu/timetracker/MyEmployees*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=illinois.edu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520263/Approve%20All%20Timesheets.user.js
// @updateURL https://update.greasyfork.org/scripts/520263/Approve%20All%20Timesheets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const approveAllTimesheets = async () => {
        const sheet = window.document.styleSheets[0];
        const newRule = sheet.insertRule('.TimesheetReviewTable { display: none; }')

        const panelBody = document.querySelectorAll(".panel-body")[0]
        const waitingSpan = document.createElement("span")
        waitingSpan.textContent = "Waiting for all timesheets to open..."
        panelBody.prepend(waitingSpan)

        try {
            const openTimeSheetLinks = Array.from(document.querySelectorAll('a[aria-label="Click to review in table."]'))
            const expectedCount = openTimeSheetLinks.length
            openTimeSheetLinks.forEach(link => link.childNodes[0].click())

            for (let i = 0; i < expectedCount * 2; i++) {
                const approveTimeSheetButtons = Array.from(document.querySelectorAll('label[aria-label="tag as approve."]'))
                if (approveTimeSheetButtons.length === expectedCount) {
                    break
                }
                waitingSpan.textContent = `Waiting for all timesheets to open... (${approveTimeSheetButtons.length} / ${expectedCount})`
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            waitingSpan.textContent = "Approving all timesheets"
            const approveTimeSheetButtons = Array.from(document.querySelectorAll('label[aria-label="tag as approve."]'))
            approveTimeSheetButtons.forEach(button => button.click())

            let approvedCount = 0
            for (let i = 0; i < expectedCount * 8; i++) {
                try {
                    approvedCount = parseInt(document.getElementById("OverallSummaryWrapper").querySelectorAll("span.text-success")[0].textContent.split(" ")[0])
                } catch (err) {}
                if (approvedCount === expectedCount) {
                    break
                }
                waitingSpan.textContent = `Waiting for all timesheets to approve... (${approvedCount} / ${expectedCount})`
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        } finally {
            sheet.removeRule(newRule)
            waitingSpan.style.display = "none"
        }

    }

    const printButton = Array.from(document.getElementsByTagName("button")).filter(button => button.textContent.includes("Print"))[0].closest("div")

    const approveAllButton = document.createElement("button")
    approveAllButton.textContent = "Approve All"
    approveAllButton.classList = "btn btn-primary"
    approveAllButton.style.marginRight = "3px"
    approveAllButton.onclick = approveAllTimesheets

    printButton.parentElement.insertBefore(approveAllButton, printButton)
})();