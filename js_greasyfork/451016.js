// ==UserScript==
// @name         CanadaHelps fundraising donations totals
// @namespace    https://greasyfork.org/users/1
// @version      1.1
// @description  Adds total rows to the admin fundraising page, donations tab
// @author       Jason Barnabe
// @match        https://www.canadahelps.org/en/pages/*/edit/
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/451016/CanadaHelps%20fundraising%20donations%20totals.user.js
// @updateURL https://update.greasyfork.org/scripts/451016/CanadaHelps%20fundraising%20donations%20totals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let donationRoot = document.querySelector("#donations-pane h2 + table")
    if (!donationRoot) {
        return
    }

    let groupedTotals = {}
    let sum = Array.from(donationRoot.querySelectorAll("tbody tr:not(.message-row)")).forEach((row) => {
        let name = row.querySelector('.name').innerText
        let amount = parseFloat(row.querySelector('.amount').innerText.replace('$', ''))
        groupedTotals[name] ||= 0.0
        groupedTotals[name] += amount
    })

    let tfoot = document.createElement("tfoot")
    tfoot.style.borderTop = '4px solid black'

    Object.entries(groupedTotals).forEach(([key, value]) => {
        tfoot.appendChild(createFooterRow(key, value))
    })

    let totalRow = createFooterRow('TOTAL', Object.values(groupedTotals).reduce((sum, el) => sum + el))
    totalRow.style.borderTop = '4px solid black'
    tfoot.appendChild(totalRow)

    donationRoot.appendChild(tfoot)
})();

function createFooterRow(name, value) {
    let row = document.createElement("tr")
    row.appendChild(createNameCell(name))
    row.appendChild(document.createElement("td"))
    row.appendChild(createSumCell(value))
    row.appendChild(document.createElement("td"))
    return row
}

function createNameCell(name) {
    let nameCell = document.createElement("td")
    nameCell.classList.add('charity')
    nameCell.style.fontWeight = 'bold'
    nameCell.innerText = name
    return nameCell
}

function createSumCell(value) {
    let sumCell = document.createElement("td")
    sumCell.classList.add('amount')
    sumCell.innerText = "$" + value.toFixed(2)
    return sumCell
}